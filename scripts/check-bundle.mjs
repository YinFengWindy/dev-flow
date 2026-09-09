import assert from 'node:assert/strict';
import { existsSync, readFileSync, readdirSync, realpathSync } from 'node:fs';
import { dirname, isAbsolute, join, relative, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const repository = resolve(dirname(fileURLToPath(import.meta.url)), '..');

export function checkBundle(directory) {
  const root = realpathSync(directory);
  const required = [
    'SKILL.md', 'agents/openai.yaml', 'LICENSE', 'THIRD_PARTY_NOTICES.md',
    'upstream-lock.json', 'references/delivery.md', 'references/execution.md',
    'references/delegation.md',
    ...['grilling', 'to-spec', 'to-tickets', 'code-review'].flatMap(name => [
      `skills/${name}/SKILL.md`, `skills/${name}/agents/openai.yaml`,
    ]),
  ];
  for (const path of required) assert(existsSync(join(root, path)), `Missing bundled file: ${path}`);
  const lock = JSON.parse(readFileSync(join(root, 'upstream-lock.json'), 'utf8'));
  assert.match(lock.commit, /^[a-f0-9]{40}$/);
  assert.match(lock.workflowReference.commit, /^[a-f0-9]{40}$/);

  let links = 0;
  function visit(directory) {
    for (const entry of readdirSync(directory, { withFileTypes: true })) {
      const path = join(directory, entry.name);
      if (entry.isDirectory()) { visit(path); continue; }
      if (!entry.name.endsWith('.md')) continue;
      const content = readFileSync(path, 'utf8');
      // The bundle authors inline Markdown links; validate them after relocation too.
      for (const match of content.matchAll(/\]\(([^)]+)\)/g)) {
        const target = match[1];
        if (/^https?:\/\//.test(target) || target.startsWith('#')) continue;
        const resolved = resolve(dirname(path), target.split('#')[0]);
        assert(existsSync(resolved), `Broken link in ${relative(root, path)}: ${target}`);
        const inside = relative(root, realpathSync(resolved));
        assert(!isAbsolute(inside) && inside !== '..' && !inside.startsWith(`..${sep}`),
          `Link escapes installed bundle in ${relative(root, path)}: ${target}`);
        links++;
      }
    }
  }
  visit(root);
  return { root, requiredFiles: required.length, links };
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  if (!process.argv[2]) {
    const manifest = JSON.parse(readFileSync(join(repository, '.codex-plugin/plugin.json'), 'utf8'));
    const metadata = JSON.parse(readFileSync(join(repository, 'package.json'), 'utf8'));
    assert.equal(manifest.version, metadata.version, 'Package and plugin versions differ');
    assert.equal(manifest.name, metadata.name, 'Package and plugin names differ');
  }
  const result = checkBundle(process.argv[2] || join(repository, 'skills/dev-flow'));
  console.log(`Bundle valid: ${result.requiredFiles} required files, ${result.links} internal links (${result.root})`);
}

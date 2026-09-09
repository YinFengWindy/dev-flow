import assert from 'node:assert/strict';
import { appendFileSync, cpSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import test from 'node:test';
import { checkBundle } from './check-bundle.mjs';

const source = fileURLToPath(new URL('../skills/dev-flow', import.meta.url));

test('the installed unit works without the surrounding repository', t => {
  const directory = mkdtempSync(join(tmpdir(), 'dev-flow-copy-'));
  t.after(() => rmSync(directory, { recursive: true, force: true }));
  const installed = join(directory, 'dev-flow');
  cpSync(source, installed, { recursive: true });
  const result = checkBundle(installed);
  assert(result.links > 0);
});

test('an installation missing a companion is rejected', t => {
  const directory = mkdtempSync(join(tmpdir(), 'dev-flow-incomplete-'));
  t.after(() => rmSync(directory, { recursive: true, force: true }));
  const installed = join(directory, 'dev-flow');
  cpSync(source, installed, { recursive: true });
  rmSync(join(installed, 'skills/to-spec/SKILL.md'));
  assert.throws(() => checkBundle(installed), /Missing bundled file: skills\/to-spec\/SKILL.md/);
});

test('a link relying on a file outside the installable unit is rejected', t => {
  const directory = mkdtempSync(join(tmpdir(), 'dev-flow-outside-'));
  t.after(() => rmSync(directory, { recursive: true, force: true }));
  const installed = join(directory, 'dev-flow');
  cpSync(source, installed, { recursive: true });
  writeFileSync(join(directory, 'outside.md'), 'Not installed with the skill.');
  appendFileSync(join(installed, 'SKILL.md'), '\n[External dependency](../outside.md)\n');
  assert.throws(() => checkBundle(installed), /Link escapes installed bundle/);
});

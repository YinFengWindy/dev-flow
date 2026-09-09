# Dev Flow

[English](README.md) | [简体中文](README.zh-CN.md)

A Codex skill bundle that carries software requests from clarification to a checked pull request, with review for changes that need it and human confirmation at key decisions.

Dev Flow routes the request, delegates implementation and required review to subagents, and resumes from the current stage. One install includes the workflow and four companion skills. Project commands, architecture, and testing conventions come from your repository's `AGENTS.md` and existing configuration.

## Workflow

```text
Request -> intent routing -> grilling -> confirm requirements
  -> spec draft -> similar-issue check -> publish spec
  -> proposed tickets -> CONFIRM BREAKDOWN
  -> publish tickets -> branch -> implementation subagent -> parent integrates + PR
  -> local checks -> CI -> review subagents if required -> fixes -> recheck
  -> finished PR -> CONFIRM MERGE -> merge
  -> verify merge -> clean up source branches
```

There are three human checkpoints:

| Checkpoint | What you confirm |
| --- | --- |
| Requirements | The intended behavior, acceptance criteria, and scope. An already approved requirement can be reused. |
| Ticket breakdown | The proposed slices and dependencies, before publishing tickets or starting their implementation. |
| Merge | The completed PR after checks, any required review, and repairs, before merging or entering a merge queue. |

After the spec draft, the agent checks the current repository's open and closed issues once for similar features. If it finds a plausible overlap, it presents links, shared behavior, and differences, then waits for you to choose reuse, extension, a separate issue, or no new issue before publishing the spec. Ticket decomposition and publication reuse that decision without a second similarity check. If the search cannot be completed, the spec draft remains unpublished.

Between checkpoints, the parent delegates code changes and local checks to an implementation agent, then verifies its diff and evidence and handles Git, PRs, and CI. When review is needed, two independent read-only agents check Standards and Spec. Repairs go back to the implementer. A changed PR head must pass fresh checks, have its review requirement reassessed, and receive a new merge confirmation.

## Subagents and Execution Context

| Role | Responsibility |
| --- | --- |
| Parent | Decisions and confirmations, issue/PR actions, branch setup, integration, commits/pushes, CI, merge, and cleanup. |
| Implementation agent | One approved unblocked ticket, its assigned files, local behavior checks, and an evidence receipt. |
| Review agents | Independent Standards and Spec findings against the same pinned diff, only when review is required. |

The default is one implementation agent at a time. The parent waits for writers to finish before Git mutations or review. Separate implementation agents need isolated worktrees and explicit ownership. Native subagents do not create new user-visible tasks. If implementation delegation is unavailable, the parent explains the local fallback; required independent review still needs actual reviewers.

Inspired by [matt-skills-with-to-goal](https://github.com/tt-a1i/matt-skills-with-to-goal), the workflow uses three lightweight records:

- `SPEC READY` identifies the final agreed source, baseline, verification approach, and pending approvals. It does not bypass ticket confirmation.
- An optional execution contract carries one approved ticket across a context boundary, separating evidenced-complete work from remaining or unverified criteria. Settled decisions are not re-interviewed.
- An execution receipt ties acceptance criteria to evidence and distinguishes `ready-for-merge`, `merged`, `partial`, and `blocked`.

Ordinary small changes stay in the current task. Handoffs are optional; no mandatory goal stage, automatic fork, messenger dependency, or model switch is added. See [delegation](skills/dev-flow/references/delegation.md) and [execution context](skills/dev-flow/references/execution.md).

## When Review Is Skipped

Small, bounded feature changes and UI-only changes skip automatic code review. UI-only work includes layout, styling, copy, icons, responsive behavior, and presentation interactions, regardless of file count. The agent records the reason for skipping review and proceeds to merge confirmation after the necessary checks and CI pass.

Changes to backend behavior, shared contracts, permissions, auth, billing, persistence, or data deletion do not become UI-only just because they touch a component. Substantive mixed changes and broad refactors still receive review. An explicit request to review always takes precedence over the exemption.

Skipping code review does not skip CI, behavior verification, UI visual/interaction checks, provider-required approvals, or your merge confirmation.

After a verified merge, the agent automatically deletes eligible remote and local source branches without another confirmation. It retains branches with new commits, dependent PRs, or active worktree use and reports pending cleanup. It never deletes the target/default/protected branch.

## Included Skills

| Skill | Role |
| --- | --- |
| [dev-flow](skills/dev-flow/SKILL.md) | Intent routing, stage coordination, confirmations, and recovery. |
| [grilling](skills/dev-flow/skills/grilling/SKILL.md) | Clarify unresolved decisions in rounds of independent questions. |
| [to-spec](skills/dev-flow/skills/to-spec/SKILL.md) | Turn agreed requirements into a specification. |
| [to-tickets](skills/dev-flow/skills/to-tickets/SKILL.md) | Propose verifiable slices and publish the approved tickets. |
| [code-review](skills/dev-flow/skills/code-review/SKILL.md) | Independently review repository standards and specification compliance. |

The four companion skills are adapted from [Matt Pocock's skills](https://github.com/mattpocock/skills). Their source revisions and modifications are documented in [source notices](skills/dev-flow/THIRD_PARTY_NOTICES.md) and [upstream-lock.json](skills/dev-flow/upstream-lock.json).

## Install

Use Node.js/npm for installation, Codex with local skills and native subagents, Git, and an authenticated issue/PR connector or CLI. Install the target project's normal dependencies separately.

Install globally with the [skills CLI](https://github.com/vercel-labs/skills), on Windows, macOS, or Linux:

```bash
npx skills@latest add YinFengWindy/dev-flow --skill dev-flow --agent codex -g
```

For a project-only installation, run the same command from that project without `-g`. This installs one self-contained `dev-flow` directory including its nested companion skills, references, and licenses. It does not install or overwrite standalone `grilling`, `to-spec`, `to-tickets`, or `code-review` entries. Keep the nested directories together; install the parent `dev-flow` skill rather than selecting a nested companion with `--full-depth`.

If you previously used a manual link or another `dev-flow` entry, inspect it and keep one active installation to avoid duplicate discovery. No npm registry publication, plugin marketplace registration, or manual repository clone is needed. The `.codex-plugin/plugin.json` manifest remains available for plugin packaging.

Start a new Codex task in your project and invoke `$dev-flow`. To test a source checkout locally, run `npx skills@latest add . --skill dev-flow --agent codex` from that checkout, or ask Codex to read its `skills/dev-flow/SKILL.md` directly.

## Examples

```text
$dev-flow Add saved searches. Help me clarify the behavior first.
$dev-flow Implement issue #42 using its approved requirements.
$dev-flow Continue the existing PR through CI and review.
$dev-flow Only draft a spec; do not publish issues or implement it.
$dev-flow Review PR #42 only; do not change code or merge.
$dev-flow Prepare an execution contract for approved ticket #42; do not implement it yet.
```

The router respects the requested stopping point. Discussion-only requests stay discussions; existing specs, issues, and PRs are reused. A status question during delivery does not restart the workflow.

## Operating Boundaries

- A skill guides an active agent task. It is not a scheduler or a background service that keeps working after the task ends.
- Missing access, required CI, or provider approvals remain explicit blockers. Agent review does not replace required human or Code Owner approval.
- CI and the review result or exemption must apply to the current PR head. Empty check lists, stale results, and unresolved blocking findings do not permit merging.
- The workflow records progress and approval state so it can resume without duplicating issues or PRs.
- Runtime tools enforce actions. These Markdown instructions do not install branch protection or guarantee that a model follows every instruction.

## Updating

For the global installation:

```bash
npx skills@latest update dev-flow -g
```

Use `-p` instead of `-g` for a project installation, then start a new Codex task. Manual checkout users can still use `git pull --ff-only`.

The bundled Matt skills are pinned to one upstream revision, not fetched from `main` at runtime. To update the bundle, compare the upstream changes, preserve the workflow's confirmation rules, update the lock and notices, and validate the skill metadata and relative links.

Maintainers can run `npm run check` and `npm test` without installing dependencies. These checks validate the self-contained bundle, relocation, and missing-file detection. The same checks run on Windows and Linux in CI.

## License

MIT. See [LICENSE](LICENSE). Bundled Matt Pocock material retains its copyright and MIT notice in [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md).

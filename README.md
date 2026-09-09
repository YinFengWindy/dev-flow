# Dev Flow

[English](README.md) | [简体中文](README.zh-CN.md)

A Codex skill bundle that carries software requests from clarification to a checked pull request, with review for changes that need it and human confirmation at key decisions.

Dev Flow routes the request, coordinates five skills, and resumes from the current stage. Project commands, architecture, and testing conventions come from your repository's `AGENTS.md` and existing configuration.

## Workflow

```text
Request -> intent routing -> grilling -> confirm requirements
  -> spec draft -> similar-issue check -> publish spec
  -> proposed tickets -> CONFIRM BREAKDOWN -> similar-issue check
  -> publish tickets -> branch -> implementation + draft PR
  -> local checks -> CI -> review if required -> fixes -> recheck
  -> finished PR -> CONFIRM MERGE -> merge
  -> verify merge -> clean up source branches
```

There are three human checkpoints:

| Checkpoint | What you confirm |
| --- | --- |
| Requirements | The intended behavior, acceptance criteria, and scope. An already approved requirement can be reused. |
| Ticket breakdown | The proposed slices and dependencies, before publishing tickets or starting their implementation. |
| Merge | The completed PR after checks, any required review, and repairs, before merging or entering a merge queue. |

There is an additional conditional checkpoint before publishing either a spec issue or a ticket: the agent searches the current repository's open and closed issues for similar features. If it finds a plausible overlap, it presents links, shared behavior, and differences, then waits for you to choose reuse, extension, a separate issue, or no new issue. Approving the requirements or breakdown does not resolve that overlap. If the search cannot be completed, the draft remains unpublished.

Between checkpoints, the agent handles technical testing decisions, implementation, CI diagnosis, and review fixes. A changed PR head must pass fresh checks, have its review requirement reassessed, and receive a new merge confirmation.

## When Review Is Skipped

Small, bounded feature changes and UI-only changes skip automatic code review. UI-only work includes layout, styling, copy, icons, responsive behavior, and presentation interactions, regardless of file count. The agent records the reason for skipping review and proceeds to merge confirmation after the necessary checks and CI pass.

Changes to backend behavior, shared contracts, permissions, auth, billing, persistence, or data deletion do not become UI-only just because they touch a component. Substantive mixed changes and broad refactors still receive review. An explicit request to review always takes precedence over the exemption.

Skipping code review does not skip CI, behavior verification, UI visual/interaction checks, provider-required approvals, or your merge confirmation.

After a verified merge, the agent automatically deletes eligible remote and local source branches without another confirmation. It retains branches with new commits, dependent PRs, or active worktree use and reports pending cleanup. It never deletes the target/default/protected branch.

## Included Skills

| Skill | Role |
| --- | --- |
| [dev-flow](skills/dev-flow/SKILL.md) | Intent routing, stage coordination, confirmations, and recovery. |
| [grilling](skills/grilling/SKILL.md) | Clarify unresolved decisions in rounds of independent questions. |
| [to-spec](skills/to-spec/SKILL.md) | Turn agreed requirements into a specification. |
| [to-tickets](skills/to-tickets/SKILL.md) | Propose verifiable slices and publish the approved tickets. |
| [code-review](skills/code-review/SKILL.md) | Independently review repository standards and specification compliance. |

The four companion skills are adapted from [Matt Pocock's skills](https://github.com/mattpocock/skills). Their source revision and modifications are documented in [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md) and [upstream-lock.json](upstream-lock.json).

## Install

Use Codex with local skills, Git, and an authenticated issue/PR connector or CLI. Subagent support is needed when independent review is required; exempt changes do not need it. Install the target project's normal dependencies separately.

Keep this entire repository together. The entrypoint loads companion skills using paths within the bundle; copying only `skills/dev-flow` is insufficient.

### macOS / Linux

```bash
git clone https://github.com/YinFengWindy/dev-flow.git ~/plugins/dev-flow
mkdir -p ~/.agents/skills
ln -s ~/plugins/dev-flow/skills/dev-flow ~/.agents/skills/dev-flow
```

### Windows PowerShell

```powershell
git clone https://github.com/YinFengWindy/dev-flow.git "$env:USERPROFILE/plugins/dev-flow"
New-Item -ItemType Directory -Force -Path "$env:USERPROFILE/.agents/skills" | Out-Null
New-Item -ItemType Junction -Path "$env:USERPROFILE/.agents/skills/dev-flow" -Target "$env:USERPROFILE/plugins/dev-flow/skills/dev-flow"
```

Use an unused clone/link destination. If a `dev-flow` entry already exists, inspect its target before replacing it. These commands link only the workflow entrypoint; existing standalone Matt skills are not overwritten. See the [official Codex skill documentation](https://learn.chatgpt.com/docs/build-skills) for discovery and symlink support.

Start a new Codex task in your project and invoke `$dev-flow`. You can also ask Codex to read the cloned `skills/dev-flow/SKILL.md` directly. A `.codex-plugin/plugin.json` manifest is included for plugin packaging; marketplace registration is not required for the linked entrypoint installation above.

## Examples

```text
$dev-flow Add saved searches. Help me clarify the behavior first.
$dev-flow Implement issue #42 using its approved requirements.
$dev-flow Continue the existing PR through CI and review.
$dev-flow Only draft a spec; do not publish issues or implement it.
$dev-flow Review PR #42 only; do not change code or merge.
```

The router respects the requested stopping point. Discussion-only requests stay discussions; existing specs, issues, and PRs are reused. A status question during delivery does not restart the workflow.

## Operating Boundaries

- A skill guides an active agent task. It is not a scheduler or a background service that keeps working after the task ends.
- Missing access, required CI, or provider approvals remain explicit blockers. Agent review does not replace required human or Code Owner approval.
- CI and the review result or exemption must apply to the current PR head. Empty check lists, stale results, and unresolved blocking findings do not permit merging.
- The workflow records progress and approval state so it can resume without duplicating issues or PRs.
- Runtime tools enforce actions. These Markdown instructions do not install branch protection or guarantee that a model follows every instruction.

## Updating

Update your clone with `git pull --ff-only` from its directory, then start a new Codex task. The linked entrypoint uses that checkout.

The bundled Matt skills are pinned to one upstream revision, not fetched from `main` at runtime. To update the bundle, compare the upstream changes, preserve the workflow's confirmation rules, update the lock and notices, and validate the skill metadata and relative links.

## License

MIT. See [LICENSE](LICENSE). Bundled Matt Pocock material retains its copyright and MIT notice in [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md).

# Delegate Implementation and Review

Use the host's native subagent tools for implementation and required code review. The parent remains responsible for the delivery outcome and verifies returned evidence against the actual workspace. Read [delivery gates](delivery.md) for CI, review eligibility, merge, and cleanup; delegation changes who performs the work, not those gates.

## Ownership

| Owner | Responsibility |
| --- | --- |
| Parent | Requirement agreement, the single similarity check after the spec draft, spec and ticket publication, ticket-breakdown confirmation, dependency selection, workspace/branch setup, issue/PR actions, commits, pushes, CI, review eligibility, merge confirmation, merge, and verified branch cleanup. |
| Implementation agent | One approved, unblocked ticket's implementation within the assigned workspace and scope; relevant local behavior checks; a concise evidence receipt. Return unresolved product decisions to the parent. |
| Review agents | Independent, read-only Standards and Spec reviews of the same pinned diff after expected CI passes, following the bundled `code-review` skill. |

Keep user-facing product decisions and confirmation questions with the parent. The implementer does not create sibling tickets, widen scope, commit, push, change branches, manage PRs, or merge. Reviewers return findings rather than editing files. Delegation does not add a confirmation checkpoint or authorize a new user-visible task, fork, automation, or goal. Use the host's configured model defaults without adding a model override or token budget.

## Assign Implementation

Default to one implementation agent at a time. Select one ticket from the approved breakdown whose blocking behavior has actually landed. Reuse a clear instruction to implement an existing ticket as its scope authorization; do not invent an additional split.

Create or select the workspace and branch before dispatch. Give the implementer these inputs:

- Ticket and agreed spec links or accessible contents, acceptance criteria, relevant user decisions, and exclusions.
- Absolute workspace path, branch, baseline SHA, applicable repository guidance, and existing dirty files to preserve.
- Owned files or module boundaries, known dependencies, and the repository's discovered verification commands.
- A direct instruction to implement and run appropriate local checks, then return evidence and any blockers without Git or tracker mutations.

Use source links and the compact [execution context](execution.md) where needed; do not repeat the entire spec or create another mandatory contract artifact. Give each agent enough fetched context to work when tracker access is unavailable in its host.

Agents can share a filesystem. Do not run concurrent writers in the same worktree, or writers against the same files through linked/shared paths. While implementation runs, the parent may do independent read-only preparation. Wait for implementation and its running commands to finish before changing the branch, staging, committing, or starting review. Parallel implementation is optional only for independent approved tickets in isolated worktrees with explicit integration ownership; the default remains one implementer.

The implementer's return should identify the ticket, workspace and baseline, changed files, acceptance criteria with concrete evidence, commands and results including failures or unrun checks, and any remaining gaps. Keep this proportional to the ticket; use the receipt guidance in `execution.md` instead of writing a second report format.

## Validate and Integrate

The parent inspects the actual diff for scope, preserved user changes, and the reported behavior. Compare returned command evidence with the resulting files and available outputs; a child's success statement alone is not verification. Run any missing repository gate or targeted check needed to resolve a gap, without repeating successful checks absent a reason.

Return incomplete acceptance criteria or concrete defects to the implementer, with the evidence and expected outcome. Use an existing agent when available; a replacement receives the current workspace state and prior findings. Once implementation and local checks are complete, the parent stages only the task's changes, commits, pushes, creates or updates the draft PR, and collects CI evidence for that head according to `delivery.md`.

## Delegate Required Review

After CI passes, classify the actual head/base diff under `delivery.md`. Small bounded features and UI-only changes skip automatic review unless the user explicitly requested it; substantive changes covered by the review rules still require it. Do not launch review agents for an exempt diff or report its exemption as a passed review.

When required, read the bundled [code-review](../skills/code-review/SKILL.md) and dispatch its two independent agents: Standards and Spec. Supply both with the same pinned base/head, repository guidance, spec/ticket, acceptance criteria, and access to the actual diff. Each returns findings on its own axis without seeing the other's conclusions first. Read-only reviewers may run concurrently once all writers have stopped.

The parent reconciles findings against code and requirements and sends actionable repairs to the implementer. After repairs, inspect the actual diff, complete local checks, commit/push, wait for CI for the new head, and reassess review eligibility. If still required, repeat the independent review with prior findings and dispositions for revalidation. An exemption does not erase an unresolved defect already found. Only the parent presents the completed PR for user merge confirmation and performs the verified merge and cleanup.

## Capability Fallback

Use actual host capabilities; naming a subagent or skill is not a tool invocation. If native implementation delegation is unavailable or fails before work starts, disclose that implementation will proceed locally and continue the authorized ticket in the parent. Preserve the same scope and verification responsibilities.

Required independent review remains pending when independent reviewers cannot be run. Complete other preparation, report that exact limitation, and do not present the review as completed or pass its merge gate. A review-exempt change can continue with the recorded exemption, normal checks, and user merge confirmation. Never create a new user-visible task, fork, or automation merely to work around missing subagent tools.

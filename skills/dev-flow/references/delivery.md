# Delivery Gates

Read this reference when developing or landing work under `dev-flow`. Apply the user's requested stopping point throughout; a review-only or CI-only entry does not inherit permission to merge.

## Branch and PR

- Fetch the relevant base and inspect the current worktree. Reuse the task's existing branch/PR. Otherwise create `codex/<ticket-or-feature-slug>` from the resolved target branch, unless the user or repo specifies another convention.
- Preserve existing work. If unrelated edits prevent a clean task diff, use a separate worktree. If the requested work depends on uncommitted user edits, account for them explicitly; do not silently omit, stage, stash, reset, or publish them. Stage only the task's changes.
- Default to one independently landable ticket per PR. Use an integration branch for tickets that genuinely cannot land green separately. Track its final integration PR and do not equate intermediate branch merges with delivery to the intended target.
- Run repo-mandated pre-commit checks before committing. Push a meaningful commit and create or update a draft PR with the concrete behavior change, verification, and spec/ticket links. Use closing references only for tickets the PR fully completes; a partial ticket PR must not close the parent feature.
- Use structured tool arguments for multiline bodies. For CLI publication, write the exact text with the available file-edit tool and pass `--body-file` (or the provider equivalent). Verify repository, base, head, URL, and returned status after creation.

## Implementation and CI

- Follow [delegation](delegation.md): the implementation subagent makes scoped code changes and runs relevant local checks; the parent verifies its diff and evidence, then handles commits, PRs, and CI. Return concrete repairs to the implementer and wait for all writers to finish before Git mutations or review.
- Implement the ticket against its acceptance criteria and repo conventions. Run checks required by the repo and meaningful tests for the affected behavior. Do not weaken a test or required check to make a gate green.
- Inspect workflows, scripts, and remote branch/ruleset requirements to determine expected CI. Required policy checks and the repo's documented delivery gates both matter, even if branch protection is absent.
- Record the pushed PR head SHA. Verify CI belongs to that head, or to the provider's corresponding PR merge candidate; a successful run on the base branch or previous head does not count.
- Account for expected checks explicitly. An empty check list, missing expected job, pending state, cancelled run, or failed run is not success. Accept skipped/not-applicable results only when the workflow's applicability rules justify them for this change. An optional neutral result cannot substitute for an expected validation job.
- If draft status prevents required CI from running, mark the implemented PR ready once local checks pass, while keeping merge gated on CI and any required review. Read failures, fix their cause, commit, and push before collecting fresh evidence.
- Use bounded polling with backoff and updates. Do not blindly rerun a deterministic failure. A rerun is appropriate for demonstrated transient infrastructure failure; repeated identical external failures require diagnosis or a concrete blocker report.

## Decide whether review is needed

After inspecting the actual PR diff, skip the automatic `code-review` stage when either exemption applies:

| Change | Review decision |
| --- | --- |
| Small feature: a bounded behavior change with local impact and straightforward acceptance criteria, such as a filter option or an existing workflow's small convenience action | Skip automatic code review. |
| UI-only: layout, styling, copy, icons, responsive behavior, or client-side presentation interactions, without changes to backend behavior or business contracts | Skip automatic code review, even when many UI files change. |
| Mixed UI and substantive non-UI changes, shared contract/architecture changes, broad refactors, or changes to permissions, auth, billing, persistence semantics, or data deletion | Run code review; a small line count or UI component location alone is not an exemption. |
| The user explicitly requests a review | Run the requested review regardless of size or UI scope. |

A mixed change may still qualify as a small feature when its entire behavior is bounded and none of the substantive cases above applies. Judge impact and behavior, not file count. Decide from repository evidence without adding a routine user confirmation. If the diff cannot be classified confidently, run review and briefly explain why.

Record `skipped: small feature` or `skipped: UI-only`, the short reason, and the head/base evaluated. Do not invoke review subagents for an exempt change or label a skipped review as passed. An exempt change needs no review subagent capability; implementation still follows the delegation policy with its disclosed local fallback. Reassess eligibility after each new commit or changed base so later backend or high-impact changes do not inherit an obsolete exemption.

Review exemption changes only this agent review stage. Run the repository's applicable checks and CI, verify the affected behavior, and keep the user merge checkpoint. For UI changes, validate the rendered result and relevant interactions using the repository's existing visual/accessibility practices. Required provider approvals and protections still apply.

## Code review after CI (when required)

1. Once expected CI passes, pin the actual PR base commit and current head SHA. Read the bundled [code-review](../skills/code-review/SKILL.md) and supply that fixed point explicitly, plus the originating spec/ticket and applicable repo standards. This prevents a redundant question about the comparison ref.
2. If `docs/agents/issue-tracker.md` is absent, pass the resolved tracker access method and fetched issue/spec directly. Missing setup prose is not grounds to invoke a nonexistent setup command or skip the spec review.
3. Follow the companion skill's independent Standards and Spec reviews using the available subagent tools. Give reviewers the same pinned diff and acceptance criteria. Preserve the two axes in the report. If independent agents are unavailable, disclose that limitation; do not report the requested independent review as completed or silently pass its merge gate.
4. Assess every finding against code and requirements. Fix real defects and material spec/standard violations within scope. Record a concrete reason for a false positive or a nonblocking style suggestion; do not treat every smell heuristic as a mandatory refactor. An unresolved correctness defect, missing acceptance criterion, or disputed blocking finding prevents presenting the PR as ready to merge.
5. After a fix, rerun the applicable local gate, push, wait for fresh CI, and reassess the updated PR diff. If review is still required, run `code-review` again and give reviewers prior findings and their dispositions for revalidation. Re-review all newly changed code; do not merely declare the old review valid. Previously identified defects still need resolution even if the narrowed final scope qualifies for an exemption.

Agent review does not substitute for a hosting provider's required human/Code Owner approval. Check both independently. Do not submit an approval on the user's behalf or bypass required external approval to satisfy the agent review stage.

## Merge

Complete all technical work before asking for merge approval. Once the following facts hold, present the concrete PR URL, source and target branches, head SHA, a concise change summary, CI results, review results or its explicit exemption, and any material consequences. Ask the user to confirm merging this PR and wait for their answer:

- The agreed scope for this PR is implemented and verified, its blockers are satisfied, and the PR targets the intended repository/branch.
- The worktree has no uncommitted task fixes, and the remote head is the exact head whose CI passed and whose review result or exemption was recorded.
- Expected CI checks for the current candidate passed. Either both required review axes completed or the current diff qualifies for a recorded small-feature/UI-only exemption. No known blocking defect or acceptance gap remains unresolved.
- Required provider approvals and review-thread policies are satisfied, the PR is ready and mergeable, and branch/ruleset requirements are met.

Requirement or ticket approval is not merge approval. Do not merge, enqueue, or enable auto-merge while the confirmation is pending. An explicit confirmation to merge the presented PR/head satisfies this checkpoint; do not ask again for that same unchanged result. For multiple PRs, obtain approval for each concrete PR, or an explicit batch approval identifying every included PR/head.

After confirmation, re-read head/base and provider gate status immediately before merging. If the head changed, restart CI, reassess review eligibility, complete any required review, and obtain new confirmation for the changed result. If the base advanced, refresh the comparison and integration evidence; update the branch when required and recheck/reassess any resulting changes. A changed integration result or material consequence requires renewed confirmation. Do not resolve unknown or conflicting gate state optimistically.

Use the provider's expected-head compare-and-merge option where available (for GitHub CLI, inspect current `gh pr merge --help` for `--match-head-commit`). Prefer the repo's configured merge method/queue; if unspecified, choose an enabled method consistent with recent project practice. Never use an admin bypass or disable protection. If a merge queue is required, follow its candidate checks and wait for an actual merged result.

Prefer a guarded immediate merge after confirmation. Do not enable persistent auto-merge that could apply the user's approval to a future head. For a required merge queue, confirm the presented PR first, retain its approved head, and verify the queue has not substituted an unapproved head. Do not report success merely because a merge command returned without error.

Query the provider to confirm `MERGED`, the destination branch, and merge commit. Verify completed ticket status and update it when authorized and necessary; only close a parent feature after all of its in-scope acceptance criteria and child deliveries are complete. Keep any auto-triggered deployment outcome distinct from the merge outcome. Do not run separate production commands unless they are authorized by the request or established project workflow.

## Delete the merged branch

The owner authorizes automatic cleanup of the delivered PR's source branch after confirmed merge. This cleanup needs no additional confirmation beyond the PR-merge checkpoint.

1. First verify the provider reports `MERGED` and record the merged PR's source repository, source branch, and head SHA. A closed unmerged PR, queued merge, or enabled auto-merge is not sufficient. Never delete the target/default/protected branch or a shared integration branch still needed by open work.
2. Check that no other open PR uses this branch as its source or base. If it still supports another ticket or stacked PR, retain it and report the dependency.
3. Delete the exact remote source branch, using an expected-head conditional deletion so a concurrent push cannot be removed. Its current tip must still match the merged PR head; retain a branch that has advanced or whose identity is uncertain. If the provider already removed it, treat cleanup as complete. Verify the remote ref is absent afterward.
4. Inspect local branch state and `git worktree list`. If the current clean worktree is on this branch, switch it to the updated target branch, or detach at the verified merge commit when the target is checked out elsewhere. Do not disturb another worktree or an active operation, discard changes, or remove worktree directories as part of branch cleanup.
5. Delete the local source branch only when no worktree still checks it out and it contains no work beyond the verified merged PR. Prefer normal merged-branch deletion. Squash/rebase merges may fail an ancestry check: use the provider's verified merged head and the local tip to establish that no extra commits would be lost before removing that exact branch. If this cannot be established, retain it and report why. Never force-delete merely to silence a warning.
6. Prune stale tracking refs for the relevant remote and verify the local/remote results. Record cleanup in the checkpoint and final outcome. A cleanup failure is reported as "merged; branch cleanup pending" and must not trigger another merge attempt.

## Blockers and recovery

- Missing credentials, unavailable required CI/review, missing human approval, or an irreducible product decision leaves the affected gate pending. Complete independent preparation and report the exact dependency.
- A network timeout after issue/PR creation or merge may mean the mutation succeeded. Query the remote state before retrying so recovery does not duplicate artifacts or misreport a merge.
- Fix/review iterations may continue while new evidence drives progress. When the same blocker persists after diagnosis, or repair requires expanding scope, stop that dependent action with evidence and a specific next step. Do not consume repeated cycles on unchanged external state.
- A revoked merge instruction, changed scope, or explicit pause takes effect immediately. Preserve a checkpoint and do not proceed under the previous stopping point.

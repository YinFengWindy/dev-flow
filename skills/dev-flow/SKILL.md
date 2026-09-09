---
name: dev-flow
description: "Route software feature requests and bug fixes through requirement clarification, specs, issues, branches, PRs, CI, code review, fixes, and merge. Use for end-to-end development or resuming this delivery workflow. Respect discussion-only, planning-only, local-only, and review-only requests."
---

# Dev Flow

Orchestrate the companion skills bundled in this plugin. Read each relative entrypoint when its stage is reached; do not claim that naming a skill executes it. Keep project commands, architecture rules, and testing requirements in the project's `AGENTS.md` and existing configuration.

| Stage | Bundled entrypoint |
| --- | --- |
| Requirement clarification | [grilling](skills/grilling/SKILL.md) |
| Spec synthesis | [to-spec](skills/to-spec/SKILL.md) |
| Ticket decomposition | [to-tickets](skills/to-tickets/SKILL.md) |
| Independent Standards and Spec review | [code-review](skills/code-review/SKILL.md) |

Prefer these bundled entrypoints over any same-named global skills. Resolve paths from the actual plugin directory, following filesystem links first. In hosts that namespace skills, select this plugin's skill identity from the catalog rather than guessing a namespace spelling. The owner's request for this composed workflow includes use of its explicit-only companion skills.

The `dev-flow` directory is the complete installable unit: its companion skills, references, and license notices travel with it. Load companions from these paths even if the host lists only the main entrypoint. Do not search a separate global install for them.

## User-selected workflow

The owner's cross-project preference has three human checkpoints: requirement agreement, ticket-breakdown approval, and final PR-merge approval. Draft the breakdown yourself, but wait for the user to confirm it before publishing its tickets or starting dependent implementation. After implementation, CI, any required review, and repairs are complete, present the actual PR and wait for merge confirmation. Technical test-plan decisions remain delegated to the agent.

After verifying the PR is merged, automatically delete its remote and local source branches under the cleanup rules in [delivery.md](references/delivery.md). The owner has authorized this cleanup; it does not add a fourth confirmation checkpoint.

Apply this preference only to work routed into delivery below. Installing or discussing this skill does not authorize delivering arbitrary project work. A request to stop at a spec, issue, local edit, PR, or review takes precedence. Between the three checkpoints, proceed with authorized issues, commits, pushes, PRs, checks, and fixes without repeated permission requests. Silence, a timeout, requirement agreement, ticket approval, and green CI are not merge approval. New product scope or a newly exposed material tradeoff returns to the user.

There is also a conditional confirmation after the spec draft: check the current repository once for similar feature issues. If plausible overlaps exist, show the candidates and wait for the user's decision before publishing the spec. Ticket decomposition and publication reuse this result without another similarity check.

## Route intent before acting

Use the latest message together with the active task, existing artifacts, and earlier decisions. Classify by requested outcome, not isolated keywords or whether the sentence is tentative. State the selected entry stage and intended stopping point in one short sentence.

| Intent and context | Entry | Stopping point |
| --- | --- | --- |
| Explain, compare, assess an idea, or discuss a possible approach without requesting execution | Answer or discuss; use `grilling` if requested | Answer or shared understanding; no delivery mutations |
| Refine a requirement, write a spec, or split tickets only | `grilling`, `to-spec`, or `to-tickets`, depending on what is missing | Requested artifact only; publish only when requested |
| Deliver a new feature with unresolved behavior | `grilling` | Merged delivery after requirement agreement |
| Deliver a clear feature or fix with agreed, verifiable acceptance criteria | Reuse the agreement; inspect the code, then spec/tickets as needed | Merged delivery; no ceremonial interview |
| Implement an existing issue or approved spec | Read it and its dependencies; fill only material gaps | Merged implementation of the requested scope |
| Continue this workflow, repair its CI, or resolve its review findings | Reconcile the current branch/PR and resume the earliest unsatisfied gate | Preserve the existing stopping point |
| Review an existing diff or PR only | `code-review` | Findings; no fixes or merge unless requested |
| Prepare a goal or handoff for an approved ticket | Compile the execution contract in [execution context](references/execution.md) | Return the contract; do not implement or launch another task |
| A standalone CI repair, local edit, or merge request | Perform the named stage with its applicable gates | The explicitly requested outcome; do not backfill an entire process |
| Status question during delivery | Report current evidence | Continue the active workflow unless the user pauses it |

An issue/PR URL identifies an artifact, not an action by itself. Inspect it and ask what outcome is wanted when context does not establish one. Ask one short routing question only when the alternatives change the scope materially. Continue independent read-only discovery while waiting. Answer in the user's language.

## Establish the project context

1. Read applicable `AGENTS.md`, contributor guidance, and relevant code. Inspect the working tree, branch, remotes, and existing issues/PRs before creating anything. Resolve the repository and target branch from evidence; do not assume `main` or `origin`.
2. Discover the tracker from `docs/agents/issue-tracker.md`, other repo configuration, the user's supplied URL, or the remote. Check available authentication and tools without exposing secrets. Missing credentials block publishing, not local drafting. Do not silently substitute local files for requested remote issues.
3. Resolve the four bundled entrypoints above. If a required file is absent, report the incomplete package and complete independent preparation. Do not silently select an unrelated global copy or pretend an ad hoc replacement ran the missing skill.
4. Supply tracker context directly when discoverable. The bundled skills do not require `/setup-matt-pocock-skills`, `/implement`, or `/tdd`; the implementation stage here follows the repository's own test practices. A slash-style skill name is not an executable shell command.

## Clarify, specify, and ticket

### Requirement agreement

Use the bundled `grilling` for unresolved user decisions. Follow its current design-tree rounds: ask the independent questions whose prerequisites are settled, recommend an answer for each, wait for feedback, then recompute the next round. Research facts from the environment, using bounded independent subagents as that skill directs. Cover the actual problem, intended users, behavior, acceptance criteria, scope exclusions, and material failure cases to the depth the change needs.

End with a concise proposed requirement and obtain agreement before delivery. An existing approved spec or a clear implementation instruction that already settles these points is sufficient; do not ask for the same agreement again. A request for full automation does not supply missing product decisions. Do not invent the user's answers to finish an interview.

### Spec

Read `to-spec` and synthesize the agreed requirement. Decide the testing approach using existing behavior boundaries; the owner has delegated this technical decision. Include observable acceptance criteria and distinguish known requirements from assumptions. Size the spec to the work without inventing scope to fill the template.

For a new feature, draft the spec, complete the single similarity check below, then publish it as the parent issue on the resolved tracker. Reuse an existing approved spec/parent. For a small fix already fully specified in an issue, use that issue as the spec and executable ticket rather than creating duplicate containers. A planning-only request remains at its requested output boundary.

### Check for similar issues after the spec draft

The `to-spec` stage owns this check. Once the spec draft is ready, search issues in the current target repository using its intended behavior, domain terms, synonyms, and affected component. Check open and closed issues, follow pagination when relevant, and read candidate bodies and relevant comments rather than judging only their titles. A closed issue may document an implemented, rejected, or unfinished attempt. If this spec already has a recorded check and resolved user decision, reuse them rather than searching again.

For each plausible overlap, present its title, URL, status, shared behavior, and material differences from the proposed issue. Recommend a path and wait for the user to choose: reuse the existing issue, extend it, create a separate scoped issue, or drop the duplicate. Do not create, modify, close, or link the overlapping issues as a substitute for that decision. Continue unrelated preparation while the affected publication is pending.

Record the search result and any user choice with the spec's scope. Carry that decision through ticket decomposition and publication without rechecking per ticket. If the user supplied an existing issue to implement, that identifies the chosen issue and does not require asking permission to reuse it. If search is unavailable or incomplete, do not claim there are no similar issues: retain the spec draft and report the missing access or results.

A material requirement expansion returns to the spec stage; it does not add a second check to ticket publication. After an ambiguous issue-creation timeout, reconcile that exact operation to avoid duplicate writes. This is operation recovery, not another feature-similarity check or user checkpoint.

### Tickets

Read `to-tickets`; draft independently verifiable slices and real blocking dependencies. Present the proposed ticket titles, delivered behavior, acceptance criteria, and blockers, then explicitly wait for the user's approval before publishing the ticket set or starting its implementation. A small change can have one ticket. Follow the companion's expand/migrate/contract approach when a broad migration cannot be sliced vertically. An already approved breakdown can be reused; material changes to its scope, granularity, or dependencies require fresh confirmation. A request to implement one existing ticket does not require inventing a new split to approve.

Once the user approves the breakdown, publish in dependency order and preserve returned identifiers. Reuse the spec-stage similarity result and user decision; do not run another similarity search before creating tickets. Use native dependency relationships when available; otherwise link blockers explicitly. Use the tracker's actual label vocabulary and do not create labels or change tracker configuration just because a template names one. During ticket publication, preserve the parent as required by `to-tickets`.

Only work tickets included in the user's agreed delivery scope. A request to implement one ticket does not authorize implementing every sibling. For an entire feature, work unblocked tickets one at a time and continue until that scope is complete. A closed blocker counts as satisfied only when the required behavior actually landed; a cancelled issue may still block its dependents.

## Develop and land

Read [references/delivery.md](references/delivery.md) when entering branch/PR creation, implementation, CI repair, review, or merge. It defines the evidence needed for each gate and how to resume after changes. Follow [delegation](references/delegation.md) to assign concrete implementation and required review to the host's native subagents.

The parent owns user confirmations, tracker actions, branch/PR setup, integration, commits, pushes, CI, merge, and cleanup. Assign one approved unblocked ticket to an implementation subagent with an explicit workspace and scope; it implements, checks behavior, and returns evidence. Validate its actual diff before integrating. When review is required after CI, dispatch independent Standards and Spec reviewers. Send needed fixes back to the implementer. Do not run simultaneous writers in a shared worktree or turn subagent delegation into a new user-visible task.

Code review is conditional: skip the automatic `code-review` stage for small, bounded feature changes and UI-only changes. Classify the actual diff using the criteria in the delivery reference. This exemption does not skip relevant checks, CI, or user merge confirmation. An explicit request to review still runs the review.

The delivery cycle is:

```text
requirement agreement -> spec draft -> similar-issue check -> publish spec
  -> proposed tickets -> USER CONFIRMS SPLIT
  -> publish tickets -> branch -> implementation subagent -> parent integrates + PR
  -> local checks -> push -> CI -> classify review requirement
  -> small feature or UI-only? skip review : independent review subagents
  -> findings? fix -> checks -> push -> CI -> reclassify/review as needed
  -> ready PR + evidence -> USER CONFIRMS MERGE -> guarded merge
  -> verify MERGED -> delete eligible remote/local source branches

similar-issue check -> plausible overlap? -> USER DECIDES before publishing
```

Create a draft PR as soon as the branch has a meaningful checked commit; do not manufacture an empty commit to create one before development. Required review follows passing CI. Every fix that changes the PR head must pass CI and have its review eligibility reassessed; run review again when the updated diff requires it.

## Resume and finish

Read [execution context](references/execution.md) when marking a final spec, transferring an approved ticket, recovering partial work, or reporting a completed delivery. Use `SPEC READY` to identify the latest agreed source. Normal work stays in this task; an execution contract is optional when crossing a context boundary, not another mandatory stage after tickets. At handoff or completion, report acceptance criteria with evidence and distinguish ready-for-merge from actually merged.

Keep a compact checkpoint at stage changes and before a handoff in the task's durable context or existing local scratch convention. Record the requested outcome and stopping point, requirement agreement, similar-issue search candidates and user decisions or pending question, the approved ticket breakdown or pending split question, source spec, ticket links/dependencies, repository/worktree, branch/base, PR URL, current head SHA, CI results/run links, reviewed head/base and findings, merge confirmation for that PR/head or its pending question, and the next action or blocker. Link authoritative artifacts instead of copying their full bodies. Keep credentials out of checkpoints.

On resume, re-read live tracker/PR/git state before trusting a checkpoint. Reuse existing artifacts and reconcile ambiguous mutations before retrying. A changed head invalidates previous head-specific CI, review evidence, and review exemption; reassess the new diff. Record either the review result or `skipped: small feature` / `skipped: UI-only` with the evaluated head/base and a short reason. A changed review base requires reassessing the diff and integration checks.

Continue within the active task while useful progress is possible. This skill is agent guidance, not a persistent scheduler: do not promise that it keeps running after the task ends, create background automations without a scheduling request, or create new user-visible tasks without an explicit request. Use bounded waits while monitoring CI and explain actual blockers with the next resumable action.

Finish with the actual outcome: relevant issue/PR links, what shipped, CI and review status, verified merge result, remote/local branch cleanup status, and any remaining blocker. Never call an enqueued merge, requested auto-merge, or green CI alone a completed delivery.

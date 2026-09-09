---
name: to-spec
description: "Turn the current conversation into a spec and publish it to the project issue tracker: no interview, just synthesis of what you've already discussed."
---

Adapted from the pinned Matt Pocock upstream version recorded in [source notes](../../THIRD_PARTY_NOTICES.md). When called by [dev-flow](../dev-flow/SKILL.md), use its agreed scope, supplied tracker/spec context, delegated technical decisions, and requested stopping point. Independent invocation retains the confirmation steps below. Reading a skill does not itself authorize publishing, fixing, or merging.

This skill takes the current conversation context and codebase understanding and produces a spec. Do NOT interview the user; just synthesize what you already know.

Use the caller's tracker context or discover it from `docs/agents/issue-tracker.md`, repository configuration, or a supplied issue URL. If the destination remains unknown, draft locally and ask only for that missing information. No separate setup skill is required. Use the actual configured label vocabulary; do not create labels merely because a template names them.

## Process

1. Explore the repo to understand the current state of the codebase, if you haven't already. Use the project's domain glossary vocabulary throughout the spec, and respect any ADRs in the area you're touching.

2. Sketch out the seams at which you're going to test the feature. Existing seams should be preferred to new ones. Use the highest seam possible. If new seams are needed, propose them at the highest point you can. The fewer seams across the codebase, the better - the ideal number is one.

Check with the user that these seams match their expectations when invoked independently. Under `dev-flow`, the owner has explicitly delegated this testing decision: choose and explain the approach, then continue.

3. Write the spec using the template below. Before publication, search the current repository's open and closed issues for similar behavior, read plausible candidates, and show their URLs, overlap, and differences to the user. Wait for the user to choose reuse, extension, a separate issue, or no new issue before acting on an overlap. A previously supplied/approved source issue or a confirmed create-timeout recovery is already identified and needs no duplicate confirmation. Missing search access is not proof of no duplicates. Publish only within the requested scope and resolved user decision. Apply the configured triage vocabulary. Do not mark a parent spec executable if the tracker distinguishes parent specs from implementation tickets.

<spec-template>

## Problem Statement

The problem that the user is facing, from the user's perspective.

## Solution

The solution to the problem, from the user's perspective.

## User Stories

A LONG, numbered list of user stories. Each user story should be in the format of:

1. As an <actor>, I want a <feature>, so that <benefit>

<user-story-example>
1. As a mobile bank customer, I want to see balance on my accounts, so that I can make better informed decisions about my spending
</user-story-example>

This list of user stories should be extremely extensive and cover all aspects of the feature.

## Implementation Decisions

A list of implementation decisions that were made. This can include:

- The modules that will be built/modified
- The interfaces of those modules that will be modified
- Technical clarifications from the developer
- Architectural decisions
- Schema changes
- API contracts
- Specific interactions

Do NOT include specific file paths or code snippets. They may end up being outdated very quickly.

Exception: if a prototype produced a snippet that encodes a decision more precisely than prose can (state machine, reducer, schema, type shape), inline it within the relevant decision and note briefly that it came from a prototype. Trim to the decision-rich parts, not a working demo, just the important bits.

## Testing Decisions

A list of testing decisions that were made. Include:

- A description of what makes a good test (only test external behavior, not implementation details)
- Which modules will be tested
- Prior art for the tests (i.e. similar types of tests in the codebase)

## Out of Scope

A description of the things that are out of scope for this spec.

## Further Notes

Any further notes about the feature.

</spec-template>

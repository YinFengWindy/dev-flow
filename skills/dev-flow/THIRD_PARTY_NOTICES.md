# Third-party skills

This plugin bundles adapted copies of four Matt Pocock skills fetched from upstream on 2026-09-09:

| Bundled skill | Original repository path |
| --- | --- |
| grilling | skills/productivity/grilling/SKILL.md |
| to-spec | skills/engineering/to-spec/SKILL.md |
| to-tickets | skills/engineering/to-tickets/SKILL.md |
| code-review | skills/engineering/code-review/SKILL.md |

Upstream: https://github.com/mattpocock/skills

Pinned source revision: [3cca18b368ae95cdbdebbff572ccafa662551015](https://github.com/mattpocock/skills/commit/3cca18b368ae95cdbdebbff572ccafa662551015), the latest `main` commit returned by the GitHub API when packaging. All four upstream entrypoints and their UI metadata were checked at that revision; `upstream-lock.json` records their source blob hashes. The license below was verified against the upstream repository.

Adaptations in this package:

- Use bundled relative links and Codex subagent tools.
- Discover the project's tracker without an external setup skill.
- Under the owner's `dev-flow` preference, delegate technical testing decisions after requirement agreement. Preserve explicit user confirmation for ticket breakdown and require a separate final PR-merge confirmation after CI and review.
- Honor planning-only boundaries and reuse existing issues.
- Check similar issues once after the spec draft and require a user decision when a plausible overlap exists. Ticket publication reuses this decision without a second search.
- Move explicit-only invocation policy to `agents/openai.yaml` for the spec and ticket skills.
- The latest upstream ticket skill no longer forces an external implementation skill or context reset. `dev-flow` owns the next delivery stage.

The latest upstream grilling behavior, design-tree rounds of independent questions with delegated fact-finding, is retained. Future updates should fetch one concrete upstream revision, review its changes, reapply the listed integration adaptations, and revalidate the bundle before changing the lock. Do not float individual skills independently to `main` at runtime.

The `dev-flow` orchestrator and delivery reference are original additions, not upstream Matt Pocock skills.

## Matt Pocock skills license

The execution-context guidance also draws on `to-spec`, `to-goal`, and `spec-executor` in [tt-a1i/matt-skills-with-to-goal](https://github.com/tt-a1i/matt-skills-with-to-goal/tree/974c932292f0c7cca6481ea8029c17a7dd91b063). Its MIT license retains the Matt Pocock copyright below. Dev Flow adapts final-spec markers, evidence-based execution contracts, and receipts. It does not import automatic fork orchestration, task messenger dependencies, unconditional review, or a mandatory goal stage. Existing user approvals and Dev Flow's split/merge checkpoints remain authoritative.

MIT License

Copyright (c) 2026 Matt Pocock

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

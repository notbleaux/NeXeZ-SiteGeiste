# Contributing to NueVue

Welcome to the NueVue monorepo. This document explains the operating model for all contributors — human and AI agent alike.

## SATOR Stub Model

The NueVue monorepo uses the **SATOR framework** (Structured Agent Task and Output Representation) to coordinate multi-agent development.

SATOR stubs are skeletal contract files that define the interface and intent of a component before implementation begins. They live in the `stubs/` directory and are **sealed contracts**:

- Existing stub files **must not be modified or deleted** by any contributor, human or agent.
- New files may be added to `stubs/` or `docs/architecture/` at any time.
- If you believe a sealed stub requires modification, open a GitHub issue tagged `sealed-stub-conflict` and stop work on the affected task. The Foreman (Claude) will coordinate resolution.

The architectural source of truth documents are:
- `NueVue_Roadmap_PR_v0.3.md` — product roadmap
- `NueVue_SATOR_Proposal_v0.1.md` — SATOR framework proposal
- `docs/architecture/sator-framework.md` — framework reference

## Branch Discipline

All work flows through the branch hierarchy described in `docs/repository/branch-model.md`. The key rules are:

1. **No direct pushes to `main`**. Use pull requests.
2. **Each agent writes only to its own proposal branch** (`claude/proposals`, `kimi/proposals`, `deepseek/proposals`, `copilot/proposals`) unless human permission is granted otherwise.
3. Proposals are merged to `agents/blackboard` only after the four-agent consensus check passes.
4. `agents/blackboard` merges to `dev`, then `dev` merges to `main` via PR with human approval.

Human contributors may work on feature branches in the standard format `feature/<description>` and open PRs directly to `dev`.

## Vis-a-Vis-ID Requirement

Every agent-authored pull request **must** include a Vis-a-Vis-ID (VVI) signature as a PR comment. The format is:

```
VVI:PR<number>:C<cycle>:<agent>:<scope>:v<version>
```

- `PR<number>` — the GitHub PR number (zero-padded to 3 digits)
- `C<cycle>` — the bootstrap cycle number (e.g. `C1` for Phase 0 bootstrap)
- `<agent>` — one of `claude`, `kimi`, `deepseek`, `copilot`
- `<scope>` — a kebab-case description of the PR scope (e.g. `bootstrap-A-K`)
- `v<version>` — the VVI version (currently `v1`)

PRs missing a VVI signature will be flagged for correction before review.

## PR Title Taxonomy

<!-- PLACEHOLDER: Claude will define the full PR title taxonomy in a follow-up PR.
     The section below is intentionally left sparse so that follow-up can fill it in
     without churn. Do not remove this comment block. -->

The PR title taxonomy follows a conventional-commits inspired format. Details will be added by Claude in a follow-up proposal. All agent-authored PRs must conform to the taxonomy once it is published.

<!-- END PLACEHOLDER: PR title taxonomy -->

## Running the Monorepo Locally

**Prerequisites:** Node.js 20 or higher (see `engines` in `package.json`).

```bash
# Install all workspace dependencies
npm install

# Run TypeScript type-checking across all workspaces (if TS files exist)
npm run typecheck
```

## Code Review

- All PRs to `main` require at least one human approval from the project owner (@notbleaux).
- Claude (Foreman) provides advisory review. Claude's approval is advisory and does not substitute for human approval.
- The CI workflow must be green before any PR can merge.

## Questions and Escalations

If you encounter a conflict with a sealed stub, an unresolvable architectural ambiguity, or any situation not covered by this document, open a GitHub issue and tag `@notbleaux`. For agent-specific escalation paths, see the relevant agent instruction file (AGENTS.md, CLAUDE.md, KIMI.md, DEEPSEEK.md, COPILOT.md).

# Contributing to NueVue

## SATOR Stub Model

NueVue uses a contract-first SATOR approach. Existing stub files are treated as sealed contracts unless explicitly reopened by the Foreman.

- Do not modify existing files under `stubs/` unless a task explicitly permits it.
- Do not modify existing files under `docs/architecture/` unless a task explicitly permits it.
- Files in `stubs/PHASE-01/` are sealed contracts for this phase.

## Branch Discipline

- `main` is protected and merge-only via pull request.
- `dev` is the integration branch.
- Agent work starts on one of the agent proposal branches: `claude/proposals`, `kimi/proposals`, `deepseek/proposals`, `copilot/proposals`.
- `agents/blackboard` receives merged proposals after four-agent consensus.

## Vis-a-Vis-ID Requirement

Every coordination PR must include the required Vis-a-Vis-ID signature comment in the prescribed format.

## PR Title Taxonomy

<!-- PR_TITLE_TAXONOMY_PLACEHOLDER_START -->
This section is intentionally reserved for Claude to define the PR title taxonomy in a follow-up PR.
<!-- PR_TITLE_TAXONOMY_PLACEHOLDER_END -->

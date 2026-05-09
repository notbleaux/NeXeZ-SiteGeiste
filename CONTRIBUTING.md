# Contributing to NueVue

## SATOR Stub Model

This repository follows a staged SATOR model where stubs are treated as contract-first artifacts.

### Sealed Contracts

- Files under `stubs/PHASE-01/` are sealed and must not be modified in bootstrap or downstream implementation PRs unless explicitly reopened by the Foreman.

## Branch Discipline

- Work from designated proposal branches.
- Integrate through reviewed PRs into `dev`, then promote to `main` through protected release PRs.
- Use `agents/blackboard` for shared collaboration artifacts.

## Vis-a-Vis-ID Requirement

- Every coordination PR must include required Vis-a-Vis-ID signatures in comments and/or prescribed metadata.
- Follow protocol updates from Claude (Foreman) as they are published.

## PR Title Taxonomy (Placeholder)

> To be defined by Claude in a follow-up PR. Keep this section heading stable to minimize churn.

- Conventional commit scopes and title classes will be documented here.
- Until then, use clear conventional-commit style PR titles.

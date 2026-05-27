---
agent: all
role: umbrella
scope: repository-wide
version: "1.0"
---

# AGENTS.md — NueVue Monorepo Agent Operating Charter

## Identity and Role

This document is the umbrella charter for all AI agents operating within the NueVue monorepo. Each agent has a dedicated instruction file (CLAUDE.md, KIMI.md, DEEPSEEK.md, COPILOT.md) that extends this charter with agent-specific rules.

The Foreman is Claude. Claude coordinates agent activity, routes proposals, and acts as the first-pass architectural reviewer. All agents defer to the Foreman on architectural decisions unless a human review overrides.

## Repository Boundaries

- **Sealed files**: Any file under `stubs/` or `docs/architecture/` is a sealed contract. Agents may add new files to these directories but may not modify or delete existing ones.
- **Agent branches**: Each agent writes exclusively to its designated branch (see branch-model.md) unless a human explicitly grants cross-branch access.
- **PR policy**: All changes merge to `main` via pull request. Direct pushes to `main` are prohibited.

## Branch Discipline

Each agent operates on its own proposal branch:
- `claude/proposals` — Claude (Foreman) architectural proposals
- `kimi/proposals` — Kimi research and Obsidian vault proposals
- `deepseek/proposals` — DeepSeek code synthesis proposals
- `copilot/proposals` — Copilot auxiliary and IDE-assisted proposals

The shared collaborative branch `agents/blackboard` receives merged proposals after four-agent consensus check. See `docs/repository/branch-model.md` for full policy.

## Vis-a-Vis-ID Protocol

Every agent-authored PR must include a Vis-a-Vis-ID (VVI) signature comment on the PR in the format:

```
VVI:PR<number>:C<cycle>:<agent>:<scope>:v<version>
```

Example: `VVI:PR001:C1:claude:bootstrap-A-K:v1`

This signature is used for audit tracing and consensus verification.

## PINR Awareness

PINR (Persona-Indexed Narrative Reference) is the internal tagging system for persona-linked content. Agents must not create PINR-tagged content outside of `packages/personas/` without Foreman approval.

## Persona Library Entry Points

All persona definitions reside in `packages/personas/`. Agents referencing persona data must import from this package. Direct inline persona definitions in application code are prohibited.

## Escalation Paths

1. If a sealed file appears to require modification → comment on the issue and stop work on that task.
2. If two agent proposals conflict → route both to `agents/blackboard`, trigger human-review lobby state.
3. If architectural ambiguity is unresolved → Claude raises a proposal on `claude/proposals` and awaits human approval before proceeding.

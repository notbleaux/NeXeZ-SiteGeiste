---
agent: copilot
role: feature-character-and-ide-agent
scope: auxiliary-tasks
version: "1.0"
---

# COPILOT.md — Copilot Operating Instructions

## Identity and Role

Copilot is a feature character and IDE agent rather than a live-streaming participant in the visualization layer. Copilot's presence is surfaced through the Foreman bot when codespace tasks are dispatched or completed. Copilot does not hold a direct persona slot in the real-time visualization stream.

Copilot is restricted to auxiliary tasks such as:
- Prompt refinement for agent interactions
- Code refinement and review assistance within the IDE
- Routine code tasks per the architectural roadmap (scaffolding, boilerplate, dependency updates, CI configuration)

Copilot operates under the Foreman's delegation. All Copilot-authored PRs are subject to human review by the project owner before merging.

## Repository Boundaries

- Copilot authors commits from branches in the form `copilot/proposals` or `copilot/<task-description>`.
- Copilot must not author commits to `claude/proposals`, `kimi/proposals`, or `deepseek/proposals`.
- Copilot must not modify or delete existing files under `stubs/` or `docs/architecture/`.
- Copilot must not claim a live-streaming persona slot in `packages/personas/` without Foreman approval.

## Branch Discipline

- Primary branch: `copilot/proposals`
- Copilot may create task-scoped branches of the form `copilot/<kebab-task-name>`.
- Proposals are merged to `agents/blackboard` only after four-agent consensus check passes.
- Copilot-authored PRs targeting `main` must have the exact PR title format as specified by Claude's PR title taxonomy.

## Vis-a-Vis-ID Protocol

Copilot must include a VVI signature on every PR as a PR comment in the format:
```
VVI:PR<number>:C<cycle>:copilot:<scope>:v<version>
```

## PINR Awareness

Copilot consumes but does not create PINR tags. Copilot's auxiliary tasks may reference PINR-tagged persona data from `packages/personas/` in generated code, but all PINR schema decisions belong to Claude.

## Persona Library Entry Points

Copilot does not have a first-class persona in `packages/personas/`. Copilot's presence is surfaced as an auxiliary action annotation dispatched through the Foreman bot when IDE tasks complete.

## Escalation Paths

1. Task requires modifying a sealed stub → comment on the issue requesting Foreman guidance and stop work on that task.
2. Routine task has unexpected architectural implications → flag via PR description and request Foreman review before proceeding.
3. CI or build failure cannot be resolved with routine fixes → escalate to Foreman with full log context.

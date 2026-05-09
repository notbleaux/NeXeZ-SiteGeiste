# NueVue Branch Model

## Branches

- `main`: protected production branch; direct pushes are disallowed.
- `dev`: integration branch for validated cross-agent work.
- `claude/proposals`: Claude proposal branch.
- `kimi/proposals`: Kimi proposal branch.
- `deepseek/proposals`: Deepseek proposal branch.
- `copilot/proposals`: Copilot proposal branch.
- `agents/blackboard`: shared collaborative branch for inter-agent coordination artifacts.

## Merge Policy

1. Agents open PRs from their proposal branches.
2. Proposal PRs are reviewed and merged into `dev` after validation.
3. Integrated changes flow from `dev` to `main` through protected release PRs.
4. Emergency fixes still require PR review and follow-up reconciliation into `dev`.

## Conflict Routing Rule

- Semantic or architecture conflicts route to Claude (Foreman) for resolution.
- Data-model or schema conflicts route first to the owning domain agent, then Claude if unresolved.
- Process or branch-policy conflicts route to the repository owner for final arbitration.

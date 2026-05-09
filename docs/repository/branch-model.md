# NueVue Branch Model

## Branches

- `main`: protected branch with PR-only merge policy.
- `dev`: integration branch.
- `claude/proposals`: Claude unique proposal branch.
- `kimi/proposals`: Kimi unique proposal branch.
- `deepseek/proposals`: Deepseek unique proposal branch.
- `copilot/proposals`: Copilot unique proposal branch.
- `agents/blackboard`: shared collaborative branch that receives merged proposals after the four-agent consensus check.

## Merge Policy

1. No direct pushes to `main`; merge to `main` only through reviewed pull requests.
2. Agent proposal work is created on each agent's unique proposal branch.
3. Proposals are merged only after four-agent consensus criteria are satisfied.
4. Consensus-approved proposals are merged into `agents/blackboard` for collaborative staging and then promoted through integration flow.

## Conflict Routing Rule

When proposals conflict, route each conflicting proposal back to the originating agent's unique branch for revision and trigger the human-review lobby state.

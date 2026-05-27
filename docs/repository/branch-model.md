# Branch Model — NueVue Monorepo

## Protected Branches

### `main`

`main` is the production-stable branch. It is protected with a PR-only merge policy:
- Direct pushes to `main` are **prohibited** for all contributors including agents.
- Every change to `main` must arrive via a pull request.
- At least one human review approval from the project owner is required before merging.
- Claude as Foreman acts as an advisory code-review approver but human approval is mandatory.
- Status checks (CI) must pass before merging.

### `dev`

`dev` is the integration branch. It receives feature-complete work from agent proposal branches and from `agents/blackboard` after the consensus check. `dev` may be merged to `main` once the integration suite passes and the project owner approves.

## Agent Unique Branches

Each AI agent has one designated proposal branch. Agents write exclusively to their own branch unless a human explicitly grants cross-branch access.

| Branch | Agent | Role |
|---|---|---|
| `claude/proposals` | Claude | Foreman architectural proposals |
| `kimi/proposals` | Kimi | Research and Obsidian vault proposals |
| `deepseek/proposals` | DeepSeek | Code synthesis proposals |
| `copilot/proposals` | Copilot | Auxiliary and IDE-assisted proposals |

Agents may create scoped sub-branches in the form `<agent>/proposals/<topic>` for isolated work streams.

## Shared Collaborative Branch

### `agents/blackboard`

`agents/blackboard` is the shared collaborative branch that receives merged proposals after the four-agent consensus check. No agent may push directly to `agents/blackboard`; proposals must arrive via PR from an agent unique branch.

The four-agent consensus check requires:
1. All four agent proposal branches have been reviewed against the proposed change.
2. No unresolved conflicts exist between proposals.
3. The Foreman (Claude) has issued a consensus-clear signal on the PR.
4. The project owner has been notified and has not raised a hold.

## Merge Policy

```
agent/proposals/<topic>
        │
        ▼  (PR + Foreman review)
  <agent>/proposals
        │
        ▼  (four-agent consensus check)
  agents/blackboard
        │
        ▼  (PR + human approval + CI green)
        dev
        │
        ▼  (PR + human approval + CI green)
       main
```

All PRs targeting `main` must follow the PR title taxonomy defined by Claude in a follow-up document.

## Conflict-Routing Rule

If two or more agent proposals conflict when merging into `agents/blackboard`:

1. **Both conflicting proposals are returned** to each agent's unique branch (they are not merged).
2. A conflict-routing comment is added to the `agents/blackboard` PR identifying the conflicting changes.
3. The **human-review lobby state** is triggered: the project owner is notified via a GitHub issue comment or PR review request.
4. Work on `agents/blackboard` for the affected scope is **paused** until the human owner resolves the conflict.
5. After resolution, each agent updates its proposal branch and the consensus check restarts from the beginning.

No agent may force-merge over a conflict. Conflict resolution authority rests solely with the human project owner and the Foreman acting under human instruction.

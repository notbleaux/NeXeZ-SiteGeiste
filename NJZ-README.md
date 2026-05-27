# NeXeZ-SiteGeiste

**Tier:** Master
**Type:** Project (Git Repository)
**Parent Portfolio:** SiteGeiste (Tier 1 — Prime)

---

## Purpose

The AI-integrated browser homepage and workspace hub. A premium User-NEXUS providing:
- Modular workspace silos (customizable layout)
- DevTools integration (direct browser API access)
- Reactive AI events (Claude, Kimi, DeepSeek API integration)
- Embedded RAT-OS modules as micro-frontends
- Workspace shell for productivity and focus workflows

## Architecture

**Hybrid Model — RAT-OS Integration:**
```
SiteGeiste Workspace Shell
├── Header / Navigation (persistent)
├── Module Grid (lazy-loaded)
│   ├── Focus Module      ← RAT-OS micro-frontend
│   ├── Soundscapes       ← RAT-OS micro-frontend
│   ├── Writing Space     ← RAT-OS micro-frontend
│   ├── Brain Training    ← RAT-OS micro-frontend
│   └── PolyCo.World      ← RAT-OS micro-frontend
├── AI Chat Sidebar       ← Kimi/Claude/DeepSeek
└── Settings / Account
```

- Shared auth token (no re-login between modules)
- PostMessage communication between shell and modules
- Independent deployability — modules can update without shell redeploy

## Integration

**Upstream:** RAT-OS (satorXrotas)
- Consumes RAT-OS modules as embedded micro-frontends
- AI agent services from RAT-OS accessible within workspace
- Shared runtime, no cold-start penalty on module switch

**Platform:** ZeSporteXte
- Analytics, identity, `@njz/ui` when published
- `@njz-os/ui` design tokens for consistent theming

## Technology Stack

- **Frontend:** Vite + React + TypeScript
- **Styling:** Tailwind CSS (shared with RAT-OS)
- **AI APIs:** Kimi, Claude, DeepSeek
- **Build:** pnpm

## Status

- **Phase:** Planning / Scaffold
- **Current State:** Documentation only (318KB)
  - `NueVue_Roadmap_PR_v0.3.md` — Product requirements
  - `NueVue_SATOR_Proposal_v0.1.md` — Architecture proposal
  - `schema_canonical_v0.1.md` — Data schema
  - `template_canonical_empty*.md` — Empty templates
- **Next Steps:** Repository bootstrap, framework implementation

## Repository

- **GitHub:** `notbleaux/NeXeZ-SiteGeiste`
- **Local:** `NJZ-BLEAUX-MOON/02-PRIME-SITEGEISTE/01-NeXeZ-SiteGeiste/`

---

**Status:** Planning — Scaffold Only | **Version:** 0.1.0 | **Last Updated:** 2026-05-27

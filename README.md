# NeXeZ-SiteGeiste

> **Your AI Workspace Hub** — Discord-inspired shell for NJZ-OS modules.

**Tier:** Prime | **Type:** SiteGeiste (Web Shell) | **Parent:** NJZ-BLEAUX-MOON

---

## Quick Start

```bash
cd 02-PRIME-SITEGEISTE/01-NeXeZ-SiteGeiste
npm install
npm run dev        # Local dev server → http://localhost:3000
npm run build      # Production build → dist/
npm run deploy     # Deploy to GitHub Pages
```

## Architecture

| Layer | Component | Purpose |
|-------|-----------|---------|
| **Shell** | `ServerSidebar` | Workspace icons (Discord-style left rail) |
| **Shell** | `ChannelSidebar` | Module list + user status per workspace |
| **Shell** | `Header` | Search, notifications, AI toggle |
| **Shell** | `ModuleGrid` | Content area for active module |
| **Shell** | `AISidebar` | Kimi AI chat panel (right) |
| **Shell** | `MobileNav` | Bottom tab bar (mobile only) |
| **Module** | `WelcomeModule` | Dashboard with quick actions & stats |
| **Module** | `FocusModule` | Pomodoro timer with progress ring |

## Design Tokens

- **Background**: Slate `#0F172A` → elevated `#1E293B`
- **Accent**: Teal `#14B8A6` (primary), Orange `#F97316` (secondary)
- **Text**: White `#F8FAFC` → muted `#94A3B8`
- **Border**: `#334155` → hover `#475569`

## Workspaces

| Icon | Name | Modules |
|------|------|---------|
| 🏠 | Home | Welcome, Focus, Tasks |
| ⚡ | RAT-OS | Soundscapes, Blocker, Writing |
| 🏆 | ZeSporteXte | (external) |
| 🎨 | NueVue | Brain Train, PolyWorld |
| ⚙️ | Settings | Preferences |

## Deployment

### Option A: GitHub Actions (Auto)
1. Push to `main` branch
2. GitHub Actions builds + deploys to `gh-pages`
3. Enable Pages in repo settings → source = GitHub Actions
4. Live at: `https://notbleaux.github.io/NeXeZ-SiteGeiste/`

### Option B: Local Deploy
```bash
npm run deploy     # Uses gh-pages CLI
```

### Option C: PowerShell (Windows)
```powershell
.\scripts\deploy.ps1
```

## RAT-OS Integration

To link the RAT-OS monorepo:
```bash
bash scripts/setup-ratos-submodule.sh
```

This creates a vendor symlink so SiteGeiste can import from `@njz-os`.

## Mobile

- Bottom nav bar replaces sidebars below `md` breakpoint
- Collapsible sidebars render as overlay sheets
- Touch-friendly targets (min 44px)
- Responsive via `useMediaQuery('(max-width: 768px)')`

---

**Stack**: Vite + React 18 + TypeScript + Tailwind CSS + Lucide Icons

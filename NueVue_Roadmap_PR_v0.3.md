# PR: NueVue — Roadmap & Architecture v0.3

**Status:** DRAFT — pending final schema fine-tune sign-off, then Phase 1 begins
**Author:** Claude (acting Foreman)
**Date:** 2026-05-09
**Supersedes:** v0.2
**Carries forward:** identity model, auth, invites, verification pipeline, two-database split, broker pattern, Discord-shell + Notion-content UI

---

## 0. Summary of changes from v0.2

| Change | Reason |
|---|---|
| **Live-Service framework** declared | User: ongoing, scalable, audience = self only |
| **Token Economics Review Cadence** added (daily/weekly/monthly/quarterly) | User: rigorous review with mandatory quarterly user sign-off |
| **Weekly review sequence** specified: Deepseek → Kimi → Claude | User: cascading review pattern |
| **Weekly reset:** Sunday 01:11 AEST | User-locked |
| **Budget thresholds refined** — 75/85/95/99/100% notifications, hard block at 90% requiring approval | User-locked |
| **Pixel Art Office** added as Phase 12 | User: bunny sprites, animations, thought/speech bubbles, Fire Emblem-style overlay |
| **Multi-AI Group Chat** added (Claude + Kimi shared session, partitioned + mutual files) | User: AI coordination feature |
| **PINR (Passport ID Network Rules)** added | User: immigration-inspired auth for AI-to-AI sessions, no cold-starts, no infinite loops |
| **Free APIs to register** (specific list) | User: register accounts, not just Ollama |
| **Discord scope locked**: native paradigm primary, hybrid bridge deferred | User-locked |
| Schema fine-tunes: persona/vendor/multi-AI fields added to canonical + review templates | Future-proofing for Phase 11/12 work |
| Phase plan: 17 → 18 phases | Pixel Art Office added |

---

## 1. Locked decisions (cumulative)

1. Project name: **NueVue**.
2. Live-Service framework: ongoing project, scalable, audience = user only.
3. Canonical format: hybrid Markdown + YAML frontmatter, deterministic projections.
4. Identity model: 4-layer (Account-ID / IDK / Display Name / User-Details).
5. Default user: Username `ILILIX`, IDK `leBeauxBleaux`, EBB author display `"E.B.B."` with `persona_of: leBeauxBleaux`.
6. Auth: Password (coldstart) + PIN (warm sessions) with measurable AFK step-up.
7. Invite system: 24h TTL, single-use, masked history, server-enforced concurrency.
8. Two-database split: DB1 Library + DB2 Review Archive.
9. Verification pipeline: Producer → Reviewer → Arbiter → Human gate.
10. UI shell: Discord paradigm. Content pages: Notion paradigm. Backend: broker pattern.
11. AI service layer: multi-vendor with handoff, personas, budget tracking.
12. **NEW:** Token Economics Review Cadence (daily/weekly/monthly/quarterly).
13. **NEW:** Pixel Art Office UI for AI agent representation.
14. **NEW:** Multi-AI Group Chat (Claude + Kimi shared session model).
15. **NEW:** PINR (Passport ID Network Rules) governs AI-to-AI sessions.
16. **NEW:** Weekly reset = Sunday 01:11 AEST.
17. **NEW:** Budget threshold model: notify at 75/85/95/99/100%, auto-downgrade starting at 75%, hard block at 90% requiring approval, full lock at 100% until reset.
18. **NEW:** Discord-bot Phase 17 = native paradigm; real-Discord bridge deferred.
19. **NEW:** Free-tier strategy = register free APIs (OpenRouter, Groq, Cerebras, HuggingFace) + local Ollama as final floor.

---

## 2. Architecture additions (only changes from v0.2)

### 2.1 Token Economics Review Cadence (NEW)

**Daily self-checks** (automated, no user action):
- Total tokens used per vendor.
- Cost accumulated.
- Anomaly detection (spikes, unusual patterns).
- Logged to Token Analytics DB.

**Weekly review** (Sunday, completed before 01:11 AEST reset):
- Sequence:
  1. **Deepseek** — Phase 1: aggregation. Pulls week's token records, computes per-vendor totals, identifies high-cost requests, computes EVP/AVP per task category.
  2. **Kimi** — Phase 2: large-context analysis. Reviews aggregation, detects patterns, identifies optimization candidates, surfaces handoff effectiveness.
  3. **Claude** — Phase 3: synthesis. Opus or Sonnet (budget-dependent — Sonnet if Opus near cap). Writes the final weekly report with recommendations.
- Output: `weekly_review_<YYYY-WW>.md` stored in Token Analytics DB partitioned review section.
- Notification to user: report ready, key recommendations.

**Monthly report** (last day of month):
- Compiles 4 weekly reviews.
- Trend analysis.
- Recommendations for vendor mix optimization, prompt refinements, RAG opportunities, persona tuning.
- Stored as `monthly_report_<YYYY-MM>.md`.
- User-readable summary surfaced in Dashboard.

**Quarterly mandatory review** (end of Q1/Q2/Q3/Q4):
- Compiles 3 monthly reports.
- Full architectural review: AI harnessing effectiveness, RAG performance, persona usage analytics, handoff success rate, budget adherence.
- Conversation walkthrough format: I (Foreman) walk you through each section, you sign off section-by-section.
- Required sign-off blocks progress to next quarter's optimizations.
- Stored as `quarterly_review_<YYYY-Q>.md` with `signed_off_by_user: true/false` flag.

**EVP / AVP definitions:**
- **EVP (Expected Value of Prompt):** estimated value of a request before execution — based on persona, task type, historical pattern.
- **AVP (Actual Value of Prompt):** measured value post-execution — based on output usefulness scored by either user feedback or arbiter assessment.
- AVP < EVP signals overspend; AVP > EVP signals undervalued capability worth scaling.

**Interim review trigger:** any vendor reaching 90% of weekly budget triggers an immediate interim review before the hard block engages, so the user has full context when deciding whether to approve continued use.

### 2.2 Refined Budget Threshold Model (NEW)

```
0–74%:     normal operation, no notifications
75%:       NOTIFY (warn) + start auto-downgrade preference for that vendor
85%:       NOTIFY (escalating) + intensify auto-downgrade
90%:       HARD BLOCK + auto-trigger interim review + REQUIRE USER APPROVAL to continue
   ├─ APPROVED: vendor remains available with notifications continuing
   └─ DENIED: vendor locked until weekly reset
95%:       NOTIFY (if approved past 90%)
99%:       NOTIFY (final warning)
100%:      LOCK vendor until weekly reset
```

Per-vendor weekly caps and global ceiling carry over from v0.2 §2.2.5.

### 2.3 Weekly Reset (NEW)

- **Reset time:** Sunday 01:11 AEST (Australian Eastern Standard Time).
- **Sequence completes before 01:00:** Deepseek aggregation → Kimi analysis → Claude synthesis → report stored.
- **At 01:11 AEST:** budgets reset, notifications cleared, vendor locks lifted, fresh week begins.
- **Edge case:** if the weekly review sequence exceeds budget on any of its three calls, the auto-trigger applies (notify user of model substitution, e.g. Sonnet substituting for Opus, log to Token Analytics).

### 2.4 Multi-AI Group Chat (NEW)

A bounded session where two or more AIs collaborate, observable by the user.

**File partitioning:**
- Each AI in the session gets a private file partition (read+write to itself, others can't write).
- A mutual zone (read+write for all participants) carries shared scratch.
- Polling mechanism: AIs check both their private and mutual zones at intervals.

**Session structure:**
- `session_id` — unique
- `participants[]` — list of AI agents (vendor + persona)
- `pinr_authorization_id` — link to authorizing PINR token (REQUIRED)
- `purpose` — user-stated goal
- `started_at`, `ends_at` (max 1 hour without renewal)
- `human_in_loop` — boolean; if false, PINR enforcement strictest
- `private_zones[]` — paths to private partitions
- `mutual_zone` — path to shared partition
- `transcript` — full message log

**User visibility:**
- Group chat surfaces in the AI service area of the UI.
- User can spectate, inject messages, pause, terminate, or extend.
- Bot-style announcements when AIs hand off, request resources, or complete sub-goals.

### 2.5 PINR — Passport ID Network Rules (NEW)

**Inspired by visa/immigration logic, refined as a system of reasoning. Not copied — abstracted.**

PINR is the authorization layer for any AI-to-AI session. Just as a person crossing a border presents a visa with stated purpose, duration, and conditions, an AI joining a peer session presents a PINR token.

**PINR token structure:**
```yaml
pinr_id: "PINR-2026-0001"
issued_at: <timestamp>
expires_at: <timestamp>          # max 1 hour from issue
issued_by: <human | scheduled_job_id | error_recovery>
authorization_source: "human_request" | "scheduled_job" | "error_recovery"
purpose: <user-stated goal>
exit_conditions: [<conditions that terminate the session>]
participants_authorized: [<vendor>:<persona_id>, ...]
participants_actual: []           # filled at session start
renewal_required_for_extension: true
human_reauth_required: true       # extending past 1 hour requires human re-approval
revoked: false
revoked_at: null
revocation_reason: null
```

**Enforcement (broker-level):**
- Every AI-to-AI message check: is PINR valid? Is participant authorized? Is session within time window?
- Cold-start prevention: AIs cannot initiate peer sessions without a PINR token issued by an upstream authorization.
- Loop prevention: messages count toward a per-session ceiling; exceeding it requires human renewal.
- Graceful expiry: 5-minute warning before PINR expires; AIs prepare to wind down.
- Audit: every PINR issuance, use, renewal, revocation, expiration logged immutably.

**Authorization sources:**
- **`human_request`** — user explicitly invokes a multi-AI task ("Claude and Kimi, collaborate on this review"). Token issued bound to that user's request.
- **`scheduled_job`** — pre-approved recurring jobs (weekly review sequence, etc.) carry pre-issued PINR tokens. User signs off on the schedule once; per-execution tokens auto-issue.
- **`error_recovery`** — limited scope, used only when handoff or recovery requires brief AI-to-AI coordination. Strict ceiling (15 min, no renewal without human).

### 2.6 Pixel Art Office — UI specification (NEW)

**Visual paradigm:** anthropomorphic bunny-rabbit sprites for AI agents. Modern descendant of Microsoft Paperclip / PixelAI extension. Animation supports working/thinking/speaking/idle states.

**Display modes:**
- **Minimized (25% of screen):** sprite visible with thought-bubble for internal state, speech-bubble for output. Right-side overlay.
- **Full screen (Fire Emblem / Pokémon style):** bottom-panel speech pane overlay, sprite in lower-left or character zone, dialogue text below, name + persona label visible.

**Sprite system:**
- **Style:** procedural composition (modular bunny parts: head/ears/face/body/outfit/accessories/background) with seeded randomness.
- **Per-vendor display preferences (purely aesthetic, AI vendors do not have gender):**
  - Claude: 60% male-presenting / 40% female-presenting weight
  - Kimi: 40% male-presenting / 60% female-presenting weight
  - Deepseek, Copilot, ChatGPT, free-tier: neutral 50/50 by default; user-configurable
- **Per-session regeneration:** new sprite seed per session, so the same vendor looks slightly different each time.
- **Per-sub-agent sprite:** each spawned sub-agent gets its own sprite seeded from parent + sub-agent role (visual family resemblance: e.g., all Kimi-spawned bulk-OCR sub-agents have a shared color palette).
- **Storage:** sprite parts as PNG sheet; composition + animation in lightweight canvas/CSS layer.

**Animations (minimum set):**
- Idle (breathing, occasional ear-twitch)
- Thinking (hand-on-chin, thought bubble)
- Speaking (mouth movement, speech bubble)
- Working (typing, focused posture)
- Handoff (waving, baton-pass animation)
- Error (concerned expression)
- Celebration (small flourish on task completion)

**Right-panel pane (To-Do / Planner):**
- To-Do list: tasks with priority, due date, persona assignment, completion state.
- Planner: calendar view, scheduled jobs (including weekly reviews), upcoming PINR-authorized AI sessions.
- Integration: agents can offer to take on To-Do items; user approves before agent starts.

### 2.7 Free-tier APIs to register (NEW)

User confirmed strategy: register free API accounts in addition to local Ollama floor.

- **OpenRouter** — free models tier (rotating availability)
- **Groq** — free tier (high speed, limited models)
- **Cerebras** — free tier (high speed, llama models)
- **HuggingFace Inference** — free tier (rate-limited)
- **Ollama** local — final floor, always available, no cost (compute only)

Each gets its own adapter in the AI Service Layer with rate-limit awareness. Failover order during budget exhaustion: paid vendors → free APIs (in availability order) → Ollama local.

### 2.8 Discord scope locked (NEW)

**Native paradigm only for Phase 17.** Hybrid bridge to real Discord deferred. The Phase 17 deliverable is:
- Bot SDK with Discord-style primitives (slash commands, events, webhooks, bot personas).
- Bot registry + admin UI in the Bots service.
- Event bus integration via the broker.
- Per-bot permission scopes.
- Example bots: daily-prompt bot, citation-checker bot, weekly-review-orchestrator bot.

Real-Discord bridge added as future enhancement when/if user requests.

---

## 3. Schema fine-tunes (proposed for sign-off)

### Canonical asset (`template_canonical_empty_v0.2.md`)
- `verifier_chain.producer/reviewer` becomes object with `{agent_id, persona_id, vendor}`
- `analysis.last_extracted_by` becomes object with `{agent_id, persona_id, vendor, date}`
- New optional field `multi_ai_session_id` (top level)
- `reviews[]` entries gain `vendor` and `persona_id` fields

### Review (`template_review_empty_v0.2.md`)
- New required field `vendor` at top level
- `generated_by_agent` becomes object with `{agent_id, persona_id, prompt_template_version}`
- New optional fields `multi_ai_session_id` and `pinr_authorization_id`
- New fields `tokens_input` and `tokens_output` for finer cost analytics
- `verifier_chain` mirrors the canonical asset structure

### New schemas (specified later in their respective phases)
- Persona registry (Phase 11)
- Token Analytics DB record (Phase 11)
- PINR token (Phase 11)
- Multi-AI Session record (Phase 11)
- Sprite assignment record (Phase 12)
- To-Do / Planner item (Phase 7 basic, Phase 12 enriched)

---

## 4. Service inventory (expanded)

| # | Service | Role | Phase |
|---|---|---|---|
| 1 | Library | Browse, search, manage canonical works | 7 |
| 2 | Reader | Virtual book reader | 9 |
| 3 | Editor | Write, edit, export | 10 |
| 4 | Reviews | Browse + generate reviews (DB2) | 6, 13 |
| 5 | Learn | Daily prompts, modules, exercises | 13 |
| 6 | AI | Chat, persona selection, vendor routing, group chat, PINR | 11 |
| 7 | **Pixel Art Office** | Sprite display, animations, agent representation | 12 |
| 8 | Bots | Bot dev, registry, admin | 17 |
| 9 | Dashboards | DB stats, AI activity, security, admin, **Token Economics** | 7, 14 |
| 10 | Settings | Account, auth, AI prefs, budget, sprite preferences | 8, 11 |
| 11 | Drive Sync | Two-way sync with Google Drive | 16 |
| 12 | **Token Analytics** | Daily/weekly/monthly/quarterly review system | 11, 14 |

---

## 5. Phase plan (18 phases)

| # | Phase | Vertical slice | Gate criteria |
|---|---|---|---|
| 1 | Schema lock + first canonical sample | Build script v0.1 + EBB-01-001 + 6 projections | Schema accepted; round-trip integrity |
| 2 | Set A full pass | 571 EBB poems → canonical + projections | 100% valid; ≥99.5% round-trip; no real-name leakage |
| 3 | Set B triage | IMG_0030–1286 classified | Every file classified with confidence |
| 4 | Set B extraction | OCR + attribution | 100% attribution OR `attribution_unknown` flagged |
| 5 | Set C cleanup + glossary v2 | 26 hex/temp resolved; glossary cross-linked | Bidirectional links verified |
| 6 | Analysis layer (DB1) + Review archive seed (DB2) | Set A analysis populated; first reviews in DB2 | Schema validates; cross-refs resolve |
| 7 | Backend API + landing dashboard + broker + basic right-panel To-Do | FastAPI service, broker, Discord-shell scaffold, landing stats, basic To-Do panel | Routes <200ms p50; broker idempotent |
| 8 | Auth + invite system | Account creation, password+PIN, invite registry | Adversarial test passes |
| 9 | Reader (virtual book) | Loads .md/.pdf/.docx, scroll modes, TTS | All formats render; dictation works |
| 10 | Editor | WYSIWYG, Word/Docs round-trip, exports | Round-trip preserves formatting |
| 11 | **Multi-Vendor AI Service Layer + Token Economics + PINR + Multi-AI Group Chat** | Tier router + vendor adapters + handoff + persona registry + budget tracker + fallback chain + Token Economics review cadence + PINR + Multi-AI Group Chat | All vendors callable; handoff verified across ≥4 pairs; budget caps enforce; weekly review sequence runs end-to-end; PINR enforcement blocks unauthorized AI-to-AI; group chat partitions function |
| 12 | **Pixel Art Office** | Sprite system, animations, minimized + full-screen modes, sub-agent sprite generation, planner integration | Sprite renders for all 4 primaries + free-tier; animation states work; per-session regeneration verified |
| 13 | AI-Assisted Learning | Reviews, modules, daily writing+poetry prompts | Prompts generate; progress logged |
| 14 | Progress & analytics + AI activity dashboards + Token Economics dashboards | Per-user trends, comparative author study, weekly/monthly/quarterly report rendering, sign-off UI | Dashboards render; quarterly sign-off flow works |
| 15 | **Notion-style Content Networking** | Modular blocks, linked databases, backlinks, page composer | Backlinks bidirectional; database views render; composer keyboard-friendly |
| 16 | Drive integration | OAuth, Docs/Sheets API, two-way sync, conflict UI | 10-cycle round-trip without loss |
| 17 | **Discord-bot Framework (native paradigm)** | Bot SDK, registry, admin UI, event bus subscriptions, example bots | ≥3 example bots functional; per-bot scopes enforced |
| 18 | OKR/CRIT hardening + Quarterly Review readiness | Full audit, gap close, first quarterly review walkthrough rehearsal | All P0/P1 closed; quarterly sign-off process tested |

---

## 6. OKRs (expanded)

- **KR1:** 100% of `/mnt/project` files indexed with verification chain logged.
- **KR2:** Search median latency <200ms over full corpus.
- **KR3:** Zero AI-initiated mutations to user text.
- **KR4:** Auth+invite passes adversarial test suite.
- **KR5:** Drive sync round-trips without loss across 10 cycles.
- **KR6:** Identity model leaks zero real-name data into any UI render or projection.
- **KR7:** Per-vendor weekly caps enforced; global ceiling honored.
- **KR8:** Handoff Service successfully resumes work across ≥4 vendor pairs.
- **KR9:** ≥8 personas defined and dispatchable from UI.
- **KR10:** Backlinks bidirectional and rendered.
- **KR11:** **NEW:** Token Economics review cadence runs end-to-end without manual intervention through 4 consecutive weeks.
- **KR12:** **NEW:** Quarterly review delivered with section-by-section walkthrough; user signs off in single session.
- **KR13:** **NEW:** Pixel Art Office renders all 4 primary vendor sprites + handles 50+ concurrent sub-agent sprites without performance degradation.
- **KR14:** **NEW:** PINR blocks 100% of unauthorized AI-to-AI session attempts in adversarial tests.
- **KR15:** **NEW:** Multi-AI Group Chat partitioned files honor read/write boundaries (private vs mutual) with zero leakage.

---

## 7. CRIT (expanded)

| ID | Risk | Severity | Mitigation |
|---|---|---|---|
| R1 | Set B attribution gaps | Medium | `personal_study` flag; private-only |
| R2 | OCR error compounding | Medium | 3-stage verification + 10% arbiter sampling |
| R3 | AI cost runaway | High | Per-vendor weekly caps + 75/85/95/99/100% notify + hard block at 90% + global ceiling |
| R4 | Drive sync conflict | High | Explicit conflict UI; vector clock |
| R5 | 26 hex-named files unknown | Low | Sandbox-scan in Phase 5 |
| R6 | Real-name leakage | High | Schema separation + automated grep CI test |
| R7 | Invite token replay | High | Hash denylist; tested in Phase 8 |
| R8 | PIN brute force | Medium | Rate limit + lockout |
| R9 | Audit log tampering | Medium | Append-only + hash chain |
| R10 | Review-prose drift | High | Two-DB split |
| R11 | Handoff loses context | High | State-serialization tests; ≥4 vendor pair tests |
| R12 | Vendor outage during critical task | High | Fallback chain + graceful degradation |
| R13 | Persona drift across vendors | Medium | Versioned templates + cross-vendor consistency tests |
| R14 | Free-tier rate-limit DoS | Medium | Local Ollama as ultimate floor |
| R15 | Broker queue backlog | Medium | Bounded queue + drop-oldest + alert |
| R16 | Backlink infinite loops | Low | Cycle detection in renderer |
| R17 | Discord-bot scope creep | Medium | Locked v0.3: native only |
| R18 | **NEW:** PINR forgery / bypass | High | Tokens server-issued, hashed, tied to authorizing event; broker enforces; audit log chains |
| R19 | **NEW:** Multi-AI infinite loop despite PINR | High | Per-session message ceiling + time ceiling + automatic termination |
| R20 | **NEW:** Sprite asset bloat | Low | Procedural composition (parts not full sprites); CDN cacheable |
| R21 | **NEW:** Quarterly review fatigue (user skipping sign-off) | Medium | Section-by-section walkthrough; pause/resume; not all-or-nothing |
| R22 | **NEW:** Token Economics review failing on Sunday (vendor outage) | Medium | Fallback to next-tier vendor with notify; review postponed to next available slot, never silently skipped |
| R23 | **NEW:** Display-only gender weights misinterpreted as AI gender attribution | Medium | Explicit caveat in UI; documented as aesthetic preference only |

---

## 8. Open questions

### Blocking Phase 1:
1. Schema fine-tunes (§3) — sign off so build can proceed?

### Phase 11 (deferred until Phase 11 begins):
- Persona definitions to populate beyond defaults?
- Soft-cap notification channels (in-app only, or also email/SMS)?
- Per-vendor budget defaults — accepted; tunable later if usage shows imbalance.

### Phase 12 (deferred):
- Sprite asset library: commission custom art, use existing libraries (e.g. LPC Sprite), or AI-generate base parts?
- Animation framework: CSS-based, canvas, or lightweight game library (e.g. PixiJS)?

---

## 9. Foreman's note

v0.2 → v0.3 is a substantive expansion, but the foundation (schema, broker, two-DB split, identity, auth) carries forward unchanged. Phase 1 unblocks as soon as the schema fine-tunes are signed off.

The Token Economics + PINR + Multi-AI work in Phase 11 is now the heaviest single phase. I'll likely break it into sub-stages (11A: tier router + handoff + budget; 11B: persona registry + Multi-AI Group Chat; 11C: Token Economics cadence + PINR) when we reach it, with a gate between each sub-stage. That decision can be made at Phase 11 entry, not now.

I will not begin Phase 1 until you sign off on the schema fine-tunes in §3.

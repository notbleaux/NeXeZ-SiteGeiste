# NueVue Canonical Schema v0.1

**Format:** Markdown file with YAML frontmatter as single source of truth. Body below frontmatter mirrors the `text:` field for readability when opened in any editor.

**Filename convention:** `<asset_id>.md` lives in the canonical store. The original source file path is recorded in `source_path:` and never renamed.

**Projections generated from this schema (deterministic, idempotent):**
- `<asset_id>.json` — machine sidecar
- `master_index.xlsx` — one row per asset
- `search.json` — full-text + tag-faceted search payload
- `set-X.md` — per-set human aggregate
- `glossary.md` — themes/motifs/entities cross-reference

---

## Field-by-field walkthrough

### IDENTITY block
- **`asset_id`** *(string, required, unique)* — Stable internal ID. Format: `<SET>-<BATCH>-<NUM>` for corpus assets (e.g. `EBB-01-001`), `<SOURCE>-<NUM>` for external (e.g. `DARWISH-001`), `U-<idk>-<seq>` for user-generated.
- **`source_path`** *(string, required)* — Original filename in `/mnt/project/`. Never modified.
- **`set`** *(enum, required)* — `A` (EBB own works), `B` (mixed others/visual), `C` (loose uploads), `U` (user-generated post-launch).
- **`subset`** *(enum, required)* — `poetry`, `prose`, `visual_ref`, `screenshot`, `mixed`.
- **`content_type`** *(enum, required)* — `poem`, `short_story`, `essay`, `lyric`, `image`, `composite`.

### AUTHORSHIP block
- **`author.display`** *(string, required)* — Name shown in UI (e.g. `"E.B.B."`, `"Mahmoud Darwish"`). NEVER a real name unless the author has explicitly chosen their real name as their public identity.
- **`author.idk`** *(string or null)* — IDK pointer if author is a NueVue user. `null` for external authors.
- **`author.is_self`** *(bool)* — `true` if author maps to the current user's IDK.
- **`author.persona_of`** *(string or null)* — If `author.display` is a pen name (e.g. `"E.B.B."`), this points to the underlying user IDK (e.g. `leBeauxBleaux`). Visible only to the user themselves.

### PROVENANCE block
- **`source.platform`** *(string)* — `tumblr`, `twitter`, `book`, `manuscript`, `direct_input`, etc.
- **`source.url`** *(string or null)* — Original URL if web-sourced.
- **`source.permission_status`** *(enum)* — `own_work`, `permitted`, `personal_study`, `unknown`.
- **`language`** *(ISO 639-1)* — `en`, `ar`, etc.
- **`date_created`** *(ISO date or null)* — When work was originally written.
- **`date_added`** *(ISO date)* — When added to NueVue.
- **`date_extracted`** *(ISO date)* — When OCR/extraction was performed.

### VERIFICATION block
- **`verified`** *(bool)* — Has Arbiter signed off?
- **`verifier_chain.producer`** *(string)* — Producer pass agent ID.
- **`verifier_chain.reviewer`** *(string)* — Reviewer pass agent ID.
- **`verifier_chain.arbiter`** *(string)* — Arbiter ID (`claude_foreman` for now).
- **`verifier_chain.human_approved`** *(bool)* — Has user passed the human gate?

### CONTENT block
- **`text`** *(multiline string, required)* — The work itself. Mirrored in body below frontmatter.

### ANALYSIS block (sub-agent populated, structured only — no prose reviews here)
- **`analysis.themes`** *(list of strings)* — e.g. `[longing, kindness, conditional_love]`.
- **`analysis.motifs`** *(list of strings)* — Recurring images/devices.
- **`analysis.symbols`** *(list of strings)* — Specific symbolic elements.
- **`analysis.key_ideas`** *(list of objects)* — Each: `{idea: <short>, detail: <sentence>}`.
- **`analysis.cross_references`** *(list of objects)* — Each: `{target: <asset_id>, relationship: <enum>, justification: <≤3 paragraphs, bullets allowed>}`. Relationships: `thematic_parallel`, `formal_echo`, `direct_response`, `contrastive`, `intertextual`.
- **`analysis.last_extracted_by`** *(string)* — Sub-agent ID + date.

### REVIEW POINTERS block (links to DB2; reviews live in NueVue Review Archive)
- **`reviews`** *(list of objects)* — Each:
  - `review_id` — Pointer into DB2.
  - `review_type` — `independent_critique`, `composite_comparison`, `author_study`, `thematic_analysis`.
  - `ai_tier_used` — `haiku` / `sonnet` / `opus`.
  - `file` — Path to review .md file in DB2.
  - `date` — Generation date.
  - `citations_count` — How many external citations the review made.

### USER WORKFLOW block (content immutability enforced here)
- **`edit_proposals`** *(list of objects)* — AI-suggested edits, never auto-applied. Each: `{proposal_id, suggested_by, date, before, after, rationale, status: pending|accepted|rejected}`.
- **`edit_history`** *(list of objects)* — User-accepted changes only. Each: `{change_id, date, before, after, rationale_user_provided}`.

### CLASSIFICATION block
- **`tags`** *(list of strings)* — Free tags (sub-agent + user).
- **`notes`** *(string)* — User-only freeform notes.
- **`display.visibility`** *(enum)* — `private_only`, `invited_only`, `public`. NueVue is private-by-default; `public` requires explicit user toggle.

---

## Round-trip integrity test

For every canonical `.md`:
1. Parse frontmatter + body.
2. Generate JSON projection.
3. Reconstruct `.md` from JSON.
4. Diff original vs reconstructed.
5. Pass = byte-identical body, structurally-equivalent frontmatter (key order may differ).

This test runs in the build script and gates every commit to the canonical store.

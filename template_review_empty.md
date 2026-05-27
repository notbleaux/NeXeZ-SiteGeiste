---
# ===== REVIEW IDENTITY =====
review_id: ""                   # required, unique, e.g. "REV-2026-0001"
review_type: ""                 # independent_critique | composite_comparison | author_study | thematic_analysis
asset_targets: []               # [<asset_id>, ...] — the works under review

# ===== GENERATION PROVENANCE =====
ai_tier_used: ""                # haiku | sonnet | opus
ai_model_id: ""                 # e.g. claude-sonnet-4-6
generated_at: ""                # ISO timestamp
generated_by_agent: ""          # which sub-agent or composite pipeline
prompt_template_version: ""     # which review-prompt template was used

# ===== CITATIONS =====
citations: []                   # [{source: "<full citation>", claim: "<what it supports>", passage_quoted: false, page_or_locator: ""}, ...]
external_works_referenced: []   # [<asset_id or external_ref>, ...] — works named/quoted in the review

# ===== STORAGE =====
source_file_generated: ""       # absolute path to this review file in DB2
word_count: 0
cost_estimate_usd: 0.0

# ===== VERIFICATION =====
verifier_chain:
  producer: null                # sub-agent that generated the review
  reviewer: null                # different sub-agent that audited it
  arbiter: null                 # claude_foreman
  human_approved: false

# ===== STATUS =====
status: "draft"                 # draft | approved | superseded
supersedes: null                # review_id this replaces, if any
superseded_by: null             # review_id replacing this, if any
---

# Review body

<!-- The literary review prose lives here, below the frontmatter. -->
<!-- Constraint: all citations referenced in the prose must appear in the citations: list above. -->
<!-- Constraint: when this review is referenced from a Library asset, the asset's reviews: array stores a pointer including review_id, file path, and citations_count. -->

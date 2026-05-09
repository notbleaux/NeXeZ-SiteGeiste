---
# ===== REVIEW IDENTITY =====
review_id: ""                   # required, unique, e.g. "REV-2026-0001"
review_type: ""                 # independent_critique | composite_comparison | author_study | thematic_analysis
asset_targets: []               # [<asset_id>, ...] — the works under review

# ===== GENERATION PROVENANCE =====
vendor: ""                      # required: anthropic | moonshot | deepseek | copilot | openai | ollama | freeapi
ai_tier_used: ""                # haiku | sonnet | opus | kimi-k2 | deepseek-v3 | etc.
ai_model_id: ""                 # exact model string, e.g. claude-sonnet-4-6
generated_at: ""                # ISO timestamp
generated_by_agent:
  agent_id: ""                  # which sub-agent or composite pipeline ID
  persona_id: null              # which persona was active (nullable)
  prompt_template_version: ""   # which review-prompt template version

# ===== MULTI-AI SESSION (nullable) =====
multi_ai_session_id: null       # if generated in a multi-AI group chat session
pinr_authorization_id: null     # if AI-to-AI work, the PINR token that authorized it

# ===== CITATIONS =====
citations: []                   # [{source: "<full citation>", claim: "<what it supports>", passage_quoted: false, page_or_locator: ""}, ...]
external_works_referenced: []   # [<asset_id or external_ref>, ...]

# ===== STORAGE =====
source_file_generated: ""       # absolute path to this review file in DB2
word_count: 0
cost_estimate_usd: 0.0
tokens_input: 0
tokens_output: 0

# ===== VERIFICATION =====
verifier_chain:
  producer:
    agent_id: null
    persona_id: null
    vendor: null
  reviewer:
    agent_id: null
    persona_id: null
    vendor: null
  arbiter: null
  human_approved: false

# ===== STATUS =====
status: "draft"                 # draft | approved | superseded
supersedes: null
superseded_by: null
---

# Review body

<!-- Literary review prose lives here, below the frontmatter. -->
<!-- Constraint: all citations referenced in prose must appear in the citations: list above. -->
<!-- Constraint: cross-references to NueVue Library assets must use asset_id, not display name alone. -->

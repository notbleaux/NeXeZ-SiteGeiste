---
# ===== IDENTITY =====
asset_id: ""                    # required, unique, e.g. "EBB-01-001"
source_path: ""                 # required, original filename in /mnt/project/
set: ""                         # required: A | B | C | U
subset: ""                      # required: poetry | prose | visual_ref | screenshot | mixed
content_type: ""                # required: poem | short_story | essay | lyric | image | composite

# ===== AUTHORSHIP =====
author:
  display: ""                   # required, public-facing display name
  idk: null                     # IDK pointer if NueVue user, else null
  is_self: false                # true if maps to current user's IDK
  persona_of: null              # underlying user IDK if pen name, else null (visible to self only)

# ===== PROVENANCE =====
source:
  platform: ""                  # tumblr | twitter | book | manuscript | direct_input | ...
  url: null                     # original URL if web-sourced
  permission_status: ""         # own_work | permitted | personal_study | unknown
language: ""                    # ISO 639-1, e.g. en, ar
date_created: null              # ISO date or null
date_added: ""                  # ISO date, required
date_extracted: null            # ISO date, null if not extracted via OCR

# ===== VERIFICATION =====
verified: false
verifier_chain:
  producer:
    agent_id: null              # sub-agent ID
    persona_id: null            # which persona was active (nullable)
    vendor: null                # claude | kimi | deepseek | copilot | chatgpt | ollama | freeapi
  reviewer:
    agent_id: null              # different sub-agent
    persona_id: null
    vendor: null
  arbiter: null                 # claude_foreman
  human_approved: false         # gate marker

# ===== MULTI-AI PROVENANCE (nullable, populated if touched in multi-AI session) =====
multi_ai_session_id: null       # links to MultiAISession record if applicable

# ===== CONTENT =====
text: |
  

# ===== ANALYSIS (sub-agent populated; structured data only) =====
analysis:
  themes: []
  motifs: []
  symbols: []
  key_ideas: []                 # [{idea: "", detail: ""}, ...]
  cross_references: []          # [{target: "", relationship: "", justification: ""}, ...]
  last_extracted_by:
    agent_id: null
    persona_id: null
    vendor: null
    date: null

# ===== REVIEW POINTERS (links into DB2 — NueVue Review Archive) =====
reviews: []                     # [{review_id, review_type, ai_tier_used, vendor, persona_id, file, date, citations_count}, ...]

# ===== USER WORKFLOW (content immutability enforced) =====
edit_proposals: []              # AI suggestions, never auto-applied
edit_history: []                # user-accepted changes only

# ===== CLASSIFICATION =====
tags: []
notes: ""
display:
  visibility: "private_only"    # private_only | invited_only | public
---


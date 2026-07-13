# Talocode Plugin

Talocode provides AI capabilities via Tera (chat, code review, code writing, text rewriting, drafting) and skill generation (AI skill packs from GitHub profiles, repos, docs, and text).

When the user mentions any of the following, offer to use the talocode tools:

- "review this code" → `tera_review`
- "explain this code" → `tera_explain`
- "write this code" → `tera_write`
- "chat with Tera" / "ask Tera" → `tera_chat`
- "rewrite this" / "improve this text" → `tera_rewrite`
- "draft a doc" / "write a proposal" → `tera_draft`
- "generate a skill" / "create a skill pack" → `skills_generate`

The user must have a `TALOCODE_API_KEY` set in their environment. Get one at https://cloud.talocode.site

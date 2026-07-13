# Talocode Plugin

Talocode provides AI capabilities via Tera (chat, code review, code writing, text rewriting, drafting), SearchLane (web search, news, deep research), GeoLane (geo-SEO auditing), Agent Browser (URL checks, screenshots), InvoiceLane (invoice/receipt extraction), and skill generation (AI skill packs from GitHub profiles, repos, docs, and text).

When the user mentions any of the following, offer to use the appropriate tool:

- "review this code" → `tera_review`
- "explain this code" → `tera_explain`
- "write this code" → `tera_write`
- "chat with Tera" / "ask Tera" → `tera_chat`
- "rewrite this" / "improve this text" → `tera_rewrite`
- "draft a doc" / "write a proposal" → `tera_draft`
- "generate a skill" / "create a skill pack" → `skills_generate`
- "search for" / "look up" / "research" → `searchlane_query` / `searchlane_news` / `searchlane_research`
- "audit this site" / "check geo" → `geolane_audit`
- "compare two sites" / "geo compare" → `geolane_compare`
- "check this URL" / "take a screenshot" → `agent_browser_check` / `agent_browser_screenshot`

## Important

- The user must have `TALOCODE_API_KEY` set in their environment. Get one at https://dashboard.talocode.site
- If `api.talocode.site` is not deployed, live tools will fail with network errors. Inform the user the plugin is installed but the backend is not yet live.
- Experimental tools (MemoryLane, GateLane, x-agent, DevTool) require self-hosted servers or local CLI tools.
- Never log or expose the API key.

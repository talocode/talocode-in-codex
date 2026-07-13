# Changelog

## v0.2.0 (unreleased)

- Added 15 new tools: SearchLane (query, news, research), GeoLane (audit, compare), Agent Browser (check, screenshot), InvoiceLane (extract), MemoryLane (remember, recall, search), GateLane (list_tools, call_tool), x-agent (score), DevTool (run)
- Hardened auth: every tool call checks `TALOCODE_API_KEY` before proceeding
- Hardened API client: request timeouts, network error handling, JSON safety
- Changed env var from `TALOCODE_BASE_URL` to `TALOCODE_API_BASE_URL` for consistency
- Updated manifest files with env requirements
- Added integration test (`scripts/test-mcp.mjs`) validating initialize, tools/list, missing-key errors, live calls, and unknown tools
- Added full documentation suite (TOOLS.md, INSTALL.md, DEVELOPMENT.md, TROUBLESHOOTING.md)
- All live tools marked with honest deployment status in docs

## v0.1.0 (initial)

- MCP server with 7 tools: tera_chat, tera_review, tera_explain, tera_write, tera_rewrite, tera_draft, skills_generate
- Companion script calling api.talocode.site
- Codex plugin manifests (marketplace.json + plugin.json)
- Basic skills and prompting guides
- 6 unit tests

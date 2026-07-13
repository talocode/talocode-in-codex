# Talocode MCP Tools

> Honest endpoint mapping for all tools exposed by `talocode-in-codex`.

Each tool description lists:
- **Status**: `live` (route exists in deployed Talocode Cloud API), `experimental` (standalone/self-hosted), or `planned` (not yet implemented)
- **Endpoint**: The API route called
- **Env**: Required and optional environment variables

---

## Tera

| Tool | Status | Endpoint | Credits |
|------|--------|----------|---------|
| `tera_chat` | live | `POST /v1/tera/chat/completions` | 3 |
| `tera_review` | live | `POST /v1/tera/coding/review` | 20 |
| `tera_explain` | live | `POST /v1/tera/coding/explain` | 10 |
| `tera_write` | live | `POST /v1/tera/coding/write` | 20 |
| `tera_rewrite` | live | `POST /v1/tera/writing/rewrite` | 5 |
| `tera_draft` | live | `POST /v1/tera/writing/draft` | 10 |

**Required:** `TALOCODE_API_KEY`

All Tera routes are deployed as part of the Talocode Cloud API at `api.talocode.site`. If the site is not yet serving traffic, these tools will fail with a network error.

---

## Skills

| Tool | Status | Endpoint | Credits |
|------|--------|----------|---------|
| `skills_generate` | live | `POST /v1/skills/generate/github-profile` | 80–100 |

**Required:** `TALOCODE_API_KEY`

Generates AI skill packs (SKILL.md) compatible with Cursor, Claude Code, OpenCode, and Codra. Supports `type` parameter: `github-profile`, `github-repo`, `docs`, or `text`.

---

## SearchLane

| Tool | Status | Endpoint | Credits |
|------|--------|----------|---------|
| `searchlane_query` | live | `POST /v1/searchlane/query` | 5 |
| `searchlane_news` | live | `POST /v1/searchlane/news` | 8 |
| `searchlane_research` | live | `POST /v1/searchlane/research` | 30 |

**Required:** `TALOCODE_API_KEY`

SearchLane routes are deployed as part of the Stacklane API at `api.talocode.site`.

---

## GeoLane

| Tool | Status | Endpoint | Credits |
|------|--------|----------|---------|
| `geolane_audit` | live | `POST /v1/geolane/audit` | 40 |
| `geolane_compare` | live | `POST /v1/geolane/compare` | 50 |

**Required:** `TALOCODE_API_KEY`

GeoLane routes are deployed as part of the Stacklane API at `api.talocode.site`.

---

## Agent Browser

| Tool | Status | Endpoint | Credits |
|------|--------|----------|---------|
| `agent_browser_check` | live | `POST /v1/agent-browser/check` | 5 |
| `agent_browser_screenshot` | live | `POST /v1/agent-browser/screenshot` | 8 |

**Required:** `TALOCODE_API_KEY`

Agent Browser routes are deployed as part of the Stacklane API at `api.talocode.site`.

---

## InvoiceLane

| Tool | Status | Endpoint | Credits |
|------|--------|----------|---------|
| `invoicelane_extract` | live | `POST /v1/invoicelane/extract` | 20 |

**Required:** `TALOCODE_API_KEY`

InvoiceLane routes are deployed as part of the Stacklane API at `api.talocode.site`.

---

## MemoryLane (experimental)

| Tool | Status | Endpoint |
|------|--------|----------|
| `memorylane_remember` | experimental | `POST /v1/memorylane/remember` |
| `memorylane_recall` | experimental | `POST /v1/memorylane/recall` |
| `memorylane_search` | experimental | `POST /v1/memorylane/search` |

**Required:** `TALOCODE_API_KEY`
**Optional:** `TALOCODE_MEMORYLANE_BASE_URL` (defaults to `TALOCODE_API_BASE_URL`)

MemoryLane is a standalone server. These tools require a self-hosted MemoryLane instance. The base URL can be overridden with `TALOCODE_MEMORYLANE_BASE_URL`.

---

## GateLane (experimental)

| Tool | Status | Endpoint |
|------|--------|----------|
| `gatelane_list_tools` | experimental | `POST /v1/gatelane/servers/tools` |
| `gatelane_call_tool` | experimental | `POST /v1/gatelane/call` |

**Required:** `TALOCODE_API_KEY`
**Optional:** `TALOCODE_GATELANE_BASE_URL` (defaults to `TALOCODE_API_BASE_URL`)

GateLane is a standalone server (`@talocode/gatelane`). These tools require a self-hosted GateLane instance.

---

## x-agent (experimental)

| Tool | Status | Endpoint |
|------|--------|----------|
| `x_agent_score` | experimental | `POST /v1/x-agent/analyze` |

**Required:** `TALOCODE_API_KEY`
**Optional:** `TALOCODE_X_AGENT_BASE_URL` (defaults to `TALOCODE_API_BASE_URL`)

x-agent is a standalone server (`@talocode/x-agent`). Requires a self-hosted instance.

---

## DevTool (experimental)

| Tool | Status | Implementation |
|------|--------|---------------|
| `devtool_run` | experimental | Local CLI via `npx @talocode/devtool` |

**Required:** none

DevTool is a CLI utility (`@talocode/devtool`). Runs commands locally via `npx`. Not an HTTP endpoint.

---

## Planned (not yet implemented)

These tools are defined in MCP schemas but do not have route handlers deployed. They are candidates for future versions:

- `tradia_*` — Trading agent tools (schemas exist, routes not yet in server.ts)
- `signallane_*` — X/Twitter signal tools (schemas exist)
- `webdatalane_*` — Web data extraction (schemas exist)
- `crawlerlane_*` — Crawler management (schemas exist)
- `opensourcelane_*` — Open source intelligence (schemas exist)
- `forgecad_*` — CAD generation (schemas exist)
- `replylane_*` — Reply management (schemas exist)
- `ugclane_*` — UGC strategy (schemas exist)
- `worklane_*` — Workflow automation (planned)

---

## Environment Variables

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `TALOCODE_API_KEY` | Yes | — | Talocode Cloud API key. Get one at https://cloud.talocode.site |
| `TALOCODE_API_BASE_URL` | No | `https://api.talocode.site` | Override the base URL for all live tools. Useful for local development. |
| `TALOCODE_MEMORYLANE_BASE_URL` | No | `TALOCODE_API_BASE_URL` | Override the base URL for MemoryLane tools |
| `TALOCODE_GATELANE_BASE_URL` | No | `TALOCODE_API_BASE_URL` | Override the base URL for GateLane tools |
| `TALOCODE_X_AGENT_BASE_URL` | No | `TALOCODE_API_BASE_URL` | Override the base URL for x-agent tools |

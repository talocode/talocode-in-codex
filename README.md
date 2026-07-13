# talocode-in-codex

**Talocode inside Codex** — use Talocode APIs as MCP tools.

`talocode-in-codex` brings Talocode APIs into Codex as MCP tools so builders can use Tera, Skills, SearchLane, GeoLane, Agent Browser, InvoiceLane, MemoryLane, GateLane, x-agent, and DevTool directly inside their coding workflow.

---

## Quick Start

```bash
# Install
codex plugin marketplace add talocode/talocode-in-codex

# Set your API key
export TALOCODE_API_KEY=tc_key_xxxxxxxxx

# Verify the server starts
npm start
```

```bash
# Test that tools are discoverable
node scripts/test-mcp.mjs

# Run full test suite
npm test
```

---

## Tools

| Product | Tools | Status | Env |
|---------|-------|--------|-----|
| **Tera** | `chat`, `review`, `explain`, `write`, `rewrite`, `draft` | Live | `TALOCODE_API_KEY` |
| **Skills** | `generate` | Deploy-pending | `TALOCODE_API_KEY` |
| **SearchLane** | `query`, `news`, `research` | Deploy-pending | `TALOCODE_API_KEY` |
| **GeoLane** | `audit`, `compare` | Deploy-pending | `TALOCODE_API_KEY` |
| **Agent Browser** | `check`, `screenshot` | Deploy-pending | `TALOCODE_API_KEY` |
| **InvoiceLane** | `extract` | Deploy-pending | `TALOCODE_API_KEY` |
| **MemoryLane** | `remember`, `recall`, `search` | Experimental | + `TALOCODE_MEMORYLANE_BASE_URL` |
| **GateLane** | `list_tools`, `call_tool` | Experimental | + `TALOCODE_GATELANE_BASE_URL` |
| **x-agent** | `score` | Experimental | + `TALOCODE_X_AGENT_BASE_URL` |
| **DevTool** | `run` | Experimental | local CLI |

See [docs/TOOLS.md](docs/TOOLS.md) for endpoint mapping, credits, and env reference.

---

## Architecture

```
Codex ◄──JSON-RPC stdin/stdout──► mcp/server.mjs
                                       │
                            spawns companion script
                                       │
                              talocode-client.mjs
                                       │
                              HTTP POST (Bearer auth)
                                       │
                               tera-api-v01.netlify.app
                               (falls back to stacklane-api.netlify.app)
```

The MCP server speaks newline-delimited JSON-RPC over stdio (no LSP Content-Length framing). Each `tools/call` spawns the companion script as a child process, which makes the HTTP request.

---

## Environment Variables

| Variable | Required | Default | Purpose |
|----------|----------|---------|---------|
| `TALOCODE_API_KEY` | Yes | — | API key for all Talocode Cloud routes |
| `TALOCODE_API_BASE_URL` | No | `https://tera-api-v01.netlify.app` | Override base URL (local dev). Falls back to `stacklane-api.netlify.app` on 404/503. |
| `TALOCODE_MEMORYLANE_BASE_URL` | No | `TALOCODE_API_BASE_URL` | Self-hosted MemoryLane |
| `TALOCODE_GATELANE_BASE_URL` | No | `TALOCODE_API_BASE_URL` | Self-hosted GateLane |
| `TALOCODE_X_AGENT_BASE_URL` | No | `TALOCODE_API_BASE_URL` | Self-hosted x-agent |

---

## Deployment Status

The plugin companion script defaults to `tera-api-v01.netlify.app` (live) and falls back to `stacklane-api.netlify.app` on 404/503.

| Product | Status | URL |
|---------|--------|-----|
| **Tera** (chat, review, explain, write, rewrite, draft) | ✅ Live | `tera-api-v01.netlify.app` |
| **Skills, SearchLane, GeoLane, Agent Browser, InvoiceLane** | ⏳ Deploy-pending | Code pushed to `stacklane-api-deploy` (commit `a5d87b2`). Blocked by Netlify account credit limit. |
| **MemoryLane, GateLane, x-agent, DevTool** | 🧪 Experimental | Self-hosted or local |

You can override the base URL at any time with `TALOCODE_API_BASE_URL`.

---

## Supported Platforms

| Platform | Method |
|----------|--------|
| **Codex** | `codex plugin marketplace add talocode/talocode-in-codex` |
| **OpenCode** | MCP server config in `opencode.json` |
| **Claude Code** | MCP server config in `~/.claude/settings.json` |
| **Cursor** | MCP server config in settings UI |
| **Any MCP host** | `node plugins/talocode/mcp/server.mjs` |

See [docs/INSTALL.md](docs/INSTALL.md) for platform-specific setup.

---

## Development

```bash
git clone https://github.com/talocode/talocode-in-codex.git
cd talocode-in-codex

# Start the MCP server directly
npm start

# Run integration + unit tests
npm test
```

See [docs/DEVELOPMENT.md](docs/DEVELOPMENT.md).

---

## Project Structure

```
.agents/plugins/marketplace.json   # Codex plugin manifest
plugins/talocode/
  .codex-plugin/plugin.json        # Plugin metadata
  .mcp.json                        # MCP server config
  mcp/server.mjs                   # MCP server (JSON-RPC stdin/stdout)
  scripts/talocode-client.mjs      # HTTP companion script
  skills/                          # Agent skill files
scripts/test-mcp.mjs               # Integration test
tests/mcp-tools.test.mjs           # Unit tests
docs/                              # Documentation
```

---

## License

MIT

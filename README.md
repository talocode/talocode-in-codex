# talocode-in-codex

**Talocode inside Codex** — use Talocode APIs as MCP tools.

`talocode-in-codex` brings Talocode APIs into Codex as MCP tools so builders can use Tera, Skills, SearchLane, GeoLane, Agent Browser, InvoiceLane, MemoryLane, GateLane, x-agent, and DevTool directly inside their coding workflow.

---

## Install

```bash
codex plugin marketplace add talocode/talocode-in-codex
```

## Set API Key

```bash
export TALOCODE_API_KEY=your_key_here
```

Get a key at [https://cloud.talocode.site](https://cloud.talocode.site).

Optional — point to a local API server:

```bash
export TALOCODE_API_BASE_URL=http://localhost:3000
```

---

## Tools

| Product | Tools | Status |
|---------|-------|--------|
| **Tera** | chat, review, explain, write, rewrite, draft | Live |
| **Skills** | generate | Live |
| **SearchLane** | query, news, research | Live |
| **GeoLane** | audit, compare | Live |
| **Agent Browser** | check, screenshot | Live |
| **InvoiceLane** | extract | Live |
| **MemoryLane** | remember, recall, search | Experimental |
| **GateLane** | list_tools, call_tool | Experimental |
| **x-agent** | score | Experimental |
| **DevTool** | run | Experimental |

See [docs/TOOLS.md](docs/TOOLS.md) for the complete endpoint mapping.

---

## Supported Platforms

- **Codex** — plugin marketplace install
- **OpenCode** — MCP server config
- **Claude Code** — MCP server config
- **Cursor** — MCP server config
- Any MCP-compatible host

---

## Status

The plugin is ready for installation. All **Live** tools call `api.talocode.site`, which must be deployed for production use. If the Talocode Cloud API routes are not yet serving traffic, tool calls will fail with network errors.

**Experimental** tools require self-hosted servers (MemoryLane, GateLane, x-agent) or local CLI tools (DevTool).

---

## Development

```bash
# Clone
git clone https://github.com/talocode/talocode-in-codex.git

# Test
node scripts/test-mcp.mjs
npm test
```

See [docs/DEVELOPMENT.md](docs/DEVELOPMENT.md).

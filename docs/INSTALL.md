# Installation

## Codex

```bash
codex plugin marketplace add talocode/talocode-in-codex
```

The plugin will be discovered automatically by Codex via the `.agents/plugins/marketplace.json` manifest.

## OpenCode

```bash
opencode plugin install talocode/talocode-in-codex
```

Or add to your `opencode.json`:

```json
{
  "mcpServers": {
    "talocode": {
      "command": "node",
      "args": ["./plugins/talocode/mcp/server.mjs"],
      "cwd": "./plugins/talocode"
    }
  }
}
```

## Claude Code

Claude Code supports MCP servers. Add to your `~/.claude/settings.json`:

```json
{
  "mcpServers": {
    "talocode": {
      "command": "node",
      "args": ["path/to/talocode-in-codex/plugins/talocode/mcp/server.mjs"]
    }
  }
}
```

## Cursor

Cursor supports MCP servers via its settings UI. Point it to:

```
node plugins/talocode/mcp/server.mjs
```

## Manual (any MCP host)

```bash
node plugins/talocode/mcp/server.mjs
```

---

## Set Up API Key

```bash
export TALOCODE_API_KEY=your_key_here
```

Get a key: [https://cloud.talocode.site](https://cloud.talocode.site)

Optional — use a local development server:

```bash
export TALOCODE_API_BASE_URL=http://localhost:3000
```

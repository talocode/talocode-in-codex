# Troubleshooting

## "TALOCODE_API_KEY is required"

The companion script checks `process.env.TALOCODE_API_KEY`. Set it before use:

```bash
export TALOCODE_API_KEY=your_key_here
```

## "API error 4xx" / "Network error"

`api.talocode.site` must be deployed and serving traffic. If the site is not yet live, all live tools will fail with network errors.

Check reachability:

```bash
curl -s -o /dev/null -w "%{http_code}" https://api.talocode.site/v1/tera/health
```

If this returns `000` (unreachable), the Talocode Cloud API routes are not deployed yet.

### During Development

Use `TALOCODE_API_BASE_URL` to point to a local server:

```bash
export TALOCODE_API_BASE_URL=http://localhost:3000
```

## "Request timed out after 60000ms"

The companion script uses a 60-second timeout per request. If the API is slow or unreachable, increase timeout by editing `REQUEST_TIMEOUT_MS` in `scripts/talocode-client.mjs`.

## "Unknown tool: ..."

The tool name must match one of the definitions in `TOOL_DEFINITIONS`. Check `docs/TOOLS.md` for the complete list.

## Plugin Not Showing in Codex

Ensure:
1. The repo is cloned locally or installed via `codex plugin marketplace add`
2. The `.agents/plugins/marketplace.json` manifest is present
3. The `plugins/talocode/.mcp.json` file points to the correct MCP server path

## Experimental Tools Fail

Tools marked `[Experimental]` in their descriptions require self-hosted servers (MemoryLane, GateLane, x-agent, DevTool). Set the appropriate `TALOCODE_*_BASE_URL` environment variable to point to your instance.

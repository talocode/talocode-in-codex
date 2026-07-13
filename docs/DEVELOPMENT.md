# Development

## Project Structure

```
talocode-in-codex/
  .agents/plugins/
    marketplace.json          # Codex marketplace manifest
  plugins/talocode/
    .codex-plugin/
      plugin.json             # Codex plugin metadata
    .mcp.json                 # MCP server configuration
    mcp/
      server.mjs              # MCP server (stdin/stdout JSON-RPC)
    scripts/
      talocode-client.mjs     # Companion script calling Talocode APIs
    skills/
      SKILL.md                # Agent guidance for tool usage
      talocode-prompting/
        SKILL.md              # Prompting examples
  scripts/
    test-mcp.mjs              # MCP integration test
  tests/
    mcp-tools.test.mjs        # Unit tests
  docs/
    TOOLS.md                  # Tool endpoint mapping
    INSTALL.md                # Installation guide
    DEVELOPMENT.md            # This file
    TROUBLESHOOTING.md        # Common issues
  package.json
  CHANGELOG.md
  README.md
```

## MCP Architecture

The MCP server follows this pattern:

1. **Codex/OpenCode/Claude** starts the server via `node mcp/server.mjs`
2. The server listens for JSON-RPC messages on stdin, responds on stdout
3. For `tools/call`, it spawns the companion script as a child process
4. The companion script makes HTTP requests to `api.talocode.site`
5. Response is relayed back to the MCP host

## Testing

```bash
# Integration test (spawns real MCP server)
node scripts/test-mcp.mjs

# Unit tests
npm test
```

## Adding a New Tool

1. Define the tool in `TOOL_DEFINITIONS` in `mcp/server.mjs`
2. Add the action mapping in `getAction()`
3. Add the route in `ROUTES` in `scripts/talocode-client.mjs`
4. Add the tool to `expected` in `scripts/test-mcp.mjs`
5. Update `tests/mcp-tools.test.mjs`
6. Update `docs/TOOLS.md` with endpoint, status, and env vars

## Release

```bash
# Create a new version
git tag v0.2.0
git push origin v0.2.0
gh release create v0.2.0 --repo talocode/talocode-in-codex --title "v0.2.0" --notes "Release notes"
```

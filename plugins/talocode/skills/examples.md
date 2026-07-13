# Talocode Usage Examples

## Review current file with Tera

Ask Codex to review a file you have open:

> "Review this file with Tera"

This calls `tera_review` with the file content as `code`.

## Explain an error with Tera

> "Explain this error: TypeError: Cannot read property 'map' of undefined"

This calls `tera_explain` with the error as `code`.

## Generate a Talocode skill pack

> "Generate a skill pack from my GitHub profile: octocat"

This calls `skills_generate` with `input=octocat` and `type=github-profile`.

## Research a topic with SearchLane

> "Research AI coding agents"

This calls `searchlane_research` with the topic.

## Search the web

> "Find the latest TypeScript best practices"

This calls `searchlane_query`.

## Audit a URL with GeoLane

> "Check if example.com is optimized for UK search"

This calls `geolane_audit` with the URL.

## Compare geo-targeting

> "Compare example.co.uk and example.com for geo-targeting"

This calls `geolane_compare`.

## Check a URL with Agent Browser

> "Is https://example.com working?"

This calls `agent_browser_check`.

## Store context with MemoryLane (experimental)

> "Remember my project name is AcmeCorp"

This calls `memorylane_remember` (requires self-hosted MemoryLane).

## Route through GateLane (experimental)

> "List available tools in GateLane"

This calls `gatelane_list_tools` (requires self-hosted GateLane).

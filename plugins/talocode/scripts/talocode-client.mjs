#!/usr/bin/env node

/**
 * Companion script called by the MCP server.
 * Reads TALOCODE_API_KEY from env and calls api.talocode.site.
 *
 * Usage: node talocode-client.mjs <action> [--key value ...]
 */

const TALOCODE_BASE_URL = process.env.TALOCODE_BASE_URL || "https://api.talocode.site";
const API_KEY = process.env.TALOCODE_API_KEY || process.env.X_API_KEY || "";

const USAGE = `Usage: talocode-client.mjs <action> [--key value ...]

Actions:
  chat              Send a chat message
  review            Review code
  explain           Explain code
  write             Write code
  rewrite           Rewrite text
  draft             Draft content
  skills-generate   Generate a skill pack

Options:
  --message         Chat message (chat)
  --code            Code to review/explain (review, explain)
  --task            Task description (write)
  --text            Text to rewrite (rewrite)
  --topic           Topic to draft (draft)
  --input           Input for skill generation (skills-generate)
  --type            Source type for skills (skills-generate)
  --system          System prompt override (chat)
  --model           Model override (chat)
  --focus           Review focus (review)
  --language        Programming language (review, explain, write)
  --tone            Tone for rewrite (rewrite)
  --format          Output format (draft)
  --context         Existing code context (write)
`;

function bail(msg, code = 1) {
  console.error(msg);
  process.exit(code);
}

function parseArgs() {
  const args = process.argv.slice(2);
  if (args.length === 0) bail(USAGE);
  const action = args[0];
  const input = {};
  for (let i = 1; i < args.length; i += 2) {
    const key = args[i].replace(/^--/, "");
    const val = args[i + 1];
    if (val !== undefined) input[key] = val;
  }
  return { action, input };
}

async function main() {
  if (!API_KEY) {
    bail("TALOCODE_API_KEY environment variable is required.\nGet your key at https://cloud.talocode.site");
  }

  const { action, input } = parseArgs();

  const ENDPOINTS = {
    chat:       { path: "/v1/tera/chat/completions", method: "POST", key: "message" },
    review:     { path: "/v1/tera/coding/review",     method: "POST", key: "code" },
    explain:    { path: "/v1/tera/coding/explain",     method: "POST", key: "code" },
    write:      { path: "/v1/tera/coding/write",      method: "POST", key: "task" },
    rewrite:    { path: "/v1/tera/writing/rewrite",    method: "POST", key: "text" },
    draft:      { path: "/v1/tera/writing/draft",      method: "POST", key: "topic" },
    "skills-generate": { path: "/v1/skills/generate/github-profile", method: "POST", key: "input" },
  };

  const ep = ENDPOINTS[action];
  if (!ep) bail(`Unknown action: ${action}\n${USAGE}`);

  if (!input[ep.key]) bail(`Missing required field: --${ep.key}`);

  const body = { ...input };
  // Map the generic CLI keys to API field names
  if (action === "chat") {
    body.messages = [{ role: "user", content: body.message }];
    delete body.message;
    if (body.system) {
      body.messages.unshift({ role: "system", content: body.system });
      delete body.system;
    }
  }

  const url = `${TALOCODE_BASE_URL}${ep.path}`;
  const res = await fetch(url, {
    method: ep.method,
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${API_KEY}`,
      "X-Api-Key": API_KEY,
    },
    body: JSON.stringify(body),
  });

  const text = await res.text();
  if (!res.ok) {
    bail(`API error ${res.status}: ${text}`);
  }

  try {
    const json = JSON.parse(text);
    console.log(JSON.stringify(json, null, 2));
  } catch {
    console.log(text);
  }
}

main().catch((err) => bail(err.message));

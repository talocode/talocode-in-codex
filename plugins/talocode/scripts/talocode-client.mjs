#!/usr/bin/env node

const TALOCODE_API_KEY = process.env.TALOCODE_API_KEY || "";
const PRIMARY_API = "https://tera-api-v01.netlify.app";
const SECONDARY_API = "https://stacklane-api.netlify.app";
const TALOCODE_API_BASE_URL = process.env.TALOCODE_API_BASE_URL || PRIMARY_API;

const REQUEST_TIMEOUT_MS = 60_000;

const USAGE = `Usage: talocode-client.mjs <action> [--key value ...]

Actions:
  chat                    Send a chat message to Tera
  review                  Review code with Tera
  explain                 Explain code with Tera
  write                   Write code with Tera
  rewrite                 Rewrite text with Tera
  draft                   Draft content with Tera
  skills-generate         Generate an AI skill pack
  searchlane-query        Search the web
  searchlane-news         Search news
  searchlane-research     Deep research
  geolane-audit           Audit URL geo-SEO
  geolane-compare         Compare geo-targeting
  agent-browser-check     Check URL accessibility
  agent-browser-screenshot Take a URL screenshot
  invoicelane-extract     Extract invoice/receipt data
  memorylane-remember     [Exp] Store a memory
  memorylane-recall       [Exp] Recall a memory
  memorylane-search       [Exp] Search memories
  gatelane-list-tools     [Exp] List GateLane tools
  gatelane-call-tool      [Exp] Call a GateLane tool
  x-agent-score           [Exp] Score X/Twitter post
  devtool-run             [Exp] Run a DevTool command
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

async function fetchWithFallback(url, opts) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  opts.signal = controller.signal;
  try {
    const res = await fetch(url, opts);
    clearTimeout(timer);
    return res;
  } catch (err) {
    clearTimeout(timer);
    throw err;
  }
}

async function main() {
  if (!TALOCODE_API_KEY) {
    bail("TALOCODE_API_KEY is required. Set it before using talocode-in-codex.\nGet your key at https://cloud.talocode.site");
  }

  const { action, input } = parseArgs();

  // ── Route table ──────────────────────────────────────────────
  const ROUTES = {
    // Tera (via Stacklane API)
    "chat":                 { path: "/v1/tera/chat/completions", wrap: "chat" },
    "review":               { path: "/v1/tera/coding/review" },
    "explain":              { path: "/v1/tera/coding/explain" },
    "write":                { path: "/v1/tera/coding/write" },
    "rewrite":              { path: "/v1/tera/writing/rewrite" },
    "draft":                { path: "/v1/tera/writing/draft" },
    // Skills
    "skills-generate":      { path: "/v1/skills/generate/github-profile" },
    // SearchLane
    "searchlane-query":     { path: "/v1/searchlane/query" },
    "searchlane-news":      { path: "/v1/searchlane/news" },
    "searchlane-research":  { path: "/v1/searchlane/research" },
    // GeoLane
    "geolane-audit":        { path: "/v1/geolane/audit" },
    "geolane-compare":      { path: "/v1/geolane/compare" },
    // Agent Browser
    "agent-browser-check":  { path: "/v1/agent-browser/check" },
    "agent-browser-screenshot": { path: "/v1/agent-browser/screenshot" },
    // InvoiceLane
    "invoicelane-extract":  { path: "/v1/invoicelane/extract" },
    // MemoryLane (experimental — self-hosted)
    "memorylane-remember":  { path: "/v1/memorylane/remember", experimental: true },
    "memorylane-recall":    { path: "/v1/memorylane/recall", experimental: true },
    "memorylane-search":    { path: "/v1/memorylane/search", experimental: true },
    // GateLane (experimental — self-hosted)
    "gatelane-list-tools":  { path: "/v1/gatelane/servers/tools", experimental: true },
    "gatelane-call-tool":   { path: "/v1/gatelane/call", experimental: true },
    // x-agent (experimental — self-hosted)
    "x-agent-score":        { path: "/v1/x-agent/analyze", experimental: true },
    // DevTool (experimental — local CLI)
    "devtool-run":          { path: null, experimental: true },
  };

  const route = ROUTES[action];
  if (!route) bail(`Unknown action: ${action}\n${USAGE}`);

  if (route.experimental) {
    console.error(`[${action}] Experimental tool — requires self-hosted server. See docs/TOOLS.md.`);
  }

  // ── DevTool is CLI-only, not an HTTP endpoint ────────────────
  if (action === "devtool-run") {
    const { spawn } = await import("node:child_process");
    const cmd = input.command || "";
    const extra = input.args ? input.args.split(" ") : [];
    const child = spawn("npx", ["@talocode/devtool", cmd, ...extra], {
      stdio: ["inherit", "pipe", "pipe"],
      env: process.env,
    });
    let out = "";
    child.stdout.on("data", (c) => { out += c; process.stdout.write(c); });
    child.stderr.on("data", (c) => { out += c; process.stderr.write(c); });
    return new Promise((resolve) => {
      child.on("close", (code) => {
        if (code === 0) resolve();
        else bail(`devtool exited with code ${code}`);
      });
    });
  }

  // ── Build request body ───────────────────────────────────────
  const body = { ...input };

  if (action === "chat") {
    body.messages = [{ role: "user", content: body.message }];
    delete body.message;
    if (body.system) {
      body.messages.unshift({ role: "system", content: body.system });
      delete body.system;
    }
  }

  // ── Experimental: override base URL for self-hosted tools ────
  const experimentalPrefixes = ["memorylane", "gatelane", "x-agent"];
  const isExperimental = experimentalPrefixes.some((p) => action.startsWith(p));
  const baseUrl = isExperimental
    ? process.env[`TALOCODE_${action.split("-")[0].toUpperCase()}_BASE_URL`] || TALOCODE_API_BASE_URL
    : TALOCODE_API_BASE_URL;

  // ── Fallback: try primary URL, then secondary on failure ─────
  const urls = [baseUrl];
  if (baseUrl !== SECONDARY_API) urls.push(SECONDARY_API);

  let lastErr = null;
  for (const tryUrl of urls) {
    const url = `${tryUrl}${route.path}`;
    try {
      const res = await fetchWithFallback(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${TALOCODE_API_KEY}`,
        },
        body: JSON.stringify(body),
      });

      const text = await res.text();
      if (!res.ok) {
        lastErr = `[${route.path}] API error ${res.status} from ${tryUrl}: ${text}`;
        if (res.status === 404 || res.status === 503) continue;
        bail(lastErr);
      }

      try {
        const json = JSON.parse(text);
        console.log(JSON.stringify(json, null, 2));
      } catch {
        console.log(text);
      }
      return;
    } catch (err) {
      if (err.name === "AbortError") {
        bail(`[${route.path}] Request timed out after ${REQUEST_TIMEOUT_MS}ms`);
      }
      lastErr = `[${route.path}] Network error from ${tryUrl}: ${err.message}`;
    }
  }
  bail(lastErr);
}

main().catch((err) => bail(err.message));

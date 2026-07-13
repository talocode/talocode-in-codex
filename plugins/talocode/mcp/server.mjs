#!/usr/bin/env node

import { spawn } from "node:child_process";
import path from "node:path";
import readline from "node:readline";
import { fileURLToPath } from "node:url";

const SERVER_VERSION = "0.2.0";
const ROOT_DIR = path.resolve(fileURLToPath(new URL("..", import.meta.url)));
const COMPANION = path.join(ROOT_DIR, "scripts", "talocode-client.mjs");

const s = (d) => ({ type: "string", description: d });
const b = (d) => ({ type: "boolean", description: d });

const TOOL_DEFINITIONS = [
  // ── Tera (live via Stacklane API) ────────────────────────────
  {
    name: "tera_chat",
    description: "Send a chat message to Tera AI and get a response.",
    inputSchema: {
      type: "object", additionalProperties: false, required: ["message"],
      properties: {
        message: s("The chat message to send."),
        system: s("Optional system prompt to guide the model."),
        model: s("Model override (defaults to mistral-small-latest)."),
      },
    },
  },
  {
    name: "tera_review",
    description: "Ask Tera to review code for bugs, security issues, and improvement opportunities.",
    inputSchema: {
      type: "object", additionalProperties: false, required: ["code"],
      properties: {
        code: s("The code to review. Provide the full file or diff."),
        focus: s("Optional review focus (e.g. security, performance, auth)."),
        language: s("Programming language for context."),
      },
    },
  },
  {
    name: "tera_explain",
    description: "Ask Tera to explain a piece of code or concept.",
    inputSchema: {
      type: "object", additionalProperties: false, required: ["code"],
      properties: {
        code: s("The code or concept to explain."),
        language: s("Programming language."),
      },
    },
  },
  {
    name: "tera_write",
    description: "Ask Tera to write or implement code from a description.",
    inputSchema: {
      type: "object", additionalProperties: false, required: ["task"],
      properties: {
        task: s("Description of what to implement."),
        language: s("Target programming language."),
        context: s("Optional existing code or context to build on."),
      },
    },
  },
  {
    name: "tera_rewrite",
    description: "Ask Tera to rewrite or improve text (docs, comments, copy).",
    inputSchema: {
      type: "object", additionalProperties: false, required: ["text"],
      properties: {
        text: s("The text to rewrite or improve."),
        tone: s("Desired tone (professional, casual, concise, etc.)."),
      },
    },
  },
  {
    name: "tera_draft",
    description: "Ask Tera to draft longer-form content like docs, blog posts, or proposals.",
    inputSchema: {
      type: "object", additionalProperties: false, required: ["topic"],
      properties: {
        topic: s("The topic or outline for the draft."),
        format: s("Desired format (blog, docs, proposal, readme)."),
      },
    },
  },

  // ── Skills (live via Stacklane API) ───────────────────────────
  {
    name: "skills_generate",
    description: "Generate an AI skill pack from a GitHub profile, repo, docs, or text input.",
    inputSchema: {
      type: "object", additionalProperties: false, required: ["input"],
      properties: {
        input: s("GitHub username, repo URL, docs path, or text content."),
        type: s("Source type: github-profile, github-repo, docs, or text."),
      },
    },
  },

  // ── SearchLane (live via Stacklane API) ─────────────────────
  {
    name: "searchlane_query",
    description: "Search the web via SearchLane and return results.",
    inputSchema: {
      type: "object", additionalProperties: false, required: ["query"],
      properties: {
        query: s("The search query."),
        count: s("Number of results to return (default 8)."),
      },
    },
  },
  {
    name: "searchlane_news",
    description: "Search for recent news articles via SearchLane.",
    inputSchema: {
      type: "object", additionalProperties: false, required: ["query"],
      properties: {
        query: s("The news search query."),
        count: s("Number of articles to return (default 8)."),
      },
    },
  },
  {
    name: "searchlane_research",
    description: "Perform deep research on a topic via SearchLane.",
    inputSchema: {
      type: "object", additionalProperties: false, required: ["topic"],
      properties: {
        topic: s("The research topic."),
        depth: s("Research depth: quick, standard, or deep."),
      },
    },
  },

  // ── GeoLane (live via Stacklane API) ─────────────────────────
  {
    name: "geolane_audit",
    description: "Audit a URL for geo-specific SEO signals via GeoLane.",
    inputSchema: {
      type: "object", additionalProperties: false, required: ["url"],
      properties: {
        url: s("The URL to audit."),
      },
    },
  },
  {
    name: "geolane_compare",
    description: "Compare geo-targeting between two URLs via GeoLane.",
    inputSchema: {
      type: "object", additionalProperties: false, required: ["urlA", "urlB"],
      properties: {
        urlA: s("First URL to compare."),
        urlB: s("Second URL to compare."),
      },
    },
  },

  // ── Agent Browser (live via Stacklane API) ──────────────────
  {
    name: "agent_browser_check",
    description: "Check if a URL is accessible and analyze its content via Agent Browser.",
    inputSchema: {
      type: "object", additionalProperties: false, required: ["url"],
      properties: {
        url: s("The URL to check."),
      },
    },
  },
  {
    name: "agent_browser_screenshot",
    description: "Take a screenshot of a URL via Agent Browser.",
    inputSchema: {
      type: "object", additionalProperties: false, required: ["url"],
      properties: {
        url: s("The URL to screenshot."),
      },
    },
  },

  // ── InvoiceLane (live via Stacklane API) ─────────────────────
  {
    name: "invoicelane_extract",
    description: "Extract structured data from an invoice or receipt via InvoiceLane.",
    inputSchema: {
      type: "object", additionalProperties: false, required: ["file"],
      properties: {
        file: s("Path or URL to the invoice/receipt file."),
      },
    },
  },

  // ── MemoryLane (experimental — standalone server) ──────────
  {
    name: "memorylane_remember",
    description: "[Experimental] Store a memory via a self-hosted MemoryLane server.",
    inputSchema: {
      type: "object", additionalProperties: false, required: ["key", "value"],
      properties: {
        key: s("Memory key."),
        value: s("Memory value (any JSON-serializable data)."),
        session: s("Optional session ID for namespacing."),
      },
    },
  },
  {
    name: "memorylane_recall",
    description: "[Experimental] Retrieve a memory by key from a self-hosted MemoryLane server.",
    inputSchema: {
      type: "object", additionalProperties: false, required: ["key"],
      properties: {
        key: s("Memory key to recall."),
        session: s("Optional session ID."),
      },
    },
  },
  {
    name: "memorylane_search",
    description: "[Experimental] Search memories via a self-hosted MemoryLane server.",
    inputSchema: {
      type: "object", additionalProperties: false, required: ["query"],
      properties: {
        query: s("Search query."),
        session: s("Optional session ID."),
      },
    },
  },

  // ── GateLane (experimental — standalone server) ────────────
  {
    name: "gatelane_list_tools",
    description: "[Experimental] List available tools from a self-hosted GateLane server.",
    inputSchema: {
      type: "object", additionalProperties: false,
      properties: {},
    },
  },
  {
    name: "gatelane_call_tool",
    description: "[Experimental] Call a tool through a self-hosted GateLane server.",
    inputSchema: {
      type: "object", additionalProperties: false, required: ["server", "tool"],
      properties: {
        server: s("GateLane server name."),
        tool: s("Tool name to call."),
        args: s("JSON-encoded tool arguments."),
      },
    },
  },

  // ── x-agent (experimental — standalone server) ─────────────
  {
    name: "x_agent_score",
    description: "[Experimental] Score an X/Twitter opportunity via a self-hosted x-agent server.",
    inputSchema: {
      type: "object", additionalProperties: false, required: ["url"],
      properties: {
        url: s("X/Twitter post URL to score."),
      },
    },
  },

  // ── DevTool (experimental — local CLI) ─────────────────────
  {
    name: "devtool_run",
    description: "[Experimental] Run a Talocode DevTool command locally.",
    inputSchema: {
      type: "object", additionalProperties: false, required: ["command"],
      properties: {
        command: s("DevTool command to run (e.g. lint, format, scaffold)."),
        args: s("Additional arguments passed to DevTool."),
      },
    },
  },
];

const TOOL_MAP = new Map(TOOL_DEFINITIONS.map((t) => [t.name, t]));

function hasValue(v) {
  return v !== undefined && v !== null && v !== "";
}

function getAction(name) {
  const map = {
    tera_chat: "chat",
    tera_review: "review",
    tera_explain: "explain",
    tera_write: "write",
    tera_rewrite: "rewrite",
    tera_draft: "draft",
    skills_generate: "skills-generate",
    searchlane_query: "searchlane-query",
    searchlane_news: "searchlane-news",
    searchlane_research: "searchlane-research",
    geolane_audit: "geolane-audit",
    geolane_compare: "geolane-compare",
    agent_browser_check: "agent-browser-check",
    agent_browser_screenshot: "agent-browser-screenshot",
    invoicelane_extract: "invoicelane-extract",
    memorylane_remember: "memorylane-remember",
    memorylane_recall: "memorylane-recall",
    memorylane_search: "memorylane-search",
    gatelane_list_tools: "gatelane-list-tools",
    gatelane_call_tool: "gatelane-call-tool",
    x_agent_score: "x-agent-score",
    devtool_run: "devtool-run",
  };
  return map[name] || null;
}

export function listToolDefinitions() {
  return TOOL_DEFINITIONS.map((t) => ({ ...t }));
}

export function buildCompanionInvocation(toolName, input = {}) {
  if (!TOOL_MAP.has(toolName)) throw new Error(`Unknown tool: ${toolName}`);
  const action = getAction(toolName);
  const args = [action];
  for (const [key, value] of Object.entries(input)) {
    if (hasValue(value)) {
      args.push(`--${key}`, String(value));
    }
  }
  return { args };
}

export function runCompanion(toolName, input = {}) {
  if (!TOOL_MAP.has(toolName)) {
    return Promise.resolve({
      isError: true,
      content: [{ type: "text", text: `Unknown tool: ${toolName}` }],
    });
  }

  const { args } = buildCompanionInvocation(toolName, input);
  return new Promise((resolve) => {
    const child = spawn(process.execPath, [COMPANION, ...args], {
      cwd: process.cwd(),
      env: { ...process.env, FORCE_COLOR: "0" },
      stdio: ["ignore", "pipe", "pipe"],
    });

    const chunks = [];
    child.stdout.on("data", (c) => chunks.push(c));
    child.stderr.on("data", (c) => chunks.push(c));

    child.on("error", (err) => {
      resolve({
        isError: true,
        content: [{ type: "text", text: `Failed to start companion: ${err.message}` }],
      });
    });

    child.on("close", (code, signal) => {
      const output = Buffer.concat(chunks).toString().trim();
      const text = output || `talocode exited with code ${code ?? signal}`;
      resolve({
        isError: code !== 0,
        content: [{ type: "text", text }],
      });
    });
  });
}

function send(msg) {
  process.stdout.write(JSON.stringify(msg) + "\n");
}

async function handle(msg) {
  const id = msg.id;
  try {
    switch (msg.method) {
      case "initialize":
        return {
          jsonrpc: "2.0", id,
          result: {
            protocolVersion: msg.params?.protocolVersion || "2024-11-05",
            capabilities: { tools: {} },
            serverInfo: { name: "talocode-in-codex", version: SERVER_VERSION },
          },
        };
      case "tools/list":
        return { jsonrpc: "2.0", id, result: { tools: listToolDefinitions() } };
      case "tools/call": {
        const result = await runCompanion(msg.params?.name, msg.params?.arguments || {});
        return { jsonrpc: "2.0", id, result };
      }
      case "notifications/initialized":
      case "notifications/cancelled":
        return null;
      default:
        if (id === undefined || id === null) return null;
        return {
          jsonrpc: "2.0", id,
          error: { code: -32601, message: `Unknown method: ${msg.method}` },
        };
    }
  } catch (err) {
    if (id === undefined || id === null) return null;
    return {
      jsonrpc: "2.0", id,
      error: { code: -32603, message: err instanceof Error ? err.message : String(err) },
    };
  }
}

function start() {
  const lines = readline.createInterface({ input: process.stdin, crlfDelay: Infinity });
  lines.on("line", (line) => {
    if (!line.trim()) return;
    let msg;
    try { msg = JSON.parse(line); } catch { return; }
    if (msg.method === undefined && msg.id !== undefined) return;
    void handle(msg).then((r) => { if (r) send(r); });
  });
}

if (process.argv[1] === fileURLToPath(import.meta.url)) start();

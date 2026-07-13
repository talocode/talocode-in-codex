#!/usr/bin/env node

import { spawn } from "node:child_process";
import path from "node:path";
import readline from "node:readline";
import { fileURLToPath } from "node:url";

const SERVER_VERSION = "0.1.0";
const ROOT_DIR = path.resolve(fileURLToPath(new URL("..", import.meta.url)));
const COMPANION = path.join(ROOT_DIR, "scripts", "talocode-client.mjs");

const s = (d) => ({ type: "string", description: d });
const b = (d) => ({ type: "boolean", description: d });

const TOOL_DEFINITIONS = [
  {
    name: "tera_chat",
    description: "Send a chat message to Tera AI and get a response.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      required: ["message"],
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
      type: "object",
      additionalProperties: false,
      required: ["code"],
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
      type: "object",
      additionalProperties: false,
      required: ["code"],
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
      type: "object",
      additionalProperties: false,
      required: ["task"],
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
      type: "object",
      additionalProperties: false,
      required: ["text"],
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
      type: "object",
      additionalProperties: false,
      required: ["topic"],
      properties: {
        topic: s("The topic or outline for the draft."),
        format: s("Desired format (blog, docs, proposal, readme)."),
      },
    },
  },
  {
    name: "skills_generate",
    description: "Generate an AI skill pack from a GitHub profile, repo, docs, or text input.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      required: ["input"],
      properties: {
        input: s("GitHub username, repo URL, docs path, or text content."),
        type: s("Source type: github-profile, github-repo, docs, or text."),
      },
    },
  },
];

const TOOL_MAP = new Map(TOOL_DEFINITIONS.map((t) => [t.name, t]));

function hasValue(v) {
  return v !== undefined && v !== null && v !== "";
}

function getAction(name) {
  switch (name) {
    case "tera_chat": return "chat";
    case "tera_review": return "review";
    case "tera_explain": return "explain";
    case "tera_write": return "write";
    case "tera_rewrite": return "rewrite";
    case "tera_draft": return "draft";
    case "skills_generate": return "skills-generate";
    default: return null;
  }
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
  const { args } = buildCompanionInvocation(toolName, input);
  return new Promise((resolve) => {
    const child = spawn(process.execPath, [COMPANION, ...args], {
      cwd: process.cwd(),
      env: { ...process.env, FORCE_COLOR: "0" },
      stdio: ["ignore", "pipe", "pipe"],
    });
    let stdout = "", stderr = "";
    child.stdout.on("data", (c) => { stdout += c; });
    child.stderr.on("data", (c) => { stderr += c; });
    child.on("close", (code, signal) => {
      const text = stdout || stderr || `talocode exited with code ${code ?? signal}`;
      resolve({ isError: code !== 0, content: [{ type: "text", text }] });
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
        return { jsonrpc: "2.0", id, result: { protocolVersion: msg.params?.protocolVersion || "2024-11-05", capabilities: { tools: {} }, serverInfo: { name: "talocode-in-codex", version: SERVER_VERSION } } };
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
        return { jsonrpc: "2.0", id, error: { code: -32601, message: `Unknown method: ${msg.method}` } };
    }
  } catch (err) {
    if (id === undefined || id === null) return null;
    return { jsonrpc: "2.0", id, error: { code: -32603, message: err.message } };
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

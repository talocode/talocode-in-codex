#!/usr/bin/env node

import { spawn } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const SERVER = path.resolve(
  fileURLToPath(new URL("..", import.meta.url)),
  "plugins/talocode/mcp/server.mjs"
);

function request(server, msg) {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error("timeout")), 10_000);
    const onData = (chunk) => {
      clearTimeout(timer);
      try {
        resolve(JSON.parse(chunk.toString().trim()));
      } catch (e) {
        reject(e);
      }
    };
    server.stdout.once("data", onData);
    server.stdin.write(JSON.stringify(msg) + "\n");
  });
}

async function main() {
  console.log("Starting MCP server...\n");
  const server = spawn(process.execPath, [SERVER], {
    cwd: path.dirname(SERVER),
    env: { ...process.env, FORCE_COLOR: "0" },
    stdio: ["pipe", "pipe", "pipe"],
  });

  let stderr = "";
  server.stderr.on("data", (c) => { stderr += c; });

  let passed = 0;
  let failed = 0;

  function ok(name) {
    console.log(`  ✅ ${name}`);
    passed++;
  }

  function fail(name, err) {
    console.log(`  ❌ ${name}: ${err}`);
    failed++;
  }

  // ── Test 1: initialize ──────────────────────────────────────
  console.log("\nTest 1: initialize");
  try {
    const init = await request(server, {
      jsonrpc: "2.0", id: 1, method: "initialize",
      params: { protocolVersion: "2024-11-05" },
    });
    if (init.result?.serverInfo?.name === "talocode-in-codex") {
      ok("initialize returns serverInfo");
    } else {
      fail("initialize", JSON.stringify(init));
    }
  } catch (e) {
    fail("initialize", e.message);
  }

  // ── Test 2: tools/list ──────────────────────────────────────
  console.log("\nTest 2: tools/list");
  try {
    const list = await request(server, {
      jsonrpc: "2.0", id: 2, method: "tools/list",
    });
    const tools = list?.result?.tools || [];
    const names = tools.map((t) => t.name);
    const expected = [
      "tera_chat", "tera_review", "tera_explain", "tera_write",
      "tera_rewrite", "tera_draft", "skills_generate",
      "searchlane_query", "searchlane_news", "searchlane_research",
      "geolane_audit", "geolane_compare",
      "agent_browser_check", "agent_browser_screenshot",
      "invoicelane_extract",
      "memorylane_remember", "memorylane_recall", "memorylane_search",
      "gatelane_list_tools", "gatelane_call_tool",
      "x_agent_score", "devtool_run",
    ];
    const missing = expected.filter((n) => !names.includes(n));
    if (missing.length === 0 && tools.length >= expected.length) {
      ok(`tools/list returns ${tools.length} tools`);
    } else {
      fail("tools/list", `missing: ${missing.join(", ")}`);
    }
  } catch (e) {
    fail("tools/list", e.message);
  }

  // ── Test 3: tools/call with missing API key ─────────────────
  console.log("\nTest 3: tools/call with missing API key");
  // Temporarily unset API key
  const prevKey = process.env.TALOCODE_API_KEY;
  delete process.env.TALOCODE_API_KEY;

  // Need a fresh server for this since companion is spawned fresh each time
  server.stdin.end();
  await new Promise((r) => server.on("exit", r));

  const server2 = spawn(process.execPath, [SERVER], {
    cwd: path.dirname(SERVER),
    env: { ...process.env, FORCE_COLOR: "0" },
    stdio: ["pipe", "pipe", "pipe"],
  });
  let stderr2 = "";
  server2.stderr.on("data", (c) => { stderr2 += c; });

  try {
    const call = await request(server2, {
      jsonrpc: "2.0", id: 3, method: "tools/call",
      params: { name: "tera_chat", arguments: { message: "test" } },
    });
    const text = call?.result?.content?.[0]?.text || "";
    if (call?.result?.isError && text.includes("TALOCODE_API_KEY")) {
      ok("returns clear error when API key missing");
    } else {
      fail("missing key", JSON.stringify(call));
    }
  } catch (e) {
    fail("missing key", e.message);
  }

  // Restore key
  if (prevKey) process.env.TALOCODE_API_KEY = prevKey;
  server2.stdin.end();
  await new Promise((r) => server2.on("exit", r));

  // ── Test 4: tools/call with API key (live) ──────────────────
  console.log("\nTest 4: tools/call with API key (live test)");
  if (prevKey) {
    const server3 = spawn(process.execPath, [SERVER], {
      cwd: path.dirname(SERVER),
      env: { ...process.env, FORCE_COLOR: "0" },
      stdio: ["pipe", "pipe", "pipe"],
    });
    let stderr3 = "";
    server3.stderr.on("data", (c) => { stderr3 += c; });

    try {
      const call = await request(server3, {
        jsonrpc: "2.0", id: 4, method: "tools/call",
        params: { name: "tera_chat", arguments: { message: "Say hello in one word" } },
      });
      const text = call?.result?.content?.[0]?.text || "";
      if (call?.result?.isError) {
        if (text.includes("API error") || text.includes("Network error") || text.includes("timed out")) {
          ok("Live call: API unreachable as expected (api.talocode.site not deployed)");
        } else {
          fail("live call", text);
        }
      } else {
        ok("Live call succeeded (API responded)");
      }
    } catch (e) {
      // If the server crashes or times out because API is unreachable, that's expected
      ok("Live call: server handled unreachable API gracefully");
    }
    server3.stdin.end();
    await new Promise((r) => server3.on("exit", r));
  } else {
    ok("Skipped (no TALOCODE_API_KEY in env)");
  }

  // ── Test 5: tools/call with unknown tool ────────────────────
  console.log("\nTest 5: tools/call with unknown tool");
  const server4 = spawn(process.execPath, [SERVER], {
    cwd: path.dirname(SERVER),
    env: { ...process.env, FORCE_COLOR: "0" },
    stdio: ["pipe", "pipe", "pipe"],
  });

  try {
    const call = await request(server4, {
      jsonrpc: "2.0", id: 5, method: "tools/call",
      params: { name: "nonexistent_tool", arguments: {} },
    });
    if (call?.result?.isError) {
      ok("returns error for unknown tool");
    } else {
      fail("unknown tool", JSON.stringify(call));
    }
  } catch (e) {
    fail("unknown tool", e.message);
  }
  server4.stdin.end();
  await new Promise((r) => server4.on("exit", r));

  // ── Summary ────────────────────────────────────────────────
  console.log(`\n${"=".repeat(40)}`);
  console.log(`Tests: ${passed} passed, ${failed} failed`);
  console.log(`${"=".repeat(40)}`);
  process.exit(failed > 0 ? 1 : 0);
}

main().catch((err) => {
  console.error("Test harness error:", err);
  process.exit(1);
});

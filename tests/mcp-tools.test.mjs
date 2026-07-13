import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  listToolDefinitions,
  buildCompanionInvocation,
} from "../plugins/talocode/mcp/server.mjs";

const EXPECTED_TOOLS = [
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

describe("talocode MCP server", () => {
  it("lists all tool definitions", () => {
    const tools = listToolDefinitions();
    const names = tools.map((t) => t.name);
    for (const name of EXPECTED_TOOLS) {
      assert.ok(names.includes(name), `missing tool: ${name}`);
    }
    assert.equal(tools.length, EXPECTED_TOOLS.length);
  });

  it("each tool has inputSchema with type object", () => {
    for (const t of listToolDefinitions()) {
      assert.equal(t.inputSchema.type, "object", `${t.name} schema type`);
      assert.ok(t.inputSchema.properties, `${t.name} has properties`);
    }
  });

  it("builds companion invocation for tera_chat", () => {
    const { args } = buildCompanionInvocation("tera_chat", {
      message: "Hello Tera",
      system: "Be helpful",
    });
    assert.deepEqual(args, ["chat", "--message", "Hello Tera", "--system", "Be helpful"]);
  });

  it("builds companion invocation for searchlane_query", () => {
    const { args } = buildCompanionInvocation("searchlane_query", {
      query: "TypeScript best practices",
      count: "5",
    });
    assert.deepEqual(args, ["searchlane-query", "--query", "TypeScript best practices", "--count", "5"]);
  });

  it("builds companion invocation for geolane_compare", () => {
    const { args } = buildCompanionInvocation("geolane_compare", {
      urlA: "https://example.com",
      urlB: "https://example.co.uk",
    });
    assert.deepEqual(args, ["geolane-compare", "--urlA", "https://example.com", "--urlB", "https://example.co.uk"]);
  });

  it("builds companion invocation with single arg", () => {
    const { args } = buildCompanionInvocation("tera_review", {
      code: "fn main() {}",
    });
    assert.deepEqual(args, ["review", "--code", "fn main() {}"]);
  });

  it("skips empty values", () => {
    const { args } = buildCompanionInvocation("tera_chat", {
      message: "hi",
      system: undefined,
    });
    assert.deepEqual(args, ["chat", "--message", "hi"]);
  });

  it("throws for unknown tool", () => {
    assert.throws(() => buildCompanionInvocation("nonexistent"), /Unknown/);
  });

  it("gatelane_list_tools has no required fields", () => {
    const tools = listToolDefinitions();
    const t = tools.find((x) => x.name === "gatelane_list_tools");
    assert.ok(t);
    assert.deepEqual(t.inputSchema.required, undefined);
  });

  it("devtool_run has required command field", () => {
    const tools = listToolDefinitions();
    const t = tools.find((x) => x.name === "devtool_run");
    assert.ok(t);
    assert.ok(t.inputSchema.required.includes("command"));
  });
});

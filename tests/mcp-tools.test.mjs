import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  listToolDefinitions,
  buildCompanionInvocation,
} from "../plugins/talocode/mcp/server.mjs";

describe("talocode MCP server", () => {
  it("lists all tool definitions", () => {
    const tools = listToolDefinitions();
    const names = tools.map((t) => t.name);
    assert.ok(names.includes("tera_chat"));
    assert.ok(names.includes("tera_review"));
    assert.ok(names.includes("tera_explain"));
    assert.ok(names.includes("tera_write"));
    assert.ok(names.includes("tera_rewrite"));
    assert.ok(names.includes("tera_draft"));
    assert.ok(names.includes("skills_generate"));
    assert.equal(tools.length, 7);
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
});

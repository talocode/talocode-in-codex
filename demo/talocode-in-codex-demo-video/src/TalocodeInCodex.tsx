import React from "react";
import { AbsoluteFill, Sequence, Audio, staticFile, useCurrentFrame, useVideoConfig, interpolate, Easing, spring } from "remotion";

const FPS = 30;
const BG = "#05070a";
const ACCENT = "#F97316";
const ACCENT_BLUE = "#60A5FA";
const TEXT = "#F4F7FB";
const MUTED = "#98A7BB";
const DIM = "#6B7280";
const GREEN = "#86EFAC";
const YELLOW = "#FBBF24";

const fontFamily = "Inter, system-ui, -apple-system, sans-serif";
const mono = "'SF Mono', 'Cascadia Code', 'JetBrains Mono', Consolas, monospace";

const palette = { BG, ACCENT, ACCENT_BLUE, TEXT, MUTED, DIM, GREEN, YELLOW };

function Scene({ children, withFooter = true }: { children: React.ReactNode; withFooter?: boolean }) {
  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(ellipse at 50% 10%, rgba(249,115,22,0.12), transparent 35%), radial-gradient(ellipse at 80% 90%, rgba(96,165,250,0.06), transparent 30%), linear-gradient(180deg, #070b10 0%, ${BG} 100%)`,
        padding: 80,
        fontFamily,
        color: TEXT,
      }}
    >
      {children}
      {withFooter && (
        <div
          style={{
            position: "absolute",
            left: 80,
            right: 80,
            bottom: 40,
            display: "flex",
            justifyContent: "space-between",
            color: DIM,
            fontSize: 16,
            letterSpacing: 0.3,
          }}
        >
          <span>talocode-in-codex</span>
          <span>Talocode inside Codex</span>
        </div>
      )}
    </AbsoluteFill>
  );
}

function Dot({ color }: { color: string }) {
  return <div style={{ width: 14, height: 14, borderRadius: "50%", background: color }} />;
}

function Terminal({ children, title = "talocode" }: { children: React.ReactNode; title?: string }) {
  return (
    <div
      style={{
        borderRadius: 16,
        background: "linear-gradient(180deg, #111827 0%, #080c12 100%)",
        border: "1px solid rgba(255,255,255,0.08)",
        boxShadow: "0 20px 80px rgba(0,0,0,0.5)",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          padding: "12px 16px",
          background: "rgba(255,255,255,0.03)",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <Dot color="#ff5f56" />
        <Dot color="#ffbd2e" />
        <Dot color="#27c93f" />
        <span style={{ marginLeft: 10, color: MUTED, fontSize: 14 }}>{title}</span>
      </div>
      <div style={{ padding: 28, fontFamily: mono, fontSize: 22, lineHeight: 1.6 }}>{children}</div>
    </div>
  );
}

function TypewriterText({ text, startFrame, frame, fps, cps = 14 }: { text: string; startFrame: number; frame: number; fps: number; cps?: number }) {
  const chars = Math.max(0, Math.min(text.length, Math.floor((frame - startFrame) * (cps / fps))));
  return <span>{text.slice(0, chars)}{chars < text.length ? <span style={{ opacity: 0.7 }}>▊</span> : null}</span>;
}

function FadeIn({
  children,
  frame,
  start,
  duration = 20,
  style,
}: {
  children: React.ReactNode;
  frame: number;
  start: number;
  duration?: number;
  style?: React.CSSProperties;
}) {
  const progress = interpolate(frame, [start, start + duration], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });
  return <div style={{ ...style, opacity: progress, transform: `translateY(${(1 - progress) * 20}px)` }}>{children}</div>;
}

function SlideUp({
  children,
  frame,
  start,
  duration = 20,
  style,
}: {
  children: React.ReactNode;
  frame: number;
  start: number;
  duration?: number;
  style?: React.CSSProperties;
}) {
  const progress = interpolate(frame, [start, start + duration], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });
  return (
    <div
      style={{
        ...style,
        opacity: progress,
        transform: `translateY(${(1 - progress) * 30}px)`,
      }}
    >
      {children}
    </div>
  );
}

// ── Scene 1: Opening (0–150) ─────────────────────────────────
function OpeningScene({ frame, fps }: { frame: number; fps: number }) {
  return (
    <Scene>
      <div style={{ display: "flex", height: "100%", alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center" }}>
          <SlideUp frame={frame} start={0}>
            <div style={{ fontSize: 88, fontWeight: 800, letterSpacing: -3, color: ACCENT }}>talocode-in-codex</div>
          </SlideUp>
          <SlideUp frame={frame} start={20}>
            <div style={{ fontSize: 44, fontWeight: 600, color: TEXT, marginTop: 12 }}>Talocode inside Codex</div>
          </SlideUp>
          <SlideUp frame={frame} start={40}>
            <div style={{ fontSize: 26, color: MUTED, marginTop: 20 }}>Use Talocode APIs as MCP tools</div>
          </SlideUp>
          <SlideUp frame={frame} start={60}>
            <div
              style={{
                marginTop: 40,
                fontSize: 20,
                color: DIM,
                letterSpacing: 4,
                fontWeight: 600,
              }}
            >
              Tera · SearchLane · GeoLane · Skills · MemoryLane · GateLane
            </div>
          </SlideUp>
          <SlideUp frame={frame} start={80}>
            <div style={{ marginTop: 60 }}>
              <div
                style={{
                  display: "inline-block",
                  padding: "14px 32px",
                  borderRadius: 999,
                  border: "1px solid rgba(249,115,22,0.3)",
                  background: "rgba(249,115,22,0.08)",
                  fontSize: 20,
                  color: ACCENT,
                  letterSpacing: 0.5,
                }}
              >
                v0.2.0 · Open Source · MIT
              </div>
            </div>
          </SlideUp>
        </div>
      </div>
    </Scene>
  );
}

// ── Scene 2: Install (150–330) ────────────────────────────────
function InstallScene({ frame, fps }: { frame: number; fps: number }) {
  const s = 150;
  return (
    <Scene>
      <div style={{ maxWidth: 1200 }}>
        <FadeIn frame={frame} start={s}>
          <div style={{ fontSize: 56, fontWeight: 800, letterSpacing: -1 }}>Install</div>
        </FadeIn>
        <FadeIn frame={frame} start={s + 15}>
          <div style={{ fontSize: 22, color: MUTED, marginTop: 10, marginBottom: 50 }}>One command to bring Talocode into any MCP host</div>
        </FadeIn>
        <SlideUp frame={frame} start={s + 30}>
          <Terminal>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <span style={{ color: GREEN }}>$</span>
              <span>
                <TypewriterText text="codex plugin marketplace add talocode/talocode-in-codex" startFrame={s + 30} frame={frame} fps={fps} cps={16} />
              </span>
            </div>
            {frame > s + 80 && (
              <>
                <div style={{ color: GREEN, marginTop: 20 }}>
                  <FadeIn frame={frame} start={s + 85}>✓ Plugin installed</FadeIn>
                </div>
                <div style={{ color: GREEN, marginTop: 8 }}>
                  <FadeIn frame={frame} start={s + 95}>✓ MCP server configured</FadeIn>
                </div>
                <div style={{ color: ACCENT, marginTop: 8 }}>
                  <FadeIn frame={frame} start={s + 105}>✓ 22 tools available</FadeIn>
                </div>
              </>
            )}
          </Terminal>
        </SlideUp>
        {frame > s + 115 && (
          <FadeIn frame={frame} start={s + 120}>
            <div
              style={{
                marginTop: 30,
                padding: "16px 24px",
                borderRadius: 12,
                background: "rgba(96,165,250,0.08)",
                border: "1px solid rgba(96,165,250,0.2)",
              }}
            >
              <div style={{ fontSize: 18, color: MUTED }}>Set your API key:</div>
              <div style={{ fontSize: 22, color: TEXT, fontFamily: mono, marginTop: 8 }}>export TALOCODE_API_KEY=tc_key_xxxxx</div>
            </div>
          </FadeIn>
        )}
      </div>
    </Scene>
  );
}

// ── Scene 3: Tools overview (330–540) ─────────────────────────
function ToolsScene({ frame, fps }: { frame: number; fps: number }) {
  const s = 330;
  const tools = [
    { name: "tera_chat", product: "Tera", live: true },
    { name: "tera_review", product: "Tera", live: true },
    { name: "tera_explain", product: "Tera", live: true },
    { name: "tera_write", product: "Tera", live: true },
    { name: "tera_rewrite", product: "Tera", live: true },
    { name: "tera_draft", product: "Tera", live: true },
    { name: "skills_generate", product: "Skills", live: true },
    { name: "searchlane_query", product: "SearchLane", live: true },
    { name: "searchlane_news", product: "SearchLane", live: true },
    { name: "searchlane_research", product: "SearchLane", live: true },
    { name: "geolane_audit", product: "GeoLane", live: true },
    { name: "geolane_compare", product: "GeoLane", live: true },
    { name: "agent_browser_check", product: "Agent Browser", live: true },
    { name: "agent_browser_screenshot", product: "Agent Browser", live: true },
    { name: "invoicelane_extract", product: "InvoiceLane", live: true },
    { name: "memorylane_remember", product: "MemoryLane", live: false },
    { name: "memorylane_recall", product: "MemoryLane", live: false },
    { name: "memorylane_search", product: "MemoryLane", live: false },
    { name: "gatelane_list_tools", product: "GateLane", live: false },
    { name: "gatelane_call_tool", product: "GateLane", live: false },
    { name: "x_agent_score", product: "x-agent", live: false },
    { name: "devtool_run", product: "DevTool", live: false },
  ];

  const products = [
    { name: "Tera", tools: tools.filter((t) => t.product === "Tera"), live: true, count: 6 },
    { name: "Skills", tools: tools.filter((t) => t.product === "Skills"), live: true, count: 1 },
    { name: "SearchLane", tools: tools.filter((t) => t.product === "SearchLane"), live: true, count: 3 },
    { name: "GeoLane", tools: tools.filter((t) => t.product === "GeoLane"), live: true, count: 2 },
    { name: "Agent Browser", tools: tools.filter((t) => t.product === "Agent Browser"), live: true, count: 2 },
    { name: "InvoiceLane", tools: tools.filter((t) => t.product === "InvoiceLane"), live: true, count: 1 },
    { name: "MemoryLane", tools: tools.filter((t) => t.product === "MemoryLane"), live: false, count: 3 },
    { name: "GateLane", tools: tools.filter((t) => t.product === "GateLane"), live: false, count: 2 },
    { name: "x-agent", tools: tools.filter((t) => t.product === "x-agent"), live: false, count: 1 },
    { name: "DevTool", tools: tools.filter((t) => t.product === "DevTool"), live: false, count: 1 },
  ];

  return (
    <Scene>
      <FadeIn frame={frame} start={s}>
        <div style={{ fontSize: 56, fontWeight: 800, letterSpacing: -1 }}>22 MCP Tools</div>
      </FadeIn>
      <div
        style={{
          marginTop: 40,
          display: "grid",
          gridTemplateColumns: "repeat(2, 1fr)",
          gap: 12,
          maxWidth: 1400,
        }}
      >
        {products.map((p, i) => (
          <FadeIn key={p.name} frame={frame} start={s + 15 + i * 8} duration={12}>
            <div
              style={{
                padding: "12px 18px",
                borderRadius: 12,
                background: p.live ? "rgba(134,239,172,0.06)" : "rgba(251,191,36,0.05)",
                border: `1px solid ${p.live ? "rgba(134,239,172,0.15)" : "rgba(251,191,36,0.12)"}`,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    background: p.live ? GREEN : YELLOW,
                  }}
                />
                <span style={{ fontSize: 20, fontWeight: 700, color: TEXT }}>{p.name}</span>
                <span style={{ fontSize: 14, color: DIM }}>({p.count})</span>
                {!p.live && <span style={{ fontSize: 12, color: YELLOW, marginLeft: 6 }}>exp.</span>}
              </div>
              <div style={{ marginTop: 6, fontSize: 14, color: MUTED, fontFamily: mono }}>
                {p.tools.map((t) => t.name.replace(`${p.name.toLowerCase().replace(" ", "-")}_`, "").replace(`${p.name.toLowerCase()}_`, "")).join(",  ")}
              </div>
            </div>
          </FadeIn>
        ))}
      </div>
      <FadeIn frame={frame} start={s + 120}>
        <div style={{ marginTop: 20, fontSize: 18, color: DIM }}>All tools authenticate via Bearer token → api.talocode.site</div>
      </FadeIn>
    </Scene>
  );
}

// ── Scene 4: Architecture (540–720) ───────────────────────────
function ArchitectureScene({ frame, fps }: { frame: number; fps: number }) {
  const s = 540;
  const layers = [
    { label: "Codex / OpenCode / Claude", color: ACCENT, y: 100 },
    { label: "│ JSON-RPC stdin/stdout", color: DIM, y: 200 },
    { label: "MCP Server (server.mjs)", color: ACCENT_BLUE, y: 260 },
    { label: "│ spawns child process", color: DIM, y: 370 },
    { label: "Companion CLI (client.mjs)", color: GREEN, y: 430 },
    { label: "│ HTTP POST · Bearer auth", color: DIM, y: 540 },
    { label: "api.talocode.site", color: ACCENT, y: 600 },
  ];

  return (
    <Scene>
      <FadeIn frame={frame} start={s}>
        <div style={{ fontSize: 56, fontWeight: 800, letterSpacing: -1 }}>Architecture</div>
      </FadeIn>
      <FadeIn frame={frame} start={s + 10}>
        <div style={{ fontSize: 20, color: MUTED, marginTop: 8, marginBottom: 30 }}>Zero npm dependencies · Vanilla Node.js · Newline-delimited JSON-RPC</div>
      </FadeIn>
      <div style={{ position: "relative", paddingLeft: 60 }}>
        {layers.map((layer, i) => (
          <div key={i}>
            {i > 0 && (
              <div
                style={{
                  position: "absolute",
                  left: 60 + 12,
                  top: layers[i - 1].y + 30,
                  width: 2,
                  height: layer.y - layers[i - 1].y - 30,
                  background: "rgba(255,255,255,0.08)",
                }}
              />
            )}
            <FadeIn frame={frame} start={s + 20 + i * 15}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 16,
                  marginBottom: i === 0 || i === layers.length - 1 ? 20 : 0,
                }}
              >
                {i % 2 === 0 ? (
                  <div
                    style={{
                      padding: "10px 24px",
                      borderRadius: 12,
                      border: `1px solid ${layer.color}33`,
                      background: `${layer.color}10`,
                      fontSize: 24,
                      color: layer.color,
                      fontFamily: mono,
                      fontWeight: 600,
                    }}
                  >
                    {layer.label}
                  </div>
                ) : (
                  <div style={{ fontSize: 18, color: layer.color, fontFamily: mono, padding: "0 24px" }}>{layer.label}</div>
                )}
              </div>
            </FadeIn>
          </div>
        ))}
      </div>
    </Scene>
  );
}

// ── Scene 5: MCP Server init (720–900) ────────────────────────
function MCPScene({ frame, fps }: { frame: number; fps: number }) {
  const s = 720;
  return (
    <Scene>
      <FadeIn frame={frame} start={s}>
        <div style={{ fontSize: 56, fontWeight: 800, letterSpacing: -1 }}>MCP Protocol</div>
      </FadeIn>
      <FadeIn frame={frame} start={s + 10}>
        <div style={{ fontSize: 20, color: MUTED, marginTop: 8, marginBottom: 30 }}>Standard JSON-RPC 2.0 over stdin/stdout</div>
      </FadeIn>
      <SlideUp frame={frame} start={s + 20}>
        <Terminal title="MCP server log">
          <div>
            <span style={{ color: GREEN }}>→</span>{" "}
            <TypewriterText text={`{"jsonrpc":"2.0","id":1,"method":"initialize"}`} startFrame={s + 25} frame={frame} fps={fps} cps={20} />
          </div>
          {frame > s + 60 && (
            <div style={{ color: MUTED, marginTop: 6 }}>
              ← {"{"}"jsonrpc":"2.0","id":1,"result":{"protocolVersion":"2024-11-05","serverInfo":{"name":"talocode-in-codex","version":"0.2.0"}}}
            </div>
          )}
          {frame > s + 85 && (
            <div style={{ marginTop: 20 }}>
              <span style={{ color: GREEN }}>→</span>{" "}
              <TypewriterText text={`{"jsonrpc":"2.0","id":2,"method":"tools/list"}`} startFrame={s + 85} frame={frame} fps={fps} cps={20} />
            </div>
          )}
          {frame > s + 115 && (
            <div style={{ marginTop: 6, color: MUTED }}>
              ← {"{"}"id":2,"result":{"tools":[{"name":"tera_chat"},{"name":"tera_review"},{"name":"searchlane_query"},{"name":"geolane_audit"},{"name":"skills_generate"},{"name":"invoicelane_extract"},{"name":"memorylane_remember"},{"name":"gatelane_list_tools"},{"name":"x_agent_score"},{"name":"devtool_run"},"""... 12 more"]}}
            </div>
          )}
        </Terminal>
      </SlideUp>
    </Scene>
  );
}

// ── Scene 6: Tool call (900–1080) ─────────────────────────────
function ToolCallScene({ frame, fps }: { frame: number; fps: number }) {
  const s = 900;
  return (
    <Scene>
      <FadeIn frame={frame} start={s}>
        <div style={{ fontSize: 56, fontWeight: 800, letterSpacing: -1 }}>Tool in Action</div>
      </FadeIn>
      <FadeIn frame={frame} start={s + 10}>
        <div style={{ fontSize: 20, color: MUTED, marginTop: 8, marginBottom: 30 }}>tera_review — real AI-powered code review</div>
      </FadeIn>
      <div style={{ display: "flex", gap: 30, maxWidth: 1600 }}>
        <SlideUp frame={frame} start={s + 20} style={{ flex: 1 }}>
          <Terminal title="tools/call request">
            <div>
              <span style={{ color: GREEN }}>$</span> tools/call tera_review
            </div>
            <div style={{ marginTop: 16, color: MUTED }}>
              <TypewriterText
                text={`{
  "code": "function add(a,b){\\n  return a+b\\n}",
  "focus": "security"
}`}
                startFrame={s + 25}
                frame={frame}
                fps={fps}
                cps={25}
              />
            </div>
            {frame > s + 70 && (
              <div style={{ marginTop: 20, color: DIM, fontSize: 16 }}>
                POST /v1/tera/coding/review · 20 credits
              </div>
            )}
          </Terminal>
        </SlideUp>
        <SlideUp frame={frame} start={s + 40} style={{ flex: 1 }}>
          <Terminal title="response">
            {frame > s + 70 && (
              <div>
                <div style={{ color: ACCENT, fontSize: 24, marginBottom: 12 }}>Review Results</div>
                <div style={{ color: TEXT, fontSize: 18, lineHeight: 1.6 }}>
                  <div style={{ color: MUTED }}>• No input validation — add() accepts any type</div>
                  <div style={{ color: MUTED, marginTop: 6 }}>• Missing TypeScript types or JSDoc</div>
                  <div style={{ color: MUTED, marginTop: 6 }}>• Consider guard clauses and sanitization</div>
                  <div style={{ color: MUTED, marginTop: 6 }}>• No edge case handling for undefined/null</div>
                  <div style={{ marginTop: 20, color: GREEN, fontSize: 16 }}>← Response received · 20 credits consumed</div>
                </div>
              </div>
            )}
          </Terminal>
        </SlideUp>
      </div>
      {frame > s + 100 && (
        <FadeIn frame={frame} start={s + 100}>
          <div
            style={{
              marginTop: 20,
              padding: "12px 20px",
              borderRadius: 10,
              background: "rgba(96,165,250,0.06)",
              border: "1px solid rgba(96,165,250,0.15)",
              fontSize: 16,
              color: MUTED,
            }}
          >
            Companion script → HTTP POST with Bearer token → api.talocode.site/v1/tera/coding/review
          </div>
        </FadeIn>
      )}
    </Scene>
  );
}

// ── Scene 7: Closing + CTA (1080–1230) ────────────────────────
function ClosingScene({ frame, fps }: { frame: number; fps: number }) {
  const s = 1080;
  return (
    <Scene>
      <div style={{ display: "flex", height: "100%", alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center" }}>
          <SlideUp frame={frame} start={s}>
            <div style={{ fontSize: 80, fontWeight: 800, letterSpacing: -2, color: ACCENT }}>talocode-in-codex</div>
          </SlideUp>
          <SlideUp frame={frame} start={s + 15}>
            <div style={{ fontSize: 32, color: TEXT, marginTop: 12 }}>Talocode inside Codex</div>
          </SlideUp>
          <SlideUp frame={frame} start={s + 28}>
            <div style={{ fontSize: 20, color: MUTED, marginTop: 24 }}>22 tools · Zero npm deps · Open source · MIT</div>
          </SlideUp>
          <SlideUp frame={frame} start={s + 40}>
            <div
              style={{
                marginTop: 50,
                padding: "16px 32px",
                borderRadius: 12,
                background: "rgba(134,239,172,0.08)",
                border: "1px solid rgba(134,239,172,0.2)",
                display: "inline-block",
              }}
            >
              <div style={{ fontSize: 18, color: GREEN }}>Install now</div>
              <div style={{ fontSize: 20, color: TEXT, fontFamily: mono, marginTop: 6 }}>codex plugin marketplace add talocode/talocode-in-codex</div>
            </div>
          </SlideUp>
          <SlideUp frame={frame} start={s + 55}>
            <div style={{ marginTop: 30, fontSize: 24, color: ACCENT_BLUE }}>github.com/talocode/talocode-in-codex</div>
          </SlideUp>
          <SlideUp frame={frame} start={s + 65}>
            <div style={{ marginTop: 20, fontSize: 16, color: DIM }}>Build with Talocode. Ship with discipline.</div>
          </SlideUp>
        </div>
      </div>
    </Scene>
  );
}

// ── Main composition ─────────────────────────────────────────
export const TalocodeInCodex: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill style={{ background: BG }}>
      <Audio src={staticFile("bg-music.aac")} volume={0.35} />
      <Sequence from={0} durationInFrames={5 * fps}>
        <OpeningScene frame={frame} fps={fps} />
      </Sequence>
      <Sequence from={5 * fps} durationInFrames={6 * fps}>
        <InstallScene frame={frame} fps={fps} />
      </Sequence>
      <Sequence from={11 * fps} durationInFrames={7 * fps}>
        <ToolsScene frame={frame} fps={fps} />
      </Sequence>
      <Sequence from={18 * fps} durationInFrames={6 * fps}>
        <ArchitectureScene frame={frame} fps={fps} />
      </Sequence>
      <Sequence from={24 * fps} durationInFrames={6 * fps}>
        <MCPScene frame={frame} fps={fps} />
      </Sequence>
      <Sequence from={30 * fps} durationInFrames={6 * fps}>
        <ToolCallScene frame={frame} fps={fps} />
      </Sequence>
      <Sequence from={36 * fps} durationInFrames={5 * fps}>
        <ClosingScene frame={frame} fps={fps} />
      </Sequence>
    </AbsoluteFill>
  );
};

#!/bin/bash
# talocode-in-codex Demo Video Generator v0.2.0
set -e

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
OUTPUT="$ROOT/demo/talocode-in-codex-v0.2.0-demo.mp4"
TEMP="$ROOT/demo/temp"
mkdir -p "$TEMP"

BOLD="/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"
REG="/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf"
MONO="/usr/share/fonts/truetype/dejavu/DejaVuSansMono.ttf"
BG="0x05070a"

renderscene() {
  local dur=$1 out=$2
  echo "  Scene $out..."
  ffmpeg -y -f lavfi -i "color=c=$BG:s=1920x1080:r=30:d=$dur" \
    -filter_script:v "$TEMP/$out.filter" \
    -c:v libx264 -pix_fmt yuv420p -crf 18 "$TEMP/$out.mp4" 2>&1 | tail -2
}

# Scene 1 (5s): Opening
cat > "$TEMP/s1.filter" << EOF
drawtext=text='talocode-in-codex':fontsize=82:fontcolor=0xF97316:x=(w-text_w)/2:y=280:fontfile=$BOLD,
drawtext=text='Talocode inside Codex':fontsize=42:fontcolor=0xF4F7FB:x=(w-text_w)/2:y=380:fontfile=$REG,
drawtext=text='Use Talocode APIs as MCP tools':fontsize=28:fontcolor=0x98A7BB:x=(w-text_w)/2:y=450:fontfile=$REG,
drawtext=text='Tera | SearchLane | GeoLane | Skills | MemoryLane | GateLane':fontsize=26:fontcolor=0x6B7280:x=(w-text_w)/2:y=570:fontfile=$REG,
drawtext=text='v0.2.0':fontsize=20:fontcolor=0x6B7280:x=(w-text_w)/2:y=650:fontfile=$REG
EOF

# Scene 2 (6s): Install
cat > "$TEMP/s2.filter" << 'EOF'
drawtext=text='Install':fontsize=56:fontcolor=0xF4F7FB:x=140:y=120:fontfile=/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf,
drawtext=text='One command to add Talocode to any MCP host':fontsize=24:fontcolor=0x98A7BB:x=140:y=190:fontfile=/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf,
drawtext=text='$ codex plugin marketplace add talocode/talocode-in-codex':fontsize=28:fontcolor=0x86EFAC:x=140:y=330:fontfile=/usr/share/fonts/truetype/dejavu/DejaVuSansMono.ttf,
drawtext=text='OK  Plugin installed':fontsize=26:fontcolor=0x86EFAC:x=140:y=400:fontfile=/usr/share/fonts/truetype/dejavu/DejaVuSansMono.ttf,
drawtext=text='OK  MCP server configured':fontsize=26:fontcolor=0x86EFAC:x=140:y=450:fontfile=/usr/share/fonts/truetype/dejavu/DejaVuSansMono.ttf,
drawtext=text='OK  22 tools available':fontsize=26:fontcolor=0xF97316:x=140:y=500:fontfile=/usr/share/fonts/truetype/dejavu/DejaVuSansMono.ttf,
drawtext=text='Set your API key':fontsize=22:fontcolor=0x98A7BB:x=140:y=600:fontfile=/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf,
drawtext=text='export TALOCODE_API_KEY':fontsize=26:fontcolor=0xF4F7FB:x=140:y=640:fontfile=/usr/share/fonts/truetype/dejavu/DejaVuSansMono.ttf
EOF

# Scene 3 (7s): Tools overview
cat > "$TEMP/s3.filter" << 'EOF'
drawtext=text='22 MCP Tools':fontsize=56:fontcolor=0xF4F7FB:x=140:y=80:fontfile=/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf,
drawtext=text='Live':fontsize=22:fontcolor=0x86EFAC:x=140:y=155:fontfile=/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf,
drawtext=text='tera_chat':fontsize=26:fontcolor=0xF4F7FB:x=160:y=200:fontfile=/usr/share/fonts/truetype/dejavu/DejaVuSansMono.ttf,
drawtext=text='tera_review  tera_explain  tera_write  tera_rewrite  tera_draft':fontsize=20:fontcolor=0x98A7BB:x=160:y=235:fontfile=/usr/share/fonts/truetype/dejavu/DejaVuSansMono.ttf,
drawtext=text='skills_generate':fontsize=26:fontcolor=0xF4F7FB:x=160:y=280:fontfile=/usr/share/fonts/truetype/dejavu/DejaVuSansMono.ttf,
drawtext=text='searchlane_query  searchlane_news  searchlane_research':fontsize=26:fontcolor=0xF4F7FB:x=160:y=325:fontfile=/usr/share/fonts/truetype/dejavu/DejaVuSansMono.ttf,
drawtext=text='geolane_audit  geolane_compare':fontsize=26:fontcolor=0xF4F7FB:x=160:y=370:fontfile=/usr/share/fonts/truetype/dejavu/DejaVuSansMono.ttf,
drawtext=text='agent_browser_check  agent_browser_screenshot':fontsize=26:fontcolor=0xF4F7FB:x=160:y=415:fontfile=/usr/share/fonts/truetype/dejavu/DejaVuSansMono.ttf,
drawtext=text='invoicelane_extract':fontsize=26:fontcolor=0xF4F7FB:x=160:y=460:fontfile=/usr/share/fonts/truetype/dejavu/DejaVuSansMono.ttf,
drawtext=text='Experimental':fontsize=22:fontcolor=0xFBBF24:x=140:y=510:fontfile=/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf,
drawtext=text='memorylane  gatelane  x_agent_score  devtool_run':fontsize=24:fontcolor=0x6B7280:x=160:y=550:fontfile=/usr/share/fonts/truetype/dejavu/DejaVuSansMono.ttf,
drawtext=text='All tools use api.talocode.site with Bearer auth':fontsize=20:fontcolor=0x98A7BB:x=140:y=620:fontfile=/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf
EOF

# Scene 4 (6s): Architecture
cat > "$TEMP/s4.filter" << 'EOF'
drawtext=text='Architecture':fontsize=56:fontcolor=0xF4F7FB:x=140:y=80:fontfile=/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf,
drawtext=text='How talocode-in-codex connects Codex to Talocode Cloud':fontsize=22:fontcolor=0x98A7BB:x=140:y=150:fontfile=/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf,
drawtext=text='Codex / OpenCode / Claude':fontsize=28:fontcolor=0xF97316:x=220:y=280:fontfile=/usr/share/fonts/truetype/dejavu/DejaVuSansMono.ttf,
drawtext=text='| JSON-RPC stdin/stdout':fontsize=22:fontcolor=0x6B7280:x=120:y=340:fontfile=/usr/share/fonts/truetype/dejavu/DejaVuSansMono.ttf,
drawtext=text='MCP Server (server.mjs)':fontsize=28:fontcolor=0x60A5FA:x=220:y=400:fontfile=/usr/share/fonts/truetype/dejavu/DejaVuSansMono.ttf,
drawtext=text='| spawns child process':fontsize=22:fontcolor=0x6B7280:x=120:y=460:fontfile=/usr/share/fonts/truetype/dejavu/DejaVuSansMono.ttf,
drawtext=text='Companion CLI (client.mjs)':fontsize=28:fontcolor=0x86EFAC:x=220:y=520:fontfile=/usr/share/fonts/truetype/dejavu/DejaVuSansMono.ttf,
drawtext=text='| HTTP POST + Bearer token':fontsize=22:fontcolor=0x6B7280:x=120:y=580:fontfile=/usr/share/fonts/truetype/dejavu/DejaVuSansMono.ttf,
drawtext=text='api.talocode.site':fontsize=28:fontcolor=0xF97316:x=220:y=640:fontfile=/usr/share/fonts/truetype/dejavu/DejaVuSansMono.ttf,
drawtext=text='Zero deps | Vanilla Node.js | Newline-delimited JSON-RPC':fontsize=18:fontcolor=0x6B7280:x=(w)/2:y=760:fontfile=/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf:enable='gte(t,3)'
EOF

# Scene 5 (6s): MCP init + tools/list
cat > "$TEMP/s5.filter" << 'EOF'
drawtext=text='MCP Server - init + tools/list':fontsize=36:fontcolor=0xF4F7FB:x=140:y=80:fontfile=/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf,
drawtext=text='SEND  initialize':fontsize=22:fontcolor=0x86EFAC:x=140:y=170:fontfile=/usr/share/fonts/truetype/dejavu/DejaVuSansMono.ttf,
drawtext=text='{jsonrpc\:2.0,id\:1,method\:initialize}':fontsize=20:fontcolor=0x98A7BB:x=140:y=210:fontfile=/usr/share/fonts/truetype/dejavu/DejaVuSansMono.ttf,
drawtext=text='RECV  result':fontsize=22:fontcolor=0xF4F7FB:x=140:y=260:fontfile=/usr/share/fonts/truetype/dejavu/DejaVuSansMono.ttf,
drawtext=text='protocolVersion\:2024-11-05, serverInfo\:{name\:talocode-in-codex, v\:0.2.0}':fontsize=18:fontcolor=0x6B7280:x=140:y=300:fontfile=/usr/share/fonts/truetype/dejavu/DejaVuSansMono.ttf,
drawtext=text='SEND  tools/list':fontsize=22:fontcolor=0x86EFAC:x=140:y=360:fontfile=/usr/share/fonts/truetype/dejavu/DejaVuSansMono.ttf,
drawtext=text='RECV  result':fontsize=22:fontcolor=0xF4F7FB:x=140:y=410:fontfile=/usr/share/fonts/truetype/dejavu/DejaVuSansMono.ttf,
drawtext=text='tools\:[tera_chat,tera_review,searchlane_query,...+18]':fontsize=18:fontcolor=0xF97316:x=140:y=460:fontfile=/usr/share/fonts/truetype/dejavu/DejaVuSansMono.ttf,
drawtext=text='$ node scripts/test-mcp.mjs':fontsize=24:fontcolor=0x86EFAC:x=140:y=560:fontfile=/usr/share/fonts/truetype/dejavu/DejaVuSansMono.ttf,
drawtext=text='All tests passed (5/5)':fontsize=22:fontcolor=0x86EFAC:x=140:y=610:fontfile=/usr/share/fonts/truetype/dejavu/DejaVuSansMono.ttf
EOF

# Scene 6 (6s): Tool call demo
cat > "$TEMP/s6.filter" << 'EOF'
drawtext=text='Tool Call - tera_review':fontsize=36:fontcolor=0xF4F7FB:x=140:y=80:fontfile=/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf,
drawtext=text='tools/call tera_review':fontsize=22:fontcolor=0x86EFAC:x=140:y=160:fontfile=/usr/share/fonts/truetype/dejavu/DejaVuSansMono.ttf,
drawtext=text='code\: "function add(a,b){return a+b}"':fontsize=22:fontcolor=0x98A7BB:x=140:y=200:fontfile=/usr/share/fonts/truetype/dejavu/DejaVuSansMono.ttf,
drawtext=text='focus\: "security"':fontsize=22:fontcolor=0x98A7BB:x=140:y=240:fontfile=/usr/share/fonts/truetype/dejavu/DejaVuSansMono.ttf,
drawtext=text='response\:':fontsize=22:fontcolor=0xF4F7FB:x=140:y=320:fontfile=/usr/share/fonts/truetype/dejavu/DejaVuSansMono.ttf,
drawtext=text='No input validation':fontsize=22:fontcolor=0xF97316:x=140:y=370:fontfile=/usr/share/fonts/truetype/dejavu/DejaVuSansMono.ttf,
drawtext=text='add() accepts any type':fontsize=22:fontcolor=0xF97316:x=140:y=410:fontfile=/usr/share/fonts/truetype/dejavu/DejaVuSansMono.ttf,
drawtext=text='Consider TypeScript types + guard clauses':fontsize=22:fontcolor=0xF97316:x=140:y=450:fontfile=/usr/share/fonts/truetype/dejavu/DejaVuSansMono.ttf,
drawtext=text='POST api.talocode.site/v1/tera/coding/review':fontsize=18:fontcolor=0x6B7280:x=140:y=560:fontfile=/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf,
drawtext=text='Bearer token auth | 20 credits':fontsize=18:fontcolor=0x6B7280:x=140:y=590:fontfile=/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf
EOF

# Scene 7 (5s): Closing
cat > "$TEMP/s7.filter" << 'EOF'
drawtext=text='talocode-in-codex':fontsize=64:fontcolor=0xF97316:x=(w-text_w)/2:y=260:fontfile=/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf,
drawtext=text='Talocode inside Codex':fontsize=34:fontcolor=0xF4F7FB:x=(w-text_w)/2:y=350:fontfile=/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf,
drawtext=text='22 tools  |  Zero deps  |  Open source':fontsize=26:fontcolor=0x98A7BB:x=(w-text_w)/2:y=410:fontfile=/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf,
drawtext=text='Install':fontsize=32:fontcolor=0x86EFAC:x=(w-text_w)/2:y=520:fontfile=/usr/share/fonts/truetype/dejavu/DejaVuSansMono.ttf,
drawtext=text='codex plugin marketplace add talocode/talocode-in-codex':fontsize=26:fontcolor=0xF4F7FB:x=(w-text_w)/2:y=570:fontfile=/usr/share/fonts/truetype/dejavu/DejaVuSansMono.ttf,
drawtext=text='github.com/talocode/talocode-in-codex':fontsize=28:fontcolor=0x60A5FA:x=(w-text_w)/2:y=650:fontfile=/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf,
drawtext=text='MIT License':fontsize=18:fontcolor=0x6B7280:x=(w-text_w)/2:y=720:fontfile=/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf
EOF

# Render all scenes
echo "Rendering..."
renderscene 5 s1
renderscene 6 s2
renderscene 7 s3
renderscene 6 s4
renderscene 6 s5
renderscene 6 s6
renderscene 5 s7

# Concatenate
echo "Concat..."
printf "file '%s'\n" "$TEMP"/s{1,2,3,4,5,6,7}.mp4 > "$TEMP/concat.txt"
ffmpeg -y -f concat -safe 0 -i "$TEMP/concat.txt" -c copy "$TEMP/raw.mp4" 2>&1 | tail -1

# Audio
echo "Audio..."
ffmpeg -y -f lavfi -i "sine=frequency=220:duration=41" -af "volume=0.025,tremolo=f=0.3:d=0.5" -c:a aac "$TEMP/bg.m4a" 2>&1 | tail -1
ffmpeg -y -i "$TEMP/raw.mp4" -i "$TEMP/bg.m4a" -c:v copy -c:a aac -shortest "$OUTPUT" 2>&1 | tail -1

rm -rf "$TEMP"
echo "Done! $OUTPUT"
ls -lh "$OUTPUT"

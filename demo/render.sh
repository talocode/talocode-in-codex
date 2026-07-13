#!/bin/bash
set -e
cd "$(dirname "$0")/talocode-in-codex-demo-video"

echo "=== talocode-in-codex Demo Video Render ==="
echo ""

# Generate audio if not present
if [ ! -f "public/bg-music.aac" ]; then
  echo "Generating background music..."
  bash generate-audio.sh
fi

# Render
echo ""
echo "Rendering video..."
mkdir -p dist
npx remotion render src/index.ts TalocodeInCodex dist/talocode-in-codex-v0.2.0-demo.mp4

echo ""
echo "✅ Done!"
echo "   dist/talocode-in-codex-v0.2.0-demo.mp4"
ls -lh dist/talocode-in-codex-v0.2.0-demo.mp4

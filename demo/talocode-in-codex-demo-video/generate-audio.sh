#!/bin/bash
# Generate ambient background music for the talocode-in-codex demo video
set -e
OUTPUT="public/bg-music.aac"
DURATION=42
SR=44100

echo "Generating ambient background music..."

# Bass pad (C2 ~65Hz)
ffmpeg -y -f lavfi -i "sine=frequency=65.4:duration=$DURATION:sample_rate=$SR" \
  -af "volume=0.04,lowpass=f=200" public/_l1.wav 2>/dev/null

# Warm mid (C3 + G3 = C major)
ffmpeg -y -f lavfi -i "sine=frequency=130.8:duration=$DURATION:sample_rate=$SR" \
  -f lavfi -i "sine=frequency=196.0:duration=$DURATION:sample_rate=$SR" \
  -filter_complex "[0:a][1:a]amix=inputs=2:duration=first,volume=0.03,lowpass=f=500" \
  public/_l2.wav 2>/dev/null

# Shimmer (C4 + E4 + G4)
ffmpeg -y -f lavfi -i "sine=frequency=261.6:duration=$DURATION:sample_rate=$SR" \
  -f lavfi -i "sine=frequency=329.6:duration=$DURATION:sample_rate=$SR" \
  -f lavfi -i "sine=frequency=392.0:duration=$DURATION:sample_rate=$SR" \
  -filter_complex "[0:a][1:a][2:a]amix=inputs=3:duration=first,volume=0.018,lowpass=f=1000" \
  public/_l3.wav 2>/dev/null

# Pulse layer with tremolo
ffmpeg -y -f lavfi -i "sine=frequency=174.6:duration=$DURATION:sample_rate=$SR" \
  -af "volume=0.025,lowpass=f=800,tremolo=f=0.25:d=0.6" public/_l4.wav 2>/dev/null || \
ffmpeg -y -f lavfi -i "sine=frequency=174.6:duration=$DURATION:sample_rate=$SR" \
  -af "volume=0.025,lowpass=f=800" public/_l4.wav 2>/dev/null

# Mix + reverb
ffmpeg -y -i public/_l1.wav -i public/_l2.wav -i public/_l3.wav -i public/_l4.wav \
  -filter_complex "[0:a][1:a][2:a][3:a]amix=inputs=4:duration=first:dropout_transition=2,volume=0.8,aecho=0.8:0.7:60:0.3" \
  -c:a aac -b:a 128k "$OUTPUT" 2>/dev/null

rm public/_l1.wav public/_l2.wav public/_l3.wav public/_l4.wav
echo "✅ Background music: $OUTPUT"
ls -lh "$OUTPUT"

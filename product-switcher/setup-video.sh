#!/usr/bin/env bash
# Scans assets/ for video, converts .mov, extracts thumb frames, patches scripts/main.js VIDEO_SRC.
set -euo pipefail
ROOT="$(cd "$(dirname "$0")" && pwd)"
ASSETS="$ROOT/assets"
MAIN_JS="$ROOT/scripts/main.js"

VIDEO=""
for f in "$ASSETS"/*.{mp4,mov,MP4,MOV}; do
  [[ -f "$f" ]] || continue
  VIDEO="$f"
  break
done

if [[ -z "$VIDEO" ]]; then
  echo "No video in assets/ — color fallback mode."
  sed -i '' "s/var VIDEO_SRC = '[^']*';/var VIDEO_SRC = null;/" "$MAIN_JS" 2>/dev/null || \
  sed -i "s/var VIDEO_SRC = '[^']*';/var VIDEO_SRC = null;/" "$MAIN_JS"
  exit 0
fi

EXT="${VIDEO##*.}"
BASENAME="$(basename "$VIDEO" ".$EXT")"
OUT_MP4="$ASSETS/${BASENAME}.mp4"

if [[ "${EXT,,}" == "mov" ]] || [[ "$VIDEO" != "$OUT_MP4" ]]; then
  echo "Converting to H.264: $OUT_MP4"
  ffmpeg -y -i "$VIDEO" -c:v libx264 -preset fast -crf 23 -pix_fmt yuv420p -an "$OUT_MP4"
  VIDEO="$OUT_MP4"
fi

REL="assets/$(basename "$VIDEO")"
echo "Extracting thumb frames from $REL"
DURATION=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$VIDEO")
T1=$(echo "$DURATION / 6" | bc -l)
T2=$(echo "$DURATION / 2" | bc -l)
T3=$(echo "$DURATION * 5 / 6" | bc -l)
ffmpeg -y -ss "$T1" -i "$VIDEO" -frames:v 1 -q:v 2 "$ASSETS/nav-icon-1.png"
ffmpeg -y -ss "$T2" -i "$VIDEO" -frames:v 1 -q:v 2 "$ASSETS/nav-icon-2.png"
ffmpeg -y -ss "$T3" -i "$VIDEO" -frames:v 1 -q:v 2 "$ASSETS/nav-icon-3.png"

if grep -q "var VIDEO_SRC" "$MAIN_JS"; then
  sed -i '' "s|var VIDEO_SRC = [^;]*;|var VIDEO_SRC = '$REL';|" "$MAIN_JS" 2>/dev/null || \
  sed -i "s|var VIDEO_SRC = [^;]*;|var VIDEO_SRC = '$REL';|" "$MAIN_JS"
fi

echo "Done. VIDEO_SRC=$REL — run: npx serve ."

#!/usr/bin/env bash
set -euo pipefail

SRC="/Users/theparadox/Documents/Magdy Workspace/01_LIVE_PROJECTS/Digital_Garden_200_Meters/Quartz_200_Meters/content"
DST="/Users/theparadox/Library/Mobile Documents/iCloud~md~obsidian/Documents/The Paradox/Off-Grid"

files=(
  "index.md"
  "Off the Grid.md"
  "Strategy.md"
  "Why I Built an 11 PM Report.md"
  "Source of Truth - 200 Meters.md"
  "Skeptical of Perfect Frameworks.md"
)

for f in "${files[@]}"; do
  cp "$SRC/$f" "$DST/$f"
  echo "synced: $f"
done

echo "Done. (If Obsidian is open, you may need to wait for iCloud sync or reload the notes.)"

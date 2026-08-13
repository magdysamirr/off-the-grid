#!/usr/bin/env bash
set -euo pipefail

SRC="/Users/theparadox/Documents/Magdy Workspace/01_LIVE_PROJECTS/Digital_Garden_200_Meters/Quartz_200_Meters/content"
VAULT_DST="/Users/theparadox/Library/Mobile Documents/iCloud~md~obsidian/Documents/The Paradox/200 Meters"

# Quartz content/ is flat. In the vault a note may already live inside a topic
# subfolder such as Off-Grid; write it back where it currently sits so this sync
# never silently duplicates a note into the folder root.
vault_dest() {
  local name="$1"
  local hit
  hit="$(find "$VAULT_DST" -type f -name "$name" -print -quit)"
  if [[ -n "$hit" ]]; then
    printf '%s' "$hit"
  else
    printf '%s' "$VAULT_DST/$name"
  fi
}

files=(
  "index.md"
  "Off the Grid.md"
  "Strategy.md"
  "Why I Built an 11 PM Report.md"
)

missing=0
for f in "${files[@]}"; do
  if [[ ! -f "$SRC/$f" ]]; then
    echo "MISSING in Quartz content: $f" >&2
    missing=$((missing+1))
    continue
  fi
  dst="$(vault_dest "$f")"
  cp "$SRC/$f" "$dst"
  rel="${dst#"$VAULT_DST"/}"
  echo "synced: $rel"
done

if [[ $missing -gt 0 ]]; then
  printf '\nWARNING: %s files were missing in Quartz content. Vault copy may be incomplete.\n' "$missing" >&2
fi

printf '\nDone. (If Obsidian is open, you may need to wait for iCloud sync or reload the notes.)\n'

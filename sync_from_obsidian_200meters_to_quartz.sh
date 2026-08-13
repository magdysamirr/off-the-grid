#!/usr/bin/env bash
set -euo pipefail

VAULT_SRC="/Users/theparadox/Library/Mobile Documents/iCloud~md~obsidian/Documents/The Paradox/200 Meters"
QUARTZ_DST="/Users/theparadox/Documents/Magdy Workspace/01_LIVE_PROJECTS/Digital_Garden_200_Meters/Quartz_200_Meters/content"

# Quartz content/ is flat, because note URLs are derived from it. In the vault the
# same notes sit either at the top of "200 Meters" or inside a topic subfolder
# such as Off-Grid, so look the file up by name rather than assuming a path.
vault_path() {
  local name="$1"
  if [[ -f "$VAULT_SRC/$name" ]]; then
    printf '%s' "$VAULT_SRC/$name"
    return 0
  fi
  find "$VAULT_SRC" -type f -name "$name" -print -quit
}

# Notes that are part of the published garden
files=(
  "index.md"
  "Every Note.md"
  "About.md"
  "What is this.md"
  "Off the Grid.md"
  "Less Dramatic Than It Sounds.md"
  "Off-Grid Reality and Professional Obligation.md"
  "Remote Operations Without Losing Control.md"
  "Running a Business with ADHD.md"
  "Systems Over Willpower.md"
  "Think or Act, But Not Both.md"
  "Structural Decisions vs Motivational Ones.md"
  "Strategy.md"
  "Strategy Is Winning Before You Start.md"
  "Strategic Thinking.md"
  "Trade-offs and Strategic Choices.md"
  "Why Most Marketing Isn't Strategic.md"
  "Digital Marketing and Design Strategy.md"
  "Refuse the Work, or Refuse to Own It.md"
  "Dentistry.md"
  "Why I Hate Dentistry (and Why I'm Still a Dentist).md"
  "Administrative Friction Is Clinical Friction.md"
  "The 7 Self-Deceptions That Shape a Dentist's Career.md"
  "Why I Built an 11 PM Report.md"
  "Operational Snapshot - WR, KAF, and NDC.md"
  "Why I Moved to the Desert to Save My Brain.md"
  "Why I Choose Discipline Over Brilliance.md"
  "Different Blind Spots Make Better Partners.md"
  "Trust-Building Isn't Systems-Building.md"
  "Building Unfair Advantages.md"
  "Error vs. Wrongdoing.md"
  "The First Mistake Is an Error. The Third Becomes Culture.md"
  "Holding the Map, Hiding the Map.md"
  "What Holds When Conditions Are Bad.md"
  "Give Value, Get Respect.md"
  "Toxic Blame Culture.md"
)

missing=0
for f in "${files[@]}"; do
  src="$(vault_path "$f")"
  if [[ -z "$src" ]]; then
    echo "MISSING in vault: $f" >&2
    missing=$((missing+1))
    continue
  fi
  cp "$src" "$QUARTZ_DST/$f"
  rel="${src#"$VAULT_SRC"/}"
  if [[ "$rel" == "$f" ]]; then
    echo "synced: $f"
  else
    echo "synced: $f (from $rel)"
  fi
done

if [[ $missing -gt 0 ]]; then
  printf '\nWARNING: %s files were missing in the vault source folder. Quartz mirror may be incomplete.\n' "$missing" >&2
fi

printf '\nDone. Vault → Quartz content sync complete.\n'

#!/usr/bin/env bash
set -euo pipefail

VAULT_SRC="/Users/theparadox/Library/Mobile Documents/iCloud~md~obsidian/Documents/The Paradox/Off-Grid"
QUARTZ_DST="/Users/theparadox/Documents/Magdy Workspace/01_LIVE_PROJECTS/Digital_Garden_200_Meters/Quartz_200_Meters/content"

# Notes that are part of the published garden
files=(
  "index.md"
  "About.md"
  "What is this.md"
  "Off the Grid.md"
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
  "WordReward Positioning - Stop Managing Brands, Start Marking Them.md"
  "Dentistry.md"
  "Why I Hate Dentistry (and Why I'm Still a Dentist).md"
  "Administrative Friction Is Clinical Friction.md"
  "The 7 Self-Deceptions That Shape a Dentist's Career.md"
  "Why I Built an 11 PM Report.md"
  "Operational Snapshot - WR, KAF, and NDC.md"
  "Why I Moved to the Desert to Save My Brain.md"
  "Why I Choose Discipline Over Brilliance.md"
  "Building Unfair Advantages.md"
  "Error vs. Wrongdoing.md"
  "The First Mistake Is an Error. The Third Becomes Culture.md"
  "The Trap, The Tempter, and The Mercy Clause.md"
  "What Holds When Conditions Are Bad.md"
  "Give Value, Get Respect.md"
  "Toxic Blame Culture.md"
)

missing=0
for f in "${files[@]}"; do
  if [[ ! -f "$VAULT_SRC/$f" ]]; then
    echo "MISSING in vault: $f" >&2
    missing=$((missing+1))
    continue
  fi
  cp "$VAULT_SRC/$f" "$QUARTZ_DST/$f"
  echo "synced: $f"
done

if [[ $missing -gt 0 ]]; then
  echo "\nWARNING: $missing files were missing in the vault source folder. Quartz mirror may be incomplete." >&2
fi

echo "\nDone. Vault → Quartz content sync complete."

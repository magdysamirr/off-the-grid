#!/usr/bin/env bash
set -euo pipefail

TODAY="2026-08-02"
VAULT_DIR="/Users/theparadox/Library/Mobile Documents/iCloud~md~obsidian/Documents/The Paradox/Off-Grid"

# This script updates the *canonical* Obsidian vault notes (source of truth).
# It is meant to be run locally in your normal shell environment.

backup_dir="$VAULT_DIR/_backups/$TODAY"
mkdir -p "$backup_dir"

backup_file() {
  local f="$1"
  if [[ -f "$VAULT_DIR/$f" ]]; then
    cp "$VAULT_DIR/$f" "$backup_dir/$f"
    echo "backup: $f"
  fi
}

# Back up the notes we will modify
backup_file "index.md"
backup_file "Off the Grid.md"
backup_file "Strategy.md"
backup_file "Why I Built an 11 PM Report.md"

# 1) Add/Update Source of Truth note
cat > "$VAULT_DIR/Source of Truth - 200 Meters.md" <<EOF
---
date: $TODAY
lastmod: $TODAY
title: Source of Truth - 200 Meters
type: evergreen
status: evergreen
topics:
- meta
- publishing
- systems
dg-publish: true
---

The canonical source of truth for **200 Meters** is my **Obsidian vault in iCloud**.

- **Vault root**: `/Users/theparadox/Library/Mobile Documents/iCloud~md~obsidian/Documents/The Paradox/`
- **Published garden folder**: `/Users/theparadox/Library/Mobile Documents/iCloud~md~obsidian/Documents/The Paradox/Off-Grid/`

Everything else is downstream.

## Publishing pipeline (downstream mirrors)

1) **Authoring** happens in Obsidian (iCloud vault).
2) Notes are mirrored into the Quartz repo content folder:
   `/Users/theparadox/Documents/Magdy Workspace/01_LIVE_PROJECTS/Digital_Garden_200_Meters/Quartz_200_Meters/content/`
3) Quartz builds the site and Vercel publishes it at `magdysamir.online`.

## Why this matters

- If a Quartz file and a vault note ever disagree, the **vault note wins**.
- The website is a **rendered output**, not an editable truth.

## First touchpoint

- Front door: [[index|200 Meters]]
EOF

echo "wrote: Source of Truth - 200 Meters.md"

# 2) Add/Update anchor note
cat > "$VAULT_DIR/Skeptical of Perfect Frameworks.md" <<EOF
---
date: $TODAY
lastmod: $TODAY
title: Skeptical of Perfect Frameworks
type: evergreen
status: evergreen
topics:
- operations
- strategy
- systems
- writing
---

# I’m skeptical of frameworks that work perfectly in theory.

If a framework only works when:

- everyone has perfect discipline,
- inputs arrive on time,
- tools never fail,
- context is always available,
- and humans behave rationally,

…then it’s not a framework. It’s a fantasy.

My operating standard (for operations and strategy) is simple:

- **Show me the failure modes.**
- **Show me the constraints.**
- **Show me the trade-offs.**
- **Show me what still works when reality degrades.**

This line is the anchor for most writing in: [[Strategy]] and the operations notes.
EOF

echo "wrote: Skeptical of Perfect Frameworks.md"

# 3) Update index.md (first touchpoint) — insert a visible notice and bump lastmod
if [[ -f "$VAULT_DIR/index.md" ]]; then
  python3 - <<'PY'
from pathlib import Path
TODAY='2026-08-02'
path = Path('/Users/theparadox/Library/Mobile Documents/iCloud~md~obsidian/Documents/The Paradox/Off-Grid/index.md')
text = path.read_text(encoding='utf-8')
text = text.replace('lastmod: 2026-07-15', f'lastmod: {TODAY}')
notice = "> **Source of truth**: [[Source of Truth - 200 Meters]].\n"
if 'Source of Truth - 200 Meters' not in text:
    marker = 'If you are reading this, I finally managed to connect Obsidian to GitHub to Vercel via Quartz.'
    if marker in text:
        text = text.replace(marker + '   \n\n', marker + '   \n\n' + notice + '\n')
    else:
        # fallback: insert after frontmatter
        i = text.find('---\n', 3)
        if i != -1:
            j = text.find('---\n', i+4)
            if j != -1:
                after = j+4
                text = text[:after] + '\n' + notice + '\n' + text[after:]
path.write_text(text, encoding='utf-8')
print('updated: index.md')
PY
else
  echo "SKIP: index.md not found in vault folder" >&2
fi

# 4) Update Off the Grid.md to the rewritten version + anchor link
cat > "$VAULT_DIR/Off the Grid.md" <<EOF
---
date: 2025-12-16
lastmod: $TODAY
title: Off the Grid
aliases:
- off-the-grid
type: evergreen
status: seedling
topics:
- off-grid
- systems
---

Off-grid is not a vibe. It’s a constraint.

It means you can’t rely on always-on convenience—because distance exists, bandwidth fails, coordination decays, and systems break the moment your presence disappears.

> [[Skeptical of Perfect Frameworks|I’m skeptical of frameworks that work perfectly in theory.]] Off-grid forces you to respect failure modes.

So before “off-grid” means anything, you have to define what you’re leaving.

## What “the grid” means here

The grid is any centralized system that gives you **convenience in exchange for control**.

- It removes friction so effectively that you stop noticing what you’re dependent on.
- It makes things feel easy until they fail.
- And when it fails, you discover you don’t have a fallback—only panic.

This isn’t a moral judgment. It’s a trade-off. The grid is useful. The question is: **how much of your life and work collapses when it glitches?**

## The Off‑Grid Principle: agency through decoupling

Going off‑grid means reducing single points of failure—physical, digital, and operational—so that your reality doesn’t depend on continuous permission from something outside you.

I use three principles. They’re simple. They’re also annoying. That’s the point.

### 1) Ownership (sovereignty)

If a third party can “turn off” a core resource, you don’t own your life—you rent it.

Examples of what this looks like:

- **Physical:** your power and water are no longer assumed. You track them. You generate them. You respect limits.
- **Digital:** you stop building memory and workflow on platforms you don’t control. You keep local copies. You design for export. You avoid lock‑in where leaving costs you your identity.

Why it matters: ownership turns dependency into an intentional choice instead of a hidden trap.

### 2) Friction (resilience)

Convenience removes friction. Friction builds competence.

The grid sells “no friction” as a feature. Off‑grid reintroduces friction as training.

Examples:

- **Physical:** managing batteries and water creates a feedback loop. You learn reality because you can’t outsource it.
- **Cognitive:** reading, writing, and building systems are higher‑friction than scrolling. That friction is exactly what makes them protective.
- **Operational:** if your work requires constant real‑time interventions to stay correct, it’s fragile. Off‑grid forces you to build systems that survive absence.

Why it matters: when the system is stressed (power cut, internet drop, staff turnover), a frictionless design breaks first.

### 3) Silence (signal)

In a world optimized for noise, silence is not empty. It’s a filter.

The “social grid” pressures you to broadcast constantly: updates, opinions, proof of life. But broadcasting is not output. It’s visibility.

Off‑grid is choosing a different standard:

- fewer transmissions,
- deeper signal,
- longer time horizons.

Why it matters: signal compounds. Noise drains.

## The practical definition (the one I actually use)

**Off‑grid is the practice of limiting external inputs to protect internal output.**

Not as ideology. As engineering.

It creates three consistent outcomes:

1) **Dependency becomes visible.** You can finally see what you’re renting.
2) **Distance becomes a filter.** Many “urgent” things fail the distance test and disappear.
3) **Quiet becomes power.** You regain the ability to think without constant interruption.

## How to apply it (small, concrete moves)

If you want to adopt this as an operator—not as a lifestyle brand—start here:

- Remove **one single point of failure** (a tool, a person, a process that breaks if it’s not available).
- Add **one redundancy** (backup power, backup workflow, backup knowledge).
- Create **one daily truth signal** (a short report, a dashboard, a check‑in that collapses reality into something readable).

That’s off‑grid: not escaping systems, but building systems that don’t require you to be online, present, and rescuing everything all the time.

## Continue from here

- **Domain map**: [[Off-Grid Reality and Professional Obligation]]
- **Operating application**: [[Remote Operations Without Losing Control]]
- **Operational mechanism**: [[Why I Built an 11 PM Report]]
EOF

echo "updated: Off the Grid.md"

# 5) Light-touch: add the anchor line to Strategy + 11 PM report (and bump lastmod)
python3 - <<'PY'
from pathlib import Path
TODAY='2026-08-02'
base=Path('/Users/theparadox/Library/Mobile Documents/iCloud~md~obsidian/Documents/The Paradox/Off-Grid')
anchor='[[Skeptical of Perfect Frameworks|I’m skeptical of frameworks that work perfectly in theory.]]'

def bump_lastmod(text):
    return text.replace('lastmod: 2026-07-15', f'lastmod: {TODAY}')

# Strategy.md
p=base/'Strategy.md'
if p.exists():
    t=bump_lastmod(p.read_text(encoding='utf-8'))
    if 'Skeptical of Perfect Frameworks' not in t:
        parts=t.split('\n\n',1)
        if len(parts)==2:
            t=parts[0]+"\n\n> "+anchor+"\n\n"+parts[1]
    p.write_text(t, encoding='utf-8')
    print('updated: Strategy.md')

# 11 PM report
p=base/'Why I Built an 11 PM Report.md'
if p.exists():
    t=bump_lastmod(p.read_text(encoding='utf-8'))
    if 'Skeptical of Perfect Frameworks' not in t:
        t=t.replace('I hate dashboards.\n\n', 'I hate dashboards.\n\n> '+anchor+' Dashboards are only useful if they survive reality.\n\n')
    p.write_text(t, encoding='utf-8')
    print('updated: Why I Built an 11 PM Report.md')
PY

echo "\nAll done. Backups saved to: $backup_dir"

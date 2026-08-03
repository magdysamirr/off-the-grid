# AGENTS.md — 200 Meters / Quartz_200_Meters

## Source of truth (canonical)

**DO NOT treat this Quartz repo as the canonical editing location for the digital garden content.**

The canonical source-of-truth for published notes is the Obsidian iCloud vault:

- Vault root: `/Users/theparadox/Library/Mobile Documents/iCloud~md~obsidian/Documents/The Paradox/`
- Published garden folder: `/Users/theparadox/Library/Mobile Documents/iCloud~md~obsidian/Documents/The Paradox/Off-Grid/`

If anything here conflicts with the vault, **the vault wins**.

## What this repo is

This repo is a **publish mirror + build system** (Quartz → build → deploy).

- Mirror location in this repo: `content/`
- Build output: `public/` (generated)

## Editing rules for agents

1) **Write/edit notes in the Obsidian vault folder** (path above).
2) Then sync vault → Quartz `content/` using the provided script.
3) Then build/publish as usual.

### Sidebar navigation (DomainExplorer)

The left sidebar is **not** auto-generated. It is a hardcoded list in
`quartz/components/DomainExplorer.tsx` (the `domains` array). Newly published
notes will be emitted as pages, but they will **not appear in the sidebar**
until they are registered in that array by exact note title.

- When adding a new published note, add its title to the appropriate group's `notes` list.
- When deleting a note, remove its title from the list too, or it renders as a dead link.
- A note should appear in **one** group only (do not duplicate an entity across groups).
- Unlike garden notes, this file is edited directly in the repo, then built and pushed.

### Never do

- Do not author new longform content directly inside `content/` unless explicitly asked to do a one-off emergency patch.
- Do not "refactor" note filenames in `content/` without making the same change in the vault.
- Do not edit `public/` (generated).

## Style rules

- Never use em dashes (`—`) in garden notes. Use periods, commas, colons, or parentheses instead. This applies to all notes, including new drafts and edits to existing ones.

## Sync command (vault → Quartz)

Run:

```bash
./sync_from_obsidian_offgrid_to_quartz.sh
```

This copies the canonical notes from the vault into `content/`.

# Published Folder

This folder controls what appears in the **Explorer (Thoughts)** sidebar.

## How it works

Only notes inside this `Published` folder will appear in the Explorer sidebar on your website.

## To add a note to Explorer:

1. Move or create your `.md` file inside this folder:
   ```
   content/Published/your-note.md
   ```

2. Run the build:
   ```bash
   npx quartz build
   ```

3. The note will now appear in the Explorer sidebar!

## Folder location:

```
/Users/theparadox/.claude-worktrees/quartz/gifted-haibt/content/Published/
```

## To add more allowed folders:

Edit `quartz.layout.ts` line 45:
```typescript
const allowedFolders = ["Published", "Essays", "Notes"]
```

---

**Note:** You can delete this README file - it's just for reference.

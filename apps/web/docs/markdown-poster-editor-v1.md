# Markdown Poster Editor v1

## Product positioning

- Single-page Markdown editor.
- Local-only storage in the current browser.
- No account system, no cross-device sync, no document list.

## Core behaviors

- Content is stored as plain text: one title field and one Markdown body field.
- The editor supports two right-side views:
  - Rendered preview
  - Plain text view without Markdown rendering
- Draft changes are auto-saved locally.
- The toolbar always shows a save state:
  - Editing
  - Saving
  - Saved

## History and safety

- Undo and redo are session-local editor actions.
- Version history is stored locally with:
  - Auto snapshots
  - Manual milestones
  - Import backups
  - Rollback backups
- Auto snapshots are created after the editor stays idle for 15 seconds and at least 2 minutes passed since the previous auto snapshot.
- Auto snapshots keep the most recent 50 entries.
- Manual milestones are never auto-pruned.
- Rollback always creates a rollback backup before replacing the current content.
- Import always creates an import backup before replacing the current content.

## Import and backup

- Export Markdown writes `# {title}` followed by the Markdown body.
- Export plain text writes the title, one blank line, then the body text.
- Import `.md`:
  - If the first line is `# `, it becomes the title.
  - The rest becomes the body.
  - If there is no first-level heading, the current title is kept.
- Import `.txt`:
  - First line becomes the title.
  - One optional blank line is skipped.
  - The rest becomes the body.

## Poster export

- Default format is PNG.
- Supported poster ratios:
  - `1:1`
  - `3:4`
  - `9:16`
- Default export size is `1080x1440`.
- Export supports light and dark poster themes.
- Long content is split into multiple poster pages and exported as sequential PNG files.
- Share exports a PNG image through the browser share sheet when file sharing is available.
- If file sharing is unavailable, sharing falls back to downloading the image.

## Implementation defaults

- Frontend route: `/{locale}/notes`
- Storage: Dexie over IndexedDB
- Editor: CodeMirror 6 via `@uiw/react-codemirror`
- Markdown rendering: `react-markdown` with `remark-gfm`
- Poster export: `modern-screenshot`

## Known limitations in v1

- No HTML-in-Markdown rendering.
- No collaborative editing.
- No cloud backup.
- No image upload pipeline.
- Remote images inside Markdown may fail during PNG export if the image source blocks screenshot access.

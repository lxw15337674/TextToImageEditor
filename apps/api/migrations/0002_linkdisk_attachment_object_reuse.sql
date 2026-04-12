DROP INDEX IF EXISTS idx_clipboard_entry_attachments_object_id;
CREATE INDEX IF NOT EXISTS idx_clipboard_entry_attachments_object_id
  ON clipboard_entry_attachments (object_id);

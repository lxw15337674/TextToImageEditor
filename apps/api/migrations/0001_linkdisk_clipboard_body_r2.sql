CREATE TABLE IF NOT EXISTS `objects` (
  `id` text PRIMARY KEY NOT NULL,
  `sha256` text NOT NULL,
  `file_name` text NOT NULL,
  `mime_type` text NOT NULL,
  `size_bytes` integer NOT NULL,
  `total_parts` integer DEFAULT 0 NOT NULL,
  `status` text DEFAULT 'uploading' NOT NULL,
  `upload_strategy` text DEFAULT 'r2' NOT NULL,
  `storage_provider` text DEFAULT 'telegram' NOT NULL,
  `archive_status` text DEFAULT 'pending' NOT NULL,
  `archive_attempts` integer DEFAULT 0 NOT NULL,
  `archive_next_attempt_at` text DEFAULT (datetime('now')) NOT NULL,
  `archive_last_error` text,
  `archive_lease_until` text,
  `archived_at` text,
  `created_at` text DEFAULT (datetime('now')) NOT NULL,
  `updated_at` text DEFAULT (datetime('now')) NOT NULL
);

CREATE UNIQUE INDEX IF NOT EXISTS `idx_objects_sha256` ON `objects` (`sha256`);
CREATE INDEX IF NOT EXISTS `idx_objects_archive_scan` ON `objects` (`archive_status`, `archive_next_attempt_at`);

CREATE TABLE IF NOT EXISTS `object_parts` (
  `id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
  `object_id` text NOT NULL,
  `part_index` integer NOT NULL,
  `provider_file_id` text,
  `r2_object_key` text,
  `part_size_bytes` integer NOT NULL,
  `created_at` text DEFAULT (datetime('now')) NOT NULL,
  FOREIGN KEY (`object_id`) REFERENCES `objects`(`id`) ON DELETE cascade
);

CREATE UNIQUE INDEX IF NOT EXISTS `idx_object_parts_object_id_part_index` ON `object_parts` (`object_id`, `part_index`);

CREATE TABLE IF NOT EXISTS `clipboard_entries` (
  `id` text PRIMARY KEY NOT NULL,
  `title` text,
  `body_storage_provider` text DEFAULT 'r2' NOT NULL,
  `body_r2_key` text,
  `body_size_bytes` integer DEFAULT 0 NOT NULL,
  `body_sha256` text DEFAULT '' NOT NULL,
  `body_format` text DEFAULT 'plain_text' NOT NULL,
  `status` text DEFAULT 'draft' NOT NULL,
  `share_id` text NOT NULL,
  `manage_id` text NOT NULL,
  `published_at` text,
  `destroyed_at` text,
  `created_at` text DEFAULT (datetime('now')) NOT NULL,
  `updated_at` text DEFAULT (datetime('now')) NOT NULL
);

CREATE UNIQUE INDEX IF NOT EXISTS `idx_clipboard_entries_share_id` ON `clipboard_entries` (`share_id`);
CREATE UNIQUE INDEX IF NOT EXISTS `idx_clipboard_entries_manage_id` ON `clipboard_entries` (`manage_id`);
CREATE INDEX IF NOT EXISTS `idx_clipboard_entries_status` ON `clipboard_entries` (`status`, `updated_at`);

CREATE TABLE IF NOT EXISTS `clipboard_entry_attachments` (
  `id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
  `entry_id` text NOT NULL,
  `object_id` text NOT NULL,
  `display_name` text NOT NULL,
  `sort_order` integer DEFAULT 0 NOT NULL,
  `created_at` text DEFAULT (datetime('now')) NOT NULL,
  FOREIGN KEY (`entry_id`) REFERENCES `clipboard_entries`(`id`) ON DELETE cascade,
  FOREIGN KEY (`object_id`) REFERENCES `objects`(`id`) ON DELETE cascade
);

CREATE UNIQUE INDEX IF NOT EXISTS `idx_clipboard_entry_attachments_object_id` ON `clipboard_entry_attachments` (`object_id`);
CREATE INDEX IF NOT EXISTS `idx_clipboard_entry_attachments_entry_sort` ON `clipboard_entry_attachments` (`entry_id`, `sort_order`);

CREATE TABLE IF NOT EXISTS `clipboard_share_settings` (
  `entry_id` text PRIMARY KEY NOT NULL,
  `password_hash` text,
  `expires_at` text,
  `max_views` integer,
  `view_count` integer DEFAULT 0 NOT NULL,
  `destroy_mode` text DEFAULT 'none' NOT NULL,
  `disabled` integer DEFAULT 0 NOT NULL,
  `created_at` text DEFAULT (datetime('now')) NOT NULL,
  `updated_at` text DEFAULT (datetime('now')) NOT NULL,
  FOREIGN KEY (`entry_id`) REFERENCES `clipboard_entries`(`id`) ON DELETE cascade
);

CREATE INDEX IF NOT EXISTS `idx_clipboard_share_settings_expires_at` ON `clipboard_share_settings` (`expires_at`);

CREATE TABLE IF NOT EXISTS `clipboard_share_access_tokens` (
  `token` text PRIMARY KEY NOT NULL,
  `entry_id` text NOT NULL,
  `share_id` text NOT NULL,
  `expires_at` text NOT NULL,
  `created_at` text DEFAULT (datetime('now')) NOT NULL,
  FOREIGN KEY (`entry_id`) REFERENCES `clipboard_entries`(`id`) ON DELETE cascade
);

CREATE INDEX IF NOT EXISTS `idx_clipboard_share_access_tokens_share_id` ON `clipboard_share_access_tokens` (`share_id`, `expires_at`);

CREATE TABLE IF NOT EXISTS `clipboard_events` (
  `id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
  `entry_id` text,
  `attachment_id` integer,
  `event_type` text NOT NULL,
  `created_at` text DEFAULT (datetime('now')) NOT NULL,
  FOREIGN KEY (`entry_id`) REFERENCES `clipboard_entries`(`id`) ON DELETE cascade
);

CREATE INDEX IF NOT EXISTS `idx_clipboard_events_type_created` ON `clipboard_events` (`event_type`, `created_at`);
CREATE INDEX IF NOT EXISTS `idx_clipboard_events_entry_created` ON `clipboard_events` (`entry_id`, `created_at`);

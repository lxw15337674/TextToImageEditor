'use client';

import Dexie, { type Table } from 'dexie';
import type { EditorDocument, EditorVersion, VersionKind } from '@/lib/editor/types';

export const EDITOR_DOCUMENT_ID = 'singleton';
export const AUTO_SNAPSHOT_LIMIT = 50;

class EditorLocalDb extends Dexie {
  documents!: Table<EditorDocument, string>;
  versions!: Table<EditorVersion, string>;

  constructor() {
    super('markdown-poster-editor');
    this.version(1).stores({
      documents: 'id, updatedAt',
      versions: 'id, documentId, kind, createdAt',
    });
  }
}

const db = new EditorLocalDb();

export function createDefaultDocument(): EditorDocument {
  const now = Date.now();

  return {
    id: EDITOR_DOCUMENT_ID,
    content: '',
    previewMode: 'preview',
    exportTheme: 'light',
    exportPreset: '3:4',
    exportResolution: '1080x1440',
    exportTemplate: 'xiaohongshu',
    updatedAt: now,
    lastSavedAt: now,
  };
}

export async function getOrCreateDocument() {
  const existing = await db.documents.get(EDITOR_DOCUMENT_ID);

  if (existing) {
    return {
      ...createDefaultDocument(),
      ...existing,
    };
  }

  const nextDocument = createDefaultDocument();
  await db.documents.put(nextDocument);
  return nextDocument;
}

export async function saveDocument(document: EditorDocument) {
  const now = Date.now();
  const nextDocument: EditorDocument = {
    ...document,
    updatedAt: now,
    lastSavedAt: now,
  };

  await db.documents.put(nextDocument);
  return nextDocument;
}

export async function listVersions(documentId = EDITOR_DOCUMENT_ID) {
  const versions = await db.versions.where('documentId').equals(documentId).sortBy('createdAt');
  return versions.reverse();
}

export async function createVersionFromDocument(
  document: Pick<EditorDocument, 'id' | 'content'>,
  kind: VersionKind,
  label: string | null = null,
) {
  const version: EditorVersion = {
    id: crypto.randomUUID(),
    documentId: document.id,
    kind,
    contentSnapshot: document.content,
    label,
    createdAt: Date.now(),
  };

  await db.versions.add(version);
  return version;
}

export async function duplicateVersionAsMilestone(version: EditorVersion, label: string | null = null) {
  const nextVersion: EditorVersion = {
    ...version,
    id: crypto.randomUUID(),
    kind: 'milestone',
    label,
    createdAt: Date.now(),
  };

  await db.versions.add(nextVersion);
  return nextVersion;
}

export async function updateVersionLabel(id: string, label: string | null) {
  await db.versions.update(id, { label });
}

export async function deleteVersion(id: string) {
  await db.versions.delete(id);
}

export async function trimAutoSnapshots(limit = AUTO_SNAPSHOT_LIMIT) {
  const autoVersions = await db.versions.where('kind').equals('auto').sortBy('createdAt');

  if (autoVersions.length <= limit) {
    return;
  }

  const versionsToDelete = autoVersions.slice(0, autoVersions.length - limit);
  await Promise.all(versionsToDelete.map((version) => db.versions.delete(version.id)));
}

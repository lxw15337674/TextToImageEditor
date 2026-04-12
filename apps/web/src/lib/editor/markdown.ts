'use client';

import type { ContentFormat, EditorDocument, PosterPage } from '@/lib/editor/types';

export const POSTER_DIMENSIONS = {
  width: 1080,
  height: 1440,
} as const;

export function createDocumentSignature(
  document: Pick<EditorDocument, 'content' | 'contentFormat' | 'exportTemplate' | 'fontSizePreset'>,
) {
  return JSON.stringify({
    content: document.content,
    contentFormat: document.contentFormat,
    exportTemplate: document.exportTemplate,
    fontSizePreset: document.fontSizePreset,
  });
}

export function createSnapshotSignature(document: Pick<EditorDocument, 'content'>) {
  return document.content;
}

export function formatTimestamp(value: number, locale?: string) {
  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).format(value);
}

export function summarizeContent(content: string, length = 120) {
  const normalized = content.replace(/\s+/g, ' ').trim();

  if (normalized.length <= length) {
    return normalized;
  }

  return `${normalized.slice(0, length).trimEnd()}…`;
}

export function buildMarkdownExport(content: string) {
  return `${content.trimEnd()}\n`;
}

export function buildPlainTextExport(content: string) {
  return `${content.trimEnd()}\n`;
}

export function parseMarkdownImport(source: string) {
  return source.replace(/\r\n/g, '\n');
}

export function parsePlainTextImport(source: string) {
  return source.replace(/\r\n/g, '\n');
}

export function splitPlainTextBlocks(content: string) {
  const normalized = content.replace(/\r\n/g, '\n').trim();

  if (!normalized) {
    return [];
  }

  return normalized.split(/\n{2,}/).map((block) => block.trim()).filter(Boolean);
}

export function splitContentBlocks(content: string, contentFormat: ContentFormat) {
  return contentFormat === 'plain' ? splitPlainTextBlocks(content) : splitMarkdownBlocks(content);
}

function formatFileTimestamp(date = new Date()) {
  const year = String(date.getFullYear());
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');

  return `${year}${month}${day}-${hours}${minutes}${seconds}`;
}

export function createTimestampedFilename(extension: 'md' | 'txt' | 'png' | 'jpg' | 'html', prefix = 'poster') {
  return `${prefix}-${formatFileTimestamp()}.${extension}`;
}

export function splitMarkdownBlocks(content: string) {
  const normalized = content.replace(/\r\n/g, '\n').trim();

  if (!normalized) {
    return [];
  }

  const lines = normalized.split('\n');
  const blocks: string[] = [];
  let current: string[] = [];
  let inFence = false;

  function pushCurrent() {
    if (current.length === 0) {
      return;
    }

    blocks.push(current.join('\n').trim());
    current = [];
  }

  for (const line of lines) {
    const trimmed = line.trim();

    if (trimmed.startsWith('```')) {
      current.push(line);
      inFence = !inFence;
      continue;
    }

    if (inFence) {
      current.push(line);
      continue;
    }

    if (trimmed === '') {
      pushCurrent();
      continue;
    }

    current.push(line);
  }

  pushCurrent();

  return blocks;
}

export function splitOversizedBlock(block: string) {
  if (block.includes('\n')) {
    const lines = block.split('\n').filter(Boolean);

    if (lines.length > 1) {
      const groups: string[] = [];
      let current: string[] = [];

      for (const line of lines) {
        current.push(line);
        if (current.length >= 6) {
          groups.push(current.join('\n'));
          current = [];
        }
      }

      if (current.length > 0) {
        groups.push(current.join('\n'));
      }

      return groups;
    }
  }

  const sentences = block.split(/(?<=[.!?。！？])\s+/).filter(Boolean);

  if (sentences.length > 1) {
    const chunks: string[] = [];
    let current = '';

    for (const sentence of sentences) {
      const candidate = current ? `${current} ${sentence}` : sentence;
      if (candidate.length > 280 && current) {
        chunks.push(current);
        current = sentence;
      } else {
        current = candidate;
      }
    }

    if (current) {
      chunks.push(current);
    }

    return chunks;
  }

  const words = block.split(/\s+/).filter(Boolean);
  const chunks: string[] = [];
  let current: string[] = [];

  for (const word of words) {
    current.push(word);
    if (current.join(' ').length >= 180) {
      chunks.push(current.join(' '));
      current = [];
    }
  }

  if (current.length > 0) {
    chunks.push(current.join(' '));
  }

  return chunks.length > 0 ? chunks : [block];
}

export function createPosterPageFilename(index: number) {
  return `poster-${formatFileTimestamp()}-${String(index).padStart(3, '0')}.png`;
}

export function createManualMilestoneLabel(prefix: string, locale?: string) {
  return `${prefix} ${formatTimestamp(Date.now(), locale)}`;
}

export function normalizeImportedDocument(
  currentDocument: EditorDocument,
  nextContent: string,
  contentFormat = currentDocument.contentFormat,
): EditorDocument {
  return {
    ...currentDocument,
    content: nextContent.replace(/\r\n/g, '\n'),
    contentFormat,
  };
}

export function createPosterPages(markdownPages: string[]): PosterPage[] {
  return markdownPages.map((markdown, index) => ({
    index: index + 1,
    markdown,
  }));
}

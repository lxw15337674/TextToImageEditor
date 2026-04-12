import type { R2Bucket } from '@cloudflare/workers-types'

export interface ClipboardBodyObjectMetadata {
  key: string
  sizeBytes: number
  sha256: string
}

function sha256HexFromBytes(bytes: Uint8Array): Promise<string> {
  const copied = new Uint8Array(bytes.byteLength)
  copied.set(bytes)
  const buffer = copied.buffer
  return crypto.subtle.digest('SHA-256', buffer).then((digest) => (
    Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, '0')).join('')
  ))
}

export function buildClipboardBodyR2Key(entryId: string): string {
  return `clipboard-entries/${entryId}/body`
}

export async function putClipboardBody(
  bucket: R2Bucket,
  payload: {
    entryId: string
    bodyText: string
  }
): Promise<ClipboardBodyObjectMetadata> {
  const key = buildClipboardBodyR2Key(payload.entryId)
  const bytes = new TextEncoder().encode(payload.bodyText)
  const sha256 = await sha256HexFromBytes(bytes)
  await bucket.put(key, bytes, {
    httpMetadata: {
      contentType: 'text/plain; charset=utf-8'
    }
  })
  return {
    key,
    sizeBytes: bytes.byteLength,
    sha256
  }
}

export async function getClipboardBodyText(bucket: R2Bucket, key: string): Promise<string> {
  const object = await bucket.get(key)
  if (!object) {
    throw new Error(`Clipboard body not found in R2: ${key}`)
  }
  return object.text()
}

export async function deleteClipboardBody(bucket: R2Bucket, key: string): Promise<void> {
  await bucket.delete(key)
}

import type { R2Bucket } from '@cloudflare/workers-types'
import { getChunkSizeBytes } from './upload'

export interface R2ChunkUploadResult {
  partIndex: number
  partSizeBytes: number
  r2ObjectKey: string
  eTag?: string
  fileId?: string
  providerResponse: unknown
}

interface UploadFileToR2Input {
  objectId: string
  file: File
  chunkSizeMb?: number
}

interface PutR2PartInput {
  objectId: string
  partIndex: number
  partData: ArrayBuffer | ArrayBufferView | Blob
  contentType?: string
}

export function buildR2PartObjectKey(objectId: string, partIndex: number): string {
  return `objects/${objectId}/parts/${partIndex}`
}

export async function putR2Part(
  bucket: R2Bucket,
  payload: PutR2PartInput
): Promise<R2ChunkUploadResult> {
  const r2ObjectKey = buildR2PartObjectKey(payload.objectId, payload.partIndex)
  const contentType = payload.contentType || 'application/octet-stream'
  const partBody = payload.partData instanceof Blob
    ? await payload.partData.arrayBuffer()
    : payload.partData

  const partSizeBytes = payload.partData instanceof Blob
    ? payload.partData.size
    : payload.partData instanceof ArrayBuffer
      ? payload.partData.byteLength
      : payload.partData.byteLength

  const putResult = await bucket.put(
    r2ObjectKey,
    partBody,
    {
      httpMetadata: {
        contentType
      }
    }
  )

  return {
    partIndex: payload.partIndex,
    partSizeBytes,
    r2ObjectKey,
    eTag: putResult.httpEtag,
    providerResponse: {
      key: putResult.key,
      size: putResult.size,
      uploaded: putResult.uploaded
    }
  }
}

export async function headR2Part(
  bucket: R2Bucket,
  payload: {
    objectId: string
    partIndex: number
  }
): Promise<R2ChunkUploadResult | null> {
  const r2ObjectKey = buildR2PartObjectKey(payload.objectId, payload.partIndex)
  const object = await bucket.head(r2ObjectKey)
  if (!object) {
    return null
  }

  return {
    partIndex: payload.partIndex,
    partSizeBytes: object.size,
    r2ObjectKey,
    eTag: object.httpEtag,
    providerResponse: {
      key: object.key,
      size: object.size,
      uploaded: object.uploaded
    }
  }
}

export async function uploadFileToR2InChunks(
  bucket: R2Bucket,
  request: UploadFileToR2Input
): Promise<R2ChunkUploadResult[]> {
  const chunkSizeBytes = getChunkSizeBytes(request.chunkSizeMb)
  const bytes = new Uint8Array(await request.file.arrayBuffer())
  const totalSizeBytes = bytes.byteLength
  const totalParts = Math.max(1, Math.ceil(totalSizeBytes / chunkSizeBytes))
  const mimeType = request.file.type || 'application/octet-stream'

  const chunks: R2ChunkUploadResult[] = []
  for (let index = 0; index < totalParts; index += 1) {
    const start = index * chunkSizeBytes
    const end = Math.min(start + chunkSizeBytes, totalSizeBytes)
    const partBytes = bytes.slice(start, end)
    const result = await putR2Part(
      bucket,
      {
        objectId: request.objectId,
        partIndex: index,
        partData: partBytes,
        contentType: mimeType
      }
    )
    chunks.push(result)
  }

  return chunks
}

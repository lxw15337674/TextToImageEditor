import type { R2Bucket } from '@cloudflare/workers-types'
import type { StoredObjectPart } from './object-store'
import { fetchTelegramPartBuffer } from './telegram-storage'

interface DownloadStorageConfig {
  apiToken?: string
  requestTimeoutMs?: number
  r2Bucket?: R2Bucket
  prefetchWindow?: number
  onResolvedTelegramFilePath?: (part: StoredObjectPart, providerFilePath: string) => Promise<void> | void
}

export interface DownloadStreamOptions {
  startOffset?: number
  endOffsetExclusive?: number
}

class ProviderError extends Error {
  status: number

  constructor(status: number, message: string) {
    super(message)
    this.name = 'ProviderError'
    this.status = status
  }
}

interface PartSpan {
  part: StoredObjectPart
  partStartOffset: number
  partEndOffsetExclusive: number
}

interface PartSlice {
  part: StoredObjectPart
  sliceStartWithinPart: number
  sliceEndWithinPartExclusive: number
}

const DEFAULT_REQUEST_TIMEOUT_MS = 45_000
const MIN_REQUEST_TIMEOUT_MS = 1_000
const MAX_REQUEST_TIMEOUT_MS = 300_000
const DEFAULT_PREFETCH_WINDOW = 3
const MIN_PREFETCH_WINDOW = 1
const MAX_PREFETCH_WINDOW = 8

function toError(status: number, message: string): ProviderError {
  return new ProviderError(status, message)
}

function normalizeRequestTimeoutMs(rawValue: number | undefined): number {
  if (rawValue === undefined) {
    return DEFAULT_REQUEST_TIMEOUT_MS
  }

  if (Number.isFinite(rawValue) === false || rawValue < MIN_REQUEST_TIMEOUT_MS) {
    return DEFAULT_REQUEST_TIMEOUT_MS
  }

  if (rawValue > MAX_REQUEST_TIMEOUT_MS) {
    return MAX_REQUEST_TIMEOUT_MS
  }

  return Math.floor(rawValue)
}

function normalizePrefetchWindow(rawValue: number | undefined): number {
  if (rawValue === undefined || Number.isFinite(rawValue) === false) {
    return DEFAULT_PREFETCH_WINDOW
  }

  const normalized = Math.floor(rawValue)
  if (normalized < MIN_PREFETCH_WINDOW) {
    return MIN_PREFETCH_WINDOW
  }
  if (normalized > MAX_PREFETCH_WINDOW) {
    return MAX_PREFETCH_WINDOW
  }
  return normalized
}

async function fetchR2ObjectBuffer(
  storage: DownloadStorageConfig,
  r2ObjectKey: string
): Promise<Uint8Array | null> {
  if (!storage.r2Bucket) {
    return null
  }

  const object = await storage.r2Bucket.get(r2ObjectKey)
  if (!object) {
    return null
  }

  return new Uint8Array(await object.arrayBuffer())
}

function buildPartSpans(parts: StoredObjectPart[]): PartSpan[] {
  let currentOffset = 0
  const spans: PartSpan[] = []

  for (const part of parts) {
    const partStartOffset = currentOffset
    const partEndOffsetExclusive = currentOffset + part.partSizeBytes
    spans.push({
      part,
      partStartOffset,
      partEndOffsetExclusive
    })
    currentOffset = partEndOffsetExclusive
  }

  return spans
}

function buildPartSlices(
  spans: PartSpan[],
  startOffset: number,
  endOffsetExclusive: number
): PartSlice[] {
  const slices: PartSlice[] = []

  for (const span of spans) {
    const overlapStart = Math.max(startOffset, span.partStartOffset)
    const overlapEnd = Math.min(endOffsetExclusive, span.partEndOffsetExclusive)
    if (overlapStart >= overlapEnd) {
      continue
    }

    slices.push({
      part: span.part,
      sliceStartWithinPart: overlapStart - span.partStartOffset,
      sliceEndWithinPartExclusive: overlapEnd - span.partStartOffset
    })
  }

  return slices
}

async function loadPartBuffer(
  storage: DownloadStorageConfig,
  timeoutMs: number,
  part: StoredObjectPart
): Promise<Uint8Array> {
  if (part.r2ObjectKey) {
    const r2Buffer = await fetchR2ObjectBuffer(storage, part.r2ObjectKey)
    if (r2Buffer) {
      return r2Buffer
    }
  }

  if (!part.providerFileId) {
    throw toError(
      404,
      `Part ${part.partIndex} is unavailable in both R2 and Telegram metadata`
    )
  }

  const telegramPart = await fetchTelegramPartBuffer(
    {
      apiToken: storage.apiToken,
      requestTimeoutMs: timeoutMs
    },
    {
      providerFileId: part.providerFileId,
      providerFilePath: part.providerFilePath
    }
  )
  if (!part.providerFilePath && storage.onResolvedTelegramFilePath) {
    await storage.onResolvedTelegramFilePath(part, telegramPart.providerFilePath)
  }
  return telegramPart.buffer
}

export function getTotalSizeFromParts(parts: StoredObjectPart[]): number {
  return parts.reduce((sum, part) => sum + part.partSizeBytes, 0)
}

export function buildObjectStreamWithR2Fallback(
  storage: DownloadStorageConfig,
  parts: StoredObjectPart[],
  options: DownloadStreamOptions = {}
): ReadableStream<Uint8Array> {
  const timeoutMs = normalizeRequestTimeoutMs(storage.requestTimeoutMs)
  const prefetchWindow = normalizePrefetchWindow(storage.prefetchWindow)
  const totalSize = getTotalSizeFromParts(parts)
  const startOffset = Math.max(0, Math.floor(options.startOffset ?? 0))
  const endOffsetExclusive = Math.min(
    totalSize,
    Math.max(startOffset, Math.floor(options.endOffsetExclusive ?? totalSize))
  )
  const spans = buildPartSpans(parts)
  const slices = buildPartSlices(spans, startOffset, endOffsetExclusive)

  return new ReadableStream<Uint8Array>({
    async start(controller) {
      try {
        if (slices.length === 0) {
          controller.close()
          return
        }

        const inFlight = new Map<number, Promise<Uint8Array>>()
        let scheduleCursor = 0

        const schedule = () => {
          while (inFlight.size < prefetchWindow && scheduleCursor < slices.length) {
            const slice = slices[scheduleCursor]
            if (!slice) {
              break
            }
            const partIndex = slice.part.partIndex
            if (!inFlight.has(partIndex)) {
              inFlight.set(partIndex, loadPartBuffer(storage, timeoutMs, slice.part))
            }
            scheduleCursor += 1
          }
        }

        schedule()

        for (const slice of slices) {
          const partIndex = slice.part.partIndex
          const bufferPromise = inFlight.get(partIndex) ?? loadPartBuffer(storage, timeoutMs, slice.part)
          const buffer = await bufferPromise
          inFlight.delete(partIndex)
          schedule()

          const chunk = buffer.subarray(slice.sliceStartWithinPart, slice.sliceEndWithinPartExclusive)
          if (chunk.byteLength > 0) {
            controller.enqueue(chunk)
          }
        }

        controller.close()
      } catch (error) {
        if (error && typeof error === 'object' && 'message' in error) {
          controller.error(error)
          return
        }
        controller.error(toError(500, 'Unknown download stream error'))
      }
    }
  })
}

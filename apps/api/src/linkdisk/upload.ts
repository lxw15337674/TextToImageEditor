export interface UploadStorageConfig {
  apiToken: string
  chatId: string
  requestTimeoutMs?: number
}

interface UploadFileRequest {
  objectId: string
  file: File
  chunkSizeMb?: number
}

export interface UploadChunkResult {
  partIndex: number
  partSizeBytes: number
  fileId?: string
  providerResponse: unknown
}

interface UploadFileResult {
  objectId: string
  fileName: string
  mimeType: string
  totalSizeBytes: number
  totalParts: number
  chunks: UploadChunkResult[]
}

class ProviderError extends Error {
  status: number

  constructor(status: number, message: string) {
    super(message)
    this.name = 'ProviderError'
    this.status = status
  }
}

const BYTES_PER_MB = 1024 * 1024
const DEFAULT_CHUNK_SIZE_MB = 19
const MAX_CHUNK_SIZE_MB = 20
const DEFAULT_REQUEST_TIMEOUT_MS = 45_000
const MIN_REQUEST_TIMEOUT_MS = 1_000
const MAX_REQUEST_TIMEOUT_MS = 300_000

function toError(status: number, message: string): ProviderError {
  return new ProviderError(status, message)
}

function normalizeChunkSizeMb(rawValue: number | undefined): number {
  if (rawValue === undefined) {
    return DEFAULT_CHUNK_SIZE_MB
  }

  if (Number.isFinite(rawValue) === false || rawValue <= 0) {
    throw toError(400, 'chunkSizeMb must be a positive number')
  }

  if (rawValue > MAX_CHUNK_SIZE_MB) {
    throw toError(400, `chunkSizeMb cannot exceed ${MAX_CHUNK_SIZE_MB}`)
  }

  return Math.max(1, Math.floor(rawValue))
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

export function getChunkSizeBytes(chunkSizeMb: number | undefined): number {
  return normalizeChunkSizeMb(chunkSizeMb) * BYTES_PER_MB
}

export function getTotalParts(totalSizeBytes: number, chunkSizeMb: number | undefined): number {
  return Math.max(1, Math.ceil(totalSizeBytes / getChunkSizeBytes(chunkSizeMb)))
}

function asRecord(value: unknown): Record<string, unknown> | undefined {
  if (value !== null && typeof value === 'object') {
    return value as Record<string, unknown>
  }

  return undefined
}

function extractTelegramFileId(providerResponse: unknown): string | undefined {
  const root = asRecord(providerResponse)
  if (!root) {
    return undefined
  }

  const result = asRecord(root.result)
  if (!result) {
    return undefined
  }

  const document = asRecord(result.document)
  if (!document) {
    return undefined
  }

  const fileId = document.file_id
  return typeof fileId === 'string' ? fileId : undefined
}

async function parseProviderResponse(response: Response): Promise<unknown> {
  const contentType = response.headers.get('content-type') ?? ''

  if (contentType.includes('application/json')) {
    return response.json()
  }

  const text = await response.text()
  if (text.length === 0) {
    return null
  }

  try {
    return JSON.parse(text)
  } catch {
    return text
  }
}

async function uploadChunk(
  storage: UploadStorageConfig,
  payload: {
    objectId: string
    fileName: string
    mimeType: string
    totalSizeBytes: number
    totalParts: number
    partIndex: number
    partBlob: Blob
  }
): Promise<UploadChunkResult> {
  const requestTimeoutMs = normalizeRequestTimeoutMs(storage.requestTimeoutMs)
  const telegramApiUrl = `https://api.telegram.org/bot${storage.apiToken}/sendDocument`

  const formData = new FormData()
  const partName = `${payload.fileName}.part${payload.partIndex}`
  const partFile = new File([payload.partBlob], partName, {
    type: payload.mimeType
  })

  formData.append('chat_id', storage.chatId)
  formData.append('document', partFile, partName)
  formData.append(
    'caption',
    `object:${payload.objectId} part:${payload.partIndex}/${payload.totalParts}`
  )

  const timeoutController = new AbortController()
  const timeoutId = setTimeout(() => {
    timeoutController.abort()
  }, requestTimeoutMs)

  let response: Response
  try {
    response = await fetch(telegramApiUrl, {
      method: 'POST',
      body: formData,
      signal: timeoutController.signal
    })
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      throw toError(
        502,
        `Telegram upload timed out after ${requestTimeoutMs}ms on part ${payload.partIndex}/${payload.totalParts}`
      )
    }

    throw toError(
      502,
      `Telegram upload request failed on part ${payload.partIndex}/${payload.totalParts}: ${
        error instanceof Error ? error.message : 'unknown network error'
      }`
    )
  } finally {
    clearTimeout(timeoutId)
  }

  const providerResponse = await parseProviderResponse(response)
  const root = asRecord(providerResponse)
  const telegramOk = root && root.ok === true

  if (response.ok === false || !telegramOk) {
    const details = typeof providerResponse === 'string'
      ? providerResponse
      : JSON.stringify(providerResponse)

    throw toError(
      response.status || 502,
      `Telegram upload failed on part ${payload.partIndex}/${payload.totalParts}: ${details}`
    )
  }

  const fileId = extractTelegramFileId(providerResponse)
  if (!fileId) {
    throw toError(
      502,
      `Telegram response missing document.file_id on part ${payload.partIndex}/${payload.totalParts}`
    )
  }

  return {
    partIndex: payload.partIndex,
    partSizeBytes: payload.partBlob.size,
    fileId,
    providerResponse
  }
}

export async function uploadBlobPartToTelegram(
  storage: UploadStorageConfig,
  payload: {
    objectId: string
    fileName: string
    mimeType: string
    totalParts: number
    partIndex: number
    partData: Blob | ArrayBuffer | ArrayBufferView
  }
): Promise<UploadChunkResult> {
  if (storage.apiToken.trim().length === 0) {
    throw toError(500, 'Missing TELEGRAM_API_TOKEN')
  }
  if (storage.chatId.trim().length === 0) {
    throw toError(500, 'Missing TELEGRAM_CHAT_ID')
  }

  let partBlob: Blob
  if (payload.partData instanceof Blob) {
    partBlob = payload.partData
  } else if (payload.partData instanceof ArrayBuffer) {
    partBlob = new Blob([payload.partData], {
      type: payload.mimeType || 'application/octet-stream'
    })
  } else {
    const bytes = new Uint8Array(
      payload.partData.buffer,
      payload.partData.byteOffset,
      payload.partData.byteLength
    )
    const strictBuffer = bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength) as ArrayBuffer
    partBlob = new Blob([strictBuffer], {
      type: payload.mimeType || 'application/octet-stream'
    })
  }

  return uploadChunk(storage, {
    objectId: payload.objectId,
    fileName: payload.fileName,
    mimeType: payload.mimeType || 'application/octet-stream',
    totalSizeBytes: partBlob.size,
    totalParts: payload.totalParts,
    partIndex: payload.partIndex,
    partBlob
  })
}

export async function uploadFileInChunks(
  storage: UploadStorageConfig,
  request: UploadFileRequest
): Promise<UploadFileResult> {
  if (storage.apiToken.trim().length === 0) {
    throw toError(500, 'Missing TELEGRAM_API_TOKEN')
  }
  if (storage.chatId.trim().length === 0) {
    throw toError(500, 'Missing TELEGRAM_CHAT_ID')
  }

  const chunkSizeMb = normalizeChunkSizeMb(request.chunkSizeMb)
  const chunkSizeBytes = chunkSizeMb * BYTES_PER_MB
  const bytes = new Uint8Array(await request.file.arrayBuffer())
  const totalSizeBytes = bytes.byteLength
  const totalParts = Math.max(1, Math.ceil(totalSizeBytes / chunkSizeBytes))
  const mimeType = request.file.type || 'application/octet-stream'

  const chunks: UploadChunkResult[] = []

  for (let index = 0; index < totalParts; index += 1) {
    const start = index * chunkSizeBytes
    const end = Math.min(start + chunkSizeBytes, totalSizeBytes)
    const partBytes = bytes.slice(start, end)
    const partBlob = new Blob([partBytes], { type: mimeType })
    const partIndex = index

    const chunkResult = await uploadChunk(storage, {
      objectId: request.objectId,
      fileName: request.file.name,
      mimeType,
      totalSizeBytes,
      totalParts,
      partIndex,
      partBlob
    })

    chunks.push(chunkResult)
  }

  return {
    objectId: request.objectId,
    fileName: request.file.name,
    mimeType,
    totalSizeBytes,
    totalParts,
    chunks
  }
}

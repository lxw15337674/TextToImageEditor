class ProviderError extends Error {
  status: number

  constructor(status: number, message: string) {
    super(message)
    this.name = 'ProviderError'
    this.status = status
  }
}

export interface TelegramStorageConfig {
  apiToken?: string
  requestTimeoutMs?: number
}

const DEFAULT_REQUEST_TIMEOUT_MS = 45_000
const MIN_REQUEST_TIMEOUT_MS = 1_000
const MAX_REQUEST_TIMEOUT_MS = 300_000

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

function asRecord(value: unknown): Record<string, unknown> | undefined {
  if (value !== null && typeof value === 'object') {
    return value as Record<string, unknown>
  }

  return undefined
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

async function fetchWithTimeout(url: string, timeoutMs: number): Promise<Response> {
  const timeoutController = new AbortController()
  const timeoutId = setTimeout(() => {
    timeoutController.abort()
  }, timeoutMs)

  try {
    return await fetch(url, {
      method: 'GET',
      signal: timeoutController.signal
    })
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      throw toError(502, `Telegram request timed out after ${timeoutMs}ms`)
    }

    throw toError(
      502,
      `Telegram request failed: ${error instanceof Error ? error.message : 'unknown network error'}`
    )
  } finally {
    clearTimeout(timeoutId)
  }
}

export async function resolveTelegramFilePath(
  storage: TelegramStorageConfig,
  providerFileId: string
): Promise<string> {
  if (!storage.apiToken || storage.apiToken.trim().length === 0) {
    throw toError(500, 'Missing TELEGRAM_API_TOKEN for Telegram fallback download')
  }

  const timeoutMs = normalizeRequestTimeoutMs(storage.requestTimeoutMs)
  const getFileUrl = `https://api.telegram.org/bot${storage.apiToken}/getFile?file_id=${encodeURIComponent(providerFileId)}`
  const response = await fetchWithTimeout(getFileUrl, timeoutMs)
  const providerResponse = await parseProviderResponse(response)
  const root = asRecord(providerResponse)
  const result = asRecord(root?.result)
  const filePath = result?.file_path

  if (!response.ok || root?.ok !== true || typeof filePath !== 'string' || filePath.length === 0) {
    const details = typeof providerResponse === 'string' ? providerResponse : JSON.stringify(providerResponse)
    throw toError(502, `Telegram getFile failed for file_id ${providerFileId}: ${details}`)
  }

  return filePath
}

export async function fetchTelegramPartBuffer(
  storage: TelegramStorageConfig,
  payload: {
    providerFileId: string
    providerFilePath?: string | null
  }
): Promise<{
  buffer: Uint8Array
  providerFilePath: string
}> {
  if (!storage.apiToken || storage.apiToken.trim().length === 0) {
    throw toError(500, 'Missing TELEGRAM_API_TOKEN for Telegram fallback download')
  }

  const timeoutMs = normalizeRequestTimeoutMs(storage.requestTimeoutMs)
  const providerFilePath = payload.providerFilePath?.trim() || await resolveTelegramFilePath(storage, payload.providerFileId)
  const fileUrl = `https://api.telegram.org/file/bot${storage.apiToken}/${providerFilePath}`
  const response = await fetchWithTimeout(fileUrl, timeoutMs)

  if (!response.ok || !response.body) {
    throw toError(502, `Telegram file fetch failed for path ${providerFilePath}`)
  }

  return {
    buffer: new Uint8Array(await response.arrayBuffer()),
    providerFilePath
  }
}

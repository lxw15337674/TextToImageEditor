export const SCAFFOLD_INFO = Object.freeze({
  name: 'CF Monorepo Template',
  version: '0.1.0',
} as const)

export const API_PATHS = Object.freeze({
  health: '/api/health',
  notes: '/api/notes',
  noteTemplate: '/api/notes/{id}',
  docs: '/docs',
  openapi: '/openapi.json',
} as const)

export const API_DOC_INFO = Object.freeze({
  title: 'CF Template API',
  version: '1.0.0',
  description: 'Minimal Cloudflare Worker API template with Hono, OpenAPI docs, and a D1-backed notes example.',
} as const)

export interface HealthResponse {
  success: true
  status: 'ok'
}

export interface Note {
  id: string
  title: string
  createdAt: string
  updatedAt: string
}

export interface NotesListResponse {
  success: true
  data: {
    notes: Note[]
  }
}

export interface NoteResponse {
  success: true
  data: {
    note: Note
  }
}

export interface ApiErrorResponse {
  success: false
  message: string
}

export interface CreateNoteRequest {
  title: string
}

export function createHealthResponse(): HealthResponse {
  return {
    success: true,
    status: 'ok',
  }
}

export function createNotePath(id: string) {
  return `/api/notes/${encodeURIComponent(id)}`
}

import { OpenAPIHono, createRoute, z } from '@hono/zod-openapi'
import { Scalar } from '@scalar/hono-api-reference'
import type { D1Database, ExecutionContext, R2Bucket, ScheduledController } from '@cloudflare/workers-types'
import { desc, eq } from 'drizzle-orm'
import type { MiddlewareHandler, Next } from 'hono'
import { cors } from 'hono/cors'
import { etag } from 'hono/etag'
import { secureHeaders } from 'hono/secure-headers'
import { API_DOC_INFO, API_PATHS, createHealthResponse } from '@cf-template/shared'
import { getDb } from './db'
import linkdiskWorker from './linkdisk'
import { notes } from './schema'

interface Bindings {
  APP_DB?: D1Database
  LINKDISK_R2?: R2Bucket
  ADMIN_JWT_SECRET?: string
  ADMIN_JWT_DISABLED?: string
  TELEGRAM_API_TOKEN?: string
  TELEGRAM_CHAT_ID?: string
  TELEGRAM_FETCH_TIMEOUT_MS?: string
  INSTANT_UPLOAD_ENABLED?: string
  ARCHIVE_MAX_ATTEMPTS?: string
  ARCHIVE_BATCH_SIZE?: string
  ARCHIVE_LEASE_SECONDS?: string
  ARCHIVE_RETRY_BASE_SECONDS?: string
  DOWNLOAD_PREFETCH_WINDOW?: string
  R2_DIRECT_UPLOAD_ENABLED?: string
  R2_S3_ACCOUNT_ID?: string
  R2_S3_ACCESS_KEY_ID?: string
  R2_S3_SECRET_ACCESS_KEY?: string
  R2_S3_BUCKET_NAME?: string
  R2_PRESIGNED_URL_TTL_SECONDS?: string
  TURNSTILE_SITE_KEY?: string
  TURNSTILE_SECRET_KEY?: string
  DASHBOARD_ACCESS_TOKEN?: string
  CLIPBOARD_MAX_BODY_CHARS?: string
  CLIPBOARD_MAX_ATTACHMENTS?: string
  CLIPBOARD_ATTACHMENT_MAX_MB?: string
  CLIPBOARD_MAX_EXPIRE_DAYS?: string
  CLIPBOARD_DRAFT_TTL_HOURS?: string
  CLIPBOARD_UPLOAD_TTL_HOURS?: string
  CLIPBOARD_CLEANUP_BATCH_SIZE?: string
}

type AppEnv = {
  Bindings: Bindings
}

const HealthResponseSchema = z
  .object({
    success: z.literal(true),
    status: z.literal('ok'),
  })
  .openapi('HealthResponse')

const NoteSchema = z
  .object({
    id: z.string(),
    title: z.string(),
    createdAt: z.string(),
    updatedAt: z.string(),
  })
  .openapi('Note')

const NotesListResponseSchema = z
  .object({
    success: z.literal(true),
    data: z.object({
      notes: z.array(NoteSchema),
    }),
  })
  .openapi('NotesListResponse')

const NoteResponseSchema = z
  .object({
    success: z.literal(true),
    data: z.object({
      note: NoteSchema,
    }),
  })
  .openapi('NoteResponse')

const ErrorResponseSchema = z
  .object({
    success: z.literal(false),
    message: z.string(),
  })
  .openapi('ApiErrorResponse')

const CreateNoteRequestSchema = z
  .object({
    title: z.string().trim().min(1).max(160),
  })
  .openapi('CreateNoteRequest')

const NoteIdParamsSchema = z.object({
  id: z.string().openapi({
    param: {
      name: 'id',
      in: 'path',
    },
    example: '1f2e3d4c',
  }),
})

const healthRoute = createRoute({
  method: 'get',
  path: API_PATHS.health,
  responses: {
    200: {
      content: {
        'application/json': {
          schema: HealthResponseSchema,
        },
      },
      description: 'Worker health status.',
    },
  },
})

const listNotesRoute = createRoute({
  method: 'get',
  path: API_PATHS.notes,
  responses: {
    200: {
      content: {
        'application/json': {
          schema: NotesListResponseSchema,
        },
      },
      description: 'List the latest notes from D1.',
    },
  },
})

const createNoteRoute = createRoute({
  method: 'post',
  path: API_PATHS.notes,
  request: {
    body: {
      content: {
        'application/json': {
          schema: CreateNoteRequestSchema,
        },
      },
      required: true,
    },
  },
  responses: {
    201: {
      content: {
        'application/json': {
          schema: NoteResponseSchema,
        },
      },
      description: 'Create a new note.',
    },
    400: {
      content: {
        'application/json': {
          schema: ErrorResponseSchema,
        },
      },
      description: 'Validation failed.',
    },
  },
})

const deleteNoteRoute = createRoute({
  method: 'delete',
  path: '/api/notes/{id}',
  request: {
    params: NoteIdParamsSchema,
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: NoteResponseSchema,
        },
      },
      description: 'Delete an existing note.',
    },
    404: {
      content: {
        'application/json': {
          schema: ErrorResponseSchema,
        },
      },
      description: 'Note not found.',
    },
  },
})

const app = new OpenAPIHono<AppEnv>()
const LINKDISK_PATH_PREFIXES = ['/api/linkdisk', '/admin-api/linkdisk'] as const
const LINKDISK_EXACT_PATHS = ['/docs/linkdisk', '/openapi/linkdisk.json'] as const

const requestLoggerMiddleware: MiddlewareHandler<AppEnv> = async (c, next: Next) => {
  const startedAt = Date.now()
  const url = new URL(c.req.url)
  await next()
  console.log(
    JSON.stringify({
      type: 'request',
      method: c.req.method,
      path: url.pathname,
      status: c.res.status,
      durationMs: Date.now() - startedAt,
    }),
  )
}

app.onError((error, c) => {
  console.error(error)
  return c.json(
    {
      success: false as const,
      message: 'Unexpected server error.',
    },
    500,
  )
})

app.use('*', requestLoggerMiddleware)
app.use('*', cors())
app.use('*', secureHeaders())
app.use('/api/*', etag())

app.openapi(healthRoute, (c) => c.json(createHealthResponse()))

app.openapi(listNotesRoute, async (c) => {
  const db = getDb(c.env)
  const rows = await db.select().from(notes).orderBy(desc(notes.updatedAt))

  return c.json({
    success: true,
    data: {
      notes: rows,
    },
  })
})

app.openapi(createNoteRoute, async (c) => {
  const db = getDb(c.env)
  const body = c.req.valid('json')
  const nowIso = new Date().toISOString()
  const note = {
    id: crypto.randomUUID(),
    title: body.title,
    createdAt: nowIso,
    updatedAt: nowIso,
  }

  await db.insert(notes).values({
    id: note.id,
    title: note.title,
    createdAt: note.createdAt,
    updatedAt: note.updatedAt,
  })

  return c.json(
    {
      success: true,
      data: {
        note,
      },
    },
    201,
  )
})

app.openapi(deleteNoteRoute, async (c) => {
  const db = getDb(c.env)
  const { id } = c.req.valid('param')
  const [note] = await db.select().from(notes).where(eq(notes.id, id)).limit(1)

  if (!note) {
    return c.json(
      {
        success: false as const,
        message: 'Note not found.',
      },
      404,
    )
  }

  await db.delete(notes).where(eq(notes.id, id))

  return c.json(
    {
      success: true,
      data: {
        note,
      },
    },
    200,
  )
})

app.doc(API_PATHS.openapi, {
  openapi: '3.0.0',
  info: {
    title: API_DOC_INFO.title,
    version: API_DOC_INFO.version,
    description: API_DOC_INFO.description,
  },
})

app.get(API_PATHS.docs, Scalar({ theme: 'purple', url: API_PATHS.openapi }))

function shouldHandleWithLinkDisk(pathname: string) {
  if (LINKDISK_EXACT_PATHS.includes(pathname as (typeof LINKDISK_EXACT_PATHS)[number])) {
    return true
  }

  return LINKDISK_PATH_PREFIXES.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`))
}

export type ApiAppType = typeof app
export { app }

const worker = {
  fetch(request: Request, env: Bindings, executionCtx: ExecutionContext) {
    const { pathname } = new URL(request.url)

    if (shouldHandleWithLinkDisk(pathname)) {
      return linkdiskWorker.fetch(request, env, executionCtx)
    }

    return app.fetch(request, env, executionCtx)
  },
  async scheduled(controller: ScheduledController, env: Bindings, _executionCtx: ExecutionContext) {
    if (typeof linkdiskWorker.scheduled === 'function') {
      await linkdiskWorker.scheduled(controller, env)
    }
  },
}

export default worker

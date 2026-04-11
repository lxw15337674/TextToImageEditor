import { env as workerEnv } from 'cloudflare:test'
import { beforeAll, beforeEach, describe, expect, it } from 'vitest'
import { API_DOC_INFO, API_PATHS, createHealthResponse } from '@cf-template/shared'
import { app } from './index'

interface TestBindings {
  APP_DB?: D1Database
}

declare module 'cloudflare:test' {
  interface ProvidedEnv extends TestBindings {}
}

async function initializeTestSchema() {
  if (!workerEnv.APP_DB) {
    throw new Error('Missing D1 binding APP_DB in test environment')
  }

  await workerEnv.APP_DB.prepare('DROP TABLE IF EXISTS notes').run()
  await workerEnv.APP_DB.prepare(
    `CREATE TABLE notes (
      id TEXT PRIMARY KEY NOT NULL,
      title TEXT NOT NULL,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    )`,
  ).run()
}

beforeAll(async () => {
  await initializeTestSchema()
})

beforeEach(async () => {
  if (!workerEnv.APP_DB) {
    throw new Error('Missing D1 binding APP_DB in test environment')
  }

  await workerEnv.APP_DB.prepare('DELETE FROM notes').run()
})

describe('cf template api', () => {
  it('returns the health payload', async () => {
    const response = await app.request(`http://localhost${API_PATHS.health}`, undefined, workerEnv)

    expect(response.status).toBe(200)
    await expect(response.json()).resolves.toEqual(createHealthResponse())
  })

  it('creates and lists notes', async () => {
    const createResponse = await app.request(
      `http://localhost${API_PATHS.notes}`,
      {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
        },
        body: JSON.stringify({
          title: 'First template note',
        }),
      },
      workerEnv,
    )

    expect(createResponse.status).toBe(201)
    const createdPayload = await createResponse.json() as {
      success: true
      data: {
        note: {
          id: string
          title: string
        }
      }
    }

    expect(createdPayload.data.note.title).toBe('First template note')

    const listResponse = await app.request(`http://localhost${API_PATHS.notes}`, undefined, workerEnv)
    expect(listResponse.status).toBe(200)

    const listPayload = await listResponse.json() as {
      success: true
      data: {
        notes: Array<{ id: string; title: string }>
      }
    }

    expect(listPayload.data.notes).toHaveLength(1)
    expect(listPayload.data.notes[0]?.id).toBe(createdPayload.data.note.id)
  })

  it('deletes an existing note', async () => {
    const createResponse = await app.request(
      `http://localhost${API_PATHS.notes}`,
      {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
        },
        body: JSON.stringify({
          title: 'Delete me',
        }),
      },
      workerEnv,
    )

    const createdPayload = await createResponse.json() as {
      success: true
      data: {
        note: {
          id: string
        }
      }
    }

    const deleteResponse = await app.request(
      `http://localhost/api/notes/${createdPayload.data.note.id}`,
      {
        method: 'DELETE',
      },
      workerEnv,
    )

    expect(deleteResponse.status).toBe(200)

    const listResponse = await app.request(`http://localhost${API_PATHS.notes}`, undefined, workerEnv)
    const listPayload = await listResponse.json() as {
      success: true
      data: {
        notes: unknown[]
      }
    }

    expect(listPayload.data.notes).toHaveLength(0)
  })

  it('exposes OpenAPI metadata', async () => {
    const response = await app.request(`http://localhost${API_PATHS.openapi}`, undefined, workerEnv)
    expect(response.status).toBe(200)

    const payload = await response.json() as {
      info: {
        title: string
      }
    }

    expect(payload.info.title).toBe(API_DOC_INFO.title)
  })
})

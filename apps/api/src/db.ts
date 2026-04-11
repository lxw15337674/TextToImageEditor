import type { D1Database } from '@cloudflare/workers-types'
import { drizzle } from 'drizzle-orm/d1'
import { notes } from './schema'

export interface DatabaseBindings {
  APP_DB?: D1Database
}

export function getDb(env: DatabaseBindings) {
  const database = env.APP_DB
  if (!database) {
    throw new Error('Missing D1 binding APP_DB')
  }

  return drizzle(database, {
    schema: {
      notes,
    },
  })
}

export type ApiDatabase = ReturnType<typeof getDb>

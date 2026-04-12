import { drizzle } from 'drizzle-orm/d1'
import type { D1Database } from '@cloudflare/workers-types'
import {
  clipboardEntries,
  clipboardEntryAttachments,
  clipboardEvents,
  clipboardShareAccessTokens,
  clipboardShareSettings,
  objectParts,
  objects
} from './schema'

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
      clipboardEntries,
      clipboardEntryAttachments,
      clipboardEvents,
      clipboardShareAccessTokens,
      clipboardShareSettings,
      objects,
      objectParts
    }
  })
}

export type ApiDatabase = ReturnType<typeof getDb>

# AGENTS.md

This file provides guidance to Codex when working inside `apps/api`.

## Project Overview

`apps/api` is a minimal Cloudflare Workers API template built with Hono, Drizzle D1, and OpenAPI docs. The current example domain is intentionally small: a `notes` resource used to demonstrate end-to-end data flow between the web app, the Worker, and D1.

## Development Commands

```bash
pnpm dev:api
pnpm build:api
pnpm --filter cf-template-api test
pnpm db:migrations:list
pnpm db:migrate:local
pnpm db:migrate:remote
```

## Architecture Overview

- `src/index.ts`: Hono entrypoint, middleware, route definitions, OpenAPI docs
- `src/db.ts`: D1 binding access through Drizzle
- `src/schema.ts`: current `notes` table schema
- `src/index.test.ts`: Worker integration tests

## Current API Surface

- `GET /api/health`
- `GET /api/notes`
- `POST /api/notes`
- `DELETE /api/notes/:id`
- `GET /openapi.json`
- `GET /docs`

## Implementation Notes

1. Keep the API generic. If you add new product logic, create a new domain module instead of overloading the starter `notes` example.
2. Use `APP_DB` as the D1 binding. Do not reintroduce legacy binding names.
3. When changing schema, update both `src/schema.ts` and `apps/api/migrations/`.
4. The worker uses `wrangler.jsonc` plus generated `worker-configuration.d.ts`; regenerate types with `pnpm build:api` after config changes.
5. Keep middleware and response formats small and copyable. This project is meant to be a starter, not a feature dump.

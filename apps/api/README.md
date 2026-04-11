# CF Template API

Minimal Cloudflare Workers API template built with Hono, OpenAPI docs, and a D1-backed notes example.

## What It Includes

- `GET /api/health` for a basic worker health check
- `GET /api/notes`, `POST /api/notes`, `DELETE /api/notes/:id` as the minimal D1 example
- `GET /openapi.json` for the generated OpenAPI spec
- `GET /docs` for interactive Scalar documentation

## Files

- `src/index.ts`: Hono app, routes, middleware, OpenAPI setup
- `src/schema.ts`: current Drizzle D1 schema
- `migrations/0000_create_notes.sql`: starter migration
- `src/index.test.ts`: Worker integration tests

## Development

```bash
pnpm dev:api
pnpm build:api
pnpm --filter cf-template-api test
```

## D1

The worker expects a D1 binding named `APP_DB`.

List local migrations:

```bash
pnpm db:migrations:list
```

Apply local migrations:

```bash
pnpm db:migrate:local
```

Apply remote migrations:

```bash
pnpm db:migrate:remote
```

## Local Configuration

The starter API does not require extra secrets by default.

- Example file: `apps/api/.dev.vars.example`
- Wrangler config: `apps/api/wrangler.jsonc`

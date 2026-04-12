# tools

Cloudflare-oriented pnpm monorepo template for building a localized web app and a Worker API from the same codebase.

## What You Get

- Localized Next.js frontend under `apps/web`
- Hono + Cloudflare Workers API under `apps/api`
- OpenAPI JSON and Scalar docs out of the box
- A minimal D1-backed `notes` example to show end-to-end data flow
- Shared workspace contracts in `packages/shared`
- Shared TypeScript presets in `packages/config-ts`

This repository is intentionally opinionated about infrastructure and intentionally light on product logic. It keeps the reusable shell and removes domain-specific upload, sharing, storage, and archival features.

## Starter Surface

Web routes:

- `/:locale`
- `/:locale/starter`
- `/:locale/notes`

API routes:

- `GET /api/health`
- `GET /api/notes`
- `POST /api/notes`
- `DELETE /api/notes/:id`
- `GET /openapi.json`
- `GET /docs`

## Stack

- `apps/web`: Next.js 15, Vinext, React 19, next-intl, next-themes, shadcn-style UI primitives
- `apps/api`: Hono, Drizzle ORM, Cloudflare Workers, D1, OpenAPI via `@hono/zod-openapi`
- `packages/shared`: API paths and transport types shared across apps

## Repository Layout

```text
apps/
  api/        Worker API, D1 migration, tests, Wrangler config
  web/        Localized frontend, route tree, UI shell, web worker config
packages/
  config-ts/  Shared TypeScript config presets
  shared/     Shared route constants and response types
```

## Quick Start

Install dependencies:

```bash
pnpm install
```

Run the frontend:

```bash
pnpm dev:web
```

Run the API:

```bash
pnpm dev:api
```

Run both:

```bash
pnpm dev:all
```

## Environment

Web local example:

- `apps/web/.env.local.example`

Required web values:

- `NEXT_PUBLIC_SITE_URL`
- `NEXT_PUBLIC_API_BASE_URL`

API local example:

- `apps/api/.dev.vars.example`

API binding:

- `APP_DB` in `apps/api/wrangler.jsonc`

The starter API does not require extra secrets until you add your own product features.

## Database

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

The current D1 example schema is defined in `apps/api/src/schema.ts` and migrated by `apps/api/migrations/0000_create_notes.sql`.

## Validation

Run the baseline checks:

```bash
pnpm lint
pnpm typecheck
pnpm build:web
pnpm build:api
pnpm --filter cf-template-api test
```

## Customization Order

Recommended first edits:

1. Replace placeholder public URLs and D1 IDs in the Wrangler configs.
2. Rename the visible app copy in `apps/web/src/i18n/messages.ts`.
3. Replace the `notes` example with your first real domain module.
4. Add auth, queues, storage, or background jobs only when the product actually needs them.

## Deployment

Deploy the web app:

```bash
pnpm deploy:web
```

Deploy the API:

```bash
pnpm deploy:api
```

Before deployment, update:

- `apps/web/wrangler.jsonc`
- `apps/api/wrangler.jsonc`

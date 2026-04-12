# tools

Cloudflare-oriented pnpm monorepo for a localized web app and a Worker API from the same codebase. The current repo contains two product surfaces:

- `Text to Image Editor`: a localized editor for writing, versioned drafting, and generating shareable images
- `LinkDisk`: temporary text and file sharing under `/:locale/linkdisk`

## What You Get

- Localized Next.js frontend under `apps/web`
- Hono + Cloudflare Workers API under `apps/api`
- OpenAPI JSON and Scalar docs out of the box
- A D1-backed `notes` example to keep the starter API surface small and testable
- LinkDisk web routes, clipboard sharing flow, and shared contracts in the same deployments
- Shared workspace contracts in `packages/shared`
- Shared TypeScript presets in `packages/config-ts`

This repository is infrastructure-opinionated, but it now includes a production-oriented LinkDisk module with temporary shares, attachments, and archival hooks.

## Starter Surface

Web routes:

- `/:locale`
- `/:locale/linkdisk`
- `/:locale/linkdisk/use-cases`
- `/:locale/linkdisk/clipboard/recent`
- `/:locale/linkdisk/s/:shareId`
- `/:locale/linkdisk/m/:manageId`
- `/:locale/starter`
- `/:locale/notes`

API routes:

- `GET /api/health`
- `GET /api/notes`
- `POST /api/notes`
- `DELETE /api/notes/:id`
- `GET /openapi.json`
- `GET /docs`
- `GET /api/linkdisk/health`
- `GET /openapi/linkdisk.json`
- `GET /docs/linkdisk`

## Stack

- `apps/web`: Next.js 15, Vinext, React 19, next-intl, next-themes, shadcn-style UI primitives
- `apps/api`: Hono, Drizzle ORM, Cloudflare Workers, D1, OpenAPI via `@hono/zod-openapi`
- `packages/shared`: starter API paths and transport types
- `packages/linkdisk-shared`: LinkDisk API paths and transport types

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
- `NEXT_PUBLIC_TURNSTILE_SITE_KEY` when LinkDisk Turnstile verification is enabled

API local example:

- `apps/api/.dev.vars.example`

API binding:

- `APP_DB` in `apps/api/wrangler.jsonc`
- `LINKDISK_R2` in `apps/api/wrangler.jsonc` for LinkDisk body/object storage

Required LinkDisk API secrets and vars for production:

- `ADMIN_JWT_SECRET`
- `TELEGRAM_API_TOKEN`
- `TELEGRAM_CHAT_ID`
- `TURNSTILE_SECRET_KEY` when Turnstile is enabled
- `TURNSTILE_SITE_KEY` should match `NEXT_PUBLIC_TURNSTILE_SITE_KEY`

Optional LinkDisk API vars:

- `DASHBOARD_ACCESS_TOKEN`
- `INSTANT_UPLOAD_ENABLED`
- `R2_DIRECT_UPLOAD_ENABLED`
- `DOWNLOAD_PREFETCH_WINDOW`
- `CLIPBOARD_MAX_BODY_CHARS`
- `CLIPBOARD_MAX_ATTACHMENTS`
- `CLIPBOARD_ATTACHMENT_MAX_MB`
- `CLIPBOARD_MAX_EXPIRE_DAYS`
- `CLIPBOARD_DRAFT_TTL_HOURS`
- `CLIPBOARD_UPLOAD_TTL_HOURS`
- `CLIPBOARD_CLEANUP_BATCH_SIZE`

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

The current D1 schema includes:

- starter notes in `apps/api/migrations/0000_create_notes.sql`
- LinkDisk clipboard/object tables in `apps/api/migrations/0001_linkdisk_clipboard_body_r2.sql`, `0002_linkdisk_attachment_object_reuse.sql`, and `0003_linkdisk_telegram_file_path_cache.sql`

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

Production checklist for LinkDisk:

1. Replace placeholder public URLs and bucket/database identifiers in both Wrangler configs.
2. Create the `LINKDISK_R2` bucket and bind it in `apps/api/wrangler.jsonc`.
3. Configure API secrets: `ADMIN_JWT_SECRET`, `TELEGRAM_API_TOKEN`, `TELEGRAM_CHAT_ID`, `TURNSTILE_SECRET_KEY`.
4. Keep `TURNSTILE_SITE_KEY` on the API side aligned with `NEXT_PUBLIC_TURNSTILE_SITE_KEY` on the web side.
5. Apply D1 migrations before deploy with `pnpm db:migrate:remote`.
6. Run `pnpm verify:deploy-config`.
7. Run `pnpm lint && pnpm typecheck && pnpm build:web && pnpm build:api && pnpm --filter cf-template-api test`.

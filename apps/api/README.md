# CF Template API

Cloudflare Workers API with two surfaces:

- starter notes endpoints
- LinkDisk clipboard and sharing endpoints under `/api/linkdisk` and `/admin-api/linkdisk`

## What It Includes

- `GET /api/health` for a basic worker health check
- `GET /api/notes`, `POST /api/notes`, `DELETE /api/notes/:id` as the minimal D1 example
- `GET /openapi.json` for the generated OpenAPI spec
- `GET /docs` for interactive Scalar documentation
- `GET /api/linkdisk/health` for LinkDisk worker health
- `GET /openapi/linkdisk.json` for LinkDisk OpenAPI
- `GET /docs/linkdisk` for LinkDisk Scalar docs

## Files

- `src/index.ts`: Hono app, routes, middleware, OpenAPI setup
- `src/linkdisk/`: isolated LinkDisk API domain
- `src/schema.ts`: current Drizzle D1 schema
- `migrations/0000_create_notes.sql`: starter migration
- `migrations/0001_linkdisk_clipboard_body_r2.sql`: LinkDisk tables
- `migrations/0002_linkdisk_attachment_object_reuse.sql`
- `migrations/0003_linkdisk_telegram_file_path_cache.sql`
- `src/index.test.ts`: Worker integration tests

## Development

```bash
pnpm dev:api
pnpm build:api
pnpm --filter cf-template-api test
```

## Bindings And Storage

The worker expects:

- `APP_DB`: D1 binding shared by starter notes and LinkDisk metadata
- `LINKDISK_R2`: R2 bucket for LinkDisk body/object storage

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

Starter notes does not require extra secrets by default. LinkDisk production does.

- Example file: `apps/api/.dev.vars.example`
- Wrangler config: `apps/api/wrangler.jsonc`

Required LinkDisk secrets/vars for production:

- `ADMIN_JWT_SECRET`
- `TELEGRAM_API_TOKEN`
- `TELEGRAM_CHAT_ID`
- `TURNSTILE_SECRET_KEY` when Turnstile is enabled
- `TURNSTILE_SITE_KEY` to match the public web key

Optional LinkDisk vars:

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

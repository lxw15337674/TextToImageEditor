# Repository Guidelines

## Project Structure & Module Organization
This repository is a pnpm monorepo with a localized web app and a Cloudflare Worker API. Frontend route entrypoints live in `apps/web/app/`, with active localized pages under `apps/web/app/[locale]/`. Shared web shell and UI primitives live in `apps/web/src/components/`. Locale config and copy live in `apps/web/src/i18n/`. Web API helpers live in `apps/web/src/lib/`. Backend service code lives in `apps/api/src/`, with the current D1 schema in `apps/api/src/schema.ts` and migrations in `apps/api/migrations/`. Shared cross-app contracts live in `packages/shared/`.

## Build, Test, and Development Commands
Use `pnpm` throughout.

- `pnpm dev:web`: start the web app on port `3003`.
- `pnpm dev:api`: run the API worker locally with Wrangler.
- `pnpm dev:all`: run web and API together.
- `pnpm build:web` / `pnpm build:api`: build the web app or API worker artifacts.
- `pnpm lint`: run the web ESLint baseline.
- `pnpm typecheck`: run TypeScript checks for both web and API.
- `pnpm db:migrations:list`: list local D1 migrations for the API.
- `pnpm db:migrate:local`: apply local API D1 migrations.
- `pnpm db:migrate:remote`: apply remote API D1 migrations.
- `pnpm --filter cf-template-api test`: run the Worker test suite.

## Coding Style & Naming Conventions
TypeScript runs in `strict` mode; keep types explicit at module boundaries. Use 2-space indentation and ESM imports. In web code, use the `@/*` path alias for files under `apps/web/src/` and `@cf-template/shared` for shared contracts. Use PascalCase for React components and kebab-case for route folders and non-component filenames. Keep the starter generic: add new domain logic under product-area names instead of reviving legacy business names.

## Testing Guidelines
Treat `pnpm lint`, `pnpm typecheck`, and `pnpm build:web` as the web validation baseline. API baseline validation is `pnpm build:api` plus `pnpm --filter cf-template-api test`. For D1 schema changes, add or update a migration in `apps/api/migrations/` and validate it locally before editing docs.

## Commit & Pull Request Guidelines
Use short imperative Conventional Commit subjects such as `feat: add auth shell` or `chore: simplify worker docs`. Keep unrelated changes separate. Pull requests should summarize the user-facing change, affected routes or APIs, and any new env vars, bindings, or migration requirements. Ensure validation passes before requesting review.

## Security & Configuration Tips
Secrets belong in local env files or deployment secret stores, never in source. The starter currently expects placeholder public URLs in the web env and an `APP_DB` D1 binding for the API. Before deploying, update each app's `wrangler.jsonc` and confirm that canonical URLs and database identifiers match the target environment.

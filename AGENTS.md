# Repository Guidelines

## Project Structure & Module Organization
This workspace is part of a pnpm monorepo. Apps live in `apps/web` and `apps/api`, with shared code under `packages/`. Web routes are in `apps/web/app/`, shared UI in `apps/web/src/components/`, i18n files in `apps/web/src/i18n/`, static assets in `apps/web/public/`, and Cloudflare runtime code in `apps/web/worker/`. API code lives in `apps/api/src/`, with D1 migrations in `apps/api/migrations/` and colocated tests such as `apps/api/src/index.test.ts`.

## Build, Test, and Development Commands
Run commands from the repository root unless a section says otherwise.

- `pnpm dev:web`: start the web app locally on port `3003`.
- `pnpm dev:api`: run the API Worker with Wrangler.
- `pnpm dev:all`: run both apps in parallel.
- `pnpm build:web` / `pnpm build:api`: produce release artifacts for each app.
- `pnpm lint`: run the web ESLint checks.
- `pnpm typecheck`: run TypeScript checks for web and API.
- `pnpm db:migrate`: apply local API D1 migrations.
- `pnpm --filter link-disk-api test`: run the API Vitest suite.

## Coding Style & Naming Conventions
Use TypeScript with `strict` mode and explicit types at module boundaries. Prefer 2-space indentation, ESM imports, and the `@/*` alias for files under `apps/web/src/`. Use PascalCase for React components and kebab-case for route folders and non-component filenames. For complex parsing, storage, validation, or protocol logic, prefer mature open-source libraries over custom implementations unless platform constraints require otherwise.

## Testing Guidelines
Web has no dedicated unit-test suite yet; the baseline is `pnpm lint`, `pnpm typecheck`, and `pnpm build:web`. API changes should pass `pnpm build:api` and `pnpm --filter link-disk-api test`. Keep API tests close to the code they cover using `*.test.ts`. For browser-facing or production-like debugging, use `agent-browser`. Review generated SQL before applying schema or migration changes.

## Commit & Pull Request Guidelines
Recent history uses short Conventional Commit subjects such as `feat: add google analytics`. Keep commits scoped to one concern. PRs should summarize user-facing changes, list affected routes or APIs, note env var or migration requirements, and include screenshots for visible web UI changes.

## Deployment, Data & Security
Deploy to Cloudflare through the automatic deployment pipeline; avoid manual production releases except for emergency recovery. Use Cloudflare D1 for relational data and R2 for object or file storage by default. Never commit secrets. Store web values such as `NEXT_PUBLIC_SITE_URL` in local env files and configure Worker secrets through Wrangler or deployment secret stores. If you work inside `apps/api`, also check `apps/api/AGENTS.md`.

import { readFileSync } from 'node:fs'
import path from 'node:path'

const repoRoot = process.cwd()

function readJson(relativePath) {
  const absolutePath = path.join(repoRoot, relativePath)
  return JSON.parse(readFileSync(absolutePath, 'utf8'))
}

function isPlaceholderUrl(value) {
  return typeof value !== 'string'
    || value.length === 0
    || value.includes('example.com')
    || value.includes('localhost')
}

function isPlaceholderTurnstileSiteKey(value) {
  return typeof value !== 'string'
    || value.length === 0
    || value === '0x4AAAA...'
}

function isZeroUuid(value) {
  return typeof value !== 'string' || /^0{8}-0{4}-0{4}-0{4}-0{12}$/.test(value)
}

function isPlaceholderBucketName(value) {
  return typeof value !== 'string'
    || value.length === 0
    || value === 'cf-template-linkdisk-r2'
}

function addIssue(issues, pathLabel, message) {
  issues.push(`${pathLabel}: ${message}`)
}

const webWrangler = readJson('apps/web/wrangler.jsonc')
const apiWrangler = readJson('apps/api/wrangler.jsonc')
const issues = []

const webVars = webWrangler.vars ?? {}
if (isPlaceholderUrl(webVars.NEXT_PUBLIC_SITE_URL)) {
  addIssue(issues, 'apps/web/wrangler.jsonc', 'NEXT_PUBLIC_SITE_URL is still a placeholder or local URL')
}
if (isPlaceholderUrl(webVars.NEXT_PUBLIC_API_BASE_URL)) {
  addIssue(issues, 'apps/web/wrangler.jsonc', 'NEXT_PUBLIC_API_BASE_URL is still a placeholder or local URL')
}
if (isPlaceholderTurnstileSiteKey(webVars.NEXT_PUBLIC_TURNSTILE_SITE_KEY)) {
  addIssue(issues, 'apps/web/wrangler.jsonc', 'NEXT_PUBLIC_TURNSTILE_SITE_KEY is still a placeholder')
}

const appDb = Array.isArray(apiWrangler.d1_databases)
  ? apiWrangler.d1_databases.find((item) => item.binding === 'APP_DB')
  : undefined
if (!appDb) {
  addIssue(issues, 'apps/api/wrangler.jsonc', 'APP_DB binding is missing')
} else if (isZeroUuid(appDb.database_id)) {
  addIssue(issues, 'apps/api/wrangler.jsonc', 'APP_DB.database_id is still the zero UUID placeholder')
}

const linkdiskBucket = Array.isArray(apiWrangler.r2_buckets)
  ? apiWrangler.r2_buckets.find((item) => item.binding === 'LINKDISK_R2')
  : undefined
if (!linkdiskBucket) {
  addIssue(issues, 'apps/api/wrangler.jsonc', 'LINKDISK_R2 binding is missing')
} else if (isPlaceholderBucketName(linkdiskBucket.bucket_name)) {
  addIssue(issues, 'apps/api/wrangler.jsonc', 'LINKDISK_R2.bucket_name is still the placeholder value')
}

if (!apiWrangler.triggers || !Array.isArray(apiWrangler.triggers.crons) || apiWrangler.triggers.crons.length === 0) {
  addIssue(issues, 'apps/api/wrangler.jsonc', 'LinkDisk archive/cleanup cron is not configured')
}

if (issues.length > 0) {
  console.error('Deployment config check failed:\n')
  for (const issue of issues) {
    console.error(`- ${issue}`)
  }
  console.error('\nStill required outside the repo:')
  console.error('- wrangler secret put ADMIN_JWT_SECRET')
  console.error('- wrangler secret put TELEGRAM_API_TOKEN')
  console.error('- wrangler secret put TELEGRAM_CHAT_ID')
  console.error('- wrangler secret put TURNSTILE_SECRET_KEY')
  process.exitCode = 1
} else {
  console.log('Deployment config check passed.')
  console.log('Remember to configure runtime secrets outside the repo:')
  console.log('- ADMIN_JWT_SECRET')
  console.log('- TELEGRAM_API_TOKEN')
  console.log('- TELEGRAM_CHAT_ID')
  console.log('- TURNSTILE_SECRET_KEY')
}

import { cloudflareTest } from '@cloudflare/vitest-pool-workers'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vitest/config'

const sharedPackageEntry = fileURLToPath(new URL('../../packages/shared/index.ts', import.meta.url))

export default defineConfig({
  plugins: [
    cloudflareTest({
      wrangler: { configPath: './wrangler.jsonc' },
    }),
  ],
  resolve: {
    alias: {
      '@cf-template/shared': sharedPackageEntry,
    },
  },
  test: {
    hookTimeout: 30000,
    testTimeout: 30000, // 增加超时时间到 30 秒，因为有真实请求
  },
})

# Fonts

When the user explicitly wants Geist typography, use the official font sources where practical.

## Recommended path for Next.js

For Next.js projects, the Geist font site recommends the `geist` npm package for full glyph support and font feature support.

Typical imports:

```ts
import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';
```

Apply the font variables or class names at the app layout level, then map them into the project's Tailwind or global CSS setup.

## Alternative path

Google Fonts integration is simpler, but the official font docs note that it does not include the full glyph set or `font-feature-settings` support.

Use that path only if:

- the project already standardizes on `next/font/google`, or
- dependency changes are intentionally avoided.

## When not to change fonts

Do not force a font migration in tasks that are about component polish only. You can still apply the Geist visual language through spacing, type scale, borders, and surface contrast while keeping the existing font stack.

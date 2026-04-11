---
name: geist-ui
description: Use when the user wants UI that follows Vercel Geist design principles in a React, Next.js, or Tailwind codebase. Apply restrained typography, accessible high-contrast color layering, crisp borders, developer-tool style components, and minimal but intentional layout rhythm. Especially relevant for dashboards, settings pages, docs surfaces, admin tools, and polished landing sections.
---

# Geist UI

Use this skill when building or refactoring interfaces to feel aligned with the Geist design language.

This skill is for design execution, not brand cloning. Reuse the principles, not Vercel's exact marketing composition, unless the user explicitly asks for a close visual match.

## Load Order

1. Read `references/principles.md`.
2. Read `references/typography.md` and `references/color-and-surfaces.md`.
3. If the task includes a page layout or marketing section, read `references/layout.md`.
4. If the task includes component work, read `references/components.md`.
5. If the task includes font changes in a Next.js app, read `references/fonts.md`.

## Workflow

1. Audit the existing screen for typography, spacing density, border treatment, and color noise.
2. Reduce visual variety before adding anything new.
3. Establish one clear text hierarchy for the page.
4. Build surfaces with layered neutrals and borders before reaching for shadows.
5. Use accent color only for status, selection, or the single primary action.
6. Prefer compact, developer-tool style controls over oversized consumer-app chrome.
7. Keep motion subtle and brief; the interface should feel fast rather than animated.

## Output Rules

- Prefer neutral palettes with strong text contrast.
- Prefer crisp 1px borders, soft radius, and restrained shadows.
- Use monospace selectively for code, values, shortcuts, file names, and machine-readable metadata.
- Keep page width, gutters, and card spacing disciplined; avoid loose, generic SaaS spacing.
- Avoid decorative gradients unless the surface is explicitly marketing-facing.
- Avoid large blobs, glassmorphism, and loud glow effects.
- Avoid multiple competing accent colors on the same screen.

## Project Fit Notes

This repository already uses Tailwind, shadcn-style primitives, and Next.js. Favor adapting existing tokens and primitives over introducing a parallel component system.

If the user asks for a Geist font treatment, prefer the official `geist` package in Next.js projects. If dependency changes are out of scope, emulate the visual system with the project's current font stack and typography rhythm instead.

# Color And Surfaces

Geist uses a high-contrast, accessible color system anchored by neutrals.

## Palette behavior

- Neutrals do most of the work.
- Accent colors are functional, not decorative.
- Surface separation should come from background steps and borders first.
- Error, warning, success, and info colors should be explicit and easy to scan.

## Surface model

- App background: the quietest large-area neutral.
- Raised surface: slightly offset from the app background.
- Interactive surface: clear hover and active states without dramatic animation.
- Border: visible enough to define structure, subtle enough to avoid noise.

## Practical Tailwind guidance

- Use a small number of neutral steps consistently.
- Prefer borders plus tiny background shifts over shadow-heavy cards.
- Keep text at high contrast against every surface.
- For selected states, consider border emphasis and mild tint before filling the whole component with color.

## Accent usage

- Primary CTA: one accent treatment per view.
- Links: understated until hover or focus.
- Status: map one accent per state and use it consistently.
- Charts and visualizations: do not inherit the whole UI accent strategy blindly; maintain data readability first.

## What to avoid

- Bright accent backgrounds behind large amounts of text.
- Multiple saturated fills in the same toolbar or form.
- Borderless cards on low-contrast backgrounds.

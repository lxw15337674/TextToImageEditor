# Components

Geist component language is especially suited to developer tools and operational interfaces.

## Component tone

- Buttons: compact, crisp, and purposeful.
- Inputs: clearly bordered, quiet by default, strong focus state.
- Menus and popovers: dense but readable.
- Tabs and segmented controls: understated until selected.
- Cards: structural containers, not decorative objects.
- Tables and lists: optimized for scanability.

## Mapping to shadcn-style primitives

- Keep existing primitives, but tighten them where needed.
- Reduce unnecessary radius or shadow if components feel too soft.
- Favor subtle background fills and border contrast.
- Use iconography only when it helps speed of recognition.

## Interaction guidance

- Hover states should be visible but restrained.
- Focus states must be obvious and keyboard-friendly.
- Destructive actions should feel deliberate, not loud.
- Loading states should stay minimal: skeletons, subtle spinners, or progress indicators.

## Common UI patterns

- Settings pages: split into clearly labeled sections with concise help text.
- Command surfaces: mono details, keyboard hints, strong active row treatment.
- Dashboard cards: compact summaries with one primary metric and muted support context.
- Empty states: simple icon or illustration substitute, short title, one explanatory line, one next action.

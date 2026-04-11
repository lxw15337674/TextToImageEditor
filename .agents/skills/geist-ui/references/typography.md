# Typography

Typography is the main organizing system in Geist-style UI.

## Hierarchy

- Reserve very large headings for marketing heroes or singular page moments.
- For product surfaces, most headings should sit in the medium range and rely on weight, spacing, and contrast rather than raw size.
- Body copy should stay compact and readable.
- Secondary metadata should be visibly quieter but never illegible.

## Typical usage pattern

- Page title: strong, compact, high-contrast.
- Section title: one step smaller than the page title.
- Primary body text: the default reading size for most UI copy.
- Secondary body text: used for descriptions, hints, timestamps, empty-state support copy.
- Mono text: values, IDs, code, keyboard shortcuts, and technical labels.

## Implementation guidance

- Prefer a tight type scale. Do not use many near-adjacent sizes on one screen.
- Use weight and color to create hierarchy before increasing font size.
- Keep line lengths controlled, especially on marketing and docs surfaces.
- Use monospace sparingly so it keeps semantic meaning.

## If typography utilities are requested

The Geist typography docs describe a system of heading, button, label, and copy classes with predefined size, line-height, spacing, and weight combinations. When recreating that feel in Tailwind:

- Create a small set of reusable text utilities or component-level class recipes.
- Distinguish single-line label text from multi-line copy text.
- Keep button text slightly denser than paragraph text.
- Use stronger inline emphasis with `strong` inside body copy rather than adding many separate text colors.

# Thought Leadership Article Style Guide

Style reference: McKinsey Insights — clean, structured, professional with bold callouts and clear visual hierarchy.

## Article structure

Every article should follow this template:

1. **Abstract** — h2 heading "Abstract", followed by 3-5 executive summary paragraphs (rendered in larger 19px navy text)
2. **Parts / Sections** — h2 headings for major parts (e.g. "Part I – Changing landscape"), h3 for numbered subsections
3. **Conclusion** — h2 heading "Conclusion", 3-4 closing paragraphs
4. **Callouts** — 2-3 `callout` blocks placed at key insight moments throughout

## Block types

| Type | When to use |
|------|-------------|
| `heading` | Section structure. Level 2 = major parts, level 3 = subsections (numbered: "1. Title", lettered: "a. Title", roman: "i. Title") |
| `paragraph` | Body text. Supports inline HTML including `<a>` links. |
| `blockquote` | Extended quotes from thought leaders. Include attribution with em-dash. |
| `callout` | Key insights or findings that deserve emphasis. Navy box with gold accent. Use 2-3 per article max. Fields: `text` (required), `label` (optional, defaults to "Key Insight"). |
| `ul` / `ol` | Lists. Items support inline HTML. |
| `image` | Figures, diagrams, quote images. See naming conventions below. |
| `quote-grid` | Grid of titled quotes (2 or 3 columns). |
| `skill-grid` | Grid of icon/photo items with name and description. |
| `image-text-split` | Side-by-side image + text layout. |

## Image naming conventions

Image naming determines rendering treatment:

- **`quote-*.jpg`** — Rendered as styled pull-quote cards (gold left border, subtle background, max-width constrained)
- **`figure-NN-*.jpg`** or **`table-NN-*.jpg`** — Rendered with figure/table number label above, bordered container, caption below
- **Other images** — Standard article image treatment

Always set descriptive `alt` text. For figures, start alt with "Figure N —" or "Table N —".

## External links

When referencing research, surveys, or publications:

1. Wrap the source name in an `<a>` tag with the URL
2. Always include `target="_blank" rel="noopener noreferrer"`
3. Link the natural mention (e.g. "Gallup's State of the Global Workplace survey"), not generic "click here"
4. Prefer linking to the original publisher's page

Example:
```json
{
  "type": "paragraph",
  "text": "The <a href=\"https://www.gallup.com/...\" target=\"_blank\" rel=\"noopener noreferrer\">Gallup State of the Global Workplace survey</a> found that..."
}
```

## Typography hierarchy

| Element | Font | Size | Weight | Color |
|---------|------|------|--------|-------|
| Article title | Cormorant Garant | 52px | Light | White (on navy) |
| h2 (section) | Cormorant Garant | 30px | Light | Navy |
| h3 (subsection) | Cormorant Garant | 24px | Medium | Navy |
| Abstract paragraphs | Lato | 19px | Normal | Navy/85% |
| Body paragraphs | Lato | 17px | Normal | Foreground/80% |
| Blockquote | Cormorant Garant | 24px | Light italic | Navy/80% |
| Callout label | Lato | 10px | Normal | Gold (uppercase, tracked) |
| Callout text | Cormorant Garant | 20px | Light | White/90% |
| Figure label | Lato | 11px | Semibold | Gold/80% (uppercase, tracked) |
| List items | Lato | 17px | Normal | Foreground/80% |

## Visual elements

- **Section dividers**: Thin gold line with centered dot between h2 sections
- **Reading progress**: Gold progress bar fixed below nav (2px height)
- **Blockquotes**: 3px gold left border, subtle cream/gold background tint
- **Callouts**: Navy background, gold bottom gradient accent bar
- **Figures/Tables**: White background with thin border, labeled above
- **Quote images**: Gold left border, subtle tinted background, max-width 672px
- **Inline links**: Gold color, subtle underline that intensifies on hover

## Content guidelines

- Write in clear, professional prose — avoid jargon without explanation
- Each section should make one clear point
- Use callouts for the 2-3 most important takeaways a reader should remember
- Place blockquotes strategically — they break up long text and add authority
- Every data claim should link to its source
- Figures and tables should be referenced in the preceding paragraph

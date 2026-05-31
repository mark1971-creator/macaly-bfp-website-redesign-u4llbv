## Project Context
- Website: BEING at Full Potential (beingatfullpotential.com)
- Owner: Mark Vandeneijnde (mark@beingatfullpotential.com)
- Business: Human Potential Development consultancy — conscious leadership & organizational transformation
- Brand: Deep navy + warm gold + cream. Cormorant Garant (headings), Lato (body)

## Testing Preferences
- Check carefully: verify lints and server response after each major change (slower but fewer bugs)

## Key Numbers (use consistently across ALL pages)
- Certified Coaches: 200+
- Founded: 2010
- Continents: 4
- Global HQs: 3

## Design Rules (apply to ALL pages)
- NEVER use hardcoded hex colors for backgrounds/gradients — always use CSS vars (`bg-navy`, `bg-gold`, `bg-background`, `bg-secondary`)
- Hero gradient backgrounds: use `bg-navy` (not `from-[#0d1b3e] via-[#1e3a6e]` etc.)
- Footer always: `bg-[#141210] border-t border-gold/15` (only allowed hardcoded hex)

## Design Tokens
- Navy: hsl(218, 67%, 16%) — `bg-navy` / `text-navy`
- Gold: hsl(38, 55%, 50%) — `bg-gold` / `text-gold`
- Cream: hsl(42, 33%, 97%) — `bg-background`
- Warm secondary: hsl(38, 20%, 94%) — `bg-secondary`
- Footer: `bg-[#141210]` warm charcoal with `border-gold/15` top border

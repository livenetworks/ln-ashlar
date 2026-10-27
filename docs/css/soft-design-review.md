# Soft theme: consistency review

Date: 2026-10-27. Branch: `redesing/desing-improvements`.

## Scope and confidence

Source review of the current Soft theme, admin shell, Cards page, card/button/form
recipes, density settings and representative interaction styles. No application
code was changed during this review.

This is not a screenshot-based visual audit. `.agents/AGENTS.md` prohibits browser
checking. Findings about declarations and markup are confirmed in source;
explanations of the perceived dated appearance are design hypotheses to validate
on rendered desktop/mobile screens. Font loading, actual clipping, keyboard
behavior and accessibility compliance have not been verified in a browser.

## Main diagnosis

Soft improves the palette, radii and outer spacing, but several older composition
rules still determine the result. The strongest candidates for the dated
impression are repeated framed panels, inverted hierarchy, inconsistent density
and decoration that does not communicate an action or a status.

The next pass should establish consistent rules for surfaces, typography, rhythm
and interaction. Increasing every radius or adding more shadows would not address
these causes.

## Findings

| Priority | Evidence | Likely effect | Recommended change |
| --- | --- | --- | --- |
| High | `mixins/_card.scss`: section cards use resting shadows; nested cards are forcibly promoted to floating shadows. `cards.html` wraps most examples in another section card. | An inner example can attract more attention than its containing section. Repeated borders, dividers and shadows create a boxed administrative-panel appearance. | Separate demo framing from the component being demonstrated. Keep passive surfaces quiet; reserve floating depth for overlays. |
| High | `panel-header` uses `body-sm`/medium weight, while Basic Card's direct `h3` uses global `heading-sm`/semibold. Comfortable resolves these to 14px/500 and 20px/600. | The child title outranks the section title. Similar semantic roles receive different visual treatment depending on markup. | Define consistent page, section and card-title roles using the existing typography vocabulary; map recipes to those roles. |
| High | The Cards page has separate `h1` and description siblings. Soft's wrapper gap is 24px, while global `h1` and `p` also have 16px bottom margins. | Source predicts 40px spacing between closely related heading/description content, weakening their grouping. | Group title and description into a page introduction; use one owner for spacing at each level. |
| High | `_cards.scss` repeatedly applies `p(var(--size-md))` (16px), while Comfortable panel padding is 16px vertically / 24px horizontally. Other components locally override padding again. | Switching density changes some surfaces but leaves sibling examples unchanged. | Route card content through the shared padding tokens/recipes. Separate structural spacing from control density. |
| Medium | Every `card` gets a hover border/shadow change, including noninteractive `article` examples. | Static information suggests an action. | Keep the base card passive; add interactive treatment explicitly to actionable cards, with matching keyboard focus. |
| Medium | Most of the Cards gallery leads with top/left/bottom colored borders, tinted blocks and stacked effects, with generic labels. | Decorative variants dominate the impression; the page demonstrates CSS effects more than a coherent product. | Lead with realistic project, document and activity examples. Retain decorative variants later as reference examples. |
| Medium | Cards uses `grid-4`, whose four-column switch is viewport-based at 1024px. Sidebar and panel padding consume part of that width. | Four columns can be selected before the actual content area has sufficient space. | Use container-aware gallery layout, as in the updated dashboard. Validate at narrow and intermediate widths. |
| Medium | Buttons use a 20px line box, whereas comfortable inputs inherit body typography with a 25.6px line box; both receive 12px vertical padding. Header controls use separate compact rules. | Mixed input/button rows have inconsistent proportions unless locally corrected. | Establish a shared control-size contract for aligned input/button groups; keep explicit compact toolbar sizing. |

Sources: [card recipes](../../theme/config/mixins/_card.scss),
[Cards styles](../../demo/admin/src/scss/pages/_cards.scss),
[Cards markup](../../demo/admin/src/pages/cards.html),
[typography](../../theme/base/_typography.scss),
[density](../../theme/config/_density.scss),
[app shell](../../theme/config/mixins/_app-shell.scss),
[buttons](../../theme/config/mixins/_btn.scss),
[forms](../../theme/config/mixins/_form.scss),
[layout](../../theme/config/mixins/_layout.scss).

## Concrete correctness issues

- `theme/config/mixins/_table.scss:41` passes bare HSL channels from
  `--color-primary` into `color-mix()`. Those channels are not a CSS color.
  Use a composed color such as `--color-accent`, or wrap the triplet in `hsl()`.
  The same issue appears in the expanded code-button state in
  `demo/admin/src/scss/_demo-layout.scss:191` and the copied-button success state.
  Build success does not validate custom-property substitution in a browser.
- `demo/admin/src/scss/_demo-utilities.scss:78` references `--font-size-sm`,
  which is not declared in the theme source inspected. Use an existing role.
- Static sRGB contrast calculations for white text on solid token colors:
  Soft primary **5.94:1**, success **3.35:1**, warning **3.15:1**, info **3.63:1**.
  The latter three do not meet 4.5:1 for ordinary-size text. They can reach solid
  semantic buttons through `semantic-color` and `btn`. Tune semantic foreground/
  background pairs rather than only the main brand color. These calculations
  are not a rendered accessibility audit.

## Recommended implementation sequence

1. Correct invalid color expressions and semantic contrast. Preserve component
   behavior and add no visual decoration as part of these fixes.
2. Establish consistent roles: page introduction, section heading, card heading,
   passive surface, interactive surface and overlay. Reuse existing tokens first;
   add a shared role only when multiple components need independent control.
3. Apply the rules to Cards, Forms and Tables plus the shared shell. Align density,
   grouped controls and container layouts. Keep the technical catalog but lead
   with realistic compositions showing primary/secondary actions and metadata.
4. Validate light/dark presets, three densities, narrow/intermediate/desktop
   layouts, focus, hover, disabled, validation, empty and loading states. Browser
   permission or user-supplied screenshots are needed for the visual portion.

Acceptance: section headings outrank card headings; parent/child surfaces have
intentional depth; passive cards remain passive; a density change is consistent;
inputs and buttons align; related text is grouped; status labels have sufficient
contrast; existing components and theme switching keep working.

## Comparison boundary

Tailwind provides a token-driven utility framework, not one universal visual
style. Bootstrap documents shared base styles and constrained variants. Those
are useful standards of consistency; matching their visual maturity does not
require adopting their class architecture. Feature parity, ecosystem maturity
and accessibility parity are outside this review.

- [Tailwind theme variables](https://tailwindcss.com/docs/theme)
- [Bootstrap component architecture](https://getbootstrap.com/docs/5.3/customize/components/)

---

## Follow-up: browser-verified audit and global fixes

Date: 2026-10-27. Rendered audit of the admin demo at 1440×900 in Light,
Soft and Dark, across compact / comfortable / spacious. Unlike the source
review above, every finding here was observed in a browser. Fixes are in the
shared theme (tokens + mixins), so they apply to every theme and density.

### What made it read as early-2000s desktop UI

| # | Observed | Why it dated the UI | Fix |
|---|---|---|---|
| 1 | Every section/card header had a grey fill + divider (`panel-header` → `--bg-sunken`); footers the same. | Reads as a window caption bar / group-box frame — classic Win32 dialog chrome. | Header and footer share the panel surface. Optional tint via `--panel-header-bg` / `--panel-footer-bg`. |
| 2 | Enabled inputs had a grey fill (`--bg-recessed`) and a faint `--border-subtle` border; the disabled field looked nearly identical. | Low affordance: fields looked inert/disabled. Focus was only a 4% tint — almost invisible. | Inputs use `--bg-base`, `--border-strong`, `--shadow-xs`, hover border; focus = accent border + 3px 20% ring. Grey fill only on `:disabled`. |
| 3 | Inputs 39px, buttons 34px side by side (dense); comfortable 51.6px vs 46px. | Misaligned rows are the most visible "unfinished" signal in forms and toolbars. | Shared control contract: `--control-line-height` + equal padding → 36 / 44 / 54px for buttons, inputs, selects and pills. |
| 4 | Bullets (•) rendered next to Cancel/Save; error lists indented and pushed 16px down. | `panel-body` styled *all* descendant `ul/ol` as prose lists, contradicting the ul/li grouping doctrine. | Scoped to direct-child content lists (`> ul`, `> ol`). |
| 5 | `textarea` rendered in the UA monospace font; buttons in the system UI font. | Mixed type faces inside one form look like unstyled native controls. | Reset: form controls `font: inherit`. |
| 6 | Field labels 12px / 600 over every input. | Caption-heavy dialog look; competes with values. | `form-label` → `label-md` / 500. |
| 7 | Scrollbars with a grey gutter track. | Legacy desktop scroll gutter. | Transparent track, `--border-strong` thumb. |
| 8 | White text on success/warning/info solid fills: 3.35 / 3.15 / 3.63:1. | Fails WCAG AA for normal text. | Light tones now 5.1 / 5.0 / 5.2:1 (error 4.8:1). Dark mode restores the brighter tones for text on dark surfaces. |

Verified after the change: control heights 36/44/54 in all three densities;
Light, Soft and Dark render correctly; `npm run build` and 52/52 tests pass.

### Second pass

| # | Observed | Fix |
|---|---|---|
| 9 | Dark mode: accent as text ~2.3:1 (active nav, links, tabs). No single tone can pass both as text on dark and under a white label. | Dark flips the pair: bright accent/status tones (≥ 5:1 as text) and a dark `--color-accent-fg` label on solid fills (6.5:1). Midnight/Glass follow. Checkbox tick via `--form-check-mark`. |
| 10 | Stacked fields outside `form-grid` (modal bodies) touched — ~6px from input to next label. | Zero-specificity `:where(.form-element…) + :where(…)` rhythm of 16px; grids keep their own gap. |
| 11 | Modal had the same 8px corner as resting cards. | Overlays use `--radius-lg` (hook: `--modal-radius`). |
| 12 | App footer was an opaque white strip pinned to the bottom — a desktop status bar. | Footer sits on the canvas (hook: `--app-footer-bg`). |
| 13 | Inputs transitioned `all` — padding/font animated on density switch. | Inputs transition colour, border and ring only. |

### Still open (not changed in this pass)

- **Dense default** — the `:root` default stays the dense DocuFlow scale by
  design. It is denser than Tailwind/Bootstrap defaults; consider whether new
  projects should start at `comfortable`.
- **Reserved error space** — `form-validate-errors` reserves 20px under every
  field (prevents layout shift) which widens row gaps in grids. Trade-off kept.
- **Transitions on `all`** remain on other mixins (cards, pills, buttons via
  `transition`). Same density-switch effect, lower visibility.
- **Dark hover direction** — accent hover darkens by 8 lightness points in
  both modes; on dark surfaces a lighter hover would read more naturally.

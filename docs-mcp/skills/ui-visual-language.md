---
name: ui-visual-language
classification: skill
status: draft
domain: frontend
context: app
summary: System-wide visual consistency rules — radius/spacing, shadow vs border, color meaning, forms, buttons, tables, modals, feedback, responsive behavior, and typography for business UI.
source: .claude/skills/ui/visual-language.md
tags: [ui, visual-language, radius, color, forms, buttons, tables, modals, feedback, responsive, typography]
---

# 🎨 Visual Language Rules

## Summary

This skill defines HOW the design system must behave consistently across every component — not which component to use (see [`./ui.md`](./ui.md)) but the shared visual grammar: radius/spacing pairing, shadow-vs-border, color-as-state, form/button/table/modal visual states, feedback persistence and position, responsive container-query behavior, and typography rules. Consult it before styling any component to keep it consistent with the rest of the system.

> For package-specific implementation (concrete token values, mixin names) → [`../doctrine/scss-architecture.md`](../doctrine/scss-architecture.md)
> For component selection and layout decisions → [`./ui.md`](./ui.md)
> For interaction flow (how components behave, not how they look) → [`./ux.md`](./ux.md)

---

## 1. Radius + Spacing Consistency

**The rule:** A design either uses rounded corners or it doesn't. The two modes have different spatial implications and must be applied consistently.

### Rounded corners (radius > 0)

Rounded corners imply that elements **float** — they are objects on a surface, not part of the surface. Floating objects need air around them.

```
Rounded link touching container walls = WRONG:
┌──────────────────┐
│╭────────────────╮│  ← rounded element flush to wall = awkward
││    ● Members   ││
│╰────────────────╯│
└──────────────────┘

Rounded link with breathing room = CORRECT:
┌──────────────────┐
│  ╭────────────╮  │  ← breathing room on left and right
│  │ ● Members  │  │     the element clearly "floats"
│  ╰────────────╯  │
└──────────────────┘
```

### Sharp corners (radius = 0)

Sharp corners imply **structure** — elements are part of a grid, attached to the container. Flush alignment is correct and expected.

```
Sharp link, full-width = CORRECT:
┌──────────────────┐
│ ● Members        │  ← flush = intentional and clean
│──────────────────│
│ ● Content        │
└──────────────────┘
```

**Applied to all components:** Any element with border-radius that sits inside a container must have horizontal margin so its rounded corners don't touch the container wall.

---

## 2. Shadow + Border: Pick One

Shadows imply **elevation** (lifts off the page). Borders imply **containment** (bounded on a flat surface). Both together usually cancel each other visually.

| Context | Use | Reason |
|---|---|---|
| Cards, panels, modals | Shadow (optionally with subtle border) | They sit above the surface |
| Inputs, selects | Border only | They sit on the surface |
| Focused inputs | Focus indicator | Functional signal, not elevation |
| Active/hover cards | Shadow increases | They lift further |

**Exception:** A very subtle border alongside a subtle shadow is acceptable — it reinforces the card edge on screens where shadows wash out.

---

## 3. Icon Consistency

All icons in a UI must come from the **same set** and **same weight**.

- Never mix icon sets within one UI (e.g., don't combine two different icon libraries)
- Never mix outline and filled variants of the same set
- If a needed icon doesn't exist in the chosen set, pick the closest equivalent — do not import a single icon from another set

ln-ashlar standardizes on Tabler outline icons — see [`../doctrine/html-markup-rules.md`](../doctrine/html-markup-rules.md) for the icon-usage convention.

---

## 4. Spacing Scale Discipline

Never invent spacing values. Use the token scale defined in the design system.

If you reach for an arbitrary value like `0.6rem` or `14px`, stop — you are compensating for a different problem (wrong component size, wrong font size, wrong layout). Fix the root cause, don't patch with a custom spacing value.

**Common traps:**
- Input/button "not quite aligned" → they have different padding tokens, fix that
- Text "not quite centered" → use `align-items: center`, not a padding hack
- Section "needs just a bit more breathing room" → go up to the next spacing step

---

## 5. Color Has Meaning — Never Decorative

Color communicates state, not style.

| Color | Meaning | When to use |
|---|---|---|
| Primary (brand) | Interactive, selected, active | Links, active nav, selected state, primary buttons |
| Success (green) | Positive outcome | Approved, active, online, completed |
| Error (red) | Problem, destruction | Rejected, failed, delete action |
| Warning (amber) | Caution, attention | Pending, expiring, approaching limit |
| Muted (grey) | Inactive, disabled, metadata | Disabled state, timestamps, labels |

**Never use color to "make it pretty."** If you are adding a colored border, background, or icon to something that has no state meaning — stop.

**Never use a custom color not in the token set.** If existing tokens don't cover the case, the problem is likely information architecture, not a missing color.

---

## 6. Typography Is Not Decoration

- **One font family** for all UI text. No decorative fonts, no mixing.
- **Four weights:** 400 (body), 500 (labels/medium), 600 (headings/semibold), 700 (bold KPIs)
- **Uppercase only for:** labels inside components (nav section headings, table column indicators). Never for body text or headings.
- **Line-height for UI vs reading:** UI elements (buttons, nav, labels) = tight (~1.1). Body text = generous (~1.5–1.75). Never apply reading line-height to UI elements — it creates visible extra space above/below.

---

## 7. Interactive Element Consistency

All interactive elements must behave consistently:

| State | How |
|---|---|
| Default | Visible but quiet — not competing with content |
| Hover | Color change only — no `translateY`, no `box-shadow` appears |
| Active | Slightly darker than hover |
| Focus | Visible and consistent focus indicator |
| Disabled | 50% opacity, `cursor-not-allowed` |

**No hover animations:** `translateY`, `scale`, `box-shadow` appearing on hover are marketing-page patterns. Business UI uses color-only hover.

**Exception — functional indicators:** Navigation indicators and focus rings may change in opacity on hover. This communicates availability, not decoration.

---

## 8. Radius Scale

Use the token scale consistently. Pick one radius for most elements and one for pills — don't mix arbitrary radius values.

| Context | Typical radius |
|---|---|
| Buttons, inputs, small elements | Standard (e.g., 8px) |
| Cards, panels, modals | Same standard |
| Badges, pills, tags | Full (`9999px`) |
| Dropdown menus | Same standard |
| Tooltips | Smaller |

**Never mix radius scales within the same design.** If buttons use one radius, everything else should use the same — except pills which use full rounding.

---

## 9. Navigation Link Indicators

Navigation links communicate three states: **default** (available), **hover** (interactive affordance), **active** (current location). The visual weight of the indicator must always follow this order — hover is softer than active, never the reverse.

---

### State signal ladder

| State | Reads as | Visual weight |
|---|---|---|
| Default | "Available" | No indicator. Muted text. |
| Hover | "I can click here" | Partial or faint signal. Text brightens slightly. |
| Active | "I am here" | Full indicator. Primary color. Heavier font weight. |

If hover and active have the same visual weight, the user loses their location anchor. The active state must always dominate.

---

### Three indicator types

Indicators are categorized by **geometric form**, not by animation. Motion is a property of the bar type, not a type in itself.

#### 1. Background fill

The link's bounding area receives a filled background. Two sub-variants with different semantics:

**Tint fill** — low-opacity background (4–10%). Communicates *location*: "you are currently here." Gentle, unobtrusive. Requires rounded corners + horizontal margin so the tint floats visually inside the container (see § 1 — Radius + Spacing).

```
|  ╭────────────────╮  |
|  │  ◉  Dashboard  │  |   ← active: tint fill, floating
|  ╰────────────────╯  |
|     Users            |
```

Best for: sidebar navigation in light-background interfaces. Used by Linear, Vercel dashboard, shadcn.

**Chip fill** — high-contrast background, explicit shape, often with a visible border or elevation. Communicates *selection*: "this is the chosen item" — closer in register to a pressed button than a location marker. Reserve for interfaces where navigation is itself a primary action (switching modes, selecting a workspace).

Hover tint fill → low-opacity tint. Hover chip → slightly lighter chip bg. Never full chip weight on hover.

---

#### 2. Bar indicator

A geometric line anchored to one edge of the link. The bar is the most precise location indicator because it points directionally — toward the content it represents.

**Placement by nav axis:**

| Nav orientation | Bar position | Rationale |
|---|---|---|
| Vertical (sidebar) | Left edge | Leading edge in LTR reading direction |
| Horizontal (top nav) | Bottom edge | Gravity — bar rests under the label |
| Horizontal (tab within content) | Bottom, merged with container border | "Connected to content" — the tab and its panel read as joined |

Never put a left bar on a horizontal nav, or a bottom bar on a sidebar. The directionality would be wrong.

Bar links must be flush — no horizontal margin, no border radius. The bar is anchored to the container edge; rounding or offsetting the link breaks that anchor visually (see § 1).

**Hover vs active on bar indicators:**

Hover shows a faint bar at full size but low opacity. This signals interactivity without competing with the active state. No size change on hover — opacity only (see § 7 exception: functional indicator opacity is permitted, transform is not).

| State | Bar size | Opacity |
|---|---|---|
| Default | 0 | 0 |
| Hover | 100% | ~35–45% |
| Active | 100% | 100% |

**Motion variants** (how the bar appears — applies only to the bar type):

*Instant* — bar appears and disappears with no transition, or with a very short fade (≤100ms). Zero distraction. Correct for dense utility interfaces where navigation is frequent and fast. Users should not wait for any animation while navigating.

*Grow from center (scaleY / scaleX)* — bar starts at zero size, centered on the element, and grows to full size. The growth origin is the midpoint, so it expands symmetrically in both directions. Spring easing (`cubic-bezier(0.34, 1.56, 0.64, 1)`) gives a slight overshoot — organic, "snaps into place." Use when the interface has personality and the pace of navigation is moderate (settings, dashboards). Not appropriate for high-frequency navigation (search results, data tables).

*Center-sweep (left/right transition)* — for horizontal bars. The bar starts at `left: 50%; right: 50%` (zero width, centered) and expands to `left: 0; right: 0`. Symmetric outward expansion. Reads as "unfolding" — appropriate for top navigation bars and tab rows where the horizontal axis has spatial meaning.

---

#### 3. Color-only

No geometric indicator. State is communicated purely through text color and font weight change. The link itself does not change shape or add any visual object.

```
  Dashboard        ← default: muted text
  Users            ← hover: primary text, normal weight
  Settings         ← active: primary text, semibold
```

Lowest visual noise of all three types. Correct for sub-navigation within a content area (secondary tabs, breadcrumbs, settings sub-sections) where the context is already established and a geometric indicator would add clutter.

Hover: text color shifts to primary at slightly lower opacity. Active: full primary color + semibold.

---

### Choosing a type

| Context | Recommended type | Rationale |
|---|---|---|
| Main sidebar, light bg | Background fill (tint) | Floating pills read as objects, not rows |
| Main sidebar, dark/colored bg | Bar indicator | Tint fill disappears on dark bg; bar remains visible |
| Top navigation bar | Bar indicator (bottom, center-sweep) | Horizontal axis, directional |
| Tab row within content | Bar indicator (bottom, merged) | Connects tab to its panel |
| Settings sub-nav | Color-only | Low hierarchy, already contextually grounded |
| Mode/workspace switcher | Background fill (chip) | Selection metaphor, not just location |

**Never mix types within the same interface.** All nav elements at the same level must use the same indicator type. Mixing (e.g. bar on one nav, fill on another) fragments the visual grammar.

---

### Motion principles

These apply to bar indicators specifically. Background fill and color-only use standard color transitions only.

**Duration:** 150–220ms. Hover feedback at the faster end (150ms), active state transition at the slower end (200–220ms). Navigation is high-frequency — anything over 250ms starts to feel like the interface is catching up to the user.

**Easing:** Standard ease-out for color and opacity. Spring easing (`cubic-bezier(0.34, 1.56, 0.64, 1)`) only for the grow-from-center bar, and only on the active state — not on hover. The "snap" feeling of spring overshoot should be reserved for the decisive navigation action.

**What does not animate:** The link text, the link container, and any surrounding layout. Only the indicator element (background or bar) transitions. No `translateY`, no scale on the link itself, no shadow appearing on hover — those are marketing-page patterns (see § 7).

**Reduced motion:** Under `prefers-reduced-motion: reduce`, remove all transform-based transitions from bar indicators. Keep color and opacity changes at 0ms or very short duration (≤50ms) — these are immediate confirmations of state, not decorative motion. The indicator should simply switch state without animation.

---

### Exception to § 7 (no hover animations)

§ 7 prohibits transform and shadow animations on hover. Bar indicators are the one exception — but the exception is narrow: the bar may animate on *route change* (active state set by navigation), not on pointer movement. Hover still uses opacity only, with no transforms. The spring animation fires when the user navigates, which is a deliberate action — not a decorative response to cursor position.

---

## 10. Form Visual Language

Forms are the highest-density interaction surface in business UI. Every visual decision either reduces or amplifies the perceived complexity of the task.

---

### Label positioning

**Top-aligned is the default.** Label sits directly above the input, left-aligned. This is the only position that works consistently across all screen sizes, all input types, and all content lengths.

**Left-aligned (horizontal)** is legitimate only for dense, read-heavy interfaces — settings panels, admin configuration, comparison tables. Requires controlled label widths and breaks at narrow viewports. Never the default for user-facing forms.

**Floating labels — avoid.** Three real problems that outweigh the visual appeal:
- The placeholder disappears on focus — the user forgets what the field is asking for mid-entry
- The animation adds complexity without functional gain
- Browser autofill breaks the float in most browsers, producing a visually broken state

---

### Field state ladder

| State | Signal |
|---|---|
| Default | Neutral border. No accent. |
| Hover | Border slightly darkens or shifts toward primary. Subtle — "this is interactive." Weaker than focus. |
| Focus | Indicator changes to primary — type depends on system (see below). |
| Filled | Same as default — the content is the signal. |
| Error | Indicator changes to error color. Icon + message below. |
| Disabled | Reduced opacity. No interaction possible. |
| Read-only | Value visible and selectable, not editable. Lighter border or no border, slightly different background. |

**Error overrides focus.** An invalid focused field shows error styling only — the two states do not coexist visually.

**Hover on inputs is weaker than focus** — the same principle as nav (§ 9). A user hovering over a field has not committed to it. The hover signal says "I can interact here"; the focus signal says "I am interacting here." If both signals have the same visual weight, the field looks permanently active.

---

### Focus indicator types

Focus is a design choice with six valid approaches, organized by where the signal lives. ln-ashlar ships all five style presets as SCSS mixins in `scss/config/mixins/_focus.scss` (`focus-ring`, `focus-border-thicken`, `focus-combination`, `focus-background-shift`, `focus-accent-line` — grounded).

**Outer signals** — the effect extends beyond the field boundary:

*Ring (outer glow)* — border stays unchanged, a soft `box-shadow` ring appears outside the field. No layout shift. Non-invasive, universally compatible. The Tailwind / Vercel / shadcn convention. Current ln-ashlar default (grounded — `focus-ring` mixin, `scss/config/mixins/_focus.scss`).

*Border thicken* — border grows from 1px to 2px in primary color. No glow. Sharp, structural, precise. Material Design convention. Risk: 1px border growth causes layout shift unless implemented with `outline` or inset border techniques.

*Combination* — border color change + ring simultaneously. Maximum signal strength. Correct for accessibility-first interfaces.

**Inner signals** — the effect stays within the field boundary:

*Background shift* — field receives a very light primary tint. No border change. Focus is felt, not announced. Minimalist, warm. Works best when the container already has a visible border that would compete with a border-based signal.

*Accent line* — only the bottom (or left) border changes to primary, the remaining sides stay neutral. Subtle and direct. Works well inside bordered containers or cards where a full-border change would be visually heavy.

*Inset shadow* — an inner shadow makes the field appear to sink slightly. Tactile, three-dimensional feel. Rarely used but creates a distinctive character when applied consistently.

**Choosing a focus type:**

| Context | Recommended | Rationale |
|---|---|---|
| Default / agnostic | Ring | Safe, universally readable, no layout risk |
| Minimalist / consumer UI | Background shift | Focus is felt, not announced |
| Enterprise / business UI | Border thicken | Precise, structural, no softness |
| Filled or bordered container | Accent line | Border already occupied — line is sufficient |
| Accessibility-first | Combination | Maximum signal strength |
| Tactile / distinct character | Inset shadow | Coherent only when used throughout |

Like nav link indicators, focus type must be consistent across the entire interface. Mixing types within the same form fragments the visual grammar.

---

### Error treatment — three signals required

Color alone is not sufficient for error communication (WCAG 1.4.1). Every error must provide all three:

1. **Color** — border and message text change to error color
2. **Icon** — ⚠ or ✕ adjacent to the message
3. **Text** — specific, actionable message placed **below** the field

The message goes below the field, always. A message above the field is read before the field exists in context and is forgotten by the time the user reaches the input. Never use tooltips for validation — invisible on mobile, disappear on interaction.

---

### Reserved space for error messages

**Dynamic** — message appears, layout shifts. Acceptable for simple forms with few fields.

**Reserved** — a fixed-height area below each field is always present, empty until an error fills it. No layout shift. Correct for dense business UI, inline forms, or any context where sudden layout movement breaks the user's visual tracking.

For business UI, reserved space is the better default. A form that jumps on submit feels unstable. ln-ashlar implements this as the `form-validate-errors` mixin (`min-height: 1.25rem`, grounded — `scss/config/mixins/_form.scss`), consumed by [`../components/ln-validate.md`](../components/ln-validate.md) error lists.

---

### Field grouping

A form with 8+ fields without grouping reads as a wall of inputs. Three tools, in order of visual weight:

**Spacing** — increased gap between logical groups. No visual element. Works for 2–3 groups when the semantic distinction is clear.

**Divider** — a horizontal rule between sections. Explicit structure. Use when spacing alone is ambiguous or groups are semantically distinct (personal info vs. billing info).

**Section header** — a text heading per group for forms with 3+ distinct sections. Anchors the user's position in the form.

Never use colored backgrounds to separate form sections. Color in forms is reserved for state signals (error, focus) — decorative color blocks compete with that language.

---

### Width communicates expected input

Field width signals the expected length of the answer. A field wider than the expected content creates uncertainty; a field too narrow forces awkward scrolling.

| Field type | Relative width |
|---|---|
| Name, email, address, description | Full width |
| City | ~50% |
| Phone number | ~30% |
| Postal code | ~20% |
| Year, short code, PIN | ~10–15% |

In a grid layout this is expressed by column span. The form should feel designed for its content, not stretched uniformly to fill the container.

---

### Density

Dense forms reduce padding inside inputs and gap between field rows. **Font size does not change.**

The typographic scale is constant across all density levels. A dense form with small text is harder to read without being faster to scan.

| Level | Use when |
|---|---|
| Standard | User-facing forms, onboarding, checkout — any focused task |
| Compact | Settings panels, admin configuration, side panels, forms alongside data |

---

### Required and optional marking

**Mark the minority group.** If most fields are required, mark the optional ones — `(optional)` as plain text after the label. If most fields are optional, mark the required ones — asterisk `*` with a legend.

The asterisk `*` is the universal convention for required. Do not replace it with a different symbol, color alone, or custom wording. `(optional)` as text is more explicit than any symbol and requires no explanation.

Never mark both required and optional on every field — this doubles visual noise for no gain.

---

### Button positioning

**1. Primary action is rightmost.** The eye finishes a left-to-right scan at the right edge. The primary action (submit, save, confirm) sits at the natural completion point.

**2. Cancel is adjacent to primary — always.** A user who wants to cancel is already looking at the primary button. Cancel lives immediately to its left. Never in a separate corner, never requiring a search.

**3. Destructive actions are physically separated.** Delete, reset, and irreversible actions must not share a visual cluster with the primary button. Use whitespace, a full-width separator, or opposite alignment (destructive left, primary right). Physical distance prevents accidents — not color alone, and not a confirmation dialog as a substitute for distance.

---

## 11. Button Design

A button communicates two things simultaneously: what will happen (label + icon) and how important it is (visual weight). Both must be correct — a mislabeled button or a wrong weight creates confusion or accidents.

---

### Visual hierarchy — four levels

| Level | Appearance | When |
|---|---|---|
| Primary | Filled, brand color, high contrast | The main action in a context |
| Secondary | Outline or neutral fill | Supporting action alongside primary |
| Ghost | Text-only or near-invisible bg | Tertiary, toolbars, non-critical options |
| Destructive | Error color | Irreversible actions — weight depends on context |

**One primary per context.** A page, modal, or card has exactly one primary button. Two primary buttons = no primary button — the hierarchy collapses and the user has no clear next step. If two actions feel equally important, one of them should be secondary.

**Destructive weight is context-dependent.** Destructive is not a fixed level — it is a color signal applied at the appropriate weight:

- In a delete confirmation modal, delete IS the primary action → filled error color
- On a settings page alongside Save, delete is secondary → ghost or outline with error color, physically separated (see § 10)

Never default-render a destructive action at primary weight outside of a confirmation context. The visual weight communicates "do this now" — reserve that signal for when destruction is the confirmed intent.

---

### Size

Three sizes serve different contexts:

| Size | Use when |
|---|---|
| Default | Forms, modals, primary CTAs — any focused task |
| Small | Repeated elements: table row actions, compact toolbars, chip actions |
| Large | Standalone CTAs, onboarding, hero sections — never inside a form |

**One size per context.** Do not mix default and small buttons in the same toolbar or action group. Mixed sizes suggest mixed importance where none exists — it is visual noise, not hierarchy.

Size communicates density of the surrounding context. A large button in a dense data table is jarring. A small button on an empty hero page is timid.

---

### Icon + text rules

**Icon position:**

- **Left of text** — standard for most actions. Icon precedes label in reading order: add, edit, save, filter, upload.
- **Right of text** — directional actions only. Use when the icon communicates movement or destination: Next →, Download ↓, Open external ↗. The icon reinforces the direction of the action.

**Icon-only buttons:**
- Permitted only when the icon is universally understood in context (close ✕, menu ☰, search 🔍)
- Must always have an accessible label (`aria-label`) — the icon is visual shorthand, not a replacement for text
- Use sparingly — every icon-only button is a comprehension risk for unfamiliar users

**Icon sizing:** The icon must optically match the surrounding text — not larger, not smaller. An oversized icon next to small text creates visual imbalance. The icon is supporting information, not the focal point.

**No decorative icons.** Every icon in a button must add meaning — clarify the action or communicate direction. An icon that is present for visual interest alone adds noise without signal.

---

### Disabled state

Disabled buttons must look identical to their active version except for opacity and cursor:

- 50% opacity
- `cursor-not-allowed`
- No change to padding, shape, text, or color

Visual consistency on disabled state matters because the user needs to recognize which action is unavailable — not encounter a restyled button they don't recognize.

**The disabled anti-pattern.** Disabling a submit button until all fields are valid is a common pattern and a poor one. The user cannot know why it is disabled or what to fix. Better: allow submission, then show inline validation errors. The button stays enabled; the form communicates what is wrong.

Disabled is correct for states outside the user's control: loading in progress, insufficient permissions, feature unavailable in the current plan. It is not a substitute for validation feedback.

**Novalidate is automatic.** `ln-validate` injects `novalidate` on its host `<form>` per validated field — no manual markup needed.

---

## 12. Tables and Data Display

Tables are the most frequent data surface in business UI. Three orthogonal state dimensions must be visually distinct and non-conflicting: row state, column sort state, and selection state.

Table anatomy → [`../components/ln-table.md`](../components/ln-table.md) (dangling — planned; grounded via `js/ln-table/`, `scss/config/mixins/_ln-table.scss`).

---

### Row state hierarchy

```
Default < Hover < Selected
```

Each level must be visually distinct from the others. The most common failure: hover and selected look similar — the user cannot tell which rows are chosen.

**Selected survives hover.** A selected row that is also hovered must look selected, not hovered. Selection is a persistent state; hover is transient. Transient states never override persistent ones.

---

### Hover only on clickable rows

Row hover communicates "I can interact with this." If clicking a row does nothing, the hover treatment is a false affordance — it creates an expectation the interface cannot fulfill.

This is a direct extension of § 7: interactive elements must behave consistently. A row that looks interactive must be interactive. Apply hover styling only to rows where clicking produces an action (navigate, expand, select, open detail).

Non-clickable rows in a mixed table (some clickable, some not) should visually distinguish the clickable ones — cursor change is the minimum signal; a subtle hover bg confirms it.

---

### Selection

- Checkbox always on the left — consistent with all other checkbox positions in the interface
- Selected row: primary tint background (same visual grammar as selected state elsewhere)
- Selected + hovered: renders as selected, not hovered — selection takes visual precedence
- Multi-select header checkbox (select all / deselect all) sits in the same column as row checkboxes — same alignment, same visual weight

---

### Sorting indicators

Sorting state lives at the column level, parallel to row state. Three states per sortable column:

| State | Signal |
|---|---|
| Unsorted / sortable | Neutral sort icon (both directions, muted) — visible on header hover only |
| Sorted ascending | Chevron up, primary color |
| Sorted descending | Chevron down, primary color |
| Not sortable | No icon |

**Icon position:** Always to the right of the header text, never left. Left-side icons disrupt the column's content alignment (especially right-aligned number columns where the header must also align right).

**Active sorted column:** The column header text may be slightly bolder or use primary color to distinguish it from unsorted columns at a glance — useful in wide tables where the icon alone is easy to miss.

Only one column is sorted at a time in standard tables. Multi-column sort is a power-user feature that requires explicit UI affordance (sort order numbers).

---

### Column alignment

Visual convention, not preference — these rules exist because they improve scan speed:

| Content type | Alignment | Reason |
|---|---|---|
| Text, names, descriptions | Left | Natural reading direction |
| Numbers, amounts, quantities | Right | Decimal points and digit positions align vertically |
| Status badges, icons | Center | Symmetric elements look anchored at center |
| Action buttons | Right | Proximity to row end; away from data |

Header alignment must match its column's content alignment. A right-aligned number column has a right-aligned header.

---

### Inline actions

Row actions (edit, view, delete) are ghost-weight buttons — never primary. Applying primary weight to a repeated action across every row creates visual chaos and falsely suggests "do this now" for every row simultaneously (see § 11 — one primary per context).

**Visibility:** Actions may be hover-revealed to reduce visual noise in dense tables. Note: hover-reveal creates an accessibility gap on touch devices where hover does not exist. If the table is used on touch (mobile, tablet), consider always-visible actions or a row-level action menu.

**Placement:** Last column, right-aligned. Keeps actions away from data content and consistent with the right-side primary action convention (§ 10).

**Destructive inline action:** Must be visually separated from non-destructive actions even within the same button group — a gap or visual divider between edit/view and delete. The same physical separation principle from § 10 applies at the row level.

---

### Striped rows vs hover

Striped rows and row hover are competing techniques for the same purpose: helping the eye track across a wide row. Use one, not both at equal visual weight.

If striped: hover must be noticeably stronger than the stripe (e.g., stripe = 3% tint, hover = 8% tint). If not striped: hover alone is sufficient and should be the only row-level background signal.

Mixing striped rows with a same-weight hover produces a table where every interaction looks like nothing changed.

---

### Density

Same principle as form density (§ 10) — padding and row gap change, font size does not.

---

### Sticky header

A sticky table header that scrolls with the page must have a bottom shadow or border to visually separate it from the content scrolling beneath it. Without this, the header and body rows merge — the user loses the column labels.

This is an application of § 2: when elements overlap due to scroll, a shadow or border signals elevation and maintains the reading boundary. A `box-shadow` on the header's bottom edge is the minimal correct treatment.

---

## 13. Modals / Dialogs

Modal anatomy → [`../components/ln-modal.md`](../components/ln-modal.md) (dangling — planned; grounded via `js/ln-modal/src/ln-modal.js`, which is currently a `div`-based implementation with manual focus-trap and ESC-close `keydown` handlers. A native `<dialog>`/`showModal()` migration is a planned future refactor — see [`../refactor-todo.md`](../refactor-todo.md) §5 — and is NOT the current behavior).

### Overlay

A modal exists on two visual layers simultaneously: the **backdrop** and the **modal surface**. Both must be present and must work together.

**Backdrop** dims or blurs the page content beneath — it signals "the rest of the page is temporarily unavailable." It must cover the full viewport without gaps. Opacity must be strong enough to shift attention to the modal but not so heavy it erases all context.

**Modal surface** must be visibly elevated above the backdrop — a shadow or a distinct background color separates it from the dimmed page. Without surface elevation, the modal reads as part of the page rather than above it. This is an application of § 2: elevation signals function.

The two signals are complementary and both required. A backdrop alone (no modal shadow) produces a dimmed page with a fragile floating box. A modal shadow alone (no backdrop) fails to signal the suspended state of the page.

---

### Structure

Every modal has three zones: header, body, footer.

**Header** — title + close control. The close (×) button is always in the top-right corner. This is a universal convention; placing it elsewhere creates a search task. The close button is a Tier 1 neutral button — not filled, not destructive.

**Body** — scrollable content. The body scrolls independently when content overflows. Header and footer remain sticky — the user always has access to the title and actions regardless of scroll position.

**Footer** — actions only. Follows § 10 button positioning rules:
- Primary action right, secondary left
- Destructive action physically separated from the primary (left side or explicit gap)
- One primary button per modal

**Width** — content-driven, not full-viewport on desktop. A modal that fills the full screen is a page, not a dialog. Reserve full-viewport modals for dedicated workflows where the modal IS the primary task (image editor, document preview). Standard dialogs have a maximum width; height grows with content up to a viewport limit, then the body scrolls.

---

### Destructive confirm dialog

A confirm dialog for a destructive action has its own visual grammar, distinct from a standard save/cancel modal.

**Color:** Error color (`--color-error`) is the primary fill. Cancel inherits neutral Tier 1 styling.

**Pre-focus on Cancel:** Cancel receives focus when the dialog opens — not the destructive button. Two effects:
1. The user cannot confirm by pressing Enter without reading the dialog
2. The safe choice is the path of least resistance

**Keyboard rule:** Enter activates the focused button, not the primary button. No keyboard shortcut should bypass the intentional focus placement. If a system has a global Enter = Submit pattern, it must not override modal focus — the focused button wins.

**Title:** Names the consequence, not the question. "Delete membership record" — not "Are you sure?" The user already clicked delete; they know what is being asked. Name what will be destroyed.

**Body:** States the consequence and, if relevant, the irreversibility. One sentence is usually enough. "This action cannot be undone" is warranted only for truly permanent actions (no recycle bin, no restore path). Do not use it for recoverable actions — false irreversibility warnings are ignored, which undermines the warning when it matters.

---

### Inline confirmation — alternative to a modal

A confirm modal for a single button action is often architectural overhead. The same intent can be achieved inline, at lower cognitive cost. ln-ashlar ships [`../components/ln-confirm.md`](../components/ln-confirm.md) (dangling — planned) for this pattern.

**The pattern:** First click transforms the button into confirm state in place. Second click executes. The button reverts automatically after a timeout if unconfirmed.

**Positioning rule:** The confirmation appears exactly where the original button was — same position, same size. The user's eye is already there from the first click. If the confirmation shifts position (slides, jumps, opens elsewhere), the in-place advantage is lost and you have created a modal with extra steps.

This inherits § 10's button positioning principle: the user's attention flows to where the action is. Inline confirmation exploits this — there is no new element to find.

**When to use inline vs modal:**
- **Inline:** Single action, reversible or low-stakes deletions, table row actions. No context switch.
- **Modal confirm:** Irreversible, high-impact actions (delete an account, cancel a paid subscription). The deliberate interruption is warranted by the consequence weight.

The overhead of a modal should be proportional to the consequence. If the action is undoable or affects only a list item, inline is the correct choice.

---

### Stacking

Modal on top of modal is an architectural error — it signals that the design is trying to do two things at once.

The common failure mode: user opens an edit modal → clicks Delete → a confirm modal appears over the edit modal.

The correct resolution: bring the confirmation inline. The edit modal's Delete button uses the inline pattern — text changes to "Confirm?" in place, second click submits. The user never leaves the modal context; no stacking occurs.

If a second modal feels necessary, first ask whether the second action should be a step in the same flow rather than a separate interruption.

---

### Sizing

Modal width is a content decision: a short confirmation uses the smallest size; a multi-field form uses a larger one. Do not choose size for aesthetic reasons — let the content define the footprint.

---

## 14. Feedback / System Responses

Feedback is a response, not decoration. Every feedback element answers a specific action or state. If no action caused it — no feedback element.

Toast anatomy → [`../components/ln-toast.md`](../components/ln-toast.md) (dangling — planned; component exists at `js/ln-toast/`).

### Two axes

Every feedback element has two properties: how long it stays, and where it appears.

**Axis 1 — Persistence:**

| Type | Duration | When |
|---|---|---|
| Transient | 3–5 seconds, auto-disappears | Successful action, confirmation. Requires no decision. |
| Persistent | Stays until user acts | Error, warning. Requires attention or action. |
| Permanent | Part of the UI, never disappears | Empty state, offline indicator. A condition, not an event. |

**Axis 2 — Position:**

| Type | Position | Context |
|---|---|---|
| Toast | Fixed corner of the viewport | Global actions — save, send, delete. Not tied to a specific element. |
| Inline alert | Inside the content, beside the element that triggered it | Form validation, section-specific warnings. Contextually bound. |
| Banner | Full-width, top of the page or section | System-level status — offline, maintenance, trial expiring. |

**The core rule:** Success is transient. Error is persistent. Never reversed.

A success message that requires dismiss is noise. An error that auto-disappears is dangerous — the user may not see it. This rule is non-negotiable.

---

### Toast

**Position:** Bottom-right, always. Business UI users work in the upper portion of the screen — nav, toolbar, forms. Bottom-right does not compete with the working area. Top-right conflicts with notifications, user menus, and header actions that live there. Position never changes between instances or states.

**Stacking:** New toasts stack upward (toward the center of the screen). Maximum 3 visible simultaneously. If a fourth is triggered while three are visible, the oldest dismisses to make room. More than 3 visible toasts simultaneously is a UX architecture problem — not a toast system problem.

**Actions:** One recovery action is allowed — Undo, View, Retry, Reconnect. Never two buttons. Never a form. If more than one action is needed, the correct component is an inline alert or a modal, not a toast.

**Error in toast:** Toast may contain a system error with a single recovery action (Retry, Reconnect). Toast must never contain an error that requires the user to correct their input — those belong inline. The distinction: "Network error — Retry" requires no user correction. "Your email is invalid" requires user input correction → inline, not toast.

---

### Inline alert

**Four semantic levels:** info, success, warning, error. Each has its own color, icon, and message tone. No fifth level.

**Position:** Above the content it refers to, never below. The user reads the message before encountering the field or section it describes.

**Dismissibility by level:**

| Level | Behavior | Reason |
|---|---|---|
| Success | Auto-dismiss (3–5s, fade out) | Transient — no decision needed. An X button on a success message creates cognitive noise: the user wonders if they need to do something with it. |
| Info | User-dismissible (X button) | Informational — user reads at their own pace, dismisses when done. |
| Warning | Persistent until condition resolved | Requires awareness; user may need to act. |
| Error | Persistent until condition resolved | Requires correction. Auto-dismissing an error is dangerous. |

---

### Banner

A banner is a third position type — not a variant of toast or inline. It occupies the full width at the top of the page or section, and pushes all content downward. This layout shift is inherent and must be a conscious decision: a banner is not added lightly.

**When to use:** System-level status that affects the entire session or page — offline state, scheduled maintenance, trial period expiring, account suspension warning. Not for individual action feedback.

**Dismissible or not:** If the user can do something about the condition — dismissible. If they cannot — not dismissible.

| Condition | Dismissible | Reason |
|---|---|---|
| Maintenance window | No | No user action resolves it |
| Trial expiring — upgrade available | Yes | User can act (upgrade) or choose to ignore |
| Account suspended | No | No local action resolves it |
| Feature flag / beta notice | Yes | Informational, user acknowledges once |

**One banner at a time.** Two simultaneous banners is an architectural error. If two system-level conditions exist simultaneously, prioritize by severity and show the higher one.

**Banner vs. inline alert at page level:** If the condition is caused by a specific page action, use an inline alert. If the condition exists regardless of what the user does on the page, use a banner.

---

### Empty state

Empty state is not feedback in the classic sense — it is the absence of content. But it must be consciously designed, or it reads as a bug.

**Three elements:** illustration or icon (optional), text (what is empty and why), CTA (what the user should do). Minimum is text + CTA. Never just empty space.

**CTA is required.** An empty state without a call to action leaves the user stranded. The CTA should be the primary action that would populate the state — "Add member", "Create first project", "Import data".

**Visual weight rule:** The empty state must never be visually heavier than the populated state. If the illustration, typography, and color of the empty state are more interesting than the table it replaces — something is wrong. Empty state signals absence; it should not compete with the content it is waiting for.

---

### Loading

Two patterns, chosen by duration and scope:

| Pattern | Visual | When |
|---|---|---|
| Spinner | Rotating icon, typically centered | Short wait (< 2s), action in progress (submit, fetch). Also used at button level for individual action feedback. |
| Shimmer | Animated sweep on existing elements — rows, cards, containers | Longer load, full page or section. The shell renders immediately; elements shimmer until data arrives. |

**Shimmer on structure:** The shimmer is applied to real structural elements — table rows, card slots, list items — not to separate placeholder rectangles. The layout is already correct; only the data is absent. When data arrives, the shimmer is removed and content fills the existing elements.

**Spinner on a button:** When a submit or fetch action is triggered from a button, the button itself shows the loading state (spinner replaces or accompanies label, button is disabled). The spinner stays scoped to the action — it does not take over the page for a button-level operation.

---

### Progress — brief note

Spinner → progress bar when an operation exceeds a few seconds and a completion percentage is available. A spinner for a 45-second import is inadequate — the user has no signal of how long to wait. When progress can be measured, show it.

Upload, import, and processing pipelines are feedback contexts — progress lives here. Multi-step forms and onboarding wizards are UX flows — they have their own visual logic and belong in a separate section (see [`./ux.md`](./ux.md) § 7).

---

## 15. Responsive Behavior

Components adapt to the space they are given, not the screen they are on.

---

### Container-first principle

A component does not know the viewport width. It knows only the width of its own container — and that is the only dimension it responds to.

A table inside full-width main content and the same table inside a 320px sidebar panel are in different spatial contexts. The viewport may be identical in both cases. The component's available space is not. Container queries make this distinction possible; viewport media queries do not.

**The rule:** all component-level responsive behavior uses container queries. Viewport queries are reserved for layout shell decisions (see below).

---

### Container breakpoints are not standardized

Viewport breakpoints are standardized because devices are standardized — 375px is a phone, 768px is a tablet. Containers have no standard sizes. A container is as wide as the layout allows, and that depends on sidebar state, split views, panel configuration, and modal size. No fixed scale can predict this.

**The rule:** a container breakpoint is placed where the component's content stops functioning — not at a predetermined value. A table with six columns breaks at a wider point than a table with three. A form with paired fields breaks at a different width than a button group. Each component defines its own threshold.

**Semantic names, not fixed values.** Components use three levels — `sm`, `md`, `lg` — as semantic labels for their spatial states. The pixel values behind those labels vary per component:

| Level | Meaning | Determined by |
|---|---|---|
| sm | Content requires single-column or collapsed layout | The point where the component's multi-element layout no longer fits |
| md | Content fits with simplification (hidden columns, two-column form) | The point where full layout is excessive but collapse is premature |
| lg | Content fits fully — no adaptation needed | The point where all elements have room |

A table's `sm` might be 500px. A button group's `sm` might be 300px. These are different values for the same semantic state, and that is correct — the content dictates the threshold, not a global scale.

**Three levels maximum.** More than three creates combinatorial complexity — every component needs rules for every level, and the differences between adjacent levels become too subtle to be meaningful. If a component seems to need four levels, one of the levels is probably a density change, not a layout change.

---

### Component adaptation rules

Each component defines its own response to the three container levels. The adaptation must follow the same visual language — it is not a redesign, it is a simplification.

#### Table

| Level | Behavior |
|---|---|
| lg | All columns visible. Standard density. |
| md | Non-essential columns hidden. Column priority must be defined per table — there is no universal rule for which columns are "essential." |
| sm | Two options depending on context (see below). |

**Table at sm — two valid approaches:**

*Card view* — each row becomes a vertical card. Label–value pairs stack vertically. Natural for touch, easy to read. Loses scan-ability — the user can no longer compare values across rows by scanning a column.

*Horizontal scroll* — the table retains its structure and scrolls horizontally. Preserves scan-ability and column relationships. Uncomfortable on touch devices, easy to miss content off-screen.

Neither is universally correct. The choice depends on how the data is used:

| Data usage | Recommended | Rationale |
|---|---|---|
| Record-by-record reading (contacts, orders, tickets) | Card view | Each record is consumed independently |
| Cross-row comparison (financial data, metrics, inventory) | Horizontal scroll | Column alignment is the point |

**View toggle:** When both uses are plausible, provide a toggle — a small icon pair (grid / list) in the component's top-right corner. The toggle exists only at `sm`. At `md` and `lg`, the table is always a table.

**Default view must be set.** The user sees data immediately, not a choice. Card view is the safer default — it requires no horizontal interaction. The toggle offers the alternative for users who need it.

*(aspirational — no `sm`-breakpoint card-view/horizontal-scroll toggle found in `js/ln-table/` or `scss/config/mixins/_ln-table.scss`; this is a design requirement for a future responsive pass, not current behavior.)*

#### Form

| Level | Behavior |
|---|---|
| lg | Grid layout per § 10 width rules. Multi-column where content length justifies it. |
| md | Two columns for logically paired fields (city + postal code, first + last name). Single column for everything else. |
| sm | All fields full-width, single column. No exceptions. |

The § 10 width-communicates-input rule still applies at `md` and `lg`. A postal code field at 50% of a two-column layout is still narrower than a full-name field at 100%. At `sm`, all fields are full-width — the width signal is sacrificed for usability, and that is acceptable because the user is already in a constrained context.

#### Button group

| Level | Behavior |
|---|---|
| lg | Inline, standard spacing. § 10 positioning rules apply. |
| md | Inline, reduced gap. Buttons may use compact density. |
| sm | Stack vertically, full-width. Primary on top (closest to the content above it), cancel below. |

At `sm`, the § 10 rule "primary is rightmost" translates to "primary is topmost" — the reading direction shifts from horizontal to vertical, and the primary action occupies the first position in the new axis. This is a visual reorder via CSS `order`, not a DOM change. The DOM order remains the same as the horizontal layout (cancel first, primary last) — only the visual presentation changes. DOM order never changes for visual purposes.

Destructive actions remain separated — a full-width spacer or visual break before a destructive button at the bottom.

#### Navigation (horizontal)

| Level | Behavior |
|---|---|
| lg | Full labels visible. Standard spacing. |
| md | Truncated labels or icon + abbreviated text. |
| sm | Collapse to hamburger menu, or horizontal scroll with overflow fade. |

**Overflow fade:** a gradient mask on the trailing edge of a scroll container — a visual signal that content continues beyond the visible area. Without it, the user has no indication that more items exist off-screen. The fade is purely visual (CSS mask or pseudo-element gradient to transparent), not interactive.

Horizontal scroll is acceptable for navigation at `sm` only if the number of items is small (≤ 6) and the active item is scrolled into view on load. For longer lists, collapse to a menu.

#### Tabs

| Level | Behavior |
|---|---|
| lg | All tabs visible. Standard spacing. Active indicator per § 9. |
| md | All tabs visible if they fit. Horizontal scroll with overflow fade if they do not. |
| sm | Horizontal scroll with overflow fade if items ≤ 5. Collapse to dropdown select if items > 5. |

The threshold is practical: five tabs fit comfortably in a scrollable row and the user can discover them with a swipe. Beyond five, the scroll distance becomes long enough that a dropdown is faster — the user sees all options at once instead of scrolling to find them.

When tabs collapse to a dropdown, the active tab label becomes the dropdown's displayed value. The indicator type (bar, fill) disappears — the dropdown's own selected state replaces it.

*(aspirational — no dropdown-collapse behavior found in `js/ln-tabs/`; the current component does URL-hash-synced tab switching without a responsive collapse mode.)*

#### Modal

Modals are containers themselves — their *content* uses container queries against the modal's inner width. The modal's own sizing is a viewport decision (see below).

---

### Viewport queries — layout shell only

Three decisions remain viewport-dependent because they affect the page structure, not individual components:

**1. Sidebar visibility.** Whether the sidebar exists, is collapsed to icons, or is hidden behind a hamburger — this is a layout shell decision. The sidebar's *content* (nav links, user info) adapts via container queries once the sidebar width is determined, but the *existence* of the sidebar is a viewport choice.

**2. Modal sizing.** On a large viewport, a modal is a centered overlay with a defined width (sm/md/lg/xl). On a small viewport, the modal becomes full-screen. This decision is about the modal's relationship to the viewport, not to its content. Once the modal has a size, its inner content adapts via container queries.

**3. Toast positioning.** Toasts are fixed to the viewport (§ 14). On large viewports: bottom-right, fixed width. On small viewports: full-width, anchored to bottom edge. This is inherently a viewport decision — the toast has no container other than the screen.

**The boundary is clear:** viewport queries decide *what exists and where it is placed*. Container queries decide *how the content inside adapts*.

---

### What does not change across breakpoints

**Font size does not change.** The typographic scale is constant — same rule as density (§ 10, § 11). A component at `sm` has less space, not smaller text. Reducing font size to fit more content into less space defeats the purpose of responsive design — it makes content harder to read without reducing its quantity.

**Color and state signals do not change.** Focus rings, error treatment, hover behavior, selection states — all remain identical regardless of container size. A focused input at `sm` looks the same as a focused input at `lg`, minus the width.

**Spacing scale does not change.** The token scale (§ 4) is constant. Components at `sm` may use a smaller spacing token from the scale (e.g., the compact density level), but they never use values outside the scale. Cramming content by inventing a `3px` gap is a sign that the component needs a layout change, not a spacing hack.

---

## 16. Typography and Information Hierarchy

Every screen in business UI contains text at multiple levels of importance. Typography is the primary mechanism for communicating which text matters most, which text supports it, and which text can be ignored until needed.

---

### Three weights — no more

Text exists at three levels of visual prominence. Every piece of text on screen belongs to exactly one:

| Level | Role | Typical treatment |
|---|---|---|
| Primary | The value, the answer, the thing the user came to see | Default size, default weight, full-contrast color |
| Secondary | Supporting context — labels, column headers, section titles | Smaller size or medium weight, slightly reduced contrast |
| Muted | Metadata, timestamps, IDs, helper text | Smallest size, lowest contrast — visible when sought, invisible when not |

Three levels maximum on any single view. If a screen requires a fourth level, the information architecture has a problem — too many things are competing. Fix the hierarchy, not the typography.

---

### Label + value

The dominant typographic pattern in business UI. A label describes what the data is; a value shows what the data says.

**The label is always subordinate to the value.** Label: small, muted, semantically descriptive (`<dt>`, `<th>`, `<label>`). Value: larger, prominent, full contrast. Never the reverse — a bold label with a muted value inverts the hierarchy and forces the user to read the descriptor before finding the information.

```
  STATUS            ← label: small, muted
  Active            ← value: default size, full contrast

  not:

  STATUS            ← label: bold, prominent
  Active            ← value: muted — user reads the wrong thing first
```

This applies consistently across all components: form fields (label above input), table cells (column header above data), detail panels (key–value pairs), card metadata (label–value rows). The visual relationship is always the same — if a user learns it once, it works everywhere.

---

### Heading semantics vs visual size

`<h3>` inside a card does not mean "medium title." It means third level in the document outline. The heading level reflects the document's structure — the position of this content within the page hierarchy. The visual size reflects the design's needs.

When the structural level and the desired visual size do not match, CSS resolves the difference. The heading element stays correct for the structure; a class or token adjusts the visual size.

```html
<!-- Correct: h3 because it's nested under h2, visually styled as needed -->
<h3 class="text-lg">Card Title</h3>

<!-- Wrong: h2 because "it should look bigger" -->
<h2>Card Title</h2>
```

Heading levels must descend sequentially in the DOM — no skipping from `<h2>` to `<h4>`. Screen readers navigate by heading level, not visual size. A broken heading sequence is an accessibility failure, regardless of how it looks. See [`../doctrine/html-markup-rules.md`](../doctrine/html-markup-rules.md) for the markup-level rule.

---

### Numeric data

Columns of numbers must align vertically. Without alignment, the eye cannot compare values across rows — a financial table becomes noise.

**`font-variant-numeric: tabular-nums`** — forces all digits to occupy equal width, so decimal points, thousands separators, and digit columns align. This is a single CSS declaration that transforms a chaotic number column into a readable one. Apply it to any element that displays tabular numeric data: table cells, KPI values, financial summaries, invoice line items.

```
  Proportional (default):    Tabular:
  1,234.56                   1,234.56
  891.20                       891.20
  12,045.00                 12,045.00
```

Right-alignment (§ 12) and tabular numerals work together — right-alignment anchors the decimal point to a fixed position; tabular numerals ensure the digits above and below it are vertically consistent.

---

### Truncation rules

When text overflows its container, truncation must preserve meaning. Where the text is cut depends on what kind of information it carries.

**End truncation** (`text-overflow: ellipsis`) — for text where the beginning is most identifying: names, descriptions, titles, email addresses. The user reads the start and infers the rest.

```
  Dalibor Šoji…        ← name: beginning identifies
  Invoice for annu…    ← description: beginning gives context
```

**Middle truncation** — for text where both the beginning and end carry meaning, but the middle is expendable: file paths, UUIDs, long IDs, URLs. The user needs the start (type/origin) and the end (specific identifier). Middle truncation is not CSS-native — it requires JavaScript, or a `direction: rtl` trick for paths only.

```
  /home/clau…/output.md    ← path: folder + filename matter
  a5f82…c3d9               ← UUID: prefix and suffix identify
```

**Never truncate:** monetary amounts, dates, status labels, or any value where partial display changes the meaning. A truncated price (`$1,23…`) is worse than no price — it actively misleads. If the value does not fit, the container is too small. Fix the layout, not the content.

---

### Capitalization

**Sentence case for everything.** First word capitalized, rest lowercase (except proper nouns). This applies to headings, button labels, menu items, column headers, tab labels, toast messages, and error text.

```
  Sentence case:     "Create new invoice"      ← natural, easy to read
  Title Case:        "Create New Invoice"       ← formal, slower to parse
  ALL CAPS:          "CREATE NEW INVOICE"       ← visual shouting
```

**ALL CAPS is never appropriate for UI text.** Uppercase text is harder to read (words lose their shape silhouette), takes more horizontal space, and reads as aggressive. The convention of uppercase labels in some design systems (section headings, overlines) is a legacy of print design that does not translate well to interactive UI — it creates visual noise at the exact points where the user needs orientation.

**Title Case** is acceptable only for proper nouns and product names. Never for action labels, navigation items, or headings.

---

### What to avoid

**Italic** — in typographic convention, italic implies emphasis, foreign language, or uncertainty. In UI, none of these are common needs. Italic text in a business interface reads as tentative or different — it creates a subtle question ("why is this styled differently?") without answering it. Use weight or color for emphasis, not style.

**Underline on non-links** — underline is universally understood as "this is a link." Underlining text that is not interactive is a false affordance. For emphasis, use weight. For separation, use spacing or color.

**Decorative weight variation** — using bold, semibold, and medium within the same paragraph or component to create visual interest. Weight communicates hierarchy. Random weight changes within the same hierarchical level contradict that system. If two pieces of text are at the same level of importance, they have the same weight.

---

## 17. Animation / Motion

Motion communicates. Every animated element should answer one question: **why does this move?** If the answer is "it looks nice," the animation does not belong.

---

### Why motion exists

There are four legitimate reasons for an element to animate in a UI:

**1. Entrance / exit** — an element arrives from or departs to somewhere. The motion gives spatial context: the dropdown opens downward (it lives below the trigger), the modal grows from the center (it is an overlay on top), the toast slides in from the edge (it is temporary, outside the main content).

**2. State change** — a value or status transitions. A toggle flips, a progress bar advances, a badge color shifts from warning to success. The motion confirms that the change happened — it was not instantaneous and invisible, but a real event.

**3. Loading** — the system is working. A spinner rotates, a shimmer sweeps across elements. Motion signals "I received your request and I am processing it" — without it, a frozen interface is indistinguishable from a broken one.

**4. Feedback** — a user action was registered. A button briefly darkens on press. A row flashes when a record saves. The motion closes the loop: action → acknowledgment.

Anything outside these four categories is decoration. Decorative animation is noise — it trains users to ignore motion, which is the opposite of what motion is for.

---

### What animates — and what does not

Only two CSS properties should animate: **`transform`** and **`opacity`**.

Both are composited by the browser on the GPU — they do not trigger layout recalculation or paint. Animating any other property (`width`, `height`, `max-height`, `margin`, `padding`, `top`, `left`, `color`, `background-color`) forces the browser to recalculate layout or repaint pixels on every frame. The result is jank — visible stutter, especially on lower-end hardware.

```
Animate:         transform: translateY(), scale(), rotate()
                 opacity: 0 → 1

Never animate:   width, height, max-height (use transform: scaleY)
                 margin, padding, gap (use transform: translate)
                 top, left, right, bottom (use transform: translate)
                 color, background-color (instant swap, or cross-fade via opacity)
```

The one practical exception: `color` and `background-color` transitions on hover states (50–100ms) are visually acceptable even though they are not GPU-composited. The duration is short enough that the repaint cost is imperceptible.

---

### Duration

Duration should be proportional to the distance and complexity of the motion. Small, close elements move quickly. Large, full-screen elements take slightly longer. Everything else is noise.

| Type | Duration | Examples |
|---|---|---|
| Micro-interaction | 80–120ms | Button press feedback, focus ring, badge color change |
| Component transition | 150–250ms | Dropdown open, tooltip appear, tab switch |
| Overlay entrance | 200–300ms | Modal open, drawer slide, toast enter |
| Overlay exit | 150–200ms | Modal close, toast dismiss — exits feel faster than entrances |

**Never exceed 400ms** for any UI transition. Above that threshold, the user is waiting for the interface, not watching it respond. Long animations signal a slow system, not a polished one.

Exits are slightly faster than entrances by design — when a user dismisses something, they want it gone. A slow exit holds the interface hostage.

---

### Easing

Easing is the shape of motion over time. Uniform speed (linear) feels mechanical. Natural motion accelerates and decelerates.

**`ease-out`** — fast start, decelerates to rest. Use for **entrances**. Elements arrive with energy and settle into place. This matches how physical objects behave when they land.

**`ease-in`** — slow start, accelerates to exit. Use for **exits**. Elements pick up speed as they leave — they are committed to going. An exit that decelerates at the end looks like it is reconsidering.

**`ease-in-out`** — slow start, fast middle, slow end. Use for **position changes within the view** — a card sliding from one column to another, a reorder within a list. The motion has a natural arc.

**`linear`** — constant speed. Use only for **continuous motion**: spinners, progress bars, shimmer sweeps. These should not decelerate — a spinner that slows down implies it is finishing.

```
Entrance:   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ ease-out
             fast ────────────────────────────── slow

Exit:       ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ ease-in
             slow ────────────────────────────── fast

Continuous: ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ linear
             constant ──────────────────────── constant
```

---

### Reduced motion

`prefers-reduced-motion: reduce` is a system-level accessibility setting. Users who enable it have explicitly said they want less movement — for reasons that range from vestibular disorders to cognitive load to simple preference.

**The rule:** when `prefers-reduced-motion: reduce` is active, all UI transitions become either instant or a simple opacity cross-fade. No translate, no scale, no rotation.

```css
@media (prefers-reduced-motion: reduce) {
    /* All transitions instant or opacity-only */
    transition: opacity 150ms linear;
    animation: none;
}
```

A spinner is exempt — it communicates state, not aesthetics. Replace looping animations with a cross-fade or use `animation-duration: 0.001ms` to stop the loop while keeping the static state visible.

Do not substitute reduced motion with "slightly less motion." If the user has reduced motion enabled, translate-based animations do not become shorter — they become instant.

---

### What not to animate

**Bounce / elastic / spring** — easing curves that overshoot and rebound. These imply playfulness and imprecision. In a business interface, they read as unfinished or inappropriate. Use `ease-out` instead.

**Hover size changes** — scaling an element on hover signals interactivity through geometry change. This is covered in § 9: hover communicates through opacity, not size. A button that grows on hover is visually unstable — it shifts surrounding content and creates a jittery experience when the cursor is near the edge.

**Staggered list entrances** — items in a list entering one by one with a delay between each. This pattern imposes a wait on the user proportional to the length of the list. A 10-item list with 50ms stagger = 500ms before the last item is visible. It looks sophisticated in short demos; it is friction in real use. If a list needs to draw attention to new items, animate only the new item, not the entire collection.

**Parallax** — layers moving at different speeds on scroll. Creates disorientation, adds no information, and performs poorly. Not appropriate for application UI.

**Transitions on page load** — the first render should be immediate. A fade-in on body load delays the user from seeing the interface. If something needs to appear after load (lazy-loaded content, async data), animate its arrival — not the initial page.

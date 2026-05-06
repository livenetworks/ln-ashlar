# Circular Progress — architecture reference

> Implementation notes for `ln-circular-progress`. The user-facing
> contract lives in [`js/ln-circular-progress/README.md`](../../js/ln-circular-progress/README.md);
> this document is the why-behind-the-how, not a re-statement of usage.

File: `js/ln-circular-progress/ln-circular-progress.js` (133 lines).

## Position in the architecture

`ln-circular-progress` is a **passive renderer** in the architecture
described in [`docs/architecture/data-flow.md`](../architecture/data-flow.md).
It owns no data, no transport, no command surface — it derives a
single visual (an SVG ring with a label) from two attributes
(`data-ln-circular-progress` and `data-ln-circular-progress-max`)
plus an optional label override. Every state change comes from
outside the component; every internal reaction is a re-read of the attributes.

The component dispatches a **non-cancelable** notification event because the
rendering IS the contract — there is no default behaviour for a consumer to override.

## State

Each `[data-ln-circular-progress]` element gets a `_constructor`
instance stored at `element.lnCircularProgress`. Instance state is
the constructed DOM and the observer; nothing else.

| Property | Type | Lifetime | Description |
|---|---|---|---|
| `dom` | `HTMLElement` | Whole instance | The host element carrying `data-ln-circular-progress` |
| `svg` | `SVGSVGElement` | Built in `_buildSvg` | The constructed `<svg viewBox="0 0 36 36">` |
| `trackCircle` | `SVGCircleElement` | Built in `_buildSvg` | The grey background circle, stroke = `var(--color-border)` |
| `progressCircle` | `SVGCircleElement` | Built in `_buildSvg` | The fill circle whose `stroke-dashoffset` carries the progress, stroke = `var(--color-accent)` |
| `labelEl` | `HTMLElement` | Built in `_buildSvg` | The `<strong class="ln-circular-progress__label">` element |
| `_attrObserver` | `MutationObserver` | Built in `_listenValues` | Watches the host's value and max attributes; fires `_render` on change |

There is no JS-side cached value property. `_render` reads the attribute fresh on every call — the DOM is the source of truth. `_buildSvg` is non-idempotent: it appends new DOM nodes each time it runs. The `registerComponent` re-init guard via `el.lnCircularProgress` prevents accidental double-build.

## Construction flow

`registerComponent('data-ln-circular-progress', 'lnCircularProgress', _constructor, 'ln-circular-progress')`
at line 132 wires the standard scaffolding:

1. **Selector + attribute** registers the element type with ln-core's shared MutationObserver.
2. The shared observer watches `document.body` for new `[data-ln-circular-progress]` elements and for the attribute landing on existing elements. New matches run `new _constructor(el)`.
3. The constructor sets `this.dom = dom`, then immediately calls `_buildSvg.call(this)` to create and append the SVG and label.
4. `_render.call(this)` runs to compute the initial arc offset from the current attribute values and dispatch the first `ln-circular-progress:change` event.
5. `_listenValues.call(this)` registers the per-instance MutationObserver that watches the host's value and max attributes for subsequent changes.
6. `dom.setAttribute('data-ln-circular-progress-initialized', '')` marks the element as initialised. (Defensive — `registerComponent`'s own guard via `el.lnCircularProgress` covers the same case.)

The instance is returned and assigned to `el.lnCircularProgress` by `registerComponent`'s standard wiring.

## SVG geometry

The geometric constants are module-level (lines 10–12) and not
configurable per instance: `VIEW_SIZE = 36`, `RADIUS = 16`, and
`CIRCUMFERENCE = 2 * Math.PI * RADIUS` (≈ 100.531).

The `viewBox` is `"0 0 36 36"`, the SVG element fills the host
(`width: 100%`, `height: 100%`), and both circles have `cx=18`,
`cy=18`, `r=16`. That leaves a 2-unit margin on each side to
accommodate the `stroke-width="3"` (which centres on the radius —
1.5 inside, 1.5 outside).

The progress circle has:

- `stroke-linecap="round"` — softens the start and end of the arc; matters most when the value is small.
- `stroke-dasharray="100.531..."` — the full circumference, so exactly one "dash" wraps the circle.
- `stroke-dashoffset="100.531..."` — initial offset equals the full circumference, rendering as 0% drawn. `_render` decreases this linearly: `offset = CIRCUMFERENCE - (percentage / 100) * CIRCUMFERENCE`. At 100%, offset is 0 and the full circle is drawn.
- `transform="rotate(-90 18 18)"` — rotates the start point to 12 o'clock instead of 3 o'clock.

The CSS rule `transition: stroke-dashoffset var(--transition-base)`
in `@mixin circular-progress` (gated through `@include motion-safe`)
animates the change. Reduced-motion users see an instant snap.

## Render flow

`_render` is the only function that mutates DOM after construction.
Three implementation choices worth flagging:

1. **`|| 0` / `|| 100` fallbacks.** `parseFloat('')` is `NaN`, which is falsy, so `NaN || 0` is `0`. Invalid input silently becomes the default — consistent with the passive-renderer pattern (the component reflects state, doesn't police it).

2. **`max > 0` guard.** Avoids divide-by-zero and divide-by-negative. If max is 0 or negative, percentage is forced to 0%.

3. **Clamping at the percentage level, not the attribute level.** The clamp runs on the computed percentage (lines 113–114), not on the input value. The attribute is left as-written, so `e.detail.value` carries the raw value and `e.detail.percentage` carries the clamped result. Consumers detecting overshoot read `e.detail.value`; consumers reading the visible bar use `e.detail.percentage`.

## MutationObserver — what triggers a re-render

`_listenValues` registers a per-instance `MutationObserver` watching
the host element with `attributeFilter: ['data-ln-circular-progress',
'data-ln-circular-progress-max']` (line 102). On any mutation
matching either name, `_render` runs.

Two things NOT in the filter, deliberately:

1. **`data-ln-circular-progress-label`** — the label attribute is read inside `_render` but is not a trigger. Mutating it alone does not update the displayed label. Labels are a display concern; values and max are state. Adding the label to the filter would re-render the arc on every label write, wasted work for the common case where label is set once alongside a value.

2. **`class`** — colour and size variants are class-driven. The visual change happens via plain CSS; no JS reaction is needed because nothing about the SVG geometry depends on the class.

The observer is per-instance, which is acceptable because there is no shared state to coordinate. The shared observer in `registerComponent` watches for new elements appearing in the DOM; the per-instance observer watches an already-instantiated host for value changes. They cover different concerns.

## Cleanup

`destroy()` (lines 28–41) does four things:

1. Disconnects the per-instance attribute observer.
2. Removes the SVG element from the DOM.
3. Removes the label element from the DOM.
4. Removes `data-ln-circular-progress-initialized` and deletes the `el.lnCircularProgress` reference.

What it does NOT do:

- Does NOT remove `data-ln-circular-progress` itself. Setting any value on the attribute after `destroy()` triggers re-initialisation via the `registerComponent` shared observer.
- Does NOT remove the colour or size class.

## Integration with theme tokens

The track stroke reads `--color-border` (default: `var(--border-subtle)`); the fill stroke reads `--color-accent` (default: wired to `var(--color-primary)` via `_tokens.scss`). Both rebind through theme `:root` automatically — a `[data-theme="glass"]` ancestor shifts both simultaneously with no per-component CSS needed.

The shipped colour variants (`.success`, `.error`, `.warning`) override `stroke` directly on `.ln-circular-progress__fill` for absolute status colours that do not shift with theme accent. The two override paths (token cascade vs direct stroke) are documented in the SCSS mixin header comment.

## Why not native `<progress>` or a Web Component?

**Native `<progress>` with overlay SVG.** The native element provides implicit ARIA, saving manual `role="progressbar"` wiring. The trade-off: the native element cannot be visually replaced — only overlaid with an absolutely-positioned SVG. That creates two overlapping children with conflicting layout expectations, and requires synchronising two parallel attribute sets (`value`/`max` vs `data-ln-circular-progress`/`-max`). The ARIA saving is real but smaller than the added synchronisation surface.

**Custom Element / Web Component.** A `<ln-circular-progress>` tag with Shadow DOM would encapsulate SVG construction. The trade-off: all project components are data-attribute-based for server-side rendering friendliness and zero-build SCSS coupling (`@mixin circular-progress` applies to a CSS selector, not a shadow-root host). Adopting Custom Elements for one component would create a stylistic split with the rest of the library.

## Performance characteristics

| Operation | Cost |
|---|---|
| Construction | O(1) per instance — three DOM nodes (SVG + 2 circles + 1 label), one MutationObserver. Multiple instances scale linearly. |
| Attribute write (value or max) | O(1) — one MutationObserver fire, one `_render` call, one `stroke-dashoffset` write, one `textContent` write, one event dispatch. |
| Attribute write (label only) | O(0) — observer does not fire; nothing happens until the next value/max write. |
| Class change | O(0) on the JS side — CSS re-matches automatically; no JS reaction. |
| Initial render at construction | Same as a value write — one `_render` call. |
| Destroy | O(1) — one MutationObserver disconnect, two DOM removals. |

The component's runtime cost is dominated by the CSS transition (GPU compositing of the `stroke-dashoffset` change), not by the JS.

## Anti-features

The 133-line size is partly the result of explicit decisions not to include:

- **No indeterminate mode.** No spinning ring, no `data-ln-circular-progress="indeterminate"` switch. Indeterminate is a different idiom (`@mixin loader`).
- **No threshold colour logic.** Colour is via class, set by the consumer.
- **No `setValue(n)` / `setMax(n)` / `redraw()` API.** The attribute is the API.
- **No parent-track shared max** (which `ln-progress` does support). A consumer that wants multiple rings to share a denominator sets `data-ln-circular-progress-max` on each.
- **No automatic ARIA writing** (`role`, `aria-valuenow`, etc.). Consumer responsibility.

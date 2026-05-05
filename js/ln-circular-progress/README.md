# ln-circular-progress

> A passive SVG ring renderer driven by a single number attribute.
> Consumer writes `data-ln-circular-progress="42"`, the component
> picks up the change via MutationObserver, recomputes the arc length
> from value and max, and writes the new `stroke-dashoffset` plus a
> percentage label. 133 lines of JS that exist because native
> `<progress>` cannot be reshaped into a ring without a DOM-shadow
> rewrite, and because the project standardises on attribute-driven
> reactivity instead of imperative `.setValue(n)` APIs.

## Philosophy

A circular progress indicator is, mechanically, two SVG circles
sharing the same centre and radius — a track and a fill. The fill's
`stroke-dasharray` equals the circumference, and `stroke-dashoffset`
slides between full circumference (0% drawn) and zero (100% drawn).
The maths is trivial. What `ln-circular-progress` adds is the
**reactive plumbing** around it: when does the offset get
recomputed, what triggers a re-render, where does the percentage
label come from, how do you skin the colour, what survives a destroy.

The shape of the contract is the same one every passive renderer in
this project uses: **the attribute IS the state**. There is no
`element.setValue(42)` API, no `progress.update()` call, no
imperative entry point at all. You set
`data-ln-circular-progress="42"`, the MutationObserver sees the
change, `_render` runs, the SVG redraws. The state is visible in
DOM Inspector at all times, can be set declaratively from server
templates, can be replayed via `outerHTML`, and survives
serialisation. JS plays the role of "react to attribute changes" and
nothing else.

This is the same passive-renderer pattern as `ln-progress` (linear
sibling), `ln-stepper`, `ln-data-table`'s display layer. Each owns a
small piece of DOM that derives entirely from external attributes;
none of them holds independent state worth exposing. The component
*could* expose `setValue(n)` as sugar — it does not, deliberately.
Adding the imperative API would create two ways to mutate state,
and consumers would inconsistently use one or the other; keeping
the attribute as the only entry point keeps the contract clean.

### Why not native `<progress>`?

Native `<progress>` would be cheaper if it shaped to a ring. It does
not. The native element renders as a horizontal bar across every
mainstream browser, and the platform offers no hook to reshape the
geometry — there is no `<progress shape="circle">`, no shadow-DOM
slot for the fill, and the browser-internal pseudo-elements
(`::-webkit-progress-bar`, `::-moz-progress-bar`) are inconsistent
across engines and cannot reshape the rendered geometry either.
Building a ring on top of `<progress>` ends up replacing the entire
visual with an absolutely-positioned overlay that ignores the native
element underneath, at which point the native semantics are not
buying anything.

The project's choice is the inverse: render the ring with two SVG
circles — full geometric control, identical across browsers,
animatable with CSS transitions on `stroke-dashoffset`, themeable
through CSS variables — and accept that the host `<div>` does NOT
inherit `<progress>`'s implicit ARIA. If you need screen-reader
semantics for the value, you add `role="progressbar"` plus
`aria-valuenow` / `aria-valuemin` / `aria-valuemax` to the host
element yourself. The component does not write those attributes (see
"What `ln-circular-progress` does NOT do" item 6).

### Why MutationObserver instead of a Proxy or method API?

The component has exactly one piece of mutable state — the rendered
arc — and that state derives from two attributes. A Proxy would add
a JS-side reflection of attribute values, which then need a sync
direction (attribute → proxy or proxy → attribute) and a tie-breaker
when both change. Skipping the Proxy and re-reading attributes inside
`_render` keeps the DOM as the single source of truth: whatever the
attribute says right now, that's what the ring shows. Set the
attribute → ring updates. Read the attribute → that's the value. No
drift, no synchronisation bug, no method-vs-attribute schism.

The MutationObserver registered in `_listenValues` filters strictly
to two attributes — `data-ln-circular-progress` and
`data-ln-circular-progress-max` (lines 102 of the source). Other
attribute changes on the host (class flips, ID changes, ARIA writes)
do NOT trigger a re-render, which is correct: the visual derivation
genuinely depends on those two values plus the optional label.

`data-ln-circular-progress-label` is **not** in the
`attributeFilter`. Mutating it after construction does NOT trigger a
re-render on its own. The label only updates when the value or max
also changes (see "Common mistakes" item 4).

### What `ln-circular-progress` does NOT do

- **Does NOT animate value transitions in JS.** The CSS rule
  `transition: stroke-dashoffset var(--transition-base)` (in
  `@mixin circular-progress`, gated behind `@include motion-safe`)
  is what animates the arc when `stroke-dashoffset` changes. JS
  writes the new offset synchronously; the visual transition is
  pure CSS. Reduced-motion users see an instant snap to the new
  value.
- **Does NOT have an indeterminate mode.** There is no spinning
  state for "value unknown." Setting `data-ln-circular-progress=""`
  or omitting the value renders **0%** (because
  `parseFloat('') = NaN → || 0`). The fill is the empty track.
  If you need a spinner-style indeterminate indicator, use
  `@mixin loader` (`scss/config/mixins/_loader.scss`) or another
  primitive — they are different visual idioms, not modes of the
  same component.
- **Does NOT interpolate fractional values to integer-only.** The
  arc length is computed from the raw `parseFloat` value;
  `value="42.7"` produces an offset for 42.7%. The percentage label
  IS rounded (`Math.round(percentage) + '%'`), so the visible label
  shows `43%` while the ring sits at the precise 42.7% angle. The
  rounding is label-only, not arc-only — see "Common mistakes" item
  3.
- **Does NOT clamp the input attribute itself.** It clamps the
  *computed percentage* between 0 and 100 before writing the offset
  (lines 113–114). The attribute can hold any number; values below 0
  render as 0%, values above max render as 100%, and the attribute
  itself is left as-written. Reading `el.getAttribute('data-ln-circular-progress')`
  after writing `'150'` returns `'150'`, not `'100'`.
- **Does NOT detect `null` / `undefined` differently from
  invalid strings.** Anything `parseFloat` cannot parse becomes 0.
  `data-ln-circular-progress="abc"` → 0%.
  `data-ln-circular-progress=""` → 0%. No warning, no console output.
- **Does NOT write ARIA attributes.** The component sets
  `aria-hidden="true"` on the SVG (so screen readers skip it) and
  writes nothing else accessibility-related. The host element does
  not get `role="progressbar"`, `aria-valuenow`, `aria-valuemin`, or
  `aria-valuemax`. If those matter for your audience, add them
  yourself in markup or via project JS — the rebuilt label inside
  `<strong class="ln-circular-progress__label">` carries the visual
  text but has no ARIA wiring back to the host.
- **Does NOT inherit max from a parent element.** Unlike `ln-progress`,
  which checks the parent for `data-ln-progress-max` so stacked bars
  can share a denominator, `ln-circular-progress` reads max only
  from the host's own attribute. There is no shared-max mode for
  multiple circular indicators.
- **Does NOT update the label when only
  `data-ln-circular-progress-label` changes.** The MutationObserver
  filter is `['data-ln-circular-progress', 'data-ln-circular-progress-max']`
  (line 102) — the label attribute is NOT watched. Changing the
  label without also bumping the value or max leaves the previous
  label text on screen. See "Common mistakes" item 4.
- **Does NOT dispatch a `:destroyed` event.** Calling `destroy()`
  removes the SVG and label silently. There is no notification.
- **Does NOT debounce rapid-fire value changes.** Every attribute
  write triggers a synchronous `_render` call. For
  upload-progress flows that fire 100+ times a second, that's 100+
  attribute writes per second; the CSS transition smooths the
  visual but the MutationObserver overhead is real. See "Common
  mistakes" item 5.

### Cross-component coordination

| Component | What it does | Verified at |
|---|---|---|
| `ln-progress` (linear sibling) | Independent component with the same `:change` event shape (`{ target, value, max, percentage }`). Different attribute (`data-ln-progress`), different SCSS mixin, no shared code. They are sibling implementations of the same idea in different geometries. | `js/ln-progress/ln-progress.js:120-134`, `js/ln-circular-progress/ln-circular-progress.js:108-128` |
| `ln-upload` | Composes its own raw `<div class="ln-upload__progress-bar">` with manual `style.width` writes. Does NOT use `ln-circular-progress` or `ln-progress`. The upload component predates the progress components and was not refactored to consume them. If your project wants a circular indicator inside an upload list item, swap `.ln-upload__progress` for a `<div data-ln-circular-progress>` in markup and update `xhr.upload.progress` to call `setAttribute('data-ln-circular-progress', percent)` instead of `style.width`. | `js/ln-upload/ln-upload.js:19,137,149-152,198` |
| `ln-form` | No coordination. ln-form does not own progress UI; submit-state feedback comes from `aria-busy` on the form and the disabled state of the submit button. If a long-running form needs a progress ring, drive it from the consumer's `xhr.upload.progress` listener directly, the same way upload-progress works for `ln-upload`. | grepped — no cross-references |
| Theme palettes (Glass, etc.) | `@mixin circular-progress` reads `--color-accent` for the fill stroke and `--color-border` for the track; both rebind through theme `:root` automatically. The fill colour shifts cleanly under any theme that rebinds the accent vocabulary. | `scss/config/mixins/_circular-progress.scss:27,32` |

The asymmetry with `ln-upload` is worth flagging: it is a real
documentation gap, not a feature. If a consumer composes a circular
progress with an upload, they wire it manually. There is no
`data-ln-upload-progress="circular"` switch.

## Markup anatomy

The minimum invocation is one attribute on a host element:

```html
<div data-ln-circular-progress="75"></div>
```

That's it. The constructor builds the SVG (track + fill circles) and
the `<strong class="ln-circular-progress__label">` element, appends
both inside the host, runs `_render` to compute the initial arc, and
attaches the MutationObserver. The host's children are NOT cleared
first — the SVG and label are *appended*, so any pre-existing
content stays put. That is usually a bug for the consumer (see
"Common mistakes" item 2); use an empty host element.

### Constructed DOM shape

After init, the host looks like:

```html
<div data-ln-circular-progress="75"
     data-ln-circular-progress-initialized=""
     class="success">
    <svg viewBox="0 0 36 36" aria-hidden="true">
        <circle cx="18" cy="18" r="16" fill="none" stroke-width="3"
                class="ln-circular-progress__track"></circle>
        <circle cx="18" cy="18" r="16" fill="none" stroke-width="3"
                stroke-linecap="round"
                stroke-dasharray="100.53"
                stroke-dashoffset="25.13"
                transform="rotate(-90 18 18)"
                class="ln-circular-progress__fill"></circle>
    </svg>
    <strong class="ln-circular-progress__label">75%</strong>
</div>
```

Three numbers worth knowing: viewBox `36×36`, radius `16`,
circumference `2·π·16 ≈ 100.53`. Those are constants in the source
(`VIEW_SIZE`, `RADIUS`, `CIRCUMFERENCE`, lines 10–12) and are NOT
configurable per instance. Size variants (`.sm`, `.lg`, `.xl`) scale
the SVG via CSS — the `viewBox` stays at 36 and the SVG element
fills the host's pixel dimensions (`@include size(100%)` on the
`<svg>`).

The `transform="rotate(-90 ...)"` on the fill circle is what makes
the arc start at 12 o'clock instead of 3 o'clock — a pure SVG
default offset, not state. Without it, the ring would draw clockwise
from the right side, which reads as wrong because Western progress
indicators visually start at the top.

### What state lives where

| Concern | Lives on | Owned by |
|---|---|---|
| Should this element be a circular progress? | `data-ln-circular-progress` (presence) | author (markup) |
| Current value | `data-ln-circular-progress` (value) | author / consumer JS |
| Maximum value | `data-ln-circular-progress-max` (default 100) | author |
| Custom label text | `data-ln-circular-progress-label` (overrides percentage) | author / consumer JS |
| Colour variant | `class="success"` / `.error` / `.warning` on the host | author |
| Size variant | `class="sm"` / `.lg` / `.xl` on the host | author |
| Initialized? | `data-ln-circular-progress-initialized=""` on the host (auto) | ln-circular-progress |
| Constructed SVG and label | Children of the host (auto) | ln-circular-progress |
| Computed arc offset | `stroke-dashoffset` on `.ln-circular-progress__fill` (auto) | ln-circular-progress |

`data-ln-circular-progress-initialized` is internal but visible in
DOM Inspector. It is set by the constructor (line 24) and removed by
`destroy()`. Don't read it from project code; read `el.lnCircularProgress`
instead. The marker exists because the constructor is invoked once
per element and writes the SVG / label children — without the
guard, a re-init would append a second SVG and a second label inside
the host. (Note: `registerComponent` already short-circuits via
`el.lnCircularProgress`, so the marker is belt-and-suspenders, the
same shape as `data-ln-search-initialized`.)

## States & visual feedback

There is one rendered state, parameterised by value, max, label,
colour, and size. Transitions are driven by attribute writes. The
SCSS `transition: stroke-dashoffset var(--transition-base)` (gated
through `@include motion-safe`) handles the visual sweep between
offsets — JS does not animate; it writes the target offset and the
browser interpolates.

| Trigger | What JS does | What the user sees |
|---|---|---|
| Constructor runs | Builds SVG (track + fill circles), creates `<strong>` label, appends both inside host, computes initial offset from current value/max, writes the offset, fires `ln-circular-progress:change`, sets `data-ln-circular-progress-initialized=""` | Ring renders immediately at the correct angle; label shows percentage or custom text |
| `data-ln-circular-progress` attribute changes | MutationObserver fires; `_render` re-reads value, max, label; recomputes percentage (clamped 0–100); writes new `stroke-dashoffset`; updates label `textContent`; dispatches `ln-circular-progress:change` | Arc animates from old offset to new (CSS transition); label snaps to new text — `textContent` is not transitioned |
| `data-ln-circular-progress-max` attribute changes | Same as above — MutationObserver covers both attributes | Arc redraws to the new percentage; the value is unchanged but the denominator shifted, so the visible angle is different |
| `data-ln-circular-progress-label` attribute changes | Nothing — the observer does NOT watch this attribute | No visible change. The label keeps its previous text. See "Common mistakes" item 4. |
| Reduced-motion preference is set | CSS `@include motion-safe` skip the transition | Arc snaps to the new offset instantly |
| `destroy()` called | Disconnects MutationObserver; removes the SVG element from the host; removes the label element; removes `data-ln-circular-progress-initialized`; deletes `el.lnCircularProgress` | Host element becomes empty (any pre-existing content placed there before init is also gone — destroy uses `.remove()` only on the constructed children). The `data-ln-circular-progress` attribute itself is NOT removed. |

The `:change` event fires on **every** render — including the
initial render at construction. A listener attached to `document`
sees a `:change` for every circular progress on the page during
`DOMContentLoaded`. This is correct behaviour (the listener wants to
know about the initial value), but if you only want subsequent
updates, gate the listener on `e.detail.value !== 0` or attach it
*after* the components have constructed.

## Attributes

| Attribute | On | Description | Why this attribute |
|---|---|---|---|
| `data-ln-circular-progress="N"` | host element | Current value. Number; can be negative or above max — the rendered percentage clamps to 0–100. | Presence creates the instance and is the primary observed attribute. The value is read fresh on every `_render` call (line 109), so writes propagate immediately. Empty / non-numeric values render as 0%. |
| `data-ln-circular-progress-max="N"` | host element | Maximum value. Default `100`. Used as denominator in `(value / max) * 100`. | Read fresh on every `_render`, just like value. Setting `max="0"` collapses the denominator and the percentage is forced to 0% — this is intentional (avoids divide-by-zero and renders an empty ring rather than `Infinity` / `NaN`). |
| `data-ln-circular-progress-label="text"` | host element | Custom centre label, replaces the auto-computed percentage. | Read fresh on every `_render`, BUT the observer does NOT fire when *only* this attribute changes (it is not in the `attributeFilter`). The label updates the next time value or max changes. Set the label *with* a value write to update both atomically. |
| `data-ln-circular-progress-initialized=""` | host element (auto) | Set by constructor; removed by `destroy()`. | Internal marker. Don't read from project code. |
| `class="success" / .error / .warning` | host element | Colour variant. Overrides the fill stroke via `scss/components/_circular-progress.scss` (`stroke: hsl(var(--color-success))` etc.). | Plain CSS, no JS involvement. The component does not read or write classes. |
| `class="sm" / .lg / .xl` | host element | Size variant. The default is 4rem; `.sm` is 2.5rem, `.lg` is 6rem, `.xl` is 8rem. Each size variant also rebinds the label font-size. | Plain CSS via `@mixin circular-progress-sm` / `-lg` / `-xl`. |

The component does not write to `aria-valuenow`, `aria-valuemin`,
`aria-valuemax`, or `role="progressbar"`. If you want a screen
reader to announce the value, you add those attributes manually:

```html
<div data-ln-circular-progress="75"
     role="progressbar"
     aria-valuenow="75"
     aria-valuemin="0"
     aria-valuemax="100"
     aria-label="Upload progress"
     class="success">
</div>
```

You also have to keep `aria-valuenow` in sync when you write
`data-ln-circular-progress`. The component will not do that for you.
A simple helper:

```js
function setProgress(el, value) {
    el.setAttribute('data-ln-circular-progress', value);
    el.setAttribute('aria-valuenow', value);
}
```

This is a deliberate split: the visual is the component's job, the
accessibility tree is the consumer's. The reasoning is that consumers
often have richer a11y semantics than `aria-valuenow` alone — a
labelled region with a live region announcer, a `<output>` with a
text description, etc. — and writing default ARIA inside the
component would force consumers to override it.

## Events

One event is dispatched. Bubbles, not cancelable.

| Event | Bubbles | Cancelable | `detail` | Dispatched on | Dispatched when |
|---|---|---|---|---|---|
| `ln-circular-progress:change` | yes | no | `{ target: HTMLElement, value: number, max: number, percentage: number }` | The host element | On every `_render` call: at construction, on every value or max attribute change |

`detail.value` is the raw `parseFloat` of the value attribute —
unclamped. `detail.max` is the parsed max (or 100 if missing).
`detail.percentage` is the clamped 0–100 percentage. So a consumer
that wants to know "did the user write a value above max?" reads
`detail.value > detail.max`; a consumer that wants the visible
percentage reads `detail.percentage`.

`detail.target` is the host element — a back-reference convenient
when a single document-level listener handles multiple progress
indicators:

```js
document.addEventListener('ln-circular-progress:change', function (e) {
    const { target, percentage } = e.detail;
    if (percentage >= 100 && !target.classList.contains('done')) {
        target.classList.add('done');
        // play a one-time sound, fire analytics, etc.
    }
});
```

The event fires once per attribute write. If a consumer writes
`data-ln-circular-progress="50"` then immediately
`data-ln-circular-progress="75"` in the same JS tick, the
MutationObserver fires twice and `_render` runs twice — two `:change`
events. The CSS transition smooths the visual to a single sweep, but
the event count is per-write.

There is no `:initialized` event and no `:destroyed` event. The
initial render's `:change` is the closest thing to an init signal.

## API (component instance)

`window.lnCircularProgress(root)` re-runs the init scan over `root`.
The shared `MutationObserver` registered by `registerComponent`
already covers AJAX inserts and `data-ln-circular-progress`
attribute additions; call this manually only when you inject markup
into a Shadow DOM root or another document context the observer
cannot see.

`el.lnCircularProgress` on a DOM element exposes:

| Property | Type | Description |
|---|---|---|
| `dom` | `HTMLElement` | Back-reference to the host element |
| `svg` | `SVGSVGElement` | The constructed `<svg>` element. `null` between construction and the first `_buildSvg` call (effectively never, since `_buildSvg` is the first thing the constructor runs) |
| `trackCircle` | `SVGCircleElement` | The grey/border-coloured background circle |
| `progressCircle` | `SVGCircleElement` | The fill circle whose `stroke-dashoffset` carries the progress |
| `labelEl` | `HTMLElement` | The `<strong>` element holding the percentage or custom text |
| `_attrObserver` | `MutationObserver` | The instance's own attribute observer (separate from the `registerComponent` observer). Watches the host for value / max changes. |
| `destroy()` | method | Disconnects the attribute observer, removes the SVG, removes the label, removes `data-ln-circular-progress-initialized`, deletes `el.lnCircularProgress`. Does NOT remove `data-ln-circular-progress` itself or any colour / size class. |

There is no `setValue(n)`, `setMax(n)`, `update()`, or `redraw()`
method. The component shape is "the attribute IS the API." A
programmatic update is `el.setAttribute('data-ln-circular-progress', n)`,
exactly the same as a server-side render that writes the attribute
into the markup. Adding an imperative setter would create a second
mutation channel that the MutationObserver would also see (the
attribute write would still fire), without removing the need to also
write the attribute for screen readers / DOM Inspector / serialization.

If you need a pure-JS update path that bypasses the attribute write
(say, for a 60fps animation), call `_render` directly via the
internals — but the canonical path is the attribute, and the CSS
transition makes 60fps redundant for the typical 0→100 sweep:

```js
// canonical path — preferred
el.setAttribute('data-ln-circular-progress', 75);

// internals path — bypasses MutationObserver, doesn't fire :change
el.lnCircularProgress.dom.setAttribute(...) // same as above
```

There is no documented way to call `_render` from outside; it is a
module-private function. If you need to force a re-render without
changing the value, write the same value back:
`el.setAttribute('data-ln-circular-progress', el.getAttribute('data-ln-circular-progress'))`.
The MutationObserver fires on value-change OR re-set; the observer
does not de-duplicate identical writes.

## Examples

### Minimal — fixed value

```html
<div data-ln-circular-progress="75" class="success"></div>
```

The simplest case. 75% green ring, "75%" label in the centre, 4rem
square. No JS on the consumer side.

### Reactive — change value at runtime

```html
<div id="upload-ring" data-ln-circular-progress="0" class="lg"></div>
<button id="advance">Advance</button>
```

```js
let pct = 0;
document.getElementById('advance').addEventListener('click', function () {
    pct = Math.min(100, pct + 10);
    document.getElementById('upload-ring').setAttribute('data-ln-circular-progress', pct);
});
```

Each attribute write triggers a re-render and a `:change` event. The
CSS transition smoothly animates from the previous arc to the new
one over `var(--transition-base)`.

### Custom max — non-percentage scale

```html
<!-- 7 out of 10 — ring fills to 70% but the label shows the raw count -->
<div data-ln-circular-progress="7"
     data-ln-circular-progress-max="10"
     data-ln-circular-progress-label="7/10"
     class="lg success">
</div>
```

Two things working together: `max="10"` shifts the denominator so 7
maps to 70% of the arc, and `label="7/10"` overrides the percentage
text. Without the label override, the centre would read "70%" — the
ratio, not the count. With the override, "7/10" is shown literally.

If only one of those two attributes is present:

- `max="10"` alone → arc fills to 70%, label shows "70%".
- `label="7/10"` alone (no max) → arc fills to 7% of 100, label
  shows "7/10". The arc is wrong because max defaulted to 100.

Both attributes are usually set together for non-percentage scales.

### Custom label — non-numeric

```html
<div data-ln-circular-progress="85"
     data-ln-circular-progress-label="A+"
     class="lg success">
</div>
```

Any string works as a label — the component writes it via
`textContent`, no parsing. Use this for grades, status text, short
phrases, single icons (Unicode characters work; SVG `<use>` does not
because the label is a `<strong>` element, not an `<svg>`).

### Upload progress — driving from XHR

```html
<form id="upload-form">
    <input type="file" name="file">
    <div id="upload-ring"
         data-ln-circular-progress="0"
         class="lg"
         role="progressbar"
         aria-valuenow="0"
         aria-valuemin="0"
         aria-valuemax="100"
         aria-label="Upload progress">
    </div>
    <button type="submit">Upload</button>
</form>
```

```js
document.getElementById('upload-form').addEventListener('submit', function (e) {
    e.preventDefault();
    const ring = document.getElementById('upload-ring');
    const file = e.target.querySelector('input[type=file]').files[0];
    if (!file) return;

    const xhr = new XMLHttpRequest();
    const fd = new FormData(e.target);

    xhr.upload.addEventListener('progress', function (ev) {
        if (!ev.lengthComputable) return;
        const pct = Math.round((ev.loaded / ev.total) * 100);
        ring.setAttribute('data-ln-circular-progress', pct);
        ring.setAttribute('aria-valuenow', pct);
    });

    xhr.upload.addEventListener('load', function () {
        ring.setAttribute('data-ln-circular-progress', 100);
        ring.setAttribute('aria-valuenow', 100);
    });

    xhr.open('POST', '/upload');
    xhr.send(fd);
});
```

Two things to notice. (1) The ARIA attributes are kept in sync
manually because the component does not write them. (2) The
`progress` event fires often during a large upload — every 16ms or
so on a fast connection. Each call rewrites the attribute, the
MutationObserver fires, `_render` runs, and the `:change` event
dispatches. For most cases that's fine; if profiling shows it as a
hot spot, throttle the JS-side write to every 100ms. See "Common
mistakes" item 5.

### Threshold-based colour — no built-in thresholds

The component has no automatic threshold colours. `class="success"`
/ `.error` / `.warning` are static — JS does not flip them based on
value. If you want red below 30% and green above 70%, that's
consumer code:

```js
function setProgressWithThreshold(el, value) {
    el.setAttribute('data-ln-circular-progress', value);
    el.classList.remove('success', 'warning', 'error');
    if (value < 30) el.classList.add('error');
    else if (value < 70) el.classList.add('warning');
    else el.classList.add('success');
}
```

The colour-class swap is a `classList` write — no MutationObserver
fires for it (the component watches `data-ln-circular-progress` and
`-max`, not `class`). The new colour applies via plain CSS rules in
`scss/components/_circular-progress.scss`.

### Multiple rings sharing a max — no built-in support

`ln-circular-progress` does NOT inherit `data-ln-circular-progress-max`
from a parent (unlike `ln-progress`'s parent-track behaviour). If
you want three rings sharing a denominator of 200, set max on each:

```html
<ul class="ring-row">
    <li><div data-ln-circular-progress="50"  data-ln-circular-progress-max="200" class="success"></div></li>
    <li><div data-ln-circular-progress="120" data-ln-circular-progress-max="200" class="warning"></div></li>
    <li><div data-ln-circular-progress="180" data-ln-circular-progress-max="200" class="error"></div></li>
</ul>
```

Repeating the max attribute is the canonical shape. If the max
genuinely needs to be project-wide configurable, write it
server-side or hold it in a JS variable and stamp the attribute on
each ring at render time.

### Theme — accent colour shifts via tokens

Under the default theme, the fill stroke reads `var(--color-accent)`
(which resolves to the project's primary). Under Glass theme, the
accent vocabulary is rebound at theme `:root` and every ring picks
up the new colour automatically — no per-component CSS, no class
swap, no JS:

```html
<div data-theme="glass">
    <div data-ln-circular-progress="60" class="lg"></div>
</div>
```

The success / error / warning class variants override the fill
stroke directly (`stroke: hsl(var(--color-success))`), bypassing the
accent variable. Those colours come from the success / error /
warning vocabulary, which themes also rebind, so the variants
follow the theme too.

## Common mistakes

### Mistake 1 — Expecting an indeterminate / spinning state

```html
<!-- WRONG — empty value renders 0%, not a spinner -->
<div data-ln-circular-progress="" class="lg"></div>
```

Renders an empty ring (track only, fill at 0%). There is no
animation, no spinner, no "loading…" mode. The component IS the
ring; if you want a spinner, use a different component:

```html
<!-- Loader for indeterminate operations -->
<div class="ln-loader"></div>

<!-- Or, more visually similar: a CSS animation on a circular progress
     pretending to be indeterminate. NOT a built-in mode — you'd
     write the keyframes yourself. -->
```

The two idioms are visually distinct: a ring with a known fraction
filled vs a ring rotating endlessly. They communicate different
things ("X out of Y done" vs "an unbounded operation is in
progress"). Conflating them in one component would force a
configuration switch and would not actually save a CSS rule.

### Mistake 2 — Pre-existing content inside the host

```html
<!-- WRONG — the constructor appends SVG + label after the existing text -->
<div data-ln-circular-progress="50">
    Loading...
</div>
```

After init, the host contains: `Loading...` + the SVG + the
`<strong>` label. The visual is messy and the "Loading..." text
overlaps the ring. The constructor does NOT clear the host's
children before appending — it uses `appendChild` directly (lines
85–86).

The right shape: keep the host empty, place any descriptive text
elsewhere.

```html
<!-- RIGHT — empty host, label sits on a sibling -->
<figure>
    <div data-ln-circular-progress="50" class="lg"
         role="progressbar" aria-valuenow="50" aria-valuemin="0" aria-valuemax="100"
         aria-labelledby="ring-caption">
    </div>
    <figcaption id="ring-caption">Loading...</figcaption>
</figure>
```

The ARIA `aria-labelledby` ties the figcaption to the ring for
screen readers. The visual `Loading...` is sibling, not nested.

### Mistake 3 — Decimal value, integer label, expecting them to match

```html
<div data-ln-circular-progress="42.7"></div>
```

Visible label: **"43%"** (Math.round). Visible arc: drawn at
exactly 42.7% — slightly less than the 43° angle the label suggests.
On a 4rem ring the difference is one pixel; on the .xl size it can
be visible.

If pixel-accurate label-to-arc match matters:

```js
// Round the value before writing — both label and arc snap together
el.setAttribute('data-ln-circular-progress', Math.round(value));
```

Or write a custom label that mirrors the rounding:

```js
const rounded = Math.round(value);
el.setAttribute('data-ln-circular-progress', value);   // unrounded for arc
el.setAttribute('data-ln-circular-progress-label', rounded + '%');
```

The label-only rounding is intentional — visual-noise reduction —
but it does mean the rendered shape and the rendered text disagree
by up to 0.5%.

### Mistake 4 — Updating only the label expecting a re-render

```js
// WRONG — observer does not watch the label attribute
el.setAttribute('data-ln-circular-progress-label', '8/10');
// → label text on screen does not update until the next value/max write
```

The MutationObserver's `attributeFilter` is exactly two attributes
(line 102). The label attribute is read inside `_render` but is
NOT a trigger for `_render`. Three resolutions:

```js
// Option A: write label and value together — value-write triggers re-render
el.setAttribute('data-ln-circular-progress-label', '8/10');
el.setAttribute('data-ln-circular-progress', el.getAttribute('data-ln-circular-progress'));
// (rewriting the same value still fires the observer)

// Option B: write label first, then bump value to itself
el.setAttribute('data-ln-circular-progress-label', '8/10');
el.setAttribute('data-ln-circular-progress', 8);

// Option C: avoid label-only changes — author markup with the final
// label and only write the label attribute alongside value updates
```

Option A is the canonical path. The reason the observer doesn't
watch the label is that label is a *display concern*; values and
max are *state*. Adding the label to the filter would re-render the
arc on every label change, which is wasted work for the common case
(label is a static "X/Y" string set once at render).

### Mistake 5 — Firing 60+ writes per second from a tight loop

```js
// PROBLEMATIC — every requestAnimationFrame fires a MutationObserver
let pct = 0;
function tick() {
    pct = Math.min(100, pct + 1);
    el.setAttribute('data-ln-circular-progress', pct);
    if (pct < 100) requestAnimationFrame(tick);
}
tick();
```

Each `setAttribute` call fires the MutationObserver, runs `_render`,
writes a new `stroke-dashoffset`, dispatches `:change`. At 60fps
that's 60 events per second per ring, 60 layout invalidations, 60
console-event-trace entries (if a listener is attached at document
level).

The CSS transition makes this animation pointless anyway: setting
the value to 100 once and letting CSS animate from 0 to 100 over
`var(--transition-base)` produces a smoother visual with one
mutation:

```js
// BETTER — one write, CSS handles the sweep
el.setAttribute('data-ln-circular-progress', 100);
```

If you genuinely need stepwise animation (counter-up effect with the
label updating per step), throttle the writes:

```js
let pct = 0;
const INTERVAL = 100;  // ms between updates — 10 writes/sec, smooth enough for a counter
const interval = setInterval(function () {
    pct = Math.min(100, pct + 5);
    el.setAttribute('data-ln-circular-progress', pct);
    if (pct >= 100) clearInterval(interval);
}, INTERVAL);
```

### Mistake 6 — Writing values above max and expecting the attribute to clamp

```js
el.setAttribute('data-ln-circular-progress', 150);
console.log(el.getAttribute('data-ln-circular-progress'));   // "150", not "100"
```

The component clamps the *rendered percentage* between 0 and 100
(lines 113–114). The attribute itself is never rewritten. If a
listener reads `e.detail.value` it sees `150`; if it reads
`e.detail.percentage` it sees `100`. The ring is fully drawn (100%
arc).

This is usually fine for upload progress (transient overshoot from
a stale event), and harmless for grades capped at 100. If your
business logic needs the attribute itself to be clamped, do it
before writing:

```js
const clamped = Math.max(0, Math.min(100, raw));
el.setAttribute('data-ln-circular-progress', clamped);
```

### Mistake 7 — Calling `destroy()` and then trying to re-init the same element

```js
el.lnCircularProgress.destroy();
el.setAttribute('data-ln-circular-progress', 75);   // not enough — the SVG is gone
```

`destroy()` removes the SVG and label children, removes the
`-initialized` marker, deletes `el.lnCircularProgress`. The
attribute itself is left in place. Setting a new value fires the
MutationObserver in `registerComponent`, which sees the existing
attribute and instantiates a new component on the element — that
re-runs the constructor, rebuilds the SVG, attaches a fresh
attribute observer.

So actually, the above DOES re-init. The `setAttribute` call is the
trigger. If you want to just remove the component without
re-initing, also remove the attribute:

```js
el.lnCircularProgress.destroy();
el.removeAttribute('data-ln-circular-progress');
```

That leaves the host element empty and bare. Subsequent attribute
writes will rebuild the component, because that's what
`registerComponent`'s observer is for.

## Custom variants — two valid paths

The shipped `.success` / `.warning` / `.error` classes override
`stroke` directly on the fill circle (visible in
`scss/components/_circular-progress.scss`). That's one valid path.
For a custom variant there are two, depending on whether you want
the colour to adapt under themes (Glass, Dark) or stay absolute.

```scss
/* Path 1 — token cascade (theme-aware). Override --color-primary
   on the host. The mixin reads --color-accent, which is wired at
   :root to hsl(var(--color-primary)) — the cascade re-resolves at
   the fill's read site. */
[data-ln-circular-progress].my-variant {
    --color-primary: var(--color-error);
}

/* Path 2 — direct stroke override (absolute). Bypass the token
   cascade. The shipped status variants use this pattern. */
[data-ln-circular-progress].my-variant .ln-circular-progress__fill {
    stroke: hsl(var(--color-error));
}
```

Path 1 is right when the variant should follow the theme. Path 2
is right when the colour is semantically absolute (a "success"
ring should be green even if the theme accent is purple).

## Related

- **`@mixin circular-progress`** (`scss/config/mixins/_circular-progress.scss`)
  — the recipe. Defines the SVG layout (relative-positioned host,
  label absolutely centred), the fill stroke colour
  (`var(--color-accent)`), the track stroke colour
  (`var(--color-border)`), the `motion-safe` transition on
  `stroke-dashoffset`. Composed by the size variant mixins
  (`-sm`, `-lg`, `-xl`).
- **`scss/components/_circular-progress.scss`** — applies the mixin
  to `[data-ln-circular-progress]` and applies the size and colour
  variants. The colour variants override `stroke` directly on the
  fill circle; the size variants compose the size mixin.
- **[`ln-progress`](../ln-progress/README.md)** — the linear
  sibling. Same contract shape (`data-ln-progress` + `-max`),
  different geometry (a `<div>` whose `width` is a percentage).
  Sibling, not parent — ln-circular-progress does not extend
  ln-progress; they are independent. ln-progress additionally
  supports parent-track shared max, which ln-circular-progress
  does NOT — see "Cross-component coordination."
- **[`ln-upload`](../ln-upload/README.md)** — the canonical place
  you might want to compose with a circular progress, but the upload
  component currently uses a hand-rolled inline progress bar. If
  your project wants a circular indicator inside an upload list
  item, swap the `.ln-upload__progress-bar` markup for a
  `<div data-ln-circular-progress>` and replace the
  `progressBar.style.width = percent + '%'` write with
  `el.setAttribute('data-ln-circular-progress', percent)`. See
  `js/ln-upload/ln-upload.js:149-152`.
- **`@mixin loader`** (`scss/config/mixins/_loader.scss`) — the
  indeterminate spinner. Use this when the operation has no known
  fraction; use `ln-circular-progress` when it does.
- **Architecture deep-dive:** [`docs/js/circular-progress.md`](../../docs/js/circular-progress.md)
  for the SVG geometry constants, the MutationObserver filter, and
  the render flow.
- **Cross-component principles:** [`docs/architecture/data-flow.md`](../../docs/architecture/data-flow.md)
  — `ln-circular-progress` is a passive renderer. It does not own
  data, transport, or state — it derives its visual from one
  attribute and announces every change through a single
  notification event.

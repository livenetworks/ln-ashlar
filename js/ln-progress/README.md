# ln-progress

> A passive linear-progress renderer. Author writes
> `data-ln-progress="42"` on a bar element; the component picks up the
> change via MutationObserver and writes the new `width` as a
> percentage. 145 lines of JS.

## Philosophy

A linear progress indicator is mechanically a track `<div>` wrapping
one or more child bar `<div>`s whose `width` is a percentage of the
track. The maths is `width = (value / max) * 100%`. What `ln-progress`
adds is the reactive plumbing: when the width gets recomputed, what
triggers a re-render, where the maximum comes from when multiple bars
share a denominator, and what survives a `destroy()` call.

The contract is simple: **the attribute IS the state**. There is no
`element.setValue(42)` API and no imperative entry point. You set
`data-ln-progress="42"` on a bar; the MutationObserver sees the
change; `_render` runs; the bar redraws. State is visible in DOM
Inspector at all times, can be set declaratively from server templates,
and survives `outerHTML` round-trips.

The component supports stacked bars sharing one denominator: declare
`data-ln-progress-max` on the parent track and every child bar reads
that as its max. This is what makes "4 done + 2 in progress + 1
pending = 7 total" render as three bars filling exactly one track.

## Quick start

```html
<div class="progress">
    <div data-ln-progress="75" class="success"></div>
</div>
```

A green bar at 75% of the track, no JS on the consumer side. The
`class="progress"` on the wrapper marks it as a track (pure CSS hook,
no JS instance is created). The `data-ln-progress="75"` on the child
marks it as a bar (instance is created, `style.width = "75%"` is
written).

## Attributes

| Attribute | On | Description |
|---|---|---|
| `data-ln-progress="N"` | bar element | Current value of the bar. Number; can be negative or above max — the rendered percentage clamps to 0–100. Empty / non-numeric values render as 0%. |
| `data-ln-progress-max="N"` | bar element | Maximum value for this bar. Default `100`. Used as the denominator. Setting `max="0"` collapses to 0%. |
| `data-ln-progress-max="N"` | track element | Shared max for all bar children. Wins over each bar's own max. The track itself uses `class="progress"` for styling — no JS instance is created on it. |
| `class="success"` / `.warning` / `.error` | bar element | Colour variant. Plain CSS, no JS involvement. |

The track is marked with `class="progress"` (pure CSS hook). The bar
is marked with `data-ln-progress="N"` (JS instance).

The component writes `role="progressbar"`, `aria-valuemin="0"`,
`aria-valuemax`, and `aria-valuenow` on **each bar element** on every
render. `aria-valuenow` is clamped to `[0, max]` to match the rendered
bar (so an overshoot value of `150` against `max=100` reports as
`100`). Add `aria-label` on the bar yourself for screen-reader context
— the component does not invent a label.

## Events

One event, bubbles, not cancelable.

| Event | `detail` | Dispatched on | Dispatched when |
|---|---|---|---|
| `ln-progress:change` | `{ target: HTMLElement, value: number, max: number, percentage: number }` | the bar element | every `_render` call: at construction, on every value or max attribute change (bar's own value, bar's own max, or parent track's max if observed) |

`detail.value` is the raw `parseFloat` of the value attribute —
unclamped. `detail.max` is the resolved max (parent's first, then
bar's own, then 100). `detail.percentage` is the clamped 0–100
percentage written to `style.width`.

The event fires once per attribute write. Writing
`data-ln-progress="50"` then `"75"` synchronously fires the event
twice. The CSS transition smooths the visual to a single sweep, but
the event count is per-write.

There is no `:initialized` and no `:destroyed` event. The first
`:change` fires inside `_render` during construction and serves as
the init signal for any consumer listening at the document level.

## API

`window.lnProgress(root)` re-runs the init scan over `root`. The
document-level observer already covers AJAX inserts and
`data-ln-progress` attribute additions; call this manually only when
you inject markup into a Shadow DOM root or another document context
the observer cannot see.

`el.lnProgress` on a bar exposes:

| Property | Type | Description |
|---|---|---|
| `dom` | `HTMLElement` | back-reference to the bar element |
| `_attrObserver` | `MutationObserver` | watches the bar's own `data-ln-progress` and `data-ln-progress-max` |
| `_parentObserver` | `MutationObserver \| null` | watches the parent track's `data-ln-progress-max` if the parent had that attribute at construction; `null` otherwise |
| `destroy()` | method | disconnects both observers, deletes `el.lnProgress`. Does NOT remove `data-ln-progress` itself, the colour class, or the inline `style.width`. |

There is no `setValue(n)`, `setMax(n)`, `update()`, or `redraw()`
method. The attribute is the API. A programmatic update is
`el.setAttribute('data-ln-progress', n)`, exactly the same as a
server-side render that writes the attribute into markup. To force a
re-render without changing the value, write the same value back —
the MutationObserver fires on any write, including identical ones.

## Max priority resolution

`_render` resolves the maximum in this order:

| Priority | Source | Truthy check |
|---|---|---|
| 1 | parent track's `data-ln-progress-max` parsed as float | parses to a finite number > 0 |
| 2 | bar's own `data-ln-progress-max` parsed as float | parses to a finite number > 0 |
| 3 | `100` (default) | always |

The chain is `parentMax || ownMax || 100`. Two consequences:

1. A parent declaring `data-ln-progress-max="0"` falls through to the
   bar's own max, because `0` is falsy in JS. Same for non-numeric
   values like `data-ln-progress-max="abc"` — `NaN` is falsy.
2. An own-max declaration is silently ignored when the parent declares
   one. If a bar carries `data-ln-progress-max="50"` and the parent
   carries `data-ln-progress-max="100"`, the parent wins — the bar
   measures against 100. If you genuinely need per-bar maxes inside a
   shared-max parent, do not declare the parent max; set each bar's
   own max individually and accept that the bars no longer fill the
   track in proportional fashion.

## Examples

### Minimal — fixed value

```html
<div class="progress">
    <div data-ln-progress="75" class="success"></div>
</div>
```

The simplest case. Green bar at 75%, no JS on the consumer side.

### Reactive — change value at runtime

```html
<div id="upload-track" class="progress">
    <div id="upload-bar" data-ln-progress="0" class="success"
         aria-label="Upload progress"></div>
</div>
<button id="advance">Advance</button>
```

```js
let pct = 0;
document.getElementById('advance').addEventListener('click', function () {
    pct = Math.min(100, pct + 10);
    document.getElementById('upload-bar').setAttribute('data-ln-progress', pct);
});
```

Each attribute write triggers a re-render and a `:change` event. The
CSS transition smoothly animates between widths. The component writes
`aria-valuenow` on the bar automatically — no manual sync needed.

### Custom max — non-percentage scale (per-bar)

```html
<!-- 7.5 GB of 10 GB — bar fills 75% of the track -->
<div class="progress">
    <div data-ln-progress="7.5" data-ln-progress-max="10" class="warning"></div>
</div>
```

`max="10"` shifts the denominator so 7.5 maps to 75%. There is no
text label slot inside the bar; place descriptive text as a sibling
element if you need it.

### Stacked — multiple bars, one track, default max=100

```html
<!-- CPU 40% / RAM 30% / Disk 30% — sums to 100% of the track -->
<div class="progress">
    <div data-ln-progress="40" class="success" aria-label="CPU usage"></div>
    <div data-ln-progress="30" class="warning" aria-label="RAM usage"></div>
    <div data-ln-progress="30" class="error"   aria-label="Disk usage"></div>
</div>
```

Each bar uses the default max of 100. Three bars at 40 + 30 + 30 fill
the track exactly. If the values sum to less than 100, the remainder
of the track stays empty (the track's recessed background shows
through). If more than 100, each bar still renders at its clamped
0–100 width and the visuals overflow the track horizontally — the
SCSS `overflow: hidden` clips the overflow so the visual stays clean,
but the maths is wrong.

### Stacked — shared max on the parent track

```html
<!-- 4 done + 2 in progress + 1 pending = 7 total — fills the track exactly -->
<div class="progress" data-ln-progress-max="7">
    <div data-ln-progress="4" class="success" aria-label="Done"></div>
    <div data-ln-progress="2" class="warning" aria-label="In progress"></div>
    <div data-ln-progress="1" class="error"   aria-label="Pending"></div>
</div>
```

The track carries `data-ln-progress-max="7"`. Each child bar's
`_render` reads the parent's max first and uses `7` as the
denominator. Bar widths are 4/7 ≈ 57.1%, 2/7 ≈ 28.6%, 1/7 ≈ 14.3%,
summing to 100%.

Changing the parent's max at runtime
(`track.setAttribute('data-ln-progress-max', '10')`) re-renders each
child via the per-bar `_parentObserver` — but only for bars that
were constructed when the parent already had the attribute. See
"Common mistakes" item 4.

### Upload progress — driving from XHR

```html
<form id="upload-form">
    <input type="file" name="file">
    <div id="upload-track" class="progress">
        <div id="upload-bar" data-ln-progress="0" class="success"
             aria-label="Upload progress"></div>
    </div>
    <button type="submit">Upload</button>
</form>
```

```js
document.getElementById('upload-form').addEventListener('submit', function (e) {
    e.preventDefault();
    const bar = document.getElementById('upload-bar');
    const file = e.target.querySelector('input[type=file]').files[0];
    if (!file) return;

    const xhr = new XMLHttpRequest();
    const fd = new FormData(e.target);

    xhr.upload.addEventListener('progress', function (ev) {
        if (!ev.lengthComputable) return;
        const pct = Math.round((ev.loaded / ev.total) * 100);
        bar.setAttribute('data-ln-progress', pct);
    });

    xhr.upload.addEventListener('load', function () {
        bar.setAttribute('data-ln-progress', 100);
    });

    xhr.open('POST', '/upload');
    xhr.send(fd);
});
```

ARIA on the bar is managed automatically by `ln-progress` —
`aria-valuenow` updates on every attribute write. The `progress`
event fires often during a large upload — every 16ms or so on a fast
connection. Each call rewrites the attribute, the MutationObserver
fires, `_render` runs, and the `:change` event dispatches. If
profiling shows it as a hot spot, throttle the JS-side write to
every 100ms before calling `setAttribute`.

### Threshold-based colour — consumer code

The component has no automatic threshold colours. `class="success"`
/ `.warning` / `.error` are static — JS does not flip them based on
value. If you want red below 30% and green above 70%, that is
consumer code:

```js
function setProgressWithThreshold(bar, value) {
    bar.setAttribute('data-ln-progress', value);
    bar.classList.remove('success', 'warning', 'error');
    if (value < 30) bar.classList.add('error');
    else if (value < 70) bar.classList.add('warning');
    else bar.classList.add('success');
}
```

The colour-class swap is a `classList` write — no MutationObserver
fires for it (the component watches `data-ln-progress` and
`data-ln-progress-max`, not `class`). The new colour applies via plain
CSS rules in `scss/components/_progress.scss`.

## What `ln-progress` does NOT do

- **Does NOT watch the parent for late-added max.** `_listenParent`
  runs once at construction and bails immediately if the parent does
  not currently have `data-ln-progress-max`. If the parent gains the
  max later, the bar will not re-render in response. See "Common
  mistakes" item 4.
- **Does NOT clamp the input attribute.** It clamps the *computed
  percentage* between 0 and 100 before writing the width. The
  attribute can hold any number; reading
  `el.getAttribute('data-ln-progress')` after writing `'150'` returns
  `'150'`, not `'100'`.
- **Does NOT have an indeterminate / striped / pulsing mode.**
  No animated-stripes overlay, no shimmer, no pulse. For an
  indeterminate indicator on an unbounded operation, use
  `@mixin loader` (`scss/config/mixins/_loader.scss`) — different
  visual idiom, separate primitive.
- **Does NOT debounce or throttle rapid-fire value changes.** Every
  attribute write triggers a synchronous `_render` call. For
  high-frequency flows (60+ writes/sec), the consumer is responsible
  for throttling.

## Common mistakes

### 1. Setting `style.width` manually inside the markup

```html
<!-- WRONG — JS overwrites style.width on construction -->
<div class="progress">
    <div data-ln-progress="75" class="success" style="width: 50%"></div>
</div>
```

The constructor's first action is `_render`, which writes
`this.dom.style.width = percentage + '%'`. Whatever inline width you
set in markup is overwritten on the first paint. If you want the bar
to render at a specific width, set the value via `data-ln-progress`,
not `style.width`.

### 2. Mixing percentage values with absolute max

```html
<!-- WRONG — value is "50" interpreted as a count, not 50% -->
<div class="progress">
    <div data-ln-progress="50" data-ln-progress-max="500" class="success"></div>
</div>
```

This renders 50/500 = 10% of the track, probably not what the author
meant. The component does not interpret the value as a percentage; it
treats it as a count against the max. Either write the absolute count
(`250` for "50% of 500") or drop the max and use the default of 100
with the percentage as the value.

### 3. Multiple bars sharing a parent without declaring parent-max

```html
<!-- WRONG — three bars at 4 / 2 / 1, default max=100 each → 7% of track filled -->
<div class="progress">
    <div data-ln-progress="4" class="success"></div>
    <div data-ln-progress="2" class="warning"></div>
    <div data-ln-progress="1" class="error"></div>
</div>
```

If the intent was "4 + 2 + 1 = 7 items, all visible proportionally,"
declare the parent's max:

```html
<!-- RIGHT -->
<div class="progress" data-ln-progress-max="7">
    <div data-ln-progress="4" class="success"></div>
    <div data-ln-progress="2" class="warning"></div>
    <div data-ln-progress="1" class="error"></div>
</div>
```

Each bar reads parent max (`7`) as the denominator, and 4/7 + 2/7 +
1/7 fills the track exactly.

### 4. Setting `data-ln-progress-max` on the parent AFTER construction

```js
// WRONG — bars constructed without parent max, _listenParent never attached
const track = document.getElementById('my-track');
track.setAttribute('data-ln-progress-max', '7');
// → bars do not re-render in response to this write
```

`_listenParent` runs once at construction and bails immediately if
the parent did not declare `data-ln-progress-max` at that moment.
The parent observer is conditional, not lazy. If the parent gains
the attribute later, no per-bar observer exists to catch it.

Three resolutions:

```js
// Option A — declare parent max in markup so it exists at construction
<div class="progress" data-ln-progress-max="7"> ... </div>

// Option B — after setting the parent max, force each bar to re-render by
//            rewriting one of its own observed attributes
track.setAttribute('data-ln-progress-max', '7');
track.querySelectorAll('[data-ln-progress]').forEach(function (bar) {
    bar.setAttribute('data-ln-progress', bar.getAttribute('data-ln-progress'));
    // → bar's own _attrObserver fires → _render re-resolves max from scratch
});

// Option C — destroy and re-init
track.querySelectorAll('[data-ln-progress]').forEach(function (bar) {
    if (bar.lnProgress) bar.lnProgress.destroy();
});
window.lnProgress(track);
```

Option A is canonical. Option B is the right runtime workaround when
the markup was static-with-default-max and you need to switch to
shared-max dynamically.

### 5. Forgetting `class="progress"` on the track wrapper

Without the class, the wrapper has no styling — no recessed
background, no rounded edges, no overflow clip. The bar still
renders correctly but visually escapes its track.

## Related

- **`@mixin progress`** (`scss/config/mixins/_progress.scss`) — the
  recipe. Defines the track height, the recessed background, the
  rounded full radius, the overflow clip, and the inner-bar rules
  (initial `width: 0`, `transition: width var(--transition-base)`
  gated through `motion-safe`, rounded right edge on the last child).
- **`scss/components/_progress.scss`** — applies the base mixin to
  `.progress` and applies the `.success` / `.warning` /
  `.error` colour variants.
- **Architecture deep-dive:** [`docs/js/progress.md`](../../docs/js/progress.md)
  for the construction flow, the three observers, the max-priority
  resolution, and the late-parent-max edge case.

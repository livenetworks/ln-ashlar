# ln-external-links

Auto-decorates every cross-host `<a>` and `<area>` on the page with `target="_blank"`, merged `rel="noopener noreferrer"`, and a screen-reader hint span. Runs on page load and on every DOM mutation; no opt-in attribute, no init call, no API surface for consumers to wire.

For the host-comparison decision table, script-load lifecycle, and architecture rationale, see [`docs/js/external-links.md`](../../docs/js/external-links.md).

## Markup anatomy

There is no markup contract. Every `<a>` and `<area>` on the page
participates by default. The "before" / "after" view tells the whole
story:

```html
<!-- Before (your authored HTML) -->
<a href="https://example.com">Read more</a>

<!-- After (what ln-external-links produces) -->
<a href="https://example.com"
   target="_blank"
   rel="noopener noreferrer"
   data-ln-external-link="processed">
    Read more
    <span class="sr-only">(opens in new tab)</span>
</a>

<!-- Internal links — no change at all -->
<a href="/dashboard">Dashboard</a>
<a href="#section-2">Jump to section</a>
<a href="mailto:hello@livenetworks.mk">Email us</a>
<a href="tel:+38970000000">Call us</a>
```

Four edits happen on each external link, in this order:

1. `target="_blank"` — opens in a new tab.
2. `rel="noopener noreferrer"` — security + privacy.
3. A `<span class="sr-only">(opens in new tab)</span>` is appended
   inside the anchor as the last child. Sighted users see no
   change; assistive tech announces "Read more, opens in new tab"
   when the link receives focus. WCAG 2.4.4 ("Link Purpose")
   recommends this; the component does it for you.
4. `data-ln-external-link="processed"` — the idempotency marker.
   Subsequent processing passes (initial scan, MutationObserver
   re-fire, manual `lnExternalLinks.process()` call) early-return on
   this attribute so the link is never double-decorated.

### What state lives where

| Concern | Lives on | Owned by |
|---|---|---|
| Has this link been processed? | `data-ln-external-link="processed"` on the `<a>` / `<area>` | ln-external-links (writes once, reads on every pass) |
| Should it open in a new tab? | `target="_blank"` on the link | ln-external-links (writes) |
| Security / privacy posture | `rel="noopener noreferrer"` on the link | ln-external-links (writes — merges with prior `rel`) |
| Screen-reader hint | `<span class="sr-only">` appended inside the link | ln-external-links (creates and appends) |
| Click event delivery | `document.body` click delegate | ln-external-links (one listener for the whole page) |
| Decoration of new DOM | `MutationObserver` on `document.body`, `childList: true, subtree: true, attributes: true, attributeFilter: ['href']` | ln-external-links |

## States & visual feedback

There is no visual state. Decoration is invisible to sighted users
(target/rel are non-rendering attributes, the sr-only span is hidden
by the utility class). The "before/after" is purely the four mutations
listed above.

| Trigger | What JS does | What the user sees |
|---|---|---|
| Page load with external links in initial DOM | On `DOMContentLoaded`, `_processLinks()` walks `document.body.querySelectorAll('a, area')` and decorates each external one | Nothing visual. Behavior change: clicks now open in new tab. |
| AJAX inserts a fragment with external links | MutationObserver fires; component decorates new `<a>` / `<area>` nodes (and any nested in inserted subtrees) | Same — invisible decoration. |
| Existing link's `href` changes from internal to external | MutationObserver attribute observer fires; `_processLink` runs on the link | Decoration appears on the next microtask — same flow as DOM insertion. |
| User clicks a processed external link | `document.body` click delegate fires `ln-external-links:clicked` on the link | Default browser navigation in a new tab. The component does NOT preventDefault — Ctrl/Cmd-click, middle-click, etc., behave normally. |
| User clicks an internal link | `closest('a, area')` resolves; `data-ln-external-link === 'processed'` is false; no event dispatched | Normal navigation. |
| Screen reader navigates to a processed external link | (no JS) | Hears the link text followed by "(opens in new tab)". |

There are no JS-driven classes, no `aria-*` toggles, no transition or
animation. The component sets attributes, appends one span, and emits
events. Everything else is the platform.

## Attributes

ln-external-links is markup-free in the consumer-author sense — there
is no attribute *you* add to opt in. The attributes that DO show up
are written by the component itself, with one read-only exception
that doubles as an opt-out hatch.

| Attribute | On | Direction | Description |
|---|---|---|---|
| `data-ln-external-link="processed"` | `<a>` / `<area>` | written by component, read on each pass | Idempotency marker. Set after a link is decorated. The processing function early-returns on links that already carry it. **Pre-setting it manually** in your markup makes the component skip the link entirely — the unofficial opt-out path. |
| `target` | `<a>` / `<area>` | written | Set to `_blank` on every external link. **Overwrites** any pre-existing `target` value. |
| `rel` | `<a>` / `<area>` | written | Merged: `noopener` and `noreferrer` are added if not already present. Pre-existing tokens (`me`, `author`, `license`, `nofollow`, `ugc`, `sponsored`) survive on the link. |

There is no `data-ln-external-links` attribute. Decoration is
unconditional; the component does not look for a marker on the
element or on a parent.

## Events

Two events bubble; neither is cancelable. Both fire on the link
itself.

| Event | Bubbles | Cancelable | `detail` | Dispatched when | Common consumer |
|---|---|---|---|---|---|
| `ln-external-links:processed` | yes | no | `{ link: HTMLAnchorElement, href: string }` | A link finishes decoration (after `target`, `rel`, sr-only span, and the marker attribute are all written) | Auditing / debug logging; verifying decoration coverage |
| `ln-external-links:clicked` | yes | no | `{ link, href: string, text: string }` | The user clicks anywhere inside a processed external link. `text` is `link.textContent || link.title || ''` — the visible label, falling back to the title attribute, falling back to empty string | Analytics / outbound-link tracking |

The `:clicked` event is a **notification, not a hook**. The component does not call `preventDefault()` and does not honor a consumer's `preventDefault()` on the CustomEvent. To intercept navigation, attach a click listener on the link or a parent in the **capture phase**, and `preventDefault()` the platform `click` event. The demo page shows a working interstitial.

## API (global service)

ln-external-links exposes a single function on `window`:

```js
window.lnExternalLinks.process(container)
```

| Argument | Type | Default | Description |
|---|---|---|---|
| `container` | `HTMLElement` | `document.body` | Subtree to scan for `a, area` elements. Each match runs through the same `_processLink` path used by the initial scan and the MutationObserver. Already-processed links no-op. |

When to call it manually:

- **You injected markup with `innerHTML` and want decoration to
  apply *synchronously*** before your next line runs. The
  MutationObserver runs asynchronously (microtask), so a setup like
  `el.innerHTML = '<a href="https://...">';
  el.querySelector('a').target` reads the OLD `target` value because
  the observer has not yet processed the addition. `lnExternalLinks.process(el)`
  forces it through immediately.
- **You changed an existing external link's `href` to a *different*
  external URL.** The observer's attribute filter on `href` re-fires
  `_processLink`, but the marker is still set so the link short-circuits
  unchanged. If you need a full re-decoration (e.g. you mutated the host
  to a different one and want to re-emit `:processed`), remove the
  marker first: `el.removeAttribute('data-ln-external-link')` then call
  `process()`. The internal → external case does NOT need this — the
  marker is absent, so the observer-driven re-process decorates
  automatically.

## Examples

### Minimal — no consumer code at all

```html
<a href="https://example.com">Visit example.com</a>
```

That's it. Page load decorates the link. New tab opens on click. Screen
readers get the hint. Zero JavaScript on the consumer side.

### Tracking external link clicks (analytics)

```js
document.addEventListener('ln-external-links:clicked', function (e) {
    const href = e.detail.href;
    const label = e.detail.text;

    // Send to your analytics tool of choice.
    if (typeof gtag === 'function') {
        gtag('event', 'click', {
            event_category: 'outbound',
            event_label: href,
            transport_type: 'beacon'
        });
    }
});
```

`transport_type: 'beacon'` is what makes the analytics call survive
the immediate `target="_blank"` navigation that follows.

### Decorating dynamically inserted markup

```js
const container = document.getElementById('content');
container.innerHTML = `
    <p>Read the <a href="https://github.com/livenetworks">source on GitHub</a>.</p>
    <p>Or visit <a href="https://example.com">example.com</a>.</p>
`;

// Option A: do nothing. The MutationObserver picks it up on the next
// microtask. By the time any user can click, the links are decorated.

// Option B: force synchronous decoration. Useful if your next line of
// JS reads link.target or link.rel and needs the new value immediately.
window.lnExternalLinks.process(container);
```

The two paths are functionally equivalent for end users. Option B
exists for the rare case where a downstream snippet reads decoration
state inline.

### Confirm-before-leaving interstitial

The library does NOT ship an interstitial. The pattern composes `ln-modal` with a capture-phase click listener that intercepts navigation BEFORE `ln-external-links`' bubble-phase delegate dispatches `:clicked`. See `demo/admin/external-links.html` for the full working implementation. Three details that matter when wiring your own:

1. **Capture phase (`true` as the third arg).** ln-external-links' click delegate runs in the bubble phase. To intercept BEFORE it dispatches `:clicked`, listen in capture.
2. **Modifier keys honored.** `Ctrl`-click / `Cmd`-click / `Shift`-click / middle-click should keep their browser semantics. The early-return for those preserves user intent.
3. **`window.open` with the same `'noopener,noreferrer'` features.** Once you preventDefault, `target="_blank"` no longer applies — open the URL manually with the same security flags the link carried.

### Whitelisting an external link to NOT be decorated

Pre-set the marker in your markup:

```html
<!-- This OAuth callback link must stay in the same tab.
     Pre-marking it as 'processed' makes ln-external-links skip it. -->
<a href="https://oauth.example.com/return"
   data-ln-external-link="processed">
    Continue with Example
</a>
```

The component's `_processLink` early-returns when the marker is
already set. The link will NOT receive `target="_blank"` or
`rel="noopener noreferrer"`, and it will NOT trigger `:clicked`
events (they are gated on the same marker — line 45). Document this
hatch in your project; it works only because of how the idempotency
guard is implemented, not because the component declares "skip" as a
feature.

### Preserving a meaningful `rel` value (microformats)

The component **merges** `noopener` and `noreferrer` into any pre-existing
`rel` token list. Authoring `rel="me"` on a personal-website link in your
bio is enough — no pre-marking required. After decoration, the link
carries `rel="me noopener noreferrer"` and the auto sr-only hint span:

```html
<!-- Before (your authored HTML) -->
<a href="https://livenetworks.mk" rel="me">Live Networks</a>

<!-- After (what ln-external-links produces) -->
<a href="https://livenetworks.mk"
   rel="me noopener noreferrer"
   target="_blank"
   data-ln-external-link="processed">
    Live Networks
    <span class="sr-only">(opens in new tab)</span>
</a>
```

## Common mistakes

### Mistake 1 — Reading `link.textContent` for analytics and getting the sr-only hint string

```js
document.addEventListener('ln-external-links:clicked', function (e) {
    const label = e.detail.text;
    // label === "Read more (opens in new tab)" — includes the hint!
});
```

`detail.text` is `link.textContent || link.title || ''`, evaluated at
click time *after* the hint span has been appended.
`link.textContent` returns the concatenated text of all descendants,
including the sr-only span. If your analytics dashboard collects
`event_label`, you'll see the hint suffix on every entry.

Two workarounds:

```js
// Option A: strip the hint suffix.
const cleanLabel = label.replace(/\s*\(opens in new tab\)\s*$/, '');

// Option B: read the original label before the hint span was appended.
//          The hint is always the LAST child of the link.
const link = e.detail.link;
const labelOnly = Array.prototype.filter.call(link.childNodes, function (n) {
    return !(n.nodeType === 1 && n.classList.contains('sr-only'));
}).map(function (n) { return n.textContent; }).join('').trim();
```

### Mistake 2 — Calling `preventDefault()` on `:clicked` and expecting the navigation to stop

```js
// WRONG — this does nothing.
document.addEventListener('ln-external-links:clicked', function (e) {
    if (someCondition) e.preventDefault();
});
```

`:clicked` is a CustomEvent, not the platform `click`. It fires
*after* the click delegate's `closest('a, area')` resolution but
within the same handler — the platform's default action (navigation)
is governed by the original `click`, not by your CustomEvent's
`defaultPrevented`. ln-external-links does not call `preventDefault()`
on the click and does not check `defaultPrevented` on the event it
emits.

To intercept the navigation, attach a click listener on the link
or on a parent in the **capture phase**, and `preventDefault()` the
real `click` event. See the "Confirm-before-leaving interstitial"
example above.

## Related

- **`@mixin ln-icon`** is unused here — there's no icon decoration on
  external links by default. If you want a "↗" indicator, add it in
  project SCSS via `a[data-ln-external-link="processed"]::after`.
- **`.sr-only`** (`scss/utilities/_utilities.scss`) — the
  visually-hidden utility used by the appended hint span. If your
  project does not include ln-ashlar utilities, supply your own
  `.sr-only` definition or the hint will be visible.
- **[`ln-modal`](../ln-modal/README.md)** — the demo page composes
  `ln-modal` with this component to show a "leaving the site"
  interstitial. The composition is project code, not library code;
  see the "Confirm-before-leaving interstitial" example.
- **Architecture deep-dive:** [`docs/js/external-links.md`](../../docs/js/external-links.md)
  for the global-service pattern, the `_isExternalLink` decision
  table, and the script-load lifecycle.
- **Cross-component principles:** [`docs/architecture/data-flow.md`](../../docs/architecture/data-flow.md)
  — ln-external-links sits OUTSIDE the four-layer data flow. It is
  not Data, Submit, Render, or Validate. It is a global decorator
  that mutates DOM in response to insertion events; the data flow
  story does not apply.

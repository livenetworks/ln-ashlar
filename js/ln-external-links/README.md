# ln-external-links

> Auto-decorates every cross-host `<a>` and `<area>` on the page with
> `target="_blank"`, `rel="noopener noreferrer"`, and a screen-reader
> hint — so consumers never write that `setTimeout(() =>
> document.querySelectorAll('a').forEach(...))` snippet again. A
> few lines of JS that turn "did you remember `noopener` on every external
> link?" into a question nobody has to ask.

## Philosophy

External-link hardening is one of those tiny, everywhere concerns. The
project that gets it right does it once, in one place, and forgets it.
The project that gets it wrong scatters one-off hand-decorations across
templates, misses the dynamic ones loaded by AJAX, and ships the day a
new contributor adds an `<a href="https://...">` without thinking
about `rel`. ln-external-links exists to make "right" the only
behavior available — load the script, every external link on the page
is decorated, every link inserted later is decorated when the
`MutationObserver` sees it. There is no opt-in attribute. There is no
init call. There is no API to remember. The decorator just runs.

The component is also why **what counts as "external" is a precise
choice, not a vibe**. ln-external-links uses **hostname inequality**:
`link.hostname` is non-empty AND differs from
`window.location.hostname`. That single test rejects four families of
non-link in one line:

- `mailto:`, `tel:`, `sms:`, `javascript:`, `data:`, `blob:` — all
  produce an empty `link.hostname`. Skipped.
- `<a href="">` — relative to the page; hostname inherits the page's.
  Equal to `window.location.hostname`. Skipped.
- `<a href="#anchor">` — same as above; same-page fragment links
  carry the page's hostname. Skipped.
- `<a href="/dashboard">` — relative path; hostname inherits. Skipped.

What it *catches*:

- `<a href="https://example.com">` when the page is on a different
  host. External — decorated.
- `<a href="https://app.example.com">` when the page is on
  `example.com`. **Different hostname → external.** Subdomains of
  the same root domain are treated as cross-site. Document this for
  your team if your app and your marketing site share a root.
- `<a href="http://samehost.com">` from `https://samehost.com`.
  Same hostname → **NOT external**, even though it's a different
  scheme. Mixed-content is the browser's problem, not this component's.
- `<a href="https://samehost.com:8443">` from
  `https://samehost.com`. Same hostname, different port → **NOT
  external** (the URL parser exposes `hostname` without the port).
  If your security model treats different ports as different origins,
  this is a gap; ln-external-links uses host, not origin.

The point is precision: each of those distinctions is a deliberate
choice, not an oversight. If your project needs a different definition
of "external" — say, "any URL whose registrable domain differs from
ours" — that is a different component. This one is the cheap, host-
based version that fits 95% of cases.

### What `rel="noopener noreferrer"` actually buys

The two flags do different things and both matter:

- **`noopener`** — strips `window.opener` in the new tab. Without it,
  the destination site can call `window.opener.location = '...'` and
  silently navigate the source tab to a phishing page (the classic
  "tabnabbing" exploit). Modern browsers ALREADY apply `noopener`
  semantics to `target="_blank"` by default since 2021, but
  `rel="noopener"` is still recommended for older browsers and as
  defense-in-depth — and it costs nothing. ln-external-links sets it.
- **`noreferrer`** — suppresses the `Referer` header on the outgoing
  request. The destination site cannot see which page on your origin
  the user came from. This is a privacy posture, not a security
  primitive — set it deliberately or remove it.

Both flags are written by the component in **merge mode**: the existing
`rel` token list is preserved, and `noopener` / `noreferrer` are added if
not already present. Microformat values like `rel="me"`, `rel="author"`,
`rel="license"`, `rel="nofollow"` survive untouched.

### What this component does NOT do

- **Does NOT provide an opt-out attribute.** There is no
  `data-ln-external-skip` or `data-ln-external-noprocess`. If you
  need an external link to *stay* in the same tab (auth redirects,
  OAuth same-tab flows, payment processors that hate popups), the
  only escape hatch is to pre-set `data-ln-external-link="processed"`
  on the link in your markup — the early-return guard at line 13
  treats already-processed links as done. That's the unofficial opt-out;
  it works because of how the guard is implemented, not because it was
  designed to be the public API. See "Common mistakes" item 2.
- **Merges with pre-existing `rel`.** The component reads the current
  `rel` token list, ensures `noopener` and `noreferrer` are present, and
  writes the result back. Microformat `rel="me"`, `rel="author"`,
  `rel="license"`, `rel="nofollow"`, `rel="ugc"`, `rel="sponsored"`
  survive on the link. Authoring `<a rel="me" href="https://...">` and
  letting the component decorate it produces `rel="me noopener noreferrer"`.
- **Re-decorates on `href` mutation (internal → external).** The
  `MutationObserver` watches `attributeFilter: ['href']` in addition to
  `childList`. A script that flips `link.href` from `/internal` to
  `https://external.com` on an already-in-DOM link triggers
  `_processLink` automatically and the link is decorated on the next
  microtask. The reverse case (external → internal) leaves the link
  decorated — the marker is still set, so the early-return guard skips
  re-evaluation. To strip decoration after a downgrade, clear the
  marker manually and remove `target` / `rel` / the hint span (rare,
  recoverable).
- **Does NOT cancel clicks or show a "you are leaving" interstitial.**
  The `:clicked` event is a notification, not a hook. Listen if you
  want analytics; build your own interstitial if you want a confirm
  modal (the demo page shows one — it's project code, not library
  code).
- **Does NOT distinguish ports or protocols.** `hostname` strips
  both. Same hostname on `:8080` and `:9000` is "internal" to the
  component; same hostname on `http://` and `https://` likewise.
- **Does NOT special-case download links.** An `<a download
  href="https://cdn.example.com/file.zip">` from a different host is
  decorated like any other external link — `target="_blank"` is set,
  the `download` attribute keeps working, browser handles the
  download in the new tab and (typically) closes it.

### Cross-component coordination

ln-external-links is a **global service** — it loads, runs, and
nothing else in the library knows it exists. It does not import
ln-core helpers' `registerComponent`; it ships its own MutationObserver
and its own click delegate. It does not coordinate with `ln-modal`,
`ln-form`, `ln-store`, or anything else. Other components' `<a>` tags
inside their templates get decorated transparently if they happen to
be external — that's the entire integration story.

The one thing it consumes from the rest of ln-ashlar is the `.sr-only`
utility class (`scss/utilities/_utilities.scss`) for the
"(opens in new tab)" hint span. If your project does not import
ln-ashlar's utilities, supply your own `.sr-only` definition or the
hint becomes visually rendered alongside the link text.

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

There is no per-element JS instance. Nothing on `window` except the
public API (`window.lnExternalLinks.process`). The full footprint of
the component is the four DOM edits per external link, one delegate
listener, and one observer.

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

`detail.text` deserves a note: it is read at click time, AFTER the
sr-only hint span has been appended. So `link.textContent` includes
the literal `"(opens in new tab)"` string at the end. If you are
logging the link text for analytics, strip the hint or use
`link.firstChild.textContent` for the original label. (A future
revision could narrow `text` to skip the hint, but that's a behavior
change — current consumers may rely on the present shape.)

The `:clicked` event is a **notification, not a hook**. The component
does not call `preventDefault()` and does not honor a consumer's
`preventDefault()`. If you want a confirm-before-leaving interstitial,
attach your own click handler with `e.preventDefault()` BEFORE the
component's delegate runs (capture phase, or a more specific handler
on the link itself). The demo page shows a working interstitial — see
`demo/admin/src/pages/external-links.html`.

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

There is no `destroy()`, no `init()`, no instance pattern. The
component is a single document-level click delegate plus a single
body-level MutationObserver. Both live for the document's lifetime.

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
the immediate `target="_blank"` navigation that follows. If you use a
different analytics SDK, look for its equivalent (Plausible's
`pageview` outbound plugin, Matomo's `trackLink`, etc.).

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

The library does NOT ship an interstitial. The demo page wires one up
manually using `ln-modal` for the dialog and a click capture handler:

```html
<div data-ln-modal id="external-link-modal">
    <form>
        <header>
            <h3>Leaving this site</h3>
            <button type="button" aria-label="Close" data-ln-modal-close>
                <svg class="ln-icon" aria-hidden="true"><use href="#ln-x"></use></svg>
            </button>
        </header>
        <main>
            <p>You are about to leave for:</p>
            <p id="external-link-url"></p>
            <p>Continue?</p>
        </main>
        <footer>
            <button type="button" data-ln-modal-close>Cancel</button>
            <button type="button" id="external-link-confirm">Continue</button>
        </footer>
    </form>
</div>

<script>
(function () {
    const modal = document.getElementById('external-link-modal');
    const urlEl = document.getElementById('external-link-url');
    const confirmBtn = document.getElementById('external-link-confirm');
    let pendingUrl = null;

    document.body.addEventListener('click', function (e) {
        const link = e.target.closest('a[target="_blank"]');
        if (!link) return;
        if (e.ctrlKey || e.metaKey || e.shiftKey || e.button === 1) return;
        e.preventDefault();
        pendingUrl = link.href;
        urlEl.textContent = pendingUrl;
        modal.setAttribute('data-ln-modal', 'open');
    }, true); // capture phase — runs before ln-external-links' delegate

    confirmBtn.addEventListener('click', function () {
        if (pendingUrl) window.open(pendingUrl, '_blank', 'noopener,noreferrer');
        modal.setAttribute('data-ln-modal', 'close');
        pendingUrl = null;
    });
})();
</script>
```

Three details that matter:

1. **Capture phase (`true` as the third arg).** ln-external-links'
   click delegate runs in the bubble phase. To intercept BEFORE it
   dispatches `:clicked`, listen in capture. Otherwise your analytics
   handler fires on links the user just cancelled.
2. **Modifier keys honored.** Ctrl-click / Cmd-click / Shift-click /
   middle-click should keep their browser semantics (new tab, new
   window, save). The early-return for those preserves user intent.
3. **`window.open` with the same `'noopener,noreferrer'` features.**
   Once you preventDefault, `target="_blank"` no longer applies — you
   manually open the URL with the same security flags the link
   carried.

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

If you still want to fully opt the link out of any decoration (no
`target="_blank"`, no hint span), the unofficial whitelist hatch
(`data-ln-external-link="processed"` pre-set in markup) still works:

```html
<a href="https://livenetworks.mk"
   rel="me noopener noreferrer"
   target="_blank"
   data-ln-external-link="processed">
    Live Networks
    <span class="sr-only">(opens in new tab)</span>
</a>
```

## Common mistakes

### Mistake 1 — Expecting `localhost:3000` and `localhost:8080` to be cross-host

```js
// On http://localhost:3000
const link = document.createElement('a');
link.href = 'http://localhost:8080/api';
console.log(link.hostname); // 'localhost' — NOT external
```

The component compares `hostname` only. Different ports, same hostname
→ **not external**, no decoration. If your dev environment splits
frontend and API across ports on the same host, the API links stay
plain. Two ways through:

1. Live with it (most projects do — same hostname is "your stuff").
2. Pre-decorate the API links with the manual marker and add target/rel
   yourself — the unofficial whitelisting path documented in
   "Whitelisting" above, in reverse.

### Mistake 2 — Trying to opt out by removing the script for one link

```js
// WRONG — there is no way to "tell" the component to skip a specific link.
// Removing data-ln-external-link AFTER processing does nothing useful.
link.removeAttribute('data-ln-external-link');
// link.target is still '_blank', link.rel is still 'noopener noreferrer'.
```

Once a link has been processed, the modifications are real DOM
attributes — removing the marker doesn't reverse them. The marker
exists to gate FUTURE decoration passes, not to undo past ones.

The correct opt-out is **prevent decoration in the first place** by
pre-setting the marker in your markup (see "Whitelisting an external
link to NOT be decorated" above). If the link has already been
processed and you need to "un-decorate" it:

```js
link.removeAttribute('target');
link.setAttribute('rel', '');                     // or remove entirely
link.querySelector('.sr-only')?.remove();         // remove the hint
link.setAttribute('data-ln-external-link', 'processed'); // keep the marker
                                                  // so it doesn't get
                                                  // re-decorated on the
                                                  // next pass
```

This is fragile by design. The library's posture is "decoration is
applied uniformly; opt-outs are markup-time, not runtime."

### Mistake 3 — Reading `link.textContent` for analytics and getting the sr-only hint string

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

If your locale needs a different hint string, the library currently
hard-codes English. To localize, do not rely on `detail.text`; pass
your own label through a `data-` attribute on the link and read that.

### Mistake 4 — Calling `preventDefault()` on `:clicked` and expecting the navigation to stop

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

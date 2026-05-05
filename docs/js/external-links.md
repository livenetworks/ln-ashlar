# External Links — architecture reference

> Implementation notes for `ln-external-links`. The user-facing
> contract lives in [`js/ln-external-links/README.md`](../../js/ln-external-links/README.md);
> this document is the why-behind-the-how, not a re-statement of usage.

File: `js/ln-external-links/ln-external-links.js`.

## Position in the architecture

`ln-external-links` is a **global service** — see js skill §10 for
the pattern. It does not register a DOM-instance component, does not
participate in `registerComponent` from ln-core, does not own a
`data-ln-*` attribute that consumers add to elements. It loads, runs
once, sets up a click delegate on `document.body`, attaches a
MutationObserver to `document.body`, and writes a public function to
`window.lnExternalLinks.process`. That is the entire footprint.

It sits **outside the four-layer data flow** described in
[`docs/architecture/data-flow.md`](../architecture/data-flow.md). It
is not Data, Submit, Render, or Validate. It is a presentation
decorator — closer in spirit to `ln-autoresize` or `ln-icons` (the
sprite injector) than to any data-pipeline component. Its job is
DOM hardening, applied uniformly, with no consumer wiring.

## Decision table — what counts as "external"

The single test (line 9): truthy `link.hostname` AND
`link.hostname !== window.location.hostname`. Behavior, exhaustively:

| `href`                                  | `link.hostname`                | External? | Decorated? |
|-----------------------------------------|--------------------------------|-----------|------------|
| `https://example.com/path`              | `'example.com'`                | yes (different host) | yes |
| `https://samehost.com/path` (page on `samehost.com`) | `'samehost.com'`     | no (same host) | no |
| `https://app.example.com` (page on `example.com`) | `'app.example.com'`         | yes (different hostname — subdomain treated as external) | yes |
| `https://samehost.com:8443` (page on `samehost.com`) | `'samehost.com'` (no port) | no (hostname strips port) | no |
| `http://samehost.com` (page on `https://samehost.com`) | `'samehost.com'`         | no (hostname ignores scheme) | no |
| `/dashboard` (relative path)             | `'samehost.com'` (inherited)  | no (same host) | no |
| `#anchor`                                | `'samehost.com'` (inherited)  | no | no |
| `mailto:foo@example.com`                | `''` (empty)                   | no (empty hostname fails the `&&`) | no |
| `tel:+38970000000`                       | `''`                          | no | no |
| `sms:+38970000000`                       | `''`                          | no | no |
| `javascript:void(0)`                     | `''`                          | no | no |
| `data:text/html;base64,...`              | `''`                          | no | no |
| `blob:https://samehost.com/uuid`         | (varies — typically empty)     | no in practice | no |
| `<a>` (no `href` attribute)              | `''`                           | no | no |
| `<a href="">`                            | `'samehost.com'` (resolved as page URL) | no | no |

The leading `link.hostname &&` short-circuit is what handles all the
non-http(s) URI schemes — they parse to an empty string for
`hostname`, and the truthiness check fails before the inequality
comparison runs. This is concise and correct, but it does mean any
URL the URL parser does not understand becomes "internal by default"
— an unknown scheme silently falls through.

## Script-load lifecycle

The component is a single IIFE. Three phases on initial script
execution (lines 84–95):

```
script eval
    │
    ▼
_initialize() runs:
    │
    ├─ _setupClickTracking()          ◀── guarded by guardBody
    │       guardBody(() => document.body.addEventListener('click', ...),
    │                 'ln-external-links')
    │
    ├─ _domObserver()                 ◀── guarded by guardBody
    │       guardBody(() => observer.observe(document.body, {...}),
    │                 'ln-external-links')
    │
    └─ if document.readyState === 'loading':
           document.addEventListener('DOMContentLoaded', _processLinks)
       else:
           _processLinks()  ◀── walks document.body.querySelectorAll(...)
                                relies on the readyState check above to
                                ensure body exists
```

Both delegate-setup paths defer through `guardBody`
(`ln-core/helpers.js:156-165`) — if `document.body` is null at script
load (e.g. `<head>`-loaded without `defer`), each setup re-schedules
itself for `DOMContentLoaded`. The script is safe to load anywhere on
the page.

The `_processLinks()` initial scan path is guarded by the
`readyState` check on line 88 — `'loading'` means body might not yet
exist, so the call is deferred to `DOMContentLoaded`; in any other
state body is guaranteed present.

## State

There is no per-link JS state. There is no per-document closure state.
The component's only persistent state is:

| Where | What | Lifetime |
|-------|------|----------|
| `data-ln-external-link="processed"` on each link | Idempotency marker. | Lives on the DOM element; persists as long as the element exists. |
| `target="_blank"` on each link | Opens in new tab. | Same. |
| `rel="noopener noreferrer"` on each link | Security + privacy. | Same. |
| Appended `<span class="sr-only">` inside each link | Screen-reader hint. | Same. |
| One `click` listener on `document.body` | Click tracking dispatch. | Document lifetime. |
| One `MutationObserver` on `document.body` (`childList: true, subtree: true, attributes: true, attributeFilter: ['href']`) | New-node decoration and href mutation handling. | Document lifetime. |
| `window.lnExternalLinks.process` | Public re-scan API. | Document lifetime. |
| `window.lnExternalLinks` (sentinel for double-load guard) | Prevents re-execution. | Document lifetime. |

The double-load guard (line 6) reads `window[DOM_ATTRIBUTE]` —
`'lnExternalLinks'` — and bails if defined. The same property is then
populated with `{ process: _processLinks }` on line 97. Loading the
script twice is a no-op on the second load.

## Processing pipeline

`_processLink(link)` is the canonical decoration path. Five steps,
on a previously-undecorated external link:

```
_processLink(link):
    1. if link.dataset.lnExternalLink === 'processed' → return
       (idempotency — every pass goes through this guard)

    2. if !_isExternalLink(link) → return
       (host comparison — see decision table)

    3. link.target = '_blank'
       (clobbers any pre-existing value)

    4. Read link.rel, split into tokens, ensure 'noopener' and
       'noreferrer' are present, write merged result back.
       (Pre-existing microformat tokens like rel="me" survive.)

    5. Create <span class="sr-only">(opens in new tab)</span>,
       append as last child of the link.

    6. link.setAttribute('data-ln-external-link', 'processed')
       (the marker for future passes)

    7. dispatch('ln-external-links:processed', { link, href: link.href })
       (notification — bubbles, not cancelable)
```

Steps 3-6 are the four mutations. Step 7 is the notification surface.
There is no "before-process" cancelable event — decoration is
unconditional once the guards pass.

## MutationObserver scope and limitations

The observer watches `document.body` with `childList: true, subtree: true,
attributes: true, attributeFilter: ['href']`. What this catches:

- New `<a>` or `<area>` element appended anywhere in `document.body`.
- New subtrees containing `<a>` / `<area>` descendants. The handler
  walks both the inserted node directly (`node.matches('a')` /
  `node.matches('area')`) AND `node.querySelectorAll('a, area')` so
  nested links are picked up.
- **`href` attribute mutations** on existing `<a>` / `<area>` elements.
  An attribute-mutation handler resolves `mutation.target`, confirms
  it is an anchor / area, and runs `_processLink` on it. Internal →
  external href flips redecorate automatically. Already-processed
  links short-circuit at the line-13 idempotency guard.

What it does NOT catch:

- **External → internal href flips on a processed link.** The marker
  is still set, the early-return guard hits, decoration stays. The
  link is now over-decorated (`target="_blank"` pointing at an
  internal URL). Recovery is consumer-side: clear the marker, remove
  `target` / `rel` / the hint span manually, then proceed. Rare in
  practice; not worth the complexity of a "downgrade" path inside the
  component.
- **Removal events.** The handler only checks `addedNodes`, not
  `removedNodes`. There is no cleanup when a processed link is
  removed — but since the only state per link is on the link itself,
  removal cleans up automatically with the element.
- **Document-level mutations.** The observer is attached to
  `document.body`, not `document.documentElement`. Theoretically a
  rogue script that swaps the entire `<body>` would orphan the
  observer. In practice this is not a real-world concern.

Both `_setupClickTracking` and `_domObserver` are wrapped in
`guardBody`, so both setup paths defer cleanly when the script is
loaded in `<head>` without `defer` — no asymmetry, no script-load
crash.

## Click delegation

The delegate is set up inside `guardBody`, so the
`document.body.addEventListener` call is deferred to `DOMContentLoaded`
when the script loads before `<body>` exists. The handler uses
`e.target.closest('a, area')` to find the anchor, then dispatches
`ln-external-links:clicked` with `{ link, href, text }` if the
`processed` marker is present. Three properties of this delegate are
worth noting:

1. **`closest('a, area')` resolves nested clicks.** A click on a
   `<svg>` inside `<a>` resolves to the anchor — the anchor is the
   dispatch target.
2. **No `preventDefault()`.** The browser's default action (open the
   link in `target="_blank"` → new tab) runs unimpeded. Modifier-key
   semantics (Ctrl-click for new tab, middle-click, Shift-click for
   new window) are honored automatically because the component does
   not interfere.
3. **Event firing is gated on the `processed` marker, NOT on the
   external-host test.** This means a link that was pre-marked
   `data-ln-external-link="processed"` in markup (the unofficial
   opt-out path) WILL fire `:clicked` events even if it's actually
   internal — the click handler does not re-run `_isExternalLink`.
   This is consistent with the rest of the design ("the marker is
   the contract"), but consumers of `:clicked` should be aware that
   the event is "user clicked a link the component thinks is
   external," not "user clicked an actually-cross-host link."

The `text` field in the detail concatenates `link.textContent` —
which includes the appended sr-only hint span. See README "Common
mistakes" item 3.

## Accessibility — the sr-only hint

The hint is a `<span class="sr-only">` with text `"(opens in new tab)"`,
appended as the link's last child (lines 19-22 of the source). It is a
WCAG 2.4.4 ("Link Purpose (In Context)") affordance —
users of assistive tech get a verbal cue that the link will open in
a new tab, which is an accessibility expectation for `target="_blank"`.
Sighted users see no change because `.sr-only` (defined in
`scss/utilities/_utilities.scss`) clips the span to a 1×1 box and
positions it absolutely, hidden from layout but still in the
accessibility tree.

The hint string is hard-coded English. There is no i18n hook. Projects
serving non-English locales must either:

- Replace the literal string in their build (one search-and-replace
  in `dist/ln-ashlar.iife.js`), or
- Ship their own decorator and pre-mark every external link to skip
  ln-external-links.

A future revision could read the string from a `lang`-aware
dictionary or from a `window.LN_EXTERNAL_LINKS_HINT` global, but
that is not in the current source.

The hint span is appended unconditionally; there is no detection of
existing screen-reader text in the link, so a link that already
contains its own visually-hidden "opens in new tab" hint will get a
duplicate.

## Cross-component coordination

ln-external-links does not import any other ln-* component, does not
listen for any `ln-*` event, and does not consume any global other
than `dispatch` and `guardBody` from `ln-core/helpers.js` (lines
1, 26, 56, 81 of the source). The two helpers are pulled in via
`import { dispatch, guardBody } from '../ln-core'`.

It does not coordinate with:

- `ln-modal` — the demo's "leaving the site" interstitial is project
  code that listens to the platform `click` in capture phase and
  sets `data-ln-modal="open"` on the modal. ln-external-links is unaware.
- `ln-ajax` / `ln-store` — links inside AJAX-loaded fragments are
  decorated by the MutationObserver. The data-loading components
  do not signal "I just inserted markup, please re-process";
  decoration is purely insertion-driven.
- `ln-icons` — adding an "external link" indicator icon is project
  SCSS via `a[data-ln-external-link="processed"]::after`, not part
  of this component's behavior.

The only library dependency at runtime is `.sr-only` from
`scss/utilities/_utilities.scss`. If a project does not include
ln-ashlar's utilities bundle, the hint span is created but stays
visually rendered (not visually hidden), causing literal "(opens in
new tab)" to appear next to every external link.

## Performance notes

- **Initial scan**: O(n) over `document.body.querySelectorAll('a, area')`.
  On a typical admin page with a few hundred links, this is sub-
  millisecond. The five DOM operations per external link (set
  `target`, set `rel`, create span, append span, set marker, dispatch
  event) total a handful of microseconds.
- **MutationObserver fan-out**: O(k) per mutation batch, where k is
  the count of `<a>` / `<area>` in the inserted subtree. Already-
  processed links early-return at the first guard, so re-scans of
  re-inserted DOM are cheap.
- **Click delegate**: one listener for the entire page. Each click
  does one `closest('a, area')` traversal (O(depth)) and at most one
  `getAttribute` read. Negligible.

There is no batching, no debouncing, no `requestAnimationFrame`. The
synchronous mutations are fine because each one is constant-cost; the
forced layouts that other components worry about (`scrollHeight` reads,
position calculations) are absent here.

## Source map

| Lines | Concern |
|-------|---------|
| 1     | `dispatch`, `guardBody` import |
| 3-6   | IIFE wrapper + double-load guard via `window.lnExternalLinks` |
| 8-10  | `_isExternalLink` — host comparison |
| 12-33 | `_processLink` — idempotency guard, host check, four mutations, marker, dispatch |
| 35-41 | `_processLinks` — bulk wrapper over `_processLink`, defaults container to `document.body` |
| 43-58 | `_setupClickTracking` — single body-level click delegate, guarded by `guardBody` |
| 60-93 | `_domObserver` — MutationObserver setup, guarded by `guardBody`; observes `childList`, `subtree`, and `attributes` filtered on `href` |
| 95-107 | `_initialize` — runs both setups, then runs initial `_processLinks()` (deferred to DOMContentLoaded if document is still loading) |
| 109-111 | Public API surface — `window.lnExternalLinks = { process: _processLinks }` |
| 113   | `_initialize()` invocation |

Both delegate-setup paths run under `guardBody`. The file is symmetric
end to end — no structural quirks.

## Known gaps and future work

These are documented behaviors that may want revision:

1. **Hard-coded English in the sr-only hint.** No i18n hook. A
   `window.LN_EXTERNAL_LINKS_HINT` override or a `lang`-aware
   dictionary lookup is the obvious extension.
2. **No public opt-out attribute.** The unofficial path
   (pre-set `data-ln-external-link="processed"`) works because of
   the idempotency guard, but a documented `data-ln-external-skip`
   would be clearer and decouple the guard from the opt-out.
3. **`detail.text` includes the sr-only hint.** Click-time read of
   `link.textContent` collects descendant text, including the
   appended hint. A future revision could exclude hint nodes via
   `link.firstChild.textContent` or by tracking the original label.
4. **External → internal href downgrade leaves over-decoration.**
   When a script flips a processed external link's `href` to an
   internal URL, the marker stays set and the link keeps
   `target="_blank"`, `rel="noopener noreferrer"`, and the sr-only
   hint. Cleanup is consumer-side: clear the marker, remove the
   added attributes / hint span manually. Rare; not worth the
   complexity of a "downgrade" branch inside `_processLink`.

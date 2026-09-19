# ln-confirm

> Applied directly to `<button data-ln-confirm>` or `<a data-ln-confirm>`. On the first `click`, it calls
> `e.preventDefault()`, sets `data-ln-confirm-state="confirming"`, unhides `[data-ln-confirm-active]` (or swaps text),
> and starts a `setTimeout`. A second `click` before timeout lets the native event proceed; if the timer fires first,
> it clears the attribute and restores the original DOM content.

---

## 🧭 Philosophy & Architecture

1. **In-Place Morphing:** Instead of launching heavy, separate dialogs or using frozen, unstyleable `window.confirm()` scripts, confirmation lives **directly on the target button**. It preserves structural styling while swapping labels, child states or the icon in place.
2. **Platform Event Release:** `ln-confirm` does not implement a custom `accept` handler. The acceptance is the standard platform `click` event. On the second click, the component steps out of the way of the *default action* — form submissions (`type="submit"`), links (`href`), or custom AJAX click listeners execute natively. It does **not** step out of the way of propagation: the click stops at the button on both clicks, so an ancestor click surface never sees it.
3. **Graceful Auto-Revert:** The gate is timed. When armed, a countdown timer is scheduled. If a second click does not arrive within the window, the button cleanly reverts to its idle text or icon state.

---

## 📦 Minimal Blueprint

### Text-Button Mode

```html
<button data-ln-confirm="Are you sure you want to delete?">Delete account</button>
```

On click, the text replaces with the confirmation prompt in-place, and the button accent shifts to error red.

### Icon-Only Mode

```html
<button aria-label="Delete item" data-ln-confirm="Confirm delete?">
  <svg class="ln-icon"><use href="#ln-icon-trash"></use></svg>
</button>
```

### Two-Element Mode (Recommended for rich content)

```html
<button class="btn btn-danger" data-ln-confirm>
  <!-- Idle state -->
  <span data-ln-confirm-idle>
    <svg class="ln-icon"><use href="#ln-icon-trash"></use></svg>
    Delete Selected (<span data-ln-table-selected></span>)
  </span>
  <!-- Active (Confirming) state -->
  <span data-ln-confirm-active hidden>
    Are you sure?
  </span>
</button>
```

On click, the idle content hides and the active content unhides, without mutating or destroying the button's internal DOM nodes (such as the icon or selection span).

---

## 🛠️ Declarative API Contract


### HTML Attributes

| Attribute | Elements | Description |
| :--- | :--- | :--- |
| `data-ln-confirm="Prompt"` | `<button>`, `<a>` | Action gate marker. Empty value defaults to `"Confirm?"` (in legacy mode). If using Two-Element Mode, this value is left blank. |
| `data-ln-confirm-timeout="3"` | `<button>`, `<a>` | Auto-revert delay in seconds (default `3`). |
| `data-ln-confirm-state="confirming"` | `<button>` (auto) | Managed state. Set during active confirmation; acts as public CSS hook. |
| `data-ln-confirm-announcer` | injected `<span>` (auto) | Marker on the transient `role="alert"` node that speaks the prompt in icon-only mode. |
| `data-ln-confirm-idle` | Any child | Defines the idle state layout/content (button icon/text) in Two-Element Mode. |
| `data-ln-confirm-active` | Any child | Defines the confirmation prompt content in Two-Element Mode. |

---

### JS API

Access the confirmation instance directly via the `lnConfirm` property on the button element:

```javascript
const button = document.getElementById('delete-btn');

// 1. Check if armed (live read-only getter over data-ln-confirm-state)
if (button.lnConfirm.confirming) { ... }

// 2. Disarm immediately, restore visual states, and unbind listeners
button.lnConfirm.destroy();
```

---

## ⚡ DOM Events

`ln-confirm` dispatches exactly one event during its lifecycle:

| Event | Bubbles | Payload | Description |
| :--- | :--- | :--- | :--- |
| `ln-confirm:waiting` | Yes | `{ target }` | Fires on first click, right after the button arms. Useful for telemetry. |

*Note: There is no `accept` event. Code execution on accept belongs on standard browser `click` or form `submit` handlers.*

---

## ⚠️ Common Pitfalls

- **Listening for an `:accept` event:** There is no `ln-confirm:accept`. Destructive logic belongs in the button's native click handler or form submit listener — which are automatically gated.
- **Double-Click Protection:** Once the second click executes the target action, the button returns to idle. If your custom AJAX handler takes time, the user can click again and execute duplicate actions. Disable the button on submit:
  ```javascript
  form.addEventListener('submit', () => submitButton.disabled = true);
  ```
- **GET Request Navigation (`<a>`):** While the script works on links, performing destructive actions via HTTP GET is a security risk (crawlers and pre-fetchers can trigger deletes). Always use `<form method="POST">` with submit buttons instead.
- **Attachment Order:** `ln-confirm` intercepts first clicks via `stopImmediatePropagation()`. If custom click handlers are bound *before* the bundle loads, they will run on the first click anyway. Ensure scripts are defer-loaded.
- **Bulk Actions & High-Impact Operations:** `ln-confirm` is strictly for **single-element, low-impact actions** (e.g. deleting a single table row). Bulk operations (e.g. "Delete selected users") must use a proper confirmation modal (`ln-modal`) that lists affected resources and offers explicit "Confirm" / "Cancel" buttons.

---

## 🔧 Internals

Source: `components/ln-confirm/ln-confirm.js`. Imports nothing from other components, consumes no `ln-*` event, and emits nothing the library listens to. Its entire contract is the platform `click` sequence on its own button.

### Two-click flow

The click handler branches on `this.confirming`.

**First click** (`confirming === false`) — arm:
- `preventDefault()` blocks the platform action (submit / navigate).
- `stopImmediatePropagation()` stops *later* same-element listeners, so a project's own analytics/validation click handler does not fire on the arming click — only on the second, accepting click. Listeners bound *before* ln-confirm still run, which is why the bundle must be defer-loaded.
- `_enterConfirm()`: set `confirming`, write `data-ln-confirm-state="confirming"` (CSS hook), swap the button to its confirm presentation (see Modes), schedule the auto-revert timer, dispatch `ln-confirm:waiting`.

**Second click** (`confirming === true`) — accept:
- No `preventDefault` — the click runs its native default (form submit, link nav, existing handler) unmodified. That is the whole design: insert a checkpoint, then step out.
- `stopPropagation()` — the click is contained at the button, exactly as on the first click. Without it the accepting click reaches ancestor click surfaces (a clickable card, a row handler) and fires *their* action alongside the confirmed one. Deliberately **not** `stopImmediatePropagation`: same-element listeners are the accept path and must run.
- `_reset()` runs **synchronously before the handler returns**, so the button is visually reverted in the same frame the action proceeds — no flash of the armed state. A `_submitted` flag guards against a synthetic re-entrant click inside the same handler.

Containment covers listener-based ancestors. It does not cover an ancestor `<a href>`: navigation is activation behavior, cancelled only by `preventDefault` — which would also cancel the confirmed action. Don't nest the button inside the anchor; see [ln-link](../ln-link/README.md), which skips clicks originating from `button`.

There is deliberately no `ln-confirm:accept` event and no second-click cancel signal — "accept" is just the native click; listen on the form `submit`, the link, or the button `click`.

### Attribute contract

The `ATTRIBUTES` table is the single source of truth for the host attributes. Each entry
with a `prop` becomes a **live getter** via `defineAttrs` — `confirmText`, `timeout` and
`confirming` read the DOM on every access, so nothing is copied into instance state and
there is no sync step. The getters have no setter; assigning to them throws.

`data-ln-confirm` and `data-ln-confirm-timeout` are therefore read at the moment they are
used — the prompt when the button arms, the timeout when `_startTimer` schedules the
revert. Changing the timeout while armed does not affect the already-running timer.

No entry declares an `effect`, so the component is deliberately non-reactive: the shared
observer watches `data-ln-confirm` for instance creation only, and editing any of these
attributes never runs component code on its own.

`originalText` is the one genuine snapshot — it is `dom.textContent.trim()` captured at
construction, not an attribute, and is what `_reset` restores. Text mode therefore reverts
to the label the button had when it was hydrated; use Two-Element mode for labels that
change at runtime.

### Modes

- **Two-Element (recommended):** if the button contains `[data-ln-confirm-idle]` and `[data-ln-confirm-active]`, the component only toggles their `hidden` attribute — no DOM mutation, so inner icons / selection-count spans survive and all text stays authored in HTML.
- **Legacy text:** no child markers → `dom.textContent` is swapped to `confirmText` and restored on revert.
- **Icon-only:** fires when `originalText === ''` **and** a `svg.ln-icon use` exists at confirm time (checked fresh, to handle async-rendered icons). Swaps `<use href>` to `#ln-icon-check` (ln-icon fetches it on demand) and handles a11y (below). Everything is restored symmetrically in `_reset`.

### Icon-only accessibility

The icon swap is silent to AT and there is no visible text to read. So the icon branch:
1. swaps `aria-label` to `confirmText` (original captured, restored on reset), and
2. appends a transient `<span data-ln-confirm-announcer role="alert">` carrying the prompt,
   removed again in `_reset`.

`role="alert"` is its own assertive live region, which is why this branch deliberately does
**not** also set `aria-live` on the button — a live region nested inside a live region gets
announced twice. The two-element branch does still set `aria-live="polite"`, because there
the button's own content changes (`hidden` flips) and nothing is injected.

The announcer is hidden by a co-located rule on `[data-ln-confirm-announcer]` rather than
by `.sr-only`: this component's SCSS ships in `ln-ashlar-core.css` and `.sr-only` does not,
so a core-only consumer would otherwise see the prompt printed inside the button.

Text mode needs neither: `textContent` *is* the accessible name, and changing it is itself
the announcement.

### CSS hooks

Co-located SCSS carries two functional rules. This file ships in the **core** bundle, so
neither may lean on theme tokens or theme utilities:

```scss
[data-ln-confirm] [hidden]  { display: none; }
[data-ln-confirm-announcer] { /* visually hidden, no theme dependency */ }
```

The first is the П4 hiding contract: native `hidden` is the mechanism — `_enterConfirm` and
`_reset` toggle it on the idle/active children — and the rule backs the UA default up at
(0,2,0) so a `display` set on a child cannot defeat it. There is deliberately no second,
state-keyed rule performing the same hiding. A two-element button whose
`[data-ln-confirm-active]` is missing `hidden` in the authored markup is a markup bug, and
`ln-confirm-dev.scss` says so under `[data-ln-debug]` instead of silently papering over it.

The single themed rule rebinds the accent token while armed:

```scss
// theme/components/_confirm.scss
[data-ln-confirm-state="confirming"] { --color-primary: var(--color-error); }
```

`theme/base/_global.scss` documents this as *the* way to express a colour variant, so a
button carrying `@mixin btn` — including `button[type="submit"]` — turns red while armed and
theme overrides keep working. A bare `<button>` runs only `@mixin button-base`, whose
`color: var(--btn-fg)` never reads `--color-primary`; it has no variant to recolour, so its
armed signal is the icon swap alone. That is deliberate, not an oversight.

`ln-confirm` renders no bubble, no tooltip and no overlay, and therefore needs no ancestor
to relax `overflow`. A button that also wants a tooltip composes
[ln-tooltip](../ln-tooltip/README.md) alongside it.

### Destroy

`destroy()` is idempotent, calls `_reset()` **first** (so a destroy-while-armed clears the pending timer and visual state), then unbinds the listener and deletes `el.lnConfirm`. It does not remove `data-ln-confirm` — the caller owns the attribute, so a later observer rescan can re-create the instance.

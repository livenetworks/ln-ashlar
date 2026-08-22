# ln-autoresize

A zero-dependency, high-performance **UX Helper Primitive** (~47 lines of JavaScript) that dynamically resizes a `<textarea>` to track its content. It grows as the user types and collapses instantly as text is deleted.

---

## 🧭 Philosophy & Architecture

1. **Platform-First Execution:** Instead of introducing heavy observers or layouts, `ln-autoresize` hooks directly into the browser's native layout engine. By resetting height to `auto` before reading `scrollHeight` inside the event loop, it forces a synchronous, flicker-free layout calculation.
2. **Strict Concern Scope:** The primitive is stateless. Ceiling limits, minimum bounds, and manual resize handles are defined exclusively via standard CSS classes. The script only handles active observation.
3. **Reactive Synchronization:** Data flows strictly through DOM events. Programmatic changes must trigger standard events (`input` / `change`) so that dependent primitives can adapt in synchrony.

---

## 📦 Minimal Blueprint

```html
<textarea data-ln-autoresize rows="1" placeholder="Type here..."></textarea>
```

To cap growth at a maximum height and enable scroll past it, pair the attribute with pure CSS:

```scss
textarea[data-ln-autoresize] {
    resize: none;         // Removes conflicting manual drag handle
    max-height: 6rem;     // Defines height ceiling
    overflow-y: auto;     // Reveals scrollbar at ceiling
}
```

> [!TIP]
> Always set `rows="1"` on the HTML element. This ensures the initial empty height matches the post-initialization state and prevents visual snap-shut on first paint.

---

## 🛠️ Declarative API Contract

### HTML Attributes

| Attribute | Elements | Description |
| :--- | :--- | :--- |
| `data-ln-autoresize` | `<textarea>` | Observation marker. Presence creates the instance and runs initial measurement. |

### JS API

Access the utility instance directly via the `lnAutoresize` property on the textarea element:

```javascript
const textarea = document.getElementById('my-textarea');

// 1. Force a manual re-measure (essential after parent reveals, font loads, etc.)
textarea.lnAutoresize._resize();

// 2. Tear down event listeners and clear inline styles
textarea.lnAutoresize.destroy();
```

---

## ⚡ DOM Events

`ln-autoresize` does not emit custom events. It relies entirely on standard browser interactions:

- **Listens to `input`:** Triggers `_resize()` on keystrokes, pastes, and deletes.
- **Listens to `change`:** Triggers `_resize()` on value commits.

---

## ⚠️ Common Pitfalls

- **Setting `textarea.value` directly:** Programmatic writes are silent in the DOM. The component will not detect value updates unless you dispatch a synthetic event:
  ```javascript
  textarea.value = 'New text content';
  textarea.dispatchEvent(new Event('input', { bubbles: true }));
  ```
- **Mounting in hidden parents:** A textarea inside a `display: none` container measures `scrollHeight` as `0`. When revealed later, it will appear collapsed. Force a re-measure manually after reveal:
  ```javascript
  textarea.lnAutoresize._resize();
  ```
- **Conflicting manual drag handles:** By default, textareas may have `resize: vertical` applied. This lets users manual resize the input, which is instantly overridden by the script on the next keystroke. Set `resize: none` to clean up the interface.

---

## 🔧 Internals

Source: `components/ln-autoresize/ln-autoresize.js`. A pure presentation utility — owns no data, emits no custom events, cooperates with no other component outside the `input` platform event.

### Instance state

| Property | Type | Description |
|----------|------|-------------|
| `dom` | `HTMLTextAreaElement` | The textarea, constructor argument |
| `_onInput` | `Function` | Bound `input` handler, kept for `destroy()` unbind |

No cached "current height" — `_resize` always reads `scrollHeight` fresh, so external CSS changes (`max-height`, font-size, padding) are picked up on the next keystroke.

### Resize mechanism

```
_resize():
  1. style.height = 'auto'
  2. read scrollHeight
  3. style.height = scrollHeight + 'px'
```

Step 1 is what makes it shrink, not just grow: `scrollHeight` reports the explicit `height` when content fits inside it, so without the reset every measurement would ratchet upward only. The reset + re-read happen synchronously in one tick, so the browser never paints the intermediate `auto` state — no flicker.

The constructor also calls `_resize()` once before returning, to size server-rendered pre-filled values and late-attached fields (`setAttribute` after the fact) on first paint rather than first keystroke. If the textarea is hidden at construction (`display: none` ancestor), `scrollHeight` reads `0` and there's no `ResizeObserver`/`IntersectionObserver` to catch a later reveal — call `_resize()` manually after showing it.

### Tag validation

The constructor checks `dom.tagName !== 'TEXTAREA'` and, if true, warns and returns `this` early with no `dom`/listener. The element is still marked initialized, so re-attaching the attribute after swapping in a real `<textarea>` needs `destroy()` first.

### MutationObserver via `registerComponent`

Standard shared observer on `document.body`: `childList/subtree` catches new `[data-ln-autoresize]` textareas anywhere; `attributes` (filtered to the one attribute) catches late `setAttribute` addition. Only attribute *presence* matters — no `onAttributeChange` callback, so value changes and attribute removal are no-ops.

### Destroy

Idempotent (bails if already torn down). Unbinds `_onInput`, clears `style.height` (reverting to the CSS-driven `rows`-based height), deletes the instance property. Does not remove the `data-ln-autoresize` attribute — the caller owns it, so a later rescan can re-create the instance.

### Cross-component coordination

No ln-prefixed import/listen/dispatch — only the platform `input` event. Two paths feed it synthetic `input` events:

- **`ln-form:fill`** — `ln-form`'s `fill()` writes `.value` then dispatches `input` on each populated field; autoresize catches it and re-measures. Direct `.value =` writes from project code skip this and will not resize.
- **`lnForm.reset()`** — walks fields dispatching synthetic `input`/`change` after `dom.reset()`, so cleared textareas shrink back. The bare native `<button type="reset">` path does NOT dispatch synthetic `input` (intentionally minimal); wire it manually or use the `lnForm.reset()` API if auto-shrink is needed there.

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

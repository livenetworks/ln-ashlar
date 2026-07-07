# ln-confirm

A zero-dependency, ultra-lightweight **Interaction Gate Primitive** (~109 lines of JavaScript) that creates a self-contained, two-click confirmation checkpoint on standard buttons. It intercepts accidental clicks, morphs in-place to reveal confirmation prompts, and passes the second click directly to native platform events.

---

## 🧭 Philosophy & Architecture

1. **In-Place Morphing:** Instead of launching heavy, separate dialogs or using frozen, unstyleable `window.confirm()` scripts, confirmation lives **directly on the target button**. It preserves structural styling while using CSS mixins to display temporary labels or icon tooltips.
2. **Platform Event Release:** `ln-confirm` does not implement a custom `accept` handler. The acceptance is the standard platform `click` event. On the second click, the component steps out of the way, allowing form submissions (`type="submit"`), links (`href`), or custom AJAX click listeners to execute natively.
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
  <svg class="ln-icon"><use href="#ln-trash"></use></svg>
</button>
```

### Two-Element Mode (Recommended for rich content)

```html
<button class="btn btn-danger" data-ln-confirm>
  <!-- Idle state -->
  <span data-ln-confirm-idle>
    <svg class="ln-icon"><use href="#ln-trash"></use></svg>
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
| `data-confirming="true"` | `<button>` (auto) | Managed state. Set during active confirmation; acts as public CSS hook. |
| `data-tooltip-text="Prompt"` | `<button>` (auto) | Managed state. Displays tooltip bubble in legacy icon-only mode. |
| `data-ln-confirm-idle` | Any child | Defines the idle state layout/content (button icon/text) in Two-Element Mode. |
| `data-ln-confirm-active` | Any child | Defines the confirmation prompt content in Two-Element Mode. |

---

### JS API

Access the confirmation instance directly via the `lnConfirm` property on the button element:

```javascript
const button = document.getElementById('delete-btn');

// 1. Check if armed (Boolean getter)
if (button.lnConfirm.confirming) { ... }

// 2. Disarm immediately, restore visual states, and unbind listeners
button.lnConfirm.destroy();
```

---

## ⚡ DOM Events

### Emitted

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
- **Bulk Actions & High-Impact Operations:** `ln-confirm` is strictly designed for **single-element, low-impact actions** (e.g. deleting a single table row). Using it for bulk operations (e.g., "Delete selected users") is an anti-pattern. High-impact operations must always use a proper confirmation modal (`ln-modal`) to list affected resources and provide explicit "Confirm" and "Cancel" buttons.

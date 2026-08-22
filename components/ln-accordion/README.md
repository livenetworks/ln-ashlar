# ln-accordion

> A lightweight, stateless **Coordinator** that enforces a single-open rule across a list of independent `ln-toggle` panels.

---

## 1. Philosophy & The Coordinator Mindset

In traditional frontend architectures, an accordion is a heavy, monolithic component that owns click events, height transitions, ARIA states, active-panel state, and storage persistence. 

In `ln-ashlar`, `ln-accordion` is fundamentally different: **it is a pure coordinator**. It contains only 38 lines of JavaScript, carries zero internal state, and coordinates other highly-specialized primitives.

Every accordion is a perfect synchronization of three orthogonal concerns:

1. **State Primitive (`ln-toggle`)**: Each panel is an independent `ln-toggle` instance. It owns the binary `open`/`close` state, coordinates trigger buttons, synchronizes `aria-expanded`/`aria-controls`, and handles per-panel localStorage persistence (`data-ln-persist`). It is completely oblivious to the other panels or the fact that it is inside an accordion.
2. **Animation Engine (CSS `.collapsible`)**: The height transition is handled entirely in Vanilla CSS via the `.collapsible` mixin (transitioning `grid-template-rows` from `0fr` to `1fr`). No JS framerate stuttering or inline height hacks.
3. **The Coordinator (`ln-accordion`)**: Lives on the wrapper element. It enforces a single rule: *"When one panel opens, all other open panels in this group must close."*

---

## 2. Minimal Blueprint

This is the standard HTML structure. The pairing of triggers and panels is by ID, keeping layout and proximity decoupled.

```html
<ul data-ln-accordion>
    <li>
        <!-- The Trigger -->
        <header data-ln-toggle-for="panel1">
            Section 1
            <svg class="ln-icon ln-chevron" aria-hidden="true"><use href="#ln-icon-arrow-down"></use></svg>
        </header>
        <!-- The Collapsible Panel -->
        <section id="panel1" data-ln-toggle="open" class="collapsible">
            <article class="collapsible-body">
                <p>Content 1 (Starts open).</p>
            </article>
        </section>
    </li>
    <li>
        <header data-ln-toggle-for="panel2">
            Section 2
            <svg class="ln-icon ln-chevron" aria-hidden="true"><use href="#ln-icon-arrow-down"></use></svg>
        </header>
        <section id="panel2" data-ln-toggle class="collapsible">
            <article class="collapsible-body">
                <p>Content 2 (Starts closed).</p>
            </article>
        </section>
    </li>
</ul>
```

### Key Anatomy Rules
- **The Wrapper (`data-ln-accordion`)**: Markers for the coordinator. Listens for bubbled events and coordinates siblings.
- **The Trigger (`data-ln-toggle-for`)**: Click target that toggles the target panel ID. The chevron rotates automatically driven by `aria-expanded`.
- **The Panel (`data-ln-toggle`)**: Creates the `ln-toggle` state instance. Value `open` or empty.
- **The Body (`.collapsible-body`)**: Wraps actual content. Padding and margins must live here, not on the parent `.collapsible` (which needs zero padding to collapse to exactly `0px` height).

---

## 3. The Decoupled State & API Contract

The coordinator has **zero public state** in JavaScript. The DOM is the source of truth, and **the HTML attribute is the sole contract**.

### Attributes
- `data-ln-accordion` on the wrapper creates the coordinator instance. It takes no values.

### Events
- **`ln-accordion:change`**: Dispatched on the wrapper after a panel opens and siblings close.
  - `event.detail.target`: The HTML element of the panel that just opened.
  ```js
  document.addEventListener('ln-accordion:change', (e) => {
      console.log('Active panel ID:', e.detail.target.id);
  });
  ```

### Programmatic Control
There are no `open()` or `close()` methods on the coordinator instance. To programmatically change panels, write directly to the target panel's attribute:

```js
// The coordinator catches the bubbled event and closes all siblings automatically.
document.getElementById('panel2').setAttribute('data-ln-toggle', 'open');
```

---

## 4. Integration Patterns

### A. All-Closed by Default
Simply omit the `="open"` value from all panels in the markup.
```html
<section id="panel1" data-ln-toggle class="collapsible">...</section>
```

### B. Persistent Accordion State (Across Page Reloads)
Add `data-ln-persist` to the panels. Each panel saves its state in `localStorage` individually. The coordinator stays completely oblivious. On page load, whichever panel restores as `open` bubbles an event, and the coordinator handles the rest.
```html
<section id="panel1" data-ln-toggle data-ln-persist class="collapsible">...</section>
```

### C. Zero-Configuration Multi-Open
If your requirements change and you want a "multi-open accordion" (where panels toggle independently without closing others), **you do not need any JavaScript options or class re-configuration**. Simply *remove the `data-ln-accordion` attribute* from the wrapper. The individual panels continue to work perfectly.

### D. Nested Accordions
Supported natively out of the box. Scoping is determined by DOM ancestry (using `element.closest('[data-ln-accordion]')`). Opening an inner accordion panel bubbles upwards, but the outer coordinator ignores it, allowing infinite nesting depth without any configuration.

---

## 5. Common Implementation Pitfalls

### 1. Padding on `.collapsible` directly
The `.collapsible` container must have zero padding so it can transition to exactly `0px` height. Placing padding directly on `.collapsible` will cause a thin strip of content to remain visible even when closed. **Padding must live on the `.collapsible-body` child**.

### 2. Double-Binding Attributes
Never place `data-ln-toggle` and `data-ln-toggle-for` on the same element. One element is either a trigger or a panel, never both.

---

## 6. Integration & Source Files

- **Unified Bundle**: Loaded automatically with the main bundle:
  ```html
  <script src="dist/ln-ashlar.iife.js" defer></script>
  ```
- **Standalone IIFE**: For lightweight pages, load the standalone, self-registering IIFE version:
  ```html
  <script src="components/ln-accordion/ln-accordion.js" defer></script>
  ```
- **Active Source (ESM)**: Development source is located at [components/ln-accordion/src/ln-accordion.js](file:///c:/laragon/www/ln-ashlar/components/ln-accordion/src/ln-accordion.js).

---

## Related
- **[`ln-toggle`](../ln-toggle/README.md)** — Binary state primitive.
- **Cross-component principles** — [`docs/architecture/data-flow.md`](../../docs/architecture/data-flow.md).

---

## 🔧 Internals

Source: `components/ln-accordion/ln-accordion.js`. Does not import or require any other component at runtime — it only needs `ln-toggle` loaded so the events it listens for exist (a consumer-side load-order coupling, not a source dependency).

### Instance state

| Field | Set by | Read by |
|---|---|---|
| `dom` | constructor argument | `destroy` (dispatch target, listener detach) |
| `_onToggleOpen` | constructor | `addEventListener`/`removeEventListener` |

That's the entirety of it — no cached toggle list, no active-panel pointer, no DOM reference cache. `dom.querySelectorAll('[data-ln-toggle]')` is re-run on every `ln-toggle:open` instead of cached, since the DOM is small and the event is user-driven (one per click).

### Init

`registerComponent` scans for `[data-ln-accordion]`, instantiates `_component(el)` per match, and reruns the scan via `MutationObserver` on `childList` add / `data-ln-accordion` attribute mutation. `_component(dom)` stores `dom`, binds `_onToggleOpen`, and listens for `ln-toggle:open` on `dom`. No initial DOM read, no event dispatched at init.

### Reaction to a panel opening

`ln-toggle` dispatches `ln-toggle:open` on the panel, which bubbles to the wrapper:

1. `dom.querySelectorAll('[data-ln-toggle]')` — every toggle in the subtree.
2. For each toggle that is not the one just opened and is currently `"open"`: `setAttribute('data-ln-toggle', 'close')`.
3. Each write triggers that toggle's own `MutationObserver`-driven close pipeline (`before-close` cancelable event, class removal, `aria-expanded` sync, persistence write, `ln-toggle:close`) — the accordion never runs this logic itself, it only flips the attribute.
4. After the loop: dispatch `ln-accordion:change` on the wrapper, `detail.target` = the panel that opened.

The accordion is reactive, not a gate: cancelable toggle events are the toggle's own responsibility, and `:change` fires regardless of whether a `before-close` on a sibling gets cancelled.

### Destroy

Guards double-destroy, removes the `ln-toggle:open` listener, dispatches `ln-accordion:destroyed` (`detail.target` = the wrapper), deletes the instance reference. Child `ln-toggle` instances are untouched and keep working independently.

### Event lifecycle

| Event | Direction | `detail` | Notes |
|---|---|---|---|
| `ln-toggle:open` | in (bubble) | — | Only inbound event; `ln-toggle:close` is not listened to |
| `ln-accordion:change` | out | `{ target }` = opened panel | Fires on every open, even if no sibling needed closing |
| `ln-accordion:destroyed` | out | `{ target }` = wrapper | Inside `destroy()` |

### Nested accordions

Two `closest('[data-ln-accordion]')` ownership checks in `_onToggleOpen`: an early exit if the bubbled event's nearest accordion isn't `dom` (so an outer wrapper ignores an inner panel's open), and a per-candidate filter in the cascade scan (so nested-accordion toggles are skipped when closing siblings). Ownership is DOM ancestry, not JS bookkeeping — each accordion stays oblivious to any other accordion in the tree, supporting arbitrary nesting depth.

### Why a separate `ln-toggle`

Most toggle use cases (sidebars, dropdowns, expandable cards) aren't accordions. Splitting single-open coordination out keeps `ln-toggle` a pure individual-state primitive and lets `ln-accordion` opt in to the extra behavior at the wrapper level, driven entirely by attribute writes rather than instance method calls.

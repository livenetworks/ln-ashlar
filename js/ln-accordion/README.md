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
            <svg class="ln-icon ln-chevron" aria-hidden="true"><use href="#ln-arrow-down"></use></svg>
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
            <svg class="ln-icon ln-chevron" aria-hidden="true"><use href="#ln-arrow-down"></use></svg>
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
  <script src="js/ln-accordion/ln-accordion.js" defer></script>
  ```
- **Active Source (ESM)**: Development source is located at [js/ln-accordion/src/ln-accordion.js](file:///c:/laragon/www/ln-ashlar/js/ln-accordion/src/ln-accordion.js).

---

## Related
- **[`ln-toggle`](../ln-toggle/README.md)** — Binary state primitive.
- **Architecture deep-dive** — [`docs/js/accordion.md`](../../docs/js/accordion.md).
- **Cross-component principles** — [`docs/architecture/data-flow.md`](../../docs/architecture/data-flow.md).

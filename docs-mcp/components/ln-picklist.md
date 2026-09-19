---
name: ln-picklist
classification: simple
status: stable
domain: frontend
summary: A dual-list selection primitive where checking a checkbox moves the <li> via appendChild into selected, and unchecking returns it to available.
source: components/ln-picklist/src/ln-picklist.js
tags: [forms, selection, lists, checkbox]
---

# 🔀 ln-picklist

> **Classification:** 🟢 Simple Component / Two-List Selection Primitive  
> Applied to a container (`data-ln-picklist`) wrapping `<ul data-ln-picklist-list="available">` and `<ul data-ln-picklist-list="selected">`.
> It listens for native `change` events on child `<input type="checkbox">`: when `checked` is true, it moves the parent `<li>` via
> `appendChild` into the `selected` list; when unchecked, it returns it to `available`. Native checkboxes drive both DOM placement
> and form submission (`name`/`value`) with zero hidden inputs or state mirrors.

---

## 1. Core Behavior & Responsibility

The `ln-picklist` component is a two-list selection primitive that transfers `<li>` items between an "available" list and a "selected" list in response to native checkbox `change` events.

- **Core Role:** Moves an `<li>` between an "available" list and a "selected" list in response to the `change` event of the checkbox it contains.
- **The checkbox is the state.** Its `checked` property and the list the item currently sits in are the same fact. `name` / `value` carry the selection to the server natively — unchecked boxes are not submitted — so the component keeps **no hidden inputs, no state attribute and no JS mirror**.
- Located in [`components/ln-picklist/src/ln-picklist.js`](../../components/ln-picklist/src/ln-picklist.js).

> [!IMPORTANT]
> **What the component does NOT do (Orthogonality Doctrine):**
> - **Does NOT search or filter** — compose [`ln-search`](./ln-search.md) against each list's `id`; it hides non-matching children on its own.
> - **Does NOT render counts, empty states or "select all"** — presentation and bulk policy belong to the page or a Layer 2 coordinator.
> - **Does NOT restore source order** — an unchecked item is appended to the end of the available list.
> - **Does NOT touch foreign attributes** — a moved item keeps any `data-ln-search-hide` an `ln-search` put on it; cross-component reconciliation is a coordinator's job.

---

## 2. Minimal HTML Markup & Usage Variants

### Base HTML Markup

```html
<section data-ln-picklist>
    <ul data-ln-picklist-list="available">
        <li>
            <label>
                <input type="checkbox" name="countries[]" value="de">
                Germany
            </label>
        </li>
    </ul>

    <ul data-ln-picklist-list="selected"></ul>
</section>
```

Items rendered into `selected` must carry `checked`. That agreement is the component's entire contract.

### Variant 1: Searchable lists (composition with `ln-search`)

```html
<section data-ln-picklist>
    <section>
        <h3 id="pool-h">Available</h3>
        <label class="search">
            <svg class="ln-icon" aria-hidden="true"><use href="#ln-icon-search"></use></svg>
            <input type="search" data-ln-search-for="pool" placeholder="Search…">
            <button type="button" data-ln-search-clear aria-label="Clear search">
                <svg class="ln-icon" aria-hidden="true"><use href="#ln-icon-x"></use></svg>
            </button>
        </label>
        <ul data-ln-picklist-list="available" id="pool" data-ln-search aria-labelledby="pool-h">…</ul>
    </section>

    <section>
        <h3 id="picked-h">Selected</h3>
        <ul data-ln-picklist-list="selected" id="picked" data-ln-search aria-labelledby="picked-h">…</ul>
    </section>
</section>
```

The search input's own `change` bubbles to the picklist root and is ignored: the component only acts on checkboxes whose `<li>` sits directly in one of its two lists.

### Variant 2: Read-only

```html
<section data-ln-picklist="disabled"> … </section>
```

Checking is reverted rather than merely ignored, so the DOM cannot drift out of agreement with itself.

---

## 3. Declarative API Contract (Attributes & Events)

### Attributes Table

| Attribute | Element | Type / Values | Default | Description |
|---|---|---|---|---|
| `data-ln-picklist` | Root | `""` \| `"disabled"` | `""` | Initializes the component. `"disabled"` blocks moving. |
| `data-ln-picklist-list` | `<ul>` / `<ol>` | `available` \| `selected` | — | Marks which list is which. Both are required. |

The item carries no attribute of its own — it is resolved from the checkbox that changed.

### Programmatic JS API

Instance interfaces accessed via `element.lnPicklist`:

| Helper | Signature | Returns | Description |
|---|---|---|---|
| `element.lnPicklist.enable` | `()` | `void` | Allows moving (sets `data-ln-picklist=""`). |
| `element.lnPicklist.disable` | `()` | `void` | Blocks moving (sets `data-ln-picklist="disabled"`). |
| `element.lnPicklist.destroy` | `()` | `void` | Detaches the listener and removes the instance property. |

### Events API

| Event | Direction | Cancelable | Description | `detail` Object |
|---|---|---|---|---|
| `ln-picklist:before-move` | Emits | Yes | Dispatched before the item is re-parented. Canceling aborts the move and reverts the checkbox. | `{ item: HTMLElement, from: HTMLElement, to: HTMLElement, checkbox: HTMLInputElement }` |
| `ln-picklist:move` | Emits | No | Dispatched after the item has been re-parented. | `{ item: HTMLElement, from: HTMLElement, to: HTMLElement, checkbox: HTMLInputElement }` |
| `ln-picklist:enabled` | Emits | No | Dispatched when the root attribute transitions away from `"disabled"`. | `{ target: HTMLElement }` |
| `ln-picklist:disabled` | Emits | No | Dispatched when the root attribute becomes `"disabled"`. | `{ target: HTMLElement }` |
| `ln-picklist:destroyed` | Emits | No | Dispatched when the instance is destroyed. | `{ target: HTMLElement }` |

---

## 4. State & Persistence

There is no component state to persist. The selection lives entirely in the DOM: which `<li>` is in which list, and the `checked` property of its checkbox. A form submit serializes it natively.

**Form reset** is the one case the DOM cannot handle alone. Resetting a form restores every control to its default *silently* — the spec fires no `change` and no `input` for the controls, only `reset` on the form — so the component would never hear about it and the items would stay in whichever list the user left them while their boxes flipped back. The component therefore snapshots the authored placement at boot and, on `reset`, re-appends each item to the list it came from. The work is deferred with `setTimeout(…, 0)` because `reset` fires *before* the controls are restored, and skipped when another listener cancelled the reset.

---

## 5. CSS Styling & Behavioral Concept

`@mixin picklist` (bound to `[data-ln-picklist]` in `theme/components/_picklist.scss`) lays the two lists side by side and applies `check-list-outline` to each — a vertical stack of checkbox pills.

`check-list-outline` rather than `check-list` is deliberate: `@mixin pill` hides the input with `display: none`, which removes the checkbox from the tab order. Here the checkbox **is** the control, so `pill-outline`'s `> input { display: revert; }` is required. The focus ring is delivered by `label:has(> input:focus-visible)`.

Each list is a scroll surface (`max-height` + `overflow-y: auto`) so a hundred items do not stretch the page.

---

## 6. Accessibility (ARIA) & Common Pitfalls

### ARIA & Keyboard

- **Native semantics throughout.** The accessible name of each control is the item's own label text, and `checked` conveys selection — nothing needs to change when an item moves, which is why this design uses checkboxes rather than action buttons.
- **Focus survives the move.** Re-parenting a node that holds focus blurs it to `<body>` in Chromium, so focus is restored to the checkbox afterwards — but only when it genuinely had focus, so a synthetic `change` cannot steal it.
- Give each list an `aria-labelledby` pointing at its pane heading.

### Common Pitfalls & Anti-patterns

> [!CAUTION]
> 1. **Mismatched initial markup:** rendering a checked item in `available`, or an unchecked item in `selected`, leaves the two halves of the contract disagreeing until the user touches that checkbox.
> 2. **Omitting one of the two lists:** the component logs a warning and does not attach its listener. With `data-ln-debug` on `<body>` the diagnostic is drawn in place by `ln-picklist-dev.scss`.
> 3. **Expecting a name on the item:** the submitted value is the checkbox's own `name`/`value`. Use one array-style `name` and a distinct `value` per item.
> 4. **Expecting the available list to keep its order:** unchecked items are appended, not reinserted at their original index.

---

## 7. Flow Diagram & Lifecycle

```mermaid
sequenceDiagram
    autonumber
    actor User
    participant Box as Checkbox
    participant Root as [data-ln-picklist]
    participant JS as ln-picklist.js
    participant Lists as available / selected

    Root->>JS: Component mount
    JS->>Lists: Resolve both lists
    alt a list is missing
        JS-->>Root: console.warn, no listener attached
    else both present
        JS->>Root: addEventListener('change')
    end

    User->>Box: Toggle
    Box->>Root: change (bubbles)
    JS->>JS: Resolve checkbox → li → parent list
    alt target is not an item of this picklist
        JS-->>Root: ignore
    else disabled
        JS->>Box: revert checked
    else same list
        JS-->>Root: ignore (no-op move)
    else
        JS->>Root: Emit cancelable 'ln-picklist:before-move'
        alt canceled
            JS->>Box: revert checked
        else allowed
            JS->>Lists: appendChild(item)
            JS->>Box: restore focus (only if it had it)
            JS->>Root: Emit 'ln-picklist:move'
        end
    end
```

---

## 8. Related Components

- [`ln-search`](./ln-search.md) — filters each list; composed, never embedded.
- [`ln-sortable`](./ln-sortable.md) — the lifecycle and attribute-driven enable/disable shape this component follows.
- [`ln-filter`](./ln-filter.md) — checkbox groups that filter a view rather than move items.
- [`ln-list`](./ln-list.md) — a single list presenter with selection, virtual scrolling and templates.

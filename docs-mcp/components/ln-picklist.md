---
name: ln-picklist
classification: simple
status: stable
domain: frontend
summary: A dual-list selection primitive where checking a checkbox transfers the <li> into the selected list, and unchecking returns it to available. Supports declarative selection capping via data-ln-picklist-max.
source: components/ln-picklist/src/ln-picklist.js
tags: [forms, selection, lists, checkbox, picklist]
---

# 🔀 ln-picklist

> **Classification:** 🟢 Simple Component / Two-List Selection Primitive  
> Applied to a container (`data-ln-picklist`) wrapping `<ul data-ln-picklist-list="available">` and `<ul data-ln-picklist-list="selected">`.
> On mount, it automatically scans and transfers any `<input type="checkbox" checked>` into the `selected` list. It then listens for native
> `change` events on child checkboxes: checking moves the parent `<li>` via `appendChild` into `selected`; unchecking returns it to `available`.
> Native checkboxes drive DOM placement, optional selection caps (`data-ln-picklist-max`), and form submission (`name`/`value`) with zero hidden inputs or state mirrors.

---

## 1. Core Behavior & Responsibility

The `ln-picklist` component is an autonomous two-list selection primitive designed for picking subsets from large pools (e.g., countries, tags, permissions, assignees):

- **Single Source of Truth:** The checkbox *is* the state. Its `checked` property and its placement in either the `available` or `selected` list are the exact same fact.
- **Automatic Hydration:** Backend templates render all options directly into the first list (`data-ln-picklist-list="available"`). Items marked with native `checked` are automatically transferred into the `selected` list upon component mount.
- **Native Form Submission:** When the wrapping `<form>` submits, the browser natively collects all checked checkboxes with their `name` and `value`. No JS serialization or hidden inputs are involved.
- **Selection Capping (`data-ln-picklist-max`):** Declaratively limits the maximum number of items that can be transferred to the `selected` list. Attempts exceeding the cap are blocked, reverted, and emit `ln-picklist:max-reached`.
- **Form Reset Integration:** When the parent `<form>` resets, the component defers and re-syncs both lists according to each input's native `defaultChecked` property, maintaining relative authored order.

> [!IMPORTANT]
> **Orthogonality Doctrine (What the component does NOT do):**
> - **Does NOT implement its own search or filtering:** Compose [`ln-search`](./ln-search.md) with canonical `<search>` landmarks targeting each list's `id`.
> - **Does NOT render counter badges, empty states, or "Select All":** Presentation and bulk policies belong to the page or a Layer 2 coordinator.
> - **Does NOT touch foreign attributes:** A moved item preserves all existing classes and data attributes (such as `data-ln-search-hide`).

---

## 2. Minimal HTML Markup & Usage Variants

### Base HTML Markup (Automatic Initial Hydration)

Render all options into the `available` list. Preselected items simply include the native `checked` attribute:

```html
<section data-ln-picklist>
    <ul data-ln-picklist-list="available">
        <li>
            <label>
                <input type="checkbox" name="countries[]" value="de">
                Germany
            </label>
        </li>
        <li>
            <label>
                <input type="checkbox" name="countries[]" value="nl" checked>
                Netherlands
            </label>
        </li>
    </ul>

    <ul data-ln-picklist-list="selected"></ul>
</section>
```

Upon initialization, `ln-picklist` automatically transfers the Netherlands `<li>` into the `selected` list.

### Variant 1: Maximum Selection Cap (`data-ln-picklist-max`)

Enforce an upper bound on allowed selections directly in HTML:

```html
<section data-ln-picklist data-ln-picklist-max="3">
    <ul data-ln-picklist-list="available">
        <li><label><input type="checkbox" name="roles[]" value="admin"> Administrator</label></li>
        <li><label><input type="checkbox" name="roles[]" value="editor"> Editor</label></li>
        <li><label><input type="checkbox" name="roles[]" value="viewer"> Viewer</label></li>
        <li><label><input type="checkbox" name="roles[]" value="billing"> Billing</label></li>
    </ul>

    <ul data-ln-picklist-list="selected"></ul>
</section>
```

When 3 items are selected, checking a 4th item reverts the checkbox and emits `ln-picklist:max-reached`.

### Variant 2: Searchable Lists (Composed with `ln-search`)

Compose `ln-search` controls above each list using Ashlar's canonical `<search>` landmark:

```html
<section data-ln-picklist>
    <section>
        <h3 id="pool-h">Available</h3>
        <search aria-label="Search available">
            <svg class="ln-icon" aria-hidden="true"><use href="#ln-icon-search"></use></svg>
            <input type="search" data-ln-search-for="pool" placeholder="Search available…">
            <button type="button" data-ln-search-clear aria-label="Clear search">
                <svg class="ln-icon" aria-hidden="true"><use href="#ln-icon-x"></use></svg>
            </button>
        </search>
        <ul data-ln-picklist-list="available" id="pool" data-ln-search="" aria-labelledby="pool-h">…</ul>
    </section>

    <section>
        <h3 id="picked-h">Selected</h3>
        <search aria-label="Search selected">
            <svg class="ln-icon" aria-hidden="true"><use href="#ln-icon-search"></use></svg>
            <input type="search" data-ln-search-for="picked" placeholder="Search selected…">
            <button type="button" data-ln-search-clear aria-label="Clear search">
                <svg class="ln-icon" aria-hidden="true"><use href="#ln-icon-x"></use></svg>
            </button>
        </search>
        <ul data-ln-picklist-list="selected" id="picked" data-ln-search="" aria-labelledby="picked-h">…</ul>
    </section>
</section>
```

The search inputs' `input` and `change` events bubble safely to the root and are ignored: `ln-picklist` only reacts to checkboxes within its two child lists.

### Variant 3: Disabled (Read-only)

```html
<section data-ln-picklist="disabled"> … </section>
```

Clicking checkboxes while disabled is rejected immediately by reverting `checked` back to its previous state without moving the DOM node.

---

## 3. Declarative API Contract (Attributes & Events)

### Attributes Table

| Attribute | Element | Type / Values | Default | Description |
|---|---|---|---|---|
| `data-ln-picklist` | Root | `""` \| `"disabled"` | `""` | Initializes the component. `"disabled"` blocks item transfers. |
| `data-ln-picklist-max` | Root | integer (e.g. `"5"`) | — | Maximum selection cap. Excess transfers are blocked and emit `ln-picklist:max-reached`. |
| `data-ln-picklist-list` | `<ul>` / `<ol>` | `available` \| `selected` | — | Marks which list is which. Both are required. |

### Programmatic JS API

Instance methods accessed via `element.lnPicklist`:

| Helper | Signature | Returns | Description |
|---|---|---|---|
| `element.lnPicklist.enable` | `()` | `void` | Enables transfers (sets `data-ln-picklist=""`). |
| `element.lnPicklist.disable` | `()` | `void` | Disables transfers (sets `data-ln-picklist="disabled"`). |
| `element.lnPicklist.sync` | `()` | `void` | Re-scans items and aligns DOM placement with checkbox states. |
| `element.lnPicklist.destroy` | `()` | `void` | Detaches listeners and cleans up the instance reference. |

### Events API

All events bubble from the component root (`{ bubbles: true }`):

| Event | Direction | Cancelable | Description | `detail` Object |
|---|---|---|---|---|
| `ln-picklist:max-reached` | Emits | No | Dispatched when a move to `selected` is blocked by `data-ln-picklist-max`. Reverts the checkbox. | `{ max: number, item: HTMLElement, checkbox: HTMLInputElement, count: number }` |
| `ln-picklist:before-move` | Emits | Yes | Dispatched before an item is re-parented. Calling `preventDefault()` cancels the move and reverts the checkbox. | `{ item: HTMLElement, from: HTMLElement, to: HTMLElement, checkbox: HTMLInputElement }` |
| `ln-picklist:move` | Emits | No | Dispatched after an item has been re-parented into the target list. | `{ item: HTMLElement, from: HTMLElement, to: HTMLElement, checkbox: HTMLInputElement }` |
| `ln-picklist:enabled` | Emits | No | Dispatched when root attribute transitions away from `"disabled"`. | `{ target: HTMLElement }` |
| `ln-picklist:disabled` | Emits | No | Dispatched when root attribute transitions to `"disabled"`. | `{ target: HTMLElement }` |
| `ln-picklist:destroyed` | Emits | No | Dispatched when the instance is destroyed. | `{ target: HTMLElement }` |

---

## 4. CSS Styling & Behavioral Concept

The styling is driven by `@mixin picklist` in [`theme/components/_picklist.scss`](../../theme/components/_picklist.scss):

- **Grid Layout:** Lays out both panes side-by-side using `@include grid-2` with `var(--size-md)` gap.
- **Outlined Checkbox Pills:** Both lists apply `@include check-list-outline`. Unlike `@mixin pill` (which hides the `<input>` with `display: none`), `check-list-outline` keeps native `<input type="checkbox">` visible and keyboard-focusable via `display: revert`.
- **Vertical Rhythm & Scroll:** Lists maintain `--max-height: 20rem` with `overflow-y: auto`, ensuring long candidate pools do not stretch the viewport.
- **Focus Ring:** Focus outlines are applied via `[data-ln-picklist-list] li label:has(> input:focus-visible)`.
- **Disabled Treatment:** When `[data-ln-picklist="disabled"]` is active, lists switch to `var(--fg-muted)` and labels receive `cursor: not-allowed`.

---

## 5. Accessibility (ARIA) & Common Pitfalls

### ARIA & Keyboard Mechanics

- **Native Checkbox Semantics:** Each choice is an `<input type="checkbox">` wrapped in a `<label>`. Screen readers announce native state (`"checked"` / `"unchecked"`) and keyboard users toggle choices via `Space`.
- **Focus Preservation:** Re-parenting focused DOM elements blurs focus to `<body>` in Chromium. `ln-picklist` preserves focus by calling `checkbox.focus()` after `appendChild` only when the element was actively focused.
- **List Labelling:** Always attach `aria-labelledby` on each `<ul data-ln-picklist-list>` pointing to its corresponding section heading (e.g., `aria-labelledby="pool-heading"`).

### Common Pitfalls & Anti-patterns

> [!CAUTION]
> 1. **Using `<select multiple>` instead of checkboxes:** Native multi-selects require complex Ctrl/Cmd keyboard mechanics, cannot embed rich HTML/icons, and fail to submit unhighlighted options natively. Use `ln-picklist` with checkboxes.
> 2. **Wrapping search buttons inside `<label class="search">`:** Anti-pattern. Always use the semantic HTML5 `<search>` element.
> 3. **Omitting either `available` or `selected` list:** Both lists are mandatory. Omitting one triggers a console warning and halts initialization.
> 4. **Manually syncing hidden inputs:** Strictly forbidden. The checkbox itself carries `name="fieldName[]"` and `value`. Unchecked boxes are omitted from standard form payloads automatically.

---

## 6. Sequence & Lifecycle Flow

```mermaid
sequenceDiagram
    autonumber
    actor User
    participant Box as Checkbox
    participant Root as [data-ln-picklist]
    participant JS as ln-picklist.js
    participant Lists as available / selected

    Root->>JS: Mount & scan DOM
    JS->>JS: Snapshot initial authored item order
    JS->>Lists: sync(): Transfer checked items to selected
    JS->>Root: addEventListener('change')

    User->>Box: Click checkbox (toggle checked)
    Box->>Root: change (bubbles)
    JS->>JS: Filter event: Resolve li & parent list

    alt Picklist is disabled
        JS->>Box: Revert checked state
    else Target is selected & count >= max (data-ln-picklist-max)
        JS->>Box: Revert checked state
        JS->>Root: Dispatch 'ln-picklist:max-reached'
    else Normal Move
        JS->>Root: Dispatch cancelable 'ln-picklist:before-move'
        alt Canceled by consumer (e.preventDefault())
            JS->>Box: Revert checked state
        else Allowed
            JS->>Lists: appendChild(li)
            JS->>Box: Restore focus (if previously focused)
            JS->>Root: Dispatch 'ln-picklist:move'
        end
    end

    Note over User,JS: On Form Reset (form.reset())
    Root->>JS: reset event on parent form
    JS->>JS: Deferred setTimeout(0): sync()
    JS->>Lists: Re-append items in original order matching defaultChecked
```

---

## 7. Related Components & Coordinators

- [`ln-search`](./ln-search.md) — Composed on top of each picklist pane to filter available and selected pools without coupling.
- [`ln-sortable`](./ln-sortable.md) — Provides drag-and-drop reordering for selected items if explicit manual sequencing is needed.
- [`ln-filter`](./ln-filter.md) — Inline checkbox pill filters used to filter tabular views rather than transferring items between pools.
- [`ln-table`](./ln-table.md) — Full data grid component with column filtering and sorting.

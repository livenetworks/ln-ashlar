# ln-sort

A zero-dependency, event-driven **Sort Control Primitive** that announces a sort intent on a
target element via a cancelable event, letting tables, lists, or custom integrations intercept
it or fall back to a built-in DOM-reorder default.

It follows the same contract shape as `ln-search`: dispatch-only-to-target, cancelable,
default-DOM-behaviour fallback. Unlike `ln-filter`, it never dual-dispatches to itself.

---

## 🧭 Philosophy & Architecture

1. **No cycle logic in JS.** A click reads `data-ln-sort-dir` off the clicked button, writes it to
   `data-ln-sort-state` on the root, and dispatches. The circular order
   `none → asc → desc → none` is produced entirely by CSS — only one `<button data-ln-sort-dir>`
   is visible at a time, selected by `[data-ln-sort-state]` on the root. See
   `scss/config/mixins/_sort.scss`.
2. **Field is optional.** Author `data-ln-sort-field="name"` when the target is data-driven
   (server needs a name, not an index). Omit it inside a `<th>` to fall back to
   `th.cellIndex` — SSR/DOM-only, resolved once at construction, never bridged to `field`.
   The dispatched payload always carries both keys, exactly one non-null:
   `{ field: string|null, column: number|null, direction, targetId }`.
3. **Single sort, mutual exclusion & multi-control sync.** Every instance listens for
   `ln-sort:change` on its OWN target. When an incoming event's field/column doesn't match this
   instance's own, it resets its own `data-ln-sort-state` to `"none"`. When an incoming event matches
   the same field/column, duplicate controls (e.g. table header button and mobile toolbar)
   synchronize their `data-ln-sort-state` in real time.
4. **Deferred initialization via `queueBoot`.** Restoring saved sort (`data-ln-persist`) or booting
   pre-authored `data-ln-sort-state="asc"|"desc"` is deferred via `queueBoot` to ensure consumers
   (`ln-table`, `ln-list`, `ln-data-store`) have finished initializing before the initial sort fires.
5. **Type is inferred once per sort, not per pair.** `ln-core.detectValueType` scans the current
   value set; if every non-empty value is a finite number, comparison is numeric, else
   `localeCompare` via `ln-core.getLocale`. Per-pair type inference breaks comparator
   transitivity and produces wrong ordering — never do it.

---

## ✅ Canonical Markup

```html
<th>
	<span>Name</span>
	<ul data-ln-sort="users-table" data-ln-sort-field="name" data-ln-sort-state="none">
		<li><button type="button" data-ln-sort-dir="asc" aria-label="Sort ascending"><svg class="ln-icon" aria-hidden="true"><use href="#ln-icon-arrows-sort"></use></svg></button></li>
		<li><button type="button" data-ln-sort-dir="desc" aria-label="Sort descending"><svg class="ln-icon" aria-hidden="true"><use href="#ln-icon-arrow-up"></use></svg></button></li>
		<li><button type="button" data-ln-sort-dir="none" aria-label="Remove sort"><svg class="ln-icon" aria-hidden="true"><use href="#ln-icon-arrow-down"></use></svg></button></li>
	</ul>
</th>
```

**Icon convention — READ BEFORE COPYING THIS MARKUP.** Each button carries the icon of the sort
STATE it is visible in, never the icon of the direction it sets:

| Button | Visible when `data-ln-sort-state` = | Icon it carries |
|---|---|---|
| `data-ln-sort-dir="asc"` | `none` | `#ln-icon-arrows-sort` |
| `data-ln-sort-dir="desc"` | `asc` | `#ln-icon-arrow-up` |
| `data-ln-sort-dir="none"` | `desc` | `#ln-icon-arrow-down` |

**This is not a typo.** The `dir="desc"` button contains an UP arrow. The visible button always
performs the NEXT action (clicking `dir="desc"` sorts descending), but its icon always reports the
CURRENT state (the column is currently ascending — hence the up arrow). If the icon instead
matched the button's own `data-ln-sort-dir`, the header would visually lie about its own sort
order the instant the column reaches `state="asc"`: the user would see a down-arrow next to a
column that is actually sorted up. Do not "fix" the icons to match `data-ln-sort-dir` when
hand-authoring markup — that reintroduces the exact bug this convention exists to prevent. `content`
cannot substitute for this — these icons are an SVG sprite via `<use href>`, not a font glyph a
`::before { content }` rule could swap (see `docs/architecture/reference.md` §Icons).

- **SSR table column** — omit `data-ln-sort-field`; the `<ul>` must be a descendant of the `<th>`
  so the `th.cellIndex` fallback resolves. `data-ln-sort-field` and the SSR index path are never
  bridged — setting a field on an SSR-table column leaves `column` null and `ln-table`'s SSR sort
  has nothing to key off. Don't do both.
- **Data-driven table column** — set `data-ln-sort-field` to the same value as the `<th>`'s
  `data-ln-table-col`.
- **Plain list** — target a generic `<ul>`/`<li>` container by `id`; set
  `data-ln-sort-items="<selector>"` for deep targeting (mirrors `data-ln-search-items`).

---

## 🛠️ Declarative API Contract

### HTML Attributes

| Attribute | Elements | Description |
| :--- | :--- | :--- |
| `data-ln-sort` | `<ul>` (root) | Component root. Value is the `id` of the target being sorted. |
| `data-ln-sort-field` | Same as root | Opt-in. The record field name (data-driven). Omit for the `th.cellIndex` fallback (SSR/DOM only). |
| `data-ln-sort-state` | Same as root | *State*. `"none" \| "asc" \| "desc"`. Drives which trigger button is visible via CSS. Observed by `MutationObserver`. |
| `data-ln-sort-items` | Same as root | Opt-in. Deep CSS selector for default-DOM-behaviour reordering (mirrors `data-ln-search-items`). |
| `data-ln-sort-dir` | `<button>` (inside root) | `"asc" \| "desc" \| "none"`. Identifies which action this trigger performs. |
| `data-ln-persist` | Same as root | Opt-in. Persists `{ field, column, direction }` to `localStorage`. Give each `[data-ln-sort]` its own value (or `id`) — persistence is per-instance, not per-table. |
| `data-ln-hash` | Same as root | Opt-in. Synchronizes sort state to URL hash fragment (e.g. `#users-sort:price.asc`). Value is custom namespace; if empty defaults to `[targetId]-sort`. |

### JavaScript API (`el.lnSort`)

| Member | Type | Description |
| :--- | :--- | :--- |
| `targetId` | `string` | The `id` of the target element. |
| `field` | `string \| null` | The authored field name, or `null`. |
| `column` | `number \| null` | The resolved `th.cellIndex` fallback, or `null`. |
| `nsKey` | `string \| null` | The resolved URL hash namespace, or `null`. |
| `hashEnabled` | `boolean` | True if URL hash synchronization is active on this instance. |
| `destroy()` | `() => void` | Removes listeners and tears down the instance. |


---

## ⚡ DOM Events

### `ln-sort:change`

Dispatched on the **target** element (never on the sort control itself) whenever a trigger button
is clicked, or on persisted-state restore.
- **Cancelable**: Yes. `e.preventDefault()` disables the default DOM-reorder and hands the intent
  fully to the consumer (e.g. `ln-table`, `ln-list`).
- **Payload (`detail`)**: `{ field: string|null, column: number|null, direction: 'asc'|'desc'|'none', targetId: string }`.

---

## ⚠️ Common Pitfalls

- **Setting both `data-ln-sort-field` and expecting the index fallback to also work.** They are
  never bridged. Pick one per instance based on the mode (SSR → index fallback; data-driven →
  field).
- **Multi-column sort.** Not supported — single sort only. Multiple `[data-ln-sort]` instances
  targeting the same target enforce mutual exclusion automatically (see Philosophy §3).
- **Expecting JS to own the click cycle.** It doesn't — the circular order is CSS-driven via
  `[data-ln-sort-state]`. If the three trigger buttons aren't authored per the canonical markup,
  the cycle breaks visually even though the JS click handling still works.
- **Persisting without a stable key.** `data-ln-persist` with no value falls back to `el.id`; a
  bare `<ul data-ln-sort data-ln-persist>` with no `id` silently skips persistence
  (see `ln-core.persistGet`/`persistSet` — `console.warn`s once).

---

## 🔧 Internals

Source: `js/ln-sort/ln-sort.js`. One instance per `[data-ln-sort]`, stored at `element.lnSort`.

### The three-step click (no cycle logic)

`_onClick` reads `data-ln-sort-dir` off the clicked button and sets `data-ln-sort-state` on the root,
which triggers `_syncAttribute` and `_apply(direction)`. `_apply()` updates `aria-sort` on parent `<th>`,
dispatches `ln-sort:change` on the target, and — only if not prevented — runs `_defaultSort`. There is no
`if (current === 'asc') then 'desc'` branch anywhere in this file; the SCSS cycle in
`scss/config/mixins/_sort.scss` decides which button is even clickable next.

### Mutual exclusion & Multi-Control Sync

Each instance adds its `ln-sort:change` listener to the resolved **target** element. When an incoming
event's field/column matches this instance's own, duplicate controls sync their `data-ln-sort-state`
and `aria-sort`. When an incoming event belongs to a different column, the losing instance resets to `"none"`
and drops its persist key.

### Default DOM behaviour

Only runs when the consumer does not call `preventDefault()`. Reorders `target.children` (or
`data-ln-sort-items` matches) by moving nodes into a `DocumentFragment` and re-appending — a single
reflow, not N individual moves. Value extraction: `readValue` on the `[data-ln-field="<field>"]`
descendant if `field` is set, else `readValue(item)` directly. The `column` index fallback is
**never** consulted here — it exists solely to populate the event payload for SSR/DOM table
consumers; see README "Field is optional" above.

### Persistence & Boot

`data-ln-persist` on the root, restored in the constructor via `persistGet('sort', dom)` and
applied via `_apply(saved.direction, true)` through `queueBoot`. Authoring `data-ln-sort-state="asc"|"desc"`
is also applied safely at boot via `queueBoot`.

### Destroy

Removes the click listener (root) and the `ln-sort:change` listener (target, if resolved). Does
not restore the DOM to its pre-sort order — that's a rendering side effect, not the component's
own teardown responsibility (same doctrine as `ln-search.destroy()`).

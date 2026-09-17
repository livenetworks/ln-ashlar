# ✅ Component Refactor Checklist

Two passes tracked per component:

- **Attrs** — attribute reactivity inverted to the shared observer (`defineAttrs` + `effects`,
  replacing `extraAttributes` / `onAttributeChange`). Reference: `ln-data-store`.
- **Refactor** — general refactor pass over the component.

Attrs legend:
- `n/a` — **verified by reading the source**: nothing to invert.
- `[x]` — verified and converted to `defineAttrs`.
- `—` / `[ ]` — grep-classified only, **not yet verified**.
- `partial` — the registration half is converted; a value is still blocked on a ruling.
- `skip?` — read, but blocked on a ruling. See *Open rulings* at the bottom.

| Component | Attrs | Refactor |
|---|:---:|:---:|
| `ln-accordion` | n/a | [ ] |
| `ln-ajax` | n/a | [ ] |
| `ln-api-connector` | skip? | [ ] |
| `ln-api-queue` | [x] | [ ] |
| `ln-autoresize` | n/a | [ ] |
| `ln-autosave` | skip? | [ ] |
| `ln-chart` | partial | [ ] |
| `ln-circular-progress` | [x] | [ ] |
| `ln-confirm` | skip? | [ ] |
| `ln-couchdb-connector` | [ ] | [ ] |
| `ln-data-coordinator` | [ ] | [ ] |
| `ln-data-store` | [x] | [ ] |
| `ln-date` | [ ] | [ ] |
| `ln-debug` | — | [ ] |
| `ln-dropdown` | — | [ ] |
| `ln-editor` | — | [ ] |
| `ln-external-links` | — | [ ] |
| `ln-fill` | — | [ ] |
| `ln-filter` | [ ] | [ ] |
| `ln-form` | — | [ ] |
| `ln-http` | — | [ ] |
| `ln-icon` | — | [ ] |
| `ln-include` | — | [ ] |
| `ln-key` | [ ] | [ ] |
| `ln-link` | — | [ ] |
| `ln-list` | [ ] | [ ] |
| `ln-modal` | [ ] | [ ] |
| `ln-nav` | [ ] | [ ] |
| `ln-number` | [ ] | [ ] |
| `ln-options` | — | [ ] |
| `ln-persist` | — | [ ] |
| `ln-popover` | [ ] | [ ] |
| `ln-progress` | [ ] | [ ] |
| `ln-router` | [ ] | [ ] |
| `ln-search` | [ ] | [ ] |
| `ln-slug` | — | [ ] |
| `ln-sort` | [ ] | [ ] |
| `ln-sortable` | [ ] | [ ] |
| `ln-stat` | — | [ ] |
| `ln-table` | [ ] | [ ] |
| `ln-table-coordinator` | — | [ ] |
| `ln-tabs` | [ ] | [ ] |
| `ln-time` | [ ] | [ ] |
| `ln-toast` | — | [ ] |
| `ln-toggle` | [ ] | [ ] |
| `ln-tooltip` | — | [ ] |
| `ln-translations` | — | [ ] |
| `ln-ui-coordinator` | — | [ ] |
| `ln-upload` | — | [ ] |
| `ln-validate` | — | [ ] |

**Totals:** 50 components. Attrs — 1 done, 23 to do, 26 not applicable. Refactor — 0 done.

## Reference pattern — SUPERSEDED

> The abbreviated `ln-data-store` snippet that used to sit here was a simplification
> and it misled this pass. The real registration has **four** effects and **no**
> `onAttrChange`; `defineAttrs` has **five** entries including a custom reader
> `_readStale` (`src/ln-data-store.js:208`). Read the source, not a snippet.
>
> Superseded outright by the ruling below: the two-declaration form
> (`defineAttrs` spec + `effects` key) is being replaced by a single per-component
> table. `ln-data-store` itself is being refactored onto it.

## Notes

- The Attrs column is classified by grep signature, not by reading each component. A `—` means
  "declares no attribute reactivity today", not "verified correct".
- `ln-progress` is reported to be deliberately exempt in `3628e7d`, but declares the legacy path.
  Read that commit message before starting it.

## Hazard — declaration-only attributes

Removing an `extraAttributes` list is safe **only** when every name in it also appears
as a literal somewhere else in the component's `src/`. The schema generator
(`ATTR_RE = /data-ln-[a-z0-9-]+/g`, `scripts/sync-ln-schemas.mjs:22`) scans literal
occurrences anywhere in the source with comments stripped — it never read
`extraAttributes` as such. Verified after each conversion so far:
`sync:ln-schemas:check` stays fresh, and e.g. `data-ln-circular-progress-max` is still
in the schema because `_render()` reads it.

Two names in the codebase exist **only** inside an `extraAttributes` array, so deleting
the list would drop them from the schema and the aggregate dictionary:

| Component | Attribute | State |
|---|---|---|
| `ln-number` | `data-ln-number-min` | Documented (`README.md:46`, example at `:123`) but **never read in `src/`**. The sibling `-max` is read at `src/ln-number.js:236`. |
| `ln-date` | `data-ln-date-locale` | Not read in `src/`, and not in the README either. `ln-date` takes its locale from `getLocale(dom)`, which reads `lang`. |

Both are ghosts: a name in the schema with no code behind it. This is what the
`extraAttributes` list cost — it acted as a second, unverified source of truth.

**Neither component may have its list removed mechanically.** `ln-number` needs a
ruling on whether `-min` gets implemented (the docs promise it) or dropped from the
docs; `ln-date` needs a ruling on whether `-locale` should exist at all.

## Open rulings

### ★ Systemic — `||` fallback vs `attrStr`'s `=== null` fallback

The dominant idiom in this codebase is `dom.getAttribute(x) || 'default'`, which
falls back for **any falsy value**, empty string included. `attrStr` falls back only
when the attribute is **absent**:

```js
const raw = el.getAttribute(name);
return raw === null ? fallback : raw;
```

So every mechanical `getAttribute(x) || d` → `attrStr(el, x, d)` conversion silently
changes what `x=""` means: today it yields `d`, afterwards it yields `""`. The same
gap exists between `+value` and `attrInt`'s `parseInt`, and between `|| 0` and the
deliberate "`0` stays `0`" behaviour `attrInt` was written for.

This is not one component's edge case — it governs most of the 44 remaining
components, so it wants deciding once:

- **(a) Fallback is absence-only.** `attrStr` semantics win; `x=""` means the empty
  string everywhere. Cleanest rule, but changes behaviour on inputs no test covers.
- **(b) Preserve falsy-fallback per site.** Needs a reader with `||` semantics
  (`attrStrOr`?), which is a new core primitive.
- **(c) Case by case.** Each conversion keeps the exact semantics it had, which
  means the pass cannot be mechanical anywhere.

**The sharpest test case is `ln-confirm`.** A bare marker — `<button data-ln-confirm>`,
a documented and recommended form (`README.md:36`) — makes `getAttribute` return `""`,
not `null`. Today `|| 'Confirm?'` turns that into the default prompt, and
`README.md:60` states it outright: *"Empty value defaults to `\"Confirm?\"`"*. Under
`attrStr` semantics the same markup yields an **empty confirm prompt**. So option (a)
is not a change to an untested edge — it breaks a documented default in the most
common usage.

Concrete sites hit so far: `ln-api-connector` `queryDebounce` (`+qd` vs `parseInt`),
`ln-chart` `this.source` (`|| this.name`), `ln-confirm` `this.confirmText`
(`|| 'Confirm?'`).

### `ln-chart` — the `source` mirror

Converted: `extraAttributes` + `onAttributeChange` → `onAttrChange` (default
re-render) + `effects` for `-source` and `-sort`. Behaviour-preserving — the five
render options were already read live by `_readOptions()` on every render.

Not converted: `this.source = dom.getAttribute('data-ln-chart-source') || this.name`,
written in the constructor and again in `requestData()`. A textbook mirror, and
nothing outside the component reads it — but the `|| this.name` fallback puts it
squarely on the systemic ruling above. `this.name` itself is identity and stays
frozen, per the `ln-data-store` precedent.

### `ln-api-connector` — composite and derived values in a `defineAttrs` spec

`refreshConfig()` copies nine attributes. Seven map 1:1 onto the built-in readers.
Two do not:

- `this.headers` is **derived**: `parseHeaders(dom.getAttribute('data-ln-api-headers'))`.
- `this.paramKeys` is **composite**: one object assembled from five attributes,
  each key included only when its attribute is present.

`defineAttrs` takes `{ prop: [reader, attributeName, fallback] }` and calls
`reader(dom, attributeName, fallback)`, so any function of that shape works — but
`ln-data-store` used only the four built-ins, each on a 1:1 attribute. No precedent.

Also on this component:

- `config-changed` is a documented public event (`README.md:175`) dispatched from
  `refreshConfig()`. Live getters remove the re-copy but not the need to announce
  the change — kept as-is unless ruled otherwise.
- `queryDebounce` currently uses `+qd`, so `data-ln-api-connector-query-debounce=""`
  yields `0` (debounce off). `attrInt` uses `parseInt`, so `""` would yield the
  `300` fallback. Undocumented input, but a real behaviour change.

Same `refreshConfig` shape rides on this ruling: `ln-couchdb-connector`,
`ln-data-coordinator`.

### `ln-autosave` — is the documented freeze a contract or documented drift?

Two attributes are read once at construction:

- `data-ln-autosave` resolves the localStorage key. **Identity** — frozen by the
  `ln-data-store` precedent; changing it mid-life would orphan the saved draft.
  Not in scope.
- `data-ln-autosave-debounce-input` decides the debounce interval **and whether the
  `input` listener is attached at all** (`parseAutosaveDebounce` returns `0` for an
  absent attribute = no listener).

`README.md:116` states the freeze outright: *"The interval is read once at
construction; mutating the attribute afterwards has no effect on a live instance."*
So the question is whether that documents a deliberate contract or documents the
very drift this pass exists to remove.

Inverting it is not a `defineAttrs` swap. The value is consumed inside a closure
that is only created when the attribute is present, so a live getter alone changes
nothing — the `input` listener would have to be attached unconditionally with the
interval read inside the handler. That is a change in shape, not a mechanical swap.

Also rides on the open `ln-api-connector` ruling: `parseAutosaveDebounce(...)` is a
**derived** read, same class as `parseHeaders(...)`.

Stale docs noticed in passing, not touched: `README.md:120` still claims the observer
is "filtered to `data-ln-autosave` only", which pass 1 removed, and `README.md:116`
names `_resolveDebounceMs`, which does not exist — the function is
`parseAutosaveDebounce` in `autosave-model.js`.

### `ln-confirm` — documented freeze, with a stated reason

Registration is bare: no `extraAttributes`, no `onAttributeChange`. The timeout is
already read live in `_startTimer()` via `_getTimeout(dom)`, so it needs nothing.

The one frozen value is `this.confirmText = dom.getAttribute('data-ln-confirm') ||
'Confirm?'`, captured in the constructor. Mutating the attribute afterwards is a
silent no-op — the drift signature this pass targets. It sat in the table as `—`,
which is exactly the misclassification the legend now warns about.

But `README.md:134` documents the freeze **and argues for it**: re-reading per click
*"would race AJAX-driven content updates and change the button text mid-confirm"*.
That is a substantive design reason, unlike `ln-autosave`, where the freeze is stated
but not justified. Same ruling, stronger case for keeping it.

Also blocked on the systemic ruling above — see the bare-marker example there.

---

# RULING 2026-09-17 — pass HALTED, shape changes

The per-component conversion is **stopped at 9 of 50**. Continuing would multiply
rework, because the declaration shape itself is changing. This is the second time the
shape has moved (`extraAttributes` → `defineAttrs` + `effects` → table), and each move
invalidates the work before it.

## What the user ruled

1. **One table per component is the single source of truth** for the component's host
   attributes. One name, one place. From the table derive the declared inventory, the
   `defineAttrs` binding, the `effects` map, and the scope of the default effect.

```js
const ATTRIBUTES = {
	'data-ln-data-store-window':        { prop: '_windowSize', read: attrInt, fallback: 1000, effect: _applyWindowSize },
	'data-ln-data-store-search-fields': { prop: '_searchFields', read: attrList },
	'data-ln-data-store-indexes':       { frozen: true },
	'data-ln-data-store':               { frozen: true }
};
```

2. **Scope is host values only (option B).** Out of the table: child slot selectors
   (`data-ln-chart-plot` and 7 siblings), foreign/universal references
   (`data-ln-template`, `data-ln-persist`), and SCSS-only attributes (68 of 375,
   mostly `data-ln-debug`). Those keep deriving from literals. The table is the single
   source of truth for the **reactive surface**, not for the whole inventory.

3. **`ln-data-store` is refactored onto the new shape** — it does not stay on the
   two-declaration form.

4. **The stale-attribute check becomes fatal.** It already detects loss
   (`sync-ln-schemas.mjs:478`) but only as a `console.log`; the current run prints
   11 stale attributes and still reports "свеж ✓".

## Rulings the SOURCE answered, not the user

Both were open questions in this file. Reading `ln-data-store` closed them:

- **Custom / derived readers have precedent.** `_readStale` (`:208`) is a reader with
  the exact `(el, name, fallback)` signature carrying domain semantics. So a site that
  needs `||` falsy-fallback semantics writes a named reader and keeps them. This
  **dissolves the ★ systemic ruling**: no core primitive is needed and no documented
  default gets broken. `ln-confirm` gets a `_readPrompt`, `ln-api-connector` a
  `_readHeaders`.
- **Frozen does not mean silent.** `_markFrozen` (`:917`) writes a marker attribute
  that co-located SCSS turns into a dev `::after` warning. A frozen attribute is
  **declared and surfaced**, not omitted. This dissolves the `ln-autosave` and
  `ln-confirm` rulings: their freezes stand, but stop being invisible.

## State of the 9 components already walked

| Component | Attrs | Note |
|---|---|---|
| `ln-accordion` | n/a | verified |
| `ln-ajax` | n/a | verified — no instance, `defineAttrs` inapplicable |
| `ln-api-connector` | skip? | unblocked by the `_readStale` precedent; redo on the table |
| `ln-api-queue` | interim | converted to `effects` only — revisit on the table |
| `ln-autoresize` | n/a | verified |
| `ln-autosave` | skip? | freeze stands, must be declared via the frozen marker |
| `ln-chart` | interim | `onAttrChange` + 2 effects — revisit; `source` mirror still live |
| `ln-circular-progress` | interim | `onAttrChange` only — revisit on the table |
| `ln-confirm` | skip? | freeze stands with a stated reason; needs a frozen declaration |

Three source files were touched, each only inside its `registerComponent` block. No
attribute value was changed anywhere, and no attribute was lost: schema checks after
each conversion were 7/7, 1/1, 2/2 present.

## Next

Plan in progress at `.claude/plans/attr-table-ssot.md` — substrate (`attrs.js`,
`helpers.js`, `sync-ln-schemas.mjs`) plus `ln-data-store` as the first component on
the new shape. The remaining ~44 conversions are a later pass and are deliberately
not planned yet.

# Plan: Filter Pills + Collapse-All Sentinel

**Date:** 2026-06-12
**Status:** Ready for execution
**Scope:** js/ln-filter/src/ln-filter.js, scss/config/mixins/_popover.scss,
js/ln-filter/README.md, docs/js/filter.md, docs/architecture/reference.md

---

## Investigation Summary

### Part 1 — JS

`_lnFilterChange` lives at `js/ln-filter/src/ln-filter.js` lines 175–211.

The `if (input.checked)` branch (lines 188–192) currently only unchecks reset
sentinels. The new check-all collapse logic inserts after that block and before
`self._queueRender()`.

`_isReset(input)` returns true when `data-ln-filter-reset` is present OR
`data-ln-filter-value=""`. So "all non-reset inputs" = every input where
`!_isReset(input)`.

The batcher (`createBatcher`) coalesces all synchronous checkbox writes into one
`_render()` + `_afterRender()` cycle, so unchecking the value inputs and checking
the sentinel all happen before the single render fires. No extra dispatch suppression
is needed.

Guard: if no reset sentinel exists in the list, skip the collapse — detected by
scanning `self.inputs` for any where `_isReset(input)` is true.

### Part 2 — SCSS

**GLS reference** (`C:\laragon\www\gls\resources\scss\overrides\_tables.scss`
lines 215–265, `.column-filter-dropdown` block):

- Float panel chrome via `@include floating-panel`
- Options in `ul[data-ln-filter-options]` rendered as a column flex list
- Labels: `display: flex; align-items: center; gap: var(--size-xs);
  padding: var(--size-xs) var(--size-sm)` on a `background-color: hsl(var(--color-neutral-100))`
  surface
- **Checkbox hidden** via `display: none` on the `input[type="checkbox"]`
- **Checked state**: gold background fill + dark navy text + `font-weight: 600`
- Hover: neutral-200 background

This is a project-specific visual override in gls's gold/navy brand. The
ln-ashlar library equivalent is the `@mixin pill` (filled, input hidden,
accent background on checked) — same intent, token-driven.

**Existing pill infrastructure in ln-ashlar:**

The library already has exactly what is needed:

- `@mixin pill` — `_form.scss` lines 454–480: filled pill with `display: none` on
  the native input, `background-color: var(--color-accent)` on checked, accent
  hover states. Extends `pill-outline`.
- `@mixin check-list` — `_form.scss` lines 680–683: applies `@include pill` to
  `li label` on a vertical list. This is the **correct mixin** for filter option
  lists: vertical `<ul><li><label><input>` structure, filled pill treatment.

**Markup compatibility:** The canonical popover markup from the unification plan is:
```html
<ul id="filter-dept-list" data-ln-filter="my-table">
    <li><label><input type="checkbox" data-ln-filter-key="department" data-ln-filter-reset checked> All</label></li>
    <li><label><input type="checkbox" data-ln-filter-key="department" data-ln-filter-value="Engineering"> Engineering</label></li>
</ul>
```
Structure: `ul > li > label > input + text`. `@mixin check-list` targets `li label` —
exact match. No HTML changes needed.

**Accessibility:** `@mixin pill` sets `> input { display: none; }`. This breaks
keyboard focus on the input entirely — screen reader users and keyboard users cannot
Tab to the checkbox. The fix: the popover-scoped rule must NOT hide the input with
`display: none`; instead use the visually-hidden pattern so the checkbox stays in
the focus order and receives focus rings. Approach: scope a `check-list-outline`
variant that DOES NOT hide the input but DOES render the pill shape on the label.
`@mixin check-list-outline` — `_form.scss` lines 670–671 — applies `@include
pill-outline` to `li label`, which sets `> input { display: revert; }` (native
input visible). This preserves keyboard navigation but lacks the filled accent
treatment on checked.

**Decision — `pill-outline` for filter popovers, not `pill`:**

The task requires keyboard accessibility. `pill` hides the input entirely. The
correct mixin is `check-list-outline` (`pill-outline` on each label):
- Checkbox visually present but small (native browser chrome, `display: revert`)
- Label outline-border + accent border on checked → clear visual state
- `:focus-visible` ring delivered by `pill-outline`'s parent, which calls
  `@include pill-outline` on labels that contain the focused input via
  `label:has(> input:focus-visible) { @include focus-ring; }` if present, OR
  the browser default focus outline on the input itself

**Focus-visible check:** `@mixin pill-outline` does not itself include a
`focus-visible` rule on the label. The input's native focus ring survives
(`display: revert`). To match the library's `focus-ring` style on the label
for `:focus-visible`, add `label:has(> input:focus-visible)` in the popover-scoped
rules — this is the established pattern for labelled inputs.

**Applying in `_popover.scss`:** The existing `> ul > li > label` block in the
popover mixin already handles flex layout. Replace/extend it with `@include
check-list-outline` on the `> ul` and add the focus-visible rule on the label.

---

## Files Touched

### MODIFY
1. `js/ln-filter/src/ln-filter.js` — Part 1: check-all collapse logic
2. `scss/config/mixins/_popover.scss` — Part 2: pill styling on filter option lists
3. `js/ln-filter/README.md` — Doc: 3-bullet sentinel rules
4. `docs/js/filter.md` — Doc: sentinel rules in behavior section
5. `docs/architecture/reference.md` — Doc: one line on pill rendering + sentinel collapse

---

## Part 1 — JS: Check-All Collapses to Sentinel

### File: `js/ln-filter/src/ln-filter.js`

**Step 1.1 — Add collapse logic in the `if (input.checked)` branch**

Current `if (input.checked)` block (lines 188–192):
```js
if (input.checked) {
    // Mutual exclusion: uncheck all reset sentinels
    for (let i = 0; i < self.inputs.length; i++) {
        if (_isReset(self.inputs[i])) self.inputs[i].checked = false;
    }
}
```

After the existing reset-uncheck loop, add the collapse check:
```js
// If all non-reset inputs are now checked, collapse to sentinel
// Guard: skip if no reset sentinel exists in this list
var hasReset = false;
for (var j = 0; j < self.inputs.length; j++) {
    if (_isReset(self.inputs[j])) { hasReset = true; break; }
}
if (hasReset) {
    var allChecked = true;
    for (var k = 0; k < self.inputs.length; k++) {
        if (!_isReset(self.inputs[k]) && !self.inputs[k].checked) {
            allChecked = false;
            break;
        }
    }
    if (allChecked) {
        // Collapse: uncheck all values, check the sentinel(s)
        for (var m = 0; m < self.inputs.length; m++) {
            if (_isReset(self.inputs[m])) {
                self.inputs[m].checked = true;
            } else {
                self.inputs[m].checked = false;
            }
        }
    }
}
```

Place this block immediately after the existing sentinel-uncheck loop, still inside
the `if (input.checked)` branch, before `self._queueRender()`.

**Variable naming:** Use `var` to match surrounding closure style? No — existing
code in this file uses `let` and `const` at function/block scope inside the IIFE;
use `let` consistent with the surrounding block. Use loop variable names `j`, `k`,
`m` to avoid shadowing the outer `i`.

Actually — check the file: the existing loops inside `_lnFilterChange` use `let i`.
New inner loops must shadow-free. Use `let ri`, `let ci`, `let mi` (reset, check,
mark) for clarity.

Final block:

```js
if (input.checked) {
    // Uncheck all reset sentinels
    for (let i = 0; i < self.inputs.length; i++) {
        if (_isReset(self.inputs[i])) self.inputs[i].checked = false;
    }
    // If all non-reset inputs are now checked → collapse to sentinel
    // (only when a reset sentinel exists; lists without one do nothing new)
    let hasReset = false;
    for (let ri = 0; ri < self.inputs.length; ri++) {
        if (_isReset(self.inputs[ri])) { hasReset = true; break; }
    }
    if (hasReset) {
        let allChecked = true;
        for (let ci = 0; ci < self.inputs.length; ci++) {
            if (!_isReset(self.inputs[ci]) && !self.inputs[ci].checked) {
                allChecked = false;
                break;
            }
        }
        if (allChecked) {
            for (let mi = 0; mi < self.inputs.length; mi++) {
                if (_isReset(self.inputs[mi])) self.inputs[mi].checked = true;
                else self.inputs[mi].checked = false;
            }
        }
    }
} else {
    // ... existing unchecked branch unchanged
}
```

The existing `else` branch (uncheck-last-value → restore sentinel) is unchanged.

**Why the batcher handles it:** All checkbox writes happen synchronously inside
`_lnFilterChange`. `queueRender()` is called once after all writes. The batcher
schedules `_render()` via `queueMicrotask`, so only the final (collapsed) state
reaches the render cycle. No extra suppression needed.

**Behavior table:**

| Scenario | Result |
|---|---|
| (a) Uncheck all values → 0 remain | Existing: sentinel re-checks (unchanged) |
| (b) Check final value → all non-reset now checked | NEW: unchecks values, checks sentinel |
| (c) List has no reset sentinel | New guard fires: no collapse, values stay checked |
| (d) Partial selection (some values checked) | Unchanged: sentinel stays unchecked |

---

## Part 2 — SCSS: Filter Options as Pills

### File: `scss/config/mixins/_popover.scss`

**Decision recap:** Use `@mixin check-list-outline` (which applies `pill-outline` to
`li label`). This keeps the native checkbox in the focus order (keyboard-safe) while
rendering a bordered pill shape with accent border/text on checked.

**Mixin to include:** `check-list-outline` lives in `scss/config/mixins/_form.scss`.
The popover mixin file already imports from `card` and `motion`. Add import of `form`
to access `check-list-outline`. Check if the import already exists.

Current imports in `_popover.scss`:
```scss
@use 'spacing' as *;
@use 'borders' as *;
@use 'motion' as *;
@use 'card' as *;
```

`check-list-outline` is in `_form.scss` — add `@use 'form' as *;`.

**Current `> ul` block in the `popover` mixin (lines 33–55):**
```scss
> ul {
    list-style: none;
    padding: 0;
    margin: 0;
    max-height: var(--filter-options-max-height, 15rem);
    overflow-y: auto;

    > li > label {
        display: flex;
        align-items: center;
        gap: var(--size-xs);
        padding: var(--size-2xs) var(--size-sm);
        cursor: pointer;

        &:hover {
            background: hsl(var(--color-primary) / 0.06);
        }

        > input[type="checkbox"] {
            flex-shrink: 0;
        }
    }
}
```

**Replace the `> li > label` block** with `@include check-list-outline` on the `> ul`,
plus the max-height/overflow already there, plus the focus-visible rule:

```scss
> ul {
    @include check-list-outline;
    list-style: none;
    padding: 0;
    margin: 0;
    max-height: var(--filter-options-max-height, 15rem);
    overflow-y: auto;

    // Focus ring on the pill label when the hidden-input gets keyboard focus
    > li > label:has(> input:focus-visible) {
        @include focus-ring;
    }
}
```

`@mixin check-list-outline` produces `li label { @include pill-outline; }`.
`@mixin pill-outline` covers: flex, items-center, gap, padding, cursor, transition,
text-sm, font-medium, border-radius, border, transparent background, `display: revert`
on child input, accent border+text on `:has(> input:checked)`, accent border on hover.

The explicit `list-style: none; padding: 0; margin: 0;` reset must stay because
`check-list-outline` does not reset the `<ul>` itself (it targets `li label`).

The `max-height` + `overflow-y: auto` stay for long option lists.

**Where `@include focus-ring` is defined:** `scss/config/mixins/_focus.scss` (used
throughout `_form.scss`). `_popover.scss` does not currently import `focus`. Add
`@use 'focus' as *;` import if `check-list-outline` does not already include it
transitively. Since `_form.scss` imports `focus` and `check-list-outline` is invoked
via the form mixin, the `focus-ring` symbol needs to be directly available in
`_popover.scss` for the explicit `label:has(> input:focus-visible)` rule. Add the
import.

**Final imports for `_popover.scss`:**
```scss
@use 'spacing' as *;
@use 'borders' as *;
@use 'motion' as *;
@use 'card' as *;
@use 'form' as *;
@use 'focus' as *;
```

**Scope:** The `> ul` selector inside `@mixin popover` scopes these rules to
`[data-ln-popover] > ul` only. The gls `.column-filter-dropdown` markup is a
`.class`-based container, not `[data-ln-popover]` — zero bleed.

---

## Part 3 — Docs

### 3.1 — `js/ln-filter/README.md`

Locate the **Sentinel Mutual Exclusion** item in `## Philosophy & Architecture`
(currently item 2). Replace with a 3-bullet "Sentinel rules" expansion, keeping
the surrounding numbering intact:

```markdown
2. **Sentinel Rules:** The `data-ln-filter-reset` ("All") checkbox is kept in sync
   automatically through three rules:
   - **Check sentinel** → unchecks all value inputs (resets to All).
   - **Uncheck last value** → re-checks the sentinel (never allows empty selection).
   - **Check all values** → collapses to sentinel: unchecks all values, re-checks
     sentinel. Guard: only applies when a reset sentinel exists in the list.
```

### 3.2 — `docs/js/filter.md`

The "Render pipeline" section describes the change handler. Add a paragraph after
the `change event → handler enforces mutual exclusion` line (before the batcher
description) that names the three sentinel rules:

Add under **State model** section after the mutual-exclusion description:

```markdown
## Sentinel rules

Three invariants enforced synchronously in `_lnFilterChange` before `queueRender()`:

1. **Check sentinel** — uncheck all non-reset inputs; force sentinel to checked.
2. **Uncheck last value** — when no non-reset input remains checked, check all
   sentinel inputs.
3. **Check all values** — when a value input is checked and all non-reset inputs
   are now checked, collapse to sentinel: uncheck all values, check sentinel(s).
   Guard: skip if no sentinel exists in the list (lists that have no "All" option
   should not auto-collapse).
```

### 3.3 — `docs/architecture/reference.md`

In the **Column Filter Architecture** section (added by the unification plan), find
the "Indicator convention" heading. Add one sentence after the existing indicator
paragraph, and a new "Sentinel auto-collapse" note:

```markdown
**Option rendering:** Filter options inside `[data-ln-popover]` render as pills
(outline style) via `@mixin check-list-outline` scoped to popover `> ul`. The
checkbox input remains visible and keyboard-focusable; the label provides the
pill border and accent-on-checked state.

**Sentinel auto-collapse:** When all available value checkboxes are checked,
`ln-filter` automatically collapses the selection to the reset sentinel (unchecks
all values, checks All). This only fires when the list contains a reset sentinel;
lists without one are unaffected.
```

---

## Acceptance Criteria

### Positive checks

```
grep -n "allChecked" js/ln-filter/src/ln-filter.js
# → collapse logic present in _lnFilterChange (if (input.checked) branch)
```

```
grep -n "hasReset" js/ln-filter/src/ln-filter.js
# → guard present in _lnFilterChange
```

```
grep -n "check-list-outline" scss/config/mixins/_popover.scss
# → check-list-outline applied inside popover mixin
```

```
grep -n "focus-visible" scss/config/mixins/_popover.scss
# → label:has(> input:focus-visible) rule present
```

```
grep -n "Check all values\|check all values" js/ln-filter/README.md
# → third sentinel rule bullet present
```

```
grep -n "Sentinel rules\|sentinel rules" docs/js/filter.md
# → sentinel rules section present
```

```
grep -n "Sentinel auto-collapse\|sentinel auto-collapse\|check-list-outline" docs/architecture/reference.md
# → pill rendering note + sentinel collapse note present
```

### Negative checks

```
grep -n "display: none" scss/config/mixins/_popover.scss
# → 0 results (must NOT hide checkbox input — accessibility constraint)
```

```
grep -n "gap: var.*size-xs.*padding:.*2xs" scss/config/mixins/_popover.scss
# → 0 results (raw label properties removed in favour of mixin)
```

### Behavior table (verify mentally against source, not by grep)

| Scenario | Expected after change |
|---|---|
| Uncheck all values → 0 remain checked | Sentinel re-checks (existing, unchanged) |
| Check final missing value → all non-reset checked | Sentinel re-checks, all values uncheck |
| List has no `data-ln-filter-reset` input | No collapse, values stay all-checked |
| Partial selection | Unchanged: sentinel stays unchecked |

---

## Boundaries — What NOT to Touch

- `js/ln-table/src/ln-table.js` — do not touch
- `js/ln-popover/src/ln-popover.js` — do not touch
- `js/ln-search/` — do not touch
- `scss/config/mixins/_form.scss` — read-only (mixins already exist; do not add new ones)
- Demo pages — do not touch (styling applies via existing popover markup; no markup changes needed)
- `gls` repo — do not touch
- `.claude/**` — write-blocked

---

## Executor Prompt

```
You are implementing the plan at:
C:\laragon\www\ln-ashlar\docs\plans\2026-06-12-filter-pills-collapse-all.md

Read the plan fully before starting. Execute all parts in order (1, 2, 3).

### Part 1 — js/ln-filter/src/ln-filter.js

Read lines 165–215 of the file. Find the `input._lnFilterChange = function ()` closure.
Locate the `if (input.checked)` branch (the one that unchecks reset sentinels).

AFTER the existing sentinel-uncheck loop and BEFORE `self._queueRender()`, insert
the collapse logic exactly as specified in the plan's Part 1, Step 1.1.

Constraints:
- Use `let` (not `var`, not `const`) for the loop variables — matches the file style
- Loop variable names: `ri` (hasReset scan), `ci` (allChecked scan), `mi` (collapse write)
  to avoid shadowing the outer loop variable `i`
- Do NOT touch the `else` branch or anything outside the `if (input.checked)` block
- Tabs for indentation — match the surrounding code exactly
- The inserted block is purely inside the change handler — no new prototype methods,
  no new exports, no structural changes

### Part 2 — scss/config/mixins/_popover.scss

Read the full file first.

1. Add these two imports at the top, after the existing `@use 'card' as *;`:
   ```scss
   @use 'form' as *;
   @use 'focus' as *;
   ```

2. Inside the `@mixin popover { }` block, find the `> ul { }` block.
   Replace its ENTIRE content with:
   ```scss
   > ul {
   	@include check-list-outline;
   	list-style: none;
   	padding: 0;
   	margin: 0;
   	max-height: var(--filter-options-max-height, 15rem);
   	overflow-y: auto;

   	// Focus ring on the pill label when the checkbox receives keyboard focus
   	> li > label:has(> input:focus-visible) {
   		@include focus-ring;
   	}
   }
   ```

   Constraints:
   - Keep the `> input[type="search"]` block above the `> ul` block unchanged
   - Tabs for indentation
   - The explicit list-style/padding/margin/max-height/overflow stay — check-list-outline
     does not reset the <ul> itself

### Part 3 — Docs (three files)

3a. js/ln-filter/README.md
    Find item "2. **Sentinel Mutual Exclusion:**" in the Philosophy section.
    Replace that single bullet with the 3-bullet expansion from the plan §3.1.
    Keep surrounding numbered items unchanged. No other edits.

3b. docs/js/filter.md
    Find the "## State model" section. After the closing sentence of that section
    (before "## Render pipeline"), insert the "## Sentinel rules" section verbatim
    from the plan §3.2.

3c. docs/architecture/reference.md
    Find the "Column Filter Architecture" section. Find the "**Indicator convention**"
    paragraph. After the last sentence of that paragraph (ending with "SCSS owns the visual."),
    insert the two paragraphs from the plan §3.3 (Option rendering + Sentinel auto-collapse).

### Build

After all source changes, run:
  npm run build

Fix any SCSS import errors before reporting. Report:
1. PASS or FAIL for each acceptance criterion grep (copy command + output)
2. Build exit code
3. Any deviation from the plan and why

Do NOT touch:
- js/ln-table/src/ln-table.js
- js/ln-popover/src/ln-popover.js
- Any demo pages
- scss/config/mixins/_form.scss
- .claude/** directory
- gls repo
```

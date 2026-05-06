# ln-select

> A 152-line wrapper around [TomSelect](https://tom-select.js.org/)
> that exists for one reason: the platform's native `<select>` is
> usable but not enough. It cannot search 200 options, cannot tag,
> cannot create on the fly, cannot render multi-select chips that
> survive a finger on a touchscreen. TomSelect solves all of that.
> ln-select adds the smallest amount of glue — auto-init via
> `MutationObserver`, JSON-config from a single attribute, form-reset
> hookup, graceful degradation when TomSelect is missing — so the
> form layer (`ln-form`, `ln-validate`, `ln-autosave`) can compose
> with TomSelect through the platform's own `change` event without
> ever knowing TomSelect exists.

## Philosophy

The native `<select>` is one of HTML's oldest controls and is fine
for 5-option, single-pick, mouse-driven scenarios. The moment any
of those preconditions break — a country list of 200 options, a
multi-pick role assignment, a tag input where the user invents
values, a touch device where the OS dropdown is hostile — the
native control fails the user. Every serious admin panel ends up
reaching for a library, and the library that has won across the
zero-dependency, no-jQuery, no-framework segment is TomSelect.

ln-select is **not** that library. It is the wrapper that turns
TomSelect from a peer dependency you have to manually `new` on
every page into a `data-*` attribute that auto-initializes alongside
every other ln-ashlar component. That is the entire scope.

The contract is one sentence: **put `data-ln-select` on a
`<select>` and TomSelect upgrades it; remove the element from the
DOM and the instance is destroyed.** Configuration travels as JSON
inside the attribute value (`data-ln-select='{"create": true}'`),
merged on top of a small set of defaults the wrapper picks for
sensible behavior in admin-form contexts. The TomSelect instance
itself is stored in a module-scoped `WeakMap`, accessible via
`window.lnSelect.getInstance(element)` for projects that need
the raw API. The `<select>` element receives no instance property
of its own — `el.lnSelect` is intentionally undefined.

That last detail is load-bearing. TomSelect mutates the host
`<select>` heavily: it inserts a sibling `.ts-wrapper` DOM, hides
the original element, and rewires every option / change /
selection internally. Storing the wrapper instance on
`select.lnSelect` would mean every TomSelect-driven query
(`select.options`, `select.selectedOptions`, jQuery-style `$select`
patterns in third-party code) would need to skip past an
ln-ashlar-specific property. The `WeakMap` keeps the instance
findable but completely off the element's own attribute / property
surface. The platform sees a normal `<select>` with whatever value
the user (or TomSelect) last committed to it; the integration
points in the rest of the form layer are the platform's events
(`change`, `focusout`, `input`), nothing else.

That decision cascades. ln-form's `populateForm()` writes
`select.value = "..."` on restore and dispatches `change`;
TomSelect listens for `change` on the underlying `<select>` and
re-syncs its visible UI to match. ln-validate's `change` listener
fires on the same event and validates the new value. ln-autosave's
`focusout` / `change` save triggers see the platform-level commits
and serialize them. Three components, zero references to
`lnSelect`, zero references to TomSelect, zero coordinator wiring.
The `<select>` element is the connector; the platform's event flow
is the protocol.

The configuration surface is intentionally narrow. The wrapper
ships seven defaults — `allowEmptyOption: true`, `controlInput: null`,
`create: false`, `highlight: true`, `closeAfterSelect: true`,
`placeholder: <element placeholder or "Select...">`, `loadThrottle: 300`
— and accepts arbitrary JSON to override or extend. Every other
TomSelect option is reachable: `maxItems`, `plugins`, `valueField`,
`labelField`, `searchField`, `render` callbacks, async `load` for
remote data, `onChange` and the rest of the lifecycle hooks. The
wrapper does not constrain the configuration; it just provides a
sensible starting point and the auto-init plumbing.

What ln-select adds beyond raw `new TomSelect(...)`:

1. **Auto-init via `MutationObserver`.** Adding `data-ln-select`
   to an existing `<select>` (typed in DevTools, written by an
   AJAX response, or by `setAttribute` from project JS) upgrades
   it on the next observer tick. Removing the element destroys
   the instance and unwires the form-reset listener. No project
   coordinator has to call `init()` after a partial-load.
2. **Form-reset hookup.** When the host form fires its `reset`
   event, the wrapper calls `tomSelect.clear()`, `clearOptions()`,
   and `sync()` in the next tick (the `setTimeout(0)` makes sure
   the platform's reset has already restored the underlying
   `<select>` to its server-rendered defaults before TomSelect
   tries to re-read them). Without this hookup, the user sees a
   stale TomSelect display after `form.reset()`.
3. **Graceful degradation.** If `window.TomSelect` is missing
   when the script loads, the wrapper logs a single
   `console.warn`, installs a no-op
   `window.lnSelect = { initialize, destroy, getInstance }`, and
   exits. Every `<select data-ln-select>` continues to work as a
   plain native `<select>`. The page does not crash; the
   `data-ln-select` attribute is just a noop marker until
   TomSelect ships.
4. **Single source of truth for the instance.** `window.lnSelect.getInstance(element)`
   returns the TomSelect instance from the `WeakMap`. There is
   one and only one instance per element, and one and only one
   path to find it.

That is the entire component. Read on for the contracts the rest
of the form layer relies on.

## What `ln-select` does NOT do

- **Does NOT define options.** Options live in the markup — the
  `<option>` children of the `<select>`. TomSelect reads them at
  init time. If you want dynamic options (a server-driven country
  list, a tag autocomplete from an API), use TomSelect's `load:`
  callback inside the JSON config — see `data-ln-select='{...}'`
  Examples below.
- **Does NOT validate.** `data-ln-validate` on the same `<select>`
  is fine — TomSelect commits the user's selection by writing to
  the underlying `<select>.value` and firing `change`,
  `ln-validate`'s `change` listener catches it, validation runs.
  Two attributes, one element, no coordination needed.
  See `js/ln-validate/README.md`.
- **Does NOT serialize.** The form layer's `serializeForm()`
  reads the underlying `<select>` (single, multiple, etc.) — it
  does not know TomSelect exists. Whatever value TomSelect has
  committed to the underlying `<select>.value` (or
  `select.selectedOptions` for multiples) is what gets serialized.
  See `js/ln-core/helpers.js:226-250`.
- **Does NOT sync across instances.** Two
  `<select data-ln-select name="country">` elements on the same
  page do NOT share state. Each is a separate TomSelect instance;
  picking "Macedonia" in one does not pick it in the other. If
  you genuinely need linked selects, write a coordinator that
  listens for `change` on one and writes to the other (then
  dispatches `change` so TomSelect syncs).
- **Does NOT auto-translate option labels.** The wrapper passes
  `<option>` text to TomSelect verbatim. If your project uses
  `ln-translations` for runtime label translation, the option
  text needs to be translated server-side or via a
  `render.option` callback in the JSON config. The wrapper does
  not interpose.
- **Does NOT proxy TomSelect's API.** `window.lnSelect.getInstance(el)`
  returns the raw TomSelect instance. Every method
  (`setValue`, `addOption`, `clear`, `lock`, `disable`, `focus`,
  `getItem`, etc.) is TomSelect's own — read TomSelect's docs.
  The wrapper has zero opinion on how you use the instance.
- **Does NOT throw on missing TomSelect.** A `console.warn` and a
  no-op installer at lines 16-20 of `ln-select.js`. The page
  continues; `<select>` elements stay native. This is deliberate
  for graceful degradation in environments where the TomSelect
  bundle was forgotten or blocked by a CSP.
- **Does NOT throw on a non-`<select>` element.** The init scan
  uses the selector `select[data-ln-select]` (lines 84, 94, 102,
  106, 115, 119), so `<div data-ln-select>` is silently ignored.
  The constructor itself does not validate the host element type
  — but it is unreachable for non-`<select>` because the selector
  filters first.
- **Does NOT pre-populate from `localStorage` or any persistence
  layer.** TomSelect reads the underlying `<select>`'s server-rendered
  values at init. The integration with `ln-autosave` works through
  the platform's `change` event: `ln-select` registers earlier
  in `js/index.js` (line 11) than `ln-autosave` (line 31), so by
  the time ln-autosave's construction-time restore runs and dispatches
  synthetic `change` on every restored field, the
  underlying `<select>` is already upgraded — TomSelect's internal
  `change` listener catches the synthetic event and re-syncs the
  visible chip pills / dropdown to the restored value. Order is
  load-bearing; see Cross-component coordination below.
- **Does NOT debounce save / change events.** TomSelect's own
  `change` event fires on the underlying `<select>` synchronously
  with the user's selection. ln-autosave's `change` listener
  fires immediately after; ln-validate's `change` listener fires
  immediately after. Three writes per selection (autosave to
  localStorage, validate state computation, project listener) —
  all fast, all synchronous, no debounce needed.
- **Does NOT clear localStorage on destroy.** Destroying the
  TomSelect instance (via DOM removal or
  `window.lnSelect.destroy(el)`) does NOT touch any
  localStorage entry. Form drafts written by `ln-autosave` stay
  intact across DOM rebuilds.
- **Does NOT participate in `ln-confirm`.** A
  `<button type="submit" data-ln-confirm>` inside a form with
  `<select data-ln-select>` works because the click flow is
  sequential — confirm gates the click, then `submit` fires,
  then `ln-form` serializes the form (which reads the
  TomSelect-committed `<select>.value`). No overlap.

### Cross-component coordination

| Component | Coordination | Verified at |
|---|---|---|
| `ln-form` | None at the JS level — no imports, no event listeners between them. ln-form's `populateForm()` writes `select.value = <restored value>` and then dispatches a synthetic `change` event (`ln-form.js:108-112`). TomSelect's internal `change` listener on the underlying `<select>` catches the event and calls its own `sync()` to refresh the visible UI. ln-form's `serializeForm()` reads `<select>.value` (or `selectedOptions` for `select-multiple`) directly — TomSelect has already written there, so the serialized payload is correct. | `js/ln-form/ln-form.js:108-112` (synthetic dispatch with `isChangeBased` fork — SELECT routes to `'change'`); `js/ln-core/helpers.js:239-243` (serializeForm reads `el.options[j].selected`); TomSelect listens for `change` internally |
| `ln-validate` | None. ln-validate's constructor wires a `change` listener on every `[data-ln-validate]` field that is `<select>`, `<input type="checkbox">`, or `<input type="radio">`. TomSelect commits selections by writing to the underlying `<select>.value` and dispatching `change`; ln-validate's listener catches the platform event, sets `_touched = true`, runs `validate()`. Native constraints (`required`, `pattern` on a select with a value attribute) are honored by `dom.checkValidity()` — the value the user just picked is what gets checked. | `js/ln-validate/ln-validate.js:82-85` (input/change listeners); `js/ln-validate/README.md` Cross-component table; verified by reading both source files in this pilot |
| `ln-autosave` | None directly. ln-autosave's `change` listener on the form catches every TomSelect commit (via the underlying `<select>`'s `change` event bubbling) and saves the entire form to localStorage. On restore, ln-autosave calls `populateForm()` which writes `select.value = ...` and dispatches synthetic `change` — TomSelect re-syncs from the underlying value. The dead-code branch at `ln-autosave.js:97-99` (`if (restored[k].lnSelect && restored[k].lnSelect.setValue)`) **never executes** because ln-select stores instances in a module-scoped `WeakMap`, NOT on `element.lnSelect`. The integration works via the synthetic `change` event, not via the dead branch. | `js/ln-autosave/ln-autosave.js:94-95` (synthetic dispatch path that DOES work); `js/ln-autosave/ln-autosave.js:97-99` (dead branch); `js/ln-select/ln-select.js:22, 147-151` (instances in WeakMap, accessed only via `window.lnSelect.getInstance(el)`) |
| `ln-confirm` | Independent. ln-confirm gates the first click on a destructive button; ln-select operates on a form field. There is no overlap in the elements they touch, no event channel they share. A `<form>` with a `<select data-ln-select>` and a `<button type="submit" data-ln-confirm>` works because the click flow is sequential — confirm first, then submit, then form serialization. | grep — zero cross-references between `js/ln-confirm/` and `js/ln-select/` |
| `ln-modal` | Composes trivially. A `<select data-ln-select>` inside a `<form>` inside a `<div data-ln-modal>` upgrades when the markup mounts; the modal's open/close has no bearing on the TomSelect lifecycle. The TomSelect dropdown panel renders attached to the body (TomSelect's default), not to the select's parent — so it escapes the modal's stacking context naturally. | grep — zero cross-references; modal's overlay does NOT clip the TomSelect dropdown because TomSelect appends to body |
| `ln-ajax` | The README at `js/ln-ajax/README.md:95` references `window.lnSelect.reinit()`, but **`reinit()` does not exist on `window.lnSelect`**. The actual API (lines 147-151 of `ln-select.js`) exposes only `initialize`, `destroy`, and `getInstance`. AJAX-replaced subtrees are auto-upgraded by ln-select's `MutationObserver` (it watches `childList: true, subtree: true`), so no manual reinit is needed. The `reinit()` reference in ln-ajax is a documentation bug — flag for a future cleanup pass. | `js/ln-select/ln-select.js:147-151` (no `reinit`); `js/ln-ajax/README.md:95` (the bug) |
| `ln-toggle` / `ln-toggle-switch` | Independent. ln-toggle owns open/close on a panel; ln-toggle-switch owns a checkbox's checked state. Neither overlaps with `<select>` upgrades. | grep — zero cross-references |

The pattern is consistent: ln-select wraps TomSelect, TomSelect
mutates the underlying `<select>` and fires native `change`,
every other component in the form layer reads `<select>.value`
or listens for `change`. The wrapper is invisible to its
neighbours by design.

## Markup anatomy

The minimum invocation is `data-ln-select` on a `<select>` with
options:

```html
<select data-ln-select name="role">
    <option value="">Select a role…</option>
    <option value="admin">Administrator</option>
    <option value="editor">Editor</option>
    <option value="viewer">Viewer</option>
</select>
```

That is the entire setup. TomSelect upgrades the element on the
next observer tick, the `<option>`s become searchable, the
underlying `<select>.value` mirrors whatever the user picks, and
every form-layer component sees the value through the platform's
own `change` event.

### The host — `<select data-ln-select>`

The element with `data-ln-select` is the host. The component
upgrades any `<select>` carrying the attribute. The presence of
the attribute creates the instance; the value, when present, is
parsed as JSON for configuration (see "Configuration" below).

```html
<!-- Single — boolean attribute, default config -->
<select data-ln-select name="country">
    <option value="">Select…</option>
    <option value="mk">North Macedonia</option>
    <option value="rs">Serbia</option>
</select>

<!-- Multi — multiple attribute on the select itself -->
<select data-ln-select name="languages[]" multiple>
    <option value="mk">Macedonian</option>
    <option value="en">English</option>
    <option value="sq">Albanian</option>
</select>

<!-- Tagging — create:true via JSON config -->
<select data-ln-select='{"create":true}' name="tags" multiple>
    <option value="design">design</option>
    <option value="engineering">engineering</option>
</select>

<!-- Capped multi — maxItems:3 via JSON config -->
<select data-ln-select='{"maxItems":3}' name="favorites[]" multiple>
    <!-- … -->
</select>
```

The wrapper does not enforce the host element type. The init
selector (`select[data-ln-select]` at lines 84, 94, 102, 106, 115,
119 of `ln-select.js`) filters out non-`<select>` elements
silently — putting `data-ln-select` on a `<div>` does nothing.

### The configuration — JSON in the attribute value

The attribute value, if non-empty, is parsed as a TomSelect
configuration object. The default config is merged underneath:

```javascript
const defaultConfig = {
    allowEmptyOption: true,    // honor <option value=""> as a real choice
    controlInput: null,         // hide the type-to-search input on single-select
    create: false,              // do NOT allow user-typed new options
    highlight: true,            // highlight matched substring in dropdown
    closeAfterSelect: true,     // dropdown closes on each pick
    placeholder:                // taken from <select placeholder> if set
        element.getAttribute('placeholder') || 'Select...',
    loadThrottle: 300,          // ms throttle for async load callback
};
```

The merge is `{ ...defaultConfig, ...config }` — values from the
attribute JSON override the wrapper's defaults. To re-enable an
option the wrapper hides (e.g. show the type-ahead input on
single-select), pass `controlInput: undefined` or any TomSelect
template literal:

```html
<select data-ln-select='{"controlInput":"<input>"}' name="role">…</select>
```

Invalid JSON in the attribute is caught (`try/catch` at lines
30-36) and logged as `[ln-select] Invalid JSON in data-ln-select
attribute:` plus the parse error. The component falls back to
`config = {}` and proceeds with defaults — degraded, not crashed.

### What state lives where

| Concern | Lives on | Owned by |
|---|---|---|
| Should this `<select>` be enhanced? | `data-ln-select` (presence) on the `<select>` | author |
| Configuration overrides | Value of `data-ln-select` parsed as JSON | author |
| Currently selected value | `<select>.value` (single) / `<select>.selectedOptions` (multiple) | the platform / TomSelect (writes through to the underlying `<select>`) |
| TomSelect instance | Module-scoped `WeakMap`, accessed via `window.lnSelect.getInstance(el)` | ln-select |
| Visible dropdown UI / type-ahead state / chip pills | TomSelect's own DOM (`.ts-wrapper` sibling of `<select>`) | TomSelect |
| Form-reset behavior | `form.addEventListener('reset', ...)` wired by the wrapper | ln-select |

The `<select>` element itself never receives an `el.lnSelect`
property. This is deliberate (see Philosophy above). The
`WeakMap` keeps the instance findable via the wrapper's API
without polluting the element's own attribute / property surface.

## Configuration — the merge in detail

The wrapper applies its own defaults FIRST, then the JSON
config from the attribute, with the latter winning. To override
a wrapper default, pass the same key with your value:

```html
<!-- Wrapper default: closeAfterSelect: true -->
<!-- Override:        closeAfterSelect: false (multi-pick stays open) -->
<select data-ln-select='{"closeAfterSelect":false}' name="tags" multiple>…</select>

<!-- Wrapper default: highlight: true -->
<!-- Override:        highlight: false (no match-substring bolding) -->
<select data-ln-select='{"highlight":false}' name="role">…</select>

<!-- Wrapper default: placeholder from the element's placeholder attr -->
<!-- Override:        explicit placeholder string -->
<select data-ln-select='{"placeholder":"Search countries..."}' name="country">…</select>

<!-- Wrapper default: allowEmptyOption: true (so <option value=""> is selectable) -->
<!-- Override:        false (hide the empty option from the dropdown) -->
<select data-ln-select='{"allowEmptyOption":false}' name="role">
    <option value="">Select…</option>
    <option value="admin">Administrator</option>
</select>
```

Beyond the defaults, every TomSelect option is reachable. Common
ones:

| Option | Purpose | Example |
|---|---|---|
| `create` | Allow user-typed new options | `'{"create":true}'` |
| `maxItems` | Cap the number of selected items | `'{"maxItems":3}'` (multiple selects only) |
| `plugins` | TomSelect plugins (drag-drop sort, remove-button, etc.) | `'{"plugins":["remove_button"]}'` |
| `valueField` / `labelField` / `searchField` | Map data shape for `load:` async data | `'{"valueField":"id","labelField":"name","searchField":["name","email"]}'` |
| `load` | Async data fetch | TomSelect docs — function bodies are not JSON-serializable, so this requires `window.lnSelect.initialize(el)` after a manual config object is attached, or a `data-ln-select` config that loads a registered loader by name |
| `render` | Custom dropdown / option / item rendering | Same caveat as `load` — function-valued options need a JS path |

For function-valued options, the JSON-attribute path doesn't
work (JSON has no functions). Two workable patterns:

1. Use the wrapper's defaults via the attribute, then call
   `window.lnSelect.getInstance(el)` and reach for the
   TomSelect instance for any imperative customization.
2. Skip the wrapper entirely and call
   `new TomSelect(el, config)` yourself, with `config` containing
   functions. The wrapper's auto-init then leaves the element
   alone (the `instances.has(element)` guard at line 25 — but
   this only checks the wrapper's own WeakMap; you would also
   want to omit `data-ln-select` so the wrapper doesn't try to
   re-upgrade).

For most admin-form contexts the JSON-attribute path covers the
need.

## API

### Window-level — `window.lnSelect`

```javascript
// Manually initialize a <select> (rare — observer covers most cases)
window.lnSelect.initialize(selectElement);

// Manually destroy (also rare — DOM removal triggers destroy)
window.lnSelect.destroy(selectElement);

// Get the TomSelect instance — the only common pattern
const ts = window.lnSelect.getInstance(selectElement);
ts.addOption({ value: 'new', text: 'New option' });
ts.setValue('new');
ts.clear();
ts.lock();
ts.disable();
```

| Method | Description |
|---|---|
| `initialize(element)` | Upgrade the element if not already upgraded. Idempotent: if `instances.has(element)` returns true, the call is a no-op (line 25). Use only for non-standard cases (Shadow DOM, an iframe document the global observer cannot see, or a manual race against the observer's tick). |
| `destroy(element)` | Tear down the TomSelect instance, unwire the form-reset listener, delete the WeakMap entry. Used internally by the observer's `removedNodes` path; safe to call manually if you are managing the lifecycle yourself. |
| `getInstance(element)` | Return the TomSelect instance for the element, or `undefined` if not upgraded. The single source of truth for finding the wrapper. |

### TomSelect API — via `getInstance(el)`

The wrapper exposes nothing of its own beyond the three methods
above. Everything else comes from the TomSelect instance
returned by `getInstance(el)`:

```javascript
const select = document.getElementById('country');
const ts = window.lnSelect.getInstance(select);

if (!ts) return;  // TomSelect not loaded, or element not yet upgraded

// Common operations
ts.addOption({ value: 'al', text: 'Albania' });
ts.removeOption('al');
ts.refreshOptions();      // re-render the dropdown after add/remove
ts.setValue('al');        // programmatic select; fires change on the underlying <select>
ts.clear();               // empty the selection
ts.disable();             // visual disable
ts.enable();
ts.lock();                // prevent further interaction
ts.unlock();
ts.focus();
ts.getItems();            // currently-selected items
ts.sync();                // re-read from the underlying <select> (rare)
```

Read [TomSelect's docs](https://tom-select.js.org/api/) for the
full surface. The wrapper does not proxy or intercept these
calls.

## Examples

### Basic — single select with search

```html
<form id="user-form" data-ln-form>
    <div class="form-element">
        <label for="role">Role</label>
        <select id="role" name="role" required data-ln-select data-ln-validate>
            <option value="">Select a role…</option>
            <option value="admin">Administrator</option>
            <option value="editor">Editor</option>
            <option value="viewer">Viewer</option>
        </select>
        <ul data-ln-validate-errors>
            <li class="hidden" data-ln-validate-error="required">Please choose a role</li>
        </ul>
    </div>
    <div class="form-actions">
        <button type="submit">Save</button>
    </div>
</form>
```

The `<select>` upgrades to a searchable dropdown. The `required`
attribute combines with `data-ln-validate` — the user must pick a
non-empty value before the submit button enables. TomSelect
handles the keyboard (type to filter, arrow keys, enter to pick);
ln-validate handles the validity surface. Zero JS to wire the
two together.

### Multi-select with cap

```html
<div class="form-element">
    <label for="favorites">Favorite tags (max 3)</label>
    <select id="favorites" name="favorites[]" data-ln-select='{"maxItems":3}' multiple>
        <option value="design">Design</option>
        <option value="engineering">Engineering</option>
        <option value="product">Product</option>
        <option value="marketing">Marketing</option>
        <option value="sales">Sales</option>
    </select>
</div>
```

The `[]` in the `name` attribute is Laravel / Rails / Express
convention for "this is an array on the server side." When the
form serializes (via `ln-form` or native submission), the field
appears as repeated `favorites[]=design&favorites[]=engineering`.
`maxItems: 3` caps the chip pills at 3 — the user cannot add a
fourth.

### Tagging — let users invent values

```html
<div class="form-element">
    <label for="tags">Tags</label>
    <select id="tags" name="tags[]" data-ln-select='{"create":true}' multiple>
        <option value="javascript">javascript</option>
        <option value="php">php</option>
    </select>
</div>
```

`create: true` enables typing a new value and pressing Enter. The
new tag is added to TomSelect's internal options AND the
underlying `<select>` (TomSelect appends `<option>` elements as
the user creates), so on form submit the new tags are in the
serialized payload alongside the existing ones.

If the project wants to validate created values (e.g. limit to
lowercase letters and dashes), pass the `createFilter` option:

```html
<select data-ln-select='{"create":true,"createFilter":"^[a-z][a-z0-9-]*$"}' name="tags[]" multiple>…</select>
```

`createFilter` is a TomSelect option (regex string or function);
the wrapper just passes it through.

### Async — server-driven option loading

JSON cannot express functions, so async loaders need an
imperative config attached to the element BEFORE the wrapper's
auto-init (or by destroying / re-initializing after attachment).
The cleanest pattern is to skip the attribute and call
`new TomSelect(el, config)` directly — but if you want the
wrapper's lifecycle hooks (DOM-remove cleanup, form-reset),
attach the config via a coordinator:

```html
<div class="form-element">
    <label for="customer">Customer</label>
    <select id="customer" name="customer_id" data-ln-select='{"valueField":"id","labelField":"name","searchField":["name","email"]}'></select>
</div>
```

```javascript
// In a project coordinator, after the wrapper has upgraded:
const ts = window.lnSelect.getInstance(document.getElementById('customer'));
if (ts) {
    ts.settings.load = function (query, callback) {
        if (!query.length) return callback();
        fetch('/api/customers?q=' + encodeURIComponent(query))
            .then(function (r) { return r.json(); })
            .then(function (data) { callback(data); })
            .catch(function () { callback(); });
    };
}
```

Imperfect — the loader is wired AFTER the upgrade, so the
initial render does not have it. For pages where the user is
expected to type before any options are needed, this works
cleanly. For pages where the dropdown should fetch on focus,
either pre-warm the options or use the imperative
`new TomSelect()` path.

### Reading the selected value programmatically

```javascript
const select = document.getElementById('role');

// Native — works whether TomSelect is upgraded or not
console.log(select.value);              // "admin"
console.log(select.selectedOptions);    // HTMLCollection of <option>

// Via TomSelect (only after upgrade)
const ts = window.lnSelect.getInstance(select);
if (ts) {
    console.log(ts.getValue());         // "admin"
    console.log(ts.items);              // ["admin"]
    console.log(ts.options['admin']);   // { value: 'admin', text: 'Administrator', ... }
}
```

For most code, `select.value` is the right choice — TomSelect
keeps the underlying `<select>` in sync, so the platform-level
value is always current. Reach for the TomSelect API only when
you need TomSelect-specific shape (option metadata, current
search query, etc.).

### Setting a value programmatically — fires `change`

```javascript
const select = document.getElementById('role');
const ts = window.lnSelect.getInstance(select);

// Right — TomSelect's setValue updates both the visible UI and the underlying <select>,
// and fires change on the <select>
if (ts) {
    ts.setValue('editor');
    // ln-validate's change listener fires; ln-autosave saves; ln-form's submit gate updates
}

// Wrong — direct .value write bypasses TomSelect's UI sync
// select.value = 'editor';  // underlying value is updated, but TomSelect's chip pill / dropdown does NOT re-render

// Workable workaround if you have to use direct write — dispatch change manually:
select.value = 'editor';
select.dispatchEvent(new Event('change', { bubbles: true }));
// TomSelect's internal change listener catches the synthetic event and re-syncs the visible UI
```

The synthetic-`change` workaround is what `ln-form.fill()`,
`ln-form.reset()`, and ln-autosave's construction-time restore all do
under the hood (`js/ln-form/ln-form.js:108-112`). It is the right pattern
for "I just wrote `.value` and need TomSelect to catch up."

### Composing with `ln-autosave` — restore an unfinished selection

```html
<form id="invoice" data-ln-form data-ln-autosave action="/invoices" method="POST">
    <div class="form-element">
        <label for="client">Client</label>
        <select id="client" name="client_id" required data-ln-select data-ln-validate>
            <option value="">Select…</option>
            <option value="1">Acme Corp</option>
            <option value="2">Beta LLC</option>
            <option value="3">Gamma Inc</option>
        </select>
        <ul data-ln-validate-errors>
            <li class="hidden" data-ln-validate-error="required">Choose a client</li>
        </ul>
    </div>
    <!-- … other fields … -->
    <div class="form-actions">
        <button type="button" data-ln-autosave-clear>Cancel</button>
        <button type="submit">Create</button>
    </div>
</form>
```

User picks "Beta LLC", types into other fields, accidentally
closes the tab. They reopen the page. ln-autosave reads the
draft from localStorage, calls `populateForm()` which writes
`client.value = "2"` and dispatches synthetic `change`.
TomSelect's internal change listener fires and re-renders the
chip pill / dropdown to show "Beta LLC" selected. ln-validate's
change listener fires, marks the field touched, validates —
success, no error. ln-form's submit-button gate re-evaluates,
sees every field valid, enables the Save button.

Zero coordinator wiring. Three components, one platform event,
one cohesive UX.

### Re-initializing after AJAX — the observer covers it

```javascript
// AJAX response replaces #content with new markup containing <select data-ln-select>
fetch('/users/42/edit').then(function (r) { return r.text(); }).then(function (html) {
    document.getElementById('content').innerHTML = html;
    // No window.lnSelect.reinit() needed — the MutationObserver in ln-select.js (line 91)
    // sees the new <select> elements via mutation.addedNodes and upgrades them automatically
});
```

The `js/ln-ajax/README.md:95` example that calls
`window.lnSelect.reinit()` is **incorrect** — `reinit` does not
exist on the API surface (lines 147-151 of `ln-select.js` expose
only `initialize`, `destroy`, `getInstance`). The observer at
lines 89-134 handles `childList: true, subtree: true` mutations
and upgrades new elements automatically. Manual reinit is
unnecessary.

### Destroying explicitly — for tab-leave / SPA navigation

```javascript
// Before unmounting a panel that contains <select data-ln-select> elements:
document.querySelectorAll('select[data-ln-select]').forEach(function (sel) {
    window.lnSelect.destroy(sel);
});
// Or just remove the parent element from the DOM — the observer's removedNodes path
// triggers destroy automatically (line 113-122).
```

For SPA-style flows where the page lives long enough that
TomSelect instance leaks would matter, explicit `destroy()`
calls before unmount are the safest pattern. For typical
server-rendered admin panels, DOM removal handles it.

## Common mistakes

### Mistake 1 — Putting `data-ln-select` on a non-`<select>` element

```html
<!-- WRONG — wrapper silently ignores -->
<div data-ln-select>Choose…</div>
<input data-ln-select>
<button data-ln-select>Pick</button>
```

The init scan filters by `select[data-ln-select]` (lines 84,
94, 102, 106, 115, 119). Anything that is not a `<select>`
element is skipped — no error, no `console.warn`, just no
upgrade. The element appears as written.

If you want a similar UX on a non-select element, you are
asking for an autocomplete combo or a tag input — both
TomSelect-shaped, but neither is what the wrapper supports.
Either fork the wrapper or use TomSelect's own non-select
init mode (it can upgrade `<input>` elements directly when
you call `new TomSelect(input)` imperatively).

### Mistake 2 — Forgetting to load TomSelect before ln-ashlar

```html
<!-- WRONG — TomSelect is loaded after ln-ashlar; the wrapper exits at line 17 -->
<script src="dist/ln-ashlar.iife.js"></script>
<script src="tom-select/dist/js/tom-select.complete.min.js"></script>

<select data-ln-select>…</select>
<!-- This <select> stays as a plain native dropdown; the wrapper noop'd at load time -->
```

The wrapper checks `window.TomSelect` synchronously at script
load (lines 15-20). If TomSelect hasn't been parsed yet, the
wrapper installs a no-op API and exits. Loading TomSelect
afterwards does NOT retroactively upgrade — the wrapper's
observer was never registered.

```html
<!-- RIGHT — TomSelect first, ln-ashlar second -->
<link rel="stylesheet" href="tom-select/dist/css/tom-select.css">
<script src="tom-select/dist/js/tom-select.complete.min.js"></script>
<link rel="stylesheet" href="dist/ln-ashlar.css">
<script src="dist/ln-ashlar.iife.js"></script>
```

`defer` is fine on both — they run in document-order at
DOMContentLoaded. Async is NOT fine for TomSelect because the
wrapper's load order matters.

### Mistake 3 — Direct `select.value = ...` write without dispatching `change`

```javascript
// WRONG — TomSelect's visible UI does not update
const select = document.getElementById('role');
select.value = 'admin';
// ln-validate, ln-autosave, ln-form — none of them see the change either
```

Setting `.value` is a silent platform write; neither `change`
nor `input` fires. TomSelect's internal listener does not run,
so the chip pill / dropdown still shows the previous value.
ln-validate doesn't validate. ln-autosave doesn't save. ln-form
doesn't update the submit gate.

```javascript
// RIGHT — option A: use TomSelect's API
const ts = window.lnSelect.getInstance(select);
if (ts) ts.setValue('admin');   // updates UI + dispatches change

// RIGHT — option B: dispatch change after the assignment
select.value = 'admin';
select.dispatchEvent(new Event('change', { bubbles: true }));
// TomSelect's listener catches the synthetic event and re-syncs
```

Option A is the cleaner choice when you have the TomSelect
instance handy. Option B is the pattern `ln-form.fill()` uses
when it doesn't know about TomSelect — and it works because
TomSelect listens for the platform `change` event on the
underlying `<select>`.

### Mistake 4 — Adding options without `refreshOptions()`

```javascript
// WRONG — option is added to TomSelect's internal store, but the dropdown does not re-render
const ts = window.lnSelect.getInstance(select);
ts.addOption({ value: 'new', text: 'New option' });
// User opens the dropdown — does not see the new option
```

```javascript
// RIGHT — refresh the dropdown after adding
ts.addOption({ value: 'new', text: 'New option' });
ts.refreshOptions(false);  // false = don't trigger search; true = re-run current search
```

This is a TomSelect-specific gotcha — read TomSelect's docs for
the full lifecycle. The wrapper does not interpose.

### Mistake 5 — Disabling the underlying `<select>` and expecting TomSelect to follow

```javascript
// WRONG — TomSelect's chip pill / dropdown stays interactive
select.disabled = true;
```

Setting `select.disabled = true` is a platform-level state
change that TomSelect does NOT observe. The chip pill stays
clickable, the dropdown stays openable. The native `<select>`
is hidden by TomSelect (visually); you would not even see the
disabled state.

```javascript
// RIGHT — use TomSelect's API
const ts = window.lnSelect.getInstance(select);
if (ts) {
    ts.disable();      // visual disable, prevents interaction, sets <select>.disabled
    // ts.lock();      // locks current selection but allows browsing dropdown
    // ts.enable();    // re-enable
    // ts.unlock();
}
```

`disable()` is the correct path — it sets `<select>.disabled`
internally AND adds the `.disabled` class to the
`.ts-wrapper` so the visible chip pill is clearly inactive.

### Mistake 6 — Listening for `change` on the `.ts-wrapper` instead of the `<select>`

```javascript
// WRONG — the wrapper DOM is TomSelect-internal; events do not fire here in a useful way
document.querySelector('.ts-wrapper').addEventListener('change', handler);
```

```javascript
// RIGHT — listen on the underlying <select>
document.getElementById('role').addEventListener('change', handler);
// or via TomSelect's API
ts.on('change', handler);
```

The platform-level `change` event on the underlying `<select>`
is the contract. Every form-layer component listens there.
Project code should too.

### Mistake 7 — Calling `window.lnSelect.reinit()`

```javascript
// WRONG — there is no reinit() on the API surface
window.lnSelect.reinit();   // TypeError: window.lnSelect.reinit is not a function
```

The API exposes `initialize`, `destroy`, and `getInstance` —
nothing else. The `MutationObserver` covers AJAX-injected and
attribute-mutation cases automatically. The `reinit()` example
in `js/ln-ajax/README.md:95` is a documentation bug; ignore it.

If you genuinely need to re-upgrade a stale instance (e.g.,
you mutated TomSelect's settings and want a clean slate),
destroy and re-initialize:

```javascript
window.lnSelect.destroy(select);
window.lnSelect.initialize(select);
```

### Mistake 8 — Two `<select data-ln-select>` with the same `name` attribute

```html
<!-- WRONG — both serialize to the same payload key, last one wins -->
<select data-ln-select name="role">…</select>
<select data-ln-select name="role">…</select>
```

This is a platform issue, not a TomSelect or ln-select issue —
two form fields with the same `name` collide on serialize.
ln-select does not coordinate them, does not warn, does not
sync values.

For genuine multi-pick, use one `<select multiple name="role[]">`.
For two truly independent selects, name them distinctly.

### Mistake 9 — Form-reset clears TomSelect's options too

```html
<form id="search-form">
    <select id="filter" data-ln-select='{"create":true}' name="tags[]" multiple>
        <option value="js">js</option>
        <option value="php">php</option>
    </select>
    <button type="reset">Clear</button>
</form>
```

```javascript
// User types and creates "rust" — TomSelect adds the <option> to <select> internally
// User clicks "Clear" — form fires reset
// The wrapper's reset handler runs:
//   - tomSelect.clear()        — clear selection
//   - tomSelect.clearOptions() — remove ALL options from TomSelect's store
//   - tomSelect.sync()         — re-read from <select>'s server-rendered defaults
// Result: only "js" and "php" remain (the original options); "rust" is gone
```

This is by design (`ln-select.js:55-66`) — reset means "back to
the form's initial state," and the user-created tag was not
part of the initial state. If you want reset to preserve
user-created options, override the reset hookup by not using
`<button type="reset">` and instead clearing manually:

```javascript
document.getElementById('clear-button').addEventListener('click', function () {
    const ts = window.lnSelect.getInstance(document.getElementById('filter'));
    if (ts) ts.clear();   // clear selection only; do not touch options
});
```

Or use a `<button type="button" data-ln-autosave-clear>` if
you only want to discard the autosave draft without touching
the live form values.

### Mistake 10 — Expecting TomSelect's dropdown panel to respect a parent `overflow: hidden`

```css
.modal-body { overflow: hidden; }   /* contains the <select data-ln-select> */
```

TomSelect appends its dropdown panel to `<body>` by default, so
parent `overflow: hidden` does NOT clip it. This is intentional
— it prevents the dropdown from being cut off by modal
chrome, scroll containers, or `position: relative` ancestors
without `position: static` siblings.

If you specifically need the dropdown to render inside a parent
(e.g., for a click-outside handler tied to the wrapper's DOM
boundary), pass `dropdownParent: 'body'` (default — verify) or
a CSS selector via TomSelect's options. The wrapper does not
override.

## Related

- **[`ln-form`](../ln-form/README.md)** — the form-level
  coordinator. Listens for `submit`, calls `serializeForm` (which
  reads the underlying `<select>.value` — TomSelect-committed),
  dispatches `ln-form:submit`. `populateForm()` (the engine
  behind `lnForm.fill()`) writes `select.value = ...` and
  dispatches synthetic `change`, which TomSelect catches and
  syncs from. The two compose without coordination.
- **[`ln-validate`](../ln-validate/README.md)** — field-level
  validity. Listens for `change` on every `[data-ln-validate]`
  field including `<select>`. TomSelect commits via the
  underlying `<select>`'s `change` event, so validation runs on
  the platform event automatically. Native constraints
  (`required`, `pattern` on a select-with-value) are honored by
  `dom.checkValidity()`.
- **[`ln-autosave`](../ln-autosave/README.md)** — localStorage
  draft buffer. Save trigger is `change` on the form, which
  fires when TomSelect commits a selection. Restore writes
  `select.value` via `populateForm()` and dispatches synthetic
  `change` — TomSelect re-syncs. The dead-code branch at
  `ln-autosave.js:97-99` (`restored[k].lnSelect.setValue`)
  never executes (instances are in a `WeakMap`, not on the
  element), but the integration works via the synthetic
  `change` event regardless.
- **[`ln-modal`](../ln-modal/README.md)** — composes trivially.
  TomSelect's dropdown appends to `<body>`, escaping any modal
  `overflow: hidden`.
- **[`ln-ajax`](../ln-ajax/README.md)** — the README references
  `window.lnSelect.reinit()` which **does not exist** on the API
  surface. The `MutationObserver` covers AJAX inserts
  automatically; the manual reinit pattern shown in
  `ln-ajax/README.md:95` is a documentation bug. Ignore it.
- **TomSelect** — [`https://tom-select.js.org/`](https://tom-select.js.org/).
  Peer dependency. The wrapper does not redocument TomSelect's
  options; reach for its docs for any feature beyond the
  defaults the wrapper applies.
- **Architecture deep-dive:** [`docs/js/select.md`](../../docs/js/select.md)
  for the WeakMap-vs-property decision, the TomSelect-load
  ordering constraint, and the form-reset hookup mechanics.
- **Form-layer architecture:** [`docs/architecture/data-flow.md`](../../docs/architecture/data-flow.md)
  — ln-select is not one of the four named layers. It is a
  field-level enhancement that attaches to the Submit layer's
  `<select>` boundary; it surfaces user input through the
  platform's own `change` event so every other layer sees a
  normal `<select>` regardless of TomSelect's presence.
</content>
</invoke>
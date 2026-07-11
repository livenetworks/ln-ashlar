# ln-form

A minimal **form manipulation** primitive. `ln-form` does exactly two
things to a native `<form>`: populate it when an `ln-fill` event delivers
a record, and rewrite `action` / `_method` for RESTful edit routing.
Submit is native HTML — `ln-form` never touches it, unless
`data-ln-form-scope` is present (see §5b).

---

## 1. Philosophy

1. **Populate, don't orchestrate.** `ln-form` writes values into the form
   on `ln-fill` and dispatches synthetic `input`/`change` events so
   reactive consumers (`ln-validate`, `ln-autoresize`) react in sync. It
   keeps no validation state and no submit-button logic.
2. **Native submit, always.** Forms MUST carry a real `action` and
   `method` in HTML. Without JavaScript they do a normal native submit.
   PUT/DELETE ride on POST via an auto-ensured hidden `_method` input
   (Laravel method spoofing) — `ln-form` never intercepts `submit`,
   never serializes data, never dispatches a submit event, unless
   `data-ln-form-scope` is present (see §5b).
3. **Transport is someone else's job.** Ajax interception (if wanted) is
   a separate component's concern — it listens to the native `submit`
   event itself. Validation is owned by the browser's constraint
    validation (scoped validation forms MUST carry `novalidate` in the HTML markup to enable submit interception) plus
    `ln-validate` for field error display.

---

## 2. Minimal Blueprint

```html
<form id="user-form" data-ln-form action="/users" method="post">
	<div class="form-element">
		<label for="username">Username</label>
		<input id="username" name="username" required data-ln-validate>
		<ul data-ln-validate-errors>
			<li hidden data-ln-validate-error="required">Username is required</li>
		</ul>
	</div>

	<ul class="form-actions">
		<li><button type="button" data-ln-modal-close>Cancel</button></li>
		<li><button type="submit">Save</button></li>
	</ul>
</form>
```

> [!WARNING]
> Always set `type="button"` on Cancel buttons. Otherwise the browser
> defaults to `type="submit"` and triggers a real submit.

---

## 3. Declarative API Contract

### HTML Attributes

| Attribute | Elements | Description |
| :--- | :--- | :--- |
| `data-ln-form` | `<form>` | Initializes the coordinator. |
| `data-ln-form-action-edit` | `<form>` | Opt-in RESTful action routing. See below. |
| `data-ln-form-action-method="PUT"` | `<form>` | Override verb for `_method` (default `PUT`). Requires `data-ln-form-action-edit`. |
| `data-ln-form-scope` | `<form>` | Opt-in local-first write path. Empty = nearest ancestor `[data-ln-data-coordinator]`. Named = explicit coordinator override. Intercepts submit; incompatible with native/ajax submit on the same form. |

### JS API

Access the instance directly via the `lnForm` property on the form
element:

```javascript
const form = document.getElementById('user-form');

// Bulk populate fields by name (fires synthetic input/change events)
form.lnForm.fill({ username: 'dalibor', role: 'admin' });

// Clean up listeners and destroy the instance
form.lnForm.destroy();
```

---

## 4. DOM Events

### Emitted

| Event | Bubbles | Payload | Description |
| :--- | :--- | :--- | :--- |
| `ln-form:destroyed` | Yes | `{ target: HTMLElement }` | Dispatched when the coordinator is torn down. |
| `ln-form:submit-record` | Yes | `{ scope, action, actionResolved, method, data, form, claimed }` | Only dispatched on forms carrying `data-ln-form-scope`. `claimed` is set synchronously by the owning `ln-data-coordinator`; if still `false` after dispatch, `ln-form` logs a console warning — no silent fallback. |

### Received

| Event | Payload | Description |
| :--- | :--- | :--- |
| `ln-fill` | `record \| null` | Canonical fan-out fill. `detail` → `this.fill(detail)` + apply action mode; `null` → native `form.reset()`. Guarded: only handled when `e.target === self.dom`. |

---

## 5. RESTful action routing (create vs. edit)

For Laravel REST backends, `ln-form` can rewrite `form.action` and inject
a hidden `_method` input driven off the fill record — no coordinator JS,
no second click listener.

**Opt-in:** add `data-ln-form-action-edit` to the `<form>`. Forms without
this attribute are completely inert — this feature does not exist for
them.

### Attributes

| Attribute | On | Description |
| :--- | :--- | :--- |
| `data-ln-form-action-edit` | `<form>` | Opt-in. Empty value = RESTful default (`baseAction + '/' + id`). Non-empty value = template with `:id` placeholder. |
| `data-ln-form-action-edit="/path/:id"` | `<form>` | Template variant — `:id` is replaced with `encodeURIComponent(record.id)`. |
| `data-ln-form-action-method="PUT"` | `<form>` | HTTP verb written into `_method` on edit. Default: `PUT`. |

> The `<input name="_method">` is auto-ensured — do not author it
> manually. `ln-form` creates it on first fill if absent, or reuses the
> existing one.

### Behavior

| Fill state | `form.action` | `<input name="_method">` |
| :--- | :--- | :--- |
| Edit (record with `id`) | Rewritten to edit URL | `PUT` (or custom verb) |
| New (`null` detail) | Restored to base action | `''` (empty — Laravel ignores) |

### Examples

```html
<!-- Minimal: baseAction + '/' + id -->
<form data-ln-form action="/packages" data-ln-form-action-edit>

<!-- Custom template -->
<form data-ln-form action="/packages" data-ln-form-action-edit="/packages/:id">

<!-- Custom verb -->
<form data-ln-form action="/packages"
      data-ln-form-action-edit="/packages/:id"
      data-ln-form-action-method="PATCH">
```

> [!NOTE]
> This feature only rewrites `action`/`_method`. The actual HTTP request
> (native submit or ajax) is out of scope for `ln-form`.

---

## 6. What ln-form does NOT do

- **No transport.** It does not make XHR/fetch requests. Submit is
  native HTML; ajax interception (if desired) belongs to a separate
  component that listens to the native `submit` event.
- **No serialization.** There is no `serializeForm` call, no
  `ln-form:submit` event, no JSON payload. (unscoped forms only — scoped
  forms use `serializeForm` internally, see §5b).
- **No validation orchestration (unscoped forms only).** Constraint validation for unscoped forms is the browser's job; field-level error display is `ln-validate`'s job. Scoped mutation forms, however, trigger full validation on submit via the `ln-validate:request-validate` event, block submit if invalid, focus the first invalid field, and require `novalidate` in the HTML markup.
- **No submit interception** unless `data-ln-form-scope` is present (see
  §5b below). `ln-form` never listens to `submit` and never calls
  `preventDefault()` on unscoped forms.

---

## 5b. Local-first write routing (`data-ln-form-scope`)

A form carrying `data-ln-form-scope` becomes the universal write entry
point for local-first/SPA pages. The `submit` event is intercepted at
three possible rungs, and whichever rung claims it decides the archetype:

1. **Nobody** — native browser submit to `action` (+ `_method`), SSR.
2. **`ln-ajax`** — fetch to `action`, page stays put (progressive
   enhancement). `ln-ajax` explicitly skips forms carrying
   `data-ln-form-scope` (see the `ln-ajax` README).
3. **`ln-data-coordinator`** — a form with `data-ln-form-scope` has its
   submit normalized (`serializeForm`, no interpretation) and dispatched
   as `ln-form:submit-record`. The nearest ancestor
   `[data-ln-data-coordinator]` (or the named coordinator, if
   `data-ln-form-scope="name"`) claims it and routes it through the
   store → queue → connector write pipeline.

Interception is a literal read of the effective method (`_method` input
if present and non-empty, else the form's `method` attribute): `POST` →
create, `PUT`/`PATCH` → update. Any other effective method (`GET`, or a
scoped form with no method set) is **never intercepted** — the native
submit proceeds untouched, so a GET search form nested inside a
coordinator keeps working exactly as before. `ln-form` itself stays
coordinator-blind; it only serializes and dispatches. See
[`docs/js/form.md`](../../docs/js/form.md) for a fuller write-up
(follow-up doc task).

---

## 7. Common Pitfalls

- **Setting `input.value` directly:** Doing `input.value = 'new'` is
  silent in the DOM. Neither validation nor layout systems will detect
  the change. **Always** use `form.lnForm.fill()` or manually dispatch an
  `input`/`change` event.
- **Expecting a submit event:** `ln-form` never dispatches anything on
  submit — there is no `ln-form:submit`. Listen to the form's native
  `submit` event instead.

---

## 8. Integration & Source Files

- **Unified Bundle**: Loaded automatically with the main bundle:
  ```html
  <script src="dist/ln-ashlar.iife.js" defer></script>
  ```
- **Standalone IIFE**: For lightweight pages, load the standalone,
  self-registering IIFE version:
  ```html
  <script src="js/ln-form/ln-form.js" defer></script>
  ```
- **Active Source (ESM)**: Development source is located at
  [js/ln-form/src/ln-form.js](file:///c:/laragon/www/ln-ashlar/js/ln-form/src/ln-form.js).

---

## Related
- **[`ln-validate`](../ln-validate/README.md)** — Field-level validation and error display.
- **[`ln-fill`](../ln-fill/README.md)** — Fan-out fill event source.
- **Architecture deep-dive** — [`docs/js/form.md`](../../docs/js/form.md).

# ln-form

A minimal **form manipulation** primitive. `ln-form` does exactly two
things to a native `<form>`: populate it when an `ln-fill` event delivers
a record, and rewrite `action` / `_method` for RESTful edit routing.
Submit is native HTML — `ln-form` only ever intercepts it to run a
validation gate on `POST`/`PUT`/`PATCH` forms (see §7); a valid submit
is always left native.

---

## 1. Philosophy

1. **Populate, don't orchestrate.** `ln-form` writes values into the form
   on `ln-fill` and dispatches synthetic `input`/`change` events so
   reactive consumers (`ln-validate`, `ln-autoresize`) react in sync. It
   keeps no validation state and no submit-button logic.
2. **Native submit, always.** Forms MUST carry a real `action` and
   `method` in HTML. Without JavaScript they do a normal native submit.
   PUT/DELETE ride on POST via an auto-ensured hidden `_method` input
   (Laravel method spoofing) — `ln-form` never serializes data and
   never dispatches a submit event. It intercepts `submit` only to run
   the validation gate; a valid submit always proceeds natively.
3. **Transport is someone else's job.** Ajax interception (if wanted) is
   a separate component's concern — it listens to the native `submit`
   event itself. Validation is owned by the browser's constraint
   validation plus `ln-validate` for field error display — a form with
   at least one `data-ln-validate` field gets `novalidate` injected
   automatically by `ln-validate`; a form with none keeps native
   validation as the default.

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
- **No serialization, ever.** There is no `serializeForm` call inside
  `ln-form`, no `ln-form:submit-record` event, no JSON payload — scoped
  forms are serialized by the claiming `ln-data-coordinator`, not by
  `ln-form`.
- **No validation orchestration beyond the gate.** Constraint validation display is `ln-validate`'s job. `ln-form` triggers full validation on submit (any method other than `GET`) via the `ln-validate:request-validate` event, blocks submit if invalid, and focuses the first invalid field. `ln-form` never touches `novalidate` itself — `ln-validate` injects it automatically wherever it owns a field.
- **Submit interception is validation-only.** `ln-form` calls
  `preventDefault()` solely to block an invalid submit (focus first
  invalid field) — a valid submit is left alone entirely. Claiming a
  valid submit for the write pipeline (scoped forms only) is
  `ln-data-coordinator`'s job (native `submit`, bubble phase, its own
  `preventDefault()`).

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
   valid submit left native; `ln-form` never intercepts it beyond the
   validation gate (§7 below). The nearest ancestor
   `[data-ln-data-coordinator]` (or the named coordinator, if
   `data-ln-form-scope="name"`) listens for the native `submit` on
   `document` (bubble phase), claims it with `preventDefault()` once its
   own scope/containment matches, serializes the form itself, and routes
   it through the store → queue → connector write pipeline. See the
   `ln-data-coordinator` README for the intake contract.

`ln-form`'s own validation gate reads the effective method (`_method`
input if present and non-empty, else the form's `method` attribute) purely
to decide whether to run `ln-validate:request-validate` at all — `GET` (or
a scoped form with no method set) skips the gate entirely, so a search
form nested inside a coordinator keeps working exactly as before.
`ln-data-coordinator` performs the identical effective-method read
independently, to decide whether to claim the native submit for the write
pipeline (`POST` → create, `PUT`/`PATCH` → update). `ln-form` itself stays
coordinator-blind and never serializes or dispatches a custom event — see
[`docs/js/form.md`](../../docs/js/form.md) for a fuller write-up.

---

## 7. Common Pitfalls

- **Setting `input.value` directly:** Doing `input.value = 'new'` is
  silent in the DOM. Neither validation nor layout systems will detect
  the change. **Always** use `form.lnForm.fill()` or manually dispatch an
  `input`/`change` event.
- **Expecting a submit event:** `ln-form` never dispatches anything on
  submit — there is no `ln-form:submit` and no `ln-form:submit-record`
  either. Listen to the form's native `submit` event, or the resulting
  `ln-store:created`/`ln-store:updated` outcome, instead.

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

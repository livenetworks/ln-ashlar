# ln-slug

Auto-slug micro-component — mirrors a slugified version of a source field into a slug field while the slug field is pristine. Stops mirroring once the user types directly into the slug field; resumes if the slug field is cleared.

## Attributes

| Attribute | On | Description |
|-----------|-----|-------------|
| `data-ln-slug-from="fieldName"` | `<input>` | Activates slug behavior. Value is the `name` of the source field in the same `<form>`. |

## HTML Example

```html
<form>
	<label>
		Name
		<input type="text" name="name">
	</label>
	<label>
		Slug
		<input type="text" name="slug" data-ln-slug-from="name">
	</label>
</form>
```

## Pristine Rules

The component tracks a `_pristine` flag per instance. Mirroring only runs while pristine.

| Situation | Result |
|-----------|--------|
| Slug field is empty at init | pristine = `true` (mirroring active) |
| Slug field is non-empty at init (server-rendered) | pristine = `false` (never overwrite) |
| User types non-empty value into slug field | pristine = `false` (mirroring stops) |
| User clears slug field | pristine = `true` (mirroring resumes) |
| `lnForm.fill` sets a non-empty slug (synthetic input) | pristine = `false` (loaded slug preserved) |
| Form reset clears slug to empty (synthetic input) | pristine = `true` (mirroring resumes) |

**Unified rule:** in the slug's own input handler — `if (_mirroring) return; _pristine = (value === '')`. Both trusted and untrusted inputs follow the same rule once the component's own mirror echo is guarded by the `_mirroring` flag.

## Loop Guard

When the source field triggers a mirror, the component:
1. Sets `_mirroring = true`
2. Sets `slug.value = slugify(source.value)`
3. Dispatches a synthetic `input` event (bubbles, so `ln-validate`/`ln-form` auto-submit react)
4. Sets `_mirroring = false`

The slug's own input handler early-returns while `_mirroring` is true, so the synthetic echo does not flip `_pristine` off.

## Slugify Rules

```
lowercase → replace non-alphanumeric runs with `-` → collapse multiple `-` → strip leading/trailing `-`
```

Example: `"Hello World!"` → `"hello-world"`, `"  test--value  "` → `"test-value"`.

## Limitations

- **ASCII-only (v1):** non-ASCII characters (Cyrillic, Macedonian, accented Latin, CJK) are stripped entirely — they fall into the `[^a-z0-9]+` replacement and become `-`. No transliteration in v1.
- **Source read at init:** `data-ln-slug-from` is read once at construction via `form.elements[name]`. If the source field is added dynamically after init, the component will not find it (warn + bail). Re-initialize the slug input after DOM changes.
- **Single source field:** if multiple fields share the same `name` (RadioNodeList), the component warns and bails. One text field → one slug.

## Events

The component dispatches a synthetic `new Event('input', { bubbles: true })` on the slug field after each mirror. This causes `ln-validate` to re-validate and `ln-form`'s auto-submit debounce to fire. No custom `ln-slug:*` events are emitted.

---

## 🔧 Internals

Source: `js/ln-slug/ln-slug.js`. Single IIFE, `registerComponent`, per-element instance — same micro-component pattern as `ln-autoresize` (no Proxy/state machine, no templates).

### Instance state

| Property | Type | Description |
|----------|------|-------------|
| `dom` | `HTMLInputElement` | The slug input element |
| `source` | `HTMLInputElement` | The resolved source field (`form.elements[name]`) |
| `_pristine` | `boolean` | Whether the slug field is pristine (mirroring active) |
| `_mirroring` | `boolean` | Guard flag — true only while the component is dispatching its own synthetic echo |

### Mirror flow

```
source field 'input' event (isTrusted)
  → _onSource: if (!_pristine) return
  → _mirror():
      _mirroring = true
      slug.value = slugify(source.value)
      slug.dispatchEvent(new Event('input', { bubbles: true }))
          → _onSlug fires → _mirroring true → early return (echo ignored)
          → ln-validate / ln-form auto-submit react (bubbled event)
      _mirroring = false
```

The `_mirroring` guard is what disambiguates the component's own echo from external programmatic fills — both are `isTrusted === false`, separated only by the flag.

### Initialization guards

The constructor warns and bails (returns `this` without attaching listeners) when:
- `dom.tagName !== 'INPUT'` — component applied to non-input
- `dom.form` is null — slug input not inside a `<form>`
- `form.elements[name]` is falsy — source field not found
- `typeof source.addEventListener !== 'function'` — source is a RadioNodeList (same-name group)

### Destroy

`destroy()` removes `_onSource` from the source field and `_onSlug` from the slug field, then deletes `dom[DOM_ATTRIBUTE]`. Guarded by `if (!this.dom[DOM_ATTRIBUTE]) return`, making it idempotent.

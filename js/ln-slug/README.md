# ln-slug

Auto-slug micro-component — mirrors a slugified version of a source field into a slug field while the slug field is pristine. Stops mirroring once the user types directly into the slug field; resumes if the slug field is cleared.

For architecture details — instance state, pristine rule, mirror flow — see [`docs/js/slug.md`](../../docs/js/slug.md).

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

# ln-slug

Auto-slug micro-component. File: `js/ln-slug/src/ln-slug.js`.

## Architecture

Follows the `ln-autoresize` pattern exactly: single IIFE, `registerComponent`, per-element instance, `destroy`, no Proxy/state machine, no templates. Pure behavior micro-component.

## Instance State

| Property | Type | Description |
|----------|------|-------------|
| `dom` | `HTMLInputElement` | The slug input element |
| `source` | `HTMLInputElement` | The resolved source field (`form.elements[name]`) |
| `_pristine` | `boolean` | Whether the slug field is pristine (mirroring active) |
| `_mirroring` | `boolean` | Guard flag — true only while the component is dispatching its own synthetic echo |

## Unified Pristine Rule

The slug's own `input` handler applies one rule for all cases:

```js
if (self._mirroring) return;          // ignore our own echo
self._pristine = (self.dom.value === '');
```

This single line covers:
- **User types non-empty** → `_pristine = false` (mirroring stops)
- **User clears** → `_pristine = true` (mirroring resumes)
- **`lnForm.fill` (synthetic, non-empty)** → `_pristine = false` (loaded slug not overwritten)
- **Form reset (synthetic, empty)** → `_pristine = true` (mirroring resumes after reset)

The `_mirroring` guard separates the component's own synthetic echo from external programmatic fills — both are `isTrusted === false`, disambiguated by the flag alone.

## Mirror Flow

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

## Initialization Guards

The constructor warns and bails (returns `this` without attaching listeners) when:
- `dom.tagName !== 'INPUT'` — component applied to non-input
- `dom.form` is null — slug input not inside a `<form>`
- `form.elements[name]` is falsy — source field not found
- `typeof source.addEventListener !== 'function'` — source is a RadioNodeList (same-name group)

## Destroy

`destroy()` removes `_onSource` from the source field and `_onSlug` from the slug field, then deletes `dom[DOM_ATTRIBUTE]`. The guard `if (!this.dom[DOM_ATTRIBUTE]) return` makes `destroy` idempotent.

# ln-translations

A zero-dependency, event-driven **Form Translation Coordinator** that manages inline multi-lingual inputs by dynamically cloning translatable fields on-demand.

Instead of writing custom layout handlers to manage multi-language fields, this component intercepts locale additions and removals, duplicates translatable fields with appropriate naming conventions, and handles pre-rendered server payloads automatically.

---

## 🧭 Philosophy & Architecture

1. **Inline Field Cloning:** Translatable containers carrying `data-ln-translatable="field"` are treated as templates. When a language is activated, the coordinator clones the inner input/textarea, binds the target language value, and appends it beneath the original.
2. **Deterministic Name Generation:** To support clean form submission, cloned inputs automatically update their name attribute following standard nested arrays:
   - **Default Name**: `scope` becomes `trans[en][scope]` for English.
   - **Nested Name**: `items[5][title]` with prefix `items[5]` becomes `items[5][trans][en][title]`.
3. **Menu & Badge Coordination:** It coordinates locale-selector dropdowns and active language indicator badges using native HTML `<template>` nodes, keeping visual UI elements synchronized in real-time.
4. **Server-Rendered Auto-Detection:** If the server pre-renders localized fields with `data-ln-translatable-lang="{lang}"` on page load, the coordinator auto-detects and integrates them instantly.

---

## 📦 Minimal Blueprint

### Translatable Form Structure
```html
<form data-ln-translations data-ln-translations-default="en">
  <header class="ln-translations__header">
    <h3>Form Content</h3>
    <!-- Active Language Badges -->
    <ul data-ln-translations-active></ul>
    <!-- Locale Add Menu (Dropdown coordinated) -->
    <div data-ln-dropdown>
      <button type="button" data-ln-translations-add data-ln-toggle-for="trans-menu">
        <svg class="ln-icon"><use href="#ln-world"></use></svg>
      </button>
      <ul id="trans-menu" data-ln-toggle data-ln-dropdown-menu></ul>
    </div>
  </header>

  <main>
    <div data-ln-translatable="description">
      <label>Description <textarea name="description">Acme scope...</textarea></label>
    </div>
  </main>
</form>

<!-- REQUIRED GLOBAL TEMPLATES (Declared once before body closing) -->
<template data-ln-template="ln-translations-badge">
  <li>
    <p data-ln-translations-lang>
      <span></span>
      <button type="button" aria-label="Remove"><svg class="ln-icon ln-icon--sm" aria-hidden="true"><use href="#ln-x"></use></svg></button>
    </p>
  </li>
</template>
<template data-ln-template="ln-translations-menu-item">
  <li><button type="button" data-ln-translations-lang></button></li>
</template>
```

---

## 🛠️ Declarative API Contract

### HTML Attributes

| Attribute | Elements | Description |
| :--- | :--- | :--- |
| `data-ln-translations` | `<form>` | Component root. Initializes the translations coordinator. |
| `data-ln-translations-default` | `<form>` | Default language code (e.g. `"en"`). Sets a flag on the original inputs. |
| `data-ln-translations-locales` | `<form>` | Opt-in. Custom locales JSON list (e.g. `'{"en":"English", "de":"German"}'`). |
| `data-ln-translations-add` | `<button>` | Trigger button inside `data-ln-dropdown` to open language menu. |
| `data-ln-translations-active` | `<ul>` | Mount container where active language badges will be rendered. |
| `data-ln-translatable="field"` | Form field wrapper | Marks a translatable group. Value is the entity's field name. |
| `data-ln-translations-prefix` | Form field wrapper | Opt-in. Naming prefix (e.g. `"items[1]"`) for nested form layouts. |
| `data-ln-translatable-lang` | `<input>`, `<textarea>` | Language code identifying a cloned or pre-rendered translation input. |

---

## ⚡ DOM Events

### Telemetry (Dispatched by component)
- **`ln-translations:before-add`** / **`ln-translations:before-remove`** (Cancelable)
  - Detail: `{ target, lang, langName }`
- **`ln-translations:added`** / **`ln-translations:removed`**
  - Detail: `{ target, lang }`

### Commands (Dispatched to component)
- **`ln-translations:request-add`** / **`ln-translations:request-remove`**
  - Detail: `{ lang: string }` (dispatched on the `<form>` to programmatically toggle languages).

---

## ⚠️ Common Pitfalls

- **Forgetting Global Templates:** The coordinator will fail to render badges or locale dropdowns if `ln-translations-badge` and `ln-translations-menu-item` templates are missing from the page.
- **Incorrect Translatable Wrappers:** `data-ln-translatable` must sit on the parent container (e.g. `<div data-ln-translatable="title">`) wrapping the default `<input>`/`<label>`, not on the input itself.
- **Mismatched Prefixes:** When nesting entities (e.g., repeating list items), ensure the translatable wrapper declares the correct scope prefix: `data-ln-translations-prefix="items[index]"` to generate valid submission structures.

# Translations

Multi-language form field management. Clones input fields for each added language, manages a dropdown to add/remove languages, and shows badges for active translations. File: `js/ln-translations/ln-translations.js`.

## HTML

```html
<form data-ln-translations data-ln-translations-default="en" data-ln-translations-locales='{"en":"English","sq":"Shqip","sr":"Srpski"}'>

    <!-- Active language badges -->
    <nav data-ln-translations-active></nav>

    <!-- Add language dropdown -->
    <nav data-ln-dropdown>
        <button type="button" data-ln-translations-add data-ln-toggle-for="lang-menu">Add Language</button>
        <ul id="lang-menu" data-ln-toggle></ul>
    </nav>

    <!-- Translatable field -->
    <div class="form-element" data-ln-translatable="title">
        <label for="title">Title</label>
        <input id="title" name="title" type="text">
    </div>

    <div class="form-element" data-ln-translatable="description" data-ln-translations-prefix="meta">
        <label for="description">Description</label>
        <textarea id="description" name="meta[description]"></textarea>
    </div>
</form>

<!-- Templates (end of body) -->
<template data-ln-template="ln-translations-menu-item">
    <li><button type="button" data-ln-translations-lang></button></li>
</template>

<template data-ln-template="ln-translations-badge">
    <p data-ln-translations-lang>
        <span></span>
        <button type="button" aria-label="Remove"><svg class="ln-icon ln-icon--sm" aria-hidden="true"><use href="#ln-x"></use></svg></button>
    </p>
</template>
```

## Attributes

| Attribute | On | Description |
|-----------|-----|-------------|
| `data-ln-translations` | `<form>` | Creates instance |
| `data-ln-translations-default="lang"` | `<form>` | Default language code (marks original fields) |
| `data-ln-translations-locales='{"en":"English",...}'` | `<form>` | Available locales as JSON (default: en, sq, sr) |
| `data-ln-translations-active` | container | Where language badges are rendered |
| `data-ln-translations-add` | trigger button | Hidden when all languages are active |
| `data-ln-translatable="field"` | wrapper element (`<div>`, `<p>`, `<article>`, etc.) | Marks a field group as translatable |
| `data-ln-translations-prefix="prefix"` | wrapper element | Name prefix for cloned inputs |
| `data-ln-translatable-lang="lang"` | input/textarea | Language code for that field |

## Generated Input Names

When a language is added, cloned inputs get names based on the prefix:

| Prefix | Generated name |
|--------|---------------|
| none | `trans[{lang}][{field}]` |
| `meta` | `meta[trans][{lang}][{field}]` |

## Events

| Event | Bubbles | Cancelable | `detail` |
|-------|---------|------------|----------|
| `ln-translations:before-add` | yes | **yes** | `{ target, lang, langName }` |
| `ln-translations:added` | yes | no | `{ target, lang, langName }` |
| `ln-translations:before-remove` | yes | **yes** | `{ target, lang }` |
| `ln-translations:removed` | yes | no | `{ target, lang }` |

### Request Events (incoming)

| Event | Bubbles | `detail` | Description |
|-------|---------|----------|-------------|
| `ln-translations:request-add` | — | `{ lang }` | Dispatch on the form to add a language programmatically |
| `ln-translations:request-remove` | — | `{ lang }` | Dispatch on the form to remove a language programmatically |

## API

```js
const form = document.querySelector('[data-ln-translations]');
form.lnTranslations.addLanguage('sq');                    // add language
form.lnTranslations.addLanguage('sr', { title: 'Наслов' }); // add with values
form.lnTranslations.removeLanguage('sq');                 // remove language
form.lnTranslations.getActiveLanguages();                 // Set {'sq', 'sr'}
form.lnTranslations.hasLanguage('sq');                    // boolean
form.lnTranslations.destroy();                            // cleanup

// Via request event (coordinator pattern)
form.dispatchEvent(new CustomEvent('ln-translations:request-add', {
    detail: { lang: 'sq' }
}));

// Manual init (Shadow DOM, iframe only)
window.lnTranslations(container);
```

## Behavior

- **Server-rendered translations**: auto-detects existing `[data-ln-translatable-lang]` elements on init
- **Default language**: marks original inputs with `data-ln-translatable-lang="{defaultLang}"` so they don't get removed
- **Dropdown menu**: rebuilt on every add/remove — only shows languages not yet active
- **Trigger hidden**: when all locales are active, the "Add Language" button is hidden
- **Clone logic**: clones the original input (`cloneNode(false)`), sets new `name`, clears `id`, sets placeholder
- **Insertion**: clones inserted after the last translation input for that field

---

## Internal Architecture

### State

Each `[data-ln-translations]` form gets a `_component` instance stored at `element.lnTranslations`. Instance state:

| Property | Type | Description |
|----------|------|-------------|
| `dom` | Element | The form element |
| `activeLanguages` | Set | Currently active language codes |
| `defaultLang` | string | Default language code |
| `locales` | object | Available locales map (`{ code: name }`) |
| `badgesEl` | Element | Container for language badges |
| `menuEl` | Element | The dropdown toggle menu |

### Add Language Flow

```
addLanguage(lang, values)
    |
    v
1. dispatchCancelable 'ln-translations:before-add'
2. If prevented → return
3. Add lang to activeLanguages Set
4. For each [data-ln-translatable] wrapper:
   a. Find original input (default lang or first unnamed)
   b. Clone input (shallow)
   c. Set name: prefix[trans][lang][field] or trans[lang][field]
   d. Clear id, set placeholder, set data-ln-translatable-lang
   e. Insert after last translation input for this field
5. _updateDropdown() — rebuild menu items
6. _updateBadges() — rebuild badge pills
7. dispatch 'ln-translations:added'
```

### Remove Language Flow

```
removeLanguage(lang)
    |
    v
1. dispatchCancelable 'ln-translations:before-remove'
2. If prevented → return
3. querySelectorAll('[data-ln-translatable-lang="{lang}"]') → remove from DOM
4. Delete lang from activeLanguages Set
5. _updateDropdown() + _updateBadges()
6. dispatch 'ln-translations:removed'
```

### Templates

Two templates are required:

- **`ln-translations-menu-item`**: dropdown menu button for adding a language
- **`ln-translations-badge`**: badge pill showing an active language with a remove button

Both are cloned via `cloneTemplate()` from ln-core.

### MutationObserver

A single global observer watches `document.body` for:

- **`childList`** (subtree): new elements → `findElements` auto-initializes forms
- **`attributes`** (`data-ln-translations`): attribute added to existing form → initializes

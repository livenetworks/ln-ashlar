# Translations

Multi-language form field management. Clones input fields for each added language, manages a dropdown to add/remove languages, and shows badges for active translations. File: `js/ln-translations/ln-translations.js`.

See [README §Attributes](../../js/ln-translations/README.md#attributes) for the public attribute contract.

## Internal Architecture

### State

Each `[data-ln-translations]` form gets a `_component` instance stored at `element.lnTranslations`. Instance state:

| Property | Type | Description |
|----------|------|-------------|
| `dom` | Element | The form element |
| `activeLanguages` | Set | Currently active language codes |
| `defaultLang` | string | Default language code |
| `locales` | object | Available locales map (`{ code: name }`) |
| `badgesEl` | Element | Container for language badges (`<ul data-ln-translations-active>`) |
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
   b. Clone input (cloneNode(false)); badge/menu items via cloneTemplate() from ln-core
   c. Set name: prefix[trans][lang][field] or trans[lang][field]
   d. Clear id, set placeholder, set data-ln-translatable-lang
   e. Insert after last translation input for this field
5. _updateDropdown() — rebuild menu items (only languages not yet active)
6. _updateBadges() — rebuild badge pills
7. dispatch 'ln-translations:added'
```

Default language: original inputs are marked with `data-ln-translatable-lang="{defaultLang}"` on init so they are never removed by removeLanguage.

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

Dropdown menu is rebuilt on every add/remove — only shows languages not yet active. Clone insertion: clones are inserted after the last translation input for that field.

### MutationObserver

A single global observer (registered via `registerComponent`
from ln-core) watches `document.body` for new
`[data-ln-translations]` elements (childList) and for the
attribute being added to existing elements (attribute
mutation). No per-instance observer is created.

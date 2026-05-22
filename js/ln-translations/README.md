# ln-translations

Inline translation system for forms. Adds translation inputs below translatable fields — one clone per language, per field.

## Attributes

| Attribute | On | Description |
|-----------|-----|-------------|
| `data-ln-translations` | `<form>` | Initializes instance |
| `data-ln-translations-default` | `<form>` | Default language code — sets flag on original inputs |
| `data-ln-translations-locales='{"en":"English",...}'` | `<form>` | Available locales as JSON (default: en, sq, sr) |
| `data-ln-translations-add` | `<button>` | Trigger button (inside `data-ln-dropdown` wrapper) |
| `data-ln-translations-active` | `<ul>` | Container for active language badges |
| `data-ln-translatable="field"` | form element wrapper (`<p>`, `<label>`, `<div>`, `<article>`) | Marks a translatable field + field name |
| `data-ln-translations-prefix` | `[data-ln-translatable]` | Nested prefix for name attr: `"items[5]"` |
| `data-ln-translatable-lang` | input/textarea | Language code (set by JS or pre-rendered by server) |

## Templates

Required `<template>` elements (before `</body>`):

```html
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

## API

```javascript
// Instance API (on DOM element)
const el = document.querySelector('[data-ln-translations]');
el.lnTranslations.addLanguage('en');                               // add language
el.lnTranslations.addLanguage('en', values);                       // add with existing values
el.lnTranslations.addLanguage('sq', { scope: 'Prodhimi i ushqimit' }); // add with values
el.lnTranslations.removeLanguage('en');                            // remove language
el.lnTranslations.getActiveLanguages();                            // Set of active language codes
el.lnTranslations.hasLanguage('en');                               // boolean

// Manual init — non-standard cases only (Shadow DOM, iframe). Normal DOM is auto-initialized.
window.lnTranslations(container);
```

## Events

| Event | Bubbles | Cancelable | Detail |
|-------|---------|------------|--------|
| `ln-translations:before-add` | yes | **yes** | `{ target, lang, langName }` |
| `ln-translations:added` | yes | no | `{ target, lang, langName }` |
| `ln-translations:before-remove` | yes | **yes** | `{ target, lang }` |
| `ln-translations:removed` | yes | no | `{ target, lang }` |

**Request events (incoming):**

| Event | Bubbles | Detail | Description |
|-------|---------|--------|-------------|
| `ln-translations:request-add` | no | `{ lang }` | Dispatch on the form to add a language |
| `ln-translations:request-remove` | no | `{ lang }` | Dispatch on the form to remove a language |

```javascript
// Dispatch a request event on the component element
element.dispatchEvent(new CustomEvent('ln-translations:request-add', {
    detail: { lang: 'en' }
}));
```

## Flags

Flag icons render via CSS background-image keyed off
`data-ln-translatable-lang`. Lang-code → country-code mapping
lives in `scss/components/_translations.scss`. Adding a new
language is a SCSS edit, not a JS one.

## Name Generation

```
// Without prefix:
name="trans[en][scope]"

// With prefix (nested entities):
// data-ln-translations-prefix="items[5]"
name="items[5][trans][en][title]"
```

## Examples

### Basic

```html
<form data-ln-translations
      data-ln-translations-default="en">
    <header>
        <h3>Company Info</h3>
        <div class="ln-translations__actions">
            <ul data-ln-translations-active></ul>
            <div data-ln-dropdown>
                <button type="button" data-ln-translations-add data-ln-toggle-for="trans-menu">
                    <svg class="ln-icon" aria-hidden="true"><use href="#ln-world"></use></svg>
                </button>
                <ul id="trans-menu" data-ln-toggle></ul>
            </div>
        </div>
    </header>
    <main>
        <p data-ln-translatable="scope">
            <label>Scope <textarea name="scope">Food and beverage production</textarea></label>
        </p>
        <p>
            <label>Code <input type="text" name="code" value="28"></label>
        </p>
    </main>
</form>
```

Server-rendered translations are auto-detected — add `data-ln-translatable-lang="{lang}"` to pre-rendered translation inputs and the component picks them up on init.

### Nested (Prefix)

```html
<form data-ln-translations
      data-ln-translations-default="en">
    <header>
        <h3>Nested Items</h3>
        <div class="ln-translations__actions">
            <ul data-ln-translations-active></ul>
            <div data-ln-dropdown>
                <button type="button" data-ln-translations-add data-ln-toggle-for="trans-menu">
                    <svg class="ln-icon" aria-hidden="true"><use href="#ln-world"></use></svg>
                </button>
                <ul id="trans-menu" data-ln-toggle></ul>
            </div>
        </div>
    </header>
    <main>
        <article data-ln-translatable="title" data-ln-translations-prefix="items[1]">
            <label>Item 1 <input type="text" name="items[1][title]" value="Leadership"></label>
        </article>
        <article data-ln-translatable="title" data-ln-translations-prefix="items[2]">
            <label>Item 2 <input type="text" name="items[2][title]" value="Planning"></label>
        </article>
    </main>
</form>
```

## Behavior

- Server-rendered translations are auto-detected on init via `[data-ln-translatable-lang]` elements already in the DOM.
- The "Add Language" trigger is hidden when all locales are active.

## Integration & Development

### Integration

#### 1. In-Bundle (Standard Integration)
To load `ln-translations` as part of the main `ln-ashlar` bundle, include the compiled IIFE in your document:
```html
<script src="dist/ln-ashlar.iife.js" defer></script>
```

#### 2. Standalone (Zero-Dependency IIFE)
If you wish to load the `ln-translations` component standalone, include its compiled zero-dependency IIFE script directly:
```html
<script src="js/ln-translations/ln-translations.js" defer></script>
```

### Source Files

For development, testing, and debugging, refer to the following local file paths:
- **Source of Truth (Active Development):** [js/ln-translations/src/ln-translations.js](file:///c:/laragon/www/ln-ashlar/js/ln-translations/src/ln-translations.js)
- **Compiled Standalone:** [js/ln-translations/ln-translations.js](file:///c:/laragon/www/ln-ashlar/js/ln-translations/ln-translations.js)


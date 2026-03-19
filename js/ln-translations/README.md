# ln-translations

Inline translation system for forms. Adds translation inputs below translatable fields — one clone per language, per field. Translation inputs are bare clones of the original element with a flag background-image driven by CSS.

## Attributes

| Attribute | On | Description |
|-----------|-----|-------------|
| `data-ln-translations` | container (`<section>`, `<fieldset>`, `<div>`) | Initializes instance |
| `data-ln-translations-locales` | container | JSON: available languages `{"en":"English","sq":"Shqip","sr":"Srpski"}` |
| `data-ln-translations-active` | container | JSON: existing translations `{"en":{"scope":"Production..."}}` |
| `data-ln-translatable="field"` | form element wrapper (`<p>`, `<label>`, `<div>`, `<article>`) | Marks a translatable field + field name |
| `data-ln-translations-prefix` | `[data-ln-translatable]` | Nested prefix for name attr: `"items[5]"` |
| `data-ln-translatable-lang` | cloned input/textarea | Language code (set by JS) |

## API

```javascript
// Instance API (on DOM element)
const el = document.querySelector('[data-ln-translations]');
el.lnTranslations.addLanguage('en');          // add language
el.lnTranslations.addLanguage('en', values);  // add with existing values
el.lnTranslations.removeLanguage('en');       // remove language
el.lnTranslations.getActiveLanguages();       // Set of active language codes
el.lnTranslations.hasLanguage('en');          // boolean

// Constructor — only for non-standard cases (Shadow DOM, iframe)
// Dynamic DOM: MutationObserver auto-initializes
window.lnTranslations(container);
```

## Events

| Event | Bubbles | Cancelable | Detail |
|-------|---------|------------|--------|
| `ln-translations:before-add` | yes | **yes** | `{ target, lang, langName }` |
| `ln-translations:added` | yes | no | `{ target, lang, langName }` |
| `ln-translations:before-remove` | yes | **yes** | `{ target, lang }` |
| `ln-translations:removed` | yes | no | `{ target, lang }` |
| `ln-translations:request-add` | no | no | `{ lang }` |
| `ln-translations:request-remove` | no | no | `{ lang }` |

```javascript
// Cancel adding a language conditionally
element.addEventListener('ln-translations:before-add', function (e) {
    if (!userHasPermission(e.detail.lang)) e.preventDefault();
});

// React after language added
document.addEventListener('ln-translations:added', function (e) {
    console.log('Added:', e.detail.lang, e.detail.langName);
});

// Request events (dispatch on the component element)
element.dispatchEvent(new CustomEvent('ln-translations:request-add', {
    detail: { lang: 'en' }
}));
element.dispatchEvent(new CustomEvent('ln-translations:request-remove', {
    detail: { lang: 'en' }
}));
```

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
<section data-ln-translations
         data-ln-translations-locales='{"en":"English","sq":"Shqip","sr":"Srpski"}'>
    <header><h3>Basic Example</h3></header>
    <main>
        <p data-ln-translatable="scope">
            <label>Scope <textarea name="scope">Производство на храна</textarea></label>
        </p>
        <p>
            <label>Code <input type="text" name="code" value="28"></label>
        </p>
    </main>
</section>
```

### With Existing Translations

```html
<section data-ln-translations
         data-ln-translations-locales='{"en":"English","sq":"Shqip"}'
         data-ln-translations-active='{"en":{"title":"Information Security"}}'>
    <header><h3>Pre-loaded</h3></header>
    <main>
        <p data-ln-translatable="title">
            <label>Title <input type="text" name="title" value="Информациска безбедност"></label>
        </p>
    </main>
</section>
```

### Nested (Prefix)

```html
<section data-ln-translations
         data-ln-translations-locales='{"en":"English"}'>
    <header><h3>Nested Items</h3></header>
    <main>
        <article data-ln-translatable="title" data-ln-translations-prefix="items[1]">
            <label>Item 1 <input type="text" name="items[1][title]" value="Лидерство"></label>
        </article>
        <article data-ln-translatable="title" data-ln-translations-prefix="items[2]">
            <label>Item 2 <input type="text" name="items[2][title]" value="Планирање"></label>
        </article>
    </main>
</section>
```

### Programmatic

```javascript
const el = document.querySelector('[data-ln-translations]');

// Add language
el.lnTranslations.addLanguage('en');

// Add language with values
el.lnTranslations.addLanguage('sq', { scope: 'Prodhimi i ushqimit' });

// Check
el.lnTranslations.hasLanguage('en');          // true
el.lnTranslations.getActiveLanguages();       // Set {'en', 'sq'}

// Remove
el.lnTranslations.removeLanguage('en');
```

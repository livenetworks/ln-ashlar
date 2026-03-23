# ln-translations

Inline translation system for forms. Adds translation inputs below translatable fields — one clone per language, per field. Translation inputs are bare clones of the original element with a flag background-image driven by CSS.

## Attributes

| Attribute | On | Description |
|-----------|-----|-------------|
| `data-ln-translations` | `<form>` | Initializes instance |
| `data-ln-translations-default` | `<form>` | Default language code — sets flag on original inputs |
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
            <button type="button" aria-label="Remove">&times;</button>
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
el.lnTranslations.addLanguage('en');          // add language
el.lnTranslations.addLanguage('en', values);  // add with existing values
el.lnTranslations.removeLanguage('en');       // remove language
el.lnTranslations.getActiveLanguages();       // Set of active language codes
el.lnTranslations.hasLanguage('en');          // boolean

// Constructor — only for non-standard cases (Shadow DOM, iframe)
// Dynamic DOM or setAttribute: MutationObserver auto-initializes
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

## Flags

Flag icons are country SVGs from the `flag-icons` npm package, stored in `assets/flags/` (ISO 3166-1 alpha-2 filenames: `mk.svg`, `gb.svg`, etc.). CSS maps language codes to the correct flag via two Sass collections in `ln-translations.scss`:

**`$lang-flag-overrides`** — languages where the lang code differs from the country code:

| Lang | Flag | Language |
|------|------|----------|
| `en` | `gb` | English |
| `sq` | `al` | Albanian |
| `sr` | `rs` | Serbian |
| `ja` | `jp` | Japanese |
| `ko` | `kr` | Korean |
| `zh` | `cn` | Chinese |
| `cs` | `cz` | Czech |
| `da` | `dk` | Danish |
| `el` | `gr` | Greek |
| `sv` | `se` | Swedish |
| `uk` | `ua` | Ukrainian |
| `sl` | `si` | Slovenian |
| `et` | `ee` | Estonian |
| `ka` | `ge` | Georgian |
| `bs` | `ba` | Bosnian |
| ... | ... | (35 total, see SCSS) |

**`$lang-auto`** — languages where lang code = country code (no override needed):

`mk`, `de`, `fr`, `it`, `bg`, `pt`, `ro`, `nl`, `pl`, `fi`, `hu`, `lt`, `lv`, `tr`, `az`, `is`, `mt`, `lb`, `no`, `ru`, `th`, `id`

### Adding a new language flag

1. Check if the SVG already exists in `assets/flags/` (271 flags available)
2. If lang code = country code (e.g. `se` for Swedish? No — `sv`→`se`, so add to overrides):
   - **Same**: add to `$lang-auto` list in `ln-translations.scss`
   - **Different**: add to `$lang-flag-overrides` map: `lang: 'country-code'`
3. Rebuild: `npm run build`

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
      data-ln-translations-default="mk">
    <header>
        <h3>Company Info</h3>
        <div class="ln-translations__actions">
            <ul data-ln-translations-active></ul>
            <div data-ln-dropdown>
                <button type="button" data-ln-translations-add
                        data-ln-toggle-for="trans-menu" class="ln-icon-globe"></button>
                <ul id="trans-menu" data-ln-toggle></ul>
            </div>
        </div>
    </header>
    <main>
        <p data-ln-translatable="scope">
            <label>Scope <textarea name="scope">Производство на храна</textarea></label>
        </p>
        <p>
            <label>Code <input type="text" name="code" value="28"></label>
        </p>
    </main>
</form>
```

### With Existing Translations (server-rendered)

```html
<form data-ln-translations
      data-ln-translations-default="mk">
    <header>
        <h3>Standard Details</h3>
        <div class="ln-translations__actions">
            <ul data-ln-translations-active></ul>
            <div data-ln-dropdown>
                <button type="button" data-ln-translations-add
                        data-ln-toggle-for="trans-menu" class="ln-icon-globe"></button>
                <ul id="trans-menu" data-ln-toggle></ul>
            </div>
        </div>
    </header>
    <main>
        <p data-ln-translatable="title">
            <label>Title <input type="text" name="title" value="Информациска безбедност"></label>
            <input data-ln-translatable-lang="en" name="trans[en][title]" value="Information Security" placeholder="English translation">
        </p>
    </main>
</form>
```

### Nested (Prefix)

```html
<form data-ln-translations
      data-ln-translations-default="mk">
    <header>
        <h3>Nested Items</h3>
        <div class="ln-translations__actions">
            <ul data-ln-translations-active></ul>
            <div data-ln-dropdown>
                <button type="button" data-ln-translations-add
                        data-ln-toggle-for="trans-menu" class="ln-icon-globe"></button>
                <ul id="trans-menu" data-ln-toggle></ul>
            </div>
        </div>
    </header>
    <main>
        <article data-ln-translatable="title" data-ln-translations-prefix="items[1]">
            <label>Item 1 <input type="text" name="items[1][title]" value="Лидерство"></label>
        </article>
        <article data-ln-translatable="title" data-ln-translations-prefix="items[2]">
            <label>Item 2 <input type="text" name="items[2][title]" value="Планирање"></label>
        </article>
    </main>
</form>
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

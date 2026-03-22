---
name: senior-html-developer
description: "Senior HTML developer persona for semantic, accessible markup using the ln-acme component library. Use this skill whenever writing HTML markup, choosing HTML elements, structuring forms, building accessible interfaces, adding ARIA attributes, structuring page metadata, or reviewing HTML for semantic correctness. Triggers on any mention of semantic HTML, accessibility, ARIA, form structure, heading hierarchy, meta tags, SEO markup, fieldset, landmark elements, or ln-acme HTML patterns. Also use when deciding between div and semantic elements, or when reviewing HTML for accessibility compliance."
---

# Senior HTML Developer

> Stack: Semantic HTML5 | Accessibility-first | ln-acme component patterns

> Visual styling → see senior-css-developer skill
> Behavior/interactivity → see senior-js-developer skill

---

## 1. Identity

You are a senior HTML developer who writes semantic, accessible markup. HTML describes WHAT content is — structure and meaning. It never describes HOW it looks (that's CSS) or HOW it behaves (that's JS). Every element choice is intentional: the most meaningful element first, `<div>` only as a last resort.

---

## 2. Semantic Elements First

Use the most meaningful HTML element for the content.

| Content | Use | Never |
|---------|-----|-------|
| List of items | `<ul>/<li>` or `<ol>/<li>` | `<div>` per item |
| Card / item | `<article>` or `<li>` | `<div class="card">` |
| Content group | `<section>` | `<div class="stack">` |
| Navigation buttons | `<nav>` | `<div class="row">` |
| Code example | `<figure><pre><code>` | `<div class="card"><pre>` |
| Empty state | `<article class="section-empty">` | `<div class="section-empty">` |
| Label / heading | `<h1>`–`<h6>`, `<strong>`, `<label>` | `<small class="text-secondary">` |
| Numeric value | `<strong>`, `<output>`, `<data>` | `<h2>` (numbers are NOT headings) |
| Close / dismiss | `<button class="ln-icon-close">` | `<button>&times;</button>` |
| Separator | `<hr>` | `<div class="divider">` |
| Grouped fields | `<fieldset>` + `<legend>` | `<div class="field-group">` |
| Page header | `<header>` | `<div class="header">` |
| Page footer | `<footer>` | `<div class="footer">` |
| Sidebar | `<aside>` | `<div class="sidebar">` |
| Main content | `<main>` | `<div class="content">` |
| Figure + caption | `<figure>` + `<figcaption>` | `<div>` + `<p class="caption">` |
| Time / date | `<time datetime="...">` | `<span>` |
| Abbreviation | `<abbr title="...">` | `<span>` with tooltip |

---

## 3. Heading Rule

The heading is what **NAMES** the content, not what is visually largest.

```html
<!-- WRONG — number as heading -->
<small class="text-secondary">Employees</small>
<h2>42</h2>

<!-- RIGHT — label is the heading, number is the value -->
<h3>Employees</h3>
<strong>42</strong>
```

### Heading Hierarchy

- One `<h1>` per page — the page title
- Headings must not skip levels (`<h1>` → `<h3>` without `<h2>` is wrong)
- Each `<section>` should have a heading that names it
- Heading level reflects document outline, not visual size (use CSS for sizing)

---

## 4. Bare `<div>` Rule

Every `<div>` MUST have at least one class explaining its existence. If you can't name it, use a semantic element instead.

```html
<!-- WRONG — bare div, no class, no semantic meaning -->
<div>
    <p>Content</p>
</div>

<!-- RIGHT — semantic element -->
<section>
    <p>Content</p>
</section>

<!-- RIGHT — div with class when no better element exists -->
<div class="collapsible-body">
    <p>Content</p>
</div>
```

---

## 5. Icon Markup

ALWAYS use `.ln-icon-*` CSS classes. NEVER use HTML entities (`&times;`, `&#9660;`) or Unicode characters for icons.

```html
<!-- RIGHT -->
<button class="ln-icon-close" data-ln-modal-close></button>
<span class="ln-icon-home"></span>

<!-- WRONG -->
<button>&times;</button>
<span>🏠</span>
```

Size variants: `.ln-icon--sm` (1rem), `.ln-icon--lg` (1.5rem), `.ln-icon--xl` (4rem).

### Accessible Icon Buttons

Icon-only buttons need accessible labels:

```html
<!-- Icon button with accessible label -->
<button class="ln-icon-close" data-ln-modal-close aria-label="Close"></button>
<button class="ln-icon-delete" aria-label="Delete item"></button>

<!-- Icon with adjacent visible text — no aria-label needed -->
<button class="ln-icon-save">Save</button>
```

---

## 6. Form Structure

Forms use semantic containers. The structure is flexible — there is no single mandatory pattern.

### Principles

1. **Semantic containers** — each field is wrapped in a meaningful element (not a bare `<div>`)
2. **No obsolete wrappers** — `<div class="form-group">` and `<div class="form-row">` are FORBIDDEN
3. **Grouped fields** — use `<fieldset>` + `<legend>` for related inputs (checkbox groups, radio groups, address fields)
4. **Validation errors** — use `<ul class="validation-errors">` with `<li>` per error message
5. **Required fields** — just add `required` attribute; the `*` indicator is CSS-driven (never add `*` manually)

### Example A: Explicit label + input (with `for`/`id`)
```html
<form id="my-form">
  <p class="form-element">
    <label for="fname">Name</label>
    <input type="text" id="fname" name="fname" required>
    <ul class="validation-errors">
      <li>Required field</li>
    </ul>
  </p>

  <p class="form-element">
    <label for="category">Category</label>
    <select id="category" name="category">
      <option value="a">Option A</option>
    </select>
  </p>

  <fieldset>
    <legend>Notification preferences</legend>
    <label><input type="checkbox" name="email" value="1"> Email</label>
    <label><input type="checkbox" name="sms" value="1"> SMS</label>
  </fieldset>

  <div class="form-actions">
    <button type="button" class="btn btn--secondary">Cancel</button>
    <button type="submit" class="btn">Save</button>
  </div>
</form>
```

### Example B: Wrapping label (implicit association)
```html
<form id="my-form">
  <label>
    Name
    <input type="text" name="fname" required>
  </label>

  <label>
    <input type="checkbox" name="confirmed" value="1">
    I confirm the data
  </label>

  <div class="form-actions">
    <button type="button" class="btn btn--secondary">Cancel</button>
    <button type="submit" class="btn">Save</button>
  </div>
</form>
```

### Rules
- Either wrapping `<label>` (implicit) or `<label for>` + `<input id>` (explicit) — both are valid
- Field wrapper: `<p class="form-element">`, `<label>`, or other semantic element — NOT `<div class="form-group">`
- Grouped fields: `<fieldset>` + `<legend>` — NOT `<div class="field-group">` or `<div class="checkbox-group">`
- Validation: `<ul class="validation-errors"><li>` per error — NOT `<small>` or `<span>`
- `.form-actions` is a component class — stays in HTML
- `.form-group` and `.form-row` are **OBSOLETE** — never use them

---

## 7. Collapsible / Accordion Structure

```html
<ul data-ln-accordion>
  <li>
    <header data-ln-toggle-for="panel1">Title</header>
    <main id="panel1" data-ln-toggle class="collapsible">
      <section class="collapsible-body">
        <p>Content with padding goes here.</p>
      </section>
    </main>
  </li>
</ul>
```

**Rules:**
- Accordion = `<ul>/<li>`, header = full trigger element
- `.collapsible` on the collapsing parent, `.collapsible-body` on the content child
- Child element is semantic (`<section>`, `<article>`) with a class, NOT a bare `<div>`
- `data-ln-toggle` = JS behavior hook, `class="collapsible"` = CSS animation hook
- `data-ln-toggle-for` = trigger linking attribute

---

## 8. Accessibility / ARIA

### Landmark Roles

Use HTML5 landmarks — they have implicit ARIA roles. Add explicit `role` only when the implicit mapping doesn't apply.

```html
<!-- These have implicit roles — no aria needed -->
<header>        <!-- role="banner" -->
<nav>           <!-- role="navigation" -->
<main>          <!-- role="main" -->
<aside>         <!-- role="complementary" -->
<footer>        <!-- role="contentinfo" -->

<!-- Multiple navs — add aria-label to distinguish -->
<nav aria-label="Main navigation">...</nav>
<nav aria-label="Breadcrumbs">...</nav>
```

### Interactive Elements

```html
<!-- Buttons that toggle — communicate state -->
<button data-ln-toggle-for="panel1" aria-expanded="false" aria-controls="panel1">
    Toggle Panel
</button>
<main id="panel1" data-ln-toggle class="collapsible">...</main>

<!-- Modal — label and role -->
<div class="ln-modal" id="confirm-delete" role="dialog" aria-labelledby="modal-title">
    <form>
        <header>
            <h3 id="modal-title">Confirm Delete</h3>
            <button type="button" class="ln-icon-close" data-ln-modal-close aria-label="Close"></button>
        </header>
        <main>...</main>
    </form>
</div>

<!-- Loading state -->
<button type="submit" class="btn" aria-busy="true" disabled>Saving...</button>
```

### ARIA Rules

- **Don't override native semantics** — `<button role="link">` is wrong, use `<a>`
- **Every interactive element must be keyboard accessible** — if it has a click handler, it must be a `<button>` or `<a>`, never a `<div>` or `<span>`
- **aria-label for icon-only buttons** — always (see section 5)
- **aria-expanded on toggle triggers** — JS updates this automatically via ln-toggle
- **aria-hidden="true"** on decorative elements that screen readers should skip
- **Don't use ARIA when native HTML works** — `required` beats `aria-required="true"`, `<label for>` beats `aria-labelledby`

---

## 9. Meta / SEO Structure

### Document Structure
```html
<!DOCTYPE html>
<html lang="mk">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Page Title — Site Name</title>
    <meta name="description" content="Concise page description, 150-160 chars">
    <link rel="canonical" href="https://example.com/page">

    <!-- Open Graph -->
    <meta property="og:title" content="Page Title">
    <meta property="og:description" content="Page description">
    <meta property="og:type" content="website">
    <meta property="og:url" content="https://example.com/page">
    <meta property="og:image" content="https://example.com/image.jpg">

    <!-- Favicon -->
    <link rel="icon" href="/favicon.svg" type="image/svg+xml">
</head>
```

### Page Outline
```html
<body>
    <header>
        <nav aria-label="Main navigation">...</nav>
    </header>

    <main>
        <h1>Page Title</h1>
        <!-- Primary content -->
    </main>

    <aside>
        <!-- Secondary/supporting content -->
    </aside>

    <footer>
        <!-- Site footer -->
    </footer>
</body>
```

### Rules
- One `<h1>` per page, matching the `<title>` content
- `lang` attribute on `<html>` — use correct language code (`mk`, `en`, `sq`, etc.)
- `<title>` format: `Page Title — Site Name`
- `<meta name="description">` on every public page
- Canonical URL on every page to prevent duplicate content
- Open Graph tags for pages that may be shared on social media

---

## 10. Class Classification in HTML

Not all classes belong in HTML. In the ln-acme system:

**Component classes (KEEP in HTML)** — describe WHAT the element is:

*Interactive:* `.btn`, `.btn--secondary`, `.btn--danger`, `.collapsible`, `.collapsible-body`, `.ln-modal`
*State:* `.pass`, `.fail`, `.warn`, `.hidden`, `.open`
*Structural:* `.section-card`, `.form-actions`, `.nav`, `.nav-section`, `.breadcrumbs`
*Data:* `.numeric`
*Icons:* `.ln-icon-*`, `.ln-icon--sm`, `.ln-icon--lg`, `.ln-icon--xl`

**Presentational classes (FORBIDDEN in project HTML)** — describe HOW it looks:

*Layout:* `.grid-2`, `.grid-4`, `.stack`, `.row`, `.row-between`, `.flex`, `.items-center`
*Typography:* `.text-secondary`, `.text-muted`, `.text-sm`
*Decoration:* `.card`, `.bg-secondary`, `.shadow-md`, `.rounded-lg`, `.gap-3`

→ These exist in the framework for prototyping but production code uses `@include` mixins in SCSS on semantic selectors.

**Inline styles — FORBIDDEN** without exception. Always move to SCSS.

---

## 11. JS Hooks = Data Attributes, Not Classes

JS behavior is bound via `data-ln-*` attributes. Classes are for styling only.

```html
<!-- RIGHT — data attributes for JS, classes for CSS -->
<section data-ln-modal="my-modal" class="section-card">
<button data-ln-toggle-for="sidebar" class="btn">
<input data-ln-search>
<ul data-ln-accordion>

<!-- WRONG — JS bound to CSS class -->
<section class="js-modal">
<button class="js-toggle">
```

---

## 12. Anti-Patterns — NEVER Do These

- Bare `<div>` without a class
- `<div>` when a semantic element exists (`<section>`, `<article>`, `<nav>`, `<ul>/<li>`, `<fieldset>`, `<aside>`, `<header>`, `<footer>`, `<main>`)
- HTML entities for icons (`&times;`, `&#9660;`, `&#10005;`)
- Numbers as headings (`<h2>42</h2>`)
- Skipping heading levels (`<h1>` → `<h3>`)
- Inline `style=""` attributes
- Presentational classes in project HTML (`grid-2`, `card`, `text-secondary`, `stack`, `row`)
- `<div class="form-group">`, `<div class="form-row">`, `<div class="field-group">` (obsolete)
- Manual `*` or `<span>` for required indicators — use `required` attribute + CSS `:has()`
- `<div>` or `<span>` as clickable elements — use `<button>` or `<a>`
- Icon buttons without `aria-label`
- `role` on elements that already have the correct implicit role
- `aria-required="true"` when `required` attribute works
- Missing `lang` attribute on `<html>`
- Multiple `<h1>` elements per page
- `<a href="#">` or `<a href="javascript:void(0)">` — use `<button>` for actions

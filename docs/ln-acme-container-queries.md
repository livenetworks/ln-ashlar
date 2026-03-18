# Container Queries — ln-acme

> Transfer this file to the ln-acme repository and apply the changes described below.

---

## Philosophy

Components in ln-acme do not know where they will be placed. A card grid rendered in a wide main column, a narrow modal, or a sidebar panel must adapt correctly in all three contexts — without the consuming project writing layout-specific overrides.

CSS Container Queries make this possible: the **parent** declares a container context, and the **child** adapts to the available space of that parent — not the viewport.

---

## Mixin to Add

Add to `scss/config/_mixins.scss`:

```scss
// Container context — declare on parent, child queries via @container
@mixin container($name: null) {
    container-type: inline-size;
    @if $name { container-name: $name; }
}
```

Usage in framework SCSS:
```scss
.card-grid { @include container(card-grid); }
.sidebar   { @include container(sidebar); }
```

Usage in project SCSS:
```scss
#folders        { @include container(foldersgrid); }
.search-results { @include container(searchresults); }
.modal-body     { @include container; }   // anonymous — no name needed
```

---

## Standard Breakpoints

Use these consistently across all container-responsive components:

| Value | Use for |
|-------|---------|
| `480px` | 1 → 2 columns in tight containers |
| `580px` | 1 → 2 columns (standard) |
| `880px` | 2 → 3 columns |
| `1120px` | 3 → 4 columns |

---

## Usage Pattern

### Parent (declares context)

```scss
#folders {
    @include container(foldersgrid);
}
```

### Child (queries container, native syntax)

```scss
#folders > ul {
    display: grid;
    grid-template-columns: 1fr;            // baseline: 1 column

    @container foldersgrid (min-width: 580px) {
        grid-template-columns: repeat(2, 1fr);
    }

    @container foldersgrid (min-width: 880px) {
        grid-template-columns: repeat(3, 1fr);
    }
}
```

Child `@container` queries are always written as native CSS — no mixin wrapper.

---

## Naming Convention

Container names: **noun, singular, lowercase, no hyphens** (CSS custom ident rules).

```scss
// RIGHT
container-name: foldersgrid;
container-name: sidebar;
container-name: cardgrid;
container-name: searchresults;

// WRONG
container-name: left-panel;      // named by position
container-name: blue-section;    // named by color
container-name: card-grid;       // hyphens not allowed in CSS ident
```

---

## Rules

- `container-type` always on the **parent**, `@container` always on the **child** — never on the same element
- Do NOT combine `container-type: inline-size` with `overflow: hidden` on the same element — it breaks containment. If clipping is needed, wrap with an extra element
- Use `@container` for reusable components; use `@media` only for app shell / global layout structure
- Anonymous containers (`@include container` without a name) work with unnamed `@container (min-width: ...)` — use only when there is a single container ancestor in scope

---

## Existing Components to Update

The following framework components should be updated to use `@include container` so consuming projects get container-aware behavior by default:

- `grid-2`, `grid-4` grid classes — currently use `@media`; add `container-type` as opt-in
- Any future card grid or list-grid component

> Note: Do not change `grid-2`/`grid-4` in-place without a migration plan — existing projects may rely on media-query behavior.

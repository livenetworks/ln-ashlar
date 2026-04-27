# App Shell

Mobile-ready application shell: fixed header, sidebar drawer, scrim
overlay, footer. File: `scss/config/mixins/_app-shell.scss`. Sidebar
extensions: `scss/config/mixins/_sidebar.scss`. Global bindings:
`scss/components/_app-shell.scss`.

The whole shell is a set of mixins that compose around a small set of
intrinsic tokens:

| Token | Default | Purpose |
|---|---|---|
| `--app-header-height` | `3.5rem` | Fixed header bar height |
| `--app-sidebar-width` | `16rem` | Drawer width — also the desktop content shift |
| `--app-scrim-bg` | semi-transparent black | Overlay behind the mobile drawer |

These are intrinsic component dimensions (not spacing rhythm) — they
stay hardcoded rem values, not `--size-*`. Override on `:root` or on
the shell element to customise.

---

## Structure

Canonical HTML:

```html
<div class="app-wrapper">
    <header class="app-header">
        <div class="header-left">
            <button class="menu-toggle" type="button" data-ln-toggle-for="app-sidebar" aria-label="Menu">
                <svg class="ln-icon" aria-hidden="true"><use href="#ln-menu"></use></svg>
            </button>
            <h1>Dashboard</h1>
        </div>
        <div class="header-right">
            <ul class="header-actions">
                <li><button type="button"><svg class="ln-icon" aria-hidden="true"><use href="#ln-search"></use></svg><span>Search</span></button></li>
                <li><button type="button"><svg class="ln-icon" aria-hidden="true"><use href="#ln-bell"></use></svg><span>Notifications</span></button></li>
            </ul>
            <button class="header-avatar" type="button" data-ln-popover-for="user-menu" aria-label="Account">
                <img src="/me.jpg" alt="">
            </button>
        </div>
    </header>
    <main class="app-main">
        <aside class="app-sidebar" id="app-sidebar" data-ln-toggle>
            <header>
                <img src="/logo.svg" alt="">
                <span class="app-name">Acme Admin</span>
                <button type="button" data-ln-toggle-action="close" aria-label="Close">
                    <svg class="ln-icon" aria-hidden="true"><use href="#ln-x"></use></svg>
                </button>
                <input type="search" data-ln-search placeholder="Search…">
            </header>
            <main>...nav links...</main>
            <footer><small>v1.3.0</small></footer>
        </aside>
        <section>...page content...</section>
        <footer class="app-footer">
            <span>© 2026 Acme</span>
            <span>v1.3.0</span>
        </footer>
        <div class="app-scrim" data-ln-scrim></div>
    </main>
</div>
```

No class is mandatory for the shell to work — the `.app-*` bindings
in `scss/components/_app-shell.scss` are there for prototyping +
drop-in use. Projects can use semantic selectors:

```scss
#shell            { @include app-wrapper; }
#shell > header   { @include app-header; }
#shell > main     { @include app-main; }
#app-sidebar      { @include sidebar; @include sidebar-drawer; }
#shell > main > footer { @include app-footer; }
```

---

## Core mixins

| Mixin | Purpose |
|---|---|
| `@mixin app-wrapper` | Outer column — `flex-col`, `min-height: 100vh`, `bg-recessed` |
| `@mixin app-header` | Fixed top bar — header-height, logical padding/bg/border/shadow, flex row with default ghost buttons |
| `@mixin app-main` | Offset-top main column, sidebar-open padding shift, `> section` content recipe |
| `@mixin sidebar-drawer` | Drawer positioning + open/close transform (layered over `@include sidebar`) |
| `@mixin app-scrim` | Mobile-only overlay, opacity transition on `data-ln-scrim-active` |
| `@mixin app-footer` | Bottom chrome bar — flex, muted color, two-span pattern |

### `@mixin app-header` — ghost buttons by default

The header applies a ghost-surface reset to every descendant
`button`:

```scss
button {
	--btn-bg: transparent;
	--btn-border: transparent;
	padding: 0;
	color: var(--fg-muted);
	box-shadow: none;
	&:focus { box-shadow: none; }
}
```

This makes icon-only triggers (menu toggle, search, notification
bell, avatar trigger) look correct out of the box. Variants that need
bordered buttons (e.g. `app-header-actions`) re-bind `--btn-border`
and `--padding-*` on top of this default.

### `@mixin app-main` — sidebar-open content shift

Desktop-only padding shift when the sidebar is open:

```scss
&:has(.app-sidebar[data-ln-toggle="open"]) {
	padding-left: var(--app-sidebar-width);
}
@include mq-down(md) {
	&:has(.app-sidebar[data-ln-toggle="open"]) {
		padding-left: 0;    // mobile: sidebar overlays, no shift
	}
}
```

Padding lives on the parent so both the content column AND the footer
shift together. Using `margin-left` on a `width: 100%` child would
overflow the viewport — the parent-padding pattern avoids that.

### `@mixin app-main > section` — content column recipe

Every direct `<section>` child of `app-main` is styled as the primary
content column:

```scss
> section {
	@include flex-1;
	@include p(var(--padding-x));
	@include overflow-auto;
	max-width: var(--max-w-container);
	@include mx(auto);
	@include w-full;
	@include stack(var(--gap));
	@include transition;
}
```

Centred, capped, padded, vertical stack. Projects wrap all page
content in `<section>` — no extra container class needed.

### `@mixin app-footer` — two-span pattern

Reads the same logical tokens as `app-header`. The second `<span>`
(typically version / brand / small meta) gets the subtler
`--fg-subtle` tint:

```html
<footer>
    <span>© 2026 Acme</span>
    <span>v1.3.0</span>   <!-- muted -->
</footer>
```

---

## Header region mixins

Four structural mixins and one image-thumbnail mixin for the contents
of `.app-header`:

| Mixin | Global binding | Contents |
|---|---|---|
| `@mixin app-header-left` | `.header-left` | `flex items-center gap(--size-sm-up)`; child `.menu-toggle` (flex-center, 2rem square, rounded-sm); child `h1` (text-xl, font-bold, `--color-fg`, no margin) |
| `@mixin app-header-right` | `.header-right` | `flex items-center gap(--size-md)` |
| `@mixin app-header-actions` | `.header-actions` | Action-button group — bordered pill buttons; child `button > span` is `visually-hidden` below `mq-down(sm)` so labels drop on small screens, icon remains |
| `@mixin header-avatar` | `.header-avatar` | Plain 2rem circular thumbnail with `img { object-fit: cover }` — used as a popover trigger target |

### `@mixin header-avatar` vs `@mixin avatar`

These are distinct. `@mixin avatar` is a profile button with a ring,
hover state, and focus-ring — a first-class interactive element.
`@mixin header-avatar` is a non-interactive image circle sized to
the header bar, typically wrapped by a popover trigger. If you need
the ring/hover/focus-ring, use `avatar`; if you need a simple
cropped thumbnail, use `header-avatar`.

### `@mixin app-header-actions` button styling

Overrides the header's ghost default: bordered buttons, compact
padding, `text-xs`, `radius-sm`. Button labels (`<span>` inside)
become visually-hidden below `sm`:

```html
<ul class="header-actions">
    <li><button type="button">
        <svg class="ln-icon" aria-hidden="true"><use href="#ln-search"></use></svg>
        <span>Search</span>
    </button></li>
</ul>
```

On mobile only the icon is visible; on `sm`+ the label is too.

---

## Sidebar header — brand row + close + search

`@mixin sidebar > header` now absorbs the drawer-sidebar brand-row
pattern. Direct-child rules:

| Child | Styling |
|---|---|
| `> img` | `flex-shrink-0`, `size(2rem)` — brand logo |
| `> .app-name` | `text-lg`, `font-bold`, `text-primary`, `truncate` |
| `> [data-ln-toggle-action="close"]` | `absolute`, top-right `var(--size-sm)`, `--padding-*` re-bound to `--size-2xs` for a compact tap target |
| `> [data-ln-search]` | `w-full`, `mt(--size-xs)` — drops to a full-width second row via `flex-wrap` |

The close button is ONLY visible on mobile (projects typically hide
it above `md`). The search field `flex-wrap`s to a second row below
the brand triad, without any extra wrapper div.

---

## Global bindings

File: `scss/components/_app-shell.scss`. Classes that ship pre-wired:

| Class | Mixin |
|---|---|
| `.app-wrapper` | `@include app-wrapper` |
| `.app-header` | `@include app-header` |
| `.app-main` | `@include app-main` |
| `.app-sidebar` | `@include sidebar; @include sidebar-drawer` |
| `.app-scrim` | `@include app-scrim` |
| `.app-footer` | `@include app-footer` |
| `.header-left` | `@include app-header-left` |
| `.header-right` | `@include app-header-right` |
| `.header-actions` | `@include app-header-actions` |
| `.header-avatar` | `@include header-avatar` |

These exist for rapid prototyping. In production, prefer semantic
selectors + `@include` — same discipline as `.btn` vs
`@include btn`.

---

## Breakpoint behavior

App-shell is the exception to the "components use container queries"
rule. It uses **`@media`** (viewport) breakpoints, because the shell
IS the viewport-level layout. See `docs/css/breakpoints.md` for the
distinction.

- `mq-down(md)` — mobile: sidebar overlays content, scrim visible,
  no content shift, header-action labels hidden
- `mq-up(md)` — desktop: sidebar pushes content right, scrim hidden,
  labels visible

---

## Composition with density

All logical tokens (`--padding-y`, `--padding-x`, `--gap`,
`--font-size`, `--color-fg`, `--color-bg`,
`--color-border`) in app-shell mixins cascade through
`.density-compact`. Intrinsic tokens (`--app-header-height`,
`--app-sidebar-width`) do NOT — the shell preserves its overall
geometry across density modes; only the internal rhythm tightens.

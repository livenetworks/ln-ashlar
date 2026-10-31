---
name: count
classification: css
status: active
domain: frontend
summary: Numeric counter pill for unread items, queue sizes and list totals — inline in nav links or pinned over the corner of header icon buttons.
source: theme/config/mixins/_count.scss
tags: [count, counter, badge, notifications, unread, nav, app-shell]
---

# 🔢 count

---

## 1. Core Behavior & Responsibility

The `count` module (`theme/config/mixins/_count.scss`) styles a numeric counter carried by a `<data>` element:

- **Semantic Element:** `<data value="24">24</data>` — `value` holds the machine-readable number, the text holds the formatted one.
- **Neutral Pill (`count`):** Full-radius pill with tabular numerals, tinted 12% from the local `--color-fg`.
- **Solid Fill (`count-solid`):** Delta that fills with `--color-accent` and `--color-accent-fg`. Tone follows the semantic-color cascade, so a status class on the element (`.error`, `.success`, `.warning`, `.info`) recolors it.
- **Corner Overlay (`count-overlay`):** Delta that pins the counter over the top-end corner of the nearest positioned ancestor. Offsets and size are in `em`, so the geometry tracks the counter's font-size.
- **Structural Bindings (no class needed):**
  - `@mixin nav` — `a > data` gets `count` (trailing, `margin-inline-start: auto`); on `a[aria-current="page"]` it gets `count-solid`.
  - `@mixin app-header-actions` — `button > data` gets `count` + `count-solid` + `count-overlay`; the button is positioned via `:has(> data)`.

---

## 2. Minimal HTML Markup & Usage Variants

### Base HTML Markup (Nav Link Counter)

```html
<nav data-ln-nav="active">
    <ul>
        <li>
            <a href="/orders">
                <svg class="ln-icon" aria-hidden="true"><use href="#ln-icon-clipboard-list"></use></svg>
                <span class="nav-label">Orders</span>
                <data value="37">37</data>
            </a>
        </li>
    </ul>
</nav>
```

### Variant 1: Header Icon Button with Unread Counter

```html
<ul class="header-actions">
    <li>
        <button type="button" data-ln-popover-for="notifications" aria-label="Notifications (3 unread)">
            <svg class="ln-icon" aria-hidden="true"><use href="#ln-icon-bell"></use></svg>
            <data value="3" class="error">3</data>
        </button>
    </li>
</ul>
```

### Variant 2: Semantic SCSS Inclusion

```scss
#inbox-tab > data {
    @include count;
    @include count-solid;
}

#cart-button {
    position: relative;

    > data {
        @include count;
        @include count-solid;
        @include count-overlay;
    }
}
```

---

## 3. SCSS API (Mixins, Classes & Tokens)

| Name | Kind | Parameters / Values | Description |
|---|---|---|---|
| `count` | mixin | — | Neutral counter pill: tabular numerals, full radius, `--color-fg` 12% tint |
| `count-solid` | mixin | — | Delta: solid `--color-accent` fill with `--color-accent-fg` text |
| `count-overlay` | mixin | — | Delta: absolute, pinned over the top-end corner; host must be positioned |
| `.success`, `.error`, `.warning`, `.info` | class | — | Status tone for `count-solid` via the semantic-color cascade |

---

## 4. Accessibility & Common Pitfalls

> [!CAUTION]
> 1. **Label the Trigger, Not Only the Counter:** On an icon-only button the counter is visual. Put the number in the button's `aria-label` (e.g. `aria-label="Notifications (3 unread)"`) and keep it in sync with the `<data>` text.
> 2. **Overlay Needs a Positioned Host:** `count-overlay` is `position: absolute`. Inside `.header-actions` the button is positioned for you; anywhere else the consumer positions the host.
> 3. **Don't Use `badge` for Numbers:** `badge` is a status token with a leading dot; `count` is a number.

---

## 5. Related Documents

- [`navigation`](./navigation.md) — Nav link counters (`a > data`).
- [`app-shell`](./app-shell.md) — Header actions (`button > data`).
- [`status-badge`](./status-badge.md) — Status tokens with semantic colors.

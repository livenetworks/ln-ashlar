# Mixins

Tailwind-like utility mixins from `scss/config/_mixins.scss`. Use `@include` instead of hardcoded CSS.

## Usage

```scss
@use '../config/mixins' as *;

.my-component header {
    @include px(var(--spacing-sm));
    @include py(var(--spacing-xs));
    @include font-semibold;
    @include border-b;
}
```

## Spacing

| Mixin | Output |
|-------|--------|
| `p($val)` | `padding: $val` |
| `px($val)` | `padding-left + right` |
| `py($val)` | `padding-top + bottom` |
| `pt/pb/pl/pr($val)` | Single-side padding |
| `m($val)` / `mx/my/mt/mb/ml/mr($val)` | Margin variants |
| `gap($val)` | `gap: $val` |

## Display & Flex

| Mixin | Output |
|-------|--------|
| `flex` | `display: flex` |
| `flex-col` | `display: flex; flex-direction: column` |
| `flex-center` | flex + center both axes |
| `items-center` | `align-items: center` |
| `justify-between` | `justify-content: space-between` |
| `justify-end` | `justify-content: flex-end` |
| `hidden` | `display: none` |

## Width & Height

| Mixin | Output |
|-------|--------|
| `w-full` | `width: 100%` |
| `h-full` | `height: 100%` |
| `size($val)` | width + height |

## Typography

| Mixin | Output |
|-------|--------|
| `text-xs/sm/base/lg/xl/2xl` | Font size + line-height |
| `font-normal/medium/semibold/bold` | Font weight |
| `uppercase` | `text-transform: uppercase` |
| `tracking-wider` | `letter-spacing: 0.05em` |
| `truncate` | Ellipsis overflow |

## Colors

| Mixin | Output |
|-------|--------|
| `text-primary/secondary/muted` | Text color tokens |
| `text-white` | `color: #fff` |
| `text-error/success/warning` | Status text colors |
| `bg-primary/secondary/body` | Background tokens |

## Borders

| Mixin | Output |
|-------|--------|
| `border` | `1px solid var(--color-border)` |
| `border-t/b/l/r` | Single-side border |
| `border-none` | No border |
| `rounded-sm/md/lg/xl/full` | Border radius tokens |

## Shadows

| Mixin | Output |
|-------|--------|
| `shadow-none/sm/md/lg/xl` | Box-shadow tokens |

## Transitions

| Mixin | Output |
|-------|--------|
| `transition` | `all var(--transition-base)` |
| `transition-fast` | `all var(--transition-fast)` |
| `transition-colors` | color + bg + border transition |

## Position

| Mixin | Output |
|-------|--------|
| `relative/absolute/fixed/sticky` | Position |
| `inset-0` | `top/right/bottom/left: 0` |

## Component Mixins

Composable mixins for semantic selectors:

```scss
// Grid layouts
@include grid;      // 1→2→3 columns responsive
@include grid-2;    // 1→2 columns responsive
@include grid-4;    // 1→2→4 columns responsive

// Stack (vertical flex)
@include stack;        // gap: 1rem
@include stack(0.5rem) // custom gap

// Card
@include card;  // bg + border + rounded + shadow + transition
```

Usage in project:
```scss
#korisnik { @include card; }
.demo-links { @include grid-2; }
```

# Toggle switch

File: `scss/config/mixins/_toggle-switch.scss` + `scss/components/_toggle-switch.scss`.

iOS-style switch. Pure CSS over `input[type="checkbox"]`.

## Usage

```html
<label>
	<input type="checkbox" data-ln-toggle-switch checked>
	Email notifications
</label>
```

The label wraps the input + text. Click anywhere on the label
toggles the switch (native browser behavior).

## Why a separate attribute?

ln-acme already has `ln-toggle` (collapsible panel) and plain
checkboxes (styled via `form-checkbox` mixin). `data-ln-toggle-switch`
distinguishes the iOS switch use case so the other patterns stay
untouched.

## Motion safety

Background color and knob position transitions are gated behind
`prefers-reduced-motion: no-preference`. Reduced-motion users see
instant state changes.

## Accessibility

- Keep the `<input>` in the DOM (don't hide via `display: none`) —
  screen readers need it.
- Pair with `<label>` to provide accessible name.
- State change fires native `change` event.

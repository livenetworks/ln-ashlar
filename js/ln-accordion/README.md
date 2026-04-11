# ln-accordion

Wrapper component — listens for `ln-toggle:open` events from children and closes the others.
Only one `ln-toggle` element can be open at a time.

## Attributes

| Attribute | On | Description |
|---------|-----|------|
| `data-ln-accordion` | parent element | Creates accordion wrapper |

## Example

```html
<ul data-ln-accordion>
    <li>
        <header data-ln-toggle-for="panel1">Section 1</header>
        <section id="panel1" data-ln-toggle="open" class="collapsible">
            <article class="collapsible-body">Content 1</article>
        </section>
    </li>
    <li>
        <header data-ln-toggle-for="panel2">Section 2</header>
        <section id="panel2" data-ln-toggle class="collapsible">
            <article class="collapsible-body">Content 2</article>
        </section>
    </li>
    <li>
        <header data-ln-toggle-for="panel3">Section 3</header>
        <section id="panel3" data-ln-toggle class="collapsible">
            <article class="collapsible-body">Content 3</article>
        </section>
    </li>
</ul>
```

> **Semantics:** The collapsible container is `<section>`, NOT `<main>` (HTML spec: only 1 `<main>` per page).
> The child is `<article>` with `.collapsible-body` class, NOT a bare `<div>`.

- `ul/li` — accordion is a list of items
- `header` is a fully clickable trigger (`data-ln-toggle-for`)
- `.collapsible` on parent → grid collapse (padding:0, collapses to 0)
- `.collapsible-body` on child → overflow:hidden, padding/margins go here
- When `panel2` opens, `panel1` is automatically closed (and vice versa).

### Persistence

Accordion panels persist via individual toggle persistence. Add `data-ln-persist` to each `[data-ln-toggle]` inside the accordion. Each panel stores its state independently. On page reload, the saved panel is restored as open, and the accordion's `ln-toggle:open` listener closes any other open panels — single-open behavior is preserved.

Each `[data-ln-toggle]` must have an `id` (or explicit `data-ln-persist="key"`) for the storage key to resolve. See [ln-toggle README](../ln-toggle/README.md#persistence) for full details.

```html
<ul data-ln-accordion>
    <li>
        <header data-ln-toggle-for="panel1">Section 1</header>
        <section id="panel1" data-ln-toggle="close" data-ln-persist class="collapsible">
            <article class="collapsible-body">Content 1</article>
        </section>
    </li>
    <li>
        <header data-ln-toggle-for="panel2">Section 2</header>
        <section id="panel2" data-ln-toggle="close" data-ln-persist class="collapsible">
            <article class="collapsible-body">Content 2</article>
        </section>
    </li>
</ul>
```

## Events

| Event | Bubbles | Cancelable | Detail |
|-------|---------|------------|--------|
| `ln-accordion:change` | yes | no | `{ target: HTMLElement }` |
| `ln-accordion:destroyed` | yes | no | `{ target: HTMLElement }` |

```javascript
document.addEventListener('ln-accordion:change', function (e) {
    console.log('Active panel:', e.detail.target.id);
});
```

`ln-accordion:change` is fired on the accordion container when a panel opens (after siblings are closed).

## Dependencies

Accordion is a coordinator for `ln-toggle` children. Communication is via the attribute (single source of truth):
- **Listens**: `ln-toggle:open` (bubbles up from toggle child)
- **Closes siblings**: sets `data-ln-toggle="close"` on each sibling toggle — the toggle's MutationObserver handles the rest (events, `.open` class)

Accordion does **NOT** call the toggle API directly (`el.lnToggle.close()`). It sets the attribute, and each toggle's observer independently applies the state change.

This is the canonical example of the **Coordinator/Mediator Pattern** described in [COMPONENTS.md](../COMPONENTS.md) → "Coordinator/Mediator Pattern — canonical example".

## API

```javascript
// Constructor — only for non-standard cases (Shadow DOM, iframe)
// For AJAX/dynamic DOM or setAttribute: MutationObserver auto-initializes
window.lnAccordion(document.body);

// Instance API
const acc = document.querySelector('[data-ln-accordion]');
acc.lnAccordion.destroy();   // removes coordinator, dispatches ln-accordion:destroyed
```

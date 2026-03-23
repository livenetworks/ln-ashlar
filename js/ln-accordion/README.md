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

## Events

| Event | Bubbles | Cancelable | Detail |
|-------|---------|------------|--------|
| `ln-accordion:change` | yes | no | `{ target: HTMLElement }` |

```javascript
document.addEventListener('ln-accordion:change', function (e) {
    console.log('Active panel:', e.detail.target.id);
});
```

`ln-accordion:change` is fired on the accordion container when a panel opens (after siblings are closed).

## Dependencies

Accordion is a coordinator for `ln-toggle` children. Communication is only via events:
- **Listens**: `ln-toggle:open` (bubbles up from toggle child)
- **Dispatches**: `ln-toggle:request-close` on each sibling toggle (toggle itself decides whether to close)

Accordion does **NOT** call the toggle API directly (`el.lnToggle.close()`). Each toggle independently reacts to `request-close`.

This is the canonical example of the **Coordinator/Mediator Pattern** described in [COMPONENTS.md](../COMPONENTS.md) → "Coordinator/Mediator Pattern — canonical example".

## API

```javascript
// Constructor — only for non-standard cases (Shadow DOM, iframe)
// For AJAX/dynamic DOM or setAttribute: MutationObserver auto-initializes
window.lnAccordion(document.body);
```

Accordion has no instance methods — its job is only to coordinate `ln-toggle` children.

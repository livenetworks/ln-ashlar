# Accordion

Coordinator wrapper — listens to `ln-toggle:open` events from children and closes the others. Only one `ln-toggle` can be open at a time. File: `js/ln-accordion/ln-accordion.js`.

## HTML

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
</ul>
```

## Attributes

| Attribute | On | Description |
|-----------|-----|-------------|
| `data-ln-accordion` | parent element | Creates an accordion wrapper |

## Events

| Event | Bubbles | Cancelable | `detail` |
|-------|---------|------------|----------|
| `ln-accordion:change` | yes | no | `{ target: HTMLElement }` |

Fired on the accordion container when a panel opens (after siblings are closed).

## Dependencies

Accordion is a coordinator for `ln-toggle` children. Communication is event-only:
- **Listens to**: `ln-toggle:open` (bubbles up from toggle child)
- **Dispatches**: `ln-toggle:request-close` on each sibling toggle

Accordion never calls toggle API directly (`el.lnToggle.close()`). This is the canonical Coordinator/Mediator Pattern from [COMPONENTS.md](../../js/COMPONENTS.md).

## API

```js
// Manual initialization
window.lnAccordion(document.body);
```

No instance methods — accordion only coordinates `ln-toggle` children.

# ln-scroll

> Binds to `<a>` elements carrying `data-ln-scroll` and smoothly scrolls to the target specified by their `href` hash anchor (e.g. `href="#apply"`).
> Supports declarative form field population via `data-ln-scroll-set`, post-scroll focus management, and cancelable lifecycle events.

## Markup anatomy

```html
<!-- Basic Smooth Scroll Link -->
<a href="#apply" data-ln-scroll>Apply Now</a>

<!-- Smooth Scroll with Form Field Preset -->
<a href="#apply"
   data-ln-scroll
   data-ln-scroll-set="#opportunity_type:Company Driver">
   Apply as Company Driver
</a>

<!-- Customized Scroll Alignment & Target Focus -->
<a href="#quote"
   data-ln-scroll
   data-ln-scroll-behavior="smooth"
   data-ln-scroll-block="center"
   data-ln-scroll-focus="#first_name">
   Get a Quote
</a>
```

## Attribute contract

| Attribute | Role | Default | Description |
|---|---|---|---|
| `data-ln-scroll` | Component selector | — | Activates smooth scrolling on `<a>` elements. Target is read from `href`. |
| `href` | Target selector | — | **Required.** Standard anchor reference (e.g. `#apply`). |
| `data-ln-scroll-set` | Field preset | — | Optional `selector:value` to populate an input/select element prior to scrolling. |
| `data-ln-scroll-behavior` | Scroll behavior | `smooth` | Scroll behavior: `'smooth'` or `'auto'`. |
| `data-ln-scroll-block` | Scroll alignment | `start` | Vertical alignment: `'start'`, `'center'`, `'end'`, or `'nearest'`. |
| `data-ln-scroll-focus` | Focus target | first input/select/textarea | Focuses matching field in target container. Set to `'false'` to disable. |
| `data-ln-scroll-delay` | Focus delay | `450` | Delay in milliseconds before focusing the target field. |
| `data-ln-scroll-update-hash` | Hash update | `false` | When `'true'`, updates browser address bar with `href` via `pushState`. |

## Events API

- `ln-scroll:before-scroll`: Dispatched before scrolling. Cancelable via `e.preventDefault()`. Detail: `{ target, link, href }`.
- `ln-scroll:scrolled`: Dispatched immediately upon initiating scroll. Detail: `{ target, link, href }`.

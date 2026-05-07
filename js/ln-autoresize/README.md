# ln-autoresize

> A `<textarea>` whose height tracks its content — set the attribute,
> the field grows as the user types and shrinks when text is deleted.

## Philosophy

The browser does not auto-size `<textarea>`. Every project that wants
growing comment fields, note inputs, or chat composers ends up writing
the same five lines: listen for `input`, set `height` to `auto`, read
`scrollHeight`, set `height` to that. The five lines are easy to write
and hard to write *right* — the naive version flickers on every
keystroke, miscounts when the textarea inherits a fixed `rows`, drifts
across font loads, and silently breaks if anyone hides the parent.
`ln-autoresize` is the canonical version, and that is the entire
feature surface — no resize sensor, no "max-rows" config, no "shrink
gracefully" mode.

The trick that matters: to make the textarea shrink as well as grow,
the height has to be reset to `auto` *before* `scrollHeight` is read —
otherwise the previous tall height keeps `scrollHeight` pinned and the
textarea never collapses. Browsers reflow synchronously inside the
single function call, so the user only ever sees the final height.

## Markup anatomy

The complete invocation. There is no markup contract beyond this:

```html
<textarea data-ln-autoresize rows="1" placeholder="Notes..."></textarea>
```

The element MUST be a `<textarea>`; the component logs a warning and
bails on anything else. The attribute takes no value — its presence
creates the instance.

`rows="1"` is the *initial* render height before JS attaches. Without
it, browsers default to `rows="2"` and the textarea snaps shut on first
paint when the initial `_resize` runs. `rows` is NOT a "max rows" cap —
once the inline `style.height` is written, it overrides `rows` for the
lifetime of the instance.

To cap growth at a ceiling and scroll past it, pair the attribute with
CSS `max-height` and `overflow-y: auto`:

```scss
textarea[data-ln-autoresize] {
    resize: none;
    max-height: 6rem;
    overflow-y: auto;
}
```

`resize: none` removes the manual drag handle (the global
`@mixin form-textarea` ships `resize: vertical` by default — the manual
handle and auto-grow are the same affordance done two different ways
and they fight each other).

### What state goes where

| Concern | Lives on | Owned by |
|---|---|---|
| Should this textarea auto-size? | `data-ln-autoresize` (presence) | `ln-autoresize` |
| Current height | `style.height` (inline) | `ln-autoresize` (writes after `input` and on construct) |
| Maximum height | CSS `max-height` on the selector | Project SCSS |
| Minimum height | CSS `min-height` on the selector | Project SCSS |
| Initial height before JS | `rows` attribute | Browser layout |

## Attributes

| Attribute | On | Description | Why this attribute |
|---|---|---|---|
| `data-ln-autoresize` | `<textarea>` | Marks the textarea as auto-sizing. No value. | Presence creates the instance and runs the initial `_resize`. The component validates `tagName === 'TEXTAREA'` — applying it to anything else logs a warning and aborts. |

## API (component instance)

`el.lnAutoresize` on a DOM element exposes:

| Property | Type | Description |
|---|---|---|
| `dom` | `HTMLTextAreaElement` | Back-reference to the textarea |
| `_resize()` | method | Force a re-measure. Use after programmatic `.value` writes, after revealing a hidden parent, or after a font load completes. |
| `destroy()` | method | Remove the `input` listener and clear inline `style.height`. The `data-ln-autoresize` attribute is left in place. |

`window.lnAutoresize(root)` re-runs the init scan over `root` — only
needed for Shadow DOM / iframe roots that the global `MutationObserver`
cannot see. Live document inserts are picked up automatically; see
[`docs/js/autoresize.md`](../../docs/js/autoresize.md#mutationobserver-via-registercomponent).

## Examples

### Minimal — basic auto-grow

```html
<textarea data-ln-autoresize rows="1" placeholder="Notes..."></textarea>
```

No CSS needed; the textarea grows with content and never shrinks
below the `rows="1"` initial height (because empty content has the
same `scrollHeight` as one line of text). The default
`@mixin form-textarea` applies `resize: vertical` — for autoresize
you typically want to override that, see next example.

### With max-height cap and scrolling

```html
<textarea id="comment" data-ln-autoresize rows="1" placeholder="Comment..."></textarea>
```

```scss
#comment {
    resize: none;
    max-height: 6rem;
    overflow-y: auto;
}
```

Up to `6rem` the textarea grows; past that, growth stops and a
vertical scrollbar appears inside.

### Pre-filled content (server-rendered)

```html
<textarea data-ln-autoresize>This long server-rendered text will appear at full height on first paint — the initial _resize runs synchronously inside the constructor.</textarea>
```

The constructor calls `_resize()` once before returning, so by the
time the page is interactive the height already matches the content.
There is no flash of the default `rows`-height before the resize
catches up.

### Inside `[data-ln-form]` with fill

```html
<form data-ln-form id="profile-form">
    <div class="form-element">
        <label for="bio">Bio</label>
        <textarea id="bio" name="bio" data-ln-autoresize rows="1"></textarea>
    </div>
</form>
```

```js
const form = document.getElementById('profile-form');
form.dispatchEvent(new CustomEvent('ln-form:fill', {
    detail: { bio: 'Lorem ipsum dolor sit amet…' }
}));
// → ln-form's fill() calls populateForm, which dispatches an `input`
//   event on the textarea after writing .value
// → ln-autoresize's input listener fires and the height adjusts
```

This is the supported coordinator path for programmatic value writes.
Direct `.value =` assignment from your own scripts will set the text
but **not** resize — you must dispatch `input` yourself.

## Common mistakes

### Mistake 1 — Setting `.value` directly and expecting the height to update

Setting `.value` programmatically does not fire `input`, so
`ln-autoresize`'s listener never runs. Either dispatch the event
yourself or use `[data-ln-form]`'s `ln-form:fill`.

```js
const ta = document.querySelector('[data-ln-autoresize]');
ta.value = longString;
ta.dispatchEvent(new Event('input'));
```

### Mistake 2 — Using `rows` as a "max rows" cap

```html
<!-- WRONG — rows="5" does not limit growth -->
<textarea data-ln-autoresize rows="5"></textarea>
```

`rows` is the *initial* visible row count. Once ln-autoresize attaches,
the inline `style.height` it writes overrides whatever height `rows`
produced. The textarea will grow past five rows. To cap at five rows,
use CSS `max-height` plus `overflow-y: auto` (and pick a value in
`em` or `rem` that corresponds to your line-height × 5).

### Mistake 3 — Adding `data-ln-autoresize` to a hidden parent and expecting it to work after reveal

```html
<!-- WRONG — measured at construction (when hidden) -->
<section style="display: none">
    <textarea data-ln-autoresize>Pre-filled long text...</textarea>
</section>
```

When the section is hidden, `scrollHeight` returns 0 and the inline
height is set to `0px`. When the section becomes visible later, the
textarea is collapsed. The component does not know about the visibility
change. Call `_resize()` manually after reveal:

```js
panelEl.addEventListener('ln-toggle:open', function () {
    const ta = panelEl.querySelector('[data-ln-autoresize]');
    if (ta && ta.lnAutoresize) ta.lnAutoresize._resize();
});
```

### Mistake 4 — Bare `<button type="reset">` outside `[data-ln-form]` leaves the height stuck

Native `reset` clears values but does not fire `input`, so the height
stays tall. Two fixes:

1. **Wrap the form in `data-ln-form`** and call `form.lnForm.reset()` —
   the API path dispatches synthetic `input` on every field, which
   `ln-autoresize` catches and uses to shrink. See
   [`ln-form` README](../ln-form/README.md) for the `lnForm.reset()`
   contract.
2. **If `data-ln-form` is not an option**, dispatch `input` manually
   inside a `setTimeout` after the native `reset` event:

   ```js
   form.addEventListener('reset', function () {
       setTimeout(function () {
           form.querySelectorAll('[data-ln-autoresize]').forEach(function (ta) {
               ta.dispatchEvent(new Event('input'));
           });
       }, 0);
   });
   ```

### Mistake 5 — Forgetting to override `resize: vertical` on the textarea selector

```html
<textarea data-ln-autoresize rows="1"></textarea>
```

By default, the global `@mixin form-textarea` sets `resize: vertical`,
which gives the user a manual drag handle in the bottom-right corner.
The handle works — the user can drag — but as soon as they type,
`_resize` overwrites their dragged height with `scrollHeight`. The
result is a confusing "I just resized this and it snapped back"
moment. When you opt into auto-resize, set `resize: none` on the
selector to remove the conflicting affordance.

## Related

- **`@mixin form-textarea`** (`scss/config/mixins/_form.scss`) — the
  default textarea chrome (`min-height: 6rem`, `resize: vertical`).
  Override `resize` to `none` whenever you apply `data-ln-autoresize`.
- **[`ln-form`](../ln-form/README.md)** — the only library component
  that programmatically sets textarea values via a path that ALSO
  dispatches `input`. Use `ln-form:fill` instead of direct
  `.value =` writes whenever the textarea lives inside a
  `[data-ln-form]`.
- **Architecture deep-dive:** [`docs/js/autoresize.md`](../../docs/js/autoresize.md).

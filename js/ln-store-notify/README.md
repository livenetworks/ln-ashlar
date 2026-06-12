# ln-store-notify

Bridges `ln-data-store` mutation events to `ln-toast` notifications. Place `data-ln-store-notify` on the store element to opt in. All-or-nothing in v1 — no per-action wording config.

---

## Attributes

| Attribute | Element | Description |
|---|---|---|
| `data-ln-store-notify` | Store element (`[data-ln-data-store]`) | Opt-in marker. Presence enables toast notifications. |
| `data-ln-store-notify-saved` | Same element | Toast title for `create` and `update` confirmations. Falls back to the action token (`create`/`update`) if absent. |
| `data-ln-store-notify-deleted` | Same element | Toast title for `delete` and `bulk-delete` confirmations. Falls back to the action token. |
| `data-ln-store-notify-failed` | Same element | Toast title for `reverted` events. Falls back to the action token. |

Set the three text attributes for human-readable wording. If omitted, the component uses the action verb (a state token, not hardcoded English prose) — usable as a neutral fallback.

---

## Events

### Listened (on the store element)
- `ln-store:confirmed` `{ action, record?, ids? }` — fires a success toast.
- `ln-store:reverted` `{ action, error? }` — fires an error toast.

### Dispatched (on `window`)
- `ln-toast:enqueue` `{ type, title, message? }` — standard toast channel.

---

## Example

```html
<div data-ln-data-store="documents"
     data-ln-store-endpoint="/api/documents"
     data-ln-store-notify
     data-ln-store-notify-saved="Saved"
     data-ln-store-notify-deleted="Deleted"
     data-ln-store-notify-failed="Not saved"></div>
```

---

## Notes

- The component attaches listeners to its own element (`this.dom`) — events bubble up from the store naturally.
- If per-action custom wording is needed (e.g. different text for create vs. update), keep your own `ln-store:confirmed` listener instead of using this attribute.
- No hardcoded English sentences in the library — all display text comes from attributes.

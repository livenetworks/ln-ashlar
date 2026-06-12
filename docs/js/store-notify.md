# ln-store-notify

> Consumer-facing documentation. Component source: `js/ln-store-notify/src/ln-store-notify.js`.

`ln-store-notify` bridges `ln-data-store` mutation events to `ln-toast` notifications. Place `data-ln-store-notify` on the store element to opt in.

---

## Declarative Attribute Contract

| Attribute | Applied To | Description |
|---|---|---|
| `data-ln-store-notify` | `[data-ln-data-store]` element | Opt-in marker. Enables toast notifications for this store. |
| `data-ln-store-notify-saved` | Same element | Toast title for `create`/`update` confirmations. Falls back to the action token. |
| `data-ln-store-notify-deleted` | Same element | Toast title for `delete`/`bulk-delete` confirmations. Falls back to the action token. |
| `data-ln-store-notify-failed` | Same element | Toast title for `reverted` events. Falls back to the action token. |

Consumers SHOULD set the three text attributes for human wording. If absent, the component emits the action verb (e.g. `create`, `delete`) — a neutral state token, not hardcoded prose.

---

## Event Architecture

### Listened (on the store element)
- `ln-store:confirmed` `{ action, record?, ids? }` — success path; dispatches a success toast.
- `ln-store:reverted` `{ action, error? }` — failure path; dispatches an error toast.

### Dispatched (on `window`)
- `ln-toast:enqueue` `{ type, title, message? }` — standard toast channel (`type` ∈ `success|error|warn|info`).

---

## Toast Payload per Action

| Store event | `action` value | Toast type | Title attr used | Message |
|---|---|---|---|---|
| `ln-store:confirmed` | `create` | success | `data-ln-store-notify-saved` | `record.name` if present |
| `ln-store:confirmed` | `update` | success | `data-ln-store-notify-saved` | `record.name` if present |
| `ln-store:confirmed` | `delete` | success | `data-ln-store-notify-deleted` | — |
| `ln-store:confirmed` | `bulk-delete` | success | `data-ln-store-notify-deleted` | count of deleted ids |
| `ln-store:reverted` | any | error | `data-ln-store-notify-failed` | `detail.error` string |

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

## Design Notes

- v1 is all-or-nothing per store element — no per-action wording config.
- For per-action custom wording, keep your own `ln-store:confirmed` listener instead.
- No hardcoded English in the library. All display text comes from attributes or falls back to the action token.
- The component attaches listeners to its own element (`this.dom`) — store events bubble up naturally.

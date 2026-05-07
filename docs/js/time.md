# Time

Architecture for [`ln-time`](../../js/ln-time/README.md): formatter cache, shared auto-update pool for relative-time elements, and the `extraAttributes` mechanism that ties `datetime` mutations into the render path. Source: `js/ln-time/ln-time.js`.

## Auto-Update

Relative times auto-refresh every 60 seconds via a single shared `setInterval`. The interval starts when the first relative element exists and stops when the last one is removed. Orphaned elements (removed from DOM without `destroy()`) are cleaned up automatically on the next tick.

## Dependencies

- `Intl.DateTimeFormat` (browser built-in)
- `Intl.RelativeTimeFormat` (browser built-in)
- `ln-core` — `registerComponent` (with `extraAttributes: ['datetime']`)

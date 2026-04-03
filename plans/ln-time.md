# Plan: ln-time Component

## Context

All API timestamps are Unix epoch (seconds). Server stores GMT, client formats per user timezone. `ln-time` is a lightweight IIFE component that enhances `<time>` elements with `Intl.DateTimeFormat` formatting.

## HTML Contract

```html
<!-- Blade renders fallback text, JS enhances -->
<time data-ln-time="relative" datetime="1736952600">Jan 15</time>
<time data-ln-time="short" datetime="1736952600">Jan 15</time>
<time data-ln-time="full" datetime="1736952600">January 15, 2025 at 14:30</time>
<time data-ln-time="date" datetime="1736952600">Jan 15, 2025</time>
<time data-ln-time="time" datetime="1736952600">14:30</time>
```

- `datetime` attribute = Unix timestamp (seconds)
- `data-ln-time` attribute value = format mode
- Blade renders the fallback text (server-side, GMT-based) — works without JS
- JS replaces text content with timezone-aware formatted string

## Format Modes

| Mode | Output Example | Intl Options |
|------|---------------|-------------|
| `relative` | "3d ago", "just now", "in 2h" | `Intl.RelativeTimeFormat` |
| `short` | "Jan 15" (same year) / "Jan 15, 2024" (different year) | `{ month: 'short', day: 'numeric' }` + conditional year |
| `full` | "January 15, 2025 at 14:30" | `{ dateStyle: 'long', timeStyle: 'short' }` |
| `date` | "Jan 15, 2025" | `{ dateStyle: 'medium' }` |
| `time` | "14:30" | `{ timeStyle: 'short' }` |

## Locale Resolution

```
data-ln-time-locale attribute → document.documentElement.lang → browser default
```

No locale attribute needed in 99% of cases — `<html lang="en">` is sufficient.

## Relative Time Logic

| Elapsed | Display |
|---------|---------|
| < 60s | "just now" |
| < 60min | "5m ago" |
| < 24h | "3h ago" |
| < 7d | "2d ago" |
| < 30d | "2w ago" |
| >= 30d | Falls back to `short` format |

Future timestamps: "in 5m", "in 3h", etc. (same thresholds).

## Auto-Update (relative mode only)

Relative times go stale. Update strategy:
- Elements with `data-ln-time="relative"` re-render on a single shared interval
- Interval frequency: every 60 seconds
- One `setInterval` for ALL relative elements (not per-element)
- Interval starts when first relative element exists, stops when last is removed
- No auto-update for non-relative modes (they don't go stale)

## Component Structure

### Files

```
js/ln-time/ln-time.js       ← IIFE component
js/index.js                  ← add import './ln-time/ln-time.js'
```

No SCSS needed — `<time>` inherits text styles from parent.

### IIFE Pattern (follow existing conventions)

```
DOM_SELECTOR = 'data-ln-time'
DOM_ATTRIBUTE = 'lnTime'
```

- `findElements(root, selector, attribute, Component)` from ln-core
- MutationObserver watches for `data-ln-time` additions/changes
- `attributeFilter: ['data-ln-time', 'datetime']` — re-render if either changes
- Guard: `if (window[DOM_ATTRIBUTE] !== undefined) return`

### Instance API

```javascript
const timeEl = document.querySelector('time');
timeEl.lnTime.render();    // Force re-render
timeEl.lnTime.destroy();   // Cleanup (remove from auto-update pool)
```

### Formatters (cached)

`Intl.DateTimeFormat` and `Intl.RelativeTimeFormat` instances are expensive to create. Cache by locale + options combo:

```javascript
// Module-level cache (inside IIFE)
const formatters = {};  // key: locale + options hash → Intl.DateTimeFormat instance
```

## Edge Cases

- `datetime` empty or missing → skip, don't crash
- `datetime` not a number → skip (could be ISO string from non-ln-acme source)
- Timestamp = 0 (epoch) → render normally (Jan 1, 1970)
- Future timestamps → relative mode shows "in X"
- Element removed from DOM → auto-update pool cleaned up via WeakSet or MutationObserver

## After Implementation

Update `todo.md` — mark `ln-time.js` as done in both sections ("Data Layer — Unix Timestamps" and "ln-acme Implementation").

## Verification

1. Add `<time data-ln-time="relative" datetime="RECENT_TIMESTAMP">fallback</time>` to a demo page
2. Confirm text updates to timezone-aware relative string
3. Test all 5 modes with same timestamp
4. Test locale override: `<html lang="mk">` → Macedonian month names
5. Test dynamic insertion (innerHTML) → MutationObserver auto-inits
6. Test `datetime` attribute change → re-renders
7. Wait 60s → confirm relative time updates
8. Remove element → confirm no orphan interval

## Anti-Patterns

- Don't parse ISO 8601 strings — this component works with Unix timestamps only
- Don't use `setInterval` per element — one shared interval
- Don't format on the server what JS will re-format — Blade fallback is for no-JS only
- Don't add SCSS — `<time>` inherits styles, no visual decoration needed

# ln-time

Timezone-aware timestamp formatting. Enhances `<time>` elements with `Intl.DateTimeFormat` and `Intl.RelativeTimeFormat`. Blade renders a fallback — JS replaces with localized, timezone-aware output.

## Attributes

| Attribute | On | Description |
|-----------|-----|-------------|
| `data-ln-time="mode"` | `<time>` | Format mode: `relative`, `short`, `full`, `date`, `time` |
| `datetime="1736952600"` | `<time>` | Unix timestamp in seconds |
| `data-ln-time-locale="mk"` | `<time>` | Override locale (default: `<html lang>` or browser) |

## Format Modes

| Mode | Output Example | Intl Options |
|------|---------------|-------------|
| `relative` | "3 hr. ago", "now", "in 2 hr." | `Intl.RelativeTimeFormat` |
| `short` | "Jan 15" (same year) / "Jan 15, 2024" (different year) | `{ month: 'short', day: 'numeric' }` + conditional year |
| `full` | "January 15, 2025 at 2:30 PM" | `{ dateStyle: 'long', timeStyle: 'short' }` |
| `date` | "Jan 15, 2025" | `{ dateStyle: 'medium' }` |
| `time` | "2:30 PM" | `{ timeStyle: 'short' }` |

## HTML Structure

```html
<!-- Blade renders fallback text, JS enhances -->
<time data-ln-time="relative" datetime="1736952600">Jan 15</time>
<time data-ln-time="short" datetime="1736952600">Jan 15</time>
<time data-ln-time="full" datetime="1736952600">January 15, 2025</time>
<time data-ln-time="date" datetime="1736952600">Jan 15, 2025</time>
<time data-ln-time="time" datetime="1736952600">14:30</time>

<!-- Locale override -->
<time data-ln-time="full" datetime="1736952600" data-ln-time-locale="mk">fallback</time>
```

## Relative Time Thresholds

| Elapsed | Unit | Example |
|---------|------|---------|
| < 10s | — | "now" (via `Intl.RelativeTimeFormat` `numeric: 'auto'`) |
| < 60s | second | "45 sec. ago" |
| < 60min | minute | "5 min. ago" |
| < 24h | hour | "3 hr. ago" |
| < 7d | day | "2 days ago" |
| < 30d | week | "2 wk. ago" |
| >= 30d | — | Falls back to `short` format |

Future timestamps use the same thresholds — `Intl.RelativeTimeFormat` produces "in 5 min." automatically.

## Auto-Update

Relative times auto-refresh every 60 seconds via a single shared `setInterval`. The interval starts when the first relative element exists and stops when the last one is removed. Orphaned elements (removed from DOM without `destroy()`) are cleaned up automatically.

## Locale Resolution

```
data-ln-time-locale attribute → document.documentElement.lang → browser default
```

No locale attribute needed in most cases — `<html lang="en">` is sufficient.

## Accessibility

Non-full modes set a `title` attribute with the full formatted date, providing a tooltip on hover.

## API

```javascript
// Manual init (not needed — MutationObserver handles dynamic elements)
window.lnTime(document.body);

// Instance API
const el = document.querySelector('time[data-ln-time]');
el.lnTime.render();    // Force re-render
el.lnTime.destroy();   // Cleanup (remove from auto-update pool)
```

## Reactive Updates

```javascript
// Change timestamp — auto re-renders
el.setAttribute('datetime', '1700000000');

// Change mode — auto re-renders
el.setAttribute('data-ln-time', 'date');
```

## Edge Cases

- `datetime` empty or missing — skipped, fallback text preserved
- `datetime` not a number (ISO string) — skipped
- Timestamp `0` (epoch) — rendered normally (Jan 1, 1970)
- Element removed from DOM — cleaned up on next interval tick

## Example: Laravel Blade

```blade
{{-- Server renders GMT fallback, JS enhances with user's timezone --}}
<time data-ln-time="relative" datetime="{{ $user->created_at->timestamp }}">
    {{ $user->created_at->diffForHumans() }}
</time>

<time data-ln-time="full" datetime="{{ $order->placed_at->timestamp }}">
    {{ $order->placed_at->format('F j, Y \a\t H:i') }}
</time>
```

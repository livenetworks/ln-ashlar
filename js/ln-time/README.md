# ln-time

A zero-dependency, progressive **Timezone-Aware Timestamp Formatter** that localizes standard HTML `<time>` elements using native browser APIs.

It replaces server-rendered fallback text with localized, timezone-aware date and time formats, performing automatic live updates for relative timestamps using a single shared timer scheduler.

---

## 🧭 Philosophy & Architecture

1. **Progressive Enhancement:** Server layouts (e.g. Laravel Blade templates) render standard text fallbacks inside native `<time>` elements. If JavaScript fails or is blocked, the original text is preserved; when active, the component compiles and overwrites it.
2. **Standard-Based API Concurrency:** Built entirely on standard browser APIs (`Intl.DateTimeFormat` and `Intl.RelativeTimeFormat`). It bypasses heavy date-parsing libraries, leveraging the browser's native locale and timezone mappings.
3. **Shared Interval Loop:** Dynamic relative timestamps (e.g., "5 minutes ago") auto-update every 60 seconds. Instead of spinning up individual intervals, a single global interval manager coordinates all active elements, automatically purging detached nodes.
4. **Reactive State Resolution:** All state changes are governed by native HTML attributes. Changing `datetime` or `data-ln-time` triggers automatic DOM re-renders via `MutationObserver` synchronization.

---

## 📦 Minimal Blueprint

### Static Localized Date
Provide a Unix timestamp (in seconds) via `datetime` and specify the formatting mode.
```html
<!-- Server renders a fallback, JS enhances with user timezone and locale -->
<time data-ln-time="full" datetime="1736952600">January 15, 2025</time>
```

### Auto-Updating Relative Timestamp
```html
<!-- Automatically updates every 60s (e.g. "3 minutes ago") -->
<time data-ln-time="relative" datetime="1736952600">Jan 15</time>
```

### Custom Localized Override
```html
<!-- Localizes the time string to Macedonian regardless of browser defaults -->
<time data-ln-time="full" datetime="1736952600" data-ln-time-locale="mk">Јануари 15, 2025</time>
```

---

## 🛠️ Declarative API Contract

### HTML Attributes

| Attribute | Elements | Description |
| :--- | :--- | :--- |
| `data-ln-time` | `<time>` | Format mode: `relative`, `short`, `full`, `date`, `time`. |
| `datetime` | `<time>` | **Required**. Unix timestamp in **seconds** (not milliseconds). |
| `data-ln-time-locale`| `<time>` | Opt-in. Force-overrides translation locale (e.g. `"de"`, `"mk"`). |

### Format Modes

| Mode | Output Example | Intl Engine |
| :--- | :--- | :--- |
| `relative` | `"3 hr. ago"`, `"just now"`, `"in 2 hr."` | `Intl.RelativeTimeFormat` |
| `short` | `"Jan 15"` (current year) / `"Jan 15, 2024"` | `{ month: 'short', day: 'numeric' }` |
| `full` | `"January 15, 2025 at 2:30 PM"` | `{ dateStyle: 'long', timeStyle: 'short' }` |
| `date` | `"Jan 15, 2025"` | `{ dateStyle: 'medium' }` |
| `time` | `"2:30 PM"` | `{ timeStyle: 'short' }` |

---

## ⚡ Live Relative Thresholds

| Elapsed Time | Evaluated Unit | Output Example (English) |
| :--- | :--- | :--- |
| `< 10 seconds` | — | `"now"` |
| `< 60 seconds` | `second` | `"45 sec. ago"` |
| `< 60 minutes` | `minute` | `"5 min. ago"` |
| `< 24 hours` | `hour` | `"3 hr. ago"` |
| `< 7 days` | `day` | `"2 days ago"` |
| `< 30 days` | `week` | `"2 wk. ago"` |
| `>= 30 days` | — | Falls back to static `short` date. |

---

## ⚠️ Common Pitfalls

- **Passing Millisecond Timestamps:** Standard database fields and JS date objects often return milliseconds (13 digits). `ln-time` maps strictly to Unix seconds (10 digits). Divide milliseconds by `1000` before rendering.
- **Using ISO Strings:** `datetime="2025-01-15T14:30:00Z"` is not parsed. The component skips non-numeric values, leaving the original fallback text.
- **Empty `datetime` Attributes:** If the `datetime` attribute is omitted or empty, the component will skip formatting to preserve server fallback strings.

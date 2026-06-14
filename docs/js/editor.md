# ln-editor — Architecture Reference

## Overview

`ln-editor` is a lightweight WYSIWYG rich text editor that enhances a `<textarea>` into a `contentEditable` editing surface. It follows the progressive enhancement pattern: without JS, the textarea works as a plain text input.

## Internal State

| Property | Type | Description |
|----------|------|-------------|
| `_textarea` | HTMLTextAreaElement | The original textarea (hidden, synced) |
| `_surface` | HTMLDivElement | The `contentEditable` editing surface (JS-created) |

The component stores no formatting state — it queries the browser's `queryCommandState` and DOM ancestry on every `selectionchange` event.

## Lifecycle

### Construction

```
[data-ln-editor] found by registerComponent
  ↓
Find <textarea> inside container
  ↓
Read textarea.value as initial HTML
  ↓
Create <div contenteditable> (.ln-editor__surface)
  ↓
Mark textarea with data-ln-editor-source (CSS hides it)
  ↓
Insert surface after <nav> toolbar
  ↓
Bind events (input, paste, keydown, selectionchange)
```

### Content Sync

```
User types / pastes / formats
  ↓
surface 'input' event fires
  ↓
surface.innerHTML → textarea.value (one-way sync)
  ↓
dispatch ln-editor:changed { html }
```

The sync is continuous and one-directional: editing surface → textarea. The textarea value is always the current HTML of the editing surface.

### Formatting

```
User clicks toolbar button [data-ln-editor-action="bold"]
  ↓
mousedown: e.preventDefault() (preserves selection in surface)
  ↓
click: read action from data attribute
  ↓
dispatch ln-editor:before-change (cancelable)
  ↓
surface.focus() + document.execCommand('bold')
  ↓
sync innerHTML → textarea.value
  ↓
update active states on all toolbar buttons
  ↓
dispatch ln-editor:changed
```

### Active State Tracking

On every `selectionchange` event:

1. Check if selection is within `_surface`
2. For each `[data-ln-editor-action]` button in the toolbar:
   - **Inline commands:** `document.queryCommandState('bold')` etc.
   - **Block commands:** walk up from selection anchor to find `<h2>`, `<blockquote>`, etc.
   - **List commands:** `document.queryCommandState('insertOrderedList')` etc.
   - **Link:** check if selection anchor is inside an `<a>` tag
3. Toggle `.ln-editor-active` class accordingly

### Paste Sanitization

```
paste event
  ↓
e.preventDefault()
  ↓
Read e.clipboardData.getData('text/html')
  fallback: getData('text/plain') → convert \n to <br>/<p>
  ↓
Parse into temporary <div>
  ↓
Recursive walk: for each element
  - Allowed tag → strip attributes (keep href on <a>) → recurse
  - Disallowed tag → unwrap (replace with children) → recurse
  - Text node → keep
  ↓
document.execCommand('insertHTML', false, sanitized)
```

**Allowed tags:** `P`, `BR`, `STRONG`, `B`, `EM`, `I`, `U`, `S`, `A`, `UL`, `OL`, `LI`, `H2`, `H3`, `H4`, `BLOCKQUOTE`, `PRE`, `CODE`, `DIV`

**Allowed attributes:** Only `href` on `<a>` (validated: must start with `https?:`, `mailto:`, `/`, or `#`).

### Link Insertion

Uses an inline popover (JS-created `<div>`) instead of `window.prompt`:

```
User clicks link button / Ctrl+K
  ↓
Save current selection range (.cloneRange())
  ↓
Check if already inside <a> → pre-fill URL
  ↓
Create inline popover with <input type="url"> + confirm/cancel
  ↓
Insert popover after <nav>
  ↓
User types URL + Enter (or clicks confirm)
  ↓
Restore saved selection range
  ↓
document.execCommand('createLink', false, url)
  ↓
Add rel="noopener noreferrer" to new link
  ↓
Remove popover, sync, dispatch changed
```

### Destroy

```
destroy() called
  ↓
Remove all event listeners (input, paste, keydown, selectionchange, focus, blur)
  ↓
Remove surface from DOM
  ↓
Remove nav event listeners (mousedown, click)
  ↓
Remove data-ln-editor-source from textarea (CSS un-hides it)
  ↓
Remove link popover if present
  ↓
dispatch ln-editor:destroyed
  ↓
delete dom[DOM_ATTRIBUTE]
```

## Event Reference

| Event | Bubbles | Cancelable | Detail | When |
|-------|---------|------------|--------|------|
| `ln-editor:before-change` | true | **yes** | `{ action, target }` | Before format command — `preventDefault()` to cancel |
| `ln-editor:changed` | true | no | `{ html, target }` | After any content change |
| `ln-editor:focus` | true | no | `{ target }` | Editing surface focused |
| `ln-editor:blur` | true | no | `{ target }` | Editing surface blurred |
| `ln-editor:set-content` | false | no | `{ html }` | Request: set content programmatically |
| `ln-editor:destroyed` | true | no | `{ target }` | Instance destroyed |

## Dependencies

- `ln-core`: `dispatch`, `dispatchCancelable`, `registerComponent`
- `@mixin prose` (SCSS): content styling for the editing surface
- `ln-icons` (runtime): toolbar icons via `<use href="#ln-*">`

## Known Limitations

- `document.execCommand` is deprecated but functional in all current browsers
- Browser `contentEditable` implementation varies — cursor positioning edge cases exist
- No undo/redo stack management — relies on browser native (generally adequate)
- No table support — use the Tiptap wrapper for that
- No image/media embed — use the Tiptap wrapper for that

# ln-editor — Architecture Reference

## Overview

`ln-editor` is a lightweight WYSIWYG rich text editor that enhances a `<textarea>` into a `contentEditable` editing surface. It follows the progressive enhancement pattern: without JS, the textarea works as a plain text input.

## Internal State

| Property | Type | Description |
|----------|------|-------------|
| `_textarea` | HTMLTextAreaElement | The original textarea (hidden, synced) |
| `_surface` | HTMLDivElement | The `contentEditable` editing surface (built at init via `document.createElement`) |

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
Create <div contenteditable> (.ln-editor__surface); assign a stable id
  ↓
Transfer <label for> association to the surface via aria-labelledby (if labeled)
  ↓
Mark textarea with data-ln-editor-source (CSS hides it)
  ↓
Insert surface after [role="toolbar"] (or at container end)
  ↓
Wire a11y: toolbar aria-controls → surface id; seed aria-pressed="false"
           on toggle-format buttons (gated by _isToggleAction)
  ↓
Bind surface events: input, paste, keydown, focus, blur
Bind toolbar events: mousedown, click
Bind document: selectionchange
Bind container: ln-editor:set-content (request)
Bind parent <form>: reset (re-seeds surface from textarea, dispatches changed)
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
surface.focus() + document.execCommand(...)
  ↓
native 'input' fires → _onInput syncs innerHTML → textarea.value
  → dispatch ln-editor:changed (exactly once)
  ↓
update active states + aria-pressed on all toolbar buttons
```

### Active State Tracking

On every `selectionchange` event:

1. Check if selection is within `_surface`
2. For each `[data-ln-editor-action]` button in the toolbar:
   - **Inline commands:** `document.queryCommandState('bold')` etc.
   - **Block commands:** walk up from selection anchor to find `<h2>`, `<blockquote>`, etc.
   - **List commands:** `document.queryCommandState('insertOrderedList')` etc.
   - **Link:** check if selection anchor is inside an `<a>` tag
3. Toggle `.ln-editor-active` class accordingly; toggle-format buttons
   (gated by `_isToggleAction`) also get their `aria-pressed` synced to the
   active state

The `selectionchange` handler early-returns when `_surface` has been
detached from the document without `destroy()` (e.g. an SPA subtree swap),
so a temporarily detached-then-reattached surface keeps working.

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

Link support **requires a page-level companion template**. When the toolbar
includes the `link` action, the page must define this template once (the
editor never generates popover markup in JS):

```html
<template data-ln-template="ln-editor-link-popover">
	<div class="ln-editor__link-popover">
		<input type="url" placeholder="https://…" />
		<button type="button" data-ln-editor-action="confirm-link" aria-label="Confirm" title="Confirm">
			<svg class="ln-icon ln-icon--sm" aria-hidden="true"><use href="#ln-check"></use></svg>
		</button>
		<button type="button" data-ln-editor-action="cancel-link" aria-label="Cancel" title="Cancel">
			<svg class="ln-icon ln-icon--sm" aria-hidden="true"><use href="#ln-x"></use></svg>
		</button>
	</div>
</template>
```

The editor clones it at runtime via `cloneTemplateScoped`:

```
User clicks link button / Ctrl+K
  ↓
Save current selection range (.cloneRange())
  ↓
Check if already inside <a> → pre-fill URL
  ↓
Clone <template data-ln-template="ln-editor-link-popover"> via cloneTemplateScoped
  ↓
Insert popover after [role="toolbar"]
  ↓
User types URL + Enter (or clicks confirm)
  ↓
Restore saved selection range
  ↓
Existing link → setAttribute('href') → sync → dispatch changed (once)
New link     → execCommand('createLink') → native input → dispatch changed (once)
              → add rel="noopener noreferrer"
  ↓
Remove popover
```

If the template is absent, `cloneTemplateScoped` returns `null` and the
link action is a no-op — no popover appears.

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
| `ln-editor:changed` | true | no | `{ html, target }` | Fires exactly once per content mutation (typing, paste, formatting, link apply, programmatic `set-content`/`setHTML`, form reset) |
| `ln-editor:focus` | true | no | `{ target }` | Editing surface focused |
| `ln-editor:blur` | true | no | `{ target }` | Editing surface blurred |
| `ln-editor:set-content` | false | no | `{ html }` | Request: set content programmatically — also emits `ln-editor:changed` |
| `ln-editor:destroyed` | true | no | `{ target }` | Instance destroyed |

## Dependencies

- `ln-core`: `dispatch`, `dispatchCancelable`, `registerComponent`
- `@mixin prose` (SCSS): content styling for the editing surface
- `ln-icons` (runtime): toolbar icons via `<use href="#ln-*">`

## Known Limitations

- `document.execCommand` is deprecated but functional in all current browsers
- Browser `contentEditable` implementation varies — cursor positioning edge cases exist
- No undo/redo stack management — relies on browser native (generally adequate)
- No table support
- No image or media embedding

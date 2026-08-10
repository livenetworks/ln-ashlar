# ln-editor

Lightweight WYSIWYG rich text editor. Enhances a `<textarea>` into a `contentEditable` editing surface with a toolbar. Progressive enhancement: without JS, the textarea works as plain text.

## Quick Start

```html
<div data-ln-editor>
    <div role="toolbar" aria-label="Text formatting">
        <ul>
            <li><button type="button" data-ln-editor-action="bold" aria-label="Bold">
                <svg class="ln-icon" aria-hidden="true"><use href="#ln-icon-bold"></use></svg>
            </button></li>
            <li><button type="button" data-ln-editor-action="italic" aria-label="Italic">
                <svg class="ln-icon" aria-hidden="true"><use href="#ln-icon-italic"></use></svg>
            </button></li>
        </ul>
    </div>
    <textarea name="content" placeholder="Write something..."></textarea>
</div>
```

## Attributes

| Attribute | On element | Owned by | Description |
|-----------|-----------|----------|-------------|
| `data-ln-editor` | Container `<div>` | `ln-editor` | Marks the container as an editor instance |
| `data-ln-editor-action` | Toolbar `<button>` | `ln-editor` | Identifies which formatting action the button triggers |
| `data-ln-editor-source` | `<textarea>` | `ln-editor` (auto-set) | JS marks the textarea for CSS hiding. Removed on `destroy()` |

## Toolbar Actions

| `data-ln-editor-action` | Effect | Keyboard Shortcut |
|--------------------------|--------|-------------------|
| `bold` | Toggle bold | Ctrl+B |
| `italic` | Toggle italic | Ctrl+I |
| `underline` | Toggle underline | Ctrl+U |
| `strikethrough` | Toggle strikethrough | — |
| `heading-2` | Toggle H2 | — |
| `heading-3` | Toggle H3 | — |
| `heading-4` | Toggle H4 | — |
| `blockquote` | Toggle blockquote | — |
| `code` | Toggle code block | — |
| `ordered-list` | Toggle numbered list | — |
| `unordered-list` | Toggle bullet list | — |
| `link` | Insert/edit link (inline popover) | Ctrl+K |
| `unlink` | Remove link | — |
| `clear` | Remove all formatting | — |
| `paragraph` | Reset block to paragraph — applied internally by `clear`; no default toolbar exposes it as its own button | — |

## Toolbar Structure

The toolbar is **authored HTML** — the consumer controls which buttons appear, their order, icons, and labels.

```html
<div role="toolbar" aria-label="Text formatting">
    <!-- Group 1: Inline formatting -->
    <ul>
        <li><button type="button" data-ln-editor-action="bold" aria-label="Bold">
            <svg class="ln-icon" aria-hidden="true"><use href="#ln-icon-bold"></use></svg>
        </button></li>
        <li><button type="button" data-ln-editor-action="italic" aria-label="Italic">
            <svg class="ln-icon" aria-hidden="true"><use href="#ln-icon-italic"></use></svg>
        </button></li>
        <li><button type="button" data-ln-editor-action="underline" aria-label="Underline">
            <svg class="ln-icon" aria-hidden="true"><use href="#ln-icon-underline"></use></svg>
        </button></li>
    </ul>

    <!-- Group 2: Block formatting -->
    <ul>
        <li><button type="button" data-ln-editor-action="heading-2" aria-label="Heading 2">H2</button></li>
        <li><button type="button" data-ln-editor-action="heading-3" aria-label="Heading 3">H3</button></li>
    </ul>

    <!-- Group 3: Lists -->
    <ul>
        <li><button type="button" data-ln-editor-action="unordered-list" aria-label="Bullet list">
            <svg class="ln-icon" aria-hidden="true"><use href="#ln-icon-list"></use></svg>
        </button></li>
        <li><button type="button" data-ln-editor-action="ordered-list" aria-label="Numbered list">
            <svg class="ln-icon" aria-hidden="true"><use href="#ln-icon-list-numbers"></use></svg>
        </button></li>
    </ul>

    <!-- Group 4: Insert -->
    <ul>
        <li><button type="button" data-ln-editor-action="link" aria-label="Insert link">
            <svg class="ln-icon" aria-hidden="true"><use href="#ln-icon-link"></use></svg>
        </button></li>
    </ul>
</div>
```

Multiple `<ul>` elements create visual groups with separators between them.

### Accessibility

Mark the toolbar wrapper with `role="toolbar"` and an `aria-label`. The
component links it to the editing surface via `aria-controls`, and manages
`aria-pressed` on every toggle-format button (bold, italic, headings,
lists, link) so assistive technology announces the active state as the
cursor moves. One-shot actions (`unlink`, `clear`) receive no `aria-pressed`.
You author the buttons; the component owns the ARIA state. See the sync
mechanism in [🔧 Internals](#-internals).

## Link Popover Template

If you include the `link` action in the toolbar, you must define a `<template data-ln-template="ln-editor-link-popover">` on the page. The editor clones this template to render the inline link input popover.

This authored-markup design keeps the popover structure fully customizable and allows localization directly in the HTML:

```html
<template data-ln-template="ln-editor-link-popover">
	<div class="ln-editor__link-popover">
		<input type="url" placeholder="https://…" />
		<button type="button" data-ln-editor-action="confirm-link" aria-label="Confirm" title="Confirm">
			<svg class="ln-icon ln-icon--sm" aria-hidden="true"><use href="#ln-icon-check"></use></svg>
		</button>
		<button type="button" data-ln-editor-action="cancel-link" aria-label="Cancel" title="Cancel">
			<svg class="ln-icon ln-icon--sm" aria-hidden="true"><use href="#ln-icon-x"></use></svg>
		</button>
	</div>
</template>
```

## Events

| Event | Type | Detail | When |
|-------|------|--------|------|
| `ln-editor:changed` | Notification | `{ html, target }` | Fires exactly once per content mutation — typing, paste, formatting, link apply, programmatic `set-content`/`setHTML`, or form reset |
| `ln-editor:before-change` | Lifecycle (cancelable) | `{ action, target }` | Before a formatting command |
| `ln-editor:focus` | Notification | `{ target }` | Editing surface focused |
| `ln-editor:blur` | Notification | `{ target }` | Editing surface blurred |
| `ln-editor:set-content` | Request | `{ html }` | Set content programmatically — also emits `ln-editor:changed` |
| `ln-editor:destroyed` | Notification | `{ target }` | Instance destroyed |

## API

```javascript
const el = document.querySelector('[data-ln-editor]');

// Read current HTML
el.lnEditor.getHTML();

// Set content programmatically
el.lnEditor.setHTML('<p>New content</p>');

// Or via request event (coordinator pattern)
el.dispatchEvent(new CustomEvent('ln-editor:set-content', {
    detail: { html: '<p>New content</p>' }
}));

// Destroy instance — restores textarea visibility
el.lnEditor.destroy();
```

## Form Integration

The editor syncs content to the hidden `<textarea>` on every input, paste, and formatting action. On form submit, the textarea contains the current HTML.

```html
<form data-ln-form>
    <div class="form-element">
        <label for="article-body">Content</label>
        <div data-ln-editor>
            <div role="toolbar" aria-label="Text formatting"><!-- toolbar --></div>
            <textarea id="article-body" name="body" required></textarea>
        </div>
    </div>
    <div class="form-actions">
        <button type="submit">Save</button>
    </div>
</form>
```

## Pre-filled Content

Server-rendered HTML in the textarea value is used as initial editor content:

```html
<div data-ln-editor>
    <div role="toolbar" aria-label="Text formatting"><!-- toolbar --></div>
    <textarea name="content"><p>This <strong>pre-filled</strong> content appears in the editor.</p></textarea>
</div>
```

## Paste Handling

Content pasted from external sources (Word, web pages) is sanitized to a safe HTML subset — unsafe tags and attributes are stripped and links are made safe automatically. For the exact tag whitelist and sanitization algorithm see [🔧 Internals — Paste sanitization](#paste-sanitization).

## Minimal Toolbar

Include only the buttons you need:

```html
<div data-ln-editor>
    <div role="toolbar" aria-label="Text formatting">
        <ul>
            <li><button type="button" data-ln-editor-action="bold" aria-label="Bold">
                <svg class="ln-icon" aria-hidden="true"><use href="#ln-icon-bold"></use></svg>
            </button></li>
            <li><button type="button" data-ln-editor-action="italic" aria-label="Italic">
                <svg class="ln-icon" aria-hidden="true"><use href="#ln-icon-italic"></use></svg>
            </button></li>
            <li><button type="button" data-ln-editor-action="link" aria-label="Link">
                <svg class="ln-icon" aria-hidden="true"><use href="#ln-icon-link"></use></svg>
            </button></li>
        </ul>
    </div>
    <textarea name="comment" placeholder="Write a comment..."></textarea>
</div>
```

## SCSS

Visual styling uses the two-layer architecture:

- **Mixin:** `scss/config/mixins/_editor.scss` — `@mixin editor`
- **Component:** `scss/components/_editor.scss` — applies to `[data-ln-editor]`
- **Co-located:** `js/ln-editor/ln-editor.scss` — link popover (runtime-cloned from the authored `<template data-ln-template="ln-editor-link-popover">`)

The editing surface uses `@include prose` — content looks identical to how it will render in a `.prose` container.

Override with your own selector:

```scss
#my-editor {
    @include editor;
    // Custom overrides...

    > .ln-editor__surface {
        min-height: 20rem;
    }
}
```

---

## 🔧 Internals

Source: `js/ln-editor/ln-editor.js`. No cached formatting state — every toolbar sync re-queries `document.queryCommandState` and DOM ancestry on `selectionchange`.

### Construction

Finds the `<textarea>`, reads its value as the initial HTML, builds a `contentEditable` `<div class="ln-editor__surface">` with a stable id, transfers any `<label for>` association via `aria-labelledby`, marks the textarea `data-ln-editor-source` (CSS-hidden), inserts the surface after the toolbar, wires `aria-controls` from toolbar to surface, and seeds `aria-pressed="false"` on toggle-format buttons.

### Content sync

One-way, continuous: every surface `input` event copies `innerHTML` into the textarea's `value` and dispatches `ln-editor:changed`. The textarea is never the source of truth after construction — it is a submit-time mirror.

### Formatting flow

`mousedown` on a toolbar button calls `preventDefault()` first, to preserve the current selection before the surface loses focus; the actual command runs on `click`: dispatch cancelable `ln-editor:before-change` → `surface.focus()` + `document.execCommand(...)` → the resulting native `input` event does the sync and dispatches `ln-editor:changed` exactly once → toolbar active/`aria-pressed` states resync.

### Active state tracking

On every document `selectionchange`: bail if the selection isn't inside the surface, then per toggle button check `queryCommandState` (inline), a block-ancestor walk (headings/blockquote), `queryCommandState('insertOrderedList'/...)` (lists), or anchor ancestry (link). The handler also early-returns if the surface has been detached from the document without `destroy()` (e.g. an SPA subtree swap) — a later reattachment resumes working without re-init.

### Paste sanitization

`e.preventDefault()`, read `clipboardData` HTML (falling back to plain text with `\n` → `<br>`/`<p>`), parse into a detached `<div>`, then a recursive walk: allowed tags keep only `href` (validated against `https?:`/`mailto:`/`/`/`#`) and recurse into children; disallowed tags are unwrapped (replaced by their children) and recursion continues; text nodes pass through untouched. The result is inserted via `execCommand('insertHTML', ...)`. Allowed tags: `P BR STRONG B EM I U S A UL OL LI H2 H3 H4 BLOCKQUOTE PRE CODE DIV`.

### Link insertion

Requires a page-authored `<template data-ln-template="ln-editor-link-popover">` — the editor never generates this markup. Flow: save the current selection range, detect if already inside an `<a>` (pre-fill), clone the template via `cloneTemplateScoped`, insert it after the toolbar; on confirm, restore the saved range and either update the existing link's `href` or run `execCommand('createLink')` (adding `rel="noopener noreferrer"` for new links) — either path dispatches `ln-editor:changed` exactly once. A missing template makes the link action a silent no-op.

### Destroy

Removes all surface/toolbar/document listeners, removes the surface node, restores textarea visibility (removes `data-ln-editor-source`), removes any open link popover, dispatches `ln-editor:destroyed`.

### Permanent constraints

`execCommand` is deprecated but functional across current browsers; no custom undo/redo stack (relies on native); no table or media embedding support.

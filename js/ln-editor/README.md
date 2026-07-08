# ln-editor

Lightweight WYSIWYG rich text editor. Enhances a `<textarea>` into a `contentEditable` editing surface with a toolbar. Progressive enhancement: without JS, the textarea works as plain text.

> Architecture & internals: [docs/js/editor.md](../../docs/js/editor.md)

## Quick Start

```html
<div data-ln-editor>
    <div role="toolbar" aria-label="Text formatting">
        <ul>
            <li><button type="button" data-ln-editor-action="bold" aria-label="Bold">
                <svg class="ln-icon" aria-hidden="true"><use href="#ln-bold"></use></svg>
            </button></li>
            <li><button type="button" data-ln-editor-action="italic" aria-label="Italic">
                <svg class="ln-icon" aria-hidden="true"><use href="#ln-italic"></use></svg>
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
            <svg class="ln-icon" aria-hidden="true"><use href="#ln-bold"></use></svg>
        </button></li>
        <li><button type="button" data-ln-editor-action="italic" aria-label="Italic">
            <svg class="ln-icon" aria-hidden="true"><use href="#ln-italic"></use></svg>
        </button></li>
        <li><button type="button" data-ln-editor-action="underline" aria-label="Underline">
            <svg class="ln-icon" aria-hidden="true"><use href="#ln-underline"></use></svg>
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
            <svg class="ln-icon" aria-hidden="true"><use href="#ln-list"></use></svg>
        </button></li>
        <li><button type="button" data-ln-editor-action="ordered-list" aria-label="Numbered list">
            <svg class="ln-icon" aria-hidden="true"><use href="#ln-list-numbers"></use></svg>
        </button></li>
    </ul>

    <!-- Group 4: Insert -->
    <ul>
        <li><button type="button" data-ln-editor-action="link" aria-label="Insert link">
            <svg class="ln-icon" aria-hidden="true"><use href="#ln-link"></use></svg>
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
You author the buttons; the component owns the ARIA state. See the
[sync mechanism in docs/js/editor.md](../../docs/js/editor.md#active-state-tracking).

## Link Popover Template

If you include the `link` action in the toolbar, you must define a `<template data-ln-template="ln-editor-link-popover">` on the page. The editor clones this template to render the inline link input popover.

This authored-markup design keeps the popover structure fully customizable and allows localization directly in the HTML:

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

Content pasted from external sources (Word, web pages) is sanitized to a safe HTML subset — unsafe tags and attributes are stripped and links are made safe automatically. For the exact tag whitelist and sanitization algorithm see [docs/js/editor.md §Paste Sanitization](../../docs/js/editor.md#paste-sanitization).

## Minimal Toolbar

Include only the buttons you need:

```html
<div data-ln-editor>
    <div role="toolbar" aria-label="Text formatting">
        <ul>
            <li><button type="button" data-ln-editor-action="bold" aria-label="Bold">
                <svg class="ln-icon" aria-hidden="true"><use href="#ln-bold"></use></svg>
            </button></li>
            <li><button type="button" data-ln-editor-action="italic" aria-label="Italic">
                <svg class="ln-icon" aria-hidden="true"><use href="#ln-italic"></use></svg>
            </button></li>
            <li><button type="button" data-ln-editor-action="link" aria-label="Link">
                <svg class="ln-icon" aria-hidden="true"><use href="#ln-link"></use></svg>
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

# ln-editor

Lightweight WYSIWYG rich text editor. Enhances a `<textarea>` into a `contentEditable` editing surface with a toolbar. Progressive enhancement: without JS, the textarea works as plain text.

## Quick Start

```html
<div data-ln-editor>
    <nav>
        <ul>
            <li><button type="button" data-ln-editor-action="bold" aria-label="Bold">
                <svg class="ln-icon" aria-hidden="true"><use href="#ln-bold"></use></svg>
            </button></li>
            <li><button type="button" data-ln-editor-action="italic" aria-label="Italic">
                <svg class="ln-icon" aria-hidden="true"><use href="#ln-italic"></use></svg>
            </button></li>
        </ul>
    </nav>
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
| `paragraph` | Reset to paragraph | — |

## Toolbar Structure

The toolbar is **authored HTML** — the consumer controls which buttons appear, their order, icons, and labels.

```html
<nav>
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
</nav>
```

Multiple `<ul>` elements create visual groups with separators between them.

## Events

| Event | Type | Detail | When |
|-------|------|--------|------|
| `ln-editor:changed` | Notification | `{ html, target }` | Content changed |
| `ln-editor:before-change` | Lifecycle (cancelable) | `{ action, target }` | Before a formatting command |
| `ln-editor:focus` | Notification | `{ target }` | Editing surface focused |
| `ln-editor:blur` | Notification | `{ target }` | Editing surface blurred |
| `ln-editor:set-content` | Request | `{ html }` | Set content programmatically |
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
            <nav><!-- toolbar --></nav>
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
    <nav><!-- toolbar --></nav>
    <textarea name="content"><p>This <strong>pre-filled</strong> content appears in the editor.</p></textarea>
</div>
```

## Paste Handling

Content pasted from external sources (Word, web pages) is automatically sanitized:
- Only safe HTML tags are kept: `<p>`, `<strong>`, `<em>`, `<a>`, `<ul>`, `<ol>`, `<li>`, `<h2>`–`<h4>`, `<blockquote>`, `<pre>`, `<code>`
- All attributes are stripped except `href` on links
- Links get `rel="noopener noreferrer"` automatically
- `javascript:` URLs are removed
- Plain text paste is converted to paragraphs

## Minimal Toolbar

Include only the buttons you need:

```html
<div data-ln-editor>
    <nav>
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
    </nav>
    <textarea name="comment" placeholder="Write a comment..."></textarea>
</div>
```

## SCSS

Visual styling uses the two-layer architecture:

- **Mixin:** `scss/config/mixins/_editor.scss` — `@mixin editor`
- **Component:** `scss/components/_editor.scss` — applies to `[data-ln-editor]`
- **Co-located:** `js/ln-editor/ln-editor.scss` — link popover (JS-created element)

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

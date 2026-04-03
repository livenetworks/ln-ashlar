# Upload

File upload with drag-drop and progress. File: `js/ln-upload/ln-upload.js`.

## HTML

```html
<div data-ln-upload="/api/upload" data-ln-upload-accept="pdf,doc,jpg,png">
    <div class="ln-upload__zone">
        <p>Drop files here or click to browse</p>
        <small>Allowed: pdf, doc, jpg, png</small>
    </div>
    <ul class="ln-upload__list"></ul>
</div>
```

## Attributes

| Attribute | Description |
|-----------|-------------|
| `data-ln-upload="url"` | Upload endpoint |
| `data-ln-upload-accept="ext,ext"` | Allowed extensions |
| `data-ln-upload-context="value"` | Context sent with upload |

## JS API (on container element)

```js
const el = document.querySelector('[data-ln-upload]');
el.lnUploadAPI.getFileIds();   // [1, 2, 3]
el.lnUploadAPI.getFiles();     // [{serverId, name, size}]
el.lnUploadAPI.clear();        // Delete all, clear list
```

## Events

| Event | Detail |
|-------|--------|
| `ln-upload:uploaded` | `{localId, serverId, name}` |
| `ln-upload:removed` | `{localId, serverId}` |
| `ln-upload:error` | `{file, message}` |
| `ln-upload:invalid` | `{file, message}` |
| `ln-upload:cleared` | `{}` |

## Dictionary

Customize text with hidden elements:
```html
<div data-ln-upload-dict="remove">Remove</div>
<div data-ln-upload-dict="error">Error</div>
```

## Template

The component needs a `<template data-ln-template="ln-upload-item">` in your page:

```html
<template data-ln-template="ln-upload-item">
<li class="ln-upload__item"
    data-ln-class="ln-upload__item--uploading:uploading, ln-upload__item--error:error, ln-upload__item--deleting:deleting">
    <span class="ln-upload__name" data-ln-field="name"></span>
    <span class="ln-upload__size" data-ln-field="sizeText"></span>
    <button type="button" class="ln-upload__remove" aria-label="Remove"><svg class="ln-icon" aria-hidden="true"><use href="#ln-x"></use></svg aria-label="Remove"></button>
    <div class="ln-upload__progress">
        <div class="ln-upload__progress-bar"></div>
    </div>
</li>
</template>
```

**Fallback:** If the template is missing, the component injects one automatically and logs a warning. Add the template to your layout for best practice.

## Form Integration

Hidden inputs auto-created: `<input type="hidden" name="file_ids[]" value="123">`

CSRF token from `<meta name="csrf-token">`.

---

## Internal Architecture

### State

File queue lives in `deepReactive({ files: [] })`. Each file object:

```js
{
  localId:    'file-1',          // stable key for DOM diffing
  name:       'report.pdf',      // original filename
  ext:        'pdf',             // extracted extension
  iconClass:  'ln-icon-file-pdf',// CSS class for file type icon
  status:     'uploading',       // 'uploading' | 'uploaded' | 'error'
  progress:   0,                 // 0-100 (drives progress bar width)
  sizeText:   '0%',             // display text: percent while uploading, formatted size after
  serverId:   null,              // set on successful upload response
  size:       0,                 // bytes, from server response
  errorMessage: null,            // set on error
  deleting:   false              // true during DELETE request
}
```

XHR references are stored in a plain `_xhrs` object (not reactive) to avoid Proxy-wrapping browser objects.

### Progress flow

XHR progress events fire up to 60+ times per second. Each event mutates `file.progress` and `file.sizeText` on the reactive proxy. `deepReactive` triggers `onChange` → `createBatcher` coalesces multiple mutations within a single microtask into one `_render()` call. Result: smooth progress updates without excessive DOM work.

```
XHR progress → file.progress = N → deepReactive onChange
  → createBatcher schedules queueMicrotask (once)
  → microtask fires → _render() → _afterRender()
```

### Rendering (custom keyed diff)

The component does NOT use `renderList()` — full container replacement would disrupt CSS transitions on progress bars and cause unnecessary reflow during rapid progress updates.

Instead, it follows the ln-toast pattern:
1. Index existing `<li>` children by `data-ln-key`
2. For each file in state: update existing element via `fill()` or create new from template
3. Remove orphaned elements (files that were spliced from state)

`fill()` handles `data-ln-field` (text content) and `data-ln-class` (status modifier classes). Manual updates handle: progress bar `style.width`, button `disabled` property, and dynamic icon class on `<li>`.

### Drag & drop

Drag-over state is transient UI — managed as direct `classList.add/remove('ln-upload__zone--dragover')` on the zone element, not reactive state. No render cycle needed for hover feedback.

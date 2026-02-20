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

## Form Integration

Hidden inputs auto-created: `<input type="hidden" name="file_ids[]" value="123">`

CSRF token from `<meta name="csrf-token">`.

# ln-upload

File upload компонента — drag & drop зона со progress bar, валидација, и серверска комуникација.
Автоматски upload на фајл по избор/drop, со progress tracking преку XHR. Бришење на фајл од сервер.

## Атрибути

| Атрибут | На | Опис |
|---------|-----|------|
| `data-ln-upload="/files/upload"` | контејнер | Upload URL (default: `/files/upload`) |
| `data-ln-upload-accept=".pdf,.doc,.docx"` | контејнер | Дозволени екстензии (comma-separated) |
| `data-ln-upload-context="documents"` | контејнер | Context string испратен со upload (FormData `context` поле) |
| `data-ln-upload-dict="key"` | скриен елемент | I18n речник за пораки (видете подолу) |

## Речник (i18n)

```html
<span data-ln-upload-dict="remove" hidden>Отстрани</span>
<span data-ln-upload-dict="error" hidden>Грешка</span>
<span data-ln-upload-dict="invalid-type" hidden>Овој тип фајл не е дозволен</span>
<span data-ln-upload-dict="upload-failed" hidden>Неуспешен upload</span>
<span data-ln-upload-dict="delete-error" hidden>Неуспешно бришење</span>
```

## CSS класи

| Класа | Опис |
|-------|------|
| `.ln-upload__zone` | Drag & drop зона (кликабилна) |
| `.ln-upload__zone--dragover` | Кога фајл е повлечен над зоната |
| `.ln-upload__list` | Листа на upload-ирани фајли |
| `.ln-upload__item` | Поединечен фајл |
| `.ln-upload__item--uploading` | Фајл во тек на upload |
| `.ln-upload__item--error` | Неуспешен upload |
| `.ln-upload__item--deleting` | Фајл се брише од сервер |
| `.ln-upload__name` | Име на фајл |
| `.ln-upload__size` | Големина / процент |
| `.ln-upload__remove` | Копче за бришење |
| `.ln-upload__progress` | Progress bar контејнер |
| `.ln-upload__progress-bar` | Progress bar (width %) |

## API

```javascript
// Instance API (на контејнер елементот)
var uploader = document.getElementById('my-upload');

uploader.lnUploadAPI.getFileIds();   // [1, 2, 3] — server IDs
uploader.lnUploadAPI.getFiles();     // [{serverId, name, size}, ...]
uploader.lnUploadAPI.clear();        // Брише сè (и од сервер)

// Global API
window.lnUpload.init(containerElement);  // Рачна иницијализација
window.lnUpload.initAll();               // Иницијализирај сите
```

## Events

| Event | Bubbles | Detail |
|-------|---------|--------|
| `ln-upload:uploaded` | да | `{ localId, serverId, name }` |
| `ln-upload:error` | да | `{ file, message }` |
| `ln-upload:invalid` | да | `{ file, message }` |
| `ln-upload:removed` | да | `{ localId, serverId }` |
| `ln-upload:cleared` | да | `{}` |

## Серверски API

### Upload (POST)

Request: `multipart/form-data` со `file` и `context` полиња.
Headers: `X-CSRF-TOKEN`, `Accept: application/json`

Очекуван response:
```json
{ "id": 123, "name": "document.pdf", "size": 45678 }
```

### Delete (DELETE `/files/{id}`)

Headers: `X-CSRF-TOKEN`, `Accept: application/json`
Очекуван status: `200`

## HTML структура

```html
<div data-ln-upload="/files/upload" data-ln-upload-accept=".pdf,.doc,.docx" data-ln-upload-context="documents">
    <div class="ln-upload__zone">
        <p>Повлечи фајл овде или кликни за избор</p>
    </div>
    <ul class="ln-upload__list"></ul>

    <!-- Речник (optional, за i18n) -->
    <span data-ln-upload-dict="remove" hidden>Отстрани</span>
    <span data-ln-upload-dict="error" hidden>Грешка</span>
    <span data-ln-upload-dict="invalid-type" hidden>Овој тип фајл не е дозволен</span>
</div>
```

## Програмски

```javascript
// Слушај за успешен upload
document.addEventListener('ln-upload:uploaded', function(e) {
    console.log('Uploaded:', e.detail.name, 'Server ID:', e.detail.serverId);
});

// Земи ги сите upload-ирани IDs пред submit на форма
var ids = document.getElementById('my-upload').lnUploadAPI.getFileIds();
```

## Фајл икони

Компонентата автоматски додава CSS класа за иконата на фајлот:
- `.ln-icon-file-pdf` — PDF
- `.ln-icon-file-doc` — DOC/DOCX
- `.ln-icon-file-epub` — EPUB
- `.ln-icon-file` — останато

## Hidden inputs

По секој успешен upload, компонентата автоматски креира `<input type="hidden" name="file_ids[]" value="serverId">` за секој фајл. При submit на формата, серверот ги добива IDs директно.

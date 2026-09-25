# ln-obfuscator

> Binds to any DOM element carrying `data-ln-obfuscator` (`<span>`, `<p>`, `<a>`, headings, table cells) and automatically deobfuscates its text nodes and `href` attributes at runtime.
> Operates with zero configuration using ROT13 as default, and supports universal Base64 and XOR ciphers via optional attributes for international scripts (Cyrillic, CJK, etc.) while maintaining an internal idempotency guard without DOM pollution.

## Markup anatomy

### 1. Default ROT Caesar (Letters & Digits)

```html
<!-- Authored HTML (Obfuscated) -->
<span data-ln-obfuscator>Uryyb Jbeyq!</span>
<a data-ln-obfuscator href="znvygb:pbagnpg@rknzcyr.pbz">pbagnpg@rknzcyr.pbz</a>
<a data-ln-obfuscator="5" href="yjc:+834-25-678-901">+834-25-678-901</a>

<!-- Runtime result (Deobfuscated) -->
<span data-ln-obfuscator>Hello World!</span>
<a data-ln-obfuscator href="mailto:contact@example.com">contact@example.com</a>
<a data-ln-obfuscator="5" href="tel:+389-70-123-456">+389-70-123-456</a>
```

### 2. Universal Base64 & XOR (Unicode & International Scripts)

```html
<!-- Base64 Codec (Unicode / UTF-8 safe) -->
<span data-ln-obfuscator data-ln-obfuscator-codec="base64">VW5pY29kZSBOb3RlOiBjb250YWN0QGV4YW1wbGUuY29tIChUZWw6ICsxLTgwMC01NTUtMDE5OSk=</span>
<!-- Runtime: "Unicode Note: contact@example.com (Tel: +1-800-555-0199)" -->

<!-- XOR Codec with Custom Key -->
<span data-ln-obfuscator data-ln-obfuscator-codec="xor" data-ln-obfuscator-key="secret-key">MAoNFAwQSAUREBIJWVIGG0MfBBoHJQYKBBldBwBXEAoOUk0gSAdfWVhUTkpVRABeUExeVVJLXF0=</span>
<!-- Runtime: "Confidential: contact@example.com (Tel: +1-800-555-0199)" -->
```

## Attribute contract

| Attribute | Role | Default | Description |
|---|---|---|---|
| `data-ln-obfuscator` | Selector & Shift | `13` | Triggers deobfuscation. Optional integer sets ROT shift offset. Default is ROT13. |
| `data-ln-obfuscator-codec` | Codec mode | `rot` | Encryption/encoding mode: `'rot'` (default), `'base64'`, or `'xor'`. |
| `data-ln-obfuscator-key` | XOR key | `'ln-ashlar'` | Secret key for `'xor'` codec. Automatically activates XOR codec when provided. |

## Events API

- `ln-obfuscator:deobfuscated`: Dispatched on the target element with `{ target, codec, shift, key }` upon deobfuscation.

## JavaScript API

```javascript
// Scan DOM for uninitialized obfuscated elements
window.lnObfuscator(document.body);

// Pure cipher utilities
const rot = window.lnObfuscator.obfuscate('contact@example.com', 13);
const b64 = window.lnObfuscator.obfuscate('Contact: info@example.com', { codec: 'base64' });
const xor = window.lnObfuscator.obfuscate('Confidential: info@example.com', { codec: 'xor', key: 'secret-key' });

window.lnObfuscator.deobfuscate(rot, 13);
window.lnObfuscator.deobfuscate(b64, { codec: 'base64' });
window.lnObfuscator.deobfuscate(xor, { codec: 'xor', key: 'secret-key' });
```

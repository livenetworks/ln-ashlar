---
name: ln-obfuscator
classification: simple
status: stable
domain: frontend
summary: Autonomous component for anti-crawler obfuscation and deobfuscation of plain text, emails, telephone numbers, and links using reversible ROT, Base64, and XOR ciphers.
source: components/ln-obfuscator/src/ln-obfuscator.js
tags: [security, obfuscation, rot13, base64, xor, email-protection, spam-prevention, crawlers]
---

# 🔒 ln-obfuscator

> **Classification:** 🟢 Simple component / Autonomous Decorator (Layer 1 - Security & Content Protection)  
> Binds to any DOM element carrying `data-ln-obfuscator` (`<span>`, `<p>`, `<a>`, headings, table cells) and automatically deobfuscates its text nodes and `href` attributes at runtime.
> Operates with zero configuration using ROT13 as default, and supports universal Base64 and XOR ciphers via optional attributes for international scripts (Cyrillic, CJK, etc.) while maintaining an internal idempotency guard without DOM pollution.

---

## 1. Core Behavior & Responsibility

The `ln-obfuscator` component is an automated anti-crawler utility that prevents automated scrapers and harvesters from gathering sensitive personal information (such as email addresses, telephone numbers, or proprietary plain text) from raw HTML responses. It is located in [`components/ln-obfuscator/src/ln-obfuscator.js`](../../components/ln-obfuscator/src/ln-obfuscator.js).

*   **Universal Element Attachment:** Can be attached to any HTML element (`<span>`, `<p>`, `<h1>`–`<h6>`, `<a>`, `<area>`, `<div>`, `<td>`).
*   **Default ROT-N Cipher (Letters & Digits):** Uses Caesar/ROT rotation mod 26 on `[a-zA-Z]` and mod 10 on `[0-9]` by default.
*   **Universal Codecs (Base64 & XOR):** For international character sets (Cyrillic, CJK, Arabic, etc.), supports UTF-8 safe `base64` and symmetric multi-byte `xor` with custom keys via declarative attributes.
*   **Safe Text Node Traversal:** Traverses child text nodes with `document.createTreeWalker` to replace cipher text with readable plain text, without corrupting or modifying child HTML tags.
*   **Automatic Link Sanitization:** When attached to `<a>` or `<area>` elements, it simultaneously deobfuscates the `href` attribute (e.g. converting `znvygb:pbagnpg@rknzcyr.pbz` into `mailto:contact@example.com`).
*   **Interoperability with `ln-external-links`:** If a link was prematurely flagged by `ln-external-links` before deobfuscation, `ln-obfuscator` cleans premature markers before writing `href`, allowing the link to be correctly classified according to its genuine host.
*   **Internal Idempotency (Zero DOM Mutation):** Managed via a private JavaScript `WeakSet` and instance guard, ensuring the component runs exactly once per element without writing temporary state attributes to the DOM.
*   **Developer Authoring Helpers:** Exposes static encoding and decoding functions on `window.lnObfuscator` (`obfuscate`, `deobfuscate`, `utf8ToBase64`, `base64ToUtf8`, `xorObfuscate`, `xorDeobfuscate`).

> [!IMPORTANT]
> **What the component does NOT do (Orthogonality Doctrine):**
> - **Does NOT provide high-grade cryptographic data encryption:** Anti-bot obfuscation ciphers are designed strictly to defeat naive web scrapers and crawlers, not malicious actors with JS execution. For encrypted at-rest/in-transit data, use `ln-core/crypto.js` (`encryptData`).
> - **Does NOT mutate outer layout or styles:** Has zero visual styling or CSS footprint.

---

## 2. Minimal HTML Markup & Usage Variants

### Variant A: Default ROT13 (Latin & Numbers)

```html
<!-- Obfuscated text -->
<span data-ln-obfuscator>Uryyb Jbeyq!</span>

<!-- Obfuscated email -->
<a data-ln-obfuscator href="znvygb:pbagnpg@rknzcyr.pbz">pbagnpg@rknzcyr.pbz</a>

<!-- Obfuscated phone with custom shift -->
<a data-ln-obfuscator="5" href="yjc:+834-25-678-901">+834-25-678-901</a>
```

### Variant B: Universal Base64 (Unicode & International Scripts)

```html
<!-- Encoded UTF-8 text -->
<span data-ln-obfuscator data-ln-obfuscator-codec="base64">VW5pY29kZSBOb3RlOiBjb250YWN0QGV4YW1wbGUuY29tIChUZWw6ICsxLTgwMC01NTUtMDE5OSk=</span>
<!-- Deobfuscates to: "Unicode Note: contact@example.com (Tel: +1-800-555-0199)" -->
```

### Variant C: Keyed XOR Cipher with Base64 Transport

```html
<!-- Encoded with custom secret key -->
<span data-ln-obfuscator data-ln-obfuscator-codec="xor" data-ln-obfuscator-key="secret-key">MAoNFAwQSAUREBIJWVIGG0MfBBoHJQYKBBldBwBXEAoOUk0gSAdfWVhUTkpVRABeUExeVVJLXF0=</span>
<!-- Deobfuscates to: "Confidential: contact@example.com (Tel: +1-800-555-0199)" -->
```

---

## 3. Declarative API Contract (Attributes & Events)

### Attributes Table

| Attribute | Element | Type / Values | Default | Description |
|---|---|---|---|---|
| `data-ln-obfuscator` | Any | `String` / `Number` | `13` | Triggers deobfuscation. Optional integer specifies ROT shift offset (1–25). If blank, defaults to 13. |
| `data-ln-obfuscator-codec` | Any | `"rot"` \| `"base64"` \| `"xor"` | `"rot"` | Selects cipher codec. `"base64"` and `"xor"` support full unicode/Cyrillic/CJK. |
| `data-ln-obfuscator-key` | Any | `String` | `"ln-ashlar"` | Custom secret key for `"xor"` codec. Providing this attribute automatically activates XOR codec. |

### Programmatic JS API (`window.lnObfuscator`)

| Method | Parameters | Return | Description |
|---|---|---|---|
| `window.lnObfuscator` | `(root?: HTMLElement)` | `void` | Sweeps the given container (or `document.body`) to initialize any un-hydrated obfuscated elements. |
| `window.lnObfuscator.obfuscate` | `(text: string, options?: number \| object)` | `string` | Utility to encode text with ROT, Base64, or XOR. |
| `window.lnObfuscator.deobfuscate` | `(text: string, options?: number \| object)` | `string` | Utility to decode text with ROT, Base64, or XOR. |
| `window.lnObfuscator.utf8ToBase64` | `(text: string)` | `string` | Pure Unicode-safe UTF-8 to Base64 encoder. |
| `window.lnObfuscator.base64ToUtf8` | `(b64: string)` | `string` | Pure Unicode-safe Base64 to UTF-8 decoder. |
| `window.lnObfuscator.xorObfuscate` | `(text: string, key?: string)` | `string` | Pure XOR cipher utility returning Base64 string. |
| `window.lnObfuscator.xorDeobfuscate` | `(b64: string, key?: string)` | `string` | Pure XOR decipher utility from Base64 string. |

### Events API

| Event | Direction | Cancelable | Description | `detail` Object |
|---|---|---|---|---|
| `ln-obfuscator:deobfuscated` | Emits | No | Dispatched on the target element immediately after deobfuscation. | `{ target: HTMLElement, codec: string, shift: number, key: string \| null }` |
| `ln-obfuscator:destroyed` | Emits | No | Dispatched when `el.lnObfuscator.destroy()` is called. | `{ target: HTMLElement }` |

---

## 4. CSS Styling & Behavioral Concept

The component is purely behavioral and requires no dedicated stylesheet. It operates silently on text nodes and attributes.

---

## 5. Accessibility (ARIA) & Common Pitfalls

### ARIA & Semantics

- **Transparent Screen Reader Experience:** Because deobfuscation completes synchronously during page boot, screen readers encounter clean, semantic text and real URLs (`mailto:`, `tel:`) without any synthetic ARIA overrides.
- **`.sr-only` Preservation:** Any existing `.sr-only` accessibility hints inside elements are bypassed by the TreeWalker to avoid text corruption.

### Common Pitfalls & Anti-patterns

> [!CAUTION]
> 1. **Do not use for confidential passwords or sensitive credentials:** Anti-crawler obfuscation is designed to thwart scrapers, not client-side attackers who can inspect browser memory.
> 2. **Double encoding:** Do not pass already-obfuscated text through `obfuscate()` again unless multiple layers of ciphers are explicitly intended.

---

## 6. Flow Diagram & Lifecycle

```mermaid
sequenceDiagram
    autonumber
    participant DOM as Document DOM
    participant Core as ln-core
    participant Obf as ln-obfuscator
    participant Links as ln-external-links

    DOM->>Core: DOMContentLoaded / Mutation
    Core->>Obf: Instantiate on [data-ln-obfuscator]
    Obf->>Obf: Check internal _processed WeakSet
    alt Already processed
        Obf-->>DOM: Early return (Idempotent)
    else Unprocessed
        Obf->>DOM: Reset premature .sr-only & data-ln-external-link
        Obf->>DOM: Parse codec (rot, base64, xor) & key
        Obf->>DOM: Deobfuscate text nodes (TreeWalker)
        Obf->>DOM: Deobfuscate href attribute (if link)
        Obf->>Links: Trip observeAttributes(['href'])
        Obf->>Obf: Mark internal _processed = true
        Obf->>DOM: Dispatch ln-obfuscator:deobfuscated
    end
```

---

## 7. Related Components

- [`ln-external-links.md`](./ln-external-links.md) — Global outbound link sanitizer that cooperates with deobfuscated URLs.
- [`ln-link.md`](./ln-link.md) — Makes whole blocks or cards clickable.

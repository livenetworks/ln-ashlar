# Security Architecture & Best Practices

This document outlines the security architecture, threat model mitigations, and best practices implemented in the `ln-ashlar` framework. It serves as a guide for developers to build safe, compliant, and secure local-first web applications.

---

## 🛡️ Security Paradigm: Defense-in-Depth

`ln-ashlar` is designed around a **secure-by-default** doctrine. Because it is a hybrid SCSS/vanilla JS framework operating close to the DOM, it implements strict, proactive client-side defenses to protect user data, prevent Cross-Site Scripting (XSS), and secure sensitive storage without degrading performance.

```
                  ┌─────────────────────────────────────────┐
                  │          UNTRUSTED USER INPUT           │
                  └────────────────────┬────────────────────┘
                                       │
                         [ AJAX Response Sanitization ]
                                       │
                  ┌────────────────────▼────────────────────┐
                  │               HTML DOM                  │
                  │   - No hardcoded secrets / attributes   │
                  │   - Strict CSP (No dynamic eval)        │
                  └────────────────────┬────────────────────┘
                                       │
                        [ Safe Registry Domain Mappers ]
                                       │
                  ┌────────────────────▼────────────────────┐
                  │             Local Cache                 │
                  │   - IndexedDB Encryption at Rest        │
                  │     (AES-GCM-256 Web Crypto API)        │
                  └─────────────────────────────────────────┘
```

---

## 1. Cryptographic Utility Layer (`ln-core/crypto.js`)

`ln-ashlar` provides a robust, built-in cryptographic utility module under its core barrel. This module leverages the native high-performance browser **Web Crypto API** to perform secure, asynchronous cryptographic operations without requiring bulky external libraries.

### Core Cryptographic Helpers
These functions are defined in `js/ln-core/crypto.js` and re-exported under `window.lnCore`:

* **`setCryptoKey(secretString)`**:
  Derives a cryptographically strong 256-bit key from a user-supplied passphrase or server-provided session token using a `SHA-256` digest, then imports it as an active `AES-GCM` key.
* **`getCryptoKey()`**:
  Returns the active derived `CryptoKey` object.
* **`encryptData(plainData)`**:
  Encrypts arbitrary data (objects are auto-serialized to JSON) using **AES-GCM 256-bit** encryption with a unique, cryptographically random 12-byte Initialization Vector (IV) generated per record. Returns a flat object:
  ```json
  {
    "encrypted": true,
    "iv": "base64-string...",
    "data": "base64-ciphertext..."
  }
  ```
* **`decryptData(encryptedObject)`**:
  Decrypts an encrypted payload using the active key and IV, automatically re-parsing the output to a JSON object if applicable.

---

## 2. IndexedDB Encryption at Rest

Local-first caches inside `data-ln-data-store` can store sensitive corporate, financial, or personal data. To protect this data against physical device theft, unauthorized device access, or browser profile snooping, `ln-data-store` features transparent **Encryption at Rest**.

### Transparent Encryption Pipeline
When a storage key is active, database writes (`_putRecord` / `_putBulk`) and reads (`_getAllRecords` / `_getRecord`) are automatically intercepted:

1. **Selective Metadata Preservation**: The primary key (`id`) and mutation tracking fields (such as `_pending`) remain in plain text. This is a critical architectural choice that allows the IndexedDB database structures, indices, and sync tracking pipelines to function perfectly.
2. **Payload Envelope**: The rest of the record's payload is encrypted into a cryptographically sealed string payload.
3. **Decryption on Read**: Data is automatically and asynchronously decrypted on retrieval, populating the local in-memory queries seamlessly.

```
       Plain Object                          IndexedDB Store (At Rest)
   ┌───────────────────┐                 ┌─────────────────────────────────┐
   │ id: "doc_123"     │    Encrypt      │ id: "doc_123"                   │
   │ title: "Contract" ├────────────────>│ encrypted: true                 │
   │ department: "HR"  │   (AES-GCM)     │ iv: "YTVk...=="                 │
   │ _pending: true    │                 │ data: "c3B6...=="               │
   └───────────────────┘                 │ _pending: true (Plaintext)      │
                                         └─────────────────────────────────┘
```

### Enabling Storage Encryption
To activate encryption, call `setStorageKey` (typically after user authentication or session handshake):

```javascript
// Set the secret key globally. All subsequent store writes will be encrypted.
window.lnCore.setStorageKey("your-secure-session-or-user-derived-secret");
```

> [!IMPORTANT]
> **Key Management**: Never hardcode the encryption key in the source code or DOM attributes. Derive it dynamically from user logins or request it from a secure HttpOnly session endpoint during application bootstrap.

---

## 3. Strict Content Security Policy (CSP) Compliance

Older versions of DOM frameworks evaluated dynamic code snippets or templates using dangerous Javascript parsing (e.g., `new Function()` or `eval`). In `ln-ashlar`, **all dynamic eval vectors have been entirely removed**, enabling developers to deploy highly secure, strict Content Security Policies (CSP) without specifying `'unsafe-eval'`.

### Registry-Based Mapper Resolution
Rather than parsing raw string expressions out of inline `<script data-ln-mapper>` tags, the `data-ln-data-coordinator` leverages a safe, compiled **Mapper Registry Pattern**:

* **Unsafe Pattern (Deprecated)**:
  ```html
  <!-- DANGEROUS: Requires 'unsafe-eval' CSP directive to run -->
  <script type="application/javascript" data-ln-mapper>
    ({ ingress(raw) { return raw; } })
  </script>
  ```
* **Secure Pattern**:
  Define and register mappers inside compiled module code, then bind them declaratively via key references:
  ```javascript
  import { registerDataMapper } from '../../ln-core';

  registerDataMapper('documents-mapper', {
      ingress(serverRaw) {
          return {
              id: serverRaw.id,
              title: serverRaw.title,
              updated_at: Date.parse(serverRaw.updated_at) / 1000
          };
      },
      egress(localDb) {
          return {
              title: localDb.title,
              updated_at: new Date(localDb.updated_at * 1000).toISOString()
          };
      }
  });
  ```
  ```html
  <!-- CSP Compliant: No inline evaluation occurs -->
  <div data-ln-data-coordinator="documents" data-ln-data-mapper="documents-mapper">
       <div data-ln-data-store></div>
  </div>
  ```

---

## 4. Sensitive DOM-Attribute Protection

Exposing API tokens, basic auth passphrases, or custom header credentials inside HTML markup invites data extraction via client-side XSS attacks or malicious browser extensions. `ln-ashlar` strictly enforces credential safety:

* **No DOM-Exposed Secrets**: Custom credential attributes (such as `data-ln-api-credentials`) are deprecated and removed. 
* **Implicit Same-Origin Credentials**: Connectors (`data-ln-api-connector` and `data-ln-couchdb-connector`) default to safe credential transmission (`credentials: 'same-origin'`). This relies on secure, HttpOnly session cookies managed by the browser, which are invisible to client-side scripts.
* **API Gateway Proxy (Recommended)**: For third-party authentication, avoid putting bearer tokens in attributes. Instead, direct requests to a same-origin backend proxy gateway that appends credentials server-side.
* **Developer Diagnostics**: The framework actively inspects `data-ln-api-headers` and prints loud security console warnings if it detects authorization headers or bearer tokens embedded inside DOM nodes.

---

## 5. AJAX Injection Sanitization Filter

Dynamic HTML injections via `innerHTML` are a classic vector for DOM-based XSS. `ln-ajax.js` includes a defense-in-depth sanitization pipeline applied to all incoming markup fragments:

1. **DOMPurify Integration (Recommended)**: If the standard `DOMPurify` library is imported on the page, the framework automatically intercepts and sanitizes the HTML fragment using DOMPurify's robust parsing engine before injecting it.
2. **Secure Fallback Parser**: If DOMPurify is absent, `ln-ajax` utilizes a strict secondary fallback that automatically parses and strips:
   - `<script>` blocks
   - Inline event handlers (e.g., `onload`, `onerror`, `onclick`, `onmouseover`)
   - Dangerous schemes (e.g., `javascript:`, `data:`)

This ensures that even if developers load third-party server components with unsanitized values, the client-side framework actively prevents malicious script execution.

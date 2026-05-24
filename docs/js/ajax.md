# AJAX — architecture

> Contract, attributes, events, examples → [`js/ln-ajax/README.md`](../../js/ln-ajax/README.md). This file documents internals: lifecycle, MutationObserver, DOM mutations, trust boundary.
>
> Source: `js/ln-ajax/ln-ajax.js`.

## Request lifecycle

Steps performed on each request, in order:

1. **Event intercept** — click listener on `<a>` or submit listener on `<form>` fires. Modifier-key clicks (Ctrl, Cmd, middle) and `#`-href links are passed through unchanged.
2. **External-hostname skip** — if the link's hostname differs from `window.location.hostname`, the request is aborted and the browser follows the link normally (no opt-out required).
3. **`ln-ajax:before-start` dispatch** — cancelable event on the trigger element. If `preventDefault()` is called, the request stops here; no spinner, no fetch.
4. **Spinner mount** — `.ln-ajax--loading` added to trigger; `<span class="ln-ajax-spinner">` appended as a child of the trigger. Form buttons are disabled.
5. **`ln-ajax:start` dispatch** — non-cancelable; signals that fetch is about to begin.
6. **`fetch()` call** — request built from element attributes (`href` / `action`, `method`, `FormData`). Headers always include `X-Requested-With`, `Accept: application/json`, and `X-CSRF-TOKEN` from the page meta tag.
7. **Response handling**:
   - HTTP error (`!response.ok`): parse body as JSON, dispatch `ln-ajax:error` with `{ method, url, status, data }` shape, auto-dispatch `ln-toast:enqueue` if `data.message` present.
   - Fetch rejection (network error, JSON parse failure): dispatch `ln-ajax:error` with `{ method, url, error }` shape.
   - Success: parse body as JSON, update `document.title`, swap `target.innerHTML` for each `data.content[id]`, auto-dispatch `ln-toast:enqueue` if `data.message` present, push to `history.pushState` for `<a>` and GET `<form>`.
8. **`ln-ajax:success` / `ln-ajax:error` dispatch** — on the trigger element, bubbles.
9. **Cleanup** — `.ln-ajax--loading` removed, `.ln-ajax-spinner` element removed, buttons re-enabled.
10. **`ln-ajax:complete` dispatch** — always fires after success or error.

## MutationObserver flow

A single `MutationObserver` is registered on `document.body` at init. It handles three distinct cases:

### Branch 1 — new `data-ln-ajax` root injected

When a node with `data-ln-ajax` appears in the DOM (e.g. server-rendered HTML swapped into a region), the observer runs `new lnAjax(node)` to attach listeners. This covers AJAX-injected frames, `innerHTML` swaps, and dynamic attribute additions on an existing element.

### Branch 2 — elements injected inside an existing AJAX root

When child nodes are injected inside a node that already has a live `lnAjax` instance (i.e. `data-ln-ajax` already present on an ancestor), the observer re-runs `findElements` on the injected subtree and attaches listeners to any `<a>` or `<form>` found there. This is the re-attachment behavior added in commits `91e8118` / `e32656a` — injected links and forms become AJAX participants without a full re-init of the root.

### Branch 3 — `data-ln-ajax` attribute added to existing element

When `data-ln-ajax` is set programmatically on an element that was already in the DOM (without being inside an existing AJAX root), the `attributes` branch of the observer fires and runs `new lnAjax(node)`. This makes programmatic opt-in work seamlessly.

## DOM mutations performed

| Phase | Mutation |
|-------|----------|
| Request start | `.ln-ajax--loading` class added to trigger element |
| Request start | `<span class="ln-ajax-spinner">` appended as last child of trigger |
| Request start | `disabled` set on all `<button>` descendants of a `<form>` trigger |
| Success | `target.innerHTML` replaced for each `id` key in `data.content` |
| Success | `document.title` updated to `data.title` (if present) |
| Success / `<a>` or GET `<form>` | `history.pushState` called with final URL |
| Completion | `.ln-ajax--loading` class removed from trigger |
| Completion | `<span class="ln-ajax-spinner">` removed from trigger |
| Completion | `disabled` cleared on form buttons |

## `findElements` local divergence

The source uses a local `findElements` function rather than the `ln-core` helper of the same name. The divergence is intentional: `findElements` in ln-core returns a flat list of elements for iteration, while ln-ajax needs a `{ links, forms }` partition so it can attach different listeners to each group (`click` on links, `submit` on forms) in a single pass. A comment in source explains the reasoning. The two implementations should not be merged without updating all call sites.

## Trust boundary & HTML Sanitization Filter

To mitigate DOM-based Cross-Site Scripting (XSS) during `innerHTML` swaps, `ln-ajax.js` automatically applies a defense-in-depth HTML sanitization filter on all dynamic content:

1. **DOMPurify Integration (Recommended)**: If the `DOMPurify` library is globally imported on the page, `ln-ajax` routes all HTML response fragments through `DOMPurify.sanitize()` prior to DOM insertion.
2. **Safe Fallback Sanitizer**: If DOMPurify is not available, the framework runs a strict regex-based fallback filter that automatically parses and strips:
   - `<script>` blocks
   - Inline event handlers (such as `onload`, `onerror`, `onclick`, `onmouseover`, etc.)
   - Dangerous URI schemes (such as `javascript:`, `data:`, `vbscript:`)

This ensures that any HTML injected via AJAX is secure by default, even in the absence of a global sanitization library. For full context on the framework's security model, see [Security Architecture & Best Practices](../architecture/security.md).

## Error detail shape divergence

`ln-ajax:error` is dispatched with two distinct `detail` shapes depending on the failure mode:

**HTTP-status error** — response received but `!response.ok`:
```
{ method, url, status, data }
```
`status` is the HTTP status code; `data` is the parsed JSON body (may contain `message`).

**Fetch rejection** — network failure, DNS failure, JSON parse error, or other thrown exception:
```
{ method, url, error }
```
`error` is the caught `Error` object; no `status` or `data` fields.

A consumer writing a single `ln-ajax:error` listener must guard with `'status' in e.detail` before reading `status`, and `'error' in e.detail` before reading `error`.

**Known divergence — flagged for follow-up.** The two shapes are a source-level contract inconsistency introduced by separate error-path implementations. This file documents the current behavior accurately. A follow-up task should unify the error detail shape (e.g. always include `status` and `error`, with `null` for whichever does not apply) to make single-listener code reliable.

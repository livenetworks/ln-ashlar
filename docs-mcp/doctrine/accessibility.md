---
name: accessibility
classification: doctrine
status: draft
domain: frontend
summary: Accessibility position statement, WCAG 2.2 Level AA design target defaults, project responsibilities, and verification workflows.
source: docs-mcp/doctrine/html-markup-rules.md, theme/config/mixins/_focus.scss, theme/config/mixins/_motion.scss, theme/config/mixins/_form.scss, theme/config/_density.scss, theme/config/_theme.scss, theme/base/_reset.scss, components/ln-modal/src/ln-modal.js, components/ln-nav/src/ln-nav.js
tags: [doctrine, accessibility, wcag, aria, keyboard]
---

# ♿ Accessibility Doctrine & Conformance Position

## Summary

This document defines the accessibility position of `ln-ashlar` for library users, engineering teams, and automated agents. It articulates the library's design target, itemizes the concrete accessible primitives and defaults shipped in the codebase, outlines the consuming application's mandatory responsibilities, and establishes the required multi-step verification process.

---

## 1. The Claim

> **`ln-ashlar` adopts WCAG 2.2 Level AA as an engineering design target.**

Consuming applications may quote this position directly. Conformance is a property of a **delivered page with real content**, never of a component library in isolation. The library ships markup, styling, and behavioral defaults engineered to avoid introducing accessibility barriers; the consuming project retains sole ownership of overall page conformance.

### What the Library Does Not Claim

1. **No Conformance Certification:** The library does not claim "conformance", "full accessibility", or certified status. A reusable component library provides accessible building blocks, but real-world conformance depends on authored content, heading structures, language attributes, and workflow integration.
2. **Automated Scans Are Not Conformance:** Automated scanning tools (such as axe-core, WAVE, or Lighthouse) verify only a subset of WCAG success criteria. A clean automated scan provides evidence of absence of common programmatic defects, not proof of WCAG conformance. Manual keyboard navigation and screen reader testing remain indispensable.
3. **Formal Reporting Vehicle:** If a project requires a formal legal or procurement claim (such as Section 508 or EN 301 549), the established vehicle is an **Accessibility Conformance Report (ACR)** produced from a **Voluntary Product Accessibility Template (VPAT)** evaluated on the completed product.

---

## 2. What The Library Guarantees By Default

The library provides baseline accessibility mechanisms embedded across its HTML templates, SCSS tokens/mixins, and JavaScript runtime:

| Guarantee | Mechanism | Source |
|---|---|---|
| **Semantic DOM Structure** | Native HTML5 semantic tags (`<dialog>`, `<form>`, `<header>`, `<main>`, `<footer>`, `<time>`, `<data>`, `<strong>`) and `<ul>`/`<ol>` lists without extraneous `<div>` wrappers | [`docs-mcp/doctrine/html-markup-rules.md`](./html-markup-rules.md) |
| **Interactive Elements** | Strict tag separation: `<button type="button">`/`<button type="submit">` for page-local mutations; `<a href="...">` for navigation; zero click handlers on static `<div>`/`<span>` | [`docs-mcp/doctrine/html-markup-rules.md`](./html-markup-rules.md) |
| **Form Label Association** | Standardized label typography and explicit `<label for="...">` / `<input id="...">` association; unwrapped labels receive block formatting | [`theme/components/_form.scss`](../../theme/components/_form.scss), [`theme/config/mixins/_form.scss`](../../theme/config/mixins/_form.scss) |
| **CSS Required Indicators** | Automated red asterisk (`*`) injected via `:has([required])` selectors on parent groups and preceding labels without DOM manipulation | [`theme/config/mixins/_form.scss`](../../theme/config/mixins/_form.scss) |
| **Icon-Only Control Labels** | Mandatory `aria-label` on text-free action triggers, icon buttons, modal close triggers, and dynamic language/toast dismiss buttons | [`docs-mcp/doctrine/html-markup-rules.md`](./html-markup-rules.md), [`components/ln-toast/template.html`](../../components/ln-toast/template.html), [`components/ln-translations/src/ln-translations.js`](../../components/ln-translations/src/ln-translations.js) |
| **Decorative Icon Hiding** | Decorative SVG glyphs explicitly hidden from assistive technology via `aria-hidden="true"` by markup convention and component templates | [`docs-mcp/doctrine/html-markup-rules.md`](./html-markup-rules.md), [`components/ln-toast/template.html`](../../components/ln-toast/template.html) |
| **Navigation & Breadcrumb State** | Dynamic route matching sets `aria-current="page"` on active links in `ln-nav` and cleans inactive links; breadcrumbs style `[aria-current="page"]` | [`components/ln-nav/src/ln-nav.js`](../../components/ln-nav/src/ln-nav.js), [`theme/components/_breadcrumbs.scss`](../../theme/components/_breadcrumbs.scss), [`theme/config/mixins/_breadcrumbs.scss`](../../theme/config/mixins/_breadcrumbs.scss) |
| **Modal Focus Containment & Esc** | Native `<dialog>` element opened via `.showModal()` providing top-layer isolation, browser focus trapping, and synchronized `Escape` key cancellation via `cancel` event listener | [`components/ln-modal/src/ln-modal.js`](../../components/ln-modal/src/ln-modal.js) |
| **High-Visibility Focus Rings** | 3-layer `box-shadow` focus ring (`var(--color-bg)` boundary, 60% accent signal, 15% outer halo) preserving visibility against light and dark surfaces | [`theme/config/mixins/_focus.scss`](../../theme/config/mixins/_focus.scss) |
| **Vestibular Motion Safety** | `@mixin motion-safe` gates transform, scale, slide, and keyframe animations behind `@media (prefers-reduced-motion: no-preference)` | [`theme/config/mixins/_motion.scss`](../../theme/config/mixins/_motion.scss) |
| **Contrast-Safe Theme Vocabularies** | Semantic surface and foreground ladders (`--bg-base`, `--bg-elevated`, `--fg-default`, `--fg-muted`) engineered for contrast across light and dark modes | [`theme/config/_theme.scss`](../../theme/config/_theme.scss), [`docs-mcp/css/theming.md`](../css/theming.md) |
| **Target Sizing via Density Tiers** | Explicit `--density-row-h` baseline (`2.25rem` compact base, `2.75rem` comfortable, `3rem` spacious) supporting touch and pointer target requirements | [`theme/config/_density.scss`](../../theme/config/_density.scss), [`docs-mcp/css/density.md`](../css/density.md) |
| **Defensive Hidden State** | CSS reset enforces `[hidden] { display: none !important; }` preventing author styling overrides from exposing hidden translation lists or panels | [`theme/base/_reset.scss`](../../theme/base/_reset.scss) |

---

## 3. What Remains The Consuming Project's Responsibility

While `ln-ashlar` provides accessible component primitives, the consuming project holds full responsibility for the following application-level requirements:

- **Alternative Text Content:** Authoring meaningful, context-appropriate `alt` attributes for informative images and providing empty `alt=""` for purely decorative images.
- **Heading Order & Hierarchy:** Maintaining a single `<h1>` per page, following sequential levels (`<h2>` through `<h6>`) without skipping steps, and never utilizing heading elements solely for visual text sizing or KPI metrics.
- **Meaningful Link & Action Text:** Ensuring anchor and button text clearly conveys destination or purpose (avoiding ambiguous "click here", "read more", or identical repetitive links).
- **Document Language:** Declaring the valid primary language attribute on the root document element (`<html lang="...">`) and applying `lang` overrides on foreign language phrases.
- **Form Error Association:** Connecting field validation errors and instructional guidance to their corresponding input controls using `aria-describedby` and programmatic error announcements.
- **Focus Order in Custom Compositions:** Ensuring logical, intuitive tab sequencing across multi-column application layouts, custom grid structures, and asynchronously swapped DOM fragments.
- **Color Independence:** Ensuring status indicators, chart legends, and validation states do not rely on color as the exclusive means of communicating critical information or meaning.

---

## 4. How To Verify

Consuming projects must validate page-level accessibility through a three-stage verification workflow. Automated tools must be treated strictly as detectors, not certification authorities.

```
┌─────────────────────────────────┐
│     1. Automated Tool Scan      │  Fast detection of structural, contrast,
│    (axe-core, WAVE, Lighthouse) │  and missing-attribute defects.
└────────────────┬────────────────┘
                 │
                 ▼
┌─────────────────────────────────┐
│     2. Keyboard-Only Pass       │  Verify focus visibility, tab sequence,
│    (Tab / Shift+Tab / Esc)      │  dialog traps, and interactive triggers.
└────────────────┬────────────────┘
                 │
                 ▼
┌─────────────────────────────────┐
│  3. Screen Reader Spot-Check    │  Verify announced names, live regions,
│   (NVDA, VoiceOver, Orca)       │  state changes, and dialog announcements.
└─────────────────────────────────┘
```

### What Automated Scanners Cannot Detect

Automated scans cover only a subset of WCAG success criteria. They cannot verify:
1. **Meaningfulness:** Whether an `alt` text or `aria-label` accurately describes the resource.
2. **Reading & Tab Sequence:** Whether visual reading order matches the logical DOM tab sequence.
3. **Keyboard Traps:** Whether custom scripts trap focus or fail to release focus upon closing.
4. **Misleading ARIA:** Whether ARIA states and roles accurately represent visual state (e.g. `aria-expanded` out of sync).
5. **Color Reliance:** Whether critical information can be comprehended without perceiving color nuances.

---

## 5. Related Documents

- [`./html-markup-rules.md`](./html-markup-rules.md) — Semantic HTML5 markup doctrines, interactive element standards, and dictionary patterns.
- [`../css/theming.md`](../css/theming.md) — Surface elevation tokens and contrast invariants across light and dark themes.
- [`../css/motion.md`](../css/motion.md) — Reduced-motion gating mixins and vestibular safety principles.
- [`../css/density.md`](../css/density.md) — Inverted density system and target sizing across density tiers.
- [`../css/forms.md`](../css/forms.md) — Form layout grid, field groups, label typography, and focus ring presets.

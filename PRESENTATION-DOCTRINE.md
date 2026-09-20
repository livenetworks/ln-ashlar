# 🎨 ln-ashlar Presentation & Marketing Engineering Doctrine

> **Official Engineering Standards for High-Impact Presentation Pages, Marketing Sites, and Landing Experiences.**  
> Complements [DOCTRINE.md](DOCTRINE.md) — while `DOCTRINE.md` governs data-dense application shells, local-first stores, and component models, this document defines the mandatory architectural rules, semantic markup standards, fluid typography models, and styling doctrines for presentation and marketing web applications.

---

## 🏛️ 1. The Duality of ln-ashlar: Admin Applications vs. Presentation Experiences

`ln-ashlar` powers two distinct architectural experiences on a single unified, zero-dependency DOM-first foundation:

| Dimension | Application Shell (`ln-ashlar.css`) | Presentation Experience (`ln-ashlar-landing.css`) |
|---|---|---|
| **Primary Goal** | High data density, workflow efficiency, CRUD | Brand elevation, user conversion, storytelling |
| **Document Flow** | Fixed 100vh app shells (`overflow: hidden` on body) | Natural document scrolling (`overflow-y: auto`, `height: auto`) |
| **Typography Scale** | Compact 14px (`0.875rem`) body, fixed line heights | Fluid display `clamp()` typography (`--text-hero`, `--text-lead`) |
| **Surface Styling** | Structured flat panels, subtle hairline borders | Glassmorphism, ambient radial glows, asymmetric bento grids |
| **Animation Budget** | Strictly functional (sub-150ms state changes) | Compositor thread micro-animations (ambient floats, pulse glows) |
| **Layout Rhythm** | Tight compact grids, nested data tables, sidebars | Generous vertical section breathing room (`clamp(4rem, 8vw, 7.5rem)`) |

Both experiences share **100% of the underlying core architecture**:
1. Zero runtime dependencies.
2. Identical CSS token cascade and derivation engine.
3. Full compatibility with Ashlar's vanilla JS components (`ln-accordion`, `ln-modal`, `ln-tabs`, `ln-popover`, `ln-toggle`).

---

## 🎯 2. Orthogonal 3-Axis Theming in Presentation Contexts

Presentation sites in `ln-ashlar` strictly preserve the **3-Axis Orthogonal Theming Engine**:
- **Axis 1: Mode (`data-mode`):** `light` | `dark` (controls luminance ladder, surface polarity, and text contrasts).
- **Axis 2: Brand Theme (`data-theme`):** Controls primary HSL color ramps. In addition to application palettes (`ocean`, `sunset`, `midnight`, `glass`), presentation pages introduce high-vibrancy presets engineered for marketing conversion while guaranteeing WCAG AAA contrast:
  - `aurora`: Vivid emerald teal.
  - `violet`: Electric violet and deep indigo.
  - `cyber`: High-contrast cyber cyan.
- **Axis 3: Structural Skin (`data-skin`):** `default` | `soft` | `glass` | `outline` (controls border-radii, elevation shadows, and backdrop filters).

### Scoped Theme Islands
Presentation pages frequently require localized theme contrasts (e.g. an illuminated dark CTA card or a vibrant violet testimonial strip embedded inside a light page). 

Any arbitrary container in the DOM can declare `data-mode` or `data-theme`:
```html
<!-- Light Page Context -->
<main data-mode="light" data-theme="ocean">
    ...
    <!-- Local Scoped Island -->
    <div class="cta-box" data-mode="dark" data-theme="violet">
        <h2>Independent Color Scope</h2>
        <p>All child buttons, text colors, and borders rebind automatically.</p>
        <button type="button" class="btn btn-hero btn-glow">Get Started</button>
    </div>
</main>
```
**Rule:** Theme islands must rely on Ashlar's CSS custom property cascading. Writing ad-hoc inline styles or bespoke hardcoded color overrides inside islands is strictly forbidden.

---

## 🏷️ 3. Pure Semantic HTML5 & The Anti-BEM Doctrine

The presentation layer strictly enforces semantic HTML5 landmarks and structural purity:

> [!IMPORTANT]
> **Prohibition of Ad-Hoc BEM Class Hierarchies:**  
> Single-use BEM naming schemes (e.g. `.feature-grid`, `.feature-card`, `.feature-icon-wrap`, `.feature-title`, `.feature-desc`, `.stat-grid`, `.stat-item`, `.stat-number`, `.testimonial-quote`, `.testimonial-author`) are **strictly prohibited** in presentation markup.

### Architectural Rules for Presentation Markup:

1. **Semantic Section IDs:**  
   Every major landing section MUST carry an explicit semantic `id` attribute matching its role (`#hero`, `#bento`, `#features`, `#showcase`, `#stats`, `#pricing`, `#testimonials`, `#faq`, `#cta`). These IDs serve as navigation anchor targets and provide clean CSS scoping boundaries.

2. **Lists for Repeating Siblings (`<ul>` / `<ol>`):**  
   Whenever multiple elements of the same logical type are presented (cards, feature items, metrics, testimonials, pricing plans, footer links), they **MUST** be structured inside a `<ul>` / `<li>` or `<ol>` / `<li>`. Grouping siblings with sequential `<div>` or `<article>` tags without a parent list primitive is forbidden.

3. **Native Semantic Child Elements:**  
   Child elements are selected and styled via their native HTML5 semantics:
   - **Quotes & Reviews:** MUST use `<blockquote>`, `<p>`, `<footer>`, `<cite>`, `<span>`.
   - **Metrics & Numbers:** MUST use `<strong data-ln-number="...">` or `<data value="...">`, `<span>` (label), `<p>` (description).
   - **Feature Items:** MUST use `<li>`, `<div>` or `<figure>` (icon), `<h3>` (title), `<p>` (body).
   - **Pricing Tiers:** MUST use `<li>` (with `data-popular` for highlighted plans), `<span data-badge>` (badge), `<h3>`, `<p>`, `<data value="..." class="pricing-amount">`, nested `<ul>` (features), `<footer>` (action).
   - **Actions & Navigation:** MUST use `<nav>`, `<footer>`, `<button>`, `<a>`.

#### Canonical Semantic Examples:

**Testimonial Card:**
```html
<section id="testimonials" class="landing-section">
    <ul class="cards-grid">
        <li>
            <div class="testimonial-rating" aria-label="5 out of 5 stars">
                <svg class="ln-icon"><use href="#ln-icon-star-filled"></use></svg>
            </div>
            <blockquote>
                <p>"ln-ashlar revolutionized our marketing site performance."</p>
            </blockquote>
            <footer>
                <div class="author-avatar"><img src="..." alt="Elena Kane"></div>
                <div class="author-info">
                    <cite>Elena Kane</cite>
                    <span>VP of Design, NovaStream</span>
                </div>
            </footer>
        </li>
    </ul>
</section>
```

**Statistics Metrics Grid:**
```html
<section id="stats" class="landing-section-sm">
    <ul id="stats-list">
        <li>
            <strong class="text-gradient" data-ln-number="99.9%">99.9%</strong>
            <span>Infrastructure Uptime</span>
            <p>Reliable global edge delivery</p>
        </li>
        <li>
            <strong class="text-gradient" data-ln-number="50ms">&lt; 50ms</strong>
            <span>Interaction Latency</span>
            <p>Near-instantaneous UI response</p>
        </li>
    </ul>
</section>
```

---

## 🎨 4. SCSS Architecture: Mixin-First Composition & Reusable Grids

To eliminate CSS specificity wars and support headless/custom semantic markup, all presentation patterns follow the **Dual Authoring Pattern**:

### A. Mixins for ID & Semantic Selector Composition
Every presentation module exports functional SCSS mixins:
- `@mixin bento-grid` and `@mixin bento-card`
- `@mixin feature-grid` and `@mixin feature-card`
- `@mixin stat-grid` and `@mixin stat-item`
- `@mixin pricing-grid` and `@mixin pricing-card`
- `@mixin cta-box`

Project developers can compose these mixins against completely custom semantic IDs without placing a single component class in their HTML:

```scss
// Project SCSS: Pure Semantic ID Composition
#bento-showcase {
    @include bento-grid;

    article {
        @include bento-card;
        @include glow-hover;
    }

    #card-primary {
        @include bento-span(7);
    }
}
```

### B. Reusable Layout Utilities vs. Single-Use Classes
When classes are used for layouts in HTML, they must be **generic and reusable primitives** from `_layout.scss`:
- `.cards-grid`: General responsive card layout (1 col mobile &rarr; 2 col tablet &rarr; 3 col desktop).
- `.grid-2`, `.grid-3`, `.grid-4`: Explicit multi-column grid primitives.
- `.split-layout`: 50/50 responsive split hero/showcase container.

Creating single-use classes like `.testimonial-grid`, `.stat-grid`, or `.feature-grid` is forbidden.

---

## ⚡ 5. Zero Inline Styles & GPU Compositor Performance

Presentation pages must achieve perfect **100/100 Core Web Vitals** with zero Cumulative Layout Shift (CLS) and sub-50ms Interaction to Next Paint (INP):

1. **Zero Inline Styles (`style="..."`):**  
   All styles, transforms, grid column spans, and backdrop filters belong in stylesheets or modular mixins. Inline styles on HTML tags are strictly forbidden.

2. **Compositor-Only Animations:**  
   Animations (`animate-float`, `pulse-subtle`, hover transforms) must animate **exclusively** GPU-composited properties:
   - `transform` (e.g. `translateY(-2px)`, `scale(1.03)`)
   - `opacity`
   - `filter: blur()`
   Animating layout properties (`height`, `width`, `margin`, `padding`, `top`, `left`) is strictly prohibited.

---

## 🧩 6. Vanilla JS Component Synergy in Presentation

Presentation marketing pages in `ln-ashlar` use the exact same Layer 1 components as application panels, maintaining zero external dependencies:

- **Interactive FAQs:** Use Ashlar's native `ln-accordion` (`<ul data-ln-accordion="single" class="accordion">`) for accessible keyboard-navigable FAQ sections.
- **Lead Capture & Inquiries:** Use `<dialog data-ln-modal>` for high-converting contact and demo modals.
- **Billing Period Switches:** Use `ln-tabs` or accessible button groups for monthly / annual pricing toggles.
- **Live Theme & Appearance Pickers:** Use `ln-popover` (`popover` API with graceful polyfill) for non-modal floating control panels.

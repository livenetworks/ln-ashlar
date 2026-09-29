#!/usr/bin/env node

/**
 * scripts/generate-llms.mjs
 *
 * Generates `llms.txt` and `llms-full.txt` from authoritative sources in `docs-mcp/`, `DOCTRINE.md`, and `CLAUDE.md`.
 * Adheres to the /llms.txt specification (https://llmstxt.org/) to make ln-ashlar fully understandable to AI agents.
 *
 * Usage:
 *   node scripts/generate-llms.mjs         # Generate both files
 *   node scripts/generate-llms.mjs --check # Check for drift (exit 1 if out of date)
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const REPO_ROOT = path.resolve(__dirname, '..');

const isCheck = process.argv.includes('--check');

// Helper to normalize line endings to \n
function normalize(str) {
  return str.replace(/\r\n/g, '\n');
}

function parseFrontmatter(text) {
  const fmM = text.match(/^---\n([\s\S]*?)\n---/);
  const fm = {};
  if (fmM) {
    fmM[1].split('\n').forEach(line => {
      const idx = line.indexOf(':');
      if (idx !== -1) {
        const key = line.slice(0, idx).trim();
        let val = line.slice(idx + 1).trim();
        if (val.startsWith('[') && val.endsWith(']')) {
          val = val.slice(1, -1).split(',').map(s => s.trim());
        }
        fm[key] = val;
      }
    });
  }
  return fm;
}

function extractMentalModel(text) {
  const match = text.match(/#\s+[^\n]+\n\n(>[\s\S]*?)(?=\n\n---|\n\n##)/);
  return match ? match[1].trim() : '';
}

function extractSection(text, sectionNumber) {
  const escapedNum = sectionNumber.replace('.', '\\.');
  const regex = new RegExp(`## ${escapedNum}\\s+[^\\n]*\\n([\\s\\S]*?)(?=\\n## \\d+\\.|$)`);
  const match = text.match(regex);
  return match ? match[1].trim() : '';
}

// 1. Gather all component documentation
const componentsDir = path.join(REPO_ROOT, 'docs-mcp', 'components');
const componentFiles = fs.readdirSync(componentsDir).filter(f => f.endsWith('.md')).sort();

const components = [];
for (const file of componentFiles) {
  const fullPath = path.join(componentsDir, file);
  const text = normalize(fs.readFileSync(fullPath, 'utf8'));
  const fm = parseFrontmatter(text);
  const name = fm.name || file.replace('.md', '');
  const mentalModel = extractMentalModel(text);
  const markup = extractSection(text, '2.');
  const contract = extractSection(text, '3.');
  const responsibility = extractSection(text, '1.');

  components.push({
    file,
    name,
    classification: fm.classification || 'simple',
    status: fm.status || 'stable',
    summary: fm.summary || '',
    mentalModel,
    markup,
    contract,
    responsibility
  });
}

// Group components by domain/layer
const overlayComponents = ['ln-modal', 'ln-popover', 'ln-tooltip', 'ln-confirm'];
const dataDisplayComponents = ['ln-table', 'ln-list', 'ln-chart', 'ln-progress', 'ln-circular-progress', 'ln-stat'];
const formComponents = ['ln-form', 'ln-validate', 'ln-upload', 'ln-autosave', 'ln-autoresize', 'ln-picklist', 'ln-options', 'ln-date', 'ln-number', 'ln-editor', 'ln-slug'];
const navigationComponents = ['ln-nav', 'ln-tabs', 'ln-router', 'ln-scroll', 'ln-link', 'ln-external-links'];
const feedbackComponents = ['ln-toast'];
const stateComponents = ['ln-toggle', 'ln-accordion', 'ln-dropdown', 'ln-sortable', 'ln-key'];
const dataFlowComponents = ['ln-data-coordinator', 'ln-data-store', 'ln-table-coordinator', 'ln-ui-coordinator', 'ln-ajax', 'ln-include', 'ln-api-connector', 'ln-api-queue', 'ln-couchdb-connector', 'ln-websocket-connector', 'ln-filter', 'ln-search', 'ln-sort'];
const utilityComponents = ['ln-core', 'ln-helpers', 'ln-http', 'ln-icon', 'ln-time', 'ln-obfuscator', 'ln-crypto', 'ln-hash', 'ln-reactive', 'ln-translations', 'ln-persist', 'ln-debug', 'positioning', 'window-cache'];

function getCompDoc(name) {
  return components.find(c => c.name === name);
}

// -------------------------------------------------------------
// BUILD llms.txt
// -------------------------------------------------------------
function buildLlmsTxt() {
  const lines = [];

  lines.push('# ln-ashlar');
  lines.push('');
  lines.push('> LiveNetworks unified frontend library — DOM-First, zero-build-required vanilla JS components and SCSS design system. Eliminates virtual DOM and synthetic state trees by using semantic HTML5, MutationObserver-driven state reactivity in data-ln-* attributes, and local-first architecture.');
  lines.push('');
  lines.push('ln-ashlar provides a robust, production-proven foundation for web applications. It supports both Progressive Enhancement (Server-Rendered HTML in Laravel, Go, Rails, Django) and Client-Side Single Page Applications (SPAs consuming REST/JSON APIs).');
  lines.push('');
  lines.push('### Core Architectural Invariants:');
  lines.push('- **Rule Zero**: Read the source before you write. Never invent component names, attributes, mixins, or tokens. Query the live documentation first.');
  lines.push('- **Three-Layer Architecture**: Layer 1 (Autonomous Components managing own DOM), Layer 2 (Coordinators orchestrating cross-component state and UI triggers), Layer 3 (ln-core primitives, storage, and helpers).');
  lines.push('- **Command & Query Separation (CQS)**: Coordinators NEVER call prototype mutation methods directly. They ALWAYS dispatch request events (`ln-{name}:request-{action}`) or write `setAttribute()`. State properties are read directly.');
  lines.push('- **DOM as Public Control Plane**: State lives strictly in observable `data-ln-*` attributes. Private runtime status is communicated through CustomEvents. Zero state mirrors in JS memory.');
  lines.push('- **Zero Virtual DOM & Zero Initialization**: The platform handles lifecycles. Components self-mount via a single shared `MutationObserver` on `document.body`. Never instantiate via `new LnComponent()`.');
  lines.push('- **HTML-First Templates & Zero JS Display Text**: Template DOM lives in `<template data-ln-template="...">` in HTML. Display text belongs in HTML `<ul hidden><li data-{component}-dict="key">...</li></ul>` or browser `Intl`. Zero hardcoded UI strings in JS.');
  lines.push('- **Semantic HTML5 & Accessibility**: Lists/groups MUST use `<ul>/<li>`. Semantic elements (`<dialog>`, `<nav>`, `<form>`, `<section>`, `<article>`, `<time>`) are mandatory.');
  lines.push('- **Confirmation Gating**: Two-click in-place `ln-confirm` is strictly for single-element, low-impact actions. Multi-item, bulk, or destructive actions MUST use an `ln-modal`.');
  lines.push('- **Anti-Harvesting Protection**: Contact emails (`mailto:`) and phones (`tel:`) in HTML shells MUST be protected via `ln-obfuscator` (`data-ln-obfuscator`).');
  lines.push('- **Async Invariants & Destroyed Protocol**: Async components maintain an `AbortController`. Teardown via `destroy()` aborts in-flight network requests, clears timers, drops stale responses (`queryGen`), and cleans all DOM traces.');
  lines.push('');
  lines.push('## Complete Reference');
  lines.push('');
  lines.push('- [llms-full.txt](llms-full.txt): Complete, consolidated single-file reference for AI agents containing the full doctrine, component catalog, canonical markup snippets, API contracts, and SCSS guide.');
  lines.push('');
  lines.push('## Core Architecture & Doctrines');
  lines.push('');
  lines.push('- [DOCTRINE.md](DOCTRINE.md): Mandatory engineering doctrines, 3-layer architecture, CQS, observable attribute state, and lifecycle rules.');
  lines.push('- [PRESENTATION-DOCTRINE.md](PRESENTATION-DOCTRINE.md): Guidelines for public presentation and marketing websites (fluid typography, bento grids, semantic rules).');
  lines.push('- [Component Router](docs-mcp/component-router.md): Authoritative component selection matrix ("Use for / Don\'t use for").');
  lines.push('- [Mindset & Philosophy](docs-mcp/doctrine/mindset.md): Architectural mindset behind Ashlar\'s DOM-First, local-first, zero-virtual-DOM design.');
  lines.push('- [HTML Markup Rules](docs-mcp/doctrine/html-markup-rules.md): Semantic HTML5 rules, list groupings, template cloning, and anti-harvesting specs.');
  lines.push('- [Data Flow Architecture](docs-mcp/doctrine/data-flow.md): Event propagation, request-event dispatching, cancellation protocol, and detail guards.');
  lines.push('- [Data Layer Doctrine](docs-mcp/doctrine/data-layer.md): IndexedDB local stores, offline sync queues, and HTTP connector contracts.');
  lines.push('- [JS Component Model](docs-mcp/doctrine/js-component-model.md): Two-tier component archetype, Proxy traps, and destroyed component invariant.');
  lines.push('- [SCSS Architecture Doctrine](docs-mcp/doctrine/scss-architecture.md): Two-layer SCSS system, token flow (Brand -> Scale -> Vocabulary -> Primitives), and mixins.');
  lines.push('- [Accessibility (ARIA)](docs-mcp/doctrine/accessibility.md): Accessibility standards, native dialog focus trapping, and screen-reader contracts.');
  lines.push('');

  function renderGroup(title, names) {
    lines.push(`## ${title}`);
    lines.push('');
    for (const name of names) {
      const c = getCompDoc(name);
      if (c) {
        lines.push(`- [${c.name}](docs-mcp/components/${c.file}): ${c.summary}`);
      }
    }
    lines.push('');
  }

  renderGroup('Overlays & Dialogs', overlayComponents);
  renderGroup('Data Display & Tables', dataDisplayComponents);
  renderGroup('Forms, Inputs & Validation', formComponents);
  renderGroup('Navigation & State', navigationComponents);
  renderGroup('Feedback & Notifications', feedbackComponents);
  renderGroup('State & UI Primitives', stateComponents);
  renderGroup('Data Flow, Storage & Connectors', dataFlowComponents);
  renderGroup('Utilities & Core Services', utilityComponents);

  lines.push('## CSS Architecture & Design Tokens');
  lines.push('');
  lines.push('- [Design Tokens](docs-mcp/css/tokens.md): Layered design token architecture (Brand, Scale, Vocabulary, Primitives).');
  lines.push('- [SCSS Mixins](docs-mcp/css/mixins.md): Master index and reference for SCSS mixins covering layout, cards, buttons, forms, and typography.');
  lines.push('- [Theming & Modes](docs-mcp/css/theming.md): Dark mode, light mode, brand colors, presets, and scoped theme islands.');
  lines.push('- [Layout Primitives](docs-mcp/css/layout.md): Grid, stack, row, and responsive layout primitives in SCSS.');
  lines.push('- [Responsive Breakpoints](docs-mcp/css/breakpoints.md): Breakpoint tokens and responsive media query mixins.');
  lines.push('- [Density Modes](docs-mcp/css/density.md): Compact vs. spacious density scaling through `[data-density]`.');
  lines.push('- [App Shell](docs-mcp/css/app-shell.md): Responsive multi-pane application layout structure with sidebar.');
  lines.push('');
  lines.push('## Application Patterns & Workflows');
  lines.push('');
  lines.push('- [Modal CRUD Pattern](docs-mcp/patterns/modal-crud.md): Complete create, edit, prefill, and delete workflow connecting tables, modals, and coordinators.');
  lines.push('- [Data Table Sync Pattern](docs-mcp/patterns/data-table-sync.md): Synchronizing search filters, sorting, column popovers, and sliding-window tables.');
  lines.push('- [SPA Routing Guide](docs-mcp/guides/spa-routing.md): Client-side Single Page Application architecture, template routes, and View Transitions.');
  lines.push('- [Component Authoring Guide](docs-mcp/guides/component-authoring.md): Step-by-step guide to authoring new Layer 1 components conforming to doctrine.');
  lines.push('- [Coordinator Authoring Guide](docs-mcp/guides/coordinator-authoring.md): Wiring UI triggers, bridging attributes, and orchestrating components.');
  lines.push('- [Write Workflow](docs-mcp/guides/write-workflow.md): Local-first write pipeline with optimistic mutations and offline queueing.');
  lines.push('');
  lines.push('## Optional');
  lines.push('');
  lines.push('- [SPA Starter Kit](spa-starter/README.md): Production-ready single page application starter with Vite and ashlar.');
  lines.push('- [JSON Attribute Schemas](components/): Machine-readable schema definitions (`*.schema.json`) for dev-time attribute contract enforcement.');
  lines.push('- [HTML Custom Data](ln-ashlar.html-data.json): VS Code custom data provider for autocomplete and attribute hints.');
  lines.push('- [JetBrains Web-Types](web-types.json): Web-Types schema for JetBrains IDE integration.');

  return lines.join('\n') + '\n';
}

// -------------------------------------------------------------
// BUILD llms-full.txt
// -------------------------------------------------------------
function buildLlmsFullTxt() {
  const lines = [];

  lines.push('# ln-ashlar — Full Library Context & Architecture Reference');
  lines.push('');
  lines.push('> Consolidated Single-File Reference for AI Agents & Developers  ');
  lines.push('> LiveNetworks unified frontend library — DOM-First, zero-build-required vanilla JS components and SCSS design system.');
  lines.push('');
  lines.push('---');
  lines.push('');
  lines.push('## 🏛️ PART 1: PHILOSOPHY & ENGINEERING DOCTRINES');
  lines.push('');
  lines.push('### 1.1 The Ashlar Mindset');
  lines.push('- **DOM as the Single Source of Truth**: The DOM is the public control plane. Component state lives in DOM attributes (`data-ln-*`), readable and mutable via standard DOM APIs (`getAttribute`, `setAttribute`). No private JavaScript mirrors of attribute state.');
  lines.push('- **Zero Virtual DOM & Zero Synthetic State Trees**: No React/Vue state diffing. The browser is the runtime. State updates are localized and transparent in DevTools.');
  lines.push('- **Zero Initialization**: Components self-mount automatically via a single root `MutationObserver` on `document.body`. Developers never call `new Component()` or register event listeners by hand in markup.');
  lines.push('- **Rule Zero**: **Read the source before you write. Never invent attributes, mixins, or tokens.** If an attribute or method is not in the source/documentation, it does not exist.');
  lines.push('');
  lines.push('### 1.2 Three-Layer Architecture');
  lines.push('```');
  lines.push('┌─────────────────────────────────────────────────────────┐');
  lines.push('│ Layer 2: Coordinator (Project UI Wiring & Mediator)     │');
  lines.push('│ (Catches UI triggers, dispatches request events, bridges)│');
  lines.push('└───────────────────────────┬─────────────────────────────┘');
  lines.push('                            │ CustomEvents / setAttribute');
  lines.push('┌───────────────────────────▼─────────────────────────────┐');
  lines.push('│ Layer 1: Component (Reusable Data & DOM Layer)          │');
  lines.push('│ (Manages internal DOM, state observer, emits events)    │');
  lines.push('└───────────────────────────┬─────────────────────────────┘');
  lines.push('                            │ Native APIs / Core Helpers');
  lines.push('┌───────────────────────────▼─────────────────────────────┐');
  lines.push('│ Layer 3: ln-ashlar Core                                 │');
  lines.push('│ (ln-core primitives, fill(), buildDict, interceptors)   │');
  lines.push('└─────────────────────────────────────────────────────────┘');
  lines.push('```');
  lines.push('- **Layer 1 (Simple Components)**: Self-contained, manage only their own DOM state and ARIA properties. Completely blind to sibling components. Zero imports of siblings. Communication is 100% via CustomEvents (`{ bubbles: true }`) or DOM attributes.');
  lines.push('- **Layer 2 (Coordinators)**: Project-level mediators that listen to bubbling events from simple components and orchestrate state across components strictly via `setAttribute` or request events.');
  lines.push('- **Layer 3 (Core & Primitives)**: Low-level utilities (`fill()`, `buildDict()`, `cloneTemplate()`, `date.js`, `number.js`, `matching.js`, `crypto.js`). Pure algorithms needed by 2+ components are lifted to core (The 2-Consumer Lifting Rule).');
  lines.push('');
  lines.push('### 1.3 Command & Query Separation (CQS)');
  lines.push('- **Commands (Mutations)**: Coordinators MUST NOT call prototype mutation methods directly (`el.lnProfile.create()`). They ALWAYS dispatch request events (`ln-profile:request-create`) or write `setAttribute()`.');
  lines.push('- **Queries (Reading State)**: Coordinators MAY read component state properties directly (`el.lnProfile.currentId`).');
  lines.push('');
  lines.push('### 1.4 Attribute Bridge Pattern & Observable State');
  lines.push('- **Control State in Attributes**: Observable state that can be set from outside (open/closed, sort direction, active tab, page offset) lives in `data-ln-*` attributes.');
  lines.push('- **Runtime Status Stays Private**: Status that an internal process observes while working (`connecting`, `loading`, `uploading`, `dragover`) is private JS state, never an attribute. It is announced via CustomEvents.');
  lines.push('- **Never Store State in CSS Classes**: Classes belong to the visual theme layer. State never lives in CSS classes (with the sole exception of 1-frame animation classes like `ln-enter`/`ln-out`).');
  lines.push('- **Debouncing Belongs in the Observer**: Debounce timers for expensive reactions live in `_syncAttribute` / `effects`, not in input handlers.');
  lines.push('');
  lines.push('### 1.5 HTML Templates & Zero Display Text in JS');
  lines.push('- **HTML-First DOM**: Structures belong in `<template data-ln-template="...">` in HTML, cloned via `lnCore.cloneTemplate()` and populated via `lnCore.fill()`. Never build trees with `createElement` chains in JS.');
  lines.push('- **Zero Display Text in JS**: UI text belongs in translatable dictionaries `<ul hidden><li data-{component}-dict="key">...</li></ul>` (read via `buildDict()`) or browser `Intl` APIs. No hardcoded human strings in JS.');
  lines.push('');
  lines.push('### 1.6 Lifecycle Events & Async Invariants');
  lines.push('- **Paired Events**: Components emit `ln-{name}:before-{action}` (cancelable) before state changes, and `ln-{name}:{action}` (bubbling) after state changes.');
  lines.push('- **Detail Guard Pattern**: Always check `e.detail && e.detail.prop` when listening to external events.');
  lines.push('- **Async Invariants & AbortController**: Async operations maintain an `AbortController`. Teardown via `destroy()` aborts network calls, clears timers, drops stale responses via `queryGen`, and removes all added ARIA, listeners, and nodes.');
  lines.push('');
  lines.push('### 1.7 UI Confirmation & Anti-Harvesting Doctrines');
  lines.push('- **In-Place Confirmation (`ln-confirm`)**: Strictly reserved for single-element, low-impact actions (deleting one row, archiving one item).');
  lines.push('- **Modal Confirmation (`ln-modal`)**: Mandatory for bulk actions, batch operations, or destructive actions with major side effects.');
  lines.push('- **Anti-Harvesting (`ln-obfuscator`)**: Public email addresses (`mailto:`) and phone numbers (`tel:`) in HTML shells MUST be protected via `data-ln-obfuscator` by default.');
  lines.push('');
  lines.push('---');
  lines.push('');
  lines.push('## 🚦 PART 2: AI PRE-CODE VERIFICATION CHECKLIST');
  lines.push('');
  lines.push('Before writing or editing HTML, SCSS, or JS code, verify:');
  lines.push('1. **HTML Architecture**:');
  lines.push('   - Zero bare `<div>`: Does every `<div>` have a structural class? Can `<section>`, `<article>`, `<header>`, `<footer>`, `<aside>`, or `<main>` be used instead?');
  lines.push('   - The `ul/li` Grouping Rule: Are repeating items, tags, chips, buttons, or options wrapped in `<ul>/<li>` or `<ol>/<li>`? (Mandatory!).');
  lines.push('   - Interactive Elements: Are clickable elements `<button type="button">` or `<a>`? Never bind click triggers to `<div>` or `<span>`.');
  lines.push('   - Semantic Tags: Dates in `<time datetime="...">`, numbers in `<strong>`/`<b>`/`<data value="...">`.');
  lines.push('2. **CSS & Styling Separation**:');
  lines.push('   - Zero inline styles (`style="..."` forbidden).');
  lines.push('   - Zero presentational utility classes in HTML (`flex`, `grid`, `text-red` forbidden).');
  lines.push('   - Semantic SCSS binding: Mixins applied to semantic selectors/IDs (e.g. `#my-panel { @include card; }`).');
  lines.push('3. **JS & Component Behavior**:');
  lines.push('   - Bindings strictly on `data-ln-*` or `data-*` attributes, NEVER on CSS classes.');
  lines.push('   - JS does NOT set styling properties (`el.style.display = ...` forbidden).');
  lines.push('');
  lines.push('---');
  lines.push('');
  lines.push('## 🧭 PART 3: COMPONENT SELECTION ROUTER');
  lines.push('');
  
  // Read component-router.md tables
  const routerPath = path.join(REPO_ROOT, 'docs-mcp', 'component-router.md');
  if (fs.existsSync(routerPath)) {
    const routerText = normalize(fs.readFileSync(routerPath, 'utf8'));
    // Strip header and include the tables
    const bodyMatch = routerText.replace(/^#\s+[^\n]+\n+/, '');
    lines.push(bodyMatch.trim());
  }
  lines.push('');
  lines.push('---');
  lines.push('');
  lines.push('## 📦 PART 4: COMPONENT CATALOG & API CONTRACTS');
  lines.push('');

  for (const c of components) {
    lines.push(`### ${c.name}`);
    lines.push(`- **Classification:** \`${c.classification}\` | **Status:** \`${c.status}\``);
    lines.push(`- **Summary:** ${c.summary}`);
    lines.push('');
    if (c.mentalModel) {
      lines.push(c.mentalModel);
      lines.push('');
    }
    if (c.markup) {
      lines.push('#### Minimal HTML Markup & Usage:');
      lines.push(c.markup);
      lines.push('');
    }
    if (c.contract) {
      lines.push('#### Declarative API Contract (Attributes & Events):');
      lines.push(c.contract);
      lines.push('');
    }
    lines.push('---');
    lines.push('');
  }

  lines.push('## 🎨 PART 5: SCSS DESIGN SYSTEM & TOKENS');
  lines.push('');
  lines.push('Ashlar styles are organized in a two-layer structure:');
  lines.push('1. **Core Functional Layer (`ln-ashlar-core.css`)**: Zero tokens, zero colors, zero fonts. Contains only structural transitions, display toggles, and base functional requirements.');
  lines.push('2. **Theme Visual Layer (`ln-ashlar-theme.css`)**: Contains design tokens, mixin recipes, surfaces, layout primitives, and typography.');
  lines.push('');
  lines.push('### Token Architecture (4 Layers):');
  lines.push('```');
  lines.push('1. Brand Tokens      -> --brand-primary: 221 83% 48%; (Bare HSL)');
  lines.push('        ↓');
  lines.push('2. Scale Tokens      -> --size-md: 1rem; --color-neutral-100: ... (Scale plumbing; never read inside mixins)');
  lines.push('        ↓');
  lines.push('3. Vocabulary Tokens -> --bg-base, --bg-elevated, --bg-sunken, --fg-default, --border-subtle, --shadow-resting');
  lines.push('        ↓');
  lines.push('4. Primitive Tokens  -> --color-bg, --color-fg, --color-border, --shadow, --radius, --padding-x, --gap');
  lines.push('                        (The ONLY tokens mixin bodies read and consume!)');
  lines.push('```');
  lines.push('');
  lines.push('### Core SCSS Mixins:');
  lines.push('- `@include card`: Base card surface with border, shadow, and rounded corners.');
  lines.push('- `@include button([variant])`: Interactive button styles (`primary`, `secondary`, `destructive`, `ghost`).');
  lines.push('- `@include pill`: Compact status pill or badge.');
  lines.push('- `@include grid($cols, $gap)`: CSS grid layout with configurable columns.');
  lines.push('- `@include stack($gap)`: Vertical flex stack.');
  lines.push('- `@include row($gap, $align)`: Horizontal flex row.');
  lines.push('- `@include bp($breakpoint)`: Media query mixin (`sm: 640px`, `md: 768px`, `lg: 1024px`, `xl: 1280px`).');
  lines.push('- `@include typography($variant)`: Fluid typography (`display-lg`, `title-lg`, `title-md`, `body-md`, `body-sm`).');
  lines.push('');
  lines.push('### Theming & Scopes:');
  lines.push('- Mode switching: `data-mode="dark"` or `data-mode="light"` on `<html>` or scoped containers.');
  lines.push('- Density modes: `data-density="compact"` or `data-density="spacious"`.');
  lines.push('- Skins: `data-skin="corporate"` / `data-skin="slate"` for distinct visual expressions.');
  lines.push('');
  lines.push('---');
  lines.push('');
  lines.push('## 🧩 PART 6: COMPOSITE APPLICATION PATTERNS');
  lines.push('');

  // Include Modal CRUD Pattern
  const modalCrudPath = path.join(REPO_ROOT, 'docs-mcp', 'patterns', 'modal-crud.md');
  if (fs.existsSync(modalCrudPath)) {
    lines.push('### 6.1 Modal CRUD Pattern');
    lines.push('');
    const mcText = normalize(fs.readFileSync(modalCrudPath, 'utf8'));
    lines.push(mcText.replace(/^---\n[\s\S]*?\n---\n/, '').trim());
    lines.push('');
    lines.push('---');
    lines.push('');
  }

  // Include Data Table Sync Pattern
  const dataTableSyncPath = path.join(REPO_ROOT, 'docs-mcp', 'patterns', 'data-table-sync.md');
  if (fs.existsSync(dataTableSyncPath)) {
    lines.push('### 6.2 Data Table Sync Pattern');
    lines.push('');
    const dtsText = normalize(fs.readFileSync(dataTableSyncPath, 'utf8'));
    lines.push(dtsText.replace(/^---\n[\s\S]*?\n---\n/, '').trim());
    lines.push('');
    lines.push('---');
    lines.push('');
  }

  lines.push('## 🛠️ PART 7: BUILD COMMANDS & VERIFICATION');
  lines.push('');
  lines.push('```bash');
  lines.push('npm run build              # Build full library into demo/dist/ + compile demo pages');
  lines.push('npm run dev                # Watch mode (library only)');
  lines.push('npm test                   # Run schema checks, event sync checks, css token checks, and unit tests');
  lines.push('npm run sync:ln-schemas    # Regenerate components/ln-*/ln-*.schema.json from source code');
  lines.push('npm run sync:ln-schemas:check   # Report schema drift without writing (exit 1 on drift)');
  lines.push('npm run sync:ln-events     # Verify CustomEvent naming compliance');
  lines.push('npm run sync:css-tokens    # Verify CSS design token synchronization');
  lines.push('npm run generate:llms      # Regenerate llms.txt and llms-full.txt');
  lines.push('```');

  return lines.join('\n') + '\n';
}

// -------------------------------------------------------------
// EXECUTION
// -------------------------------------------------------------
const llmsTxtContent = buildLlmsTxt();
const llmsFullTxtContent = buildLlmsFullTxt();

const targetLlmsTxt = path.join(REPO_ROOT, 'llms.txt');
const targetLlmsFullTxt = path.join(REPO_ROOT, 'llms-full.txt');

if (isCheck) {
  let drift = false;
  if (!fs.existsSync(targetLlmsTxt) || normalize(fs.readFileSync(targetLlmsTxt, 'utf8')) !== llmsTxtContent) {
    console.error('❌ Drift detected: llms.txt is out of date. Run `npm run generate:llms` to update.');
    drift = true;
  }
  if (!fs.existsSync(targetLlmsFullTxt) || normalize(fs.readFileSync(targetLlmsFullTxt, 'utf8')) !== llmsFullTxtContent) {
    console.error('❌ Drift detected: llms-full.txt is out of date. Run `npm run generate:llms` to update.');
    drift = true;
  }
  if (drift) {
    process.exit(1);
  }
  console.log('✅ llms.txt and llms-full.txt are up to date.');
  process.exit(0);
}

fs.writeFileSync(targetLlmsTxt, llmsTxtContent, 'utf8');
console.log(`✅ Generated llms.txt (${llmsTxtContent.length} bytes, ${llmsTxtContent.split('\n').length} lines)`);

fs.writeFileSync(targetLlmsFullTxt, llmsFullTxtContent, 'utf8');
console.log(`✅ Generated llms-full.txt (${llmsFullTxtContent.length} bytes, ${llmsFullTxtContent.split('\n').length} lines)`);

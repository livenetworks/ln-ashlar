# Ashlar Releases

A chronological index of releases for the Ashlar UI framework. Each release includes a concise 1–2 sentence overview; click through to any release document for detailed release notes, architectural details, and benchmarks.

---

### [v2.1.7](./v2.1.7.md) — October 16, 2026
Clean separation of SSR DOM and Virtual API table architectures (`table-api`), elimination of empty table flash on optimistic search/filter, live query viewport scroll stability, and GPU composite acceleration for table sticky headers.  
👉 [Read full v2.1.7 release notes](./v2.1.7.md)

### [v2.1.6](./v2.1.6.md) — October 14, 2026
Fixed `ln-api-connector` path collision where `data-ln-api-endpoint` shadowed `data-ln-api-path`, aligned remote sort query parameter naming in `api.php`, and introduced zero-dependency Python local dev server.  
👉 [Read full v2.1.6 release notes](./v2.1.6.md)

### [v2.1.5](./v2.1.5.md) — October 13, 2026
Core `withoutLifecycle(fn)` observer suspension and moved-node fast bailouts eliminating 100% of redundant DOM queries during table sorting and DOM reordering.  
👉 [Read full v2.1.5 release notes](./v2.1.5.md)

### [v2.1.4](./v2.1.4.md) — October 13, 2026
Performance optimization for `ln-sort` utilizing Schwartzian Transform (pre-computed keys), cutting DOM sorting queries by up to 90%, inverting `ln-core.readValue` priority to honor native `value` first, and consolidating `ln-autoresize` into `ln-form`.  
👉 [Read full v2.1.4 release notes](./v2.1.4.md)

### [v2.1.3](./v2.1.3.md) — October 13, 2026
Hotfix for `ln-date` and `ln-number` input controls, restoring the `const self = this` lexical scope reference inadvertently removed during the v2.1.2 listener pooling migration. Eliminates runtime `TypeError: e._setHiddenRaw is not a function` during form interaction.  
👉 [Read full v2.1.3 release notes](./v2.1.3.md)

### [v2.1.2](./v2.1.2.md) — October 12, 2026
Component-wide performance optimizations introducing DOM write guards, high-frequency RAF batching, micro-component listener pooling, and lifecycle subtree segregation. Delivers up to 62% fewer DOM mutations, 46% faster search/filtering, and zero test regressions across all components.  
👉 [Read full v2.1.2 release notes](./v2.1.2.md) | [Performance Benchmark Report](./perf-baseline.md)

### [v2.1.1](./v2.1.1.md) — October 12, 2026
Rich text editing (`ln-editor`) and core lifecycle performance optimization introducing early contenteditable bailouts and focus-scoped selection listeners. Cut typing mutations by 99.7% and typing CPU time by 66.5%.  
👉 [Read full v2.1.1 release notes](./v2.1.1.md)

### [v2.1.0](https://github.com/livenetworks/ln-ashlar/releases/tag/v2.1.0) — October 11, 2026
Core engine consolidation uniting disparate MutationObservers into a unified lifecycle observer, introducing leaf-node fast paths, and echo guards. Significantly reduced observer overhead and idle memory footprint across all components.  
👉 [View GitHub release](https://github.com/livenetworks/ln-ashlar/releases/tag/v2.1.0)

### [v2.0.10](https://github.com/livenetworks/ln-ashlar/releases/tag/v2.0.10) — October 11, 2026
Enhanced dynamic childList DOM reactivity, synchronized IDE schema definitions (web-types and HTML data), and updated documentation footers.  
👉 [View GitHub release](https://github.com/livenetworks/ln-ashlar/releases/tag/v2.0.10)

### [v2.0.8](https://github.com/livenetworks/ln-ashlar/releases/tag/v2.0.8) — October 10, 2026
Major architectural refactoring of `ln-data-coordinator`, resolving query composition issues, window-cache `queryGen` synchronization, and introducing headless table integration tests.  
👉 [View GitHub release](https://github.com/livenetworks/ln-ashlar/releases/tag/v2.0.8)

### [v2.0.7](https://github.com/livenetworks/ln-ashlar/releases/tag/v2.0.7) — October 9, 2026
Systemic stability release fixing event listener teardown leaks, enforcing custom event detail guards, and synchronizing native HTML popover states.  
👉 [View GitHub release](https://github.com/livenetworks/ln-ashlar/releases/tag/v2.0.7)

### [v2.0.0](https://github.com/livenetworks/ln-ashlar/releases/tag/v2.0.0) — October 2026
The Ashlar 2.0 architecture milestone: zero-dependency vanilla JS, Three-Layer architecture, strict Command & Query Separation, typed attribute contracts, and DOM-as-SSOT.  
👉 [View GitHub release](https://github.com/livenetworks/ln-ashlar/releases/tag/v2.0.0)

# TODO — ln-ashlar Next Steps

## Skills Rewrite (from SESSION-HANDOFF.md)

- [ ] CSS skill — remove motion duplication, add reference to ln-ashlar tokens
- [ ] HTML skill — fix cross-references (`SKILL-CSS.md` → correct path)

## Deferred

- [ ] **ln-copy** — clipboard helper (deferred from Phase 8, no concrete consumer yet)
- [ ] **ln-shortcuts** — keyboard shortcut registry (deferred from Phase 8, no concrete consumer yet)
- [ ] **Phase 10** — Infrastructure (auto-token-docs, Playwright VR, CHANGELOG, migration guide)

## Router Follow-ups & Future Scope

- [x] **Delimiter docs update** — update `docs/js/core.md` to consistently reference double-braces `{{key}}` instead of single braces `{key}` for `fillTemplate`.
- [ ] **View Caching / Keep-alive** — allow re-attaching a previously mounted view instead of re-cloning.
- [ ] **Nested Routers** — support outlets inside route views with scoped sub-path matching.
- [ ] **Hash-mode routing** — fallback/alternative to pushState history mode.
- [ ] **Route-level declarative data loading** — declarative route-level data fetching contracts rather than delegating solely to page coordinators.
- [ ] **Advanced transitions** — transition/animation system beyond `startViewTransition`.

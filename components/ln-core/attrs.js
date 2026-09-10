// ─── Typed Live Attribute Readers ──────────────────────────
//
// Scanner constraint: attribute names passed into these readers, and into a
// `defineAttrs` spec, must always be inline string literals or a `const`
// bound to a literal — never concatenated or templated.
// `scripts/sync-ln-schemas.mjs:22-23` is a raw regex over file text; a
// constructed name is invisible to it and the CI docs gate breaks silently
// (this already happened once — commit `3495690`).

export function attrStr(el, name, fallback) {
	const raw = el.getAttribute(name);
	return raw === null ? fallback : raw;
}

// `0` stays `0` — unlike the `parseInt(...) || 1000` idiom this replaces.
export function attrInt(el, name, fallback) {
	const parsed = parseInt(el.getAttribute(name), 10);
	return isNaN(parsed) ? fallback : parsed;
}

export function attrBool(el, name) {
	return el.hasAttribute(name);
}

// Allocates a new array per read — do not call inside a per-row loop.
export function attrList(el, name) {
	return (el.getAttribute(name) || '').split(',').map(s => s.trim()).filter(Boolean);
}

/**
 * Define live getter-only properties on `instance`, each reading `dom` on
 * every access. Nothing is copied into instance state, so there is no state
 * to invalidate and no sync step.
 *
 * @param {Object} instance
 * @param {Element} dom
 * @param {Object} spec - { propName: [reader, attributeName, fallback] }
 * @returns {Object} instance
 */
export function defineAttrs(instance, dom, spec) {
	for (const propName in spec) {
		const [reader, attributeName, fallback] = spec[propName];
		Object.defineProperty(instance, propName, {
			// Getter only, no setter — assignment throws in strict mode (ES
			// modules are strict). Deliberate: it forbids a drifting copy.
			get: function () {
				return reader(dom, attributeName, fallback);
			},
			enumerable: true,
			configurable: true
		});
	}
	return instance;
}

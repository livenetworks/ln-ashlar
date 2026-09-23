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

export function attrBool(el, name, fallback = false) {
	const raw = el.getAttribute(name);
	if (raw === null) return !!fallback;
	const val = raw.trim().toLowerCase();
	if (val === 'false' || val === '0') return false;
	return true;
}

// Allocates a new array per read — do not call inside a per-row loop.
export function attrList(el, name) {
	return (el.getAttribute(name) || '').split(',').map(s => s.trim()).filter(Boolean);
}

const _enumReaderCache = new Map();

/**
 * Cached reader factory for enum attributes.
 * @param {string[]} values - allowed values
 * @param {*} fallback - default value
 * @returns {function(Element, string): *}
 */
export function attrEnum(values, fallback) {
	const key = (values ? values.join('|') : '') + '::' + fallback;
	if (_enumReaderCache.has(key)) return _enumReaderCache.get(key);
	const valSet = new Set(values || []);
	const reader = function (el, name) {
		const raw = el.getAttribute(name);
		return (raw !== null && valSet.has(raw)) ? raw : fallback;
	};
	_enumReaderCache.set(key, reader);
	return reader;
}

export function attrFloat(el, name, fallback) {
	const parsed = parseFloat(el.getAttribute(name));
	return isNaN(parsed) ? fallback : parsed;
}

export function attrJson(el, name, fallback) {
	const raw = el.getAttribute(name);
	if (!raw) return fallback;
	try {
		return JSON.parse(raw);
	} catch (_) {
		return fallback;
	}
}

/**
 * Validates a DOM attribute value against its declared schema entry.
 * Logs a console.warn (with [componentTag] prefix) if the value is invalid.
 *
 * @param {Object} entry - { type, values, min, max, fallback, ... }
 * @param {string|null} value - raw DOM attribute value (null if absent)
 * @param {string} attrName - attribute name (e.g. 'data-ln-modal')
 * @param {string} componentTag - component tag (e.g. 'ln-modal')
 * @param {Element} [el] - optional DOM element carrying the attribute
 * @returns {boolean} true if valid, false if invalid
 */
export function validateAttrValue(entry, value, attrName, componentTag, el) {
	if (!entry || value === null) return true;
	const tag = componentTag || 'ln-component';
	const type = entry.type;

	// valueless / unconstrained types
	if (type === 'trigger' || type === 'marker' || type === 'string' || type === 'list' || !type) {
		return true;
	}

	// Bare attributes (presence-only in HTML) with a declared fallback resolve to fallback in readers
	if (value === '' && entry.fallback !== undefined) {
		return true;
	}

	const logWarn = (msg) => {
		if (el) console.warn(msg, el);
		else console.warn(msg);
	};

	if (type === 'boolean') {
		const lower = value.trim().toLowerCase();
		if (lower !== '' && lower !== 'true' && lower !== 'false' && lower !== '1' && lower !== '0') {
			logWarn(`[${tag}] Invalid value "${value}" for boolean attribute "${attrName}". Allowed: "true", "false", or presence-only.`);
			return false;
		}
		return true;
	}

	if (type === 'enum') {
		const allowed = entry.values || [];
		if (!allowed.includes(value)) {
			logWarn(`[${tag}] Invalid value "${value}" for attribute "${attrName}". Allowed: ${allowed.join(', ')}. Fallback: "${entry.fallback}".`);
			return false;
		}
		return true;
	}

	if (type === 'integer') {
		if (!/^-?\d+$/.test(value)) {
			logWarn(`[${tag}] Invalid integer "${value}" for attribute "${attrName}". Fallback: ${entry.fallback}.`);
			return false;
		}
		const num = parseInt(value, 10);
		if (entry.min !== undefined && num < entry.min) {
			logWarn(`[${tag}] Value ${num} for attribute "${attrName}" is less than min (${entry.min}).`);
			return false;
		}
		if (entry.max !== undefined && num > entry.max) {
			logWarn(`[${tag}] Value ${num} for attribute "${attrName}" is greater than max (${entry.max}).`);
			return false;
		}
		return true;
	}

	if (type === 'float') {
		if (isNaN(Number(value))) {
			logWarn(`[${tag}] Invalid float "${value}" for attribute "${attrName}". Fallback: ${entry.fallback}.`);
			return false;
		}
		return true;
	}

	if (type === 'json') {
		try {
			JSON.parse(value);
			return true;
		} catch (err) {
			logWarn(`[${tag}] Invalid JSON for attribute "${attrName}": ${err.message}. Fallback: ${entry.fallback}.`);
			return false;
		}
	}

	return true;
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

/**
 * One table per component is the single source of truth for its HOST
 * attributes. Derivations below read it; nothing else declares an
 * attribute name.
 *
 * Table entry shape:
 *   'data-ln-x': { prop, read, type, values, fallback, min, max, effect, description } — any subset
 *
 * The scanner constraint at the top of this file applies to table KEYS:
 * literal strings only. A computed key is invisible to
 * scripts/sync-ln-schemas.mjs.
 */
export function attrSpec(table) {
	const spec = {};
	for (const name in table) {
		const entry = table[name];
		if (!entry || !entry.prop) continue;
		let reader = entry.read;
		if (!reader && entry.type) {
			switch (entry.type) {
				case 'enum':
					reader = attrEnum(entry.values, entry.fallback);
					break;
				case 'integer':
					reader = attrInt;
					break;
				case 'float':
					reader = attrFloat;
					break;
				case 'boolean':
					reader = attrBool;
					break;
				case 'list':
					reader = attrList;
					break;
				case 'json':
					reader = attrJson;
					break;
				case 'string':
				default:
					reader = attrStr;
					break;
			}
		}
		if (!reader) reader = attrStr;
		spec[entry.prop] = [reader, name, entry.fallback];
	}
	return spec;
}

export function attrEffects(table) {
	const effects = {};
	for (const name in table) {
		const entry = table[name];
		if (!entry) continue;
		if (entry.effect) effects[name] = entry.effect;
	}
	// null, not {} — `_registerAttrEntry` tests `entry.onAttrChange || entry.effects`,
	// and an empty object is truthy. A table of pure getters would otherwise be
	// pushed into `registry.reactive` and iterated on every data-ln-* mutation
	// on the page while having nothing to run.
	return Object.keys(effects).length ? effects : null;
}

/**
 * The attribute names a registry entry should be indexed under, so the shared
 * observer can reach it by name instead of walking every reactive entry.
 *
 * Note this reads `entry.effects` — the DERIVED table produced by
 * `attrEffects` above — not the raw component table. An entry is indexed
 * under every name it declares, which for a component like `ln-list` means
 * the suffixed names (`data-ln-list-window`) and not only the selector.
 *
 * Internal to ln-core, and deliberately NOT re-exported from index.js: unlike
 * `attrSpec` / `attrEffects`, which take the attribute table a component author
 * writes, this takes a registry entry — a shape no author ever constructs.
 * Publishing it would make the entry shape semver-load-bearing for no caller.
 *
 * @param {Object} entry - a registry entry: { effects, onAttrChange, declared }
 * @returns {Set<string>|null} names to index under, or null for a wildcard —
 *   `onAttrChange` without `declared` asks for EVERY data-ln-* mutation and
 *   by definition cannot be keyed by name.
 */
export function reactiveNames(entry) {
	if (entry.onAttrChange && !entry.declared) return null;

	const names = new Set();
	if (entry.effects) for (const n in entry.effects) names.add(n);
	if (entry.onAttrChange && entry.declared) for (const n of entry.declared) names.add(n);
	return names;
}


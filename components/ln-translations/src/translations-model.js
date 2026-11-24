/**
 * Pure domain model and deterministic algorithms for ln-translations.
 * Zero DOM dependencies — safe for headless testing and pure functional execution.
 */

/**
 * Standard ISO 639-1 language code to ISO 3166-1 alpha-2 country flag overrides.
 * Non-overridden codes default to the language code itself.
 */
export const LANG_FLAG_OVERRIDES = {
	en: 'gb',
	sq: 'al',
	sr: 'rs',
	ja: 'jp',
	ko: 'kr',
	zh: 'cn',
	cs: 'cz',
	da: 'dk',
	el: 'gr',
	he: 'il',
	hi: 'in',
	uk: 'ua',
	vi: 'vn',
	sv: 'se',
	nb: 'no',
	nn: 'no',
	ca: 'es',
	eu: 'es',
	gl: 'es',
	fa: 'ir',
	ar: 'sa',
	ms: 'my',
	sl: 'si',
	et: 'ee',
	ka: 'ge',
	hy: 'am',
	be: 'by',
	bs: 'ba',
	hr: 'hr',
	ga: 'ie',
	cy: 'gb',
	sw: 'ke',
	bn: 'bd',
	ur: 'pk',
	ta: 'lk',
	te: 'in',
	ml: 'in',
	kn: 'in',
	mr: 'in',
	gu: 'in',
	pa: 'in',
	ne: 'np',
	km: 'kh',
	lo: 'la',
	my: 'mm',
	af: 'za',
	zu: 'za'
};

/**
 * Generates the deterministic input name for a translatable field.
 *
 * @param {string} field - Field identifier (e.g. 'title', 'scope')
 * @param {string} lang - Language code (e.g. 'en', 'sq')
 * @param {string} [prefix=''] - Optional nested prefix (e.g. 'items[1]', 'company')
 * @returns {string} - Generated nested name
 */
export function buildFieldName(field, lang, prefix = '') {
	if (!field || !lang) return '';
	if (prefix) {
		return `${prefix}[trans][${lang}][${field}]`;
	}
	return `trans[${lang}][${field}]`;
}

/**
 * Parses a structured field name back into its components.
 *
 * @param {string} name - Field name attribute
 * @returns {{ prefix: string, lang: string, field: string } | null}
 */
export function parseFieldName(name) {
	if (!name || typeof name !== 'string') return null;

	// Pattern 1: With prefix: prefix[trans][lang][field]
	const prefixMatch = name.match(/^(.*)\[trans\]\[([^\]]+)\]\[([^\]]+)\]$/);
	if (prefixMatch) {
		return {
			prefix: prefixMatch[1],
			lang: prefixMatch[2],
			field: prefixMatch[3]
		};
	}

	// Pattern 2: Without prefix: trans[lang][field]
	const simpleMatch = name.match(/^trans\[([^\]]+)\]\[([^\]]+)\]$/);
	if (simpleMatch) {
		return {
			prefix: '',
			lang: simpleMatch[1],
			field: simpleMatch[2]
		};
	}

	return null;
}

/**
 * Safely interpolates {lang} placeholder pattern with language display name.
 *
 * @param {string} pattern - Template pattern containing '{lang}'
 * @param {string} langName - Display name of language
 * @returns {string}
 */
export function formatPlaceholder(pattern, langName) {
	const template = pattern || '{lang} translation';
	return template.replaceAll('{lang}', langName || '');
}

/**
 * Safely interpolates {lang} remove-label pattern with language display name.
 *
 * @param {string} pattern - Template pattern containing '{lang}'
 * @param {string} langName - Display name of language
 * @returns {string}
 */
export function formatRemoveLabel(pattern, langName) {
	const template = pattern || 'Remove {lang}';
	return template.replaceAll('{lang}', langName || '');
}

/**
 * Safely parses locales JSON or returns fallback locales.
 *
 * @param {string|object|null} raw - Raw input JSON or object
 * @param {object} [fallback={}] - Fallback locales map (defaults to empty object)
 * @returns {Record<string, string>}
 */
export function parseLocales(raw, fallback = {}) {
	if (!raw) return { ...fallback };
	if (typeof raw === 'object' && raw !== null && !Array.isArray(raw)) {
		return { ...raw };
	}
	if (typeof raw === 'string') {
		try {
			const parsed = JSON.parse(raw);
			if (typeof parsed === 'object' && parsed !== null && !Array.isArray(parsed)) {
				return parsed;
			}
		} catch {
			// Malformed JSON falls back cleanly
		}
	}
	return { ...fallback };
}

/**
 * Resolves the display name for a language code.
 *
 * @param {string} lang - Language code (e.g. 'en', 'sq', 'mk')
 * @param {Record<string, string>} [locales={}] - Configured locales dictionary
 * @param {string} [userLocale=''] - Optional document or user locale
 * @returns {string} - Localized display name or uppercase code
 */
export function resolveLanguageName(lang, locales = {}, userLocale = '') {
	if (!lang) return '';
	if (locales && locales[lang]) {
		return locales[lang];
	}

	// Try browser Intl.DisplayNames if available
	if (typeof Intl !== 'undefined' && typeof Intl.DisplayNames === 'function') {
		try {
			const displayNames = new Intl.DisplayNames(userLocale ? [userLocale] : undefined, {
				type: 'language',
				fallback: 'none'
			});
			const resolved = displayNames.of(lang);
			if (resolved) return resolved;
		} catch {
			// Ignore unsupported locale / fallback
		}
	}

	return lang;
}

/**
 * Filters out active languages and default language from the full locales map.
 *
 * @param {Record<string, string>} locales - Full locales dictionary
 * @param {Set<string>|string[]} activeLanguages - Active language codes
 * @param {string} [defaultLang=''] - Primary default language code to exclude
 * @returns {Array<[string, string]>} Array of [langCode, displayName] pairs
 */
export function filterAvailableLocales(locales, activeLanguages, defaultLang = '') {
	if (!locales || typeof locales !== 'object') return [];
	const activeSet = activeLanguages instanceof Set ? activeLanguages : new Set(activeLanguages || []);
	const normalizedDefault = (defaultLang || '').toLowerCase().trim();

	const available = [];
	for (const [code, name] of Object.entries(locales)) {
		const normalizedCode = code.toLowerCase().trim();
		if (!activeSet.has(code) && !activeSet.has(normalizedCode) && (!normalizedDefault || normalizedCode !== normalizedDefault)) {
			available.push([code, name]);
		}
	}
	return available;
}

/**
 * Resolves a translation value for a field, honoring optional bracketed prefix paths
 * (e.g. `prefix = 'options[0]'`, `field = 'label'` -> `values.options[0].label`).
 *
 * @param {Record<string, any>} values - Per-language values object
 * @param {string} field - Field name from `data-ln-translatable`
 * @param {string} [prefix=''] - Optional prefix from `data-ln-translations-prefix`
 * @returns {string}
 */
export function resolveTranslationValue(values, field, prefix = '') {
	if (!values || typeof values !== 'object' || !field) return '';

	if (prefix) {
		// 1. Nested traversal: e.g. "options[0]" -> ["options", "0"], "company[profile]" -> ["company", "profile"]
		const segments = prefix.replace(/\]/g, '').split('[').filter(Boolean);
		let cur = values;
		for (let i = 0; i < segments.length; i++) {
			if (cur == null || typeof cur !== 'object') {
				cur = undefined;
				break;
			}
			cur = cur[segments[i]];
		}
		if (cur && typeof cur === 'object' && cur[field] !== undefined && cur[field] !== null) {
			return String(cur[field]);
		}

		// 2. Flat prefixed key fallback (e.g. "options[0][label]" or "options[0].label")
		const bracketKey = `${prefix}[${field}]`;
		if (values[bracketKey] !== undefined && values[bracketKey] !== null) {
			return String(values[bracketKey]);
		}
		const dotKey = `${prefix}.${field}`;
		if (values[dotKey] !== undefined && values[dotKey] !== null) {
			return String(values[dotKey]);
		}

		return '';
	}

	return (values[field] !== undefined && values[field] !== null) ? String(values[field]) : '';
}

/**
 * Resolves ISO 3166-1 alpha-2 country code for flag lookup.
 *
 * @param {string} lang - ISO 639-1 language code
 * @returns {string} - Country code for SVG flag
 */
export function getCountryForLanguage(lang) {
	if (!lang) return '';
	const clean = lang.toLowerCase().trim();
	return LANG_FLAG_OVERRIDES[clean] || clean;
}

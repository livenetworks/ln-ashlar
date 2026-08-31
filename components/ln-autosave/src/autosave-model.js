export const STORAGE_PREFIX = 'ln-autosave:';
export const DEFAULT_DEBOUNCE_MS = 1000;

/**
 * Builds a deterministic storage key for autosave persistence.
 * @param {string} pathname
 * @param {string} identifier
 * @returns {string|null}
 */
export function buildAutosaveKey(pathname, identifier) {
	if (!identifier) return null;
	const path = pathname || '';
	return STORAGE_PREFIX + path + ':' + identifier;
}

/**
 * Parses and sanitizes the debounce milliseconds attribute value for ln-autosave.
 *
 * Semantics:
 * - Returns `0` if the attribute is absent (null/undefined), signaling that input debouncing is disabled (no listener).
 * - Returns `fallbackMs` (default 1000) if the attribute is present as boolean/empty string `""` or contains an invalid value.
 * - Returns the parsed positive integer if a valid numeric string is provided.
 *
 * @param {unknown} rawValue Raw DOM attribute value (e.g. data-ln-autosave-debounce-input)
 * @param {number} [fallbackMs=1000] Fallback debounce duration in ms
 * @returns {number} Milliseconds to debounce, or 0 if disabled
 */
export function parseAutosaveDebounce(rawValue, fallbackMs = DEFAULT_DEBOUNCE_MS) {
	if (rawValue === null || rawValue === undefined) return 0;
	if (rawValue === '') return fallbackMs;
	const parsed = parseInt(String(rawValue), 10);
	if (isNaN(parsed) || parsed < 0) return fallbackMs;
	return parsed;
}

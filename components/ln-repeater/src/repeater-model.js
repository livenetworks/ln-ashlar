/**
 * Pure domain model and deterministic algorithms for ln-repeater.
 * Zero DOM dependencies — safe for headless testing and pure functional execution.
 */

/**
 * Checks whether a string contains a repeater index placeholder token.
 *
 * @param {string} value
 * @returns {boolean}
 */
export function hasIndexToken(value) {
	return typeof value === 'string' && (value.indexOf('{index}') !== -1 || value.indexOf('{index1}') !== -1);
}

/**
 * Replaces `{index}` (0-based) and `{index1}` (1-based) tokens in a string.
 *
 * @param {string} value
 * @param {number} index - Zero-based row index
 * @returns {string}
 */
export function applyIndexTokens(value, index) {
	if (typeof value !== 'string') return '';
	const idx = Math.max(0, Math.floor(Number(index) || 0));
	return value
		.replaceAll('{index1}', String(idx + 1))
		.replaceAll('{index}', String(idx));
}

/**
 * Normalizes min and max row bounds into safe integers.
 *
 * @param {number} min
 * @param {number} max
 * @returns {{ min: number, max: number }}
 */
export function normalizeBounds(min, max) {
	const safeMin = (typeof min === 'number' && Number.isFinite(min) && min >= 0) ? Math.floor(min) : 0;
	let safeMax = (typeof max === 'number' && Number.isFinite(max) && max >= 1) ? Math.floor(max) : Infinity;
	if (Number.isFinite(safeMax) && safeMax < safeMin) {
		safeMax = safeMin;
	}
	return { min: safeMin, max: safeMax };
}

/**
 * Returns whether another row can be added given current count and max bound.
 *
 * @param {number} count
 * @param {number} max
 * @returns {boolean}
 */
export function canAdd(count, max) {
	return count < max;
}

/**
 * Returns whether a row can be removed given current count and min bound.
 *
 * @param {number} count
 * @param {number} min
 * @returns {boolean}
 */
export function canRemove(count, min) {
	return count > min;
}

/**
 * Detects the next safe monotonic index from existing SSR attribute names.
 * Scans bracketed numeric segments (e.g. `options[2][label]` -> `2`).
 *
 * @param {string[]} existingNames
 * @param {number} [fallbackCount=0]
 * @returns {number}
 */
export function detectNextIndex(existingNames, fallbackCount = 0) {
	let maxFound = -1;
	if (Array.isArray(existingNames)) {
		const re = /\[(\d+)\]/g;
		for (let i = 0; i < existingNames.length; i++) {
			const str = existingNames[i];
			if (typeof str !== 'string') continue;
			re.lastIndex = 0;
			let match;
			while ((match = re.exec(str)) !== null) {
				const num = parseInt(match[1], 10);
				if (num > maxFound) maxFound = num;
			}
		}
	}
	const minFallback = Math.max(0, Math.floor(Number(fallbackCount) || 0));
	return maxFound >= 0 ? Math.max(maxFound + 1, minFallback) : minFallback;
}

/**
 * Parses an `ln-fill` payload for a repeater key (array or JSON array string).
 *
 * @param {*} raw
 * @returns {Array|null}
 */
export function parseItemsPayload(raw) {
	if (Array.isArray(raw)) return raw;
	if (typeof raw === 'string' && raw.trim() !== '') {
		try {
			const parsed = JSON.parse(raw);
			if (Array.isArray(parsed)) return parsed;
		} catch {
			return null;
		}
	}
	return null;
}

/**
 * Extracts the leaf field key from an input `name` attribute.
 * Examples:
 * - `options[0][label]` -> `'label'`
 * - `sacks[2][weight]`  -> `'weight'`
 * - `options[]`         -> `'options'`
 * - `options[0]`        -> `'options'`
 * - `weight`            -> `'weight'`
 *
 * @param {string} name
 * @returns {string}
 */
export function extractLeafFieldName(name) {
	if (typeof name !== 'string' || !name) return '';
	const bracketMatches = name.match(/\[([^\]]*)\]/g);
	if (!bracketMatches || bracketMatches.length === 0) return name;

	for (let i = bracketMatches.length - 1; i >= 0; i--) {
		const inner = bracketMatches[i].slice(1, -1);
		if (inner !== '' && !/^\d+$/.test(inner)) {
			return inner;
		}
	}

	// All bracket segments were empty (`[]`) or numeric (`[0]`) — use leading root name
	const idx = name.indexOf('[');
	return idx > 0 ? name.slice(0, idx) : name;
}

/**
 * Replaces the first bracketed numeric segment matching `[oldIndex]` with `[newIndex]`.
 * Used during sequential reindexing to keep dynamically cloned nested controls
 * (such as `options[1][trans][sq][label]`) aligned with their row index.
 *
 * @param {string} value
 * @param {number} oldIndex
 * @param {number} newIndex
 * @returns {string}
 */
export function replaceLeadingIndex(value, oldIndex, newIndex) {
	if (typeof value !== 'string' || oldIndex === newIndex) return value || '';
	const token = '[' + oldIndex + ']';
	const pos = value.indexOf(token);
	if (pos === -1) return value;
	return value.slice(0, pos) + '[' + newIndex + ']' + value.slice(pos + token.length);
}

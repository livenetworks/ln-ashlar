/**
 * Resolves the effective maximum value from parent/element attributes or fallback.
 * @param {unknown} elementMax
 * @param {unknown} [parentMax]
 * @param {number} [fallback=100]
 * @returns {number}
 */
export function resolveProgressMax(elementMax, parentMax, fallback = 100) {
	if (parentMax !== null && parentMax !== undefined && parentMax !== '') {
		const parsed = parseFloat(String(parentMax));
		if (!isNaN(parsed) && parsed > 0) return parsed;
	}

	if (elementMax !== null && elementMax !== undefined && elementMax !== '') {
		const parsed = parseFloat(String(elementMax));
		if (!isNaN(parsed) && parsed > 0) return parsed;
	}

	return fallback;
}

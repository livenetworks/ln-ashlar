/**
 * Detect the comparison type for a column/field from its current value set.
 * Type is locked ONCE per sort operation (not per pair) — comparing types
 * per-pair breaks comparator transitivity and produces wrong ordering.
 * All non-empty values must be finite numbers for 'number'; otherwise 'string'.
 * @param {Array<unknown>} values
 * @returns {'number' | 'string'}
 */
export function detectValueType(values) {
	let hasValue = false;
	for (let i = 0; i < values.length; i++) {
		const v = values[i];
		if (v === '' || v == null) continue;
		hasValue = true;
		if (!Number.isFinite(Number(v))) return 'string';
	}
	return hasValue ? 'number' : 'string';
}

/**
 * Compare two raw values given a pre-locked type (see detectValueType).
 * Pass an Intl.Collator instance for locale-aware string comparison —
 * built once by the caller outside the sort loop, never per pair.
 * @param {unknown} a
 * @param {unknown} b
 * @param {'number' | 'string'} type
 * @param {Intl.Collator|null} [collator]
 * @returns {number}
 */
export function compareValues(a, b, type, collator) {
	if (type === 'number') {
		const na = parseFloat(a);
		const nb = parseFloat(b);
		return (isNaN(na) ? 0 : na) - (isNaN(nb) ? 0 : nb);
	}
	const strA = a != null ? String(a) : '';
	const strB = b != null ? String(b) : '';
	if (collator) return collator.compare(strA, strB);
	return strA < strB ? -1 : strA > strB ? 1 : 0;
}

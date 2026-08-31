/**
 * Computes progress state, clamping, and percentage.
 * @param {unknown} rawValue
 * @param {unknown} [rawMax=100]
 * @param {number} [min=0]
 * @returns {{ value: number, min: number, max: number, clampedValue: number, percentage: number }}
 */
export function calculateProgress(rawValue, rawMax = 100, min = 0) {
	const val = parseFloat(String(rawValue)) || 0;
	const max = parseFloat(String(rawMax)) || 100;
	const minVal = parseFloat(String(min)) || 0;

	const clampedValue = Math.max(minVal, Math.min(val, max));

	const range = max - minVal;
	let percentage = 0;
	if (range > 0) {
		percentage = ((clampedValue - minVal) / range) * 100;
	}

	percentage = Math.max(0, Math.min(100, percentage));

	return {
		value: val,
		min: minVal,
		max: max,
		clampedValue,
		percentage
	};
}

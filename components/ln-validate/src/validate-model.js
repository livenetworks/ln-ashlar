export const ERROR_MAP = {
	required: 'valueMissing',
	typeMismatch: 'typeMismatch',
	tooShort: 'tooShort',
	tooLong: 'tooLong',
	patternMismatch: 'patternMismatch',
	rangeUnderflow: 'rangeUnderflow',
	rangeOverflow: 'rangeOverflow'
};

/**
 * Checks if a field is valid given its native validity state and custom errors count.
 * @param {{ valid?: boolean } | null | undefined} validityState
 * @param {number} [customErrorsCount=0]
 * @returns {boolean}
 */
export function isFieldValid(validityState, customErrorsCount = 0) {
	if (!validityState) return customErrorsCount === 0;
	return Boolean(validityState.valid && customErrorsCount === 0);
}

/**
 * Resolves all active error keys for a given validity state and custom errors set.
 * @param {Record<string, boolean>} validityState
 * @param {Set<string>|Array<string>} [customErrors]
 * @returns {string[]}
 */
export function resolveActiveErrorKeys(validityState, customErrors) {
	const active = [];

	if (validityState) {
		const keys = Object.keys(ERROR_MAP);
		for (let i = 0; i < keys.length; i++) {
			const errorKey = keys[i];
			const prop = ERROR_MAP[errorKey];
			if (validityState[prop]) {
				active.push(errorKey);
			}
		}
	}

	if (customErrors) {
		const customList = Array.from(customErrors);
		for (let i = 0; i < customList.length; i++) {
			if (customList[i] && active.indexOf(customList[i]) === -1) {
				active.push(customList[i]);
			}
		}
	}

	return active;
}

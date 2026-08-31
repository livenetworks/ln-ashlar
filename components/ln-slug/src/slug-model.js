/**
 * Generates a clean, URL-safe slug from arbitrary input text.
 * Performs diacritic stripping, non-alphanumeric replacement, and separator collapsing.
 * @param {unknown} value
 * @param {string} [separator='-']
 * @returns {string}
 */
export function generateSlug(value, separator = '-') {
	if (value === null || value === undefined) return '';

	const sep = separator || '-';
	const escapedSep = sep.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

	return String(value)
		.normalize('NFD') // Normalize accented characters (e.g. é -> e + ´)
		.replace(/[\u0300-\u036f]/g, '') // Remove diacritics
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, sep) // Replace non-alphanumeric with separator
		.replace(new RegExp(`${escapedSep}+`, 'g'), sep) // Collapse multiple separators
		.replace(new RegExp(`^${escapedSep}+|${escapedSep}+$`, 'g'), ''); // Trim leading/trailing separators
}

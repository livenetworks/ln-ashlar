/**
 * Parses accept string into normalized array of lowercase extensions and mime types.
 * @param {string|null|undefined} acceptStr
 * @returns {string[]|null}
 */
export function parseAcceptExtensions(acceptStr) {
	if (!acceptStr) return null;
	const parts = String(acceptStr)
		.split(',')
		.map(s => s.trim().toLowerCase())
		.filter(Boolean)
		.map(s => (s.startsWith('.') ? s.slice(1) : s));
	return parts.length ? parts : null;
}

/**
 * Extracts file extension from filename.
 * @param {string|null|undefined} filename
 * @returns {string}
 */
export function getFileExtension(filename) {
	if (!filename || typeof filename !== 'string' || !filename.includes('.')) return '';
	return filename.split('.').pop().toLowerCase();
}

/**
 * Evaluates whether a file matches allowed extensions or mime types.
 * @param {{ name?: string, type?: string }} file
 * @param {string[]|null} allowedExts
 * @returns {boolean}
 */
export function isFileTypeAllowed(file, allowedExts) {
	if (!allowedExts || allowedExts.length === 0) return true;
	if (!file) return false;

	const ext = getFileExtension(file.name);
	const mime = String(file.type || '').toLowerCase();

	return allowedExts.some(allowed => {
		if (allowed.includes('/')) {
			if (allowed.endsWith('/*')) {
				const prefix = allowed.slice(0, -1);
				return mime.startsWith(prefix);
			}
			return mime === allowed;
		}
		return ext === allowed;
	});
}

/**
 * Formats byte size into human-readable unit with locale formatting.
 * @param {number} bytes
 * @param {string} [locale='en']
 * @param {Record<string, string>} [dict={}]
 * @returns {string}
 */
export function formatFileSize(bytes, locale = 'en', dict = {}) {
	if (typeof bytes !== 'number' || isNaN(bytes) || bytes === 0) {
		return '0 ' + (dict['unit-b'] || 'B');
	}
	const k = 1024;
	const sizes = [
		dict['unit-b'] || 'B',
		dict['unit-kb'] || 'KB',
		dict['unit-mb'] || 'MB',
		dict['unit-gb'] || 'GB'
	];
	const i = Math.floor(Math.log(bytes) / Math.log(k));
	const unitIndex = Math.min(i, sizes.length - 1);
	const num = bytes / Math.pow(k, unitIndex);
	const formattedNum = new Intl.NumberFormat(locale, {
		maximumFractionDigits: 1,
		minimumFractionDigits: 0
	}).format(num);

	return formattedNum + ' ' + sizes[unitIndex];
}

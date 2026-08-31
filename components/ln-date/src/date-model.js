export const KEYWORD_RE = /^(short|medium|long)(\s+datetime)?$/;

export const KEYWORD_OPTIONS = {
	'short':          { dateStyle: 'short' },
	'medium':         { dateStyle: 'medium' },
	'long':           { dateStyle: 'long' },
	'short datetime':  { dateStyle: 'short', timeStyle: 'short' },
	'medium datetime': { dateStyle: 'medium', timeStyle: 'short' },
	'long datetime':   { dateStyle: 'long', timeStyle: 'short' }
};

/**
 * Returns Intl.DateTimeFormat options if format is a recognized keyword, or null for custom patterns.
 * @param {string} format
 * @returns {Intl.DateTimeFormatOptions|null}
 */
export function getIntlDateOptions(format) {
	if (!format || format === '') return { dateStyle: 'medium' };
	const match = String(format).trim().match(KEYWORD_RE);
	if (match) {
		return KEYWORD_OPTIONS[format.trim()];
	}
	return null;
}

/**
 * Parses user typed date strings (e.g. DD.MM.YYYY, MM/DD/YYYY, YYYY-MM-DD) into a valid Date object.
 * @param {string} str
 * @returns {Date|null}
 */
export function parseTypedDate(str) {
	if (!str || typeof str !== 'string') return null;
	const trimmed = str.trim();
	if (trimmed.length < 6) return null;

	let sep, parts;
	if (trimmed.indexOf('.') !== -1) {
		sep = '.';
		parts = trimmed.split('.');
	} else if (trimmed.indexOf('/') !== -1) {
		sep = '/';
		parts = trimmed.split('/');
	} else if (trimmed.indexOf('-') !== -1) {
		sep = '-';
		parts = trimmed.split('-');
	} else {
		return null;
	}

	if (parts.length !== 3) return null;
	const nums = [];
	for (let i = 0; i < 3; i++) {
		const n = parseInt(parts[i], 10);
		if (isNaN(n)) return null;
		nums.push(n);
	}

	let day, month, year;
	if (sep === '.') {
		day = nums[0];
		month = nums[1];
		year = nums[2];
	} else if (sep === '/') {
		month = nums[0];
		day = nums[1];
		year = nums[2];
	} else {
		if (parts[0].length === 4) {
			year = nums[0];
			month = nums[1];
			day = nums[2];
		} else {
			day = nums[0];
			month = nums[1];
			year = nums[2];
		}
	}

	if (year < 100) {
		year += (year < 50) ? 2000 : 1900;
	}

	const date = new Date(year, month - 1, day);
	if (date.getFullYear() !== year || date.getMonth() !== month - 1 || date.getDate() !== day) {
		return null;
	}
	return date;
}

/**
 * Formats a Date object using a custom pattern with token replacements.
 * @param {Date} date
 * @param {string} pattern Pattern with tokens (yyyy, yy, MMMM, MMM, MM, M, dd, d, HH, mm)
 * @param {string} [locale]
 * @param {object} [fallback] Custom locale fallback dictionary
 * @returns {string}
 */
export function formatCustomDate(date, pattern, locale, fallback) {
	if (!date || !(date instanceof Date) || isNaN(date.getTime())) return '';
	if (!pattern || typeof pattern !== 'string') return '';

	const day = date.getDate();
	const month = date.getMonth();
	const year = date.getFullYear();
	const hours = date.getHours();
	const minutes = date.getMinutes();

	let mmmmVal, mmmVal;
	const langPrefix = (locale || '').toLowerCase().split('-')[0];

	let isFallbackNeeded = false;
	try {
		const fmt = new Intl.DateTimeFormat(locale, { month: 'long' });
		const resolvedLocale = fmt.resolvedOptions().locale.toLowerCase().split('-')[0];
		isFallbackNeeded = Boolean(fallback && resolvedLocale !== langPrefix);
	} catch (e) {
		isFallbackNeeded = Boolean(fallback);
	}

	if (isFallbackNeeded && fallback && fallback.monthsLong) {
		mmmmVal = fallback.monthsLong[month];
	} else {
		try {
			mmmmVal = new Intl.DateTimeFormat(locale, { month: 'long' }).format(date);
		} catch (e) {
			mmmmVal = String(month + 1);
		}
	}

	if (isFallbackNeeded && fallback && fallback.monthsShort) {
		mmmVal = fallback.monthsShort[month];
	} else {
		try {
			mmmVal = new Intl.DateTimeFormat(locale, { month: 'short' }).format(date);
		} catch (e) {
			mmmVal = String(month + 1);
		}
	}

	const tokens = {
		'yyyy': String(year),
		'yy':   String(year).slice(-2),
		'MMMM': mmmmVal,
		'MMM':  mmmVal,
		'MM':   String(month + 1).padStart(2, '0'),
		'M':    String(month + 1),
		'dd':   String(day).padStart(2, '0'),
		'd':    String(day),
		'HH':   String(hours).padStart(2, '0'),
		'mm':   String(minutes).padStart(2, '0')
	};

	return pattern.replace(/yyyy|yy|MMMM|MMM|MM|M|dd|d|HH|mm/g, function (m) {
		return tokens[m] !== undefined ? tokens[m] : m;
	});
}

/**
 * Formats a date value using either standard Intl options or a custom pattern.
 * @param {Date} date
 * @param {string} [format='medium']
 * @param {string} [locale]
 * @param {object} [fallback]
 * @returns {string}
 */
export function formatDateValue(date, format, locale, fallback) {
	if (!date || !(date instanceof Date) || isNaN(date.getTime())) return '';

	const intlOptions = getIntlDateOptions(format);
	if (intlOptions) {
		try {
			const formatter = new Intl.DateTimeFormat(locale, intlOptions);
			const langPrefix = (locale || '').toLowerCase().split('-')[0];
			const resolvedLocale = formatter.resolvedOptions().locale.toLowerCase().split('-')[0];

			if (fallback && resolvedLocale !== langPrefix) {
				return formatCustomDate(date, 'dd.MM.yyyy', locale, fallback);
			}
			return formatter.format(date);
		} catch (e) {
			return formatCustomDate(date, 'dd.MM.yyyy', locale, fallback);
		}
	}

	return formatCustomDate(date, format || 'dd.MM.yyyy', locale, fallback);
}

/**
 * Parses raw input (Unix seconds, milliseconds, or ISO string) into a Date object.
 * @param {unknown} raw
 * @returns {Date|null}
 */
export function parseDateInput(raw) {
	if (raw === null || raw === undefined || raw === '') return null;

	if (raw instanceof Date) {
		return isNaN(raw.getTime()) ? null : raw;
	}

	const num = Number(raw);
	if (!isNaN(num) && num > 0) {
		// If timestamp is in seconds (< 10^11), convert to ms
		const ms = num < 1e11 ? num * 1000 : num;
		const d = new Date(ms);
		return isNaN(d.getTime()) ? null : d;
	}

	if (typeof raw === 'string') {
		const d = new Date(raw);
		return isNaN(d.getTime()) ? null : d;
	}

	return null;
}

/**
 * Calculates relative time difference and optimal unit.
 * @param {Date} date Target date
 * @param {Date|number} [now=Date.now()] Reference date
 * @returns {{ value: number, unit: Intl.RelativeTimeFormatUnit, isOlderThanMonth: boolean }}
 */
export function calculateRelativeTime(date, now = Date.now()) {
	if (!date) {
		return { value: 0, unit: 'second', isOlderThanMonth: false };
	}

	const nowMs = typeof now === 'number' ? now : now.getTime();
	const thenMs = date.getTime();
	const diffSec = Math.floor((thenMs - nowMs) / 1000);
	const absSec = Math.abs(diffSec);

	if (absSec < 10) {
		return { value: 0, unit: 'second', isOlderThanMonth: false };
	}

	if (absSec < 60) {
		return { value: diffSec, unit: 'second', isOlderThanMonth: false };
	}
	if (absSec < 3600) {
		return { value: Math.round(diffSec / 60), unit: 'minute', isOlderThanMonth: false };
	}
	if (absSec < 86400) {
		return { value: Math.round(diffSec / 3600), unit: 'hour', isOlderThanMonth: false };
	}
	if (absSec < 604800) {
		return { value: Math.round(diffSec / 86400), unit: 'day', isOlderThanMonth: false };
	}
	if (absSec < 2592000) {
		return { value: Math.round(diffSec / 604800), unit: 'week', isOlderThanMonth: false };
	}

	return { value: Math.round(diffSec / 2592000), unit: 'month', isOlderThanMonth: true };
}

/**
 * Resolves standard Intl.DateTimeFormat options for various modes.
 * @param {'full' | 'short' | 'date' | 'time' | string} mode
 * @param {Date} date
 * @param {Date} [now=new Date()]
 * @returns {Intl.DateTimeFormatOptions}
 */
export function resolveDateFormatOptions(mode, date, now = new Date()) {
	switch (mode) {
		case 'full':
			return { dateStyle: 'long', timeStyle: 'short' };
		case 'date':
			return { dateStyle: 'medium' };
		case 'time':
			return { timeStyle: 'short' };
		case 'short':
		default: {
			const options = { month: 'short', day: 'numeric' };
			if (date && date.getFullYear() !== now.getFullYear()) {
				options.year = 'numeric';
			}
			return options;
		}
	}
}

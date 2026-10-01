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
		const str = raw.trim();
		if (!str) return null;
		// Date-only ISO parses as UTC midnight, which reads back as the previous day west of UTC.
		const ymd = /^(\d{4})-(\d{2})-(\d{2})$/.exec(str);
		if (ymd) {
			const year = +ymd[1], month = +ymd[2], day = +ymd[3];
			const local = new Date(year, month - 1, day);
			if (local.getFullYear() !== year || local.getMonth() !== month - 1 || local.getDate() !== day) return null;
			return local;
		}
		const d = new Date(str);
		return isNaN(d.getTime()) ? null : d;
	}

	return null;
}

/**
 * Formats a Date object to an ISO date string (YYYY-MM-DD).
 * @param {Date} date
 * @returns {string}
 */
export function formatDateToISO(date) {
	if (!date || !(date instanceof Date) || isNaN(date.getTime())) return '';
	const y = date.getFullYear();
	const m = String(date.getMonth() + 1).padStart(2, '0');
	const d = String(date.getDate()).padStart(2, '0');
	return y + '-' + m + '-' + d;
}

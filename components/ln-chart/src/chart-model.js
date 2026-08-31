function finiteNumber(value) {
	if (value === null || value === undefined || value === '') return null;
	const number = Number(value);
	return Number.isFinite(number) ? number : null;
}

function coordinate(value) {
	return String(Math.round(value * 1000) / 1000);
}

function clampPadding(padding, width, height) {
	const parsed = finiteNumber(padding);
	if (parsed === null || parsed < 0) return 0;
	return Math.min(parsed, Math.min(width, height) / 2);
}

/**
 * Parses SVG viewBox string into coordinates and dimensions.
 * @param {string} value
 * @returns {{ x: number, y: number, width: number, height: number }|null}
 */
export function parseChartViewBox(value) {
	if (typeof value !== 'string') return null;
	const parts = value.trim().split(/[\s,]+/).map(Number);
	if (parts.length !== 4 || parts.some(part => !Number.isFinite(part))) return null;
	if (parts[2] <= 0 || parts[3] <= 0) return null;
	return { x: parts[0], y: parts[1], width: parts[2], height: parts[3] };
}

/**
 * Parses chart sort string (e.g. "field:desc" or "field:asc").
 * @param {string} raw
 * @returns {{ field: string, direction: 'asc' | 'desc' }|null}
 */
export function parseChartSort(raw) {
	if (!raw || typeof raw !== 'string') return null;
	const parts = raw.split(':');
	const field = parts[0].trim();
	if (!field) return null;
	return {
		field,
		direction: parts[1] && parts[1].trim().toLowerCase() === 'desc' ? 'desc' : 'asc'
	};
}

/**
 * Builds points, geometries, and domain metadata for chart rendering.
 * @param {Array<object>} records
 * @param {object} options
 * @returns {object}
 */
export function buildChartModel(records, options) {
	options = options || {};
	const viewBox = options.viewBox || { x: 0, y: 0, width: 1000, height: 320 };
	const xField = options.xField || 'label';
	const yField = options.yField || 'value';
	const includeZero = options.includeZero !== false;
	const padding = clampPadding(options.padding, viewBox.width, viewBox.height);
	const source = Array.isArray(records) ? records : [];

	const values = [];
	for (let index = 0; index < source.length; index++) {
		const record = source[index] || {};
		const value = finiteNumber(record[yField]);
		if (value === null) continue;
		values.push({
			record,
			sourceIndex: index,
			label: record[xField] == null ? String(index + 1) : String(record[xField]),
			value
		});
	}

	if (values.length === 0) {
		return {
			points: [],
			linePoints: '',
			areaPoints: '',
			count: 0,
			min: null,
			max: null,
			domainMin: 0,
			domainMax: 1,
			baselineY: viewBox.y + viewBox.height - padding
		};
	}

	let min = values[0].value;
	let max = values[0].value;
	for (let i = 1; i < values.length; i++) {
		if (values[i].value < min) min = values[i].value;
		if (values[i].value > max) max = values[i].value;
	}

	let domainMin = min;
	let domainMax = max;
	if (includeZero) {
		domainMin = Math.min(0, domainMin);
		domainMax = Math.max(0, domainMax);
	}
	if (domainMin === domainMax) {
		if (domainMax === 0) {
			domainMax = 1;
		} else if (domainMax > 0) {
			domainMin = 0;
		} else {
			domainMax = 0;
		}
	}

	const usableWidth = Math.max(1, viewBox.width - padding * 2);
	const usableHeight = Math.max(1, viewBox.height - padding * 2);
	const valueRange = domainMax - domainMin;
	const baselineY = viewBox.y + viewBox.height - padding - ((0 - domainMin) / valueRange) * usableHeight;

	const points = [];
	for (let i = 0; i < values.length; i++) {
		const item = values[i];
		const progress = values.length === 1 ? 0.5 : i / (values.length - 1);
		const x = viewBox.x + padding + progress * usableWidth;
		const y = viewBox.y + viewBox.height - padding - ((item.value - domainMin) / valueRange) * usableHeight;
		points.push({
			record: item.record,
			sourceIndex: item.sourceIndex,
			label: item.label,
			value: item.value,
			x,
			y,
			pointString: coordinate(x) + ',' + coordinate(y)
		});
	}

	const linePoints = points.map(point => point.pointString).join(' ');
	let areaPoints = '';
	if (points.length > 0) {
		const first = points[0];
		const last = points[points.length - 1];
		const startBaseline = coordinate(first.x) + ',' + coordinate(baselineY);
		const endBaseline = coordinate(last.x) + ',' + coordinate(baselineY);
		areaPoints = startBaseline + ' ' + linePoints + ' ' + endBaseline;
	}

	return {
		points,
		linePoints,
		areaPoints,
		count: points.length,
		min,
		max,
		domainMin,
		domainMax,
		baselineY
	};
}

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

export function parseChartViewBox(value) {
	if (typeof value !== 'string') return null;
	const parts = value.trim().split(/[\s,]+/).map(Number);
	if (parts.length !== 4 || parts.some(part => !Number.isFinite(part))) return null;
	if (parts[2] <= 0 || parts[3] <= 0) return null;
	return { x: parts[0], y: parts[1], width: parts[2], height: parts[3] };
}

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

	const rawValues = values.map(item => item.value);
	const min = Math.min(...rawValues);
	const max = Math.max(...rawValues);
	let domainMin = includeZero ? Math.min(0, min) : min;
	let domainMax = includeZero ? Math.max(0, max) : max;

	if (domainMin === domainMax) {
		if (domainMin === 0) {
			domainMax = 1;
		} else {
			const delta = Math.max(Math.abs(domainMin) * 0.1, 1);
			domainMin -= delta;
			domainMax += delta;
		}
	}

	const left = viewBox.x + padding;
	const top = viewBox.y + padding;
	const plotWidth = Math.max(0, viewBox.width - padding * 2);
	const plotHeight = Math.max(0, viewBox.height - padding * 2);
	const xStep = values.length > 1 ? plotWidth / (values.length - 1) : 0;
	const range = domainMax - domainMin;
	const scaleY = value => top + ((domainMax - value) / range) * plotHeight;

	const points = values.map((item, index) => ({
		...item,
		x: values.length === 1 ? left + plotWidth / 2 : left + index * xStep,
		y: scaleY(item.value)
	}));

	const baselineValue = domainMin <= 0 && domainMax >= 0 ? 0 : domainMin;
	const baselineY = scaleY(baselineValue);
	const linePoints = points.map(point => coordinate(point.x) + ',' + coordinate(point.y)).join(' ');
	const areaPoints = [
		coordinate(points[0].x) + ',' + coordinate(baselineY),
		linePoints,
		coordinate(points[points.length - 1].x) + ',' + coordinate(baselineY)
	].join(' ');

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

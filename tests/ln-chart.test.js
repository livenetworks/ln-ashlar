import test from 'node:test';
import assert from 'node:assert/strict';

import {
	buildChartModel,
	parseChartSort,
	parseChartViewBox
} from '../components/ln-chart/src/chart-model.js';

const viewBox = { x: 0, y: 0, width: 100, height: 100 };

test('chart model maps an ordered dataset into line and area geometry', () => {
	const model = buildChartModel([
		{ month: 'Jan', revenue: 10 },
		{ month: 'Feb', revenue: 20 }
	], {
		xField: 'month',
		yField: 'revenue',
		viewBox,
		padding: 10
	});

	assert.equal(model.linePoints, '10,50 90,10');
	assert.equal(model.areaPoints, '10,90 10,50 90,10 90,90');
	assert.deepEqual(model.points.map(point => point.label), ['Jan', 'Feb']);
	assert.equal(model.min, 10);
	assert.equal(model.max, 20);
});

test('chart model uses the zero line as area baseline for mixed values', () => {
	const model = buildChartModel([
		{ label: 'Loss', value: -10 },
		{ label: 'Gain', value: 10 }
	], { viewBox, padding: 10 });

	assert.equal(model.baselineY, 50);
	assert.equal(model.areaPoints, '10,50 10,90 90,10 90,50');
});

test('chart model ignores non-numeric values and centers a single point', () => {
	const model = buildChartModel([
		{ month: 'Jan', revenue: 'not-a-number' },
		{ month: 'Feb', revenue: '5' }
	], {
		xField: 'month',
		yField: 'revenue',
		viewBox,
		padding: 10
	});

	assert.equal(model.count, 1);
	assert.equal(model.linePoints, '50,10');
	assert.equal(model.points[0].label, 'Feb');
});

test('chart model can use the observed value range without forcing zero', () => {
	const model = buildChartModel([
		{ label: 'A', value: 10 },
		{ label: 'B', value: 20 }
	], {
		viewBox,
		padding: 10,
		includeZero: false
	});

	assert.equal(model.domainMin, 10);
	assert.equal(model.domainMax, 20);
	assert.equal(model.linePoints, '10,90 90,10');
});

test('chart viewBox parser accepts SVG syntax and rejects invalid dimensions', () => {
	assert.deepEqual(parseChartViewBox('0 0 1000 320'), { x: 0, y: 0, width: 1000, height: 320 });
	assert.deepEqual(parseChartViewBox('10, 20, 300, 150'), { x: 10, y: 20, width: 300, height: 150 });
	assert.equal(parseChartViewBox('0 0 0 320'), null);
});

test('parseChartSort parses sort strings correctly', () => {
	assert.deepEqual(parseChartSort('revenue:desc'), { field: 'revenue', direction: 'desc' });
	assert.deepEqual(parseChartSort('date:asc'), { field: 'date', direction: 'asc' });
	assert.deepEqual(parseChartSort('date'), { field: 'date', direction: 'asc' });
	assert.equal(parseChartSort(null), null);
	assert.equal(parseChartSort(''), null);
});

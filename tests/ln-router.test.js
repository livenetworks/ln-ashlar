import test from 'node:test';
import assert from 'node:assert/strict';

import { planRegions } from '../components/ln-router/src/router-model.js';

function makeMatch(templateNode) {
	return { route: { templateNode }, params: {} };
}

test('planRegions: only an auxiliary region matches', () => {
	const tpl = {};
	const el = {};
	const descriptors = [
		{ regionKey: '__primary__', match: null, targetEl: {}, hasKeep: false, hasHydrate: false, hasChildren: false, mountedTemplate: null },
		{ regionKey: 'side', match: makeMatch(tpl), targetEl: el, hasKeep: false, hasHydrate: false, hasChildren: false, mountedTemplate: null }
	];
	const plan = planRegions(descriptors, { hasPrimaryRegion: false });
	assert.equal(plan.notFound, false);
	assert.equal(plan.swaps.length, 1);
	assert.equal(plan.swaps[0].regionKey, 'side');
});

test('planRegions: primary missing match when primary region exists → notFound', () => {
	const descriptors = [
		{ regionKey: '__primary__', match: null, targetEl: {}, hasKeep: false, hasHydrate: false, hasChildren: false, mountedTemplate: null },
		{ regionKey: 'side', match: makeMatch({}), targetEl: {}, hasKeep: false, hasHydrate: false, hasChildren: false, mountedTemplate: null }
	];
	const plan = planRegions(descriptors, { hasPrimaryRegion: true, primaryMatch: null });
	assert.equal(plan.notFound, true);
});

test('planRegions: unmatched region without keep clears', () => {
	const el = {};
	const descriptors = [
		{ regionKey: 'side', match: makeMatch({}), targetEl: {}, hasKeep: false, hasHydrate: false, hasChildren: false, mountedTemplate: null },
		{ regionKey: 'aux', match: null, targetEl: el, hasKeep: false, hasHydrate: false, hasChildren: true, mountedTemplate: null }
	];
	const plan = planRegions(descriptors);
	assert.equal(plan.clears.length, 1);
	assert.equal(plan.clears[0].targetEl, el);
});

test('planRegions: unmatched region with keep does not clear', () => {
	const el = {};
	const descriptors = [
		{ regionKey: 'side', match: makeMatch({}), targetEl: {}, hasKeep: false, hasHydrate: false, hasChildren: false, mountedTemplate: null },
		{ regionKey: 'aux', match: null, targetEl: el, hasKeep: true, hasHydrate: false, hasChildren: true, mountedTemplate: null }
	];
	const plan = planRegions(descriptors);
	assert.deepEqual(plan.clears, []);
});

test('planRegions: keep region with same template already mounted → neither swap nor clear', () => {
	const tpl = {};
	const el = {};
	const descriptors = [
		{ regionKey: 'side', match: makeMatch(tpl), targetEl: el, hasKeep: true, hasHydrate: false, hasChildren: true, mountedTemplate: tpl }
	];
	const plan = planRegions(descriptors);
	assert.deepEqual(plan.swaps, []);
	assert.deepEqual(plan.clears, []);
});

test('planRegions: primary region with keep and same template already mounted → kept', () => {
	const tpl = {};
	const el = {};
	const descriptors = [
		{ regionKey: '__primary__', match: makeMatch(tpl), targetEl: el, hasKeep: true, hasHydrate: false, hasChildren: true, mountedTemplate: tpl },
		{ regionKey: 'side', match: makeMatch({}), targetEl: {}, hasKeep: false, hasHydrate: false, hasChildren: false, mountedTemplate: null }
	];
	const plan = planRegions(descriptors, { hasPrimaryRegion: true, primaryMatch: descriptors[0].match });
	assert.equal(plan.swaps.length, 1);
	assert.equal(plan.swaps[0].regionKey, 'side');
	assert.equal(plan.owner.regionKey, 'side');
});

test('planRegions: primary region always sorted first in swaps', () => {
	const descriptors = [
		{ regionKey: 'side', match: makeMatch({}), targetEl: {}, hasKeep: false, hasHydrate: false, hasChildren: false, mountedTemplate: null },
		{ regionKey: '__primary__', match: makeMatch({}), targetEl: {}, hasKeep: false, hasHydrate: false, hasChildren: false, mountedTemplate: null }
	];
	const plan = planRegions(descriptors, { hasPrimaryRegion: true, primaryMatch: descriptors[1].match });
	assert.equal(plan.swaps[0].regionKey, '__primary__');
	assert.equal(plan.swaps[1].regionKey, 'side');
	assert.equal(plan.owner.regionKey, '__primary__');
});

test('planRegions: auxiliary region with isPending is included in swaps', () => {
	const descriptors = [
		{ regionKey: '__primary__', match: makeMatch({}), targetEl: {}, hasKeep: false, hasHydrate: false, hasChildren: false, mountedTemplate: null },
		{ regionKey: 'side', match: makeMatch({}), targetEl: null, isPending: true, hasKeep: false, hasHydrate: false, hasChildren: false, mountedTemplate: null }
	];
	const plan = planRegions(descriptors, { hasPrimaryRegion: true, primaryMatch: descriptors[0].match });
	assert.equal(plan.swaps.length, 2);
	assert.equal(plan.swaps[0].regionKey, '__primary__');
	assert.equal(plan.swaps[1].regionKey, 'side');
});

test('planRegions: descriptor without targetEl and not pending is excluded from swaps and clears', () => {
	const descriptors = [
		{ regionKey: 'side', match: makeMatch({}), targetEl: null, isPending: false, hasKeep: false, hasHydrate: false, hasChildren: false, mountedTemplate: null },
		{ regionKey: 'aux', match: null, targetEl: null, isPending: false, hasKeep: false, hasHydrate: false, hasChildren: true, mountedTemplate: null }
	];
	const plan = planRegions(descriptors);
	assert.deepEqual(plan.swaps, []);
	assert.deepEqual(plan.clears, []);
});

test('planRegions: hydration + hasHydrate + hasChildren skips mount without clearing', () => {
	const el = {};
	const descriptors = [
		{ regionKey: '__primary__', match: makeMatch({}), targetEl: el, hasKeep: false, hasHydrate: true, hasChildren: true, mountedTemplate: null }
	];
	const plan = planRegions(descriptors, { isHydration: true });
	assert.deepEqual(plan.clears, []);
	assert.equal(plan.swaps.length, 1);
	assert.equal(plan.swaps[0].skipMount, true);
});

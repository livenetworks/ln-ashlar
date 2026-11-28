import { run, assert, BASE_URL } from './_harness.mjs';

const PAGE_URL = BASE_URL + 'repeater.html';
const same = (a, b) => JSON.stringify(a) === JSON.stringify(b);

run('demo/admin/repeater.html', async ({ page }) => {
	const failures = [];

	async function check(title, fn) {
		console.log(`\n--- ${title} ---`);
		try {
			await fn();
		} catch (err) {
			failures.push(`${title}: ${err.message}`);
		}
	}

	async function load() {
		await page.goto(PAGE_URL, { waitUntil: 'load' });
		await page.waitForFunction(() => {
			const repeaters = document.querySelectorAll('[data-ln-repeater]');
			return repeaters.length >= 4 && Array.from(repeaters).every(r => r.lnRepeater);
		}, { timeout: 10000 });
	}

	await load();

	await check('Example 1: min=1 auto-seed, max=5 disable sync, add & remove', async () => {
		const init = await page.evaluate(() => {
			const root = document.querySelector('#repeater-basic-form [data-ln-repeater]');
			const addBtn = root.querySelector('[data-ln-repeater-add]');
			const remBtns = root.querySelectorAll('[data-ln-repeater-remove]');
			return {
				count: root.lnRepeater.count,
				addDisabled: addBtn.disabled,
				remDisabled: remBtns[0]?.disabled
			};
		});
		assert(init.count === 1, 'auto-seeds min=1 row on init');
		assert(init.addDisabled === false, 'add trigger enabled below max');
		assert(init.remDisabled === true, 'remove trigger disabled at min=1');

		const atMax = await page.evaluate(() => {
			const root = document.querySelector('#repeater-basic-form [data-ln-repeater]');
			const addBtn = root.querySelector('[data-ln-repeater-add]');
			for (let i = 0; i < 4; i++) addBtn.click();
			return {
				count: root.lnRepeater.count,
				addDisabled: addBtn.disabled,
				ariaDisabled: addBtn.getAttribute('aria-disabled')
			};
		});
		assert(atMax.count === 5, 'reaches max=5 rows');
		assert(atMax.addDisabled === true && atMax.ariaDisabled === 'true', 'add trigger disabled with aria-disabled at max');

		const afterRem = await page.evaluate(() => {
			const root = document.querySelector('#repeater-basic-form [data-ln-repeater]');
			root.querySelector('[data-ln-repeater-remove]').click();
			return {
				count: root.lnRepeater.count,
				addDisabled: root.querySelector('[data-ln-repeater-add]').disabled
			};
		});
		assert(afterRem.count === 4 && afterRem.addDisabled === false, 'removing row re-enables add trigger');
	});

	await check('Example 2: ln-repeater + ln-translations dynamic row composition', async () => {
		await load();
		const state = await page.evaluate(() => {
			const form = document.getElementById('repeater-trans-form');
			const root = form.querySelector('[data-ln-repeater]');
			form.lnTranslations.addLanguage('en');
			const beforeAdd = root.querySelectorAll('[data-ln-translatable-lang="en"]').length;
			root.querySelector('[data-ln-repeater-add]').click();
			const afterAdd = root.querySelectorAll('[data-ln-translatable-lang="en"]').length;
			const secondNames = Array.from(root.lnRepeater.items[1].querySelectorAll('input')).map(i => i.name);
			return { beforeAdd, afterAdd, secondNames };
		});
		assert(state.beforeAdd === 1, 'initial row receives en input on addLanguage');
		assert(state.afterAdd === 2, 'newly added repeater row auto-receives active en input');
		assert(same(state.secondNames, ['options[1][label]', 'options[1][trans][en][label]']),
			`nested repeater + translation names match (got ${JSON.stringify(state.secondNames)})`);
	});

	await check('Example 3: external add-for trigger & sequential reindex on remove/reorder', async () => {
		await load();
		const names = await page.evaluate(() => {
			const extBtn = document.querySelector('[data-ln-repeater-add-for="sacks-repeater"]');
			const root = document.getElementById('sacks-repeater');
			extBtn.click();
			extBtn.click();
			// Remove middle row (index 1) -> remaining rows must reindex to 0, 1
			root.lnRepeater.items[1].querySelector('[data-ln-repeater-remove]').click();
			const afterRemove = Array.from(root.querySelectorAll('select[name]')).map(s => s.name);
			// Simulate ln-sortable reorder by moving first row to end and dispatching reordered
			const list = root.querySelector('[data-ln-repeater-list]');
			list.appendChild(list.firstElementChild);
			list.dispatchEvent(new CustomEvent('ln-sortable:reordered', { bubbles: true }));
			const afterSort = Array.from(root.querySelectorAll('select[name]')).map(s => s.name);
			return { afterRemove, afterSort };
		});
		assert(same(names.afterRemove, ['sacks[0][type]', 'sacks[1][type]']), 'remove reindexes sequentially');
		assert(same(names.afterSort, ['sacks[0][type]', 'sacks[1][type]']), 'ln-sortable:reordered reindexes sequentially');
	});

	await check('Example 4: ln-fill Edit hydration & Create reset', async () => {
		await load();
		const edit = await page.evaluate(() => {
			document.querySelector('[data-ln-fill-id="10"]').click();
			const form = document.getElementById('repeater-modal-form');
			const root = form.querySelector('[data-ln-repeater="options"]');
			return {
				count: root.lnRepeater.count,
				activeLangs: Array.from(form.lnTranslations.getActiveLanguages()).sort(),
				mkVals: Array.from(root.querySelectorAll('input[data-ln-translatable-lang="mk"]')).map(i => i.value),
				enVals: Array.from(root.querySelectorAll('input[data-ln-translatable-lang="en"]')).map(i => i.value)
			};
		});
		assert(edit.count === 3, 'Edit fill hydrates 3 option rows');
		assert(same(edit.activeLangs, ['de', 'en']), 'Edit fill activates de & en');
		assert(same(edit.mkVals, ['Линукс', 'Виндоус', 'macOS']), 'base option values hydrated');
		assert(same(edit.enVals, ['Linux', 'Windows', 'macOS']), 'translated option values hydrated');

		const reset = await page.evaluate(() => {
			document.querySelector('[data-ln-fill-form="repeater-modal-form"]:not([data-ln-fill-id])').click();
			const form = document.getElementById('repeater-modal-form');
			const root = form.querySelector('[data-ln-repeater="options"]');
			return {
				count: root.lnRepeater.count,
				activeLangs: Array.from(form.lnTranslations.getActiveLanguages()),
				firstVal: root.querySelector('input')?.value
			};
		});
		assert(reset.count === 1 && reset.activeLangs.length === 0 && reset.firstVal === '',
			'New fill resets repeater to 1 empty row and clears extra languages');
	});

	await check('Checkbox string coercion ("false"/"0") & destroy preserving authored disabled state', async () => {
		await page.evaluate(() => {
			document.getElementById('repeater-fx')?.remove();
			document.body.insertAdjacentHTML('beforeend', `
				<div id="repeater-fx" data-ln-repeater="items" data-ln-repeater-min="1" data-ln-repeater-max="2">
					<ul data-ln-repeater-list>
						<li data-ln-repeater-item>
							<input type="checkbox" name="items[0][active]" value="1">
							<button type="button" data-ln-repeater-remove disabled aria-disabled="true">Remove</button>
						</li>
					</ul>
					<button type="button" data-ln-repeater-add disabled aria-disabled="true">Add</button>
					<template data-ln-template="items">
						<li data-ln-repeater-item>
							<input type="checkbox" name="items[{index}][active]" value="1">
							<button type="button" data-ln-repeater-remove>Remove</button>
						</li>
					</template>
				</div>
			`);
		});
		await page.waitForFunction(() => !!document.getElementById('repeater-fx')?.lnRepeater, { timeout: 5000 });
		const res = await page.evaluate(() => {
			const fx = document.getElementById('repeater-fx');
			window.lnCore.lnFill(fx, {
				items: [{ active: 'false' }, { active: '0' }]
			});
			const checkedBeforeDestroy = Array.from(fx.querySelectorAll('input[type="checkbox"]')).map(c => c.checked);
			const addBtn = fx.querySelector('[data-ln-repeater-add]');
			const firstRem = fx.querySelector('[data-ln-repeater-remove]');
			fx.lnRepeater.destroy();
			const out = {
				checkedBeforeDestroy,
				addDisabled: addBtn.disabled,
				addAria: addBtn.getAttribute('aria-disabled'),
				firstRemDisabled: firstRem.disabled,
				firstRemAria: firstRem.getAttribute('aria-disabled'),
				hasInstance: !!fx.lnRepeater
			};
			fx.remove();
			return out;
		});
		assert(same(res.checkedBeforeDestroy, [false, false]), 'string "false" and "0" coerce to unchecked checkboxes');
		assert(res.addDisabled === true && res.addAria === 'true', 'authored disabled/aria-disabled preserved on add trigger after destroy');
		assert(res.firstRemDisabled === true && res.firstRemAria === 'true', 'authored disabled/aria-disabled preserved on remove trigger after destroy');
		assert(res.hasInstance === false, 'instance deleted on destroy');
	});

	if (failures.length) {
		console.error('\nFailed sections:');
		failures.forEach(f => console.error('  - ' + f));
		throw new Error(`${failures.length} section(s) failed`);
	}
});

import { run, assert, BASE_URL } from './_harness.mjs';

// Smoke test. The stepper is CSS-only: no JS component binds [data-ln-stepper]
// (only ln-debug's generated attribute list mentions it). Every fact below is read from
// demo/admin/src/pages/stepper.html and theme/config/mixins/_stepper.scss.

const PAGE_URL = BASE_URL + 'stepper.html';

// Demo order = page order. Labels and states come straight from the markup.
const STEPPERS = [
	{
		name: '4-step, current: Approval',
		labels: ['Draft', 'In Review', 'Approval', 'Published'],
		states: ['complete', 'complete', 'current', 'upcoming']
	},
	{
		name: '4-step, current: Draft',
		labels: ['Draft', 'In Review', 'Approval', 'Published'],
		states: ['current', 'upcoming', 'upcoming', 'upcoming']
	},
	{
		name: '6-step, current: Connect Data',
		labels: ['Create Account', 'Verify Email', 'Set Password', 'Connect Data', 'Invite Team', 'Go Live'],
		states: ['complete', 'complete', 'complete', 'current', 'upcoming', 'upcoming']
	},
	{
		name: '6-step, all complete',
		labels: ['Create Account', 'Verify Email', 'Set Password', 'Connect Data', 'Invite Team', 'Go Live'],
		states: ['complete', 'complete', 'complete', 'complete', 'complete', 'complete']
	}
];

const same = (a, b) => a.length === b.length && a.every((v, i) => v === b[i]);

run('demo/admin/stepper.html', async ({ page }) => {

	function section(title) {
		console.log(`\n--- ${title} ---`);
	}

	await page.goto(PAGE_URL, { waitUntil: 'load' });
	await page.waitForFunction(n => document.querySelectorAll('ol[data-ln-stepper]').length === n,
		{ timeout: 10000 }, STEPPERS.length);

	// Reads, per stepper, per step: markup attributes + computed pseudo-element styles.
	const data = await page.evaluate(() => Array.from(document.querySelectorAll('ol[data-ln-stepper]')).map(ol => ({
		display: getComputedStyle(ol).display,
		counterReset: getComputedStyle(ol).counterReset,
		steps: Array.from(ol.children).map(li => {
			const before = getComputedStyle(li, '::before');
			const after = getComputedStyle(li, '::after');
			const label = li.querySelector(':scope > [data-ln-step-label]');
			return {
				tag: li.tagName,
				state: li.getAttribute('data-ln-step'),
				ariaCurrent: li.getAttribute('aria-current'),
				label: label ? label.textContent.trim() : null,
				beforeContent: before.content,
				counterIncrement: getComputedStyle(li).counterIncrement,
				beforeBg: before.backgroundColor,
				beforeShadow: before.boxShadow,
				afterContent: after.content,
				afterBg: after.backgroundColor,
				labelWeight: label ? getComputedStyle(label).fontWeight : null,
				labelColor: label ? getComputedStyle(label).color : null
			};
		})
	})));

	section('Structure');
	assert(data.length === STEPPERS.length, `Page has ${STEPPERS.length} steppers`);

	STEPPERS.forEach((exp, i) => {
		const s = data[i];
		section(`Stepper ${i + 1}: ${exp.name}`);
		assert(s.steps.length === exp.labels.length, `Has ${exp.labels.length} steps`);
		assert(s.steps.every(st => st.tag === 'LI'), 'Every step is an <li>');
		assert(same(s.steps.map(st => st.label), exp.labels), `Labels: ${exp.labels.join(' | ')}`);
		assert(same(s.steps.map(st => st.state), exp.states), `States: ${exp.states.join(',')}`);
		const currentCount = exp.states.filter(v => v === 'current').length;
		assert(s.steps.filter(st => st.ariaCurrent === 'step').length === currentCount,
			`aria-current="step" count is ${currentCount}`);
		assert(s.steps.every(st => (st.ariaCurrent === 'step') === (st.state === 'current')),
			'aria-current="step" is set exactly on the current step');

		// [source] _stepper.scss: display:flex + counter-reset: ln-step
		assert(s.display === 'flex', '[source] stepper track is display:flex');
		assert(s.counterReset.includes('ln-step'), '[source] stepper track resets counter ln-step');

		// [source] ::before { content: counter(ln-step) } with counter-increment per li.
		// Chrome reports the unresolved counter() expression, so the rendered digit itself is not readable.
		assert(s.steps.every(st => st.beforeContent === 'counter(ln-step)'),
			'[source] every bullet content is counter(ln-step)');
		assert(s.steps.every(st => st.counterIncrement.startsWith('ln-step')),
			'[source] every step increments counter ln-step (auto-numbering 1..' + exp.labels.length + ')');

		// [source] connector ::after exists on every step except the last
		assert(s.steps.every((st, k) => (k < s.steps.length - 1) === (st.afterContent !== 'none')),
			'[source] connector line on every step except the last');
	});

	section('State styling (relative comparisons from the mixin)');
	// complete + current share the accent bullet; upcoming uses the border-colored bullet.
	// Upcoming bg is taken from a stepper-1 upcoming step as the reference.
	const upcomingStep = data[0].steps[3];
	const completeStep = data[0].steps[0];
	const currentStep = data[0].steps[2];

	assert(completeStep.beforeBg !== upcomingStep.beforeBg, '[source] complete bullet differs from upcoming bullet');
	assert(currentStep.beforeBg === completeStep.beforeBg, '[source] current bullet shares the complete (accent) bullet color');
	assert(currentStep.beforeShadow !== 'none', '[source] current bullet has a focus ring (box-shadow)');
	assert(completeStep.beforeShadow === 'none' && upcomingStep.beforeShadow === 'none',
		'[source] complete and upcoming bullets have no ring');

	const allSteps = data.flatMap(s => s.steps);
	assert(allSteps.filter(st => st.state === 'upcoming').every(st => st.beforeBg === upcomingStep.beforeBg),
		'[source] every upcoming bullet uses the same muted bullet color');
	assert(allSteps.filter(st => st.state !== 'upcoming').every(st => st.beforeBg === completeStep.beforeBg),
		'[source] every complete/current bullet uses the accent color');

	// Connector: complete step's line is accent, upcoming step's line is border color (stepper 2, step 2 is upcoming w/ connector).
	const upcomingConnector = data[1].steps[1];
	const completeConnector = data[0].steps[0];
	assert(completeConnector.afterBg === completeStep.beforeBg, '[source] complete step connector is accent colored');
	assert(upcomingConnector.afterBg === upcomingStep.beforeBg, '[source] upcoming step connector is border colored');

	// Label: current is semibold; complete/current labels use full fg, upcoming muted.
	assert(Number(currentStep.labelWeight) > Number(upcomingStep.labelWeight), '[source] current label is bolder than upcoming');
	assert(Number(completeStep.labelWeight) === Number(upcomingStep.labelWeight), '[source] complete label keeps the base weight');
	assert(currentStep.labelColor === completeStep.labelColor, '[source] current and complete labels share the full-fg color');
	assert(upcomingStep.labelColor !== completeStep.labelColor, '[source] upcoming label is muted');
});

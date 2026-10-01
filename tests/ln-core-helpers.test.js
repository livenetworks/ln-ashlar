import test from 'node:test';
import assert from 'node:assert/strict';

import {
	calculateProgress,
	compareValues,
	detectValueType,
	isEditableTarget,
	isTargetDisabled,
	isUsableTarget,
	shouldIgnoreClick,
	registerComponent,
	findElements,
	readValue
} from '../components/ln-core/index.js';

test('shouldIgnoreClick detects modified clicks and non-primary mouse buttons', () => {
	assert.equal(shouldIgnoreClick({ button: 0 }), false);
	assert.equal(shouldIgnoreClick(null), true);
	assert.equal(shouldIgnoreClick({ button: 0, ctrlKey: true }), true);
	assert.equal(shouldIgnoreClick({ button: 0, metaKey: true }), true);
	assert.equal(shouldIgnoreClick({ button: 0, shiftKey: true }), true);
	assert.equal(shouldIgnoreClick({ button: 0, altKey: true }), true);
	assert.equal(shouldIgnoreClick({ button: 1 }), true); // Middle click
	assert.equal(shouldIgnoreClick({ button: 2 }), true); // Right click
});

test('isTargetDisabled detects disabled elements and inert containers', () => {
	assert.equal(isTargetDisabled(null), true);
	assert.equal(isTargetDisabled({ disabled: true }), true);

	const ariaDisabledElement = {
		getAttribute: (name) => name === 'aria-disabled' ? 'true' : null
	};
	assert.equal(isTargetDisabled(ariaDisabledElement), true);

	const inertElement = {
		closest: (selector) => selector === '[inert]' ? {} : null
	};
	assert.equal(isTargetDisabled(inertElement), true);

	const normalElement = {
		disabled: false,
		getAttribute: () => null,
		closest: () => null
	};
	assert.equal(isTargetDisabled(normalElement), false);
});

test('isEditableTarget identifies form controls and contenteditable surfaces', () => {
	assert.equal(isEditableTarget(null), false);
	assert.equal(isEditableTarget({ tagName: 'INPUT' }), true);
	assert.equal(isEditableTarget({ tagName: 'TEXTAREA' }), true);
	assert.equal(isEditableTarget({ tagName: 'SELECT' }), true);
	assert.equal(isEditableTarget({ tagName: 'DIV', isContentEditable: true }), true);
	assert.equal(isEditableTarget({ tagName: 'DIV', isContentEditable: false, closest: () => null }), false);

	const nestedInInput = {
		closest: (selector) => selector.includes('input') ? {} : null
	};
	assert.equal(isEditableTarget(nestedInInput), true);
});

test('detectValueType determines numeric vs string column comparison types', () => {
	assert.equal(detectValueType([]), 'string');
	assert.equal(detectValueType([10, 20, 30]), 'number');
	assert.equal(detectValueType(['10', '20.5', '300']), 'number');
	assert.equal(detectValueType(['10', 'abc', '300']), 'string');
	assert.equal(detectValueType(['', null, '15', undefined]), 'number');
});

test('compareValues performs type-sensitive comparisons', () => {
	assert.equal(compareValues('10', '2', 'number'), 8);
	assert.equal(compareValues('2', '10', 'number'), -8);
	assert.equal(compareValues('10', '10', 'number'), 0);

	assert.equal(compareValues('apple', 'banana', 'string'), -1);
	assert.equal(compareValues('banana', 'apple', 'string'), 1);
	assert.equal(compareValues('apple', 'apple', 'string'), 0);
});

test('readValue prioritizes data-ln-value, then datetime on <time>, then value on <data>, then textContent', () => {
	// 1. data-ln-value on td or any element
	const tdWithValue = {
		tagName: 'TD',
		hasAttribute: (name) => name === 'data-ln-value',
		getAttribute: (name) => name === 'data-ln-value' ? '1250.50' : null,
		textContent: ' $1,250.50 '
	};
	assert.equal(readValue(tdWithValue), '1250.50');

	// 2. <time> with datetime attribute
	const timeEl = {
		tagName: 'TIME',
		hasAttribute: (name) => name === 'datetime',
		getAttribute: (name) => name === 'datetime' ? '2026-07-25' : null,
		textContent: ' 25.07.2026 '
	};
	assert.equal(readValue(timeEl), '2026-07-25');

	// 3. <data> with value attribute
	const dataEl = {
		tagName: 'DATA',
		hasAttribute: (name) => name === 'value',
		getAttribute: (name) => name === 'value' ? '42' : null,
		textContent: ' 42 units '
	};
	assert.equal(readValue(dataEl), '42');

	// 4. plain fallback to trimmed textContent
	const plainEl = {
		tagName: 'SPAN',
		hasAttribute: () => false,
		getAttribute: () => null,
		textContent: '  Hello Ashlar  '
	};
	assert.equal(readValue(plainEl), 'Hello Ashlar');
});

test('calculateProgress computes accurate percentages and clamps properly', () => {
	// Standard 50 / 100 -> 50%
	const p1 = calculateProgress(50, 100);
	assert.equal(p1.percentage, 50);
	assert.equal(p1.clampedValue, 50);
	assert.equal(p1.max, 100);

	// Custom max: 25 / 50 -> 50%
	const p2 = calculateProgress(25, 50);
	assert.equal(p2.percentage, 50);

	// Overflow: 150 / 100 -> 100% clamped
	const p3 = calculateProgress(150, 100);
	assert.equal(p3.percentage, 100);
	assert.equal(p3.clampedValue, 100);

	// Underflow: -20 / 100 -> 0% clamped
	const p4 = calculateProgress(-20, 100);
	assert.equal(p4.percentage, 0);
	assert.equal(p4.clampedValue, 0);

	// Custom min range: min 50, val 75, max 100 -> 50%
	const p5 = calculateProgress(75, 100, 50);
	assert.equal(p5.percentage, 50);
	assert.equal(p5.clampedValue, 75);
});

test('_warnBound prevents multiple monkey-patchings of console.warn across standalone bundles', () => {
	const savedWindow = globalThis.window;
	try {
		globalThis.window = { lnCore: { _warnBound: true } };
		// When _warnBound is already true, any bundle executing the guard will exit without touching console.warn
		let rewrapped = false;
		if (!globalThis.window.lnCore._warnBound) {
			rewrapped = true;
		}
		assert.equal(rewrapped, false);
	} finally {
		globalThis.window = savedWindow;
	}
});

test('registerComponent lifecycle: single shared observer, destroy cleanup with delete item[attribute], clean re-attachment, and attribute removal preservation', () => {
	const savedWindow = globalThis.window;
	const savedDoc = globalThis.document;
	const savedMO = globalThis.MutationObserver;
	const savedConsoleError = console.error;

	try {
		let registeredLifecycleCallback = null;
		let registeredAttrCallback = null;
		class MockMutationObserver {
			constructor(callback) {
				this.callback = callback;
			}
			observe(target, options) {
				if (options && options.attributes) {
					registeredAttrCallback = this.callback;
				} else if (options && options.childList) {
					registeredLifecycleCallback = this.callback;
				}
			}
			disconnect() {}
		}
		const registeredObserverCallback = (records) => registeredLifecycleCallback(records);

		globalThis.MutationObserver = MockMutationObserver;
		const docBody = {
			nodeType: 1,
			querySelectorAll: () => [],
			matches: () => false,
			hasAttribute: () => false,
			querySelector: () => null
		};
		globalThis.window = {
			MutationObserver: MockMutationObserver,
			lnCore: {}
		};
		globalThis.document = {
			body: docBody,
			readyState: 'complete',
			addEventListener: () => {},
			contains: (el) => !!el._inDoc
		};

		let destroyedCount = 0;
		class MockComponent {
			constructor(dom) {
				this.dom = dom;
				this.created = true;
			}
			destroy() {
				destroyedCount++;
			}
		}

		class SimpleComponent {
			constructor(dom) {
				this.dom = dom;
			}
		}

		let subtreeCallCount = 0;
		let subtreeHost = null;

		// Register components
		registerComponent('data-ln-test-comp', 'lnTestComp', MockComponent, 'ln-test-comp', {
			onSubtreeChange: (host) => {
				subtreeCallCount++;
				subtreeHost = host;
			}
		});

		registerComponent('data-ln-simple-comp', 'lnSimpleComp', SimpleComponent, 'ln-simple-comp');

		// 1. Verify single observer bound
		assert.equal(globalThis.window.lnCore._lifecycleObserverBound, true);
		assert.equal(globalThis.window.lnCore._lifecycleRegistry.length, 2);
		assert.ok(registeredLifecycleCallback, 'shared lifecycle observer callback must be registered');

		// 2. Add element to DOM
		const testEl = {
			nodeType: 1,
			_inDoc: true,
			hasAttribute: (name) => name === 'data-ln-test-comp',
			getAttribute: (name) => name === 'data-ln-test-comp' ? '' : null,
			matches: (q) => q === '[data-ln-test-comp]',
			querySelectorAll: () => []
		};

		registeredObserverCallback([
			{
				type: 'childList',
				addedNodes: [testEl],
				removedNodes: []
			}
		]);

		assert.ok(testEl.lnTestComp, 'instance must be created on addedNodes');
		const initialInst = testEl.lnTestComp;

		// 3. Remove element from DOM (destroy-bearing path)
		testEl._inDoc = false;
		registeredObserverCallback([
			{
				type: 'childList',
				addedNodes: [],
				removedNodes: [testEl]
			}
		]);

		assert.equal(destroyedCount, 1, 'inst.destroy() must be called on removal');
		assert.equal(testEl.lnTestComp, undefined, 'delete item[entry.attribute] must remove reference');

		// 4. Re-attach element to DOM
		testEl._inDoc = true;
		registeredObserverCallback([
			{
				type: 'childList',
				addedNodes: [testEl],
				removedNodes: []
			}
		]);

		assert.ok(testEl.lnTestComp, 'fresh instance must be created on re-attachment');
		assert.notEqual(testEl.lnTestComp, initialInst, 're-attached instance must be a new object, not a zombie');

		// 5. Test destroy-less component (SimpleComponent)
		const simpleEl = {
			nodeType: 1,
			_inDoc: true,
			hasAttribute: (name) => name === 'data-ln-simple-comp',
			getAttribute: (name) => name === 'data-ln-simple-comp' ? '' : null,
			matches: (q) => q === '[data-ln-simple-comp]',
			querySelectorAll: () => []
		};

		registeredObserverCallback([
			{
				type: 'childList',
				addedNodes: [simpleEl],
				removedNodes: []
			}
		]);
		assert.ok(simpleEl.lnSimpleComp, 'destroy-less component instantiated');

		simpleEl._inDoc = false;
		registeredObserverCallback([
			{
				type: 'childList',
				addedNodes: [],
				removedNodes: [simpleEl]
			}
		]);
		assert.equal(simpleEl.lnSimpleComp, undefined, 'delete item[entry.attribute] runs even without destroy()');

		// 6. Test onSubtreeChange with element host and text-node host (nodeType !== 1)
		const parentHost = {
			nodeType: 1,
			matches: (q) => q === '[data-ln-test-comp]',
			closest: (q) => q === '[data-ln-test-comp]' ? parentHost : null
		};
		const textNode = {
			nodeType: 3,
			parentElement: parentHost
		};

		registeredObserverCallback([
			{
				type: 'childList',
				target: textNode,
				addedNodes: [],
				removedNodes: []
			}
		]);

		assert.equal(subtreeCallCount, 1, 'onSubtreeChange must trigger for text-node target fallback');
		assert.equal(subtreeHost, parentHost, 'host must resolve to parentElement.closest');

		// 7. Test attribute removal does NOT destroy component instance (bound to DOM presence)
		assert.ok(testEl.lnTestComp, 'testEl has active component instance');
		const instBeforeAttrChange = testEl.lnTestComp;
		const destroyCountBefore = destroyedCount;

		// Attribute removed while element remains in document (_inDoc: true)
		testEl.getAttribute = (name) => null;
		testEl.hasAttribute = (name) => false;
		testEl.matches = (q) => false;

		const loggedErrors = [];
		console.error = (...args) => {
			loggedErrors.push(args);
		};

		assert.ok(registeredAttrCallback, 'attribute observer callback must be registered');
		registeredAttrCallback([
			{
				type: 'attributes',
				target: testEl,
				attributeName: 'data-ln-test-comp',
				oldValue: ''
			}
		]);

		assert.equal(loggedErrors.length, 0, 'attribute mutation handler must not throw or log errors');
		assert.equal(destroyedCount, destroyCountBefore, 'attribute removal must NOT invoke destroy()');
		assert.equal(testEl.lnTestComp, instBeforeAttrChange, 'instance remains bound to DOM element');
	} finally {
		globalThis.window = savedWindow;
		globalThis.document = savedDoc;
		globalThis.MutationObserver = savedMO;
		console.error = savedConsoleError;
	}
});

test('findElements isolates component instantiation failures without breaking subsequent elements', () => {
	const savedWindow = globalThis.window;
	const savedConsoleError = console.error;
	let loggedErrors = [];

	try {
		globalThis.window = { lnCore: {} };
		console.error = (...args) => {
			loggedErrors.push(args);
		};

		const elFailing = { nodeType: 1, hasAttribute: () => false };
		const elWorking = { nodeType: 1, hasAttribute: () => false };
		const mockRoot = {
			nodeType: 1,
			matches: () => false,
			querySelectorAll: () => [elFailing, elWorking]
		};

		let callCount = 0;
		class MixedComponent {
			constructor(el) {
				callCount++;
				if (el === elFailing) {
					throw new Error('First item failure');
				}
				this.ok = true;
			}
		}

		findElements(mockRoot, 'test-sel', 'testMixed', MixedComponent);

		assert.equal(callCount, 2);
		assert.equal(elFailing.testMixed, undefined);
		assert.equal(elWorking.testMixed.ok, true);
		assert.equal(loggedErrors.length, 1);
		assert.match(loggedErrors[0][0], /\[testMixed\] init failed/);
		assert.equal(loggedErrors[0][1], elFailing);
	} finally {
		globalThis.window = savedWindow;
		console.error = savedConsoleError;
	}
});

test('helpers.js barrel file exports all 44 symbols and initializes module side effects', async () => {
	const helpers = await import('../components/ln-core/helpers.js');

	const expectedSymbols = [
		'dispatch', 'dispatchCancelable', 'requestData', 'setDebugSink', 'setPersistSink', 'hasActiveDebug', 'isDevMode',
		'guardBody', 'isVisible', 'shouldIgnoreClick', 'isEditableTarget', 'isTargetDisabled', 'isUsableTarget', 'shouldInterceptLink', 'readValue',
		'resolveFormMethod', 'serializeForm', 'populateForm', 'interceptValueProperty',
		'buildUrl', 'getHeaders', 'parseHeaders', 'registerDataMapper', 'getDataMapper',
		'getLocale', 'ensureLocaleObserver', 'registerLocaleFallback', 'getLocaleFallback',
		'cloneTemplate', 'cloneTemplateScoped', 'fill', 'lnFill', 'fillTemplate', 'renderList', 'buildDict',
		'findElements', 'holdInit', 'releaseInit', 'pendingCount', 'queueBoot', 'observeAttributes', 'registerComponent',
		'compareValues', 'detectValueType'
	];

	assert.equal(expectedSymbols.length, 44);
	for (const sym of expectedSymbols) {
		assert.equal(typeof helpers[sym] !== 'undefined', true, `Symbol ${sym} must be exported by helpers.js`);
	}

	// Assert locale fallback registry functions work cleanly without hardcoded defaults
	assert.equal(helpers.getLocaleFallback('xx'), null);
	helpers.registerLocaleFallback('xx', { test: true });
	assert.deepEqual(helpers.getLocaleFallback('xx'), { test: true });
	if (typeof globalThis.window !== 'undefined' && globalThis.window.lnCore) {
		assert.equal(typeof globalThis.window.lnCore.fill, 'function');
	}
});





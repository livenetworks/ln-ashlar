import { attrEffects, reactiveNames, validateAttrValue } from './attrs.js';
import { hasActiveDebug, isDevMode } from './events.js';
import { guardBody } from './dom.js';

// ─── Find Elements ─────────────────────────────────────────

export function findElements(root, selector, attribute, ComponentClass) {
	if (root.nodeType !== 1) return;

	// Support both simple attribute names and full CSS selectors
	const isComplex = selector.indexOf('[') !== -1 || selector.indexOf('.') !== -1 || selector.indexOf('#') !== -1;
	const query = isComplex ? selector : '[' + selector + ']';

	const items = Array.from(root.querySelectorAll(query));
	if (root.matches && root.matches(query)) {
		items.push(root);
	}
	for (const el of items) {
		if (!el[attribute]) {
			if (window.lnCore._persistSink && el.hasAttribute('data-ln-persist')) {
				window.lnCore._persistSink(el, selector);
			}
			try {
				el[attribute] = new ComponentClass(el);
			} catch (err) {
				console.error('[' + attribute + '] init failed', el, err);
			}
		}
	}
}

// ─── Loader Gate State & Primitives ──────────────────────
if (typeof window !== 'undefined') {
	window.lnCore = window.lnCore || {};
	window.lnCore._bootHolds = window.lnCore._bootHolds || 0;
	window.lnCore._bootQueue = window.lnCore._bootQueue || [];
}

export function holdInit() {
	if (typeof window !== 'undefined') {
		window.lnCore = window.lnCore || {};
		window.lnCore._bootHolds = (window.lnCore._bootHolds || 0) + 1;
	}
}

export function releaseInit() {
	if (typeof window !== 'undefined') {
		window.lnCore = window.lnCore || {};
		window.lnCore._bootHolds = Math.max(0, (window.lnCore._bootHolds || 0) - 1);
		if (window.lnCore._bootHolds === 0 && window.lnCore._bootQueue) {
			const queue = window.lnCore._bootQueue;
			window.lnCore._bootQueue = [];
			for (let i = 0; i < queue.length; i++) {
				queue[i]();
			}
		}
	}
}

export function pendingCount() {
	return (typeof window !== 'undefined' && window.lnCore) ? (window.lnCore._bootHolds || 0) : 0;
}

export function queueBoot(fn) {
	if (typeof window !== 'undefined') {
		window.lnCore = window.lnCore || {};
		window.lnCore._bootHolds = window.lnCore._bootHolds || 0;
		window.lnCore._bootQueue = window.lnCore._bootQueue || [];

		if (window.lnCore._bootHolds > 0) {
			window.lnCore._bootQueue.push(fn);
		} else {
			setTimeout(fn, 0);
		}
	} else {
		fn();
	}
}

// ─── Shared Attribute Observer ─────────────────────────────

function _attrRegistry() {
	window.lnCore = window.lnCore || {};
	const registry = window.lnCore._attrRegistry = window.lnCore._attrRegistry
		|| { byAttr: new Map(), reactive: [], persist: [] };

	registry.byReactive = registry.byReactive || new Map();
	registry.reactiveWildcard = registry.reactiveWildcard || [];
	return registry;
}

function _registerAttrEntry(entry) {
	const registry = _attrRegistry();
	const observed = entry.observed || [];
	for (let i = 0; i < observed.length; i++) {
		const name = observed[i];
		if (!registry.byAttr.has(name)) registry.byAttr.set(name, []);
		registry.byAttr.get(name).push(entry);
	}
	registry.byDeclaredAttr = registry.byDeclaredAttr || new Map();
	if (entry.attributes) {
		for (const attrName in entry.attributes) {
			if (!registry.byDeclaredAttr.has(attrName)) registry.byDeclaredAttr.set(attrName, []);
			const list = registry.byDeclaredAttr.get(attrName);
			if (!list.some(item => item.componentTag === entry.componentTag)) {
				list.push({
					spec: entry.attributes[attrName],
					componentTag: entry.componentTag
				});
			}
		}
	}
	if (entry.onAttrChange || entry.effects) {
		registry.reactive.push(entry);

		const names = reactiveNames(entry);
		if (names === null) {
			registry.reactiveWildcard.push(entry);
		} else {
			for (const name of names) {
				if (!registry.byReactive.has(name)) registry.byReactive.set(name, []);
				registry.byReactive.get(name).push(entry);
			}
		}
	}
	if (entry.persist) registry.persist.push(entry);
}

function _runReactive(list, el, name, oldValue) {
	for (let i = 0; i < list.length; i++) {
		const entry = list[i];
		if (!el[entry.attribute]) continue;
		const effect = entry.effects && entry.effects[name];
		if (effect) effect(el, name, oldValue);
		else if (entry.onAttrChange && (!entry.declared || entry.declared.has(name))) entry.onAttrChange(el, name, oldValue);
	}
}

function _handleAttrMutation(mut) {
	const el = mut.target;
	const name = mut.attributeName;

	// echo guard — a same-value setAttribute still produces a record
	if (mut.oldValue === el.getAttribute(name)) return;

	const registry = _attrRegistry();
	const entries = registry.byAttr.get(name);

	// Dev-mode runtime attribute validation (validates all declared attributes on host or child)
	if (hasActiveDebug() && registry.byDeclaredAttr && registry.byDeclaredAttr.has(name) && isDevMode(el)) {
		const declared = registry.byDeclaredAttr.get(name);
		const val = el.getAttribute(name);
		for (let i = 0; i < declared.length; i++) {
			validateAttrValue(declared[i].spec, val, name, declared[i].componentTag, el);
		}
	}

	// debug sink — library attribute mutations only
	if (window.lnCore._debugSink && (name.indexOf('data-ln-') === 0 || entries)) {
		window.lnCore._debugSink('attr', name, el, { oldValue: mut.oldValue, newValue: el.getAttribute(name) });
	}

	// Reactive path
	if (name.indexOf('data-ln-') === 0) {
		const byName = registry.byReactive.get(name);
		if (byName) _runReactive(byName, el, name, mut.oldValue);

		if (registry.reactiveWildcard.length) _runReactive(registry.reactiveWildcard, el, name, mut.oldValue);
	}

	if (!entries) return;
	for (let i = 0; i < entries.length; i++) {
		const entry = entries[i];
		// Raw handler — components that own their own lifecycle
		if (entry.handler) {
			entry.handler(el, name, mut.oldValue);
			continue;
		}
		// Legacy path — fallback for lang/datetime foreign attributes
		if (entry.onAttributeChange && el[entry.attribute]) {
			entry.onAttributeChange(el, name);
		} else {
			findElements(el, entry.selector, entry.attribute, entry.ComponentFn);
			if (entry.onInit) entry.onInit(el);
		}
	}
}

function _ensureAttrObserver() {
	window.lnCore = window.lnCore || {};
	if (window.lnCore._attrObserverBound) return;
	window.lnCore._attrObserverBound = true;

	guardBody(function () {
		const observer = new MutationObserver(function (mutations) {
			for (let i = 0; i < mutations.length; i++) {
				try {
					_handleAttrMutation(mutations[i]);
				} catch (err) {
					console.error('[ln-core] mutation handler failed', mutations[i].target, err);
				}
			}
		});
		observer.observe(document.body, {
			attributes: true,
			subtree: true,
			attributeOldValue: true
		});
	}, 'ln-core');
}

// ─── Lifecycle Observer & Registry (Single Shared Observer) ───

function _lifecycleRegistry() {
	window.lnCore = window.lnCore || {};
	const registry = window.lnCore._lifecycleRegistry = window.lnCore._lifecycleRegistry || [];
	return registry;
}

function _handleChildListMutation(mutation) {
	const registry = _lifecycleRegistry();
	if (!registry.length) return;

	if (mutation.target) {
		for (let r = 0; r < registry.length; r++) {
			const entry = registry[r];
			if (entry.onSubtreeChange) {
				const query = entry.query;
				const host = mutation.target.nodeType === 1
					? (mutation.target.matches(query) ? mutation.target : mutation.target.closest(query))
					: (mutation.target.parentElement ? mutation.target.parentElement.closest(query) : null);
				if (host) entry.onSubtreeChange(host, mutation);
			}
		}
	}

	for (let j = 0; j < mutation.addedNodes.length; j++) {
		const node = mutation.addedNodes[j];
		if (node.nodeType === 1) {
			for (let r = 0; r < registry.length; r++) {
				const entry = registry[r];
				findElements(node, entry.selector, entry.attribute, entry.ComponentFn);
				if (entry.onInit) entry.onInit(node);
			}
		}
	}

	for (let j = 0; j < mutation.removedNodes.length; j++) {
		const node = mutation.removedNodes[j];
		if (node.nodeType === 1) {
			for (let r = 0; r < registry.length; r++) {
				const entry = registry[r];
				const query = entry.query;
				const items = Array.from(node.querySelectorAll(query));
				if (node.matches && node.matches(query)) {
					items.push(node);
				}
				for (let k = 0; k < items.length; k++) {
					const item = items[k];
					if (!document.contains(item)) {
						const inst = item[entry.attribute];
						if (inst && typeof inst.destroy === 'function') {
							try {
								inst.destroy();
							} catch (err) {
								console.error('[' + entry.attribute + '] destroy failed', item, err);
							}
						}
						delete item[entry.attribute];
					}
				}
			}
		}
	}
}

function _ensureLifecycleObserver() {
	window.lnCore = window.lnCore || {};
	if (window.lnCore._lifecycleObserverBound) return;
	window.lnCore._lifecycleObserverBound = true;

	guardBody(function () {
		const observer = new MutationObserver(function (mutations) {
			for (let i = 0; i < mutations.length; i++) {
				const mutation = mutations[i];
				if (mutation.type === 'childList') {
					try {
						_handleChildListMutation(mutation);
					} catch (err) {
						console.error('[ln-core] lifecycle handler failed', mutation.target, err);
					}
				}
			}
		});
		observer.observe(document.body, {
			childList: true,
			subtree: true
		});
	}, 'ln-core');
}

/**
 * For components that own their own lifecycle and only need the attribute
 * half of the shared invariant.
 * @param {string[]} names - attribute names to watch
 * @param {function(Element, string, string):void} handler - (el, attributeName, oldValue)
 */
export function observeAttributes(names, handler) {
	_registerAttrEntry({ observed: names, handler: handler });
	_ensureAttrObserver();
}

// ─── Component Registration ───────────────────────────────

export function registerComponent(selector, attribute, ComponentFn, componentTag, options = {}) {
	const extraAttributes = options.extraAttributes || [];
	const onAttributeChange = options.onAttributeChange || null;
	const onSubtreeChange = options.onSubtreeChange || null;
	const onInit = options.onInit || null;
	const onAttrChange = options.onAttrChange || null;
	const effects = options.effects || null;
	const attributes = options.attributes || null;
	const resolvedEffects = attributes ? attrEffects(attributes) : effects;
	const declared = attributes ? new Set(Object.keys(attributes)) : null;
	const persist = options.persist || null;

	function constructor(domRoot) {
		const root = domRoot || document.body;
		findElements(root, selector, attribute, ComponentFn);
		if (attributes && hasActiveDebug()) {
			for (const attrName in attributes) {
				const spec = attributes[attrName];
				const nodes = Array.from(root.querySelectorAll('[' + attrName + ']'));
				if (root.matches && root.matches('[' + attrName + ']')) nodes.push(root);
				for (let n = 0; n < nodes.length; n++) {
					const node = nodes[n];
					if (isDevMode(node)) {
						validateAttrValue(spec, node.getAttribute(attrName), attrName, componentTag, node);
					}
				}
			}
		}
		if (onInit) onInit(root);
	}

	const observedAttributes = [];
	if (selector.indexOf('[') !== -1) {
		const re = /\[([\w-]+)/g;
		let match;
		while ((match = re.exec(selector)) !== null) {
			observedAttributes.push(match[1]);
		}
	} else {
		observedAttributes.push(selector);
	}

	_registerAttrEntry({
		selector: selector,
		attribute: attribute,
		componentTag: componentTag,
		attributes: attributes,
		ComponentFn: ComponentFn,
		onInit: onInit,
		observed: observedAttributes.concat(extraAttributes),
		onAttributeChange: onAttributeChange,
		onAttrChange: onAttrChange,
		effects: resolvedEffects,
		declared: declared,
		persist: persist
	});
	_ensureAttrObserver();

	const isComplex = selector.indexOf('[') !== -1 || selector.indexOf('.') !== -1 || selector.indexOf('#') !== -1;
	const query = isComplex ? selector : '[' + selector + ']';

	_lifecycleRegistry().push({
		selector: selector,
		attribute: attribute,
		ComponentFn: ComponentFn,
		onInit: onInit,
		onSubtreeChange: onSubtreeChange,
		query: query
	});
	_ensureLifecycleObserver();

	window[attribute] = constructor;

	if (typeof window !== 'undefined') {
		window.lnCore = window.lnCore || {};
		window.lnCore.registerComponent = registerComponent;
	}

	function boot() {
		if (pendingCount() > 0) {
			queueBoot(function () { constructor(document.body); });
		} else {
			constructor(document.body);
		}
	}

	if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', boot);
	} else {
		boot();
	}

	return constructor;
}

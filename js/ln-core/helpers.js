// ─── Template Cache ────────────────────────────────────────
const _tmplCache = {};

/**
 * Clone a <template data-ln-template="name"> element.
 * Cached after first lookup.
 */
export function cloneTemplate(name, componentTag) {
	if (!_tmplCache[name]) {
		_tmplCache[name] = document.querySelector('[data-ln-template="' + name + '"]');
	}
	const tmpl = _tmplCache[name];
	if (!tmpl) {
		console.warn('[' + (componentTag || 'ln-core') + '] Template "' + name + '" not found');
		return null;
	}
	return tmpl.content.cloneNode(true);
}

// ─── Event Dispatch ────────────────────────────────────────

export function dispatch(element, eventName, detail) {
	element.dispatchEvent(new CustomEvent(eventName, {
		bubbles: true,
		detail: detail || {}
	}));
}

export function dispatchCancelable(element, eventName, detail) {
	const event = new CustomEvent(eventName, {
		bubbles: true,
		cancelable: true,
		detail: detail || {}
	});
	element.dispatchEvent(event);
	return event;
}

/**
 * Re-filter / re-sort / re-render a data-driven list-like component, then
 * notify the coordinator that fresh data is requested.
 *
 * Shared by ln-list and ln-table. The passed `component` MUST expose this
 * instance contract:
 *   - _applyFilterAndSort()  method
 *   - _render()              method
 *   - _updateFooter()        method
 *   - _vStart, _vEnd         number (reset to -1 to force a full re-render)
 *   - dom                    the component root element (dispatch target)
 *   - name                   the component's name (becomes detail[keyName])
 *   - currentSort, currentFilters, currentSearch
 *
 * @param {Object} component  component instance satisfying the contract above
 * @param {string} eventName  e.g. 'ln-table:request-data' / 'ln-list:request-data'
 * @param {string} keyName    payload key for the name, e.g. 'table' / 'list'
 */
export function requestData(component, eventName, keyName) {
	component._applyFilterAndSort();
	component._vStart = -1;
	component._vEnd = -1;
	component._render();
	component._updateFooter();

	const detail = {
		sort: component.currentSort,
		filters: component.currentFilters,
		search: component.currentSearch
	};
	detail[keyName] = component.name;
	dispatch(component.dom, eventName, detail);
}

// ─── Declarative DOM Binding ───────────────────────────────

export function fill(root, data) {
	if (!root || !data) return root;

	// data-ln-field="prop" → textContent
	const fields = root.querySelectorAll('[data-ln-field]');
	for (let i = 0; i < fields.length; i++) {
		const el = fields[i];
		const prop = el.getAttribute('data-ln-field');
		if (data[prop] != null) {
			el.textContent = data[prop];
		}
	}

	// data-ln-attr="attr:prop, attr:prop" → setAttribute
	const attrs = root.querySelectorAll('[data-ln-attr]');
	for (let i = 0; i < attrs.length; i++) {
		const el = attrs[i];
		const pairs = el.getAttribute('data-ln-attr').split(',');
		for (let j = 0; j < pairs.length; j++) {
			const parts = pairs[j].trim().split(':');
			if (parts.length !== 2) continue;
			const attr = parts[0].trim();
			const prop = parts[1].trim();
			if (data[prop] != null) {
				el.setAttribute(attr, data[prop]);
			}
		}
	}

	// data-ln-show="prop" → classList.toggle('hidden', !value)
	const shows = root.querySelectorAll('[data-ln-show]');
	for (let i = 0; i < shows.length; i++) {
		const el = shows[i];
		const prop = el.getAttribute('data-ln-show');
		if (prop in data) {
			el.classList.toggle('hidden', !data[prop]);
		}
	}

	// data-ln-class="cls:prop, cls:prop" → classList.toggle(cls, !!value)
	const classes = root.querySelectorAll('[data-ln-class]');
	for (let i = 0; i < classes.length; i++) {
		const el = classes[i];
		const pairs = el.getAttribute('data-ln-class').split(',');
		for (let j = 0; j < pairs.length; j++) {
			const parts = pairs[j].trim().split(':');
			if (parts.length !== 2) continue;
			const cls = parts[0].trim();
			const prop = parts[1].trim();
			if (prop in data) {
				el.classList.toggle(cls, !!data[prop]);
			}
		}
	}

	return root;
}

// ─── Template Text-Node Placeholders ──────────────────────

export function fillTemplate(clone, data) {
	if (!clone || !data) return clone;
	const walker = document.createTreeWalker(clone, NodeFilter.SHOW_TEXT);
	while (walker.nextNode()) {
		const node = walker.currentNode;
		if (node.textContent.indexOf('{{') !== -1) {
			node.textContent = node.textContent.replace(
				/\{\{\s*(\w+)\s*\}\}/g,
				function (_, key) { return data[key] !== undefined ? data[key] : ''; }
			);
		}
	}
	return clone;
}

// ─── Keyed List Rendering ──────────────────────────────────

export function renderList(container, items, templateName, keyFn, fillFn, componentTag) {
	// Index existing children by data-ln-key
	const existingByKey = {};
	for (let i = 0; i < container.children.length; i++) {
		const child = container.children[i];
		const key = child.getAttribute('data-ln-key');
		if (key) existingByKey[key] = child;
	}

	// Build ordered fragment — reuse or clone
	const frag = document.createDocumentFragment();

	for (let i = 0; i < items.length; i++) {
		const item = items[i];
		const key = String(keyFn(item));
		let el = existingByKey[key];

		if (el) {
			fillFn(el, item, i);
		} else {
			const clone = cloneTemplate(templateName, componentTag);
			if (!clone) continue;
			fillTemplate(clone, item);
			el = clone.firstElementChild;
			if (!el) continue;
			el.setAttribute('data-ln-key', key);
			fillFn(el, item, i);
		}
		frag.appendChild(el);
	}

	// Atomic update: orphans still in container, reused nodes already moved to frag
	container.textContent = '';
	container.appendChild(frag);
}

// ─── Guard Body ────────────────────────────────────────

export function guardBody(setupFn, componentTag) {
	if (!document.body) {
		document.addEventListener('DOMContentLoaded', function () {
			guardBody(setupFn, componentTag);
		});
		console.warn('[' + componentTag + '] Script loaded before <body> — add "defer" to your <script> tag');
		return;
	}
	setupFn();
}

export function cloneTemplateScoped(root, name, componentTag) {
	if (root) {
		const local = root.querySelector('[data-ln-template="' + name + '"]');
		if (local) return local.content.cloneNode(true);
	}
	return cloneTemplate(name, componentTag);
}

// ─── Dictionary (i18n) ────────────────────────────────────

/**
 * Build a plain object from hidden dictionary elements.
 * Reads all [selector] elements once, extracts key→textContent,
 * removes them from DOM. Returns dictionary object.
 *
 * HTML: <ul hidden>
 *         <li data-ln-upload-dict="remove">Remove</li>
 *       </ul>
 * JS:   const dict = buildDict(container, 'data-ln-upload-dict');
 *        dict.remove → 'Remove'
 */
export function buildDict(root, selector) {
	const dict = {};
	const els = root.querySelectorAll('[' + selector + ']');
	for (let i = 0; i < els.length; i++) {
		dict[els[i].getAttribute(selector)] = els[i].textContent;
		els[i].remove();
	}
	return dict;
}

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
			el[attribute] = new ComponentClass(el);
		}
	}
}

// ─── Visibility Check ─────────────────────────────────────

export function isVisible(el) {
	return !!(el.offsetWidth || el.offsetHeight || el.getClientRects().length);
}

// ─── Form Serialization ───────────────────────────────────

export function serializeForm(form) {
	const data = {};
	const elements = form.elements;

	for (let i = 0; i < elements.length; i++) {
		const el = elements[i];
		if (!el.name || el.disabled || el.type === 'file' || el.type === 'submit' || el.type === 'button') continue;

		if (el.type === 'checkbox') {
			if (!data[el.name]) data[el.name] = [];
			if (el.checked) data[el.name].push(el.value);
		} else if (el.type === 'radio') {
			if (el.checked) data[el.name] = el.value;
		} else if (el.type === 'select-multiple') {
			data[el.name] = [];
			for (let j = 0; j < el.options.length; j++) {
				if (el.options[j].selected) data[el.name].push(el.options[j].value);
			}
		} else {
			data[el.name] = el.value;
		}
	}

	return data;
}

export function populateForm(form, data) {
	const elements = form.elements;
	const filled = [];

	for (let i = 0; i < elements.length; i++) {
		const el = elements[i];
		if (!el.name || !(el.name in data) || el.type === 'file' || el.type === 'submit' || el.type === 'button') continue;

		const value = data[el.name];

		if (el.type === 'checkbox') {
			el.checked = Array.isArray(value) ? value.indexOf(el.value) !== -1 : !!value;
			filled.push(el);
		} else if (el.type === 'radio') {
			el.checked = el.value === String(value);
			filled.push(el);
		} else if (el.type === 'select-multiple') {
			if (Array.isArray(value)) {
				for (let j = 0; j < el.options.length; j++) {
					el.options[j].selected = value.indexOf(el.options[j].value) !== -1;
				}
			}
			filled.push(el);
		} else {
			el.value = value;
			filled.push(el);
		}
	}

	return filled;
}

// ─── Locale Detection ─────────────────────────────────────

export function getLocale(el) {
	const langEl = el.closest('[lang]');
	return (langEl ? langEl.lang : null) || navigator.language;
}

// ─── Raw Value Read ───────────────────────────────────────

/**
 * Read the raw machine value behind a formatted cell/item display.
 * Returns the `data-ln-value` attribute if present, else trimmed textContent.
 * Single read path for value-based sort/filter across components.
 */
export function readValue(el) {
	return el.hasAttribute('data-ln-value')
		? el.getAttribute('data-ln-value')
		: el.textContent.trim();
}

// ─── Value Property Interception ───────────────────────────

/**
 * Intercept the programmatic `value` getter/setter on an input element.
 * Useful for custom components that need to sync/format programmatic changes.
 * @param {HTMLInputElement} dom - The visible input element.
 * @param {Object} descriptor - The original property descriptor of HTMLInputElement.prototype.value.
 * @param {Object} callbacks - Getter and setter callbacks.
 */
export function interceptValueProperty(dom, descriptor, { get, set }) {
	Object.defineProperty(dom, 'value', {
		get: function () {
			if (get) {
				return get.call(this);
			}
			return descriptor.get.call(this);
		},
		set: function (val) {
			if (set) {
				set.call(this, val, (originalVal) => descriptor.set.call(this, originalVal));
			} else {
				descriptor.set.call(this, val);
			}
		},
		configurable: true
	});
}

// ─── Component Registration ───────────────────────────────

export function registerComponent(selector, attribute, ComponentFn, componentTag, options = {}) {
	const extraAttributes = options.extraAttributes || [];
	const onAttributeChange = options.onAttributeChange || null;
	const onInit = options.onInit || null;

	function constructor(domRoot) {
		const root = domRoot || document.body;
		findElements(root, selector, attribute, ComponentFn);
		if (onInit) onInit(root);
	}

	guardBody(function () {
		const observer = new MutationObserver(function (mutations) {
			for (let i = 0; i < mutations.length; i++) {
				const mutation = mutations[i];
				if (mutation.type === 'childList') {
					for (let j = 0; j < mutation.addedNodes.length; j++) {
						const node = mutation.addedNodes[j];
						if (node.nodeType === 1) {
							findElements(node, selector, attribute, ComponentFn);
							if (onInit) onInit(node);
						}
					}
					for (let j = 0; j < mutation.removedNodes.length; j++) {
						const node = mutation.removedNodes[j];
						if (node.nodeType === 1) {
							const isComplex = selector.indexOf('[') !== -1 || selector.indexOf('.') !== -1 || selector.indexOf('#') !== -1;
							const query = isComplex ? selector : '[' + selector + ']';
							const items = Array.from(node.querySelectorAll(query));
							if (node.matches && node.matches(query)) {
								items.push(node);
							}
							for (let k = 0; k < items.length; k++) {
								const item = items[k];
								if (!document.contains(item)) {
									const inst = item[attribute];
									if (inst && typeof inst.destroy === 'function') {
										inst.destroy();
									}
								}
							}
						}
					}
				} else if (mutation.type === 'attributes') {
					if (onAttributeChange && mutation.target[attribute]) {
						onAttributeChange(mutation.target, mutation.attributeName);
					} else {
						findElements(mutation.target, selector, attribute, ComponentFn);
						if (onInit) onInit(mutation.target);
					}
				}
			}
		});

		// Extract attribute names from selector for attributeFilter
		let observedAttributes = [];
		if (selector.indexOf('[') !== -1) {
			const re = /\[([\w-]+)/g;
			let match;
			while ((match = re.exec(selector)) !== null) {
				observedAttributes.push(match[1]);
			}
		} else {
			observedAttributes.push(selector);
		}

		observer.observe(document.body, {
			childList: true,
			subtree: true,
			attributes: true,
			attributeFilter: observedAttributes.concat(extraAttributes)
		});
	}, componentTag || (selector.indexOf('[') === -1 ? selector.replace('data-', '') : 'component'));

	window[attribute] = constructor;

	if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', function () {
			constructor(document.body);
		});
	} else {
		constructor(document.body);
	}

	return constructor;
}

// ─── HTTP / URL Helpers ────────────────────────────────────

/**
 * Check if a click event on a link should be intercepted by an in-app navigator.
 * Intercept only left clicks, same-origin, not target="_blank", no download,
 * not mailto/tel, and not pure hash/empty.
 *
 * @param {MouseEvent} event
 * @param {HTMLAnchorElement} anchor
 * @returns {boolean}
 */
export function shouldInterceptLink(event, anchor) {
	if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey || event.button !== 0) {
		return false;
	}
	if (!anchor) return false;
	const href = anchor.getAttribute('href');
	if (!href) return false;
	if (anchor.getAttribute('target') === '_blank') return false;
	if (anchor.hasAttribute('download')) return false;
	if (href.startsWith('mailto:') || href.startsWith('tel:')) return false;
	if (href === '#' || href.startsWith('#')) return false;
	if (anchor.hostname && anchor.hostname !== window.location.hostname) return false;
	return true;
}

/**
 * Build a URL from segments, stripping duplicate slashes.
 */
export function buildUrl(...segments) {
	return segments
		.filter(x => x !== undefined && x !== null && x !== '')
		.map((part, index) => {
			if (index === 0) return part.replace(/\/+$/, '');
			return part.replace(/^\/+/, '').replace(/\/+$/, '');
		})
		.filter(Boolean)
		.join('/');
}

/**
 * Compile standard JSON request headers.
 */
export function getHeaders(customHeaders, auth) {
	return Object.assign({
		'Content-Type': 'application/json',
		'Accept': 'application/json'
	}, customHeaders, auth ? { 'Authorization': auth } : null);
}

/**
 * Safely parse headers from JSON string.
 */
export function parseHeaders(str, componentName = 'ln-core') {
	try { return str ? JSON.parse(str) : {}; }
	catch (e) { return console.error(`[${componentName}] Invalid headers JSON:`, e), {}; }
}

// ─── Domain Data Mapper Registry ───────────────────────────
const _dataMappers = {};

export function registerDataMapper(name, mapper) {
	_dataMappers[name] = mapper;
}

export function getDataMapper(name) {
	return _dataMappers[name] || { ingress: r => r, egress: r => r };
}

if (typeof window !== 'undefined') {
	window.lnCore = window.lnCore || {};
	window.lnCore.registerDataMapper = registerDataMapper;
	window.lnCore.getDataMapper = getDataMapper;
	window.lnCore.fillTemplate = fillTemplate;
	window.lnCore.fill = fill;
	window.lnCore.renderList = renderList;
}



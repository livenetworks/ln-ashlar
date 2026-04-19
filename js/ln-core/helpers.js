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
	const items = Array.from(root.querySelectorAll('[' + selector + ']'));
	if (root.hasAttribute && root.hasAttribute(selector)) {
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

// ─── Component Registration ───────────────────────────────

export function registerComponent(selector, attribute, ComponentFn, componentTag) {
	function constructor(domRoot) {
		findElements(domRoot, selector, attribute, ComponentFn);
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
						}
					}
				} else if (mutation.type === 'attributes') {
					findElements(mutation.target, selector, attribute, ComponentFn);
				}
			}
		});

		observer.observe(document.body, {
			childList: true,
			subtree: true,
			attributes: true,
			attributeFilter: [selector]
		});
	}, componentTag || selector.replace('data-', ''));

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

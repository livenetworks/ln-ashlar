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

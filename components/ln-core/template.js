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

export function cloneTemplateScoped(root, name, componentTag) {
	if (root) {
		const local = root.querySelector('[data-ln-template="' + name + '"]');
		if (local) return local.content.cloneNode(true);
	}
	return cloneTemplate(name, componentTag);
}

// ─── Declarative DOM Binding ───────────────────────────────

export function fill(root, data) {
	if (!root || !data) return root;

	const fields = root.querySelectorAll('[data-ln-field]');
	for (let i = 0; i < fields.length; i++) {
		const el = fields[i];
		const prop = el.getAttribute('data-ln-field');
		if (data[prop] != null) {
			el.textContent = data[prop];
		}
	}

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

	const shows = root.querySelectorAll('[data-ln-show]');
	for (let i = 0; i < shows.length; i++) {
		const el = shows[i];
		const prop = el.getAttribute('data-ln-show');
		if (prop in data) {
			el.classList.toggle('hidden', !data[prop]);
		}
	}

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

// ─── Event-driven fill fan-out ─────────────────────────────

export function lnFill(container, record) {
	if (container.matches && container.matches('[data-ln-form], [data-ln-fillable]')) {
		if (window.lnCore._debugSink) window.lnCore._debugSink('event', 'ln-fill', container, record ?? null);
		container.dispatchEvent(new CustomEvent('ln-fill', { detail: record ?? null, bubbles: true }));
	}
	const targets = container.querySelectorAll('[data-ln-form], [data-ln-fillable]');
	for (let i = 0; i < targets.length; i++) {
		if (window.lnCore._debugSink) window.lnCore._debugSink('event', 'ln-fill', targets[i], record ?? null);
		targets[i].dispatchEvent(new CustomEvent('ln-fill', { detail: record ?? null, bubbles: true }));
	}
	return container;
}

if (typeof window !== 'undefined') {
	window.lnCore = window.lnCore || {};
	if (!window.lnCore._fillBound) {
		window.lnCore._fillBound = true;
		document.addEventListener('ln-fill', function (e) {
			if (!e.target.matches || !e.target.matches('[data-ln-fillable]')) return;
			if (e.detail) {
				fill(e.target, e.detail);
			} else {
				const fields = e.target.querySelectorAll('[data-ln-field]');
				for (let i = 0; i < fields.length; i++) {
					fields[i].textContent = '';
				}
			}
		});
	}
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

	const _replaceTokens = function (_, key) { return data[key] !== undefined ? data[key] : ''; };
	const elements = Array.from(clone.querySelectorAll('*'));
	if (clone.nodeType === 1) elements.push(clone);
	for (let i = 0; i < elements.length; i++) {
		const el = elements[i];
		const attrs = el.attributes;
		for (let j = 0; j < attrs.length; j++) {
			const attr = attrs[j];
			if (attr.value.indexOf('{{') !== -1) {
				el.setAttribute(attr.name, attr.value.replace(/\{\{\s*(\w+)\s*\}\}/g, _replaceTokens));
			}
		}
	}

	return clone;
}

// ─── Keyed List Rendering ──────────────────────────────────

export function renderList(container, items, templateName, keyFn, fillFn, componentTag) {
	const existingByKey = {};
	for (let i = 0; i < container.children.length; i++) {
		const child = container.children[i];
		const key = child.getAttribute('data-ln-render-key');
		if (key) existingByKey[key] = child;
	}

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
			el.setAttribute('data-ln-render-key', key);
			fillFn(el, item, i);
		}
		frag.appendChild(el);
	}

	container.textContent = '';
	container.appendChild(frag);
}

// ─── Dictionary (i18n) ────────────────────────────────────

/**
 * Build a plain object from hidden dictionary elements.
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

if (typeof window !== 'undefined') {
	window.lnCore = window.lnCore || {};
	window.lnCore.fillTemplate = fillTemplate;
	window.lnCore.fill = fill;
	window.lnCore.lnFill = lnFill;
	window.lnCore.renderList = renderList;
}

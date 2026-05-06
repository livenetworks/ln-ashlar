/* Live Networks — ln-toast (side-accent with icons) */
import { guardBody, cloneTemplateScoped, fill } from '../ln-core';
import DEFAULT_TEMPLATE_HTML from './template.html?raw';

(function () {
	const DOM_SELECTOR = "data-ln-toast";
	const DOM_ATTRIBUTE = "lnToast";
	const TEMPLATE_NAME = "ln-toast-item";

	const TYPE_ICON = { success: 'circle-check', error: 'circle-x', warn: 'alert-triangle', info: 'info-circle' };

	const STATUS_CLASS = { success: 'success', error: 'error', warn: 'warning', info: 'info' };

	const DEFAULT_TITLES = { success: 'Success', error: 'Error', warn: 'Warning', info: 'Information' };

	if (window.__lnToastLoaded) return;
	window.__lnToastLoaded = true;

	function _ensureTemplate() {
		if (document.querySelector('[data-ln-template="ln-toast-item"]')) return;
		if (!document.body) return;
		const tmpl = document.createElement('template');
		// Trust boundary: DEFAULT_TEMPLATE_HTML is a hardcoded library constant resolved at build time via ?raw import.
		tmpl.setAttribute('data-ln-template', 'ln-toast-item');
		tmpl.innerHTML = DEFAULT_TEMPLATE_HTML;
		document.body.appendChild(tmpl);
	}

	function _findContainers(root) {
		if (!root || root.nodeType !== 1) return;
		const items = Array.from(root.querySelectorAll("[" + DOM_SELECTOR + "]"));
		if (root.hasAttribute && root.hasAttribute(DOM_SELECTOR)) items.push(root);
		for (const el of items) {
			if (!el[DOM_ATTRIBUTE]) new _Component(el);
		}
	}

	function _Component(dom) {
		this.dom = dom;
		dom[DOM_ATTRIBUTE] = this;
		this.timeoutDefault = parseInt(dom.getAttribute("data-ln-toast-timeout") || "6000", 10);
		this.max = parseInt(dom.getAttribute("data-ln-toast-max") || "5", 10);

		for (const li of Array.from(dom.querySelectorAll("[data-ln-toast-item]"))) {
			_hydrateLI(li, dom);
		}
		return this;
	}

	_Component.prototype.destroy = function () {
		if (!this.dom[DOM_ATTRIBUTE]) return;
		for (const li of Array.from(this.dom.children)) {
			_dismiss(li);
		}
		delete this.dom[DOM_ATTRIBUTE];
	};

	function _buildItem(opts, container) {
		const type = ((opts.type || "info") + "").toLowerCase();
		const fragment = cloneTemplateScoped(container, TEMPLATE_NAME, 'ln-toast');
		if (!fragment) {
			console.warn('[ln-toast] Template "' + TEMPLATE_NAME + '" not found');
			return null;
		}
		const li = fragment.firstElementChild;
		if (!li) return null;

		const hasBody = !!(opts.message || (opts.data && opts.data.errors));

		fill(li, {
			title: opts.title || DEFAULT_TITLES[type] || DEFAULT_TITLES.info,
			role: type === 'error' ? 'alert' : 'status',
			ariaLive: type === 'error' ? 'assertive' : 'polite',
			hasBody: hasBody
		});

		const card = li.querySelector('.ln-toast__card');
		if (card) card.classList.add(STATUS_CLASS[type] || 'info');

		const side = li.querySelector('.ln-toast__side');
		if (side) {
			const useEl = side.querySelector('use');
			if (useEl) useEl.setAttribute('href', '#ln-' + (TYPE_ICON[type] || TYPE_ICON.info));
		}

		const bodyEl = li.querySelector('.ln-toast__body');
		if (bodyEl && hasBody) _renderBody(bodyEl, opts);

		const closeBtn = li.querySelector('.ln-toast__close');
		if (closeBtn) closeBtn.addEventListener('click', function () { _dismiss(li); });

		return li;
	}

	function _renderBody(bodyEl, opts) {
		if (opts.message) {
			if (Array.isArray(opts.message)) {
				const ul = document.createElement("ul");
				for (const msg of opts.message) {
					const lie = document.createElement("li");
					lie.textContent = msg;
					ul.appendChild(lie);
				}
				bodyEl.appendChild(ul);
			} else {
				const p = document.createElement("p");
				p.textContent = opts.message;
				bodyEl.appendChild(p);
			}
		}
		if (opts.data && opts.data.errors) {
			const ul = document.createElement("ul");
			for (const err of Object.values(opts.data.errors).flat()) {
				const lie = document.createElement("li");
				lie.textContent = err;
				ul.appendChild(lie);
			}
			bodyEl.appendChild(ul);
		}
	}

	function _append(cmp, li) {
		while (cmp.dom.children.length >= cmp.max) cmp.dom.removeChild(cmp.dom.firstElementChild);
		cmp.dom.appendChild(li);
		requestAnimationFrame(() => li.classList.add("ln-toast__item--in"));
	}

	function _dismiss(li) {
		if (!li || !li.parentNode) return;
		clearTimeout(li._timer);
		li.classList.remove("ln-toast__item--in");
		li.classList.add("ln-toast__item--out");
		setTimeout(() => { li.parentNode && li.parentNode.removeChild(li); }, 200);
	}

	function _resolveContainer(detail) {
		let container = detail && detail.container;
		if (typeof container === "string") container = document.querySelector(container);
		if (!(container instanceof HTMLElement)) {
			container = document.querySelector("[" + DOM_SELECTOR + "]") || document.getElementById("ln-toast-container");
		}
		return container || null;
	}

	function _hydrateLI(li, container) {
		const type = ((li.getAttribute("data-type") || "info") + "").toLowerCase();
		const titleA = li.getAttribute("data-title");
		const msgText = (li.innerText || li.textContent || "").trim();

		const built = _buildItem({
			type: type,
			title: titleA,
			message: msgText || undefined
		}, container);

		if (!built) return;

		li.parentNode && li.parentNode.replaceChild(built, li);
		requestAnimationFrame(() => built.classList.add("ln-toast__item--in"));
	}

	function _onEnqueue(e) {
		const detail = e.detail || {};
		const container = _resolveContainer(detail);
		if (!container) {
			console.warn('[ln-toast] No toast container found');
			return;
		}
		const cmp = container[DOM_ATTRIBUTE] || new _Component(container);
		const li = _buildItem(detail, container);
		if (!li) return;
		const timeout = Number.isFinite(detail.timeout) ? detail.timeout : cmp.timeoutDefault;
		_append(cmp, li);
		if (timeout > 0) li._timer = setTimeout(() => _dismiss(li), timeout);
	}

	function _onClear(e) {
		const detail = (e && e.detail) || {};
		if (detail.container) {
			const el = _resolveContainer(detail);
			if (el) {
				for (const child of Array.from(el.children)) _dismiss(child);
			}
		} else {
			const containers = document.querySelectorAll("[" + DOM_SELECTOR + "]");
			for (const el of Array.from(containers)) {
				for (const child of Array.from(el.children)) _dismiss(child);
			}
		}
	}

	guardBody(function () {
		_ensureTemplate();

		window.addEventListener('ln-toast:enqueue', _onEnqueue);
		window.addEventListener('ln-toast:clear', _onClear);

		const observer = new MutationObserver(function (muts) {
			for (const m of muts) {
				if (m.type === 'attributes') { _findContainers(m.target); continue; }
				for (const n of m.addedNodes) {
					_findContainers(n);
				}
			}
		});
		observer.observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: [DOM_SELECTOR] });

		_findContainers(document.body);
	}, 'ln-toast');
})();

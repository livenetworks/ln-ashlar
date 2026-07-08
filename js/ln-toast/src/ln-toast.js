/* Live Networks — ln-toast (side-accent with icons) */
import { guardBody, cloneTemplateScoped, fill } from '../../ln-core';

(function () {
	const DOM_SELECTOR = "data-ln-toast";
	const DOM_ATTRIBUTE = "lnToast";
	const TEMPLATE_NAME = "ln-toast-item";

	if (window.__lnToastLoaded) return;
	window.__lnToastLoaded = true;

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

		const items = Array.from(dom.querySelectorAll("[data-ln-toast-item]"));
		while (items.length > this.max) dom.removeChild(items.shift());
		for (const li of items) _hydrateLI(li, this);

		return this;
	}

	_Component.prototype.destroy = function () {
		if (!this.dom[DOM_ATTRIBUTE]) return;
		for (const li of Array.from(this.dom.querySelectorAll("[data-ln-toast-item]"))) {
			_dismiss(li);
		}
		delete this.dom[DOM_ATTRIBUTE];
	};

	function _buildItem(opts, container) {
		const type = ((opts.type || "") + "").trim().toLowerCase();
		const fragment = cloneTemplateScoped(container, TEMPLATE_NAME, 'ln-toast');
		if (!fragment) {
			console.warn('[ln-toast] Template "' + TEMPLATE_NAME + '" not found');
			return null;
		}

		// fill() runs on the DocumentFragment, BEFORE extracting the <li>.
		// data-ln-attr="class:type" sits on the template root <li>; fill()'s
		// querySelectorAll never matches its own root, and here the fragment is
		// the root, so the <li> (its child) is a matched descendant and gets
		// class="{type}". title/message data-ln-field targets are descendants
		// too, so one call resolves all three. See plan Finding: fill-on-fragment.
		fill(fragment, {
			type: type,
			title: opts.title,
			message: typeof opts.message === 'string' ? opts.message : undefined
		});

		const li = fragment.firstElementChild;
		if (!li) return null;

		// Items are addressed by [data-ln-toast-item] everywhere (eviction / clear / destroy / hydration) — stamp it if the consumer template omitted it.
		if (!li.hasAttribute('data-ln-toast-item')) li.setAttribute('data-ln-toast-item', '');

		// ORDERING: classList.add MUST follow fill(). fill set class via
		// setAttribute('class', type), which clobbers the whole attribute — a
		// pre-added .ln-enter would be wiped. Add the transient enter flag now.
		li.classList.add('ln-enter');

		const bodyEl = li.querySelector('.body');
		if (bodyEl) _renderBody(bodyEl, opts);

		const closeBtn = li.querySelector('[data-ln-toast-close]');
		if (closeBtn) closeBtn.addEventListener('click', function () { _dismiss(li); });

		return li;
	}

	// Runtime DATA rendering only (arrays / error maps) — plain string
	// messages are already handled by fill()'s data-ln-field above.
	function _renderBody(bodyEl, opts) {
		if (Array.isArray(opts.message)) {
			const ul = document.createElement("ul");
			for (const msg of opts.message) {
				const lie = document.createElement("li");
				lie.textContent = msg;
				ul.appendChild(lie);
			}
			bodyEl.appendChild(ul);
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
		// Evict by [data-ln-toast-item] — raw children include the nested <template> (recommended placement).
		const items = Array.from(cmp.dom.querySelectorAll("[data-ln-toast-item]"));
		while (items.length >= cmp.max && items.length > 0) cmp.dom.removeChild(items.shift());
		cmp.dom.appendChild(li);
		requestAnimationFrame(() => li.classList.remove("ln-enter"));
	}

	function _dismiss(li) {
		if (!li || !li.parentNode) return;
		clearTimeout(li._timer);
		li.classList.remove("ln-enter");
		li.classList.add("ln-out");
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

	function _hydrateLI(li, cmp) {
		if (li._lnToastHydrated) return;
		li._lnToastHydrated = true;

		const closeBtn = li.querySelector('[data-ln-toast-close]');
		if (closeBtn) closeBtn.addEventListener('click', function () { _dismiss(li); });

		const raw = li.getAttribute('data-ln-toast-timeout');
		const parsed = raw !== null ? parseInt(raw, 10) : NaN;
		const timeout = Number.isFinite(parsed) ? parsed : cmp.timeoutDefault;
		if (timeout > 0) li._timer = setTimeout(function () { _dismiss(li); }, timeout);
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
				for (const child of Array.from(el.querySelectorAll("[data-ln-toast-item]"))) _dismiss(child);
			}
		} else {
			const containers = document.querySelectorAll("[" + DOM_SELECTOR + "]");
			for (const el of Array.from(containers)) {
				for (const child of Array.from(el.querySelectorAll("[data-ln-toast-item]"))) _dismiss(child);
			}
		}
	}

	guardBody(function () {
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

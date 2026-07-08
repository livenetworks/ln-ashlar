import { registerComponent, dispatch, dispatchCancelable } from '../../ln-core';

(function () {
	const DOM_SELECTOR = 'data-ln-nav';
	const DOM_ATTRIBUTE = 'lnNav';

	if (window[DOM_ATTRIBUTE] !== undefined) return;

	// ─── pushState singleton patch ──────────────────────────────
	const _pushStateCallbacks = [];

	if (!history._lnNavPatched) {
		const _origPushState = history.pushState;
		history.pushState = function () {
			_origPushState.apply(history, arguments);
			for (const cb of _pushStateCallbacks) { cb(); }
		};
		history._lnNavPatched = true;
	}

	// ─── Component ─────────────────────────────────────────────

	function _component(dom) {
		this.dom = dom;
		this.activeClass = dom.getAttribute(DOM_SELECTOR) || 'active';
		this.exact = dom.hasAttribute('data-ln-nav-exact');

		this.updateHandler = () => this.update();

		// Listen to navigation events
		window.addEventListener('popstate', this.updateHandler);
		_pushStateCallbacks.push(this.updateHandler);

		// Observe DOM changes inside this nav element
		this.observer = new MutationObserver(() => this.update());
		this.observer.observe(dom, { childList: true, subtree: true });

		// Perform initial highlight
		this.update();

		return this;
	}

	_component.prototype.update = function () {
		if (!this.activeClass) return;
		const before = dispatchCancelable(this.dom, 'ln-nav:before-update', { target: this.dom });
		if (before.defaultPrevented) return;

		const links = Array.from(this.dom.querySelectorAll('a'));
		const currentPath = window.location.pathname;
		const normalizedCurrent = _normalizeUrl(currentPath);

		for (const link of links) {
			const href = link.getAttribute('href');
			if (!href || href === '#' || href.startsWith('#') || href.startsWith('javascript:') || href.startsWith('mailto:') || href.startsWith('tel:')) {
				link.classList.remove(this.activeClass);
				link.removeAttribute('aria-current');
				continue;
			}

			// Exclude external links
			if (link.hostname && link.hostname !== window.location.hostname) {
				link.classList.remove(this.activeClass);
				link.removeAttribute('aria-current');
				continue;
			}

			const normalizedHref = _normalizeUrl(href);
			const isExact = normalizedHref === normalizedCurrent;
			const isParent = !this.exact && normalizedHref !== '/' && normalizedCurrent.startsWith(normalizedHref + '/');

			if (isExact || isParent) {
				link.classList.add(this.activeClass);
				link.setAttribute('aria-current', 'page');
			} else {
				link.classList.remove(this.activeClass);
				link.removeAttribute('aria-current');
			}
		}

		dispatch(this.dom, 'ln-nav:update', { target: this.dom });
	};

	_component.prototype.destroy = function () {
		if (!this.dom[DOM_ATTRIBUTE]) return;
		if (this.observer) {
			this.observer.disconnect();
		}
		window.removeEventListener('popstate', this.updateHandler);
		const idx = _pushStateCallbacks.indexOf(this.updateHandler);
		if (idx !== -1) {
			_pushStateCallbacks.splice(idx, 1);
		}
		dispatch(this.dom, 'ln-nav:destroyed', { target: this.dom });
		delete this.dom[DOM_ATTRIBUTE];
	};

	// ─── Helper Functions ──────────────────────────────────────

	function _normalizeUrl(url) {
		try {
			const urlObj = new URL(url, window.location.href);
			return urlObj.pathname.replace(/\/$/, '') || '/';
		} catch (e) {
			return url.replace(/\/$/, '') || '/';
		}
	}

	// ─── Attribute Sync ────────────────────────────────────────

	function _syncAttribute(el, attrName) {
		const instance = el[DOM_ATTRIBUTE];
		if (!instance) return;

		if (attrName === DOM_SELECTOR) {
			if (!el.hasAttribute(DOM_SELECTOR)) {
				instance.destroy();
				return;
			}
			const oldClass = instance.activeClass;
			const newClass = el.getAttribute(DOM_SELECTOR) || 'active';
			if (oldClass !== newClass) {
				const links = el.querySelectorAll('a');
				for (const link of links) {
					if (oldClass) link.classList.remove(oldClass);
				}
				instance.activeClass = newClass;
			}
		} else if (attrName === 'data-ln-nav-exact') {
			instance.exact = el.hasAttribute('data-ln-nav-exact');
		}

		instance.update();
	}

	// ─── Init ──────────────────────────────────────────────────

	registerComponent(DOM_SELECTOR, DOM_ATTRIBUTE, _component, 'ln-nav', {
		extraAttributes: ['data-ln-nav-exact'],
		onAttributeChange: _syncAttribute
	});
})();

import { computePlacement, dispatch, registerComponent } from '../ln-core';

(function () {
	const TRIGGER_SELECTOR = 'data-ln-tooltip-enhance';
	const TEXT_ATTR = 'data-ln-tooltip';
	const POSITION_ATTR = 'data-ln-tooltip-position';
	const DOM_ATTRIBUTE = 'lnTooltipEnhance';
	const PORTAL_ID = 'ln-tooltip-portal';

	if (window[DOM_ATTRIBUTE] !== undefined) return;

	let uidCounter = 0;
	let portal = null;
	let activeTooltipNode = null;
	let activeTrigger = null;
	let activeStashedTitle = null;
	let escListener = null;

	function _ensurePortal() {
		if (portal && portal.parentNode) return portal;
		portal = document.getElementById(PORTAL_ID);
		if (!portal) {
			portal = document.createElement('div');
			portal.id = PORTAL_ID;
			document.body.appendChild(portal);
		}
		return portal;
	}

	function _ensureEscListener() {
		if (escListener) return;
		escListener = function (e) {
			if (e.key === 'Escape') _hide();
		};
		document.addEventListener('keydown', escListener);
	}

	function _removeEscListener() {
		if (!escListener) return;
		document.removeEventListener('keydown', escListener);
		escListener = null;
	}

	function _show(trigger) {
		if (activeTrigger === trigger) return;
		_hide();

		// Fallback: if data-ln-tooltip has no value, pull text from `title`.
		// Supports the semantic `<abbr data-ln-tooltip title="...">` pattern.
		const text = trigger.getAttribute(TEXT_ATTR) || trigger.getAttribute('title');
		if (!text) return;

		_ensurePortal();

		// Stash + strip `title` while our tooltip is visible so the browser's
		// native title tooltip does not appear alongside it. Restored on hide.
		if (trigger.hasAttribute('title')) {
			activeStashedTitle = trigger.getAttribute('title');
			trigger.removeAttribute('title');
		}

		const node = document.createElement('div');
		node.className = 'ln-tooltip';
		node.textContent = text;

		// Assign a stable id so aria-describedby can point at it.
		if (!trigger[DOM_ATTRIBUTE + 'Uid']) {
			uidCounter += 1;
			trigger[DOM_ATTRIBUTE + 'Uid'] = 'ln-tooltip-' + uidCounter;
		}
		node.id = trigger[DOM_ATTRIBUTE + 'Uid'];

		portal.appendChild(node);

		// Measure after attach (it's in the DOM with default styles).
		const w = node.offsetWidth;
		const h = node.offsetHeight;

		const rect = trigger.getBoundingClientRect();
		const preferred = trigger.getAttribute(POSITION_ATTR) || 'top';
		const placement = computePlacement(rect, { width: w, height: h }, preferred, 6);

		// Coordinate-only inline styles — same exception as ln-popover.
		node.style.top = placement.top + 'px';
		node.style.left = placement.left + 'px';
		node.setAttribute('data-ln-tooltip-placement', placement.placement);

		trigger.setAttribute('aria-describedby', node.id);

		activeTooltipNode = node;
		activeTrigger = trigger;
		_ensureEscListener();
	}

	function _hide() {
		if (!activeTooltipNode) {
			_removeEscListener();
			return;
		}
		if (activeTrigger) {
			activeTrigger.removeAttribute('aria-describedby');
			if (activeStashedTitle !== null) {
				activeTrigger.setAttribute('title', activeStashedTitle);
			}
		}
		activeStashedTitle = null;
		if (activeTooltipNode.parentNode) {
			activeTooltipNode.parentNode.removeChild(activeTooltipNode);
		}
		activeTooltipNode = null;
		activeTrigger = null;
		_removeEscListener();
	}

	// ─── Component ─────────────────────────────────────────────

	function _component(el) {
		this.dom = el;

		const self = this;
		this._onEnter = function () { _show(el); };
		this._onLeave = function () {
			if (activeTrigger === el) _hide();
		};
		this._onFocus = function () { _show(el); };
		this._onBlur = function () {
			if (activeTrigger === el) _hide();
		};

		el.addEventListener('mouseenter', this._onEnter);
		el.addEventListener('mouseleave', this._onLeave);
		el.addEventListener('focus', this._onFocus, true);
		el.addEventListener('blur', this._onBlur, true);

		return this;
	}

	_component.prototype.destroy = function () {
		const el = this.dom;
		el.removeEventListener('mouseenter', this._onEnter);
		el.removeEventListener('mouseleave', this._onLeave);
		el.removeEventListener('focus', this._onFocus, true);
		el.removeEventListener('blur', this._onBlur, true);
		if (activeTrigger === el) _hide();
		delete el[DOM_ATTRIBUTE];
		delete el[DOM_ATTRIBUTE + 'Uid'];
		dispatch(el, 'ln-tooltip:destroyed', { trigger: el });
	};

	// ─── Registration ──────────────────────────────────────────

	registerComponent(
		'[' + TRIGGER_SELECTOR + '], [' + TEXT_ATTR + '][title]',
		DOM_ATTRIBUTE,
		_component,
		'ln-tooltip'
	);
})();


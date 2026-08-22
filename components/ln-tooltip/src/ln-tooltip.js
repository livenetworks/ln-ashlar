import { computePlacement, dispatch, registerComponent } from '../../ln-core';

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
	let activeStashedDescribedBy = null;
	let escListener = null;

	function _ensurePortal() {
		if (portal && portal.parentNode) return portal;
		portal = document.getElementById(PORTAL_ID);
		if (!portal) {
			portal = document.createElement('div');
			portal.id = PORTAL_ID;
			document.body.appendChild(portal);
		}
		// Popover API gives top-layer promotion for free — no ancestor
		// overflow/z-index/transform can clip or bury the portal. `manual`
		// keeps show/hide entirely under this file's control (no native
		// light-dismiss), same convention as ln-dropdown/ln-popover.
		if (!portal.hasAttribute('popover')) {
			portal.setAttribute('popover', 'manual');
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

		// Promote before measuring: a manual popover is `display: none` (UA
		// default) until shown, and a hidden ancestor collapses the whole
		// subtree's layout box regardless of the child's own display —
		// so offsetWidth/offsetHeight below would read 0 if this ran later.
		// _hide() above already guarantees the portal is closed, so no
		// InvalidStateError risk here (matches ln-dropdown/ln-popover: bare
		// feature-detect on show, guarded feature-detect on hide).
		if (typeof portal.showPopover === 'function') portal.showPopover();

		// Stash + strip `title` while our tooltip is visible so the browser's
		// native title tooltip does not appear alongside it. Restored on hide.
		if (trigger.hasAttribute('title')) {
			activeStashedTitle = trigger.getAttribute('title');
			trigger.removeAttribute('title');
		}

		// Stash pre-existing aria-describedby
		const existingDescribedBy = trigger.getAttribute('aria-describedby');
		if (existingDescribedBy) {
			activeStashedDescribedBy = existingDescribedBy;
		} else {
			activeStashedDescribedBy = null;
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

		if (activeStashedDescribedBy) {
			trigger.setAttribute('aria-describedby', activeStashedDescribedBy + ' ' + node.id);
		} else {
			trigger.setAttribute('aria-describedby', node.id);
		}

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
			if (activeStashedDescribedBy !== null) {
				activeTrigger.setAttribute('aria-describedby', activeStashedDescribedBy);
			} else {
				activeTrigger.removeAttribute('aria-describedby');
			}
			activeStashedDescribedBy = null;

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
		// Exit the top layer — guard required: hidePopover() throws
		// InvalidStateError if called while not currently showing.
		if (portal && typeof portal.hidePopover === 'function' && portal.matches(':popover-open')) {
			portal.hidePopover();
		}
		_removeEscListener();
	}

	// ─── Component ─────────────────────────────────────────────

	function _component(el) {
		this.dom = el;

		// Set data-ln-tooltip-enhanced attribute so CSS knows JS has taken over,
		// preventing the CSS ::after fallback from rendering when `title` is stashed/removed.
		if (!el.hasAttribute('data-ln-tooltip-enhanced')) {
			el.setAttribute('data-ln-tooltip-enhanced', '');
			this._addedEnhancedAttr = true;
		}

		this._onEnter = function () { _show(el); };
		this._onLeave = function () {
			if (activeTrigger === el && !el.contains(document.activeElement)) _hide();
		};
		this._onFocus = function () { _show(el); };
		this._onBlur = function () {
			if (activeTrigger === el && !el.matches(':hover')) _hide();
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
		if (this._addedEnhancedAttr) {
			el.removeAttribute('data-ln-tooltip-enhanced');
		}
		delete el[DOM_ATTRIBUTE];
		delete el[DOM_ATTRIBUTE + 'Uid'];
		dispatch(el, 'ln-tooltip:destroyed', { trigger: el });
	};

	// ─── Registration ──────────────────────────────────────────

	registerComponent(
		'[' + TRIGGER_SELECTOR + '], [data-ln-tooltip-enhanced], [' + TEXT_ATTR + '][title]',
		DOM_ATTRIBUTE,
		_component,
		'ln-tooltip'
	);
})();


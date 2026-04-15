import { guardBody, computePlacement, dispatch } from '../ln-core';

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

	// ─── Trigger attach ────────────────────────────────────────

	function _attachTrigger(el) {
		if (el[DOM_ATTRIBUTE]) return;
		el[DOM_ATTRIBUTE] = true;

		const onEnter = function () { _show(el); };
		const onLeave = function () {
			if (activeTrigger === el) _hide();
		};
		const onFocus = function () { _show(el); };
		const onBlur = function () {
			if (activeTrigger === el) _hide();
		};

		el.addEventListener('mouseenter', onEnter);
		el.addEventListener('mouseleave', onLeave);
		el.addEventListener('focus', onFocus, true);
		el.addEventListener('blur', onBlur, true);

		// Stash for cleanup if anyone calls destroy.
		el[DOM_ATTRIBUTE + 'Cleanup'] = function () {
			el.removeEventListener('mouseenter', onEnter);
			el.removeEventListener('mouseleave', onLeave);
			el.removeEventListener('focus', onFocus, true);
			el.removeEventListener('blur', onBlur, true);
			if (activeTrigger === el) _hide();
			delete el[DOM_ATTRIBUTE];
			delete el[DOM_ATTRIBUTE + 'Cleanup'];
			delete el[DOM_ATTRIBUTE + 'Uid'];
			dispatch(el, 'ln-tooltip:destroyed', { trigger: el });
		};
	}

	function _findTriggers(root) {
		if (!root || root.nodeType !== 1) return;
		const items = Array.from(root.querySelectorAll('[' + TRIGGER_SELECTOR + ']'));
		if (root.hasAttribute && root.hasAttribute(TRIGGER_SELECTOR)) {
			items.push(root);
		}
		for (const el of items) {
			_attachTrigger(el);
		}
	}

	function constructor(domRoot) {
		_findTriggers(domRoot);
	}

	// ─── DOM Observer ──────────────────────────────────────────

	function _domObserver() {
		guardBody(function () {
			const observer = new MutationObserver(function (mutations) {
				for (let i = 0; i < mutations.length; i++) {
					const mutation = mutations[i];
					if (mutation.type === 'childList') {
						for (let j = 0; j < mutation.addedNodes.length; j++) {
							const node = mutation.addedNodes[j];
							if (node.nodeType === 1) _findTriggers(node);
						}
					} else if (mutation.type === 'attributes') {
						_findTriggers(mutation.target);
					}
				}
			});

			observer.observe(document.body, {
				childList: true,
				subtree: true,
				attributes: true,
				attributeFilter: [TRIGGER_SELECTOR, TEXT_ATTR]
			});
		}, 'ln-tooltip');
	}

	// ─── Init ──────────────────────────────────────────────────

	window[DOM_ATTRIBUTE] = constructor;
	_domObserver();

	if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', function () {
			constructor(document.body);
		});
	} else {
		constructor(document.body);
	}
})();

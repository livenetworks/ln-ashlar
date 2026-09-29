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

// ─── Visibility Check ─────────────────────────────────────

export function isVisible(el) {
	return !!(el.offsetWidth || el.offsetHeight || el.getClientRects().length);
}

/**
 * Determines whether a mouse click event should be ignored (modified click or non-primary button).
 * @param {MouseEvent|Object} [event]
 * @returns {boolean}
 */
export function shouldIgnoreClick(event) {
	if (!event) return true;
	if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return true;
	if (typeof event.button === 'number' && event.button !== 0) return true;
	return false;
}

/**
 * Checks if a target element is an active editable field or contenteditable element.
 * @param {Element|Object} [target]
 * @returns {boolean}
 */
export function isEditableTarget(target) {
	if (!target) return false;
	if (typeof target.closest === 'function') {
		return Boolean(target.closest('input, textarea, select, [contenteditable]:not([contenteditable="false"])'));
	}
	const tag = String(target.tagName || '').toLowerCase();
	return tag === 'input' || tag === 'textarea' || tag === 'select' || Boolean(target.isContentEditable);
}

/**
 * Checks if a target element is disabled, aria-disabled, or inside an inert container.
 * @param {Element|Object} [target]
 * @returns {boolean}
 */
export function isTargetDisabled(target) {
	if (!target) return true;
	if (target.disabled || (typeof target.getAttribute === 'function' && target.getAttribute('aria-disabled') === 'true')) {
		return true;
	}
	if (typeof target.closest === 'function' && target.closest('[inert]')) {
		return true;
	}
	return false;
}

/**
 * Checks if a target element is connected, enabled, not inert, visible, and optionally supports an action method.
 * @param {Element} target
 * @param {string} [action]
 * @returns {boolean}
 */
export function isUsableTarget(target, action) {
	if (!target || !document.contains(target)) return false;
	if (isTargetDisabled(target)) return false;
	if (action && typeof target[action] !== 'function') return false;
	return isVisible(target);
}

/**
 * Checks if a link click should be intercepted by client-side routing.
 * Must be standard navigation click (left button, no modifiers), same origin,
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
 * Read the raw machine value behind a formatted cell/item display.
 * Returns the `data-ln-value` attribute if present, else trimmed textContent.
 * Single read path for value-based sort/filter across components.
 */
export function readValue(el) {
	if (el.hasAttribute('data-ln-value')) {
		return el.getAttribute('data-ln-value');
	}
	if (el.tagName === 'TIME' && el.hasAttribute('datetime')) {
		return el.getAttribute('datetime');
	}
	if (el.tagName === 'DATA' && el.hasAttribute('value')) {
		return el.getAttribute('value');
	}
	return el.textContent.trim();
}

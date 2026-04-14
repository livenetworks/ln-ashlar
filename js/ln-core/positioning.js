// ─── Positioning ───────────────────────────────────────────
//
// Pure helpers for floating UI (popovers, tooltips, dropdowns).
// No DOM side effects in computePlacement — it takes a rect and
// returns coordinates. teleportToBody and measureHidden touch DOM
// because they have to.

/**
 * Compute viewport coordinates for a floating element relative to an
 * anchor rect. Tries the preferred placement first, then opposite,
 * then the perpendicular pair, then pins to viewport edge.
 *
 * Returns { top, left, placement } in viewport pixels. `placement`
 * is the side that won (one of 'top' | 'bottom' | 'left' | 'right').
 *
 * Edge cases:
 *  - Anchor scrolled off-screen: returns coordinates relative to viewport
 *    anyway; caller decides whether to hide.
 *  - Floating element larger than viewport on an axis: pins to 0 on that
 *    axis and accepts overflow.
 *  - Zero-sized anchor: treated as a point at its top/left.
 *
 * @param {DOMRect|{top:number,left:number,right:number,bottom:number,width:number,height:number}} anchorRect
 * @param {{width:number, height:number}} floatingSize
 * @param {'top'|'bottom'|'left'|'right'} preferred
 * @param {number} offset Gap in pixels between anchor and floating element.
 * @returns {{top:number, left:number, placement:string}}
 */
export function computePlacement(anchorRect, floatingSize, preferred, offset) {
	const gap = typeof offset === 'number' ? offset : 4;
	const vw = window.innerWidth;
	const vh = window.innerHeight;
	const fw = floatingSize.width;
	const fh = floatingSize.height;

	// Fallback chain for each preferred side.
	const chains = {
		top:    ['top', 'bottom', 'right', 'left'],
		bottom: ['bottom', 'top', 'right', 'left'],
		left:   ['left', 'right', 'top', 'bottom'],
		right:  ['right', 'left', 'top', 'bottom']
	};

	const chain = chains[preferred] || chains.bottom;

	function tryPlace(side) {
		let top;
		let left;
		let fits = true;

		if (side === 'top') {
			top = anchorRect.top - gap - fh;
			left = anchorRect.left + (anchorRect.width - fw) / 2;
			if (top < 0) fits = false;
		} else if (side === 'bottom') {
			top = anchorRect.bottom + gap;
			left = anchorRect.left + (anchorRect.width - fw) / 2;
			if (top + fh > vh) fits = false;
		} else if (side === 'left') {
			top = anchorRect.top + (anchorRect.height - fh) / 2;
			left = anchorRect.left - gap - fw;
			if (left < 0) fits = false;
		} else { // right
			top = anchorRect.top + (anchorRect.height - fh) / 2;
			left = anchorRect.right + gap;
			if (left + fw > vw) fits = false;
		}

		// Cross-axis fit check (don't reject; we'll clamp later)
		// We only treat the main axis as a hard "doesn't fit" signal.
		return { top: top, left: left, side: side, fits: fits };
	}

	let chosen = null;
	for (let i = 0; i < chain.length; i++) {
		const r = tryPlace(chain[i]);
		if (r.fits) { chosen = r; break; }
	}
	if (!chosen) {
		// Nothing fits cleanly — use the preferred side and let clamping
		// handle the overflow.
		chosen = tryPlace(chain[0]);
	}

	// Clamp to viewport. If the floating element is larger than the
	// viewport on an axis, pin to 0 and accept overflow.
	let top = chosen.top;
	let left = chosen.left;

	if (fw >= vw) {
		left = 0;
	} else {
		if (left < 0) left = 0;
		if (left + fw > vw) left = vw - fw;
	}

	if (fh >= vh) {
		top = 0;
	} else {
		if (top < 0) top = 0;
		if (top + fh > vh) top = vh - fh;
	}

	return { top: top, left: left, placement: chosen.side };
}

/**
 * Move an element into <body>, leaving a placeholder comment so
 * teleportBack can put it back exactly where it was. Returns a
 * cleanup function — call it to restore the element to its origin.
 *
 * The element receives `position: fixed` style automatically (the
 * caller is responsible for top/left). To avoid violating the
 * "no inline styles" rule, the caller should set position via a
 * CSS rule on its component selector (e.g. [data-ln-popover]
 * already has position: fixed in its co-located scss). teleportToBody
 * itself does NOT set any inline styles.
 *
 * @param {HTMLElement} el
 * @returns {Function} cleanup — restores el to its original parent.
 */
export function teleportToBody(el) {
	if (!el || el.parentNode === document.body) {
		// Already in body or no element — return a no-op cleanup.
		return function () {};
	}

	const originalParent = el.parentNode;
	const placeholder = document.createComment('ln-teleport');
	originalParent.insertBefore(placeholder, el);
	document.body.appendChild(el);

	return function restore() {
		if (!placeholder.parentNode) return;
		placeholder.parentNode.insertBefore(el, placeholder);
		placeholder.parentNode.removeChild(placeholder);
	};
}

/**
 * Measure an element that may be hidden via display:none.
 * Temporarily applies visibility:hidden + display:block so we can
 * read offsetWidth/offsetHeight without flicker, then restores.
 *
 * Note: this does mutate inline style briefly (project rule allows
 * temporary measurement; ln-dropdown uses the same pattern). Style
 * is restored before the function returns.
 *
 * @param {HTMLElement} el
 * @returns {{width:number, height:number}}
 */
export function measureHidden(el) {
	if (!el) return { width: 0, height: 0 };

	const cs = el.style;
	const prevVisibility = cs.visibility;
	const prevDisplay = cs.display;
	const prevPosition = cs.position;

	// Force a layout we can measure regardless of current display.
	cs.visibility = 'hidden';
	cs.display = 'block';
	cs.position = 'fixed';

	const width = el.offsetWidth;
	const height = el.offsetHeight;

	cs.visibility = prevVisibility;
	cs.display = prevDisplay;
	cs.position = prevPosition;

	return { width: width, height: height };
}

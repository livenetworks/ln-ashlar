// ─── Positioning ───────────────────────────────────────────
//
// Pure helpers for floating UI (popovers, tooltips, dropdowns).
// No DOM side effects in computePlacement — it takes a rect and
// returns coordinates. measureHidden touches DOM because it has to.

/**
 * Compute viewport coordinates for a floating element relative to an
 * anchor rect. Tries the preferred placement first, then opposite,
 * then the perpendicular pair, then pins to viewport edge.
 *
 * Returns { top, left, placement } in viewport pixels. `placement`
 * is the side that won (one of 'top' | 'bottom' | 'left' | 'right').
 *
 * Accepts floating-ui-style placement strings:
 *   '<side>'            — side only, alignment defaults to 'center'
 *   '<side>-start'      — aligned to start (left for top/bottom, top for left/right)
 *   '<side>-end'        — aligned to end   (right for top/bottom, bottom for left/right)
 *
 * Alignment is preserved through the fallback chain (e.g. 'bottom-end' → 'top-end'
 * if no room below). The returned `placement` reports the winning side only,
 * not the alignment (e.g. 'bottom', not 'bottom-end') — backward compatible with
 * all existing callers that pass bare 'top' / 'bottom' / 'left' / 'right'.
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
 * @param {'top'|'bottom'|'left'|'right'|'top-start'|'top-end'|'bottom-start'|'bottom-end'|'left-start'|'left-end'|'right-start'|'right-end'} preferred
 * @param {number} offset Gap in pixels between anchor and floating element.
 * @returns {{top:number, left:number, placement:string}}
 */
export function computePlacement(anchorRect, floatingSize, preferred, offset) {
	const gap = typeof offset === 'number' ? offset : 4;
	const vw = window.innerWidth;
	const vh = window.innerHeight;
	const fw = floatingSize.width;
	const fh = floatingSize.height;

	// Parse '<side>' or '<side>-<alignment>' placement string.
	const parts = (preferred || 'bottom').split('-');
	const side0 = parts[0];
	// 'start' | 'end' | 'center' (default when no suffix)
	const alignment = (parts[1] === 'start' || parts[1] === 'end') ? parts[1] : 'center';

	// Fallback chain for each preferred side.
	const chains = {
		top:    ['top', 'bottom', 'right', 'left'],
		bottom: ['bottom', 'top', 'right', 'left'],
		left:   ['left', 'right', 'top', 'bottom'],
		right:  ['right', 'left', 'top', 'bottom']
	};

	const chain = chains[side0] || chains.bottom;

	// Compute the cross-axis (alignment) offset for a given side.
	// For top/bottom sides the cross axis is horizontal (left).
	// For left/right sides the cross axis is vertical (top).
	function crossOffset(side) {
		if (side === 'top' || side === 'bottom') {
			if (alignment === 'start') return anchorRect.left;
			if (alignment === 'end')   return anchorRect.right - fw;
			// center (default)
			return anchorRect.left + (anchorRect.width - fw) / 2;
		} else {
			// left / right
			if (alignment === 'start') return anchorRect.top;
			if (alignment === 'end')   return anchorRect.bottom - fh;
			// center (default)
			return anchorRect.top + (anchorRect.height - fh) / 2;
		}
	}

	function tryPlace(side) {
		let top;
		let left;
		let fits = true;

		if (side === 'top') {
			top = anchorRect.top - gap - fh;
			left = crossOffset(side);
			if (top < 0) fits = false;
		} else if (side === 'bottom') {
			top = anchorRect.bottom + gap;
			left = crossOffset(side);
			if (top + fh > vh) fits = false;
		} else if (side === 'left') {
			top = crossOffset(side);
			left = anchorRect.left - gap - fw;
			if (left < 0) fits = false;
		} else { // right
			top = crossOffset(side);
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

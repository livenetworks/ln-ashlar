/**
 * Pure decision layer for the multi-region navigation pipeline. Takes DOM-read
 * descriptors (one per registered region) and decides which regions clear,
 * which swap, and which owns title/focus/scroll — without touching the DOM.
 *
 * descriptors: ordered array of
 *   { regionKey, match, targetEl, isPending, hasKeep, hasHydrate, hasChildren, mountedTemplate }
 *
 * @param {Array<Object>} descriptors
 * @param {Object} [options]
 * @param {boolean} [options.isHydration]
 * @param {boolean} [options.hasPrimaryRegion]
 * @param {Object|null} [options.primaryMatch]
 * @returns {{ notFound: boolean, clears: Array<Object>, swaps: Array<Object>, owner: Object|null }}
 */
export function planRegions(descriptors, { isHydration = false, hasPrimaryRegion = false, primaryMatch = null } = {}) {
	const notFound = hasPrimaryRegion
		? !primaryMatch
		: !descriptors.some(d => d.match);

	const clears = [];
	const swaps = [];

	for (const d of descriptors) {
		if (!d.targetEl && !d.isPending) continue;

		if (!d.match) {
			const isHydrationKeep = isHydration && d.hasHydrate && d.hasChildren;
			if (!d.hasKeep && d.hasChildren && !isHydrationKeep && d.targetEl) {
				clears.push(d);
			}
			continue;
		}

		if (d.hasKeep && d.mountedTemplate === d.match.route.templateNode) {
			continue; // keep-region, same template already mounted — neither swap nor clear
		}

		swaps.push(Object.assign({}, d, {
			skipMount: isHydration && d.hasHydrate && d.hasChildren
		}));
	}

	swaps.sort((a, b) => (a.regionKey === '__primary__' ? -1 : b.regionKey === '__primary__' ? 1 : 0));

	const primarySwap = swaps.find(d => d.regionKey === '__primary__');
	const owner = primarySwap || swaps[0] || null;

	return { notFound, clears, swaps, owner };
}

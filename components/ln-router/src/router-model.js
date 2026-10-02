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

/**
 * Normalizes a base URL string:
 * - ensures leading slash
 * - strips trailing slash
 * - returns empty string if root '/' or empty
 * e.g. '/spa/' -> '/spa', 'spa' -> '/spa', '/' -> '', '' -> ''
 *
 * @param {string|null|undefined} base
 * @returns {string}
 */
export function normalizeBase(base) {
	if (!base || typeof base !== 'string') return '';
	let b = base.trim().replace(/\/+$/, '');
	if (!b || b === '/') return '';
	return b.startsWith('/') ? b : '/' + b;
}

/**
 * Strips the base URL prefix from a pathname, returning the clean relative path.
 * e.g. with base '/spa':
 * '/spa/packages' -> '/packages'
 * '/spa' -> '/'
 * '/spa/' -> '/'
 * '/packages' -> '/packages' (already relative)
 * '/' -> '/'
 *
 * @param {string} path
 * @param {string} [base]
 * @returns {string}
 */
export function stripBase(path, base) {
	const b = normalizeBase(base);
	if (!b) return (path && path.replace(/\/+$/, '')) || '/';

	const normalizedPath = (path || '/').replace(/\/+$/, '') || '/';

	if (normalizedPath === b) {
		return '/';
	}
	if (normalizedPath.startsWith(b + '/')) {
		const rel = normalizedPath.slice(b.length);
		return rel.replace(/\/+$/, '') || '/';
	}
	return normalizedPath;
}

/**
 * Converts a relative path into an absolute path prefixed with base.
 * Preserves query strings and hashes.
 * e.g. with base '/spa':
 * '/packages' -> '/spa/packages'
 * '/' -> '/spa/'
 * 'packages' -> '/spa/packages'
 * '/spa/packages' -> '/spa/packages' (already prefixed)
 *
 * @param {string} relPath
 * @param {string} [base]
 * @returns {string}
 */
export function toAbsoluteUrl(relPath, base) {
	const b = normalizeBase(base);
	if (!b) return relPath || '/';

	const str = relPath || '/';
	const hashIdx = str.indexOf('#');
	const pathAndQuery = hashIdx !== -1 ? str.slice(0, hashIdx) : str;
	const hash = hashIdx !== -1 ? str.slice(hashIdx) : '';

	const queryIdx = pathAndQuery.indexOf('?');
	const pathname = queryIdx !== -1 ? pathAndQuery.slice(0, queryIdx) : pathAndQuery;
	const queryString = queryIdx !== -1 ? pathAndQuery.slice(queryIdx) : '';

	let absPath;
	if (pathname === b) {
		absPath = b + '/';
	} else if (pathname.startsWith(b + '/')) {
		absPath = pathname;
	} else {
		const cleanRel = pathname.startsWith('/') ? pathname : '/' + pathname;
		absPath = cleanRel === '/' ? b + '/' : b + cleanRel;
	}

	return absPath + queryString + hash;
}

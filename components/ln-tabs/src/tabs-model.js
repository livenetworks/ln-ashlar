/**
 * Derives a tab key from an explicit attribute or anchor href hash fragment.
 * @param {string|null} explicitTabAttr
 * @param {string} tagName
 * @param {string|null} href
 * @param {string|null} [nsKey]
 * @returns {string}
 */
export function deriveKeyFromTrigger(explicitTabAttr, tagName, href, nsKey) {
	const explicit = (explicitTabAttr || '').toLowerCase().trim();
	if (explicit) return explicit;

	if ((tagName || '').toUpperCase() !== 'A') return '';

	const rawHref = href || '';
	if (!rawHref.startsWith('#')) return '';

	const raw = rawHref.slice(1);
	if (!raw) return '';

	const fragments = raw.split('&');
	const normalizedNs = (nsKey || '').toLowerCase().trim();

	if (normalizedNs) {
		for (const frag of fragments) {
			const sep = frag.indexOf(':');
			if (sep > 0 && frag.slice(0, sep).toLowerCase().trim() === normalizedNs) {
				return frag.slice(sep + 1).toLowerCase().trim();
			}
		}
	}

	const last = fragments[fragments.length - 1] || '';
	const sep = last.indexOf(':');
	return (sep > 0 ? last.slice(sep + 1) : last).toLowerCase().trim();
}

/**
 * Determines whether tabs should use URL hash sync mode or local persist mode.
 * @param {Array<{ tagName: string, href?: string|null }>} triggers
 * @param {string|null} nsKey
 * @returns {{ hashEnabled: boolean, warning: 'mixed' | 'missing-namespace' | null }}
 */
export function determineTabsMode(triggers, nsKey) {
	if (!Array.isArray(triggers) || triggers.length === 0) {
		return { hashEnabled: false, warning: null };
	}

	const anchorTabs = triggers.filter(
		t => (t.tagName || '').toUpperCase() === 'A' && (t.href || '').startsWith('#')
	);
	const allAnchors = anchorTabs.length > 0 && anchorTabs.length === triggers.length;
	const normalizedNs = (nsKey || '').toLowerCase().trim();

	if (anchorTabs.length > 0 && anchorTabs.length !== triggers.length) {
		return { hashEnabled: false, warning: 'mixed' };
	}

	if (allAnchors && !normalizedNs) {
		return { hashEnabled: false, warning: 'missing-namespace' };
	}

	return {
		hashEnabled: allAnchors && Boolean(normalizedNs),
		warning: null
	};
}

/**
 * Resolves the valid active key against registered panel keys with fallback.
 * @param {string|null} requestedKey
 * @param {string[]} validPanelKeys
 * @param {string} defaultKey
 * @returns {string}
 */
export function resolveActiveTabKey(requestedKey, validPanelKeys, defaultKey) {
	const key = (requestedKey || '').toLowerCase().trim();
	if (key && Array.isArray(validPanelKeys) && validPanelKeys.includes(key)) {
		return key;
	}
	return (defaultKey || '').toLowerCase().trim();
}

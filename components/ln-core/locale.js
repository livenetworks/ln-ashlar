import { dispatch } from './events.js';
import { guardBody } from './dom.js';

// ─── Locale Detection ─────────────────────────────────────

export function getLocale(el) {
	const langEl = el ? el.closest('[lang]') : null;
	const raw = (langEl ? (langEl.getAttribute('lang') || langEl.lang) : null)
		|| (typeof document !== 'undefined' && document.documentElement ? (document.documentElement.getAttribute('lang') || document.documentElement.lang) : null)
		|| (typeof navigator !== 'undefined' ? navigator.language : null);
	return raw ? raw.trim() : 'en-US';
}

// ─── Shared Locale-Change Broadcaster ─────────────────────

export function ensureLocaleObserver() {
	if (typeof window === 'undefined') return;
	window.lnCore = window.lnCore || {};
	if (window.lnCore._localeObserverBound) return;
	window.lnCore._localeObserverBound = true;

	guardBody(function () {
		const observer = new MutationObserver(function () {
			dispatch(document, 'ln-core:locale-change', {});
		});
		observer.observe(document.documentElement, {
			attributes: true,
			attributeFilter: ['lang'],
			subtree: true
		});
	}, 'ln-core');
}

// ─── Locale Fallback Registry ───────────────────────────────
const _localeFallbacks = {};

export function registerLocaleFallback(langPrefix, dictionary) {
	if (!langPrefix || typeof dictionary !== 'object') return;
	const prefix = langPrefix.toLowerCase().split('-')[0];
	_localeFallbacks[prefix] = dictionary;
}

export function getLocaleFallback(lang) {
	if (!lang) return null;
	const prefix = lang.toLowerCase().split('-')[0];
	return _localeFallbacks[prefix] || null;
}


if (typeof window !== 'undefined') {
	window.lnCore = window.lnCore || {};
	window.lnCore.registerLocaleFallback = registerLocaleFallback;
	window.lnCore.getLocaleFallback = getLocaleFallback;
	window.lnCore.ensureLocaleObserver = ensureLocaleObserver;
}

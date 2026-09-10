import { guardBody, observeAttributes, setDebugSink } from '../../ln-core/index.js';
import { consoleSink } from './console-sink.js';

// ─── Console Observation Gate ──────────────────────────────
//
// The single place that decides whether data-ln-debug is active. Installs
// or removes ln-core's shared console sink accordingly — no other
// component ever carries a debug conditional. Mirrors ln-core's
// ensureLocaleObserver() shape: guarded-once installer, live re-sync on
// attribute mutation.

function _isDebugActive() {
	return document.documentElement.hasAttribute('data-ln-debug') ||
		(document.body && document.body.hasAttribute('data-ln-debug'));
}

function _syncSink() {
	setDebugSink(_isDebugActive() ? consoleSink : null);
}

export function ensureDebugGate() {
	if (typeof window === 'undefined') return;
	window.lnCore = window.lnCore || {};
	if (window.lnCore._debugGateBound) return;
	window.lnCore._debugGateBound = true;

	_syncSink();

	// <body data-ln-debug> — the shared body attribute observer already
	// covers body's own attributes; just hook a raw handler into it.
	observeAttributes(['data-ln-debug'], _syncSink);

	// <html data-ln-debug> — outside the body observer's subtree.
	guardBody(function () {
		const observer = new MutationObserver(_syncSink);
		observer.observe(document.documentElement, {
			attributes: true,
			attributeFilter: ['data-ln-debug']
		});
	}, 'ln-debug');
}

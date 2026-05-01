import { registerComponent } from '../ln-core';

(function () {
	const DOM_SELECTOR = 'data-ln-time';
	const DOM_ATTRIBUTE = 'lnTime';

	if (window[DOM_ATTRIBUTE] !== undefined) return;

	// ─── Formatter Cache ──────────────────────────────────────
	const _formatters = {};
	const _relativeFormatters = {};

	function _getLocale(el) {
		return el.getAttribute('data-ln-time-locale')
			|| document.documentElement.lang
			|| undefined;
	}

	function _getFormatter(locale, options) {
		const key = (locale || '') + '|' + JSON.stringify(options);
		if (!_formatters[key]) {
			_formatters[key] = new Intl.DateTimeFormat(locale, options);
		}
		return _formatters[key];
	}

	function _getRelativeFormatter(locale) {
		const key = locale || '';
		if (!_relativeFormatters[key]) {
			_relativeFormatters[key] = new Intl.RelativeTimeFormat(locale, { numeric: 'auto', style: 'narrow' });
		}
		return _relativeFormatters[key];
	}

	// ─── Auto-Update Pool ─────────────────────────────────────
	const _relativeElements = new Set();
	let _intervalId = null;

	function _startInterval() {
		if (_intervalId) return;
		_intervalId = setInterval(_tickRelative, 60000);
	}

	function _stopInterval() {
		if (_intervalId) {
			clearInterval(_intervalId);
			_intervalId = null;
		}
	}

	function _tickRelative() {
		for (const instance of _relativeElements) {
			if (!document.body.contains(instance.dom)) {
				_relativeElements.delete(instance);
				continue;
			}
			_render(instance);
		}
		if (_relativeElements.size === 0) _stopInterval();
	}

	// ─── Formatting ───────────────────────────────────────────
	function _formatFull(date, locale) {
		return _getFormatter(locale, { dateStyle: 'long', timeStyle: 'short' }).format(date);
	}

	function _formatShort(date, locale) {
		const now = new Date();
		const options = { month: 'short', day: 'numeric' };
		if (date.getFullYear() !== now.getFullYear()) {
			options.year = 'numeric';
		}
		return _getFormatter(locale, options).format(date);
	}

	function _formatDate(date, locale) {
		return _getFormatter(locale, { dateStyle: 'medium' }).format(date);
	}

	function _formatTime(date, locale) {
		return _getFormatter(locale, { timeStyle: 'short' }).format(date);
	}

	function _formatRelative(date, locale) {
		const nowSec = Math.floor(Date.now() / 1000);
		const thenSec = Math.floor(date.getTime() / 1000);
		const diff = thenSec - nowSec;
		const absDiff = Math.abs(diff);

		if (absDiff < 10) return _getRelativeFormatter(locale).format(0, 'second');

		let unit, value;
		if (absDiff < 60) {
			unit = 'second'; value = diff;
		} else if (absDiff < 3600) {
			unit = 'minute'; value = Math.round(diff / 60);
		} else if (absDiff < 86400) {
			unit = 'hour'; value = Math.round(diff / 3600);
		} else if (absDiff < 604800) {
			unit = 'day'; value = Math.round(diff / 86400);
		} else if (absDiff < 2592000) {
			unit = 'week'; value = Math.round(diff / 604800);
		} else {
			return _formatShort(date, locale);
		}

		return _getRelativeFormatter(locale).format(value, unit);
	}

	// ─── Render ───────────────────────────────────────────────
	function _render(instance) {
		const raw = instance.dom.getAttribute('datetime');
		if (!raw) return;

		const timestamp = Number(raw);
		if (isNaN(timestamp)) return;

		const date = new Date(timestamp * 1000);
		const mode = instance.dom.getAttribute(DOM_SELECTOR) || 'short';
		const locale = _getLocale(instance.dom);
		let text;

		switch (mode) {
			case 'relative': text = _formatRelative(date, locale); break;
			case 'full':     text = _formatFull(date, locale);     break;
			case 'date':     text = _formatDate(date, locale);     break;
			case 'time':     text = _formatTime(date, locale);     break;
			default:         text = _formatShort(date, locale);    break;
		}

		instance.dom.textContent = text;
		if (mode !== 'full') {
			instance.dom.title = _formatFull(date, locale);
		}
	}

	// ─── Component ────────────────────────────────────────────
	function _constructor(dom) {
		this.dom = dom;
		_render(this);

		if (dom.getAttribute(DOM_SELECTOR) === 'relative') {
			_relativeElements.add(this);
			_startInterval();
		}

		return this;
	}

	_constructor.prototype.render = function () {
		_render(this);
	};

	_constructor.prototype.destroy = function () {
		_relativeElements.delete(this);
		if (_relativeElements.size === 0) _stopInterval();
		delete this.dom[DOM_ATTRIBUTE];
	};

	// ─── Attribute / Mutation Hooks ───────────────────────────

	function _onAttributeChange(el) {
		const instance = el[DOM_ATTRIBUTE];
		if (!instance) return;
		const mode = el.getAttribute(DOM_SELECTOR);
		if (mode === 'relative') {
			_relativeElements.add(instance);
			_startInterval();
		} else {
			_relativeElements.delete(instance);
			if (_relativeElements.size === 0) _stopInterval();
		}
		_render(instance);
	}

	function _onInit(node) {
		// Re-render any data-ln-time element in the mutation target subtree.
		// Covers `datetime` extra-attribute changes (extras don't fire onAttributeChange).
		if (node.nodeType !== 1) return;
		if (node.hasAttribute && node.hasAttribute(DOM_SELECTOR) && node[DOM_ATTRIBUTE]) {
			_render(node[DOM_ATTRIBUTE]);
		}
	}

	// ─── Registration ─────────────────────────────────────────

	registerComponent(DOM_SELECTOR, DOM_ATTRIBUTE, _constructor, 'ln-time', {
		extraAttributes: ['datetime'],
		onAttributeChange: _onAttributeChange,
		onInit: _onInit
	});
})();

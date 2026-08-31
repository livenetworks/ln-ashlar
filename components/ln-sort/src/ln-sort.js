import { compareValues, detectValueType, dispatchCancelable, getLocale, hashGet, hashSet, hashSortDecode, hashSortEncode, persistGet, persistSet, queueBoot, readValue, registerComponent, resolveHashNamespace } from '../../ln-core';
import { createSortComparator, getAriaSortValue, isSameSortTarget, normalizeSortDirection } from './sort-model.js';

(function () {
	const DOM_SELECTOR = 'data-ln-sort';
	const DOM_ATTRIBUTE = 'lnSort';
	const FIELD_ATTR = 'data-ln-sort-field';
	const STATE_ATTR = 'data-ln-sort-state';
	const DIR_ATTR = 'data-ln-sort-dir';
	const ITEMS_ATTR = 'data-ln-sort-items';
	const HASH_ATTR = 'data-ln-hash';

	if (window[DOM_ATTRIBUTE] !== undefined) return;

	// Target-scoped initial DOM order cache.
	const _targetInitialOrders = new WeakMap();

	function _readItemValue(item, field) {
		if (field) {
			const el = item.querySelector('[data-ln-field="' + field + '"]');
			if (el) return readValue(el);
		}
		return readValue(item);
	}

	// ─── Component ─────────────────────────────────────────────

	function _component(dom) {
		this.dom = dom;
		this.targetId = dom.getAttribute(DOM_SELECTOR);
		this.field = dom.getAttribute(FIELD_ATTR) || null;

		const th = dom.closest('th');
		this.column = (!this.field && th) ? th.cellIndex : null;

		this.itemsSelector = dom.getAttribute(ITEMS_ATTR) || null;
		this._state = normalizeSortDirection(dom.getAttribute(STATE_ATTR));
		this._destroyed = false;

		this.nsKey = resolveHashNamespace(dom, 'sort');
		this.hashEnabled = !!this.nsKey;

		const self = this;

		this._onClick = function (e) {
			const btn = e.target.closest('[' + DIR_ATTR + ']');
			if (!btn) return;
			const nextDir = normalizeSortDirection(btn.getAttribute(DIR_ATTR));
			self._apply(nextDir);
		};
		dom.addEventListener('click', this._onClick);

		this._onSortChange = function (e) {
			if (self._destroyed || !e.detail) return;
			const target = self._resolveTarget();
			const isOurTarget = (target && (e.target === target || target.contains(e.target)))
				|| (e.detail.targetId && e.detail.targetId === self.targetId);
			if (!isOurTarget) return;

			const same = isSameSortTarget(
				{ field: self.field, column: self.column },
				{ field: e.detail.field, column: e.detail.column }
			);

			if (same) {
				const nextDir = normalizeSortDirection(e.detail.direction);
				if (nextDir && dom.getAttribute(STATE_ATTR) !== nextDir) {
					self._state = nextDir;
					dom.setAttribute(STATE_ATTR, nextDir);
					self._updateAriaSort(nextDir);
				}
				return;
			}

			// Mutual exclusion: reset losing instances without re-dispatching
			if (dom.getAttribute(STATE_ATTR) !== 'none') {
				self._state = 'none';
				dom.setAttribute(STATE_ATTR, 'none');
				self._updateAriaSort('none');
			}
			if (dom.hasAttribute('data-ln-persist')) persistSet('sort', dom, null);
		};
		document.addEventListener('ln-sort:change', this._onSortChange);

		// ─── Hash change listener ──────────────────────────────────
		this._onHashChange = function () {
			if (self._destroyed || !self.hashEnabled) return;
			const val = hashGet(self.nsKey);
			const decoded = hashSortDecode(val);
			if (decoded) {
				const matches = (self.field !== null && decoded.fieldOrColumn === self.field)
					|| (self.column !== null && String(self.column) === decoded.fieldOrColumn);
				if (matches) {
					if (self._state !== decoded.direction) self._apply(decoded.direction, true);
				} else {
					if (self._state !== 'none') {
						self._state = 'none';
						dom.setAttribute(STATE_ATTR, 'none');
						self._updateAriaSort('none');
					}
				}
			} else {
				if (self._state !== 'none') {
					self._state = 'none';
					dom.setAttribute(STATE_ATTR, 'none');
					self._updateAriaSort('none');
					const target = self._resolveTarget();
					if (target) {
						const evt = dispatchCancelable(target, 'ln-sort:change', {
							field: self.field,
							column: self.column,
							direction: 'none',
							targetId: self.targetId
						});
						if (!evt.defaultPrevented) self._defaultSort(target, 'none');
					}
				}
			}
		};

		if (this.hashEnabled) {
			window.addEventListener('hashchange', this._onHashChange);
		}

		// ─── Restore State on Boot ─────────────────────────────────
		let restored = false;

		if (this.hashEnabled) {
			const hashVal = hashGet(this.nsKey);
			const decoded = hashSortDecode(hashVal);
			if (decoded) {
				const matches = (self.field !== null && decoded.fieldOrColumn === self.field)
					|| (self.column !== null && String(self.column) === decoded.fieldOrColumn);
				if (matches) {
					queueBoot(function () {
						if (self._destroyed) return;
						self._apply(decoded.direction, true);
					});
				}
				restored = true;
			}
		}

		if (!restored && dom.hasAttribute('data-ln-persist')) {
			const saved = persistGet('sort', dom);
			if (saved && saved.direction && saved.direction !== 'none') {
				queueBoot(function () {
					if (self._destroyed) return;
					self._apply(saved.direction, true);
				});
			}
			restored = true;
		}

		if (!restored) {
			const initialDir = normalizeSortDirection(dom.getAttribute(STATE_ATTR));
			if (initialDir && initialDir !== 'none') {
				queueBoot(function () {
					if (self._destroyed) return;
					self._apply(initialDir, true);
				});
			}
		}

		return this;
	}

	_component.prototype._resolveTarget = function () {
		return document.getElementById(this.targetId);
	};

	_component.prototype._updateAriaSort = function (direction) {
		const th = this.dom.closest('th');
		if (!th) return;
		th.setAttribute('aria-sort', getAriaSortValue(direction));
	};

	_component.prototype._apply = function (direction, skipStorage) {
		if (this._destroyed) return;
		const normalized = normalizeSortDirection(direction);
		this._state = normalized;
		if (this.dom.getAttribute(STATE_ATTR) !== normalized) {
			this.dom.setAttribute(STATE_ATTR, normalized);
		}

		this._updateAriaSort(normalized);

		const target = this._resolveTarget();
		if (!target) return;

		const detail = {
			field: this.field,
			column: this.column,
			direction: normalized,
			targetId: this.targetId
		};

		if (!skipStorage) {
			if (this.dom.hasAttribute('data-ln-persist')) {
				persistSet('sort', this.dom, normalized === 'none' ? null : detail);
			}
			if (this.hashEnabled) {
				const encoded = hashSortEncode(this.field !== null ? this.field : this.column, normalized);
				hashSet(this.nsKey, encoded);
			}
		}

		const evt = dispatchCancelable(target, 'ln-sort:change', detail);
		if (evt.defaultPrevented) return;

		this._defaultSort(target, normalized);
	};

	// ─── Default DOM behaviour ─────────────────────────────────

	_component.prototype._defaultSort = function (target, direction) {
		const items = this.itemsSelector
			? Array.from(target.querySelectorAll(this.itemsSelector))
			: Array.from(target.children);
		if (!items.length) return;
		const parent = items[0].parentNode;

		if (!_targetInitialOrders.has(target)) {
			_targetInitialOrders.set(target, items.slice());
		}

		let ordered;
		if (direction === 'none') {
			const original = _targetInitialOrders.get(target) || items;
			ordered = original.filter(function (el) {
				return el.parentNode === parent;
			});
		} else {
			const field = this.field;
			const values = items.map(function (el) { return _readItemValue(el, field); });
			const type = detectValueType(values);
			const collator = typeof Intl !== 'undefined'
				? new Intl.Collator(getLocale(this.dom), { sensitivity: 'base' })
				: null;

			const comparator = createSortComparator(direction, type, collator, function (el) {
				return _readItemValue(el, field);
			});

			ordered = items.slice().sort(comparator);
		}

		const frag = document.createDocumentFragment();
		for (let i = 0; i < ordered.length; i++) frag.appendChild(ordered[i]);
		parent.appendChild(frag);
	};

	// ─── Destroy ───────────────────────────────────────────────

	_component.prototype.destroy = function () {
		if (this._destroyed) return;
		this._destroyed = true;
		this.dom.removeEventListener('click', this._onClick);
		document.removeEventListener('ln-sort:change', this._onSortChange);
		if (this.hashEnabled && this._onHashChange) {
			window.removeEventListener('hashchange', this._onHashChange);
		}
		delete this.dom[DOM_ATTRIBUTE];
	};

	// ─── Attribute Sync ────────────────────────────────────────

	function _syncAttribute(el, attrName) {
		const instance = el[DOM_ATTRIBUTE];
		if (!instance || instance._destroyed) return;
		if (attrName === FIELD_ATTR) {
			instance.field = el.getAttribute(FIELD_ATTR) || null;
			const th = el.closest('th');
			instance.column = (!instance.field && th) ? th.cellIndex : null;
		} else if (attrName === ITEMS_ATTR) {
			instance.itemsSelector = el.getAttribute(ITEMS_ATTR) || null;
		} else if (attrName === STATE_ATTR) {
			const nextState = normalizeSortDirection(el.getAttribute(STATE_ATTR));
			if (nextState !== instance._state) {
				instance._apply(nextState);
			}
		} else if (attrName === DOM_SELECTOR) {
			instance.targetId = el.getAttribute(DOM_SELECTOR);
		} else if (attrName === HASH_ATTR) {
			if (instance.hashEnabled && instance._onHashChange) {
				window.removeEventListener('hashchange', instance._onHashChange);
			}
			instance.nsKey = resolveHashNamespace(el, 'sort');
			instance.hashEnabled = !!instance.nsKey;
			if (instance.hashEnabled) {
				window.addEventListener('hashchange', instance._onHashChange);
			}
		}
	}

	// ─── Registration ──────────────────────────────────────────

	registerComponent(DOM_SELECTOR, DOM_ATTRIBUTE, _component, 'ln-sort', {
		extraAttributes: [FIELD_ATTR, ITEMS_ATTR, STATE_ATTR, HASH_ATTR],
		onAttributeChange: _syncAttribute
	});
})();

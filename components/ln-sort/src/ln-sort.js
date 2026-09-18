import { compareValues, detectValueType, dispatchCancelable, getLocale, hashGet, hashSet, hashSortDecode, hashSortEncode, queueBoot, readValue, registerComponent, resolveHashNamespace, attrStr, attrSpec, defineAttrs } from '../../ln-core';
import { createSortComparator, getAriaSortValue, isExcludedSortItem, isSameSortTarget, normalizeSortDirection, resolveSortItems } from './sort-model.js';

(function () {
	const DOM_SELECTOR = 'data-ln-sort';
	const DOM_ATTRIBUTE = 'lnSort';
	const FIELD_ATTR = 'data-ln-sort-field';
	const STATE_ATTR = 'data-ln-sort-state';
	const DIR_ATTR = 'data-ln-sort-dir';
	const HASH_ATTR = 'data-ln-hash';

	if (window[DOM_ATTRIBUTE] !== undefined) return;

	function _readOrNull(el, name) {
		return el.getAttribute(name) || null;
	}

	// ─── Attribute Contract (SSOT) ──────────────────────────
	const ATTRIBUTES = {
		'data-ln-sort':       { prop: 'targetId',      read: attrStr, fallback: null },
		'data-ln-sort-field': { prop: 'field',         read: _readOrNull, effect: _syncAttribute },
		'data-ln-sort-dir':   {},
		'data-ln-sort-items': { prop: 'itemsSelector', read: _readOrNull },
		'data-ln-sort-state': { effect: _syncAttribute },
		'data-ln-hash':       { effect: _syncAttribute }
	};

	const ATTR_SPEC = attrSpec(ATTRIBUTES);

	// Target-scoped initial DOM order cache.
	const _targetInitialOrders = new WeakMap();

	function _readItemValue(item, field, column) {
		if (field) {
			const el = item.querySelector('[data-ln-field="' + field + '"]');
			return el ? readValue(el) : '';
		}
		if (column !== null && column !== undefined && item.cells && item.cells[column]) {
			return readValue(item.cells[column]);
		}
		return readValue(item);
	}

	// ─── Component ─────────────────────────────────────────────

	function _component(dom) {
		this.dom = dom;
		defineAttrs(this, dom, ATTR_SPEC);

		const th = dom.closest('th');
		this.column = (!this.field && th) ? th.cellIndex : null;

		this._state = normalizeSortDirection(dom.getAttribute(STATE_ATTR));
		if (!dom.hasAttribute(STATE_ATTR)) {
			dom.setAttribute(STATE_ATTR, this._state);
		}
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
		if (!this.field && this.column === null) {
			const th = this.dom.closest('th');
			if (th && th.cellIndex !== undefined) this.column = th.cellIndex;
		}
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
		const allItems = resolveSortItems(target, this.itemsSelector);
		if (!allItems.length) return;
		const parent = allItems[0].parentNode;

		const items = allItems.filter(function (el) {
			return !isExcludedSortItem(el);
		});
		if (!items.length) return;

		if (!_targetInitialOrders.has(target)) {
			_targetInitialOrders.set(target, items.slice());
		}

		let ordered;
		if (direction === 'none') {
			const original = _targetInitialOrders.get(target) || items;
			_targetInitialOrders.delete(target);
			ordered = original.filter(function (el) {
				return el.parentNode === parent && !isExcludedSortItem(el);
			});
		} else {
			const field = this.field;
			const column = this.column;
			const values = items.map(function (el) { return _readItemValue(el, field, column); });
			const type = detectValueType(values);
			const collator = typeof Intl !== 'undefined'
				? new Intl.Collator(getLocale(this.dom), { sensitivity: 'base', numeric: true })
				: null;

			const comparator = createSortComparator(direction, type, collator, function (el) {
				return _readItemValue(el, field, column);
			});

			ordered = items.slice().sort(comparator);
		}

		const frag = document.createDocumentFragment();
		let orderIdx = 0;
		for (let i = 0; i < allItems.length; i++) {
			const el = allItems[i];
			if (isExcludedSortItem(el)) {
				frag.appendChild(el);
			} else if (orderIdx < ordered.length) {
				frag.appendChild(ordered[orderIdx++]);
			}
		}
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
			const th = el.closest('th');
			instance.column = (!instance.field && th) ? th.cellIndex : null;
		} else if (attrName === STATE_ATTR) {
			const nextState = normalizeSortDirection(el.getAttribute(STATE_ATTR));
			if (nextState !== instance._state) {
				instance._apply(nextState);
			}
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
		attributes: ATTRIBUTES,
		persist: {
			attr: STATE_ATTR,
			hashActive: function (el) { return !!resolveHashNamespace(el, 'sort'); }
		}
	});
})();

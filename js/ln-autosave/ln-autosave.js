(function () {
	const DOM_SELECTOR = 'data-ln-autosave';
	const DOM_ATTRIBUTE = 'lnAutosave';
	const CLEAR_SELECTOR = 'data-ln-autosave-clear';
	const STORAGE_PREFIX = 'ln-autosave:';

	if (window[DOM_ATTRIBUTE] !== undefined) return;

	// ─── Constructor ───────────────────────────────────────────

	function constructor(domRoot) {
		_findElements(domRoot);
	}

	function _findElements(root) {
		const items = Array.from(root.querySelectorAll('[' + DOM_SELECTOR + ']'));
		if (root.hasAttribute && root.hasAttribute(DOM_SELECTOR)) {
			items.push(root);
		}
		for (const el of items) {
			if (!el[DOM_ATTRIBUTE]) {
				el[DOM_ATTRIBUTE] = new _component(el);
			}
		}
	}

	// ─── Component ─────────────────────────────────────────────

	function _component(form) {
		var key = _getStorageKey(form);
		if (!key) {
			console.warn('ln-autosave: form needs an id or data-ln-autosave value', form);
			return;
		}

		this.dom = form;
		this.key = key;

		var self = this;

		this._onFocusout = function (e) {
			var el = e.target;
			if (_isFormField(el) && el.name) {
				self.save();
			}
		};

		this._onChange = function (e) {
			var el = e.target;
			if (_isFormField(el) && el.name) {
				self.save();
			}
		};

		this._onSubmit = function () {
			self.clear();
		};

		this._onReset = function () {
			self.clear();
		};

		this._onClearClick = function (e) {
			var btn = e.target.closest('[' + CLEAR_SELECTOR + ']');
			if (btn) self.clear();
		};

		form.addEventListener('focusout', this._onFocusout);
		form.addEventListener('change', this._onChange);
		form.addEventListener('submit', this._onSubmit);
		form.addEventListener('reset', this._onReset);
		form.addEventListener('click', this._onClearClick);

		this.restore();

		return this;
	}

	_component.prototype.save = function () {
		var data = _serialize(this.dom);
		try {
			localStorage.setItem(this.key, JSON.stringify(data));
		} catch (e) {
			return;
		}
		_dispatch(this.dom, 'ln-autosave:saved', { target: this.dom, data: data });
	};

	_component.prototype.restore = function () {
		var raw;
		try {
			raw = localStorage.getItem(this.key);
		} catch (e) {
			return;
		}
		if (!raw) return;

		var data;
		try {
			data = JSON.parse(raw);
		} catch (e) {
			return;
		}

		var before = _dispatchCancelable(this.dom, 'ln-autosave:before-restore', { target: this.dom, data: data });
		if (before.defaultPrevented) return;

		_populateForm(this.dom, data);
		_dispatch(this.dom, 'ln-autosave:restored', { target: this.dom, data: data });
	};

	_component.prototype.clear = function () {
		try {
			localStorage.removeItem(this.key);
		} catch (e) {
			return;
		}
		_dispatch(this.dom, 'ln-autosave:cleared', { target: this.dom });
	};

	_component.prototype.destroy = function () {
		if (!this.dom[DOM_ATTRIBUTE]) return;
		this.dom.removeEventListener('focusout', this._onFocusout);
		this.dom.removeEventListener('change', this._onChange);
		this.dom.removeEventListener('submit', this._onSubmit);
		this.dom.removeEventListener('reset', this._onReset);
		this.dom.removeEventListener('click', this._onClearClick);
		_dispatch(this.dom, 'ln-autosave:destroyed', { target: this.dom });
		delete this.dom[DOM_ATTRIBUTE];
	};

	// ─── Helpers ───────────────────────────────────────────────

	function _getStorageKey(form) {
		var value = form.getAttribute(DOM_SELECTOR);
		var identifier = value || form.id;
		if (!identifier) return null;
		return STORAGE_PREFIX + window.location.pathname + ':' + identifier;
	}

	function _isFormField(el) {
		var tag = el.tagName;
		return tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT';
	}

	function _serialize(form) {
		var data = {};
		var elements = form.elements;

		for (var i = 0; i < elements.length; i++) {
			var el = elements[i];
			if (!el.name || el.disabled || el.type === 'file' || el.type === 'submit' || el.type === 'button') continue;

			if (el.type === 'checkbox') {
				if (!data[el.name]) data[el.name] = [];
				if (el.checked) data[el.name].push(el.value);
			} else if (el.type === 'radio') {
				if (el.checked) data[el.name] = el.value;
			} else if (el.type === 'select-multiple') {
				data[el.name] = [];
				for (var j = 0; j < el.options.length; j++) {
					if (el.options[j].selected) data[el.name].push(el.options[j].value);
				}
			} else {
				data[el.name] = el.value;
			}
		}

		return data;
	}

	function _populateForm(form, data) {
		var elements = form.elements;
		var restored = [];

		for (var i = 0; i < elements.length; i++) {
			var el = elements[i];
			if (!el.name || !(el.name in data) || el.type === 'file' || el.type === 'submit' || el.type === 'button') continue;

			var value = data[el.name];

			if (el.type === 'checkbox') {
				el.checked = Array.isArray(value) && value.indexOf(el.value) !== -1;
				restored.push(el);
			} else if (el.type === 'radio') {
				el.checked = el.value === value;
				restored.push(el);
			} else if (el.type === 'select-multiple') {
				if (Array.isArray(value)) {
					for (var j = 0; j < el.options.length; j++) {
						el.options[j].selected = value.indexOf(el.options[j].value) !== -1;
					}
				}
				restored.push(el);
			} else {
				el.value = value;
				restored.push(el);
			}
		}

		for (var k = 0; k < restored.length; k++) {
			restored[k].dispatchEvent(new Event('input', { bubbles: true }));
			restored[k].dispatchEvent(new Event('change', { bubbles: true }));

			if (restored[k].lnSelect && restored[k].lnSelect.setValue) {
				restored[k].lnSelect.setValue(data[restored[k].name]);
			}
		}
	}

	function _dispatch(element, eventName, detail) {
		element.dispatchEvent(new CustomEvent(eventName, {
			bubbles: true,
			detail: detail || {}
		}));
	}

	function _dispatchCancelable(element, eventName, detail) {
		var event = new CustomEvent(eventName, {
			bubbles: true,
			cancelable: true,
			detail: detail || {}
		});
		element.dispatchEvent(event);
		return event;
	}

	// ─── DOM Observer ──────────────────────────────────────────

	function _domObserver() {
		var observer = new MutationObserver(function (mutations) {
			for (var i = 0; i < mutations.length; i++) {
				if (mutations[i].type === 'childList') {
					var nodes = mutations[i].addedNodes;
					for (var j = 0; j < nodes.length; j++) {
						if (nodes[j].nodeType === 1) {
							_findElements(nodes[j]);
						}
					}
				} else if (mutations[i].type === 'attributes') {
					_findElements(mutations[i].target);
				}
			}
		});

		observer.observe(document.body, {
			childList: true,
			subtree: true,
			attributes: true,
			attributeFilter: [DOM_SELECTOR]
		});
	}

	// ─── Init ──────────────────────────────────────────────────

	window[DOM_ATTRIBUTE] = constructor;
	_domObserver();

	if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', function () {
			constructor(document.body);
		});
	} else {
		constructor(document.body);
	}
})();

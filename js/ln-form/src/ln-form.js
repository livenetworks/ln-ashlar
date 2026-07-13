import { populateForm, dispatch, registerComponent } from '../../ln-core';

(function () {
	const DOM_SELECTOR = 'data-ln-form';
	const DOM_ATTRIBUTE = 'lnForm';
	const ACTION_EDIT_ATTR   = 'data-ln-form-action-edit';
	const ACTION_METHOD_ATTR = 'data-ln-form-action-method';

	if (window[DOM_ATTRIBUTE] !== undefined) return;

	// ─── Component ─────────────────────────────────────────────

	function _component(form) {
		this.dom = form;
		this._baseAction = form.getAttribute('action') || '';

		const self = this;

		this._onLnFill = function (e) {
			// Guard: only handle direct dispatches at this form, not bubbled
			// events from [data-ln-fillable] children inside the form.
			if (e.target !== self.dom) return;
			if (e.detail) {
				self.fill(e.detail);
				self._applyActionMode(e.detail);
			} else {
				// Null record = "new" mode. Native reset fires the 'reset'
				// event, which restores the base action below.
				self.dom.reset();
			}
		};

		this._onReset = function () {
			self._applyActionMode(null);
		};

		form.addEventListener('ln-fill', this._onLnFill);
		form.addEventListener('reset', this._onReset);

		return this;
	}

	_component.prototype.fill = function (data) {
		const filled = populateForm(this.dom, data);

		// Trigger events so reactive consumers (ln-validate, ln-autoresize)
		// pick up the changes. SELECT/checkbox/radio -> 'change',
		// everything else -> 'input'.
		for (let k = 0; k < filled.length; k++) {
			const el = filled[k];
			const isChangeBased = el.tagName === 'SELECT' || el.type === 'checkbox' || el.type === 'radio';
			el.dispatchEvent(new Event(isChangeBased ? 'change' : 'input', { bubbles: true }));
		}
	};

	_component.prototype._ensureMethodInput = function () {
		let input = this.dom.querySelector('input[name="_method"]');
		if (!input) {
			input = document.createElement('input');
			input.type  = 'hidden';
			input.name  = '_method';
			input.value = '';
			this.dom.appendChild(input);
		}
		return input;
	};

	_component.prototype._applyActionMode = function (record) {
		if (!this.dom.hasAttribute(ACTION_EDIT_ATTR)) return;

		const id = record && record.id != null && record.id !== '' ? record.id : null;
		const methodInput = this._ensureMethodInput();

		if (id !== null) {
			const template = this.dom.getAttribute(ACTION_EDIT_ATTR);
			if (template) {
				this.dom.setAttribute('action', template.replace(':id', encodeURIComponent(id)));
			} else {
				this.dom.setAttribute('action', this._baseAction.replace(/\/$/, '') + '/' + encodeURIComponent(id));
			}
			methodInput.value = this.dom.getAttribute(ACTION_METHOD_ATTR) || 'PUT';
		} else {
			this.dom.setAttribute('action', this._baseAction);
			methodInput.value = '';
		}
	};

	_component.prototype.destroy = function () {
		if (!this.dom[DOM_ATTRIBUTE]) return;
		this.dom.removeEventListener('ln-fill', this._onLnFill);
		this.dom.removeEventListener('reset', this._onReset);
		dispatch(this.dom, 'ln-form:destroyed', { target: this.dom });
		delete this.dom[DOM_ATTRIBUTE];
	};

	// ─── Init ──────────────────────────────────────────────────

	registerComponent(DOM_SELECTOR, DOM_ATTRIBUTE, _component, 'ln-form');
})();

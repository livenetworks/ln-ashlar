import { dispatch, dispatchCancelable, isVisible, registerComponent } from '../../ln-core';
import { browserAlreadyHandles, composeExternalShortcut, eventToShortcut, inferKeyAction, isEditableEventTarget, parseShortcutList } from './key-model.js';

(function () {
	const DOM_SELECTOR = 'data-ln-key';
	const DOM_ATTRIBUTE = 'lnKey';
	const TARGET_ATTRIBUTE = 'data-ln-key-target';
	const ALLOW_INPUT_ATTRIBUTE = 'data-ln-key-allow-input';
	const MODIFIER_ATTRIBUTE = 'data-ln-key-modifier';
	const FOR_ATTRIBUTE = 'data-ln-key-for';
	const FOR_DOM_ATTRIBUTE = 'lnKeyFor';

	if (window[DOM_ATTRIBUTE] !== undefined) return;

	const instances = new Set();
	let keydownListener = null;

	function _ensureKeydownListener() {
		if (keydownListener) return;
		keydownListener = function (event) {
			if (event.defaultPrevented || event.isComposing || event.repeat) return;

			const key = eventToShortcut(event);
			if (!key) return;

			const editing = isEditableEventTarget(event.target);
			const hosts = document.querySelectorAll('[' + DOM_SELECTOR + '], [' + FOR_ATTRIBUTE + ']');
			let winner = null;
			let hasDuplicate = false;
			let nativeActivation = false;

			for (let i = 0; i < hosts.length; i++) {
				const host = hosts[i];
				const instance = host[DOM_ATTRIBUTE] || host[FOR_DOM_ATTRIBUTE];
				if (!instance || !instance.matches(key)) continue;
				if (editing && !instance.allowsInput()) continue;

				const target = instance.resolveTarget();
				const action = inferKeyAction(target);
				if (!action || !_isUsableTarget(target, action)) continue;
				if (browserAlreadyHandles(event, target, action, key)) {
					nativeActivation = true;
					continue;
				}

				if (!winner) {
					winner = { host: host, target: target, action: action };
				} else {
					hasDuplicate = true;
				}
			}

			if (nativeActivation || !winner) return;

			if (hasDuplicate) {
				console.warn('[ln-key] Duplicate active shortcut "' + key + '"; first DOM match wins.');
			}

			const detail = {
				source: winner.host,
				target: winner.target,
				action: winner.action,
				key: key,
				event: event
			};
			const before = dispatchCancelable(winner.host, 'ln-key:before-trigger', detail);
			if (before.defaultPrevented) return;

			event.preventDefault();
			winner.target[winner.action]();
			dispatch(winner.host, 'ln-key:trigger', detail);
		};
		document.addEventListener('keydown', keydownListener);
	}

	function _maybeRemoveKeydownListener() {
		if (instances.size > 0 || !keydownListener) return;
		document.removeEventListener('keydown', keydownListener);
		keydownListener = null;
	}

	function _isUsableTarget(target, action) {
		if (!target || !document.contains(target)) return false;
		if (target.disabled || target.getAttribute('aria-disabled') === 'true') return false;
		if (typeof target.closest === 'function' && target.closest('[inert]')) return false;
		if (typeof target[action] !== 'function') return false;
		return isVisible(target);
	}

	function _component(dom) {
		this.dom = dom;
		this.shortcuts = [];
		instances.add(this);
		this.sync();
		_ensureKeydownListener();
		return this;
	}

	_component.prototype.sync = function () {
		this.shortcuts = parseShortcutList(this.dom.getAttribute(DOM_SELECTOR));
	};

	_component.prototype.matches = function (key) {
		return this.shortcuts.indexOf(key) !== -1;
	};

	_component.prototype.allowsInput = function () {
		return this.dom.hasAttribute(ALLOW_INPUT_ATTRIBUTE);
	};

	_component.prototype.resolveTarget = function () {
		const selector = this.dom.getAttribute(TARGET_ATTRIBUTE);
		if (!selector) return this.dom;
		return _resolveTarget(selector, TARGET_ATTRIBUTE);
	};

	_component.prototype.destroy = function () {
		if (!this.dom[DOM_ATTRIBUTE]) return;
		instances.delete(this);
		delete this.dom[DOM_ATTRIBUTE];
		_maybeRemoveKeydownListener();
		dispatch(this.dom, 'ln-key:destroyed', { target: this.dom });
	};

	function _externalComponent(dom) {
		this.dom = dom;
		instances.add(this);
		_ensureKeydownListener();
		return this;
	}

	_externalComponent.prototype._modifierContext = function () {
		return this.dom.closest('[' + MODIFIER_ATTRIBUTE + ']');
	};

	_externalComponent.prototype.shortcut = function () {
		const context = this._modifierContext();
		const modifier = context ? context.getAttribute(MODIFIER_ATTRIBUTE) : '';
		return composeExternalShortcut(modifier, this.dom.textContent);
	};

	_externalComponent.prototype.matches = function (key) {
		return this.shortcut() === key;
	};

	_externalComponent.prototype.allowsInput = function () {
		if (this.dom.hasAttribute(ALLOW_INPUT_ATTRIBUTE)) return true;
		const context = this._modifierContext();
		return !!(context && context.hasAttribute(ALLOW_INPUT_ATTRIBUTE));
	};

	_externalComponent.prototype.resolveTarget = function () {
		return _resolveTarget(this.dom.getAttribute(FOR_ATTRIBUTE), FOR_ATTRIBUTE);
	};

	_externalComponent.prototype.destroy = function () {
		if (!this.dom[FOR_DOM_ATTRIBUTE]) return;
		instances.delete(this);
		delete this.dom[FOR_DOM_ATTRIBUTE];
		_maybeRemoveKeydownListener();
		dispatch(this.dom, 'ln-key:destroyed', { target: this.dom });
	};

	function _resolveTarget(selector, attribute) {
		if (!selector) return null;
		try {
			const target = document.querySelector(selector);
			if (!target) {
				console.warn('[ln-key] Target not found for ' + attribute + ' selector "' + selector + '".');
			}
			return target;
		} catch (error) {
			console.warn('[ln-key] Invalid ' + attribute + ' selector "' + selector + '".');
			return null;
		}
	}

	registerComponent(DOM_SELECTOR, DOM_ATTRIBUTE, _component, 'ln-key', {
		extraAttributes: [TARGET_ATTRIBUTE, ALLOW_INPUT_ATTRIBUTE],
		onAttributeChange: function (target) {
			const instance = target[DOM_ATTRIBUTE];
			if (!instance) return;
			if (!target.hasAttribute(DOM_SELECTOR)) {
				instance.destroy();
				return;
			}
			instance.sync();
		}
	});

	registerComponent(FOR_ATTRIBUTE, FOR_DOM_ATTRIBUTE, _externalComponent, 'ln-key-for', {
		onAttributeChange: function (target) {
			const instance = target[FOR_DOM_ATTRIBUTE];
			if (instance && !target.hasAttribute(FOR_ATTRIBUTE)) instance.destroy();
		}
	});
})();

import { dispatch, dispatchCancelable, registerComponent, cloneTemplateScoped } from '../../ln-core';

(function () {
	const DOM_SELECTOR = 'data-ln-editor';
	const DOM_ATTRIBUTE = 'lnEditor';

	if (window[DOM_ATTRIBUTE] !== undefined) return;

	// ─── Allowed tags for paste sanitization ───────────────────
	const ALLOWED_TAGS = {
		P: true, BR: true, STRONG: true, B: true, EM: true, I: true,
		U: true, S: true, A: true, UL: true, OL: true, LI: true,
		H2: true, H3: true, H4: true, BLOCKQUOTE: true, PRE: true,
		CODE: true, DIV: true
	};

	// ─── Action → execCommand mapping ─────────────────────────
	const INLINE_COMMANDS = {
		'bold': 'bold',
		'italic': 'italic',
		'underline': 'underline',
		'strikethrough': 'strikeThrough'
	};

	const BLOCK_COMMANDS = {
		'heading-2': 'h2',
		'heading-3': 'h3',
		'heading-4': 'h4',
		'blockquote': 'blockquote',
		'code': 'pre',
		'paragraph': 'p'
	};

	const LIST_COMMANDS = {
		'ordered-list': 'insertOrderedList',
		'unordered-list': 'insertUnorderedList'
	};

	// Monotonic id source for surfaces whose textarea has no id
	let _uid = 0;

	// Toggle-able formatting actions get aria-pressed; one-shot actions
	// (unlink, clear, confirm-link, cancel-link) do not.
	function _isToggleAction(action) {
		return !!(INLINE_COMMANDS[action] || BLOCK_COMMANDS[action] ||
			LIST_COMMANDS[action] || action === 'link');
	}

	// ─── Component ────────────────────────────────────────────
	function _component(dom) {
		this.dom = dom;
		const self = this;

		// Find the textarea inside the container
		this._textarea = dom.querySelector('textarea');
		if (!this._textarea) {
			console.warn('[ln-editor] No <textarea> found inside', dom);
			return this;
		}

		// Read placeholder from textarea
		const placeholder = this._textarea.getAttribute('placeholder') || '';

		// Mark textarea as source (CSS hides it)
		this._textarea.setAttribute('data-ln-editor-source', '');

		// Create the editing surface
		this._surface = document.createElement('div');
		this._surface.className = 'ln-editor__surface';
		this._surface.setAttribute('contenteditable', 'true');
		this._surface.setAttribute('role', 'textbox');
		this._surface.setAttribute('aria-multiline', 'true');
		if (placeholder) {
			this._surface.setAttribute('data-placeholder', placeholder);
		}

		// Transfer textarea label association via aria-labelledby
		const textareaId = this._textarea.id;
		if (textareaId) {
			const label = dom.querySelector('label[for="' + textareaId + '"]');
			if (label) {
				if (!label.id) label.id = textareaId + '-label';
				this._surface.setAttribute('aria-labelledby', label.id);
			}
		}

		// Stable id so the toolbar can reference the surface via aria-controls
		this._surface.id = textareaId ? textareaId + '-surface' : 'ln-editor-surface-' + (++_uid);

		// Set initial content from textarea value
		const initialHtml = this._textarea.value.trim();
		if (initialHtml) {
			this._surface.innerHTML = initialHtml;
		}

		// Insert the surface into the DOM (after the toolbar, or at end)
		const toolbar = dom.querySelector('[role="toolbar"]');
		if (toolbar && toolbar.nextSibling) {
			dom.insertBefore(this._surface, toolbar.nextSibling);
		} else {
			dom.appendChild(this._surface);
		}

		// Wire toolbar → surface relationship and seed toggle-button states
		if (toolbar) {
			toolbar.setAttribute('aria-controls', this._surface.id);
			const _tbBtns = toolbar.querySelectorAll('[data-ln-editor-action]');
			for (let _b = 0; _b < _tbBtns.length; _b++) {
				const _act = _tbBtns[_b].getAttribute('data-ln-editor-action');
				if (_isToggleAction(_act)) _tbBtns[_b].setAttribute('aria-pressed', 'false');
			}
		}

		// ─── Event handlers (bound references for cleanup) ────
		this._onInput = function () {
			self._syncToTextarea();
			dispatch(self.dom, 'ln-editor:changed', {
				html: self._textarea.value,
				target: self.dom
			});
		};

		this._onMousedownToolbar = function (e) {
			// Prevent toolbar click from stealing focus from surface
			const btn = e.target.closest('[data-ln-editor-action]');
			if (btn) e.preventDefault();
		};

		this._onClickToolbar = function (e) {
			const btn = e.target.closest('[data-ln-editor-action]');
			if (!btn) return;
			const action = btn.getAttribute('data-ln-editor-action');
			self._execAction(action);
		};

		this._onPaste = function (e) {
			_handlePaste(self, e);
		};

		this._onKeydown = function (e) {
			_handleKeydown(self, e);
		};

		this._onSelectionChange = function () {
			// Document-level listener: no-op when the surface has been removed
			// from the DOM without destroy() (e.g. SPA subtree swap). The
			// listener is intentionally NOT removed here so a temporarily
			// detached-then-reattached surface keeps working.
			if (!document.contains(self._surface)) return;
			self._updateActiveStates();
		};

		this._onFocus = function () {
			dispatch(self.dom, 'ln-editor:focus', { target: self.dom });
		};

		this._onBlur = function () {
			// Sync on blur to ensure textarea is up-to-date
			self._syncToTextarea();
			dispatch(self.dom, 'ln-editor:blur', { target: self.dom });
		};

		// ─── Bind events ──────────────────────────────────────
		this._surface.addEventListener('input', this._onInput);
		this._surface.addEventListener('paste', this._onPaste);
		this._surface.addEventListener('keydown', this._onKeydown);
		this._surface.addEventListener('focus', this._onFocus);
		this._surface.addEventListener('blur', this._onBlur);

		if (toolbar) {
			toolbar.addEventListener('mousedown', this._onMousedownToolbar);
			toolbar.addEventListener('click', this._onClickToolbar);
		}

		document.addEventListener('selectionchange', this._onSelectionChange);

		// Request event — set content programmatically
		this._onSetContent = function (e) {
			const html = e.detail && e.detail.html;
			if (html !== undefined) {
				// Direct innerHTML set fires no native input — dispatch manually.
				self._surface.innerHTML = html;
				self._syncToTextarea();
				dispatch(self.dom, 'ln-editor:changed', {
					html: self._textarea.value,
					target: self.dom
				});
			}
		};
		dom.addEventListener('ln-editor:set-content', this._onSetContent);

		// Handle parent form reset
		const form = this._textarea.form;
		if (form) {
			this._onFormReset = function () {
				setTimeout(function () {
					self._surface.innerHTML = self._textarea.value;
					dispatch(dom, 'ln-editor:changed', {
						html: self._textarea.value,
						target: dom
					});
				}, 0);
			};
			form.addEventListener('reset', this._onFormReset);
		}

		return this;
	}

	// ─── Prototype Methods ────────────────────────────────────

	_component.prototype._syncToTextarea = function () {
		if (!this._textarea) return;
		this._textarea.value = this._surface.innerHTML;
	};

	_component.prototype._execAction = function (action) {
		if (!action) return;

		const before = dispatchCancelable(this.dom, 'ln-editor:before-change', {
			action: action,
			target: this.dom
		});
		if (before.defaultPrevented) return;

		// Ensure focus is on the surface
		this._surface.focus();

		if (INLINE_COMMANDS[action]) {
			document.execCommand(INLINE_COMMANDS[action], false, null);
		} else if (BLOCK_COMMANDS[action]) {
			// Toggle: if current block matches, revert to <p>
			const tag = BLOCK_COMMANDS[action];
			const current = _getActiveBlockTag(this._surface);
			if (current && current.toLowerCase() === tag) {
				document.execCommand('formatBlock', false, '<p>');
			} else {
				document.execCommand('formatBlock', false, '<' + tag + '>');
			}
		} else if (LIST_COMMANDS[action]) {
			document.execCommand(LIST_COMMANDS[action], false, null);
		} else if (action === 'link') {
			_handleLink(this);
		} else if (action === 'unlink') {
			document.execCommand('unlink', false, null);
		} else if (action === 'clear') {
			document.execCommand('removeFormat', false, null);
			document.execCommand('formatBlock', false, '<p>');
		}

		// execCommand-driven edits fire a native input → _onInput dispatches
		// 'changed'. Do NOT dispatch here (was A1 double-fire). The 'link'
		// action opens a popover and mutates nothing until _apply.
		this._syncToTextarea();
		this._updateActiveStates();
	};

	_component.prototype._updateActiveStates = function () {
		const toolbar = this.dom.querySelector('[role="toolbar"]');
		if (!toolbar) return;

		// Only update if the selection is within our surface
		const sel = window.getSelection();
		if (!sel || sel.rangeCount === 0) return;
		const anchorNode = sel.anchorNode;
		if (!anchorNode || !this._surface.contains(anchorNode)) return;

		const buttons = toolbar.querySelectorAll('[data-ln-editor-action]');
		for (let i = 0; i < buttons.length; i++) {
			const btn = buttons[i];
			const action = btn.getAttribute('data-ln-editor-action');
			let isActive = false;

			if (INLINE_COMMANDS[action]) {
				try {
					isActive = document.queryCommandState(INLINE_COMMANDS[action]);
				} catch (e) {
					// Ignore — some commands may not be queryable
				}
			} else if (BLOCK_COMMANDS[action]) {
				const currentBlock = _getActiveBlockTag(this._surface);
				isActive = currentBlock && currentBlock.toLowerCase() === BLOCK_COMMANDS[action];
			} else if (LIST_COMMANDS[action]) {
				try {
					isActive = document.queryCommandState(LIST_COMMANDS[action]);
				} catch (e) {
					// Ignore
				}
			} else if (action === 'link') {
				// Check if selection is inside an <a>
				isActive = !!_getAncestorTag(sel.anchorNode, 'A', this._surface);
			}

			if (_isToggleAction(action)) {
				btn.setAttribute('aria-pressed', String(isActive));
			}
			if (isActive) {
				btn.classList.add('ln-editor-active');
			} else {
				btn.classList.remove('ln-editor-active');
			}
		}
	};

	_component.prototype.getHTML = function () {
		return this._surface ? this._surface.innerHTML : '';
	};

	_component.prototype.setHTML = function (html) {
		if (!this._surface) return;
		// Direct innerHTML set fires no native input — dispatch manually.
		this._surface.innerHTML = html;
		this._syncToTextarea();
		dispatch(this.dom, 'ln-editor:changed', {
			html: this._textarea.value,
			target: this.dom
		});
	};

	_component.prototype.destroy = function () {
		if (!this.dom[DOM_ATTRIBUTE]) return;

		// Remove event listeners
		if (this._surface) {
			this._surface.removeEventListener('input', this._onInput);
			this._surface.removeEventListener('paste', this._onPaste);
			this._surface.removeEventListener('keydown', this._onKeydown);
			this._surface.removeEventListener('focus', this._onFocus);
			this._surface.removeEventListener('blur', this._onBlur);
			this._surface.remove();
		}

		const toolbar = this.dom.querySelector('[role="toolbar"]');
		if (toolbar) {
			toolbar.removeEventListener('mousedown', this._onMousedownToolbar);
			toolbar.removeEventListener('click', this._onClickToolbar);
		}

		document.removeEventListener('selectionchange', this._onSelectionChange);
		this.dom.removeEventListener('ln-editor:set-content', this._onSetContent);

		const form = this._textarea ? this._textarea.form : null;
		if (form && this._onFormReset) {
			form.removeEventListener('reset', this._onFormReset);
		}

		// Restore textarea visibility
		if (this._textarea) {
			this._textarea.removeAttribute('data-ln-editor-source');
		}

		// Remove link popover if present
		const popover = this.dom.querySelector('.ln-editor__link-popover');
		if (popover) popover.remove();

		dispatch(this.dom, 'ln-editor:destroyed', { target: this.dom });
		delete this.dom[DOM_ATTRIBUTE];
	};

	// ─── Private helpers ──────────────────────────────────────

	/**
	 * Walk up from node to find the active block-level tag within the surface.
	 */
	function _getActiveBlockTag(surface) {
		const sel = window.getSelection();
		if (!sel || sel.rangeCount === 0) return null;

		let node = sel.anchorNode;
		if (!node) return null;

		// Walk up to find block element
		while (node && node !== surface) {
			if (node.nodeType === 1) {
				const tag = node.tagName;
				if (tag === 'H2' || tag === 'H3' || tag === 'H4' ||
					tag === 'BLOCKQUOTE' || tag === 'PRE' || tag === 'P') {
					return tag;
				}
			}
			node = node.parentNode;
		}
		return null;
	}

	/**
	 * Walk up from node to find an ancestor with the given tag.
	 */
	function _getAncestorTag(node, tagName, boundary) {
		while (node && node !== boundary) {
			if (node.nodeType === 1 && node.tagName === tagName) {
				return node;
			}
			node = node.parentNode;
		}
		return null;
	}

	/**
	 * Sanitize pasted HTML — strip disallowed tags and attributes.
	 */
	function _handlePaste(instance, e) {
		e.preventDefault();

		let html = '';
		if (e.clipboardData) {
			html = e.clipboardData.getData('text/html');
			if (!html) {
				// Fallback to plain text
				const text = e.clipboardData.getData('text/plain');
				if (text) {
					// Convert line breaks to <br> for plain text paste
					html = text
						.replace(/&/g, '&amp;')
						.replace(/</g, '&lt;')
						.replace(/>/g, '&gt;')
						.replace(/\n\n/g, '</p><p>')
						.replace(/\n/g, '<br>');
					html = '<p>' + html + '</p>';
				}
			}
		}

		if (!html) return;

		const sanitized = _sanitizeHTML(html);
		if (sanitized) {
			document.execCommand('insertHTML', false, sanitized);
		}
	}

	/**
	 * Recursively sanitize an HTML string, keeping only allowed tags.
	 */
	function _sanitizeHTML(html) {
		const container = document.createElement('div');
		container.innerHTML = html;
		_walkAndSanitize(container);
		return container.innerHTML;
	}

	function _walkAndSanitize(node) {
		const children = Array.from(node.childNodes);
		for (let i = 0; i < children.length; i++) {
			const child = children[i];

			// Keep text nodes
			if (child.nodeType === 3) continue;

			// Remove non-element nodes (comments, etc.)
			if (child.nodeType !== 1) {
				node.removeChild(child);
				continue;
			}

			if (!ALLOWED_TAGS[child.tagName]) {
				// Replace disallowed tag with its children (unwrap)
				while (child.firstChild) {
					node.insertBefore(child.firstChild, child);
				}
				node.removeChild(child);
			} else {
				// Strip all attributes except href on <a>
				const attrs = Array.from(child.attributes);
				for (let j = 0; j < attrs.length; j++) {
					const attrName = attrs[j].name;
					if (child.tagName === 'A' && attrName === 'href') {
						// Sanitize href — only allow http/https/mailto
						const href = child.getAttribute('href') || '';
						if (!/^(https?:|mailto:|\/|#)/.test(href)) {
							child.removeAttribute('href');
						}
					} else {
						child.removeAttribute(attrName);
					}
				}

				// Ensure links open safely
				if (child.tagName === 'A') {
					child.setAttribute('rel', 'noopener noreferrer');
				}

				// Recurse
				_walkAndSanitize(child);
			}
		}
	}

	/**
	 * Handle keyboard shortcuts.
	 */
	function _handleKeydown(instance, e) {
		if (!(e.ctrlKey || e.metaKey)) return;

		let action = null;
		switch (e.key.toLowerCase()) {
			case 'b': action = 'bold'; break;
			case 'i': action = 'italic'; break;
			case 'u': action = 'underline'; break;
			case 'k': action = 'link'; break;
		}

		if (action) {
			e.preventDefault();
			instance._execAction(action);
		}
	}

	/**
	 * Handle link insertion — inline popover approach.
	 * Creates a small URL input inline at the toolbar level.
	 */
	function _handleLink(instance) {
		const sel = window.getSelection();
		if (!sel || sel.rangeCount === 0) return;

		// Check if already inside a link — if so, let user edit the href
		const existingLink = _getAncestorTag(sel.anchorNode, 'A', instance._surface);

		// Save the current selection range so we can restore it
		const savedRange = sel.getRangeAt(0).cloneRange();

		// Remove any existing popover
		const existing = instance.dom.querySelector('.ln-editor__link-popover');
		if (existing) existing.remove();

		// Clone popover template
		const fragment = cloneTemplateScoped(instance.dom, 'ln-editor-link-popover', 'ln-editor');
		if (!fragment) return;
		const popover = fragment.firstElementChild;
		if (!popover) return;

		const input = popover.querySelector('input[type="url"]');
		const confirmBtn = popover.querySelector('[data-ln-editor-action="confirm-link"]');
		const removeBtn = popover.querySelector('[data-ln-editor-action="cancel-link"]');

		if (existingLink) {
			input.value = existingLink.getAttribute('href') || '';
		}

		// Insert popover after the toolbar
		const toolbar = instance.dom.querySelector('[role="toolbar"]');
		if (toolbar) {
			toolbar.after(popover);
		} else {
			instance.dom.insertBefore(popover, instance._surface);
		}

		input.focus();

		function _restoreSelection() {
			const sel = window.getSelection();
			sel.removeAllRanges();
			sel.addRange(savedRange);
		}

		function _apply() {
			const url = input.value.trim();
			popover.remove();

			_restoreSelection();
			instance._surface.focus();

			if (url) {
				if (existingLink) {
					// Bare setAttribute — no execCommand, so no native input
					// fires. Sync + dispatch 'changed' exactly once here.
					existingLink.setAttribute('href', url);
					existingLink.setAttribute('rel', 'noopener noreferrer');
					instance._syncToTextarea();
					dispatch(instance.dom, 'ln-editor:changed', {
						html: instance._textarea.value,
						target: instance.dom
					});
				} else {
					// createLink is an execCommand → native input → _onInput
					// syncs + dispatches 'changed'. Do NOT dispatch again.
					document.execCommand('createLink', false, url);
					const sel = window.getSelection();
					if (sel && sel.anchorNode) {
						const newLink = _getAncestorTag(sel.anchorNode, 'A', instance._surface);
						if (newLink) {
							// rel lands after _onInput already captured innerHTML —
							// silently re-sync the textarea, no second dispatch.
							newLink.setAttribute('rel', 'noopener noreferrer');
							instance._syncToTextarea();
						}
					}
				}
			} else if (existingLink) {
				// unlink is an execCommand → native input → _onInput dispatches.
				document.execCommand('unlink', false, null);
			}
		}

		function _cancel() {
			popover.remove();
			_restoreSelection();
			instance._surface.focus();
		}

		confirmBtn.addEventListener('click', _apply);
		removeBtn.addEventListener('click', _cancel);

		input.addEventListener('keydown', function (e) {
			if (e.key === 'Enter') {
				e.preventDefault();
				_apply();
			} else if (e.key === 'Escape') {
				e.preventDefault();
				_cancel();
			}
		});
	}

	// ─── Init ─────────────────────────────────────────────────

	registerComponent(DOM_SELECTOR, DOM_ATTRIBUTE, _component, 'ln-editor');
})();

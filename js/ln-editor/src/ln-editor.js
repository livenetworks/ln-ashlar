import { dispatch, dispatchCancelable, registerComponent } from '../../ln-core';

(function () {
	const DOM_SELECTOR = 'data-ln-editor';
	const DOM_ATTRIBUTE = 'lnEditor';

	if (window[DOM_ATTRIBUTE] !== undefined) return;

	// ─── Allowed tags for paste sanitization ───────────────────
	var ALLOWED_TAGS = {
		P: true, BR: true, STRONG: true, B: true, EM: true, I: true,
		U: true, S: true, A: true, UL: true, OL: true, LI: true,
		H2: true, H3: true, H4: true, BLOCKQUOTE: true, PRE: true,
		CODE: true, DIV: true
	};

	// ─── Action → execCommand mapping ─────────────────────────
	var INLINE_COMMANDS = {
		'bold': 'bold',
		'italic': 'italic',
		'underline': 'underline',
		'strikethrough': 'strikeThrough'
	};

	var BLOCK_COMMANDS = {
		'heading-2': 'h2',
		'heading-3': 'h3',
		'heading-4': 'h4',
		'blockquote': 'blockquote',
		'code': 'pre',
		'paragraph': 'p'
	};

	var LIST_COMMANDS = {
		'ordered-list': 'insertOrderedList',
		'unordered-list': 'insertUnorderedList'
	};

	// ─── Component ────────────────────────────────────────────
	function _component(dom) {
		this.dom = dom;
		var self = this;

		// Find the textarea inside the container
		this._textarea = dom.querySelector('textarea');
		if (!this._textarea) {
			console.warn('[ln-editor] No <textarea> found inside', dom);
			return this;
		}

		// Read placeholder from textarea
		var placeholder = this._textarea.getAttribute('placeholder') || '';

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
		var textareaId = this._textarea.id;
		if (textareaId) {
			var label = dom.querySelector('label[for="' + textareaId + '"]');
			if (label) {
				if (!label.id) label.id = textareaId + '-label';
				this._surface.setAttribute('aria-labelledby', label.id);
			}
		}

		// Set initial content from textarea value
		var initialHtml = this._textarea.value.trim();
		if (initialHtml) {
			this._surface.innerHTML = initialHtml;
		}

		// Insert the surface into the DOM (after nav, or at end)
		var nav = dom.querySelector('nav');
		if (nav && nav.nextSibling) {
			dom.insertBefore(this._surface, nav.nextSibling);
		} else {
			dom.appendChild(this._surface);
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
			var btn = e.target.closest('[data-ln-editor-action]');
			if (btn) e.preventDefault();
		};

		this._onClickToolbar = function (e) {
			var btn = e.target.closest('[data-ln-editor-action]');
			if (!btn) return;
			var action = btn.getAttribute('data-ln-editor-action');
			self._execAction(action);
		};

		this._onPaste = function (e) {
			_handlePaste(self, e);
		};

		this._onKeydown = function (e) {
			_handleKeydown(self, e);
		};

		this._onSelectionChange = function () {
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

		if (nav) {
			nav.addEventListener('mousedown', this._onMousedownToolbar);
			nav.addEventListener('click', this._onClickToolbar);
		}

		document.addEventListener('selectionchange', this._onSelectionChange);

		// Request event — set content programmatically
		this._onSetContent = function (e) {
			var html = e.detail && e.detail.html;
			if (html !== undefined) {
				self._surface.innerHTML = html;
				self._syncToTextarea();
			}
		};
		dom.addEventListener('ln-editor:set-content', this._onSetContent);

		return this;
	}

	// ─── Prototype Methods ────────────────────────────────────

	_component.prototype._syncToTextarea = function () {
		if (!this._textarea) return;
		this._textarea.value = this._surface.innerHTML;
	};

	_component.prototype._execAction = function (action) {
		if (!action) return;

		var before = dispatchCancelable(this.dom, 'ln-editor:before-change', {
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
			var tag = BLOCK_COMMANDS[action];
			var current = _getActiveBlockTag(this._surface);
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

		this._syncToTextarea();
		this._updateActiveStates();

		dispatch(this.dom, 'ln-editor:changed', {
			html: this._textarea.value,
			target: this.dom
		});
	};

	_component.prototype._updateActiveStates = function () {
		var nav = this.dom.querySelector('nav');
		if (!nav) return;

		// Only update if the selection is within our surface
		var sel = window.getSelection();
		if (!sel || sel.rangeCount === 0) return;
		var anchorNode = sel.anchorNode;
		if (!anchorNode || !this._surface.contains(anchorNode)) return;

		var buttons = nav.querySelectorAll('[data-ln-editor-action]');
		for (var i = 0; i < buttons.length; i++) {
			var btn = buttons[i];
			var action = btn.getAttribute('data-ln-editor-action');
			var isActive = false;

			if (INLINE_COMMANDS[action]) {
				try {
					isActive = document.queryCommandState(INLINE_COMMANDS[action]);
				} catch (e) {
					// Ignore — some commands may not be queryable
				}
			} else if (BLOCK_COMMANDS[action]) {
				var currentBlock = _getActiveBlockTag(this._surface);
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
		this._surface.innerHTML = html;
		this._syncToTextarea();
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

		var nav = this.dom.querySelector('nav');
		if (nav) {
			nav.removeEventListener('mousedown', this._onMousedownToolbar);
			nav.removeEventListener('click', this._onClickToolbar);
		}

		document.removeEventListener('selectionchange', this._onSelectionChange);
		this.dom.removeEventListener('ln-editor:set-content', this._onSetContent);

		// Restore textarea visibility
		if (this._textarea) {
			this._textarea.removeAttribute('data-ln-editor-source');
		}

		// Remove link popover if present
		var popover = this.dom.querySelector('.ln-editor__link-popover');
		if (popover) popover.remove();

		dispatch(this.dom, 'ln-editor:destroyed', { target: this.dom });
		delete this.dom[DOM_ATTRIBUTE];
	};

	// ─── Private helpers ──────────────────────────────────────

	/**
	 * Walk up from node to find the active block-level tag within the surface.
	 */
	function _getActiveBlockTag(surface) {
		var sel = window.getSelection();
		if (!sel || sel.rangeCount === 0) return null;

		var node = sel.anchorNode;
		if (!node) return null;

		// Walk up to find block element
		while (node && node !== surface) {
			if (node.nodeType === 1) {
				var tag = node.tagName;
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

		var html = '';
		if (e.clipboardData) {
			html = e.clipboardData.getData('text/html');
			if (!html) {
				// Fallback to plain text
				var text = e.clipboardData.getData('text/plain');
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

		var sanitized = _sanitizeHTML(html);
		if (sanitized) {
			document.execCommand('insertHTML', false, sanitized);
		}
	}

	/**
	 * Recursively sanitize an HTML string, keeping only allowed tags.
	 */
	function _sanitizeHTML(html) {
		var container = document.createElement('div');
		container.innerHTML = html;
		_walkAndSanitize(container);
		return container.innerHTML;
	}

	function _walkAndSanitize(node) {
		var children = Array.from(node.childNodes);
		for (var i = 0; i < children.length; i++) {
			var child = children[i];

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
				var attrs = Array.from(child.attributes);
				for (var j = 0; j < attrs.length; j++) {
					var attrName = attrs[j].name;
					if (child.tagName === 'A' && attrName === 'href') {
						// Sanitize href — only allow http/https/mailto
						var href = child.getAttribute('href') || '';
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

		var action = null;
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
		var sel = window.getSelection();
		if (!sel || sel.rangeCount === 0) return;

		// Check if already inside a link — if so, let user edit the href
		var existingLink = _getAncestorTag(sel.anchorNode, 'A', instance._surface);

		// Save the current selection range so we can restore it
		var savedRange = sel.getRangeAt(0).cloneRange();

		// Remove any existing popover
		var existing = instance.dom.querySelector('.ln-editor__link-popover');
		if (existing) existing.remove();

		// Create inline link popover
		var popover = document.createElement('div');
		popover.className = 'ln-editor__link-popover';

		var input = document.createElement('input');
		input.type = 'url';
		input.placeholder = 'https://…';
		if (existingLink) {
			input.value = existingLink.getAttribute('href') || '';
		}

		var confirmBtn = document.createElement('button');
		confirmBtn.type = 'button';
		confirmBtn.innerHTML = '<svg class="ln-icon ln-icon--sm" aria-hidden="true"><use href="#ln-check"></use></svg>';
		confirmBtn.setAttribute('aria-label', 'Confirm');

		var removeBtn = document.createElement('button');
		removeBtn.type = 'button';
		removeBtn.innerHTML = '<svg class="ln-icon ln-icon--sm" aria-hidden="true"><use href="#ln-x"></use></svg>';
		removeBtn.setAttribute('aria-label', 'Cancel');

		popover.appendChild(input);
		popover.appendChild(confirmBtn);
		popover.appendChild(removeBtn);

		// Insert popover after the nav
		var nav = instance.dom.querySelector('nav');
		if (nav) {
			nav.after(popover);
		} else {
			instance.dom.insertBefore(popover, instance._surface);
		}

		input.focus();

		function _restoreSelection() {
			var sel = window.getSelection();
			sel.removeAllRanges();
			sel.addRange(savedRange);
		}

		function _apply() {
			var url = input.value.trim();
			popover.remove();

			_restoreSelection();
			instance._surface.focus();

			if (url) {
				if (existingLink) {
					existingLink.setAttribute('href', url);
				} else {
					document.execCommand('createLink', false, url);
					// Add rel to newly created links
					var sel = window.getSelection();
					if (sel && sel.anchorNode) {
						var newLink = _getAncestorTag(sel.anchorNode, 'A', instance._surface);
						if (newLink) {
							newLink.setAttribute('rel', 'noopener noreferrer');
						}
					}
				}
			} else if (existingLink) {
				// Empty URL on existing link — unlink
				document.execCommand('unlink', false, null);
			}

			instance._syncToTextarea();
			dispatch(instance.dom, 'ln-editor:changed', {
				html: instance._textarea.value,
				target: instance.dom
			});
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

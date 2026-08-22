import { registerComponent, dispatch, dispatchCancelable, buildDict, cloneTemplateScoped, fill, getLocale } from '../../ln-core';

(function () {
	const DOM_SELECTOR = 'data-ln-upload';
	const DOM_ATTRIBUTE = 'lnUpload';
	const DICT_SELECTOR = 'data-ln-upload-dict';
	const ACCEPT_ATTR = 'data-ln-upload-accept';
	const DELETE_ATTR = 'data-ln-upload-delete';
	const MAX_SIZE_ATTR = 'data-ln-upload-max-size';
	const MAX_FILES_ATTR = 'data-ln-upload-max-files';
	const FILE_FIELD_ATTR = 'data-ln-upload-file-field';
	const IDS_FIELD_ATTR = 'data-ln-upload-ids-field';
	const DEFAULT_FILE_FIELD = 'file';
	const DEFAULT_IDS_FIELD = 'file_ids[]';

	if (window[DOM_ATTRIBUTE] !== undefined) return;

	function _parseAccept(acceptStr) {
		if (!acceptStr) return null;
		return acceptStr
			.split(',')
			.map(function (s) { return s.trim().toLowerCase(); })
			.filter(Boolean)
			.map(function (s) { return s.startsWith('.') ? s.slice(1) : s; });
	}

	function _getExtension(filename) {
		if (!filename || !filename.includes('.')) return '';
		return filename.split('.').pop().toLowerCase();
	}

	function _isValidFile(file, allowedExts) {
		if (!allowedExts || allowedExts.length === 0) return true;
		const ext = _getExtension(file.name);
		const mime = (file.type || '').toLowerCase();
		return allowedExts.some(function (allowed) {
			if (allowed.includes('/')) {
				if (allowed.endsWith('/*')) {
					const prefix = allowed.slice(0, -1);
					return mime.startsWith(prefix);
				}
				return mime === allowed;
			}
			return ext === allowed;
		});
	}

	function _formatSize(bytes, locale, dict) {
		if (typeof bytes !== 'number' || isNaN(bytes) || bytes === 0) {
			return '0 ' + (dict['unit-b'] || 'B');
		}
		const k = 1024;
		const sizes = [
			dict['unit-b'] || 'B',
			dict['unit-kb'] || 'KB',
			dict['unit-mb'] || 'MB',
			dict['unit-gb'] || 'GB'
		];
		const i = Math.floor(Math.log(bytes) / Math.log(k));
		const unitIndex = Math.min(i, sizes.length - 1);
		const num = bytes / Math.pow(k, unitIndex);
		const formattedNum = new Intl.NumberFormat(locale, {
			maximumFractionDigits: 1,
			minimumFractionDigits: 0
		}).format(num);
		return formattedNum + ' ' + sizes[unitIndex];
	}

	function _getCsrfToken() {
		const meta = document.querySelector('meta[name="csrf-token"]');
		return meta ? meta.getAttribute('content') : '';
	}

	// ─── Component Constructor ─────────────────────────────

	function _component(dom) {
		this.dom = dom;
		this.dict = buildDict(dom, DICT_SELECTOR);
		this.locale = getLocale(dom);

		this.zone = dom.querySelector('[data-ln-upload-zone]') || dom;
		this.list = dom.querySelector('[data-ln-upload-list]');
		this.input = dom.querySelector('input[type="file"]');

		if (!this.input) {
			console.warn('[ln-upload] Missing <input type="file"> in container:', dom);
		}

		this.uploadUrl = dom.getAttribute(DOM_SELECTOR) || '';
		this.deleteUrlPattern = dom.getAttribute(DELETE_ATTR) || '';
		this.fileFieldName = dom.getAttribute(FILE_FIELD_ATTR) || DEFAULT_FILE_FIELD;
		this.idsFieldName = dom.getAttribute(IDS_FIELD_ATTR) || DEFAULT_IDS_FIELD;
		this.maxSize = parseInt(dom.getAttribute(MAX_SIZE_ATTR), 10) || 0;
		this.maxFiles = parseInt(dom.getAttribute(MAX_FILES_ATTR), 10) || 0;

		const acceptStr = dom.getAttribute(ACCEPT_ATTR) || (this.input ? this.input.getAttribute('accept') : '');
		this.allowedExts = _parseAccept(acceptStr);

		this.uploadedFiles = new Map();
		this.fileIdCounter = 0;
		this._dragDepth = 0;

		this._hydrate();
		this._bindEvents();

		return this;
	}

	// ─── Hydration of Pre-rendered SSR Files ────────────────

	_component.prototype._hydrate = function () {
		const self = this;
		if (!this.list) return;

		const items = this.list.querySelectorAll('[data-ln-upload-item]');
		for (let i = 0; i < items.length; i++) {
			const item = items[i];
			const serverId = item.getAttribute('data-ln-upload-id');
			const localId = 'file-' + (++self.fileIdCounter);

			item.setAttribute('data-ln-upload-local-id', localId);

			const nameEl = item.querySelector('[data-ln-field="name"]');
			const sizeEl = item.querySelector('[data-ln-field="sizeText"]');
			const rawSize = item.getAttribute('data-ln-upload-size');
			const parsedSize = rawSize ? parseInt(rawSize, 10) : null;

			self.uploadedFiles.set(localId, {
				serverId: serverId || null,
				name: nameEl ? nameEl.textContent.trim() : '',
				size: (parsedSize !== null && !isNaN(parsedSize)) ? parsedSize : (sizeEl ? sizeEl.textContent.trim() : '')
			});
		}

		// Also discover any pre-existing hidden inputs that might not have matching list items
		const hiddenInputs = this.dom.querySelectorAll('input[type="hidden"]');
		for (let i = 0; i < hiddenInputs.length; i++) {
			const input = hiddenInputs[i];
			if (input.name === self.idsFieldName && input.value) {
				const existing = Array.from(self.uploadedFiles.values()).some(function (f) {
					return String(f.serverId) === String(input.value);
				});
				if (!existing) {
					const localId = 'file-' + (++self.fileIdCounter);
					self.uploadedFiles.set(localId, {
						serverId: input.value,
						name: '',
						size: ''
					});
				}
			}
		}

		this._syncHiddenInputs();
	};

	// ─── Hidden Inputs Sync ────────────────────────────────

	_component.prototype._syncHiddenInputs = function () {
		const self = this;
		const currentHidden = this.dom.querySelectorAll('input[type="hidden"]');
		for (let i = 0; i < currentHidden.length; i++) {
			if (currentHidden[i].name === self.idsFieldName) {
				currentHidden[i].remove();
			}
		}

		for (const [, fileData] of this.uploadedFiles) {
			if (fileData.serverId) {
				const input = document.createElement('input');
				input.type = 'hidden';
				input.name = self.idsFieldName;
				input.value = fileData.serverId;
				self.dom.appendChild(input);
			}
		}
	};

	// ─── Event Binding ─────────────────────────────────────

	_component.prototype._bindEvents = function () {
		const self = this;

		this._onZoneClick = function (e) {
			if (self.zone === self.dom) {
				if (e.target.closest('[data-ln-upload-list], [data-ln-upload-action], input, button, a')) return;
			}
			if (self.input && e.target !== self.input) {
				self.input.click();
			}
		};

		this._onInputChange = function () {
			if (self.input && self.input.files) {
				self.upload(self.input.files);
				self.input.value = '';
			}
		};

		this._onDragEnter = function (e) {
			e.preventDefault();
			e.stopPropagation();
			self._dragDepth++;
			self.zone.setAttribute('data-ln-upload-state', 'dragover');
		};

		this._onDragOver = function (e) {
			e.preventDefault();
			e.stopPropagation();
			self.zone.setAttribute('data-ln-upload-state', 'dragover');
		};

		this._onDragLeave = function (e) {
			e.preventDefault();
			e.stopPropagation();
			self._dragDepth--;
			if (self._dragDepth <= 0) {
				self._dragDepth = 0;
				self.zone.removeAttribute('data-ln-upload-state');
			}
		};

		this._onDrop = function (e) {
			e.preventDefault();
			e.stopPropagation();
			self._dragDepth = 0;
			self.zone.removeAttribute('data-ln-upload-state');
			if (e.dataTransfer && e.dataTransfer.files) {
				self.upload(e.dataTransfer.files);
			}
		};

		this._onListClick = function (e) {
			const removeBtn = e.target.closest('[data-ln-upload-action="remove"]');
			if (!removeBtn || !self.list || !self.list.contains(removeBtn)) return;
			if (removeBtn.disabled) return;
			const item = removeBtn.closest('[data-ln-upload-item]');
			if (item) {
				const localId = item.getAttribute('data-ln-upload-local-id');
				if (localId) self.remove(localId);
			}
		};

		// Inbound Request Command listeners (CQS)
		this._onRequestUpload = function (e) {
			if (e.detail && e.detail.files) {
				self.upload(e.detail.files);
			}
		};

		this._onRequestRemove = function (e) {
			if (e.detail) {
				const id = e.detail.localId !== undefined ? e.detail.localId : e.detail.serverId;
				if (id !== undefined) self.remove(id);
			}
		};

		this._onRequestClear = function () {
			self.clear();
		};

		this.zone.addEventListener('click', this._onZoneClick);
		if (this.input) {
			this.input.addEventListener('change', this._onInputChange);
		}
		this.zone.addEventListener('dragenter', this._onDragEnter);
		this.zone.addEventListener('dragover', this._onDragOver);
		this.zone.addEventListener('dragleave', this._onDragLeave);
		this.zone.addEventListener('drop', this._onDrop);

		if (this.list) {
			this.list.addEventListener('click', this._onListClick);
		}

		this.dom.addEventListener('ln-upload:request-upload', this._onRequestUpload);
		this.dom.addEventListener('ln-upload:request-remove', this._onRequestRemove);
		this.dom.addEventListener('ln-upload:request-clear', this._onRequestClear);
	};

	// ─── File Upload Mechanics ─────────────────────────────

	_component.prototype.upload = function (files) {
		const self = this;
		const fileList = Array.from(files);

		for (let i = 0; i < fileList.length; i++) {
			const file = fileList[i];

			// Validate maximum files constraint
			if (self.maxFiles > 0 && self.uploadedFiles.size >= self.maxFiles) {
				dispatch(self.dom, 'ln-upload:invalid', {
					file: file,
					reason: 'max-files'
				});
				continue;
			}

			// Validate file extension / MIME type
			if (!_isValidFile(file, self.allowedExts)) {
				dispatch(self.dom, 'ln-upload:invalid', {
					file: file,
					reason: 'accept'
				});
				continue;
			}

			// Validate file max size in bytes
			if (self.maxSize > 0 && file.size > self.maxSize) {
				dispatch(self.dom, 'ln-upload:invalid', {
					file: file,
					reason: 'max-size'
				});
				continue;
			}

			// Cancelable before event
			const before = dispatchCancelable(self.dom, 'ln-upload:before-upload', { file: file });
			if (before.defaultPrevented) continue;

			self._uploadSingleFile(file);
		}
	};

	_component.prototype._uploadSingleFile = function (file) {
		const self = this;
		const localId = 'file-' + (++self.fileIdCounter);
		const ext = _getExtension(file.name);

		let item = null;
		if (this.list) {
			const fragment = cloneTemplateScoped(this.dom, 'ln-upload-item', 'ln-upload');
			if (fragment) {
				item = fragment.firstElementChild;
				if (item) {
					item.setAttribute('data-ln-upload-item', '');
					item.setAttribute('data-ln-upload-local-id', localId);
					item.setAttribute('data-ln-upload-ext', ext);
					item.setAttribute('data-ln-upload-state', 'uploading');

					fill(item, {
						name: file.name,
						sizeText: '0%',
						removeLabel: self.dict['remove'] || 'Remove',
						uploading: true,
						error: false,
						deleting: false
					});

					const removeBtn = item.querySelector('[data-ln-upload-action="remove"]');
					if (removeBtn) removeBtn.disabled = true;

					const progressEl = item.querySelector('[data-ln-progress]');
					if (progressEl) progressEl.setAttribute('data-ln-progress', '0');

					self.list.appendChild(item);
				}
			}
		}

		// Prepare multipart FormData
		const formData = new FormData();
		formData.append(self.fileFieldName, file);

		// Gather nested inputs, excluding file fields, unchecked inputs, and the hidden idsField
		const nestedInputs = this.dom.querySelectorAll('input, select, textarea');
		for (let i = 0; i < nestedInputs.length; i++) {
			const el = nestedInputs[i];
			if (!el.name || el.name === self.idsFieldName || el.type === 'file') continue;
			if ((el.type === 'checkbox' || el.type === 'radio') && !el.checked) continue;
			formData.append(el.name, el.value);
		}

		const xhr = new XMLHttpRequest();
		self.uploadedFiles.set(localId, {
			serverId: null,
			name: file.name,
			size: file.size,
			xhr: xhr
		});

		xhr.upload.addEventListener('progress', function (e) {
			if (e.lengthComputable) {
				const percent = Math.round((e.loaded / e.total) * 100);
				if (item) {
					const progressEl = item.querySelector('[data-ln-progress]');
					if (progressEl) progressEl.setAttribute('data-ln-progress', String(percent));
					fill(item, { sizeText: percent + '%' });
				}
				dispatch(self.dom, 'ln-upload:progress', {
					localId: localId,
					file: file,
					percent: percent,
					loaded: e.loaded,
					total: e.total
				});
			}
		});

		xhr.addEventListener('load', function () {
			const entry = self.uploadedFiles.get(localId);
			if (entry) delete entry.xhr;

			if (xhr.status >= 200 && xhr.status < 300) {
				let data;
				try {
					data = JSON.parse(xhr.responseText);
				} catch (e) {
					handleError(self.dict['error'] || 'Error', xhr.status, e);
					return;
				}

				const serverId = data.id || data.serverId;
				if (item) {
					item.removeAttribute('data-ln-upload-state');
					if (serverId) item.setAttribute('data-ln-upload-id', String(serverId));
					fill(item, {
						sizeText: _formatSize(data.size || file.size, self.locale, self.dict),
						uploading: false
					});
					const removeBtn = item.querySelector('[data-ln-upload-action="remove"]');
					if (removeBtn) removeBtn.disabled = false;
				}

				if (entry) {
					entry.serverId = serverId;
					entry.size = data.size || file.size;
					entry.name = data.name || file.name;
				}

				self._syncHiddenInputs();

				dispatch(self.dom, 'ln-upload:uploaded', {
					localId: localId,
					serverId: serverId,
					name: data.name || file.name,
					size: data.size || file.size,
					response: data
				});
			} else {
				let message = '';
				try {
					const errData = JSON.parse(xhr.responseText);
					message = errData.message || '';
				} catch (e) {}
				handleError(message, xhr.status, null);
			}
		});

		xhr.addEventListener('error', function () {
			const entry = self.uploadedFiles.get(localId);
			if (entry) delete entry.xhr;
			handleError('', 0, null);
		});

		function handleError(message, status, err) {
			if (item) {
				item.setAttribute('data-ln-upload-state', 'error');
				fill(item, {
					sizeText: self.dict['error'] || 'Error',
					uploading: false,
					error: true
				});
				const removeBtn = item.querySelector('[data-ln-upload-action="remove"]');
				if (removeBtn) removeBtn.disabled = false;
			}

			dispatch(self.dom, 'ln-upload:error', {
				file: file,
				message: message,
				status: status,
				error: err
			});
		}

		if (self.uploadUrl) {
			xhr.open('POST', self.uploadUrl);
			xhr.setRequestHeader('X-CSRF-TOKEN', _getCsrfToken());
			xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
			xhr.setRequestHeader('Accept', 'application/json');
			xhr.send(formData);
		} else {
			console.warn('[ln-upload] No upload URL configured (missing data-ln-upload)');
		}
	};

	// ─── File Removal & Deletion Mechanics ─────────────────

	_component.prototype.remove = function (id) {
		const self = this;

		// Resolve by localId or serverId
		let targetLocalId = null;
		let fileData = null;

		if (self.uploadedFiles.has(id)) {
			targetLocalId = id;
			fileData = self.uploadedFiles.get(id);
		} else {
			for (const [locId, data] of self.uploadedFiles) {
				if (String(data.serverId) === String(id)) {
					targetLocalId = locId;
					fileData = data;
					break;
				}
			}
		}

		if (!targetLocalId || !fileData) return;

		// Cancelable before event
		const before = dispatchCancelable(self.dom, 'ln-upload:before-remove', {
			localId: targetLocalId,
			serverId: fileData.serverId
		});
		if (before.defaultPrevented) return;

		const item = self.list ? self.list.querySelector('[data-ln-upload-local-id="' + targetLocalId + '"]') : null;

		// If upload was active and in-flight, abort it
		if (fileData.xhr && typeof fileData.xhr.abort === 'function') {
			fileData.xhr.abort();
		}

		// If the file has no serverId, simply remove from DOM and state
		if (!fileData.serverId) {
			if (item) item.remove();
			self.uploadedFiles.delete(targetLocalId);
			self._syncHiddenInputs();
			dispatch(self.dom, 'ln-upload:removed', { localId: targetLocalId, serverId: null });
			return;
		}

		// Resolve delete URL
		let deleteUrl = null;
		if (self.deleteUrlPattern) {
			deleteUrl = self.deleteUrlPattern.replace('{id}', encodeURIComponent(fileData.serverId));
		} else if (self.uploadUrl && self.uploadUrl.includes('{id}')) {
			deleteUrl = self.uploadUrl.replace('{id}', encodeURIComponent(fileData.serverId));
		}

		if (!deleteUrl) {
			// No delete endpoint configured — clean up locally and emit removed event
			if (item) item.remove();
			self.uploadedFiles.delete(targetLocalId);
			self._syncHiddenInputs();
			dispatch(self.dom, 'ln-upload:removed', { localId: targetLocalId, serverId: fileData.serverId });
			return;
		}

		if (item) {
			item.setAttribute('data-ln-upload-state', 'deleting');
			fill(item, { deleting: true });
		}

		fetch(deleteUrl, {
			method: 'DELETE',
			headers: {
				'X-CSRF-TOKEN': _getCsrfToken(),
				'X-Requested-With': 'XMLHttpRequest',
				'Accept': 'application/json'
			}
		})
			.then(function (response) {
				if (response.ok) {
					if (item) item.remove();
					self.uploadedFiles.delete(targetLocalId);
					self._syncHiddenInputs();
					dispatch(self.dom, 'ln-upload:removed', {
						localId: targetLocalId,
						serverId: fileData.serverId
					});
				} else {
					if (item) {
						item.removeAttribute('data-ln-upload-state');
						fill(item, { deleting: false });
					}
					dispatch(self.dom, 'ln-upload:error', {
						file: fileData,
						message: '',
						status: response.status
					});
				}
			})
			.catch(function (error) {
				if (item) {
					item.removeAttribute('data-ln-upload-state');
					fill(item, { deleting: false });
				}
				dispatch(self.dom, 'ln-upload:error', {
					file: fileData,
					message: '',
					status: 0,
					error: error
				});
			});
	};

	_component.prototype.clear = function () {
		const self = this;
		const before = dispatchCancelable(self.dom, 'ln-upload:before-clear', {});
		if (before.defaultPrevented) return;

		for (const [, fileData] of this.uploadedFiles) {
			if (fileData.xhr && typeof fileData.xhr.abort === 'function') {
				fileData.xhr.abort();
			}
			if (fileData.serverId) {
				let deleteUrl = null;
				if (self.deleteUrlPattern) {
					deleteUrl = self.deleteUrlPattern.replace('{id}', encodeURIComponent(fileData.serverId));
				} else if (self.uploadUrl && self.uploadUrl.includes('{id}')) {
					deleteUrl = self.uploadUrl.replace('{id}', encodeURIComponent(fileData.serverId));
				}
				if (deleteUrl) {
					fetch(deleteUrl, {
						method: 'DELETE',
						headers: {
							'X-CSRF-TOKEN': _getCsrfToken(),
							'X-Requested-With': 'XMLHttpRequest',
							'Accept': 'application/json'
						}
					}).catch(function () {});
				}
			}
		}

		self.uploadedFiles.clear();
		if (self.list) self.list.innerHTML = '';
		self._syncHiddenInputs();
		dispatch(self.dom, 'ln-upload:cleared', {});
	};

	_component.prototype.getFileIds = function () {
		return Array.from(this.uploadedFiles.values())
			.map(function (f) { return f.serverId; })
			.filter(Boolean);
	};

	_component.prototype.getFiles = function () {
		return Array.from(this.uploadedFiles.values()).map(function (f) {
			return {
				serverId: f.serverId,
				name: f.name,
				size: f.size
			};
		});
	};

	// ─── Destroy Lifecycle ─────────────────────────────────

	_component.prototype.destroy = function () {
		if (!this.dom[DOM_ATTRIBUTE]) return;

		// Abort in-flight XHRs
		for (const [, fileData] of this.uploadedFiles) {
			if (fileData.xhr && typeof fileData.xhr.abort === 'function') {
				fileData.xhr.abort();
			}
		}

		this.zone.removeEventListener('click', this._onZoneClick);
		if (this.input) {
			this.input.removeEventListener('change', this._onInputChange);
		}
		this.zone.removeEventListener('dragenter', this._onDragEnter);
		this.zone.removeEventListener('dragover', this._onDragOver);
		this.zone.removeEventListener('dragleave', this._onDragLeave);
		this.zone.removeEventListener('drop', this._onDrop);

		if (this.list) {
			this.list.removeEventListener('click', this._onListClick);
		}

		this.dom.removeEventListener('ln-upload:request-upload', this._onRequestUpload);
		this.dom.removeEventListener('ln-upload:request-remove', this._onRequestRemove);
		this.dom.removeEventListener('ln-upload:request-clear', this._onRequestClear);

		this.uploadedFiles.clear();
		this.dict = {};

		dispatch(this.dom, 'ln-upload:destroyed', { target: this.dom });
		delete this.dom[DOM_ATTRIBUTE];
	};

	// ─── Registration ──────────────────────────────────────

	registerComponent(DOM_SELECTOR, DOM_ATTRIBUTE, _component, 'ln-upload');
})();

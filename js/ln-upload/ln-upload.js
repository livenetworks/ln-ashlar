import { guardBody, dispatch, buildDict, cloneTemplateScoped, fill } from '../ln-core';

(function () {
	const DOM_SELECTOR = 'data-ln-upload';
	const DOM_ATTRIBUTE = 'lnUpload';
	const DICT_SELECTOR = 'data-ln-upload-dict';
	const ACCEPT_ATTR = 'data-ln-upload-accept';
	const CONTEXT_ATTR = 'data-ln-upload-context';

	const DEFAULT_ITEM_TEMPLATE_HTML =
		'<template data-ln-template="ln-upload-item">' +
			'<li class="ln-upload__item" data-ln-class="ln-upload__item--uploading:uploading, ln-upload__item--error:error, ln-upload__item--deleting:deleting">' +
				'<svg class="ln-icon" aria-hidden="true"><use data-ln-attr="href:iconHref" href="#ln-file"></use></svg>' +
				'<span class="ln-upload__name" data-ln-field="name"></span>' +
				'<span class="ln-upload__size" data-ln-field="sizeText"></span>' +
				'<button type="button" class="ln-upload__remove" data-ln-upload-action="remove" data-ln-attr="aria-label:removeLabel, title:removeLabel">' +
					'<svg class="ln-icon" aria-hidden="true"><use href="#ln-x"></use></svg>' +
				'</button>' +
				'<div class="ln-upload__progress"><div class="ln-upload__progress-bar"></div></div>' +
			'</li>' +
		'</template>';

	function _ensureDefaultItemTemplate() {
		if (document.querySelector('[data-ln-template="ln-upload-item"]')) return;
		if (!document.body) return;
		const holder = document.createElement('div');
		holder.innerHTML = DEFAULT_ITEM_TEMPLATE_HTML;
		const tmpl = holder.firstElementChild;
		if (tmpl) document.body.appendChild(tmpl);
	}

	if (window[DOM_ATTRIBUTE] !== undefined) return;

	function _formatSize(bytes) {
		if (bytes === 0) return '0 B';
		const k = 1024;
		const sizes = ['B', 'KB', 'MB', 'GB'];
		const i = Math.floor(Math.log(bytes) / Math.log(k));
		return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
	}

	function _getExtension(filename) {
		return filename.split('.').pop().toLowerCase();
	}

	function _getIconId(extension) {
		if (extension === 'docx') extension = 'doc';
		const supported = ['pdf', 'doc', 'epub'];
		return supported.includes(extension) ? 'lnc-file-' + extension : 'ln-file';
	}

	function _isValidFile(file, acceptString) {
		if (!acceptString) return true;
		const ext = '.' + _getExtension(file.name);
		const allowed = acceptString.split(',').map(function (s) { return s.trim().toLowerCase(); });
		return allowed.includes(ext.toLowerCase());
	}

	function _initUpload(container) {
		if (container.hasAttribute('data-ln-upload-initialized')) return;
		container.setAttribute('data-ln-upload-initialized', 'true');

		_ensureDefaultItemTemplate();
		const dict = buildDict(container, DICT_SELECTOR);
		const zone = container.querySelector('.ln-upload__zone');
		const list = container.querySelector('.ln-upload__list');
		const acceptString = container.getAttribute(ACCEPT_ATTR) || '';

		if (!zone || !list) {
			console.warn('[ln-upload] Missing .ln-upload__zone or .ln-upload__list in container:', container);
			return;
		}

		let input = container.querySelector('input[type="file"]');
		if (!input) {
			input = document.createElement('input');
			input.type = 'file';
			input.multiple = true;
			input.classList.add('hidden');
			if (acceptString) {
				input.accept = acceptString.split(',').map(function(ext) {
					ext = ext.trim();
					return ext.startsWith('.') ? ext : '.' + ext;
				}).join(',');
			}
			container.appendChild(input);
		}
		const uploadUrl = container.getAttribute(DOM_SELECTOR) || '/files/upload';
		const uploadContext = container.getAttribute(CONTEXT_ATTR) || '';

		const uploadedFiles = new Map();
		let fileIdCounter = 0;

		function getCsrfToken() {
			const meta = document.querySelector('meta[name="csrf-token"]');
			return meta ? meta.getAttribute('content') : '';
		}

		function addFile(file) {
			if (!_isValidFile(file, acceptString)) {
				const message = dict['invalid-type'];
				dispatch(container, 'ln-upload:invalid', {
					file: file,
					message: message
				});

				dispatch(window, 'ln-toast:enqueue', {
					type: 'error',
					title: dict['invalid-title'] || 'Invalid File',
					message: message || dict['invalid-type'] || 'This file type is not allowed'
				});
				return;
			}

			const localId = 'file-' + (++fileIdCounter);
			const ext = _getExtension(file.name);
			const iconId = _getIconId(ext);

			const fragment = cloneTemplateScoped(container, 'ln-upload-item', 'ln-upload');
			if (!fragment) return;
			const li = fragment.firstElementChild;
			if (!li) return;

			li.setAttribute('data-file-id', localId);

			fill(li, {
				name: file.name,
				sizeText: '0%',
				iconHref: '#' + iconId,
				removeLabel: dict['remove'] || 'Remove',
				uploading: true,
				error: false,
				deleting: false
			});

			const progressBar = li.querySelector('.ln-upload__progress-bar');
			const removeBtn = li.querySelector('[data-ln-upload-action="remove"]');
			if (removeBtn) removeBtn.disabled = true;

			list.appendChild(li);

			const formData = new FormData();
			formData.append('file', file);
			formData.append('context', uploadContext);

			const xhr = new XMLHttpRequest();

			xhr.upload.addEventListener('progress', function (e) {
				if (e.lengthComputable) {
					const percent = Math.round((e.loaded / e.total) * 100);
					progressBar.style.width = percent + '%';
					fill(li, { sizeText: percent + '%' });
				}
			});

			xhr.addEventListener('load', function () {
				if (xhr.status >= 200 && xhr.status < 300) {
					let data;
					try {
						data = JSON.parse(xhr.responseText);
					} catch (e) {
						handleError('Invalid response');
						return;
					}

					fill(li, { sizeText: _formatSize(data.size || file.size), uploading: false });
					if (removeBtn) removeBtn.disabled = false;

					uploadedFiles.set(localId, {
						serverId: data.id,
						name: data.name,
						size: data.size
					});

					updateHiddenInput();

					dispatch(container, 'ln-upload:uploaded', {
						localId: localId,
						serverId: data.id,
						name: data.name
					});
				} else {
					let message = dict['upload-failed'] || 'Upload failed';
					try {
						const errorData = JSON.parse(xhr.responseText);
						message = errorData.message || message;
					} catch (e) { }
					handleError(message);
				}
			});

			xhr.addEventListener('error', function () {
				handleError(dict['network-error'] || 'Network error');
			});

			function handleError(message) {
				if (progressBar) progressBar.style.width = '100%';
				fill(li, { sizeText: dict['error'] || 'Error', uploading: false, error: true });
				if (removeBtn) removeBtn.disabled = false;

				dispatch(container, 'ln-upload:error', {
					file: file,
					message: message
				});

				dispatch(window, 'ln-toast:enqueue', {
					type: 'error',
					title: dict['error-title'] || 'Upload Error',
					message: message || dict['upload-failed'] || 'Failed to upload file'
				});
			}

			xhr.open('POST', uploadUrl);
			xhr.setRequestHeader('X-CSRF-TOKEN', getCsrfToken());
			xhr.setRequestHeader('Accept', 'application/json');
			xhr.send(formData);
		}

		function updateHiddenInput() {
			for (const el of container.querySelectorAll('input[name="file_ids[]"]')) {
				el.remove();
			}

			for (const [, fileData] of uploadedFiles) {
				const hiddenInput = document.createElement('input');
				hiddenInput.type = 'hidden';
				hiddenInput.name = 'file_ids[]';
				hiddenInput.value = fileData.serverId;
				container.appendChild(hiddenInput);
			}
		}

		function removeFile(localId) {
			const fileData = uploadedFiles.get(localId);
			const item = list.querySelector('[data-file-id="' + localId + '"]');

			if (!fileData || !fileData.serverId) {
				if (item) item.remove();
				uploadedFiles.delete(localId);
				updateHiddenInput();
				return;
			}

			if (item) fill(item, { deleting: true });

			fetch('/files/' + fileData.serverId, {
				method: 'DELETE',
				headers: {
					'X-CSRF-TOKEN': getCsrfToken(),
					'Accept': 'application/json'
				}
			})
				.then(function (response) {
					if (response.status === 200) {
						if (item) item.remove();
						uploadedFiles.delete(localId);
						updateHiddenInput();

						dispatch(container, 'ln-upload:removed', {
							localId: localId,
							serverId: fileData.serverId
						});
					} else {
						if (item) fill(item, { deleting: false });

						dispatch(window, 'ln-toast:enqueue', {
							type: 'error',
							title: dict['delete-title'] || 'Error',
							message: dict['delete-error'] || 'Failed to delete file'
						});
					}
				})
				.catch(function (error) {
					console.warn('[ln-upload] Delete error:', error);
					if (item) fill(item, { deleting: false });

					dispatch(window, 'ln-toast:enqueue', {
						type: 'error',
						title: dict['network-error'] || 'Network error',
						message: dict['connection-error'] || 'Could not connect to server'
					});
				});
		}

		function handleFiles(fileList) {
			for (const file of fileList) {
				addFile(file);
			}
			input.value = '';
		}

		const _onZoneClick = function () { input.click(); };
		const _onInputChange = function () { handleFiles(this.files); };
		const _onDragEnter = function (e) { e.preventDefault(); e.stopPropagation(); zone.classList.add('ln-upload__zone--dragover'); };
		const _onDragOver = function (e) { e.preventDefault(); e.stopPropagation(); zone.classList.add('ln-upload__zone--dragover'); };
		const _onDragLeave = function (e) { e.preventDefault(); e.stopPropagation(); zone.classList.remove('ln-upload__zone--dragover'); };
		const _onDrop = function (e) { e.preventDefault(); e.stopPropagation(); zone.classList.remove('ln-upload__zone--dragover'); handleFiles(e.dataTransfer.files); };
		const _onListClick = function (e) {
			const btn = e.target.closest('[data-ln-upload-action="remove"]');
			if (!btn || !list.contains(btn)) return;
			if (btn.disabled) return;
			const item = btn.closest('.ln-upload__item');
			if (item) removeFile(item.getAttribute('data-file-id'));
		};

		zone.addEventListener('click', _onZoneClick);
		input.addEventListener('change', _onInputChange);
		zone.addEventListener('dragenter', _onDragEnter);
		zone.addEventListener('dragover', _onDragOver);
		zone.addEventListener('dragleave', _onDragLeave);
		zone.addEventListener('drop', _onDrop);
		list.addEventListener('click', _onListClick);

		container.lnUploadAPI = {
			getFileIds: function () {
				return Array.from(uploadedFiles.values()).map(function (f) { return f.serverId; });
			},
			getFiles: function () {
				return Array.from(uploadedFiles.values());
			},
			clear: function () {
				for (const [, fileData] of uploadedFiles) {
					if (fileData.serverId) {
						fetch('/files/' + fileData.serverId, {
							method: 'DELETE',
							headers: {
								'X-CSRF-TOKEN': getCsrfToken(),
								'Accept': 'application/json'
							}
						});
					}
				}
				uploadedFiles.clear();
				list.innerHTML = '';
				updateHiddenInput();
				dispatch(container, 'ln-upload:cleared', {});
			},
			destroy: function () {
				zone.removeEventListener('click', _onZoneClick);
				input.removeEventListener('change', _onInputChange);
				zone.removeEventListener('dragenter', _onDragEnter);
				zone.removeEventListener('dragover', _onDragOver);
				zone.removeEventListener('dragleave', _onDragLeave);
				zone.removeEventListener('drop', _onDrop);
				list.removeEventListener('click', _onListClick);
				uploadedFiles.clear();
				list.innerHTML = '';
				updateHiddenInput();
				container.removeAttribute('data-ln-upload-initialized');
				delete container.lnUploadAPI;
			}
		};
	}

	function _initializeAll() {
		for (const el of document.querySelectorAll('[' + DOM_SELECTOR + ']')) {
			_initUpload(el);
		}
	}

	function _domObserver() {
		guardBody(function () {
			const observer = new MutationObserver(function (mutations) {
				for (const mutation of mutations) {
					if (mutation.type === 'childList') {
						for (const node of mutation.addedNodes) {
							if (node.nodeType === 1) {
								if (node.hasAttribute(DOM_SELECTOR)) {
									_initUpload(node);
								}

								for (const child of node.querySelectorAll('[' + DOM_SELECTOR + ']')) {
									_initUpload(child);
								}
							}
						}
					} else if (mutation.type === 'attributes') {
						if (mutation.target.hasAttribute(DOM_SELECTOR)) {
							_initUpload(mutation.target);
						}
					}
				}
			});

			observer.observe(document.body, {
				childList: true,
				subtree: true,
				attributes: true,
				attributeFilter: [DOM_SELECTOR]
			});
		}, 'ln-upload');
	}

	window[DOM_ATTRIBUTE] = {
		init: _initUpload,
		initAll: _initializeAll
	};

	_domObserver();

	if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', _initializeAll);
	} else {
		_initializeAll();
	}
})();

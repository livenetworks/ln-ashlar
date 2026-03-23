(function () {
	const DOM_SELECTOR = 'data-ln-upload';
	const DOM_ATTRIBUTE = 'lnUpload';
	const DICT_SELECTOR = 'data-ln-upload-dict';
	const ACCEPT_ATTR = 'data-ln-upload-accept';
	const CONTEXT_ATTR = 'data-ln-upload-context';

	if (window[DOM_ATTRIBUTE] !== undefined) return;

	function _getDict(container, key) {
		const el = container.querySelector('[' + DICT_SELECTOR + '="' + key + '"]');
		return el ? el.textContent : key;
	}

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

	function _getIconClass(extension) {
		if (extension === 'docx') extension = 'doc';
		const supported = ['pdf', 'doc', 'epub'];
		return supported.includes(extension) ? 'ln-icon-file-' + extension : 'ln-icon-file';
	}

	function _isValidFile(file, acceptString) {
		if (!acceptString) return true;
		const ext = '.' + _getExtension(file.name);
		const allowed = acceptString.split(',').map(function (s) { return s.trim().toLowerCase(); });
		return allowed.includes(ext.toLowerCase());
	}

	function _dispatch(element, eventName, detail) {
		element.dispatchEvent(new CustomEvent(eventName, {
			bubbles: true,
			detail: detail
		}));
	}

	function _initUpload(container) {
		if (container.hasAttribute('data-ln-upload-initialized')) return;
		container.setAttribute('data-ln-upload-initialized', 'true');

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
			input.style.display = 'none';
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
				const message = _getDict(container, 'invalid-type');
				_dispatch(container, 'ln-upload:invalid', {
					file: file,
					message: message
				});

				window.dispatchEvent(new CustomEvent('ln-toast:enqueue', {
					detail: {
						type: 'error',
						title: 'Invalid File',
						message: message || 'This file type is not allowed'
					}
				}));
				return;
			}

			const localId = 'file-' + (++fileIdCounter);
			const ext = _getExtension(file.name);
			const iconClass = _getIconClass(ext);

			const li = document.createElement('li');
			li.className = 'ln-upload__item ln-upload__item--uploading ' + iconClass;
			li.setAttribute('data-file-id', localId);

			const nameSpan = document.createElement('span');
			nameSpan.className = 'ln-upload__name';
			nameSpan.textContent = file.name;

			const sizeSpan = document.createElement('span');
			sizeSpan.className = 'ln-upload__size';
			sizeSpan.textContent = '0%';

			const removeBtn = document.createElement('button');
			removeBtn.type = 'button';
			removeBtn.className = 'ln-upload__remove ln-icon-close';
			removeBtn.title = _getDict(container, 'remove');
			removeBtn.textContent = '\u00D7';
			removeBtn.disabled = true;

			const progress = document.createElement('div');
			progress.className = 'ln-upload__progress';
			const progressBar = document.createElement('div');
			progressBar.className = 'ln-upload__progress-bar';
			progress.appendChild(progressBar);

			li.appendChild(nameSpan);
			li.appendChild(sizeSpan);
			li.appendChild(removeBtn);
			li.appendChild(progress);
			list.appendChild(li);

			const formData = new FormData();
			formData.append('file', file);
			formData.append('context', uploadContext);

			const xhr = new XMLHttpRequest();

			xhr.upload.addEventListener('progress', function (e) {
				if (e.lengthComputable) {
					const percent = Math.round((e.loaded / e.total) * 100);
					progressBar.style.width = percent + '%';
					sizeSpan.textContent = percent + '%';
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

					li.classList.remove('ln-upload__item--uploading');
					sizeSpan.textContent = _formatSize(data.size || file.size);
					removeBtn.disabled = false;

					uploadedFiles.set(localId, {
						serverId: data.id,
						name: data.name,
						size: data.size
					});

					updateHiddenInput();

					_dispatch(container, 'ln-upload:uploaded', {
						localId: localId,
						serverId: data.id,
						name: data.name
					});
				} else {
					let message = 'Upload failed';
					try {
						const errorData = JSON.parse(xhr.responseText);
						message = errorData.message || message;
					} catch (e) { }
					handleError(message);
				}
			});

			xhr.addEventListener('error', function () {
				handleError('Network error');
			});

			function handleError(message) {
				li.classList.remove('ln-upload__item--uploading');
				li.classList.add('ln-upload__item--error');
				progressBar.style.width = '100%';
				sizeSpan.textContent = _getDict(container, 'error');
				removeBtn.disabled = false;

				_dispatch(container, 'ln-upload:error', {
					file: file,
					message: message
				});

				window.dispatchEvent(new CustomEvent('ln-toast:enqueue', {
					detail: {
						type: 'error',
						title: 'Upload Error',
						message: message || _getDict(container, 'upload-failed') || 'Failed to upload file'
					}
				}));
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

			if (item) {
				item.classList.add('ln-upload__item--deleting');
			}

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

						_dispatch(container, 'ln-upload:removed', {
							localId: localId,
							serverId: fileData.serverId
						});
					} else {
						if (item) item.classList.remove('ln-upload__item--deleting');

						window.dispatchEvent(new CustomEvent('ln-toast:enqueue', {
							detail: {
								type: 'error',
								title: 'Error',
								message: _getDict(container, 'delete-error') || 'Failed to delete file'
							}
						}));
					}
				})
				.catch(function (error) {
					console.warn('[ln-upload] Delete error:', error);
					if (item) item.classList.remove('ln-upload__item--deleting');

					window.dispatchEvent(new CustomEvent('ln-toast:enqueue', {
						detail: {
							type: 'error',
							title: 'Network Error',
							message: 'Could not connect to server'
						}
					}));
				});
		}

		function handleFiles(fileList) {
			for (const file of fileList) {
				addFile(file);
			}
			input.value = '';
		}

		zone.addEventListener('click', function () {
			input.click();
		});

		input.addEventListener('change', function () {
			handleFiles(this.files);
		});

		zone.addEventListener('dragenter', function (e) {
			e.preventDefault();
			e.stopPropagation();
			zone.classList.add('ln-upload__zone--dragover');
		});

		zone.addEventListener('dragover', function (e) {
			e.preventDefault();
			e.stopPropagation();
			zone.classList.add('ln-upload__zone--dragover');
		});

		zone.addEventListener('dragleave', function (e) {
			e.preventDefault();
			e.stopPropagation();
			zone.classList.remove('ln-upload__zone--dragover');
		});

		zone.addEventListener('drop', function (e) {
			e.preventDefault();
			e.stopPropagation();
			zone.classList.remove('ln-upload__zone--dragover');
			handleFiles(e.dataTransfer.files);
		});

		list.addEventListener('click', function (e) {
			if (e.target.classList.contains('ln-upload__remove')) {
				const item = e.target.closest('.ln-upload__item');
				if (item) {
					removeFile(item.getAttribute('data-file-id'));
				}
			}
		});

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
				_dispatch(container, 'ln-upload:cleared', {});
			}
		};
	}

	function _initializeAll() {
		for (const el of document.querySelectorAll('[' + DOM_SELECTOR + ']')) {
			_initUpload(el);
		}
	}

	function _domObserver() {
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

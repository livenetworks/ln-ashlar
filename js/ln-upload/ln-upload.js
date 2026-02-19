(function () {
	const DOM_SELECTOR = 'data-ln-upload';
	const DOM_ATTRIBUTE = 'lnUpload';
	const DICT_SELECTOR = 'data-ln-upload-dict';
	const ACCEPT_ATTR = 'data-ln-upload-accept';
	const CONTEXT_ATTR = 'data-ln-upload-context';

	// If component already defined, return
	if (window[DOM_ATTRIBUTE] != undefined || window[DOM_ATTRIBUTE] != null) {
		return;
	}

	/**
	 * Get dictionary string from container
	 * @param {HTMLElement} container
	 * @param {string} key
	 * @returns {string}
	 */
	function _getDict(container, key) {
		const el = container.querySelector('[' + DICT_SELECTOR + '="' + key + '"]');
		return el ? el.textContent : key;
	}

	/**
	 * Format file size to human readable
	 * @param {number} bytes
	 * @returns {string}
	 */
	function _formatSize(bytes) {
		if (bytes === 0) return '0 B';
		const k = 1024;
		const sizes = ['B', 'KB', 'MB', 'GB'];
		const i = Math.floor(Math.log(bytes) / Math.log(k));
		return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
	}

	/**
	 * Get file extension
	 * @param {string} filename
	 * @returns {string}
	 */
	function _getExtension(filename) {
		return filename.split('.').pop().toLowerCase();
	}

	/**
	 * Get icon class for file type
	 * @param {string} extension
	 * @returns {string}
	 */
	function _getIconClass(extension) {
		if (extension === 'docx') extension = 'doc';
		const supported = ['pdf', 'doc', 'epub'];
		return supported.includes(extension) ? 'ln-icon-file-' + extension : 'ln-icon-file';
	}

	/**
	 * Validate file against allowed extensions
	 * @param {File} file
	 * @param {string} acceptString
	 * @returns {boolean}
	 */
	function _isValidFile(file, acceptString) {
		if (!acceptString) return true;
		const ext = '.' + _getExtension(file.name);
		const allowed = acceptString.split(',').map(function (s) { return s.trim().toLowerCase(); });
		return allowed.includes(ext.toLowerCase());
	}

	/**
	 * Dispatch custom event
	 * @param {HTMLElement} element
	 * @param {string} eventName
	 * @param {object} detail
	 */
	function _dispatch(element, eventName, detail) {
		element.dispatchEvent(new CustomEvent(eventName, {
			bubbles: true,
			detail: detail
		}));
	}

	/**
	 * Initialize upload component
	 * @param {HTMLElement} container
	 */
	function _initUpload(container) {
		if (container.hasAttribute('data-ln-upload-initialized')) return;
		container.setAttribute('data-ln-upload-initialized', 'true');

		const zone = container.querySelector('.ln-upload__zone');
		const list = container.querySelector('.ln-upload__list');
		const input = container.querySelector('input[type="file"]');
		const acceptString = container.getAttribute(ACCEPT_ATTR) || '';
		const uploadUrl = container.getAttribute(DOM_SELECTOR) || '/files/upload';
		const uploadContext = container.getAttribute(CONTEXT_ATTR) || '';

		// Store uploaded file IDs (from server) mapped by local id
		const uploadedFiles = new Map();
		let fileIdCounter = 0;

		/**
		 * Get CSRF token from meta tag
		 */
		function getCsrfToken() {
			const meta = document.querySelector('meta[name="csrf-token"]');
			return meta ? meta.getAttribute('content') : '';
		}

		/**
		 * Add file to list and upload immediately
		 * @param {File} file
		 */
		function addFile(file) {
			if (!_isValidFile(file, acceptString)) {
				const message = _getDict(container, 'invalid-type');
				_dispatch(container, 'ln-upload:invalid', {
					file: file,
					message: message
				});

				// Notify user via toast
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

			// Create list item
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
			removeBtn.className = 'ln-upload__remove';
			removeBtn.title = _getDict(container, 'remove');
			removeBtn.textContent = '\u00D7';
			removeBtn.disabled = true;

			// Progress bar
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

			// Upload file with XMLHttpRequest for progress tracking
			const formData = new FormData();
			formData.append('file', file);
			formData.append('context', uploadContext);

			const xhr = new XMLHttpRequest();

			// Progress event
			xhr.upload.addEventListener('progress', function (e) {
				if (e.lengthComputable) {
					const percent = Math.round((e.loaded / e.total) * 100);
					progressBar.style.width = percent + '%';
					sizeSpan.textContent = percent + '%';
				}
			});

			// Load complete
			xhr.addEventListener('load', function () {
				if (xhr.status >= 200 && xhr.status < 300) {
					var data;
					try {
						data = JSON.parse(xhr.responseText);
					} catch (e) {
						handleError('Invalid response');
						return;
					}

					// Upload successful
					li.classList.remove('ln-upload__item--uploading');
					sizeSpan.textContent = _formatSize(data.size || file.size);
					removeBtn.disabled = false;

					// Store server file ID
					uploadedFiles.set(localId, {
						serverId: data.id,
						name: data.name,
						size: data.size
					});

					// Update hidden input
					updateHiddenInput();

					_dispatch(container, 'ln-upload:uploaded', {
						localId: localId,
						serverId: data.id,
						name: data.name
					});
				} else {
					var message = 'Upload failed';
					try {
						var errorData = JSON.parse(xhr.responseText);
						message = errorData.message || message;
					} catch (e) { }
					handleError(message);
				}
			});

			// Error event
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

				// Notify user via toast
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

		/**
		 * Update hidden input with uploaded file IDs
		 */
		function updateHiddenInput() {
			// Remove existing hidden inputs
			container.querySelectorAll('input[name="file_ids[]"]').forEach(function (el) {
				el.remove();
			});

			// Add hidden inputs for each uploaded file
			uploadedFiles.forEach(function (fileData) {
				const hiddenInput = document.createElement('input');
				hiddenInput.type = 'hidden';
				hiddenInput.name = 'file_ids[]';
				hiddenInput.value = fileData.serverId;
				container.appendChild(hiddenInput);
			});
		}

		/**
		 * Remove file from list
		 * @param {string} localId
		 */
		function removeFile(localId) {
			const fileData = uploadedFiles.get(localId);
			const item = list.querySelector('[data-file-id="' + localId + '"]');

			if (!fileData || !fileData.serverId) {
				if (item) item.remove();
				uploadedFiles.delete(localId);
				updateHiddenInput();
				return;
			}

			// If file was uploaded, delete from server
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
				.then(response => {
					if (response.status === 200) {
						if (item) {
							item.remove();
						}
						uploadedFiles.delete(localId);
						updateHiddenInput();

						_dispatch(container, 'ln-upload:removed', {
							localId: localId,
							serverId: fileData.serverId
						});
					} else {
						if (item) {
							item.classList.remove('ln-upload__item--deleting');
						}

						// Show toast error via event
						window.dispatchEvent(new CustomEvent('ln-toast:enqueue', {
							detail: {
								type: 'error',
								title: 'Error',
								message: _getDict(container, 'delete-error') || 'Failed to delete file'
							}
						}));
					}
				})
				.catch(error => {
					console.error('Delete error:', error);
					if (item) {
						item.classList.remove('ln-upload__item--deleting');
					}

					window.dispatchEvent(new CustomEvent('ln-toast:enqueue', {
						detail: {
							type: 'error',
							title: 'Network Error',
							message: 'Could not connect to server'
						}
					}));
				});
		}

		/**
		 * Handle file selection
		 * @param {FileList} fileList
		 */
		function handleFiles(fileList) {
			Array.from(fileList).forEach(function (file) {
				addFile(file);
			});
			// Clear input so same file can be selected again
			input.value = '';
		}

		// Click on zone opens file picker
		zone.addEventListener('click', function () {
			input.click();
		});

		// File input change
		input.addEventListener('change', function () {
			handleFiles(this.files);
		});

		// Drag and drop events
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

		// Remove button clicks (delegated)
		list.addEventListener('click', function (e) {
			if (e.target.classList.contains('ln-upload__remove')) {
				const item = e.target.closest('.ln-upload__item');
				if (item) {
					removeFile(item.getAttribute('data-file-id'));
				}
			}
		});

		// Expose API on the container element
		container.lnUploadAPI = {
			getFileIds: function () {
				return Array.from(uploadedFiles.values()).map(function (f) { return f.serverId; });
			},
			getFiles: function () {
				return Array.from(uploadedFiles.values());
			},
			clear: function () {
				// Delete all uploaded files from server
				uploadedFiles.forEach(function (fileData) {
					if (fileData.serverId) {
						fetch('/files/' + fileData.serverId, {
							method: 'DELETE',
							headers: {
								'X-CSRF-TOKEN': getCsrfToken(),
								'Accept': 'application/json'
							}
						});
					}
				});
				uploadedFiles.clear();
				list.innerHTML = '';
				updateHiddenInput();
				_dispatch(container, 'ln-upload:cleared', {});
			}
		};
	}

	/**
	 * Initialize all upload components
	 */
	function _initializeAll() {
		const containers = document.querySelectorAll('[' + DOM_SELECTOR + ']');
		containers.forEach(_initUpload);
	}

	/**
	 * Watch for dynamically added upload components
	 */
	function _domObserver() {
		const observer = new MutationObserver(function (mutations) {
			mutations.forEach(function (mutation) {
				if (mutation.type === 'childList') {
					mutation.addedNodes.forEach(function (node) {
						if (node.nodeType === 1) {
							// Check if node is an upload component
							if (node.hasAttribute(DOM_SELECTOR)) {
								_initUpload(node);
							}

							// Check if node contains upload components
							const children = node.querySelectorAll('[' + DOM_SELECTOR + ']');
							children.forEach(_initUpload);
						}
					});
				}
			});
		});

		observer.observe(document.body, {
			childList: true,
			subtree: true
		});
	}

	// Expose global API
	window[DOM_ATTRIBUTE] = {
		init: _initUpload,
		initAll: _initializeAll
	};

	// Start watching for dynamic elements
	_domObserver();

	// Initialize on DOM ready
	if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', _initializeAll);
	} else {
		_initializeAll();
	}
})();

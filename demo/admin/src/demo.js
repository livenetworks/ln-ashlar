// Auto-populate code blocks from live demo HTML
document.querySelectorAll('.demo-split').forEach(function(split) {
	const src = split.querySelector('article');
	const code = split.querySelector('figure code');
	if (src && code) code.textContent = src.innerHTML.trim();
});

(function () {
	const SIDEBAR_ID = 'demo-sidebar';

	function readBpMd() {
		const value = getComputedStyle(document.documentElement).getPropertyValue('--bp-md');
		const parsed = parseInt(value, 10);
		return isNaN(parsed) ? 768 : parsed;
	}

	function init() {
		const sidebar = document.getElementById(SIDEBAR_ID);
		if (!sidebar) return;

		const bpMd = readBpMd();
		const mq = window.matchMedia('(max-width: ' + bpMd + 'px)');

		const closeSidebar = function () {
			sidebar.setAttribute('data-ln-toggle', 'close');
		};

		const openSidebar = function () {
			sidebar.setAttribute('data-ln-toggle', 'open');
		};

		if (mq.matches) {
			closeSidebar();
		}

		mq.addEventListener('change', function (e) {
			if (e.matches) {
				closeSidebar();
			} else {
				openSidebar();
			}
		});

		document.addEventListener('click', function (e) {
			if (!mq.matches) return;
			if (!sidebar.classList.contains('open')) return;
			const target = e.target;
			if (!(target instanceof Element)) return;
			if (target.closest('#' + SIDEBAR_ID)) return;
			if (target.closest('[data-ln-toggle-for="' + SIDEBAR_ID + '"]')) return;
			closeSidebar();
		});
	}

	init();
})();

// Dynamic Demo Code Inspector (HTML & SCSS)
(function initDemoCodeInspectors() {
	function escapeHtml(string) {
		return string
			.replace(/&/g, '&amp;')
			.replace(/</g, '&lt;')
			.replace(/>/g, '&gt;')
			.replace(/"/g, '&quot;')
			.replace(/'/g, '&#039;');
	}

	function cleanCodeIndentation(html) {
		if (!html) return '';
		let lines = html.split('\n');
		
		// Strip initial empty lines
		while (lines.length > 0 && lines[0].trim() === '') {
			lines.shift();
		}
		// Strip trailing empty lines
		while (lines.length > 0 && lines[lines.length - 1].trim() === '') {
			lines.pop();
		}

		// Find minimum common indentation for non-empty lines
		let minIndent = Infinity;
		lines.forEach(line => {
			if (line.trim() === '') return;
			const match = line.match(/^(\s*)/);
			if (match) {
				minIndent = Math.min(minIndent, match[1].length);
			}
		});

		// Remove common indentation from all lines
		if (minIndent !== Infinity && minIndent > 0) {
			lines = lines.map(line => {
				return line.length >= minIndent ? line.substring(minIndent) : line.trim();
			});
		}

		return lines.join('\n');
	}

	function formatHTMLCode(node, depth = 0) {
		const indent = '\t'.repeat(depth);
		
		if (node.nodeType === Node.TEXT_NODE) {
			const text = node.textContent.trim();
			if (!text) return '';
			return text;
		}
		
		if (node.nodeType !== Node.ELEMENT_NODE) {
			return '';
		}
		
		const tagName = node.tagName.toLowerCase();
		
		let attrStr = '';
		for (let i = 0; i < node.attributes.length; i++) {
			const attr = node.attributes[i];
			attrStr += ` ${attr.name}="${attr.value}"`;
		}
		
		const voidElements = ['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'param', 'source', 'track', 'wbr'];
		if (voidElements.includes(tagName)) {
			return `${indent}<${tagName}${attrStr}>`;
		}
		
		let childHTML = '';
		let hasBlockChildren = false;
		
		const blockTags = ['div', 'ul', 'ol', 'li', 'section', 'article', 'header', 'footer', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'table', 'thead', 'tbody', 'tr', 'p', 'pre'];
		
		for (let i = 0; i < node.childNodes.length; i++) {
			const child = node.childNodes[i];
			if (child.nodeType === Node.ELEMENT_NODE && blockTags.includes(child.tagName.toLowerCase())) {
				hasBlockChildren = true;
				break;
			}
		}
		
		if (hasBlockChildren) {
			const parts = [];
			for (let i = 0; i < node.childNodes.length; i++) {
				const child = node.childNodes[i];
				const part = formatHTMLCode(child, depth + 1);
				if (part) {
					parts.push(part);
				}
			}
			childHTML = '\n' + parts.join('\n') + '\n' + indent;
			return `${indent}<${tagName}${attrStr}>${childHTML}</${tagName}>`;
		} else {
			let inlineText = '';
			for (let i = 0; i < node.childNodes.length; i++) {
				const child = node.childNodes[i];
				if (child.nodeType === Node.TEXT_NODE) {
					inlineText += child.textContent;
				} else if (child.nodeType === Node.ELEMENT_NODE) {
					const childTagName = child.tagName.toLowerCase();
					let childAttrStr = '';
					for (let j = 0; j < child.attributes.length; j++) {
						const attr = child.attributes[j];
						childAttrStr += ` ${attr.name}="${attr.value}"`;
					}
					const innerContent = Array.from(child.childNodes).map(c => c.textContent).join('');
					if (voidElements.includes(childTagName)) {
						inlineText += `<${childTagName}${childAttrStr}>`;
					} else {
						inlineText += `<${childTagName}${childAttrStr}>${innerContent}</${childTagName}>`;
					}
				}
			}
			
			if (tagName === 'pre') {
				return `${indent}<${tagName}${attrStr}>${inlineText}</${tagName}>`;
			}
			
			const trimmedText = inlineText.trim();
			return `${indent}<${tagName}${attrStr}>${trimmedText}</${tagName}>`;
		}
	}

	function getCleanFormattedHTML(mainElement) {
		const parts = [];
		for (let i = 0; i < mainElement.childNodes.length; i++) {
			const child = mainElement.childNodes[i];
			const part = formatHTMLCode(child, 0);
			if (part) {
				parts.push(part);
			}
		}
		return parts.join('\n');
	}

	document.querySelectorAll('.section-card[data-demo-html]').forEach(function (section, index) {
		const header = section.querySelector('header');
		const main = section.querySelector('main');
		if (!main) return;

		// 1. Extract HTML
		const cleanHTML = getCleanFormattedHTML(main);

		// 2. Extract SCSS if present
		const scssScript = section.querySelector('script[data-demo-scss]');
		const cleanSCSS = scssScript ? cleanCodeIndentation(scssScript.textContent) : null;

		// 3. Create Toggle Button in Header
		if (header) {
			const panelId = 'demo-code-' + index;

			const btnToggle = document.createElement('button');
			btnToggle.type = 'button';
			btnToggle.className = 'btn-demo-code';
			btnToggle.setAttribute('aria-label', 'Show HTML / SCSS Code');
			btnToggle.title = 'Show HTML / SCSS Code';
			btnToggle.setAttribute('data-ln-tooltip', 'Show HTML / SCSS Code');
			btnToggle.setAttribute('data-ln-toggle-for', panelId);
			btnToggle.setAttribute('data-ln-toggle-action', 'toggle');
			btnToggle.innerHTML = '<svg class="ln-icon" aria-hidden="true"><use href="#ln-code"></use></svg>';
			header.appendChild(btnToggle);

			// 4. Create Collapsible Wrapper and Code Panel Container
			const collapsibleWrapper = document.createElement('div');
			collapsibleWrapper.id = panelId;
			collapsibleWrapper.className = 'collapsible';
			collapsibleWrapper.setAttribute('data-ln-toggle', 'close');

			const container = document.createElement('div');
			container.className = 'demo-code-container';

			// Header of panel (tabs vs single title)
			let headerHtml = '';
			if (cleanSCSS) {
				container.id = panelId + '-tabs';
				container.setAttribute('data-ln-tabs', '');
				container.setAttribute('data-ln-tabs-default', 'html');
				headerHtml = `
					<nav>
						<ul>
							<li><a href="#${container.id}:html" data-ln-tab>HTML</a></li>
							<li><a href="#${container.id}:scss" data-ln-tab>SCSS</a></li>
						</ul>
					</nav>
				`;
			} else {
				headerHtml = `<span class="demo-code-title">HTML Source</span>`;
			}

			container.innerHTML = `
				<div class="demo-code-header">
					${headerHtml}
					<button type="button" class="btn-copy-code" aria-label="Copy code">
						<svg class="ln-icon" aria-hidden="true"><use href="#ln-copy"></use></svg>
						<span>Copy</span>
					</button>
				</div>
				<div class="demo-code-body">
					<pre data-ln-panel="html" style="white-space: pre-wrap; word-break: break-word;"><code>${escapeHtml(cleanHTML)}</code></pre>
					${cleanSCSS ? `<pre data-ln-panel="scss" class="hidden" style="white-space: pre-wrap; word-break: break-word;"><code>${escapeHtml(cleanSCSS)}</code></pre>` : ''}
				</div>
			`;

			collapsibleWrapper.appendChild(container);
			section.appendChild(collapsibleWrapper);

			// Copy to Clipboard logic
			const btnCopy = container.querySelector('.btn-copy-code');
			btnCopy.addEventListener('click', function () {
				let activePane = container.querySelector('.demo-code-body pre:not(.hidden)');
				if (!activePane) activePane = container.querySelector('.demo-code-body pre');
				if (!activePane) return;

				const textToCopy = activePane.querySelector('code').textContent;
				navigator.clipboard.writeText(textToCopy).then(function () {
					btnCopy.classList.add('copied');
					btnCopy.innerHTML = '<svg class="ln-icon" aria-hidden="true"><use href="#ln-check"></use></svg><span>Copied!</span>';
					
					setTimeout(function () {
						btnCopy.classList.remove('copied');
						btnCopy.innerHTML = '<svg class="ln-icon" aria-hidden="true"><use href="#ln-copy"></use></svg><span>Copy</span>';
					}, 2000);
				}).catch(function (err) {
					console.error('Failed to copy text: ', err);
				});
			});
		}
	});
})();


/* Live Networks — lnToast (side-accent with icons) */
(function () {
	const DOM_SELECTOR = "data-ln-toast";
	const DOM_ATTRIBUTE = "lnToast";

	// SVGs for different types
	const ICONS = {
		success: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m5 12 5 5L20 7"/></svg>`,
		error: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="m15 9-6 6"/><path d="m9 9 6 6"/></svg>`,
		warn: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m12 1.67 10.42 18.04H1.58L12 1.67z"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>`,
		info: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>`
	};

	if (window[DOM_ATTRIBUTE] !== undefined && window[DOM_ATTRIBUTE] !== null) return;

	function constructor(domRoot = document.body) {
		_findContainers(domRoot);
		return api;
	}

	function _findContainers(root) {
		if (!root || root.nodeType !== 1) return;
		let items = Array.from(root.querySelectorAll("[" + DOM_SELECTOR + "]"));
		if (root.hasAttribute && root.hasAttribute(DOM_SELECTOR)) items.push(root);
		items.forEach((el) => { if (!el[DOM_ATTRIBUTE]) new _Component(el); });
	}

	function _Component(dom) {
		this.dom = dom;
		dom[DOM_ATTRIBUTE] = this;
		this.timeoutDefault = parseInt(dom.getAttribute("data-ln-toast-timeout") || "6000", 10);
		this.max = parseInt(dom.getAttribute("data-ln-toast-max") || "5", 10);

		Array.from(dom.querySelectorAll("[data-ln-toast-item]")).forEach((li) => {
			_hydrateLI(li);
		});
		return this;
	}

	function _hydrateLI(li) {
		const type = ((li.getAttribute("data-type") || "info") + "").toLowerCase();
		const titleA = li.getAttribute("data-title");
		const msgText = (li.innerText || li.textContent || "").trim();

		li.className = "ln-toast__item";
		li.removeAttribute("data-ln-toast-item");

		const card = document.createElement("div");
		card.className = "ln-toast__card ln-toast__card--" + type;
		card.setAttribute("role", type === "error" ? "alert" : "status");
		card.setAttribute("aria-live", type === "error" ? "assertive" : "polite");

		const side = document.createElement("div");
		side.className = "ln-toast__side";
		side.innerHTML = ICONS[type] || ICONS.info;

		const content = document.createElement("div");
		content.className = "ln-toast__content";

		const head = document.createElement("div");
		head.className = "ln-toast__head";
		const tt = document.createElement("strong");
		tt.className = "ln-toast__title";
		tt.textContent = titleA || (type === "success" ? "Success" : type === "error" ? "Error" : type === "warn" ? "Warning" : "Information");

		const x = document.createElement("button");
		x.type = "button";
		x.className = "ln-toast__close";
		x.setAttribute("aria-label", "Close");
		x.innerHTML = "&times;";
		x.addEventListener("click", () => _dismiss(li));

		head.appendChild(tt);
		content.appendChild(head);
		content.appendChild(x);

		if (msgText) {
			const body = document.createElement("div");
			body.className = "ln-toast__body";
			const p = document.createElement("p");
			p.textContent = msgText;
			body.appendChild(p);
			content.appendChild(body);
		}

		card.appendChild(side);
		card.appendChild(content);
		li.innerHTML = "";
		li.appendChild(card);

		requestAnimationFrame(() => li.classList.add("ln-toast__item--in"));
	}

	function _append(cmp, li) {
		while (cmp.dom.children.length >= cmp.max) cmp.dom.removeChild(cmp.dom.firstElementChild);
		cmp.dom.appendChild(li);
		requestAnimationFrame(() => li.classList.add("ln-toast__item--in"));
	}

	function _dismiss(li) {
		if (!li || !li.parentNode) return;
		clearTimeout(li._timer);
		li.classList.remove("ln-toast__item--in");
		li.classList.add("ln-toast__item--out");
		setTimeout(() => { li.parentNode && li.parentNode.removeChild(li); }, 200);
	}

	function enqueue(opts = {}) {
		let container = opts.container;
		if (typeof container === "string") container = document.querySelector(container);
		if (!(container instanceof HTMLElement)) {
			container = document.querySelector("[" + DOM_SELECTOR + "]") || document.getElementById("ln-toast-container");
		}
		if (!container) return null;

		const cmp = container[DOM_ATTRIBUTE] || new _Component(container);
		const timeout = Number.isFinite(opts.timeout) ? opts.timeout : cmp.timeoutDefault;
		const type = (opts.type || "info").toLowerCase();

		const li = document.createElement("li");
		li.className = "ln-toast__item";

		const card = document.createElement("div");
		card.className = "ln-toast__card ln-toast__card--" + type;
		card.setAttribute("role", type === "error" ? "alert" : "status");
		card.setAttribute("aria-live", type === "error" ? "assertive" : "polite");

		const side = document.createElement("div");
		side.className = "ln-toast__side";
		side.innerHTML = ICONS[type] || ICONS.info;

		const content = document.createElement("div");
		content.className = "ln-toast__content";

		const head = document.createElement("div");
		head.className = "ln-toast__head";
		const tt = document.createElement("strong");
		tt.className = "ln-toast__title";
		tt.textContent = opts.title || (type === "success" ? "Success" : type === "error" ? "Error" : type === "warn" ? "Warning" : "Information");

		const x = document.createElement("button");
		x.type = "button";
		x.className = "ln-toast__close";
		x.setAttribute("aria-label", "Close");
		x.innerHTML = "&times;";
		x.addEventListener("click", () => _dismiss(li));

		head.appendChild(tt);
		content.appendChild(head);
		content.appendChild(x);

		if (opts.message || (opts.data && opts.data.errors)) {
			const body = document.createElement("div");
			body.className = "ln-toast__body";
			if (opts.message) {
				if (Array.isArray(opts.message)) {
					const ul = document.createElement("ul");
					opts.message.forEach(function(msg) {
						const lie = document.createElement("li");
						lie.textContent = msg;
						ul.appendChild(lie);
					});
					body.appendChild(ul);
				} else {
					const p = document.createElement("p");
					p.textContent = opts.message;
					p.style.margin = "0";
					body.appendChild(p);
				}
			}
			if (opts.data && opts.data.errors) {
				const ul = document.createElement("ul");
				Object.values(opts.data.errors).flat().forEach(err => {
					const lie = document.createElement("li");
					lie.textContent = err;
					ul.appendChild(lie);
				});
				body.appendChild(ul);
			}
			content.appendChild(body);
		}

		card.appendChild(side);
		card.appendChild(content);
		li.appendChild(card);
		_append(cmp, li);
		if (timeout > 0) li._timer = setTimeout(() => _dismiss(li), timeout);
		return li;
	}

	function clear(container) {
		let el = container;
		if (typeof el === "string") el = document.querySelector(el);
		if (!(el instanceof HTMLElement)) {
			el = document.querySelector("[" + DOM_SELECTOR + "]") || document.getElementById("ln-toast-container");
		}
		if (!el) return;
		Array.from(el.children).forEach(_dismiss);
	}

	const api = function (domRoot) { return constructor(domRoot); };
	api.enqueue = enqueue;
	api.clear = clear;

	const observer = new MutationObserver((muts) => {
		muts.forEach((m) => m.addedNodes.forEach((n) => _findContainers(n)));
	});
	observer.observe(document.body, { childList: true, subtree: true });

	window[DOM_ATTRIBUTE] = api;

	// Global event listener for decoupled components
	window.addEventListener('ln-toast:enqueue', function (e) {
		if (e.detail) {
			api.enqueue(e.detail);
		}
	});

	constructor(document.body);
})();

// ─── Form Method Resolution ────────────────────────────────

export function resolveFormMethod(form) {
	const methodInput = form.querySelector('input[name="_method"]');
	const raw = (methodInput && methodInput.value !== '') ? methodInput.value : form.method;
	return (raw || '').toUpperCase();
}

// ─── Form Serialization ───────────────────────────────────

export function serializeForm(form, opts) {
	const typed = !!(opts && opts.typed);
	const exclude = opts && opts.exclude;
	const data = {};
	const elements = form.elements;

	const checkboxCounts = {};
	if (typed) {
		for (let i = 0; i < elements.length; i++) {
			const el = elements[i];
			if (el.name && el.type === 'checkbox' && !el.disabled) {
				checkboxCounts[el.name] = (checkboxCounts[el.name] || 0) + 1;
			}
		}
	}

	for (let i = 0; i < elements.length; i++) {
		const el = elements[i];
		if (!el.name || el.disabled || el.type === 'file' || el.type === 'submit' || el.type === 'button') continue;
		if (exclude && el.matches && el.matches(exclude)) continue;

		if (el.type === 'checkbox') {
			if (typed && checkboxCounts[el.name] === 1) {
				data[el.name] = el.checked;
			} else {
				if (!data[el.name]) data[el.name] = [];
				if (el.checked) data[el.name].push(el.value);
			}
		} else if (el.type === 'radio') {
			if (el.checked) data[el.name] = el.value;
		} else if (el.type === 'select-multiple') {
			data[el.name] = [];
			for (let j = 0; j < el.options.length; j++) {
				if (el.options[j].selected) data[el.name].push(el.options[j].value);
			}
		} else if (typed && el.type === 'hidden') {
			data[el.name] = el.value;
		} else if (typed && (el.type === 'number' || el.type === 'range')) {
			const n = Number(el.value);
			data[el.name] = (el.value === '' || isNaN(n)) ? null : n;
		} else {
			data[el.name] = el.value;
		}
	}

	return data;
}

// ─── Form Population ──────────────────────────────────────

function _coerceBool(value) {
	if (typeof value !== 'string') return !!value;
	const v = value.trim().toLowerCase();
	return v !== 'false' && v !== '0' && v !== '' && v !== 'off' && v !== 'no';
}

export function populateForm(form, data) {
	const elements = form.elements;
	const filled = [];

	const checkboxCounts = {};
	for (let i = 0; i < elements.length; i++) {
		const el = elements[i];
		if (el.name && el.type === 'checkbox') {
			checkboxCounts[el.name] = (checkboxCounts[el.name] || 0) + 1;
		}
	}

	for (let i = 0; i < elements.length; i++) {
		const el = elements[i];
		if (el.type === 'file' || el.type === 'submit' || el.type === 'button') continue;

		const matchKey = el.getAttribute('data-ln-fill-as') || el.name;
		if (!matchKey || !(matchKey in data)) continue;

		const value = data[matchKey];

		if (el.type === 'checkbox') {
			if (Array.isArray(value)) {
				el.checked = value.indexOf(el.value) !== -1;
			} else if (checkboxCounts[el.name] > 1) {
				const list = String(value).split(',').map(function (s) { return s.trim(); });
				el.checked = list.indexOf(el.value) !== -1;
			} else {
				el.checked = _coerceBool(value);
			}
			filled.push(el);
		} else if (el.type === 'radio') {
			el.checked = el.value === String(value);
			filled.push(el);
		} else if (el.type === 'select-multiple') {
			if (Array.isArray(value)) {
				for (let j = 0; j < el.options.length; j++) {
					el.options[j].selected = value.indexOf(el.options[j].value) !== -1;
				}
			}
			filled.push(el);
		} else {
			el.value = value;
			if (el.tagName === 'SELECT' && value != null) {
				el.setAttribute('data-ln-value', value);
			}
			filled.push(el);
		}
	}

	return filled;
}

// ─── Value Property Interception ───────────────────────────

export function interceptValueProperty(dom, descriptor, { get, set }) {
	Object.defineProperty(dom, 'value', {
		get: function () {
			if (get) {
				return get.call(this);
			}
			return descriptor.get.call(this);
		},
		set: function (val) {
			if (set) {
				set.call(this, val, (originalVal) => descriptor.set.call(this, originalVal));
			} else {
				descriptor.set.call(this, val);
			}
		},
		configurable: true
	});
}

if (typeof window !== 'undefined') {
	window.lnCore = window.lnCore || {};
	window.lnCore.populateForm = populateForm;
	window.lnCore.serializeForm = serializeForm;
	window.lnCore.resolveFormMethod = resolveFormMethod;
}

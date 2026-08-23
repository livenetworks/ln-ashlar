// ─── Shallow Reactive ──────────────────────────────────────

export function reactiveState(initial, onChange) {
	return new Proxy(Object.assign({}, initial), {
		set(target, prop, value) {
			const old = target[prop];
			if (old === value) return true;
			target[prop] = value;
			onChange(prop, value, old);
			return true;
		}
	});
}

// ─── Deep Reactive ─────────────────────────────────────────

const PROXY_FLAG = Symbol('deepReactive');

export function deepReactive(obj, onChange) {
	function wrap(target) {
		if (target === null || typeof target !== 'object') return target;
		if (target[PROXY_FLAG]) return target;

		// Recursively wrap existing nested objects/arrays
		const keys = Object.keys(target);
		for (let i = 0; i < keys.length; i++) {
			const val = target[keys[i]];
			if (val !== null && typeof val === 'object') {
				target[keys[i]] = wrap(val);
			}
		}

		return new Proxy(target, {
			get(t, prop) {
				if (prop === PROXY_FLAG) return true;
				return t[prop];
			},
			set(t, prop, value) {
				const old = t[prop];
				if (value !== null && typeof value === 'object') {
					value = wrap(value);
				}
				t[prop] = value;
				if (old !== value) onChange();
				return true;
			},
			deleteProperty(t, prop) {
				if (prop in t) {
					delete t[prop];
					onChange();
				}
				return true;
			}
		});
	}

	return wrap(obj);
}

// ─── Render Batcher ────────────────────────────────────────

export function createBatcher(renderFn, afterRender) {
	let pending = false;

	return function schedule() {
		if (pending) return;
		pending = true;
		queueMicrotask(function () {
			pending = false;
			renderFn();
			if (afterRender) afterRender();
		});
	};
}

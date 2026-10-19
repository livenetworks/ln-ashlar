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

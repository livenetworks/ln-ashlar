// Console observation layer — the logger half of the console observation
// gate. Installed as ln-core's debug sink (see gate.js) only while
// data-ln-debug is active; ln-core calls this with zero knowledge of what
// it does. Pure — no DOM reads, no state, no data-ln-debug check of its
// own (the gate owns that decision exactly once).

export function consoleSink(kind, name, element, payload) {
	if (kind === 'event') {
		console.groupCollapsed('[ln-debug] event', name);
		console.log('target', element);
		console.log('detail', payload);
		console.groupEnd();
	} else if (kind === 'attr') {
		console.groupCollapsed('[ln-debug] attr', name);
		console.log('target', element);
		console.log('old → new', payload.oldValue, '→', payload.newValue);
		console.groupEnd();
	}
}

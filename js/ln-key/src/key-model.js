const MODIFIER_ORDER = ['Ctrl', 'Alt', 'Shift', 'Meta'];

const KEY_ALIASES = {
	alt: 'Alt',
	control: 'Ctrl',
	ctrl: 'Ctrl',
	meta: 'Meta',
	command: 'Meta',
	cmd: 'Meta',
	option: 'Alt',
	shift: 'Shift',
	esc: 'Escape',
	escape: 'Escape',
	space: 'Space',
	spacebar: 'Space',
	enter: 'Enter',
	return: 'Enter',
	tab: 'Tab',
	backspace: 'Backspace',
	delete: 'Delete',
	del: 'Delete',
	insert: 'Insert',
	home: 'Home',
	end: 'End',
	pageup: 'PageUp',
	pagedown: 'PageDown',
	arrowup: 'ArrowUp',
	up: 'ArrowUp',
	arrowdown: 'ArrowDown',
	down: 'ArrowDown',
	arrowleft: 'ArrowLeft',
	left: 'ArrowLeft',
	arrowright: 'ArrowRight',
	right: 'ArrowRight'
};

function canonicalKey(value) {
	if (value === ' ') return 'Space';

	const raw = String(value || '').trim();
	if (!raw) return '';

	const alias = KEY_ALIASES[raw.toLowerCase()];
	if (alias) return alias;
	if (raw.length === 1) return raw.toUpperCase();
	if (/^f\d{1,2}$/i.test(raw)) return raw.toUpperCase();

	return raw.charAt(0).toUpperCase() + raw.slice(1);
}

export function normalizeShortcut(value) {
	const raw = String(value || '').replace(/\s*\+\s*/g, '+').trim();
	if (!raw) return '';

	const parts = raw.split('+');
	const modifiers = new Set();
	let key = '';

	for (let i = 0; i < parts.length; i++) {
		const part = canonicalKey(parts[i]);
		if (!part) return '';

		if (MODIFIER_ORDER.indexOf(part) !== -1) {
			modifiers.add(part);
			continue;
		}

		if (key) return '';
		key = part;
	}

	if (!key) return '';

	const normalized = [];
	for (let i = 0; i < MODIFIER_ORDER.length; i++) {
		if (modifiers.has(MODIFIER_ORDER[i])) normalized.push(MODIFIER_ORDER[i]);
	}
	normalized.push(key);
	return normalized.join('+');
}

export function parseShortcutList(value) {
	const compact = String(value || '').replace(/\s*\+\s*/g, '+').trim();
	if (!compact) return [];

	const tokens = compact.split(/[\s,]+/);
	const shortcuts = [];
	for (let i = 0; i < tokens.length; i++) {
		const normalized = normalizeShortcut(tokens[i]);
		if (normalized && shortcuts.indexOf(normalized) === -1) {
			shortcuts.push(normalized);
		}
	}
	return shortcuts;
}

export function composeExternalShortcut(modifier, keyValue) {
	const key = String(keyValue || '').trim();
	if (!key || /[\s,]/.test(key)) return '';

	const modifierValue = String(modifier || '').replace(/\s*\+\s*/g, '+').trim();
	if (/[\s,]/.test(modifierValue)) return '';

	return normalizeShortcut(modifierValue ? modifierValue + '+' + key : key);
}

export function eventToShortcut(event) {
	if (!event) return '';

	const key = canonicalKey(event.key);
	if (!key || MODIFIER_ORDER.indexOf(key) !== -1) return '';

	const parts = [];
	if (event.ctrlKey) parts.push('Ctrl');
	if (event.altKey) parts.push('Alt');
	if (event.shiftKey) parts.push('Shift');
	if (event.metaKey) parts.push('Meta');
	parts.push(key);
	return parts.join('+');
}

export function shortcutMatches(shortcut, event) {
	const normalized = normalizeShortcut(shortcut);
	return normalized !== '' && normalized === eventToShortcut(event);
}

export function inferKeyAction(target) {
	if (!target || !target.tagName) return null;

	const tag = String(target.tagName).toLowerCase();
	if (tag === 'button') return 'click';
	if (tag === 'a' && target.hasAttribute && target.hasAttribute('href')) return 'click';
	if (tag === 'input' || tag === 'textarea' || tag === 'select') return 'focus';

	if (target.isContentEditable) return 'focus';
	if (target.hasAttribute && target.hasAttribute('contenteditable')) {
		const value = target.getAttribute('contenteditable');
		if (value === '' || String(value).toLowerCase() !== 'false') return 'focus';
	}

	return null;
}

export function isEditableEventTarget(target) {
	if (!target) return false;
	if (typeof target.closest === 'function') {
		return !!target.closest('input, textarea, select, [contenteditable]:not([contenteditable="false"])');
	}
	return inferKeyAction(target) === 'focus';
}

export function browserAlreadyHandles(event, target, action, key) {
	if (!event || !target || action !== 'click' || event.target !== target) return false;
	if (event.ctrlKey || event.altKey || event.shiftKey || event.metaKey) return false;

	const tag = String(target.tagName || '').toLowerCase();
	if (tag === 'button') return key === 'Enter' || key === 'Space';
	return tag === 'a' && target.hasAttribute && target.hasAttribute('href') && key === 'Enter';
}

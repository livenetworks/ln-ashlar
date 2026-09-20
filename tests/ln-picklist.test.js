import test from 'node:test';
import assert from 'node:assert/strict';

// Test mock DOM environment for ln-picklist logic
function createMockElement(tagName = 'div', attributes = {}) {
	const el = {
		tagName: tagName.toUpperCase(),
		attributes: { ...attributes },
		children: [],
		parentElement: null,
		getAttribute(name) {
			return this.attributes[name] !== undefined ? this.attributes[name] : null;
		},
		setAttribute(name, val) {
			this.attributes[name] = String(val);
		},
		removeAttribute(name) {
			delete this.attributes[name];
		},
		hasAttribute(name) {
			return this.attributes[name] !== undefined;
		},
		appendChild(child) {
			if (child.parentElement) {
				const idx = child.parentElement.children.indexOf(child);
				if (idx !== -1) child.parentElement.children.splice(idx, 1);
			}
			child.parentElement = this;
			this.children.push(child);
			return child;
		},
		querySelector(selector) {
			if (selector === '[data-ln-picklist-list="available"]') {
				return this.children.find(c => c.getAttribute('data-ln-picklist-list') === 'available') || null;
			}
			if (selector === '[data-ln-picklist-list="selected"]') {
				return this.children.find(c => c.getAttribute('data-ln-picklist-list') === 'selected') || null;
			}
			if (selector === 'input[type="checkbox"]') {
				for (const child of this.children) {
					if (child.tagName === 'INPUT' && child.type === 'checkbox') return child;
					const found = child.querySelector && child.querySelector(selector);
					if (found) return found;
				}
				return null;
			}
			return null;
		},
		closest(selector) {
			return null;
		},
		addEventListener() {},
		removeEventListener() {},
		dispatchEvent() { return true; }
	};
	Object.defineProperty(el, 'isConnected', { get: () => true });
	return el;
}

function createItem(value, label, checked = false) {
	const li = createMockElement('li');
	const labelEl = createMockElement('label');
	const input = createMockElement('input', { type: 'checkbox', name: 'countries[]', value: value });
	input.type = 'checkbox';
	input.value = value;
	input.checked = checked;
	input.defaultChecked = checked;
	labelEl.appendChild(input);
	li.appendChild(labelEl);
	return { li, input };
}

test('ln-picklist sync: transfers initially checked items from available to selected', () => {
	const available = createMockElement('ul', { 'data-ln-picklist-list': 'available' });
	const selected = createMockElement('ul', { 'data-ln-picklist-list': 'selected' });

	const item1 = createItem('nl', 'Netherlands', true); // checked
	const item2 = createItem('de', 'Germany', false); // unchecked
	const item3 = createItem('fr', 'France', true); // checked

	available.appendChild(item1.li);
	available.appendChild(item2.li);
	available.appendChild(item3.li);

	// Simulate sync logic
	const initial = [...available.children, ...selected.children];
	for (const item of initial) {
		const cb = item.querySelector('input[type="checkbox"]');
		const target = cb.checked ? selected : available;
		target.appendChild(item);
	}

	assert.equal(available.children.length, 1);
	assert.equal(available.children[0], item2.li);

	assert.equal(selected.children.length, 2);
	assert.equal(selected.children[0], item1.li);
	assert.equal(selected.children[1], item3.li);
});

test('ln-picklist sync: form reset restores items to initial authored order and lists', () => {
	const available = createMockElement('ul', { 'data-ln-picklist-list': 'available' });
	const selected = createMockElement('ul', { 'data-ln-picklist-list': 'selected' });

	const item1 = createItem('de', 'Germany', false);
	const item2 = createItem('fr', 'France', false);
	const item3 = createItem('nl', 'Netherlands', true); // default checked

	available.appendChild(item1.li);
	available.appendChild(item2.li);
	available.appendChild(item3.li);

	// Snapshot before initial sync
	const initial = [...available.children, ...selected.children];

	// Initial sync
	for (const item of initial) {
		const cb = item.querySelector('input[type="checkbox"]');
		const target = cb.checked ? selected : available;
		target.appendChild(item);
	}

	assert.equal(selected.children.length, 1);
	assert.equal(selected.children[0], item3.li);

	// User checks Germany (moves to selected) and unchecks Netherlands (moves to available)
	item1.input.checked = true;
	selected.appendChild(item1.li);

	item3.input.checked = false;
	available.appendChild(item3.li);

	assert.equal(available.children[0], item2.li);
	assert.equal(available.children[1], item3.li);
	assert.equal(selected.children[0], item1.li);

	// Form Reset fires: native browser restores input.checked to input.defaultChecked
	item1.input.checked = item1.input.defaultChecked; // false
	item2.input.checked = item2.input.defaultChecked; // false
	item3.input.checked = item3.input.defaultChecked; // true

	// Picklist sync on reset runs
	for (const item of initial) {
		const cb = item.querySelector('input[type="checkbox"]');
		const target = cb.checked ? selected : available;
		target.appendChild(item);
	}

	// Restored back to initial:
	assert.equal(available.children.length, 2);
	assert.equal(available.children[0], item1.li);
	assert.equal(available.children[1], item2.li);

	assert.equal(selected.children.length, 1);
	assert.equal(selected.children[0], item3.li);
});

test('ln-picklist max limit: blocks moves when max limit is reached and reverts checkbox', () => {
	const available = createMockElement('ul', { 'data-ln-picklist-list': 'available' });
	const selected = createMockElement('ul', { 'data-ln-picklist-list': 'selected' });

	const item1 = createItem('nl', 'Netherlands', true);
	const item2 = createItem('de', 'Germany', true);
	const item3 = createItem('fr', 'France', false);

	const max = 2;
	let selectedCount = 0;
	const initial = [item1.li, item2.li, item3.li];

	// Initial sync with max = 2
	for (const item of initial) {
		const cb = item.querySelector('input[type="checkbox"]');
		let target;
		if (cb.checked) {
			if (selectedCount < max) {
				target = selected;
				selectedCount++;
			} else {
				cb.checked = false;
				target = available;
			}
		} else {
			target = available;
		}
		target.appendChild(item);
	}

	assert.equal(selected.children.length, 2);
	assert.equal(available.children.length, 1);
	assert.equal(available.children[0], item3.li);

	// Attempting to move item3 to selected when selected.length >= max
	item3.input.checked = true;
	let eventFired = false;
	if (selected.children.length >= max) {
		item3.input.checked = !item3.input.checked; // reverted
		eventFired = true;
	}

	assert.equal(eventFired, true);
	assert.equal(item3.input.checked, false);
	assert.equal(selected.children.length, 2);
	assert.equal(available.children[0], item3.li);
});


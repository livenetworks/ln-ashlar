/**
 * Calculates virtual scrolling slicing indices and padding heights.
 * @param {number} scrollTop
 * @param {number} viewportHeight
 * @param {number} rowHeight
 * @param {number} totalCount
 * @param {number} [bufferRows=15]
 * @returns {{ start: number, end: number, topPadding: number, bottomPadding: number }}
 */
export function calculateVirtualWindow(scrollTop, viewportHeight, rowHeight, totalCount, bufferRows = 15) {
	if (totalCount <= 0 || rowHeight <= 0) {
		return { start: 0, end: 0, topPadding: 0, bottomPadding: 0 };
	}

	const safeScrollTop = Math.max(0, scrollTop || 0);
	const safeViewportHeight = Math.max(0, viewportHeight || 0);

	const visibleStartIndex = Math.floor(safeScrollTop / rowHeight);
	const visibleCount = Math.ceil(safeViewportHeight / rowHeight);

	const start = Math.max(0, visibleStartIndex - bufferRows);
	const end = Math.min(totalCount, visibleStartIndex + visibleCount + bufferRows);

	const topPadding = start * rowHeight;
	const bottomPadding = Math.max(0, (totalCount - end) * rowHeight);

	return { start, end, topPadding, bottomPadding };
}

/**
 * Computes selection state metadata across a dataset.
 * @param {string[]|number[]} allIds
 * @param {Set<string|number>|Array<string|number>} selectedIds
 * @returns {{ totalCount: number, selectedCount: number, isAllSelected: boolean, isIndeterminate: boolean }}
 */
export function calculateSelectionState(allIds, selectedIds) {
	const totalCount = Array.isArray(allIds) ? allIds.length : 0;
	const selectedSet = selectedIds instanceof Set ? selectedIds : new Set(selectedIds || []);
	let selectedCount = 0;

	if (Array.isArray(allIds)) {
		for (let i = 0; i < allIds.length; i++) {
			if (selectedSet.has(allIds[i])) {
				selectedCount++;
			}
		}
	} else {
		selectedCount = selectedSet.size;
	}

	const isAllSelected = totalCount > 0 && selectedCount === totalCount;
	const isIndeterminate = selectedCount > 0 && selectedCount < totalCount;

	return { totalCount, selectedCount, isAllSelected, isIndeterminate };
}

/**
 * Toggles a row ID within a Set of selected IDs.
 * @param {Set<string|number>} selectedSet
 * @param {string|number} rowId
 * @param {boolean} [forceState]
 * @returns {Set<string|number>}
 */
export function toggleRowSelection(selectedSet, rowId, forceState) {
	const next = new Set(selectedSet);
	if (rowId == null) return next;

	const shouldSelect = forceState !== undefined ? forceState : !next.has(rowId);
	if (shouldSelect) {
		next.add(rowId);
	} else {
		next.delete(rowId);
	}
	return next;
}

/**
 * Selects or deselects all IDs.
 * @param {Set<string|number>} selectedSet
 * @param {Array<string|number>} allIds
 * @param {boolean} selectAll
 * @returns {Set<string|number>}
 */
export function toggleSelectAll(selectedSet, allIds, selectAll) {
	const next = new Set(selectedSet);
	if (!Array.isArray(allIds)) return next;

	if (selectAll) {
		for (let i = 0; i < allIds.length; i++) {
			if (allIds[i] != null) next.add(allIds[i]);
		}
	} else {
		for (let i = 0; i < allIds.length; i++) {
			next.delete(allIds[i]);
		}
	}
	return next;
}

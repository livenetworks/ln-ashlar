export class MutationReceipts {
	constructor() {
		this._pending = new Map();
	}

	wait(requestId) {
		if (!requestId) return Promise.reject(new Error('Mutation requestId is required'));
		if (this._pending.has(requestId)) {
			return Promise.reject(new Error(`Duplicate mutation requestId: ${requestId}`));
		}

		return new Promise((resolve, reject) => {
			this._pending.set(requestId, { resolve, reject });
		});
	}

	resolve(detail) {
		return this._settle(detail, false);
	}

	reject(detail) {
		return this._settle(detail, true);
	}

	close(error) {
		const reason = error || new Error('Mutation receipt registry closed');
		for (const receipt of this._pending.values()) receipt.reject(reason);
		this._pending.clear();
	}

	_settle(detail, failed) {
		const requestId = detail && detail.requestId;
		if (!requestId) return false;

		const receipt = this._pending.get(requestId);
		if (!receipt) return false;

		this._pending.delete(requestId);
		if (failed) {
			receipt.reject(detail.error || new Error('Store mutation failed'));
		} else {
			receipt.resolve(detail);
		}
		return true;
	}
}

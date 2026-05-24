// Web Crypto API Reusable Cryptographic Helpers
let _cryptoKey = null;

export async function setCryptoKey(secretString) {
	if (!secretString) {
		_cryptoKey = null;
		return;
	}
	try {
		const enc = new TextEncoder();
		const hash = await crypto.subtle.digest('SHA-256', enc.encode(secretString));
		_cryptoKey = await crypto.subtle.importKey(
			'raw',
			hash,
			{ name: 'AES-GCM' },
			false,
			['encrypt', 'decrypt']
		);
	} catch (err) {
		console.error('[ln-core/crypto] Key derivation failed:', err);
		_cryptoKey = null;
	}
}

export function getCryptoKey() {
	return _cryptoKey;
}

export async function encryptData(plainData, key = _cryptoKey) {
	const activeKey = key || _cryptoKey;
	if (!activeKey || plainData === undefined || plainData === null) return plainData;

	try {
		const enc = new TextEncoder();
		const iv = crypto.getRandomValues(new Uint8Array(12));

		const serialized = typeof plainData === 'string' ? plainData : JSON.stringify(plainData);
		const encryptedBuffer = await crypto.subtle.encrypt(
			{ name: 'AES-GCM', iv: iv },
			activeKey,
			enc.encode(serialized)
		);

		const ivBase64 = btoa(String.fromCharCode(...iv));
		const dataBase64 = btoa(String.fromCharCode(...new Uint8Array(encryptedBuffer)));

		return {
			encrypted: true,
			iv: ivBase64,
			data: dataBase64
		};
	} catch (err) {
		console.error('[ln-core/crypto] Encryption failed:', err);
		return plainData;
	}
}

export async function decryptData(encryptedObject, key = _cryptoKey) {
	const activeKey = key || _cryptoKey;
	if (!encryptedObject || !encryptedObject.encrypted || !activeKey) return encryptedObject;

	try {
		const dec = new TextDecoder();
		const iv = Uint8Array.from(atob(encryptedObject.iv), c => c.charCodeAt(0));
		const encryptedBuffer = Uint8Array.from(atob(encryptedObject.data), c => c.charCodeAt(0));

		const decryptedBuffer = await crypto.subtle.decrypt(
			{ name: 'AES-GCM', iv: iv },
			activeKey,
			encryptedBuffer
		);

		const decoded = dec.decode(decryptedBuffer);
		try {
			return JSON.parse(decoded);
		} catch (_) {
			return decoded;
		}
	} catch (err) {
		console.error('[ln-core/crypto] Decryption failed. Key may be incorrect:', err);
		return { ...encryptedObject, decryptionError: true };
	}
}

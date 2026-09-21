// Web Crypto API Reusable Cryptographic Helpers
let _cryptoKey = null;

const DEFAULT_SALT = 'ln-ashlar:storage-salt:v1';
const CHUNK_SIZE = 0x8000; // 32KB chunks for stack-safe Base64 conversion

/**
 * Encodes a Uint8Array to a Base64 string in chunks to prevent call-stack overflow on large payloads.
 * @param {Uint8Array} bytes
 * @returns {string}
 */
export function uint8ToBase64(bytes) {
	let binary = '';
	const len = bytes.byteLength;
	for (let i = 0; i < len; i += CHUNK_SIZE) {
		binary += String.fromCharCode.apply(
			null,
			bytes.subarray(i, Math.min(i + CHUNK_SIZE, len))
		);
	}
	return btoa(binary);
}

/**
 * Decodes a Base64 string to a Uint8Array.
 * @param {string} base64
 * @returns {Uint8Array}
 */
export function base64ToUint8(base64) {
	const binary = atob(base64);
	const len = binary.length;
	const bytes = new Uint8Array(len);
	for (let i = 0; i < len; i++) {
		bytes[i] = binary.charCodeAt(i);
	}
	return bytes;
}

/**
 * Resolves key and options from overloaded arguments.
 * Ensures an options object like { silent: true } is never passed to WebCrypto as a CryptoKey.
 * @private
 */
function _resolveKeyAndOptions(keyOrOptions, maybeOptions) {
	let key = _cryptoKey;
	let options = {};

	if (typeof CryptoKey !== 'undefined' && keyOrOptions instanceof CryptoKey) {
		key = keyOrOptions;
		if (maybeOptions && typeof maybeOptions === 'object') {
			options = maybeOptions;
		}
	} else if (keyOrOptions && typeof keyOrOptions === 'object') {
		options = keyOrOptions;
		if (typeof CryptoKey !== 'undefined' && options.key instanceof CryptoKey) {
			key = options.key;
		}
	}

	return { key, options };
}

/**
 * Derives a 256-bit AES-GCM CryptoKey using PBKDF2 or SHA-256.
 * @param {string} secretString
 * @param {Object} [options]
 * @param {'pbkdf2'|'sha256'} [options.method='pbkdf2']
 * @param {string|Uint8Array} [options.salt]
 * @param {number} [options.iterations=100000]
 * @returns {Promise<CryptoKey>}
 */
export async function deriveCryptoKey(secretString, options = {}) {
	if (!secretString) {
		throw new Error('[ln-crypto] Key derivation failed: Secret string is required');
	}

	const method = options.method || 'pbkdf2';
	const enc = new TextEncoder();

	if (method === 'sha256') {
		const hash = await crypto.subtle.digest('SHA-256', enc.encode(secretString));
		return crypto.subtle.importKey(
			'raw',
			hash,
			{ name: 'AES-GCM' },
			false,
			['encrypt', 'decrypt']
		);
	}

	// PBKDF2 mode
	const saltStr = options.salt || DEFAULT_SALT;
	const salt = typeof saltStr === 'string' ? enc.encode(saltStr) : saltStr;
	const iterations = options.iterations || 100000;

	const baseKey = await crypto.subtle.importKey(
		'raw',
		enc.encode(secretString),
		'PBKDF2',
		false,
		['deriveKey']
	);

	return crypto.subtle.deriveKey(
		{
			name: 'PBKDF2',
			salt,
			iterations,
			hash: 'SHA-256'
		},
		baseKey,
		{ name: 'AES-GCM', length: 256 },
		false,
		['encrypt', 'decrypt']
	);
}

/**
 * Sets the active cryptographic key in module memory.
 * Default method is 'sha256' for backward-compatibility with existing at-rest storage caches.
 * Pass { method: 'pbkdf2' } to use PBKDF2.
 * Passing empty/falsy clears the key.
 * @param {string|null} secretString
 * @param {Object} [options]
 * @returns {Promise<void>}
 */
export async function setCryptoKey(secretString, options = {}) {
	if (!secretString) {
		_cryptoKey = null;
		return;
	}

	try {
		// Default to sha256 when called as setCryptoKey('secret') for backward compatibility
		const method = options.method || 'sha256';
		_cryptoKey = await deriveCryptoKey(secretString, { ...options, method });
	} catch (err) {
		console.error('[ln-core/crypto] Key derivation failed:', err);
		_cryptoKey = null;
		throw err;
	}
}

/**
 * Returns the currently active CryptoKey in module memory.
 * @returns {CryptoKey|null}
 */
export function getCryptoKey() {
	return _cryptoKey;
}

/**
 * Clears the active cryptographic key in module memory.
 */
export function clearCryptoKey() {
	_cryptoKey = null;
}

/**
 * Checks if an active cryptographic key is set.
 * @returns {boolean}
 */
export function hasCryptoKey() {
	return _cryptoKey !== null;
}

/**
 * Encrypts arbitrary data using AES-GCM (256-bit).
 * Fail-closed: Throws an Error if no active key is provided or if encryption fails.
 * @param {any} plainData
 * @param {CryptoKey|Object} [keyOrOptions]
 * @param {Object} [maybeOptions]
 * @returns {Promise<Object>} Version 1 envelope: { v: 1, alg: 'AES-GCM', encrypted: true, iv, data }
 */
export async function encryptData(plainData, keyOrOptions, maybeOptions) {
	const { key } = _resolveKeyAndOptions(keyOrOptions, maybeOptions);

	if (plainData === undefined || plainData === null) {
		return plainData;
	}

	if (!key) {
		throw new Error('[ln-crypto] Encryption failed: No active cryptographic key provided');
	}

	try {
		const enc = new TextEncoder();
		const iv = crypto.getRandomValues(new Uint8Array(12));

		const serialized = typeof plainData === 'string' ? plainData : JSON.stringify(plainData);
		const encryptedBuffer = await crypto.subtle.encrypt(
			{ name: 'AES-GCM', iv },
			key,
			enc.encode(serialized)
		);

		return {
			v: 1,
			alg: 'AES-GCM',
			encrypted: true,
			iv: uint8ToBase64(iv),
			data: uint8ToBase64(new Uint8Array(encryptedBuffer))
		};
	} catch (err) {
		console.error('[ln-core/crypto] Encryption failed:', err);
		throw new Error('[ln-crypto] Encryption failed: ' + (err && err.message ? err.message : String(err)));
	}
}

/**
 * Decrypts an encrypted envelope using AES-GCM (256-bit).
 * Fail-closed: Throws an Error if key is missing or decryption fails, unless { silent: true } is passed.
 * Backwards compatible: Decrypts both v1 envelopes and legacy unversioned { encrypted: true, iv, data } payloads.
 * @param {Object} encryptedObject
 * @param {CryptoKey|Object} [keyOrOptions]
 * @param {Object} [maybeOptions]
 * @returns {Promise<any>}
 */
export async function decryptData(encryptedObject, keyOrOptions, maybeOptions) {
	const { key, options } = _resolveKeyAndOptions(keyOrOptions, maybeOptions);
	const silent = options.silent === true;

	if (!encryptedObject || !encryptedObject.encrypted) {
		return encryptedObject;
	}

	if (!key) {
		if (silent) {
			return { ...encryptedObject, decryptionError: true };
		}
		throw new Error('[ln-crypto] Decryption failed: No active cryptographic key provided');
	}

	if (!encryptedObject.iv || !encryptedObject.data) {
		if (silent) {
			return { ...encryptedObject, decryptionError: true };
		}
		throw new Error('[ln-crypto] Decryption failed: Malformed envelope (missing iv or data)');
	}

	try {
		const dec = new TextDecoder();
		const iv = base64ToUint8(encryptedObject.iv);
		const encryptedBuffer = base64ToUint8(encryptedObject.data);

		const decryptedBuffer = await crypto.subtle.decrypt(
			{ name: 'AES-GCM', iv },
			key,
			encryptedBuffer
		);

		const decoded = dec.decode(decryptedBuffer);
		try {
			return JSON.parse(decoded);
		} catch (_) {
			return decoded;
		}
	} catch (err) {
		if (silent) {
			return { ...encryptedObject, decryptionError: true };
		}
		console.error('[ln-core/crypto] Decryption failed. Key may be incorrect or payload tampered:', err);
		throw new Error('[ln-crypto] Decryption failed. Key may be incorrect or payload tampered: ' + (err && err.message ? err.message : String(err)));
	}
}

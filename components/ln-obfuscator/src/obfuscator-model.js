/**
 * components/ln-obfuscator/src/obfuscator-model.js
 *
 * Pure cipher and encoding algorithms for ln-obfuscator.
 * Supports:
 *  - 'rot' (default): Caesar / ROT-N on [a-zA-Z] (mod 26) and [0-9] (mod 10).
 *  - 'base64': UTF-8 safe Base64 encoding for arbitrary unicode / scripts (Cyrillic, CJK, etc.).
 *  - 'xor': Symmetric multi-byte XOR cipher with Base64 ASCII transport for arbitrary unicode.
 *
 * Zero DOM dependencies.
 */

/**
 * Shifts an ASCII alphabetic character (mod 26) or digit (mod 10) by the given offset (preserving case).
 * Non-alphanumeric characters (symbols, spaces, unicode) are returned untouched.
 *
 * @param {string} char - Single character
 * @param {number} shift - Integer shift offset
 * @returns {string} Shifted character
 */
export function rotChar(char, shift) {
	if (char.length !== 1) return char;
	const code = char.charCodeAt(0);

	// Uppercase A-Z (65-90)
	if (code >= 65 && code <= 90) {
		const offset = ((code - 65 + shift) % 26 + 26) % 26;
		return String.fromCharCode(65 + offset);
	}

	// Lowercase a-z (97-122)
	if (code >= 97 && code <= 122) {
		const offset = ((code - 97 + shift) % 26 + 26) % 26;
		return String.fromCharCode(97 + offset);
	}

	// Digits 0-9 (48-57)
	if (code >= 48 && code <= 57) {
		const offset = ((code - 48 + shift) % 10 + 10) % 10;
		return String.fromCharCode(48 + offset);
	}

	return char;
}

/**
 * Encodes any UTF-8 string into Base64 (browser & Node compatible, Unicode-safe).
 *
 * @param {string} str - Input text
 * @returns {string} Base64 encoded string
 */
export function utf8ToBase64(str) {
	if (str == null || str === '') return '';
	const input = String(str);
	if (typeof TextEncoder !== 'undefined' && typeof btoa !== 'undefined') {
		const bytes = new TextEncoder().encode(input);
		let binary = '';
		const len = bytes.length;
		for (let i = 0; i < len; i++) {
			binary += String.fromCharCode(bytes[i]);
		}
		return btoa(binary);
	}
	if (typeof Buffer !== 'undefined') {
		return Buffer.from(input, 'utf-8').toString('base64');
	}
	return '';
}

/**
 * Decodes a Base64 string back into a UTF-8 string (browser & Node compatible, Unicode-safe).
 *
 * @param {string} b64 - Base64 string
 * @returns {string} Decoded UTF-8 string
 */
export function base64ToUtf8(b64) {
	if (b64 == null || b64 === '') return '';
	try {
		const trimmed = String(b64).trim();
		if (typeof atob !== 'undefined' && typeof TextDecoder !== 'undefined') {
			const binary = atob(trimmed);
			const bytes = new Uint8Array(binary.length);
			for (let i = 0; i < binary.length; i++) {
				bytes[i] = binary.charCodeAt(i);
			}
			return new TextDecoder().decode(bytes);
		}
		if (typeof Buffer !== 'undefined') {
			return Buffer.from(trimmed, 'base64').toString('utf-8');
		}
	} catch {
		return b64;
	}
	return b64;
}

/**
 * Performs byte-level XOR with a repeating key.
 *
 * @param {Uint8Array} bytes - Input bytes
 * @param {string} keyStr - Key string
 * @returns {Uint8Array} XOR transformed bytes
 */
export function xorBytes(bytes, keyStr) {
	const key = String(keyStr || 'ln-ashlar');
	let keyBytes;
	if (typeof TextEncoder !== 'undefined') {
		keyBytes = new TextEncoder().encode(key);
	} else if (typeof Buffer !== 'undefined') {
		keyBytes = Buffer.from(key, 'utf-8');
	} else {
		keyBytes = [108, 110];
	}
	const keyLen = keyBytes.length || 1;
	const out = new Uint8Array(bytes.length);
	for (let i = 0; i < bytes.length; i++) {
		out[i] = bytes[i] ^ keyBytes[i % keyLen];
	}
	return out;
}

/**
 * Obfuscates UTF-8 text with an XOR cipher and returns Base64 ASCII text.
 *
 * @param {string} text - Input text (any script / unicode)
 * @param {string} [key='ln-ashlar'] - Secret key
 * @returns {string} Base64 encoded XOR payload
 */
export function xorObfuscate(text, key = 'ln-ashlar') {
	if (text == null || text === '') return '';
	const input = String(text);
	let bytes;
	if (typeof TextEncoder !== 'undefined') {
		bytes = new TextEncoder().encode(input);
	} else if (typeof Buffer !== 'undefined') {
		bytes = Buffer.from(input, 'utf-8');
	} else {
		return '';
	}
	const xored = xorBytes(bytes, key);
	let binary = '';
	for (let i = 0; i < xored.length; i++) {
		binary += String.fromCharCode(xored[i]);
	}
	if (typeof btoa !== 'undefined') {
		return btoa(binary);
	}
	if (typeof Buffer !== 'undefined') {
		return Buffer.from(xored).toString('base64');
	}
	return '';
}

/**
 * Deobfuscates Base64 ASCII XOR payload back into UTF-8 text.
 *
 * @param {string} b64 - Base64 encoded XOR payload
 * @param {string} [key='ln-ashlar'] - Secret key used during obfuscation
 * @returns {string} Plain UTF-8 text
 */
export function xorDeobfuscate(b64, key = 'ln-ashlar') {
	if (b64 == null || b64 === '') return '';
	try {
		const trimmed = String(b64).trim();
		let binary = '';
		if (typeof atob !== 'undefined') {
			binary = atob(trimmed);
		} else if (typeof Buffer !== 'undefined') {
			binary = Buffer.from(trimmed, 'base64').toString('binary');
		} else {
			return b64;
		}
		const bytes = new Uint8Array(binary.length);
		for (let i = 0; i < binary.length; i++) {
			bytes[i] = binary.charCodeAt(i);
		}
		const xored = xorBytes(bytes, key);
		if (typeof TextDecoder !== 'undefined') {
			return new TextDecoder().decode(xored);
		}
		if (typeof Buffer !== 'undefined') {
			return Buffer.from(xored).toString('utf-8');
		}
	} catch {
		return b64;
	}
	return b64;
}

/**
 * Parses options argument for obfuscate / deobfuscate.
 * @private
 */
function _parseOptions(options) {
	if (typeof options === 'number' || (typeof options === 'string' && /^-?\d+$/.test(String(options).trim()))) {
		return { codec: 'rot', shift: Number(options) || 13, key: 'ln-ashlar' };
	}
	if (options && typeof options === 'object') {
		const rawCodec = (options.codec || (options.key ? 'xor' : 'rot')).toLowerCase().trim();
		const codec = (rawCodec === 'xor' || rawCodec === 'base64') ? rawCodec : 'rot';
		const shift = Number(options.shift) || 13;
		const key = options.key || 'ln-ashlar';
		return { codec, shift, key };
	}
	return { codec: 'rot', shift: 13, key: 'ln-ashlar' };
}

/**
 * Obfuscates a string with the configured codec ('rot', 'base64', or 'xor').
 *
 * @param {string} text - Input text
 * @param {number|object} [options=13] - Shift offset (number) or options object `{ codec, shift, key }`
 * @returns {string} Obfuscated string
 */
export function obfuscate(text, options = 13) {
	if (text == null) return '';
	if (typeof text !== 'string') text = String(text);
	if (text.length === 0) return '';

	const opts = _parseOptions(options);
	if (opts.codec === 'base64') {
		return utf8ToBase64(text);
	}
	if (opts.codec === 'xor') {
		return xorObfuscate(text, opts.key);
	}
	return text.replace(/[a-zA-Z0-9]/g, (c) => rotChar(c, opts.shift));
}

/**
 * Deobfuscates a string by reversing the configured codec ('rot', 'base64', or 'xor').
 *
 * @param {string} text - Obfuscated text
 * @param {number|object} [options=13] - Original shift offset (number) or options object `{ codec, shift, key }`
 * @returns {string} Plain text
 */
export function deobfuscate(text, options = 13) {
	if (text == null) return '';
	if (typeof text !== 'string') text = String(text);
	if (text.length === 0) return '';

	const opts = _parseOptions(options);
	if (opts.codec === 'base64') {
		return base64ToUtf8(text);
	}
	if (opts.codec === 'xor') {
		return xorDeobfuscate(text, opts.key);
	}
	return text.replace(/[a-zA-Z0-9]/g, (c) => rotChar(c, -opts.shift));
}

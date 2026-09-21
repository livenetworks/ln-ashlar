import test from 'node:test';
import assert from 'node:assert/strict';

import {
	setCryptoKey,
	getCryptoKey,
	clearCryptoKey,
	hasCryptoKey,
	deriveCryptoKey,
	encryptData,
	decryptData,
	uint8ToBase64,
	base64ToUint8
} from '../components/ln-core/index.js';

test('uint8ToBase64 and base64ToUint8 provide symmetric, stack-safe conversion', () => {
	const original = new Uint8Array([0, 1, 2, 253, 254, 255]);
	const b64 = uint8ToBase64(original);
	const recovered = base64ToUint8(b64);
	assert.deepEqual(recovered, original);

	// Large buffer (100KB) to ensure chunking avoids call stack overflow
	const large = new Uint8Array(102400);
	for (let i = 0; i < large.length; i++) {
		large[i] = i % 256;
	}
	const largeB64 = uint8ToBase64(large);
	const largeRecovered = base64ToUint8(largeB64);
	assert.equal(largeRecovered.length, large.length);
	assert.deepEqual(largeRecovered, large);
});

test('setCryptoKey, getCryptoKey, clearCryptoKey, and hasCryptoKey manage key state', async () => {
	clearCryptoKey();
	assert.equal(hasCryptoKey(), false);
	assert.equal(getCryptoKey(), null);

	await setCryptoKey('master-secret-123');
	assert.equal(hasCryptoKey(), true);
	const key = getCryptoKey();
	assert.ok(key);
	assert.equal(key.algorithm.name, 'AES-GCM');

	clearCryptoKey();
	assert.equal(hasCryptoKey(), false);
	assert.equal(getCryptoKey(), null);

	// Falsy value clears key
	await setCryptoKey('temporary-secret');
	assert.equal(hasCryptoKey(), true);
	await setCryptoKey('');
	assert.equal(hasCryptoKey(), false);
	assert.equal(getCryptoKey(), null);
});

test('deriveCryptoKey supports both SHA-256 and PBKDF2 derivations', async () => {
	// SHA-256
	const shaKey = await deriveCryptoKey('my-passphrase', { method: 'sha256' });
	assert.ok(shaKey);
	assert.equal(shaKey.algorithm.name, 'AES-GCM');

	// PBKDF2 default deterministic salt
	const pbkdfKey1 = await deriveCryptoKey('my-passphrase', { method: 'pbkdf2', iterations: 1000 });
	const pbkdfKey2 = await deriveCryptoKey('my-passphrase', { method: 'pbkdf2', iterations: 1000 });
	assert.ok(pbkdfKey1);
	assert.ok(pbkdfKey2);

	// Data encrypted under pbkdfKey1 can be decrypted by pbkdfKey2 (same deterministic salt)
	const encrypted = await encryptData({ test: 'cross-session' }, pbkdfKey1);
	const decrypted = await decryptData(encrypted, pbkdfKey2);
	assert.deepEqual(decrypted, { test: 'cross-session' });

	// Different salt yields incompatible key
	const customSaltKey = await deriveCryptoKey('my-passphrase', {
		method: 'pbkdf2',
		salt: 'different-salt',
		iterations: 1000
	});
	await assert.rejects(
		async () => {
			await decryptData(encrypted, customSaltKey);
		},
		/Decryption failed/
	);

	// Empty secret throws
	await assert.rejects(
		async () => {
			await deriveCryptoKey('');
		},
		/Secret string is required/
	);
});

test('encryptData and decryptData perform round-trip encryption for objects, strings, and UTF-8 Cyrillic', async () => {
	await setCryptoKey('super-secret-password');

	// Object
	const payload = { id: 42, name: 'JJ Logistics', active: true, tags: ['fleet', 'heavy'] };
	const encrypted = await encryptData(payload);

	assert.equal(encrypted.encrypted, true);
	assert.equal(encrypted.v, 1);
	assert.equal(encrypted.alg, 'AES-GCM');
	assert.ok(typeof encrypted.iv === 'string' && encrypted.iv.length > 0);
	assert.ok(typeof encrypted.data === 'string' && encrypted.data.length > 0);

	const decrypted = await decryptData(encrypted);
	assert.deepEqual(decrypted, payload);

	// Multi-byte Unicode, Cyrillic and emojis
	const cyrillicText = 'Таен извештај: JJ Логистика работи со 100% капацитет 🚛🇲🇰🔒!';
	const encCyrillic = await encryptData(cyrillicText);
	const decCyrillic = await decryptData(encCyrillic);
	assert.equal(decCyrillic, cyrillicText);

	// Primitives
	assert.equal(await encryptData(null), null);
	assert.equal(await encryptData(undefined), undefined);
});

test('fail-closed: encryptData and decryptData throw when key is missing', async () => {
	clearCryptoKey();

	await assert.rejects(
		async () => {
			await encryptData('sensitive information');
		},
		/No active cryptographic key provided/
	);

	const fakeEnvelope = {
		v: 1,
		encrypted: true,
		iv: 'AAAAAAAAAAAAAAAA',
		data: 'AAAAAAAAAAAAAAAA'
	};

	await assert.rejects(
		async () => {
			await decryptData(fakeEnvelope);
		},
		/No active cryptographic key provided/
	);
});

test('fail-closed: decryptData throws on tampered ciphertext or corrupt MAC tag', async () => {
	await setCryptoKey('integrity-check-secret');
	const encrypted = await encryptData({ balance: 1000000 });

	// Tamper data payload
	const tamperedData = {
		...encrypted,
		data: encrypted.data.slice(0, -4) + 'AAAA'
	};

	await assert.rejects(
		async () => {
			await decryptData(tamperedData);
		},
		/Decryption failed/
	);

	// Tamper IV
	const tamperedIv = {
		...encrypted,
		iv: 'BBBBBBBBBBBBBBBB'
	};

	await assert.rejects(
		async () => {
			await decryptData(tamperedIv);
		},
		/Decryption failed/
	);
});

test('silent mode: decryptData returns decryptionError flag without throwing', async () => {
	await setCryptoKey('silent-mode-secret');
	const encrypted = await encryptData({ secret: 'value' });

	// Tamper data
	const tampered = {
		...encrypted,
		data: encrypted.data.slice(0, -4) + 'ZZZZ'
	};

	// With silent: true, returns flag instead of throwing
	const result = await decryptData(tampered, { silent: true });
	assert.equal(result.decryptionError, true);
	assert.equal(result.encrypted, true);

	// When key is missing in silent mode
	clearCryptoKey();
	const noKeyResult = await decryptData(encrypted, { silent: true });
	assert.equal(noKeyResult.decryptionError, true);
});

test('parameter discrimination: decryptData(cipher, { silent: true }) does not treat options as CryptoKey', async () => {
	clearCryptoKey();
	const cipher = {
		v: 1,
		encrypted: true,
		iv: 'invalid-iv',
		data: 'invalid-data'
	};

	// If { silent: true } was mistaken for a CryptoKey, crypto.subtle.decrypt would throw TypeError.
	// With correct discrimination, it returns { ...cipher, decryptionError: true } cleanly.
	const res = await decryptData(cipher, { silent: true });
	assert.equal(res.decryptionError, true);
});

test('stack-safety: handles large payload (>128KB) without call stack overflow', async () => {
	await setCryptoKey('large-payload-secret');

	// Create 128KB text string
	const chunk = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-abcdefghijklmnopqrstuvwxyz_';
	const repeatCount = Math.ceil((128 * 1024) / chunk.length);
	const largeString = chunk.repeat(repeatCount);
	assert.ok(largeString.length >= 131072);

	const encrypted = await encryptData({ largeString });
	const decrypted = await decryptData(encrypted);
	assert.equal(decrypted.largeString, largeString);
});

test('backward compatibility: seamlessly decrypts legacy v0 unversioned envelopes', async () => {
	await setCryptoKey('legacy-secret');

	// Simulate legacy v0 envelope (no 'v' and no 'alg' field)
	const modernEncrypted = await encryptData({ legacy: 'data' });
	const legacyEnvelope = {
		encrypted: true,
		iv: modernEncrypted.iv,
		data: modernEncrypted.data
	};
	assert.equal(legacyEnvelope.v, undefined);
	assert.equal(legacyEnvelope.alg, undefined);

	const decrypted = await decryptData(legacyEnvelope);
	assert.deepEqual(decrypted, { legacy: 'data' });
});

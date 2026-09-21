import test from 'node:test';
import assert from 'node:assert/strict';

import {
	rotChar,
	utf8ToBase64,
	base64ToUtf8,
	xorBytes,
	xorObfuscate,
	xorDeobfuscate,
	obfuscate,
	deobfuscate
} from '../components/ln-obfuscator/src/obfuscator-model.js';

test('rotChar shifts single characters correctly and preserves case', () => {
	assert.equal(rotChar('a', 13), 'n');
	assert.equal(rotChar('A', 13), 'N');
	assert.equal(rotChar('z', 1), 'a');
	assert.equal(rotChar('Z', 1), 'A');
	assert.equal(rotChar('5', 13), '8');
	assert.equal(rotChar('0', 1), '1');
	assert.equal(rotChar('9', 1), '0');
	assert.equal(rotChar('@', 13), '@');
	assert.equal(rotChar('ж', 13), 'ж');
});

test('obfuscate and deobfuscate with default ROT13', () => {
	const plain = 'Hello World!';
	const obfuscated = obfuscate(plain);
	assert.equal(obfuscated, 'Uryyb Jbeyq!');
	assert.equal(deobfuscate(obfuscated), plain);
});

test('obfuscate and deobfuscate with arbitrary shifts', () => {
	const text = 'The Quick Brown Fox Jumps Over 13 Lazy Dogs.';
	for (const shift of [1, 5, 12, 13, 19, 25]) {
		const enc = obfuscate(text, shift);
		assert.notEqual(enc, text);
		const dec = deobfuscate(enc, shift);
		assert.equal(dec, text);
	}
});

test('obfuscate handles emails and URLs cleanly', () => {
	const email = 'mailto:contact@example.com';
	const obfuscatedEmail = obfuscate(email, 13);
	assert.equal(obfuscatedEmail, 'znvygb:pbagnpg@rknzcyr.pbz');
	assert.equal(deobfuscate(obfuscatedEmail, 13), email);

	const url = 'https://livenetworks.net/careers?dept=dev#apply';
	const obfuscatedUrl = obfuscate(url, 13);
	assert.equal(obfuscatedUrl, 'uggcf://yvirargjbexf.arg/pnerref?qrcg=qri#nccyl');
	assert.equal(deobfuscate(obfuscatedUrl, 13), url);
});

test('obfuscate obfuscates digits in telephone numbers while preserving symbols', () => {
	const phone = 'tel:+389-70-123-456';
	const obfuscatedPhone = obfuscate(phone, 13);
	assert.equal(obfuscatedPhone, 'gry:+612-03-456-789');
	assert.equal(deobfuscate(obfuscatedPhone, 13), phone);
});

test('obfuscate handles null, undefined, empty, and non-string inputs', () => {
	assert.equal(obfuscate(''), '');
	assert.equal(obfuscate(null), '');
	assert.equal(obfuscate(undefined), '');
	assert.equal(obfuscate(12345), '45678');

	assert.equal(deobfuscate(''), '');
	assert.equal(deobfuscate(null), '');
	assert.equal(deobfuscate(undefined), '');
});

test('identity guarantee: deobfuscate(obfuscate(s, n), n) === s across edge cases', () => {
	const samples = [
		'Simple lowercase and UPPERCASE',
		'Mixed 1234567890 with symbols !@#$%^&*()_+~`-={}|[]\\:";\'<>?,./',
		'Unicode: Кирилица, Cyrillic, Greek, Emojis 🚀🔥',
		'Newline\nand\ttabs\r\n',
		'+389 70 123 456 / +1 (800) 555-0199',
		'contact@example.com',
	];

	for (const s of samples) {
		for (const shift of [0, 1, 5, 7, 13, 26, 39]) {
			assert.equal(deobfuscate(obfuscate(s, shift), shift), s);
		}
	}
});

test('utf8ToBase64 and base64ToUtf8 roundtrip with international characters', () => {
	const strings = [
		'Контакт телефони: 070 123 456 и 078 987 654',
		'Македонска кирилица: АБВГДЃЕЖЗЅИЈКЛЉМНЊОПРСТЌУФХЦЧЏШ абвгдѓежзѕијклљмнњопрстќуфхцчџш',
		'日本語テキスト：お問い合わせは contact@example.com までお願いします。',
		'中文测试：欢迎联系 contact@example.com 电话 138-0000-0000',
		'العربية: مرحبا بكم في موقعنا',
		'Mixed: Email contact@example.com +389 70 123 456 🔥🎉',
	];

	for (const str of strings) {
		const b64 = utf8ToBase64(str);
		assert.notEqual(b64, str);
		const decoded = base64ToUtf8(b64);
		assert.equal(decoded, str);
	}
});

test('xorObfuscate and xorDeobfuscate roundtrip with custom keys and international text', () => {
	const strings = [
		'Контакт телефони: 070 123 456',
		'Кирилица со клуч тајна',
		'日本語とキー：秘密のキー',
		'mailto:contact@example.com',
		'tel:+389-70-123-456',
	];

	const keys = ['ln-ashlar', 'тајна', 'my-secret-key-2026', 'x', '12345'];

	for (const str of strings) {
		for (const key of keys) {
			const enc = xorObfuscate(str, key);
			assert.notEqual(enc, str);
			const dec = xorDeobfuscate(enc, key);
			assert.equal(dec, str);

			// With wrong key, does not equal original
			if (key !== 'wrong-key') {
				const wrongDec = xorDeobfuscate(enc, 'wrong-key');
				assert.notEqual(wrongDec, str);
			}
		}
	}
});

test('unified obfuscate/deobfuscate handles codec: base64 and codec: xor via options object', () => {
	const text = 'Контакт: contact@example.com, тел: +389-70-123-456';

	// Base64 codec
	const b64 = obfuscate(text, { codec: 'base64' });
	assert.notEqual(b64, text);
	assert.equal(deobfuscate(b64, { codec: 'base64' }), text);

	// XOR codec with default key
	const xorDefault = obfuscate(text, { codec: 'xor' });
	assert.notEqual(xorDefault, text);
	assert.equal(deobfuscate(xorDefault, { codec: 'xor' }), text);

	// XOR codec with custom key
	const xorCustom = obfuscate(text, { codec: 'xor', key: 'тајна' });
	assert.notEqual(xorCustom, text);
	assert.equal(deobfuscate(xorCustom, { codec: 'xor', key: 'тајна' }), text);

	// Auto-detect XOR when only key is passed
	const xorAuto = obfuscate(text, { key: 'секрет' });
	assert.notEqual(xorAuto, text);
	assert.equal(deobfuscate(xorAuto, { key: 'секрет' }), text);
});

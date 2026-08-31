import test from 'node:test';
import assert from 'node:assert/strict';

import {
	formatFileSize,
	getFileExtension,
	isFileTypeAllowed,
	parseAcceptExtensions
} from '../components/ln-upload/src/upload-model.js';

test('parseAcceptExtensions extracts extensions and mime-types cleanly', () => {
	assert.equal(parseAcceptExtensions(null), null);
	assert.equal(parseAcceptExtensions(''), null);
	assert.deepEqual(parseAcceptExtensions('.png, .jpg, image/jpeg'), ['png', 'jpg', 'image/jpeg']);
	assert.deepEqual(parseAcceptExtensions('  .PDF, DOCX  '), ['pdf', 'docx']);
});

test('getFileExtension extracts lowercase extension accurately', () => {
	assert.equal(getFileExtension('document.PDF'), 'pdf');
	assert.equal(getFileExtension('archive.tar.gz'), 'gz');
	assert.equal(getFileExtension('noextension'), '');
	assert.equal(getFileExtension(''), '');
	assert.equal(getFileExtension(null), '');
});

test('isFileTypeAllowed checks extensions and wildcard mime-types', () => {
	const allowed = ['pdf', 'image/*'];

	assert.equal(isFileTypeAllowed({ name: 'file.pdf', type: 'application/pdf' }, allowed), true);
	assert.equal(isFileTypeAllowed({ name: 'photo.png', type: 'image/png' }, allowed), true);
	assert.equal(isFileTypeAllowed({ name: 'script.js', type: 'text/javascript' }, allowed), false);
	assert.equal(isFileTypeAllowed({ name: 'photo.jpg', type: '' }, allowed), false);
	assert.equal(isFileTypeAllowed(null, allowed), false);
	assert.equal(isFileTypeAllowed({ name: 'any.txt' }, []), true);
});

test('formatFileSize formats bytes with units and locale number formatting', () => {
	assert.equal(formatFileSize(0), '0 B');
	assert.equal(formatFileSize(1024), '1 KB');
	assert.equal(formatFileSize(1048576), '1 MB');
	assert.equal(formatFileSize(1572864), '1.5 MB');
	assert.equal(formatFileSize(NaN), '0 B');
});

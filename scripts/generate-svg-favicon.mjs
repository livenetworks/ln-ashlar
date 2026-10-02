import { readFileSync, writeFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');

const darkB64 = readFileSync(resolve(root, 'assets/brand/favicon-dark-256x256.png')).toString('base64');
const lightB64 = readFileSync(resolve(root, 'assets/brand/favicon-light-256x256.png')).toString('base64');

const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256">
  <style>
    .icon-dark { display: none; }
    .icon-light { display: block; }
    @media (prefers-color-scheme: dark) {
      .icon-dark { display: block; }
      .icon-light { display: none; }
    }
  </style>
  <image href="data:image/png;base64,${darkB64}" class="icon-dark" width="256" height="256" />
  <image href="data:image/png;base64,${lightB64}" class="icon-light" width="256" height="256" />
</svg>
`;

const targets = [
	'assets/brand/favicon.svg',
	'demo/assets/favicon.svg',
	'favicon.svg',
	'demo/favicon.svg',
	'demo/admin/favicon.svg'
];

for (const target of targets) {
	writeFileSync(resolve(root, target), svg, 'utf8');
}

console.log(`Generated SVG favicons across ${targets.length} targets.`);

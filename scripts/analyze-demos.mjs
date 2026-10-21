import fs from 'node:fs';
import path from 'node:path';

const adminDir = 'demo/admin';
const files = fs.readdirSync(adminDir).filter(f => f.endsWith('.html') && f !== 'src').sort();

const summary = {};

for (const file of files) {
  const name = file.replace('.html', '');
  const content = fs.readFileSync(path.join(adminDir, file), 'utf8');

  const idMatches = content.match(/id="([^"]+)"/g) || [];
  const ids = idMatches.map(m => m.replace(/id=|"/g, '')).filter(id => !id.startsWith('ln-icon') && !id.startsWith('theme-') && id !== 'demo-engine-picker' && id !== 'demo-engine-trigger').slice(0, 5);

  const dataLnMatches = content.match(/data-ln-([a-z0-9\-]+)/g) || [];
  const uniqueLns = Array.from(new Set(dataLnMatches))
    .filter(a => !['data-ln-debug', 'data-ln-template', 'data-ln-field', 'data-ln-toast', 'data-ln-toast-item', 'data-ln-toast-when', 'data-ln-attr', 'data-ln-popover-for'].includes(a))
    .slice(0, 5);

  summary[name] = { ids, uniqueLns };
}

fs.writeFileSync('scripts/demo-page-inventory.json', JSON.stringify(summary, null, 2));
console.log('Saved demo page inventory for', Object.keys(summary).length, 'pages.');

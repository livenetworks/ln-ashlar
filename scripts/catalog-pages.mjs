import fs from 'node:fs';
import path from 'node:path';

const pagesDir = 'demo/admin/src/pages';
const files = fs.readdirSync(pagesDir).filter(f => f.endsWith('.html')).sort();

const catalog = {};

for (const file of files) {
  const name = file.replace('.html', '');
  const content = fs.readFileSync(path.join(pagesDir, file), 'utf8');

  // Find IDs
  const idMatches = content.match(/id="([^"]+)"/g) || [];
  const ids = Array.from(new Set(idMatches.map(m => m.replace(/id=|"/g, ''))));

  // Find data-ln attributes
  const lnMatches = content.match(/data-ln-([a-z0-9\-]+)/g) || [];
  const lns = Array.from(new Set(lnMatches)).filter(a => !['data-ln-template', 'data-ln-field', 'data-ln-attr'].includes(a));

  // Find buttons, inputs, links
  const hasButton = /<button/i.test(content);
  const hasInput = /<input|<textarea|<select/i.test(content);
  const hasTable = /<table/i.test(content);
  const hasForm = /<form/i.test(content);
  const hasDialog = /<dialog/i.test(content);
  const hasSvg = /<svg/i.test(content);

  catalog[name] = {
    ids,
    lns,
    hasButton,
    hasInput,
    hasTable,
    hasForm,
    hasDialog,
    hasSvg
  };
}

fs.writeFileSync('scripts/page-catalog.json', JSON.stringify(catalog, null, 2));
console.log('Cataloged', Object.keys(catalog).length, 'pages.');

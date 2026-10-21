import fs from 'node:fs';
import path from 'node:path';

const pagesDir = 'demo/admin/src/pages';
const files = fs.readdirSync(pagesDir).filter(f => f.endsWith('.html')).sort();

const specs = {};

for (const file of files) {
  const name = file.replace('.html', '');
  const content = fs.readFileSync(path.join(pagesDir, file), 'utf8');

  // Find selectors
  const selectors = ['.section-card'];

  if (content.includes('<table')) selectors.push('table');
  if (content.includes('<form')) selectors.push('form');
  if (content.includes('<dialog')) selectors.push('dialog');
  if (content.includes('data-ln-accordion')) selectors.push('[data-ln-accordion]');
  if (content.includes('data-ln-tabs')) selectors.push('[data-ln-tabs]');
  if (content.includes('data-ln-modal')) selectors.push('[data-ln-modal]');
  if (content.includes('data-ln-dropdown')) selectors.push('[data-ln-dropdown]');
  if (content.includes('data-ln-popover')) selectors.push('[data-ln-popover]');
  if (content.includes('data-ln-table')) selectors.push('[data-ln-table]');
  if (content.includes('data-ln-toggle')) selectors.push('[data-ln-toggle]');
  if (content.includes('.stat-card')) selectors.push('.stat-card');
  if (content.includes('.badge')) selectors.push('.badge');
  if (content.includes('.chip')) selectors.push('.chip');

  // Check interactive
  const isInteractive = (
    content.includes('data-ln-accordion') ||
    content.includes('data-ln-tabs') ||
    content.includes('data-ln-modal') ||
    content.includes('data-ln-dropdown') ||
    content.includes('data-ln-popover') ||
    content.includes('data-ln-table') ||
    content.includes('data-ln-toggle') ||
    content.includes('data-ln-filter') ||
    content.includes('data-ln-search') ||
    content.includes('data-ln-confirm') ||
    content.includes('data-ln-autosave') ||
    content.includes('data-ln-autoresize') ||
    content.includes('data-ln-validate') ||
    content.includes('data-ln-store') ||
    content.includes('data-ln-sortable') ||
    content.includes('data-ln-stepper') ||
    content.includes('data-ln-picklist') ||
    content.includes('data-ln-slug') ||
    content.includes('data-ln-upload') ||
    content.includes('data-ln-toast') ||
    content.includes('data-ln-api') ||
    content.includes('data-ln-ajax') ||
    content.includes('data-ln-router') ||
    content.includes('data-ln-obfuscator')
  );

  specs[name] = {
    name,
    interactive: isInteractive,
    selectors: Array.from(new Set(selectors))
  };
}

console.log('Classified', Object.keys(specs).length, 'page specs.');
console.log('Interactive count:', Object.values(specs).filter(s => s.interactive).length);
console.log('Visual-only count:', Object.values(specs).filter(s => !s.interactive).length);

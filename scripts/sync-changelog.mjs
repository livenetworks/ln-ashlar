#!/usr/bin/env node

/**
 * scripts/sync-changelog.mjs
 *
 * Generates root `CHANGELOG.md` from `releases/v*.md` and older milestone
 * summaries in `releases/README.md` so consumers on npm and GitHub can inspect
 * release notes from a single authoritative changelog.
 *
 * Usage:
 *   node scripts/sync-changelog.mjs         # Generate CHANGELOG.md
 *   node scripts/sync-changelog.mjs --check # Verify freshness (exit 1 on drift)
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const REPO_ROOT = path.resolve(__dirname, '..');
export const RELEASES_DIR = path.join(REPO_ROOT, 'releases');
export const CHANGELOG_PATH = path.join(REPO_ROOT, 'CHANGELOG.md');
export const REPO_URL = 'https://github.com/livenetworks/ln-ashlar';

/** Normalize line endings to LF so checks match across Windows and Linux. */
export function normalize(str) {
  return str.replace(/\r\n/g, '\n');
}

/** Parse strict `vX.Y.Z` tag string into numeric tuple, or null if non-matching. */
export function parseSemver(tag) {
  const match = tag.match(/^v(\d+)\.(\d+)\.(\d+)$/);
  if (!match) return null;
  return [Number(match[1]), Number(match[2]), Number(match[3])];
}

/** Numeric descending semver comparator for tag strings. */
export function compareSemverDesc(aTag, bTag) {
  const a = parseSemver(aTag);
  const b = parseSemver(bTag);
  if (!a && !b) return bTag.localeCompare(aTag);
  if (!a) return 1;
  if (!b) return -1;
  for (let i = 0; i < 3; i++) {
    if (a[i] !== b[i]) return b[i] - a[i];
  }
  return 0;
}

/** Rewrite relative `./` and `../` links in release notes to absolute GitHub URLs. */
export function rewriteRelativeLinks(md) {
  return md
    .replace(/\]\(\.\/([^)]+)\)/g, `](${REPO_URL}/blob/main/releases/$1)`)
    .replace(/\]\(\.\.\/([^)]+)\)/g, `](${REPO_URL}/blob/main/$1)`);
}

/** Demote H2 headings outside fenced code blocks to H3 so only version headers stay H2. */
function demoteBodyH2Headings(lines) {
  let inFence = false;
  return lines.map((line) => {
    if (/^\s*```/.test(line)) {
      inFence = !inFence;
      return line;
    }
    if (!inFence && /^## (?!#)/.test(line)) {
      return `### ${line.slice(3)}`;
    }
    return line;
  });
}

/** Format a `releases/vX.Y.Z.md` file into a CHANGELOG section entry. */
function formatReleaseFileEntry(tag, rawContent) {
  const text = normalize(rawContent);
  const dateMatch = text.match(/^>\s*\*\*Date:\*\*\s*(.+)$/m);
  const date = dateMatch ? dateMatch[1].trim() : '';

  const lines = text.split('\n');
  let idx = 0;

  // Skip leading `# ln-ashlar vX.Y.Z` heading and following blank lines
  if (idx < lines.length && /^#\s+/.test(lines[idx])) {
    idx++;
    while (idx < lines.length && lines[idx].trim() === '') idx++;
  }

  // Filter top metadata blockquote lines (strip Release/Date, keep Summary etc.)
  const keptBlockquote = [];
  while (idx < lines.length && /^>/.test(lines[idx])) {
    const line = lines[idx];
    if (!/^>\s*\*\*(?:Release|Date):\*\*/.test(line)) {
      keptBlockquote.push(line);
    }
    idx++;
  }

  // Skip blanks and the first standalone `---` separator right under the metadata
  while (idx < lines.length && lines[idx].trim() === '') idx++;
  if (idx < lines.length && /^---\s*$/.test(lines[idx])) {
    idx++;
    while (idx < lines.length && lines[idx].trim() === '') idx++;
  }

  const bodyLines = demoteBodyH2Headings(lines.slice(idx));
  const combined = [...keptBlockquote];
  if (keptBlockquote.length > 0 && bodyLines.length > 0) {
    combined.push('');
  }
  combined.push(...bodyLines);

  const body = rewriteRelativeLinks(combined.join('\n')).trim();
  const heading = `## [${tag}](${REPO_URL}/blob/main/releases/${tag}.md)${date ? ` — ${date}` : ''}`;
  return body ? `${heading}\n\n${body}` : heading;
}

/** Extract milestone entries (`vX.Y.Z`) listed in `releases/README.md`. */
export function parseReadmeMilestones() {
  const readmePath = path.join(RELEASES_DIR, 'README.md');
  if (!fs.existsSync(readmePath)) return new Map();

  const lines = normalize(fs.readFileSync(readmePath, 'utf8')).split('\n');
  const milestones = new Map();
  let current = null;

  const flush = () => {
    if (!current) return;
    current.summary = current.summaryLines.join('\n').replace(/  +$/gm, '').trim();
    milestones.set(current.tag, {
      tag: current.tag,
      date: current.date,
      url: current.url,
      summary: rewriteRelativeLinks(current.summary),
    });
    current = null;
  };

  for (const line of lines) {
    const headerMatch = line.match(/^### \[(v\d+\.\d+\.\d+)\]\(([^)]+)\)\s*—\s*(.+)$/);
    if (headerMatch) {
      flush();
      current = {
        tag: headerMatch[1],
        url: headerMatch[2].trim(),
        date: headerMatch[3].trim(),
        summaryLines: [],
      };
      continue;
    }

    if (!current) continue;

    if (/^(?:### |👉|---)/.test(line)) {
      flush();
      continue;
    }

    current.summaryLines.push(line);
  }
  flush();

  return milestones;
}

/** Build the complete `CHANGELOG.md` document from `releases/`. */
export function buildChangelog() {
  const fileTags = fs.readdirSync(RELEASES_DIR)
    .filter((name) => /^v\d+\.\d+\.\d+\.md$/.test(name))
    .map((name) => name.replace(/\.md$/, ''))
    .sort(compareSemverDesc);

  const coveredTags = new Set(fileTags);
  const entryRecords = [];

  for (const tag of fileTags) {
    const raw = fs.readFileSync(path.join(RELEASES_DIR, `${tag}.md`), 'utf8');
    entryRecords.push({
      tag,
      markdown: formatReleaseFileEntry(tag, raw),
    });
  }

  const readmeMilestones = parseReadmeMilestones();
  for (const [tag, info] of readmeMilestones.entries()) {
    if (coveredTags.has(tag)) continue;
    const targetUrl = `${REPO_URL}/releases/tag/${tag}`;
    const heading = `## [${tag}](${targetUrl})${info.date ? ` — ${info.date}` : ''}`;
    entryRecords.push({
      tag,
      markdown: info.summary ? `${heading}\n\n${info.summary}` : heading,
    });
  }

  entryRecords.sort((a, b) => compareSemverDesc(a.tag, b.tag));

  const header = [
    '# Changelog',
    '',
    'All notable changes to `@livenetworks/ashlar` are documented here.',
    `Generated from [\`releases/\`](${REPO_URL}/tree/main/releases) via \`npm run sync:changelog\` — do not edit directly.`,
    '',
    `For GitHub releases and individual release pages, see [GitHub Releases](${REPO_URL}/releases) and [\`releases/README.md\`](${REPO_URL}/blob/main/releases/README.md).`,
  ].join('\n');

  const body = entryRecords.map((record) => record.markdown).join('\n\n---\n\n');
  return {
    count: entryRecords.length,
    content: `${header}\n\n---\n\n${body}\n`,
  };
}

function main() {
  const isCheck = process.argv.includes('--check');
  const { count, content } = buildChangelog();

  if (isCheck) {
    const current = fs.existsSync(CHANGELOG_PATH)
      ? normalize(fs.readFileSync(CHANGELOG_PATH, 'utf8'))
      : null;

    if (current !== content) {
      console.error('❌ Drift detected: CHANGELOG.md is out of date. Run `npm run sync:changelog` to update.');
      process.exit(1);
    }
    console.log('✅ CHANGELOG.md is up to date.');
    process.exit(0);
  }

  fs.writeFileSync(CHANGELOG_PATH, content, 'utf8');
  console.log(`✅ Generated CHANGELOG.md (${count} releases, ${content.length} bytes)`);
}

if (process.argv[1] && path.resolve(process.argv[1]) === __filename) {
  main();
}

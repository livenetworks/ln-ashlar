#!/usr/bin/env node

/**
 * scripts/publish-github-releases.mjs
 *
 * Publishes GitHub Releases for `ln-ashlar` tags using authoritative notes
 * from `releases/vX.Y.Z.md` or milestone summaries in `releases/README.md`.
 *
 * Usage:
 *   node scripts/publish-github-releases.mjs --tag v2.2.6 [--overwrite] [--dry-run]
 *   node scripts/publish-github-releases.mjs --backfill [--overwrite] [--dry-run]
 */

import fs from 'fs';
import os from 'os';
import path from 'path';
import { execFileSync } from 'child_process';
import {
  REPO_ROOT,
  RELEASES_DIR,
  normalize,
  parseSemver,
  compareSemverDesc,
  rewriteRelativeLinks,
  parseReadmeMilestones,
} from './sync-changelog.mjs';

const TAG_PATTERN = /^v\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?$/;

function parseArgs(argv) {
  const opts = {
    tag: null,
    backfill: false,
    overwrite: false,
    dryRun: false,
  };

  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === '--backfill') {
      opts.backfill = true;
    } else if (arg === '--overwrite') {
      opts.overwrite = true;
    } else if (arg === '--no-overwrite') {
      opts.overwrite = false;
    } else if (arg === '--dry-run') {
      opts.dryRun = true;
    } else if (arg === '--tag') {
      opts.tag = argv[++i] || null;
    } else if (arg.startsWith('--tag=')) {
      opts.tag = arg.slice('--tag='.length) || null;
    } else {
      console.error(`Unknown argument: ${arg}`);
      process.exit(1);
    }
  }

  if ((opts.tag && opts.backfill) || (!opts.tag && !opts.backfill)) {
    console.error('Usage: node scripts/publish-github-releases.mjs --tag <vX.Y.Z> | --backfill [--overwrite] [--dry-run]');
    process.exit(1);
  }

  return opts;
}

/** Run git safely with argument array. */
function runGit(args) {
  return execFileSync('git', args, {
    cwd: REPO_ROOT,
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
  });
}

/** Verify a tag name is valid semver-prefixed tag and exists in git. */
function assertTagExists(tag) {
  if (!TAG_PATTERN.test(tag)) {
    throw new Error(`Invalid tag format: "${tag}" (expected vX.Y.Z)`);
  }
  try {
    runGit(['rev-parse', '-q', '--verify', `refs/tags/${tag}`]);
  } catch {
    throw new Error(`Git tag "${tag}" does not exist locally.`);
  }
}

/** Collect all local `v*` git tags and return sorted list + highest stable tag. */
function getGitTags() {
  const output = runGit(['tag', '-l', 'v*']);
  const tags = output
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((tag) => TAG_PATTERN.test(tag));

  const stableSortedDesc = tags
    .filter((tag) => parseSemver(tag) !== null)
    .sort(compareSemverDesc);

  return {
    allSet: new Set(tags),
    stableSortedAsc: [...stableSortedDesc].reverse(),
    highestTag: stableSortedDesc[0] || null,
  };
}

/** Prepare release body markdown and metadata source for a tag. */
function resolveReleaseNotes(tag, readmeMilestones) {
  const releaseFilePath = path.join(RELEASES_DIR, `${tag}.md`);
  if (fs.existsSync(releaseFilePath)) {
    const raw = normalize(fs.readFileSync(releaseFilePath, 'utf8'));
    const stripped = raw.replace(/^#\s+[^\n]*\n+/, '');
    const body = rewriteRelativeLinks(stripped).trim();
    return {
      source: `releases/${tag}.md`,
      body: `${body}\n`,
    };
  }

  const milestone = readmeMilestones.get(tag);
  if (milestone) {
    const lines = [`> **Release:** \`${tag}\``];
    if (milestone.date) lines.push(`> **Date:** ${milestone.date}`);
    if (milestone.summary) {
      lines.push('', milestone.summary);
    }
    return {
      source: 'releases/README.md',
      body: `${lines.join('\n').trim()}\n`,
    };
  }

  return null;
}

/** Check whether a GitHub Release already exists for the given tag. */
function releaseExistsOnGitHub(tag) {
  try {
    execFileSync('gh', ['release', 'view', tag, '--json', 'tagName'], {
      cwd: REPO_ROOT,
      stdio: 'ignore',
    });
    return true;
  } catch {
    return false;
  }
}

/** Execute `gh` command with inherited stdio so CI logs show exact results. */
function runGh(args) {
  execFileSync('gh', args, {
    cwd: REPO_ROOT,
    stdio: 'inherit',
  });
}

/** Create or update a single GitHub Release. */
function publishSingleRelease({ tag, highestTag, overwrite, dryRun, notesInfo }) {
  const title = `ln-ashlar ${tag}`;
  const isLatest = tag === highestTag;
  const latestFlag = isLatest ? '--latest' : '--latest=false';
  const sourceLabel = notesInfo ? notesInfo.source : '--generate-notes';

  if (dryRun) {
    console.log(
      `[dry-run] ${tag} | title="${title}" | notes=${sourceLabel} | ${latestFlag}${overwrite ? ' | mode=create-or-edit' : ' | mode=create-if-missing'}`
    );
    return;
  }

  const exists = releaseExistsOnGitHub(tag);
  if (exists && !overwrite) {
    console.log(`↷ Skipping ${tag} (GitHub Release already exists; pass --overwrite to update)`);
    return;
  }

  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'ashlar-release-'));
  try {
    let notesFilePath = null;
    if (notesInfo) {
      notesFilePath = path.join(tmpDir, `${tag}.md`);
      fs.writeFileSync(notesFilePath, notesInfo.body, 'utf8');
    }

    if (exists) {
      const editArgs = ['release', 'edit', tag, '--title', title];
      if (notesFilePath) {
        editArgs.push('--notes-file', notesFilePath);
      } else {
        console.warn(`⚠ No local release notes for ${tag}; updating title/latest flag only.`);
      }
      if (isLatest) {
        editArgs.push('--latest');
      }
      console.log(`↻ Updating GitHub Release ${tag} (${sourceLabel})...`);
      runGh(editArgs);
      return;
    }

    const createArgs = ['release', 'create', tag, '--verify-tag', '--title', title];
    if (notesFilePath) {
      createArgs.push('--notes-file', notesFilePath);
    } else {
      createArgs.push('--generate-notes');
    }
    createArgs.push(latestFlag);

    console.log(`⬆ Creating GitHub Release ${tag} (${sourceLabel}, ${latestFlag})...`);
    runGh(createArgs);
  } finally {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  }
}

function main() {
  const opts = parseArgs(process.argv.slice(2));
  const { allSet, stableSortedAsc, highestTag } = getGitTags();
  const readmeMilestones = parseReadmeMilestones();

  if (opts.tag) {
    assertTagExists(opts.tag);
    const notesInfo = resolveReleaseNotes(opts.tag, readmeMilestones);
    publishSingleRelease({
      tag: opts.tag,
      highestTag,
      overwrite: opts.overwrite,
      dryRun: opts.dryRun,
      notesInfo,
    });
    return;
  }

  // Detect `releases/v*.md` files that do not have a matching git tag
  const untaggedNoteFiles = fs.readdirSync(RELEASES_DIR)
    .filter((name) => /^v\d+\.\d+\.\d+\.md$/.test(name))
    .map((name) => name.replace(/\.md$/, ''))
    .filter((tag) => !allSet.has(tag))
    .sort(compareSemverDesc);

  let publishedCount = 0;
  for (const tag of stableSortedAsc) {
    const notesInfo = resolveReleaseNotes(tag, readmeMilestones);
    if (!notesInfo) continue;

    publishSingleRelease({
      tag,
      highestTag,
      overwrite: opts.overwrite,
      dryRun: opts.dryRun,
      notesInfo,
    });
    publishedCount++;
  }

  console.log(`\nProcessed ${publishedCount} tagged releases (highest tag: ${highestTag || 'none'}).`);
  if (untaggedNoteFiles.length > 0) {
    console.log(`Skipped untagged release note files (no git tag exists): ${untaggedNoteFiles.join(', ')}`);
  }
}

main();

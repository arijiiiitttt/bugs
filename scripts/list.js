#!/usr/bin/env node
// Usage: npm run list [-- easy|medium|hard] [-- <text to search for>]
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const index = JSON.parse(fs.readFileSync(path.join(root, 'problems.json'), 'utf8'));
const filters = process.argv.slice(2).map((s) => s.toLowerCase());

const rows = index.filter((p) =>
  filters.every((f) => [p.id, p.difficulty, p.track, p.title, p.dir].join(' ').toLowerCase().includes(f))
);
for (const p of rows) {
  console.log(`${p.id}  ${p.difficulty.padEnd(6)} ${p.track.padEnd(24)} ${p.title}`);
}
console.log(`\n${rows.length} problem(s)`);

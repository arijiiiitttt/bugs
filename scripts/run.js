#!/usr/bin/env node
// Usage:
//   npm test -- 012                run the tests of problem 012
//   npm test -- 012 --watch        re-run on file changes
//   npm run solution -- 012        run the tests against the reference solution (peek!)
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const problemsDir = path.join(root, 'problems');
const args = process.argv.slice(2);
const useSolution = args.includes('--solution');
const watch = args.includes('--watch');
const id = args.find((a) => !a.startsWith('--'));

if (!id) {
  console.log('Usage: npm test -- <problem number>   e.g. npm test -- 012');
  console.log('       npm run list                  to see every problem');
  process.exit(1);
}

const wanted = id.padStart(3, '0');
const dir = fs.readdirSync(problemsDir).find((d) => d.startsWith(wanted + '-'));
if (!dir) {
  console.error(`No problem found for "${id}". Run: npm run list`);
  process.exit(1);
}

let target = path.join(problemsDir, dir);
if (useSolution) {
  // Copy the problem to a scratch folder inside the pack (so node_modules resolves),
  // overlay the reference solution on top of src/, and run the tests there.
  const tmp = path.join(root, '.solution-check', dir);
  fs.rmSync(tmp, { recursive: true, force: true });
  fs.cpSync(target, tmp, { recursive: true });
  const sol = path.join(tmp, 'solution');
  if (fs.existsSync(sol)) {
    for (const f of fs.readdirSync(sol)) {
      if (f.endsWith('.md')) continue;
      fs.copyFileSync(path.join(sol, f), path.join(tmp, 'src', f));
    }
  }
  target = tmp;
}

const testDir = path.join(target, 'test');
const files = fs.readdirSync(testDir).filter((f) => f.endsWith('.test.js')).map((f) => path.join(testDir, f));
const nodeArgs = ['--test', '--test-reporter=spec', ...(watch ? ['--watch'] : []), ...files];
console.log(`\n▶ ${dir}${useSolution ? '  (reference solution)' : ''}\n`);
const r = spawnSync(process.execPath, nodeArgs, { stdio: 'inherit', cwd: target });
if (useSolution) fs.rmSync(path.join(root, '.solution-check'), { recursive: true, force: true });
process.exit(r.status ?? 1);

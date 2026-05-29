#!/usr/bin/env node
/**
 * Merge .env.e2e.investor.example → .env.local so Next.js loads investor demo env at process start.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const exampleEnvPath = path.join(root, '.env.e2e.investor.example');
const localEnvPath = path.join(root, '.env.local');

function parseEnvLines(text) {
  const vars = new Map();
  for (const line of text.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eq = trimmed.indexOf('=');
    if (eq <= 0) continue;
    vars.set(trimmed.slice(0, eq).trim(), trimmed.slice(eq + 1).trim());
  }
  return vars;
}

export function mergeInvestorEnvLocal() {
  if (!fs.existsSync(exampleEnvPath)) {
    throw new Error(`missing ${exampleEnvPath}`);
  }
  const exampleVars = parseEnvLines(fs.readFileSync(exampleEnvPath, 'utf8'));
  const out = [];
  const seen = new Set();

  if (fs.existsSync(localEnvPath)) {
    for (const line of fs.readFileSync(localEnvPath, 'utf8').split('\n')) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) {
        out.push(line);
        continue;
      }
      const eq = trimmed.indexOf('=');
      if (eq <= 0) {
        out.push(line);
        continue;
      }
      const key = trimmed.slice(0, eq).trim();
      if (exampleVars.has(key)) {
        out.push(`${key}=${exampleVars.get(key)}`);
        seen.add(key);
      } else {
        out.push(line);
        seen.add(key);
      }
    }
  }

  for (const [key, val] of exampleVars) {
    if (!seen.has(key)) out.push(`${key}=${val}`);
  }

  fs.writeFileSync(localEnvPath, `${out.join('\n').replace(/\n*$/, '\n')}`, 'utf8');
  return localEnvPath;
}

if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) {
  mergeInvestorEnvLocal();
  console.log(`[merge-investor-env-local] merged → ${localEnvPath}`);
}

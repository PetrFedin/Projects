#!/usr/bin/env node
/** Wave 24: listWorkshop2StagingMigrations glob 007+ WORKSHOP2_PG_ONLY */
import fs from 'node:fs';
import path from 'node:path';
const root = process.cwd();
const dir = path.join(root, 'db/migrations');
const files = fs.existsSync(dir) ? fs.readdirSync(dir).filter((f) => /^0(0[7-9]|[1-9][0-9])_/.test(f)).sort() : [];
console.log('[pg-staging-up] migrations 007+:', files.join(', ') || '(none)');
console.log('[pg-staging-up] WORKSHOP2_PG_ONLY=true recommended for staging');
process.exit(0);

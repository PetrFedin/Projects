#!/usr/bin/env node
/**
 * Проверка файлов в schemas/: валидный JSON, корректный каркас JSON Schema.
 * Полная валидация инстансов — через ajv (см. schemas/README.md).
 */
import { readFileSync, readdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const schemasDir = join(root, 'schemas');

/** Для файла схемы: обязательные поля в массиве `required` у корня документа схемы. */
const schemaRequiredArrays = {
  'workshop2-dossier-phase1.json': ['schemaVersion', 'assignments'],
  'attribute-catalog.json': ['schemaVersion', 'groups', 'attributes'],
  'workshop2-visual-handoff-v1.json': [
    'schema',
    'exportedAt',
    'visualQuickSummary',
    'references',
    'masterPinCount',
    'sheetPinCountTotal',
  ],
};

let failed = false;

const jsonFiles = readdirSync(schemasDir).filter((f) => f.endsWith('.json'));

for (const name of jsonFiles) {
  const path = join(schemasDir, name);
  let data;
  try {
    data = JSON.parse(readFileSync(path, 'utf8'));
  } catch (e) {
    console.error(`[schemas] ${name}:`, e.message);
    failed = true;
    continue;
  }

  if (!(name in schemaRequiredArrays)) {
    console.warn(`[schemas] ${name}: нет правил в validate-schemas.mjs (только JSON OK)`);
    continue;
  }

  if (typeof data.$schema !== 'string' || !data.$schema.includes('json-schema.org')) {
    console.error(`[schemas] ${name}: ожидается корневой "$schema" (JSON Schema)`);
    failed = true;
    continue;
  }

  const need = schemaRequiredArrays[name];
  const req = data.required;
  if (!Array.isArray(req)) {
    console.error(`[schemas] ${name}: у схемы нет массива "required"`);
    failed = true;
    continue;
  }
  for (const k of need) {
    if (!req.includes(k)) {
      console.error(`[schemas] ${name}: в "required" схемы должно быть поле инстанса "${k}"`);
      failed = true;
    }
  }
}

if (failed) {
  process.exit(1);
}
console.log('[schemas] OK:', jsonFiles.filter((f) => f in schemaRequiredArrays).join(', '));

#!/usr/bin/env node
/**
 * Валидация schemas/examples/*.json против JSON Schema (ajv draft 2020-12).
 */
import { readFileSync, readdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import Ajv2020 from 'ajv/dist/2020.js';
import addFormats from 'ajv-formats';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const schemasDir = join(root, 'schemas');
const examplesDir = join(schemasDir, 'examples');

/** Имя файла примера → имя файла схемы в schemas/ */
const exampleToSchema = {
  'workshop2-dossier-phase1.min.json': 'workshop2-dossier-phase1.json',
  'attribute-catalog.min.json': 'attribute-catalog.json',
  'workshop2-visual-handoff-v1.min.json': 'workshop2-visual-handoff-v1.json',
};

const ajv = new Ajv2020({ allErrors: true, strict: false });
addFormats(ajv);

const validators = new Map();

function validateData(schemaName, data, label) {
  if (!validators.has(schemaName)) {
    const schema = JSON.parse(readFileSync(join(schemasDir, schemaName), 'utf8'));
    validators.set(schemaName, ajv.compile(schema));
  }
  const validate = validators.get(schemaName);
  if (!validate(data)) {
    console.error(`[schemas:examples] ${label} не проходит ${schemaName}:`, validate.errors);
    return false;
  }
  console.log('[schemas:examples] OK:', label);
  return true;
}

let failed = false;
const names = readdirSync(examplesDir).filter((f) => f.endsWith('.json'));

for (const name of names) {
  const schemaName = exampleToSchema[name];
  if (!schemaName) {
    console.warn(`[schemas:examples] пропуск (нет маппинга): ${name}`);
    continue;
  }
  const dataPath = join(examplesDir, name);
  let data;
  try {
    data = JSON.parse(readFileSync(dataPath, 'utf8'));
  } catch (e) {
    console.error(`[schemas:examples] ${name}:`, e.message);
    failed = true;
    continue;
  }
  try {
    if (!validateData(schemaName, data, name)) failed = true;
  } catch (e) {
    console.error(`[schemas:examples] compile ${schemaName}:`, e.message);
    failed = true;
  }
}

const appCatalogInstance = join(
  root,
  'src/lib/production/data/attribute-catalog.instance.json'
);
try {
  const data = JSON.parse(readFileSync(appCatalogInstance, 'utf8'));
  if (!validateData('attribute-catalog.json', data, 'attribute-catalog.instance.json (app data)')) {
    failed = true;
  }
} catch (e) {
  console.error('[schemas:examples] attribute-catalog.instance.json:', e.message);
  failed = true;
}

if (failed) process.exit(1);

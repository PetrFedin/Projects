#!/usr/bin/env node
/**
 * Точечно проставляет dossierSection / passport* для визуальных осей в attribute-catalog.instance.json.
 * Запуск: node scripts/patch-attribute-catalog-visual-passport.mjs
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const path = join(root, 'src/lib/production/data/attribute-catalog.instance.json');

/** Визуал паспорта: не «общий» блок линии, применимость L1–L3. */
const VISUAL_PASSPORT = {
  dossierSection: 'visuals',
  passportCommon: false,
  passportApplicableLevels: ['l1', 'l2', 'l3'],
};

/** Только дополнить passport* (dossierSection уже задан). */
const PASSPORT_ONLY_FALSE = {
  passportCommon: false,
};

const patchFullVisual = [
  'len',
  'bag-type',
  'patternOptionsByCategory',
  'fabricTextureOptions',
  'garmentLengthApparelOptions',
  'decorOptionsByCategory',
  'draperyOptionsByCategory',
  'shoe-toe-opening',
  'shoe-heel-counter',
  'shoe-toe-shape',
  'shoe-heel-shape',
  'shoe-closure',
  'shoe-decoration',
  'shoe-shaft-height',
  'shoe-outsole-tread',
];

const patchPassportOnly = ['sil', 'techPackRef'];

const data = JSON.parse(readFileSync(path, 'utf8'));
const byId = new Map(data.attributes.map((a) => [a.attributeId, a]));
const missing = [];

for (const id of patchFullVisual) {
  const a = byId.get(id);
  if (!a) {
    missing.push(id);
    continue;
  }
  Object.assign(a, VISUAL_PASSPORT);
}

for (const id of patchPassportOnly) {
  const a = byId.get(id);
  if (!a) {
    missing.push(id);
    continue;
  }
  Object.assign(a, PASSPORT_ONLY_FALSE);
}

if (missing.length) {
  console.error('[patch] Отсутствуют attributeId:', missing.join(', '));
  process.exit(1);
}

writeFileSync(path, `${JSON.stringify(data, null, 2)}\n`, 'utf8');
console.log('[patch] OK:', patchFullVisual.length, 'visual passport +', patchPassportOnly.length, 'passportCommon');

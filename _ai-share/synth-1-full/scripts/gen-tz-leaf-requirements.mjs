/**
 * Строит `tz-leaf-requirements.generated.ts`: явные флаги ТЗ по каждому уникальному листу L1›L2›L3
 * из `category-handbook.snapshot.json`. Правила исключений — в `computeFlags()` ниже.
 *
 * Запуск: node scripts/gen-tz-leaf-requirements.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const snapshotPath = path.join(root, 'src/lib/production/generated/category-handbook.snapshot.json');
const outPath = path.join(root, 'src/lib/project-info/tz-leaf-requirements.generated.ts');

const snapshot = JSON.parse(fs.readFileSync(snapshotPath, 'utf8'));
const leaves = snapshot.leaves ?? [];

/** Как в UI: плейсхолдер «—» = нет уровня. */
function normSeg(s) {
  const t = String(s ?? '').trim();
  if (!t || t === '—' || t === '–' || t === '-') return '';
  return t;
}

function tzLeafKey(l1, l2, l3) {
  return `${normSeg(l1)}›${normSeg(l2)}›${normSeg(l3)}`;
}

const TZ_LOGISTICS_L1 = new Set([
  'Одежда',
  'Обувь',
  'Сумки',
  'Головные уборы',
  'Носочно-чулочные',
  'Аксессуары',
  'Красота и уход',
  'Дом и стиль жизни',
  'Аксессуары для новорождённых',
  'Игрушки (детские)',
]);

const TZ_SEASON_L1 = new Set([
  'Одежда',
  'Обувь',
  'Сумки',
  'Головные уборы',
  'Носочно-чулочные',
  'Аксессуары',
  'Красота и уход',
]);

function skipCollectionSeason(l1, l2, l3) {
  const n1 = normSeg(l1);
  const n2 = normSeg(l2);
  const n3 = normSeg(l3);
  if (n1 === 'Аксессуары') {
    return (
      n2 === 'Украшения' ||
      n2 === 'Очки' ||
      n2 === 'Кожгалантерея мелкая' ||
      n2 === 'Тех-аксессуары' ||
      n2 === 'Зонты' ||
      n2 === 'Маски и бафы'
    );
  }
  if (n1 === 'Красота и уход' && n2 === 'Уход') return true;
  if (n1 === 'Сумки' && n2 === 'Чемоданы') return true;
  if (n1 === 'Одежда' && (n2 === 'Нижнее бельё' || n2 === 'Пижамы и домашняя одежда')) return true;
  if (n1 === 'Обувь' && n2 === 'Домашняя обувь') return true;
  void n3;
  return false;
}

function skipPackagingDimensions(l1, l2, l3) {
  const n1 = normSeg(l1);
  const n2 = normSeg(l2);
  const n3 = normSeg(l3);
  if (n1 === 'Аксессуары') {
    return n2 === 'Украшения' || n2 === 'Очки' || n2 === 'Кожгалантерея мелкая' || n2 === 'Маски и бафы';
  }
  if (n1 === 'Сумки') {
    if (n2 === 'Косметички' || n2 === 'Вечерние') return true;
    if (n2 === 'Повседневные' && n3 === 'Клатч') return true;
  }
  if (n1 === 'Дом и стиль жизни' && n2 === 'Декор') return true;
  return false;
}

function computeFlags(rawL1, rawL2, rawL3) {
  const n1 = normSeg(rawL1);
  const inLog = TZ_LOGISTICS_L1.has(n1);
  const inSeasonL1 = TZ_SEASON_L1.has(n1);
  return {
    collectionSeasonRequired: inSeasonL1 && !skipCollectionSeason(rawL1, rawL2, rawL3),
    packagingDimensionsRequired: inLog && !skipPackagingDimensions(rawL1, rawL2, rawL3),
    customsHsDeclarationRequired: inLog,
    certificationMarksRequired: inLog,
  };
}

const seen = new Set();
const rows = [];
for (const leaf of leaves) {
  const k = tzLeafKey(leaf.l1Name, leaf.l2Name, leaf.l3Name);
  if (seen.has(k)) continue;
  seen.add(k);
  const f = computeFlags(leaf.l1Name, leaf.l2Name, leaf.l3Name);
  rows.push({ k, f });
}
rows.sort((a, b) => a.k.localeCompare(b.k, 'ru'));

const lines = rows.map(
  ({ k, f }) =>
    `  '${k.replace(/'/g, "\\'")}': { collectionSeasonRequired: ${f.collectionSeasonRequired}, packagingDimensionsRequired: ${f.packagingDimensionsRequired}, customsHsDeclarationRequired: ${f.customsHsDeclarationRequired}, certificationMarksRequired: ${f.certificationMarksRequired} },`
);

const file = `/**
 * Явная матрица требований к полям ТЗ по листу справочника L1›L2›L3 (ключ = нормализованные сегменты).
 * Не править вручную — пересборка: \`npm run gen:tz-leaf-requirements\`.
 */
export type TzLeafExtraRequirements = {
  collectionSeasonRequired: boolean;
  packagingDimensionsRequired: boolean;
  customsHsDeclarationRequired: boolean;
  certificationMarksRequired: boolean;
};

/** Плейсхолдер «—» и пустая строка → пустой сегмент в ключе. */
export function handbookSegmentNorm(segment: string): string {
  const t = (segment ?? '').trim();
  if (t === '' || t === '—' || t === '–' || t === '-') return '';
  return t;
}

export function tzLeafKey(l1Name: string, l2Name: string, l3Name: string): string {
  return \`\${handbookSegmentNorm(l1Name)}›\${handbookSegmentNorm(l2Name)}›\${handbookSegmentNorm(l3Name)}\`;
}

export const TZ_LEAF_EXTRA_REQUIREMENTS: Record<string, TzLeafExtraRequirements> = {
${lines.join('\n')}
};

const TZ_EXTRA_NONE: TzLeafExtraRequirements = {
  collectionSeasonRequired: false,
  packagingDimensionsRequired: false,
  customsHsDeclarationRequired: false,
  certificationMarksRequired: false,
};

/** Лист не из справочника — доп. поля ТЗ не навязываем (остаётся только GLOBAL_TZ_REQUIRED у вызывающего). */
export function getTzLeafExtraRequirements(l1Name: string, l2Name: string, l3Name: string): TzLeafExtraRequirements {
  const k = tzLeafKey(l1Name, l2Name, l3Name);
  return TZ_LEAF_EXTRA_REQUIREMENTS[k] ?? TZ_EXTRA_NONE;
}
`;

fs.writeFileSync(outPath, file, 'utf8');
console.log('Wrote', outPath, 'keys:', rows.length);

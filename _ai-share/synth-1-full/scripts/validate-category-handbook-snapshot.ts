/**
 * Проверка снимка категорий: уникальные leafId, алиасы без циклов и с финалом в дереве,
 * разрешимость профиля и чеклиста по каждому листу.
 * Запуск: npm run validate:category-handbook
 */
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import type { CategoryHandbookSnapshot, HandbookCategoryLeaf } from '../src/lib/production/category-handbook-snapshot-builder';
import { getLeafHandbookGuidance } from '../src/lib/production/category-leaf-handbook-checklist';
import { LEAF_PRODUCTION_PROFILE_OVERRIDES } from '../src/lib/production/category-leaf-production-overrides';
import { taxonomyAliasForwardMap } from '../src/lib/production/category-taxonomy-aliases';
import {
  TZ_LEAF_EXTRA_REQUIREMENTS,
  tzLeafKey,
} from '../src/lib/project-info/tz-leaf-requirements.generated';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const snapPath = join(root, 'src/lib/production/generated/category-handbook.snapshot.json');
const raw = JSON.parse(readFileSync(snapPath, 'utf8')) as CategoryHandbookSnapshot;

const leaves = raw.leaves ?? [];
const leafIds = new Set(leaves.map((l) => l.leafId));
const aliases = raw.taxonomyAliases ?? [];
const forward = taxonomyAliasForwardMap(aliases);

let errors = 0;
const fail = (msg: string) => {
  console.error('[validate-category-handbook]', msg);
  errors += 1;
};

if (leaves.length === 0) fail('leaves пустой');

const dupCheck = new Set<string>();
for (const l of leaves) {
  if (dupCheck.has(l.leafId)) fail(`дубликат leafId: ${l.leafId}`);
  dupCheck.add(l.leafId);
}

for (const a of aliases) {
  if (!a.fromLeafId?.trim() || !a.toLeafId?.trim()) {
    fail(`пустой алиас: ${JSON.stringify(a)}`);
  }
}

for (const a of aliases) {
  let cur = a.fromLeafId.trim();
  const seen = new Set<string>();
  let walkOk = true;
  for (let step = 0; step < 256; step++) {
    if (seen.has(cur)) {
      fail(`цикл алиасов от «${a.fromLeafId}» (узел «${cur}»)`);
      walkOk = false;
      break;
    }
    seen.add(cur);
    if (leafIds.has(cur)) break;
    const next = forward.get(cur);
    if (!next) {
      fail(`алиас от «${a.fromLeafId}»: «${cur}» не лист снимка и нет исходящего алиаса`);
      walkOk = false;
      break;
    }
    cur = next;
  }
  if (walkOk && !leafIds.has(cur)) {
    fail(`алиас от «${a.fromLeafId}»: финальный id «${cur}» отсутствует в leaves`);
  }
}

for (const key of Object.keys(LEAF_PRODUCTION_PROFILE_OVERRIDES)) {
  if (!leafIds.has(key)) {
    fail(`LEAF_PRODUCTION_PROFILE_OVERRIDES: leafId «${key}» отсутствует в снимке`);
  }
}

const tzKeys = new Set(Object.keys(TZ_LEAF_EXTRA_REQUIREMENTS));
if (tzKeys.size !== leaves.length) {
  fail(
    `TZ_LEAF_EXTRA_REQUIREMENTS: ожидалось ${leaves.length} ключей, в файле ${tzKeys.size} (перегенерируйте gen:tz-leaf-requirements)`
  );
}
for (const leaf of leaves) {
  const tk = tzLeafKey(leaf.l1Name, leaf.l2Name, leaf.l3Name);
  if (!TZ_LEAF_EXTRA_REQUIREMENTS[tk]) {
    fail(`TZ_LEAF_EXTRA_REQUIREMENTS: нет строки для листа ${leaf.leafId} (ключ «${tk}»)`);
  }
}

for (const leaf of leaves) {
  try {
    const g = getLeafHandbookGuidance(leaf as HandbookCategoryLeaf);
    if (!g.canonicalLeafId) fail(`пустой canonicalLeafId для ${leaf.leafId}`);
    if (!g.profile.complianceTags.length) fail(`нет complianceTags для ${leaf.leafId}`);
  } catch (e) {
    fail(`getLeafHandbookGuidance(${leaf.leafId}): ${e}`);
  }
}

if (errors > 0) {
  console.error(`[validate-category-handbook] ошибок: ${errors}`);
  process.exit(1);
}
console.log(
  '[validate-category-handbook] OK · leaves:',
  leaves.length,
  '· aliases:',
  aliases.length
);

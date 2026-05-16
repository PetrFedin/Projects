/**
 * Сводка покрытия L2/L3 пресетом (category-handbook, «Одежда»).
 * Запуск: npm run validate:sewing-presets
 */
import { resolveSewingCategoryPreset } from '../src/lib/pattern-drafting/sewing-category-presets';
import {
  enumerateSewingApparelLeafCombos,
  isGenericSewingBrandNote,
} from '../src/lib/pattern-drafting/sewing-preset-coverage';

const combos = enumerateSewingApparelLeafCombos();
let generic = 0;
for (const c of combos) {
  const p = resolveSewingCategoryPreset(c.l2, c.leafName);
  if (isGenericSewingBrandNote(p.forBrandNote)) generic += 1;
}
const pct = combos.length ? ((100 * generic) / combos.length).toFixed(1) : '0';
// eslint-disable-next-line no-console
console.log(
  JSON.stringify(
    {
      ok: true,
      apparelLeafCombos: combos.length,
      genericFallback: generic,
      genericPercent: Number(pct),
    },
    null,
    2
  )
);
process.exit(0);

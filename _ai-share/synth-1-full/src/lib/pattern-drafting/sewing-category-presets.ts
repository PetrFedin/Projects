import type { SewingCategoryPreset } from '@/lib/pattern-drafting/sewing-category-preset.types';
import {
  applyDeclarativePresetPatches,
  readDeclarativeRulesFromLocalStorage,
} from '@/lib/pattern-drafting/sewing-preset-declarative';

export type { SewingCategoryPreset } from '@/lib/pattern-drafting/sewing-category-preset.types';

const base = (o: Partial<SewingCategoryPreset>): SewingCategoryPreset => ({
  summary: o.summary ?? 'Ориентир по меркам; утверждение кроя — у бренда.',
  primary: o.primary ?? 'bodice_front',
  alternates: o.alternates ?? ['bodice_back', 'sleeve'],
  ease: o.ease ?? { bust: 4, waist: 2, hip: 3 },
  darts: o.darts ?? { shoulderDart: true, bustSideDart: true, waistDart: true },
  skirtLenCm: o.skirtLenCm ?? 60,
  neckDropCm: o.neckDropCm ?? 2.4,
  forBrandNote: o.forBrandNote ?? '',
});

/** Пресет «общий ориентир» — для отчёта покрытия L2/L3. */
export const GENERIC_SEWING_PRESET_BRAND_NOTE = 'Категория: общий ориентир по меркам.';

const norm = (s: string) => s.toLowerCase().replace(/\s+/g, ' ').trim();

/** Оверрайды поверх эвристики; заполняйте под реальные L2/L3 (аналог «редактора» без UI). */
export type SewingPresetUserRule = {
  id: string;
  when: (l2: string, leafName: string) => boolean;
  patch: (preset: SewingCategoryPreset) => SewingCategoryPreset;
};

export const SEWING_PRESET_USER_RULES: SewingPresetUserRule[] = [];

function applySewingPresetUserRules(
  l2: string,
  leafName: string,
  preset: SewingCategoryPreset
): SewingCategoryPreset {
  let out = preset;
  for (const rule of SEWING_PRESET_USER_RULES) {
    if (rule.when(l2, leafName)) {
      out = rule.patch(out);
    }
  }
  return out;
}

/**
 * Сопоставление пути (ур.2 + лист) с пресетом по ключевым словам таксономии.
 */
function resolveSewingCategoryPresetCore(l2: string, leafName: string): SewingCategoryPreset {
  const t = norm(`${l2} ${leafName}`);

  if (t.includes('юбк') && !t.includes('плать')) {
    return base({
      summary: 'Низ: талия и бёдра; развёртка юбки — ориентир для согласования с брендом.',
      primary: 'skirt_front',
      alternates: ['skirt_back', 'bodice_front'],
      ease: { bust: 3, waist: 2, hip: 4 },
      darts: { shoulderDart: false, bustSideDart: false, waistDart: true },
      skirtLenCm: 65,
      forBrandNote: 'Категория: юбка. Длина/крой — по спецификации бренда.',
    });
  }
  if (t.includes('свадь') || t.includes('свадеб')) {
    return base({
      summary: 'Платье/комплект: сильные посадка и подклад; ориентир — обхваты, не финал кроя.',
      primary: 'bodice_front',
      alternates: ['skirt_front', 'sleeve', 'bodice_back'],
      ease: { bust: 3, waist: 2, hip: 3 },
      darts: { shoulderDart: true, bustSideDart: true, waistDart: true },
      skirtLenCm: 100,
      forBrandNote: 'Категория: свадебный ассортимент. Крой/фатин/корсет — в гайдлайнах бренда.',
    });
  }
  if (t.includes('носк') || t.includes('чулк') || t.includes('колгот') || t.includes('гольф')) {
    return base({
      summary: 'Мелкий трикотаж: силуэт без полного развёртывания; ориентир по обхвату стопы/голени — у бренда.',
      primary: 'bodice_front',
      alternates: ['sleeve', 'skirt_front'],
      ease: { bust: 8, waist: 6, hip: 6 },
      darts: { shoulderDart: false, bustSideDart: false, waistDart: false },
      forBrandNote: 'Категория: носки/колготы. Моделирование пяточка/клиньев — в ПО бренда.',
    });
  }
  if (t.includes('плать') || t.includes('сарафан')) {
    return base({
      summary: 'Платье: лиф + низ; переключайте деталь для оценки посадки.',
      primary: 'bodice_front',
      alternates: ['skirt_front', 'bodice_back', 'sleeve'],
      ease: { bust: 4, waist: 2, hip: 3 },
      darts: { shoulderDart: true, bustSideDart: true, waistDart: true },
      skirtLenCm: 90,
      forBrandNote: 'Категория: платье/сарафан. Полный волан/фасон — в техпаке бренда.',
    });
  }
  if (t.includes('кимоно') || t.includes('хаори')) {
    return base({
      summary: 'Покрой с запахом/без: обхваты важнее классического плеча; крой — у бренда.',
      primary: 'bodice_front',
      alternates: ['sleeve', 'bodice_back'],
      ease: { bust: 6, waist: 3, hip: 4 },
      darts: { shoulderDart: false, bustSideDart: true, waistDart: true },
      forBrandNote: 'Категория: кимоно/традиционный силуэт. Кокетка/росток — в конструкции бренда.',
    });
  }
  if (
    t.includes('пальт') ||
    t.includes('куртк') ||
    t.includes('пухов') ||
    t.includes('парк') ||
    t.includes('тренч') ||
    t.includes('плащ') ||
    t.includes('дождев') ||
    t.includes('бомбер') ||
    t.includes('ветровк') ||
    t.includes('жилет') ||
    t.includes('лайнер') ||
    t.includes('подстёж') ||
    t.includes('пух') ||
    t.includes('шуб')
  ) {
    return base({
      summary: 'Верх: прибавки шире; крой/подклад/капюшон — на производстве.',
      primary: 'bodice_front',
      alternates: ['sleeve', 'bodice_back'],
      ease: { bust: 8, waist: 4, hip: 5 },
      darts: { shoulderDart: true, bustSideDart: false, waistDart: true },
      neckDropCm: 2,
      forBrandNote: 'Категория: верхняя одежда. Допуски и сэндвич/пух — по спецификации бренда.',
    });
  }
  if (
    t.includes('пиджак') ||
    t.includes('блейзер') ||
    t.includes('костюм') ||
    t.includes('смокинг') ||
    t.includes('фрак')
  ) {
    return base({
      summary: 'Жакет/костюм: внимание к плечу и втачке рукава.',
      primary: 'bodice_front',
      alternates: ['sleeve', 'bodice_back', 'skirt_front'],
      ease: { bust: 5, waist: 3, hip: 4 },
      darts: { shoulderDart: true, bustSideDart: true, waistDart: true },
      forBrandNote: 'Категория: пиджак/костюм. Методика плеча — у технолога бренда.',
    });
  }
  if (t.includes('свитер') || t.includes('худи') || t.includes('кардиган') || t.includes('водолаз') || t.includes('трико')) {
    return base({
      summary: 'Трикотаж: чаще без классических вытачек; смотрите как ориентир.',
      primary: 'bodice_front',
      alternates: ['sleeve', 'bodice_back'],
      ease: { bust: 6, waist: 4, hip: 4 },
      darts: { shoulderDart: false, bustSideDart: false, waistDart: false },
      forBrandNote: 'Категория: трикотаж. Оса (посадка) и формула петли — в конструировании бренда.',
    });
  }
  if (
    t.includes('брюк') ||
    t.includes('джинс') ||
    t.includes('чинос') ||
    t.includes('карго') ||
    t.includes('джоггер') ||
    t.includes('леггинс') ||
    t.includes('лосин') ||
    t.includes('тайтс') ||
    t.includes('велосипедк') ||
    (t.includes('шорт') && !t.includes('пляж'))
  ) {
    return base({
      summary: 'Низ: без развёртки брюк в этом ориентире; мерки талии/бедра — для согласования с брендом.',
      primary: 'skirt_front',
      alternates: ['bodice_front', 'skirt_back'],
      ease: { bust: 3, waist: 2, hip: 5 },
      darts: { shoulderDart: false, bustSideDart: false, waistDart: true },
      skirtLenCm: 50,
      forBrandNote: 'Категория: брюки/шорты. Условный контур (талия) — полный пакет кроя брюк у бренда/ПО.',
    });
  }
  if (t.includes('рубашк') || t.includes('блуз') || t.includes('сорочк') || t.includes('топ') || t.includes('майк') || t.includes('кроп') || t.includes('футболк') || t.includes('поло') || t.includes('боди')) {
    return base({
      summary: 'Верх/сорочка: обычно умеренный ease, вытачки по силуэту.',
      primary: 'bodice_front',
      alternates: ['sleeve', 'bodice_back'],
      ease: { bust: 3, waist: 1.5, hip: 2 },
      darts: { shoulderDart: true, bustSideDart: true, waistDart: false },
      forBrandNote: 'Категория: верх/топ. Ворот/манжета/планка — в конструкции бренда.',
    });
  }
  if (
    t.includes('бюст') ||
    (t.includes('низн') && t.includes('бел')) ||
    t.includes('купальник') ||
    (t.includes('халат') && t.includes('пижам'))
  ) {
    return base({
      summary: 'Бельё/купальник: специфичные выкройки; контур — только ориентир по обхватам.',
      primary: 'bodice_front',
      alternates: ['skirt_front', 'sleeve'],
      ease: { bust: 2, waist: 1, hip: 2 },
      darts: { shoulderDart: true, bustSideDart: true, waistDart: true },
      forBrandNote: 'Категория: бельё/пляж. Лиф сильно градуируется; финал — бренд.',
    });
  }
  return base({
    summary: 'Категория уточнена по каталогу: пресет общий; крой уточняет бренд.',
    primary: 'bodice_front',
    alternates: ['sleeve', 'skirt_front', 'bodice_back'],
    forBrandNote: GENERIC_SEWING_PRESET_BRAND_NOTE,
  });
}

function applyDeclarativeRulesFromLocalStorage(
  l2: string,
  leafName: string,
  preset: SewingCategoryPreset
): SewingCategoryPreset {
  const rules = readDeclarativeRulesFromLocalStorage();
  return applyDeclarativePresetPatches(l2, leafName, preset, rules);
}

export function resolveSewingCategoryPreset(l2: string, leafName: string): SewingCategoryPreset {
  const afterCore = resolveSewingCategoryPresetCore(l2, leafName);
  const afterUser = applySewingPresetUserRules(l2, leafName, afterCore);
  return applyDeclarativeRulesFromLocalStorage(l2, leafName, afterUser);
}

/**
 * Текстовый бриф для внешних генераторов изображений (ИИ / фриланс).
 * Не вызывает сеть — только собирает контекст из каталога и силуэта.
 */
import type { CategorySketchFitVariant, CategorySketchKind } from '@/lib/production/category-sketch-template';

const KIND_LABELS_RU: Record<CategorySketchKind, string> = {
  apparel_outerwear: 'верхняя одежда (пальто, куртка, пуховик и т.п.)',
  apparel_dress: 'платье или сарафан',
  apparel_skirt: 'юбка',
  apparel_shirt: 'рубашка или блуза',
  apparel_top: 'верх (топ, футболка, майка, поло)',
  apparel_pants: 'низ (брюки, джинсы, легинсы)',
  apparel_shorts: 'шорты или бермуды',
  apparel_jumpsuit: 'комбинезон / оверол / цельнокройный низ+верх',
  apparel_vest: 'жилет или безрукавка',
  shoes: 'обувь',
  bags: 'сумка или рюкзак',
  headwear: 'головной убор',
  fur: 'меховое изделие',
  accessories: 'аксессуар',
  generic: 'изделие (уточнить по названию категории)',
};

const VARIANT_LABELS_RU: Record<CategorySketchFitVariant, string> = {
  womenswear: 'женский силуэт, пропорции взрослой женской фигуры',
  menswear: 'мужской силуэт, чуть шире плечи относительно бёдер',
  girls: 'детский силуэт (девочка), пропорции ребёнка',
  boys: 'детский силуэт (мальчик), пропорции ребёнка',
  baby: 'младенческий / малыш, компактные пропорции',
  neutral: 'универсальный силуэт без акцента на пол (унисекс / технический крой)',
};

export function buildCategorySketchAiPrompt(args: {
  pathLabel: string;
  kind: CategorySketchKind;
  variant: CategorySketchFitVariant;
  isUnisex?: boolean;
  extraHints?: string;
  /** Палитра, силуэт, запреты бренда — в начале промпта, жёстче обычных «подсказок». */
  brandbookConstraints?: string;
}): string {
  const { pathLabel, kind, variant, isUnisex, extraHints, brandbookConstraints } = args;
  const bb = brandbookConstraints?.trim();
  const lines = [
    'Задача: нейтральный технический fashion-скетч (линия, без лица и без брендинга) для производственного ТЗ.',
  ];
  if (bb) {
    lines.push(
      '---',
      'ОБЯЗАТЕЛЬНО (брендбук; не нарушать, приоритет выше любых иных пожеланий):',
      bb,
      '---'
    );
  }
  lines.push(
    `Категория каталога (L1 / L2 / L3): ${pathLabel}.`,
    `Тип изделия по силуэту шаблона: ${KIND_LABELS_RU[kind]}.`,
    `Целевая посадка и пропорции модели: ${VARIANT_LABELS_RU[variant]}${isUnisex ? ' · Указано унисекс в паспорте артикула.' : ''}.`,
    'Стиль: чистые линии, вид спереди или лёгкий ¾, светлый фон, видно конструктивные линии (проймы, борта, карманы, капюшон — если уместно).',
    'Не добавлять логотипы, принты и реалистичные ткани — только контур и намёк на объём.'
  );
  if (extraHints?.trim()) {
    lines.push(`Пожелания дизайнера (если не противоречат брендбуку): ${extraHints.trim()}`);
  }
  return lines.join('\n');
}

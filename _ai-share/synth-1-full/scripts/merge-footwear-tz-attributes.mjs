/**
 * Добавляет в attribute-catalog.instance.json атрибуты обуви для ТЗ.
 * Запуск: node scripts/merge-footwear-tz-attributes.mjs
 */
import fs from 'fs';
import path from 'path';

const file = path.join(import.meta.dirname, '../src/lib/production/data/attribute-catalog.instance.json');
const catalog = JSON.parse(fs.readFileSync(file, 'utf8'));

const existing = new Set(catalog.attributes.map((a) => a.attributeId));

const FOOTWEAR_TZ_ATTRIBUTES = [
  {
    attributeId: 'shoe-toe-opening',
    groupId: 'footwear',
    name: 'Носок: открытость',
    type: 'select',
    sortOrder: 1,
    workflowPhases: [1],
    requiredForPhase1: true,
    parameters: [
      { parameterId: 'sto-closed', label: 'Закрытый носок', sortOrder: 0, aliases: [] },
      { parameterId: 'sto-open', label: 'Открытый носок (открытые пальцы)', sortOrder: 1, aliases: [] },
      { parameterId: 'sto-peep', label: 'Полуоткрытый (peep toe)', sortOrder: 2, aliases: [] },
      { parameterId: 'sto-square-open', label: 'Открытая площадка пальцев', sortOrder: 3, aliases: [] },
    ],
    allowFreeText: true,
    allowMultipleDistinct: false,
    uiPlaceholder: 'Или уточните формулировку для ТЗ…',
  },
  {
    attributeId: 'shoe-heel-counter',
    groupId: 'footwear',
    name: 'Пятка: открытость',
    type: 'select',
    sortOrder: 2,
    workflowPhases: [1],
    requiredForPhase1: true,
    parameters: [
      { parameterId: 'shc-closed', label: 'Закрытая пятка', sortOrder: 0, aliases: [] },
      { parameterId: 'shc-open', label: 'Открытая пятка', sortOrder: 1, aliases: [] },
      { parameterId: 'shc-sling', label: 'Слингбек', sortOrder: 2, aliases: [] },
      { parameterId: 'shc-strap', label: 'Ремешок на пятке', sortOrder: 3, aliases: [] },
      { parameterId: 'shc-mule', label: 'Мюли (без задника)', sortOrder: 4, aliases: [] },
    ],
    allowFreeText: true,
    allowMultipleDistinct: false,
  },
  {
    attributeId: 'shoe-toe-shape',
    groupId: 'footwear',
    name: 'Форма носка',
    type: 'select',
    sortOrder: 3,
    workflowPhases: [1],
    requiredForPhase1: true,
    parameters: [
      { parameterId: 'sts-round', label: 'Круглый', sortOrder: 0, aliases: [] },
      { parameterId: 'sts-square', label: 'Квадратный', sortOrder: 1, aliases: [] },
      { parameterId: 'sts-square-soft', label: 'Квадрат с закруглением', sortOrder: 2, aliases: [] },
      { parameterId: 'sts-pointed', label: 'Зауженный (острый)', sortOrder: 3, aliases: [] },
      { parameterId: 'sts-almond', label: 'Миндаль', sortOrder: 4, aliases: [] },
      { parameterId: 'sts-flare', label: 'Раструб', sortOrder: 5, aliases: [] },
    ],
    allowFreeText: true,
    allowMultipleDistinct: false,
  },
  {
    attributeId: 'shoe-heel-shape',
    groupId: 'footwear',
    name: 'Форма каблука',
    type: 'select',
    sortOrder: 4,
    workflowPhases: [1],
    requiredForPhase1: true,
    parameters: [
      { parameterId: 'shs-none', label: 'Без каблука (flat)', sortOrder: 0, aliases: [] },
      { parameterId: 'shs-stiletto', label: 'Шпилька', sortOrder: 1, aliases: [] },
      { parameterId: 'shs-column', label: 'Столбик', sortOrder: 2, aliases: [] },
      { parameterId: 'shs-block', label: 'Блок / кирпич', sortOrder: 3, aliases: [] },
      { parameterId: 'shs-wedge', label: 'Танкетка', sortOrder: 4, aliases: [] },
      { parameterId: 'shs-cone', label: 'Конус / китайский стакан', sortOrder: 5, aliases: [] },
      { parameterId: 'shs-platform', label: 'Платформа', sortOrder: 6, aliases: [] },
      { parameterId: 'shs-combo', label: 'Комбинированный', sortOrder: 7, aliases: [] },
    ],
    allowFreeText: true,
    allowMultipleDistinct: false,
  },
  {
    attributeId: 'shoe-closure',
    groupId: 'footwear',
    name: 'Застёжка / фиксация',
    type: 'multiselect',
    sortOrder: 5,
    workflowPhases: [1],
    requiredForPhase1: true,
    parameters: [
      { parameterId: 'scl-lace', label: 'Шнуровка', sortOrder: 0, aliases: [] },
      { parameterId: 'scl-zip-side', label: 'Молния боковая', sortOrder: 1, aliases: [] },
      { parameterId: 'scl-zip-back', label: 'Молния задняя', sortOrder: 2, aliases: [] },
      { parameterId: 'scl-velcro', label: 'Липучка', sortOrder: 3, aliases: [] },
      { parameterId: 'scl-buckle', label: 'Пряжка', sortOrder: 4, aliases: [] },
      { parameterId: 'scl-elastic', label: 'Эластик / резинка', sortOrder: 5, aliases: [] },
      { parameterId: 'scl-slipon', label: 'Слип-он (без застёжки)', sortOrder: 6, aliases: [] },
      { parameterId: 'scl-chelsea', label: 'Резинки челси', sortOrder: 7, aliases: [] },
      { parameterId: 'scl-tstrap', label: 'T-strap', sortOrder: 8, aliases: [] },
      { parameterId: 'scl-ankle-strap', label: 'Ремешок на щиколотке', sortOrder: 9, aliases: [] },
    ],
    allowFreeText: true,
    allowMultipleDistinct: true,
  },
  {
    attributeId: 'shoe-decoration',
    groupId: 'footwear',
    name: 'Декор обуви',
    type: 'multiselect',
    sortOrder: 6,
    workflowPhases: [1],
    requiredForPhase1: true,
    parameters: [
      { parameterId: 'sde-none', label: 'Без декора', sortOrder: 0, aliases: [] },
      { parameterId: 'sde-buckle-dec', label: 'Декоративная пряжка', sortOrder: 1, aliases: [] },
      { parameterId: 'sde-chain', label: 'Цепочка', sortOrder: 2, aliases: [] },
      { parameterId: 'sde-studs', label: 'Заклёпки / шипы', sortOrder: 3, aliases: [] },
      { parameterId: 'sde-perf', label: 'Перфорация', sortOrder: 4, aliases: [] },
      { parameterId: 'sde-bow', label: 'Бант', sortOrder: 5, aliases: [] },
      { parameterId: 'sde-fringe', label: 'Бахрома', sortOrder: 6, aliases: [] },
      { parameterId: 'sde-contrast', label: 'Контрастные вставки', sortOrder: 7, aliases: [] },
      { parameterId: 'sde-embroidery', label: 'Вышивка', sortOrder: 8, aliases: [] },
      { parameterId: 'sde-rhinestone', label: 'Стразы', sortOrder: 9, aliases: [] },
    ],
    allowFreeText: true,
    allowMultipleDistinct: true,
  },
  {
    attributeId: 'shoe-insole-material',
    groupId: 'footwear',
    name: 'Материал стельки',
    type: 'select',
    sortOrder: 7,
    workflowPhases: [1],
    requiredForPhase1: true,
    parameters: [
      { parameterId: 'sim-leather', label: 'Кожа', sortOrder: 0, aliases: [] },
      { parameterId: 'sim-latex', label: 'Латекс / пеноматериал', sortOrder: 1, aliases: [] },
      { parameterId: 'sim-ortho-base', label: 'Ортопедическая основа', sortOrder: 2, aliases: [] },
      { parameterId: 'sim-fabric', label: 'Текстиль', sortOrder: 3, aliases: [] },
      { parameterId: 'sim-combo', label: 'Комбинированная', sortOrder: 4, aliases: [] },
    ],
    allowFreeText: true,
    allowMultipleDistinct: false,
  },
  {
    attributeId: 'shoe-insole-type',
    groupId: 'footwear',
    name: 'Тип стельки',
    type: 'select',
    sortOrder: 8,
    workflowPhases: [1],
    requiredForPhase1: true,
    parameters: [
      { parameterId: 'sit-flat', label: 'Плоская', sortOrder: 0, aliases: [] },
      { parameterId: 'sit-anatomic', label: 'Анатомическая', sortOrder: 1, aliases: [] },
      { parameterId: 'sit-removable', label: 'Съёмная', sortOrder: 2, aliases: [] },
      { parameterId: 'sit-arch', label: 'С супинатором', sortOrder: 3, aliases: [] },
      { parameterId: 'sit-cushion', label: 'С амортизацией', sortOrder: 4, aliases: [] },
      { parameterId: 'sit-molded', label: 'Формованная', sortOrder: 5, aliases: [] },
    ],
    allowFreeText: true,
    allowMultipleDistinct: false,
  },
  {
    attributeId: 'shoe-lining',
    groupId: 'footwear',
    name: 'Внутренняя отделка (подкладка)',
    type: 'select',
    sortOrder: 9,
    workflowPhases: [1],
    requiredForPhase1: true,
    parameters: [
      { parameterId: 'sln-leather', label: 'Кожа', sortOrder: 0, aliases: [] },
      { parameterId: 'sln-textile', label: 'Текстиль', sortOrder: 1, aliases: [] },
      { parameterId: 'sln-fur-nat', label: 'Мех натуральный', sortOrder: 2, aliases: [] },
      { parameterId: 'sln-fur-syn', label: 'Мех искусственный', sortOrder: 3, aliases: [] },
      { parameterId: 'sln-none', label: 'Без подкладки', sortOrder: 4, aliases: [] },
      { parameterId: 'sln-partial', label: 'Частичная подкладка', sortOrder: 5, aliases: [] },
    ],
    allowFreeText: true,
    allowMultipleDistinct: false,
  },
  {
    attributeId: 'shoe-fill',
    groupId: 'footwear',
    name: 'Утеплитель / наполнитель',
    type: 'select',
    sortOrder: 10,
    workflowPhases: [1],
    requiredForPhase1: true,
    parameters: [
      { parameterId: 'sfi-none', label: 'Нет', sortOrder: 0, aliases: [] },
      { parameterId: 'sfi-thin', label: 'Тонкий слой', sortOrder: 1, aliases: [] },
      { parameterId: 'sfi-membrane', label: 'Мембрана', sortOrder: 2, aliases: [] },
      { parameterId: 'sfi-wool', label: 'Шерсть', sortOrder: 3, aliases: [] },
      { parameterId: 'sfi-syn', label: 'Синтетический утеплитель', sortOrder: 4, aliases: [] },
    ],
    allowFreeText: true,
    allowMultipleDistinct: false,
  },
  {
    attributeId: 'shoe-shaft-height',
    groupId: 'footwear',
    name: 'Высота голенища',
    type: 'select',
    sortOrder: 11,
    workflowPhases: [1],
    requiredForPhase1: true,
    parameters: [
      { parameterId: 'ssh-na', label: 'Не применимо (не сапоги)', sortOrder: 0, aliases: [] },
      { parameterId: 'ssh-low', label: 'Ниже щиколотки', sortOrder: 1, aliases: [] },
      { parameterId: 'ssh-ankle', label: 'До щиколотки', sortOrder: 2, aliases: [] },
      { parameterId: 'ssh-mid', label: 'Полусапог', sortOrder: 3, aliases: [] },
      { parameterId: 'ssh-knee', label: 'Сапог (до колена)', sortOrder: 4, aliases: [] },
      { parameterId: 'ssh-otk', label: 'Ботфорты', sortOrder: 5, aliases: [] },
    ],
    allowFreeText: true,
    allowMultipleDistinct: false,
    uiInformationHint: 'Для туфель и кроссовок укажите «Не применимо».',
  },
  {
    attributeId: 'shoe-purpose',
    groupId: 'footwear',
    name: 'Назначение',
    type: 'select',
    sortOrder: 12,
    workflowPhases: [1],
    parameters: [
      { parameterId: 'spu-daily', label: 'Повседневная', sortOrder: 0, aliases: [] },
      { parameterId: 'spu-office', label: 'Офис', sortOrder: 1, aliases: [] },
      { parameterId: 'spu-evening', label: 'Вечерняя', sortOrder: 2, aliases: [] },
      { parameterId: 'spu-sport', label: 'Спорт', sortOrder: 3, aliases: [] },
      { parameterId: 'spu-home', label: 'Домашняя', sortOrder: 4, aliases: [] },
      { parameterId: 'spu-beach', label: 'Пляж / бассейн', sortOrder: 5, aliases: [] },
      { parameterId: 'spu-med', label: 'Медицинская / ортопедическая', sortOrder: 6, aliases: [] },
    ],
    allowFreeText: true,
    allowMultipleDistinct: false,
  },
  {
    attributeId: 'shoe-outsole-tread',
    groupId: 'footwear',
    name: 'Протектор / рисунок подошвы',
    type: 'select',
    sortOrder: 13,
    workflowPhases: [1],
    requiredForPhase1: true,
    parameters: [
      { parameterId: 'sot-smooth', label: 'Гладкая', sortOrder: 0, aliases: [] },
      { parameterId: 'sot-lug', label: 'Рифлёная / протектор', sortOrder: 1, aliases: [] },
      { parameterId: 'sot-winter', label: 'Зимняя', sortOrder: 2, aliases: [] },
      { parameterId: 'sot-sport', label: 'Спортивная', sortOrder: 3, aliases: [] },
    ],
    allowFreeText: true,
    allowMultipleDistinct: false,
    uiInformationHint: 'Дополняет поле «Подошва» (материал и конструкция).',
  },
];

let added = 0;
for (const attr of FOOTWEAR_TZ_ATTRIBUTES) {
  if (existing.has(attr.attributeId)) {
    console.warn('skip existing', attr.attributeId);
    continue;
  }
  catalog.attributes.push(attr);
  existing.add(attr.attributeId);
  added++;
}

catalog.catalogVersion = '2026.03.27';
catalog.updatedAt = new Date().toISOString();

fs.writeFileSync(file, JSON.stringify(catalog, null, 2) + '\n', 'utf8');
console.log('added attributes:', added, 'total attributes:', catalog.attributes.length);

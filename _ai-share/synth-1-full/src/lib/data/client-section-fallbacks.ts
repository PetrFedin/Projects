import type { LucideIcon } from 'lucide-react';
import {
  AlertTriangle,
  ArrowRightLeft,
  Bell,
  Calculator,
  Calendar,
  CalendarRange,
  Camera,
  Columns2,
  Droplets,
  FolderTree,
  Glasses,
  Layers,
  LayoutGrid,
  Leaf,
  Palette,
  Ruler,
  ScanSearch,
  Shuffle,
  Sparkles,
  UserCheck,
  Wand2,
} from 'lucide-react';
import { ROUTES } from '@/lib/routes';
import { normalizePath } from '@/lib/ui/cabinet-nav-active';

export type ClientSectionFallback = {
  label: string;
  description: string;
  icon?: LucideIcon;
};

/** Маршруты кабинета клиента без пункта в `clientNavGroups` — заголовок и подзаголовок как у реестров. */
const RAW: Record<string, ClientSectionFallback> = {
  [normalizePath(ROUTES.client.services)]: {
    label: 'Запись на сервис',
    description: 'Заказ химчистки, ремонта или кастомизации. Привязка к вещи из гардероба.',
    icon: Calendar,
  },
  [normalizePath(ROUTES.client.allergy)]: {
    label: 'Аллергены и состав',
    description: 'Персональные фильтры по составу ткани. Отметки на товарах.',
    icon: AlertTriangle,
  },
  [normalizePath(ROUTES.client.visualSearch)]: {
    label: 'Визуальный поиск',
    description: 'Похожие товары по фото.',
    icon: Camera,
  },
  [normalizePath(ROUTES.client.capsules)]: {
    label: 'Капсула / готовый лук',
    description: 'Три слота; экспорт v1 для бэкапа. API: позже POST /v1/client/capsules.',
    icon: Layers,
  },
  [normalizePath(ROUTES.client.forYou)]: {
    label: 'Для вас',
    description: 'Персональная лента по размерам, брендам и квизу стиля.',
    icon: Sparkles,
  },
  [normalizePath(ROUTES.client.colorStudio)]: {
    label: 'Цвет и сочетания',
    description:
      'Эвристики палитры для мерча и витрины; позже — эмбеддинги образов и правила бренда.',
    icon: Palette,
  },
  [normalizePath(ROUTES.client.fitAdvisor)]: {
    label: 'Посадка и размер',
    description: 'Детерминированный совет до подключения size-ML и истории заказов.',
    icon: Ruler,
  },
  [normalizePath(ROUTES.client.outfitBuilder)]: {
    label: 'Конструктор образа',
    description: 'Слоты образа и подсказки по «дырам» в комплекте.',
    icon: Layers,
  },
  [normalizePath(ROUTES.client.sustainabilityExplorer)]: {
    label: 'Eco-сигналы в каталоге',
    description:
      'Скоринг из тегов, состава и описания. Заменяется на LCA / сертификаты при подключении API.',
    icon: Leaf,
  },
  [normalizePath(ROUTES.client.inspirationBoard)]: {
    label: 'Доска вдохновения',
    description:
      'Пины SKU + версионный JSON. Позже: совместное редактирование и импорт из лукбуков.',
    icon: LayoutGrid,
  },
  [normalizePath(ROUTES.client.sizeCompare)]: {
    label: 'Сравнение SKU',
    description: 'Два артикула: размерный ряд, состав, сезон.',
    icon: Columns2,
  },
  [normalizePath(ROUTES.client.seasonAtlas)]: {
    label: 'Сезонный атлас',
    description:
      'Корзины SS/FW + год и carryover из тегов. Парсер: season-parse.',
    icon: CalendarRange,
  },
  [normalizePath(ROUTES.client.categoryAtlas)]: {
    label: 'Атлас категорий',
    description:
      'Путь из category_group → category → subcategory. Тот же индекс можно отдать с API taxonomy.',
    icon: FolderTree,
  },
  [normalizePath(ROUTES.client.priceWatch)]: {
    label: 'Слежение за ценой',
    description: 'Локально в браузере; контракт под price-alert API.',
    icon: Bell,
  },
  [normalizePath(ROUTES.client.sizeConverter)]: {
    label: 'Конвертер размеров',
    description: 'Справочные таблицы; в проде подставляйте матрицу бренда из PIM.',
    icon: ArrowRightLeft,
  },
  [normalizePath(ROUTES.client.fitProfile)]: {
    label: 'Ваши мерки (Fit Profile)',
    description:
      'Укажите свои параметры в см для автоматического сравнения с изделием. Хранится локально.',
    icon: UserCheck,
  },
  [normalizePath(ROUTES.client.waitlist)]: {
    label: 'Лист ожидания',
    description:
      'Здесь собраны товары и размеры, которых нет в наличии. Мы пришлем уведомление при поступлении.',
    icon: Bell,
  },
  [normalizePath(ROUTES.client.skuAlternatives)]: {
    label: 'Похожие SKU',
    description: 'Замены при OOS: бренд, категория, другой цвет. Query: ?sku=',
    icon: Shuffle,
  },
  [normalizePath(ROUTES.client.styleQuiz)]: {
    label: 'Квиз стиля',
    description: 'Локальный профиль для ранжирования «Для вас». Позже — синхронизация с CRM.',
    icon: Wand2,
  },
  [normalizePath(ROUTES.client.dutyEstimate)]: {
    label: 'Пошлина (демо)',
    description:
      'Оценка для витрины: не юридический совет. В проде — тарифный справочник и страна происхождения из декларации.',
    icon: Calculator,
  },
  [normalizePath(ROUTES.client.careSymbols)]: {
    label: 'Пиктограммы ухода',
    description: 'Библиотека для демо-карточек. В проде — синхронизация с PIM / GS1 и локализация.',
    icon: Droplets,
  },
  '/client/try-before-buy': {
    label: 'Try Before Buy',
    description: 'Примерка перед покупкой.',
    icon: ScanSearch,
  },
  '/client/navigation/ar': {
    label: 'Навигация AR',
    description: 'Подсказки по дополненной реальности в каталоге.',
    icon: Glasses,
  },
  '/client/customization': {
    label: 'Кастомизация',
    description: 'Персонализация товаров и опций.',
    icon: Sparkles,
  },
  '/client/style-me': {
    label: 'Style-Me: дополняем образ',
    description: 'Персональные подборки к вашей последней покупке',
    icon: Sparkles,
  },
  [normalizePath(ROUTES.client.calendar)]: {
    label: 'Календарь',
    description: 'События, планы и эфиры — ваш слой в общей экосистеме Syntha.',
    icon: Calendar,
  },
};

export function getClientSectionFallback(pathname: string | null | undefined): ClientSectionFallback | undefined {
  const p = normalizePath(pathname ?? '');
  return RAW[p];
}
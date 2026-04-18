import { products } from './products';
import type { B2BOrder, Product } from './types';
import { JOOR_DELIVERY_WINDOWS } from '@/lib/b2b/joor-constants';
import type { B2BOrderLineStatus } from '@/lib/order/b2b-order-payload';

/**
 * Три артикула в одном сезоне SS27, российские площадки (2+1 по производителям), по 2 поставщика ткани;
 * у одного артикула основная ткань со склада бренда (учёт на складе у производства).
 * Статусы этапов — investor-demo-flow-seed: 2 SKU на брифе, 1 на этапе «Материалы» (после брифа, PIM, хаба, себестоимости).
 */
export const initialOrderItems = [
  {
    ...products[0],
    id: 'demo-ss27-01',
    sku: 'SS27-M-COAT-01',
    name: 'Мужское пальто (шерсть)',
    orderedQuantity: 120,
    price: 42_000,
    deliveryWindowId: 'drop1',
    lineNotes: 'SS27 · Иваново · ткань у поставщиков',
    lineStatus: 'open' as B2BOrderLineStatus,
    season: 'SS27',
    categoryLeafId: 'catalog-apparel-g0-l0',
    productionSiteId: 'fab-rf-ivanovo',
    productionSiteLabel: 'Фабрика · Иваново (РФ)',
    fabricSuppliers: ['ООО «ИвановоТекстиль»', 'ЗАО «Северные полотна»'],
    fabricMainFromBrandStock: false,
    investorDemo: true,
    internalArticleCode: '100000',
  },
  {
    ...products[1],
    id: 'demo-ss27-02',
    sku: 'SS27-W-DRS-02',
    name: 'Платье миди (хлопок)',
    orderedQuantity: 200,
    price: 28_500,
    deliveryWindowId: 'drop1',
    lineNotes: 'SS27 · Иваново · ткань у поставщиков',
    lineStatus: 'open' as B2BOrderLineStatus,
    season: 'SS27',
    categoryLeafId: 'catalog-apparel-g2-l0',
    productionSiteId: 'fab-rf-ivanovo',
    productionSiteLabel: 'Фабрика · Иваново (РФ)',
    fabricSuppliers: ['ТПК «Волга»', '«Лен-комбинат»'],
    fabricMainFromBrandStock: false,
    investorDemo: true,
    internalArticleCode: '100001',
  },
  {
    ...products[2],
    id: 'demo-ss27-03',
    sku: 'SS27-U-SNK-03',
    name: 'Кроссовки демисезонные',
    orderedQuantity: 360,
    price: 19_900,
    deliveryWindowId: 'drop2',
    lineNotes: 'SS27 · Краснодар · основная ткань со стока бренда',
    lineStatus: 'open' as B2BOrderLineStatus,
    season: 'SS27',
    categoryLeafId: 'catalog-shoes-g0-l0',
    productionSiteId: 'fab-rf-krasnodar',
    productionSiteLabel: 'Фабрика · Краснодар (РФ)',
    fabricSuppliers: ['ООО «Текстиль-Юг»', 'Импорт (Италия)'],
    fabricMainFromBrandStock: true,
    investorDemo: true,
    internalArticleCode: '100002',
  },
].map((p: any) => ({
  ...p,
  color: p.availableColors?.[0]?.name || 'N/A',
  colorCode: p.availableColors?.[0]?.hex || '#000000',
}));

/** JOOR: данные заказа для страницы детализации (окна доставки, заметки) */
export const mockOrderDetailJoors = {
  orderNotes: 'Просим отгрузить Drop 1 не позднее 10 июля. Контакт по складу: +7 495 …',
  deliveryWindows: JOOR_DELIVERY_WINDOWS,
  currency: 'RUB',
};

export const mockB2BOrders: B2BOrder[] = [
  {
    order: 'B2B-0013',
    status: 'Черновик',
    shop: 'Демо-магазин · Москва 1',
    brand: 'Syntha Lab',
    amount: '0 ₽',
    date: '2024-07-29',
    deliveryDate: '2024-09-20',
    orderMode: 'pre_order',
    eventId: 'fw26',
    passportSlotId: 'slot-1',
    priceTier: 'retail_a',
    territory: 'Moscow',
    creditLimit: 2_500_000,
    paymentStatus: 'pending',
  },
  {
    order: 'B2B-0012',
    status: 'Зарезервировано',
    shop: 'Демо-магазин · Москва 1',
    brand: 'Syntha Lab',
    amount: '750 000 ₽',
    date: '2024-07-20',
    deliveryDate: '2024-09-15',
    orderMode: 'buy_now',
    priceTier: 'retail_a',
    territory: 'Moscow',
    creditLimit: 2_500_000,
    paymentStatus: 'partial',
    paidAmount: 300_000,
  },
  {
    order: 'B2B-0011',
    status: 'Требует внимания',
    shop: 'Демо-магазин · Москва 2',
    brand: 'Nordic Wool',
    amount: '1 200 000 ₽',
    date: '2024-07-15',
    deliveryDate: '2024-08-30',
    orderMode: 'reorder',
    priceTier: 'retail_b',
    territory: 'Moscow',
    creditLimit: 1_800_000,
    paymentStatus: 'overdue',
  },
  {
    order: 'B2B-0010',
    status: 'Черновик',
    shop: 'Демо-магазин · СПб',
    brand: 'Syntha Lab',
    amount: '450 000 ₽',
    date: '2024-06-25',
    deliveryDate: '2024-08-10',
    orderMode: 'pre_order',
    territory: 'SPb',
    creditLimit: 800_000,
    paymentStatus: 'paid',
  },
];

/** JOOR/NuOrder: единый пайплайн статусов B2B заказа для дашбордов и экспорта */
export const B2B_ORDER_STATUSES = [
  'Черновик',
  'На проверке',
  'Требует внимания',
  'Согласован',
  'Подтверждён',
  'Зарезервировано',
  'В производстве',
  'Отгружен',
  'Доставлен',
  'Инвойс выписан',
] as const;

export type B2BOrderStatusLabel = (typeof B2B_ORDER_STATUSES)[number];

export const orderStatusSteps = [
  { status: 'Черновик', date: '2024-07-28' },
  { status: 'На проверке', date: '2024-07-29' },
  { status: 'Согласован', date: '2024-08-01' },
  { status: 'В производстве', date: null },
  { status: 'Отгружен', date: null },
  { status: 'Доставлен', date: null },
];

export const mockChat: {
  user: string;
  text: string;
  time: string;
  attachedProduct?: Product;
  isSystem?: boolean;
}[] = [
  {
    user: 'Система',
    text: 'Демо-магазин · Москва 1 отправил заказ на согласование.',
    time: '14:25',
    isSystem: true,
  },
  {
    user: 'Анна (Syntha Lab)',
    text: 'Елена, здравствуйте! Заказ B2B-0012 получен. Все позиции в наличии для производства. Сроки подтверждаем.',
    time: '14:30',
  },
  {
    user: 'Вы',
    text: 'Анна, спасибо! Подскажите, сможем ли мы получить поставку до 15 сентября?',
    time: '14:32',
  },
  {
    user: 'Анна (Syntha Lab)',
    text: 'Да, конечно. Планируем отгрузку на 10 сентября, так что к 15-му все будет у вас.',
    time: '14:35',
  },
];

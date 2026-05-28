import type { CategorySketchKind } from '@/lib/production/category-sketch-template';
import type {
  Workshop2SketchAnnotationPriority,
  Workshop2SketchAnnotationType,
} from '@/lib/production/workshop2-dossier-phase1.types';

export type CategorySketchHotspotPreset = {
  id: string;
  label: string;
  xPct: number;
  yPct: number;
  annotationType: Workshop2SketchAnnotationType;
  text: string;
  priority?: Workshop2SketchAnnotationPriority;
};

/** Типовые зоны быстрого добавления меток по виду силуэта (категория листа). */
export const HOTSPOT_PRESETS_BY_KIND: Partial<
  Record<CategorySketchKind, CategorySketchHotspotPreset[]>
> = {
  apparel_outerwear: [
    {
      id: 'collar',
      label: 'Воротник / лацкан',
      xPct: 50,
      yPct: 20,
      annotationType: 'construction',
      text: 'Проверьте форму воротника и лацкана.',
      priority: 'important',
    },
    {
      id: 'shoulder',
      label: 'Плечо',
      xPct: 33,
      yPct: 28,
      annotationType: 'fit',
      text: 'Уточните посадку по плечу и баланс.',
      priority: 'important',
    },
    {
      id: 'front',
      label: 'Борт / застежка',
      xPct: 50,
      yPct: 43,
      annotationType: 'construction',
      text: 'Зафиксируйте борт, застежку и линию центра переда.',
      priority: 'critical',
    },
    {
      id: 'sleeve',
      label: 'Рукав',
      xPct: 22,
      yPct: 46,
      annotationType: 'construction',
      text: 'Проверьте форму рукава и свободу движения.',
      priority: 'important',
    },
    {
      id: 'pocket',
      label: 'Карман',
      xPct: 37,
      yPct: 59,
      annotationType: 'construction',
      text: 'Уточните тип кармана и его уровень.',
      priority: 'important',
    },
    {
      id: 'lining',
      label: 'Подкладка',
      xPct: 61,
      yPct: 63,
      annotationType: 'material',
      text: 'Проверьте подкладку, утеплитель или дублирование.',
      priority: 'note',
    },
    {
      id: 'hem',
      label: 'Низ изделия',
      xPct: 50,
      yPct: 86,
      annotationType: 'qc',
      text: 'Проверьте низ, симметрию и длину изделия.',
      priority: 'important',
    },
  ],
  apparel_dress: [
    {
      id: 'neck',
      label: 'Горловина',
      xPct: 50,
      yPct: 22,
      annotationType: 'construction',
      text: 'Уточните форму выреза и обработку горловины.',
      priority: 'important',
    },
    {
      id: 'waist',
      label: 'Линия талии',
      xPct: 50,
      yPct: 48,
      annotationType: 'fit',
      text: 'Зафиксируйте положение линии талии и прилегание.',
      priority: 'important',
    },
    {
      id: 'closure',
      label: 'Молния / застежка',
      xPct: 62,
      yPct: 52,
      annotationType: 'construction',
      text: 'Укажите тип и длину молнии.',
      priority: 'critical',
    },
    {
      id: 'hem',
      label: 'Низ / шлица',
      xPct: 50,
      yPct: 82,
      annotationType: 'finishing',
      text: 'Проверьте подгибку низа и наличие шлицы.',
      priority: 'note',
    },
  ],
  apparel_pants: [
    {
      id: 'waistband',
      label: 'Пояс',
      xPct: 50,
      yPct: 24,
      annotationType: 'construction',
      text: 'Проверьте ширину пояса и тип застежки.',
      priority: 'important',
    },
    {
      id: 'rise',
      label: 'Посадка (слонка)',
      xPct: 50,
      yPct: 45,
      annotationType: 'fit',
      text: 'Уточните высоту посадки и баланс изделия.',
      priority: 'critical',
    },
    {
      id: 'pocket',
      label: 'Карманы',
      xPct: 35,
      yPct: 35,
      annotationType: 'construction',
      text: 'Зафиксируйте тип и расположение карманов.',
      priority: 'important',
    },
    {
      id: 'hem',
      label: 'Низ брючин',
      xPct: 35,
      yPct: 85,
      annotationType: 'finishing',
      text: 'Проверьте обработку низа брюк.',
      priority: 'note',
    },
  ],
  apparel_shorts: [
    {
      id: 'waistband',
      label: 'Пояс',
      xPct: 50,
      yPct: 22,
      annotationType: 'construction',
      text: 'Пояс / резинка / шнур: уточнить.',
      priority: 'important',
    },
    {
      id: 'rise',
      label: 'Посадка',
      xPct: 50,
      yPct: 40,
      annotationType: 'fit',
      text: 'Высота посадки и длина шага.',
      priority: 'critical',
    },
    {
      id: 'leg_opening',
      label: 'Низ шорт',
      xPct: 38,
      yPct: 68,
      annotationType: 'finishing',
      text: 'Ширина проймы шорта, подгиб или необработанный край.',
      priority: 'important',
    },
  ],
  apparel_jumpsuit: [
    {
      id: 'shoulder',
      label: 'Плечо / лямка',
      xPct: 28,
      yPct: 32,
      annotationType: 'fit',
      text: 'Ширина плеч, лямки, пройма.',
      priority: 'critical',
    },
    {
      id: 'waist',
      label: 'Талия / резинка',
      xPct: 50,
      yPct: 48,
      annotationType: 'construction',
      text: 'Линия талии, молния, кнопки.',
      priority: 'important',
    },
    {
      id: 'leg',
      label: 'Штанина',
      xPct: 38,
      yPct: 72,
      annotationType: 'construction',
      text: 'Длина шага, объём бёдер.',
      priority: 'important',
    },
  ],
  apparel_vest: [
    {
      id: 'armhole',
      label: 'Пройма',
      xPct: 22,
      yPct: 42,
      annotationType: 'construction',
      text: 'Глубина и форма проймы.',
      priority: 'critical',
    },
    {
      id: 'closure',
      label: 'Застёжка',
      xPct: 50,
      yPct: 52,
      annotationType: 'construction',
      text: 'Молния, пуговицы, кнопки.',
      priority: 'important',
    },
    {
      id: 'hem',
      label: 'Низ жилета',
      xPct: 50,
      yPct: 78,
      annotationType: 'finishing',
      text: 'Длина по бедру / поясу.',
      priority: 'note',
    },
  ],
};

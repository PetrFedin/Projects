/**
 * Каталог знаков ухода для составника (ISO 3758 / ГОСТ Р 53271).
 * Пиктограммы-ориентиры: ч/б растры с публичного справочника Furtek
 * https://furtek.ru/znachki-po-uhodu (для тиража — вектор у поставщика бирок).
 */
const FT = (file: string) => `https://furtek.ru/image/data/znaki-na-odezde/${file}`;

export type W2CompositionLabelCareSymbolGroup =
  | 'wash'
  | 'bleach'
  | 'tumble'
  | 'wring'
  | 'iron'
  | 'professional';

export type Workshop2CompositionLabelCareSymbolCatalogEntry = {
  id: string;
  label: string;
  hint: string;
  group: W2CompositionLabelCareSymbolGroup;
  /** Ч/б ориентир с Furtek (JPG); для печати сверяйте с официальным набором. */
  iconUrl: string;
};

/** Порядок групп на бирке (логика ISO: стирка → отбеливание → сушка → отжим → глажка → проф.). */
export const W2_COMPOSITION_LABEL_CARE_GROUP_ORDER: W2CompositionLabelCareSymbolGroup[] = [
  'wash',
  'bleach',
  'tumble',
  'wring',
  'iron',
  'professional',
];

export const W2_COMPOSITION_LABEL_CARE_GROUP_LABELS: Record<
  W2CompositionLabelCareSymbolGroup,
  string
> = {
  wash: 'Стирка',
  bleach: 'Отбеливание',
  tumble: 'Сушка',
  wring: 'Отжим / скручивание',
  iron: 'Глажка',
  professional: 'Проф. уход / химчистка',
};

export const W2_COMPOSITION_LABEL_CARE_SYMBOL_CATALOG: Workshop2CompositionLabelCareSymbolCatalogEntry[] =
  [
    /* ——— Стирка (чаша) ——— */
    {
      id: 'wash_machine_normal',
      label: 'Машинная стирка, обычный режим',
      hint: 'Механика, замачивание, полоскание, нагрев',
      group: 'wash',
      iconUrl: FT('wh-washing.jpg'),
    },
    {
      id: 'wash_hand',
      label: 'Ручная стирка до 40 °C',
      hint: 'Машинная стирка запрещена; не тереть, нежный отжим',
      group: 'wash',
      iconUrl: FT('wh-washing-hand.jpg'),
    },
    {
      id: 'wash_30',
      label: 'Стирка до 30 °C (обычная)',
      hint: 'Машина или руки, до 30 °C',
      group: 'wash',
      iconUrl: FT('wh-washing-30deg.jpg'),
    },
    {
      id: 'wash_30_perm',
      label: 'Щадящая стирка до 30 °C',
      hint: 'Permanent press / деликат, до 30 °C',
      group: 'wash',
      iconUrl: FT('wh-washing-30deg-permanent-press.jpg'),
    },
    {
      id: 'wash_30_extra',
      label: 'Особо деликатная стирка до 30 °C',
      hint: 'Мин. обороты, без отжима в машине',
      group: 'wash',
      iconUrl: FT('wh-washing-30deg-extra-care.jpg'),
    },
    {
      id: 'wash_30_alt',
      label: 'Стирка до 30 °C (вариант 2)',
      hint: 'Альтернативная пиктограмма',
      group: 'wash',
      iconUrl: FT('wh-washing-30deg-alt.jpg'),
    },
    {
      id: 'wash_30_perm_alt',
      label: 'Щадящая стирка до 30 °C (вариант 2)',
      hint: 'Альтернативная пиктограмма',
      group: 'wash',
      iconUrl: FT('wh-washing-30deg-permanent-press-alt.jpg'),
    },
    {
      id: 'wash_30_extra_alt',
      label: 'Особо деликатная до 30 °C (вариант 2)',
      hint: 'Альтернативная пиктограмма',
      group: 'wash',
      iconUrl: FT('wh-washing-30deg-extra-care-alt.jpg'),
    },
    {
      id: 'wash_hand_30',
      label: 'Ручная стирка до 30 °C',
      hint: 'Только руки, до 30 °C',
      group: 'wash',
      iconUrl: FT('wh-washing-hand-30deg.jpg'),
    },
    {
      id: 'wash_40',
      label: 'Стирка до 40 °C (обычная)',
      hint: 'Машина или руки, до 40 °C',
      group: 'wash',
      iconUrl: FT('wh-washing-40deg.jpg'),
    },
    {
      id: 'wash_40_alt',
      label: 'Стирка до 40 °C (вариант 2)',
      hint: 'Альтернативная пиктограмма',
      group: 'wash',
      iconUrl: FT('wh-washing-40deg-alt.jpg'),
    },
    {
      id: 'wash_40_perm',
      label: 'Щадящая стирка до 40 °C',
      hint: 'Деликат, до 40 °C',
      group: 'wash',
      iconUrl: FT('wh-washing-40deg-permanent-press.jpg'),
    },
    {
      id: 'wash_40_perm_alt',
      label: 'Щадящая стирка до 40 °C (вариант 2)',
      hint: 'Альтернативная пиктограмма',
      group: 'wash',
      iconUrl: FT('wh-washing-40deg-permanent-press-alt.jpg'),
    },
    {
      id: 'wash_40_extra',
      label: 'Особо деликатная стирка до 40 °C',
      hint: 'До 40 °C',
      group: 'wash',
      iconUrl: FT('wh-washing-40deg-extra-care.jpg'),
    },
    {
      id: 'wash_40_extra_alt',
      label: 'Особо деликатная до 40 °C (вариант 2)',
      hint: 'Альтернативная пиктограмма',
      group: 'wash',
      iconUrl: FT('wh-washing-40deg-extra-care-alt.jpg'),
    },
    {
      id: 'wash_hand_40',
      label: 'Ручная стирка до 40 °C (вариант)',
      hint: 'Только руки, до 40 °C',
      group: 'wash',
      iconUrl: FT('wh-washing-hand-40deg.jpg'),
    },
    {
      id: 'wash_50',
      label: 'Стирка до 50 °C (обычная)',
      hint: 'Машина или руки, до 50 °C',
      group: 'wash',
      iconUrl: FT('wh-washing-50deg.jpg'),
    },
    {
      id: 'wash_50_perm',
      label: 'Щадящая стирка до 50 °C',
      hint: 'Деликат, до 50 °C',
      group: 'wash',
      iconUrl: FT('wh-washing-50deg-permanent-press.jpg'),
    },
    {
      id: 'wash_50_alt',
      label: 'Стирка до 50 °C (вариант 2)',
      hint: 'Альтернативная пиктограмма',
      group: 'wash',
      iconUrl: FT('wh-washing-50deg-alt.jpg'),
    },
    {
      id: 'wash_50_perm_alt',
      label: 'Щадящая до 50 °C (вариант 2)',
      hint: 'Альтернативная пиктограмма',
      group: 'wash',
      iconUrl: FT('wh-washing-50deg-permanent-press-alt.jpg'),
    },
    {
      id: 'wash_60',
      label: 'Стирка до 60 °C (обычная)',
      hint: 'Машина или руки, до 60 °C',
      group: 'wash',
      iconUrl: FT('wh-washing-60deg.jpg'),
    },
    {
      id: 'wash_60_perm',
      label: 'Щадящая стирка до 60 °C',
      hint: 'Деликат, до 60 °C',
      group: 'wash',
      iconUrl: FT('wh-washing-60deg-permanent-press.jpg'),
    },
    {
      id: 'wash_60_alt',
      label: 'Стирка до 60 °C (вариант 2)',
      hint: 'Альтернативная пиктограмма',
      group: 'wash',
      iconUrl: FT('wh-washing-60deg-alt.jpg'),
    },
    {
      id: 'wash_60_perm_alt',
      label: 'Щадящая до 60 °C (вариант 2)',
      hint: 'Альтернативная пиктограмма',
      group: 'wash',
      iconUrl: FT('wh-washing-60deg-permanent-press-alt.jpg'),
    },
    {
      id: 'wash_70',
      label: 'Стирка до 70 °C',
      hint: 'Машина или руки, до 70 °C',
      group: 'wash',
      iconUrl: FT('wh-washing-70deg.jpg'),
    },
    {
      id: 'wash_70_alt',
      label: 'Стирка до 70 °C (вариант 2)',
      hint: 'Альтернативная пиктограмма',
      group: 'wash',
      iconUrl: FT('wh-washing-70deg-alt.jpg'),
    },
    {
      id: 'wash_95',
      label: 'Стирка до 95 °C / кипячение',
      hint: 'Допустимо кипячение',
      group: 'wash',
      iconUrl: FT('wh-washing-90deg.jpg'),
    },
    {
      id: 'wash_95_alt',
      label: 'Стирка до 95 °C (вариант 2)',
      hint: 'Альтернативная пиктограмма',
      group: 'wash',
      iconUrl: FT('wh-washing-95deg-alt.jpg'),
    },
    {
      id: 'wash_95_perm',
      label: 'Щадящая стирка до 95 °C',
      hint: 'Деликат при высокой t°',
      group: 'wash',
      iconUrl: FT('wh-washing-95deg-permanent-press.jpg'),
    },
    {
      id: 'wash_95_perm_alt',
      label: 'Щадящая до 95 °C (вариант 2)',
      hint: 'Альтернативная пиктограмма',
      group: 'wash',
      iconUrl: FT('wh-washing-95deg-permanent-press-alt.jpg'),
    },
    {
      id: 'wash_forbidden',
      label: 'Стирка запрещена',
      hint: 'Не мочить; химчистка может быть разрешена',
      group: 'wash',
      iconUrl: FT('wh-washing-not-allowed.jpg'),
    },

    /* ——— Отбеливание (треугольник) ——— */
    {
      id: 'bleach_allow',
      label: 'Отбеливание разрешено',
      hint: 'Любые отбеливатели по инструкции',
      group: 'bleach',
      iconUrl: FT('wh-bleaching.jpg'),
    },
    {
      id: 'bleach_non_chlorine',
      label: 'Только без хлора',
      hint: 'Кислородные / без хлора',
      group: 'bleach',
      iconUrl: FT('wh-bleaching-non-chlorine.jpg'),
    },
    {
      id: 'bleach_no',
      label: 'Отбеливание запрещено',
      hint: 'Не использовать отбеливающие средства',
      group: 'bleach',
      iconUrl: FT('wh-bleaching-not-allowed.jpg'),
    },

    /* ——— Сушка (квадрат) ——— */
    {
      id: 'dry_tumble_normal',
      label: 'Барабан: обычный режим',
      hint: 'Сушка/отжим в барабане',
      group: 'tumble',
      iconUrl: FT('wh-drying-tumble.jpg'),
    },
    {
      id: 'dry_tumble_low',
      label: 'Барабан: низкий нагрев',
      hint: 'До ~40 °C',
      group: 'tumble',
      iconUrl: FT('wh-drying-tumble-low-heat.jpg'),
    },
    {
      id: 'dry_tumble_low_perm',
      label: 'Барабан: деликат, низкий нагрев',
      hint: 'Щадящая сушка до ~40 °C',
      group: 'tumble',
      iconUrl: FT('wh-drying-tumble-low-heat-permanent-press.jpg'),
    },
    {
      id: 'dry_tumble_low_extra',
      label: 'Барабан: особо деликат, низкий нагрев',
      hint: 'Особо щадящая до ~40 °C',
      group: 'tumble',
      iconUrl: FT('wh-drying-tumble-low-heat-extra-care.jpg'),
    },
    {
      id: 'dry_tumble_med',
      label: 'Барабан: средний нагрев',
      hint: 'До ~60 °C',
      group: 'tumble',
      iconUrl: FT('wh-drying-tumble-medium-heat.jpg'),
    },
    {
      id: 'dry_tumble_med_perm',
      label: 'Барабан: деликат, средний нагрев',
      hint: 'Щадящая до ~60 °C',
      group: 'tumble',
      iconUrl: FT('wh-drying-tumble-medium-heat-permanent-press.jpg'),
    },
    {
      id: 'dry_tumble_high',
      label: 'Барабан: высокий нагрев',
      hint: 'До ~80 °C',
      group: 'tumble',
      iconUrl: FT('wh-drying-tumble-high-heat.jpg'),
    },
    {
      id: 'dry_tumble_no_heat',
      label: 'Барабан: без нагрева (обдув)',
      hint: 'Холодный воздух',
      group: 'tumble',
      iconUrl: FT('wh-drying-tumble-no-heat.jpg'),
    },
    {
      id: 'dry_line',
      label: 'Сушка вертикально (на линии)',
      hint: 'Барабан запрещён',
      group: 'tumble',
      iconUrl: FT('wh-drying-line-dry.jpg'),
    },
    {
      id: 'dry_shade',
      label: 'Сушка в тени',
      hint: 'Без прямых лучей',
      group: 'tumble',
      iconUrl: FT('wh-drying-dry-shade.jpg'),
    },
    {
      id: 'dry_line_shade',
      label: 'Вертикально, в тени',
      hint: 'Барабан запрещён, тень',
      group: 'tumble',
      iconUrl: FT('wh-drying-line-dry-shade.jpg'),
    },
    {
      id: 'dry_flat',
      label: 'Сушка горизонтально',
      hint: 'На плоскости',
      group: 'tumble',
      iconUrl: FT('wh-drying-flat-dry.jpg'),
    },
    {
      id: 'dry_flat_shade',
      label: 'Горизонтально, в тени',
      hint: 'Плоскость + тень',
      group: 'tumble',
      iconUrl: FT('wh-drying-flat-dry-shade.jpg'),
    },
    {
      id: 'dry_drip',
      label: 'Капельная сушка (без отжима)',
      hint: 'Подвес без отжима',
      group: 'tumble',
      iconUrl: FT('wh-drying-drip-dry.jpg'),
    },
    {
      id: 'dry_drip_shade',
      label: 'Капельная сушка в тени',
      hint: 'Без отжима, тень',
      group: 'tumble',
      iconUrl: FT('wh-drying-drip-dry-shade.jpg'),
    },
    {
      id: 'tumble_no',
      label: 'Барабанная сушка запрещена',
      hint: 'Отжим в машине недопустим',
      group: 'tumble',
      iconUrl: FT('wh-drying-tumble-not-allowed.jpg'),
    },
    {
      id: 'tumble_low',
      label: 'Щадящая барабанная сушка',
      hint: 'Синоним низкого нагрева в барабане',
      group: 'tumble',
      iconUrl: FT('wh-drying-tumble-low-heat-permanent-press.jpg'),
    },

    /* ——— Отжим ——— */
    {
      id: 'wring_not_allowed',
      label: 'Не скручивать / лёгкий отжим',
      hint: 'Без перекручивания',
      group: 'wring',
      iconUrl: FT('wh-wringing-not-allowed.jpg'),
    },

    /* ——— Глажка (утюг) ——— */
    {
      id: 'iron_any',
      label: 'Глажка с паром или без',
      hint: 'Любая допустимая t° по утюгу',
      group: 'iron',
      iconUrl: FT('wh-ironing.jpg'),
    },
    {
      id: 'iron_low',
      label: 'Глажка низкая (~110 °C)',
      hint: 'Одна точка',
      group: 'iron',
      iconUrl: FT('wh-ironing-low.jpg'),
    },
    {
      id: 'iron_med',
      label: 'Глажка средняя (~150 °C)',
      hint: 'Две точки',
      group: 'iron',
      iconUrl: FT('wh-ironing-medium.jpg'),
    },
    {
      id: 'iron_high',
      label: 'Глажка высокая (~200 °C)',
      hint: 'Три точки',
      group: 'iron',
      iconUrl: FT('wh-ironing-high.jpg'),
    },
    {
      id: 'iron_no_steam',
      label: 'Глажка без пара',
      hint: 'Пар запрещён',
      group: 'iron',
      iconUrl: FT('wh-ironing-steam-not-allowed.jpg'),
    },
    {
      id: 'iron_no',
      label: 'Глажка запрещена',
      hint: 'Не гладить и не отпаривать',
      group: 'iron',
      iconUrl: FT('wh-ironing-not-allowed.jpg'),
    },

    /* ——— Проф. уход / химчистка (круг) ——— */
    {
      id: 'dry_clean',
      label: 'Сухая чистка A',
      hint: 'Любые органические растворители (A)',
      group: 'professional',
      iconUrl: FT('wh-drycleaning-a.jpg'),
    },
    {
      id: 'dry_clean_p',
      label: 'Сухая чистка P',
      hint: 'Тетрахлорэтилен и перечень F',
      group: 'professional',
      iconUrl: FT('wh-drycleaning-p.jpg'),
    },
    {
      id: 'dry_clean_p_gentle',
      label: 'Щадящая сухая чистка P',
      hint: 'Щадящий режим P',
      group: 'professional',
      iconUrl: FT('wh-drycleaning-p-2.jpg'),
    },
    {
      id: 'dry_clean_f',
      label: 'Сухая чистка F',
      hint: 'Углеводороды и перечень',
      group: 'professional',
      iconUrl: FT('wh-drycleaning-f.jpg'),
    },
    {
      id: 'dry_clean_f_gentle',
      label: 'Щадящая сухая чистка F',
      hint: 'Щадящий режим F',
      group: 'professional',
      iconUrl: FT('wh-drycleaning-f-2.jpg'),
    },
    {
      id: 'wet_clean',
      label: 'Проф. мокрая чистка W',
      hint: 'Аквачистка IEC 456',
      group: 'professional',
      iconUrl: FT('wh-drycleaning-w.jpg'),
    },
    {
      id: 'wet_clean_gentle',
      label: 'Щадящая мокрая чистка W',
      hint: 'Ограничение сушки и механики',
      group: 'professional',
      iconUrl: FT('wh-drycleaning-w-2.jpg'),
    },
    {
      id: 'wet_clean_extra',
      label: 'Особо деликатная мокрая W',
      hint: 'Минимальная усадка',
      group: 'professional',
      iconUrl: FT('wh-drycleaning-w-3.jpg'),
    },
    {
      id: 'prof_short_cycle',
      label: 'Сухая чистка: короткий цикл',
      hint: 'С буквой в круге',
      group: 'professional',
      iconUrl: FT('wh-drycleaning-short-cycle.jpg'),
    },
    {
      id: 'prof_reduced_moisture',
      label: 'Сухая чистка: пониженная влажность',
      hint: 'С буквой в круге',
      group: 'professional',
      iconUrl: FT('wh-drycleaning-reduced-moisture.jpg'),
    },
    {
      id: 'prof_low_heat',
      label: 'Сухая чистка: низкий нагрев',
      hint: 'С буквой в круге',
      group: 'professional',
      iconUrl: FT('wh-drycleaning-low-heat.jpg'),
    },
    {
      id: 'prof_no_steam',
      label: 'Сухая чистка: без отпаривания',
      hint: 'С буквой в круге',
      group: 'professional',
      iconUrl: FT('wh-drycleaning-no-steam.jpg'),
    },
    {
      id: 'prof_forbidden',
      label: 'Химчистка запрещена',
      hint: 'Растворители нельзя',
      group: 'professional',
      iconUrl: FT('wh-drycleaning-not-allowed.jpg'),
    },
    {
      id: 'prof_wetclean_forbidden',
      label: 'Мокрая проф. чистка запрещена',
      hint: 'W-процесс недопустим',
      group: 'professional',
      iconUrl: FT('wh-drycleaning-wetclean-not-allowed.jpg'),
    },
  ];

function careSymbolMockupAbbrFor(c: Workshop2CompositionLabelCareSymbolCatalogEntry): string {
  const deg = c.label.match(/(\d+)\s*°/);
  if (c.group === 'wash') {
    if (c.id === 'wash_machine_normal') return 'Авто';
    if (c.id === 'wash_forbidden') return 'Ст×';
    if (deg) {
      const base = `${deg[1]}°`;
      if (c.id.includes('perm')) return `${base}щ`;
      if (c.id.includes('extra')) return `${base}д`;
      if (c.id.includes('hand')) return `${base}р`;
      if (c.id.includes('_alt')) return `${base}′`;
      return base;
    }
    return c.label.slice(0, 8);
  }
  if (c.group === 'bleach') {
    if (c.id === 'bleach_allow') return 'Отб+';
    if (c.id === 'bleach_non_chlorine') return 'БезCl';
    if (c.id === 'bleach_no') return 'Отб×';
  }
  if (c.group === 'tumble') {
    if (c.id === 'tumble_no') return 'Бар×';
    if (c.id === 'tumble_low') return 'Барщ';
    if (c.id.startsWith('dry_tumble_')) return c.id.replace('dry_tumble_', 'б').slice(0, 6);
    if (c.id.startsWith('dry_')) return c.id.replace('dry_', '').slice(0, 7);
  }
  if (c.group === 'wring') return 'скр×';
  if (c.group === 'iron') {
    if (c.id === 'iron_any') return 'Ут+';
    if (c.id === 'iron_low') return 'Ут·';
    if (c.id === 'iron_med') return 'Ут··';
    if (c.id === 'iron_high') return 'Ут···';
    if (c.id === 'iron_no_steam') return 'Утп×';
    if (c.id === 'iron_no') return 'Ут×';
  }
  if (c.group === 'professional') {
    if (c.id === 'dry_clean') return 'A';
    if (c.id === 'dry_clean_p') return 'P';
    if (c.id === 'dry_clean_p_gentle') return 'P₂';
    if (c.id === 'dry_clean_f') return 'F';
    if (c.id === 'dry_clean_f_gentle') return 'F₂';
    if (c.id === 'wet_clean') return 'W';
    if (c.id === 'wet_clean_gentle') return 'W₂';
    if (c.id === 'wet_clean_extra') return 'W₃';
    if (c.id.startsWith('prof_')) return c.id.replace('prof_', '').slice(0, 6);
  }
  return c.label.slice(0, 8);
}

/** Короткие подписи для черновика / полосы ухода (резерв, если не показываем растр). */
export const W2_COMPOSITION_LABEL_CARE_SYMBOL_MOCKUP_ABBR: Record<string, string> =
  Object.fromEntries(
    W2_COMPOSITION_LABEL_CARE_SYMBOL_CATALOG.map((c) => [c.id, careSymbolMockupAbbrFor(c)])
  );

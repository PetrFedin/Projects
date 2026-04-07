import type { SectionMeta } from '@/components/brand/SectionBlock';

export const PROFILE_SECTION_META: Record<string, SectionMeta> = {
  summary: {
    description: 'Полнота профиля и последние изменения.',
    purpose: 'Оценить готовность и активность.',
    functionality: ['Процент заполнения', 'Пульс изменений'],
    importance: 8,
  },
  tools: {
    description: 'Интеграции, подписка, команда, календарь, сообщения.',
    purpose: 'Связи и настройки.',
    functionality: ['1С, Ozon, CDEK', 'Подписка', 'Команда'],
    importance: 8,
  },
  tabs: {
    description: 'Бренд, юр. данные, сертификаты, Press Kit, коммерция.',
    purpose: 'Профиль бренда.',
    functionality: ['Бренд', 'Юридическое', 'Сертификаты', 'Press Kit', 'Коммерция'],
    importance: 10,
  },
};

export function formatHoursCompact(h: Record<string, string>): string {
  const days = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];
  const keys = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];
  const parts: string[] = [];
  let i = 0;
  while (i < 7) {
    const val = h[keys[i]];
    let j = i + 1;
    while (j < 7 && h[keys[j]] === val) j++;
    const range = j - i > 1 ? `${days[i]}–${days[j - 1]}` : days[i];
    parts.push(`${range}: ${val}`);
    i = j;
  }
  return parts.join(', ');
}

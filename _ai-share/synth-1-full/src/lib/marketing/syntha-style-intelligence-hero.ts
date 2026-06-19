/** Первый hero «Syntha · Интеллект стиля» — витрина и Platform Core hub. */
export const SYNTHA_STYLE_INTELLIGENCE_HERO = {
  title: 'Syntha',
  /** Обязательная фраза баннера — не скрывать на mobile и не удалять. */
  subtitle: 'ИНТЕЛЛЕКТ СТИЛЯ',
  description: 'Интеллектуальная цифровая платформа.',
  imageUrl: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?q=80&w=2000',
  imageAlt: 'Светло-коричневый пиджак — hero Syntha',
} as const;

/** Маркетинговый tagline hero — всегда на баннере. */
export const SYNTHA_STYLE_INTELLIGENCE_TAGLINE = SYNTHA_STYLE_INTELLIGENCE_HERO.subtitle;

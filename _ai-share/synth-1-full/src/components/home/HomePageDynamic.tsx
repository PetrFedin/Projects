'use client';

import { HomePageClient } from './HomePageClient';

/**
 * Главная: без внешнего `dynamic(..., ssr: false)` для всего дерева — иначе в dev легко
 * «вечная» надпись «Загрузка главной…», если чанк не подгрузился (ChunkLoadError / кэш / долгая сборка).
 * Тяжёлые секции по-прежнему лениво грузятся внутри `HomePageClient`.
 */
export function HomePageDynamic() {
  return <HomePageClient />;
}

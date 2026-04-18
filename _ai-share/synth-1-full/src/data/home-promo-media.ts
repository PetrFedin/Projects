/**
 * Статические URL промо-медиа для домашней витрины (демо; prod → CDN / DAM).
 * Вынесено из компонентов, чтобы не тащить бинарники в git.
 */
export const homePromoUrls = {
  /** Баннер блока «операционный радар» на home (RhythmSection). */
  rhythmOperationsBanner: 'https://picsum.photos/seed/syntha-rhythm-ops/1200/600',
  workplaceIndustrialBanner: 'https://picsum.photos/seed/syntha-workplace-industrial/1200/600',
  heroFashionFabricWide: 'https://picsum.photos/seed/syntha-hero-fabric/1200/600',
  dropCyberHoodie: 'https://picsum.photos/seed/syntha-drop-cyber-hoodie/800/1000',
  dropGhostParka: 'https://picsum.photos/seed/syntha-drop-ghost-parka/800/1000',
  dropZeroGSneakers: 'https://picsum.photos/seed/syntha-drop-zero-g/800/1000',
} as const;

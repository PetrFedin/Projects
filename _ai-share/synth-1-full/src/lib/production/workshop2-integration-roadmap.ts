'use client';

/** Страница настройки ERP/PLM/AI — единая точка для интеграций Workshop2. */
export const WORKSHOP2_INTEGRATIONS_SETUP_HREF = '/brand/integrations/erp-plm';

export type Workshop2RoadmapIntegrationId = 'illustrator' | '3d-viewer' | 'clo3d';

const ROADMAP_COPY: Record<Workshop2RoadmapIntegrationId, { title: string; description: string }> =
  {
    illustrator: {
      title: 'Adobe Illustrator',
      description:
        'Синхронизация .ai → скетчи в ТЗ запланирована. Настройте коннекторы на странице интеграций.',
    },
    '3d-viewer': {
      title: '3D Viewer',
      description:
        'Просмотр .glb / .zprj в браузере — в roadmap. Сейчас доступны вложения техпака и placeholder fit-3D.',
    },
    clo3d: {
      title: 'Clo3D / Browzwear',
      description:
        'Виртуальная примерка и расчёт расхода — интеграция в следующих релизах. См. настройки PLM.',
    },
  };

export function workshop2IntegrationRoadmapToast(id: Workshop2RoadmapIntegrationId): {
  title: string;
  description: string;
} {
  const base = ROADMAP_COPY[id];
  return {
    title: `${base.title}: интеграция в roadmap`,
    description: `${base.description} Подробнее: ${WORKSHOP2_INTEGRATIONS_SETUP_HREF}`,
  };
}

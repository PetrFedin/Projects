/**
 * Стратегии образов — конфигурация для LookBuilder
 */

import type { LookStrategy } from './types';

export const LOOK_STRATEGIES: LookStrategy[] = [
  {
    id: 'primary',
    label: 'Primary Look',
    biasTags: ['minimal', 'premium'],
    silhouetteRule: 'balanced',
  },
  {
    id: 'alt',
    label: 'Alt Look',
    biasTags: ['urban', 'techwear'],
    maxOverlapWithPrevious: 2,
    silhouetteRule: 'oversized',
  },
  {
    id: 'statement',
    label: 'Statement Look',
    biasTags: ['premium', 'city'],
    maxOverlapWithPrevious: 2,
    silhouetteRule: 'fitted',
  },
];

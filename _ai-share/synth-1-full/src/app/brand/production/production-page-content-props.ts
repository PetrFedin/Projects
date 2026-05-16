import type { ClassValue } from 'clsx';
import type { ApiDrop } from '@/components/brand/production/ProductionContextBar';

/**
 * Узкий контракт верхнего слоя `ProductionPageContent` (остальное уходит в `p` дочерним legacy-блокам).
 */
export type ProductionPageContentProps = Record<string, unknown> & {
  cn?: (...inputs: ClassValue[]) => string;
  activeTab?: string;
  setActiveTab?: (tab: string) => void;
  selectedCollectionIds?: string[];
  collections?: Array<{ id: string; name: string }>;
  filteredSkus?: unknown[];
  filteredProductionOrders?: unknown[];
  samplePendingCount?: number;
  slaOverdueCount?: number;
  contextBarBudgetRemainder?: number;
  filteredLosses?: unknown[];
  productionDocuments?: unknown[];
  apiDrops?: ApiDrop[];
};

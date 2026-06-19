import type { ProductionWipStage } from './production-wip-persistence.file';
import type { OrderTrackingShipment } from './order-tracking-persistence.file';

export type UnifiedOrderTracking = {
  wholesaleOrderId: string;
  productionOrderId?: string;
  wip?: {
    platform: 'aims360' | 'apparel_magic';
    poStage: ProductionWipStage;
    labelRu: string;
    steps: Array<{ id: string; labelRu: string; done: boolean }>;
    updatedAt: string;
  };
  shipment?: OrderTrackingShipment;
  deliveryWindow?: { label: string; estimatedDelivery?: string };
};

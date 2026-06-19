import 'server-only';

import { getPlatformCoreDemo, PLATFORM_CORE_DEMO } from '@/lib/platform-core-hub-matrix';
import { getWorkshop2B2bOrder } from '@/lib/server/workshop2-b2b-orders-repository';
import { getWorkshop2DevelopmentStatus } from '@/lib/server/workshop2-development-status';
import {
  isWorkshop2PostgresEnabled,
  probeWorkshop2PgReachable,
} from '@/lib/server/workshop2-pg-pool';

/** PG доступен и применены seed-скрипты demo SS27 (артикулы или demo B2B-заказ). */
export async function probePlatformCoreDemoSeeded(
  collectionId = PLATFORM_CORE_DEMO.collectionId
): Promise<boolean> {
  if (!isWorkshop2PostgresEnabled()) return false;
  if (!(await probeWorkshop2PgReachable())) return false;

  const demo = getPlatformCoreDemo(collectionId);
  const [devResult, orderResult] = await Promise.allSettled([
    getWorkshop2DevelopmentStatus(collectionId, demo.factoryId, { skipRangePlanner: true }),
    getWorkshop2B2bOrder(demo.demoOrderId),
  ]);
  const devStatus = devResult.status === 'fulfilled' ? devResult.value : null;
  const order = orderResult.status === 'fulfilled' ? orderResult.value : null;
  return (devStatus?.articleCount ?? 0) > 0 || order != null;
}

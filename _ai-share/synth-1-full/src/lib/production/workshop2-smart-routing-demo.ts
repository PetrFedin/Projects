/**
 * Demo-шаблоны умной маршрутизации отключены в production по умолчанию.
 */
export function isWorkshop2SmartRoutingDemoAllowed(env: NodeJS.ProcessEnv = process.env): boolean {
  if (env.NODE_ENV !== 'production') return true;
  const flag = env.WORKSHOP2_SMART_ROUTING_DEMO?.trim().toLowerCase();
  return flag === '1' || flag === 'true' || flag === 'yes';
}

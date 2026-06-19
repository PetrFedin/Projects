export type PlatformCoreB2bRegistrySseEvent =
  | { type: 'ping'; ts: string }
  | { type: 'registry_update'; ts: string; reason?: string };

export function formatPlatformCoreB2bRegistrySseData(
  event: PlatformCoreB2bRegistrySseEvent
): string {
  return `data: ${JSON.stringify(event)}\n\n`;
}

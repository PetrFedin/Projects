import 'server-only';
import { EventEmitter } from 'node:events';

export type Workshop2ReferencesRealtimeEvent =
  | { type: 'ping'; ts: string }
  | { type: 'REFERENCES_INVALIDATED'; scope?: string; ts: string };

class Workshop2ReferencesRealtimeHub {
  private emitter = new EventEmitter();

  constructor() {
    this.emitter.setMaxListeners(100);
  }

  subscribe(listener: (event: Workshop2ReferencesRealtimeEvent) => void): () => void {
    this.emitter.on('broadcast', listener);
    return () => this.emitter.off('broadcast', listener);
  }

  publishInvalidate(scope?: string): void {
    this.emitter.emit('broadcast', {
      type: 'REFERENCES_INVALIDATED',
      scope,
      ts: new Date().toISOString(),
    } satisfies Workshop2ReferencesRealtimeEvent);
  }
}

declare global {
  // eslint-disable-next-line no-var
  var __workshop2ReferencesRealtimeHub: Workshop2ReferencesRealtimeHub | undefined;
}

export function getWorkshop2ReferencesRealtimeHub(): Workshop2ReferencesRealtimeHub {
  if (!globalThis.__workshop2ReferencesRealtimeHub) {
    globalThis.__workshop2ReferencesRealtimeHub = new Workshop2ReferencesRealtimeHub();
  }
  return globalThis.__workshop2ReferencesRealtimeHub;
}

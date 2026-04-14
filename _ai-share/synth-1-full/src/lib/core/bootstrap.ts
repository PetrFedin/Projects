import { CognitiveNervousSystem } from './nervous-system';

/**
 * [Phase 22 — System Bootstrap]
 * Точка входа для инициализации всех фоновых процессов и слушателей событий.
 * Вызывается при старте Node из `src/instrumentation.ts` (`register`).
 */
export function bootstrapEnterpriseEcosystem() {
  console.log('[Bootstrap] Starting Enterprise Ecosystem...');
  
  // Инициализация центральной нервной системы (Saga Manager)
  CognitiveNervousSystem.initialize();
  
  console.log('[Bootstrap] Enterprise Ecosystem is fully operational.');
}

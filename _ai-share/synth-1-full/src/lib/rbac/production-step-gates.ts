/**
 * RBAC по шагам производства / B2B (заготовка).
 * Сейчас все шаги разрешены для демо; заменить проверкой ролей и политик при подключении API.
 */

import type { UserRole } from '@/lib/types';

export type ProductionFlowGate = {
  stepId: string;
  canView: boolean;
  canEditStatus: boolean;
  canEditOutputs: boolean;
};

/** Заглушка: полный доступ для всех ролей до появления бэкенда политик. */
export function getProductionStepGate(_role: UserRole | undefined, _stepId: string): ProductionFlowGate {
  return {
    stepId: _stepId,
    canView: true,
    canEditStatus: true,
    canEditOutputs: true,
  };
}

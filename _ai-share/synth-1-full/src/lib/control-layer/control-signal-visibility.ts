import { ControlOutput } from '../control/control-aggregator';

/**
 * [Phase 2 — Minimal notification / subscription model]
 * Канон: documentation/domain-model/notification-subscription.md.
 * Логика фильтрации и видимости сигналов управления.
 */

export interface ControlSignalPreference {
  entityType: 'order' | 'article' | 'commitment';
  suppressedCodes: string[]; // Список ReasonCode, которые пользователь скрыл
  muteAll: boolean;
}

/**
 * Проверяет, является ли сигнал управления кандидатом на уведомление.
 * §3: "notifyable" — первичный UI строки всегда остается, скрываются только augmentations.
 */
export function isNotifyableControlCandidate(params: {
  output: ControlOutput;
  prefs: ControlSignalPreference;
}): boolean {
  const { output, prefs } = params;

  // 1. Если все уведомления для этого типа сущности выключены
  if (prefs.muteAll) return false;

  // 2. Если статус 'healthy', уведомлять не о чем (кроме информационных)
  if (output.status === 'healthy' && output.risks.length === 0) return false;

  // 3. Проверка подавленных кодов (suppressedCodes)
  const hasActiveRisks = output.risks.some((r) => !prefs.suppressedCodes.includes(r.code));

  return hasActiveRisks || output.status === 'blocked';
}

/**
 * Фильтрует риски в ControlOutput на основе предпочтений пользователя.
 * Mute / suppression = только видимость; доменная правда не меняется.
 */
export function filterVisibleRisks(
  output: ControlOutput,
  prefs: ControlSignalPreference
): ControlOutput['risks'] {
  if (prefs.muteAll) return [];
  return output.risks.filter((r) => !prefs.suppressedCodes.includes(r.code));
}

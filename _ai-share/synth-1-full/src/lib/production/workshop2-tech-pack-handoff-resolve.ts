/**
 * Выбор строки передачи tech pack для UI и readiness.
 *
 * Используется: `calculateWorkshopTzSectionCompletion` (вкладка «Задание»),
 * `Workshop2Phase1DossierPanel` / чеклист «Отправка», `summarizeDossier` control points
 * (`dossier-readiness-engine`) — одна семантика: если последняя запись в `techPackFactoryHandoffs`
 * ещё без пары «бренд передал + цех принял», для «готово» берём последнюю **полную** запись.
 */
import type { Workshop2TechPackFactoryHandoff } from './workshop2-dossier-phase1.types';

export function resolveWorkshop2TechPackHandoffChecklistRow(
  handoffs: readonly Workshop2TechPackFactoryHandoff[] | undefined
): Workshop2TechPackFactoryHandoff | undefined {
  const list = handoffs ?? [];
  if (list.length === 0) return undefined;
  const lastRow = list[list.length - 1]!;
  if (lastRow.brandDispatchedAt && lastRow.factoryReceivedAt) return lastRow;
  const lastCompleted = [...list]
    .reverse()
    .find((h) => Boolean(h.brandDispatchedAt) && Boolean(h.factoryReceivedAt));
  return lastCompleted ?? lastRow;
}

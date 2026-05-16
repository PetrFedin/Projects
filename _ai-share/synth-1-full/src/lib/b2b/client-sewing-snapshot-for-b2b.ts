/**
 * Снимок client sewing-intent при сабмите B2B (матрица, working order, экспорт), если байер
 * заранее заходил в `/client/sewing-patterns` и оставил валидный `synth.sewingPattern.intent.v1`.
 *
 * @example
 * const snap = getClientSewingSnapshotForB2B();
 * const payload = { ...lines, ...(snap && { clientSewingIntentSnapshot: snap }) };
 */
export { getSewingIntentForOrder as getClientSewingSnapshotForB2B } from '@/lib/client/sewing-order-bridge';
export type { OrderSewingIntentSnapshot } from '@/lib/types';

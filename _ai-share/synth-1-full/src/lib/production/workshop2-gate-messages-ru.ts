/**
 * Wave 14 RU: коды gate → человекочитаемые сообщения (sample-order 409, handoff UI).
 */
import type { Workshop2ApiGateCheck } from '@/lib/production/workshop2-api-gate-messages';

/** Канон русских подписей для id gate (дополняет messageRu с сервера). */
export const WORKSHOP2_GATE_REASON_RU: Record<string, string> = {
  'vault.files.min': 'В Vault недостаточно файлов с storage_path для handoff.',
  'tz.overall.min': 'Готовность ТЗ ниже порога для заказа образца.',
  'construction.pom.empty': 'Табель мер (POM) пуст — заполните шаг «Мерки».',
  'cad.missing': 'Нет CAD/лекал в vault или tech pack.',
  'showroom.wholesale.invalid': 'Шоурум: укажите оптовую цену > 0 перед публикацией.',
  'showroom.msrp.invalid': 'Шоурум: укажите MSRP > 0 перед публикацией.',
  'showroom.moq.invalid': 'Шоурум: MOQ должен быть > 0.',
  'showroom.window.missing': 'Шоурум: укажите даты окна предзаказа (начало и конец).',
  'showroom.window.order': 'Шоурум: дата начала не может быть позже даты окончания.',
  'supply.lab_dip.not_approved': 'Lab dip не согласован — дождитесь approve в снабжении.',
  handoff_not_ready: 'Handoff не готов — закройте блокеры ТЗ и vault.',
  lab_dip_pending: 'Lab dip в ожидании — заказ образца временно заблокирован.',
};

export function mapWorkshop2GateReasonCodeToRu(code: string | undefined): string | undefined {
  if (!code?.trim()) return undefined;
  const key = code.trim();
  return WORKSHOP2_GATE_REASON_RU[key];
}

/** Подставляет русский текст, если messageRu выглядит как сырой код/id. */
export function localizeWorkshop2GateCheck(check: Workshop2ApiGateCheck): Workshop2ApiGateCheck {
  const mapped = mapWorkshop2GateReasonCodeToRu(check.id);
  const raw = check.messageRu?.trim() ?? '';
  const looksLikeCode =
    !raw ||
    raw === check.id ||
    /^[a-z0-9_.-]+$/i.test(raw) ||
    raw === 'handoff_not_ready' ||
    raw === 'lab_dip_pending';
  if (mapped && looksLikeCode) {
    return { ...check, messageRu: mapped };
  }
  return check;
}

export function localizeWorkshop2GateChecks(
  checks: Workshop2ApiGateCheck[] | undefined
): Workshop2ApiGateCheck[] {
  return (checks ?? []).map(localizeWorkshop2GateCheck);
}

/**
 * Gold sample: dossier status + связь intake и sample-order.
 */
import type { Workshop2GoldSampleStatus } from '@/lib/production/workshop2-dossier-phase1.types';

export type Workshop2GoldSampleSummary = {
  status: Workshop2GoldSampleStatus['status'] | 'unset';
  approved: boolean;
  linkedSampleOrderId?: string;
  persistsViaPut: boolean;
  state: 'unset' | 'pending' | 'approved' | 'rejected';
  hintRu?: string;
};

export function summarizeWorkshop2GoldSampleStatus(input: {
  gold?: Workshop2GoldSampleStatus | null;
  hasActiveSampleOrder: boolean;
  /** PUT dossier при утверждении эталона. */
  persistsViaPut?: boolean;
}): Workshop2GoldSampleSummary {
  const status = input.gold?.status ?? 'unset';
  const approved = status === 'approved';

  let state: Workshop2GoldSampleSummary['state'] = 'unset';
  if (status === 'approved') state = 'approved';
  else if (status === 'rejected') state = 'rejected';
  else if (status !== 'unset') state = 'pending';

  let hintRu: string | undefined;
  if (state === 'unset') {
    hintRu =
      'Эталон не задан — утвердите после примерки; Sample Intake блокирует склад без approved.';
  } else if (state === 'approved') {
    hintRu = `Эталон утверждён${input.gold?.approvedAt ? ` (${input.gold.approvedAt.slice(0, 10)})` : ''}; intake gate открыт.`;
  } else if (state === 'rejected') {
    hintRu = 'Эталон отклонён — повторная примерка перед intake.';
  } else if (!input.hasActiveSampleOrder) {
    hintRu = 'Эталон в ожидании — создайте заказ образца для трассировки linkedSampleOrderId.';
  } else {
    hintRu = 'Утвердите эталон после QC/примерки — без этого received на склад блокируется intake.';
  }

  return {
    status,
    approved,
    linkedSampleOrderId: input.gold?.linkedSampleOrderId,
    persistsViaPut: input.persistsViaPut ?? true,
    state,
    hintRu,
  };
}

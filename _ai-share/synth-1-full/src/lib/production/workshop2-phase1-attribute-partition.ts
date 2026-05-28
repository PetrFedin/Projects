import type {
  Workshop2Phase1AttributeAssignment,
  Workshop2Phase1AttributeValue,
} from '@/lib/production/workshop2-dossier-phase1.types';

export function partitionHandbookAndFree(a: Workshop2Phase1AttributeAssignment | undefined) {
  const hbs =
    a?.values.filter(
      (v): v is Workshop2Phase1AttributeValue & { parameterId: string } =>
        v.valueSource === 'handbook_parameter' && !!v.parameterId
    ) ?? [];
  const ft = a?.values.find((v) => v.valueSource === 'free_text');
  return { hbs, ft };
}

export function partitionValues(a: Workshop2Phase1AttributeAssignment | undefined) {
  const { hbs, ft } = partitionHandbookAndFree(a);
  return { hb: hbs[0], ft };
}

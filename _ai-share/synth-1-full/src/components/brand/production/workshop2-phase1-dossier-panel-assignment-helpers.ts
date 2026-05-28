import type { AttributeCatalogAttribute } from '@/lib/production/attribute-catalog.types';
import type {
  Workshop2Phase1AttributeAssignment,
  Workshop2Phase1AttributeValue,
} from '@/lib/production/workshop2-dossier-phase1.types';

export function canonicalPhaseAssignmentFilled(
  assignment: Workshop2Phase1AttributeAssignment | undefined,
  attr: AttributeCatalogAttribute
): boolean {
  if (!assignment || assignment.kind !== 'canonical') return false;
  const hb = assignment.values.filter((v) => v.valueSource === 'handbook_parameter').length;
  const hasFree = assignment.values.some(
    (v) => v.valueSource === 'free_text' && (v.text?.trim()?.length ?? 0) > 0
  );
  if (attr.type === 'text' && attr.parameters.length === 0) {
    return hasFree;
  }
  if (attr.allowMultipleDistinct || attr.type === 'multiselect') {
    return hb > 0 || (!!attr.allowFreeText && hasFree);
  }
  return hb > 0 || (!!attr.allowFreeText && hasFree);
}

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

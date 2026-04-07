import type { Product } from '@/lib/types';
import { compositionToPlainText, parseComposition } from './parse-composition';
import { resolveCareSymbolIds } from './care-symbols';

/** Конфликт текста состава и пиктограмм ухода (QA PIM до публикации). */
export function detectCareCompositionFriction(product: Product): string | null {
  const comp = compositionToPlainText(parseComposition(product));
  const text = `${comp} ${product.material ?? ''} ${product.description ?? ''}`.slice(0, 2000);
  const dryCleanMention =
    /сух(ая|ую)?\s+чистк|химчистк|только\s+химчист|dry\s*clean|professional\s*clean|do\s+not\s+wash|не\s+стирать/i.test(
      text,
    );
  const handWashOnly = /только\s+ручн|hand\s*wash\s*only/i.test(text);
  const ids = resolveCareSymbolIds(product);
  const hasMachineWash = ids.some((id) => id.startsWith('wash_'));
  if (dryCleanMention && hasMachineWash) {
    return 'В тексте указана химчистка / запрет стирки, но среди пиктограмм есть машинная стирка — проверьте tech pack и PIM.';
  }
  if (handWashOnly && ids.includes('wash_40')) {
    return 'Указана только ручная стирка, но выбрана пиктограмма 40 °C — согласуйте данные.';
  }
  return null;
}

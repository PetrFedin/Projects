'use client';

import { Badge } from '@/components/ui/badge';

/** Краткое позиционирование раздела разработки коллекции (не серии и не заказов). */
export function Workshop2DevelopmentIntro() {
  return (
    <div
      className="border-border-subtle bg-bg-surface2/50 rounded-lg border px-3 py-2.5 text-[12px] leading-snug"
      role="region"
      aria-label="О разделе разработки коллекции"
    >
      <p className="text-text-primary font-semibold">Разработка: от артикула до образца и шоурума</p>
      <p className="text-text-muted mt-1 text-[11px]">
        Заведите артикул и пройдите ТЗ и согласования до эталона. В списке коллекции мини-шкала этапов идёт слева
        направо: сначала разработка и ТЗ, затем сэмплы и выпуск по каталогу. Серия, крупные объёмы и опт — в поле
        цеха и в B2B, не в этом разделе.
      </p>
      <div className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1.5">
        <span className="text-text-muted text-[10px] font-medium">На шкале коллекции:</span>
        <Badge
          variant="outline"
          className="h-5 border-indigo-200 bg-indigo-50 px-1.5 text-[9px] font-bold uppercase tracking-wide text-indigo-950"
        >
          Разработка
        </Badge>
        <span className="text-text-muted text-[10px]" aria-hidden>
          →
        </span>
        <Badge
          variant="outline"
          className="h-5 border-teal-200 bg-teal-50 px-1.5 text-[9px] font-bold uppercase tracking-wide text-teal-950"
        >
          Сэмплы
        </Badge>
      </div>
      <p className="text-text-muted mt-2 text-[10px] leading-snug">
        В полной матрице коллекции между ТЗ и снабжением есть этап согласования всех сторон (gate-all-stakeholders) —
        здесь он не вынесен отдельной вкладкой: статусы и подписи закрывают это внутри «Обзор» и «ТЗ». Правая часть
        шкалы (от якоря supply-path в каталоге, далее samples и выпуск) соответствует вкладкам «Снабжение» и далее в
        карточке артикула.
      </p>
    </div>
  );
}

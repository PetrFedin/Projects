'use client';

import * as LucideIcons from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { cn } from '@/lib/utils';
import { useState } from 'react';

export function Workshop2CompositionLabelIsoGuidanceCollapsible({
  className,
}: {
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  return (
    <Collapsible
      open={open}
      onOpenChange={setOpen}
      className={cn(
        'rounded-lg border border-dashed border-slate-300/80 bg-slate-50/60',
        className
      )}
    >
      <CollapsibleTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="text-text-primary flex min-h-9 w-full justify-between gap-2 rounded-lg px-3 py-2 text-left text-xs font-normal hover:bg-white/80"
        >
          <span className="flex items-center gap-2">
            <LucideIcons.BookOpen className="h-3.5 w-3.5 shrink-0 opacity-70" aria-hidden />
            Составник: обязательные сведения и ISO 3758-2014 (кратко)
          </span>
          <LucideIcons.ChevronDown
            className={cn('h-4 w-4 shrink-0 transition-transform', open && 'rotate-180')}
            aria-hidden
          />
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent className="text-text-secondary space-y-2 border-t border-slate-200/80 px-3 pb-3 pt-2 text-[10px] leading-snug">
        <p className="text-text-primary font-semibold">На бирке обычно</p>
        <ul className="list-disc space-y-0.5 pl-4">
          <li>Состав тканей в % (например, 100% хлопок).</li>
          <li>Символы ухода: стирка, сушка, глажка, отбеливание, проф. чистка.</li>
          <li>Производитель: страна, юр. адрес, наименование.</li>
          <li>Размер изделия (международная/национальная шкала).</li>
          <li>Дополнительно: артикул, товарный знак, дата производства.</li>
        </ul>
        <p className="text-text-primary font-semibold">Требования</p>
        <ul className="list-disc space-y-0.5 pl-4">
          <li>Стойкость текста после стирок.</li>
          <li>Полотно: сатин, нейлон, полиэстер, хлопок и др.</li>
          <li>Размещение: чаще вшивная бирка во внутренний шов.</li>
        </ul>
        <p className="text-text-primary font-semibold">Порядок групп ISO 3758</p>
        <ol className="list-decimal space-y-0.5 pl-4">
          <li>
            <span className="text-text-primary font-medium">Стирка</span> — цифры в тазу (30/40/60
            °C), рука, одна/две черты под тазом (щадящий/деликатный).
          </li>
          <li>
            <span className="text-text-primary font-medium">Отбеливание</span> — треугольник:
            пустой, с линиями (кислородные), перечёркнутый (запрет).
          </li>
          <li>
            <span className="text-text-primary font-medium">Сушка</span> — квадрат с кругом, точки
            для t° барабана; линии для естественной сушки.
          </li>
          <li>
            <span className="text-text-primary font-medium">Глажение</span> — утюг с точками (• / ••
            / •••) или перечёркнутый.
          </li>
          <li>
            <span className="text-text-primary font-medium">Проф. уход</span> — круг с P/F/W или
            перечёркнутый круг.
          </li>
        </ol>
        <p className="text-text-muted italic">
          Перечёркнутый символ — полный запрет операции. На макете ниже можно отметить нужные знаки
          и сверить с ТЗ.
        </p>
      </CollapsibleContent>
    </Collapsible>
  );
}

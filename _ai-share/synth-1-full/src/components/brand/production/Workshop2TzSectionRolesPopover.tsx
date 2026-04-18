'use client';

import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import * as LucideIcons from 'lucide-react';

export type Workshop2TzSectionRolesKey = 'material' | 'construction' | 'passport';

const SECTION_COPY: Record<
  Workshop2TzSectionRolesKey,
  { designer: string; manager: string; technologist: string }
> = {
  passport: {
    designer:
      'Закрепите аудиторию и L3 до визуала: от ветки зависят атрибуты и скетч; карточка модели должна совпадать с замыслом.',
    manager:
      'SKU, название, даты и MOQ — якорь для SLA и переписки; после подписи ТЗ согласуйте существенные правки паспорта.',
    technologist:
      'Паспорт задаёт контекст изделия; исполнимость проверяется в материалах, мерках и конструкции после закрытия стартовых полей.',
  },
  material: {
    designer:
      'Состав и ощущение материала должны совпадать с замыслом и рефами; при смене ткани обновите визуал и описание. Упаковка, маркировка и штрихкод ведутся в этой же вкладке.',
    manager:
      'Сроки снабжения и риски по MOQ завязаны на зафиксированный состав; требования маркетплейсов и отгрузки — на штрихкод и маркировку здесь же.',
    technologist:
      'Проверьте исполнимость BOM, care-label и состав по закону; фурнитура и носители размеров согласуйте с фактическим изделием.',
  },
  construction: {
    designer:
      'Узлы и детали должны отражать эскиз и канон; табель мер и базовый размер — здесь же (одна вкладка с конструкцией).',
    manager:
      'Одна таблица мерок на SKU для fit и ОТК; объём изменений по конструкции влияет на сроки — фиксируйте до подписи ТЗ.',
    technologist:
      'Полнота мерок и шкала — основа для лекал; последовательность операций и узлы — то, что цех исполняет буквально.',
  },
};

/** Полный набор ролей для вкладки «Конструкция» (узлы каталога + мерки + согласование со скетчем). */
const CONSTRUCTION_SECTION_ROLE_BLOCKS: readonly {
  title: string;
  titleClass: string;
  body: string;
}[] = [
  {
    title: 'Бренд-дизайнер',
    titleClass: 'text-text-primary',
    body: 'Узлы, длины и посадка в полях каталога должны совпадать с эскизом и каноном; базовый размер и мерки не противоречат заявленному силуэту и рефам.',
  },
  {
    title: 'Технолог / конструктор',
    titleClass: 'text-teal-900',
    body: 'Шкала и полнота мерок — основа лекал и контроля; узлы, швы и последовательность операций формулируйте так, чтобы цех исполнял без догадок. Tech pack — здесь же по смыслу.',
  },
  {
    title: 'Менеджер / продакт',
    titleClass: 'text-amber-900',
    body: 'Одна таблица мерок на SKU для сроков fit и ОТК; крупные правки конструкции двигают календарь — фиксируйте до подписи ТЗ и передачи в образец.',
  },
  {
    title: 'Снабжение / PD',
    titleClass: 'text-orange-950',
    body: 'Толщина слоёв, дублирование, фурнитура и расход сырья влияют на исполнимость узлов — сверяйте с mat, дельтой BOM и привязками меток скетча.',
  },
  {
    title: 'Производство / цех',
    titleClass: 'text-text-primary',
    body: 'Нужны однозначные узлы и ссылки на выгрузку ТК; вопросы к неполным полям закрываются до запуска раскроя — используйте блок выгрузки и подпись секции.',
  },
  {
    title: 'ОТК / качество',
    titleClass: 'text-rose-900',
    body: 'Табель мер и метки qc/construction на скетче задают приёмку серии; расхождения с визуалом фиксируйте до закрытия ТЗ.',
  },
  {
    title: 'Комплаенс / таможня',
    titleClass: 'text-accent-primary',
    body: 'Длина изделия, слои и вид узлов могут влиять на коды и декларации — держите согласованность с паспортом и материалами (в т.ч. маркировка и состав).',
  },
  {
    title: 'Мерч / e-com',
    titleClass: 'text-text-primary',
    body: 'Посадка на модели, размерная сетка на витрине и описания «как сидит» опираются на зафиксированные мерки и силуэт из этой вкладки.',
  },
];

export function Workshop2TzSectionRolesPopover({
  section,
  className,
}: {
  section: Workshop2TzSectionRolesKey;
  className?: string;
}) {
  const c = SECTION_COPY[section];

  if (section === 'construction') {
    return (
      <Popover>
        <PopoverTrigger asChild>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className={cn('h-7 gap-1 px-2 text-[10px]', className)}
            title="Кто включается в раздел «Конструкция» при сборке ТЗ"
          >
            <LucideIcons.Users className="h-3 w-3 shrink-0" aria-hidden />
            Роли
<<<<<<< HEAD
            <span className="tabular-nums text-slate-500">
=======
            <span className="text-text-secondary tabular-nums">
>>>>>>> recover/cabinet-wip-from-stash
              · {CONSTRUCTION_SECTION_ROLE_BLOCKS.length}
            </span>
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="max-h-[min(32rem,70vh)] w-[min(26rem,calc(100vw-1.5rem))] space-y-3 overflow-y-auto text-xs"
          align="end"
        >
<<<<<<< HEAD
          <p className="text-[10px] font-semibold leading-snug text-slate-700">
=======
          <p className="text-text-primary text-[10px] font-semibold leading-snug">
>>>>>>> recover/cabinet-wip-from-stash
            Конструкция — общий стол: поля узлов каталога, табель мер и согласование со скетчем.
            Ниже — типичные участники маршрута SKU и что для них важно в этой вкладке.
          </p>
          {CONSTRUCTION_SECTION_ROLE_BLOCKS.map((row) => (
            <div key={row.title}>
              <p className={cn('font-semibold', row.titleClass)}>{row.title}</p>
              <p className="text-text-secondary mt-1 leading-snug">{row.body}</p>
            </div>
          ))}
        </PopoverContent>
      </Popover>
    );
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className={cn('h-7 gap-1 px-2 text-[10px]', className)}
          title="Подсказки по ролям для этого раздела"
        >
          <LucideIcons.Users className="h-3 w-3 shrink-0" aria-hidden />
          Роли
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 space-y-3 text-xs" align="end">
        <div>
          <p className="text-text-primary font-semibold">Дизайнер / бренд</p>
          <p className="text-text-secondary mt-1 leading-snug">{c.designer}</p>
        </div>
        <div>
          <p className="font-semibold text-amber-900">Менеджер</p>
          <p className="text-text-secondary mt-1 leading-snug">{c.manager}</p>
        </div>
        <div>
          <p className="font-semibold text-teal-900">Технолог</p>
          <p className="text-text-secondary mt-1 leading-snug">{c.technologist}</p>
        </div>
      </PopoverContent>
    </Popover>
  );
}

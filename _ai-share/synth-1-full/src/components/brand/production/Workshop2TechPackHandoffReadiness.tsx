'use client';

export function Workshop2TechPackHandoffReadiness({
  handoffMarksUnlocked,
  brandDispatched,
  factoryReceived,
  selectedAttachmentsCount,
}: {
  handoffMarksUnlocked: boolean;
  brandDispatched: boolean;
  factoryReceived: boolean;
  selectedAttachmentsCount: number;
}) {
  const steps = [
    {
      id: 'sections',
      label: 'Секции подписаны',
      done: handoffMarksUnlocked,
    },
    {
      id: 'marks',
      label: 'Отметки «передано / получено»',
      done: brandDispatched && factoryReceived,
    },
    {
      id: 'attachments',
      label: `Выбраны вложения (${selectedAttachmentsCount})`,
      done: selectedAttachmentsCount > 0,
    },
  ];

  return (
    <div className="min-h-16 px-2 py-1.5">
      <p className="text-text-primary mb-1 text-[10px] font-semibold">Готовность передачи</p>
      <ul className="space-y-1">
        {steps.map((step) => (
          <li key={step.id} className="flex items-center gap-1.5 text-[10px]">
            <span
              className={
                step.done
                  ? 'inline-block h-1.5 w-1.5 rounded-full bg-emerald-500'
                  : 'inline-block h-1.5 w-1.5 rounded-full bg-amber-500'
              }
            />
            <span className={step.done ? 'text-emerald-800' : 'text-amber-900'}>{step.label}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

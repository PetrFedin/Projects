'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { MessageSquarePlus, CheckCircle2, XCircle } from 'lucide-react';
import { isPlatformCoreMode } from '@/lib/cabinet-core-mode';
import { hubCabinet } from '@/lib/platform-core-cabinet-chrome';
import { cn } from '@/lib/utils';

export type FactoryPin = {
  id: string;
  x: number;
  y: number;
  text: string;
  status: 'open' | 'resolved';
  by: string;
  at: string;
};

export function Workshop2InteractiveFactoryPortal({
  htmlContent,
  factoryPackHtml,
  articleId,
}: {
  htmlContent: string;
  factoryPackHtml?: string;
  articleId: string;
}) {
  const { toast } = useToast();
  const [docView, setDocView] = useState<'final-tz' | 'factory-pack'>('factory-pack');
  const [isPinMode, setIsPinMode] = useState(false);
  const [pins, setPins] = useState<FactoryPin[]>([]);
  const [status, setStatus] = useState<'pending' | 'rejected' | 'accepted'>('pending');
  const containerRef = useRef<HTMLDivElement>(null);

  // Временный черновик пина
  const [draftPin, setDraftPin] = useState<{ x: number; y: number } | null>(null);
  const [draftText, setDraftText] = useState('');

  const handleContainerClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isPinMode || !containerRef.current) return;

    // Если мы кликаем внутри уже открытого диалога черновика, игнорируем
    if ((e.target as HTMLElement).closest('.pin-draft-dialog')) return;

    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    setDraftPin({ x, y });
    setDraftText('');
  };

  const savePin = () => {
    if (!draftPin || !draftText.trim()) return;

    const newPin: FactoryPin = {
      id: Math.random().toString(36).slice(2, 10),
      x: draftPin.x,
      y: draftPin.y,
      text: draftText.trim(),
      status: 'open',
      by: 'Фабрика (Менеджер)',
      at: new Date().toISOString(),
    };

    setPins([...pins, newPin]);
    setDraftPin(null);
    setIsPinMode(false);

    window.dispatchEvent(
      new CustomEvent('factory-pin-added', { detail: { message: newPin.text } })
    );

    toast({
      title: 'Комментарий добавлен',
      description: 'Бренд получит уведомление о новом комментарии.',
    });
  };

  const acceptTz = () => {
    setStatus('accepted');
    toast({
      title: 'ТЗ принято',
      description: 'Статус изменен на «Принято в работу».',
      className: 'bg-emerald-50 border-emerald-200 text-emerald-900',
    });
  };

  const rejectTz = () => {
    setStatus('rejected');
    toast({
      title: 'Отклонено',
      description: 'ТЗ возвращено на доработку бренду.',
      variant: 'destructive',
    });
  };

  const displayHtml =
    docView === 'factory-pack' && factoryPackHtml ? factoryPackHtml : htmlContent;
  const coreMode = isPlatformCoreMode();

  return (
    <div
      className="min-w-0 w-full space-y-4 py-3 md:mx-auto md:max-w-5xl md:space-y-6 md:py-6"
      data-testid="factory-portal-panel"
    >
      <div
        className={cn(
          'rounded-xl border bg-white p-3 shadow-sm md:p-4',
          coreMode ? hubCabinet.workspaceStickyHead : 'sticky top-4 z-50'
        )}
      >
        <div className="flex min-w-0 flex-col gap-3 md:flex-row md:items-start md:justify-between">
          <div className="min-w-0">
            {coreMode ? (
              <p
                className="text-text-primary text-sm font-semibold leading-snug"
                data-testid="factory-portal-status"
              >
                Артикул: {articleId} · {pins.length} комментариев ·{' '}
                {docView === 'factory-pack' ? 'Factory pack · 6 листов' : 'Итоговое ТЗ'}
              </p>
            ) : (
              <>
                <h1 className="text-xl font-bold tracking-tight">Interactive Tech Pack</h1>
                <p className="text-text-secondary mt-1 text-sm">
                  Артикул: {articleId} · {pins.length} комментариев ·{' '}
                  {docView === 'factory-pack' ? 'Factory pack · 6 листов' : 'Итоговое ТЗ'}
                </p>
              </>
            )}
          </div>
          <div className="flex max-md:-mx-1 max-md:overflow-x-auto max-md:overscroll-x-contain max-md:pb-1 max-md:[-webkit-overflow-scrolling:touch] min-w-0 flex-wrap items-center gap-2 md:gap-3 max-md:flex-nowrap">
          {factoryPackHtml ? (
            <>
              <Button
                type="button"
                size="sm"
                variant={docView === 'factory-pack' ? 'default' : 'outline'}
                className="min-h-11 shrink-0 text-xs max-md:min-h-11"
                data-testid="factory-portal-view-factory-pack"
                onClick={() => setDocView('factory-pack')}
              >
                Factory pack
              </Button>
              <Button
                type="button"
                size="sm"
                variant={docView === 'final-tz' ? 'default' : 'outline'}
                className="min-h-11 shrink-0 text-xs max-md:min-h-11"
                data-testid="factory-portal-view-final-tz"
                onClick={() => setDocView('final-tz')}
              >
                Full TZ
              </Button>
              <div className="bg-border-default mx-1 hidden h-6 w-px shrink-0 sm:block" />
            </>
          ) : null}
          {status === 'pending' && (
            <Badge className="border-amber-200 bg-amber-100 text-amber-800">
              Ожидает согласования
            </Badge>
          )}
          {status === 'accepted' && (
            <Badge className="border-emerald-200 bg-emerald-100 text-emerald-800">
              <CheckCircle2 className="mr-1 h-3 w-3" /> Принято в работу
            </Badge>
          )}
          {status === 'rejected' && (
            <Badge className="border-rose-200 bg-rose-100 text-rose-800">
              <XCircle className="mr-1 h-3 w-3" /> Возвращено на доработку
            </Badge>
          )}

          <div className="bg-border-default mx-1 hidden h-6 w-px shrink-0 md:block" />

          <Button
            variant={isPinMode ? 'default' : 'outline'}
            onClick={() => {
              setIsPinMode(!isPinMode);
              setDraftPin(null);
            }}
            className={cn(
              'min-h-11 shrink-0 max-md:min-h-11',
              isPinMode ? 'bg-blue-600 hover:bg-blue-700' : ''
            )}
          >
            <MessageSquarePlus className="mr-2 h-4 w-4 shrink-0" />
            {isPinMode ? 'Отменить Pin' : 'Добавить Pin'}
          </Button>

          {status === 'pending' && (
            <>
              <Button
                variant="outline"
                className="min-h-11 shrink-0 border-rose-200 text-rose-700 hover:bg-rose-50 max-md:min-h-11"
                onClick={rejectTz}
              >
                Нужны правки
              </Button>
              <Button
                className="min-h-11 shrink-0 bg-emerald-600 text-white hover:bg-emerald-700 max-md:min-h-11"
                onClick={acceptTz}
              >
                ТЗ принято
              </Button>
            </>
          )}
          </div>
        </div>
      </div>

      {isPinMode && (
        <div className="flex items-center justify-center rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-800 animate-in fade-in slide-in-from-top-2">
          Кликните в любое место документа, чтобы оставить комментарий к конкретному узлу или
          скетчу.
        </div>
      )}

      <div
        ref={containerRef}
        onClick={handleContainerClick}
        className={`relative min-w-0 overflow-x-auto rounded-xl border bg-white shadow-sm transition-all duration-200 ${isPinMode ? 'cursor-crosshair ring-2 ring-blue-500 ring-offset-4' : ''}`}
      >
        <div className="prose prose-sm prose-headings:border-b prose-headings:pb-2 prose-a:text-blue-600 pointer-events-none max-w-none min-w-0 select-none p-4 md:p-8">
          <div dangerouslySetInnerHTML={{ __html: displayHtml }} />
        </div>

        {/* Отрисовка сохраненных пинов */}
        {pins.map((pin, i) => (
          <div
            key={pin.id}
            className="group absolute z-20"
            style={{ left: `${pin.x}%`, top: `${pin.y}%`, transform: 'translate(-50%, -50%)' }}
          >
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white shadow-md ring-2 ring-white">
              {i + 1}
            </div>
            {/* Всплывающая подсказка с комментарием при наведении */}
            <div className="pointer-events-none absolute bottom-full left-1/2 mb-2 w-48 -translate-x-1/2 rounded-lg border bg-white p-3 opacity-0 shadow-lg transition-opacity group-hover:opacity-100">
              <p className="text-text-primary mb-1 text-xs font-medium">{pin.by}</p>
              <p className="text-text-secondary text-xs leading-snug">{pin.text}</p>
              <p className="text-text-muted mt-2 text-[10px]">
                {new Date(pin.at).toLocaleString('ru-RU')}
              </p>
            </div>
          </div>
        ))}

        {/* Диалог добавления нового пина */}
        {draftPin && (
          <div
            className="pin-draft-dialog absolute z-30 w-64 rounded-lg border bg-white p-3 shadow-xl"
            style={{
              left: `${draftPin.x}%`,
              top: `${draftPin.y}%`,
              transform: 'translate(-50%, 16px)',
            }}
          >
            <div className="absolute -top-2 left-1/2 h-4 w-4 -translate-x-1/2 rotate-45 transform border-l border-t bg-white" />
            <div className="relative">
              <p className="mb-2 text-xs font-medium">Новый комментарий</p>
              <Textarea
                className="mb-2 min-h-[80px] text-xs"
                placeholder="Укажите замечание к этой части ТЗ..."
                value={draftText}
                onChange={(e) => setDraftText(e.target.value)}
                autoFocus
              />
              <div className="flex justify-end gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 text-xs"
                  onClick={() => setDraftPin(null)}
                >
                  Отмена
                </Button>
                <Button
                  size="sm"
                  className="h-7 bg-blue-600 text-xs"
                  disabled={!draftText.trim()}
                  onClick={savePin}
                >
                  Сохранить
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

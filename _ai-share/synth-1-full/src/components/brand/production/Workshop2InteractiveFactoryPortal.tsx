'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { MessageSquarePlus, CheckCircle2, XCircle } from 'lucide-react';

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
  articleId,
}: {
  htmlContent: string;
  articleId: string;
}) {
  const { toast } = useToast();
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

  return (
    <div className="container mx-auto max-w-5xl space-y-6 py-8">
      <div className="sticky top-4 z-50 flex items-start justify-between rounded-xl border bg-white p-4 shadow-sm">
        <div>
          <h1 className="text-xl font-bold tracking-tight">Interactive Tech Pack</h1>
          <p className="text-text-secondary mt-1 text-sm">
            Артикул: {articleId} · {pins.length} комментариев
          </p>
        </div>
        <div className="flex items-center gap-3">
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

          <div className="bg-border-default mx-1 h-6 w-px" />

          <Button
            variant={isPinMode ? 'default' : 'outline'}
            onClick={() => {
              setIsPinMode(!isPinMode);
              setDraftPin(null);
            }}
            className={isPinMode ? 'bg-blue-600 hover:bg-blue-700' : ''}
          >
            <MessageSquarePlus className="mr-2 h-4 w-4" />
            {isPinMode ? 'Отменить Pin' : 'Добавить Pin (комментарий)'}
          </Button>

          {status === 'pending' && (
            <>
              <Button
                variant="outline"
                className="border-rose-200 text-rose-700 hover:bg-rose-50"
                onClick={rejectTz}
              >
                Нужны правки
              </Button>
              <Button className="bg-emerald-600 text-white hover:bg-emerald-700" onClick={acceptTz}>
                ТЗ принято в работу
              </Button>
            </>
          )}
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
        className={`relative overflow-hidden rounded-xl border bg-white shadow-sm transition-all duration-200 ${isPinMode ? 'cursor-crosshair ring-2 ring-blue-500 ring-offset-4' : ''}`}
      >
        <div className="prose prose-sm prose-headings:border-b prose-headings:pb-2 prose-a:text-blue-600 pointer-events-none max-w-none select-none p-8">
          <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
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

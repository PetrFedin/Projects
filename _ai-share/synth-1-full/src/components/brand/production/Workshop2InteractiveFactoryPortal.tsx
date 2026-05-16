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
    
    window.dispatchEvent(new CustomEvent('factory-pin-added', { detail: { message: newPin.text } }));
    
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
    <div className="container mx-auto max-w-5xl py-8 space-y-6">
      <div className="flex items-start justify-between bg-white p-4 rounded-xl border shadow-sm sticky top-4 z-50">
        <div>
          <h1 className="text-xl font-bold tracking-tight">Interactive Tech Pack</h1>
          <p className="text-text-secondary text-sm mt-1">
            Артикул: {articleId} · {pins.length} комментариев
          </p>
        </div>
        <div className="flex items-center gap-3">
          {status === 'pending' && (
            <Badge className="bg-amber-100 text-amber-800 border-amber-200">Ожидает согласования</Badge>
          )}
          {status === 'accepted' && (
            <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200"><CheckCircle2 className="w-3 h-3 mr-1"/> Принято в работу</Badge>
          )}
          {status === 'rejected' && (
            <Badge className="bg-rose-100 text-rose-800 border-rose-200"><XCircle className="w-3 h-3 mr-1"/> Возвращено на доработку</Badge>
          )}
          
          <div className="h-6 w-px bg-border-default mx-1" />
          
          <Button 
            variant={isPinMode ? 'default' : 'outline'} 
            onClick={() => {
              setIsPinMode(!isPinMode);
              setDraftPin(null);
            }}
            className={isPinMode ? 'bg-blue-600 hover:bg-blue-700' : ''}
          >
            <MessageSquarePlus className="w-4 h-4 mr-2" />
            {isPinMode ? 'Отменить Pin' : 'Добавить Pin (комментарий)'}
          </Button>

          {status === 'pending' && (
            <>
              <Button variant="outline" className="border-rose-200 text-rose-700 hover:bg-rose-50" onClick={rejectTz}>
                Нужны правки
              </Button>
              <Button className="bg-emerald-600 hover:bg-emerald-700 text-white" onClick={acceptTz}>
                ТЗ принято в работу
              </Button>
            </>
          )}
        </div>
      </div>
      
      {isPinMode && (
        <div className="bg-blue-50 border border-blue-200 text-blue-800 px-4 py-3 rounded-lg text-sm flex items-center justify-center animate-in fade-in slide-in-from-top-2">
          Кликните в любое место документа, чтобы оставить комментарий к конкретному узлу или скетчу.
        </div>
      )}
      
      <div 
        ref={containerRef}
        onClick={handleContainerClick}
        className={`bg-white border rounded-xl shadow-sm overflow-hidden relative transition-all duration-200 ${isPinMode ? 'cursor-crosshair ring-2 ring-blue-500 ring-offset-4' : ''}`}
      >
        <div className="p-8 prose prose-sm max-w-none prose-headings:border-b prose-headings:pb-2 prose-a:text-blue-600 pointer-events-none select-none">
          <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
        </div>

        {/* Отрисовка сохраненных пинов */}
        {pins.map((pin, i) => (
          <div 
            key={pin.id} 
            className="absolute z-20 group"
            style={{ left: `${pin.x}%`, top: `${pin.y}%`, transform: 'translate(-50%, -50%)' }}
          >
            <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold shadow-md ring-2 ring-white">
              {i + 1}
            </div>
            {/* Всплывающая подсказка с комментарием при наведении */}
            <div className="absolute left-1/2 bottom-full mb-2 -translate-x-1/2 w-48 bg-white border shadow-lg rounded-lg p-3 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
              <p className="text-xs font-medium text-text-primary mb-1">{pin.by}</p>
              <p className="text-xs text-text-secondary leading-snug">{pin.text}</p>
              <p className="text-[10px] text-text-muted mt-2">{new Date(pin.at).toLocaleString('ru-RU')}</p>
            </div>
          </div>
        ))}

        {/* Диалог добавления нового пина */}
        {draftPin && (
          <div 
            className="absolute z-30 pin-draft-dialog bg-white border shadow-xl rounded-lg p-3 w-64"
            style={{ left: `${draftPin.x}%`, top: `${draftPin.y}%`, transform: 'translate(-50%, 16px)' }}
          >
            <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white border-t border-l transform rotate-45" />
            <div className="relative">
              <p className="text-xs font-medium mb-2">Новый комментарий</p>
              <Textarea 
                className="text-xs min-h-[80px] mb-2" 
                placeholder="Укажите замечание к этой части ТЗ..."
                value={draftText}
                onChange={(e) => setDraftText(e.target.value)}
                autoFocus
              />
              <div className="flex gap-2 justify-end">
                <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={() => setDraftPin(null)}>
                  Отмена
                </Button>
                <Button size="sm" className="h-7 text-xs bg-blue-600" disabled={!draftText.trim()} onClick={savePin}>
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
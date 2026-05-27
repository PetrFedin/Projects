'use client';

import { useState, useRef, MouseEvent } from 'react';
import * as LucideIcons from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { EmptyState } from '@/components/design-system/empty-state';

export interface DefectPin {
  id: string;
  x: number;
  y: number;
  type: string;
  description?: string;
  width?: number;
  height?: number;
  isAiSuggested?: boolean;
}

const DEFECT_TYPES = ['Кривой шов', 'Пятно', 'Разрыв', 'Брак ткани', 'Фурнитура', 'Другое'];

export function Workshop2QcVisualInspection({ imageUrl }: { imageUrl?: string | null }) {
  const [pins, setPins] = useState<DefectPin[]>([]);
  const [activePinId, setActivePinId] = useState<string | null>(null);
  const [isAiScanning, setIsAiScanning] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleImageClick = (e: MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;

    // If clicking on an existing pin or its popover, we don't want to create a new one
    if ((e.target as HTMLElement).closest('.defect-pin-element')) {
      return;
    }

    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    const newPin: DefectPin = {
      id: Math.random().toString(36).substring(7),
      x,
      y,
      type: DEFECT_TYPES[0],
    };

    setPins([...pins, newPin]);
    setActivePinId(newPin.id);
  };

  const updatePin = (id: string, updates: Partial<DefectPin>) => {
    setPins(pins.map((p) => (p.id === id ? { ...p, ...updates } : p)));
  };

  const removePin = (id: string) => {
    setPins(pins.filter((p) => p.id !== id));
    if (activePinId === id) setActivePinId(null);
  };

  const handleAiScan = async () => {
    if (!imageUrl) return;
    setIsAiScanning(true);
    try {
      const response = await fetch('/api/brand/workshop2/qc/detect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageBase64: imageUrl }),
      });
      if (!response.ok) throw new Error('API Error');
      const { defects } = await response.json();

      if (Array.isArray(defects)) {
        const aiPins: DefectPin[] = defects.map((d: any) => ({
          id: Math.random().toString(36).substring(7),
          x: d.boundingBox?.x || 50,
          y: d.boundingBox?.y || 50,
          width: d.boundingBox?.width,
          height: d.boundingBox?.height,
          type: DEFECT_TYPES.includes(d.type) ? d.type : 'Другое',
          description: d.description,
          isAiSuggested: true,
        }));
        setPins((prev) => [...prev, ...aiPins]);
      }
    } catch (err) {
      console.error('AI Scan failed', err);
    } finally {
      setIsAiScanning(false);
    }
  };

  if (!imageUrl) {
    return (
      <EmptyState
        title="Нет изображения"
        description="Для визуальной фиксации дефектов необходимо прикрепить скетч или фото к досье."
        icon={<LucideIcons.ImageOff className="h-8 w-8 stroke-[1.5]" />}
      />
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-text-primary flex items-center gap-2 text-sm font-semibold">
          <LucideIcons.Focus className="text-accent-primary h-4 w-4" />
          Визуальная фиксация дефектов
        </h3>
        <div className="flex items-center gap-3">
          <div className="text-text-muted text-xs">
            Выявлено дефектов: <span className="text-text-primary font-bold">{pins.length}</span>
          </div>
          <Button
            size="sm"
            variant="outline"
            className="h-8 gap-1.5 border-indigo-200 text-xs text-indigo-600 hover:bg-indigo-50"
            onClick={handleAiScan}
            disabled={isAiScanning}
          >
            {isAiScanning ? (
              <LucideIcons.Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <LucideIcons.Sparkles className="h-3.5 w-3.5" />
            )}
            AI Анализ
          </Button>
        </div>
      </div>

      <div className="text-text-secondary border-border-default flex items-start gap-3 rounded-lg border bg-slate-50 p-3 text-xs">
        <LucideIcons.Info className="mt-0.5 h-4 w-4 shrink-0 text-blue-500" />
        <p>
          Кликните на любую область изображения, чтобы зафиксировать дефект. Это поможет фабрике
          точнее определить проблему при возврате на доработку.
        </p>
      </div>

      <div
        ref={containerRef}
        className="border-border-default group relative flex min-h-[400px] w-full cursor-crosshair items-center justify-center overflow-hidden rounded-xl border bg-slate-100 shadow-inner"
        onClick={handleImageClick}
      >
        <img
          src={imageUrl}
          alt="Скетч модели"
          className="h-auto max-h-[600px] w-full select-none object-contain"
          draggable={false}
        />

        {pins.map((pin) => (
          <Popover
            key={pin.id}
            open={activePinId === pin.id}
            onOpenChange={(open) => setActivePinId(open ? pin.id : null)}
          >
            <PopoverTrigger asChild>
              {pin.width && pin.height ? (
                <div
                  className={cn(
                    'defect-pin-element absolute z-10 cursor-pointer border-2 transition-colors',
                    pin.isAiSuggested
                      ? 'border-indigo-500 bg-indigo-500/20 hover:bg-indigo-500/30'
                      : 'border-red-500 bg-red-500/20 hover:bg-red-500/30',
                    activePinId === pin.id && 'ring-2 ring-indigo-500 ring-offset-2'
                  )}
                  style={{
                    left: `${pin.x}%`,
                    top: `${pin.y}%`,
                    width: `${pin.width}%`,
                    height: `${pin.height}%`,
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    setActivePinId(pin.id);
                  }}
                />
              ) : (
                <button
                  className={cn(
                    'defect-pin-element absolute z-10 flex h-6 w-6 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 border-white text-white shadow-md transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2',
                    pin.isAiSuggested
                      ? 'bg-indigo-500 focus:ring-indigo-500'
                      : 'bg-red-500 focus:ring-red-500'
                  )}
                  style={{ left: `${pin.x}%`, top: `${pin.y}%` }}
                  onClick={(e) => {
                    e.stopPropagation();
                    setActivePinId(pin.id);
                  }}
                >
                  <LucideIcons.AlertTriangle className="h-3 w-3" />
                </button>
              )}
            </PopoverTrigger>
            <PopoverContent
              className="defect-pin-element z-50 w-64 space-y-3 p-3"
              onPointerDownOutside={(e) => {
                // Clicking outside closes the popover normally
              }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <h4 className="text-text-primary text-xs font-semibold">Тип дефекта</h4>
                  {pin.isAiSuggested && (
                    <span className="rounded bg-indigo-100 px-1.5 py-0.5 text-[9px] font-medium text-indigo-700">
                      AI
                    </span>
                  )}
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 text-red-500 hover:bg-red-50 hover:text-red-700"
                  onClick={() => removePin(pin.id)}
                >
                  <LucideIcons.Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>

              <div className="grid grid-cols-2 gap-1.5">
                {DEFECT_TYPES.map((type) => (
                  <button
                    key={type}
                    className={cn(
                      'rounded-md border px-2 py-1.5 text-left text-[10px] transition-colors',
                      pin.type === type
                        ? 'bg-accent-primary/10 border-accent-primary text-accent-primary font-medium'
                        : 'border-border-default text-text-secondary bg-white hover:bg-slate-50'
                    )}
                    onClick={() => updatePin(pin.id, { type })}
                  >
                    {type}
                  </button>
                ))}
              </div>

              <div className="space-y-1.5">
                <label className="text-text-secondary text-[10px] font-medium">
                  Описание (опционально)
                </label>
                <Input
                  className="h-7 text-[11px]"
                  placeholder="Детали дефекта..."
                  value={pin.description || ''}
                  onChange={(e) => updatePin(pin.id, { description: e.target.value })}
                />
              </div>

              <div className="flex justify-end pt-2">
                <Button size="sm" className="h-7 text-[11px]" onClick={() => setActivePinId(null)}>
                  Готово
                </Button>
              </div>
            </PopoverContent>
          </Popover>
        ))}
      </div>
    </div>
  );
}

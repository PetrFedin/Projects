'use client';

import Image from 'next/image';
import { useCallback, useMemo, useRef, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import type { BottomWearPairingPreset, FootwearScanBundle } from '@/lib/footwear-viewer/types';
import { Box, Footprints, Scan, Shirt, Upload } from 'lucide-react';

type Props = {
  bundle: FootwearScanBundle;
  pairingPresets: BottomWearPairingPreset[];
  className?: string;
};

export function Footwear360PairingModule({ bundle, pairingPresets, className }: Props) {
  const sorted = useMemo(
    () => [...bundle.angles].sort((a, b) => a.sequenceIndex - b.sequenceIndex),
    [bundle.angles]
  );
  const [idx, setIdx] = useState(0);
  const [pairingId, setPairingId] = useState<string | null>(pairingPresets[0]?.id ?? null);
  const dragRef = useRef<{ active: boolean; lastX: number }>({ active: false, lastX: 0 });

  const current = sorted[idx] ?? sorted[0];
  const pairing = pairingPresets.find((p) => p.id === pairingId) ?? null;

  const step = useCallback(
    (dir: -1 | 1) => {
      setIdx((i) => {
        const n = sorted.length;
        if (n === 0) return 0;
        return (i + dir + n) % n;
      });
    },
    [sorted.length]
  );

  const onPointerDown = (e: React.PointerEvent) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    dragRef.current = { active: true, lastX: e.clientX };
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragRef.current.active) return;
    const dx = e.clientX - dragRef.current.lastX;
    if (Math.abs(dx) >= 48) {
      step(dx > 0 ? -1 : 1);
      dragRef.current.lastX = e.clientX;
    }
  };

  const onPointerUp = (e: React.PointerEvent) => {
    dragRef.current.active = false;
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {
      /* noop */
    }
  };

  const onWheel = (e: React.WheelEvent) => {
    if (e.deltaY > 20) step(1);
    if (e.deltaY < -20) step(-1);
  };

  return (
    <div className={cn('space-y-6', className)}>
      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <Card className="overflow-hidden">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-base">
              <Footprints className="h-5 w-5" />
              360° и ракурсы
            </CardTitle>
            <CardDescription>
              Ведите пальцем или мышью по кадру — круговой обзор. Колёсико мыши — шаг по ракурсам.
              Ниже — быстрый выбор вида (подошва, сверху, сбоку).
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div
              role="img"
              aria-label={`Ракурс: ${current?.label ?? ''}`}
              className="relative mx-auto aspect-square w-full max-w-xl cursor-grab touch-pan-y overflow-hidden rounded-xl border bg-muted active:cursor-grabbing"
              onPointerDown={onPointerDown}
              onPointerMove={onPointerMove}
              onPointerUp={onPointerUp}
              onPointerLeave={onPointerUp}
              onWheel={onWheel}
            >
              {current && (
                <Image
                  src={current.imageUrl}
                  alt={current.label}
                  fill
                  className="pointer-events-none select-none object-cover"
                  sizes="(max-width: 768px) 100vw, 480px"
                  unoptimized
                  priority={idx === 0}
                />
              )}
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-3 pt-10">
                <p className="text-sm font-semibold text-white">{current?.label}</p>
                <p className="text-xs text-white/80">
                  {idx + 1} / {sorted.length} — ведите для вращения
                </p>
              </div>
            </div>

            <div className="mx-auto flex max-w-xl flex-wrap justify-center gap-1.5">
              {sorted.map((a, i) => (
                <button
                  key={a.id}
                  type="button"
                  onClick={() => setIdx(i)}
                  className={cn(
                    'rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide transition-colors',
                    i === idx
                      ? 'border-primary bg-primary text-primary-foreground'
                      : 'bg-background hover:bg-muted'
                  )}
                >
                  {a.label}
                </button>
              ))}
            </div>

            <div className="mx-auto max-w-xl">
              <Label className="text-xs text-muted-foreground">Быстрый скролл ракурса</Label>
              <input
                type="range"
                min={0}
                max={Math.max(0, sorted.length - 1)}
                value={idx}
                onChange={(e) => setIdx(Number(e.target.value))}
                className="mt-1 w-full accent-foreground"
              />
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-sm">
                <Shirt className="h-4 w-4" />С чем носить
              </CardTitle>
              <CardDescription className="text-xs">
                Вариации низа: цвет и материал. Превью — ориентир для байера и витрины (композит или
                лук).
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex flex-wrap gap-2">
                {pairingPresets.map((p) => (
                  <Button
                    key={p.id}
                    type="button"
                    size="sm"
                    variant={pairingId === p.id ? 'default' : 'outline'}
                    className="h-auto gap-2 py-1.5 text-xs"
                    onClick={() => setPairingId(p.id)}
                  >
                    <span
                      className="h-3 w-3 shrink-0 rounded-full border border-white/30"
                      style={{ backgroundColor: p.colorHex }}
                    />
                    {p.label}
                  </Button>
                ))}
              </div>
              {pairing && (
                <div className="space-y-2 rounded-lg border bg-muted/40 p-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-sm font-medium">{pairing.label}</span>
                    <Badge variant="secondary" className="text-[10px]">
                      {pairing.category}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">{pairing.fabricHint}</p>
                  <div className="flex items-center gap-2 text-xs">
                    <span className="text-muted-foreground">Цвет:</span>
                    <span className="font-medium">{pairing.colorName}</span>
                    <code className="rounded bg-muted px-1 text-[10px]">{pairing.colorHex}</code>
                  </div>
                  {pairing.pairingPreviewUrl && (
                    <div className="relative mt-2 aspect-video w-full overflow-hidden rounded-md border">
                      <Image
                        src={pairing.pairingPreviewUrl}
                        alt=""
                        fill
                        className="object-cover"
                        sizes="320px"
                        unoptimized
                      />
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Scan className="h-5 w-5" />
            3D-сканирование и GLB
          </CardTitle>
          <CardDescription>
            Студийный или мобильный пайплайн: фотограмметрия по кругу, LiDAR / Object Capture (iOS),
            сканер — затем mesh и текстуры в DAM, выдача GLB для витрины и AR.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <ul className="list-disc space-y-2 pl-5 text-sm text-muted-foreground">
            <li>
              <strong className="text-foreground">Фотограмметрия:</strong> 24–36 кадров по
              окружности, ровный свет, без бликов на лаке.
            </li>
            <li>
              <strong className="text-foreground">Мобильный LiDAR:</strong> обход модели в
              приложении захвата — быстрый черновой mesh.
            </li>
            <li>
              <strong className="text-foreground">Студия:</strong> таблица с маркерами, референсный
              подвес обуви — максимальная точность подошвы и швов.
            </li>
          </ul>
          {bundle.scan && (
            <div className="flex flex-wrap items-center gap-2 rounded-lg border p-3 text-sm">
              <Badge variant="outline">{bundle.scan.source}</Badge>
              {bundle.scan.capturedAt && (
                <span className="text-muted-foreground">дата: {bundle.scan.capturedAt}</span>
              )}
              {bundle.scan.notes && (
                <p className="mt-1 w-full text-xs text-muted-foreground">{bundle.scan.notes}</p>
              )}
            </div>
          )}
          <div className="flex flex-wrap items-center gap-3">
            <Label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border bg-background px-4 py-2.5 text-sm hover:bg-muted/60">
              <Upload className="h-4 w-4" />
              Проверить GLB локально
              <input
                type="file"
                accept=".glb,.gltf"
                className="sr-only"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f)
                    window.alert(
                      `Выбран файл: ${f.name} — в проде загрузка в DAM и привязка к ${bundle.skuId}`
                    );
                }}
              />
            </Label>
            {bundle.model3dUrl && (
              <Button variant="outline" size="sm" asChild>
                <a href={bundle.model3dUrl} target="_blank" rel="noreferrer">
                  <Box className="mr-1 h-4 w-4" />
                  Открыть GLB в DAM
                </a>
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

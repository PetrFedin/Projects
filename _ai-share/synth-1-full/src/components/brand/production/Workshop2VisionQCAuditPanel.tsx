'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScanSearch, Upload, CheckCircle2, AlertCircle, Camera, Crosshair } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

export function Workshop2VisionQCAuditPanel() {
  const [isScanning, setIsScanning] = useState(false);
  const [hasResult, setHasResult] = useState(false);

  const handleSimulateScan = () => {
    setIsScanning(true);
    setHasResult(false);
    setTimeout(() => {
      setIsScanning(false);
      setHasResult(true);
    }, 2000);
  };

  return (
    <div className="border-border-default space-y-4 rounded-xl border bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <div className="text-text-primary flex items-center gap-2 font-semibold">
            <ScanSearch className="text-accent-primary h-5 w-5" />
            AI Контроль качества (Vision)
          </div>
          <div className="text-text-secondary text-sm">
            Сверка фото физического сэмпла с 3D-эскизом и ТЗ
          </div>
        </div>
        {hasResult && (
          <Badge variant="outline" className="border-amber-200 bg-amber-50 text-amber-700">
            Найдено 2 аномалии
          </Badge>
        )}
      </div>

      {!isScanning && !hasResult ? (
        <div className="border-border-default bg-bg-surface2 flex flex-col items-center justify-center rounded-lg border-2 border-dashed py-8 text-center">
          <div className="bg-bg-surface mb-4 rounded-full p-3 shadow-sm">
            <Camera className="text-text-muted h-6 w-6" />
          </div>
          <p className="text-text-primary mb-1 text-sm font-medium">Загрузите фото сэмпла</p>
          <p className="text-text-secondary mb-4 text-[11px]">
            AI сравнит пропорции и детали с утвержденным эскизом
          </p>
          <Button onClick={handleSimulateScan} size="sm" className="gap-2">
            <Upload className="h-3.5 w-3.5" />
            Загрузить и проверить
          </Button>
        </div>
      ) : isScanning ? (
        <div className="border-border-subtle bg-bg-surface2 flex flex-col items-center justify-center rounded-lg border py-8 text-center">
          <ScanSearch className="text-accent-primary mb-4 h-8 w-8 animate-pulse" />
          <p className="text-text-primary text-sm font-medium">Анализ изображения...</p>
          <p className="text-text-secondary text-[11px]">Сверка лекал, фурнитуры и пропорций</p>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <div className="text-text-secondary text-xs font-semibold uppercase tracking-wider">
                Ожидание (3D Рендер)
              </div>
              <div className="border-border-subtle relative flex aspect-[4/3] w-full items-center justify-center overflow-hidden rounded-lg border bg-slate-100">
                <div className="absolute inset-0 bg-[radial-gradient(#000_1px,transparent_1px)] opacity-10 [background-size:16px_16px]"></div>
                <div className="z-10 flex flex-col items-center font-medium text-slate-400">
                  <Crosshair className="mb-2 h-6 w-6" />
                  Эталонная модель
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="text-text-secondary text-xs font-semibold uppercase tracking-wider">
                Факт (Фото с фабрики)
              </div>
              <div className="border-border-subtle relative flex aspect-[4/3] w-full items-center justify-center overflow-hidden rounded-lg border bg-slate-100">
                <div className="absolute inset-0 bg-[radial-gradient(#000_1px,transparent_1px)] opacity-10 [background-size:16px_16px]"></div>
                <div className="z-10 flex flex-col items-center font-medium text-slate-400">
                  <Camera className="mb-2 h-6 w-6" />
                  Актуальное фото
                </div>

                {/* Bounding box 1 */}
                <div className="absolute left-[30%] top-[20%] h-[15%] w-[40%] rounded-sm border-2 border-rose-500 bg-rose-500/10">
                  <div className="absolute -top-6 left-[-2px] whitespace-nowrap rounded bg-rose-500 px-1.5 py-0.5 text-[9px] font-bold text-white">
                    Цвет ниток (94%)
                  </div>
                </div>

                {/* Bounding box 2 */}
                <div className="absolute bottom-[30%] right-[25%] h-[20%] w-[15%] rounded-sm border-2 border-amber-500 bg-amber-500/10">
                  <div className="absolute -top-6 left-[-2px] whitespace-nowrap rounded bg-amber-500 px-1.5 py-0.5 text-[9px] font-bold text-white">
                    Смещение кармана (89%)
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="text-text-muted text-xs font-bold uppercase tracking-wider">
              Детализация дефектов
            </h4>
            <div className="border-border-subtle overflow-hidden rounded-md border">
              <Table>
                <TableHeader className="bg-bg-surface2">
                  <TableRow>
                    <TableHead className="w-[120px] text-xs">Тип дефекта</TableHead>
                    <TableHead className="text-xs">Описание</TableHead>
                    <TableHead className="w-[100px] text-right text-xs">Уверенность</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="text-xs font-medium">
                      <div className="flex items-center gap-1.5">
                        <AlertCircle className="h-3.5 w-3.5 text-rose-500" />
                        Цвет ниток
                      </div>
                    </TableCell>
                    <TableCell className="text-text-secondary text-xs">
                      Отстрочка выполнена нитками контрастного цвета (ожидался тон в тон).
                    </TableCell>
                    <TableCell className="text-right text-xs font-medium">94%</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="text-xs font-medium">
                      <div className="flex items-center gap-1.5">
                        <AlertCircle className="h-3.5 w-3.5 text-amber-500" />
                        Смещение
                      </div>
                    </TableCell>
                    <TableCell className="text-text-secondary text-xs">
                      Левый карман на 2 см ниже спецификации в ТЗ.
                    </TableCell>
                    <TableCell className="text-right text-xs font-medium">89%</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="text-xs font-medium">
                      <div className="flex items-center gap-1.5">
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                        Пропорции
                      </div>
                    </TableCell>
                    <TableCell className="text-text-secondary text-xs">
                      Соответствует 3D-модели на 98%.
                    </TableCell>
                    <TableCell className="text-right text-xs font-medium">98%</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </div>

          <div className="border-border-subtle flex justify-end border-t pt-2">
            <Button variant="outline" size="sm" onClick={() => setHasResult(false)}>
              Загрузить другое фото
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

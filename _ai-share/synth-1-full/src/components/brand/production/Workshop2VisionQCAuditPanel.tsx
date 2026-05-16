'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScanSearch, Upload, CheckCircle2, AlertCircle, Camera, Crosshair } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

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
    <div className="border-border-default rounded-xl border bg-white p-4 shadow-sm space-y-4">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <div className="text-text-primary flex items-center gap-2 font-semibold">
            <ScanSearch className="h-5 w-5 text-accent-primary" />
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
        <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-border-default bg-bg-surface2 py-8 text-center">
          <div className="mb-4 rounded-full bg-bg-surface p-3 shadow-sm">
            <Camera className="h-6 w-6 text-text-muted" />
          </div>
          <p className="mb-1 text-sm font-medium text-text-primary">Загрузите фото сэмпла</p>
          <p className="mb-4 text-[11px] text-text-secondary">
            AI сравнит пропорции и детали с утвержденным эскизом
          </p>
          <Button onClick={handleSimulateScan} size="sm" className="gap-2">
            <Upload className="h-3.5 w-3.5" />
            Загрузить и проверить
          </Button>
        </div>
      ) : isScanning ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-border-subtle bg-bg-surface2 py-8 text-center">
          <ScanSearch className="mb-4 h-8 w-8 animate-pulse text-accent-primary" />
          <p className="text-sm font-medium text-text-primary">Анализ изображения...</p>
          <p className="text-[11px] text-text-secondary">Сверка лекал, фурнитуры и пропорций</p>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <div className="text-xs font-semibold text-text-secondary uppercase tracking-wider">Ожидание (3D Рендер)</div>
              <div className="aspect-[4/3] w-full rounded-lg bg-slate-100 flex items-center justify-center border border-border-subtle relative overflow-hidden">
                <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:16px_16px]"></div>
                <div className="text-slate-400 font-medium z-10 flex flex-col items-center">
                  <Crosshair className="h-6 w-6 mb-2" />
                  Эталонная модель
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="text-xs font-semibold text-text-secondary uppercase tracking-wider">Факт (Фото с фабрики)</div>
              <div className="aspect-[4/3] w-full rounded-lg bg-slate-100 flex items-center justify-center border border-border-subtle relative overflow-hidden">
                <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:16px_16px]"></div>
                <div className="text-slate-400 font-medium z-10 flex flex-col items-center">
                  <Camera className="h-6 w-6 mb-2" />
                  Актуальное фото
                </div>
                
                {/* Bounding box 1 */}
                <div className="absolute top-[20%] left-[30%] w-[40%] h-[15%] border-2 border-rose-500 bg-rose-500/10 rounded-sm">
                  <div className="absolute -top-6 left-[-2px] bg-rose-500 text-white text-[9px] px-1.5 py-0.5 rounded font-bold whitespace-nowrap">
                    Цвет ниток (94%)
                  </div>
                </div>

                {/* Bounding box 2 */}
                <div className="absolute bottom-[30%] right-[25%] w-[15%] h-[20%] border-2 border-amber-500 bg-amber-500/10 rounded-sm">
                  <div className="absolute -top-6 left-[-2px] bg-amber-500 text-white text-[9px] px-1.5 py-0.5 rounded font-bold whitespace-nowrap">
                    Смещение кармана (89%)
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-text-muted">Детализация дефектов</h4>
            <div className="rounded-md border border-border-subtle overflow-hidden">
              <Table>
                <TableHeader className="bg-bg-surface2">
                  <TableRow>
                    <TableHead className="w-[120px] text-xs">Тип дефекта</TableHead>
                    <TableHead className="text-xs">Описание</TableHead>
                    <TableHead className="w-[100px] text-xs text-right">Уверенность</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium text-xs">
                      <div className="flex items-center gap-1.5">
                        <AlertCircle className="h-3.5 w-3.5 text-rose-500" />
                        Цвет ниток
                      </div>
                    </TableCell>
                    <TableCell className="text-xs text-text-secondary">Отстрочка выполнена нитками контрастного цвета (ожидался тон в тон).</TableCell>
                    <TableCell className="text-xs text-right font-medium">94%</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium text-xs">
                      <div className="flex items-center gap-1.5">
                        <AlertCircle className="h-3.5 w-3.5 text-amber-500" />
                        Смещение
                      </div>
                    </TableCell>
                    <TableCell className="text-xs text-text-secondary">Левый карман на 2 см ниже спецификации в ТЗ.</TableCell>
                    <TableCell className="text-xs text-right font-medium">89%</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium text-xs">
                      <div className="flex items-center gap-1.5">
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                        Пропорции
                      </div>
                    </TableCell>
                    <TableCell className="text-xs text-text-secondary">Соответствует 3D-модели на 98%.</TableCell>
                    <TableCell className="text-xs text-right font-medium">98%</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </div>

          <div className="flex justify-end pt-2 border-t border-border-subtle">
            <Button variant="outline" size="sm" onClick={() => setHasResult(false)}>
              Загрузить другое фото
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

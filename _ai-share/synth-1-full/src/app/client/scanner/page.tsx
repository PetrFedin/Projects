'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Camera, Ruler, Scan, CheckCircle, Smartphone } from 'lucide-react';
import { processBodyScan } from '@/ai/flows/body-scanner';
import { BodyMeasurements } from '@/lib/types/client';

/**
 * AI Body Scanner UI
 * Пошаговый интерфейс замера тела для клиента.
 */

export default function BodyScannerPage() {
  const [step, setStep] = useState<'intro' | 'setup' | 'photo' | 'processing' | 'result'>('intro');
  const [height, setHeight] = useState<number>(175);
  const [unit, setUnit] = useState<'cm' | 'in'>('cm');
  const [results, setResults] = useState<BodyMeasurements | null>(null);

  const startScan = async () => {
    setStep('processing');
    try {
      // Имитация передачи фото
      const scanData = await processBodyScan({
        userId: 'client-123',
        height,
        unit,
        frontImageUrl: 'base64_placeholder'
      });
      setResults(scanData);
      setStep('result');
    } catch (error) {
      console.error('Scan failed:', error);
      setStep('setup');
    }
  };

  return (
    <div className="container mx-auto max-w-lg px-4 py-4 space-y-6">
      <header className="text-center space-y-2">
        <h1 className="text-base font-bold font-headline">AI Body Scanner</h1>
        <p className="text-muted-foreground">Подберите идеальный размер за 30 секунд</p>
      </header>

      {step === 'intro' && (
        <Card className="border-2 border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Scan className="w-5 h-5 text-primary" />
              Как это работает?
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-3">
              <div className="flex items-start gap-3">
                <div className="bg-primary/10 p-2 rounded-full"><Smartphone className="w-4 h-4 text-primary" /></div>
                <div>
                  <p className="font-medium text-sm">Установите телефон</p>
                  <p className="text-xs text-muted-foreground">Поставьте телефон вертикально на уровне пояса.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="bg-primary/10 p-2 rounded-full"><Ruler className="w-4 h-4 text-primary" /></div>
                <div>
                  <p className="font-medium text-sm">Укажите ваш рост</p>
                  <p className="text-xs text-muted-foreground">Это необходимо для калибровки точности замера.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="bg-primary/10 p-2 rounded-full"><Camera className="w-4 h-4 text-primary" /></div>
                <div>
                  <p className="font-medium text-sm">Сделайте фото</p>
                  <p className="text-xs text-muted-foreground">Одно фото в полный рост (спереди) и одно (сбоку).</p>
                </div>
              </div>
            </div>
            <Button className="w-full mt-4" onClick={() => setStep('setup')}>Начать замер</Button>
          </CardContent>
        </Card>
      )}

      {step === 'setup' && (
        <Card>
          <CardHeader>
            <CardTitle>Параметры калибровки</CardTitle>
            <CardDescription>Укажите ваш реальный рост для точности AI-модели.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Ваш рост ({unit})</label>
              <div className="flex gap-2">
                <Input 
                  type="number" 
                  value={height} 
                  onChange={(e) => setHeight(Number(e.target.value))}
                  placeholder="Напр. 175"
                />
                <Button variant="outline" onClick={() => setUnit(unit === 'cm' ? 'in' : 'cm')}>
                  {unit}
                </Button>
              </div>
            </div>
            <Button className="w-full" onClick={() => setStep('photo')}>Далее: Камера</Button>
          </CardContent>
        </Card>
      )}

      {step === 'photo' && (
        <div className="space-y-4">
          <div className="aspect-[3/4] bg-muted rounded-2xl flex flex-col items-center justify-center border-2 border-dashed border-primary/30 relative overflow-hidden">
             <div className="text-center p-4 space-y-4">
                <Camera className="w-12 h-12 mx-auto text-muted-foreground" />
                <p className="text-sm font-medium">Разместите себя в рамке</p>
                <div className="w-48 h-64 border-2 border-white/50 rounded-full mx-auto opacity-30"></div>
             </div>
          </div>
          <Button className="w-full size-lg h-12 rounded-full" onClick={startScan}>
             СДЕЛАТЬ ФОТО И АНАЛИЗИРОВАТЬ
          </Button>
        </div>
      )}

      {step === 'processing' && (
        <Card className="text-center py-12">
          <CardContent className="space-y-6">
            <div className="relative w-24 h-24 mx-auto">
              <div className="absolute inset-0 border-4 border-primary/20 rounded-full"></div>
              <div className="absolute inset-0 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
              <Scan className="absolute inset-0 m-auto w-10 h-10 text-primary animate-pulse" />
            </div>
            <div className="space-y-2">
              <h3 className="text-sm font-bold">Искусственный интеллект работает...</h3>
              <p className="text-sm text-muted-foreground">Оцифровываем пропорции тела и создаем 3D-модель.</p>
            </div>
          </CardContent>
        </Card>
      )}

      {step === 'result' && results && (
        <Card className="border-2 border-green-500/20">
          <CardHeader className="text-center border-b pb-4">
            <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-2" />
            <CardTitle>Замер завершен!</CardTitle>
            <CardDescription>Ваши данные сохранены в профиле Synth-1</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="grid grid-cols-3 divide-x divide-y border-b">
              <div className="p-4 text-center">
                <p className="text-[10px] uppercase text-muted-foreground">Грудь</p>
                <p className="text-base font-bold">{results.chest.toFixed(1)} <span className="text-xs font-normal">{unit}</span></p>
              </div>
              <div className="p-4 text-center">
                <p className="text-[10px] uppercase text-muted-foreground">Талия</p>
                <p className="text-base font-bold">{results.waist.toFixed(1)} <span className="text-xs font-normal">{unit}</span></p>
              </div>
              <div className="p-4 text-center border-t-0">
                <p className="text-[10px] uppercase text-muted-foreground">Бедра</p>
                <p className="text-base font-bold">{results.hips.toFixed(1)} <span className="text-xs font-normal">{unit}</span></p>
              </div>
            </div>
            <div className="p-4 space-y-4">
               <div className="bg-primary/5 p-4 rounded-xl space-y-2">
                  <p className="text-sm font-semibold flex items-center gap-2">
                    <Smartphone className="w-4 h-4 text-primary" />
                    Рекомендованный размер (Zara)
                  </p>
                  <p className="text-sm font-black text-primary">M (Regular Fit)</p>
                  <p className="text-[10px] text-muted-foreground italic">На основе сравнения с базой размеров Zara и Mango.</p>
               </div>
               <Button variant="outline" className="w-full" onClick={() => setStep('intro')}>Повторить замер</Button>
               <Button className="w-full">Перейти в Маркетрум</Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

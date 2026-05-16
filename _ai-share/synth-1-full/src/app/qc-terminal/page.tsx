'use client';

import { useState, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import * as LucideIcons from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { getAqlPlan } from '@/lib/production/aql-standards';

type Step = 'select_batch' | 'aql_setup' | 'inspection';

export default function QcTerminalPage() {
  const searchParams = useSearchParams();
  const defaultBatchId = searchParams?.get('batchId') || '';
  
  const [step, setStep] = useState<Step>('select_batch');
  const [batchId, setBatchId] = useState(defaultBatchId);
  const [batchSize, setBatchSize] = useState<number | ''>('');
  
  // Inspection state
  const [inspectedCount, setInspectedCount] = useState(0);
  const [passedCount, setPassedCount] = useState(0);
  const [failedCount, setFailedCount] = useState(0);
  
  // Fail form state
  const [showFailForm, setShowFailForm] = useState(false);
  const [defectComment, setDefectComment] = useState('');
  const [defectPhoto, setDefectPhoto] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const aql = typeof batchSize === 'number' && batchSize > 0 ? getAqlPlan(batchSize, '2.5') : null;
  const targetSample = aql?.sampleSize || 0;

  const handleStartAql = () => {
    if (batchId) {
      setStep('aql_setup');
    }
  };

  const handleStartInspection = () => {
    if (typeof batchSize === 'number' && batchSize > 0) {
      setStep('inspection');
    }
  };

  const handlePass = () => {
    setPassedCount(p => p + 1);
    setInspectedCount(p => p + 1);
  };

  const handleFailClick = () => {
    setShowFailForm(true);
  };

  const handleConfirmFail = () => {
    setFailedCount(p => p + 1);
    setInspectedCount(p => p + 1);
    setShowFailForm(false);
    setDefectComment('');
    setDefectPhoto(null);
  };

  const handlePhotoCapture = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const url = URL.createObjectURL(file);
      setDefectPhoto(url);
    }
  };

  const isComplete = targetSample > 0 && inspectedCount >= targetSample;

  return (
    <div className="flex flex-col min-h-screen max-w-md mx-auto bg-white shadow-xl relative">
      {/* Header */}
      <header className="flex items-center gap-3 p-4 border-b border-border-default bg-slate-50 sticky top-0 z-10">
        <div className="bg-accent-primary text-white p-2 rounded-lg">
          <LucideIcons.ShieldCheck className="w-5 h-5" />
        </div>
        <div>
          <h1 className="text-sm font-bold text-text-primary">Терминал Инспектора</h1>
          <p className="text-xs text-text-secondary font-medium">
            {step === 'select_batch' ? 'Выбор партии' : step === 'aql_setup' ? 'Настройка AQL' : 'Инспекция'}
          </p>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 flex flex-col p-4 overflow-y-auto">
        {step === 'select_batch' && (
          <div className="flex flex-col gap-6 flex-1 justify-center pb-12">
            <div className="text-center space-y-2">
              <LucideIcons.Package className="w-12 h-12 text-slate-300 mx-auto" />
              <h2 className="text-xl font-bold text-text-primary">Сканирование партии</h2>
              <p className="text-sm text-text-secondary">Укажите ID партии или отсканируйте штрихкод</p>
            </div>
            
            <div className="space-y-4">
              <Input
                value={batchId}
                onChange={(e) => setBatchId(e.target.value)}
                placeholder="Например, BATCH-001"
                className="h-14 text-center text-lg shadow-sm"
              />
              <Button 
                onClick={handleStartAql}
                disabled={!batchId.trim()}
                className="w-full h-14 text-lg font-semibold"
              >
                Продолжить
              </Button>
            </div>
          </div>
        )}

        {step === 'aql_setup' && (
          <div className="flex flex-col gap-6 flex-1">
            <div className="space-y-4 bg-slate-50 p-4 rounded-xl border border-slate-100">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-text-secondary uppercase tracking-wider">ID Партии</label>
                <div className="font-mono text-sm font-medium">{batchId}</div>
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-sm font-bold text-text-primary block">Укажите размер партии (шт)</label>
              <Input
                type="number"
                value={batchSize}
                onChange={(e) => setBatchSize(e.target.value ? Number(e.target.value) : '')}
                placeholder="0"
                className="h-16 text-center text-2xl font-bold"
              />
            </div>

            {aql && (
              <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-xl space-y-3">
                <div className="flex justify-between items-center border-b border-emerald-200/50 pb-2">
                  <span className="text-emerald-800 text-sm font-medium">Выборка к проверке</span>
                  <span className="text-emerald-900 text-xl font-bold">{aql.sampleSize} шт</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-emerald-800/80 text-xs">Допустимо брака (Ac)</span>
                  <span className="text-emerald-900 font-bold">{aql.acceptLimit}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-rose-600/80 text-xs">Браковка партии (Re)</span>
                  <span className="text-rose-700 font-bold">≥ {aql.rejectLimit}</span>
                </div>
              </div>
            )}

            <div className="mt-auto pt-6">
              <Button 
                onClick={handleStartInspection}
                disabled={!aql}
                className="w-full h-14 text-lg font-semibold"
              >
                Начать инспекцию
              </Button>
            </div>
          </div>
        )}

        {step === 'inspection' && !showFailForm && !isComplete && (
          <div className="flex flex-col flex-1">
            {/* Progress */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 mb-6">
              <div className="flex justify-between items-end mb-2">
                <div>
                  <div className="text-[10px] font-bold text-text-secondary uppercase tracking-wider mb-1">Прогресс выборки</div>
                  <div className="text-2xl font-black text-text-primary">
                    {inspectedCount} <span className="text-slate-400 text-lg font-medium">/ {targetSample}</span>
                  </div>
                </div>
                <div className="text-right flex gap-3">
                  <div className="flex flex-col items-end">
                    <span className="text-[10px] font-bold text-emerald-600 uppercase">Pass</span>
                    <span className="text-lg font-bold text-emerald-700">{passedCount}</span>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="text-[10px] font-bold text-rose-600 uppercase">Fail</span>
                    <span className="text-lg font-bold text-rose-700">{failedCount}</span>
                  </div>
                </div>
              </div>
              
              <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden flex">
                <div 
                  className="h-full bg-emerald-500" 
                  style={{ width: `${(passedCount / targetSample) * 100}%` }}
                />
                <div 
                  className="h-full bg-rose-500" 
                  style={{ width: `${(failedCount / targetSample) * 100}%` }}
                />
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex-1 flex flex-col gap-4 justify-center pb-6">
              <button
                type="button"
                onClick={handlePass}
                className="flex-1 bg-emerald-500 hover:bg-emerald-600 active:bg-emerald-700 text-white rounded-3xl flex flex-col items-center justify-center gap-3 transition-colors shadow-lg shadow-emerald-500/20"
              >
                <LucideIcons.CheckCircle2 className="w-16 h-16" />
                <span className="text-3xl font-black tracking-wider">PASS</span>
              </button>
              
              <button
                type="button"
                onClick={handleFailClick}
                className="flex-1 bg-rose-500 hover:bg-rose-600 active:bg-rose-700 text-white rounded-3xl flex flex-col items-center justify-center gap-3 transition-colors shadow-lg shadow-rose-500/20"
              >
                <LucideIcons.XCircle className="w-16 h-16" />
                <span className="text-3xl font-black tracking-wider">FAIL</span>
              </button>
            </div>
          </div>
        )}

        {step === 'inspection' && showFailForm && (
          <div className="flex flex-col flex-1 animate-in slide-in-from-bottom-4 duration-200">
            <div className="flex items-center gap-2 mb-6">
              <button onClick={() => setShowFailForm(false)} className="p-2 -ml-2 text-slate-400 hover:text-slate-600">
                <LucideIcons.ArrowLeft className="w-6 h-6" />
              </button>
              <h2 className="text-xl font-bold text-rose-600">Фиксация дефекта</h2>
            </div>

            <div className="space-y-6 flex-1">
              {/* Photo capture */}
              <div className="space-y-3">
                <label className="text-sm font-bold text-text-primary block">Фото дефекта</label>
                
                {defectPhoto ? (
                  <div className="relative rounded-xl overflow-hidden border-2 border-slate-200 bg-slate-50 aspect-video">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={defectPhoto} alt="Дефект" className="w-full h-full object-contain" />
                    <button 
                      onClick={() => setDefectPhoto(null)}
                      className="absolute top-2 right-2 bg-black/50 text-white p-2 rounded-full backdrop-blur-md"
                    >
                      <LucideIcons.X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <button 
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full aspect-video rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 flex flex-col items-center justify-center gap-3 text-slate-500 hover:bg-slate-100 hover:border-slate-400 transition-colors"
                  >
                    <LucideIcons.Camera className="w-10 h-10" />
                    <span className="font-medium text-sm">Сделать фото</span>
                  </button>
                )}
                
                <input 
                  type="file" 
                  accept="image/*" 
                  capture="environment"
                  className="hidden"
                  ref={fileInputRef}
                  onChange={handlePhotoCapture}
                />
              </div>

              {/* Comment */}
              <div className="space-y-3">
                <label className="text-sm font-bold text-text-primary block">Описание (опционально)</label>
                <Textarea 
                  value={defectComment}
                  onChange={(e) => setDefectComment(e.target.value)}
                  placeholder="Опишите характер дефекта..."
                  className="min-h-[120px] text-base p-4 bg-slate-50 border-slate-200"
                />
              </div>
            </div>

            <div className="mt-auto pt-6">
              <Button 
                onClick={handleConfirmFail}
                variant="destructive"
                className="w-full h-14 text-lg font-bold shadow-lg shadow-rose-500/20"
              >
                Сохранить брак
              </Button>
            </div>
          </div>
        )}

        {step === 'inspection' && isComplete && (
          <div className="flex flex-col flex-1 items-center justify-center text-center gap-6 animate-in zoom-in-95 duration-300">
            <div className={cn(
              "w-24 h-24 rounded-full flex items-center justify-center mb-2",
              failedCount >= (aql?.rejectLimit || 999) 
                ? "bg-rose-100 text-rose-600" 
                : "bg-emerald-100 text-emerald-600"
            )}>
              {failedCount >= (aql?.rejectLimit || 999) ? (
                <LucideIcons.XCircle className="w-12 h-12" />
              ) : (
                <LucideIcons.CheckCircle2 className="w-12 h-12" />
              )}
            </div>
            
            <div className="space-y-2">
              <h2 className="text-2xl font-black text-text-primary">Инспекция завершена</h2>
              <p className="text-text-secondary">
                Проверено {inspectedCount} из {targetSample} изделий
              </p>
            </div>

            <div className="w-full max-w-xs bg-slate-50 border border-slate-100 rounded-2xl p-6 space-y-4">
              <div className="flex justify-between items-center">
                <span className="font-semibold text-text-secondary">Статус партии:</span>
                {failedCount >= (aql?.rejectLimit || 999) ? (
                  <span className="font-bold text-rose-600 uppercase tracking-wide">Брак</span>
                ) : (
                  <span className="font-bold text-emerald-600 uppercase tracking-wide">Принято</span>
                )}
              </div>
              <div className="h-px bg-slate-200 w-full" />
              <div className="flex justify-between items-center text-sm">
                <span className="text-text-secondary">Прошло проверку</span>
                <span className="font-bold">{passedCount}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-text-secondary">Браковано</span>
                <span className="font-bold">{failedCount}</span>
              </div>
            </div>

            <Button 
              onClick={() => {
                setStep('select_batch');
                setBatchId('');
                setBatchSize('');
                setInspectedCount(0);
                setPassedCount(0);
                setFailedCount(0);
              }}
              variant="outline"
              className="mt-4 h-12 px-8"
            >
              Новая инспекция
            </Button>
          </div>
        )}
      </main>
    </div>
  );
}

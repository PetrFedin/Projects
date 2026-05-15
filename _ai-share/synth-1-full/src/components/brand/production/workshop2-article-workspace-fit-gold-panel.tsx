'use client';

import { useState } from 'react';
import * as LucideIcons from 'lucide-react';
import { useArticleWorkspace } from '@/components/brand/production/article-workspace-context';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Fit3DViewer } from '@/components/brand/production/fit-3d-viewer';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import type { Workshop2DossierPhase1 } from '@/lib/production/workshop2-dossier-phase1.types';
import { PanelShell } from '@/components/brand/production/workshop2-article-workspace-tab-panels-shell';
import { newW2ArticleTabPanelRowId as newRowId } from '@/components/brand/production/workshop2-article-workspace-tab-panels-shared';
import type { FitSession, FitGoldSnapshot } from '@/lib/production/article-workspace/types';

function FitSessionCard({
  session,
  idx,
  fg,
  mergeBundle,
  toast,
  createdByLabel
}: {
  session: FitSession;
  idx: number;
  fg: FitGoldSnapshot;
  mergeBundle: (patch: any) => void;
  toast: any;
  createdByLabel?: string;
}) {
  const [isAddingDelta, setIsAddingDelta] = useState(false);
  const [deltaName, setDeltaName] = useState('');
  const [deltaVal, setDeltaVal] = useState('');

  const [isAddingComment, setIsAddingComment] = useState(false);
  const [commentAnchor, setCommentAnchor] = useState('');
  const [commentText, setCommentText] = useState('');
  
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleAnalyzeFit = async () => {
    setIsAnalyzing(true);
    try {
      const res = await fetch('/api/brand/workshop2/fit-sessions/ai-analysis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          // Mock photo URL for now since we don't have real photos in FitSession yet
          photoUrls: ['data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEASABIAAD/2wBDAP//////////////////////////////////////////////////////////////////////////////////////wgALCAABAAEBAREA/8QAFBABAAAAAAAAAAAAAAAAAAAAAP/aAAGBAQABPxA=']
        })
      });
      
      if (!res.ok) throw new Error('Failed to analyze fit');
      
      const data = await res.json();
      if (data.aiFitAnalysis) {
        void mergeBundle({
          fitGold: {
            ...fg,
            sessions: fg.sessions?.map((s) => s.id === session.id ? {
              ...s,
              aiFitAnalysis: data.aiFitAnalysis
            } : s)
          }
        });
        toast({
          title: 'Анализ завершен',
          description: 'AI успешно проанализировал посадку.',
          className: 'bg-emerald-50 border-emerald-200 text-emerald-900',
        });
      }
    } catch (error) {
      console.error(error);
      toast({
        title: 'Ошибка анализа',
        description: 'Не удалось выполнить AI анализ посадки.',
        variant: 'destructive',
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleAddDelta = (e: React.FormEvent) => {
    e.preventDefault();
    if (!deltaName || !deltaVal || isNaN(Number(deltaVal))) return;
    void mergeBundle({
      fitGold: {
        ...fg,
        sessions: fg.sessions?.map((s) => s.id === session.id ? {
          ...s,
          measurementsDelta: { ...s.measurementsDelta, [deltaName]: Number(deltaVal) }
        } : s)
      }
    });
    setIsAddingDelta(false);
    setDeltaName('');
    setDeltaVal('');
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentAnchor || !commentText) return;
    void mergeBundle({
      fitGold: {
        ...fg,
        sessions: fg.sessions?.map((s) => s.id === session.id ? {
          ...s,
          comments: [
            ...s.comments,
            {
              id: newRowId(),
              targetAnchor: commentAnchor,
              text: commentText,
              photoUrls: [],
              by: createdByLabel || 'Конструктор',
              at: new Date().toISOString(),
            }
          ]
        } : s)
      }
    });
    setIsAddingComment(false);
    setCommentAnchor('');
    setCommentText('');
  };

  const handleStatusChange = () => {
    const statuses = ['pending', 'approved', 'rework', 'approved_with_comments'];
    const nextStatus = statuses[(statuses.indexOf(session.status) + 1) % statuses.length]!;
    void mergeBundle({
      fitGold: {
        ...fg,
        sessions: fg.sessions?.map((s) => s.id === session.id ? { ...s, status: nextStatus } : s)
      }
    });
  };

  const handleTypeChange = () => {
    const types = ['proto', 'sms', 'pps', 'top'];
    const nextType = types[(types.indexOf(session.sampleType) + 1) % types.length]!;
    void mergeBundle({
      fitGold: {
        ...fg,
        sessions: fg.sessions?.map((s) => s.id === session.id ? { ...s, sampleType: nextType } : s)
      }
    });
  };

  const hasDeltas = Object.keys(session.measurementsDelta).length > 0;
  const isApplied = fg.baseSpecUpdatedFromDeltasAt != null;

  return (
    <div className="border-border-default rounded-xl border bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between mb-4 border-b border-border-subtle pb-3">
        <div className="flex items-center gap-3">
          <Badge variant="outline" className="bg-bg-surface2 text-text-primary text-[10px] font-bold tracking-wide">
            {session.sampleType}
          </Badge>
          <span className="text-text-primary text-[12px] font-semibold">Сессия #{idx + 1}</span>
          <span className="text-text-muted text-[11px]">{session.dateStr}</span>
          {session.cadVersionId && (
            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 text-[10px] ml-2">
              <LucideIcons.FileCode2 className="w-3 h-3 mr-1" />
              CAD: {session.cadVersionId}
            </Badge>
          )}
        </div>
        <Badge
          variant="outline"
          className={
            session.status === 'approved'
              ? 'bg-emerald-50 text-emerald-700 border-emerald-200 text-[10px]'
              : session.status === 'rework'
              ? 'bg-rose-50 text-rose-700 border-rose-200 text-[10px]'
              : session.status === 'approved_with_comments'
              ? 'bg-blue-50 text-blue-700 border-blue-200 text-[10px]'
              : 'bg-amber-50 text-amber-700 border-amber-200 text-[10px]'
          }
        >
          {session.status.replace(/_/g, ' ')}
        </Badge>
      </div>
      
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <div className="rounded-lg bg-bg-surface2 p-3 border border-border-subtle">
          <div className="flex items-center justify-between mb-3">
            <p className="text-text-primary text-[11px] font-semibold tracking-wider">Отклонения мерок</p>
          </div>
          {!hasDeltas ? (
            <p className="text-text-secondary text-[11px] mb-2">Отклонений не зафиксировано.</p>
          ) : (
            <ul className="space-y-1.5 mb-3">
              {Object.entries(session.measurementsDelta).map(([k, v]) => (
                <li key={k} className="flex justify-between items-center text-[11px] bg-white border border-border-subtle px-2 py-1.5 rounded-md">
                  <span className="font-medium text-text-primary">{k}</span>
                  <span className={v > 0 ? "text-rose-600 font-mono font-medium" : v < 0 ? "text-emerald-600 font-mono font-medium" : "text-text-secondary font-mono"}>
                    {v > 0 ? `+${v}` : v} см
                  </span>
                </li>
              ))}
            </ul>
          )}

          {isAddingDelta ? (
            <form onSubmit={handleAddDelta} className="flex items-center gap-1.5 mt-2 bg-white p-1.5 rounded-md border border-border-subtle">
              <Input className="h-7 text-[11px] w-full px-2" placeholder="Мерка (chest)" value={deltaName} onChange={e => setDeltaName(e.target.value)} autoFocus />
              <Input className="h-7 text-[11px] w-16 px-2" placeholder="± см" value={deltaVal} onChange={e => setDeltaVal(e.target.value)} />
              <div className="flex gap-1">
                <Button type="submit" size="sm" variant="default" className="h-7 px-2 text-[10px]">ОК</Button>
                <Button type="button" size="sm" variant="ghost" className="h-7 px-2 text-[10px]" onClick={() => setIsAddingDelta(false)}>✕</Button>
              </div>
            </form>
          ) : (
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-7 w-full text-[10px] text-accent-primary border-dashed bg-white hover:bg-accent-soft"
              onClick={() => setIsAddingDelta(true)}
            >
              <LucideIcons.Plus className="h-3 w-3 mr-1" /> Добавить дельту
            </Button>
          )}
        </div>

        <div className="rounded-lg bg-bg-surface2 p-3 border border-border-subtle">
          <div className="flex items-center justify-between mb-3">
            <p className="text-text-primary text-[11px] font-semibold tracking-wider">Замечания к посадке</p>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-6 text-[10px] bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100"
              onClick={handleAnalyzeFit}
              disabled={isAnalyzing}
            >
              {isAnalyzing ? (
                <LucideIcons.Loader2 className="w-3 h-3 mr-1 animate-spin" />
              ) : (
                <LucideIcons.Sparkles className="w-3 h-3 mr-1" />
              )}
              Авто-анализ (AI)
            </Button>
          </div>
          
          {session.aiFitAnalysis && (
            <div className="mb-3 p-2.5 bg-purple-50 border border-purple-100 rounded-md">
              <div className="flex items-center gap-1.5 mb-2">
                <LucideIcons.Sparkles className="w-3.5 h-3.5 text-purple-600" />
                <span className="text-[11px] font-semibold text-purple-900">AI Анализ посадки</span>
              </div>
              
              {session.aiFitAnalysis.wrinklesDetected && session.aiFitAnalysis.wrinklesDetected.length > 0 && (
                <div className="mb-2">
                  <span className="text-[10px] font-medium text-purple-800 block mb-1">Обнаруженные заломы:</span>
                  <div className="flex flex-wrap gap-1">
                    {session.aiFitAnalysis.wrinklesDetected.map((wrinkle, i) => (
                      <Badge key={i} variant="outline" className="bg-white text-purple-700 border-purple-200 text-[9px]">
                        {wrinkle}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
              
              {session.aiFitAnalysis.recommendations && session.aiFitAnalysis.recommendations.length > 0 && (
                <div>
                  <span className="text-[10px] font-medium text-purple-800 block mb-1">Рекомендации конструктору:</span>
                  <ul className="list-disc pl-3 space-y-0.5">
                    {session.aiFitAnalysis.recommendations.map((rec, i) => (
                      <li key={i} className="text-[10px] text-purple-800">{rec}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {session.comments.length === 0 ? (
            <p className="text-text-secondary text-[11px] mb-2">Замечаний нет.</p>
          ) : (
            <ul className="space-y-2 mb-3">
              {session.comments.map((c) => (
                <li key={c.id} className="bg-white border border-border-subtle rounded-md p-2.5 text-[11px]">
                  <div className="font-semibold text-text-primary mb-1">{c.targetAnchor}</div>
                  <p className="text-text-secondary leading-relaxed">{c.text}</p>
                  <div className="mt-2 flex items-center justify-between text-text-muted text-[9px] font-medium">
                    <span>{c.by || 'Бренд'}</span>
                    <span>{c.at?.split('T')[0]}</span>
                  </div>
                </li>
              ))}
            </ul>
          )}

          {isAddingComment ? (
            <form onSubmit={handleAddComment} className="flex flex-col gap-1.5 mt-2 bg-white p-1.5 rounded-md border border-border-subtle">
              <Input className="h-7 text-[11px] px-2" placeholder="Привязка (например, Плечо)" value={commentAnchor} onChange={e => setCommentAnchor(e.target.value)} autoFocus />
              <Input className="h-7 text-[11px] px-2" placeholder="Комментарий (увеличить посадку)" value={commentText} onChange={e => setCommentText(e.target.value)} />
              <div className="flex justify-end gap-1.5 mt-1">
                <Button type="button" size="sm" variant="ghost" className="h-7 px-2 text-[10px]" onClick={() => setIsAddingComment(false)}>Отмена</Button>
                <Button type="submit" size="sm" variant="default" className="h-7 px-3 text-[10px]">Сохранить</Button>
              </div>
            </form>
          ) : (
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-7 w-full text-[10px] text-accent-primary border-dashed bg-white hover:bg-accent-soft"
              onClick={() => setIsAddingComment(true)}
            >
              <LucideIcons.Plus className="h-3 w-3 mr-1" /> Добавить комментарий
            </Button>
          )}
        </div>
      </div>
      
      <div className="flex flex-wrap items-center gap-2 mt-4 pt-3 border-t border-border-subtle">
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="h-8 text-[11px] bg-bg-surface2"
          onClick={handleStatusChange}
        >
          <LucideIcons.RefreshCcw className="h-3 w-3 mr-1.5 text-text-muted" />
          Сменить статус
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="h-8 text-[11px] bg-bg-surface2"
          onClick={handleTypeChange}
        >
          <LucideIcons.Tag className="h-3 w-3 mr-1.5 text-text-muted" />
          Сменить тип
        </Button>

        {session.cadVersionId && (
          <Dialog>
            <DialogTrigger asChild>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-8 text-[11px] bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100"
              >
                <LucideIcons.Box className="h-3 w-3 mr-1.5" />
                Посмотреть 3D
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl w-full h-[80vh] flex flex-col">
              <DialogHeader>
                <DialogTitle>3D Примерка — Сессия #{idx + 1}</DialogTitle>
              </DialogHeader>
              <div className="flex-1 min-h-0 bg-slate-50 rounded-md overflow-hidden border border-border-subtle">
                <Fit3DViewer modelUrl="/models/placeholder.glb" />
              </div>
            </DialogContent>
          </Dialog>
        )}
        
        {session.status === 'approved' && (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                type="button"
                variant={isApplied ? 'outline' : 'default'}
                size="sm"
                disabled={!hasDeltas || isApplied}
                className={`h-8 text-[11px] ml-auto ${isApplied ? 'text-emerald-700 bg-emerald-50 border-emerald-200 opacity-100' : 'bg-emerald-600 hover:bg-emerald-700 text-white'}`}
              >
                {isApplied ? (
                  <>
                    <LucideIcons.CheckCircle2 className="h-3.5 w-3.5 mr-1.5" />
                    Дельты применены к ТЗ
                  </>
                ) : (
                  <>
                    Применить дельты к базовой спецификации ТЗ
                  </>
                )}
              </Button>
            </AlertDialogTrigger>
            {!isApplied && hasDeltas && (
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Применить изменения к спецификации?</AlertDialogTitle>
                  <AlertDialogDescription asChild>
                    <div className="space-y-4 mt-2">
                      <p>
                        Внимание: это действие обновит базовую Таблицу измерений в утвержденном ТЗ на основе фактических отклонений этого сэмпла ({session.sampleType}).
                      </p>
                      <div className="bg-bg-surface2 p-3 rounded-md border border-border-subtle">
                        <p className="text-[12px] font-semibold text-text-primary mb-2">Будут применены следующие дельты:</p>
                        <ul className="space-y-1">
                          {Object.entries(session.measurementsDelta).map(([k, v]) => (
                            <li key={k} className="flex justify-between text-[12px]">
                              <span className="text-text-secondary">{k}</span>
                              <span className="font-mono text-text-primary font-medium">{v > 0 ? `+${v}` : v} см</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Отмена</AlertDialogCancel>
                  <AlertDialogAction
                    className="bg-emerald-600 hover:bg-emerald-700"
                    onClick={() => {
                      void mergeBundle({
                        fitGold: {
                          ...fg,
                          baseSpecUpdatedFromDeltasAt: new Date().toISOString()
                        }
                      });
                      toast({
                        title: 'Спецификация обновлена',
                        description: 'Таблица мерок артикула обновлена с учетом дельт примерки.',
                        className: 'bg-emerald-50 border-emerald-200 text-emerald-900',
                      });
                    }}
                  >
                    Применить
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            )}
          </AlertDialog>
        )}
      </div>
    </div>
  );
}

export function Workshop2ArticleFitGoldPanel({
  dossier = null,
  createdByLabel,
}: {
  dossier?: Workshop2DossierPhase1 | null;
  createdByLabel?: string;
} = {}) {
  const { bundle, loading, mergeBundle, dataMode } = useArticleWorkspace();
  const { toast } = useToast();
  const [newSessionCadVersion, setNewSessionCadVersion] = useState<string>('');

  if (loading || !bundle) return <p className="text-text-secondary text-[12px]">Загрузка…</p>;
  const fg = bundle.fitGold!;
  const sessions = fg.sessions ?? [];

  return (
    <div className="space-y-4">
      <div className="border-border-default rounded-xl border bg-white p-4 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div className="flex min-w-0 flex-1 items-start gap-3">
            <div className="bg-accent-primary/10 text-accent-primary flex h-8 w-8 shrink-0 items-center justify-center rounded-lg">
              <LucideIcons.Scissors className="h-4 w-4 shrink-0" aria-hidden />
            </div>
            <div className="min-w-0 flex-1 space-y-1">
              <div className="flex items-center gap-2">
                <h2 className="text-text-primary text-base font-semibold">Эталон и посадка (Fit)</h2>
                <span className="bg-slate-100 text-slate-600 text-[10px] px-2 py-0.5 rounded-full font-medium">
                  Ответственный: Конструктор
                </span>
              </div>
              <p className="text-text-secondary text-xs leading-snug">
                Сессии примерки образцов, фиксация дельт по меркам и комментарии. Когда посадка утверждена, дельты переносятся в базовый табель мер.
              </p>
            </div>
          </div>
          <span
            className="border-border-default bg-bg-surface2 text-text-secondary shrink-0 rounded border px-1.5 py-0.5 font-mono text-[9px]"
            title={dataMode === 'http' ? 'Данные с API' : 'Локальные данные в браузере'}
          >
            {dataMode === 'http' ? 'API' : 'local'}
          </span>
        </div>
        
        <div className="border-border-subtle flex flex-col gap-1.5 border-t border-dotted pt-2.5 mt-4">
          <div className="flex flex-wrap gap-1.5">
            <span className="bg-bg-surface2/70 text-text-primary max-w-full rounded border border-border-subtle px-2 py-1 text-[10px] leading-snug">
              <span className="text-text-muted font-bold">Суть</span> · Примерок (сессий): {sessions.length}
            </span>
            <span className="text-text-primary max-w-full rounded border border-border-subtle bg-white px-2 py-1 text-[10px] font-semibold leading-snug">
              <span className="text-text-muted font-bold">Гот.</span> ·{' '}
              {fg.goldApproved
                ? 'Сэмпл принят в коллекцию'
                : sessions.length === 0
                  ? 'Нет сессий'
                  : sessions.some((s) => s.status.includes('approved'))
                    ? 'Эталон утвержден'
                    : 'Идет примерка'}
            </span>
            <span className="text-accent-primary max-w-full rounded border border-accent-primary/25 bg-accent-primary/8 px-2 py-1 text-[10px] font-semibold leading-snug">
              <span className="font-bold opacity-80">Далее</span> ·{' '}
              {fg.goldApproved
                ? 'Переходите к плану PO и запуску.'
                : 'Создайте сессию примерки, внесите дельты.'}
            </span>
          </div>
        </div>

        <div className="min-w-0 space-y-4 mt-4">
          <div className="border-border-subtle mb-4 flex flex-wrap items-center gap-3 border-b pb-4">
            {fg.virtualFitScore != null ? (
              <div className="flex items-center gap-2">
                <span className="text-text-muted text-[10px] font-bold tracking-wider">
                  Оценка виртуальной примерки:
                </span>
                <Badge className="h-5 border-emerald-100 bg-emerald-50 text-[10px] text-emerald-700">
                  {fg.virtualFitScore}%
                </Badge>
              </div>
            ) : (
              <p className="text-text-secondary text-[11px]">Оценка виртуальной примерки ещё не рассчитана.</p>
            )}
            {fg.baseSpecUpdatedFromDeltasAt && (
              <div className="flex items-center gap-1.5 ml-auto text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
                <LucideIcons.CheckCircle2 className="h-3.5 w-3.5" />
                <span className="text-[11px] font-medium">Базовая спецификация синхронизирована</span>
              </div>
            )}
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between border-b pb-2">
              <p className="text-text-primary text-sm font-semibold flex items-center gap-1.5">
                <LucideIcons.Ruler className="w-4 h-4 text-slate-400" />
                История примерок
              </p>
              <div className="flex gap-2 items-center">
                <Input 
                  placeholder="ID лекал (CAD)" 
                  value={newSessionCadVersion} 
                  onChange={e => setNewSessionCadVersion(e.target.value)}
                  className="h-8 w-32 text-[11px]"
                />
                {dossier?.sampleBasePerSizeDimensions ? (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="h-8 gap-1.5 text-[11px] text-indigo-600 border-indigo-200 hover:bg-indigo-50"
                    onClick={() => {
                      const baseDims = dossier.sampleBasePerSizeDimensions;
                      const keys = new Set<string>();
                      if (baseDims) {
                        for (const row of Object.values(baseDims)) {
                          if (row) {
                            for (const k of Object.keys(row)) {
                              if (String(row[k] ?? '').trim() !== '') keys.add(k);
                            }
                          }
                        }
                      }
                      const initialDeltas: Record<string, number> = {};
                      for (const k of keys) initialDeltas[k] = 0;
                      
                      void mergeBundle({
                        fitGold: {
                          ...fg,
                          sessions: [
                            ...sessions,
                            {
                              id: newRowId(),
                              sampleType: 'proto',
                              status: 'pending',
                              dateStr: new Date().toISOString().split('T')[0]!,
                              measurementsDelta: initialDeltas,
                              comments: [],
                              cadVersionId: newSessionCadVersion || null,
                            },
                          ],
                        },
                      });
                      setNewSessionCadVersion('');
                      toast({
                        title: 'Сессия создана',
                        description: `Создана сессия с ${keys.size} базовыми мерками из ТЗ.`,
                      });
                    }}
                  >
                    <LucideIcons.Download className="h-3.5 w-3.5" /> Загрузить мерки ТЗ
                  </Button>
                ) : null}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="h-8 gap-1.5 text-[11px]"
                  onClick={() => {
                    void mergeBundle({
                      fitGold: {
                        ...fg,
                        sessions: [
                          ...sessions,
                          {
                            id: newRowId(),
                            sampleType: 'proto',
                            status: 'pending',
                            dateStr: new Date().toISOString().split('T')[0]!,
                            measurementsDelta: {},
                            comments: [],
                            cadVersionId: newSessionCadVersion || null,
                          },
                        ],
                      },
                    });
                    setNewSessionCadVersion('');
                  }}
                >
                  <LucideIcons.Plus className="h-3.5 w-3.5" /> Добавить примерку
                </Button>
                <Button
                  type="button"
                  variant={fg.goldApproved ? 'outline' : 'default'}
                  size="sm"
                  className={`h-8 gap-1.5 text-[11px] ${fg.goldApproved ? 'text-emerald-700 bg-emerald-50 border-emerald-200 hover:bg-emerald-100' : 'bg-emerald-600 hover:bg-emerald-700 text-white'}`}
                  onClick={() => {
                    void mergeBundle({
                      fitGold: {
                        ...fg,
                        goldApproved: !fg.goldApproved,
                        approvedAt: !fg.goldApproved ? new Date().toISOString() : undefined,
                      },
                    });
                    toast({
                      title: !fg.goldApproved ? 'Сэмпл утверждён' : 'Утверждение снято',
                      description: !fg.goldApproved ? 'Эталон принят в коллекцию.' : 'Статус эталона сброшен.',
                      className: !fg.goldApproved ? 'bg-emerald-50 border-emerald-200 text-emerald-900' : '',
                    });
                  }}
                >
                  {fg.goldApproved ? (
                    <>
                      <LucideIcons.CheckCircle2 className="h-3.5 w-3.5" /> Сэмпл утверждён
                    </>
                  ) : (
                    <>
                      <LucideIcons.Check className="h-3.5 w-3.5" /> Утвердить сэмпл
                    </>
                  )}
                </Button>
              </div>
            </div>

            {sessions.length === 0 ? (
              <p className="text-text-secondary text-[11px]">Сессий примерок пока нет — добавьте первую.</p>
            ) : (
              <div className="space-y-4">
                {sessions.map((session, idx) => (
                  <FitSessionCard
                    key={session.id}
                    session={session}
                    idx={idx}
                    fg={fg}
                    mergeBundle={mergeBundle}
                    toast={toast}
                    createdByLabel={createdByLabel}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

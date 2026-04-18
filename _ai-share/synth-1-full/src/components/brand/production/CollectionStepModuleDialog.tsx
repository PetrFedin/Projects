'use client';

import Link from 'next/link';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { ListTodo, MessageSquare, Paperclip, History, UserCircle } from 'lucide-react';
import type { CollectionStep } from '@/lib/production/collection-steps-catalog';
import type { MatrixStepStatus } from '@/lib/production/unified-sku-flow-store';
import {
  BRAND_COLLECTION_STAGE_MODULES_SAVED,
  addStepModuleAttachment,
  appendStepModuleReviewRequest,
  getStepModule,
  loadCollectionStageModules,
  patchStepModuleFields,
  removeStepModuleAttachment,
  saveCollectionStageModules,
  type CollectionStageAuditEntry,
  type CollectionStageModulesDoc,
} from '@/lib/production/collection-stage-modules-store';
import {
  buildCollectionStageReviewMessagesUrl,
  buildCollectionStageReviewTasksUrl,
  submitCollectionStageReviewRequest,
} from '@/lib/production/collection-stage-collaboration';
import {
  getFormFieldsForStep,
  hasSubstantiveModuleContent,
} from '@/lib/production/collection-step-form-fields';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

const STATUS_RU: Record<MatrixStepStatus, string> = {
  not_started: 'Не начато',
  in_progress: 'В работе',
  done: 'Готово',
};

function auditActionRu(e: CollectionStageAuditEntry): string {
  switch (e.action) {
    case 'save':
      return 'Сохранение';
    case 'field_change':
      return 'Поле';
    case 'attachment_add':
      return 'Вложение';
    case 'attachment_remove':
      return 'Удаление';
    case 'review_request':
      return 'Согласование';
    default:
      return e.action;
  }
}

function formatAt(iso: string): string {
  try {
    const d = new Date(iso);
    return d.toLocaleString('ru-RU', { dateStyle: 'short', timeStyle: 'short' });
  } catch {
    return iso;
  }
}

export type CollectionModuleSaveEvent = {
  stepId: string;
  /** Раньше все поля формы были пусты, после сохранения есть содержание */
  firstSubstantiveSave: boolean;
};

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  step: CollectionStep | null;
  collectionFlowKey: string;
  /** id коллекции из URL (для deep link в задачи/чат) */
  collectionId: string;
  matrixStatus?: MatrixStepStatus;
  onAfterModuleSave?: (e: CollectionModuleSaveEvent) => void;
};

export function CollectionStepModuleDialog({
  open,
  onOpenChange,
  step,
  collectionFlowKey,
  collectionId,
  matrixStatus,
  onAfterModuleSave,
}: Props) {
  const [doc, setDoc] = useState<CollectionStageModulesDoc>(() => ({ v: 1, steps: {} }));
  const [draftFields, setDraftFields] = useState<Record<string, string>>({});
  const [actorLabel, setActorLabel] = useState('Демо-пользователь');
  const [attName, setAttName] = useState('');
  const [attRef, setAttRef] = useState('');
  const [reviewSubmitting, setReviewSubmitting] = useState(false);

  const refresh = useCallback(() => {
    setDoc(loadCollectionStageModules(collectionFlowKey));
  }, [collectionFlowKey]);

  useEffect(() => {
    refresh();
  }, [collectionFlowKey, refresh]);

  useEffect(() => {
    const h = (e: Event) => {
      const k = (e as CustomEvent<{ collectionKey?: string }>).detail?.collectionKey;
      if (k === collectionFlowKey) refresh();
    };
    window.addEventListener(BRAND_COLLECTION_STAGE_MODULES_SAVED, h as EventListener);
    return () =>
      window.removeEventListener(BRAND_COLLECTION_STAGE_MODULES_SAVED, h as EventListener);
  }, [collectionFlowKey, refresh]);

  useEffect(() => {
    if (!open || !step) return;
    const d = loadCollectionStageModules(collectionFlowKey);
    setDoc(d);
    const m = getStepModule(d, step.id);
    const defs = getFormFieldsForStep(step.id);
    const merged: Record<string, string> = {};
    for (const def of defs) merged[def.key] = m.fields[def.key] ?? '';
    setDraftFields(merged);
    setAttName('');
    setAttRef('');
  }, [open, step?.id, collectionFlowKey, step]);

  const moduleSlice = useMemo(() => (step ? getStepModule(doc, step.id) : null), [doc, step]);
  const fieldDefs = useMemo(() => (step ? getFormFieldsForStep(step.id) : []), [step]);

  const fieldLabel = useCallback(
    (key: string) => fieldDefs.find((f) => f.key === key)?.label ?? key,
    [fieldDefs]
  );

  const reviewLinkInput = useMemo(
    () =>
      step
        ? {
            collectionId: collectionId || '',
            stepId: step.id,
            stepTitle: step.title,
          }
        : null,
    [collectionId, step]
  );

  const tasksReviewUrl = reviewLinkInput ? buildCollectionStageReviewTasksUrl(reviewLinkInput) : '';
  const messagesReviewUrl = reviewLinkInput
    ? buildCollectionStageReviewMessagesUrl(reviewLinkInput)
    : '';

  const handleSave = () => {
    if (!step) return;
    const actor = actorLabel.trim() || 'Не указано';
    const prevMod = getStepModule(doc, step.id);
    const hadSubstantive = hasSubstantiveModuleContent(prevMod.fields, fieldDefs);
    const willSubstantive = hasSubstantiveModuleContent(draftFields, fieldDefs);
    const next = patchStepModuleFields(doc, step.id, draftFields, actor);
    saveCollectionStageModules(collectionFlowKey, next);
    setDoc(next);
    onAfterModuleSave?.({
      stepId: step.id,
      firstSubstantiveSave: !hadSubstantive && willSubstantive,
    });
  };

  const handleReviewStub = async () => {
    if (!step) return;
    const actor = actorLabel.trim() || 'Не указано';
    setReviewSubmitting(true);
    try {
      const res = await submitCollectionStageReviewRequest({
        collectionKey: collectionFlowKey,
        collectionIdLabel: collectionId || collectionFlowKey,
        stepId: step.id,
        stepTitle: step.title,
        actorLabel: actor,
        channels: ['tasks', 'messages'],
        summaryNote: `Согласование модуля этапа «${step.title}»`,
      });
      const note = res.ok
        ? `Запрос отправлен (stub API). Ref задачи: ${res.taskRef ?? '—'}; тред: ${res.messageThreadRef ?? '—'}`
        : `Ошибка запроса: ${res.error ?? 'unknown'}`;
      const next = appendStepModuleReviewRequest(doc, step.id, actor, note);
      saveCollectionStageModules(collectionFlowKey, next);
      setDoc(next);
    } finally {
      setReviewSubmitting(false);
    }
  };

  const handleAddAttachment = () => {
    if (!step || !attName.trim()) return;
    const actor = actorLabel.trim() || 'Не указано';
    const next = addStepModuleAttachment(
      doc,
      step.id,
      { name: attName.trim(), ref: attRef.trim() || '—', addedBy: actor },
      actor
    );
    saveCollectionStageModules(collectionFlowKey, next);
    setDoc(next);
    setAttName('');
    setAttRef('');
  };

  const handleRemoveAttachment = (id: string) => {
    if (!step) return;
    const actor = actorLabel.trim() || 'Не указано';
    const next = removeStepModuleAttachment(doc, step.id, id, actor);
    saveCollectionStageModules(collectionFlowKey, next);
    setDoc(next);
  };

  if (!step) return null;

  const attachments = moduleSlice?.attachments ?? [];
  const history = moduleSlice?.history ?? [];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="flex max-h-[min(90vh,820px)] max-w-3xl flex-col gap-0 overflow-hidden p-0 sm:rounded-xl"
        ariaTitle={`${step.title} — модуль этапа`}
      >
        <DialogHeader className="border-border-subtle shrink-0 space-y-1 border-b px-4 pb-3 pt-4 text-left">
          <div className="flex flex-wrap items-center gap-2 pr-8">
            <DialogTitle className="text-base leading-snug">{step.title}</DialogTitle>
            {matrixStatus ? (
              <Badge variant="outline" className="text-[9px] font-bold uppercase">
                Матрица SKU: {STATUS_RU[matrixStatus] ?? matrixStatus}
              </Badge>
            ) : null}
          </div>
          <DialogDescription className="text-xs leading-relaxed">
            {step.description}
          </DialogDescription>
        </DialogHeader>

        <div className="min-h-0 flex-1 space-y-4 overflow-y-auto px-4 py-3">
          <div className="border-border-subtle bg-bg-surface2/80 flex flex-wrap items-end gap-2 rounded-lg border p-3">
            <div className="flex min-w-[200px] flex-1 items-center gap-2">
              <UserCircle className="text-text-muted h-4 w-4 shrink-0" aria-hidden />
              <div className="min-w-0 flex-1">
                <p className="text-text-muted text-[9px] font-bold uppercase">
                  Кто вносит изменения
                </p>
                <Input
                  className="mt-0.5 h-8 text-xs"
                  value={actorLabel}
                  onChange={(e) => setActorLabel(e.target.value)}
                  placeholder="ФИО или роль"
                />
              </div>
            </div>
            <p className="text-text-secondary text-[10px]">
              История и вложения подписываются этим именем (до интеграции с SSO).
            </p>
          </div>

          <section>
            <h3 className="text-text-secondary mb-2 text-[10px] font-black uppercase tracking-wider">
              Данные этапа
            </h3>
            <div className="space-y-3">
              {fieldDefs.map((def) => (
                <div key={def.key}>
                  <p className="text-text-muted mb-1 text-[9px] font-bold uppercase">{def.label}</p>
                  {def.type === 'textarea' ? (
                    <Textarea
                      className="min-h-[64px] text-xs"
                      placeholder={def.placeholder}
                      value={draftFields[def.key] ?? ''}
                      onChange={(e) => setDraftFields((p) => ({ ...p, [def.key]: e.target.value }))}
                    />
                  ) : (
                    <Input
                      className="h-9 text-xs"
                      type={def.type === 'number' ? 'number' : 'text'}
                      placeholder={def.placeholder}
                      value={draftFields[def.key] ?? ''}
                      onChange={(e) => setDraftFields((p) => ({ ...p, [def.key]: e.target.value }))}
                    />
                  )}
                </div>
              ))}
            </div>
          </section>

          <section>
            <h3 className="text-text-secondary mb-2 flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider">
              <Paperclip className="h-3.5 w-3.5" aria-hidden />
              Вложения (ссылки / ID файлов)
            </h3>
            <div className="flex flex-wrap gap-2">
              <Input
                className="h-8 min-w-[140px] flex-1 text-xs"
                placeholder="Название"
                value={attName}
                onChange={(e) => setAttName(e.target.value)}
              />
              <Input
                className="h-8 min-w-[180px] flex-[2] text-xs"
                placeholder="URL или ID в DAM / PDM"
                value={attRef}
                onChange={(e) => setAttRef(e.target.value)}
              />
              <Button
                type="button"
                size="sm"
                variant="secondary"
                className="h-8 text-[10px]"
                onClick={handleAddAttachment}
              >
                Добавить
              </Button>
            </div>
            <ul className="mt-2 space-y-1.5">
              {attachments.length === 0 ? (
                <li className="text-text-muted text-[10px]">Пока нет вложений</li>
              ) : (
                attachments.map((a) => (
                  <li
                    key={a.id}
                    className="border-border-subtle flex flex-wrap items-center justify-between gap-2 rounded-md border bg-white px-2 py-1.5 text-[10px]"
                  >
                    <span className="text-text-primary font-medium">{a.name}</span>
                    <span className="text-text-secondary truncate">{a.ref}</span>
                    <span className="text-text-muted">
                      {formatAt(a.addedAt)} · {a.addedBy}
                    </span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-7 text-[9px] text-rose-600"
                      onClick={() => handleRemoveAttachment(a.id)}
                    >
                      Удалить
                    </Button>
                  </li>
                ))
              )}
            </ul>
          </section>

          <section>
            <h3 className="text-text-secondary mb-2 flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider">
              <History className="h-3.5 w-3.5" aria-hidden />
              История изменений
            </h3>
            <div className="border-border-subtle bg-bg-surface2/80 max-h-52 overflow-y-auto rounded-lg border">
              {history.length === 0 ? (
                <p className="text-text-muted p-3 text-[10px]">
                  Записей пока нет — сохраните черновик или добавьте вложение.
                </p>
              ) : (
                <ul className="divide-border-subtle divide-y">
                  {history.map((e) => (
                    <li key={e.id} className="px-3 py-2 text-[10px] leading-snug">
                      <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
                        <span className="text-text-primary font-semibold">{formatAt(e.at)}</span>
                        <span className="text-text-secondary">{e.actorLabel}</span>
                        <Badge variant="outline" className="h-5 text-[8px] font-bold uppercase">
                          {auditActionRu(e)}
                        </Badge>
                      </div>
                      {e.action === 'field_change' && e.fieldKey ? (
                        <p className="text-text-secondary mt-1">
                          <span className="font-medium">{fieldLabel(e.fieldKey)}</span>
                          {e.oldValue || e.newValue ? (
                            <>
                              :{' '}
                              <span className="text-rose-600 line-through">
                                {e.oldValue || '∅'}
                              </span>
                              {' → '}
                              <span className="text-emerald-700">{e.newValue || '∅'}</span>
                            </>
                          ) : null}
                        </p>
                      ) : null}
                      {e.note ? <p className="text-text-secondary mt-0.5">{e.note}</p> : null}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </section>
        </div>

        <DialogFooter className="border-border-subtle bg-bg-surface2/80 shrink-0 flex-col items-stretch gap-3 border-t px-4 py-3">
          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              variant="default"
              size="sm"
              className="h-9 text-xs"
              onClick={handleSave}
            >
              Сохранить в базу (демо LS)
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-9 text-xs"
              disabled={reviewSubmitting}
              onClick={() => void handleReviewStub()}
            >
              {reviewSubmitting ? 'Отправка…' : 'Зафиксировать запрос (API stub)'}
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              variant="secondary"
              size="sm"
              className="h-9 gap-1 text-[10px]"
              asChild
            >
              <Link href={tasksReviewUrl} target="_blank" rel="noreferrer">
                <ListTodo className="h-3.5 w-3.5 shrink-0" aria-hidden />
                Задачи · согласование
              </Link>
            </Button>
            <Button
              type="button"
              variant="secondary"
              size="sm"
              className="h-9 gap-1 text-[10px]"
              asChild
            >
              <Link href={messagesReviewUrl} target="_blank" rel="noreferrer">
                <MessageSquare className="h-3.5 w-3.5 shrink-0" aria-hidden />
                Чат · обсуждение
              </Link>
            </Button>
          </div>
          <p className="text-text-secondary text-[9px] leading-snug">
            Ссылки передают <span className="font-mono">collectionId</span>,{' '}
            <span className="font-mono">stagesStep</span> и{' '}
            <span className="font-mono">reviewFlow=collection_stage_module</span> — страницы
            задач/чата смогут подхватить контекст при доработке UI. Stub API пишет ref в журнал;
            замените на <span className="font-mono">submitCollectionStageReviewRequest</span> →
            REST.
          </p>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

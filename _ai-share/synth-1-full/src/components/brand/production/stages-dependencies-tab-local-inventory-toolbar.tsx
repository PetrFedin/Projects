'use client';

import React, { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import type { StagesLocalInventoryTools } from '@/components/brand/production/stages-dependencies-tab-content-helpers';
import { cn } from '@/lib/utils';
import { Download, FolderPlus, Plus, Trash2, Upload } from 'lucide-react';

export function StagesLocalInventoryToolbar({
  tools,
  layout = 'card',
}: {
  tools: StagesLocalInventoryTools;
  /** plain — компактная панель без тяжёлого Card (раскрывается по кнопке). */
  layout?: 'card' | 'plain';
}) {
  const [sku, setSku] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [colId, setColId] = useState('');
  const [colName, setColName] = useState('');
  const [formError, setFormError] = useState('');
  const [importReplaceAll, setImportReplaceAll] = useState(false);
  const [importFeedback, setImportFeedback] = useState<{ tone: 'ok' | 'err'; text: string } | null>(
    null
  );
  const fileInputRef = useRef<HTMLInputElement>(null);

  const collectionLabel =
    tools.collectionId.trim() === ''
      ? 'по умолчанию (все демо-артикулы + локальные в общий пул)'
      : `«${tools.collectionId}»`;

  const submitArticle = () => {
    if (!sku.trim()) {
      setFormError('Введите код артикула (например SS28-JKT-01).');
      return;
    }
    if (tools.isSkuDuplicate(sku.trim())) {
      setFormError('Такой код SKU уже есть в текущей коллекции.');
      return;
    }
    setFormError('');
    const ok = tools.onAddArticle(sku.trim(), displayName.trim() || undefined);
    if (!ok) {
      setFormError('Не удалось добавить артикул (проверьте дубликат кода).');
      return;
    }
    setSku('');
    setDisplayName('');
  };

  const submitCollection = () => {
    if (!colId.trim()) {
      setFormError('Введите код коллекции (латиница, цифры, дефис).');
      return;
    }
    setFormError('');
    tools.onCreateCollection(colId.trim(), colName.trim() || colId.trim());
    setColId('');
    setColName('');
  };

  const onPickImportFile = () => fileInputRef.current?.click();

  const onImportFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    e.target.value = '';
    if (!f) return;
    const reader = new FileReader();
    reader.onload = () => {
      const text = typeof reader.result === 'string' ? reader.result : '';
      const res = tools.onImportInventory(text, importReplaceAll);
      setImportFeedback({ tone: res.ok ? 'ok' : 'err', text: res.message });
    };
    reader.readAsText(f);
  };

  const emptyCol = tools.totalArticlesInCollection === 0;

  const body = (
    <>
      <input
        ref={fileInputRef}
        type="file"
        accept="application/json,.json"
        className="hidden"
        aria-hidden
        onChange={onImportFileChange}
      />
      {formError ? (
        <p
          className="rounded-md border border-rose-200 bg-rose-50/90 px-2 py-1.5 text-[10px] font-medium text-rose-700"
          role="alert"
        >
          {formError}
        </p>
      ) : null}
      {importFeedback ? (
        <p
          className={cn(
            'rounded-md border px-2 py-1.5 text-[10px] font-medium',
            importFeedback.tone === 'ok'
              ? 'border-emerald-200 bg-emerald-50/90 text-emerald-800'
              : 'border-rose-200 bg-rose-50/90 text-rose-700'
          )}
          role="status"
        >
          {importFeedback.text}
        </p>
      ) : null}
      <div className="flex flex-wrap gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="h-8 gap-1 text-[10px]"
          onClick={() => tools.onExportInventory()}
        >
          <Download className="h-3 w-3" aria-hidden />
          Черновики коллекций
        </Button>
        {tools.onExportUnifiedFlow ? (
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="h-8 gap-1 text-[10px]"
            onClick={() => tools.onExportUnifiedFlow?.()}
          >
            <Download className="h-3 w-3" aria-hidden />
            Flow по SKU
          </Button>
        ) : null}
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="h-8 gap-1 text-[10px]"
          onClick={onPickImportFile}
        >
          <Upload className="h-3 w-3" aria-hidden />
          Импорт JSON
        </Button>
        <label className="text-text-secondary flex cursor-pointer select-none items-center gap-1.5 text-[10px]">
          <Checkbox
            checked={importReplaceAll}
            onCheckedChange={(v) => setImportReplaceAll(v === true)}
          />
          Заменить всё (не сливать)
        </label>
      </div>
      {tools.isUserDefinedCollection ? (
        <div className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-amber-200/90 bg-amber-50/50 px-3 py-2">
          <p className="text-[10px] leading-snug text-amber-950">
            Это <strong>ваша локальная коллекция</strong> — можно удалить целиком вместе с
            артикулами.
          </p>
          <Button
            type="button"
            variant="destructive"
            size="sm"
            className="h-7 shrink-0 gap-1 text-[9px]"
            onClick={() => tools.onRemoveUserCollection()}
          >
            <Trash2 className="h-3 w-3" aria-hidden />
            Удалить коллекцию
          </Button>
        </div>
      ) : null}
      {emptyCol ? (
        <div className="space-y-2 rounded-lg border border-emerald-100/90 bg-white/80 p-3">
          <p className="text-[9px] font-bold uppercase tracking-wide text-emerald-800">
            Новая коллекция
          </p>
          <p className="text-text-secondary text-[10px] leading-snug">
            Создаётся запись в списке коллекций и открывается контекст{' '}
            <code className="text-[9px]">collectionId</code> — дальше добавьте артикулы ниже.
          </p>
          <div className="flex flex-col flex-wrap gap-2 sm:flex-row">
            <Input
              className="h-8 text-[10px] sm:max-w-[10rem]"
              placeholder="Код: SS28-PRE"
              value={colId}
              onChange={(e) => setColId(e.target.value)}
              aria-label="Код новой коллекции"
            />
            <Input
              className="h-8 min-w-[8rem] flex-1 text-[10px]"
              placeholder="Название (необязательно)"
              value={colName}
              onChange={(e) => setColName(e.target.value)}
              aria-label="Название новой коллекции"
            />
            <Button
              type="button"
              size="sm"
              className="h-8 shrink-0 gap-1 text-[10px] font-semibold"
              variant="secondary"
              onClick={submitCollection}
            >
              <FolderPlus className="h-3 w-3" aria-hidden />
              Создать и открыть
            </Button>
          </div>
        </div>
      ) : null}
      <div className="border-border-default/90 space-y-2 rounded-lg border bg-white/90 p-3">
        <p className="text-text-secondary text-[9px] font-bold uppercase tracking-wide">
          {emptyCol ? 'Первый артикул в этой коллекции' : 'Добавить артикул'}
        </p>
        <div className="flex flex-col flex-wrap items-stretch gap-2 sm:flex-row sm:items-center">
          <Input
            className="h-8 text-[10px] sm:max-w-[11rem]"
            placeholder="Код SKU *"
            value={sku}
            onChange={(e) => setSku(e.target.value)}
            aria-label="Код нового артикула"
          />
          <Input
            className="h-8 min-w-[8rem] flex-1 text-[10px]"
            placeholder="Название модели (необязательно)"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            aria-label="Название модели"
          />
          <Button
            type="button"
            size="sm"
            className="h-8 shrink-0 gap-1 text-[10px] font-semibold"
            onClick={submitArticle}
          >
            <Plus className="h-3 w-3" aria-hidden />
            Добавить в коллекцию
          </Button>
        </div>
      </div>
      {tools.localRemovableArticles.length > 0 ? (
        <div className="border-border-default/80 bg-bg-surface2/60 space-y-2 rounded-lg border p-3">
          <p className="text-text-secondary text-[9px] font-bold uppercase tracking-wide">
            Локальные артикулы (удаление)
          </p>
          <ul className="max-h-32 space-y-1.5 overflow-y-auto">
            {tools.localRemovableArticles.map((a) => (
              <li key={a.id} className="flex items-center justify-between gap-2 text-[10px]">
                <span className="text-text-primary truncate font-mono" title={a.id}>
                  {a.sku}
                </span>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-7 w-7 shrink-0 p-0 text-rose-600 hover:text-rose-700"
                  aria-label={`Удалить артикул ${a.sku}`}
                  onClick={() => {
                    if (
                      typeof window !== 'undefined' &&
                      !window.confirm(`Удалить локальный артикул ${a.sku}?`)
                    )
                      return;
                    tools.onRemoveLocalArticle(a.id);
                  }}
                >
                  <Trash2 className="h-3.5 w-3.5" aria-hidden />
                </Button>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </>
  );

  if (layout === 'plain') {
    return (
      <div className="space-y-3 rounded-lg border border-emerald-200/80 bg-white/95 p-3 shadow-sm">
        <p className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wide text-emerald-900">
          <Plus className="h-3.5 w-3.5 shrink-0" aria-hidden />
          Коллекция и артикулы
        </p>
        <p className="text-text-secondary -mt-1 text-[9px] leading-snug">
          Контекст {collectionLabel}. Импорт/экспорт, добавление SKU — без API (
          <strong className="text-text-primary">ProductionDataPort</strong> / localStorage).
        </p>
        {body}
      </div>
    );
  }

  return (
    <Card className="border-emerald-200/90 bg-gradient-to-br from-emerald-50/40 to-white">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-[11px] uppercase tracking-tight text-emerald-900">
          <Plus className="h-3.5 w-3.5 shrink-0" aria-hidden />
          Коллекция и артикулы (локально, без API)
        </CardTitle>
        <CardDescription className="text-text-secondary text-[10px] leading-relaxed">
          Данные в <strong className="text-text-primary">localStorage</strong>; контекст{' '}
          {collectionLabel}. Импорт/экспорт — перенос между браузерами. Записи процесса по SKU
          синхронизируются при удалении. Дальше —{' '}
          <strong className="text-text-primary">ProductionDataPort</strong>.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3 pt-0">{body}</CardContent>
    </Card>
  );
}

'use client';

import { useCallback, useEffect, useLayoutEffect, useMemo, useState, type ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Workshop2CategoryHandbookGuidance } from '@/components/brand/production/Workshop2CategoryHandbookGuidance';
import {
  findHandbookLeafById,
  getHandbookAudiencesWorkshop2,
  getHandbookCategoryLeaves,
  handbookL1OptionsForAudience,
  handbookL2OptionsForAudience,
  handbookL3OptionsForAudience,
  handbookLeafIdFromL123,
  resolveHandbookLeafId,
} from '@/lib/production/category-catalog';
import { appendWorkshop2Activity } from '@/lib/production/workshop2-activity-log';
import type {
  LocalOrderLine,
  Workshop2ArticleCommit,
} from '@/lib/production/local-collection-inventory';
import type {
  Workshop2TzSignatoryBindings,
  Workshop2TzSignatoryExtraRow,
} from '@/lib/production/workshop2-dossier-phase1.types';
import {
  getWorkshopTzSignatoryPickerOptions,
  normalizeWorkshopTzSignatoryBindings,
  WORKSHOP2_TZ_EXTRA_ROLE_PRESET_DEFS,
  WORKSHOP2_TZ_EXTRA_ROLE_PRESET_BUTTON_LABEL_RU,
  workshop2TzExtraRowFromPreset,
  type Workshop2TzExtraRolePresetId,
} from '@/lib/production/workshop2-tz-signatory-options';
import { cn } from '@/lib/utils';
import { X } from 'lucide-react';

const ATTACH_MAX_BYTES = 400_000;
const ATTACH_MAX_FILES = 5;

const DRAFT_STORAGE_VER = 1;

function workshop2ArticleDraftKey(collectionId: string): string {
  return `synth.workshop2.articleDraft.v${DRAFT_STORAGE_VER}:${collectionId}`;
}

type ArticleDraftV1 = {
  v: 1;
  mode: 'base' | 'new';
  baseLineId: string;
  baseSearch: string;
  sku: string;
  name: string;
  comment: string;
  audienceId: string;
  l1Name: string;
  l2Name: string;
  l3Name: string;
  tzDesigner?: string;
  tzTechnologist?: string;
  tzManager?: string;
  tzExtraRows?: Workshop2TzSignatoryExtraRow[];
};

export type Workshop2EditArticlePayload = {
  articleId: string;
  sku: string;
  name: string;
  comment: string;
  categoryLeafId: string;
  workshopAttachments: { name: string; dataUrl: string }[];
};

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  collectionId: string;
  collectionDisplayName: string;
  pickerLines: LocalOrderLine[];
  /** false — дубликат SKU в этой коллекции (нормализованный код). */
  onCommit: (collectionId: string, commit: Workshop2ArticleCommit) => boolean;
  /** Редактирование существующей строки — те же поля, что при «Новый». */
  editArticle?: Workshop2EditArticlePayload | null;
  onSaveEdit?: (
    collectionId: string,
    articleId: string,
    patch: {
      name: string;
      workshopComment: string;
      categoryLeafId: string;
      workshopAttachments: { name: string; dataUrl: string }[];
    }
  ) => boolean;
  /** Кто записывается в историю действий. */
  activityActorLabel?: string;
};

function CreateArticleDialogTzExtraRow({
  row,
  onChangeTitle,
  onChangeAssignee,
  onRemove,
  signatorySelectChildren,
}: {
  row: Workshop2TzSignatoryExtraRow;
  onChangeTitle: (title: string) => void;
  onChangeAssignee: (value: string) => void;
  onRemove: () => void;
  signatorySelectChildren: ReactNode;
}) {
  const [editingTitle, setEditingTitle] = useState(() => row.roleTitle.trim() === 'Роль');
  const inputId = `w2-create-tz-extra-title-${row.rowId}`;
  const trimmedTitle = row.roleTitle?.trim() ?? '';

  useLayoutEffect(() => {
    if (!editingTitle) return;
    const el = document.getElementById(inputId) as HTMLInputElement | null;
    if (el) {
      el.focus();
      el.select();
    }
  }, [editingTitle, inputId]);

  return (
    <div className="rounded-md border border-indigo-100/80 bg-white/80 p-2">
      <div className="mb-1 flex min-w-0 items-center gap-1">
        {editingTitle ? (
          <Input
            id={inputId}
            className="h-9 min-w-0 flex-1 text-sm"
            value={row.roleTitle}
            onChange={(e) => onChangeTitle(e.target.value)}
            onBlur={() => setEditingTitle(false)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') (e.target as HTMLInputElement).blur();
            }}
            placeholder="Название роли"
            aria-label="Название роли"
          />
        ) : (
          <button
            type="button"
            className="min-h-[1.125rem] min-w-0 flex-1 truncate rounded px-0.5 py-0 text-left text-[10px] font-semibold leading-tight text-slate-700 hover:bg-slate-100"
            onClick={() => setEditingTitle(true)}
            aria-label="Редактировать название роли"
          >
            {trimmedTitle || 'Название роли'}
          </button>
        )}
        <button
          type="button"
          className="inline-flex h-4 w-4 shrink-0 items-center justify-center rounded text-red-500 transition hover:bg-red-50 hover:text-red-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-300"
          onClick={onRemove}
          aria-label="Удалить роль"
        >
          <X className="h-2 w-2" strokeWidth={2.75} aria-hidden />
        </button>
      </div>
      <select
        className="flex h-9 w-full rounded-md border border-input bg-background px-2 text-sm"
        value={row.assigneeDisplayLabel ?? ''}
        onChange={(e) => onChangeAssignee(e.target.value)}
        aria-label={`Ответственный: ${trimmedTitle || 'роль'}`}
      >
        {signatorySelectChildren}
      </select>
    </div>
  );
}

export function Workshop2CreateArticleDialog({
  open,
  onOpenChange,
  collectionId,
  collectionDisplayName,
  pickerLines,
  onCommit,
  editArticle = null,
  onSaveEdit,
  activityActorLabel,
}: Props) {
  const isEdit = Boolean(editArticle);
  const [mode, setMode] = useState<'base' | 'new'>('new');
  const [baseLineId, setBaseLineId] = useState('');
  const [sku, setSku] = useState('');
  const [name, setName] = useState('');
  const [comment, setComment] = useState('');
  const [audienceId, setAudienceId] = useState(() => getHandbookAudiencesWorkshop2()[0]?.id ?? '');
  const [l1Name, setL1Name] = useState('');
  const [l2Name, setL2Name] = useState('');
  const [l3Name, setL3Name] = useState('');
  const [attachError, setAttachError] = useState<string | null>(null);
  const [pendingFiles, setPendingFiles] = useState<{ name: string; dataUrl: string }[]>([]);
  const [duplicateSkuError, setDuplicateSkuError] = useState(false);
  const [baseSearch, setBaseSearch] = useState('');
  const [catSearch, setCatSearch] = useState('');
  const [tzDesigner, setTzDesigner] = useState('');
  const [tzTechnologist, setTzTechnologist] = useState('');
  const [tzManager, setTzManager] = useState('');
  const [tzExtraRows, setTzExtraRows] = useState<Workshop2TzSignatoryExtraRow[]>([]);

  const audiences = useMemo(() => getHandbookAudiencesWorkshop2(), []);
  const signatoryOptions = useMemo(() => getWorkshopTzSignatoryPickerOptions(), []);
  const signatoryByGroup = useMemo(() => {
    const m = new Map<string, typeof signatoryOptions>();
    for (const o of signatoryOptions) {
      const arr = m.get(o.group) ?? [];
      arr.push(o);
      m.set(o.group, arr);
    }
    return m;
  }, [signatoryOptions]);

  const signatorySelectChildren = useMemo(
    () => (
      <>
        <option value="">Не закреплять</option>
        {Array.from(signatoryByGroup.entries()).map(([group, opts]) => (
          <optgroup key={group} label={group}>
            {opts.map((o) => (
              <option key={`${group}-${o.value}`} value={o.value}>
                {o.label}
                {o.sublabel ? ` — ${o.sublabel}` : ''}
              </option>
            ))}
          </optgroup>
        ))}
      </>
    ),
    [signatoryByGroup]
  );

  const addTzExtraRow = useCallback(() => {
    setTzExtraRows((rows) => [
      ...rows,
      { rowId: `w2-tz-extra-${Date.now().toString(36)}`, roleTitle: 'Роль' },
    ]);
  }, []);

  const addTzExtraPresetRow = useCallback((presetId: Workshop2TzExtraRolePresetId) => {
    setTzExtraRows((rows) => [...rows, workshop2TzExtraRowFromPreset(presetId)]);
  }, []);

  const removeTzExtraRow = useCallback((rowId: string) => {
    setTzExtraRows((rows) => rows.filter((r) => r.rowId !== rowId));
  }, []);

  const patchTzExtraTitle = useCallback((rowId: string, title: string) => {
    setTzExtraRows((rows) => rows.map((r) => (r.rowId === rowId ? { ...r, roleTitle: title } : r)));
  }, []);

  const patchTzExtraAssignee = useCallback((rowId: string, value: string) => {
    setTzExtraRows((rows) =>
      rows.map((r) =>
        r.rowId === rowId ? { ...r, assigneeDisplayLabel: value.trim() || undefined } : r
      )
    );
  }, []);

  const leaves = useMemo(() => getHandbookCategoryLeaves(), []);

  const filteredLeaves = useMemo(() => {
    const q = catSearch.trim().toLowerCase();
    if (!q) return [];
    return leaves
      .filter((l) => l.audienceId === audienceId)
      .filter((l) => l.pathLabel.toLowerCase().includes(q))
      .slice(0, 10);
  }, [leaves, catSearch, audienceId]);

  const l1Options = useMemo(
    () => handbookL1OptionsForAudience(leaves, audienceId),
    [leaves, audienceId]
  );
  const l2Options = useMemo(
    () => (l1Name ? handbookL2OptionsForAudience(leaves, audienceId, l1Name) : []),
    [leaves, audienceId, l1Name]
  );
  const l3Options = useMemo(
    () =>
      l1Name && l2Name ? handbookL3OptionsForAudience(leaves, audienceId, l1Name, l2Name) : [],
    [leaves, audienceId, l1Name, l2Name]
  );
  const resolvedLeafId = useMemo(
    () =>
      audienceId && l1Name && l2Name && l3Name
        ? handbookLeafIdFromL123(leaves, audienceId, l1Name, l2Name, l3Name)
        : undefined,
    [leaves, audienceId, l1Name, l2Name, l3Name]
  );

  const resolvedLeaf = useMemo(
    () => (resolvedLeafId ? findHandbookLeafById(resolvedLeafId) : undefined),
    [resolvedLeafId]
  );

  /** Режим «Из базы»: подсказки по категории выбранной строки (если leafId валиден). */
  const baseLineHandbookLeaf = useMemo(() => {
    if (mode !== 'base' || isEdit || !baseLineId) return undefined;
    const line = pickerLines.find((l) => l.id === baseLineId);
    if (!line) return undefined;
    const raw = String(line.categoryLeafId ?? '').trim();
    return raw ? findHandbookLeafById(raw) : undefined;
  }, [mode, isEdit, baseLineId, pickerLines]);

  const filteredBaseLines = useMemo(() => {
    const q = baseSearch.trim().toLowerCase();
    if (!q) return pickerLines.slice(0, 18);
    return pickerLines
      .filter(
        (l) =>
          l.sku.toLowerCase().includes(q) ||
          l.name.toLowerCase().includes(q) ||
          l.id.toLowerCase().includes(q)
      )
      .slice(0, 50);
  }, [pickerLines, baseSearch]);

  useLayoutEffect(() => {
    if (!open || !collectionId || isEdit) return;
    try {
      const raw = localStorage.getItem(workshop2ArticleDraftKey(collectionId));
      if (!raw) return;
      const p = JSON.parse(raw) as ArticleDraftV1;
      if (!p || p.v !== 1) return;
      if (p.mode === 'base' || p.mode === 'new') setMode(p.mode);
      if (typeof p.baseLineId === 'string') setBaseLineId(p.baseLineId);
      if (typeof p.baseSearch === 'string') setBaseSearch(p.baseSearch);
      if (typeof p.sku === 'string') setSku(p.sku);
      if (typeof p.name === 'string') setName(p.name);
      if (typeof p.comment === 'string') setComment(p.comment);
      if (typeof p.audienceId === 'string') setAudienceId(p.audienceId);
      if (typeof p.l1Name === 'string') setL1Name(p.l1Name);
      if (typeof p.l2Name === 'string') setL2Name(p.l2Name);
      if (typeof p.l3Name === 'string') setL3Name(p.l3Name);
      if (typeof p.tzDesigner === 'string') setTzDesigner(p.tzDesigner);
      if (typeof p.tzTechnologist === 'string') setTzTechnologist(p.tzTechnologist);
      if (typeof p.tzManager === 'string') setTzManager(p.tzManager);
      if (Array.isArray(p.tzExtraRows)) {
        const cleaned = p.tzExtraRows.filter((r): r is Workshop2TzSignatoryExtraRow =>
          Boolean(r && typeof r.rowId === 'string' && typeof r.roleTitle === 'string')
        );
        setTzExtraRows(cleaned);
      } else {
        setTzExtraRows([]);
      }
    } catch {
      /* ignore */
    }
  }, [open, collectionId, isEdit]);

  useEffect(() => {
    if (!open || !collectionId || isEdit) return;
    const t = window.setTimeout(() => {
      try {
        const payload: ArticleDraftV1 = {
          v: 1,
          mode,
          baseLineId,
          baseSearch,
          sku,
          name,
          comment,
          audienceId,
          l1Name,
          l2Name,
          l3Name,
          tzDesigner,
          tzTechnologist,
          tzManager,
          tzExtraRows,
        };
        localStorage.setItem(workshop2ArticleDraftKey(collectionId), JSON.stringify(payload));
      } catch {
        /* quota */
      }
    }, 450);
    return () => clearTimeout(t);
  }, [
    open,
    collectionId,
    isEdit,
    mode,
    baseLineId,
    baseSearch,
    sku,
    name,
    comment,
    audienceId,
    l1Name,
    l2Name,
    l3Name,
    tzDesigner,
    tzTechnologist,
    tzManager,
    tzExtraRows,
  ]);

  useEffect(() => {
    if (!open) return;
    setDuplicateSkuError(false);
  }, [open]);

  useLayoutEffect(() => {
    if (!open || !editArticle) return;
    setMode('new');
    setBaseLineId('');
    setBaseSearch('');
    setSku(editArticle.sku);
    setName(editArticle.name);
    setComment(editArticle.comment);
    setAttachError(null);
    setPendingFiles(editArticle.workshopAttachments.map((a) => ({ ...a })));
    const leaf = findHandbookLeafById(editArticle.categoryLeafId);
    if (leaf) {
      setAudienceId(leaf.audienceId);
      setL1Name(leaf.l1Name);
      setL2Name(leaf.l2Name);
      setL3Name(leaf.l3Name);
    } else {
      const firstAud = getHandbookAudiencesWorkshop2()[0]?.id ?? '';
      setAudienceId(firstAud);
      setL1Name('');
      setL2Name('');
      setL3Name('');
    }
  }, [open, editArticle]);

  useEffect(() => {
    if (!open || !audienceId) return;
    const l1 = l1Options[0] ?? '';
    setL1Name((prev) => (l1Options.includes(prev) ? prev : l1));
  }, [open, audienceId, l1Options]);

  useEffect(() => {
    if (!open || !l1Name) return;
    const l2 = l2Options[0] ?? '';
    setL2Name((prev) => (l2Options.includes(prev) ? prev : l2));
  }, [open, l1Name, l2Options]);

  useEffect(() => {
    if (!open || !l2Name) return;
    const l3 = l3Options[0] ?? '';
    setL3Name((prev) => (l3Options.includes(prev) ? prev : l3));
  }, [open, l2Name, l3Options]);

  useEffect(() => {
    if (!open || isEdit) return;
    if (mode !== 'base' || !baseLineId) return;
    const line = pickerLines.find((l) => l.id === baseLineId) as LocalOrderLine | undefined;
    const b = line?.workshopTzSignatoryBindings;
    if (b) {
      setTzDesigner(b.designerDisplayLabel ?? '');
      setTzTechnologist(b.technologistDisplayLabel ?? '');
      setTzManager(b.managerDisplayLabel ?? '');
      setTzExtraRows((b.extraAssigneeRows ?? []).map((r) => ({ ...r })));
    } else {
      setTzDesigner('');
      setTzTechnologist('');
      setTzManager('');
      setTzExtraRows([]);
    }
  }, [open, isEdit, mode, baseLineId, pickerLines]);

  const reset = useCallback(() => {
    setMode('new');
    setBaseLineId('');
    setBaseSearch('');
    setSku('');
    setName('');
    setComment('');
    setAttachError(null);
    setPendingFiles([]);
    const firstAud = getHandbookAudiencesWorkshop2()[0]?.id ?? '';
    setAudienceId(firstAud);
    setL1Name('');
    setL2Name('');
    setL3Name('');
    setTzDesigner('');
    setTzTechnologist('');
    setTzManager('');
  }, []);

  const genSku = useCallback(() => {
    setSku(`W2-${Date.now().toString(36).toUpperCase()}`);
  }, []);

  const onFiles = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    setAttachError(null);
    const files = Array.from(e.target.files ?? []);
    e.target.value = '';
    if (!files.length) return;
    const next: { name: string; dataUrl: string }[] = [];
    try {
      for (const file of files.slice(0, ATTACH_MAX_FILES)) {
        if (file.size > ATTACH_MAX_BYTES) {
          setAttachError(`«${file.name}» больше ${Math.round(ATTACH_MAX_BYTES / 1000)} КБ.`);
          return;
        }
        const dataUrl = await new Promise<string>((resolve, reject) => {
          const r = new FileReader();
          r.onload = () => resolve(typeof r.result === 'string' ? r.result : '');
          r.onerror = () => reject(new Error('read'));
          r.readAsDataURL(file);
        });
        next.push({ name: file.name, dataUrl });
      }
    } catch {
      setAttachError('Не удалось прочитать файл.');
      return;
    }
    setPendingFiles((p) => [...p, ...next].slice(0, ATTACH_MAX_FILES));
  }, []);

  const submit = useCallback(() => {
    setDuplicateSkuError(false);
    if (isEdit && editArticle && onSaveEdit) {
      if (!resolvedLeafId) return;
      const ok = onSaveEdit(collectionId, editArticle.articleId, {
        name: name.trim(),
        workshopComment: comment.trim(),
        categoryLeafId: resolveHandbookLeafId(resolvedLeafId),
        workshopAttachments: pendingFiles,
      });
      if (ok) {
        appendWorkshop2Activity(
          `Артикул ${editArticle.sku}: сохранены поля · «${collectionDisplayName}»`,
          activityActorLabel
        );
        reset();
        onOpenChange(false);
      }
      return;
    }
    const tzPayload: Workshop2TzSignatoryBindings = {
      designerDisplayLabel: tzDesigner.trim() || undefined,
      technologistDisplayLabel: tzTechnologist.trim() || undefined,
      managerDisplayLabel: tzManager.trim() || undefined,
      ...(tzExtraRows.length
        ? {
            extraAssigneeRows: tzExtraRows.map((r) => ({
              rowId: r.rowId,
              roleTitle: (r.roleTitle ?? '').trim() || 'Роль',
              ...(r.assigneeDisplayLabel?.trim()
                ? { assigneeDisplayLabel: r.assigneeDisplayLabel.trim() }
                : {}),
              ...(r.signStages && Object.keys(r.signStages).length
                ? { signStages: { ...r.signStages } }
                : {}),
            })),
          }
        : {}),
    };
    if (mode === 'base') {
      const src = pickerLines.find((l) => l.id === baseLineId);
      if (!src) return;
      const ok = onCommit(collectionId, {
        kind: 'clone',
        source: src,
        tzSignatoryBindings: tzPayload,
      });
      if (!ok) {
        setDuplicateSkuError(true);
        return;
      }
      appendWorkshop2Activity(
        `В коллекцию «${collectionDisplayName}» добавлен артикул из базы · ${src.sku} · ${collectionId}`,
        activityActorLabel
      );
    } else {
      if (!sku.trim() || !resolvedLeafId) return;
      const tzB = normalizeWorkshopTzSignatoryBindings(tzPayload);
      const ok = onCommit(collectionId, {
        kind: 'new',
        sku: sku.trim(),
        categoryLeafId: resolveHandbookLeafId(resolvedLeafId),
        name: name.trim() || undefined,
        comment: comment.trim() || undefined,
        attachments: pendingFiles.length ? pendingFiles : undefined,
        ...(tzB ? { tzSignatoryBindings: tzB } : {}),
      });
      if (!ok) {
        setDuplicateSkuError(true);
        return;
      }
      appendWorkshop2Activity(
        `В коллекцию «${collectionDisplayName}» создан новый артикул · ${sku.trim()} · ${collectionId}`,
        activityActorLabel
      );
    }
    try {
      if (collectionId) localStorage.removeItem(workshop2ArticleDraftKey(collectionId));
    } catch {
      /* ignore */
    }
    reset();
    onOpenChange(false);
  }, [
    isEdit,
    editArticle,
    onSaveEdit,
    mode,
    baseLineId,
    pickerLines,
    collectionId,
    collectionDisplayName,
    sku,
    resolvedLeafId,
    name,
    comment,
    pendingFiles,
    onCommit,
    onOpenChange,
    reset,
    activityActorLabel,
    resolveHandbookLeafId,
    tzDesigner,
    tzTechnologist,
    tzManager,
    tzExtraRows,
  ]);

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        onOpenChange(v);
        if (!v) reset();
      }}
    >
      <DialogContent
        className="max-h-[90vh] overflow-y-auto sm:max-w-xl"
        aria-describedby="w2-art-desc"
      >
        <DialogHeader>
          <DialogTitle>
            {isEdit
              ? `Редактировать артикул · ${editArticle?.sku ?? ''}`
              : `Артикул в «${collectionDisplayName}»`}
          </DialogTitle>
          <DialogDescription id="w2-art-desc">
            {isEdit
              ? 'Те же поля, что при создании нового артикула. SKU не меняется. Данные — локально в браузере.'
              : 'Добавьте из ранее созданных или заведите новый. Данные и вложения — локально в браузере.'}
          </DialogDescription>
        </DialogHeader>

        {!isEdit ? (
          <div className="flex gap-2 py-1">
            <Button
              type="button"
              size="sm"
              variant={mode === 'new' ? 'default' : 'outline'}
              className="text-[10px] font-bold uppercase"
              onClick={() => setMode('new')}
            >
              Новый
            </Button>
            <Button
              type="button"
              size="sm"
              variant={mode === 'base' ? 'default' : 'outline'}
              className="text-[10px] font-bold uppercase"
              onClick={() => setMode('base')}
            >
              Из базы
            </Button>
          </div>
        ) : null}

        {mode === 'base' && !isEdit ? (
          <div className="grid gap-2">
            <Label htmlFor="w2-base-search">Поиск в базе</Label>
            <Input
              id="w2-base-search"
              value={baseSearch}
              onChange={(e) => setBaseSearch(e.target.value)}
              placeholder="SKU, название или id…"
              className="text-sm"
              autoComplete="off"
            />
            {baseLineId ? (
              <p className="text-[10px] text-slate-600">
                Выбрано:{' '}
                <span className="font-mono font-semibold">
                  {pickerLines.find((l) => l.id === baseLineId)?.sku ?? baseLineId}
                </span>
              </p>
            ) : null}
            <div
              className="max-h-48 overflow-y-auto rounded-md border border-slate-200 bg-slate-50/80"
              role="listbox"
              aria-label="Результаты поиска по базе артикулов"
            >
              {pickerLines.length === 0 ? (
                <p className="p-2 text-[10px] text-slate-500">
                  Пока нет сохранённых артикулов для выбора.
                </p>
              ) : filteredBaseLines.length === 0 ? (
                <p className="p-2 text-[10px] text-slate-500">
                  Ничего не найдено — уточните запрос.
                </p>
              ) : (
                <ul className="divide-y divide-slate-100">
                  {filteredBaseLines.map((l) => {
                    const active = l.id === baseLineId;
                    return (
                      <li key={l.id}>
                        <button
                          type="button"
                          className={`w-full px-2 py-1.5 text-left text-[11px] transition-colors ${
                            active ? 'bg-indigo-100 text-indigo-950' : 'hover:bg-white'
                          }`}
                          onClick={() => setBaseLineId(l.id)}
                        >
                          <span className="font-mono font-bold">{l.sku}</span>
                          <span className="text-slate-600"> · {l.name}</span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
            {baseLineHandbookLeaf ? (
              <Workshop2CategoryHandbookGuidance leaf={baseLineHandbookLeaf} className="mt-2" />
            ) : baseLineId ? (
              <p className="mt-2 text-[10px] text-amber-800/90">
                У выбранной строки нет сопоставления со справочником категорий (проверьте{' '}
                <span className="font-mono">categoryLeafId</span>).
              </p>
            ) : null}
          </div>
        ) : (
          <div className="grid gap-3">
            <div className="flex flex-wrap items-end gap-2">
              <div className="grid min-w-[8rem] flex-1 gap-1">
                <Label htmlFor="w2-art-sku">Код SKU</Label>
                <Input
                  id="w2-art-sku"
                  value={sku}
                  onChange={(e) => setSku(e.target.value)}
                  readOnly={isEdit}
                  aria-readonly={isEdit}
                  className={cn('font-mono text-sm', isEdit && 'bg-slate-50 text-slate-600')}
                  placeholder="Например W2-ABC12"
                  aria-required={!isEdit}
                />
              </div>
              {isEdit ? null : (
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  className="h-9 text-[10px]"
                  onClick={genSku}
                >
                  Сгенерировать
                </Button>
              )}
            </div>
            {!isEdit && !sku.trim() ? (
              <p className="text-[10px] text-amber-800/90">
                Обязательно: укажите код SKU или нажмите «Сгенерировать».
              </p>
            ) : null}
            <div className="grid gap-1">
              <Label htmlFor="w2-art-name">Название (необязательно)</Label>
              <Input
                id="w2-art-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="text-sm"
              />
            </div>
            <div className="grid gap-1">
              <Label htmlFor="w2-art-aud">Аудитория</Label>
              <select
                id="w2-art-aud"
                className="flex h-9 w-full rounded-md border border-input bg-background px-2 text-sm"
                value={audienceId}
                onChange={(e) => {
                  setAudienceId(e.target.value);
                  setL1Name('');
                  setL2Name('');
                  setL3Name('');
                  setCatSearch('');
                }}
              >
                {audiences.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid gap-1">
              <Label htmlFor="w2-art-cat-search">Поиск категории (L1 / L2 / L3)</Label>
              <div className="relative">
                <Input
                  id="w2-art-cat-search"
                  value={catSearch}
                  onChange={(e) => setCatSearch(e.target.value)}
                  placeholder="Начните вводить: платья, пальто, брюки…"
                  className="pr-8 text-sm"
                  autoComplete="off"
                />
                {catSearch && (
                  <button
                    type="button"
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    onClick={() => setCatSearch('')}
                  >
                    ×
                  </button>
                )}
              </div>
              {filteredLeaves.length > 0 && (
                <div className="z-50 mt-1 max-h-40 overflow-y-auto rounded-md border border-slate-200 bg-white shadow-lg">
                  <ul className="divide-y divide-slate-100">
                    {filteredLeaves.map((l) => (
                      <li key={l.leafId}>
                        <button
                          type="button"
                          className="w-full px-3 py-2 text-left text-xs transition-colors hover:bg-indigo-50"
                          onClick={() => {
                            setL1Name(l.l1Name);
                            setL2Name(l.l2Name);
                            setL3Name(l.l3Name);
                            setCatSearch('');
                          }}
                        >
                          <span className="font-medium text-slate-400">
                            {l.l1Name} › {l.l2Name} ›{' '}
                          </span>
                          <span className="font-bold text-slate-900">{l.l3Name}</span>
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <div className="grid gap-1.5 sm:grid-cols-3 sm:gap-2">
              <div className="grid gap-1">
                <Label htmlFor="w2-art-l1">Ур. 1</Label>
                <select
                  id="w2-art-l1"
                  className="flex h-9 w-full rounded-md border border-input bg-background px-2 text-sm"
                  value={l1Name}
                  onChange={(e) => {
                    setL1Name(e.target.value);
                    setL2Name('');
                    setL3Name('');
                  }}
                >
                  {l1Options.length === 0 ? (
                    <option value="">—</option>
                  ) : (
                    l1Options.map((name) => (
                      <option key={name} value={name}>
                        {name}
                      </option>
                    ))
                  )}
                </select>
              </div>
              <div className="grid gap-1">
                <Label htmlFor="w2-art-l2">Ур. 2</Label>
                <select
                  id="w2-art-l2"
                  className="flex h-9 w-full rounded-md border border-input bg-background px-2 text-sm"
                  value={l2Name}
                  onChange={(e) => {
                    setL2Name(e.target.value);
                    setL3Name('');
                  }}
                  disabled={!l1Name || l2Options.length === 0}
                >
                  {l2Options.length === 0 ? (
                    <option value="">—</option>
                  ) : (
                    l2Options.map((name) => (
                      <option key={name} value={name}>
                        {name}
                      </option>
                    ))
                  )}
                </select>
              </div>
              <div className="grid gap-1 sm:col-span-1">
                <Label htmlFor="w2-art-l3">Ур. 3</Label>
                <select
                  id="w2-art-l3"
                  className="flex h-9 w-full rounded-md border border-input bg-background px-2 text-sm"
                  value={l3Name}
                  onChange={(e) => setL3Name(e.target.value)}
                  disabled={!l2Name || l3Options.length === 0}
                >
                  {l3Options.length === 0 ? (
                    <option value="">—</option>
                  ) : (
                    l3Options.map((name) => (
                      <option key={name} value={name}>
                        {name}
                      </option>
                    ))
                  )}
                </select>
              </div>
            </div>
            {!resolvedLeafId ? (
              <p className="text-[10px] text-amber-800/90">
                Обязательно: выберите аудиторию и три уровня категории (L1 → L2 → L3).
              </p>
            ) : null}
            {resolvedLeaf ? (
              <Workshop2CategoryHandbookGuidance leaf={resolvedLeaf} className="mt-1" />
            ) : null}
            <div className="grid gap-1">
              <Label htmlFor="w2-art-com">Комментарий</Label>
              <Textarea
                id="w2-art-com"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={2}
                className="resize-none text-sm"
                placeholder="Уточнение задачи, референсы словами…"
              />
            </div>
            <div className="grid gap-1">
              <Label htmlFor="w2-art-files">
                Файлы (мудборды, фото, до {ATTACH_MAX_FILES} шт.)
              </Label>
              <Input
                id="w2-art-files"
                type="file"
                multiple
                className="cursor-pointer text-sm"
                onChange={(ev) => void onFiles(ev)}
              />
              {attachError ? <p className="text-[10px] text-red-600">{attachError}</p> : null}
              {pendingFiles.length > 0 ? (
                <ul className="list-disc pl-4 text-[10px] text-slate-600">
                  {pendingFiles.map((f) => (
                    <li key={f.name}>{f.name}</li>
                  ))}
                </ul>
              ) : null}
            </div>
          </div>
        )}

        {!isEdit ? (
          <div className="space-y-3 rounded-lg border border-indigo-100 bg-indigo-50/35 p-3">
            <div className="space-y-0.5">
              <p className="text-[11px] font-semibold text-indigo-950">Подписанты ТЗ по артикулу</p>
              <p className="text-[10px] leading-snug text-slate-600">
                По желанию закрепите уровни цифровой подписи за конкретными людьми (команда бренда и
                партнёры). Пустое значение — подписать может любой пользователь с соответствующим
                правом в <span className="font-medium text-slate-700">Команда → права доступа</span>
                .
              </p>
            </div>
            <div className="grid gap-2 sm:grid-cols-3 sm:gap-3">
              <div className="grid gap-1">
                <Label htmlFor="w2-tz-des">Дизайн</Label>
                <select
                  id="w2-tz-des"
                  className="flex h-9 w-full rounded-md border border-input bg-background px-2 text-sm"
                  value={tzDesigner}
                  onChange={(e) => setTzDesigner(e.target.value)}
                >
                  {signatorySelectChildren}
                </select>
              </div>
              <div className="grid gap-1">
                <Label htmlFor="w2-tz-tech">Технолог</Label>
                <select
                  id="w2-tz-tech"
                  className="flex h-9 w-full rounded-md border border-input bg-background px-2 text-sm"
                  value={tzTechnologist}
                  onChange={(e) => setTzTechnologist(e.target.value)}
                >
                  {signatorySelectChildren}
                </select>
              </div>
              <div className="grid gap-1">
                <Label htmlFor="w2-tz-mgr">Менеджер</Label>
                <select
                  id="w2-tz-mgr"
                  className="flex h-9 w-full rounded-md border border-input bg-background px-2 text-sm"
                  value={tzManager}
                  onChange={(e) => setTzManager(e.target.value)}
                >
                  {signatorySelectChildren}
                </select>
              </div>
            </div>
            <div className="space-y-2 border-t border-indigo-100/80 pt-2">
              <p className="text-[10px] font-medium text-slate-600">
                Дополнительные роли — те же данные, что в паспорте артикула; участие по этапам
                настраивается там. Базовый минимум подписей ТЗ — дизайн, технолог, менеджер;
                продакт, снабжение, ОТК, маркировка и производственный контакт добавляйте по
                необходимости (по умолчанию без отдельной подписи на этапе «ТЗ»).
              </p>
              <div className="flex flex-wrap gap-1">
                {WORKSHOP2_TZ_EXTRA_ROLE_PRESET_DEFS.map((p) => (
                  <Button
                    key={p.id}
                    type="button"
                    variant="secondary"
                    size="sm"
                    className="h-7 px-2 text-[10px] font-medium"
                    title={`Добавить строку «${p.roleTitle}»`}
                    onClick={() => addTzExtraPresetRow(p.id)}
                  >
                    + {WORKSHOP2_TZ_EXTRA_ROLE_PRESET_BUTTON_LABEL_RU[p.id]}
                  </Button>
                ))}
              </div>
              <div className="h-[11rem] space-y-2 overflow-y-auto overscroll-contain pr-0.5">
                {tzExtraRows.map((row) => (
                  <CreateArticleDialogTzExtraRow
                    key={row.rowId}
                    row={row}
                    onChangeTitle={(t) => patchTzExtraTitle(row.rowId, t)}
                    onChangeAssignee={(v) => patchTzExtraAssignee(row.rowId, v)}
                    onRemove={() => removeTzExtraRow(row.rowId)}
                    signatorySelectChildren={signatorySelectChildren}
                  />
                ))}
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-8 text-xs"
                onClick={addTzExtraRow}
              >
                + Добавить роль
              </Button>
            </div>
          </div>
        ) : null}

        {!isEdit && duplicateSkuError ? (
          <p className="text-[11px] text-red-600" role="alert">
            В этой коллекции уже есть артикул с таким SKU (после нормализации кода). Выберите другой
            код или базовую позицию.
          </p>
        ) : null}

        <DialogFooter className="gap-2 sm:gap-0">
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Отмена
          </Button>
          <Button
            type="button"
            onClick={submit}
            disabled={
              isEdit
                ? !resolvedLeafId || !!attachError
                : mode === 'base'
                  ? !baseLineId
                  : !sku.trim() || !resolvedLeafId || !!attachError
            }
          >
            {isEdit ? 'Сохранить' : 'Добавить в коллекцию'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

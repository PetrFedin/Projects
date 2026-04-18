'use client';

import React, { Suspense, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { CheckCircle2, Calendar, Plus, User, Clock } from 'lucide-react';
import { SectionInfoCard } from '@/components/brand/production/ProductionSectionEnhancements';
import { getTaskLinks } from '@/lib/data/entity-links';
import { RelatedModulesBlock } from '@/components/brand/RelatedModulesBlock';
import type { BrandTaskRecord, BrandTaskStatus } from '@/lib/production-data';
import { generateTaskId, loadBrandTasks, saveBrandTasks } from '@/lib/production-data';
import { demoTasksForProductionStage } from '@/lib/production/stages-comm-demo';
import { ROUTES } from '@/lib/routes';
import { RegistryPageShell } from '@/components/design-system';

const DEMO_TASK_STATUS_STORAGE_KEY = 'brandStageDemoTaskStatus';

function readDemoTaskStatusOverrides(): Record<string, BrandTaskStatus> {
  if (typeof window === 'undefined') return {};
  try {
    const raw = sessionStorage.getItem(DEMO_TASK_STATUS_STORAGE_KEY);
    if (!raw) return {};
    const o = JSON.parse(raw) as Record<string, unknown>;
    const out: Record<string, BrandTaskStatus> = {};
    for (const [k, v] of Object.entries(o)) {
      if (v === 'todo' || v === 'in_progress' || v === 'done') out[k] = v;
    }
    return out;
  } catch {
    return {};
  }
}

function BrandTasksPageInner() {
  const searchParams = useSearchParams();
  const urlFilterApplied = useRef(false);
  const [tasks, setTasks] = useState<BrandTaskRecord[]>([]);
  const [mounted, setMounted] = useState(false);
  const [listFilter, setListFilter] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newAssignee, setNewAssignee] = useState('');
  const [newDue, setNewDue] = useState('');
  const [newProject, setNewProject] = useState('Production');
  /** Демо-задачи из матрицы не в localStorage — статусы храним в сессии, чтобы Kanban работал до перезагрузки */
  const [demoTaskStatusOverrides, setDemoTaskStatusOverrides] = useState<
    Record<string, BrandTaskStatus>
  >(() => readDemoTaskStatusOverrides());

  useEffect(() => {
    setTasks(loadBrandTasks());
    setMounted(true);
  }, []);

  useEffect(() => {
    if (urlFilterApplied.current) return;
    const q = searchParams.get('q')?.trim() || '';
    const sku = searchParams.get('sku')?.trim() || '';
    const season = searchParams.get('season')?.trim() || '';
    const order = searchParams.get('order')?.trim() || '';
    const step = searchParams.get('stagesStep')?.trim() || '';
    const line = [q, sku, season, order, step].filter(Boolean).join(' ').trim();
    if (line) {
      setListFilter(line);
      urlFilterApplied.current = true;
    }
  }, [searchParams]);

  useEffect(() => {
    if (!mounted) return;
    saveBrandTasks(tasks);
  }, [tasks, mounted]);

  const stageDemoTasks = useMemo(() => {
    const step = searchParams.get('stagesStep')?.trim();
    if (!step) return [] as BrandTaskRecord[];
    return demoTasksForProductionStage(step, {
      sku: searchParams.get('sku'),
      season: searchParams.get('season'),
      order: searchParams.get('order'),
    });
  }, [searchParams]);

  const mergedTasks = useMemo(() => {
    const seen = new Set<string>();
    const out: BrandTaskRecord[] = [];
    for (const t of [...stageDemoTasks, ...tasks]) {
      if (seen.has(t.id)) continue;
      seen.add(t.id);
      const ov = demoTaskStatusOverrides[t.id];
      out.push(ov && t.id.startsWith('demo-stage-') ? { ...t, status: ov } : t);
    }
    return out;
  }, [stageDemoTasks, tasks, demoTaskStatusOverrides]);

  const filteredTasks = useMemo(() => {
    const raw = listFilter.trim().toLowerCase();
    const tokens = raw ? raw.split(/\s+/).filter(Boolean) : [];
    if (tokens.length === 0) return mergedTasks;
    const fromMatrix = Boolean(
      searchParams.get('stagesStep')?.trim() && searchParams.get('sku')?.trim()
    );
    return mergedTasks.filter((t) => {
      const blob = `${t.title} ${t.project} ${t.assignee} ${t.due}`.toLowerCase();
      return fromMatrix
        ? tokens.some((tok) => tok.length > 1 && blob.includes(tok))
        : tokens.every((tok) => blob.includes(tok));
    });
  }, [mergedTasks, listFilter, searchParams]);

  const columns = useMemo(
    () => [
      {
        id: 'todo' as const,
        title: 'К выполнению',
        tasks: filteredTasks.filter((t) => t.status === 'todo'),
      },
      {
        id: 'in_progress' as const,
        title: 'В работе',
        tasks: filteredTasks.filter((t) => t.status === 'in_progress'),
      },
      {
        id: 'done' as const,
        title: 'Выполнено',
        tasks: filteredTasks.filter((t) => t.status === 'done'),
      },
    ],
    [filteredTasks]
  );

  const setTaskStatus = useCallback((taskId: string, status: BrandTaskStatus) => {
    const now = new Date().toISOString();
    if (taskId.startsWith('demo-stage-')) {
      setDemoTaskStatusOverrides((prev) => {
        const next = { ...prev, [taskId]: status };
        try {
          sessionStorage.setItem(DEMO_TASK_STATUS_STORAGE_KEY, JSON.stringify(next));
        } catch {
          /* ignore */
        }
        return next;
      });
      return;
    }
    setTasks((prev) => prev.map((t) => (t.id === taskId ? { ...t, status, updatedAt: now } : t)));
  }, []);

  const addTask = useCallback(() => {
    const title = newTitle.trim();
    if (!title) return;
    const now = new Date().toISOString();
    const row: BrandTaskRecord = {
      id: generateTaskId(),
      title,
      status: 'todo',
      assignee: newAssignee.trim() || '—',
      due: newDue.trim() || '—',
      project: newProject.trim() || 'Общее',
      createdAt: now,
      updatedAt: now,
    };
    setTasks((prev) => [...prev, row]);
    setNewTitle('');
    setNewAssignee('');
    setNewDue('');
    setNewProject('Production');
    setDialogOpen(false);
  }, [newTitle, newAssignee, newDue, newProject]);

  return (
    <RegistryPageShell className="max-w-6xl space-y-6 pb-16">
      <SectionInfoCard
        title="Задачи команды"
        description="Kanban с сохранением в localStorage (brand_tasks_kanban_v1). Позже тот же контракт — через ProductionDataPort → API."
        icon={CheckCircle2}
        iconBg="bg-accent-primary/15"
        iconColor="text-accent-primary"
        badges={
          <>
            <Badge variant="outline" className="text-[9px]">
              Kanban · persist
            </Badge>
            <Button variant="outline" size="sm" className="h-7 text-[9px]" asChild>
              <Link href={`${ROUTES.brand.calendar}?layers=tasks`}>Календарь задач</Link>
            </Button>
          </>
        }
      />
      <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-2xl font-bold uppercase">Задачи</h1>
          <p className="text-text-secondary text-sm">
            Создание, смена статуса и хранение на клиенте до бэкенда
          </p>
        </div>
        <div className="flex w-full flex-col gap-2 sm:flex-row md:w-auto md:items-center">
          <Input
            value={listFilter}
            onChange={(e) => setListFilter(e.target.value)}
            placeholder="Поиск: артикул, заказ, сезон, этап…"
            className="max-w-md text-sm"
            aria-label="Фильтр задач по артикулу, заказу, сезону"
          />
          <div className="flex gap-2">
            <Button variant="outline" size="sm" asChild>
              <Link href={`${ROUTES.brand.calendar}?layers=tasks`} className="gap-2">
                <Calendar className="h-4 w-4" /> Календарь
              </Link>
            </Button>
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm" className="gap-2">
                  <Plus className="h-4 w-4" /> Новая задача
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Новая задача</DialogTitle>
                </DialogHeader>
                <div className="space-y-3 py-2">
                  <div>
                    <Label className="text-xs">Название</Label>
                    <Input
                      value={newTitle}
                      onChange={(e) => setNewTitle(e.target.value)}
                      className="mt-1"
                      placeholder="Что сделать"
                    />
                  </div>
                  <div>
                    <Label className="text-xs">Ответственный</Label>
                    <Input
                      value={newAssignee}
                      onChange={(e) => setNewAssignee(e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label className="text-xs">Срок</Label>
                    <Input
                      value={newDue}
                      onChange={(e) => setNewDue(e.target.value)}
                      className="mt-1"
                      placeholder="Пт / 2026-04-01"
                    />
                  </div>
                  <div>
                    <Label className="text-xs">Проект</Label>
                    <Input
                      value={newProject}
                      onChange={(e) => setNewProject(e.target.value)}
                      className="mt-1"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setDialogOpen(false)}>
                    Отмена
                  </Button>
                  <Button onClick={addTask} disabled={!newTitle.trim()}>
                    Добавить
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {columns.map((col) => (
          <Card key={col.id} className="border-border-subtle rounded-xl border">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center justify-between text-sm">
                {col.title}
                <Badge variant="secondary" className="text-[10px]">
                  {col.tasks.length}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {col.tasks.length === 0 ? (
                <p className="text-text-muted py-4 text-[11px]">Нет задач</p>
              ) : (
                col.tasks.map((t) => (
                  <div
                    key={t.id}
                    className="border-border-subtle space-y-2 rounded-lg border bg-white p-3"
                  >
                    <p className="text-sm font-medium">{t.title}</p>
                    <div className="text-text-secondary mt-1 flex items-center gap-2 text-[10px]">
                      <span className="flex items-center gap-1">
                        <User className="h-3 w-3" /> {t.assignee}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" /> {t.due}
                      </span>
                    </div>
                    <Badge variant="outline" className="text-[8px]">
                      {t.project}
                    </Badge>
                    <div className="flex flex-wrap gap-1 pt-1">
                      {(['todo', 'in_progress', 'done'] as BrandTaskStatus[]).map((st) => (
                        <Button
                          key={st}
                          type="button"
                          variant={t.status === st ? 'default' : 'outline'}
                          size="sm"
                          className="h-6 px-2 text-[8px] uppercase"
                          title={
                            t.id.startsWith('demo-stage-')
                              ? 'Демо из матрицы этапов: колонка сохраняется в этой вкладке до закрытия браузера'
                              : undefined
                          }
                          onClick={() => setTaskStatus(t.id, st)}
                        >
                          {st === 'todo' ? 'К делу' : st === 'in_progress' ? 'В работе' : 'Готово'}
                        </Button>
                      ))}
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <RelatedModulesBlock links={getTaskLinks()} />
    </RegistryPageShell>
  );
}

export default function BrandTasksPage() {
  return (
    <Suspense fallback={<div className="text-text-secondary py-10 text-sm">Загрузка…</div>}>
      <BrandTasksPageInner />
    </Suspense>
  );
}

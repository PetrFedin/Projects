'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ROUTES } from '@/lib/routes';
import {
  getLookbookProjects,
  addLookbookProject,
  updateLookbookProject,
  type LookbookProject,
  type LookbookVisibility,
} from '@/lib/b2b/lookbook-projects-store';
import { BookOpen, Plus, Eye, Lock, Calendar, FileText, Droplets } from 'lucide-react';

const BRAND_ID = 'syntha';
const BRAND_NAME = 'Syntha';

export default function BrandLookbookProjectsPage() {
  const [projects, setProjects] = useState<LookbookProject[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    name: '',
    lookbookUrl: '/lookbooks/new.pdf',
    visibility: 'invited' as LookbookVisibility,
    invitedPartnerIds: 'podium, tsum',
    visibleUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
  });

  const load = useCallback(() => setProjects(getLookbookProjects(BRAND_ID)), []);
  useEffect(() => { load(); }, [load]);

  const handleAdd = () => {
    const partnerIds = form.invitedPartnerIds.split(',').map((s) => s.trim()).filter(Boolean);
    addLookbookProject({
      name: form.name || 'New Lookbook',
      brandId: BRAND_ID,
      brandName: BRAND_NAME,
      lookbookUrl: form.lookbookUrl,
      visibility: form.visibility,
      invitedPartnerIds: form.visibility === 'invited' ? partnerIds : [],
      visibleUntil: new Date(form.visibleUntil).toISOString(),
    });
    setForm({ name: '', lookbookUrl: '/lookbooks/new.pdf', visibility: 'invited', invitedPartnerIds: 'podium, tsum', visibleUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10) });
    setShowForm(false);
    load();
  };

  const setWatermarked = (id: string) => {
    updateLookbookProject(id, { watermarkedPdfUrl: `/lookbooks/${id}-watermarked.pdf` });
    load();
  };

  const now = new Date().toISOString();
  return (
    <div className="container max-w-4xl mx-auto px-4 py-6 pb-24 space-y-6">
      <div>
        <h1 className="text-xl font-bold uppercase tracking-tight flex items-center gap-2">
          <BookOpen className="h-6 w-6" /> Лукбуки как проекты
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Colect: права (кто видит, до какой даты), watermarked PDF, заказ из лукбука.
        </p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base">Проекты лукбуков</CardTitle>
              <CardDescription>Коллекция = проект: ссылка на лукбук, видимость и срок.</CardDescription>
            </div>
            <Button size="sm" onClick={() => setShowForm((x) => !x)} className="gap-1">
              <Plus className="h-4 w-4" /> Новый
            </Button>
          </div>
        </CardHeader>
        {showForm && (
          <CardContent className="border-t border-slate-100 pt-4 space-y-3">
            <input placeholder="Название" className="w-full rounded-lg border px-3 py-2 text-sm" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} />
            <input placeholder="URL лукбука / PDF" className="w-full rounded-lg border px-3 py-2 text-sm" value={form.lookbookUrl} onChange={(e) => setForm((f) => ({ ...f, lookbookUrl: e.target.value }))} />
            <div className="flex gap-4 items-center">
              <label className="text-sm">Кто видит:</label>
              <select className="rounded-lg border px-3 py-2 text-sm" value={form.visibility} onChange={(e) => setForm((f) => ({ ...f, visibility: e.target.value as LookbookVisibility }))}>
                <option value="all">Все партнёры</option>
                <option value="invited">Только приглашённые</option>
              </select>
              {form.visibility === 'invited' && (
                <input placeholder="ID партнёров через запятую" className="flex-1 rounded-lg border px-3 py-2 text-sm" value={form.invitedPartnerIds} onChange={(e) => setForm((f) => ({ ...f, invitedPartnerIds: e.target.value }))} />
              )}
            </div>
            <div className="flex gap-2 items-center">
              <label className="text-sm">Виден до:</label>
              <input type="date" className="rounded-lg border px-3 py-2 text-sm" value={form.visibleUntil} onChange={(e) => setForm((f) => ({ ...f, visibleUntil: e.target.value }))} />
            </div>
            <Button size="sm" onClick={handleAdd}>Добавить проект</Button>
          </CardContent>
        )}
        <CardContent className={showForm ? 'border-t border-slate-100' : ''}>
          <ul className="space-y-3">
            {projects.map((p) => {
              const expired = p.visibleUntil < now;
              return (
                <li key={p.id} className="flex items-center justify-between p-3 rounded-lg border border-slate-200">
                  <div className="flex items-center gap-3">
                    <FileText className="h-5 w-5 text-slate-400" />
                    <div>
                      <p className="font-medium">{p.name}</p>
                      <div className="flex items-center gap-2 mt-0.5 text-xs text-slate-500">
                        {p.visibility === 'all' ? <><Eye className="h-3 w-3" /> Все</> : <><Lock className="h-3 w-3" /> Приглашённые</>}
                        <span><Calendar className="h-3 w-3 inline mr-0.5" /> до {new Date(p.visibleUntil).toLocaleDateString('ru-RU')}</span>
                        {expired && <Badge variant="secondary">Истёк</Badge>}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {!p.watermarkedPdfUrl && (
                      <Button size="sm" variant="outline" onClick={() => setWatermarked(p.id)} className="gap-1">
                        <Droplets className="h-3 w-3" /> Watermarked PDF
                      </Button>
                    )}
                    {p.watermarkedPdfUrl && <Badge variant="outline" className="gap-1"><Droplets className="h-3 w-3" /> PDF с водяным знаком</Badge>}
                    <Button size="sm" variant="outline" asChild>
                      <a href={p.lookbookUrl} target="_blank" rel="noopener noreferrer">Открыть</a>
                    </Button>
                  </div>
                </li>
              );
            })}
          </ul>
        </CardContent>
      </Card>

      <div className="flex gap-2">
        <Button variant="outline" size="sm" asChild><Link href={ROUTES.brand.b2bOrders}>Заказы B2B</Link></Button>
        <Button variant="outline" size="sm" asChild><Link href={ROUTES.brand.partnerMap}>Карта партнёров</Link></Button>
      </div>
    </div>
  );
}

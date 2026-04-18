'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { PackageCheck, Plus, Loader2, CheckCircle2 } from 'lucide-react';
import { createGRN, getGRNs } from '@/lib/production/plm-extended';

export function GRNPanel() {
  const [grns, setGrns] = useState<
    Array<{
      id: number;
      material_order_id: number;
      received_qty: number;
      ordered_qty: number;
      variance: number;
      status: string;
      received_at: string;
      received_by: string;
    }>
  >([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    material_order_id: 1,
    received_qty: 100,
    ordered_qty: 100,
    status: 'accepted',
    received_by: 'Приёмщик',
    notes: '',
  });

  const load = async () => {
    setLoading(true);
    try {
      const data = await getGRNs();
      setGrns(Array.isArray(data) ? data : []);
    } catch {
      setGrns([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleCreate = async () => {
    setCreating(true);
    try {
      await createGRN({
        material_order_id: form.material_order_id,
        received_qty: form.received_qty,
        ordered_qty: form.ordered_qty,
        status: form.status,
        received_by: form.received_by,
        notes: form.notes || undefined,
      });
      setOpen(false);
      load();
    } finally {
      setCreating(false);
    }
  };

  return (
<<<<<<< HEAD
    <Card className="overflow-hidden rounded-2xl border border-slate-200">
      <CardHeader className="flex flex-row items-center justify-between border-b border-slate-100 p-4">
=======
    <Card className="border-border-default overflow-hidden rounded-2xl border">
      <CardHeader className="border-border-subtle flex flex-row items-center justify-between border-b p-4">
>>>>>>> recover/cabinet-wip-from-stash
        <CardTitle className="flex items-center gap-2 text-xs font-black uppercase">
          <PackageCheck className="h-4 w-4 text-emerald-600" />
          Приёмка материалов (GRN)
        </CardTitle>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="h-8 gap-1 text-[9px] font-bold uppercase">
              <Plus className="h-3 w-3" /> Зарегистрировать
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Новая приёмка</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div>
                <Label className="text-[10px]">ID заказа материала</Label>
                <Input
                  type="number"
                  value={form.material_order_id}
                  onChange={(e) => setForm((f) => ({ ...f, material_order_id: +e.target.value }))}
                  className="mt-1"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-[10px]">Заказано</Label>
                  <Input
                    type="number"
                    value={form.ordered_qty}
                    onChange={(e) => setForm((f) => ({ ...f, ordered_qty: +e.target.value }))}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label className="text-[10px]">Получено</Label>
                  <Input
                    type="number"
                    value={form.received_qty}
                    onChange={(e) => setForm((f) => ({ ...f, received_qty: +e.target.value }))}
                    className="mt-1"
                  />
                </div>
              </div>
              <div>
                <Label className="text-[10px]">Статус</Label>
                <select
                  value={form.status}
                  onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))}
<<<<<<< HEAD
                  className="mt-1 h-9 w-full rounded-lg border border-slate-200 px-3 text-sm"
=======
                  className="border-border-default mt-1 h-9 w-full rounded-lg border px-3 text-sm"
>>>>>>> recover/cabinet-wip-from-stash
                >
                  <option value="accepted">Принято</option>
                  <option value="short">Недопоставка</option>
                  <option value="over">Перепоставка</option>
                  <option value="damage">Повреждение</option>
                </select>
              </div>
              <div>
                <Label className="text-[10px]">Принял</Label>
                <Input
                  value={form.received_by}
                  onChange={(e) => setForm((f) => ({ ...f, received_by: e.target.value }))}
                  className="mt-1"
                />
              </div>
              <div>
                <Label className="text-[10px]">Комментарий</Label>
                <Input
                  value={form.notes}
                  onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
                  placeholder="Опционально"
                  className="mt-1"
                />
              </div>
            </div>
            <Button onClick={handleCreate} disabled={creating}>
              {creating ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <CheckCircle2 className="h-4 w-4" />
              )}
              <span className="ml-2">Создать GRN</span>
            </Button>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent className="p-4">
        {loading ? (
          <div className="flex justify-center py-8">
<<<<<<< HEAD
            <Loader2 className="h-6 w-6 animate-spin text-slate-300" />
          </div>
        ) : grns.length === 0 ? (
          <p className="py-6 text-center text-[10px] text-slate-400">
=======
            <Loader2 className="text-text-muted h-6 w-6 animate-spin" />
          </div>
        ) : grns.length === 0 ? (
          <p className="text-text-muted py-6 text-center text-[10px]">
>>>>>>> recover/cabinet-wip-from-stash
            Нет приёмок. Зарегистрируйте первую.
          </p>
        ) : (
          <div className="max-h-60 space-y-2 overflow-y-auto">
            {grns.map((g) => (
              <div
                key={g.id}
<<<<<<< HEAD
                className="flex items-center justify-between rounded-xl bg-slate-50 p-2 text-[10px]"
=======
                className="bg-bg-surface2 flex items-center justify-between rounded-xl p-2 text-[10px]"
>>>>>>> recover/cabinet-wip-from-stash
              >
                <div>
                  <p className="font-bold">
                    Order #{g.material_order_id} · {g.received_qty}/{g.ordered_qty}
                  </p>
<<<<<<< HEAD
                  <p className="text-slate-500">
=======
                  <p className="text-text-secondary">
>>>>>>> recover/cabinet-wip-from-stash
                    {new Date(g.received_at).toLocaleDateString()} · {g.received_by}
                  </p>
                </div>
                <Badge
                  className={
                    g.status === 'accepted'
                      ? 'bg-emerald-100 text-emerald-700'
                      : g.status === 'short'
                        ? 'bg-amber-100 text-amber-700'
<<<<<<< HEAD
                        : 'bg-slate-100'
=======
                        : 'bg-bg-surface2'
>>>>>>> recover/cabinet-wip-from-stash
                  }
                >
                  {g.status}
                </Badge>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

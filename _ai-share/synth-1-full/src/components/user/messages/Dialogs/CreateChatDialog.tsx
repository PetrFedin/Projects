import React from 'react';
import { 
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter 
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, Package, Factory } from 'lucide-react';
import { cn } from '@/lib/utils';
import { chatGroupConfig, ROLE_PERMISSIONS } from '../constants';
import { UserRole } from '@/lib/types';

interface CreateChatDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreate: (name: string, groupKey: string, opts?: { linkOrderId?: string; linkCollectionId?: string }) => void;
  currentRole: UserRole;
}

export const CreateChatDialog: React.FC<CreateChatDialogProps> = ({
  open,
  onOpenChange,
  onCreate,
  currentRole
}) => {
  const [name, setName] = React.useState('Новый чат');
  const [groupKey, setGroupKey] = React.useState<string>('team');
  const [newGroupName, setNewGroupName] = React.useState('');
  const [customGroups, setCustomGroups] = React.useState<Array<{ key: string; label: string }>>([]);
  const [linkType, setLinkType] = React.useState<'none' | 'order' | 'collection'>('none');
  const [linkId, setLinkId] = React.useState('');

  const groups = React.useMemo(() => {
    const permissions = ROLE_PERMISSIONS[currentRole] || [];
    const base = Object.entries(chatGroupConfig)
      .filter(([k]) => !['archived', 'starred', 'all'].includes(k) && permissions.includes(k))
      .map(([k, v]) => ({ key: k, label: v.label }));
    return [...base, ...customGroups];
  }, [customGroups, currentRole]);

  React.useEffect(() => {
    if (!open) return;
    setName('Новый чат');
    setGroupKey('team');
    setNewGroupName('');
    setLinkType('none');
    setLinkId('');
  }, [open]);

  function createGroup() {
    const label = newGroupName.trim();
    if (!label) return;
    const key = `custom_${label.toLowerCase().replace(/\s+/g, '_')}_${Date.now()}`;
    setCustomGroups((p) => [...p, { key, label }]);
    setGroupKey(key);
    setNewGroupName('');
  }

  function submit() {
    const opts =
      linkType === 'order' && linkId
        ? { linkOrderId: linkId }
        : linkType === 'collection' && linkId
          ? { linkCollectionId: linkId }
          : undefined;
    onCreate(name.trim() || 'Новый чат', groupKey, opts);
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl bg-white rounded-xl border-none shadow-2xl p-3">
        <DialogHeader className="space-y-3 mb-6">
          <DialogTitle className="text-base font-black tracking-tighter text-slate-800 uppercase">Создать чат</DialogTitle>
          <DialogDescription className="text-slate-400 font-bold text-[10px] uppercase tracking-widest">
            Организуйте взаимодействие в едином пространстве
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label className="text-[10px] font-black uppercase tracking-[0.2rem] text-slate-400 ml-2">Название чата</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} className="bg-slate-50 border-slate-100 rounded-2xl h-12 font-bold text-sm px-5" />
          </div>

          <div className="space-y-2">
            <Label className="text-[10px] font-black uppercase tracking-[0.2rem] text-slate-400 ml-2">Группа назначения</Label>
            <div className="grid grid-cols-2 gap-3">
              {groups.map((g) => (
                <Button
                  key={g.key}
                  type="button"
                  variant={groupKey === g.key ? 'default' : 'outline'}
                  className={cn(
                    "justify-start h-12 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                    groupKey === g.key ? "bg-slate-900 text-white shadow-lg" : "bg-slate-50 border-slate-100 text-slate-400 hover:bg-white"
                  )}
                  onClick={() => setGroupKey(g.key)}
                >
                  {g.label}
                </Button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-[10px] font-black uppercase tracking-[0.2rem] text-slate-400 ml-2">Привязать к</Label>
            <div className="flex flex-wrap gap-2">
              <Button type="button" variant={linkType === 'none' ? 'default' : 'outline'} size="sm" className="h-8 text-[9px]" onClick={() => setLinkType('none')}>
                Нет
              </Button>
              <Button type="button" variant={linkType === 'order' ? 'default' : 'outline'} size="sm" className="h-8 text-[9px]" onClick={() => setLinkType('order')}>
                <Package className="h-3 w-3 mr-1" /> Заказ
              </Button>
              <Button type="button" variant={linkType === 'collection' ? 'default' : 'outline'} size="sm" className="h-8 text-[9px]" onClick={() => setLinkType('collection')}>
                <Factory className="h-3 w-3 mr-1" /> Коллекция
              </Button>
            </div>
            {linkType !== 'none' && (
              <select
                className="h-9 w-full rounded-lg border border-slate-200 px-3 text-[10px] font-bold"
                value={linkId}
                onChange={e => setLinkId(e.target.value)}
              >
                <option value="">Выбрать…</option>
                {linkType === 'order' && (
                  <>
                    <option value="ORD-4420">ORD-4420 — ЦУМ</option>
                    <option value="ORD-4521">ORD-4521 — Podium</option>
                  </>
                )}
                {linkType === 'collection' && (
                  <>
                    <option value="SS26">SS26</option>
                    <option value="FW26">FW26</option>
                  </>
                )}
              </select>
            )}
          </div>

          <div className="space-y-2">
            <Label className="text-[10px] font-black uppercase tracking-[0.2rem] text-slate-400 ml-2">Новая группа</Label>
            <div className="flex gap-3">
              <Input value={newGroupName} onChange={(e) => setNewGroupName(e.target.value)} placeholder="Напр: Логистика" className="bg-slate-50 border-slate-100 rounded-2xl h-12 font-bold text-xs px-5" />
              <Button variant="outline" onClick={createGroup} className="h-12 rounded-2xl px-6 border-slate-100 hover:bg-slate-50">
                <Plus className="h-4 w-4 mr-2" />
                <span className="text-[10px] font-black uppercase tracking-widest">Добавить</span>
              </Button>
            </div>
          </div>
        </div>

        <DialogFooter className="mt-10 gap-3">
          <Button variant="ghost" onClick={() => onOpenChange(false)} className="rounded-2xl h-12 px-8 font-black text-[10px] uppercase text-slate-400 tracking-widest">
            Отмена
          </Button>
          <Button onClick={submit} className="bg-blue-600 hover:bg-blue-700 text-white rounded-2xl h-12 px-10 font-black text-[10px] uppercase tracking-[0.2rem] shadow-xl shadow-blue-100">
            СОЗДАТЬ
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

'use client';

import { useState, useEffect } from 'react';
import { TeamMember, TeamMemberStatus } from '@/lib/types';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { Camera, Lock, Send, MessageCircle, Instagram, Globe, ShieldCheck, Shield, User, X, Save, Eye, EyeOff } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Switch } from '@/components/ui/switch';

interface EditMemberDialogProps {
  member: TeamMember;
  onSave: (data: Partial<TeamMember>) => void;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const EditMemberDialog = ({ 
  member, 
  onSave, 
  open, 
  onOpenChange 
}: EditMemberDialogProps) => {
  const [formData, setFormData] = useState<Partial<TeamMember>>(member);

  useEffect(() => {
    if (open) setFormData(member);
  }, [open, member]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl p-0 rounded-xl overflow-hidden border-none shadow-[0_0_50px_rgba(0,0,0,0.2)] bg-white h-[85vh]">
        <DialogTitle className="sr-only">Редактирование сотрудника: {member.firstName} {member.lastName}</DialogTitle>
        <DialogDescription className="sr-only">Изменение личных данных, контактной информации и настроек доступа сотрудника.</DialogDescription>
        <div className="grid grid-cols-1 md:grid-cols-5 h-full">
          <div className="md:col-span-2 bg-slate-900 p-4 text-white flex flex-col items-center justify-center text-center">
            <div className="relative group mb-6">
              <Avatar className="h-32 w-24 rounded-3xl border-4 border-white/10 shadow-2xl overflow-hidden transition-transform duration-500 group-hover:scale-105">
                <AvatarImage src={formData.avatar} className="object-cover" />
                <AvatarFallback className="text-base font-black bg-slate-800">{formData.firstName?.[0]}</AvatarFallback>
              </Avatar>
              <button className="absolute -bottom-2 -right-2 h-10 w-10 bg-white text-black rounded-xl shadow-xl flex items-center justify-center hover:scale-110 active:scale-90 transition-all opacity-0 group-hover:opacity-100">
                <Camera className="h-5 w-5" />
              </button>
            </div>
            <h3 className="text-base font-black tracking-tight">{formData.firstName} {formData.lastName}</h3>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 mt-2">Карточка сотрудника</p>
            
            <div className="w-full mt-8 pt-8 border-t border-white/5 space-y-4">
              <div className="flex items-center gap-3 p-4 bg-white/5 rounded-[1.5rem] border border-white/5 transition-all hover:bg-white/10">
                <div className={cn(
                  "h-10 w-10 rounded-xl flex items-center justify-center shadow-lg",
                  member.status === 'admin' ? "bg-amber-400 text-black" :
                  member.status === 'co-admin' ? "bg-indigo-50 text-white" :
                  "bg-white/10 text-white/40"
                )}>
                  {member.status === 'admin' ? <ShieldCheck className="h-6 w-6" /> : 
                   member.status === 'co-admin' ? <Shield className="h-6 w-6" /> : 
                   <User className="h-6 w-6" />}
                </div>
                <div className="text-left">
                  <p className="text-[8px] font-black uppercase text-white/30 tracking-widest leading-none mb-1">Уровень доступа</p>
                  <p className="text-[10px] font-black uppercase tracking-tight">
                    {member.status === 'admin' ? 'Главный админ' : member.status === 'co-admin' ? 'Доп. админ' : 'Сотрудник'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="md:col-span-3 bg-white flex flex-col h-full overflow-hidden">
            <header className="p-4 border-b border-slate-50 flex items-center justify-between shrink-0">
              <h2 className="text-sm font-black tracking-tighter text-slate-900 uppercase">Редактирование</h2>
              <Button variant="ghost" size="icon" onClick={() => onOpenChange(false)} className="rounded-full h-8 w-8 hover:bg-slate-50"><X className="h-4 w-4" /></Button>
            </header>

            <div className="flex-1 overflow-y-auto custom-scrollbar p-4">
              <div className="space-y-4 pb-32">
                <div className="space-y-4">
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-300">Личные данные</p>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <label className="text-[9px] font-black uppercase text-slate-400 ml-1">Имя</label>
                      <Input 
                        value={formData.firstName} 
                        onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                        className="rounded-2xl h-11 bg-slate-50 border-none font-bold focus:ring-2 ring-indigo-500/20" 
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[9px] font-black uppercase text-slate-400 ml-1">Фамилия</label>
                      <Input 
                        value={formData.lastName} 
                        onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                        className="rounded-2xl h-11 bg-slate-50 border-none font-bold focus:ring-2 ring-indigo-500/20" 
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <label className="text-[9px] font-black uppercase text-slate-400 ml-1">Никнейм</label>
                      <Input 
                        value={formData.nickname} 
                        onChange={(e) => setFormData({ ...formData, nickname: e.target.value })}
                        className="rounded-2xl h-11 bg-slate-50 border-none font-black text-indigo-600 focus:ring-2 ring-indigo-500/20" 
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[9px] font-black uppercase text-slate-400 ml-1">Должность</label>
                      <Input 
                        value={formData.role} 
                        onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                        className="rounded-2xl h-11 bg-slate-50 border-none font-bold focus:ring-2 ring-indigo-500/20" 
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <label className="text-[9px] font-black uppercase text-slate-400 ml-1">Подразделение (Группа)</label>
                      <Input 
                        value={formData.department || ''} 
                        placeholder="Напр. Логистика / Финансы / IT"
                        onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                        className="rounded-2xl h-11 bg-slate-50 border-none font-bold focus:ring-2 ring-indigo-500/20" 
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[9px] font-black uppercase text-slate-400 ml-1">Дата начала работы</label>
                      <Input 
                        type="date"
                        value={formData.joinedAt?.split('T')[0] || ''} 
                        onChange={(e) => setFormData({ ...formData, joinedAt: e.target.value })}
                        className="rounded-2xl h-11 bg-slate-50 border-none font-bold focus:ring-2 ring-indigo-500/20" 
                      />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-black uppercase text-slate-400 ml-1">Компетенции (Skills Matrix)</label>
                    <Input 
                      value={formData.skills?.join(', ') || ''} 
                      placeholder="Укажите навыки через запятую (напр. Дизайн, 3D, Логистика)"
                      onChange={(e) => setFormData({ ...formData, skills: e.target.value.split(',').map(s => s.trim()).filter(s => s) })}
                      className="rounded-2xl h-11 bg-slate-50 border-none font-bold focus:ring-2 ring-indigo-500/20" 
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-300">Этичность и Приватность</p>
                  <div className="bg-slate-50 rounded-xl p-4 space-y-6 border border-slate-100">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-[11px] font-black uppercase tracking-tight">Рабочий календарь</Label>
                        <p className="text-[9px] text-slate-400 font-bold uppercase">Видимость задач и событий коллегам</p>
                      </div>
                      <Switch 
                        checked={formData.privacySettings?.showCalendar} 
                        onCheckedChange={(checked) => setFormData({ 
                          ...formData, 
                          privacySettings: { ...formData.privacySettings, showCalendar: checked } as any 
                        })} 
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-[11px] font-black uppercase tracking-tight">Рабочие задачи</Label>
                        <p className="text-[9px] text-slate-400 font-bold uppercase">Открытость статусов текущих дел</p>
                      </div>
                      <Switch 
                        checked={formData.privacySettings?.showTasks} 
                        onCheckedChange={(checked) => setFormData({ 
                          ...formData, 
                          privacySettings: { ...formData.privacySettings, showTasks: checked } as any 
                        })} 
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-[11px] font-black uppercase tracking-tight">Активность (Live)</Label>
                        <p className="text-[9px] text-slate-400 font-bold uppercase">Трансляция «В эфире» (что делает сейчас)</p>
                      </div>
                      <Switch 
                        checked={formData.privacySettings?.showActivity} 
                        onCheckedChange={(checked) => setFormData({ 
                          ...formData, 
                          privacySettings: { ...formData.privacySettings, showActivity: checked } as any 
                        })} 
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-[11px] font-black uppercase tracking-tight">Финансовые KPI</Label>
                        <p className="text-[9px] text-slate-400 font-bold uppercase">Публичность личных достижений и бонусов</p>
                      </div>
                      <Switch 
                        checked={formData.privacySettings?.showFinancials} 
                        onCheckedChange={(checked) => setFormData({ 
                          ...formData, 
                          privacySettings: { ...formData.privacySettings, showFinancials: checked } as any 
                        })} 
                      />
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-4 bg-indigo-50 rounded-2xl border border-indigo-100">
                    <ShieldCheck className="h-4 w-4 text-indigo-600 shrink-0 mt-0.5" />
                    <p className="text-[9px] text-indigo-900 font-medium leading-relaxed uppercase">
                      Личные переписки и задачи, отмеченные как «приватные», скрыты от всех участников команды по умолчанию, независимо от роли.
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-300">Безопасность</p>
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-black uppercase text-slate-400 ml-1">Смена кода доступа</label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300" />
                      <Input 
                        placeholder="Новый пароль"
                        type="password"
                        value={formData.password || ''} 
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        className="rounded-2xl h-11 bg-slate-50 border-none font-bold pl-11 focus:ring-2 ring-indigo-500/20" 
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-300">Контакты</p>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <label className="text-[9px] font-black uppercase text-slate-400 ml-1">Телефон</label>
                      <Input 
                        value={formData.phone || ''} 
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="rounded-2xl h-11 bg-slate-50 border-none font-bold focus:ring-2 ring-indigo-500/20" 
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[9px] font-black uppercase text-slate-400 ml-1">Email</label>
                      <Input 
                        value={formData.email} 
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="rounded-2xl h-11 bg-slate-50 border-none font-bold focus:ring-2 ring-indigo-500/20" 
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-300">Интеграция сетей</p>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="relative">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 bg-indigo-50 rounded-lg flex items-center justify-center">
                        <Send className="h-3 w-3 text-indigo-600" />
                      </div>
                      <Input 
                        placeholder="Telegram"
                        value={formData.socials?.telegram} 
                        onChange={(e) => setFormData({ ...formData, socials: { ...formData.socials, telegram: e.target.value } })}
                        className="rounded-2xl h-11 bg-slate-50 border-none font-medium pl-12 text-xs focus:ring-2 ring-indigo-500/20" 
                      />
                    </div>
                    <div className="relative">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 bg-green-50 rounded-lg flex items-center justify-center">
                        <MessageCircle className="h-3 w-3 text-green-600" />
                      </div>
                      <Input 
                        placeholder="WhatsApp"
                        value={formData.socials?.whatsapp} 
                        onChange={(e) => setFormData({ ...formData, socials: { ...formData.socials, whatsapp: e.target.value } })}
                        className="rounded-2xl h-11 bg-slate-50 border-none font-medium pl-12 text-xs focus:ring-2 ring-indigo-500/20" 
                      />
                    </div>
                    <div className="relative">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 bg-pink-50 rounded-lg flex items-center justify-center">
                        <Instagram className="h-3 w-3 text-pink-600" />
                      </div>
                      <Input 
                        placeholder="Instagram"
                        value={formData.socials?.instagram} 
                        onChange={(e) => setFormData({ ...formData, socials: { ...formData.socials, instagram: e.target.value } })}
                        className="rounded-2xl h-11 bg-slate-50 border-none font-medium pl-12 text-xs focus:ring-2 ring-indigo-500/20" 
                      />
                    </div>
                    <div className="relative">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 bg-slate-100 rounded-lg flex items-center justify-center">
                        <Globe className="h-3 w-3 text-slate-600" />
                      </div>
                      <Input 
                        placeholder="MAX"
                        value={formData.socials?.max} 
                        onChange={(e) => setFormData({ ...formData, socials: { ...formData.socials, max: e.target.value } })}
                        className="rounded-2xl h-11 bg-slate-50 border-none font-medium pl-12 text-xs focus:ring-2 ring-indigo-500/20" 
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <footer className="p-4 border-t border-slate-50 bg-white shrink-0">
              <Button 
                onClick={() => onSave(formData)}
                className="w-full h-10 bg-black hover:bg-slate-800 text-white rounded-[1.5rem] font-black uppercase tracking-widest text-xs shadow-xl shadow-slate-200 transition-all hover:scale-[1.02] active:scale-95 group"
              >
                <Save className="mr-2 h-5 w-5 transition-transform group-hover:rotate-12" />
                Сохранить изменения
              </Button>
            </footer>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditMemberDialog;

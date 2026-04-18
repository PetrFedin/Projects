'use client';

import { useState, useEffect } from 'react';
import { TeamMember, TeamMemberStatus } from '@/lib/types';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import {
  Camera,
  Lock,
  Send,
  MessageCircle,
  Instagram,
  Globe,
  ShieldCheck,
  Shield,
  User,
  X,
  Save,
  Eye,
  EyeOff,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Switch } from '@/components/ui/switch';

interface EditMemberDialogProps {
  member: TeamMember;
  onSave: (data: Partial<TeamMember>) => void;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const EditMemberDialog = ({ member, onSave, open, onOpenChange }: EditMemberDialogProps) => {
  const [formData, setFormData] = useState<Partial<TeamMember>>(member);

  useEffect(() => {
    if (open) setFormData(member);
  }, [open, member]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="h-[85vh] max-w-2xl overflow-hidden rounded-xl border-none bg-white p-0 shadow-[0_0_50px_rgba(0,0,0,0.2)]">
        <DialogTitle className="sr-only">
          Редактирование сотрудника: {member.firstName} {member.lastName}
        </DialogTitle>
        <DialogDescription className="sr-only">
          Изменение личных данных, контактной информации и настроек доступа сотрудника.
        </DialogDescription>
        <div className="grid h-full grid-cols-1 md:grid-cols-5">
          <div className="flex flex-col items-center justify-center bg-slate-900 p-4 text-center text-white md:col-span-2">
            <div className="group relative mb-6">
              <Avatar className="h-32 w-24 overflow-hidden rounded-3xl border-4 border-white/10 shadow-2xl transition-transform duration-500 group-hover:scale-105">
                <AvatarImage src={formData.avatar} className="object-cover" />
                <AvatarFallback className="bg-slate-800 text-base font-black">
                  {formData.firstName?.[0]}
                </AvatarFallback>
              </Avatar>
              <button className="absolute -bottom-2 -right-2 flex h-10 w-10 items-center justify-center rounded-xl bg-white text-black opacity-0 shadow-xl transition-all hover:scale-110 active:scale-90 group-hover:opacity-100">
                <Camera className="h-5 w-5" />
              </button>
            </div>
            <h3 className="text-base font-black tracking-tight">
              {formData.firstName} {formData.lastName}
            </h3>
            <p className="mt-2 text-[10px] font-black uppercase tracking-[0.2em] text-white/40">
              Карточка сотрудника
            </p>

            <div className="mt-8 w-full space-y-4 border-t border-white/5 pt-8">
              <div className="flex items-center gap-3 rounded-[1.5rem] border border-white/5 bg-white/5 p-4 transition-all hover:bg-white/10">
                <div
                  className={cn(
                    'flex h-10 w-10 items-center justify-center rounded-xl shadow-lg',
                    member.status === 'admin'
                      ? 'bg-amber-400 text-black'
                      : member.status === 'co-admin'
                        ? 'bg-indigo-50 text-white'
                        : 'bg-white/10 text-white/40'
                  )}
                >
                  {member.status === 'admin' ? (
                    <ShieldCheck className="h-6 w-6" />
                  ) : member.status === 'co-admin' ? (
                    <Shield className="h-6 w-6" />
                  ) : (
                    <User className="h-6 w-6" />
                  )}
                </div>
                <div className="text-left">
                  <p className="mb-1 text-[8px] font-black uppercase leading-none tracking-widest text-white/30">
                    Уровень доступа
                  </p>
                  <p className="text-[10px] font-black uppercase tracking-tight">
                    {member.status === 'admin'
                      ? 'Главный админ'
                      : member.status === 'co-admin'
                        ? 'Доп. админ'
                        : 'Сотрудник'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex h-full flex-col overflow-hidden bg-white md:col-span-3">
            <header className="flex shrink-0 items-center justify-between border-b border-slate-50 p-4">
              <h2 className="text-sm font-black uppercase tracking-tighter text-slate-900">
                Редактирование
              </h2>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onOpenChange(false)}
                className="h-8 w-8 rounded-full hover:bg-slate-50"
              >
                <X className="h-4 w-4" />
              </Button>
            </header>

            <div className="custom-scrollbar flex-1 overflow-y-auto p-4">
              <div className="space-y-4 pb-32">
                <div className="space-y-4">
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-300">
                    Личные данные
                  </p>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <label className="ml-1 text-[9px] font-black uppercase text-slate-400">
                        Имя
                      </label>
                      <Input
                        value={formData.firstName}
                        onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                        className="h-11 rounded-2xl border-none bg-slate-50 font-bold ring-indigo-500/20 focus:ring-2"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="ml-1 text-[9px] font-black uppercase text-slate-400">
                        Фамилия
                      </label>
                      <Input
                        value={formData.lastName}
                        onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                        className="h-11 rounded-2xl border-none bg-slate-50 font-bold ring-indigo-500/20 focus:ring-2"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <label className="ml-1 text-[9px] font-black uppercase text-slate-400">
                        Никнейм
                      </label>
                      <Input
                        value={formData.nickname}
                        onChange={(e) => setFormData({ ...formData, nickname: e.target.value })}
                        className="h-11 rounded-2xl border-none bg-slate-50 font-black text-indigo-600 ring-indigo-500/20 focus:ring-2"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="ml-1 text-[9px] font-black uppercase text-slate-400">
                        Должность
                      </label>
                      <Input
                        value={formData.role}
                        onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                        className="h-11 rounded-2xl border-none bg-slate-50 font-bold ring-indigo-500/20 focus:ring-2"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <label className="ml-1 text-[9px] font-black uppercase text-slate-400">
                        Подразделение (Группа)
                      </label>
                      <Input
                        value={formData.department || ''}
                        placeholder="Напр. Логистика / Финансы / IT"
                        onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                        className="h-11 rounded-2xl border-none bg-slate-50 font-bold ring-indigo-500/20 focus:ring-2"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="ml-1 text-[9px] font-black uppercase text-slate-400">
                        Дата начала работы
                      </label>
                      <Input
                        type="date"
                        value={formData.joinedAt?.split('T')[0] || ''}
                        onChange={(e) => setFormData({ ...formData, joinedAt: e.target.value })}
                        className="h-11 rounded-2xl border-none bg-slate-50 font-bold ring-indigo-500/20 focus:ring-2"
                      />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="ml-1 text-[9px] font-black uppercase text-slate-400">
                      Компетенции (Skills Matrix)
                    </label>
                    <Input
                      value={formData.skills?.join(', ') || ''}
                      placeholder="Укажите навыки через запятую (напр. Дизайн, 3D, Логистика)"
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          skills: e.target.value
                            .split(',')
                            .map((s) => s.trim())
                            .filter((s) => s),
                        })
                      }
                      className="h-11 rounded-2xl border-none bg-slate-50 font-bold ring-indigo-500/20 focus:ring-2"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-300">
                    Этичность и Приватность
                  </p>
                  <div className="space-y-6 rounded-xl border border-slate-100 bg-slate-50 p-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-[11px] font-black uppercase tracking-tight">
                          Рабочий календарь
                        </Label>
                        <p className="text-[9px] font-bold uppercase text-slate-400">
                          Видимость задач и событий коллегам
                        </p>
                      </div>
                      <Switch
                        checked={formData.privacySettings?.showCalendar}
                        onCheckedChange={(checked) =>
                          setFormData({
                            ...formData,
                            privacySettings: {
                              ...formData.privacySettings,
                              showCalendar: checked,
                            } as any,
                          })
                        }
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-[11px] font-black uppercase tracking-tight">
                          Рабочие задачи
                        </Label>
                        <p className="text-[9px] font-bold uppercase text-slate-400">
                          Открытость статусов текущих дел
                        </p>
                      </div>
                      <Switch
                        checked={formData.privacySettings?.showTasks}
                        onCheckedChange={(checked) =>
                          setFormData({
                            ...formData,
                            privacySettings: {
                              ...formData.privacySettings,
                              showTasks: checked,
                            } as any,
                          })
                        }
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-[11px] font-black uppercase tracking-tight">
                          Активность (Live)
                        </Label>
                        <p className="text-[9px] font-bold uppercase text-slate-400">
                          Трансляция «В эфире» (что делает сейчас)
                        </p>
                      </div>
                      <Switch
                        checked={formData.privacySettings?.showActivity}
                        onCheckedChange={(checked) =>
                          setFormData({
                            ...formData,
                            privacySettings: {
                              ...formData.privacySettings,
                              showActivity: checked,
                            } as any,
                          })
                        }
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-[11px] font-black uppercase tracking-tight">
                          Финансовые KPI
                        </Label>
                        <p className="text-[9px] font-bold uppercase text-slate-400">
                          Публичность личных достижений и бонусов
                        </p>
                      </div>
                      <Switch
                        checked={formData.privacySettings?.showFinancials}
                        onCheckedChange={(checked) =>
                          setFormData({
                            ...formData,
                            privacySettings: {
                              ...formData.privacySettings,
                              showFinancials: checked,
                            } as any,
                          })
                        }
                      />
                    </div>
                  </div>
                  <div className="flex items-start gap-3 rounded-2xl border border-indigo-100 bg-indigo-50 p-4">
                    <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-indigo-600" />
                    <p className="text-[9px] font-medium uppercase leading-relaxed text-indigo-900">
                      Личные переписки и задачи, отмеченные как «приватные», скрыты от всех
                      участников команды по умолчанию, независимо от роли.
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-300">
                    Безопасность
                  </p>
                  <div className="space-y-1.5">
                    <label className="ml-1 text-[9px] font-black uppercase text-slate-400">
                      Смена кода доступа
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-300" />
                      <Input
                        placeholder="Новый пароль"
                        type="password"
                        value={formData.password || ''}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        className="h-11 rounded-2xl border-none bg-slate-50 pl-11 font-bold ring-indigo-500/20 focus:ring-2"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-300">
                    Контакты
                  </p>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <label className="ml-1 text-[9px] font-black uppercase text-slate-400">
                        Телефон
                      </label>
                      <Input
                        value={formData.phone || ''}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="h-11 rounded-2xl border-none bg-slate-50 font-bold ring-indigo-500/20 focus:ring-2"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="ml-1 text-[9px] font-black uppercase text-slate-400">
                        Email
                      </label>
                      <Input
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="h-11 rounded-2xl border-none bg-slate-50 font-bold ring-indigo-500/20 focus:ring-2"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-300">
                    Интеграция сетей
                  </p>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="relative">
                      <div className="absolute left-4 top-1/2 flex h-5 w-5 -translate-y-1/2 items-center justify-center rounded-lg bg-indigo-50">
                        <Send className="h-3 w-3 text-indigo-600" />
                      </div>
                      <Input
                        placeholder="Telegram"
                        value={formData.socials?.telegram}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            socials: { ...formData.socials, telegram: e.target.value },
                          })
                        }
                        className="h-11 rounded-2xl border-none bg-slate-50 pl-12 text-xs font-medium ring-indigo-500/20 focus:ring-2"
                      />
                    </div>
                    <div className="relative">
                      <div className="absolute left-4 top-1/2 flex h-5 w-5 -translate-y-1/2 items-center justify-center rounded-lg bg-green-50">
                        <MessageCircle className="h-3 w-3 text-green-600" />
                      </div>
                      <Input
                        placeholder="WhatsApp"
                        value={formData.socials?.whatsapp}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            socials: { ...formData.socials, whatsapp: e.target.value },
                          })
                        }
                        className="h-11 rounded-2xl border-none bg-slate-50 pl-12 text-xs font-medium ring-indigo-500/20 focus:ring-2"
                      />
                    </div>
                    <div className="relative">
                      <div className="absolute left-4 top-1/2 flex h-5 w-5 -translate-y-1/2 items-center justify-center rounded-lg bg-pink-50">
                        <Instagram className="h-3 w-3 text-pink-600" />
                      </div>
                      <Input
                        placeholder="Instagram"
                        value={formData.socials?.instagram}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            socials: { ...formData.socials, instagram: e.target.value },
                          })
                        }
                        className="h-11 rounded-2xl border-none bg-slate-50 pl-12 text-xs font-medium ring-indigo-500/20 focus:ring-2"
                      />
                    </div>
                    <div className="relative">
                      <div className="absolute left-4 top-1/2 flex h-5 w-5 -translate-y-1/2 items-center justify-center rounded-lg bg-slate-100">
                        <Globe className="h-3 w-3 text-slate-600" />
                      </div>
                      <Input
                        placeholder="MAX"
                        value={formData.socials?.max}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            socials: { ...formData.socials, max: e.target.value },
                          })
                        }
                        className="h-11 rounded-2xl border-none bg-slate-50 pl-12 text-xs font-medium ring-indigo-500/20 focus:ring-2"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <footer className="shrink-0 border-t border-slate-50 bg-white p-4">
              <Button
                onClick={() => onSave(formData)}
                className="group h-10 w-full rounded-[1.5rem] bg-black text-xs font-black uppercase tracking-widest text-white shadow-xl shadow-slate-200 transition-all hover:scale-[1.02] hover:bg-slate-800 active:scale-95"
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

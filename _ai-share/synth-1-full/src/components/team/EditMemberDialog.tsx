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
          <div className="bg-text-primary flex flex-col items-center justify-center p-4 text-center text-white md:col-span-2">
            <div className="group relative mb-6">
              <Avatar className="h-32 w-24 overflow-hidden rounded-3xl border-4 border-white/10 shadow-2xl transition-transform duration-500 group-hover:scale-105">
                <AvatarImage src={formData.avatar} className="object-cover" />
                <AvatarFallback className="bg-text-primary/90 text-base font-black">
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
                        ? 'bg-accent-primary/10 text-white'
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
            <header className="border-border-subtle flex shrink-0 items-center justify-between border-b p-4">
              <h2 className="text-text-primary text-sm font-black uppercase tracking-tighter">
                Редактирование
              </h2>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onOpenChange(false)}
                className="hover:bg-bg-surface2 h-8 w-8 rounded-full"
              >
                <X className="h-4 w-4" />
              </Button>
            </header>

            <div className="custom-scrollbar flex-1 overflow-y-auto p-4">
              <div className="space-y-4 pb-32">
                <div className="space-y-4">
                  <p className="text-text-muted text-[10px] font-black uppercase tracking-[0.2em]">
                    Личные данные
                  </p>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <label className="text-text-muted ml-1 text-[9px] font-black uppercase">
                        Имя
                      </label>
                      <Input
                        value={formData.firstName}
                        onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                        className="bg-bg-surface2 ring-accent-primary/20 h-11 rounded-2xl border-none font-bold focus:ring-2"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-text-muted ml-1 text-[9px] font-black uppercase">
                        Фамилия
                      </label>
                      <Input
                        value={formData.lastName}
                        onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                        className="bg-bg-surface2 ring-accent-primary/20 h-11 rounded-2xl border-none font-bold focus:ring-2"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <label className="text-text-muted ml-1 text-[9px] font-black uppercase">
                        Никнейм
                      </label>
                      <Input
                        value={formData.nickname}
                        onChange={(e) => setFormData({ ...formData, nickname: e.target.value })}
                        className="bg-bg-surface2 text-accent-primary ring-accent-primary/20 h-11 rounded-2xl border-none font-black focus:ring-2"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-text-muted ml-1 text-[9px] font-black uppercase">
                        Должность
                      </label>
                      <Input
                        value={formData.role}
                        onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                        className="bg-bg-surface2 ring-accent-primary/20 h-11 rounded-2xl border-none font-bold focus:ring-2"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <label className="text-text-muted ml-1 text-[9px] font-black uppercase">
                        Подразделение (Группа)
                      </label>
                      <Input
                        value={formData.department || ''}
                        placeholder="Напр. Логистика / Финансы / IT"
                        onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                        className="bg-bg-surface2 ring-accent-primary/20 h-11 rounded-2xl border-none font-bold focus:ring-2"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-text-muted ml-1 text-[9px] font-black uppercase">
                        Дата начала работы
                      </label>
                      <Input
                        type="date"
                        value={formData.joinedAt?.split('T')[0] || ''}
                        onChange={(e) => setFormData({ ...formData, joinedAt: e.target.value })}
                        className="bg-bg-surface2 ring-accent-primary/20 h-11 rounded-2xl border-none font-bold focus:ring-2"
                      />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-text-muted ml-1 text-[9px] font-black uppercase">
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
                      className="bg-bg-surface2 ring-accent-primary/20 h-11 rounded-2xl border-none font-bold focus:ring-2"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <p className="text-text-muted text-[10px] font-black uppercase tracking-[0.2em]">
                    Этичность и Приватность
                  </p>
                  <div className="bg-bg-surface2 border-border-subtle space-y-6 rounded-xl border p-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-[11px] font-black uppercase tracking-tight">
                          Рабочий календарь
                        </Label>
                        <p className="text-text-muted text-[9px] font-bold uppercase">
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
                        <p className="text-text-muted text-[9px] font-bold uppercase">
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
                        <p className="text-text-muted text-[9px] font-bold uppercase">
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
                        <p className="text-text-muted text-[9px] font-bold uppercase">
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
                  <div className="bg-accent-primary/10 border-accent-primary/20 flex items-start gap-3 rounded-2xl border p-4">
                    <ShieldCheck className="text-accent-primary mt-0.5 h-4 w-4 shrink-0" />
                    <p className="text-accent-primary text-[9px] font-medium uppercase leading-relaxed">
                      Личные переписки и задачи, отмеченные как «приватные», скрыты от всех
                      участников команды по умолчанию, независимо от роли.
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <p className="text-text-muted text-[10px] font-black uppercase tracking-[0.2em]">
                    Безопасность
                  </p>
                  <div className="space-y-1.5">
                    <label className="text-text-muted ml-1 text-[9px] font-black uppercase">
                      Смена кода доступа
                    </label>
                    <div className="relative">
                      <Lock className="text-text-muted absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2" />
                      <Input
                        placeholder="Новый пароль"
                        type="password"
                        value={formData.password || ''}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        className="bg-bg-surface2 ring-accent-primary/20 h-11 rounded-2xl border-none pl-11 font-bold focus:ring-2"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <p className="text-text-muted text-[10px] font-black uppercase tracking-[0.2em]">
                    Контакты
                  </p>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <label className="text-text-muted ml-1 text-[9px] font-black uppercase">
                        Телефон
                      </label>
                      <Input
                        value={formData.phone || ''}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="bg-bg-surface2 ring-accent-primary/20 h-11 rounded-2xl border-none font-bold focus:ring-2"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-text-muted ml-1 text-[9px] font-black uppercase">
                        Email
                      </label>
                      <Input
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="bg-bg-surface2 ring-accent-primary/20 h-11 rounded-2xl border-none font-bold focus:ring-2"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <p className="text-text-muted text-[10px] font-black uppercase tracking-[0.2em]">
                    Интеграция сетей
                  </p>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="relative">
                      <div className="bg-accent-primary/10 absolute left-4 top-1/2 flex h-5 w-5 -translate-y-1/2 items-center justify-center rounded-lg">
                        <Send className="text-accent-primary h-3 w-3" />
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
                        className="bg-bg-surface2 ring-accent-primary/20 h-11 rounded-2xl border-none pl-12 text-xs font-medium focus:ring-2"
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
                        className="bg-bg-surface2 ring-accent-primary/20 h-11 rounded-2xl border-none pl-12 text-xs font-medium focus:ring-2"
                      />
                    </div>
                    <div className="relative">
                      <div className="bg-accent-primary/10 absolute left-4 top-1/2 flex h-5 w-5 -translate-y-1/2 items-center justify-center rounded-lg">
                        <Instagram className="text-accent-primary h-3 w-3" />
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
                        className="bg-bg-surface2 ring-accent-primary/20 h-11 rounded-2xl border-none pl-12 text-xs font-medium focus:ring-2"
                      />
                    </div>
                    <div className="relative">
                      <div className="bg-bg-surface2 absolute left-4 top-1/2 flex h-5 w-5 -translate-y-1/2 items-center justify-center rounded-lg">
                        <Globe className="text-text-secondary h-3 w-3" />
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
                        className="bg-bg-surface2 ring-accent-primary/20 h-11 rounded-2xl border-none pl-12 text-xs font-medium focus:ring-2"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <footer className="border-border-subtle shrink-0 border-t bg-white p-4">
              <Button
                onClick={() => onSave(formData)}
                className="hover:bg-text-primary/90 group h-10 w-full rounded-[1.5rem] bg-black text-xs font-black uppercase tracking-widest text-white shadow-md shadow-xl transition-all hover:scale-[1.02] active:scale-95"
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

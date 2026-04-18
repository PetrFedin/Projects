'use client';

import React, { useState } from 'react';
import { UserPlus, Mail, Shield, Copy, Check, Send, Sparkles, X, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { useAuth } from '@/providers/auth-provider';
import { INTERACTION_POLICY, PROCESS_FLOWS } from '@/lib/interaction-policy';
import { UserRole } from '@/lib/types';

export function InviteOnboarding() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('member');
  const [targetProfileType, setTargetProfileType] = useState<UserRole>('brand');
  const [selectedFlows, setSelectedFlows] = useState<string[]>([]);
  const [copied, setCopied] = useState(false);

  const myRole = (user?.roles?.[0] || 'brand') as UserRole;
  const allowedInteractionRoles = INTERACTION_POLICY[myRole] || [];

  const flowsForTarget = PROCESS_FLOWS.filter((f) => f.participants.includes(targetProfileType));

  const inviteLink = `https://syntha.os/invite/${Math.random().toString(36).substring(7)}`;

  const toggleFlow = (id: string) => {
    setSelectedFlows((prev) => (prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]));
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(inviteLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast({ title: 'Ссылка скопирована!' });
  };

  const handleSend = () => {
    if (!email) return;
    toast({
      title: 'Приглашение отправлено!',
      description: `Участнику ${email} выслана инструкция по входу.`,
    });
    setEmail('');
  };

  return (
    <div className="mx-auto max-w-4xl space-y-4 duration-700 animate-in fade-in zoom-in-95">
      <header className="space-y-2 text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-[1.5rem] bg-black shadow-2xl">
          <UserPlus className="h-8 w-8 text-white" />
        </div>
        <h2 className="text-base font-black uppercase tracking-tighter">Масштабирование Команды</h2>
        <p className="text-text-muted text-sm font-bold uppercase tracking-widest">
          Быстрый запуск и настройка участников профиля
        </p>
      </header>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        <Card className="overflow-hidden rounded-xl border-none bg-white shadow-sm">
          <CardContent className="space-y-6 p-4">
            <h3 className="flex items-center gap-2 text-sm font-black uppercase">
              <Mail className="text-accent-primary h-5 w-5" />
              Пригласить по почте
            </h3>
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-text-muted ml-2 text-[10px] font-black uppercase tracking-widest">
                  Тип профиля для подключения
                </label>
                <div className="flex flex-wrap gap-2">
                  {allowedInteractionRoles
                    .filter((r) => r !== 'admin' && r !== 'b2b')
                    .map((r) => (
                      <button
                        key={r}
                        onClick={() => setTargetProfileType(r)}
                        className={cn(
                          'rounded-xl border-2 px-3 py-1.5 text-[9px] font-black uppercase transition-all',
                          targetProfileType === r
                            ? 'border-accent-primary bg-accent-primary/10 text-accent-primary'
                            : 'border-border-subtle text-text-muted'
                        )}
                      >
                        {r}
                      </button>
                    ))}
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-text-muted ml-2 text-[10px] font-black uppercase tracking-widest">
                  Email участника или представителя
                </label>
                <Input
                  placeholder="name@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-bg-surface2 h-12 rounded-2xl border-none px-4 font-bold"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-text-muted ml-2 text-[10px] font-black uppercase tracking-widest">
                  Роль в системе
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'admin', label: 'Admin', desc: 'Полный доступ' },
                    { id: 'member', label: 'Member', desc: 'Работа с данными' },
                  ].map((r) => (
                    <button
                      key={r.id}
                      onClick={() => setRole(r.id)}
                      className={cn(
                        'group rounded-2xl border-2 p-4 text-left transition-all',
                        role === r.id
                          ? 'border-accent-primary bg-accent-primary/10'
                          : 'border-border-subtle hover:border-border-default'
                      )}
                    >
                      <p
                        className={cn(
                          'text-xs font-black uppercase',
                          role === r.id ? 'text-accent-primary' : 'text-text-primary'
                        )}
                      >
                        {r.label}
                      </p>
                      <p className="text-text-muted mt-1 text-[9px] font-bold uppercase tracking-tighter">
                        {r.desc}
                      </p>
                    </button>
                  ))}
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-text-muted ml-2 text-[10px] font-black uppercase tracking-widest">
                  Назначение процессов (Flows)
                </label>
                <div className="grid grid-cols-1 gap-2">
                  {flowsForTarget.map((f) => (
                    <button
                      key={f.id}
                      onClick={() => toggleFlow(f.id)}
                      className={cn(
                        'flex items-center justify-between rounded-xl border-2 p-3 transition-all',
                        selectedFlows.includes(f.id)
                          ? 'border-accent-primary bg-accent-primary/10'
                          : 'border-border-subtle hover:border-border-subtle'
                      )}
                    >
                      <div className="text-left">
                        <p
                          className={cn(
                            'text-[9px] font-black uppercase',
                            selectedFlows.includes(f.id)
                              ? 'text-accent-primary'
                              : 'text-text-primary'
                          )}
                        >
                          {f.name}
                        </p>
                        <p className="text-text-muted mt-1 text-[8px] font-medium leading-tight">
                          {f.description}
                        </p>
                      </div>
                      <div
                        className={cn(
                          'flex h-4 w-4 items-center justify-center rounded-full border-2 transition-all',
                          selectedFlows.includes(f.id)
                            ? 'bg-accent-primary border-accent-primary'
                            : 'border-border-default'
                        )}
                      >
                        {selectedFlows.includes(f.id) && (
                          <Check className="h-2 w-2 stroke-[4] text-white" />
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <Button
                onClick={handleSend}
                disabled={!email}
                className="h-12 w-full rounded-2xl bg-black font-black uppercase tracking-widest text-white transition-transform hover:scale-[1.02]"
              >
                <Send className="mr-2 h-4 w-4" /> Отправить приглашение
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-text-primary relative overflow-hidden rounded-xl border-none text-white shadow-sm">
          <div className="absolute right-0 top-0 p-4 opacity-10">
            <Sparkles className="h-32 w-32" />
          </div>
          <CardContent className="relative z-10 space-y-6 p-4">
            <h3 className="flex items-center gap-2 text-sm font-black uppercase">
              <Shield className="text-accent-primary h-5 w-5" />
              Матрица Доступа
            </h3>
            <div className="space-y-4">
              {[
                { label: 'Управление PLM', enabled: true },
                { label: 'Финансовая аналитика', enabled: role === 'admin' },
                { label: 'Аудит действий', enabled: role === 'admin' },
                { label: 'Управление командой', enabled: role === 'admin' },
              ].map((perm, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 p-3"
                >
                  <span className="text-[10px] font-bold uppercase tracking-widest text-white/70">
                    {perm.label}
                  </span>
                  {perm.enabled ? (
                    <div className="flex h-5 w-5 items-center justify-center rounded-full bg-green-500/20">
                      <Check className="h-3 w-3 stroke-[4] text-green-400" />
                    </div>
                  ) : (
                    <div className="flex h-5 w-5 items-center justify-center rounded-full bg-rose-500/20">
                      <X className="h-3 w-3 stroke-[4] text-rose-400" />
                    </div>
                  )}
                </div>
              ))}
            </div>
            <div className="space-y-3 border-t border-white/10 pt-4">
              <p className="text-[10px] font-black uppercase tracking-widest text-white/40">
                Или скопируйте ссылку:
              </p>
              <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 p-2">
                <span className="flex-1 truncate px-2 font-mono text-[10px] text-white/60">
                  {inviteLink}
                </span>
                <Button
                  onClick={handleCopy}
                  size="icon"
                  variant="ghost"
                  className="h-8 w-8 hover:bg-white/10"
                >
                  {copied ? (
                    <Check className="h-4 w-4 text-green-400" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

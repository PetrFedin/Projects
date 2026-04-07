'use client';

import React, { useState } from 'react';
import { UserPlus, Mail, Shield, Copy, Check, Send, Sparkles, X, AlertCircle } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent } from "@/components/ui/card";
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
  
  const flowsForTarget = PROCESS_FLOWS.filter(f => f.participants.includes(targetProfileType));

  const inviteLink = `https://syntha.os/invite/${Math.random().toString(36).substring(7)}`;

  const toggleFlow = (id: string) => {
    setSelectedFlows(prev => prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(inviteLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast({ title: "Ссылка скопирована!" });
  };

  const handleSend = () => {
    if (!email) return;
    toast({ 
      title: "Приглашение отправлено!",
      description: `Участнику ${email} выслана инструкция по входу.`
    });
    setEmail('');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-4 animate-in fade-in zoom-in-95 duration-700">
      <header className="text-center space-y-2">
        <div className="h-12 w-12 bg-black rounded-[1.5rem] flex items-center justify-center mx-auto shadow-2xl mb-4">
          <UserPlus className="h-8 w-8 text-white" />
        </div>
        <h2 className="text-base font-black uppercase tracking-tighter">Масштабирование Команды</h2>
        <p className="text-sm text-slate-400 font-bold uppercase tracking-widest">Быстрый запуск и настройка участников профиля</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <Card className="border-none shadow-sm rounded-xl bg-white overflow-hidden">
          <CardContent className="p-4 space-y-6">
            <h3 className="text-sm font-black uppercase flex items-center gap-2">
              <Mail className="h-5 w-5 text-indigo-600" />
              Пригласить по почте
            </h3>
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Тип профиля для подключения</label>
                <div className="flex flex-wrap gap-2">
                  {allowedInteractionRoles.filter(r => r !== 'admin' && r !== 'b2b').map((r) => (
                    <button
                      key={r}
                      onClick={() => setTargetProfileType(r)}
                      className={cn(
                        "px-3 py-1.5 rounded-xl text-[9px] font-black uppercase border-2 transition-all",
                        targetProfileType === r ? "border-indigo-600 bg-indigo-50 text-indigo-600" : "border-slate-100 text-slate-400"
                      )}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Email участника или представителя</label>
                <Input 
                  placeholder="name@company.com" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-12 rounded-2xl bg-slate-50 border-none px-4 font-bold"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Роль в системе</label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'admin', label: 'Admin', desc: 'Полный доступ' },
                    { id: 'member', label: 'Member', desc: 'Работа с данными' }
                  ].map((r) => (
                    <button
                      key={r.id}
                      onClick={() => setRole(r.id)}
                      className={cn(
                        "p-4 rounded-2xl border-2 transition-all text-left group",
                        role === r.id ? "border-indigo-600 bg-indigo-50" : "border-slate-100 hover:border-slate-200"
                      )}
                    >
                      <p className={cn("text-xs font-black uppercase", role === r.id ? "text-indigo-600" : "text-slate-900")}>{r.label}</p>
                      <p className="text-[9px] text-slate-400 font-bold uppercase tracking-tighter mt-1">{r.desc}</p>
                    </button>
                  ))}
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Назначение процессов (Flows)</label>
                <div className="grid grid-cols-1 gap-2">
                  {flowsForTarget.map((f) => (
                    <button
                      key={f.id}
                      onClick={() => toggleFlow(f.id)}
                      className={cn(
                        "flex items-center justify-between p-3 rounded-xl border-2 transition-all",
                        selectedFlows.includes(f.id) ? "border-indigo-600 bg-indigo-50" : "border-slate-50 hover:border-slate-100"
                      )}
                    >
                      <div className="text-left">
                        <p className={cn("text-[9px] font-black uppercase", selectedFlows.includes(f.id) ? "text-indigo-600" : "text-slate-900")}>{f.name}</p>
                        <p className="text-[8px] text-slate-400 font-medium leading-tight mt-1">{f.description}</p>
                      </div>
                      <div className={cn(
                        "h-4 w-4 rounded-full border-2 flex items-center justify-center transition-all",
                        selectedFlows.includes(f.id) ? "bg-indigo-600 border-indigo-600" : "border-slate-200"
                      )}>
                        {selectedFlows.includes(f.id) && <Check className="h-2 w-2 text-white stroke-[4]" />}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <Button 
                onClick={handleSend}
                disabled={!email}
                className="w-full h-12 bg-black text-white rounded-2xl font-black uppercase tracking-widest hover:scale-[1.02] transition-transform"
              >
                <Send className="mr-2 h-4 w-4" /> Отправить приглашение
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm rounded-xl bg-slate-900 text-white overflow-hidden relative">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <Sparkles className="h-32 w-32" />
          </div>
          <CardContent className="p-4 space-y-6 relative z-10">
            <h3 className="text-sm font-black uppercase flex items-center gap-2">
              <Shield className="h-5 w-5 text-indigo-400" />
              Матрица Доступа
            </h3>
            <div className="space-y-4">
              {[
                { label: 'Управление PLM', enabled: true },
                { label: 'Финансовая аналитика', enabled: role === 'admin' },
                { label: 'Аудит действий', enabled: role === 'admin' },
                { label: 'Управление командой', enabled: role === 'admin' }
              ].map((perm, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/10">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-white/70">{perm.label}</span>
                  {perm.enabled ? (
                    <div className="h-5 w-5 bg-green-500/20 rounded-full flex items-center justify-center">
                      <Check className="h-3 w-3 text-green-400 stroke-[4]" />
                    </div>
                  ) : (
                    <div className="h-5 w-5 bg-rose-500/20 rounded-full flex items-center justify-center">
                      <X className="h-3 w-3 text-rose-400 stroke-[4]" />
                    </div>
                  )}
                </div>
              ))}
            </div>
            <div className="pt-4 border-t border-white/10 space-y-3">
              <p className="text-[10px] font-black uppercase tracking-widest text-white/40">Или скопируйте ссылку:</p>
              <div className="flex items-center gap-2 p-2 bg-white/5 rounded-xl border border-white/10">
                <span className="flex-1 text-[10px] font-mono text-white/60 truncate px-2">{inviteLink}</span>
                <Button onClick={handleCopy} size="icon" variant="ghost" className="h-8 w-8 hover:bg-white/10">
                  {copied ? <Check className="h-4 w-4 text-green-400" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

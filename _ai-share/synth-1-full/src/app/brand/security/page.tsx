'use client';

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  ShieldCheck, ChevronRight, Check, X, Key, Smartphone,
  Monitor, Globe, AlertTriangle, Lock, Unlock, Clock,
  Activity, FileText, Download, Eye, EyeOff, Copy
} from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";
import { useState } from "react";

const SECURITY_SCORE_ITEMS = [
  { label: "Двухфакторная аутентификация", score: 100, enabled: true, critical: true },
  { label: "Надежность пароля", score: 95, enabled: true, critical: true },
  { label: "Активные сессии", score: 85, enabled: true, critical: false },
  { label: "API ключи защищены", score: 90, enabled: true, critical: false },
  { label: "Журнал аудита", score: 100, enabled: true, critical: false }
];

const ACTIVE_SESSIONS = [
  { device: "MacBook Pro 16", browser: "Chrome 121", location: "Москва, Россия", ip: "192.168.1.1", lastActive: "Сейчас", current: true },
  { device: "iPhone 15 Pro", browser: "Safari Mobile", location: "Москва, Россия", ip: "192.168.1.2", lastActive: "5 мин назад", current: false },
  { device: "iPad Air", browser: "Safari", location: "Санкт-Петербург, Россия", ip: "192.168.2.1", lastActive: "2ч назад", current: false }
];

const API_KEYS = [
  { name: "Production API Key", key: "sk_live_51H***************", created: "15.01.2026", lastUsed: "Сегодня, 14:23", status: "active" },
  { name: "Development API Key", key: "sk_test_51H***************", created: "10.01.2026", lastUsed: "Вчера, 18:45", status: "active" },
  { name: "Legacy API Key", key: "sk_live_49G***************", created: "01.12.2025", lastUsed: "01.02.2026", status: "inactive" }
];

const AUDIT_LOG = [
  { user: "Анна К.", action: "Вход в систему", details: "MacBook Pro, Chrome, Москва", time: "5 мин назад", type: "login", risk: "low" },
  { user: "Игорь Д.", action: "Изменение пароля", details: "Успешно обновлен", time: "2ч назад", type: "security", risk: "medium" },
  { user: "Мария С.", action: "Создание API ключа", details: "Production API Key", time: "1 день назад", type: "api", risk: "high" },
  { user: "Петр В.", action: "Включение 2FA", details: "Authenticator App", time: "2 дня назад", type: "security", risk: "low" }
];

export default function SecurityPage() {
  const searchParams = useSearchParams();
  const returnResolved = searchParams.get('returnResolved');
  const [show2FACode, setShow2FACode] = useState(false);
  const overallScore = Math.round(SECURITY_SCORE_ITEMS.reduce((sum, item) => sum + item.score, 0) / SECURITY_SCORE_ITEMS.length);

  return (
    <div className="space-y-5 max-w-5xl mx-auto pb-20 px-4 md:px-0">
      {returnResolved && (
        <div className="p-2 rounded-lg bg-indigo-50 border border-indigo-100 mb-4">
          <Link href={`/brand/organization?resolved=${encodeURIComponent(returnResolved)}`} className="text-[10px] font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1">
            ← Вернуться в Центр управления
          </Link>
        </div>
      )}
      {/* Breadcrumb Navigation */}
      <div className="flex items-center gap-2 text-[8px] font-bold uppercase tracking-widest text-slate-400 mb-4">
          <Link href="/brand/organization" className="hover:text-indigo-600 transition-colors">Организация</Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-indigo-600">Безопасность</span>
      </div>

      {/* Control Panel */}
      <div className="flex justify-end items-center mb-4 gap-3">
          <div className="flex items-center gap-1.5">
              <Button asChild variant="outline" size="sm" className="h-7 px-3 rounded-lg text-[7px] font-black uppercase tracking-widest bg-white border-slate-200 text-slate-400 shadow-sm hover:bg-slate-50">
                  <Link href="/brand/settings">Настройки</Link>
              </Button>
              <div className="h-4 w-px bg-slate-200 mx-0.5" />
              <Button variant="outline" size="sm" className="h-7 px-3 rounded-lg text-[7px] font-black uppercase tracking-widest bg-white border-slate-200 text-slate-400 shadow-sm hover:bg-slate-50">
                  <Download className="h-3 w-3 mr-1" /> Экспорт логов
              </Button>
          </div>

          <Button variant="default" size="sm" className="h-7 px-4 rounded-lg text-[7px] font-black uppercase tracking-widest bg-rose-600 text-white shadow-lg shadow-rose-100 hover:bg-rose-700 transition-all">
              <AlertTriangle className="h-3 w-3 mr-1" /> Завершить все сессии
          </Button>
      </div>

      {/* Security Score & 2FA Status */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 mb-8">
        {/* Security Score */}
        <div className="space-y-3">
            <div className="flex items-center gap-2">
                <div className="h-1 w-8 bg-emerald-600 rounded-full" />
                <h2 className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-400">Security Score</h2>
            </div>
            
            <Card className="rounded-xl border-none shadow-sm bg-white p-4 border border-slate-100 h-full">
              <div className="flex items-center justify-between mb-8">
                <div className="space-y-1">
                  <h3 className="text-base font-black uppercase tracking-tight text-slate-900">Security Index</h3>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 italic">Overall Protection Level</p>
                </div>
                <div className="h-20 w-20 rounded-full border-4 border-emerald-50 flex items-center justify-center bg-emerald-50/30 shadow-inner relative">
                  <span className="text-base font-black text-emerald-600">{overallScore}</span>
                  <ShieldCheck className="h-4 w-4 text-emerald-500 absolute -top-1 -right-1" />
                </div>
              </div>
              
              <div className="space-y-5">
                {SECURITY_SCORE_ITEMS.map(item => (
                  <div key={item.label} className="space-y-2">
                    <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                      <div className="flex items-center gap-2">
                        <span className="text-slate-500">{item.label}</span>
                        {item.critical && (
                          <Badge className="bg-rose-500 text-white border-none font-black text-[6px] uppercase px-1.5 h-3.5">
                            Critical
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-slate-900 tabular-nums">{item.score}/100</span>
                        {item.enabled ? (
                          <Check className="h-4 w-4 text-emerald-500" />
                        ) : (
                          <X className="h-4 w-4 text-rose-500" />
                        )}
                      </div>
                    </div>
                    <div className="h-1.5 w-full bg-slate-50 rounded-full overflow-hidden shadow-inner">
                      <div className={cn("h-full rounded-full transition-all duration-1000", 
                        item.score >= 90 ? "bg-emerald-500" : item.score >= 70 ? "bg-amber-500" : "bg-rose-500"
                      )} style={{ width: `${item.score}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </Card>
        </div>

        {/* Two-Factor Authentication */}
        <div className="space-y-3">
            <div className="flex items-center gap-2">
                <div className="h-1 w-8 bg-indigo-600 rounded-full" />
                <h2 className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-400">Authentication Layer</h2>
            </div>
            
            <Card className="rounded-xl border-none shadow-sm bg-gradient-to-br from-indigo-600 to-indigo-700 text-white p-4 relative overflow-hidden h-full">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <Smartphone className="h-32 w-32" />
              </div>
              <div className="relative z-10 flex flex-col h-full">
                <div className="flex items-start justify-between mb-6">
                  <div className="space-y-2">
                    <Badge className="bg-emerald-500 text-white border-none font-black text-[7px] uppercase px-2 h-5">
                      <Check className="h-3 w-3 mr-1" /> Активна
                    </Badge>
                    <h3 className="text-sm font-black uppercase tracking-tight">2FA Protection</h3>
                    <p className="text-[10px] text-indigo-200 font-medium leading-relaxed">Ваш аккаунт максимально защищен. Используйте приложение-аутентификатор для подтверждения входа.</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-3 mb-6">
                  <div className="p-4 rounded-xl bg-white/10 border border-white/20">
                    <div className="flex items-center gap-2 mb-2">
                      <Smartphone className="h-4 w-4 text-indigo-300" />
                      <span className="text-[8px] font-black uppercase text-indigo-200">Метод</span>
                    </div>
                    <div className="text-sm font-black">Authenticator App</div>
                  </div>
                  <div className="p-4 rounded-xl bg-white/10 border border-white/20">
                    <div className="flex items-center gap-2 mb-2">
                      <Clock className="h-4 w-4 text-indigo-300" />
                      <span className="text-[8px] font-black uppercase text-indigo-200">Последний лог</span>
                    </div>
                    <div className="text-sm font-black">Сегодня, 14:23</div>
                  </div>
                </div>
                
                <div className="mt-auto">
                    <Button variant="outline" className="w-full h-11 rounded-2xl text-[9px] font-black uppercase border-white/20 text-white hover:bg-white hover:text-indigo-600">
                        Сгенерировать резервные коды
                    </Button>
                </div>
              </div>
            </Card>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        {/* Active Sessions */}
        <div className="space-y-3">
            <div className="flex items-center gap-2">
                <div className="h-1 w-8 bg-blue-600 rounded-full" />
                <h2 className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-400">Active Sessions</h2>
            </div>
            
            <Card className="rounded-xl border-none shadow-sm bg-white p-4 border border-slate-100">
              <div className="space-y-3">
                {ACTIVE_SESSIONS.map((session, i) => (
                  <div key={i} className={cn("p-4 rounded-xl transition-all", 
                    session.current ? "bg-indigo-50 border-2 border-indigo-200" : "bg-slate-50 hover:bg-slate-100"
                  )}>
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className={cn("h-10 w-10 rounded-xl flex items-center justify-center",
                          session.current ? "bg-indigo-100 text-indigo-600" : "bg-slate-200 text-slate-600"
                        )}>
                          <Monitor className="h-5 w-5" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-[9px] font-black text-slate-900 uppercase">{session.device}</span>
                            {session.current && (
                              <Badge className="bg-indigo-600 text-white border-none font-black text-[6px] uppercase px-1.5 h-3.5">
                                Текущая
                              </Badge>
                            )}
                          </div>
                          <div className="text-[8px] text-slate-500 mt-0.5">{session.browser}</div>
                        </div>
                      </div>
                      {!session.current && (
                        <Button variant="ghost" size="sm" className="h-7 px-2 text-[7px] font-black uppercase text-rose-600 hover:text-rose-700 hover:bg-rose-50">
                          <X className="h-3 w-3" />
                        </Button>
                      )}
                    </div>
                    <div className="flex items-center gap-3 text-[7px] text-slate-400 font-medium">
                      <div className="flex items-center gap-1">
                        <Globe className="h-3 w-3" />
                        <span>{session.location}</span>
                      </div>
                      <span>•</span>
                      <span className="font-mono">{session.ip}</span>
                      <span>•</span>
                      <span>{session.lastActive}</span>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
        </div>

        {/* API Keys */}
        <div className="space-y-3">
            <div className="flex items-center gap-2">
                <div className="h-1 w-8 bg-amber-600 rounded-full" />
                <h2 className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-400">API Keys</h2>
            </div>
            
            <Card className="rounded-xl border-none shadow-sm bg-white p-4 border border-slate-100">
              <div className="space-y-3">
                {API_KEYS.map((apiKey, i) => (
                  <div key={i} className="p-4 rounded-xl bg-slate-50 hover:bg-slate-100 transition-all">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className={cn("h-10 w-10 rounded-xl flex items-center justify-center",
                          apiKey.status === 'active' ? "bg-emerald-100 text-emerald-600" : "bg-slate-200 text-slate-400"
                        )}>
                          <Key className="h-5 w-5" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-[9px] font-black text-slate-900 uppercase">{apiKey.name}</span>
                            <Badge className={cn("border-none font-black text-[6px] uppercase px-1.5 h-3.5",
                              apiKey.status === 'active' ? "bg-emerald-500 text-white" : "bg-slate-400 text-white"
                            )}>
                              {apiKey.status}
                            </Badge>
                          </div>
                          <div className="text-[8px] text-slate-500 font-mono mt-0.5">{apiKey.key}</div>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm" className="h-7 px-2 text-[7px] font-black uppercase text-slate-400 hover:text-indigo-600">
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                    <div className="flex items-center gap-3 text-[7px] text-slate-400 font-medium">
                      <span>Создан: {apiKey.created}</span>
                      <span>•</span>
                      <span>Использован: {apiKey.lastUsed}</span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t border-slate-100">
                <Button variant="outline" className="w-full h-9 rounded-xl text-[8px] font-black uppercase border-slate-200 hover:bg-slate-50">
                  <Key className="h-3 w-3 mr-2" /> Создать новый API ключ
                </Button>
              </div>
            </Card>
        </div>
      </div>

      {/* Audit Log */}
      <div className="space-y-3">
          <div className="flex items-center gap-2">
              <div className="h-1 w-8 bg-slate-900 rounded-full" />
              <h2 className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-400">Audit Log</h2>
          </div>
          
          <Card className="rounded-xl border-none shadow-sm bg-white p-4 border border-slate-100">
            <div className="space-y-3">
              {AUDIT_LOG.map((log, i) => (
                <div key={i} className="flex items-center gap-3 p-4 rounded-xl bg-slate-50 hover:bg-slate-100 transition-all group">
                  <div className={cn("h-10 w-10 rounded-xl flex items-center justify-center",
                    log.risk === 'high' ? "bg-rose-100 text-rose-600" :
                    log.risk === 'medium' ? "bg-amber-100 text-amber-600" :
                    "bg-emerald-100 text-emerald-600"
                  )}>
                    {log.type === 'login' ? <Activity className="h-5 w-5" /> :
                     log.type === 'security' ? <ShieldCheck className="h-5 w-5" /> :
                     <Key className="h-5 w-5" />}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[9px] font-black text-slate-900 uppercase">{log.user}</span>
                      <span className="text-[8px] text-slate-400">•</span>
                      <span className="text-[8px] text-slate-600">{log.action}</span>
                    </div>
                    <div className="text-[7px] text-slate-400">{log.details}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[7px] font-bold text-slate-400 uppercase">{log.time}</span>
                    <Badge className={cn("border-none font-black text-[6px] uppercase px-1.5 h-3.5",
                      log.risk === 'high' ? "bg-rose-500 text-white" :
                      log.risk === 'medium' ? "bg-amber-500 text-white" :
                      "bg-slate-300 text-slate-600"
                    )}>
                      {log.risk}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 pt-6 border-t border-slate-100 flex justify-between items-center">
              <div className="text-[8px] font-medium text-slate-400">
                Показано 4 из 247 событий
              </div>
              <Button variant="outline" className="h-9 px-4 rounded-xl text-[8px] font-black uppercase border-slate-200 hover:bg-slate-50">
                Показать все события
              </Button>
            </div>
          </Card>
      </div>
    </div>
  );
}

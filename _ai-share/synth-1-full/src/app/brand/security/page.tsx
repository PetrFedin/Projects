'use client';

import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  ShieldCheck,
  ChevronRight,
  Check,
  X,
  Key,
  Smartphone,
  Monitor,
  Globe,
  AlertTriangle,
  Lock,
  Unlock,
  Clock,
  Activity,
  FileText,
  Download,
  Eye,
  EyeOff,
  Copy,
} from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { cn } from '@/lib/utils';
<<<<<<< HEAD
=======
import { ROUTES } from '@/lib/routes';
>>>>>>> recover/cabinet-wip-from-stash
import { useState } from 'react';

const SECURITY_SCORE_ITEMS = [
  { label: 'Двухфакторная аутентификация', score: 100, enabled: true, critical: true },
  { label: 'Надежность пароля', score: 95, enabled: true, critical: true },
  { label: 'Активные сессии', score: 85, enabled: true, critical: false },
  { label: 'API ключи защищены', score: 90, enabled: true, critical: false },
  { label: 'Журнал аудита', score: 100, enabled: true, critical: false },
];

const ACTIVE_SESSIONS = [
  {
    device: 'MacBook Pro 16',
    browser: 'Chrome 121',
    location: 'Москва, Россия',
    ip: '192.168.1.1',
    lastActive: 'Сейчас',
    current: true,
  },
  {
    device: 'iPhone 15 Pro',
    browser: 'Safari Mobile',
    location: 'Москва, Россия',
    ip: '192.168.1.2',
    lastActive: '5 мин назад',
    current: false,
  },
  {
    device: 'iPad Air',
    browser: 'Safari',
    location: 'Санкт-Петербург, Россия',
    ip: '192.168.2.1',
    lastActive: '2ч назад',
    current: false,
  },
];

const API_KEYS = [
  {
    name: 'Production API Key',
    key: 'sk_live_51H***************',
    created: '15.01.2026',
    lastUsed: 'Сегодня, 14:23',
    status: 'active',
  },
  {
    name: 'Development API Key',
    key: 'sk_test_51H***************',
    created: '10.01.2026',
    lastUsed: 'Вчера, 18:45',
    status: 'active',
  },
  {
    name: 'Legacy API Key',
    key: 'sk_live_49G***************',
    created: '01.12.2025',
    lastUsed: '01.02.2026',
    status: 'inactive',
  },
];

const AUDIT_LOG = [
  {
    user: 'Анна К.',
    action: 'Вход в систему',
    details: 'MacBook Pro, Chrome, Москва',
    time: '5 мин назад',
    type: 'login',
    risk: 'low',
  },
  {
    user: 'Игорь Д.',
    action: 'Изменение пароля',
    details: 'Успешно обновлен',
    time: '2ч назад',
    type: 'security',
    risk: 'medium',
  },
  {
    user: 'Мария С.',
    action: 'Создание API ключа',
    details: 'Production API Key',
    time: '1 день назад',
    type: 'api',
    risk: 'high',
  },
  {
    user: 'Петр В.',
    action: 'Включение 2FA',
    details: 'Authenticator App',
    time: '2 дня назад',
    type: 'security',
    risk: 'low',
  },
];

export default function SecurityPage() {
  const searchParams = useSearchParams();
  const returnResolved = searchParams.get('returnResolved');
  const [show2FACode, setShow2FACode] = useState(false);
  const overallScore = Math.round(
    SECURITY_SCORE_ITEMS.reduce((sum, item) => sum + item.score, 0) / SECURITY_SCORE_ITEMS.length
  );

  return (
    <div className="mx-auto max-w-5xl space-y-5 px-4 pb-20 md:px-0">
      {returnResolved && (
<<<<<<< HEAD
        <div className="mb-4 rounded-lg border border-indigo-100 bg-indigo-50 p-2">
          <Link
            href={`/brand/organization?resolved=${encodeURIComponent(returnResolved)}`}
            className="flex items-center gap-1 text-[10px] font-semibold text-indigo-600 hover:text-indigo-700"
=======
        <div className="bg-accent-primary/10 border-accent-primary/20 mb-4 rounded-lg border p-2">
          <Link
            href={`${ROUTES.brand.organizationPage}?resolved=${encodeURIComponent(returnResolved)}`}
            className="text-accent-primary hover:text-accent-primary flex items-center gap-1 text-[10px] font-semibold"
>>>>>>> recover/cabinet-wip-from-stash
          >
            ← Вернуться в Центр управления
          </Link>
        </div>
      )}
      {/* Breadcrumb Navigation */}
<<<<<<< HEAD
      <div className="mb-4 flex items-center gap-2 text-[8px] font-bold uppercase tracking-widest text-slate-400">
        <Link href="/brand/organization" className="transition-colors hover:text-indigo-600">
          Организация
        </Link>
        <ChevronRight className="h-3 w-3" />
        <span className="text-indigo-600">Безопасность</span>
=======
      <div className="text-text-muted mb-4 flex items-center gap-2 text-[8px] font-bold uppercase tracking-widest">
        <Link
          href={ROUTES.brand.organizationPage}
          className="hover:text-accent-primary transition-colors"
        >
          Организация
        </Link>
        <ChevronRight className="h-3 w-3" />
        <span className="text-accent-primary">Безопасность</span>
>>>>>>> recover/cabinet-wip-from-stash
      </div>

      {/* Control Panel */}
      <div className="mb-4 flex items-center justify-end gap-3">
        <div className="flex items-center gap-1.5">
          <Button
            asChild
            variant="outline"
            size="sm"
<<<<<<< HEAD
            className="h-7 rounded-lg border-slate-200 bg-white px-3 text-[7px] font-black uppercase tracking-widest text-slate-400 shadow-sm hover:bg-slate-50"
          >
            <Link href="/brand/settings">Настройки</Link>
          </Button>
          <div className="mx-0.5 h-4 w-px bg-slate-200" />
          <Button
            variant="outline"
            size="sm"
            className="h-7 rounded-lg border-slate-200 bg-white px-3 text-[7px] font-black uppercase tracking-widest text-slate-400 shadow-sm hover:bg-slate-50"
=======
            className="border-border-default text-text-muted hover:bg-bg-surface2 h-7 rounded-lg bg-white px-3 text-[7px] font-black uppercase tracking-widest shadow-sm"
          >
            <Link href={ROUTES.brand.settings}>Настройки</Link>
          </Button>
          <div className="bg-border-subtle mx-0.5 h-4 w-px" />
          <Button
            variant="outline"
            size="sm"
            className="border-border-default text-text-muted hover:bg-bg-surface2 h-7 rounded-lg bg-white px-3 text-[7px] font-black uppercase tracking-widest shadow-sm"
>>>>>>> recover/cabinet-wip-from-stash
          >
            <Download className="mr-1 h-3 w-3" /> Экспорт логов
          </Button>
        </div>

        <Button
          variant="default"
          size="sm"
          className="h-7 rounded-lg bg-rose-600 px-4 text-[7px] font-black uppercase tracking-widest text-white shadow-lg shadow-rose-100 transition-all hover:bg-rose-700"
        >
          <AlertTriangle className="mr-1 h-3 w-3" /> Завершить все сессии
        </Button>
      </div>

      {/* Security Score & 2FA Status */}
      <div className="mb-8 grid grid-cols-1 gap-3 lg:grid-cols-2">
        {/* Security Score */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="h-1 w-8 rounded-full bg-emerald-600" />
<<<<<<< HEAD
            <h2 className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-400">
=======
            <h2 className="text-text-muted text-[9px] font-black uppercase tracking-[0.3em]">
>>>>>>> recover/cabinet-wip-from-stash
              Security Score
            </h2>
          </div>

<<<<<<< HEAD
          <Card className="h-full rounded-xl border border-none border-slate-100 bg-white p-4 shadow-sm">
            <div className="mb-8 flex items-center justify-between">
              <div className="space-y-1">
                <h3 className="text-base font-black uppercase tracking-tight text-slate-900">
                  Security Index
                </h3>
                <p className="text-[10px] font-black uppercase italic tracking-widest text-slate-400">
=======
          <Card className="border-border-subtle h-full rounded-xl border border-none bg-white p-4 shadow-sm">
            <div className="mb-8 flex items-center justify-between">
              <div className="space-y-1">
                <h3 className="text-text-primary text-base font-black uppercase tracking-tight">
                  Security Index
                </h3>
                <p className="text-text-muted text-[10px] font-black uppercase italic tracking-widest">
>>>>>>> recover/cabinet-wip-from-stash
                  Overall Protection Level
                </p>
              </div>
              <div className="relative flex h-20 w-20 items-center justify-center rounded-full border-4 border-emerald-50 bg-emerald-50/30 shadow-inner">
                <span className="text-base font-black text-emerald-600">{overallScore}</span>
                <ShieldCheck className="absolute -right-1 -top-1 h-4 w-4 text-emerald-500" />
              </div>
            </div>

            <div className="space-y-5">
              {SECURITY_SCORE_ITEMS.map((item) => (
                <div key={item.label} className="space-y-2">
                  <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest">
                    <div className="flex items-center gap-2">
<<<<<<< HEAD
                      <span className="text-slate-500">{item.label}</span>
=======
                      <span className="text-text-secondary">{item.label}</span>
>>>>>>> recover/cabinet-wip-from-stash
                      {item.critical && (
                        <Badge className="h-3.5 border-none bg-rose-500 px-1.5 text-[6px] font-black uppercase text-white">
                          Critical
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
<<<<<<< HEAD
                      <span className="tabular-nums text-slate-900">{item.score}/100</span>
=======
                      <span className="text-text-primary tabular-nums">{item.score}/100</span>
>>>>>>> recover/cabinet-wip-from-stash
                      {item.enabled ? (
                        <Check className="h-4 w-4 text-emerald-500" />
                      ) : (
                        <X className="h-4 w-4 text-rose-500" />
                      )}
                    </div>
                  </div>
<<<<<<< HEAD
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-50 shadow-inner">
=======
                  <div className="bg-bg-surface2 h-1.5 w-full overflow-hidden rounded-full shadow-inner">
>>>>>>> recover/cabinet-wip-from-stash
                    <div
                      className={cn(
                        'h-full rounded-full transition-all duration-1000',
                        item.score >= 90
                          ? 'bg-emerald-500'
                          : item.score >= 70
                            ? 'bg-amber-500'
                            : 'bg-rose-500'
                      )}
                      style={{ width: `${item.score}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Two-Factor Authentication */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
<<<<<<< HEAD
            <div className="h-1 w-8 rounded-full bg-indigo-600" />
            <h2 className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-400">
=======
            <div className="bg-accent-primary h-1 w-8 rounded-full" />
            <h2 className="text-text-muted text-[9px] font-black uppercase tracking-[0.3em]">
>>>>>>> recover/cabinet-wip-from-stash
              Authentication Layer
            </h2>
          </div>

<<<<<<< HEAD
          <Card className="relative h-full overflow-hidden rounded-xl border-none bg-gradient-to-br from-indigo-600 to-indigo-700 p-4 text-white shadow-sm">
=======
          <Card className="from-accent-primary to-accent-primary relative h-full overflow-hidden rounded-xl border-none bg-gradient-to-br p-4 text-white shadow-sm">
>>>>>>> recover/cabinet-wip-from-stash
            <div className="absolute right-0 top-0 p-4 opacity-10">
              <Smartphone className="h-32 w-32" />
            </div>
            <div className="relative z-10 flex h-full flex-col">
              <div className="mb-6 flex items-start justify-between">
                <div className="space-y-2">
                  <Badge className="h-5 border-none bg-emerald-500 px-2 text-[7px] font-black uppercase text-white">
                    <Check className="mr-1 h-3 w-3" /> Активна
                  </Badge>
                  <h3 className="text-sm font-black uppercase tracking-tight">2FA Protection</h3>
<<<<<<< HEAD
                  <p className="text-[10px] font-medium leading-relaxed text-indigo-200">
=======
                  <p className="text-accent-primary/40 text-[10px] font-medium leading-relaxed">
>>>>>>> recover/cabinet-wip-from-stash
                    Ваш аккаунт максимально защищен. Используйте приложение-аутентификатор для
                    подтверждения входа.
                  </p>
                </div>
              </div>

              <div className="mb-6 grid grid-cols-1 gap-3">
                <div className="rounded-xl border border-white/20 bg-white/10 p-4">
                  <div className="mb-2 flex items-center gap-2">
<<<<<<< HEAD
                    <Smartphone className="h-4 w-4 text-indigo-300" />
                    <span className="text-[8px] font-black uppercase text-indigo-200">Метод</span>
=======
                    <Smartphone className="text-accent-primary h-4 w-4" />
                    <span className="text-accent-primary/40 text-[8px] font-black uppercase">
                      Метод
                    </span>
>>>>>>> recover/cabinet-wip-from-stash
                  </div>
                  <div className="text-sm font-black">Authenticator App</div>
                </div>
                <div className="rounded-xl border border-white/20 bg-white/10 p-4">
                  <div className="mb-2 flex items-center gap-2">
<<<<<<< HEAD
                    <Clock className="h-4 w-4 text-indigo-300" />
                    <span className="text-[8px] font-black uppercase text-indigo-200">
=======
                    <Clock className="text-accent-primary h-4 w-4" />
                    <span className="text-accent-primary/40 text-[8px] font-black uppercase">
>>>>>>> recover/cabinet-wip-from-stash
                      Последний лог
                    </span>
                  </div>
                  <div className="text-sm font-black">Сегодня, 14:23</div>
                </div>
              </div>

              <div className="mt-auto">
                <Button
                  variant="outline"
<<<<<<< HEAD
                  className="h-11 w-full rounded-2xl border-white/20 text-[9px] font-black uppercase text-white hover:bg-white hover:text-indigo-600"
=======
                  className="hover:text-accent-primary h-11 w-full rounded-2xl border-white/20 text-[9px] font-black uppercase text-white hover:bg-white"
>>>>>>> recover/cabinet-wip-from-stash
                >
                  Сгенерировать резервные коды
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
        {/* Active Sessions */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="h-1 w-8 rounded-full bg-blue-600" />
<<<<<<< HEAD
            <h2 className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-400">
=======
            <h2 className="text-text-muted text-[9px] font-black uppercase tracking-[0.3em]">
>>>>>>> recover/cabinet-wip-from-stash
              Active Sessions
            </h2>
          </div>

<<<<<<< HEAD
          <Card className="rounded-xl border border-none border-slate-100 bg-white p-4 shadow-sm">
=======
          <Card className="border-border-subtle rounded-xl border border-none bg-white p-4 shadow-sm">
>>>>>>> recover/cabinet-wip-from-stash
            <div className="space-y-3">
              {ACTIVE_SESSIONS.map((session, i) => (
                <div
                  key={i}
                  className={cn(
                    'rounded-xl p-4 transition-all',
                    session.current
<<<<<<< HEAD
                      ? 'border-2 border-indigo-200 bg-indigo-50'
                      : 'bg-slate-50 hover:bg-slate-100'
=======
                      ? 'bg-accent-primary/10 border-accent-primary/30 border-2'
                      : 'bg-bg-surface2 hover:bg-bg-surface2'
>>>>>>> recover/cabinet-wip-from-stash
                  )}
                >
                  <div className="mb-3 flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className={cn(
                          'flex h-10 w-10 items-center justify-center rounded-xl',
                          session.current
<<<<<<< HEAD
                            ? 'bg-indigo-100 text-indigo-600'
                            : 'bg-slate-200 text-slate-600'
                        )}
                      >
                        <Monitor className="h-5 w-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-[9px] font-black uppercase text-slate-900">
                            {session.device}
                          </span>
                          {session.current && (
                            <Badge className="h-3.5 border-none bg-indigo-600 px-1.5 text-[6px] font-black uppercase text-white">
                              Текущая
                            </Badge>
                          )}
                        </div>
                        <div className="mt-0.5 text-[8px] text-slate-500">{session.browser}</div>
                      </div>
=======
                            ? 'bg-accent-primary/15 text-accent-primary'
                            : 'bg-border-subtle text-text-secondary'
                        )}
                      >
                        <Monitor className="h-5 w-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-text-primary text-[9px] font-black uppercase">
                            {session.device}
                          </span>
                          {session.current && (
                            <Badge className="bg-accent-primary h-3.5 border-none px-1.5 text-[6px] font-black uppercase text-white">
                              Текущая
                            </Badge>
                          )}
                        </div>
                        <div className="text-text-secondary mt-0.5 text-[8px]">
                          {session.browser}
                        </div>
                      </div>
>>>>>>> recover/cabinet-wip-from-stash
                    </div>
                    {!session.current && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 px-2 text-[7px] font-black uppercase text-rose-600 hover:bg-rose-50 hover:text-rose-700"
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
<<<<<<< HEAD
                  <div className="flex items-center gap-3 text-[7px] font-medium text-slate-400">
=======
                  <div className="text-text-muted flex items-center gap-3 text-[7px] font-medium">
>>>>>>> recover/cabinet-wip-from-stash
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
            <div className="h-1 w-8 rounded-full bg-amber-600" />
<<<<<<< HEAD
            <h2 className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-400">
=======
            <h2 className="text-text-muted text-[9px] font-black uppercase tracking-[0.3em]">
>>>>>>> recover/cabinet-wip-from-stash
              API Keys
            </h2>
          </div>

<<<<<<< HEAD
          <Card className="rounded-xl border border-none border-slate-100 bg-white p-4 shadow-sm">
=======
          <Card className="border-border-subtle rounded-xl border border-none bg-white p-4 shadow-sm">
>>>>>>> recover/cabinet-wip-from-stash
            <div className="space-y-3">
              {API_KEYS.map((apiKey, i) => (
                <div
                  key={i}
<<<<<<< HEAD
                  className="rounded-xl bg-slate-50 p-4 transition-all hover:bg-slate-100"
=======
                  className="bg-bg-surface2 hover:bg-bg-surface2 rounded-xl p-4 transition-all"
>>>>>>> recover/cabinet-wip-from-stash
                >
                  <div className="mb-3 flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className={cn(
                          'flex h-10 w-10 items-center justify-center rounded-xl',
                          apiKey.status === 'active'
                            ? 'bg-emerald-100 text-emerald-600'
<<<<<<< HEAD
                            : 'bg-slate-200 text-slate-400'
=======
                            : 'bg-border-subtle text-text-muted'
>>>>>>> recover/cabinet-wip-from-stash
                        )}
                      >
                        <Key className="h-5 w-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
<<<<<<< HEAD
                          <span className="text-[9px] font-black uppercase text-slate-900">
=======
                          <span className="text-text-primary text-[9px] font-black uppercase">
>>>>>>> recover/cabinet-wip-from-stash
                            {apiKey.name}
                          </span>
                          <Badge
                            className={cn(
                              'h-3.5 border-none px-1.5 text-[6px] font-black uppercase',
                              apiKey.status === 'active'
                                ? 'bg-emerald-500 text-white'
<<<<<<< HEAD
                                : 'bg-slate-400 text-white'
=======
                                : 'bg-text-muted text-white'
>>>>>>> recover/cabinet-wip-from-stash
                            )}
                          >
                            {apiKey.status}
                          </Badge>
                        </div>
<<<<<<< HEAD
                        <div className="mt-0.5 font-mono text-[8px] text-slate-500">
=======
                        <div className="text-text-secondary mt-0.5 font-mono text-[8px]">
>>>>>>> recover/cabinet-wip-from-stash
                          {apiKey.key}
                        </div>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
<<<<<<< HEAD
                      className="h-7 px-2 text-[7px] font-black uppercase text-slate-400 hover:text-indigo-600"
=======
                      className="text-text-muted hover:text-accent-primary h-7 px-2 text-[7px] font-black uppercase"
>>>>>>> recover/cabinet-wip-from-stash
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
<<<<<<< HEAD
                  <div className="flex items-center gap-3 text-[7px] font-medium text-slate-400">
=======
                  <div className="text-text-muted flex items-center gap-3 text-[7px] font-medium">
>>>>>>> recover/cabinet-wip-from-stash
                    <span>Создан: {apiKey.created}</span>
                    <span>•</span>
                    <span>Использован: {apiKey.lastUsed}</span>
                  </div>
                </div>
              ))}
            </div>
<<<<<<< HEAD
            <div className="mt-4 border-t border-slate-100 pt-4">
              <Button
                variant="outline"
                className="h-9 w-full rounded-xl border-slate-200 text-[8px] font-black uppercase hover:bg-slate-50"
=======
            <div className="border-border-subtle mt-4 border-t pt-4">
              <Button
                variant="outline"
                className="border-border-default hover:bg-bg-surface2 h-9 w-full rounded-xl text-[8px] font-black uppercase"
>>>>>>> recover/cabinet-wip-from-stash
              >
                <Key className="mr-2 h-3 w-3" /> Создать новый API ключ
              </Button>
            </div>
          </Card>
        </div>
      </div>

      {/* Audit Log */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
<<<<<<< HEAD
          <div className="h-1 w-8 rounded-full bg-slate-900" />
          <h2 className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-400">
=======
          <div className="bg-text-primary h-1 w-8 rounded-full" />
          <h2 className="text-text-muted text-[9px] font-black uppercase tracking-[0.3em]">
>>>>>>> recover/cabinet-wip-from-stash
            Audit Log
          </h2>
        </div>

<<<<<<< HEAD
        <Card className="rounded-xl border border-none border-slate-100 bg-white p-4 shadow-sm">
=======
        <Card className="border-border-subtle rounded-xl border border-none bg-white p-4 shadow-sm">
>>>>>>> recover/cabinet-wip-from-stash
          <div className="space-y-3">
            {AUDIT_LOG.map((log, i) => (
              <div
                key={i}
<<<<<<< HEAD
                className="group flex items-center gap-3 rounded-xl bg-slate-50 p-4 transition-all hover:bg-slate-100"
=======
                className="bg-bg-surface2 hover:bg-bg-surface2 group flex items-center gap-3 rounded-xl p-4 transition-all"
>>>>>>> recover/cabinet-wip-from-stash
              >
                <div
                  className={cn(
                    'flex h-10 w-10 items-center justify-center rounded-xl',
                    log.risk === 'high'
                      ? 'bg-rose-100 text-rose-600'
                      : log.risk === 'medium'
                        ? 'bg-amber-100 text-amber-600'
                        : 'bg-emerald-100 text-emerald-600'
                  )}
                >
                  {log.type === 'login' ? (
                    <Activity className="h-5 w-5" />
                  ) : log.type === 'security' ? (
                    <ShieldCheck className="h-5 w-5" />
                  ) : (
                    <Key className="h-5 w-5" />
                  )}
                </div>
                <div className="flex-1">
                  <div className="mb-1 flex items-center gap-2">
<<<<<<< HEAD
                    <span className="text-[9px] font-black uppercase text-slate-900">
                      {log.user}
                    </span>
                    <span className="text-[8px] text-slate-400">•</span>
                    <span className="text-[8px] text-slate-600">{log.action}</span>
                  </div>
                  <div className="text-[7px] text-slate-400">{log.details}</div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[7px] font-bold uppercase text-slate-400">{log.time}</span>
=======
                    <span className="text-text-primary text-[9px] font-black uppercase">
                      {log.user}
                    </span>
                    <span className="text-text-muted text-[8px]">•</span>
                    <span className="text-text-secondary text-[8px]">{log.action}</span>
                  </div>
                  <div className="text-text-muted text-[7px]">{log.details}</div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-text-muted text-[7px] font-bold uppercase">{log.time}</span>
>>>>>>> recover/cabinet-wip-from-stash
                  <Badge
                    className={cn(
                      'h-3.5 border-none px-1.5 text-[6px] font-black uppercase',
                      log.risk === 'high'
                        ? 'bg-rose-500 text-white'
                        : log.risk === 'medium'
                          ? 'bg-amber-500 text-white'
<<<<<<< HEAD
                          : 'bg-slate-300 text-slate-600'
=======
                          : 'bg-border-default text-text-secondary'
>>>>>>> recover/cabinet-wip-from-stash
                    )}
                  >
                    {log.risk}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
<<<<<<< HEAD
          <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-6">
            <div className="text-[8px] font-medium text-slate-400">Показано 4 из 247 событий</div>
            <Button
              variant="outline"
              className="h-9 rounded-xl border-slate-200 px-4 text-[8px] font-black uppercase hover:bg-slate-50"
=======
          <div className="border-border-subtle mt-6 flex items-center justify-between border-t pt-6">
            <div className="text-text-muted text-[8px] font-medium">Показано 4 из 247 событий</div>
            <Button
              variant="outline"
              className="border-border-default hover:bg-bg-surface2 h-9 rounded-xl px-4 text-[8px] font-black uppercase"
>>>>>>> recover/cabinet-wip-from-stash
            >
              Показать все события
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}

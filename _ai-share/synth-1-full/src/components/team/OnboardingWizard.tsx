'use client';

import { useState, useEffect } from 'react';
import { TeamMember } from '@/lib/types';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
<<<<<<< HEAD
  Button,
} from '@/components/ui/dialog';
=======
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
>>>>>>> recover/cabinet-wip-from-stash
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import {
  Lock,
  ShieldCheck,
  User,
  Share2,
  ArrowRight,
  Loader2,
  CheckCircle2,
  ExternalLink,
} from 'lucide-react';
import { motion } from 'framer-motion';

const transliterate = (text: string): string => {
  const map: Record<string, string> = {
    а: 'a',
    б: 'b',
    в: 'v',
    г: 'g',
    д: 'd',
    е: 'e',
    ё: 'yo',
    ж: 'zh',
    з: 'z',
    и: 'i',
    й: 'j',
    к: 'k',
    л: 'l',
    м: 'm',
    н: 'n',
    о: 'o',
    п: 'p',
    р: 'r',
    с: 's',
    т: 't',
    у: 'u',
    ф: 'f',
    х: 'kh',
    ц: 'ts',
    ч: 'ch',
    ш: 'sh',
    щ: 'shch',
    ъ: '',
    ы: 'y',
    ь: '',
    э: 'e',
    ю: 'yu',
    я: 'ya',
  };
  return text
    .toLowerCase()
    .split('')
    .map((char) => map[char] || char)
    .join('')
    .replace(/[^a-z0-9_]/g, '');
};

const OnboardingWizard = ({
  member,
  onComplete,
  onCancel,
}: {
  member: TeamMember;
  onComplete: (data: Partial<TeamMember>) => void;
  onCancel: () => void;
}) => {
  const [step, setStep] = useState<'password' | 'verification' | 'profile' | 'knowledge'>(
    'password'
  );
  const [password, setPassword] = useState('');
  const [vCode, setVCode] = useState('');
  const [profileData, setProfileData] = useState({
    firstName: '',
    lastName: '',
    nickname: '',
    role: member.role || '',
    department: member.department || '',
  });
  const [isNicknameManual, setIsNicknameManual] = useState(false);
  const [isCheckingNickname, setIsCheckingNickname] = useState(false);
  const [nicknameError, setNicknameError] = useState('');

  const handleNext = () => {
    if (step === 'password') setStep('verification');
    else if (step === 'verification') setStep('profile');
    else if (step === 'profile') setStep('knowledge');
    else {
      if (nicknameError) return;
      onComplete({
        ...profileData,
        password,
        invitationStatus: 'accepted',
        onboardingStep: 'completed',
        joinedAt: new Date().toISOString(),
      });
    }
  };

  useEffect(() => {
    if (!isNicknameManual && step === 'profile') {
      const generated =
        `${transliterate(profileData.firstName)}_${transliterate(profileData.lastName)}`.replace(
          /^_|_$/g,
          ''
        );
      setProfileData((prev) => ({ ...prev, nickname: generated }));
    }
  }, [profileData.firstName, profileData.lastName, isNicknameManual, step]);

  useEffect(() => {
    if (profileData.nickname && step === 'profile') {
      setIsCheckingNickname(true);
      const timer = setTimeout(() => {
        const isTaken = ['admin', 'syntha', 'nordic'].includes(profileData.nickname.toLowerCase());
        setNicknameError(isTaken ? 'Этот никнейм уже занят в базе Intel OS' : '');
        setIsCheckingNickname(false);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [profileData.nickname, step]);

  return (
    <Dialog open={true} onOpenChange={(open) => !open && onCancel()}>
      <DialogContent className="max-w-md overflow-hidden rounded-xl border-none bg-white p-3 shadow-2xl">
        <DialogTitle className="sr-only">Активация сотрудника: {member.email}</DialogTitle>
        <DialogDescription className="sr-only">
          Мастер настройки профиля и верификации для нового участника команды.
        </DialogDescription>
<<<<<<< HEAD
        <div className="absolute left-0 top-0 h-1.5 w-full bg-slate-100">
          <motion.div
            className="h-full bg-indigo-600"
=======
        <div className="bg-bg-surface2 absolute left-0 top-0 h-1.5 w-full">
          <motion.div
            className="bg-accent-primary h-full"
>>>>>>> recover/cabinet-wip-from-stash
            initial={{ width: '25%' }}
            animate={{
              width:
                step === 'password'
                  ? '25%'
                  : step === 'verification'
                    ? '50%'
                    : step === 'profile'
                      ? '75%'
                      : '100%',
            }}
          />
        </div>

        <div className="space-y-4 pt-4">
          <div className="space-y-2 text-center">
<<<<<<< HEAD
            <div className="mx-auto mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50">
              {step === 'password' ? (
                <Lock className="h-8 w-8 text-indigo-600" />
              ) : step === 'verification' ? (
                <ShieldCheck className="h-8 w-8 text-indigo-600" />
              ) : step === 'profile' ? (
                <User className="h-8 w-8 text-indigo-600" />
              ) : (
                <Share2 className="h-8 w-8 text-indigo-600" />
              )}
            </div>
            <h2 className="text-sm font-black uppercase tracking-tighter text-slate-900">
=======
            <div className="bg-accent-primary/10 mx-auto mb-6 flex h-12 w-12 items-center justify-center rounded-xl">
              {step === 'password' ? (
                <Lock className="text-accent-primary h-8 w-8" />
              ) : step === 'verification' ? (
                <ShieldCheck className="text-accent-primary h-8 w-8" />
              ) : step === 'profile' ? (
                <User className="text-accent-primary h-8 w-8" />
              ) : (
                <Share2 className="text-accent-primary h-8 w-8" />
              )}
            </div>
            <h2 className="text-text-primary text-sm font-black uppercase tracking-tighter">
>>>>>>> recover/cabinet-wip-from-stash
              {step === 'password'
                ? 'Установка доступа'
                : step === 'verification'
                  ? 'Верификация'
                  : step === 'profile'
                    ? 'Ваш профиль'
                    : 'База знаний'}
            </h2>
<<<<<<< HEAD
            <p className="text-[10px] font-bold uppercase leading-relaxed tracking-widest text-slate-400">
=======
            <p className="text-text-muted text-[10px] font-bold uppercase leading-relaxed tracking-widest">
>>>>>>> recover/cabinet-wip-from-stash
              {step === 'password'
                ? 'Создайте надежный пароль для вашей учетной записи Intel OS'
                : step === 'verification'
                  ? `Мы отправили код подтверждения (SMS на почту) на ${member.email}`
                  : step === 'profile'
                    ? 'Заполните информацию о себе для синхронизации с матрицей команды'
                    : 'Ознакомьтесь с регламентами и инструментами вашей роли'}
            </p>
          </div>

          <div className="space-y-6">
            {step === 'password' && (
              <div className="space-y-1.5 duration-500 animate-in fade-in slide-in-from-bottom-4">
<<<<<<< HEAD
                <label className="ml-1 text-[8px] font-black uppercase text-slate-400">
                  Новый пароль (Код доступа)
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-300" />
=======
                <label className="text-text-muted ml-1 text-[8px] font-black uppercase">
                  Новый пароль (Код доступа)
                </label>
                <div className="relative">
                  <Lock className="text-text-muted absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2" />
>>>>>>> recover/cabinet-wip-from-stash
                  <Input
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
<<<<<<< HEAD
                    className="h-10 rounded-2xl border-none bg-slate-50 pl-12 font-bold ring-indigo-500/20 focus:ring-2"
=======
                    className="bg-bg-surface2 ring-accent-primary/20 h-10 rounded-2xl border-none pl-12 font-bold focus:ring-2"
>>>>>>> recover/cabinet-wip-from-stash
                  />
                </div>
              </div>
            )}

            {step === 'verification' && (
              <div className="space-y-1.5 text-center duration-500 animate-in fade-in slide-in-from-bottom-4">
<<<<<<< HEAD
                <label className="text-[8px] font-black uppercase text-slate-400">
=======
                <label className="text-text-muted text-[8px] font-black uppercase">
>>>>>>> recover/cabinet-wip-from-stash
                  Код из SMS/Email
                </label>
                <div className="mt-2 flex justify-center gap-3">
                  <Input
                    maxLength={6}
                    placeholder="000000"
                    value={vCode}
                    onChange={(e) => setVCode(e.target.value)}
<<<<<<< HEAD
                    className="h-12 w-40 rounded-2xl border-none bg-slate-50 text-center text-sm font-black tracking-[0.5em] ring-indigo-500/20 focus:ring-2"
                  />
                </div>
                <p className="mt-4 text-[8px] font-bold uppercase tracking-widest text-slate-300">
                  Не пришел код?{' '}
                  <span className="cursor-pointer text-indigo-500">Отправить повторно</span>
=======
                    className="bg-bg-surface2 ring-accent-primary/20 h-12 w-40 rounded-2xl border-none text-center text-sm font-black tracking-[0.5em] focus:ring-2"
                  />
                </div>
                <p className="text-text-muted mt-4 text-[8px] font-bold uppercase tracking-widest">
                  Не пришел код?{' '}
                  <span className="text-accent-primary cursor-pointer">Отправить повторно</span>
>>>>>>> recover/cabinet-wip-from-stash
                </p>
              </div>
            )}

            {step === 'profile' && (
              <div className="space-y-4 duration-500 animate-in fade-in slide-in-from-bottom-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
<<<<<<< HEAD
                    <label className="ml-1 text-[8px] font-black uppercase text-slate-400">
=======
                    <label className="text-text-muted ml-1 text-[8px] font-black uppercase">
>>>>>>> recover/cabinet-wip-from-stash
                      Имя
                    </label>
                    <Input
                      placeholder="Иван"
                      value={profileData.firstName}
                      onChange={(e) =>
                        setProfileData({ ...profileData, firstName: e.target.value })
                      }
<<<<<<< HEAD
                      className="h-12 rounded-xl border-none bg-slate-50 font-bold"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="ml-1 text-[8px] font-black uppercase text-slate-400">
=======
                      className="bg-bg-surface2 h-12 rounded-xl border-none font-bold"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-text-muted ml-1 text-[8px] font-black uppercase">
>>>>>>> recover/cabinet-wip-from-stash
                      Фамилия
                    </label>
                    <Input
                      placeholder="Иванов"
                      value={profileData.lastName}
                      onChange={(e) => setProfileData({ ...profileData, lastName: e.target.value })}
<<<<<<< HEAD
                      className="h-12 rounded-xl border-none bg-slate-50 font-bold"
=======
                      className="bg-bg-surface2 h-12 rounded-xl border-none font-bold"
>>>>>>> recover/cabinet-wip-from-stash
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <div className="ml-1 flex items-center justify-between">
<<<<<<< HEAD
                    <label className="text-[8px] font-black uppercase text-slate-400">
                      Никнейм (Latin Matrix ID)
                    </label>
                    {isCheckingNickname && (
                      <Loader2 className="h-2 w-2 animate-spin text-indigo-500" />
=======
                    <label className="text-text-muted text-[8px] font-black uppercase">
                      Никнейм (Latin Matrix ID)
                    </label>
                    {isCheckingNickname && (
                      <Loader2 className="text-accent-primary h-2 w-2 animate-spin" />
>>>>>>> recover/cabinet-wip-from-stash
                    )}
                  </div>
                  <div className="relative">
                    <Input
                      placeholder="ivanov_ai"
                      value={profileData.nickname}
                      onChange={(e) => {
                        setIsNicknameManual(true);
                        setProfileData({
                          ...profileData,
                          nickname: e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''),
                        });
                      }}
                      className={cn(
<<<<<<< HEAD
                        'h-12 rounded-xl border-none bg-slate-50 font-black text-indigo-600 transition-all',
                        nicknameError
                          ? 'text-rose-600 ring-2 ring-rose-500/20'
                          : 'ring-indigo-500/10 focus:ring-2'
                      )}
                    />
                    {!isNicknameManual && profileData.nickname && (
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md bg-indigo-50 px-2 py-0.5 text-[7px] font-black uppercase text-indigo-400">
=======
                        'bg-bg-surface2 text-accent-primary h-12 rounded-xl border-none font-black transition-all',
                        nicknameError
                          ? 'text-rose-600 ring-2 ring-rose-500/20'
                          : 'ring-accent-primary/10 focus:ring-2'
                      )}
                    />
                    {!isNicknameManual && profileData.nickname && (
                      <div className="bg-accent-primary/10 text-accent-primary absolute right-3 top-1/2 -translate-y-1/2 rounded-md px-2 py-0.5 text-[7px] font-black uppercase">
>>>>>>> recover/cabinet-wip-from-stash
                        Auto
                      </div>
                    )}
                  </div>
                  {nicknameError && (
                    <p className="ml-1 text-[8px] font-bold uppercase text-rose-500">
                      {nicknameError}
                    </p>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
<<<<<<< HEAD
                    <label className="ml-1 text-[8px] font-black uppercase text-slate-400">
=======
                    <label className="text-text-muted ml-1 text-[8px] font-black uppercase">
>>>>>>> recover/cabinet-wip-from-stash
                      Должность
                    </label>
                    <Input
                      placeholder="Менеджер"
                      value={profileData.role}
                      onChange={(e) => setProfileData({ ...profileData, role: e.target.value })}
<<<<<<< HEAD
                      className="h-12 rounded-xl border-none bg-slate-50 font-bold"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="ml-1 text-[8px] font-black uppercase text-slate-400">
=======
                      className="bg-bg-surface2 h-12 rounded-xl border-none font-bold"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-text-muted ml-1 text-[8px] font-black uppercase">
>>>>>>> recover/cabinet-wip-from-stash
                      Подразделение
                    </label>
                    <Input
                      placeholder="Логистика"
                      value={profileData.department}
                      onChange={(e) =>
                        setProfileData({ ...profileData, department: e.target.value })
                      }
<<<<<<< HEAD
                      className="h-12 rounded-xl border-none bg-slate-50 font-bold"
=======
                      className="bg-bg-surface2 h-12 rounded-xl border-none font-bold"
>>>>>>> recover/cabinet-wip-from-stash
                    />
                  </div>
                </div>
              </div>
            )}

            {step === 'knowledge' && (
              <div className="space-y-4 duration-500 animate-in fade-in slide-in-from-bottom-4">
<<<<<<< HEAD
                <div className="space-y-3 rounded-2xl border border-indigo-100 bg-indigo-50 p-4">
                  <p className="text-[8px] font-black uppercase tracking-widest text-indigo-600">
=======
                <div className="bg-accent-primary/10 border-accent-primary/20 space-y-3 rounded-2xl border p-4">
                  <p className="text-accent-primary text-[8px] font-black uppercase tracking-widest">
>>>>>>> recover/cabinet-wip-from-stash
                    Рекомендуемые материалы для {profileData.role || 'сотрудника'}:
                  </p>
                  <div className="space-y-2">
                    {[
                      { title: 'Гайд по интерфейсу Intel OS', type: 'PDF' },
                      { title: 'Регламент мерчандайзинга B2B', type: 'VIDEO' },
                      { title: 'Протокол работы с заказами', type: 'DOC' },
                    ].map((doc, i) => (
                      <div
                        key={i}
<<<<<<< HEAD
                        className="group flex cursor-pointer items-center justify-between rounded-xl border border-indigo-50 bg-white p-3 shadow-sm transition-all hover:border-indigo-200"
                      >
                        <div className="flex items-center gap-3">
                          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-50 text-[8px] font-black text-slate-400 transition-all group-hover:bg-indigo-600 group-hover:text-white">
=======
                        className="border-accent-primary/15 hover:border-accent-primary/30 group flex cursor-pointer items-center justify-between rounded-xl border bg-white p-3 shadow-sm transition-all"
                      >
                        <div className="flex items-center gap-3">
                          <div className="bg-bg-surface2 text-text-muted group-hover:bg-accent-primary flex h-8 w-8 items-center justify-center rounded-lg text-[8px] font-black transition-all group-hover:text-white">
>>>>>>> recover/cabinet-wip-from-stash
                            {doc.type}
                          </div>
                          <span className="text-text-primary text-[10px] font-bold">
                            {doc.title}
                          </span>
                        </div>
                        <ExternalLink className="text-text-muted h-3 w-3" />
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex items-center gap-2 rounded-xl border border-emerald-100 bg-emerald-50 p-3">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                  <p className="text-[9px] font-bold uppercase leading-none tracking-tight text-emerald-700">
                    Задачи по обучению добавлены в ваш календарь
                  </p>
                </div>
              </div>
            )}

            <Button
              onClick={handleNext}
              disabled={
                step === 'profile' &&
                (!!nicknameError || isCheckingNickname || !profileData.nickname)
              }
              className="mt-4 h-10 w-full rounded-2xl bg-black text-xs font-black uppercase tracking-widest text-white shadow-xl transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-50"
            >
              {step === 'knowledge' ? 'Завершить активацию' : 'Далее'}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OnboardingWizard;

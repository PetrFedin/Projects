'use client';

import { useState, useEffect } from 'react';
import { TeamMember } from '@/lib/types';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, Button } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { Lock, ShieldCheck, User, Share2, ArrowRight, Loader2, CheckCircle2, ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';

const transliterate = (text: string): string => {
  const map: Record<string, string> = {
    'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd', 'е': 'e', 'ё': 'yo', 'ж': 'zh',
    'з': 'z', 'и': 'i', 'й': 'j', 'к': 'k', 'л': 'l', 'м': 'm', 'н': 'n', 'о': 'o',
    'п': 'p', 'р': 'r', 'с': 's', 'т': 't', 'у': 'u', 'ф': 'f', 'х': 'kh', 'ц': 'ts',
    'ч': 'ch', 'ш': 'sh', 'щ': 'shch', 'ъ': '', 'ы': 'y', 'ь': '', 'э': 'e', 'ю': 'yu', 'я': 'ya'
  };
  return text.toLowerCase().split('').map(char => map[char] || char).join('').replace(/[^a-z0-9_]/g, '');
};

const OnboardingWizard = ({ member, onComplete, onCancel }: { member: TeamMember, onComplete: (data: Partial<TeamMember>) => void, onCancel: () => void }) => {
  const [step, setStep] = useState<'password' | 'verification' | 'profile' | 'knowledge'>('password');
  const [password, setPassword] = useState("");
  const [vCode, setVCode] = useState("");
  const [profileData, setProfileData] = useState({
    firstName: "",
    lastName: "",
    nickname: "",
    role: member.role || "",
    department: member.department || ""
  });
  const [isNicknameManual, setIsNicknameManual] = useState(false);
  const [isCheckingNickname, setIsCheckingNickname] = useState(false);
  const [nicknameError, setNicknameError] = useState("");

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
        joinedAt: new Date().toISOString()
      });
    }
  };

  useEffect(() => {
    if (!isNicknameManual && step === 'profile') {
      const generated = `${transliterate(profileData.firstName)}_${transliterate(profileData.lastName)}`.replace(/^_|_$/g, '');
      setProfileData(prev => ({ ...prev, nickname: generated }));
    }
  }, [profileData.firstName, profileData.lastName, isNicknameManual, step]);

  useEffect(() => {
    if (profileData.nickname && step === 'profile') {
      setIsCheckingNickname(true);
      const timer = setTimeout(() => {
        const isTaken = ['admin', 'syntha', 'nordic'].includes(profileData.nickname.toLowerCase());
        setNicknameError(isTaken ? "Этот никнейм уже занят в базе Intel OS" : "");
        setIsCheckingNickname(false);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [profileData.nickname, step]);

  return (
    <Dialog open={true} onOpenChange={(open) => !open && onCancel()}>
      <DialogContent className="max-w-md rounded-xl p-3 border-none shadow-2xl bg-white overflow-hidden">
        <DialogTitle className="sr-only">Активация сотрудника: {member.email}</DialogTitle>
        <DialogDescription className="sr-only">Мастер настройки профиля и верификации для нового участника команды.</DialogDescription>
        <div className="absolute top-0 left-0 w-full h-1.5 bg-slate-100">
          <motion.div 
            className="h-full bg-indigo-600" 
            initial={{ width: "25%" }}
            animate={{ width: step === 'password' ? "25%" : step === 'verification' ? "50%" : step === 'profile' ? "75%" : "100%" }}
          />
        </div>

        <div className="space-y-4 pt-4">
          <div className="text-center space-y-2">
            <div className="h-12 w-12 bg-indigo-50 rounded-xl flex items-center justify-center mx-auto mb-6">
              {step === 'password' ? <Lock className="h-8 w-8 text-indigo-600" /> :
               step === 'verification' ? <ShieldCheck className="h-8 w-8 text-indigo-600" /> :
               step === 'profile' ? <User className="h-8 w-8 text-indigo-600" /> :
               <Share2 className="h-8 w-8 text-indigo-600" />}
            </div>
            <h2 className="text-sm font-black tracking-tighter uppercase text-slate-900">
              {step === 'password' ? 'Установка доступа' :
               step === 'verification' ? 'Верификация' : 
               step === 'profile' ? 'Ваш профиль' : 'База знаний'}
            </h2>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-relaxed">
              {step === 'password' ? 'Создайте надежный пароль для вашей учетной записи Intel OS' :
               step === 'verification' ? `Мы отправили код подтверждения (SMS на почту) на ${member.email}` :
               step === 'profile' ? 'Заполните информацию о себе для синхронизации с матрицей команды' :
               'Ознакомьтесь с регламентами и инструментами вашей роли'}
            </p>
          </div>

          <div className="space-y-6">
            {step === 'password' && (
              <div className="space-y-1.5 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <label className="text-[8px] font-black uppercase text-slate-400 ml-1">Новый пароль (Код доступа)</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300" />
                  <Input 
                    type="password" 
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="rounded-2xl h-10 bg-slate-50 border-none font-bold pl-12 focus:ring-2 ring-indigo-500/20" 
                  />
                </div>
              </div>
            )}

            {step === 'verification' && (
              <div className="space-y-1.5 animate-in fade-in slide-in-from-bottom-4 duration-500 text-center">
                <label className="text-[8px] font-black uppercase text-slate-400">Код из SMS/Email</label>
                <div className="flex justify-center gap-3 mt-2">
                  <Input 
                    maxLength={6}
                    placeholder="000000"
                    value={vCode}
                    onChange={(e) => setVCode(e.target.value)}
                    className="w-40 text-center text-sm font-black tracking-[0.5em] rounded-2xl h-12 bg-slate-50 border-none focus:ring-2 ring-indigo-500/20" 
                  />
                </div>
                <p className="text-[8px] font-bold text-slate-300 uppercase tracking-widest mt-4">Не пришел код? <span className="text-indigo-500 cursor-pointer">Отправить повторно</span></p>
              </div>
            )}

            {step === 'profile' && (
              <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-[8px] font-black uppercase text-slate-400 ml-1">Имя</label>
                    <Input 
                      placeholder="Иван" 
                      value={profileData.firstName}
                      onChange={(e) => setProfileData({...profileData, firstName: e.target.value})}
                      className="rounded-xl h-12 bg-slate-50 border-none font-bold"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[8px] font-black uppercase text-slate-400 ml-1">Фамилия</label>
                    <Input 
                      placeholder="Иванов" 
                      value={profileData.lastName}
                      onChange={(e) => setProfileData({...profileData, lastName: e.target.value})}
                      className="rounded-xl h-12 bg-slate-50 border-none font-bold"
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between ml-1">
                    <label className="text-[8px] font-black uppercase text-slate-400">Никнейм (Latin Matrix ID)</label>
                    {isCheckingNickname && <Loader2 className="h-2 w-2 animate-spin text-indigo-500" />}
                  </div>
                  <div className="relative">
                    <Input 
                      placeholder="ivanov_ai" 
                      value={profileData.nickname}
                      onChange={(e) => {
                        setIsNicknameManual(true);
                        setProfileData({...profileData, nickname: e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, '')});
                      }}
                      className={cn(
                        "rounded-xl h-12 bg-slate-50 border-none font-black text-indigo-600 transition-all",
                        nicknameError ? "ring-2 ring-rose-500/20 text-rose-600" : "focus:ring-2 ring-indigo-500/10"
                      )}
                    />
                    {!isNicknameManual && profileData.nickname && (
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 px-2 py-0.5 rounded-md bg-indigo-50 text-[7px] font-black uppercase text-indigo-400">Auto</div>
                    )}
                  </div>
                  {nicknameError && <p className="text-[8px] font-bold text-rose-500 ml-1 uppercase">{nicknameError}</p>}
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-[8px] font-black uppercase text-slate-400 ml-1">Должность</label>
                    <Input 
                      placeholder="Менеджер" 
                      value={profileData.role}
                      onChange={(e) => setProfileData({...profileData, role: e.target.value})}
                      className="rounded-xl h-12 bg-slate-50 border-none font-bold"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[8px] font-black uppercase text-slate-400 ml-1">Подразделение</label>
                    <Input 
                      placeholder="Логистика" 
                      value={profileData.department}
                      onChange={(e) => setProfileData({...profileData, department: e.target.value})}
                      className="rounded-xl h-12 bg-slate-50 border-none font-bold"
                    />
                  </div>
                </div>
              </div>
            )}

            {step === 'knowledge' && (
              <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="p-4 rounded-2xl bg-indigo-50 border border-indigo-100 space-y-3">
                  <p className="text-[8px] font-black uppercase text-indigo-600 tracking-widest">Рекомендуемые материалы для {profileData.role || 'сотрудника'}:</p>
                  <div className="space-y-2">
                    {[
                      { title: 'Гайд по интерфейсу Intel OS', type: 'PDF' },
                      { title: 'Регламент мерчандайзинга B2B', type: 'VIDEO' },
                      { title: 'Протокол работы с заказами', type: 'DOC' }
                    ].map((doc, i) => (
                      <div key={i} className="flex items-center justify-between p-3 bg-white rounded-xl shadow-sm border border-indigo-50 hover:border-indigo-200 transition-all cursor-pointer group">
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded-lg bg-slate-50 flex items-center justify-center text-[8px] font-black text-slate-400 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                            {doc.type}
                          </div>
                          <span className="text-[10px] font-bold text-slate-700">{doc.title}</span>
                        </div>
                        <ExternalLink className="h-3 w-3 text-slate-300" />
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex items-center gap-2 p-3 bg-emerald-50 rounded-xl border border-emerald-100">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                  <p className="text-[9px] font-bold text-emerald-700 uppercase tracking-tight leading-none">Задачи по обучению добавлены в ваш календарь</p>
                </div>
              </div>
            )}

            <Button 
              onClick={handleNext}
              disabled={step === 'profile' && (!!nicknameError || isCheckingNickname || !profileData.nickname)}
              className="w-full h-10 bg-black text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl transition-all hover:scale-[1.02] active:scale-95 mt-4 disabled:opacity-50"
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

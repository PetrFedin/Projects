'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FileCheck, 
  ShieldCheck, 
  PenTool, 
  Lock, 
  Clock, 
  ArrowRight,
  Download,
  Eye,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/cn';

export function WholesaleContractManager({ orderId = "#8821" }) {
  const [step, setStep] = useState<'review' | 'signing' | 'completed'>('review');
  const [isSigned, setIsSigned] = useState(false);

  const contractDetails = {
    title: 'Генеральное соглашение об оптовых закупках',
    version: 'v2026.02',
    parties: {
      brand: 'Syntha Lab HQ',
      retailer: 'Premium Store Moscow'
    },
    clauses: [
      { id: 1, title: 'Предмет договора', content: 'Покупатель соглашается приобрести количество товара, указанное в матрице заказа #8821.' },
      { id: 2, title: 'Условия оплаты', content: 'Оплата производится в соответствии с условиями Net 30 с даты выставления счета в рублях РФ.' },
      { id: 3, title: 'Инкотермс', content: 'Поставка осуществляется на условиях DAP (Поставка в месте назначения) согласно Инкотермс 2020.' },
      { id: 4, title: 'Интеллектуальная собственность', content: 'Ритейлеру предоставляется ограниченная лицензия на использование активов бренда для маркетинга.' }
    ]
  };

  return (
    <div className="space-y-4 p-4 bg-slate-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-3">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-xl bg-emerald-600 flex items-center justify-center">
              <ShieldCheck className="h-4 w-4 text-white" />
            </div>
            <Badge variant="outline" className="border-emerald-100 text-emerald-600 uppercase font-black tracking-widest text-[9px]">
              LEGAL_SIGN_v3.0
            </Badge>
          </div>
          <h2 className="text-sm md:text-sm font-black uppercase tracking-tighter text-slate-900 leading-none">
            Договор купли-<br/>продажи
          </h2>
          <p className="text-slate-400 font-medium text-xs max-w-md text-left">
            Юридически значимая цифровая подпись для оптовых заказов. Все контракты фиксируются в приватном блокчейне для обеспечения неизменности условий.
          </p>
        </div>

        <div className="flex items-center gap-3">
           <Button variant="outline" className="h-10 rounded-2xl border-slate-200 px-6 font-black uppercase text-[10px] tracking-widest gap-2 bg-white">
              <Download className="h-4 w-4" /> Скачать PDF
           </Button>
           {step === 'review' && (
             <Button 
               onClick={() => setStep('signing')}
               className="h-10 bg-slate-900 text-white rounded-2xl px-8 font-black uppercase text-[10px] tracking-widest gap-2 shadow-xl shadow-slate-200"
             >
                Начать подписание <PenTool className="h-4 w-4" />
             </Button>
           )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3">
        {/* Document Viewer */}
        <div className="lg:col-span-8 space-y-6">
           <Card className="border-none shadow-2xl shadow-slate-200/50 rounded-xl bg-white overflow-hidden">
             <div className="p-4 space-y-10">
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <h3 className="text-sm font-black uppercase tracking-tight text-slate-900">{contractDetails.title}</h3>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Document Hash: 0x4f...8921</p>
                  </div>
                  <Badge className="bg-slate-100 text-slate-400 border-none text-[8px] font-black uppercase px-2 py-0.5 tracking-widest">
                    {step === 'completed' ? 'EXECUTED' : 'PENDING SIGNATURE'}
                  </Badge>
                </div>

                <div className="grid grid-cols-2 gap-3 py-4 border-y border-slate-50">
                  <div className="space-y-2">
                    <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">Продавец (Бренд)</p>
                    <p className="text-sm font-black text-slate-900 uppercase">{contractDetails.parties.brand}</p>
                    <p className="text-[10px] font-medium text-slate-400">ИНН: 7701234567</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">Покупатель (Ритейлер)</p>
                    <p className="text-sm font-black text-slate-900 uppercase">{contractDetails.parties.retailer}</p>
                    <p className="text-[10px] font-medium text-slate-400">ИНН: 7709876543</p>
                  </div>
                </div>

                <div className="space-y-4">
                  {contractDetails.clauses.map((clause) => (
                    <div key={clause.id} className="space-y-2">
                      <h4 className="text-xs font-black uppercase tracking-widest text-slate-900">{clause.id}. {clause.title}</h4>
                      <p className="text-sm font-medium text-slate-600 leading-relaxed">{clause.content}</p>
                    </div>
                  ))}
                </div>

                <div className="pt-10 flex justify-between items-end">
                  <div className="space-y-6">
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Подписи сторон</p>
                    <div className="flex gap-3">
                      <div className="space-y-3">
                        <div className="h-12 w-48 border-b-2 border-slate-100 flex items-center justify-center italic text-slate-300 font-sans text-base">
                          / Syntha Lab Admin /
                        </div>
                        <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">Уполномоченное лицо</p>
                      </div>
                      <div className="space-y-3">
                        <div className="h-12 w-48 border-b-2 border-slate-100 flex items-center justify-center relative">
                           {step === 'completed' ? (
                             <motion.div 
                               initial={{ opacity: 0, scale: 0.5 }}
                               animate={{ opacity: 1, scale: 1 }}
                               className="italic text-indigo-600 font-sans text-sm"
                             >
                               Premium Store HQ
                             </motion.div>
                           ) : (
                             <span className="text-[9px] font-black uppercase tracking-widest text-slate-200 italic">Требуется подпись</span>
                           )}
                        </div>
                        <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">Представитель ритейлера</p>
                      </div>
                    </div>
                  </div>
                </div>
             </div>
           </Card>
        </div>

        {/* Signing Controls */}
        <div className="lg:col-span-4 space-y-4">
           <AnimatePresence mode="wait">
             {step === 'signing' && (
               <motion.div
                 initial={{ opacity: 0, y: 20 }}
                 animate={{ opacity: 1, y: 0 }}
                 exit={{ opacity: 0, y: -20 }}
               >
                 <Card className="border-none shadow-2xl shadow-indigo-200/50 rounded-xl bg-indigo-600 text-white p-4 space-y-4 overflow-hidden relative">
                    <div className="absolute top-0 right-0 p-4 opacity-10">
                       <PenTool className="h-32 w-32" />
                    </div>
                    <div className="relative z-10 space-y-6">
                      <h3 className="text-base font-black uppercase tracking-tight">Цифровой сейф</h3>
                      <div className="space-y-4">
                        <p className="text-[10px] font-medium text-white/70 leading-relaxed uppercase">
                          Введите ваш профессиональный токен идентификации для подтверждения контракта. Это действие необратимо.
                        </p>
                        <div className="space-y-2">
                           <Input 
                             placeholder="AUTH_TOKEN_XXXX" 
                             className="h-10 bg-white/10 border-white/20 text-white placeholder:text-white/30 font-black tracking-widest rounded-xl" 
                           />
                        </div>
                        <Button 
                          onClick={() => setStep('completed')}
                          className="w-full h-10 bg-white text-indigo-600 rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-2xl"
                        >
                          Подтвердить и подписать
                        </Button>
                      </div>
                    </div>
                 </Card>
               </motion.div>
             )}

             {step === 'completed' && (
               <motion.div
                 initial={{ opacity: 0, scale: 0.9 }}
                 animate={{ opacity: 1, scale: 1 }}
               >
                 <Card className="border-none shadow-2xl shadow-emerald-200/50 rounded-xl bg-emerald-500 text-white p-4 space-y-6">
                    <div className="h-12 w-12 rounded-2xl bg-white/20 flex items-center justify-center">
                       <CheckCircle2 className="h-8 w-8 text-white" />
                    </div>
                    <div className="space-y-2">
                       <h3 className="text-base font-black uppercase tracking-tight">Контракт защищен</h3>
                       <p className="text-[10px] font-medium text-white/80 leading-relaxed uppercase">
                         Соглашение по заказу #8821 подписано обеими сторонами и верифицировано через протокол Syntha.
                       </p>
                    </div>
                    <div className="pt-4 flex gap-2">
                       <Button variant="outline" className="flex-1 h-12 rounded-xl bg-white/10 border-white/20 text-white font-black uppercase text-[9px] tracking-widest">
                          Просмотр в Explorer
                       </Button>
                       <Button variant="outline" className="flex-1 h-12 rounded-xl bg-white/10 border-white/20 text-white font-black uppercase text-[9px] tracking-widest">
                          Лог аудита
                       </Button>
                    </div>
                 </Card>
               </motion.div>
             )}

             {step === 'review' && (
               <Card className="border-none shadow-xl shadow-slate-200/50 rounded-xl bg-white p-4 space-y-6">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-slate-50 flex items-center justify-center">
                      <Eye className="h-5 w-5 text-slate-400" />
                    </div>
                    <h4 className="text-sm font-black uppercase tracking-tight text-slate-900">Статус проверки</h4>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3 p-4 rounded-2xl bg-amber-50 border border-amber-100">
                      <AlertCircle className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
                      <p className="text-[9px] font-medium text-amber-900 leading-relaxed">
                        Пожалуйста, просмотрите все пункты перед подписанием. Изменения в логистике после подписания потребуют внесения поправок в контракт.
                      </p>
                    </div>
                    <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-slate-400 p-2">
                       <div className="flex items-center gap-2">
                          <Clock className="h-3.5 w-3.5" />
                          <span>Последний просмотр: 2 мин назад</span>
                       </div>
                       <span>Вер: 2.1</span>
                    </div>
                  </div>
               </Card>
             )}
           </AnimatePresence>

           <Card className="border-none shadow-xl shadow-slate-200/50 rounded-xl bg-slate-900 text-white p-4 space-y-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-5">
                 <Lock className="h-32 w-32" />
              </div>
              <div className="relative z-10 space-y-4">
                 <h4 className="text-sm font-black uppercase tracking-tight">Security Anchor</h4>
                 <p className="text-[9px] font-medium text-white/50 leading-relaxed uppercase">
                   Multi-party computation (MPC) protocol ensures that contract secrets remain private while verifying the validity of the signatures.
                 </p>
                 <div className="flex items-center gap-2 pt-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[8px] font-black uppercase tracking-widest text-emerald-400">Node Cluster: Secured</span>
                 </div>
              </div>
           </Card>
        </div>
      </div>
    </div>
  );
}

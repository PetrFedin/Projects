'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useQuiz } from './hooks/useQuiz';
import { ParamKey } from './_lib/types';

export default function QuizPage() {
  const { step, norm, updateParam, nextStep, prevStep, calculateResult, result } = useQuiz();

  if (result) {
    return (
      <div className="container max-w-4xl py-10 space-y-4">
        <Card className="rounded-3xl border-none shadow-2xl bg-white p-4">
          <CardHeader>
            <CardTitle className="text-base font-black uppercase">Ваш результат: {result.bpi}% BPI</CardTitle>
            <CardDescription className="text-sm">{result.segment.name}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-slate-600">{result.segment.description}</p>
            <div className="space-y-4">
              <h4 className="font-bold uppercase text-sm tracking-widest">Рекомендации:</h4>
              <ul className="list-disc pl-5 space-y-2">
                {result.upgradeTips.map((tip, i) => <li key={i} className="text-slate-600">{tip}</li>)}
              </ul>
            </div>
            <Button onClick={() => window.location.reload()} className="w-full h-10 rounded-2xl bg-black text-white font-black uppercase">Начать заново</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const questions: Array<{ key: ParamKey, label: string, options: string[] }> = [
    { key: 'price_index', label: 'Ценовой уровень', options: ['Масс-маркет', 'Мидл', 'Премиум', 'Люкс'] },
    { key: 'materials_quality', label: 'Качество материалов', options: ['Базовые (синтетика)', 'Смесовые', 'Натуральные', 'Эксклюзивные'] },
    // More questions would be here in reality
  ];

  const currentQ = questions[step % questions.length];

  return (
    <div className="container max-w-2xl py-10">
      <Card className="rounded-xl border-none shadow-2xl bg-white overflow-hidden">
        <div className="h-2 bg-slate-100"><div className="h-full bg-black transition-all" style={{ width: `${((step + 1) / questions.length) * 100}%` }} /></div>
        <CardHeader className="p-3 pb-6">
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Вопрос {step + 1} из {questions.length}</span>
          <CardTitle className="text-sm font-black uppercase mt-2">{currentQ.label}</CardTitle>
        </CardHeader>
        <CardContent className="p-3 pt-0 space-y-4">
          {currentQ.options.map((opt, i) => (
            <Button key={i} variant="outline" className="w-full h-12 rounded-2xl justify-start px-6 text-sm font-bold hover:bg-black hover:text-white transition-all" onClick={() => { updateParam(currentQ.key, i / (currentQ.options.length - 1)); if (step < questions.length - 1) nextStep(); else calculateResult(); }}>
              {opt}
            </Button>
          ))}
          <div className="flex gap-3 pt-6">
            {step > 0 && <Button variant="ghost" onClick={prevStep} className="font-bold uppercase text-xs">Назад</Button>}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

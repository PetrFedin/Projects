'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useQuiz } from './hooks/useQuiz';
import { ParamKey } from './_lib/types';

export default function QuizPage() {
  const { step, norm, updateParam, nextStep, prevStep, calculateResult, result } = useQuiz();

  if (result) {
    return (
      <div className="container max-w-4xl space-y-4 py-10">
        <Card className="rounded-3xl border-none bg-white p-4 shadow-2xl">
          <CardHeader>
            <CardTitle className="text-base font-black uppercase">
              Ваш результат: {result.bpi}% BPI
            </CardTitle>
            <CardDescription className="text-sm">{result.segment.name}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-text-secondary">{result.segment.description}</p>
            <div className="space-y-4">
              <h4 className="text-sm font-bold uppercase tracking-widest">Рекомендации:</h4>
              <ul className="list-disc space-y-2 pl-5">
                {result.upgradeTips.map((tip, i) => (
                  <li key={i} className="text-text-secondary">
                    {tip}
                  </li>
                ))}
              </ul>
            </div>
            <Button
              onClick={() => window.location.reload()}
              className="h-10 w-full rounded-2xl bg-black font-black uppercase text-white"
            >
              Начать заново
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const questions: Array<{ key: ParamKey; label: string; options: string[] }> = [
    {
      key: 'price_index',
      label: 'Ценовой уровень',
      options: ['Масс-маркет', 'Мидл', 'Премиум', 'Люкс'],
    },
    {
      key: 'materials_quality',
      label: 'Качество материалов',
      options: ['Базовые (синтетика)', 'Смесовые', 'Натуральные', 'Эксклюзивные'],
    },
    // More questions would be here in reality
  ];

  const currentQ = questions[step % questions.length];

  return (
    <div className="container max-w-2xl py-10">
      <Card className="overflow-hidden rounded-xl border-none bg-white shadow-2xl">
        <div className="bg-bg-surface2 h-2">
          <div
            className="h-full bg-black transition-all"
            style={{ width: `${((step + 1) / questions.length) * 100}%` }}
          />
        </div>
        <CardHeader className="p-3 pb-6">
          <span className="text-text-muted text-[10px] font-black uppercase tracking-widest">
            Вопрос {step + 1} из {questions.length}
          </span>
          <CardTitle className="mt-2 text-sm font-black uppercase">{currentQ.label}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 p-3 pt-0">
          {currentQ.options.map((opt, i) => (
            <Button
              key={i}
              variant="outline"
              className="h-12 w-full justify-start rounded-2xl px-6 text-sm font-bold transition-all hover:bg-black hover:text-white"
              onClick={() => {
                updateParam(currentQ.key, i / (currentQ.options.length - 1));
                if (step < questions.length - 1) nextStep();
                else calculateResult();
              }}
            >
              {opt}
            </Button>
          ))}
          <div className="flex gap-3 pt-6">
            {step > 0 && (
              <Button variant="ghost" onClick={prevStep} className="text-xs font-bold uppercase">
                Назад
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { UserPlus, ArrowLeft, Check, Building2, FileCheck, ShoppingCart } from 'lucide-react';
import { ROUTES } from '@/lib/routes';
import { RelatedModulesBlock } from '@/components/brand/RelatedModulesBlock';
import { getShopB2BHubLinks } from '@/lib/data/entity-links';

/** Онбординг партнёра (Zalando для РФ): пошаговый мастер подключения нового магазина — данные, верификация, первый заказ. */
const STEPS = [
  { id: 1, title: 'Данные компании', icon: Building2, desc: 'ИНН, название, юридический адрес' },
  { id: 2, title: 'Верификация', icon: FileCheck, desc: 'Проверка брендом, договор, ЭДО' },
  { id: 3, title: 'Первый заказ', icon: ShoppingCart, desc: 'Доступ к каталогу и матрице заказа' },
];

export default function PartnerOnboardingPage() {
  const [step, setStep] = useState(1);

  return (
    <div className="container max-w-2xl mx-auto px-4 py-6 pb-24">
      <div className="flex items-center gap-3 mb-6">
        <Link href={ROUTES.shop.b2b}><Button variant="ghost" size="icon"><ArrowLeft className="h-4 w-4" /></Button></Link>
        <div>
          <h1 className="text-2xl font-bold uppercase tracking-tight flex items-center gap-2"><UserPlus className="h-6 w-6" /> Онбординг партнёра</h1>
          <p className="text-slate-500 text-sm mt-0.5">Пошаговое подключение к бренду: компания → верификация → первый заказ. Для РФ: ИНН, ЭДО, маркировка.</p>
        </div>
      </div>

      <div className="flex gap-2 mb-6">
        {STEPS.map((s) => {
          const Icon = s.icon;
          return (
            <button
              key={s.id}
              onClick={() => setStep(s.id)}
              className={`flex-1 flex items-center gap-2 p-3 rounded-lg border text-left transition-colors ${
                step === s.id ? 'border-indigo-500 bg-indigo-50' : 'border-slate-200 hover:bg-slate-50'
              }`}
            >
              <div className={`h-8 w-8 rounded-lg flex items-center justify-center ${step === s.id ? 'bg-indigo-100' : 'bg-slate-100'}`}>
                <Icon className={`h-4 w-4 ${step === s.id ? 'text-indigo-600' : 'text-slate-500'}`} />
              </div>
              <div>
                <p className="text-xs font-medium">Шаг {s.id}</p>
                <p className="text-xs text-slate-500 truncate">{s.title}</p>
              </div>
            </button>
          );
        })}
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>{STEPS[step - 1].title}</CardTitle>
          <CardDescription>{STEPS[step - 1].desc}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {step === 1 && (
            <>
              <div className="space-y-2">
                <Label>Название организации</Label>
                <Input placeholder="ООО «Ритейл»" />
              </div>
              <div className="space-y-2">
                <Label>ИНН</Label>
                <Input placeholder="7707123456" />
              </div>
              <div className="space-y-2">
                <Label>Юридический адрес</Label>
                <Input placeholder="г. Москва, ул. Примерная, 1" />
              </div>
              <p className="text-xs text-slate-500">После отправки бренд проверит данные. Подключение ЭДО и маркировки — по запросу.</p>
            </>
          )}
          {step === 2 && (
            <>
              <div className="p-4 rounded-lg bg-slate-50 border border-slate-100">
                <p className="text-sm">Бренд проверит заявку и отправит договор. Подписание через ЭДО (Диадок, СБИС и др.). После подписания — доступ к каталогу.</p>
              </div>
              <Button variant="outline" size="sm" disabled>Ожидаем проверки</Button>
            </>
          )}
          {step === 3 && (
            <>
              <div className="p-4 rounded-lg bg-emerald-50 border border-emerald-100">
                <p className="text-sm flex items-center gap-2"><Check className="h-4 w-4 text-emerald-600" /> Доступ к шоуруму и матрице заказа открыт. Можете оформить первый заказ.</p>
              </div>
              <Button asChild><Link href={ROUTES.shop.b2bOrderMode}>Перейти к заказу</Link></Button>
            </>
          )}
          {step < 3 && step === 1 && (
            <Button onClick={() => setStep(2)}>Далее</Button>
          )}
        </CardContent>
      </Card>

      <div className="flex gap-2 mb-6">
        <Button variant="outline" size="sm" asChild><Link href={ROUTES.shop.b2bApply}>Подать заявку бренду</Link></Button>
        <Button variant="outline" size="sm" asChild><Link href={ROUTES.shop.b2bPartners}>Мои бренды</Link></Button>
      </div>
      <RelatedModulesBlock links={getShopB2BHubLinks()} title="Заявка, партнёры, заказы" className="mt-6" />
    </div>
  );
}

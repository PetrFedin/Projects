'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Check, Gift } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from './ui/badge';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Label } from './ui/label';

const initialShopPlans = [
  {
    name: 'Shop BASIC',
    price: 9900,
    priceSuffix: '/ мес.',
    description: 'Для бутиков и байеров, которые хотят получить доступ к эксклюзивным коллекциям.',
    features: [
      'Доступ к Market Room (до 3 брендов)',
      'Создание и управление заказами',
      'Стандартная поддержка',
    ],
    periods: [
      { label: '1 месяц', price: 9900 },
      { label: '6 месяцев', price: 53460, gift: '1 нед.' },
      { label: '1 год', price: 99000 },
    ],
    buttonText: 'Выбрать BASIC',
    buttonVariant: 'secondary',
  },
  {
    name: 'Shop+',
    price: 14000,
    priceSuffix: '/ мес.',
    badgeText: 'Популярный',
    description: 'Для растущих ритейлеров, заинтересованных в аналитике и расширении ассортимента.',
    features: [
      'Доступ к Market Room (до 10 брендов)',
      'Базовая аналитика по продажам',
      'AI-рекомендации по ассортименту',
      'Приоритетная поддержка',
    ],
    periods: [
      { label: '1 месяц', price: 14000 },
      { label: '6 месяцев', price: 75600, gift: '2 нед.' },
      { label: '1 год', price: 140000, gift: '1 мес.' },
    ],
    buttonText: 'Выбрать Shop+',
    buttonVariant: 'default',
  },
  {
    name: 'Shop PRO',
    price: 29000,
    priceSuffix: '/ мес.',
    description: 'Для сетей и ритейлеров, которым нужны расширенные инструменты и аналитика.',
    features: [
      'Все функции Shop+',
      'Доступ к Market Room (до 30 брендов)',
      'Расширенная аналитика (RFM, ABC)',
      'White-label витрина для клиентов',
      'Интеграция с ERP/складом (API)',
    ],
    periods: [
      { label: '1 месяц', price: 29000 },
      { label: '6 месяцев', price: 156600, gift: '3 нед.' },
      { label: '1 год', price: 290000, gift: '2 мес.' },
    ],
    buttonText: 'Выбрать PRO',
  },
  {
    name: 'Enterprise',
    price: 150000,
    priceSuffix: '/ мес.',
    description:
      'Для корпораций и холдингов с особыми требованиями к безопасности, интеграциям и поддержке.',
    features: [
      'Все функции PRO-тарифа',
      'Неограниченное число брендов',
      'Персональный менеджер',
      'Кастомные интеграции и отчеты',
      'Доступ к Data Insights и прогнозам',
    ],
    periods: [
      { label: '1 месяц', price: 150000 },
      { label: '6 месяцев', price: 810000, gift: '1 мес.' },
      { label: '1 год', price: 1500000, gift: '3 мес.' },
    ],
    buttonText: 'Связаться с нами',
  },
];

export default function ShopPricingPlans() {
  const [selectedPlan, setSelectedPlan] = useState<{ planName: string; price: number } | null>({
    planName: 'Shop+',
    price: 14000,
  });

  const handleSelection = (planName: string, price: number) => {
    setSelectedPlan({ planName, price });
  };

  return (
    <div className="text-center">
      <h2 className="font-headline text-base font-bold">Тарифы для магазинов</h2>
      <p className="mx-auto mt-2 max-w-2xl text-muted-foreground">
        Получите доступ к B2B-платформе для закупок, анализируйте данные и управляйте своим
        ассортиментом эффективно.
      </p>
      <div className="mt-12 grid grid-cols-1 items-start gap-3 md:grid-cols-2 lg:grid-cols-4">
        {initialShopPlans.map((plan) => {
          const currentPlanPrice =
            selectedPlan?.planName === plan.name ? selectedPlan.price : plan.price;
          const isSelectedPlan = selectedPlan?.planName === plan.name;

          return (
            <Card
              key={plan.name}
              className={cn(
                'relative flex h-full flex-col text-left transition-all',
                isSelectedPlan && plan.buttonVariant === 'default' && 'border-primary/50 shadow-xl'
              )}
            >
              {plan.badgeText && (
                <Badge
                  className="absolute -top-3 left-1/2 -translate-x-1/2"
                  variant={
                    isSelectedPlan && plan.buttonVariant === 'default' ? 'default' : 'secondary'
                  }
                >
                  {plan.badgeText}
                </Badge>
              )}
              <CardHeader>
                <CardTitle className="text-sm font-bold">{plan.name}</CardTitle>
                <div className="flex items-baseline gap-1">
                  <p className="whitespace-nowrap text-sm font-extrabold">
                    {typeof currentPlanPrice === 'number'
                      ? `${currentPlanPrice.toLocaleString('ru-RU')} ₽`
                      : currentPlanPrice}
                  </p>
                  {typeof currentPlanPrice === 'number' && plan.priceSuffix && (
                    <p className="self-end text-sm text-muted-foreground">
                      /{' '}
                      {plan.periods
                        ?.find((p) => p.price === currentPlanPrice)
                        ?.label.includes('год')
                        ? 'год'
                        : 'мес.'}
                    </p>
                  )}
                </div>
                <CardDescription>{plan.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex-1">
                {plan.periods && (
                  <RadioGroup
                    value={isSelectedPlan ? `${currentPlanPrice}` : ''}
                    className="mb-6 space-y-2"
                    onValueChange={(value) => handleSelection(plan.name, parseInt(value))}
                  >
                    {plan.periods.map((period) => {
                      const isChecked = isSelectedPlan && currentPlanPrice === period.price;
                      return (
                        <div key={period.price} className="relative">
                          {period.gift && (
                            <div
                              className={cn(
                                'absolute -top-2.5 left-1/2 flex -translate-x-1/2 items-center gap-1 rounded-full border bg-background px-2 py-0.5 text-xs font-semibold transition-colors',
                                isChecked && 'border-green-300 bg-green-100 text-green-800'
                              )}
                            >
                              <Gift className="h-3 w-3" /> + {period.gift}
                            </div>
                          )}
                          <Label
                            htmlFor={`period-${plan.name}-${period.price}`}
                            className={cn(
                              'flex w-full cursor-pointer items-center justify-between rounded-md border p-3 font-medium',
                              isChecked
                                ? 'border-primary/50 bg-secondary'
                                : 'bg-popover hover:bg-muted'
                            )}
                          >
                            <span className="text-left">{period.label}</span>
                            <div className="flex items-center gap-2">
                              <span className="whitespace-nowrap text-sm font-semibold">
                                {period.price.toLocaleString('ru-RU')} ₽
                              </span>
                              <RadioGroupItem
                                value={`${period.price}`}
                                id={`period-${plan.name}-${period.price}`}
                              />
                            </div>
                          </Label>
                        </div>
                      );
                    })}
                  </RadioGroup>
                )}

                <ul className="space-y-3 text-sm">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3">
                      <Check className="mt-0.5 h-5 w-5 flex-shrink-0 text-green-500" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button
                  className="w-full"
                  size="lg"
                  variant={(plan.buttonVariant as any) || 'outline'}
                >
                  {plan.buttonText}
                </Button>
              </CardFooter>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

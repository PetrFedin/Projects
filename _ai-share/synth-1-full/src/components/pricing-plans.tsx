'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Check, Gift } from 'lucide-react';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Label } from './ui/label';
import { cn } from '@/lib/utils';
import { Badge } from './ui/badge';
import { plans as allPlans } from '@/lib/loyalty-data';

export default function PricingPlans() {
  const [selectedPlan, setSelectedPlan] = useState<{ planName: string; price: number } | null>({
    planName: 'Comfort',
    price: 749,
  });

  const handleSelection = (planName: string, price: number) => {
    setSelectedPlan({ planName, price });
  };

  return (
    <div className="text-center">
      <h2 className="font-headline text-sm font-bold">Присоединяйтесь к нашему клубу</h2>
      <p className="mx-auto mt-2 max-w-2xl text-muted-foreground">
        Совершайте покупки с максимальной выгодой. Выберите план, который со временем окупит себя за
        счет бонусов, скидок и эксклюзивных предложений.
      </p>
      <div className="mt-12 grid grid-cols-1 items-start gap-3 lg:grid-cols-4">
        {allPlans.map((plan) => {
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
                <div className="flex items-baseline gap-1">
                  <p className="whitespace-nowrap text-sm font-extrabold">
                    {typeof currentPlanPrice === 'number'
                      ? `${currentPlanPrice > 0 ? currentPlanPrice.toLocaleString('ru-RU') : '0'} ₽`
                      : currentPlanPrice}
                  </p>
                  {plan.price > 0 && (
                    <span className="self-end text-sm text-muted-foreground">
                      /{' '}
                      {plan.periods
                        ?.find((p) => p.price === currentPlanPrice)
                        ?.label.includes('год')
                        ? 'год'
                        : 'мес.'}
                    </span>
                  )}
                </div>
                <CardTitle className="text-base font-bold">{plan.name}</CardTitle>
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
                  disabled={plan.disabled}
                >
                  {plan.buttonText || `Выбрать ${plan.name}`}
                </Button>
              </CardFooter>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

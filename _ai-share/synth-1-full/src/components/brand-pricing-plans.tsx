
'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Check, Gift } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "./ui/badge";
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Label } from './ui/label';

const initialBrandPlans = [
    {
        name: "Brand Basic",
        price: 0,
        priceSuffix: 'Для всех',
        description: "Начните продавать на Syntha и оцените базовые возможности платформы.",
        features: [
            "До 50 товаров (SKU)",
            "1 коллекция",
            "Базовая аналитика продаж",
            "Комиссия с продаж B2C: 15%",
            "Комиссия с продаж B2B: 5%",
        ],
        buttonText: "Начать бесплатно",
        buttonVariant: 'secondary',
        disabled: true,
    },
    {
        name: "Brand PRO",
        price: 35000,
        priceSuffix: '/ мес.',
        badgeText: "Популярный",
        description: "Расширенные инструменты для роста продаж, аналитики и маркетинга.",
        features: [
            "До 200 товаров (SKU)",
            "Неограниченное число коллекций",
            "Расширенная аналитика 360°",
            "AI-инструменты (генераторы, аналитика)",
            "Доступ к предзаказам (B2B)",
            "Комиссия с продаж B2C: 12%",
            "Комиссия с продаж B2B: 3.5%",
            "5 аккаунтов для команды"
        ],
        periods: [
            { label: '1 месяц', price: 35000 },
            { label: '6 месяцев', price: 189000, gift: '1 нед.' },
            { label: '1 год', price: 350000, gift: '1 мес.' },
        ],
        buttonText: "Выбрать PRO",
        buttonVariant: 'default',
    },
    {
        name: "Brand ELITE",
        price: 75000,
        priceSuffix: '/ мес.',
        description: "Максимальные возможности для крупных брендов и модных домов.",
        features: [
            "Все функции PRO-тарифа",
            "До 500 товаров (SKU)",
            "Персональный менеджер",
            "Приоритетный доступ к бета-функциям",
            "White-label витрина",
            "API-доступ и интеграции",
            "Комиссия с продаж B2C: 10%",
            "Комиссия с продаж B2B: 2%",
            "20 аккаунтов для команды"
        ],
        periods: [
            { label: '1 месяц', price: 75000 },
            { label: '6 месяцев', price: 405000, gift: '2 нед.' },
            { label: '1 год', price: 750000, gift: '2 мес.' },
        ],
        buttonText: "Выбрать ELITE",
    },
    {
        name: "Enterprise",
        price: 150000,
        priceSuffix: '/ мес.',
        description: "Для корпораций и холдингов с особыми требованиями к безопасности, интеграциям и поддержке.",
        features: [
            "Все функции ELITE-тарифа",
            "Неограниченные лимиты по SKU",
            "Выделенная команда поддержки (SLA)",
            "Кастомные AI-модели и интеграции",
            "Персональные условия по комиссиям",
            "Доступ к raw-data и BI-системам",
        ],
        periods: [
            { label: '1 месяц', price: 150000 },
            { label: '6 месяцев', price: 810000, gift: '3 нед.' },
            { label: '1 год', price: 1500000, gift: '3 мес.' },
        ],
        buttonText: "Связаться с нами",
    },
];

export default function BrandPricingPlans() {
    const [selectedPlan, setSelectedPlan] = useState<{planName: string, price: number} | null>({planName: 'Brand PRO', price: 35000});

    const handleSelection = (planName: string, price: number) => {
        setSelectedPlan({ planName, price });
    };

    return (
        <div className="text-center">
            <h2 className="font-headline text-base font-bold">Тарифы для брендов</h2>
            <p className="mt-2 max-w-2xl mx-auto text-muted-foreground">
                Выберите план, который соответствует масштабу вашего бизнеса и откройте доступ к мощным инструментам для роста.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 mt-12 items-start">
                {initialBrandPlans.map((plan) => {
                    const currentPlanPrice = selectedPlan?.planName === plan.name ? selectedPlan.price : plan.price;
                    const isSelectedPlan = selectedPlan?.planName === plan.name;
                    
                    return (
                    <Card key={plan.name} className={cn(
                        "flex flex-col text-left relative h-full transition-all",
                        isSelectedPlan && plan.buttonVariant === "default" && "border-primary/50 shadow-xl"
                    )}>
                        {plan.badgeText && (
                            <Badge className="absolute -top-3 left-1/2 -translate-x-1/2" variant={isSelectedPlan && plan.buttonVariant === 'default' ? 'default' : 'secondary'}>{plan.badgeText}</Badge>
                        )}
                        <CardHeader>
                            <CardTitle className="text-sm font-bold">{plan.name}</CardTitle>
                             <div className="flex items-baseline gap-1">
                                <p className="text-sm font-extrabold whitespace-nowrap">
                                     {typeof currentPlanPrice === 'number' ? `${currentPlanPrice > 0 ? currentPlanPrice.toLocaleString('ru-RU') : '0'} ₽` : currentPlanPrice}
                                </p>
                                {plan.price > 0 && <span className="text-muted-foreground text-sm self-end">/ {plan.periods?.find(p => p.price === currentPlanPrice)?.label.includes('год') ? 'год' : 'мес.'}</span>}
                            </div>
                            <CardDescription>{plan.description}</CardDescription>
                        </CardHeader>
                        <CardContent className="flex-1">
                             {plan.periods && (
                                <RadioGroup 
                                    value={isSelectedPlan ? `${currentPlanPrice}` : ''}
                                    className="space-y-2 mb-6"
                                    onValueChange={(value) => handleSelection(plan.name, parseInt(value))}
                                >
                                    {plan.periods.map(period => {
                                        const isChecked = isSelectedPlan && currentPlanPrice === period.price;
                                        return (
                                        <div key={period.price} className="relative">
                                            {period.gift && (
                                                <div className={cn(
                                                    "absolute -top-2.5 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-full text-xs font-semibold bg-background border flex items-center gap-1 transition-colors",
                                                    isChecked && "bg-green-100 text-green-800 border-green-300"
                                                )}>
                                                   <Gift className="h-3 w-3" /> + {period.gift}
                                                </div>
                                            )}
                                            <Label 
                                                htmlFor={`period-${plan.name}-${period.price}`} 
                                                className={cn("font-medium cursor-pointer flex items-center justify-between w-full rounded-md border p-3", isChecked ? 'bg-secondary border-primary/50' : 'bg-popover hover:bg-muted')}
                                            >
                                                <span className="text-left">{period.label}</span>
                                                <div className="flex items-center gap-2">
                                                    <span className="font-semibold text-sm whitespace-nowrap">{period.price.toLocaleString('ru-RU')} ₽</span>
                                                    <RadioGroupItem value={`${period.price}`} id={`period-${plan.name}-${period.price}`} />
                                                </div>
                                            </Label>
                                        </div>
                                    )})}
                                </RadioGroup>
                            )}

                            <ul className="space-y-3 text-sm">
                                {plan.features.map(feature => (
                                    <li key={feature} className="flex items-start gap-3">
                                        <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                                        <span>{feature}</span>
                                    </li>
                                ))}
                            </ul>
                        </CardContent>
                        <CardFooter>
                            <Button className="w-full" size="lg" variant={plan.buttonVariant as any || 'outline'} disabled={!!plan.disabled}>
                                {plan.buttonText}
                            </Button>
                        </CardFooter>
                    </Card>
                )})}
            </div>
        </div>
    )
}

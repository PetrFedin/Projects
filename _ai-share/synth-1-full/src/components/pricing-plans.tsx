
'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Check, Gift } from "lucide-react";
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Label } from './ui/label';
import { cn } from "@/lib/utils";
import { Badge } from "./ui/badge";
import { plans as allPlans } from "@/lib/loyalty-data";


export default function PricingPlans() {
    const [selectedPlan, setSelectedPlan] = useState<{planName: string, price: number} | null>({planName: 'Comfort', price: 749});

    const handleSelection = (planName: string, price: number) => {
        setSelectedPlan({ planName, price });
    };

    return (
        <div className="text-center">
            <h2 className="font-headline text-sm font-bold">Присоединяйтесь к нашему клубу</h2>
            <p className="mt-2 max-w-2xl mx-auto text-muted-foreground">
                Совершайте покупки с максимальной выгодой. Выберите план, который со временем окупит себя за счет бонусов, скидок и эксклюзивных предложений.
            </p>
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-3 mt-12 items-start">
                {allPlans.map((plan) => {
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
                             <div className="flex items-baseline gap-1">
                                <p className="text-sm font-extrabold whitespace-nowrap">
                                    {typeof currentPlanPrice === 'number' ? `${currentPlanPrice > 0 ? currentPlanPrice.toLocaleString('ru-RU') : '0'} ₽` : currentPlanPrice}
                                </p>
                                {plan.price > 0 && <span className="text-muted-foreground text-sm self-end">/ {(plan.periods?.find(p => p.price === currentPlanPrice)?.label.includes('год') ? 'год' : 'мес.')}</span>}
                            </div>
                            <CardTitle className="text-base font-bold">{plan.name}</CardTitle>
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
                            <Button className="w-full" size="lg" variant={plan.buttonVariant as any || 'outline'} disabled={plan.disabled}>
                                {plan.buttonText || `Выбрать ${plan.name}`}
                            </Button>
                        </CardFooter>
                    </Card>
                )})}
            </div>
        </div>
    )
}

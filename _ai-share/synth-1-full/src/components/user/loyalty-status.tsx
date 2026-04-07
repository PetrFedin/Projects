
'use client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Gem } from "lucide-react";

export function LoyaltyStatus() {
    const loyaltyData = {
        points: 850,
        level: 'Платиновый',
        nextLevelPoints: 1000,
    };
    const progress = (loyaltyData.points / loyaltyData.nextLevelPoints) * 100;

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Gem className="text-blue-500"/>
                    Карта лояльности
                </CardTitle>
                 <CardDescription>Ваш статус в программе лояльности Syntha.</CardDescription>
            </CardHeader>
            <CardContent className="text-center">
                 <p className="text-sm text-muted-foreground">Ваш баланс</p>
                 <p className="text-sm font-bold tracking-tighter">{loyaltyData.points.toLocaleString('ru-RU')}</p>
                 <p className="text-sm text-muted-foreground">бонусов</p>

                 <div className="text-left mt-6">
                    <div className="flex justify-between items-baseline mb-1">
                        <p className="text-sm font-semibold">{loyaltyData.level}</p>
                        <p className="text-xs text-muted-foreground">{loyaltyData.points}/{loyaltyData.nextLevelPoints}</p>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2.5">
                       <div className="bg-blue-500 h-2.5 rounded-full" style={{ width: `${progress}%` }}></div>
                    </div>
                     <p className="text-xs text-muted-foreground mt-1">Еще {loyaltyData.nextLevelPoints - loyaltyData.points} до следующего уровня</p>
                 </div>
                 <Button className="w-full mt-6">Как потратить бонусы</Button>
            </CardContent>
        </Card>
    );
}

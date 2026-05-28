'use client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Gem } from 'lucide-react';

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
          <Gem className="text-blue-500" />
          Карта лояльности
        </CardTitle>
        <CardDescription>Ваш статус в программе лояльности Syntha.</CardDescription>
      </CardHeader>
      <CardContent className="text-center">
        <p className="text-sm text-muted-foreground">Ваш баланс</p>
        <p className="text-sm font-bold tracking-tighter">
          {loyaltyData.points.toLocaleString('ru-RU')}
        </p>
        <p className="text-sm text-muted-foreground">бонусов</p>

        <div className="mt-6 text-left">
          <div className="mb-1 flex items-baseline justify-between">
            <p className="text-sm font-semibold">{loyaltyData.level}</p>
            <p className="text-xs text-muted-foreground">
              {loyaltyData.points}/{loyaltyData.nextLevelPoints}
            </p>
          </div>
          <div className="h-2.5 w-full rounded-full bg-muted">
            <div className="h-2.5 rounded-full bg-blue-500" style={{ width: `${progress}%` }}></div>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            Еще {loyaltyData.nextLevelPoints - loyaltyData.points} до следующего уровня
          </p>
        </div>
        <Button className="mt-6 w-full">Как потратить бонусы</Button>
      </CardContent>
    </Card>
  );
}

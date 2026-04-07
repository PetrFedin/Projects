'use client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Gem, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export function PersonalBonusWidget() {
    return (
        <Card className="bg-blue-50 border-blue-200 dark:bg-blue-950 dark:border-blue-800">
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-blue-800 dark:text-blue-300">
                    <Gem />
                    Ваши персональные бонусы
                </CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-sm">
                    Для вас действует <span className="font-bold">двойной кэшбэк</span> на все товары этого бренда!
                </p>
                <p className="text-muted-foreground text-sm mt-1">
                    Получайте до 20% от стоимости покупок обратно на ваш бонусный счет.
                </p>
                <Button asChild variant="link" className="px-0 pt-2 text-blue-700 dark:text-blue-300">
                    <Link href="/loyalty">Подробнее о программе <ArrowRight className="h-4 w-4 ml-1" /></Link>
                </Button>
            </CardContent>
        </Card>
    );
}

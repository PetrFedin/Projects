
'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Gem } from 'lucide-react';
import { cn } from '@/lib/utils';

const fullText = "Syntha — это не просто модная платформа. Это умный организм цифровой моды, где AI понимает вкус, AR показывает результат, а аналитика помогает бизнесу принимать решения.";

export function KeyIdeaCard() {
  return (
    <Card className="bg-accent/10 border-accent/30">
      <CardHeader>
        <CardTitle className="flex items-center gap-3">
          <Gem className="h-6 w-6 text-accent" />
          Ключевая идея
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm font-medium min-h-[110px]">
          {fullText}
        </p>
      </CardContent>
    </Card>
  );
}

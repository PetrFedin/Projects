'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Sparkles, Search } from 'lucide-react';
import { B2BModulePage } from '@/components/shop/B2BModulePage';
import Link from 'next/link';
import { ROUTES } from '@/lib/routes';

/** WizCommerce/Brandboom: AI-поиск и персонализированные рекомендации. */
export default function B2BAiSearchPage() {
  const [query, setQuery] = useState('');

  return (
    <B2BModulePage
      title="AI-поиск и рекомендации"
      description="Персонализация ассортимента и допродажи (WizCommerce, Brandboom)"
      moduleId="ai-recommendations"
      icon={Sparkles}
      phase={3}
    >
      <Card>
        <CardHeader>
          <CardTitle>AI-поиск</CardTitle>
          <CardDescription>Естественный запрос — найдём похожие стили, образы, допродажи.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Например: чёрный свитер oversize для весны"
              className="pl-9"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          <Button size="sm">Искать</Button>
          <Button variant="outline" size="sm" asChild>
            <Link href={ROUTES.shop.b2bSelectionBuilder}>Формирование селекции</Link>
          </Button>
        </CardContent>
      </Card>
    </B2BModulePage>
  );
}

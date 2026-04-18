'use client';

import * as React from 'react';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Heart, Trash2 } from 'lucide-react';
import { LookResultCard } from '@/components/ai/LookResultCard';
import type { Look } from '@/lib/ai-stylist';
import { RegistryPageShell } from '@/components/design-system';

const STORAGE_KEY = 'syntha_saved_looks';

export default function CollectionsPage() {
  const [looks, setLooks] = React.useState<Look[]>([]);

  React.useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      setLooks(stored ? JSON.parse(stored) : []);
    } catch {
      setLooks([]);
    }
  }, []);

  const removeLook = (id: string) => {
    setLooks((prev) => {
      const next = prev.filter((l) => l.id !== id);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  };

  const clearAll = () => {
    setLooks([]);
    localStorage.setItem(STORAGE_KEY, '[]');
  };

  return (
    <RegistryPageShell className="max-w-6xl pb-16">
      <div className="mb-8 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div>
            <h1 className="text-sm font-black uppercase tracking-tight">Мои образы</h1>
            <p className="text-text-secondary mt-1 text-sm">Сохранённые подборки из AI-стилиста</p>
          </div>
        </div>
        {looks.length > 0 && (
          <Button
            variant="outline"
            size="sm"
            onClick={clearAll}
            className="text-red-600 hover:text-red-700"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Очистить все
          </Button>
        )}
      </div>

      {looks.length === 0 ? (
        <Card className="border-border-default rounded-2xl border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-4 text-center">
            <Heart className="text-text-muted mb-4 h-12 w-12" />
            <h2 className="text-text-primary text-sm font-bold uppercase tracking-wider">
              Нет сохранённых образов
            </h2>
            <p className="text-text-secondary mt-2 max-w-sm text-sm">
              Сохраняйте образы из AI-стилиста кнопкой «Store_In_Collections» — они появятся здесь.
            </p>
            <Button asChild className="mt-6">
              <Link href="/#stylist">Перейти к AI-стилисту</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
          {looks.map((look) => (
            <div key={look.id} className="group relative">
              <button
                onClick={() => removeLook(look.id)}
                className="text-text-secondary absolute right-4 top-4 z-20 rounded-xl bg-white/90 p-2 opacity-0 shadow-md transition-opacity hover:bg-red-50 hover:text-red-500 group-hover:opacity-100"
                title="Удалить"
              >
                <Trash2 className="h-4 w-4" />
              </button>
              <LookResultCard look={look} wardrobe={[]} />
            </div>
          ))}
        </div>
      )}
    </RegistryPageShell>
  );
}

'use client';

import { useEffect, useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { totalFitVotes } from '@/lib/client/fit-feedback-local';
import { getFitFeedbackAggregate } from '@/lib/platform/fit-feedback.port';
import { ThumbsDown, ThumbsUp, MinusCircle } from 'lucide-react';
import Link from 'next/link';
import { ROUTES } from '@/lib/routes';

export type FitFeedbackVote = 'runs_small' | 'true_fit' | 'runs_large';

const storageKey = (productId: string) => `synth.fitFeedback.v1.${productId}`;

type Stored = { vote: FitFeedbackVote; sku: string; ts: number };

/** Агрегат демо (в проде — API по SKU) */
const DEMO_AGGREGATE = { small: 12, ok: 58, large: 8 };

type Props = {
  productId: string;
  sku: string;
  brand: string;
};

export function ProductFitFeedbackBlock({ productId, sku, brand }: Props) {
  const { toast } = useToast();
  const [vote, setVote] = useState<FitFeedbackVote | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(storageKey(productId));
      if (!raw) return;
      const p = JSON.parse(raw) as Stored;
      if (p?.vote) setVote(p.vote);
    } catch {
      /* noop */
    }
  }, [productId]);

  const save = (v: FitFeedbackVote) => {
    setVote(v);
    try {
      localStorage.setItem(storageKey(productId), JSON.stringify({ vote: v, sku, ts: Date.now() }));
    } catch {
      /* noop */
    }
    toast({
      title: 'Спасибо за отзыв о посадке',
      description: 'Данные учтём в рекомендациях размера для этого SKU и сетки бренда.',
    });
  };

  const aggregate = useMemo(() => getFitFeedbackAggregate(sku), [sku, vote]);
  const localTotal = totalFitVotes({
    runs_small: aggregate.runsSmall,
    true_fit: aggregate.trueFit,
    runs_large: aggregate.runsLarge,
  });
  const display = useMemo(() => {
    if (localTotal > 0) {
      return {
        small: aggregate.runsSmall,
        ok: aggregate.trueFit,
        large: aggregate.runsLarge,
        total: localTotal,
        source: 'local' as const,
      };
    }
    const t = DEMO_AGGREGATE.small + DEMO_AGGREGATE.ok + DEMO_AGGREGATE.large;
    return {
      small: DEMO_AGGREGATE.small,
      ok: DEMO_AGGREGATE.ok,
      large: DEMO_AGGREGATE.large,
      total: t,
      source: 'demo' as const,
    };
  }, [aggregate, localTotal]);

  const pct = (n: number) => Math.round((n / display.total) * 100);

  return (
    <Card className="mt-4 border-dashed bg-muted/20">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm">Посадка по отзывам</CardTitle>
        <CardDescription className="text-xs">
          Сеть бренда + мнения покупателей → меньше возвратов. Для B2B:{' '}
          <Link href={ROUTES.shop.b2bSizeFinder} className="underline underline-offset-2">
            подбор размера
          </Link>
          .
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex flex-wrap gap-3 text-[11px] text-muted-foreground">
          <span>
            Маломерит: <strong className="text-foreground">{pct(display.small)}%</strong>
          </span>
          <span>
            В размер: <strong className="text-foreground">{pct(display.ok)}%</strong>
          </span>
          <span>
            Большемерит: <strong className="text-foreground">{pct(display.large)}%</strong>
          </span>
        </div>
        {display.source === 'local' ? (
          <p className="text-[10px] text-muted-foreground">
            В этом браузере по SKU <span className="font-mono text-foreground">{sku}</span>:{' '}
            <strong>{display.total}</strong> голос(ов) из localStorage (все карточки с этим SKU).
          </p>
        ) : (
          <p className="text-[10px] text-muted-foreground">
            Показано демо-распределение; после голосования проценты считаются по вашим ответам для
            этого SKU.
          </p>
        )}
        <p className="text-[10px] text-muted-foreground">Ваш голос для {sku}:</p>
        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            size="sm"
            variant={vote === 'runs_small' ? 'default' : 'outline'}
            className={cn('h-8 gap-1 text-xs')}
            onClick={() => save('runs_small')}
          >
            <ThumbsDown className="h-3.5 w-3.5" />
            Маломерит
          </Button>
          <Button
            type="button"
            size="sm"
            variant={vote === 'true_fit' ? 'default' : 'outline'}
            className="h-8 gap-1 text-xs"
            onClick={() => save('true_fit')}
          >
            <MinusCircle className="h-3.5 w-3.5" />В размер
          </Button>
          <Button
            type="button"
            size="sm"
            variant={vote === 'runs_large' ? 'default' : 'outline'}
            className="h-8 gap-1 text-xs"
            onClick={() => save('runs_large')}
          >
            <ThumbsUp className="h-3.5 w-3.5" />
            Большемерит
          </Button>
        </div>
        <p className="text-[10px] text-muted-foreground">
          Бренд: <span className="font-medium text-foreground">{brand}</span> — в проде агрегаты
          стыкуются с AI-подбором размера и отзывами.
        </p>
      </CardContent>
    </Card>
  );
}

'use client';
import {
  isWorkshop2AiConfigured,
  canWorkshop2UseAiDemoFallback,
} from '@/lib/production/workshop2-ai-panel-utils';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, CheckCircle2, Loader2, Info } from 'lucide-react';
import type { AnalyzeDfmOutput } from '@/ai/flows/analyze-dfm-flow';
import { useToast } from '@/hooks/use-toast';

export function Workshop2DfmCheckPanel({
  articleDescription,
  photoUrl,
}: {
  articleDescription: string;
  photoUrl?: string;
}) {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalyzeDfmOutput | null>(null);
  const { toast } = useToast();

  const runCheck = async () => {
    if (!isWorkshop2AiConfigured()) {
      setResult(null);
      toast({
        title: 'DFM недоступен',
        description: 'Genkit не настроен — без silent pass в production.',
        variant: 'destructive',
      });
      return;
    }
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch('/api/brand/workshop2/ai/dfm-check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ articleDescription, photoUrl }),
      });
      if (!res.ok) {
        if (res.status === 503 || !canWorkshop2UseAiDemoFallback()) {
          setResult(null);
          throw new Error('Failed to run DFM check');
        }
      }
      setResult(await res.json());
    } catch {
      if (!canWorkshop2UseAiDemoFallback()) setResult(null);
      toast({
        title: 'Ошибка',
        description: 'Не удалось выполнить DFM анализ',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>DFM проверка</CardTitle>
        <CardDescription>Технологичность без silent pass при отсутствии Genkit.</CardDescription>
      </CardHeader>
      <CardContent>
        <Button onClick={() => void runCheck()} disabled={loading}>
          {loading ? '…' : 'Запустить DFM'}
        </Button>
        {result ? <p className="mt-2 text-xs">Сложность: {result.complexityLevel}</p> : null}
      </CardContent>
    </Card>
  );
}

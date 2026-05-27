'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, CheckCircle2, Loader2, Info } from 'lucide-react';
import type { AnalyzeDfmOutput, DfmIssue } from '@/lib/production/workshop2-analyze-dfm-types';
import { useToast } from '@/hooks/use-toast';

interface Workshop2DfmCheckPanelProps {
  articleDescription: string;
  photoUrl?: string;
}

export function Workshop2DfmCheckPanel({
  articleDescription,
  photoUrl,
}: Workshop2DfmCheckPanelProps) {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalyzeDfmOutput | null>(null);
  const { toast } = useToast();

  const runCheck = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/brand/workshop2/ai/dfm-check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ articleDescription, photoUrl }),
      });

      if (!res.ok) {
        throw new Error('Failed to run DFM check');
      }

      const data = await res.json();
      setResult(data);
      toast({
        title: 'DFM Анализ завершен',
        description: 'Результаты проверки технологичности обновлены.',
      });
    } catch (error) {
      console.error(error);
      toast({
        title: 'Ошибка',
        description: 'Не удалось выполнить DFM анализ',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const getComplexityBadge = (level: string) => {
    switch (level) {
      case 'simple':
        return <Badge className="bg-green-500">Простой</Badge>;
      case 'moderate':
        return <Badge className="bg-blue-500">Средний</Badge>;
      case 'complex':
        return <Badge className="bg-amber-500">Сложный</Badge>;
      case 'highly_complex':
        return <Badge className="bg-red-500">Очень сложный</Badge>;
      default:
        return <Badge>{level}</Badge>;
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical':
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case 'high':
        return <AlertTriangle className="h-4 w-4 text-amber-500" />;
      case 'medium':
        return <Info className="h-4 w-4 text-blue-500" />;
      case 'low':
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      default:
        return <Info className="h-4 w-4" />;
    }
  };

  return (
    <Card className="border-border-subtle bg-bg-surface">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-sm font-medium">AI DFM Анализ</CardTitle>
            <CardDescription className="text-xs">
              Проверка технологичности и сложности пошива
            </CardDescription>
          </div>
          <Button
            size="sm"
            variant="outline"
            onClick={runCheck}
            disabled={loading}
            className="h-8 text-xs"
          >
            {loading ? <Loader2 className="mr-2 h-3 w-3 animate-spin" /> : null}
            {result ? 'Обновить анализ' : 'Запустить DFM аудит'}
          </Button>
        </div>
      </CardHeader>

      {result && (
        <CardContent className="space-y-4 pt-0">
          <div className="flex items-center gap-2 text-sm">
            <span className="text-text-secondary">Уровень сложности:</span>
            {getComplexityBadge(result.complexityLevel)}
          </div>

          {result.issues.length > 0 ? (
            <div className="space-y-2">
              <h4 className="text-text-secondary text-xs font-medium uppercase">
                Обнаруженные риски
              </h4>
              <ul className="space-y-2">
                {result.issues.map((issue, idx) => (
                  <li
                    key={idx}
                    className="bg-bg-surface2 border-border-subtle rounded-md border p-3 text-sm"
                  >
                    <div className="flex items-start gap-2">
                      <div className="mt-0.5">{getSeverityIcon(issue.severity)}</div>
                      <div>
                        <p className="font-medium">{issue.title}</p>
                        <p className="text-text-secondary mt-1 text-xs">{issue.description}</p>
                        {issue.recommendation && (
                          <p className="text-accent-primary mt-2 text-xs font-medium">
                            Рекомендация:{' '}
                            <span className="font-normal">{issue.recommendation}</span>
                          </p>
                        )}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <div className="flex items-center gap-2 rounded-md border border-green-100 bg-green-50/50 p-3 text-sm text-green-700">
              <CheckCircle2 className="h-4 w-4" />
              <p>Проблем с технологичностью не обнаружено.</p>
            </div>
          )}
        </CardContent>
      )}
    </Card>
  );
}

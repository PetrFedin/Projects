'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, Sparkles, Factory } from 'lucide-react';
import type { MatchContractorsOutput } from '@/lib/production/workshop2-match-contractors-types';
import type {
  Workshop2SewingContractorsPayload,
  SewingPlanPartnerRow,
} from '@/lib/production/workshop2-sewing-plan-reference-types';
import { useToast } from '@/hooks/use-toast';

interface Workshop2ContractorMatchmakerProps {
  articleDescription: string;
}

export function Workshop2ContractorMatchmaker({
  articleDescription,
}: Workshop2ContractorMatchmakerProps) {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<MatchContractorsOutput | null>(null);
  const [contractors, setContractors] = useState<SewingPlanPartnerRow[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    fetch('/api/brand/sewing-contractors')
      .then((res) => res.json())
      .then((payload: unknown) => {
        const data = payload as Workshop2SewingContractorsPayload;
        if (data?.partners) {
          setContractors(data.partners);
        }
      })
      .catch((err) => console.error('Failed to fetch contractors', err));
  }, []);

  const runMatchmaker = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/brand/workshop2/ai/match-contractors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ articleDescription }),
      });

      if (!res.ok) {
        throw new Error('Failed to run matchmaker');
      }

      const data = (await res.json()) as MatchContractorsOutput;
      setResult(data);
      toast({ title: 'Анализ завершен', description: 'Подобраны рекомендации подрядчиков.' });
    } catch (error) {
      console.error(error);
      toast({
        title: 'Ошибка',
        description: 'Не удалось подобрать подрядчиков',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const getContractorDetails = (id: string) => {
    return contractors.find((c) => c.id === id);
  };

  return (
    <Card className="border-border-subtle bg-bg-surface">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2 text-sm font-medium">
              <Sparkles className="text-accent-primary h-4 w-4" />
              AI Подбор подрядчика
            </CardTitle>
            <CardDescription className="text-xs">
              Рекомендации на основе требований и оборудования
            </CardDescription>
          </div>
          <Button
            size="sm"
            variant="outline"
            onClick={runMatchmaker}
            disabled={loading}
            className="h-8 text-xs"
          >
            {loading ? <Loader2 className="mr-2 h-3 w-3 animate-spin" /> : null}
            {result ? 'Обновить подбор' : 'Подобрать подрядчиков'}
          </Button>
        </div>
      </CardHeader>

      {result && (
        <CardContent className="space-y-3 pt-0">
          {result.matches.map((match, idx) => {
            const contractor = getContractorDetails(match.contractorId);
            return (
              <div
                key={idx}
                className="bg-bg-surface2 border-border-subtle rounded-md border p-3 text-sm"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Factory className="text-text-muted h-4 w-4" />
                    <p className="font-semibold">{contractor?.label || match.contractorId}</p>
                  </div>
                  <Badge
                    variant={match.score >= 80 ? 'default' : 'secondary'}
                    className={match.score >= 80 ? 'bg-green-500' : ''}
                  >
                    {match.score}% совпадение
                  </Badge>
                </div>

                <p className="text-text-secondary mt-2 text-xs leading-relaxed">
                  {match.rationale}
                </p>

                {contractor?.capabilities && (
                  <div className="mt-3 flex flex-wrap gap-1">
                    {contractor.capabilities.map((cap) => (
                      <Badge key={cap} variant="outline" className="h-4 px-1 text-[9px]">
                        {cap}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </CardContent>
      )}
    </Card>
  );
}

'use client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Gem, Rocket, TrendingUp } from 'lucide-react';
<<<<<<< HEAD
=======
import { AcronymWithTooltip } from '@/components/ui/acronym-with-tooltip';
>>>>>>> recover/cabinet-wip-from-stash

const metrics = {
  clv: 128500,
  rfm: {
    recency: 5,
    frequency: 8,
    monetary: 9,
    segment: 'Лояльные чемпионы',
    segmentColor: 'bg-primary',
  },
  loyaltyScore: 850,
  influenceScore: 75,
};

export function KeyMetrics() {
  return (
    <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center justify-between text-sm font-medium">
<<<<<<< HEAD
            <span>CLV</span>
=======
            <span>
              <AcronymWithTooltip abbr="CLV" className="no-underline" />
            </span>
>>>>>>> recover/cabinet-wip-from-stash
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm font-bold">{metrics.clv.toLocaleString('ru-RU')} ₽</div>
          <p className="text-xs text-muted-foreground">+15% прогнозируемый рост</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-2">
<<<<<<< HEAD
          <CardTitle className="text-sm font-medium">RFM Сегмент</CardTitle>
=======
          <CardTitle className="text-sm font-medium">
            <AcronymWithTooltip abbr="RFM" /> сегмент
          </CardTitle>
>>>>>>> recover/cabinet-wip-from-stash
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2">
            <div className="text-sm font-bold">{metrics.rfm.segment}</div>
          </div>
          <Badge className={`${metrics.rfm.segmentColor} mt-1 text-primary-foreground`}>
            R{metrics.rfm.recency} F{metrics.rfm.frequency} M{metrics.rfm.monetary}
          </Badge>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Loyalty Score</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2">
            <Gem className="h-8 w-8 text-blue-500" />
            <div className="text-sm font-bold">{metrics.loyaltyScore}</div>
          </div>
          <p className="text-xs text-muted-foreground">Платиновый уровень</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Influence Score</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2">
            <Rocket className="h-8 w-8 text-amber-500" />
            <div className="text-sm font-bold">{metrics.influenceScore}</div>
          </div>
          <p className="text-xs text-muted-foreground">Высокий потенциал влияния</p>
        </CardContent>
      </Card>
    </div>
  );
}

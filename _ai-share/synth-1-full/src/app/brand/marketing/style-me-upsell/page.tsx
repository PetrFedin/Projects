'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MessageSquare, ArrowLeft, Send } from 'lucide-react';
import { SectionInfoCard } from '@/components/brand/production/ProductionSectionEnhancements';
import { StyleMeUpsellBadges } from '@/components/brand/SectionBadgeCta';
import { getStyleMeUpsellLinks } from '@/lib/data/entity-links';
import { RelatedModulesBlock } from '@/components/brand/RelatedModulesBlock';
import { listCampaigns, type StyleMeCampaign } from '@/lib/marketing/style-me-upsell';

const statusLabels: Record<StyleMeCampaign['status'], string> = {
  draft: 'Черновик',
  active: 'Активна',
  paused: 'Приостановлена',
  archived: 'Архив',
};

export default function StyleMeUpsellPage() {
  const [campaigns, setCampaigns] = useState<StyleMeCampaign[]>([]);

  useEffect(() => {
    listCampaigns().then(setCampaigns);
  }, []);

  return (
    <div className="container mx-auto max-w-5xl space-y-6 px-4 py-6 pb-24">
      <SectionInfoCard
        title="Post-Purchase Style-Me Upsell"
        description="Персональные подборки в мессенджер через 2 дня после покупки. Связь с CRM, заказами и контентом. При API — триггер по событию заказа + шаблоны подборок."
        icon={MessageSquare}
        iconBg="bg-violet-100"
        iconColor="text-violet-600"
        badges={<StyleMeUpsellBadges />}
      />
      <div className="flex items-center gap-3">
        <Link href="/brand/kickstarter">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-2xl font-bold uppercase">Style-Me Upsell</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Send className="h-5 w-5" /> Кампании подборок
          </CardTitle>
          <CardDescription>
            Отправка персональных подборок в Telegram / WhatsApp через N дней после покупки.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3">
            {campaigns.map((c) => (
              <li
                key={c.id}
                className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-100 bg-slate-50 p-3"
              >
                <div>
                  <p className="font-medium">{c.name}</p>
                  <p className="text-xs text-slate-500">
                    Через {c.daysAfterPurchase} дн. · {c.channel}
                  </p>
                </div>
                <Badge
                  variant={c.status === 'active' ? 'default' : 'outline'}
                  className="text-[10px]"
                >
                  {statusLabels[c.status]}
                </Badge>
              </li>
            ))}
          </ul>
          <p className="mt-3 text-xs text-slate-400">
            API: STYLE_ME_UPSELL_API — кампании, триггер по заказу, шаблоны.
          </p>
        </CardContent>
      </Card>
      <RelatedModulesBlock links={getStyleMeUpsellLinks()} title="CRM, заказы, контент" />
    </div>
  );
}

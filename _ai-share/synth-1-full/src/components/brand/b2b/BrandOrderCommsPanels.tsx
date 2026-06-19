'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { buildBrandOrderCommsSession } from '@/lib/b2b/brand-order-comms';
import { PILLAR_CAPABILITY_FEATURE_PARAM } from '@/lib/platform/pillar-capability-workspaces';
import { Factory, MessageSquare } from 'lucide-react';

type Props = {
  orderId: string;
  collectionId?: string;
};

export function BrandOrderCommsChatPanel({ orderId, collectionId }: Props) {
  const session = buildBrandOrderCommsSession({ orderId, collectionId });

  return (
    <div className="space-y-4" data-testid="brand-order-comms-chat-panel">
      <Card>
        <CardHeader className="pb-2">
          <div className="flex flex-wrap items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            <CardTitle className="text-base">Order chat</CardTitle>
          </div>
          <CardDescription>Столп 5 · messages + entity threads в контексте {orderId}.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          <Button size="sm" asChild>
            <Link href={session.messagesHref} data-testid="brand-order-comms-messages-link">
              Open messages
            </Link>
          </Button>
          <Button size="sm" variant="outline" asChild>
            <Link
              href={`${session.messagesHref}&${PILLAR_CAPABILITY_FEATURE_PARAM}=entities`}
              data-testid="brand-order-comms-entities-link"
            >
              Entity threads
            </Link>
          </Button>
          <Button size="sm" variant="outline" asChild>
            <Link href={session.calendarHref}>Order calendar</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

export function BrandOrderCommsHandoffPanel({ orderId, collectionId }: Props) {
  const session = buildBrandOrderCommsSession({ orderId, collectionId });

  return (
    <div className="space-y-4" data-testid="brand-order-comms-handoff-panel">
      <Card>
        <CardHeader className="pb-2">
          <div className="flex flex-wrap items-center gap-2">
            <Factory className="h-4 w-4" />
            <CardTitle className="text-base">Production handoff</CardTitle>
          </div>
          <CardDescription>Столп 4 · brand ops → factory queue → shop tracking.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          <Button size="sm" asChild>
            <Link href={session.productionOpsHref} data-testid="brand-order-comms-prod-ops-link">
              Brand handoff tab
            </Link>
          </Button>
          <Button size="sm" variant="outline" asChild>
            <Link href={session.w2SupplyHref}>W2 supply</Link>
          </Button>
          <Button size="sm" variant="ghost" asChild>
            <Link href={session.shopCollaborativeApprovalsHref}>Shop approvals</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

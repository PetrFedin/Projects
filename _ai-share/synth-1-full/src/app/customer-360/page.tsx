'use client';

import { CabinetPageContent } from '@/components/layout/cabinet-page-content';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import {
  KeyMetrics,
  CustomerProfileCard,
  BehaviorCharts,
  ActivityFeed,
} from '@/components/customer-360';

export default function Customer360Page() {
  return (
    <CabinetPageContent maxWidth="6xl" className="space-y-4 py-4">
      <header className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div className="flex items-center gap-3">
          <Avatar className="h-12 w-12 border" data-ai-hint="person face">
            <AvatarImage src="https://picsum.photos/seed/user-avatar/100/100" />
            <AvatarFallback>АН</AvatarFallback>
          </Avatar>
          <div>
            <h1 className="font-headline text-base font-bold">Анна Новикова</h1>
            <p className="text-muted-foreground">
              customer.id: <span className="font-mono">usr_12345abcde</span>
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Badge variant="secondary">Профиль 360°</Badge>
          <Badge variant="destructive">Риск оттока: Низкий</Badge>
        </div>
      </header>

      <KeyMetrics />

      <CustomerProfileCard />

      <BehaviorCharts />

      <ActivityFeed />
    </CabinetPageContent>
  );
}

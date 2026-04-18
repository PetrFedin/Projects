'use client';

import MessagesOS from '@/components/user/messages-os';
import { RegistryPageShell } from '@/components/design-system';

export default function ShopMessagesPage() {
  return (
    <RegistryPageShell className="space-y-4">
      <MessagesOS />
    </RegistryPageShell>
  );
}

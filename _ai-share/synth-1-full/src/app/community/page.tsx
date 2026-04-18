'use client';

import { Masonry } from '@/components/ui/masonry';
import LookCard from '@/components/look-card';
import { looks } from '@/lib/looks';
import { useUIState } from '@/providers/ui-state';
import { B2BNetworkingHub } from '@/components/distributor/networking-hub';
<<<<<<< HEAD
=======
import { RegistryPageShell } from '@/components/design-system';
>>>>>>> recover/cabinet-wip-from-stash

export default function CommunityPage() {
  const { viewRole } = useUIState();

  if (viewRole === 'b2b') {
    return (
<<<<<<< HEAD
      <div className="container mx-auto space-y-6 px-4 py-12 duration-300 animate-in fade-in">
        <header className="mb-12 space-y-2 text-center">
          <h1 className="text-sm font-black uppercase tracking-tighter text-slate-900 md:text-sm">
            B2B Networking
          </h1>
          <p className="mx-auto max-w-2xl text-sm font-medium italic text-slate-400">
=======
      <RegistryPageShell className="space-y-6 py-12 pb-16 duration-300 animate-in fade-in">
        <header className="mb-12 space-y-2 text-center">
          <h1 className="text-text-primary text-sm font-black uppercase tracking-tighter md:text-sm">
            B2B Networking
          </h1>
          <p className="text-text-muted mx-auto max-w-2xl text-sm font-medium italic">
>>>>>>> recover/cabinet-wip-from-stash
            Экосистема профессиональных связей, коллабораций и обмена инсайтами индустрии.
          </p>
        </header>
        <B2BNetworkingHub />
<<<<<<< HEAD
      </div>
=======
      </RegistryPageShell>
>>>>>>> recover/cabinet-wip-from-stash
    );
  }

  return (
<<<<<<< HEAD
    <div className="container mx-auto px-4 py-4">
=======
    <RegistryPageShell className="pb-16">
>>>>>>> recover/cabinet-wip-from-stash
      <header className="mb-8 text-center">
        <h1 className="font-headline text-sm font-bold md:text-sm">Лента сообщества</h1>
        <p className="mx-auto mt-2 max-w-2xl text-sm text-muted-foreground">
          Вдохновляйтесь образами, созданными такими же ценителями моды, как и вы.
        </p>
      </header>
      <Masonry items={looks} columnGutter={24} columnWidth={300} render={LookCard} />
<<<<<<< HEAD
    </div>
=======
    </RegistryPageShell>
>>>>>>> recover/cabinet-wip-from-stash
  );
}

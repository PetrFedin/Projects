
'use client';

import { Masonry } from "@/components/ui/masonry";
import LookCard from "@/components/look-card";
import { looks } from "@/lib/looks";
import { useUIState } from "@/providers/ui-state";
import { B2BNetworkingHub } from "@/components/distributor/networking-hub";

export default function CommunityPage() {
    const { viewRole } = useUIState();

    if (viewRole === 'b2b') {
        return (
            <div className="container mx-auto px-4 py-12 space-y-6 animate-in fade-in duration-300">
                <header className="mb-12 text-center space-y-2">
                    <h1 className="text-sm md:text-sm font-black uppercase tracking-tighter text-slate-900">B2B Networking</h1>
                    <p className="text-slate-400 font-medium max-w-2xl mx-auto text-sm italic">
                        Экосистема профессиональных связей, коллабораций и обмена инсайтами индустрии.
                    </p>
                </header>
                <B2BNetworkingHub />
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-4">
            <header className="mb-8 text-center">
                <h1 className="text-sm md:text-sm font-headline font-bold">Лента сообщества</h1>
                <p className="mt-2 text-sm text-muted-foreground max-w-2xl mx-auto">
                    Вдохновляйтесь образами, созданными такими же ценителями моды, как и вы.
                </p>
            </header>
            <Masonry
                items={looks}
                columnGutter={24}
                columnWidth={300}
                render={LookCard}
            />
        </div>
    );
}

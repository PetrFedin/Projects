
'use client';

import { usePathname } from 'next/navigation';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { b2bNavLinks } from '@/lib/data/shop-navigation';
import { PlusCircle } from 'lucide-react';

export default function B2BLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const router = useRouter();

    const getCurrentTab = () => {
        // Find the most specific match first by sorting by href length descending
        const sortedLinks = [...b2bNavLinks].sort((a, b) => b.href.length - a.href.length);
        const currentBase = sortedLinks.find(link => pathname.startsWith(link.href));
        
        // Specific case for create-order to highlight the matrix tab
        if(pathname.startsWith('/shop/b2b/create-order')) return 'matrix';

        return currentBase?.value || 'showroom';
    };

    const handleTabChange = (value: string) => {
        const link = b2bNavLinks.find(l => l.value === value);
        if (link) {
            router.push(link.href);
        }
    };
    
    return (
        <div className="space-y-4">
             <header className="flex justify-between items-center">
                <div>
                    <h2 className="text-sm font-bold">B2B Хаб</h2>
                    <p className="text-muted-foreground">Управление закупками, анализ брендов и планирование бюджета.</p>
                </div>
                <Button asChild>
                    <Link href="/shop/b2b/create-order">
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Новый заказ
                    </Link>
                </Button>
            </header>
             <Tabs value={getCurrentTab()} onValueChange={handleTabChange} className="w-full">
                 <ScrollArea className="w-full whitespace-nowrap">
                    <TabsList className="inline-flex w-auto">
                        {b2bNavLinks.map(link => (
                            <TabsTrigger key={link.value} value={link.value}>
                                <link.icon className="mr-2 h-4 w-4" />
                                {link.label}
                            </TabsTrigger>
                        ))}
                    </TabsList>
                    <ScrollBar orientation="horizontal" />
                </ScrollArea>
            </Tabs>
             <div>
                {children}
             </div>
        </div>
    );
}

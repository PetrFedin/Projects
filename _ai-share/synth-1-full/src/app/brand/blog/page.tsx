'use client';

import Link from 'next/link';
import BlogManagementPro from '@/components/brand/blog/BlogManagementPro';
import { SectionInfoCard } from '@/components/brand/production/ProductionSectionEnhancements';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { FileText, Megaphone, Package } from 'lucide-react';

export default function BrandBlogPage() {
    return (
        <div className="space-y-4">
            <SectionInfoCard
                title="Блог"
                description="Публикации, редакция, контент. Связь с Media (DAM), Marketing и Products."
                icon={FileText}
                iconBg="bg-slate-100"
                iconColor="text-slate-600"
                badges={<><Badge variant="outline" className="text-[9px]">Media</Badge><Badge variant="outline" className="text-[9px]">Marketing</Badge><Button variant="outline" size="sm" className="text-[9px] h-7 ml-1" asChild><Link href="/brand/media">Media</Link></Button><Button variant="outline" size="sm" className="text-[9px] h-7" asChild><Link href="/brand/marketing/samples"><Megaphone className="h-3 w-3 mr-1" /> PR Samples</Link></Button></>}
            />
            <BlogManagementPro />
        </div>
    );
}

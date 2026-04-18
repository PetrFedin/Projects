'use client';

import Link from 'next/link';
import BlogManagementPro from '@/components/brand/blog/BlogManagementPro';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { FileText, Megaphone } from 'lucide-react';
import { RegistryPageHeader, RegistryPageShell } from '@/components/design-system';
import { ROUTES } from '@/lib/routes';

export default function BrandBlogPage() {
  return (
<<<<<<< HEAD
    <div className="space-y-4">
      <SectionInfoCard
        title="Блог"
        description="Публикации, редакция, контент. Связь с Media (DAM), Marketing и Products."
        icon={FileText}
        iconBg="bg-slate-100"
        iconColor="text-slate-600"
        badges={
          <>
=======
    <RegistryPageShell className="w-full max-w-none space-y-4 pb-16">
      <RegistryPageHeader
        title="Блог"
        leadPlain="Публикации, редакция, контент. Связь с Media (DAM), Marketing и Products."
        actions={
          <div className="flex flex-wrap items-center justify-end gap-2">
            <FileText className="size-6 shrink-0 text-muted-foreground" aria-hidden />
>>>>>>> recover/cabinet-wip-from-stash
            <Badge variant="outline" className="text-[9px]">
              Media
            </Badge>
            <Badge variant="outline" className="text-[9px]">
              Marketing
            </Badge>
<<<<<<< HEAD
            <Button variant="outline" size="sm" className="ml-1 h-7 text-[9px]" asChild>
              <Link href="/brand/media">Media</Link>
            </Button>
            <Button variant="outline" size="sm" className="h-7 text-[9px]" asChild>
              <Link href="/brand/marketing/samples">
                <Megaphone className="mr-1 h-3 w-3" /> PR Samples
              </Link>
            </Button>
          </>
        }
      />
      <BlogManagementPro />
    </div>
=======
            <Button variant="outline" size="sm" className="h-7 text-[9px]" asChild>
              <Link href={ROUTES.brand.media}>Media</Link>
            </Button>
            <Button variant="outline" size="sm" className="h-7 text-[9px]" asChild>
              <Link href={ROUTES.brand.marketingSamples}>
                <Megaphone className="mr-1 size-3" /> PR Samples
              </Link>
            </Button>
          </div>
        }
      />
      <BlogManagementPro />
    </RegistryPageShell>
>>>>>>> recover/cabinet-wip-from-stash
  );
}

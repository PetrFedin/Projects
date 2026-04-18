'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { Product } from '@/lib/types';
import { generateSyndicatedContent, CHANNEL_LABELS } from '@/lib/fashion/content-syndication';
import { Share2, Copy, Wand2, Check } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { cabinetSurface } from '@/lib/ui/cabinet-surface';

type Props = { product: Product };

export function ProductContentSyndicationBlock({ product }: Props) {
  const { toast } = useToast();
  const content = generateSyndicatedContent(product);
  const [copied, setCopied] = useState<string | null>(null);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    toast({ title: 'Скопировано', description: 'Текст готов к публикации.' });
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <Card className="border-accent-primary/20 bg-accent-primary/10 mt-4">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-sm">
          <Wand2 className="text-accent-primary h-4 w-4" />
          AI Content Syndication
        </CardTitle>
        <CardDescription className="text-xs">
          Авто-генерация описаний для маркетплейсов и соцсетей.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="wb">
          {/* cabinetSurface v1 */}
          <TabsList className={cn(cabinetSurface.tabsList, 'h-auto min-h-8 flex-wrap p-0.5')}>
            {content.map((c) => (
              <TabsTrigger
                key={c.channel}
                value={c.channel}
                className={cn(cabinetSurface.tabsTrigger, 'h-7 px-2 text-[10px] font-semibold')}
              >
                {c.channel.toUpperCase()}
              </TabsTrigger>
            ))}
          </TabsList>
          {content.map((c) => (
            <TabsContent key={c.channel} value={c.channel} className="mt-2 space-y-3">
              <div className="group relative rounded border bg-background p-3">
                <p className="mb-1 text-[11px] font-bold">{c.title}</p>
                <p className="line-clamp-3 text-[11px] leading-relaxed text-muted-foreground">
                  {c.description}
                </p>
                <Button
                  size="icon"
                  variant="ghost"
                  className="absolute right-2 top-2 h-6 w-6 opacity-0 transition-opacity group-hover:opacity-100"
                  onClick={() => handleCopy(`${c.title}\n\n${c.description}`, c.channel)}
                >
                  {copied === c.channel ? (
                    <Check className="h-3 w-3 text-emerald-600" />
                  ) : (
                    <Copy className="h-3 w-3" />
                  )}
                </Button>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {c.keyFeatures.map((f, i) => (
                  <span
                    key={i}
                    className="bg-accent-primary/15 text-accent-primary border-accent-primary/25 rounded-full border px-1.5 py-0.5 text-[9px]"
                  >
                    {f}
                  </span>
                ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
}

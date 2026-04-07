'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { Product } from '@/lib/types';
import { generateSyndicatedContent, CHANNEL_LABELS } from '@/lib/fashion/content-syndication';
import { Share2, Copy, Wand2, Check } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

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
    <Card className="mt-4 border-violet-500/20 bg-violet-50/10">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm flex items-center gap-2">
          <Wand2 className="h-4 w-4 text-violet-600" />
          AI Content Syndication
        </CardTitle>
        <CardDescription className="text-xs">
          Авто-генерация описаний для маркетплейсов и соцсетей.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="wb">
          <TabsList className="h-8 p-1 flex-wrap">
            {content.map(c => (
              <TabsTrigger key={c.channel} value={c.channel} className="text-[10px] px-2">
                {c.channel.toUpperCase()}
              </TabsTrigger>
            ))}
          </TabsList>
          {content.map(c => (
            <TabsContent key={c.channel} value={c.channel} className="space-y-3 mt-2">
              <div className="p-3 rounded border bg-background relative group">
                <p className="text-[11px] font-bold mb-1">{c.title}</p>
                <p className="text-[11px] text-muted-foreground leading-relaxed line-clamp-3">{c.description}</p>
                <Button 
                  size="icon" 
                  variant="ghost" 
                  className="h-6 w-6 absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => handleCopy(`${c.title}\n\n${c.description}`, c.channel)}
                >
                  {copied === c.channel ? <Check className="h-3 w-3 text-emerald-600" /> : <Copy className="h-3 w-3" />}
                </Button>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {c.keyFeatures.map((f, i) => (
                  <span key={i} className="text-[9px] px-1.5 py-0.5 rounded-full bg-violet-100 text-violet-700 border border-violet-200">
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

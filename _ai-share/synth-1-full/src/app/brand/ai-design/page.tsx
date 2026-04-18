'use client';

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Sparkles,
  BrainCircuit,
  Image as ImageIcon,
  Zap,
  Plus,
  History,
  ChevronRight,
  CheckCircle2,
  Download,
  Layers,
  Scissors,
  Search,
  Trash2,
  Heart,
  Wand2,
  Settings2,
  Palette,
  ArrowRight,
  Scan,
} from 'lucide-react';
import { DesignPrompt, DesignIteration } from '@/lib/types/ai-design';
import { cn } from '@/lib/utils';
import { cabinetSurface } from '@/lib/ui/cabinet-surface';
import { Input } from '@/components/ui/input';
import { designVariantsClient } from '@/lib/ai-client/api';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RegistryPageHeader, RegistryPageShell } from '@/components/design-system';

const AiToolsContent = dynamic(() => import('@/app/brand/ai-tools/page'), { ssr: false });
const BodyScannerContent = dynamic(
  () => import('@/app/brand/ai-design/body-scanner/page').then((m) => m.default),
  { ssr: false, loading: () => <div className="text-text-muted p-8 text-center">Загрузка...</div> }
);

/**
 * AI Design Assistant — Brand OS
 * Генерация вариантов дизайна по текстовому описанию и создание техпакетов.
 */

export default function AIDesignAssistantPage() {
  const [tab, setTab] = useState('design');
  const [prompt, setPrompt] = useState(
    'Oversized evening dress in midnight blue silk with floral embroidery at the hem.'
  );
  const [isGenerating, setIsGenerating] = useState(false);
  const [iterations, setIterations] = useState<DesignIteration[]>([
    {
      id: 'i-1',
      promptId: 'p-1',
      imageUrl: '/ai/mock-1.jpg',
      createdAt: '2026-03-05T10:00:00Z',
      aiModel: 'Synth-Vision-Gen 2.0',
      parameters: { denoising: 0.75 },
      isFavorite: true,
      technicalSpecs: {
        suggestedFabric: 'Silk Satin',
        complexityScore: 8,
        estimatedCmtCost: 35,
      },
    },
  ]);

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      const results = await designVariantsClient({
        brandId: 'brand-123',
        prompt: {
          id: 'p-new',
          text: prompt,
          category: 'Dresses',
          styleTags: ['Oversized'],
          colorPalette: ['#000080'],
        },
        count: 4,
      });
      setIterations((prev) => [...results, ...prev]);
    } catch (err) {
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <RegistryPageShell className="w-full max-w-none space-y-4 py-1 pb-16">
      <RegistryPageHeader
        title="AI Design"
        leadPlain="Генерация вариантов дизайна по текстовому описанию и создание техпакетов."
      />
      <Tabs value={tab} onValueChange={setTab} className="space-y-4">
        {/* cabinetSurface v1 */}
        <TabsList className={cn(cabinetSurface.tabsList, 'w-fit max-w-full flex-wrap')}>
          <TabsTrigger value="design" className={cn(cabinetSurface.tabsTrigger, 'h-7 gap-1.5')}>
            <Wand2 className="h-3 w-3 shrink-0" />
            AI Дизайн
          </TabsTrigger>
          <TabsTrigger value="generators" className={cn(cabinetSurface.tabsTrigger, 'h-7 gap-1.5')}>
            <Sparkles className="h-3 w-3 shrink-0" />
            AI Генераторы
          </TabsTrigger>
          <TabsTrigger
            value="body-scanner"
            className={cn(cabinetSurface.tabsTrigger, 'h-7 gap-1.5')}
          >
            <Scan className="h-3 w-3 shrink-0" />
            Сканер тела
          </TabsTrigger>
        </TabsList>
        <TabsContent value="design" className="mt-0 space-y-10">
          <header className="flex flex-wrap justify-end gap-2">
            <Button
              variant="outline"
              className="h-11 gap-2 rounded-xl px-6 text-[10px] font-black uppercase"
            >
              <History className="h-4 w-4" /> Библиотека эскизов
            </Button>
            <Button className="bg-text-primary h-11 gap-2 rounded-xl px-6 text-[10px] font-black uppercase text-white shadow-lg">
              <Download className="h-4 w-4" /> Экспорт (DXF/BOM)
            </Button>
          </header>

          <div className="grid gap-3 lg:grid-cols-12">
            {/* Input Prompt Card */}
            <div className="lg:col-span-12">
              <Card className="rounded-xl border-none bg-white p-2 shadow-md shadow-xl">
                <CardContent className="flex gap-3 p-4">
                  <div className="relative flex-1">
                    <Wand2 className="text-text-muted absolute left-6 top-1/2 h-5 w-5 -translate-y-1/2" />
                    <Input
                      placeholder="Опишите дизайн (напр. Oversized wool coat with asymmetric collar...)"
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      className="bg-bg-surface2 placeholder:text-text-muted focus-visible:ring-accent-primary h-12 rounded-xl border-none pl-14 pr-6 text-base font-medium"
                    />
                  </div>
                  <Button
                    onClick={handleGenerate}
                    disabled={isGenerating}
                    className="bg-accent-primary hover:bg-accent-primary shadow-accent-primary/15 h-12 shrink-0 gap-3 rounded-xl px-10 text-[12px] font-black uppercase text-white shadow-xl"
                  >
                    {isGenerating ? (
                      <Zap className="h-5 w-5 animate-spin" />
                    ) : (
                      <Sparkles className="h-5 w-5" />
                    )}
                    Generate Concepts
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Iterations Grid */}
            <div className="space-y-4 lg:col-span-8">
              <div className="mb-2 flex items-center justify-between">
                <h3 className="text-text-primary ml-4 text-base font-black uppercase tracking-tight">
                  Generated Iterations
                </h3>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-text-muted hover:text-accent-primary h-8 rounded-lg text-[10px] font-black uppercase"
                  >
                    Latest
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-text-muted hover:text-accent-primary h-8 rounded-lg text-[10px] font-black uppercase"
                  >
                    Favorites
                  </Button>
                </div>
              </div>

              <div className="grid gap-3 md:grid-cols-2">
                {iterations.map((iter, i) => (
                  <Card
                    key={iter.id}
                    className="group overflow-hidden rounded-xl border-none bg-white shadow-sm transition-all duration-500 hover:shadow-xl"
                  >
                    <div className="bg-bg-surface2 relative aspect-[4/5] overflow-hidden">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <ImageIcon className="text-text-muted h-12 w-12" />
                      </div>
                      <div className="absolute right-4 top-4 z-10">
                        <Button
                          variant="ghost"
                          size="icon"
                          className={cn(
                            'h-10 w-10 rounded-xl bg-white/80 shadow-sm backdrop-blur transition-colors',
                            iter.isFavorite
                              ? 'text-rose-500'
                              : 'text-text-muted hover:text-rose-500'
                          )}
                        >
                          <Heart className={cn('h-5 w-5', iter.isFavorite && 'fill-rose-500')} />
                        </Button>
                      </div>
                      {/* Hover Overlays */}
                      <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-black/40 p-4 opacity-0 transition-opacity group-hover:opacity-100">
                        <Button className="text-text-primary h-12 w-full gap-2 rounded-2xl bg-white text-[10px] font-black uppercase">
                          <Scissors className="h-4 w-4" /> Create Tech Pack
                        </Button>
                        <Button
                          variant="outline"
                          className="hover:text-text-primary h-12 w-full gap-2 rounded-2xl border-white bg-transparent text-[10px] font-black uppercase text-white hover:bg-white"
                        >
                          <Layers className="h-4 w-4" /> Variation
                        </Button>
                      </div>
                    </div>
                    <CardContent className="space-y-6 p-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="text-text-muted text-[10px] font-black uppercase tracking-widest">
                            {iter.aiModel}
                          </p>
                          <p className="text-text-secondary text-xs font-bold">
                            {new Date(iter.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <Badge
                          variant="outline"
                          className="bg-bg-surface2 text-text-secondary border-border-default h-6 text-[8px] font-black uppercase tracking-widest"
                        >
                          Batch ID: #8821
                        </Badge>
                      </div>

                      <div className="border-border-subtle grid grid-cols-2 gap-3 border-t pt-6">
                        <div className="space-y-1">
                          <p className="text-text-muted text-[9px] font-black uppercase tracking-widest">
                            Fabric Insight
                          </p>
                          <p className="text-text-primary text-sm font-black">
                            {iter.technicalSpecs?.suggestedFabric}
                          </p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-text-muted text-[9px] font-black uppercase tracking-widest">
                            CMT Est.
                          </p>
                          <p className="text-sm font-black text-emerald-600">
                            ${iter.technicalSpecs?.estimatedCmtCost}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* AI Design Controls Panel */}
            <div className="space-y-6 lg:col-span-4">
              <Card className="space-y-4 rounded-xl border-none bg-white p-4 shadow-md shadow-xl">
                <div className="flex items-center gap-3">
                  <div className="bg-bg-surface2 flex h-10 w-10 items-center justify-center rounded-2xl">
                    <Settings2 className="text-accent-primary h-5 w-5" />
                  </div>
                  <h3 className="text-sm font-black uppercase tracking-tight">
                    AI Generation Rules
                  </h3>
                </div>

                <div className="space-y-6">
                  <div className="space-y-3">
                    <label className="text-text-muted text-[10px] font-black uppercase tracking-widest">
                      Brand DNA Consistency
                    </label>
                    <div className="flex items-center justify-between rounded-2xl bg-emerald-50 p-4">
                      <span className="text-xs font-black uppercase text-emerald-700">
                        High Fidelity
                      </span>
                      <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="text-text-muted text-[10px] font-black uppercase tracking-widest">
                      Style DNA Tags
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {['Minimalist', 'Luxe', 'Sustainable'].map((tag) => (
                        <Badge
                          key={tag}
                          className="bg-bg-surface2 text-text-secondary h-8 rounded-lg border-none px-3 text-[8px] font-bold uppercase"
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="border-border-subtle space-y-3 border-t pt-6">
                    <div className="mb-4 flex items-center justify-between">
                      <label className="text-text-muted text-[10px] font-black uppercase tracking-widest">
                        Color Palette
                      </label>
                      <Palette className="text-text-muted h-4 w-4" />
                    </div>
                    <div className="flex gap-3">
                      {['#000080', '#F5F5DC', '#2F4F4F'].map((color) => (
                        <div
                          key={color}
                          className="border-border-subtle h-10 w-10 rounded-xl border shadow-sm"
                          style={{ backgroundColor: color }}
                        />
                      ))}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="border-border-default h-10 w-10 rounded-xl border-2 border-dashed"
                      >
                        <Plus className="text-text-muted h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="pt-6">
                  <Button
                    variant="outline"
                    className="border-border-subtle hover:bg-bg-surface2 h-12 w-full gap-2 rounded-2xl text-[10px] font-black uppercase transition-all"
                  >
                    View Style Profile <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </Card>

              <Card className="shadow-accent-primary/10 bg-accent-primary relative space-y-6 overflow-hidden rounded-xl border-none p-4 text-white shadow-2xl">
                <div className="relative z-10 space-y-6">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-white/20 bg-white/10">
                      <Zap className="h-5 w-5" />
                    </div>
                    <h3 className="text-sm font-black uppercase tracking-tight">
                      AI Tech Pack Flow
                    </h3>
                  </div>
                  <p className="text-xs font-medium leading-relaxed text-white/70">
                    Наш ИИ автоматически создает черновик спецификации (BOM) и предлагает материалы
                    на основе визуального анализа эскиза.
                  </p>
                  <Button className="text-accent-primary hover:bg-accent-primary/10 shadow-accent-primary/20 h-12 w-full rounded-2xl border-none bg-white text-[10px] font-black uppercase shadow-lg">
                    Configure Automation
                  </Button>
                </div>
                <div className="absolute right-0 top-0 h-32 w-32 -translate-y-16 translate-x-16 rounded-full bg-white/10 blur-2xl" />
              </Card>
            </div>
          </div>
        </TabsContent>
        <TabsContent value="generators" className="mt-0">
          {tab === 'generators' && <AiToolsContent />}
        </TabsContent>
        <TabsContent value="body-scanner" className="mt-0">
          {tab === 'body-scanner' && <BodyScannerContent />}
        </TabsContent>
      </Tabs>
    </RegistryPageShell>
  );
}

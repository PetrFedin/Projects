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
  Scan
} from 'lucide-react';
import { DesignPrompt, DesignIteration } from '@/lib/types/ai-design';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { generateDesignVariants } from '@/ai/flows/design-assistant';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const AiToolsContent = dynamic(() => import('@/app/brand/ai-tools/page'), { ssr: false });
const BodyScannerContent = dynamic(() => import('@/app/brand/ai-design/body-scanner/page').then(m => m.default), { ssr: false, loading: () => <div className="p-8 text-center text-slate-400">Загрузка...</div> });

/**
 * AI Design Assistant — Brand OS
 * Генерация вариантов дизайна по текстовому описанию и создание техпакетов.
 */

export default function AIDesignAssistantPage() {
  const [tab, setTab] = useState('design');
  const [prompt, setPrompt] = useState('Oversized evening dress in midnight blue silk with floral embroidery at the hem.');
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
        estimatedCmtCost: 35
      }
    }
  ]);

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      const results = await generateDesignVariants({
        brandId: 'brand-123',
        prompt: { id: 'p-new', text: prompt, category: 'Dresses', styleTags: ['Oversized'], colorPalette: ['#000080'] },
        count: 4
      });
      setIterations(prev => [...results, ...prev]);
    } catch (err) {
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  const tabTriggerClass =
    'text-[10px] font-bold uppercase tracking-widest data-[state=active]:bg-white data-[state=active]:shadow-sm h-7 gap-1.5';

  return (
    <div className="container mx-auto px-4 py-4 space-y-4">
      <Tabs value={tab} onValueChange={setTab} className="space-y-4">
        <TabsList className="bg-slate-50 border border-slate-200 h-9 px-1 gap-0.5 flex-wrap w-fit max-w-full">
          <TabsTrigger value="design" className={tabTriggerClass}>
            <Wand2 className="h-3 w-3 shrink-0" />
            AI Дизайн
          </TabsTrigger>
          <TabsTrigger value="generators" className={tabTriggerClass}>
            <Sparkles className="h-3 w-3 shrink-0" />
            AI Генераторы
          </TabsTrigger>
          <TabsTrigger value="body-scanner" className={tabTriggerClass}>
            <Scan className="h-3 w-3 shrink-0" />
            Сканер тела
          </TabsTrigger>
        </TabsList>
        <TabsContent value="design" className="mt-0 space-y-10">
      <header className="flex flex-wrap justify-end gap-2">
           <Button variant="outline" className="gap-2 rounded-xl h-11 px-6 font-black uppercase text-[10px]">
              <History className="w-4 h-4" /> Библиотека эскизов
           </Button>
           <Button className="gap-2 rounded-xl h-11 px-6 font-black uppercase text-[10px] bg-slate-900 text-white shadow-lg">
              <Download className="w-4 h-4" /> Экспорт (DXF/BOM)
           </Button>
      </header>

      <div className="grid lg:grid-cols-12 gap-3">
         {/* Input Prompt Card */}
         <div className="lg:col-span-12">
            <Card className="border-none shadow-xl shadow-slate-200/50 rounded-xl bg-white p-2">
               <CardContent className="p-4 flex gap-3">
                  <div className="flex-1 relative">
                     <Wand2 className="w-5 h-5 absolute left-6 top-1/2 -translate-y-1/2 text-slate-300" />
                     <Input 
                        placeholder="Опишите дизайн (напр. Oversized wool coat with asymmetric collar...)" 
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        className="h-12 pl-14 pr-6 rounded-xl border-none bg-slate-50 text-base font-medium placeholder:text-slate-300 focus-visible:ring-indigo-600"
                     />
                  </div>
                  <Button 
                    onClick={handleGenerate}
                    disabled={isGenerating}
                    className="h-12 px-10 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-black uppercase text-[12px] gap-3 shadow-xl shadow-indigo-200 shrink-0"
                  >
                     {isGenerating ? <Zap className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
                     Generate Concepts
                  </Button>
               </CardContent>
            </Card>
         </div>

         {/* Iterations Grid */}
         <div className="lg:col-span-8 space-y-4">
            <div className="flex items-center justify-between mb-2">
               <h3 className="text-base font-black uppercase tracking-tight text-slate-900 ml-4">Generated Iterations</h3>
               <div className="flex gap-2">
                  <Button variant="ghost" size="sm" className="h-8 rounded-lg text-[10px] font-black uppercase text-slate-400 hover:text-indigo-600">Latest</Button>
                  <Button variant="ghost" size="sm" className="h-8 rounded-lg text-[10px] font-black uppercase text-slate-400 hover:text-indigo-600">Favorites</Button>
               </div>
            </div>

            <div className="grid md:grid-cols-2 gap-3">
               {iterations.map((iter, i) => (
                  <Card key={iter.id} className="border-none shadow-sm rounded-xl overflow-hidden group hover:shadow-xl transition-all duration-500 bg-white">
                     <div className="aspect-[4/5] bg-slate-100 relative overflow-hidden">
                        <div className="absolute inset-0 flex items-center justify-center">
                           <ImageIcon className="w-12 h-12 text-slate-200" />
                        </div>
                        <div className="absolute top-4 right-4 z-10">
                           <Button variant="ghost" size="icon" className={cn(
                              "h-10 w-10 rounded-xl bg-white/80 backdrop-blur shadow-sm transition-colors",
                              iter.isFavorite ? "text-rose-500" : "text-slate-300 hover:text-rose-500"
                           )}>
                              <Heart className={cn("w-5 h-5", iter.isFavorite && "fill-rose-500")} />
                           </Button>
                        </div>
                        {/* Hover Overlays */}
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-3 p-4">
                           <Button className="w-full h-12 rounded-2xl bg-white text-slate-900 font-black uppercase text-[10px] gap-2">
                              <Scissors className="w-4 h-4" /> Create Tech Pack
                           </Button>
                           <Button variant="outline" className="w-full h-12 rounded-2xl bg-transparent border-white text-white font-black uppercase text-[10px] gap-2 hover:bg-white hover:text-slate-900">
                              <Layers className="w-4 h-4" /> Variation
                           </Button>
                        </div>
                     </div>
                     <CardContent className="p-4 space-y-6">
                        <div className="flex justify-between items-start">
                           <div>
                              <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">{iter.aiModel}</p>
                              <p className="text-xs font-bold text-slate-500">{new Date(iter.createdAt).toLocaleDateString()}</p>
                           </div>
                           <Badge variant="ghost" className="bg-slate-50 text-slate-500 text-[8px] font-black uppercase tracking-widest h-6">Batch ID: #8821</Badge>
                        </div>

                        <div className="grid grid-cols-2 gap-3 pt-6 border-t border-slate-50">
                           <div className="space-y-1">
                              <p className="text-[9px] font-black uppercase text-slate-400 tracking-widest">Fabric Insight</p>
                              <p className="text-sm font-black text-slate-900">{iter.technicalSpecs?.suggestedFabric}</p>
                           </div>
                           <div className="space-y-1">
                              <p className="text-[9px] font-black uppercase text-slate-400 tracking-widest">CMT Est.</p>
                              <p className="text-sm font-black text-emerald-600">${iter.technicalSpecs?.estimatedCmtCost}</p>
                           </div>
                        </div>
                     </CardContent>
                  </Card>
               ))}
            </div>
         </div>

         {/* AI Design Controls Panel */}
         <div className="lg:col-span-4 space-y-6">
            <Card className="border-none shadow-xl shadow-slate-200/50 rounded-xl bg-white p-4 space-y-4">
               <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-2xl bg-slate-50 flex items-center justify-center">
                     <Settings2 className="w-5 h-5 text-indigo-600" />
                  </div>
                  <h3 className="text-sm font-black uppercase tracking-tight">AI Generation Rules</h3>
               </div>

               <div className="space-y-6">
                  <div className="space-y-3">
                     <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Brand DNA Consistency</label>
                     <div className="flex items-center justify-between p-4 bg-emerald-50 rounded-2xl">
                        <span className="text-xs font-black text-emerald-700 uppercase">High Fidelity</span>
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                     </div>
                  </div>

                  <div className="space-y-3">
                     <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Style DNA Tags</label>
                     <div className="flex flex-wrap gap-2">
                        {['Minimalist', 'Luxe', 'Sustainable'].map(tag => (
                           <Badge key={tag} className="bg-slate-100 text-slate-600 border-none rounded-lg h-8 px-3 font-bold uppercase text-[8px]">
                              {tag}
                           </Badge>
                        ))}
                     </div>
                  </div>

                  <div className="space-y-3 pt-6 border-t border-slate-50">
                     <div className="flex items-center justify-between mb-4">
                        <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Color Palette</label>
                        <Palette className="w-4 h-4 text-slate-300" />
                     </div>
                     <div className="flex gap-3">
                        {['#000080', '#F5F5DC', '#2F4F4F'].map(color => (
                           <div key={color} className="h-10 w-10 rounded-xl shadow-sm border border-slate-100" style={{ backgroundColor: color }} />
                        ))}
                        <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl border-2 border-dashed border-slate-200">
                           <Plus className="w-4 h-4 text-slate-300" />
                        </Button>
                     </div>
                  </div>
               </div>

               <div className="pt-6">
                  <Button variant="outline" className="w-full h-12 rounded-2xl border-slate-100 text-[10px] font-black uppercase gap-2 hover:bg-slate-50 transition-all">
                     View Style Profile <ArrowRight className="w-4 h-4" />
                  </Button>
               </div>
            </Card>

            <Card className="border-none shadow-2xl shadow-indigo-100 rounded-xl bg-indigo-600 text-white p-4 space-y-6 overflow-hidden relative">
               <div className="relative z-10 space-y-6">
                  <div className="flex items-center gap-3">
                     <div className="h-10 w-10 rounded-2xl bg-white/10 flex items-center justify-center border border-white/20">
                        <Zap className="w-5 h-5" />
                     </div>
                     <h3 className="text-sm font-black uppercase tracking-tight">AI Tech Pack Flow</h3>
                  </div>
                  <p className="text-xs text-white/70 leading-relaxed font-medium">
                     Наш ИИ автоматически создает черновик спецификации (BOM) и предлагает материалы на основе визуального анализа эскиза.
                  </p>
                  <Button className="w-full h-12 bg-white text-indigo-600 hover:bg-indigo-50 border-none rounded-2xl font-black uppercase text-[10px] shadow-lg shadow-indigo-700/20">
                     Configure Automation
                  </Button>
               </div>
               <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full translate-x-16 -translate-y-16 blur-2xl" />
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
    </div>
  );
}

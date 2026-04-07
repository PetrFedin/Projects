'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { 
  FileText, 
  Plus, 
  Search, 
  ChevronRight, 
  ArrowRight,
  Eye, 
  Calendar, 
  Clock, 
  Zap, 
  Sparkles, 
  ImageIcon, 
  Layout, 
  Share2, 
  MoreVertical, 
  CheckCircle2, 
  AlertCircle,
  History,
  TrendingUp,
  Newspaper,
  Rocket
} from 'lucide-react';
import { EditorialArticle, EditorialStatus, EditorialCategory } from '@/lib/types/editorial';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';

/**
 * Editorial Marketroom CMS — Admin/Brand Dashboard
 * Журнальный формат главной страницы: тренд-репорты, интервью и подборки.
 */

export default function EditorialCMSPage() {
  const [articles, setArticles] = useState<EditorialArticle[]>([
    {
      id: 'art-1',
      title: 'Metallic Textures: SS26 Key Trends',
      slug: 'metallic-textures-ss26',
      subtitle: 'Why liquid metal is the new black this season.',
      author: { name: 'Viktoria B.', role: 'Trend Analyst' },
      category: 'trend_report',
      status: 'published',
      mainImageUrl: '/editorial/metallic.jpg',
      summary: 'Exploring the shift towards high-gloss materials in luxury fashion.',
      contentNodes: [],
      tags: ['Trend', 'SS26', 'Luxury'],
      readingTime: 5,
      publishedAt: '2026-03-05T10:00:00Z',
      viewCount: 12450
    },
    {
      id: 'art-2',
      title: 'Interview: Designing for the Metaverse',
      slug: 'interview-digital-design',
      subtitle: 'Exclusive talk with lead designers of Synth Lab.',
      author: { name: 'Artem N.', role: 'Digital Creator' },
      category: 'interview',
      status: 'scheduled',
      mainImageUrl: '/editorial/meta.jpg',
      summary: 'How digital twins are changing the physical design process.',
      contentNodes: [],
      tags: ['Digital', 'Web3', 'Innovation'],
      readingTime: 8,
      publishedAt: '2026-03-10T09:00:00Z',
      viewCount: 0
    }
  ]);

  const getStatusBadge = (status: EditorialStatus) => {
    const config: Record<EditorialStatus, { label: string, color: string }> = {
      'draft': { label: 'Черновик', color: 'bg-slate-100 text-slate-500 border-slate-200' },
      'scheduled': { label: 'Запланировано', color: 'bg-indigo-50 text-indigo-600 border-indigo-100' },
      'published': { label: 'Опубликовано', color: 'bg-emerald-50 text-emerald-600 border-emerald-100' },
      'archived': { label: 'Архив', color: 'bg-slate-900 text-white border-none' }
    };
    const item = config[status];
    return <Badge variant="outline" className={cn("text-[8px] font-black uppercase px-2 h-5", item.color)}>{item.label}</Badge>;
  };

  return (
    <div className="container mx-auto px-4 py-4 space-y-10">
      <header className="flex flex-col md:flex-row justify-between md:items-end gap-3">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-indigo-600">
            <Newspaper className="w-3.5 h-3.5" />
            Marketroom Editorial CMS
          </div>
          <h1 className="text-sm font-black font-headline tracking-tighter uppercase">Content Studio</h1>
          <p className="text-muted-foreground font-medium">Управление нативным контентом и тренд-репортами платформы Synth-1.</p>
        </div>
        <div className="flex gap-2">
           <Button variant="outline" className="gap-2 rounded-xl h-11 px-6 font-black uppercase text-[10px]">
              <Layout className="w-4 h-4" /> Шаблоны
           </Button>
           <Button className="gap-2 rounded-xl h-11 px-6 font-black uppercase text-[10px] bg-slate-900 text-white shadow-lg">
              <Plus className="w-4 h-4" /> Создать статью
           </Button>
        </div>
      </header>

      {/* Analytics Row */}
      <div className="grid md:grid-cols-4 gap-3">
         {[
           { label: 'Всего статей', value: '42', icon: FileText, color: 'text-slate-900' },
           { label: 'Total Views', value: '185K', icon: Eye, color: 'text-indigo-600' },
           { label: 'Avg CTR', value: '12.4%', icon: TrendingUp, color: 'text-emerald-600' },
           { label: 'Trending Tags', value: '#SS26, #Silk', icon: Sparkles, color: 'text-amber-600' }
         ].map((stat, i) => (
           <Card key={i} className="border-none shadow-sm bg-white rounded-3xl p-4">
              <div className="flex items-center gap-3 mb-2">
                 <div className="p-2 bg-slate-50 rounded-xl"><stat.icon className="w-4 h-4 text-slate-400" /></div>
                 <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{stat.label}</span>
              </div>
              <p className={`text-sm font-black ${stat.color}`}>{stat.value}</p>
           </Card>
         ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-3">
         <div className="lg:col-span-2 space-y-6">
            <Card className="border-none shadow-xl shadow-slate-200/50 rounded-xl overflow-hidden bg-white">
               <CardHeader className="p-4 border-b border-slate-50 flex flex-row items-center justify-between">
                  <CardTitle className="text-base font-black uppercase tracking-tight">Статьи и Репорты</CardTitle>
                  <div className="relative">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" />
                    <Input placeholder="Поиск по заголовку" className="pl-9 h-10 rounded-xl border-slate-100 text-xs w-64" />
                  </div>
               </CardHeader>
               <CardContent className="p-0">
                  <Table>
                     <TableHeader className="bg-slate-50/50">
                        <TableRow>
                           <TableHead className="pl-8 text-[10px] font-black uppercase">Контент</TableHead>
                           <TableHead className="text-[10px] font-black uppercase">Статус</TableHead>
                           <TableHead className="text-[10px] font-black uppercase">Просмотры</TableHead>
                           <TableHead className="pr-8 text-right text-[10px] font-black uppercase">Действие</TableHead>
                        </TableRow>
                     </TableHeader>
                     <TableBody>
                        {articles.map(article => (
                           <TableRow key={article.id} className="hover:bg-slate-50/50 transition-colors group cursor-pointer">
                              <TableCell className="pl-8 py-6">
                                 <div className="flex items-center gap-3">
                                    <div className="h-12 w-12 rounded-2xl bg-slate-100 flex items-center justify-center shrink-0 border border-slate-50 relative overflow-hidden">
                                       <ImageIcon className="w-6 h-6 text-slate-200" />
                                       <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                                    </div>
                                    <div className="space-y-1">
                                       <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">{article.category.replace('_', ' ')}</p>
                                       <h4 className="text-sm font-black text-slate-900 leading-tight">{article.title}</h4>
                                       <div className="flex items-center gap-3 text-[9px] font-bold text-slate-400">
                                          <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {article.readingTime} min</span>
                                          <span className="flex items-center gap-1 uppercase tracking-tighter">{article.author.name}</span>
                                       </div>
                                    </div>
                                 </div>
                              </TableCell>
                              <TableCell>
                                 {getStatusBadge(article.status)}
                              </TableCell>
                              <TableCell>
                                 <p className="text-sm font-black text-slate-900">{article.viewCount.toLocaleString()}</p>
                                 <p className="text-[9px] text-slate-400 font-bold uppercase tracking-tight">Total Reads</p>
                              </TableCell>
                              <TableCell className="pr-8 text-right">
                                 <Button variant="ghost" size="icon" className="text-slate-300 hover:text-indigo-600 rounded-xl">
                                    <ArrowRight className="w-4 h-4" />
                                 </Button>
                              </TableCell>
                           </TableRow>
                        ))}
                     </TableBody>
                  </Table>
               </CardContent>
            </Card>
         </div>

         <div className="space-y-6">
            <Card className="border-none shadow-xl shadow-slate-200/50 rounded-xl bg-slate-900 text-white p-4">
               <div className="flex items-center gap-3 mb-6">
                  <div className="h-10 w-10 rounded-2xl bg-white/10 flex items-center justify-center">
                     <Zap className="w-5 h-5 text-indigo-400" />
                  </div>
                  <div>
                     <h3 className="text-sm font-black uppercase tracking-tight">AI Content Assistant</h3>
                     <p className="text-[10px] text-white/40 uppercase tracking-widest font-bold">Smart Optimization</p>
                  </div>
               </div>
               
               <div className="space-y-6">
                  <div className="p-4 bg-white/5 rounded-2xl border border-white/10 space-y-2">
                     <p className="text-[10px] font-black uppercase text-indigo-400 tracking-widest">Headline Recommendation</p>
                     <p className="text-xs text-white/80 leading-relaxed font-medium">
                        "SS26 Trends" слишком общий заголовок. ИИ рекомендует: "Liquid Metal & Urban Safari: 5 Core Textures for SS26".
                     </p>
                  </div>
                  
                  <div className="flex items-center gap-3 p-4 bg-emerald-500/10 rounded-2xl border border-emerald-500/20">
                     <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                     <p className="text-[10px] text-emerald-100 font-bold uppercase tracking-tight">SEO Score: 94/100</p>
                  </div>
               </div>
               <Button className="w-full mt-8 bg-indigo-600 hover:bg-indigo-700 text-white border-none rounded-xl font-black uppercase text-[9px] h-10 shadow-lg">
                  Analyze Draft
               </Button>
            </Card>

            <Card className="border-none shadow-xl shadow-slate-200/50 rounded-xl p-4 bg-white border border-slate-50">
               <h3 className="text-sm font-black uppercase tracking-tight text-slate-900 mb-6">Marketroom Layout</h3>
               <div className="space-y-4">
                  <div className="p-4 bg-slate-50 rounded-2xl space-y-3">
                     <div className="flex justify-between items-center">
                        <span className="text-[10px] font-black uppercase text-slate-400">Hero Section</span>
                        <Badge className="bg-slate-900 text-white text-[8px] uppercase">Active</Badge>
                     </div>
                     <p className="text-xs font-black uppercase text-slate-700">"Metallic Textures..."</p>
                  </div>
                  <Button variant="outline" className="w-full h-12 rounded-2xl border-slate-100 text-[10px] font-black uppercase gap-2 hover:bg-slate-50">
                     <Layout className="w-4 h-4" /> Change Layout Design
                  </Button>
               </div>
            </Card>
         </div>
      </div>
    </div>
  );
}

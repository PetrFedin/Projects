'use client';

import * as React from 'react';
import { use } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  ArrowLeft, 
  Gavel, 
  Clock, 
  CheckCircle, 
  Trophy, 
  ShieldCheck, 
  AlertTriangle,
  Bot,
  Brain,
  History,
  TrendingDown,
  TrendingUp,
  ChevronRight,
  Sparkles,
  Zap,
  Info,
  ExternalLink,
  MessageSquare
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { mockAuctions } from '@/lib/auction-data';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';

export default function AuctionDetailPage({ params: paramsPromise }: { params: Promise<{ id: string }> }) {
  const params = use(paramsPromise);
  const { toast } = useToast();
  const auction = mockAuctions.find(a => a.id === params.id);
  const [selectedBidId, setSelectedBidId] = React.useState<string | null>(null);

  if (!auction) return <div className="p-20 text-center uppercase font-black tracking-widest text-slate-400">Аукцион не найден</div>;

  const handleAcceptBid = (bidderName: string) => {
    toast({
      title: "Предложение принято",
      description: `Контракт с ${bidderName} успешно сформирован. Переход к этапу оплаты...`,
    });
  };

  const selectedBid = auction.bids.find(b => b.id === selectedBidId);

  return (
    <div className="min-h-screen bg-slate-50/50 p-4 md:p-4 font-sans">
      <div className="max-w-[1400px] mx-auto space-y-10">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-3">
          <div className="space-y-4">
            <Button asChild variant="ghost" className="p-0 hover:bg-transparent text-slate-400 hover:text-slate-900 font-black uppercase tracking-widest text-[10px] group transition-all">
              <Link href="/brand/auctions" className="flex items-center">
                <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" /> К списку тендеров
              </Link>
            </Button>
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-2xl bg-slate-900 flex items-center justify-center shadow-lg">
                  <Gavel className="h-5 w-5 text-white" />
                </div>
                <Badge variant="outline" className="text-[10px] border-slate-900/20 text-slate-900 bg-slate-900/5 uppercase font-black tracking-widest px-3 py-1">
                  ID: {auction.id}
                </Badge>
                <Badge className="bg-green-500 text-white border-none uppercase text-[10px] font-black tracking-widest px-3 animate-pulse">Active Tender</Badge>
              </div>
              <h1 className="text-sm font-black uppercase tracking-tighter text-slate-900 max-w-2xl leading-tight">{auction.title}</h1>
              <p className="text-slate-400 font-medium max-w-xl text-sm">{auction.description}</p>
            </div>
          </div>

          <Card className="rounded-xl border-none shadow-2xl bg-white p-4 md:min-w-[320px]">
            <div className="space-y-6">
              {auction.type === 'collaboration' ? (
                <>
                  <div className="flex justify-between items-center border-b border-slate-50 pb-4">
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Platform</p>
                    <Badge className="bg-slate-100 text-slate-900 border-none uppercase text-[10px] font-black px-3">
                      {auction.influencerData?.platform}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center border-b border-slate-50 pb-4">
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Engagement Rate</p>
                    <p className="text-base font-black text-indigo-600">{auction.influencerData?.er}%</p>
                  </div>
                  <div className="flex justify-between items-center pb-2">
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Status</p>
                    <div className="flex items-center gap-2 text-green-500">
                      <Zap className="h-4 w-4 fill-current" />
                      <p className="text-base font-black tracking-tighter uppercase">Available</p>
                    </div>
                  </div>
                  <Button className="w-full h-10 rounded-2xl bg-purple-600 text-white font-black uppercase text-[10px] tracking-widest shadow-xl shadow-purple-900/20 hover:bg-purple-700 transition-all">Обсудить коллаборацию</Button>
                </>
              ) : (
                <>
                  <div className="flex justify-between items-center border-b border-slate-50 pb-4">
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Target Price</p>
                    <p className="text-base font-black text-slate-900">{auction.targetPrice?.toLocaleString('ru-RU')} ₽</p>
                  </div>
                  <div className="flex justify-between items-center border-b border-slate-50 pb-4">
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Units</p>
                    <p className="text-base font-black text-slate-900">{auction.targetQuantity?.toLocaleString('ru-RU')}</p>
                  </div>
                  <div className="flex justify-between items-center pb-2">
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Time Left</p>
                    <div className="flex items-center gap-2 text-rose-500">
                      <Clock className="h-4 w-4 animate-pulse" />
                      <p className="text-base font-black tracking-tighter uppercase">2d 14h 30m</p>
                    </div>
                  </div>
                  <Button className="w-full h-10 rounded-2xl bg-slate-900 text-white font-black uppercase text-[10px] tracking-widest shadow-xl">Закрыть досрочно</Button>
                </>
              )}
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3">
          
          {/* Main Content Area */}
          <div className="lg:col-span-8 space-y-4">
            {auction.type === 'collaboration' ? (
              <div className="space-y-10">
                {/* Social Media Analytics Block */}
                <section className="space-y-6">
                  <div className="flex items-center gap-3 px-2">
                    <TrendingUp className="h-5 w-5 text-indigo-600" />
                    <h3 className="text-base font-black uppercase tracking-tight text-slate-900">Анализ социальных сетей</h3>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <Card className="rounded-xl border-none shadow-xl bg-white p-4 space-y-2">
                      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Real Audience Score</p>
                      <div className="flex items-end gap-2">
                        <p className="text-base font-black text-slate-900">{auction.influencerData?.realAudienceScore}%</p>
                        <Badge className="mb-1 bg-green-100 text-green-600 border-none text-[8px] font-black uppercase">High Trust</Badge>
                      </div>
                      <Progress value={auction.influencerData?.realAudienceScore} className="h-1 bg-slate-100" />
                    </Card>
                    
                    <Card className="rounded-xl border-none shadow-xl bg-white p-4 space-y-4">
                      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Топ География</p>
                      <div className="flex flex-wrap gap-2">
                        {auction.influencerData?.topGeography.map((geo, i) => (
                          <Badge key={i} variant="secondary" className="rounded-lg bg-slate-50 text-slate-600 border-slate-100 text-[9px] font-bold uppercase tracking-wider px-3 py-1">{geo}</Badge>
                        ))}
                      </div>
                    </Card>

                    <Card className="rounded-xl border-none shadow-xl bg-white p-4 space-y-2">
                      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Audience Quality</p>
                      <p className="text-xs font-medium text-slate-500 leading-relaxed italic">
                        {auction.influencerData?.audienceQuality}
                      </p>
                    </Card>
                  </div>
                </section>

                {/* AI Smart Advisor Detailed View */}
                <section className="space-y-6">
                  <div className="flex items-center gap-3 px-2">
                    <Brain className="h-5 w-5 text-purple-600" />
                    <h3 className="text-base font-black uppercase tracking-tight text-slate-900">AI Smart Advisor</h3>
                  </div>
                  
                  <Card className="rounded-xl border-none shadow-2xl bg-slate-900 text-white p-3 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-5">
                      <Sparkles className="h-48 w-48" />
                    </div>
                    <div className="relative z-10 space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-purple-400">Relevance Recommendation</p>
                          <h4 className="text-base font-black uppercase tracking-tighter">Match Analysis</h4>
                        </div>
                        <div className="h-20 w-20 rounded-full border-4 border-purple-500/30 flex items-center justify-center relative">
                          <span className="text-sm font-black">{auction.aiSmartAdvisor?.relevanceScore}%</span>
                          <svg className="absolute inset-0 h-full w-full -rotate-90">
                            <circle 
                              cx="40" cy="40" r="36" 
                              stroke="currentColor" strokeWidth="4" fill="transparent"
                              className="text-purple-500"
                              strokeDasharray={`${auction.aiSmartAdvisor ? auction.aiSmartAdvisor.relevanceScore * 2.26 : 0} 226`}
                            />
                          </svg>
                        </div>
                      </div>
                      
                      <div className="p-4 rounded-xl bg-white/5 border border-white/5 space-y-4">
                        <div className="flex items-center gap-3">
                          <Info className="h-5 w-5 text-purple-400" />
                          <p className="text-sm font-bold leading-relaxed text-slate-200">
                            {auction.aiSmartAdvisor?.matchAnalysis}
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div className="space-y-2">
                          <p className="text-[10px] font-black uppercase tracking-widest text-white/40">Efficiency Forecast</p>
                          <p className="text-sm font-medium text-slate-400">Прогнозируемый рост охвата бренда на <span className="text-green-400 font-black">+12-15%</span> в целевом сегменте в течение первой недели после публикации.</p>
                        </div>
                        <div className="space-y-2">
                          <p className="text-[10px] font-black uppercase tracking-widest text-white/40">Engagement Potential</p>
                          <p className="text-sm font-medium text-slate-400">Высокая вероятность конверсии в лояльных клиентов благодаря высокому уровню доверия аудитории (Trust Score: 9.2/10).</p>
                        </div>
                      </div>
                    </div>
                  </Card>
                </section>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between px-2">
                  <h3 className="text-base font-black uppercase tracking-tight text-slate-900">Поступившие заявки</h3>
                  <div className="flex gap-3">
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-green-500" />
                      <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">Leading Bid</span>
                    </div>
                  </div>
                </div>

                <Card className="rounded-xl border-none shadow-xl bg-white overflow-hidden">
                  <CardContent className="p-0">
                    <Table>
                      <TableHeader className="bg-slate-50/50">
                        <TableRow className="border-none hover:bg-transparent">
                          <TableHead className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Поставщик</TableHead>
                          <TableHead className="py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Цена (ед.)</TableHead>
                          <TableHead className="py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Срок (дней)</TableHead>
                          <TableHead className="py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">AI Score</TableHead>
                          <TableHead className="px-8 py-4 text-right text-[10px] font-black uppercase tracking-widest text-slate-400">Действие</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {auction.bids.map((bid) => (
                          <TableRow 
                            key={bid.id} 
                            className={cn(
                              "border-b border-slate-50 cursor-pointer transition-colors group",
                              selectedBidId === bid.id ? "bg-slate-900 hover:bg-slate-900" : "hover:bg-slate-50/50"
                            )}
                            onClick={() => setSelectedBidId(bid.id)}
                          >
                            <TableCell className="px-8 py-6">
                              <div className="flex items-center gap-3">
                                <div className={cn(
                                  "h-10 w-10 rounded-xl flex items-center justify-center font-black text-xs transition-colors",
                                  selectedBidId === bid.id ? "bg-white/10 text-white" : "bg-slate-100 text-slate-400"
                                )}>
                                  {bid.bidderName[0]}
                                </div>
                                <div>
                                  <p className={cn("font-bold uppercase tracking-tight", selectedBidId === bid.id ? "text-white" : "text-slate-900")}>
                                    {bid.bidderName}
                                  </p>
                                  <div className="flex items-center gap-1">
                                    <Trophy className="h-2.5 w-2.5 text-amber-500" />
                                    <p className="text-[9px] font-black text-slate-400 uppercase">{bid.bidderRating} Rating</p>
                                  </div>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell className="py-6 font-black text-sm">
                              <span className={cn(selectedBidId === bid.id ? "text-green-400" : "text-slate-900")}>
                                {bid.amount.toLocaleString('ru-RU')} ₽
                              </span>
                            </TableCell>
                            <TableCell className={cn("py-6 text-sm font-bold", selectedBidId === bid.id ? "text-white/60" : "text-slate-400")}>
                              {bid.deliveryDays}
                            </TableCell>
                            <TableCell className="py-6">
                              {bid.aiAnalysis && (
                                <Badge className={cn(
                                  "text-[9px] font-black border-none px-3 py-1",
                                  bid.aiAnalysis.reliabilityScore > 90 ? "bg-green-500 text-white" : "bg-amber-500 text-white"
                                )}>
                                  {bid.aiAnalysis.reliabilityScore}%
                                </Badge>
                              )}
                            </TableCell>
                            <TableCell className="px-8 py-6 text-right">
                              <Button 
                                className={cn(
                                  "h-10 rounded-xl font-black uppercase text-[10px] tracking-widest shadow-lg transition-all",
                                  selectedBidId === bid.id 
                                    ? "bg-white text-slate-900 hover:bg-slate-100" 
                                    : "bg-slate-900 text-white hover:bg-black opacity-0 group-hover:opacity-100"
                                )}
                                onClick={(e) => { e.stopPropagation(); handleAcceptBid(bid.bidderName); }}
                              >
                                Принять
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </>
            )}
          </div>

          {/* AI Analysis Sidebar */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center gap-3 px-2">
              <Brain className="h-5 w-5 text-accent" />
              <h3 className="text-base font-black uppercase tracking-tight text-slate-900 text-accent">AI Advisor PRO</h3>
            </div>

            {auction.type === 'collaboration' ? (
              <Card className="rounded-xl border-none shadow-2xl bg-slate-950 text-white p-3 relative overflow-hidden h-fit">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                  <Bot className="h-32 w-32 rotate-12" />
                </div>
                
                <div className="relative z-10 space-y-10">
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-accent">AI Smart Advisor</p>
                      <h4 className="text-sm font-black uppercase tracking-tighter">Strategic Match</h4>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 mb-1">Relevance</p>
                      <Badge className="uppercase font-black text-[9px] border-none px-3 bg-purple-500">
                        {auction.aiSmartAdvisor?.relevanceScore}%
                      </Badge>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="space-y-2">
                      <p className="text-[8px] font-black uppercase tracking-widest text-white/40">Engagement Analysis</p>
                      <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                        <p className="text-xs font-bold leading-relaxed">Engagement Rate ({auction.influencerData?.er}%) значительно выше среднего по рынку (2.4%). Аудитория активно взаимодействует с контентом.</p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <p className="text-[8px] font-black uppercase tracking-widest text-white/40">Fraud Detection</p>
                      <div className="flex items-center gap-3 p-4 rounded-2xl bg-white/5 border border-white/5">
                        <ShieldCheck className="h-5 w-5 text-green-400 shrink-0" />
                        <div>
                          <p className="text-[9px] font-black uppercase text-green-400 mb-0.5">Real Audience</p>
                          <p className="text-xs font-bold leading-relaxed">{auction.influencerData?.realAudienceScore}% живых пользователей</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <Button className="w-full h-10 rounded-2xl bg-white text-slate-900 font-black uppercase text-[10px] tracking-widest hover:bg-slate-100 transition-all">Открыть чат с блогером</Button>
                </div>
              </Card>
            ) : selectedBid ? (
              <Card className="rounded-xl border-none shadow-2xl bg-slate-950 text-white p-3 relative overflow-hidden h-fit">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                  <Bot className="h-32 w-32 rotate-12" />
                </div>
                
                <div className="relative z-10 space-y-10">
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-accent">Strategic Assessment</p>
                      <h4 className="text-sm font-black uppercase tracking-tighter">{selectedBid.bidderName}</h4>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 mb-1">Risk Level</p>
                      <Badge className={cn(
                        "uppercase font-black text-[9px] border-none px-3",
                        selectedBid.aiAnalysis?.riskLevel === 'low' ? "bg-green-500" : "bg-amber-500"
                      )}>
                        {selectedBid.aiAnalysis?.riskLevel}
                      </Badge>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <p className="text-[8px] font-black uppercase tracking-widest text-white/40">Reliability Score</p>
                      <p className="text-base font-black text-white">{selectedBid.aiAnalysis?.reliabilityScore}%</p>
                      <Progress value={selectedBid.aiAnalysis?.reliabilityScore} className="h-1 bg-white/10" />
                    </div>
                    <div className="space-y-2">
                      <p className="text-[8px] font-black uppercase tracking-widest text-white/40">Market Competitiveness</p>
                      <div className="flex items-baseline gap-2">
                        <p className="text-base font-black text-green-400">High</p>
                        <span className="text-[10px] font-black text-white/20 uppercase">v Market</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center gap-3 p-4 rounded-2xl bg-white/5 border border-white/5">
                      <ShieldCheck className="h-5 w-5 text-accent shrink-0" />
                      <div>
                        <p className="text-[9px] font-black uppercase text-accent mb-0.5">Primary Factor</p>
                        <p className="text-xs font-bold leading-relaxed">{selectedBid.aiAnalysis?.riskFactor}</p>
                      </div>
                    </div>
                    <div className="p-4 rounded-xl bg-white/5 border border-white/5 space-y-4">
                      <div className="flex items-center gap-2">
                        <Sparkles className="h-3.5 w-3.5 text-accent" />
                        <span className="text-[9px] font-black uppercase tracking-widest text-white/60">Executive Summary</span>
                      </div>
                      <p className="text-xs font-medium text-white/80 leading-relaxed italic">
                        "{selectedBid.aiAnalysis?.summary}"
                      </p>
                    </div>
                  </div>

                  <div className="pt-6 border-t border-white/10 space-y-4">
                    <p className="text-[9px] font-black uppercase tracking-widest text-white/40 mb-4 text-center italic opacity-60">
                      Система рекомендует принять предложение на основе комбинации цены и низких логистических рисков.
                    </p>
                    <div className="flex gap-2">
                      <Button className="flex-1 h-10 rounded-2xl bg-accent text-white font-black uppercase text-[10px] tracking-widest shadow-xl shadow-accent/20">
                        Принять оффер
                      </Button>
                      <Button variant="ghost" size="icon" className="h-10 w-10 rounded-2xl bg-white/5 hover:bg-white/10 text-white">
                        <MessageSquare className="h-5 w-5" />
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            ) : (
              <Card className="rounded-xl border-dashed border-2 border-slate-200 bg-transparent p-3 flex flex-col items-center justify-center text-center h-[500px]">
                <div className="h-20 w-20 rounded-full bg-slate-100 flex items-center justify-center mb-6">
                  <Brain className="h-10 w-10 text-slate-300" />
                </div>
                <h4 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-2">Выберите ставку</h4>
                <p className="text-xs font-bold text-slate-300 uppercase tracking-tight max-w-[200px]">
                  Нажмите на любую строку в таблице, чтобы запустить глубокий AI-анализ предложения.
                </p>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Trophy, 
  Star, 
  Target, 
  TrendingUp, 
  Users, 
  Brain, 
  Award, 
  Zap, 
  ChevronRight, 
  History,
  Crown,
  Medal,
  Timer
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  MOCK_ACHIEVEMENTS, 
  MOCK_LEADERBOARD, 
  MOCK_CHALLENGES, 
  MOCK_STAFF_GAMIFICATION 
} from "@/lib/logic/gamification-utils";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { fastApiService } from '@/lib/fastapi-service';

const iconMap: Record<string, any> = {
  Trophy, Star, Brain, Users, TrendingUp, Target, Award, Zap
};

export default function StaffGamificationPage() {
  const [activeTab, setActiveTab] = useState<'leaderboard' | 'challenges' | 'achievements'>('leaderboard');
  const [leaderboardData, setLeaderboardData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const data = await fastApiService.getLeaderboard('BRAND-XYZ');
        if (data && data.length > 0) {
          setLeaderboardData(data);
        } else {
          setLeaderboardData(MOCK_LEADERBOARD);
        }
      } catch (e) {
        console.error("Failed to load leaderboard from FastAPI:", e);
        setLeaderboardData(MOCK_LEADERBOARD);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  return (
    <>
      <div className="container mx-auto px-4 py-6 space-y-6 max-w-6xl animate-in fade-in duration-700">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 border-b border-slate-100 pb-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
            <Link href="/shop" className="hover:text-indigo-600 transition-colors">Магазин</Link>
            <ChevronRight className="h-3 w-3" />
            <span className="text-indigo-600">Staff Gamification</span>
          </div>
          <h1 className="text-sm font-bold tracking-tight text-slate-900 uppercase">
            Мотивация & Награды
          </h1>
          <p className="text-[13px] text-slate-500 font-medium">Система геймификации персонала Syntha Retail.</p>
        </div>
        <div className="flex items-center gap-3">
          <Card className="px-3 py-1.5 border border-indigo-100 shadow-sm bg-indigo-50 flex items-center gap-3 rounded-xl">
            <div className="h-7 w-7 rounded-lg bg-indigo-600 flex items-center justify-center text-white shadow-md">
              <Zap className="h-3.5 w-3.5" />
            </div>
            <div>
              <p className="text-[8px] font-bold uppercase text-indigo-400 leading-none tracking-wider">Ваш Баланс</p>
              <p className="text-[13px] font-bold text-indigo-900">{MOCK_STAFF_GAMIFICATION.totalPoints} <span className="text-[10px]">SP</span></p>
            </div>
          </Card>
          <Button className="h-8 rounded-lg bg-slate-900 hover:bg-indigo-600 text-white font-bold uppercase text-[10px] tracking-wider transition-all shadow-md px-4">
            Магазин Бонусов
          </Button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
        {/* Left Column: Personal Profile & Achievements */}
        <div className="space-y-6">
          <Card className="rounded-xl border border-slate-100 shadow-sm bg-white overflow-hidden hover:shadow-md transition-all">
            <CardHeader className="bg-slate-900 text-white p-4 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-[0.05] group-hover:scale-110 transition-transform duration-700"><Trophy className="h-24 w-24" /></div>
              <div className="flex items-center gap-3 relative z-10">
                <Avatar className="h-10 w-10 border-2 border-white/20 shadow-xl">
                  <AvatarImage src={MOCK_LEADERBOARD[0].avatar} />
                  <AvatarFallback>AK</AvatarFallback>
                </Avatar>
                <div className="space-y-0.5">
                  <h3 className="text-base font-bold tracking-tight">Анна Кузнецова</h3>
                  <p className="text-[10px] text-white/50 font-bold uppercase tracking-wider">Уровень {MOCK_STAFF_GAMIFICATION.level}</p>
                </div>
              </div>
              <div className="mt-5 space-y-2 relative z-10">
                <div className="flex justify-between text-[9px] font-bold uppercase tracking-wider text-indigo-300">
                  <span>До уровня {MOCK_STAFF_GAMIFICATION.level + 1}</span>
                  <span>{MOCK_STAFF_GAMIFICATION.nextLevelProgress}%</span>
                </div>
                <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden shadow-inner">
                  <div className="h-full bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.6)]" style={{ width: `${MOCK_STAFF_GAMIFICATION.nextLevelProgress}%` }} />
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-4 space-y-6">
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 shadow-inner group/stat">
                  <p className="text-[9px] font-bold uppercase text-slate-400 mb-1 tracking-wider group-hover/stat:text-slate-500 transition-colors">Рейтинг</p>
                  <p className="text-base font-bold text-slate-900 tracking-tight">#1 <span className="text-[10px] text-emerald-600 uppercase ml-1">Top</span></p>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 shadow-inner group/stat">
                  <p className="text-[9px] font-bold uppercase text-slate-400 mb-1 tracking-wider group-hover/stat:text-slate-500 transition-colors">Сделок</p>
                  <p className="text-base font-bold text-slate-900 tracking-tight">124 <span className="text-[10px] text-indigo-600 uppercase ml-1">Units</span></p>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2 px-1">
                  <Award className="h-3.5 w-3.5" /> Последние Награды
                </h4>
                <div className="grid grid-cols-3 gap-2">
                  {MOCK_STAFF_GAMIFICATION.achievements.map((ach) => {
                    const Icon = iconMap[ach.icon] || Trophy;
                    return (
                      <div key={ach.id} className="aspect-square rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center group cursor-help relative hover:bg-indigo-50 hover:border-indigo-100 transition-all shadow-sm" title={ach.title}>
                        <Icon className="h-6 w-6 text-slate-400 group-hover:text-indigo-600 transition-transform group-hover:scale-110" />
                        <div className="absolute -top-1 -right-1 h-3.5 w-3.5 rounded-full bg-emerald-500 border-2 border-white shadow-sm" />
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-50 space-y-4">
                <h4 className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2 px-1">
                  <History className="h-3.5 w-3.5" /> История Активности
                </h4>
                <div className="space-y-3">
                  {MOCK_STAFF_GAMIFICATION.history.map((h) => (
                    <div key={h.id} className="flex justify-between items-center p-2.5 rounded-lg bg-slate-50/50 border border-slate-100 hover:bg-white hover:shadow-sm transition-all">
                      <div className="space-y-0.5">
                        <p className="text-[11px] font-bold text-slate-700 leading-tight">{h.action}</p>
                        <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">{h.date}</p>
                      </div>
                      <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">+{h.points} SP</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Center & Right Column: Leaderboard, Challenges */}
        <div className="lg:col-span-2 space-y-6">
          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)} className="w-full">
            <div className="flex items-center justify-between mb-6 bg-slate-100 p-1 rounded-xl border border-slate-200 shadow-inner">
              <TabsList className="bg-transparent h-8 p-0 gap-1">
                <TabsTrigger 
                  value="leaderboard"
                  className="px-6 h-7 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all data-[state=active]:bg-white data-[state=active]:text-indigo-600 data-[state=active]:shadow-sm"
                >
                  Рейтинг
                </TabsTrigger>
                <TabsTrigger 
                  value="challenges"
                  className="px-6 h-7 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all data-[state=active]:bg-white data-[state=active]:text-indigo-600 data-[state=active]:shadow-sm"
                >
                  Челленджи
                </TabsTrigger>
                <TabsTrigger 
                  value="achievements"
                  className="px-6 h-7 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all data-[state=active]:bg-white data-[state=active]:text-indigo-600 data-[state=active]:shadow-sm"
                >
                  Награды
                </TabsTrigger>
              </TabsList>
              <div className="hidden md:flex items-center gap-2 text-[9px] font-bold uppercase text-slate-400 px-3">
                <Timer className="h-3 w-3" /> Сезон: <span className="text-rose-500">14 дней</span>
              </div>
            </div>

            <TabsContent value="leaderboard">
              <Card className="rounded-xl border border-slate-100 shadow-sm bg-white overflow-hidden animate-in fade-in duration-500 hover:shadow-md transition-all">
                <div className="divide-y divide-slate-50">
                  {leaderboardData.map((entry, i) => (
                    <div key={entry.id || entry.staff_id} className="p-4 flex items-center gap-3 hover:bg-slate-50/50 transition-colors group">
                      <div className="flex flex-col items-center justify-center w-8">
                        {i === 0 ? <Crown className="h-4.5 w-4.5 text-amber-500 mb-0.5" /> : <span className="text-[15px] font-bold text-slate-300 uppercase tracking-tight">#{i + 1}</span>}
                        <div className={cn(
                          "h-1.5 w-1.5 rounded-full mt-1",
                          entry.trend === 'up' || entry.points > 1000 ? "bg-emerald-500 animate-pulse" : entry.trend === 'down' ? "bg-rose-500" : "bg-slate-300"
                        )} />
                      </div>
                      
                      <Avatar className="h-10 w-10 border-2 border-white shadow-md transition-transform group-hover:scale-105">
                        <AvatarImage src={entry.avatar || `https://i.pravatar.cc/150?u=${entry.staff_id}`} />
                        <AvatarFallback className="text-[10px] font-bold">{(entry.name || entry.staff_id).slice(0, 2)}</AvatarFallback>
                      </Avatar>

                      <div className="flex-1 min-w-0">
                        <h4 className="text-[13px] font-bold text-slate-900 group-hover:text-indigo-600 transition-colors truncate tracking-tight">{entry.name || entry.staff_id}</h4>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{entry.position || entry.rank_title}</p>
                      </div>

                      <div className="hidden md:block text-right px-5 border-x border-slate-50">
                        <p className="text-[8px] font-bold uppercase text-slate-400 mb-0.5 tracking-wider">Продажи</p>
                        <p className="text-[13px] font-bold text-slate-700 tabular-nums">{(entry.salesVolume || entry.sales_count * 12000).toLocaleString('ru-RU')} ₽</p>
                      </div>

                      <div className="text-right min-w-[90px]">
                        <p className="text-[8px] font-bold uppercase text-indigo-400 mb-0.5 tracking-wider">Syntha Points</p>
                        <p className="text-sm font-bold text-indigo-600 tabular-nums">{entry.points}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="challenges">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 animate-in fade-in slide-in-from-bottom-2 duration-500">
                {MOCK_CHALLENGES.map((challenge) => (
                  <Card key={challenge.id} className="rounded-xl border border-slate-100 shadow-sm bg-white p-3 relative overflow-hidden group hover:border-indigo-200 transition-all hover:shadow-md">
                    <div className="absolute -right-4 -bottom-4 opacity-[0.03] group-hover:scale-110 transition-transform duration-700">
                      <Target className="w-20 h-20 text-slate-900" />
                    </div>
                    <div className="flex justify-between items-start mb-4 relative z-10">
                      <Badge className={cn(
                        "rounded-md px-2 h-5 text-[9px] font-bold uppercase tracking-wider border-none shadow-sm",
                        challenge.category === 'personal' ? "bg-indigo-50 text-indigo-600" : "bg-emerald-50 text-emerald-600"
                      )}>
                        {challenge.category}
                      </Badge>
                      <div className="text-right">
                        <p className="text-[8px] font-bold uppercase text-slate-400 mb-0.5 tracking-wider">Награда</p>
                        <p className="text-[13px] font-bold text-emerald-600">+{challenge.rewardPoints} SP</p>
                      </div>
                    </div>
                    <h4 className="text-[15px] font-bold uppercase tracking-tight text-slate-900 group-hover:text-indigo-600 transition-colors mb-1.5">{challenge.title}</h4>
                    <p className="text-[11px] text-slate-500 font-medium leading-relaxed mb-5 line-clamp-2">{challenge.description}</p>
                    
                    <div className="space-y-2 relative z-10">
                      <div className="flex justify-between text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        <span>Прогресс</span>
                        <span className="text-slate-600">{challenge.current} / {challenge.target}</span>
                      </div>
                      <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden shadow-inner">
                        <div className="h-full bg-indigo-600 transition-all duration-1000" style={{ width: `${(challenge.current / challenge.target) * 100}%` }} />
                      </div>
                    </div>

                    <div className="mt-5 pt-4 border-t border-slate-50 flex items-center justify-between relative z-10">
                      <div className="flex items-center gap-1.5 text-[9px] font-bold text-rose-500 uppercase tracking-wider bg-rose-50 px-2 py-0.5 rounded-md">
                        <Timer className="h-3 w-3" /> {challenge.endsAt}
                      </div>
                      <Button variant="ghost" className="h-7 px-2.5 rounded-md text-[10px] font-bold uppercase text-slate-400 hover:text-indigo-600 hover:bg-white hover:shadow-sm transition-all tracking-wider">
                        Детали <ChevronRight className="h-3 w-3 ml-1" />
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="achievements">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 animate-in fade-in duration-500">
                {MOCK_ACHIEVEMENTS.map((ach) => {
                  const Icon = iconMap[ach.icon] || Trophy;
                  const isUnlocked = !!ach.unlockedAt;
                  return (
                    <Card key={ach.id} className={cn(
                      "rounded-xl border shadow-sm p-3 text-center transition-all group",
                      isUnlocked ? "bg-white border-slate-100 hover:border-indigo-200 hover:shadow-md" : "bg-slate-50 border-transparent grayscale opacity-50"
                    )}>
                      <div className={cn(
                        "h-12 w-12 rounded-lg mx-auto mb-3.5 flex items-center justify-center shadow-md transition-transform group-hover:scale-110",
                        isUnlocked ? "bg-indigo-600 text-white" : "bg-slate-200 text-slate-400"
                      )}>
                        <Icon className="h-6 w-6" />
                      </div>
                      <h5 className="text-[11px] font-bold uppercase tracking-wider text-slate-900 group-hover:text-indigo-600 transition-colors mb-1">{ach.title}</h5>
                      <p className="text-[10px] text-slate-400 font-medium leading-tight mb-4 line-clamp-2">{ach.description}</p>
                      {isUnlocked ? (
                        <div className="pt-3 border-t border-slate-50">
                          <p className="text-[9px] font-bold uppercase text-emerald-600 bg-emerald-50 inline-block px-2 py-0.5 rounded-md">{ach.unlockedAt}</p>
                        </div>
                      ) : (
                        <div className="pt-3 border-t border-slate-100">
                          <p className="text-[9px] font-bold uppercase text-slate-400">Награда: {ach.points} SP</p>
                        </div>
                      )}
                    </Card>
                  );
                })}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
    </>
  );
}

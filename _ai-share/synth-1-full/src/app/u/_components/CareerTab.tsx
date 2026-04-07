'use client';

import React, { useState } from 'react';
import { 
  Briefcase, FileText, Plus, Image as ImageIcon, 
  Pencil, Trash2, ExternalLink, Globe, GraduationCap, 
  Award, Sparkles, CheckCircle2, Search, Users, Camera,
  MapPin, Clock, DollarSign, Brain, Target, TrendingUp,
  Instagram, Share2, ShieldCheck, Zap
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import Link from 'next/link';

interface CareerTabProps {
  user: any;
}

export function CareerTab({ user }: CareerTabProps) {
  const [isEditing, setIsClientEditing] = useState(false);
  const [profile, setProfile] = useState({
    role: 'Fashion Designer / Creative Director',
    bio: 'Специализируюсь на создании коллекций из переработанных материалов. Работала с крупными домами моды в Италии. Ищу возможности для коллабораций и долгосрочных контрактов.',
    experience: '8 лет',
    location: 'Милан / Москва',
    education: 'Istituto Marangoni, Milan',
    skills: ['Luxury', 'Sustainable', 'Couture', '3D Design', 'Fabric Sourcing'],
    portfolio: [
      { id: 1, title: 'Summer Capsule 24', image: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?q=80&w=400' },
      { id: 2, title: 'Nordic Wool Project', image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=400' },
      { id: 3, title: 'Milan Fashion Week 23', image: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?q=80&w=400' }
    ],
    lookingFor: ['Постоянная работа', 'Фриланс проекты', 'Коллаборации'],
    status: 'active_search' // 'active_search', 'open_for_offers', 'not_looking'
  });

  return (
    <div className="py-6 animate-in fade-in-50 duration-300 outline-none">
      <div className="space-y-4">
        {/* Career Header & Controls */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-white p-4 rounded-xl border shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-5">
            <Briefcase className="h-32 w-32 rotate-12" />
          </div>
          <div className="space-y-2 relative z-10">
            <div className="flex items-center gap-3">
              <h2 className="text-base font-black uppercase tracking-tight">Профессиональный Профиль</h2>
              <Badge className={cn(
                "border-none text-[8px] font-black uppercase px-2 py-0.5",
                profile.status === 'active_search' ? "bg-emerald-500 text-white" : "bg-blue-500 text-white"
              )}>
                {profile.status === 'active_search' ? 'В активном поиске' : 'Открыт к предложениям'}
              </Badge>
            </div>
            <p className="text-muted-foreground font-medium max-w-2xl">
              Управляйте вашим резюме и портфолио в экосистеме Syntha. Ваш профиль доступен для поиска брендам, магазинам и агентствам.
            </p>
          </div>
          <div className="flex gap-3 relative z-10">
            <Button asChild variant="outline" className="rounded-2xl h-12 px-6 font-black text-xs uppercase tracking-widest hover:bg-white hover:border-slate-900 transition-all">
              <Link href="/shop/career">
                <Search className="mr-2 h-4 w-4" />
                Биржа Талантов
              </Link>
            </Button>
            <Button 
              onClick={() => setIsClientEditing(!isEditing)}
              className="button-glimmer button-professional !bg-black hover:!bg-black shadow-xl shadow-slate-200/50 border-none px-8 h-12 rounded-2xl font-black text-xs uppercase tracking-widest"
            >
              {isEditing ? 'Сохранить изменения' : (
                <>
                  <Pencil className="mr-2 h-4 w-4" />
                  Редактировать
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Social Influence & Collaborative Power */}
        <Card className="rounded-xl border-none shadow-2xl bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white overflow-hidden relative">
          <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
            <Instagram className="h-64 w-64 rotate-12" />
          </div>
          <CardContent className="p-3 space-y-10 relative z-10">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-white/10 flex items-center justify-center">
                    <Sparkles className="h-5 w-5 text-amber-400" />
                  </div>
                  <Badge className="bg-indigo-500 text-white border-none text-[8px] font-black uppercase tracking-widest px-2">Influencer Tier: Macro</Badge>
                </div>
                <h3 className="text-base font-black uppercase tracking-tight">Влияние и Коллаборации</h3>
                <p className="text-white/50 font-medium max-w-xl text-sm leading-relaxed">
                  Ваши охваты в соцсетях синхронизированы с Syntha. Бренды видят ваш потенциал и могут предлагать прямые контракты на рекламу и создание контента.
                </p>
              </div>
              <div className="flex items-center gap-3 bg-white/5 p-4 rounded-xl border border-white/10 backdrop-blur-xl">
                <div className="text-center px-4 border-r border-white/10">
                  <p className="text-sm font-black">12.4K</p>
                  <p className="text-[8px] font-black uppercase text-white/40 tracking-widest">Followers</p>
                </div>
                <div className="text-center px-4">
                  <p className="text-sm font-black text-indigo-400">4.8%</p>
                  <p className="text-[8px] font-black uppercase text-white/40 tracking-widest">Eng. Rate</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="bg-white/5 rounded-3xl p-4 border border-white/10 space-y-4 hover:bg-white/10 transition-colors cursor-pointer group">
                <div className="flex items-center justify-between">
                  <div className="h-10 w-10 rounded-xl bg-rose-500/20 flex items-center justify-center text-rose-400 group-hover:scale-110 transition-transform">
                    <Instagram className="h-5 w-5" />
                  </div>
                  <Badge className="bg-emerald-500 text-white border-none text-[7px] font-black uppercase">Synced</Badge>
                </div>
                <p className="text-[10px] font-black uppercase tracking-widest text-white/40">Market Value</p>
                <p className="text-base font-black">~45,000 ₽ <span className="text-[10px] text-white/30 font-bold uppercase tracking-normal">/ post</span></p>
              </div>

              <div className="bg-white/5 rounded-3xl p-4 border border-white/10 space-y-4 hover:bg-white/10 transition-colors cursor-pointer group">
                <div className="flex items-center justify-between">
                  <div className="h-10 w-10 rounded-xl bg-indigo-500/20 flex items-center justify-center text-indigo-400 group-hover:scale-110 transition-transform">
                    <Zap className="h-5 w-5" />
                  </div>
                  <Badge className="bg-amber-500 text-white border-none text-[7px] font-black uppercase">3 Active Offers</Badge>
                </div>
                <p className="text-[10px] font-black uppercase tracking-widest text-white/40">Partnership Status</p>
                <p className="text-base font-black italic">Open for Drops</p>
              </div>

              <div className="bg-indigo-600 rounded-3xl p-4 space-y-4 shadow-xl shadow-indigo-900/20 hover:bg-indigo-500 transition-all cursor-pointer group">
                <div className="flex items-center justify-between">
                  <div className="h-10 w-10 rounded-xl bg-white/20 flex items-center justify-center text-white group-hover:scale-110 transition-transform">
                    <ShieldCheck className="h-5 w-5" />
                  </div>
                  <div className="h-2 w-2 rounded-full bg-white animate-pulse" />
                </div>
                <p className="text-[10px] font-black uppercase tracking-widest text-white/60">Syntha Privileges</p>
                <p className="text-base font-black">Elite Status</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3">
          {/* Main Info (Left Column) */}
          <div className="lg:col-span-8 space-y-4">
            {/* Professional Summary */}
            <Card className="rounded-xl border-none shadow-sm bg-white overflow-hidden">
              <CardHeader className="p-4 pb-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600">
                    <FileText className="h-5 w-5" />
                  </div>
                  <CardTitle className="text-base font-black uppercase tracking-tight">Резюме и Опыт</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-4 pt-0 space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Желаемая роль</label>
                    {isEditing ? (
                      <Input value={profile.role} onChange={(e) => setProfile({...profile, role: e.target.value})} className="rounded-xl border-slate-200" />
                    ) : (
                      <p className="text-sm font-black text-slate-900">{profile.role}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">О себе и целях</label>
                    {isEditing ? (
                      <Textarea value={profile.bio} onChange={(e) => setProfile({...profile, bio: e.target.value})} className="rounded-xl border-slate-200 min-h-[120px]" />
                    ) : (
                      <p className="text-sm text-slate-600 font-medium leading-relaxed italic border-l-2 border-indigo-500/20 pl-4">
                        {profile.bio}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-4">
                  {[
                    { icon: Clock, label: 'Опыт работы', value: profile.experience, key: 'experience' },
                    { icon: MapPin, label: 'Локация', value: profile.location, key: 'location' },
                    { icon: GraduationCap, label: 'Образование', value: profile.education, key: 'education' },
                    { icon: Target, label: 'Интересы', value: profile.lookingFor.join(', '), key: 'lookingFor' }
                  ].map((item, i) => (
                    <div key={i} className="space-y-1">
                      <div className="flex items-center gap-2 text-[10px] font-black uppercase text-muted-foreground tracking-widest">
                        <item.icon className="h-3 w-3" />
                        {item.label}
                      </div>
                      <p className="text-sm font-bold text-slate-900">{item.value}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Portfolio Grid */}
            <Card className="rounded-xl border-none shadow-sm bg-white overflow-hidden">
              <CardHeader className="p-4 pb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600">
                      <ImageIcon className="h-5 w-5" />
                    </div>
                    <CardTitle className="text-base font-black uppercase tracking-tight">Портфолио</CardTitle>
                  </div>
                  <Button variant="outline" size="sm" className="rounded-xl border-slate-200 h-10 px-4 text-[10px] font-black uppercase tracking-widest">
                    <Plus className="mr-2 h-3 w-3" /> Добавить работу
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-4 pt-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {profile.portfolio.map((item) => (
                    <div key={item.id} className="group relative aspect-[4/5] rounded-2xl overflow-hidden bg-slate-100 cursor-pointer">
                      <img src={item.image} alt={item.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4">
                        <p className="text-white text-[10px] font-black uppercase tracking-widest mb-1">{item.title}</p>
                        <div className="flex gap-2">
                          <Button size="icon" variant="secondary" className="h-8 w-8 rounded-lg bg-white/20 backdrop-blur-md border-none text-white hover:bg-white hover:text-black">
                            <ExternalLink className="h-3.5 w-3.5" />
                          </Button>
                          <Button size="icon" variant="destructive" className="h-8 w-8 rounded-lg border-none">
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                  <div className="aspect-[4/5] rounded-2xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center gap-3 text-slate-400 hover:border-indigo-500 hover:text-indigo-500 transition-all cursor-pointer bg-slate-50/50">
                    <Plus className="h-8 w-8" />
                    <span className="text-[10px] font-black uppercase tracking-widest">Загрузить проект</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar (Right Column) */}
          <div className="lg:col-span-4 space-y-4">
            {/* AI Career Insights */}
            <Card className="rounded-xl bg-slate-900 text-white p-4 space-y-4 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <Brain className="h-24 w-24" />
              </div>
              <div className="space-y-2 relative z-10">
                <Badge className="bg-accent text-white uppercase text-[8px] font-black border-none mb-2 px-2 py-0.5">Neural_HR</Badge>
                <h4 className="text-sm font-black uppercase tracking-tight">AI Карьерный Помощник</h4>
                <p className="text-[11px] text-white/50 leading-relaxed font-medium">Анализ рынка на основе ваших навыков и опыта FW26</p>
              </div>
              
              <div className="space-y-6 relative z-10">
                {[
                  { label: 'Market Demand', value: 'Высокий (Top 5%)', icon: TrendingUp },
                  { label: 'Match Score', value: '94% соответствие', icon: Target },
                  { label: 'Profile Visibility', value: '840 просмотров/мес', icon: Users }
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-accent">
                      <item.icon className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-[9px] font-black uppercase text-white/40 leading-none mb-1">{item.label}</p>
                      <p className="text-sm font-bold uppercase tracking-tight">{item.value}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-4 border-t border-white/10 relative z-10">
                <div className="p-3 rounded-2xl bg-accent/10 border border-accent/20">
                  <p className="text-[9px] font-black uppercase text-accent mb-2 flex items-center gap-2"><Sparkles className="h-3 w-3" /> Рекомендация</p>
                  <p className="text-[11px] text-white/80 font-medium leading-relaxed italic">
                    «Ваш опыт работы с кашемиром востребован у 12 брендов в этом месяце. Обновите портфолио работами SS25 для повышения видимости.»
                  </p>
                </div>
              </div>
            </Card>

            {/* Verification Status */}
            <Card className="rounded-xl border-none shadow-sm bg-white p-4 space-y-6">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
                  <CheckCircle2 className="h-5 w-5" />
                </div>
                <h4 className="text-sm font-black uppercase tracking-tight">Верификация</h4>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <div className="flex items-center gap-3">
                    <Globe className="h-4 w-4 text-slate-400" />
                    <span className="text-xs font-bold uppercase tracking-tight">Identity Hub</span>
                  </div>
                  <Badge className="bg-emerald-500 border-none text-[8px] uppercase">Verified</Badge>
                </div>
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <div className="flex items-center gap-3">
                    <Award className="h-4 w-4 text-slate-400" />
                    <span className="text-xs font-bold uppercase tracking-tight">Case Reviews</span>
                  </div>
                  <Badge className="bg-slate-200 text-slate-500 border-none text-[8px] uppercase">Pending</Badge>
                </div>
              </div>
              <Button variant="outline" className="w-full h-12 rounded-2xl text-[10px] font-black uppercase tracking-widest border-2">Пройти аттестацию</Button>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

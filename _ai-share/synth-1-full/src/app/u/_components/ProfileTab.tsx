'use client';

import { 
    User, Ruler, Smartphone, MapPin, Palette, ShieldCheck, 
    Zap, Sparkles, Brain, Target, Heart, Eye, ShoppingBag, 
    Trophy, Activity, Fingerprint, Info, ArrowRight, Check,
    Clock, Scale, Truck, Undo2, Star, Share2, Plus, Users
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from 'next/link';
import ProfileForm from '../../../components/user/profile-form';
import LoyaltyCard from '../../../components/user/loyalty-card';

interface ProfileTabProps {
    profileSubTab: string;
    setProfileSubTab: (v: 'profile' | 'familySync' | 'measurements' | 'productPrefs' | 'audit') => void;
    user: any;
}

export function ProfileTab({
    profileSubTab,
    setProfileSubTab,
    user
}: ProfileTabProps) {
    const profileData = {
        body: { height: '172 см', weight: '60 кг', type: 'Песочные часы', confidence: 98 },
        interests: {
            categories: ['Minimalism', 'Quiet Luxury', 'Techwear'],
            brands: ['Nordic Wool', 'Syntha Lab', 'Studio 29'],
            colors: ['#000000', '#F6F2EC', '#C9B9A6']
        },
        styleDNA: {
            primary: 'Minimalism',
            secondary: 'Heritage',
            match: 94
        }
    };

    return (
        <TabsContent value="profile" className="py-0 animate-in fade-in-50 duration-300">
            <div className="space-y-4">
                <Tabs value={profileSubTab} onValueChange={(v) => setProfileSubTab(v as any)}>
                    <TabsList className="w-full justify-start flex-wrap bg-slate-100 p-1 rounded-xl border border-slate-200 shadow-inner">
                        {[
                            { value: 'profile', icon: User, label: 'Profile' },
                            { value: 'measurements', icon: Ruler, label: 'Biometrics' },
                            { value: 'familySync', icon: Users, label: 'Family' },
                            { value: 'productPrefs', icon: Palette, label: 'Preferences' },
                            { value: 'audit', icon: Activity, label: 'Audit' },
                        ].map((t) => (
                            <TabsTrigger 
                                key={t.value}
                                value={t.value} 
                                className="rounded-lg px-4 h-7 text-[9px] font-bold uppercase tracking-widest transition-all data-[state=active]:bg-white data-[state=active]:text-indigo-600 data-[state=active]:shadow-sm data-[state=active]:border border-transparent"
                            >
                                <t.icon className="h-3.5 w-3.5 mr-2" /> {t.label}
                            </TabsTrigger>
                        ))}
                    </TabsList>
                </Tabs>

                {profileSubTab === 'profile' && (
                    <div className="space-y-4">
                        {/* Welcome & Loyalty Overview */}
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3">
                            <div className="lg:col-span-8 space-y-4">
                                <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm space-y-4 hover:border-indigo-100 transition-all">
                                    <div className="flex items-center justify-between">
                                        <div className="space-y-0.5">
                                            <div className="flex items-center gap-2">
                                                <h2 className="text-base font-bold font-headline tracking-tighter uppercase text-slate-900 leading-none">
                                                    {user?.displayName || 'Identity Profile'}
                                                </h2>
                                                <Badge variant="outline" className="bg-emerald-50 text-emerald-600 border-emerald-100 text-[7px] font-bold uppercase px-1.5 h-4 gap-1 tracking-widest shadow-sm transition-all">
                                                   <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" /> SYNCED: ACTIVE
                                                </Badge>
                                            </div>
                                            <p className="text-[11px] text-slate-400 font-bold uppercase tracking-tight opacity-70">Digital Identity Core synchronized with Syntha Neural Engine.</p>
                                        </div>
                                    </div>
                                    <div className="flex flex-wrap gap-3 pt-2">
                                        <div className="px-3 py-1.5 bg-slate-50 rounded-lg border border-slate-100 space-y-1 shadow-inner">
                                            <p className="text-[7px] font-bold text-slate-400 uppercase tracking-widest leading-none">Last Core Sync</p>
                                            <p className="text-[10px] font-bold text-slate-900 uppercase">Today, 12:45</p>
                                        </div>
                                        <div className="px-3 py-1.5 bg-slate-50 rounded-lg border border-slate-100 space-y-1 shadow-inner">
                                            <p className="text-[7px] font-bold text-slate-400 uppercase tracking-widest leading-none">Neural Precision</p>
                                            <p className="text-[10px] font-bold text-emerald-600 uppercase">98.4% Verified</p>
                                        </div>
                                    </div>
                                </div>
                                <LoyaltyCard />
                            </div>

                            {/* Style DNA Widget */}
                            <Card className="lg:col-span-4 rounded-xl bg-slate-900 text-white p-4 space-y-6 shadow-xl relative overflow-hidden flex flex-col justify-between group">
                                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity duration-700">
                                    <Fingerprint className="h-32 w-32 rotate-12" />
                                </div>
                                <div className="space-y-1.5 relative z-10">
                                    <div className="flex items-center justify-between mb-4">
                                        <Badge className="bg-indigo-600 text-white uppercase text-[7px] font-bold tracking-widest border-none px-2 h-4 shadow-lg">Neural_Core</Badge>
                                        <Sparkles className="h-3.5 w-3.5 text-indigo-400" />
                                    </div>
                                    <h4 className="text-sm font-bold uppercase tracking-tighter italic text-white leading-none">Identity Style DNA</h4>
                                    <p className="text-[10px] text-slate-400 leading-relaxed font-bold uppercase tracking-tight italic opacity-80">Unique stylistic imprint calculated across 124 biometric parameters.</p>
                                </div>
                                
                                <div className="space-y-4 relative z-10 py-4">
                                    <div className="space-y-2">
                                        <div className="flex justify-between text-[9px] font-bold uppercase tracking-widest">
                                            <span className="text-white">{profileData.styleDNA.primary}</span>
                                            <span className="text-indigo-400 italic">{profileData.styleDNA.match}% Precision</span>
                                        </div>
                                        <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden shadow-inner">
                                            <div className="h-full bg-indigo-500 shadow-[0_0_8px_rgba(79,70,229,0.5)] transition-all duration-1000" style={{ width: `${profileData.styleDNA.match}%` }} />
                                        </div>
                                    </div>
                                    <div className="flex flex-wrap gap-1.5">
                                        {profileData.interests.categories.map(c => (
                                            <Badge key={c} className="bg-white/5 border border-white/10 text-[7px] font-bold uppercase px-1.5 h-3.5 tracking-widest shadow-sm">{c}</Badge>
                                        ))}
                                    </div>
                                </div>

                                <Button className="w-full rounded-lg h-8 bg-white text-slate-900 hover:bg-indigo-600 hover:text-white font-bold uppercase text-[9px] tracking-widest transition-all relative z-10 shadow-lg border-none">
                                    Broadcast DNA <Share2 className="ml-2 h-3 w-3" />
                                </Button>
                            </Card>
                        </div>

                        {/* Measurements & Details Row */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                            <Card className="rounded-xl border border-slate-100 shadow-sm bg-white p-3 space-y-4 hover:border-indigo-100 transition-all group">
                                <div className="flex items-center justify-between border-b border-slate-50 pb-2.5 px-1">
                                    <h3 className="text-[10px] font-bold uppercase tracking-widest text-slate-700 italic flex items-center gap-2">
                                        <Ruler className="h-3.5 w-3.5 text-indigo-600" /> Biometric Profile
                                    </h3>
                                    <div className="h-1.5 w-1.5 rounded-full bg-indigo-500 animate-pulse" />
                                </div>
                                <div className="space-y-3 px-1">
                                    {[
                                        { label: "Height Index", val: profileData.body.height },
                                        { label: "Mass Index", val: profileData.body.weight },
                                        { label: "Anatomy Type", val: profileData.body.type },
                                    ].map((m, i) => (
                                        <div key={i} className="flex justify-between items-center group/item p-2 rounded-lg hover:bg-slate-50 transition-all border border-transparent hover:border-slate-100">
                                            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.15em] group-hover/item:text-indigo-600 transition-colors">{m.label}</span>
                                            <span className="text-xs font-bold text-slate-900 uppercase tracking-tight tabular-nums">{m.val}</span>
                                        </div>
                                    ))}
                                </div>
                                <Button variant="ghost" className="w-full h-7 text-[8px] font-bold uppercase tracking-widest text-slate-400 hover:text-indigo-600 transition-all hover:bg-indigo-50" onClick={() => setProfileSubTab('measurements')}>
                                    Update Biometrics <ArrowRight className="ml-1.5 h-3 w-3" />
                                </Button>
                            </Card>

                            <Card className="rounded-xl border border-slate-100 shadow-sm bg-white p-3 space-y-4 hover:border-indigo-100 transition-all group">
                                <div className="flex items-center justify-between border-b border-slate-50 pb-2.5 px-1">
                                    <h3 className="text-[10px] font-bold uppercase tracking-widest text-slate-700 italic flex items-center gap-2">
                                        <Palette className="h-3.5 w-3.5 text-indigo-600" /> Chromatic Matrix
                                    </h3>
                                    <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                </div>
                                <div className="flex flex-wrap gap-2 pt-1 px-1">
                                    {profileData.interests.colors.map(color => (
                                        <div key={color} className="h-8 w-8 rounded-lg border-2 border-white shadow-md hover:scale-110 transition-transform cursor-pointer ring-1 ring-slate-100" style={{ backgroundColor: color }} />
                                    ))}
                                    <div className="h-8 w-8 rounded-lg border-2 border-dashed border-slate-100 flex items-center justify-center text-slate-300 hover:border-indigo-100 hover:text-indigo-600 transition-all cursor-pointer">
                                        <Plus className="h-3.5 w-3.5" />
                                    </div>
                                </div>
                                <p className="text-[9px] text-slate-400 font-bold uppercase tracking-tight italic leading-relaxed opacity-70 px-1">Neural-optimized palette with 85% success probability for your genotype.</p>
                            </Card>

                            <Card className="rounded-xl border border-slate-100 shadow-sm bg-white p-3 space-y-4 hover:border-indigo-100 transition-all group">
                                <div className="flex items-center justify-between border-b border-slate-50 pb-2.5 px-1">
                                    <h3 className="text-[10px] font-bold uppercase tracking-widest text-slate-700 italic flex items-center gap-2">
                                        <ShieldCheck className="h-3.5 w-3.5 text-indigo-600" /> Security Protocol
                                    </h3>
                                    <div className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse" />
                                </div>
                                <div className="space-y-2 px-1">
                                    {[
                                        { label: "FaceID Sync", icon: Smartphone, status: "Active" },
                                        { label: "Geo_Targeting", icon: MapPin, status: "Active" },
                                    ].map((s, i) => (
                                        <div key={i} className="flex items-center justify-between p-2 bg-slate-50 rounded-lg border border-slate-100 group/item hover:bg-white hover:border-indigo-100 transition-all shadow-inner">
                                            <div className="flex items-center gap-2">
                                                <s.icon className="h-3 w-3 text-slate-400 group-hover/item:text-indigo-600 transition-colors" />
                                                <span className="text-[9px] font-bold text-slate-900 uppercase tracking-tight">{s.label}</span>
                                            </div>
                                            <Badge className="bg-emerald-50 text-emerald-600 border border-emerald-100 text-[6px] h-3 px-1 uppercase font-bold tracking-widest shadow-sm transition-all">{s.status}</Badge>
                                        </div>
                                    ))}
                                </div>
                                <Button variant="outline" className="w-full h-7 text-[8px] font-bold uppercase tracking-widest border border-slate-200 text-slate-400 hover:text-slate-900 transition-all shadow-sm">Privacy Dashboard</Button>
                            </Card>
                        </div>
                    </div>
                )}

                <ProfileForm
                    user={user}
                    section={profileSubTab as 'profile' | 'measurements' | 'familySync' | 'productPrefs' | 'audit'}
                />
            </div>
        </TabsContent>
    );
}

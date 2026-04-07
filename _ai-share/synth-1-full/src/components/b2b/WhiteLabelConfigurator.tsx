'use client';

import React, { useState } from 'react';
import { 
  Palette, 
  Globe, 
  Image as ImageIcon, 
  Settings2, 
  Save, 
  Eye, 
  Monitor,
  Smartphone,
  Zap,
  Plus,
  Shield
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useB2BState } from '@/providers/b2b-state';
import { cn } from '@/lib/cn';

export function WhiteLabelConfigurator() {
  const { whiteLabelConfigs, updateWhiteLabelConfig } = useB2BState();
  const config = whiteLabelConfigs['brand-1'] || {
    brandId: 'brand-1',
    primaryColor: '#000000',
    secondaryColor: '#ffffff',
    logoUrl: '',
    bannerUrl: ''
  };

  const [activeView, setActiveView] = useState<'desktop' | 'mobile'>('desktop');

  return (
    <div className="space-y-4 p-4 bg-[#fafafa] min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-3">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-xl bg-slate-900 flex items-center justify-center">
              <Settings2 className="h-4 w-4 text-white" />
            </div>
            <Badge variant="outline" className="border-slate-200 text-slate-900 uppercase font-black tracking-widest text-[9px]">
              Custom_Identity_v1.0
            </Badge>
          </div>
          <h2 className="text-sm md:text-sm font-black uppercase tracking-tighter text-slate-900 leading-none">
            Айдентика<br/>Портала Ритейлера
          </h2>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="outline" className="h-12 rounded-2xl border-slate-100 bg-white px-6 font-black uppercase text-[10px] tracking-widest gap-2">
            <Eye className="h-4 w-4" /> Предпросмотр
          </Button>
          <Button className="h-12 bg-indigo-600 text-white rounded-2xl px-8 font-black uppercase text-[10px] tracking-widest gap-2 shadow-xl shadow-indigo-100">
            <Save className="h-4 w-4" /> Сохранить изменения
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3">
        {/* Editor Panel */}
        <div className="lg:col-span-5 space-y-4">
           <Card className="border-none shadow-2xl shadow-slate-200/50 rounded-xl bg-white overflow-hidden">
             <div className="p-3 space-y-10">
                {/* Brand Logo & Identity */}
                <div className="space-y-6">
                   <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-xl bg-slate-50 flex items-center justify-center">
                         <ImageIcon className="h-5 w-5 text-slate-400" />
                      </div>
                      <h3 className="text-base font-black uppercase tracking-tight">Активы бренда</h3>
                   </div>
                   <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-3">
                         <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Основной логотип</p>
                         <div className="aspect-square rounded-3xl bg-slate-50 border-2 border-dashed border-slate-100 flex flex-col items-center justify-center gap-2 hover:border-indigo-300 hover:bg-indigo-50 transition-all cursor-pointer group">
                            <Plus className="h-6 w-6 text-slate-300 group-hover:text-indigo-600" />
                            <span className="text-[8px] font-black uppercase text-slate-400">Загрузить SVG/PNG</span>
                         </div>
                      </div>
                      <div className="space-y-3">
                         <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Главный баннер</p>
                         <div className="aspect-square rounded-3xl bg-slate-50 border-2 border-dashed border-slate-100 flex flex-col items-center justify-center gap-2 hover:border-indigo-300 hover:bg-indigo-50 transition-all cursor-pointer group overflow-hidden relative">
                            <img src={config.bannerUrl} className="absolute inset-0 w-full h-full object-cover opacity-50" />
                            <div className="relative z-10 flex flex-col items-center">
                              <Plus className="h-6 w-6 text-slate-300 group-hover:text-indigo-600" />
                              <span className="text-[8px] font-black uppercase text-slate-400">Сменить обложку</span>
                            </div>
                         </div>
                      </div>
                   </div>
                </div>

                {/* Color Palette */}
                <div className="space-y-6">
                   <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-xl bg-slate-50 flex items-center justify-center">
                         <Palette className="h-5 w-5 text-slate-400" />
                      </div>
                      <h3 className="text-base font-black uppercase tracking-tight">Цвета бренда</h3>
                   </div>
                   <div className="space-y-4">
                      {[
                        { label: 'Основной акцент', value: config.primaryColor, key: 'primaryColor' },
                        { label: 'Фоновый слой', value: config.secondaryColor, key: 'secondaryColor' }
                      ].map((item, i) => (
                        <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-100">
                           <div className="space-y-1">
                              <p className="text-[10px] font-black text-slate-900 uppercase leading-none">{item.label}</p>
                              <p className="text-[9px] font-bold text-slate-400 uppercase">{item.value}</p>
                           </div>
                           <div className="flex items-center gap-3">
                              <input 
                                type="color" 
                                value={item.value} 
                                onChange={(e) => updateWhiteLabelConfig('brand-1', { [item.key as any]: e.target.value })}
                                className="h-10 w-10 rounded-xl border-none bg-transparent cursor-pointer" 
                              />
                              <Input 
                                value={item.value} 
                                onChange={(e) => updateWhiteLabelConfig('brand-1', { [item.key as any]: e.target.value })}
                                className="h-10 w-24 rounded-xl border-slate-100 bg-white text-[10px] font-black font-mono" 
                              />
                           </div>
                        </div>
                      ))}
                   </div>
                </div>

                {/* Advanced Domain */}
                <div className="space-y-6">
                   <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-xl bg-slate-50 flex items-center justify-center">
                         <Globe className="h-5 w-5 text-slate-400" />
                      </div>
                      <h3 className="text-base font-black uppercase tracking-tight">Персональный домен</h3>
                   </div>
                   <div className="space-y-4">
                      <div className="relative">
                        <Input 
                          placeholder="wholesale.yourbrand.ru" 
                          className="h-10 rounded-2xl border-slate-100 bg-slate-50 pl-4 font-bold text-sm"
                        />
                        <div className="absolute right-3 top-1/2 -translate-y-1/2">
                           <Badge className="bg-emerald-50 text-emerald-600 border-none text-[8px] font-black uppercase tracking-widest">Доступен</Badge>
                        </div>
                      </div>
                      <p className="text-[9px] font-medium text-slate-400 leading-relaxed italic">Настройте CNAME-записи, чтобы они указывали на наш защищенный шлюз.</p>
                   </div>
                </div>
             </div>
           </Card>

           <Card className="border-none shadow-2xl shadow-indigo-100/30 rounded-xl bg-slate-900 text-white p-3 space-y-6 overflow-hidden relative">
              <div className="relative z-10 space-y-6">
                <div className="h-12 w-12 rounded-2xl bg-white/10 flex items-center justify-center">
                  <Zap className="h-6 w-6 text-white" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-sm font-black uppercase tracking-tight leading-none">Оптимизация<br/>опыта</h3>
                  <p className="text-white/40 text-[9px] font-bold uppercase tracking-widest leading-relaxed">Повысьте вовлеченность ритейлеров с помощью модулей</p>
                </div>
                <div className="space-y-3">
                   {[
                     { label: 'ИИ-подбор ассортимента', active: true },
                     { label: 'Индикаторы стока в реальном времени', active: true },
                     { label: 'Виджет программы лояльности', active: false }
                   ].map((mod, i) => (
                     <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/10">
                        <span className="text-[10px] font-black uppercase tracking-widest text-white/80">{mod.label}</span>
                        <div className={cn(
                          "h-5 w-10 rounded-full p-1 transition-all",
                          mod.active ? "bg-indigo-600" : "bg-white/10"
                        )}>
                           <div className={cn(
                             "h-3 w-3 rounded-full bg-white transition-all",
                             mod.active ? "translate-x-5" : "translate-x-0"
                           )} />
                        </div>
                     </div>
                   ))}
                </div>
              </div>
              <div className="absolute -right-20 -bottom-20 h-64 w-64 bg-indigo-600/20 blur-[100px] rounded-full" />
           </Card>
        </div>

        {/* Preview Panel */}
        <div className="lg:col-span-7 space-y-4">
           <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 p-1 bg-white border border-slate-100 rounded-2xl shadow-sm">
                 <Button 
                   onClick={() => setActiveView('desktop')}
                   className={cn(
                     "h-10 px-6 rounded-xl font-black uppercase text-[9px] tracking-widest transition-all",
                     activeView === 'desktop' ? "bg-slate-900 text-white" : "text-slate-400"
                   )}
                 >
                   <Monitor className="h-4 w-4 mr-2" /> Десктоп
                 </Button>
                 <Button 
                   onClick={() => setActiveView('mobile')}
                   className={cn(
                     "h-10 px-6 rounded-xl font-black uppercase text-[9px] tracking-widest transition-all",
                     activeView === 'mobile' ? "bg-slate-900 text-white" : "text-slate-400"
                   )}
                 >
                   <Smartphone className="h-4 w-4 mr-2" /> Мобильный
                 </Button>
              </div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Автосохранение активно</p>
           </div>

           <div className={cn(
             "mx-auto transition-all duration-700 ease-in-out relative group",
             activeView === 'desktop' ? "w-full aspect-video" : "w-[340px] aspect-[9/19]"
           )}>
              {/* Mock Browser/Phone Frame */}
              <div className="absolute inset-0 rounded-xl border-[12px] border-slate-900 bg-slate-100 overflow-hidden shadow-2xl ring-1 ring-slate-200">
                 {/* Top Bar */}
                 <div className="h-10 bg-white border-b border-slate-100 flex items-center px-6 justify-between">
                    <div className="flex gap-1.5">
                       <div className="h-2 w-2 rounded-full bg-rose-400" />
                       <div className="h-2 w-2 rounded-full bg-amber-400" />
                       <div className="h-2 w-2 rounded-full bg-emerald-400" />
                    </div>
                    <div className="h-4 w-48 bg-slate-50 rounded-lg border border-slate-100" />
                    <div className="h-4 w-4 rounded-lg bg-slate-50" />
                 </div>

                 {/* Portal Content Preview */}
                 <div className="h-full overflow-hidden flex flex-col" style={{ backgroundColor: config.secondaryColor }}>
                    {/* Portal Header */}
                    <div className="p-4 flex items-center justify-between bg-white border-b border-slate-50 shadow-sm" style={{ borderBottomColor: `${config.primaryColor}10` }}>
                       <div className="h-8 w-24 bg-slate-900 rounded-lg flex items-center justify-center">
                          <span className="text-[10px] font-black text-white uppercase tracking-widest">ВАШ ЛОГО</span>
                       </div>
                       <div className="flex gap-3">
                          {[1,2,3].map(i => <div key={i} className="h-2 w-12 bg-slate-100 rounded" />)}
                       </div>
                    </div>

                    {/* Portal Hero */}
                    <div className="relative h-64 overflow-hidden">
                       <img src={config.bannerUrl} className="w-full h-full object-cover" />
                       <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" />
                       <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4">
                          <Badge style={{ backgroundColor: config.primaryColor }} className="text-white border-none text-[8px] font-black px-3 py-1 uppercase tracking-widest mb-4">Официальный шоурум</Badge>
                          <h4 className="text-sm font-black text-white uppercase tracking-tighter leading-none mb-4">FUTURE_COLLECTION_FW26</h4>
                          <Button style={{ backgroundColor: config.primaryColor }} className="h-10 px-8 rounded-xl text-white font-black uppercase text-[9px] tracking-widest shadow-2xl">Войти в шоурум</Button>
                       </div>
                    </div>

                    {/* Portal Grid */}
                    <div className="p-4 grid grid-cols-2 md:grid-cols-3 gap-3">
                       {[1,2,3].map(i => (
                         <div key={i} className="aspect-[3/4] rounded-2xl bg-white border border-slate-100 shadow-sm p-4 space-y-4">
                            <div className="aspect-square bg-slate-50 rounded-xl" />
                            <div className="space-y-2">
                               <div className="h-2 w-3/4 bg-slate-100 rounded" />
                               <div className="h-2 w-1/2 bg-slate-50 rounded" />
                               <div className="flex justify-between items-center pt-2">
                                  <div className="h-4 w-12 bg-slate-100 rounded" />
                                  <div className="h-6 w-6 rounded-lg" style={{ backgroundColor: config.primaryColor }} />
                               </div>
                            </div>
                         </div>
                       ))}
                    </div>
                 </div>
              </div>
           </div>

           <div className="p-4 rounded-xl bg-white border border-slate-100 shadow-xl shadow-slate-200/40 space-y-6">
              <div className="flex items-center gap-3">
                 <div className="h-12 w-12 rounded-2xl bg-indigo-50 flex items-center justify-center">
                    <Shield className="h-6 w-6 text-indigo-600" />
                 </div>
                 <div className="space-0.5">
                    <h4 className="text-sm font-black text-slate-900 uppercase tracking-tight">Комплаенс и доверие</h4>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">Глобальный стандарт v4.0 активен</p>
                 </div>
              </div>
              <div className="flex flex-wrap gap-3">
                 {[
                   { label: 'SSL Шифрование', icon: Shield },
                   { label: 'Соответствие GDPR', icon: Globe },
                   { label: 'Облачное распределение', icon: Monitor }
                 ].map((feat, i) => (
                   <div key={i} className="flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-xl border border-slate-100">
                      <feat.icon className="h-3 w-3 text-slate-400" />
                      <span className="text-[9px] font-black uppercase tracking-widest text-slate-600">{feat.label}</span>
                   </div>
                 ))}
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}

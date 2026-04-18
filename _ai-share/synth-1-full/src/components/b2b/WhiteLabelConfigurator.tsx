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
  Shield,
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
    bannerUrl: '',
  };

  const [activeView, setActiveView] = useState<'desktop' | 'mobile'>('desktop');

  return (
    <div className="min-h-screen space-y-4 bg-[#fafafa] p-4">
      {/* Header */}
      <div className="flex flex-col justify-between gap-3 md:flex-row md:items-end">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="bg-text-primary flex h-8 w-8 items-center justify-center rounded-xl">
              <Settings2 className="h-4 w-4 text-white" />
            </div>
            <Badge
              variant="outline"
              className="border-border-default text-text-primary text-[9px] font-black uppercase tracking-widest"
            >
              Custom_Identity_v1.0
            </Badge>
          </div>
          <h2 className="text-text-primary text-sm font-black uppercase leading-none tracking-tighter md:text-sm">
            Айдентика
            <br />
            Портала Ритейлера
          </h2>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            className="border-border-subtle h-12 gap-2 rounded-2xl bg-white px-6 text-[10px] font-black uppercase tracking-widest"
          >
            <Eye className="h-4 w-4" /> Предпросмотр
          </Button>
          <Button className="bg-accent-primary shadow-accent-primary/10 h-12 gap-2 rounded-2xl px-8 text-[10px] font-black uppercase tracking-widest text-white shadow-xl">
            <Save className="h-4 w-4" /> Сохранить изменения
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 lg:grid-cols-12">
        {/* Editor Panel */}
        <div className="space-y-4 lg:col-span-5">
          <Card className="overflow-hidden rounded-xl border-none bg-white shadow-2xl shadow-md">
            <div className="space-y-10 p-3">
              {/* Brand Logo & Identity */}
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <div className="bg-bg-surface2 flex h-10 w-10 items-center justify-center rounded-xl">
                    <ImageIcon className="text-text-muted h-5 w-5" />
                  </div>
                  <h3 className="text-base font-black uppercase tracking-tight">Активы бренда</h3>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-3">
                    <p className="text-text-muted text-[10px] font-black uppercase leading-none tracking-widest">
                      Основной логотип
                    </p>
                    <div className="bg-bg-surface2 border-border-subtle hover:border-accent-primary/30 hover:bg-accent-primary/10 group flex aspect-square cursor-pointer flex-col items-center justify-center gap-2 rounded-3xl border-2 border-dashed transition-all">
                      <Plus className="text-text-muted group-hover:text-accent-primary h-6 w-6" />
                      <span className="text-text-muted text-[8px] font-black uppercase">
                        Загрузить SVG/PNG
                      </span>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <p className="text-text-muted text-[10px] font-black uppercase leading-none tracking-widest">
                      Главный баннер
                    </p>
                    <div className="bg-bg-surface2 border-border-subtle hover:border-accent-primary/30 hover:bg-accent-primary/10 group relative flex aspect-square cursor-pointer flex-col items-center justify-center gap-2 overflow-hidden rounded-3xl border-2 border-dashed transition-all">
                      <img
                        src={config.bannerUrl}
                        className="absolute inset-0 h-full w-full object-cover opacity-50"
                      />
                      <div className="relative z-10 flex flex-col items-center">
                        <Plus className="text-text-muted group-hover:text-accent-primary h-6 w-6" />
                        <span className="text-text-muted text-[8px] font-black uppercase">
                          Сменить обложку
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Color Palette */}
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <div className="bg-bg-surface2 flex h-10 w-10 items-center justify-center rounded-xl">
                    <Palette className="text-text-muted h-5 w-5" />
                  </div>
                  <h3 className="text-base font-black uppercase tracking-tight">Цвета бренда</h3>
                </div>
                <div className="space-y-4">
                  {[
                    { label: 'Основной акцент', value: config.primaryColor, key: 'primaryColor' },
                    { label: 'Фоновый слой', value: config.secondaryColor, key: 'secondaryColor' },
                  ].map((item, i) => (
                    <div
                      key={i}
                      className="bg-bg-surface2 border-border-subtle flex items-center justify-between rounded-2xl border p-4"
                    >
                      <div className="space-y-1">
                        <p className="text-text-primary text-[10px] font-black uppercase leading-none">
                          {item.label}
                        </p>
                        <p className="text-text-muted text-[9px] font-bold uppercase">
                          {item.value}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <input
                          type="color"
                          value={item.value}
                          onChange={(e) =>
                            updateWhiteLabelConfig('brand-1', { [item.key as any]: e.target.value })
                          }
                          className="h-10 w-10 cursor-pointer rounded-xl border-none bg-transparent"
                        />
                        <Input
                          value={item.value}
                          onChange={(e) =>
                            updateWhiteLabelConfig('brand-1', { [item.key as any]: e.target.value })
                          }
                          className="border-border-subtle h-10 w-24 rounded-xl bg-white font-mono text-[10px] font-black"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Advanced Domain */}
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <div className="bg-bg-surface2 flex h-10 w-10 items-center justify-center rounded-xl">
                    <Globe className="text-text-muted h-5 w-5" />
                  </div>
                  <h3 className="text-base font-black uppercase tracking-tight">
                    Персональный домен
                  </h3>
                </div>
                <div className="space-y-4">
                  <div className="relative">
                    <Input
                      placeholder="wholesale.yourbrand.ru"
                      className="border-border-subtle bg-bg-surface2 h-10 rounded-2xl pl-4 text-sm font-bold"
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                      <Badge className="border-none bg-emerald-50 text-[8px] font-black uppercase tracking-widest text-emerald-600">
                        Доступен
                      </Badge>
                    </div>
                  </div>
                  <p className="text-text-muted text-[9px] font-medium italic leading-relaxed">
                    Настройте CNAME-записи, чтобы они указывали на наш защищенный шлюз.
                  </p>
                </div>
              </div>
            </div>
          </Card>

          <Card className="shadow-accent-primary/10 bg-text-primary relative space-y-6 overflow-hidden rounded-xl border-none p-3 text-white shadow-2xl">
            <div className="relative z-10 space-y-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10">
                <Zap className="h-6 w-6 text-white" />
              </div>
              <div className="space-y-2">
                <h3 className="text-sm font-black uppercase leading-none tracking-tight">
                  Оптимизация
                  <br />
                  опыта
                </h3>
                <p className="text-[9px] font-bold uppercase leading-relaxed tracking-widest text-white/40">
                  Повысьте вовлеченность ритейлеров с помощью модулей
                </p>
              </div>
              <div className="space-y-3">
                {[
                  { label: 'ИИ-подбор ассортимента', active: true },
                  { label: 'Индикаторы стока в реальном времени', active: true },
                  { label: 'Виджет программы лояльности', active: false },
                ].map((mod, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 p-4"
                  >
                    <span className="text-[10px] font-black uppercase tracking-widest text-white/80">
                      {mod.label}
                    </span>
                    <div
                      className={cn(
                        'h-5 w-10 rounded-full p-1 transition-all',
                        mod.active ? 'bg-accent-primary' : 'bg-white/10'
                      )}
                    >
                      <div
                        className={cn(
                          'h-3 w-3 rounded-full bg-white transition-all',
                          mod.active ? 'translate-x-5' : 'translate-x-0'
                        )}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-accent-primary/20 absolute -bottom-20 -right-20 h-64 w-64 rounded-full blur-[100px]" />
          </Card>
        </div>

        {/* Preview Panel */}
        <div className="space-y-4 lg:col-span-7">
          <div className="flex items-center justify-between">
            <div className="border-border-subtle flex items-center gap-1.5 rounded-2xl border bg-white p-1 shadow-sm">
              <Button
                onClick={() => setActiveView('desktop')}
                className={cn(
                  'h-10 rounded-xl px-6 text-[9px] font-black uppercase tracking-widest transition-all',
                  activeView === 'desktop' ? 'bg-text-primary text-white' : 'text-text-muted'
                )}
              >
                <Monitor className="mr-2 h-4 w-4" /> Десктоп
              </Button>
              <Button
                onClick={() => setActiveView('mobile')}
                className={cn(
                  'h-10 rounded-xl px-6 text-[9px] font-black uppercase tracking-widest transition-all',
                  activeView === 'mobile' ? 'bg-text-primary text-white' : 'text-text-muted'
                )}
              >
                <Smartphone className="mr-2 h-4 w-4" /> Мобильный
              </Button>
            </div>
            <p className="text-text-muted text-[10px] font-black uppercase tracking-widest">
              Автосохранение активно
            </p>
          </div>

          <div
            className={cn(
              'group relative mx-auto transition-all duration-700 ease-in-out',
              activeView === 'desktop' ? 'aspect-video w-full' : 'aspect-[9/19] w-[340px]'
            )}
          >
            {/* Mock Browser/Phone Frame */}
            <div className="border-text-primary bg-bg-surface2 ring-border-default absolute inset-0 overflow-hidden rounded-xl border-[12px] shadow-2xl ring-1">
              {/* Top Bar */}
              <div className="border-border-subtle flex h-10 items-center justify-between border-b bg-white px-6">
                <div className="flex gap-1.5">
                  <div className="h-2 w-2 rounded-full bg-rose-400" />
                  <div className="h-2 w-2 rounded-full bg-amber-400" />
                  <div className="h-2 w-2 rounded-full bg-emerald-400" />
                </div>
                <div className="bg-bg-surface2 border-border-subtle h-4 w-48 rounded-lg border" />
                <div className="bg-bg-surface2 h-4 w-4 rounded-lg" />
              </div>

              {/* Portal Content Preview */}
              <div
                className="flex h-full flex-col overflow-hidden"
                style={{ backgroundColor: config.secondaryColor }}
              >
                {/* Portal Header */}
                <div
                  className="border-border-subtle flex items-center justify-between border-b bg-white p-4 shadow-sm"
                  style={{ borderBottomColor: `${config.primaryColor}10` }}
                >
                  <div className="bg-text-primary flex h-8 w-24 items-center justify-center rounded-lg">
                    <span className="text-[10px] font-black uppercase tracking-widest text-white">
                      ВАШ ЛОГО
                    </span>
                  </div>
                  <div className="flex gap-3">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="bg-bg-surface2 h-2 w-12 rounded" />
                    ))}
                  </div>
                </div>

                {/* Portal Hero */}
                <div className="relative h-64 overflow-hidden">
                  <img src={config.bannerUrl} className="h-full w-full object-cover" />
                  <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" />
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center">
                    <Badge
                      style={{ backgroundColor: config.primaryColor }}
                      className="mb-4 border-none px-3 py-1 text-[8px] font-black uppercase tracking-widest text-white"
                    >
                      Официальный шоурум
                    </Badge>
                    <h4 className="mb-4 text-sm font-black uppercase leading-none tracking-tighter text-white">
                      FUTURE_COLLECTION_FW26
                    </h4>
                    <Button
                      style={{ backgroundColor: config.primaryColor }}
                      className="h-10 rounded-xl px-8 text-[9px] font-black uppercase tracking-widest text-white shadow-2xl"
                    >
                      Войти в шоурум
                    </Button>
                  </div>
                </div>

                {/* Portal Grid */}
                <div className="grid grid-cols-2 gap-3 p-4 md:grid-cols-3">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="border-border-subtle aspect-[3/4] space-y-4 rounded-2xl border bg-white p-4 shadow-sm"
                    >
                      <div className="bg-bg-surface2 aspect-square rounded-xl" />
                      <div className="space-y-2">
                        <div className="bg-bg-surface2 h-2 w-3/4 rounded" />
                        <div className="bg-bg-surface2 h-2 w-1/2 rounded" />
                        <div className="flex items-center justify-between pt-2">
                          <div className="bg-bg-surface2 h-4 w-12 rounded" />
                          <div
                            className="h-6 w-6 rounded-lg"
                            style={{ backgroundColor: config.primaryColor }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="border-border-subtle shadow-md/40 space-y-6 rounded-xl border bg-white p-4 shadow-xl">
            <div className="flex items-center gap-3">
              <div className="bg-accent-primary/10 flex h-12 w-12 items-center justify-center rounded-2xl">
                <Shield className="text-accent-primary h-6 w-6" />
              </div>
              <div className="space-0.5">
                <h4 className="text-text-primary text-sm font-black uppercase tracking-tight">
                  Комплаенс и доверие
                </h4>
                <p className="text-text-muted text-[10px] font-bold uppercase leading-none tracking-widest">
                  Глобальный стандарт v4.0 активен
                </p>
              </div>
            </div>
            <div className="flex flex-wrap gap-3">
              {[
                { label: 'SSL Шифрование', icon: Shield },
                { label: 'Соответствие GDPR', icon: Globe },
                { label: 'Облачное распределение', icon: Monitor },
              ].map((feat, i) => (
                <div
                  key={i}
                  className="bg-bg-surface2 border-border-subtle flex items-center gap-2 rounded-xl border px-4 py-2"
                >
                  <feat.icon className="text-text-muted h-3 w-3" />
                  <span className="text-text-secondary text-[9px] font-black uppercase tracking-widest">
                    {feat.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

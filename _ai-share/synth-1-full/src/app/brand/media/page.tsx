'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Video,
  Settings,
  Upload,
  Link as LinkIcon,
  PlusCircle,
  Trash2,
  GripVertical,
  FileText,
  ChevronRight,
  BarChart2,
  Mic,
  Radio,
  BookCopy,
  MessageSquare,
  Hand,
  ThumbsUp,
  Calendar as CalendarIcon,
  CheckCircle,
  AlertCircle,
  Clock,
  PlayCircle,
  Eye,
  ShoppingCart,
  Users,
  Tv,
  Share2,
  Instagram,
  Send as SendIcon,
  MapPin,
  File,
  Shield,
  MicOff,
  Image as ImageIcon,
  TrendingUp,
  Zap,
  Globe,
  Layers,
  ArrowRight,
} from 'lucide-react';
import { products } from '@/lib/products';
import Image from 'next/image';
import { useToast } from '@/hooks/use-toast';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import LivePlayer from '@/components/live-player';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import {
  LiveStreamAnalyticsDialog,
  AudienceRetentionDialog,
  PromotionDialog,
} from '@/components/brand';
import { TooltipProvider } from '@/components/ui/tooltip';
import { BrandDAM } from '@/components/brand/BrandDAM';
import Link from 'next/link';
import dynamic from 'next/dynamic';

const ContentHubContent = dynamic(
  () => import('@/app/brand/content-hub/page').then((m) => m.default),
  { ssr: false, loading: () => <div className="p-8 text-center text-slate-400">Загрузка...</div> }
);
const CmsContent = dynamic(() => import('@/app/brand/cms/page').then((m) => m.default), {
  ssr: false,
  loading: () => <div className="p-8 text-center text-slate-400">Загрузка...</div>,
});
const BlogContent = dynamic(() => import('@/app/brand/blog/page').then((m) => m.default), {
  ssr: false,
  loading: () => <div className="p-8 text-center text-slate-400">Загрузка...</div>,
});
const LiveContent = dynamic(() => import('@/app/brand/live/page').then((m) => m.default), {
  ssr: false,
  loading: () => <div className="p-8 text-center text-slate-400">Загрузка...</div>,
});

export default function BrandMediaPage() {
  const [streamType, setStreamType] = useState<string>('show');
  const [isCommentsEnabled, setIsCommentsEnabled] = useState(true);
  const [publicationDate, setPublicationDate] = useState<Date>();
  const [tab, setTab] = useState('media');
  const [activeTab, setActiveTab] = useState('dam');
  const [isPreviewPlayerOpen, setIsPreviewPlayerOpen] = useState(false);
  const [isAnalyticsOpen, setIsAnalyticsOpen] = useState(false);
  const [isRetentionAnalyticsOpen, setIsRetentionAnalyticsOpen] = useState(false);
  const [initialMetric, setInitialMetric] = useState<'views' | 'reactions' | 'comments' | 'cart'>(
    'views'
  );
  const [isPromotionDialogOpen, setIsPromotionDialogOpen] = useState(false);

  const { toast } = useToast();
  const mockLiveEvent = PlaceHolderImages.find((img) => img.id.startsWith('live-'));

  const handleStartStream = () => {
    toast({
      title: 'Трансляция запущена (симуляция)',
      description: 'Ваш прямой эфир начался и виден пользователям.',
    });
  };

  return (
    <TooltipProvider>
      <div className="space-y-4 duration-700 animate-in fade-in">
        <Tabs value={tab} onValueChange={setTab} className="w-full">
          <TabsList className="h-9 flex-wrap gap-0.5 border border-slate-200 bg-slate-100/80 px-1">
            <TabsTrigger
              value="media"
              className="h-7 gap-1.5 text-[10px] font-bold uppercase tracking-widest data-[state=active]:bg-white data-[state=active]:shadow-sm"
            >
              Медиа и DAM
            </TabsTrigger>
            <TabsTrigger
              value="content-hub"
              className="h-7 gap-1.5 text-[10px] font-bold uppercase tracking-widest data-[state=active]:bg-white data-[state=active]:shadow-sm"
            >
              Контент-хаб
            </TabsTrigger>
            <TabsTrigger
              value="cms"
              className="h-7 gap-1.5 text-[10px] font-bold uppercase tracking-widest data-[state=active]:bg-white data-[state=active]:shadow-sm"
            >
              CMS
            </TabsTrigger>
            <TabsTrigger
              value="blog"
              className="h-7 gap-1.5 text-[10px] font-bold uppercase tracking-widest data-[state=active]:bg-white data-[state=active]:shadow-sm"
            >
              Блог
            </TabsTrigger>
            <TabsTrigger
              value="live"
              className="h-7 gap-1.5 text-[10px] font-bold uppercase tracking-widest data-[state=active]:bg-white data-[state=active]:shadow-sm"
            >
              Live
            </TabsTrigger>
          </TabsList>
          <TabsContent value="media" className="mt-4">
            <Tabs defaultValue="dam" onValueChange={setActiveTab} className="w-full">
              <TabsList className="mb-8 grid w-fit grid-cols-5 rounded-2xl bg-slate-100 p-1">
                <TabsTrigger
                  value="dam"
                  className="rounded-xl px-6 text-[10px] font-bold uppercase"
                >
                  Brand DAM
                </TabsTrigger>
                <TabsTrigger
                  value="streams"
                  className="rounded-xl px-6 text-[10px] font-bold uppercase"
                >
                  Трансляции
                </TabsTrigger>
                <TabsTrigger
                  value="videos"
                  className="rounded-xl px-6 text-[10px] font-bold uppercase"
                >
                  AI-Видео
                </TabsTrigger>
                <TabsTrigger
                  value="digital_hub"
                  className="rounded-xl px-6 text-[10px] font-bold uppercase"
                >
                  Digital Hub
                </TabsTrigger>
                <TabsTrigger
                  value="archive"
                  className="rounded-xl px-6 text-[10px] font-bold uppercase"
                >
                  Архив
                </TabsTrigger>
              </TabsList>

              <TabsContent value="dam">
                <BrandDAM />
              </TabsContent>

              <TabsContent value="streams" className="space-y-6">
                <div className="grid grid-cols-1 items-start gap-3 lg:grid-cols-3">
                  <div className="lg:col-span-2">
                    <Card className="overflow-hidden rounded-xl border-slate-100 shadow-sm">
                      <CardHeader className="p-4 pb-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <CardTitle className="text-base font-black uppercase tracking-tight">
                              Настройки прямого эфира
                            </CardTitle>
                            <CardDescription className="mt-1 text-xs font-medium">
                              Подключитесь к нашему стриминговому сервису или используйте внешний
                              RTMP-сервер.
                            </CardDescription>
                          </div>
                          <Button
                            onClick={() => setIsPromotionDialogOpen(true)}
                            variant="outline"
                            className="rounded-xl border-slate-200 text-[10px] font-black uppercase"
                          >
                            <TrendingUp className="mr-2 h-3.5 w-3.5" /> Продвигать эфир
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-6 p-4 pt-0">
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                              Название трансляции
                            </Label>
                            <Input
                              className="h-12 rounded-xl text-sm font-bold"
                              placeholder="Презентация новой коллекции SS26"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                              Описание
                            </Label>
                            <Textarea
                              className="min-h-[100px] resize-none rounded-xl text-sm font-medium"
                              placeholder="Краткое описание вашего эфира..."
                            />
                          </div>
                        </div>

                        <div className="grid gap-3 sm:grid-cols-2">
                          <div className="space-y-2">
                            <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                              Дата и время начала
                            </Label>
                            <Popover>
                              <PopoverTrigger asChild>
                                <Button
                                  variant={'outline'}
                                  className="h-12 w-full justify-start rounded-xl border-slate-200 text-left font-bold"
                                >
                                  <CalendarIcon className="mr-2 h-4 w-4 text-indigo-600" />
                                  {publicationDate ? (
                                    format(publicationDate, 'd MMMM yyyy, HH:mm', { locale: ru })
                                  ) : (
                                    <span>Выберите дату и время</span>
                                  )}
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent className="w-auto p-0">
                                <Calendar
                                  mode="single"
                                  selected={publicationDate}
                                  onSelect={setPublicationDate}
                                  initialFocus
                                />
                              </PopoverContent>
                            </Popover>
                          </div>
                          <div className="space-y-2">
                            <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                              Место проведения
                            </Label>
                            <Input
                              className="h-12 rounded-xl text-sm font-bold"
                              placeholder="Напр., Студия Syntha, Москва"
                            />
                          </div>
                        </div>

                        <Button
                          onClick={handleStartStream}
                          className="h-12 w-full rounded-xl bg-indigo-600 text-[11px] font-black uppercase text-white shadow-lg shadow-indigo-100 hover:bg-indigo-700"
                        >
                          Начать трансляцию <ChevronRight className="ml-2 h-4 w-4" />
                        </Button>
                      </CardContent>
                    </Card>
                  </div>

                  <div className="space-y-4 lg:col-span-1">
                    <Card className="overflow-hidden rounded-xl border-slate-100 shadow-sm">
                      <CardHeader className="p-4 pb-4">
                        <CardTitle className="flex items-center gap-2 text-sm font-black uppercase tracking-tight">
                          <div className="relative flex h-2 w-2">
                            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75"></span>
                            <span className="relative inline-flex h-2 w-2 rounded-full bg-red-500"></span>
                          </div>
                          Live Studio
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-6 p-4 pt-0">
                        <div className="group relative flex aspect-[9/16] cursor-pointer items-center justify-center overflow-hidden rounded-xl border-2 border-dashed border-slate-200 bg-slate-100 transition-colors hover:bg-slate-50">
                          <div className="space-y-2 text-center">
                            <Video className="mx-auto h-10 w-10 text-slate-300 transition-colors group-hover:text-indigo-400" />
                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                              Превью камеры
                            </p>
                          </div>
                        </div>

                        <div className="space-y-4">
                          <div className="flex items-center justify-between rounded-2xl bg-slate-50 p-3">
                            <div className="flex items-center gap-2">
                              <div className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-100 bg-white">
                                <Mic className="h-4 w-4 text-slate-600" />
                              </div>
                              <Label className="text-[10px] font-black uppercase tracking-widest text-slate-500">
                                Микрофон
                              </Label>
                            </div>
                            <Switch />
                          </div>
                          <div className="flex items-center justify-between rounded-2xl bg-slate-50 p-3">
                            <div className="flex items-center gap-2">
                              <div className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-100 bg-white">
                                <MessageSquare className="h-4 w-4 text-slate-600" />
                              </div>
                              <Label className="text-[10px] font-black uppercase tracking-widest text-slate-500">
                                Чат
                              </Label>
                            </div>
                            <Switch defaultChecked />
                          </div>
                        </div>

                        <Button className="h-12 w-full rounded-xl bg-slate-900 text-[10px] font-black uppercase text-white hover:bg-black">
                          <Tv className="mr-2 h-4 w-4" /> Предпросмотр
                        </Button>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="videos" className="space-y-6">
                <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                  <Card className="group relative cursor-pointer overflow-hidden rounded-xl border-slate-100 bg-indigo-600 text-white shadow-sm">
                    <div className="absolute right-0 top-0 p-4 opacity-10 transition-transform group-hover:scale-110">
                      <Zap className="h-32 w-32" />
                    </div>
                    <CardContent className="space-y-4 p-4">
                      <Badge className="border-none bg-white/20 text-[9px] font-black uppercase text-white">
                        New AI Feature
                      </Badge>
                      <h3 className="text-sm font-black uppercase tracking-tighter">
                        AI Lookbook (Video)
                      </h3>
                      <p className="text-xs font-medium leading-relaxed text-indigo-100">
                        Генерация 15-секундных Reels и TikTok проходок с цифровыми моделями на
                        основе ваших 3D-лекал.
                      </p>
                      <Button className="h-10 w-full rounded-xl bg-white text-[10px] font-black uppercase text-indigo-600 hover:bg-indigo-50">
                        Сгенерировать видео
                      </Button>
                    </CardContent>
                  </Card>

                  <Card className="group relative cursor-pointer overflow-hidden rounded-xl border-slate-100 bg-slate-50 shadow-sm transition-colors hover:border-indigo-200">
                    <CardContent className="space-y-4 p-4">
                      <Badge
                        variant="outline"
                        className="border-slate-300 text-[9px] font-black uppercase text-slate-500"
                      >
                        Static Content
                      </Badge>
                      <h3 className="text-sm font-black uppercase tracking-tighter text-slate-900">
                        Standard Lookbook
                      </h3>
                      <p className="text-xs font-medium leading-relaxed text-slate-500">
                        Генерация высококачественных студийных фото на различных фонах для
                        E-commerce.
                      </p>
                      <Button
                        variant="outline"
                        className="h-10 w-full rounded-xl border-slate-200 bg-white text-[10px] font-black uppercase text-slate-900"
                      >
                        Создать фотосет
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="digital_hub" className="space-y-6">
                <div className="space-y-6">
                  <Card className="overflow-hidden rounded-xl border-slate-100 bg-white shadow-sm">
                    <CardContent className="flex items-center gap-3 p-4">
                      <div className="flex h-20 w-20 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                        <Globe className="h-10 w-10" />
                      </div>
                      <div className="flex-1">
                        <div className="mb-1 flex items-center gap-2">
                          <Badge className="border-none bg-indigo-100 text-[8px] font-black uppercase text-indigo-700">
                            Enterprise Sync
                          </Badge>
                          <span className="text-[10px] font-black uppercase tracking-widest text-indigo-600">
                            Universal API
                          </span>
                        </div>
                        <h3 className="text-base font-black uppercase tracking-tight">
                          Universal Retail API
                        </h3>
                        <p className="mt-1 text-xs font-medium text-slate-500">
                          Мгновенная синхронизация с Shopify, SAP, NetSuite и 1C ритейлеров.
                        </p>
                      </div>
                      <Button
                        variant="outline"
                        className="h-12 rounded-xl border-slate-200 px-6 text-[10px] font-black uppercase"
                      >
                        Управление ключами
                      </Button>
                    </CardContent>
                  </Card>

                  <Card className="overflow-hidden rounded-xl border-slate-100 bg-slate-900 text-white shadow-sm">
                    <CardContent className="flex items-center gap-3 p-4">
                      <div className="flex h-20 w-20 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white">
                        <Layers className="h-10 w-10" />
                      </div>
                      <div className="flex-1">
                        <div className="mb-1 flex items-center gap-2">
                          <Badge className="border-none bg-emerald-50 text-[8px] font-black uppercase text-white">
                            Scale Up
                          </Badge>
                          <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                            Platform-as-a-Service
                          </span>
                        </div>
                        <h3 className="text-base font-black uppercase tracking-tight">
                          White-label Client Portals
                        </h3>
                        <p className="mt-1 text-xs font-medium text-slate-400">
                          Запуск собственной версии Syntha для ваших суб-брендов или закрытых групп
                          за 5 минут.
                        </p>
                      </div>
                      <Button className="h-12 rounded-xl bg-white px-6 text-[10px] font-black uppercase text-black hover:bg-slate-100">
                        Создать портал
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </TabsContent>
          <TabsContent value="content-hub" className="mt-4">
            {tab === 'content-hub' && <ContentHubContent />}
          </TabsContent>
          <TabsContent value="cms" className="mt-4">
            {tab === 'cms' && <CmsContent />}
          </TabsContent>
          <TabsContent value="blog" className="mt-4">
            {tab === 'blog' && <BlogContent />}
          </TabsContent>
          <TabsContent value="live" className="mt-4">
            {tab === 'live' && <LiveContent />}
          </TabsContent>
        </Tabs>
      </div>

      <LiveStreamAnalyticsDialog
        isOpen={isAnalyticsOpen}
        onOpenChange={setIsAnalyticsOpen}
        initialMetric={initialMetric}
      />

      <AudienceRetentionDialog
        open={isRetentionAnalyticsOpen}
        onOpenChange={setIsRetentionAnalyticsOpen}
      />

      {mockLiveEvent && (
        <LivePlayer
          event={mockLiveEvent}
          isOpen={isPreviewPlayerOpen}
          onOpenChange={setIsPreviewPlayerOpen}
          isLive={true}
        />
      )}
      <PromotionDialog
        isOpen={isPromotionDialogOpen}
        onOpenChange={setIsPromotionDialogOpen}
        initialType="live_shopping_event"
        initialName="Продвижение прямого эфира"
      />
    </TooltipProvider>
  );
}

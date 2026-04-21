'use client';

import * as React from 'react';
import { useState, useEffect, useMemo } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Brain,
  Zap,
  ArrowRight,
  Sparkles,
  LayoutGrid,
  Maximize2,
  ChevronRight,
  Activity,
  Layers,
  Users,
  Gavel,
  TrendingUp,
  Heart,
  Clock,
  ShoppingBag,
  Plus,
  Star,
  Check,
  Baby,
  Scissors,
  Home as HomeIcon,
  Venus,
  Mars,
  Store,
  ShieldCheck,
  Factory,
  Truck,
  Briefcase,
  Calendar,
  MessageSquare,
  BarChart3,
  Package,
  FileText,
  Database,
  Globe2,
  CreditCard,
  Flame,
  Building2,
  CalendarRange,
  Handshake,
  MapPin,
  Globe,
  MessageCircle,
  Video,
  LineChart,
  Wallet,
  Smartphone,
  PlayCircle,
  Settings2,
  Ruler,
  Coins,
  PieChart,
  AlertCircle,
  CheckCircle,
  Eye,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

import { cn } from '@/lib/utils';
import { useUIState } from '@/providers/ui-state';
import { useB2BState } from '@/providers/b2b-state';
import { useAuth } from '@/providers/auth-provider';
import { repo } from '@/lib/repo';
import type { CmsHomeConfig } from '@/data/cms.home.default';
import { DEFAULT_HOME_CMS } from '@/data/cms.home.default';
import type { Product, GlobalCategory } from '@/lib/types';
import { brands } from '@/lib/placeholder-data';

import { HomeLiveStrip } from '@/components/cms/HomeLiveStrip';
import WeeklyLooks from '@/components/weekly-looks';
import KickstarterSection from '@/components/kickstarter-section';
import { PrivateAccess } from '@/components/home/sections/PrivateAccess';
import { SynthaEdit } from '@/components/home/sections/SynthaEdit';
import { AsSeenOnLive } from '@/components/home/sections/AsSeenOnLive';
const B2BControlCenter = dynamic(
  () =>
    import('@/components/admin/B2BControlCenter').then((m) => ({ default: m.B2BControlCenter })),
  {
    ssr: false,
    loading: () => (
      <div
        className="border-border-default bg-bg-surface2/60 min-h-[240px] rounded-xl border border-dashed"
        aria-hidden
      />
    ),
  }
);
const StylistPanel = dynamic(
  () => import('@/components/ai/StylistPanel').then((m) => ({ default: m.StylistPanel })),
  { ssr: false }
);
const SynthaProductCard = dynamic(
  () => import('@/components/syntha-product-card').then((m) => ({ default: m.SynthaProductCard })),
  { ssr: false }
);
const MerchandisingDashboard = dynamic(
  () =>
    import('@/components/showroom/MerchandisingDashboard').then((m) => ({
      default: m.MerchandisingDashboard,
    })),
  {
    ssr: false,
    loading: () => (
      <div className="bg-bg-surface2 min-h-[200px] animate-pulse rounded-xl" aria-hidden />
    ),
  }
);
const PlanningDashboard = dynamic(
  () =>
    import('@/components/showroom/PlanningDashboard').then((m) => ({
      default: m.PlanningDashboard,
    })),
  {
    ssr: false,
    loading: () => (
      <div className="bg-bg-surface2 min-h-[200px] animate-pulse rounded-xl" aria-hidden />
    ),
  }
);
import { ShowroomNavigation } from '@/components/showroom/ShowroomNavigation';
import { ShowroomGrid } from '@/components/showroom/ShowroomGrid';
import { AdvertisingSection } from '@/components/home/AdvertisingSection';
import { B2BPresentationSections } from '@/components/home/B2BPresentationSections';
import { GlobalCategorySelector } from '@/components/home/GlobalCategorySelector';
import { B2BUpdatesSection } from '@/components/home/B2BUpdatesSection';

import { ClientBrandsSection } from '@/components/home/sections/ClientBrandsSection';
import { ShowroomSection } from '@/components/home/sections/ShowroomSection';
import { B2BNavigation } from '@/components/home/B2BNavigation';
import { LookDetailsDialog } from '@/components/home/dialogs/LookDetailsDialog';
import { AuditTrailDialog } from '@/components/home/dialogs/AuditTrailDialog';
import { SmartCheckoutDialog } from '@/components/home/dialogs/SmartCheckoutDialog';
import {
  globalCategories,
  totalLookCards,
  b2bSections,
} from '@/components/home/_fixtures/home-data';

export function HomePageClient() {
  const { toast } = useToast();
  const router = useRouter();
  const {
    wishlist,
    addWishlistItem,
    removeWishlistItem,
    addCartItem,
    globalCategory,
    setGlobalCategory,
    viewRole,
    isFlowMapOpen,
    setIsFlowMapOpen,
    isCalendarOpen,
    isMediaRadarOpen,
    isConstellationOpen,
    followedBrands,
  } = useUIState();
  const { b2bCart, setB2bCart } = useB2BState();
  const isDropsUnlocked = followedBrands.length >= 2 || viewRole === 'admin';
  const auth = useAuth();
  const [cfg, setCfg] = React.useState<CmsHomeConfig>(DEFAULT_HOME_CMS);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [products, setProducts] = useState<Product[]>([]);
  const [showroomTab, setShowroomTab] = useState<string>('all');
  const [showroomViewMode, setShowroomViewMode] = useState<
    'products' | 'looks' | 'collections' | 'my_orders' | 'planning'
  >('products');
  const [laboratoryTab, setLaboratoryTab] = useState<'laboratory' | 'private'>('laboratory');
  const [brandsTab, setBrandsTab] = useState<string>('selection');
  const [selectedLook, setSelectedLook] = useState<any>(null);
  const [isLookDetailsOpen, setIsLookDetailsOpen] = useState(false);
  const [currency, setCurrency] = useState<'RUB' | 'USD' | 'EUR'>('RUB');
  const [atsEnabled, setAtsEnabled] = useState(true);
  const [isScrolledDown, setIsScrolledDown] = useState(false);
  const [landedCostEnabled, setLandedCostEnabled] = useState(false);
  const [isAuditTrailOpen, setIsAuditTrailOpen] = useState(false);
  const [activeB2BSection, setActiveB2BSection] = useState<string>('PRODUCTION_b2b');
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);
  const [isLinesheetMode, setIsLinesheetMode] = useState(false);
  const [selectedLinesheetItems, setSelectedLinesheetItems] = useState<string[]>([]);
  const [merchStatus, setMerchStatus] = useState<'draft' | 'ready' | 'sent'>('draft');
  const [isCustomerPov, setIsCustomerPov] = useState(false);

  const activeMerchBrand = useMemo(() => {
    if (b2bCart && b2bCart.length > 0) {
      return b2bCart[0].brand || 'Syntha Lab';
    }
    return 'Syntha Lab';
  }, [b2bCart]);

  useEffect(() => {
    const handleScroll = () => {
      // Если пролистали больше 300px от верха, считаем, что мы "внизу"
      setIsScrolledDown(window.scrollY > 300);

      // Определяем активный раздел для подсветки кнопок
      const b2bSectionsList = [
        { id: 'PRODUCTION_b2b' },
        { id: 'WORKPLACE_b2b' },
        { id: 'ECOSYSTEM_b2b' },
        { id: 'PARTNERS_b2b' },
        { id: 'CALENDAR_b2b' },
        { id: 'MEDIA_ECOSYSTEM_b2b' },
        { id: 'PROCUREMENT_b2b' },
        { id: 'SHOWCASE_b2b' },
      ];

      const scrollPosition = window.scrollY + 200;
      for (let i = b2bSectionsList.length - 1; i >= 0; i--) {
        const section = document.getElementById(b2bSectionsList[i].id);
        if (section && section.offsetTop <= scrollPosition) {
          setActiveB2BSection(b2bSectionsList[i].id);
          break;
        }
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  React.useEffect(() => {
    (async () => {
      const data = await repo.cms.getHome();
      setCfg(data);
    })();
  }, []);

  useEffect(() => {
    let raf = 0;
    let latest = { x: 0, y: 0 };
    const handleMouseMove = (e: MouseEvent) => {
      latest = { x: e.clientX, y: e.clientY };
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        setMousePos(latest);
      });
    };
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const response = await fetch('/data/products.json');
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const allProducts = (await response.json()) as Product[];
        if (Array.isArray(allProducts)) {
          setProducts(allProducts);
        }
      } catch (error) {
        console.warn('Failed to fetch products for home page:', error);
        setProducts([]);
      }
    }
    fetchProducts();
  }, []);

  const allProductsData = useMemo(() => products, [products]);

  const getFilteredShowroomProducts = () => {
    let filteredByGlobal = allProductsData;
    if (globalCategory !== 'all') {
      filteredByGlobal = allProductsData.filter((p) => {
        if (globalCategory === 'women') return p.audience === 'Женский' || p.audience === 'Унисекс';
        if (globalCategory === 'men') return p.audience === 'Мужской' || p.audience === 'Унисекс';
        if (globalCategory === 'kids')
          return (
            p.audience === 'Детский' ||
            p.audience === 'Мальчики' ||
            p.audience === 'Девочки' ||
            p.audience === 'Новорожденные' ||
            p.category === 'Детям' ||
            p.category === 'Kids'
          );
        if (globalCategory === 'beauty') return p.category === 'Beauty' || p.category === 'Красота';
        if (globalCategory === 'home') return p.category === 'Home' || p.category === 'Дом';
        return true;
      });
    }

    const otherCarouselSlugs = cfg.carousels.flatMap((c) => c.productSlugs);

    if (showroomTab === 'all') {
      return filteredByGlobal.filter(
        (p) => !p.outlet && !(p.originalPrice && p.originalPrice > p.price)
      );
    }

    if (showroomTab === 'outlet') {
      return filteredByGlobal.filter(
        (p) => p.outlet || (p.originalPrice && p.originalPrice > p.price)
      );
    }

    const carousel = cfg.carousels.find((c) => c.id === showroomTab);
    if (!carousel) return filteredByGlobal;

    const filtered = filteredByGlobal.filter(
      (p) => carousel.productSlugs.includes(p.slug) || carousel.productSlugs.includes(p.sku)
    );

    if (filtered.length === 0) {
      if (carousel.title === 'Новинки') return filteredByGlobal.slice(0, 4);
      if (carousel.title === 'Хиты продаж') return filteredByGlobal.slice(4, 8);
      return filteredByGlobal;
    }

    return filtered;
  };

  const filteredShowroomProducts = getFilteredShowroomProducts();

  const scrollToTopOrBottom = () => {
    if (isScrolledDown) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'smooth' });
    }
  };

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const yOffset = -135;
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  return (
    <div className="relative flex flex-col bg-[#f8fafc] font-sans">
      <AdvertisingSection />
      {viewRole !== 'b2b' && (
        <div className="relative z-[100]">
          <GlobalCategorySelector
            categories={globalCategories}
            activeCategory={globalCategory}
            onChange={setGlobalCategory}
          />
        </div>
      )}
      {viewRole === 'b2b' && (
        <div className="relative z-[100]">
          <B2BNavigation
            viewRole={viewRole}
            activeB2BSection={activeB2BSection}
            onSectionChange={setActiveB2BSection}
            isScrolledDown={isScrolledDown}
          />
        </div>
      )}

      {/* Admin Control Hub - Only visible for admins */}
      {viewRole === 'admin' && (
        <section id="ADMIN_HUB" className="section-spacing relative bg-transparent pt-24">
          <div className="relative mx-auto w-full max-w-5xl px-4 sm:px-6">
            <B2BControlCenter />
          </div>
        </section>
      )}

      <div
        className={cn(
          'flex flex-col',
          (isFlowMapOpen || isCalendarOpen || isMediaRadarOpen || isConstellationOpen) && 'hidden'
        )}
      >
        {/* B2B Presentation Sections */}
        <div
          className={cn(
            viewRole === 'b2b' && 'transition-all duration-300',
            isFlowMapOpen && 'pt-0'
          )}
        >
          <B2BPresentationSections isVisible={viewRole === 'b2b'} />
        </div>

        {/* Brands Section */}
        {viewRole === 'client' && (
          <div className="pt-20">
            <ClientBrandsSection
              viewRole={viewRole}
              brandsTab={brandsTab}
              setBrandsTab={setBrandsTab}
              isLinesheetMode={isLinesheetMode}
              setIsLinesheetMode={setIsLinesheetMode}
            />
          </div>
        )}
      </div>

      {/* Background Decor */}
      <div
        className="pointer-events-none fixed inset-0 z-0 opacity-10"
        style={{
          background: `radial-gradient(1000px circle at ${mousePos.x}px ${mousePos.y}px, rgba(148, 163, 184, 0.15), transparent)`,
        }}
      />

      {/* Showroom Section */}
      <div id={viewRole === 'b2b' ? 'SHOWCASE_b2b' : 'SHOWCASE_b2c'}>
        <ShowroomSection
          viewRole={viewRole}
          showroomTab={showroomTab}
          setShowroomTab={setShowroomTab}
          showroomViewMode={showroomViewMode}
          setShowroomViewMode={setShowroomViewMode}
          toast={toast}
          carousels={cfg.carousels}
          filteredShowroomProducts={filteredShowroomProducts}
          totalLookCards={totalLookCards}
          isLinesheetMode={isLinesheetMode}
          selectedLinesheetItems={selectedLinesheetItems}
          setSelectedLinesheetItems={setSelectedLinesheetItems}
          setSelectedLook={setSelectedLook}
          setIsLookDetailsOpen={setIsLookDetailsOpen}
          router={router}
          currency={currency}
        />
      </div>

      {/* Kickstarter Section for B2C */}
      {viewRole === 'client' && (
        <section
          id="LABORATORY_b2c"
          className="section-spacing relative scroll-mt-24 bg-transparent"
        >
          <div className="relative mx-auto w-full max-w-5xl px-4 sm:px-6">
            <Card className="border-border-subtle relative overflow-hidden rounded-xl border border-none bg-white shadow-2xl shadow-md">
              <CardContent className="relative z-10 p-4">
                <div className="mb-8 flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="bg-bg-surface2 flex h-8 w-8 items-center justify-center rounded-xl">
                        <Zap className="h-4 w-4 text-black" />
                      </div>
                      <Badge
                        variant="outline"
                        className="border-border-default text-text-primary px-2 py-0.5 text-xs font-semibold uppercase tracking-wide"
                      >
                        {laboratoryTab === 'laboratory' ? 'LABORATORY_B2C' : 'PRIVATE_ACCESS'}
                      </Badge>
                    </div>
                    <div className="space-y-1">
                      <h2 className="text-text-primary text-2xl font-bold uppercase leading-tight tracking-tight md:text-4xl">
                        {laboratoryTab === 'laboratory' ? 'ЛАБОРАТОРИЯ' : 'ЭКСКЛЮЗИВ'}
                      </h2>
                      <p className="text-text-secondary max-w-xl text-sm">
                        {laboratoryTab === 'laboratory'
                          ? 'Площадка для реализации самых смелых fashion-идей.'
                          : 'Закрытый доступ к прототипам и лимитированным сериям.'}
                      </p>
                    </div>

                    {/* Tab Switcher - Moved here below description */}
                    <div className="bg-bg-surface2 border-border-subtle flex w-fit items-center gap-1.5 rounded-2xl border p-1">
                      {[
                        { id: 'laboratory', title: 'Лаборатория' },
                        { id: 'private', title: 'Эксклюзив' },
                      ].map((tab) => (
                        <button
                          key={tab.id}
                          onClick={() => setLaboratoryTab(tab.id as any)}
                          className={cn(
                            'btn-tab min-w-[140px] snap-start',
                            laboratoryTab === tab.id ? 'btn-tab-active' : 'btn-tab-inactive'
                          )}
                        >
                          {tab.title}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Scroll Arrows - Matching Showroom style */}
                  <div className="flex items-center gap-3">
                    <button
                      className="text-text-muted hover:text-text-primary p-1 transition-colors"
                      onClick={() =>
                        document
                          .getElementById(
                            laboratoryTab === 'laboratory'
                              ? 'laboratory-scroll'
                              : 'private-access-scroll'
                          )
                          ?.scrollBy({ left: -400, behavior: 'smooth' })
                      }
                    >
                      <ArrowRight className="h-5 w-5 rotate-180" />
                    </button>
                    <button
                      className="text-text-muted hover:text-text-primary p-1 transition-colors"
                      onClick={() =>
                        document
                          .getElementById(
                            laboratoryTab === 'laboratory'
                              ? 'laboratory-scroll'
                              : 'private-access-scroll'
                          )
                          ?.scrollBy({ left: 400, behavior: 'smooth' })
                      }
                    >
                      <ArrowRight className="h-5 w-5" />
                    </button>
                  </div>
                </div>

                <AnimatePresence mode="wait">
                  {laboratoryTab === 'laboratory' ? (
                    <motion.div
                      key="laboratory"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                    >
                      <KickstarterSection />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="private"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                    >
                      <PrivateAccess />
                    </motion.div>
                  )}
                </AnimatePresence>

                <Card className="bg-text-primary group/banner relative mt-12 flex min-h-[300px] w-full items-center overflow-hidden rounded-xl border-none shadow-2xl">
                  <div className="absolute inset-0 opacity-40 transition-transform duration-1000 group-hover/banner:scale-105">
                    <img
                      src={
                        laboratoryTab === 'laboratory'
                          ? 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2000'
                          : 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?q=80&w=2000'
                      }
                      alt="Laboratory Banner"
                      className="h-full w-full object-cover grayscale"
                    />
                  </div>
                  <div className="from-text-primary via-text-primary/80 absolute inset-0 bg-gradient-to-r to-transparent" />
                  <CardContent className="relative z-10 w-full max-w-4xl space-y-4 p-4 text-left text-white">
                    <div className="group/marquee relative mb-4 overflow-hidden whitespace-nowrap border-y border-white/10 py-2">
                      <motion.div
                        animate={{ x: ['0%', '-50%'] }}
                        transition={{ duration: 120, repeat: Infinity, ease: 'linear' }}
                        className="flex w-fit items-center gap-3"
                      >
                        {[1, 2].map((i) => (
                          <div key={i} className="flex shrink-0 items-center gap-3">
                            {laboratoryTab === 'laboratory' ? (
                              <>
                                <span className="text-[10px] font-medium uppercase tracking-wider text-white/60">
                                  • Краудфандинг
                                </span>
                                <span className="text-[10px] font-medium uppercase tracking-wider text-white/60">
                                  • Предзаказ
                                </span>
                                <span className="text-[10px] font-medium uppercase tracking-wider text-white/60">
                                  • Лимитированный тираж
                                </span>
                                <span className="text-[10px] font-medium uppercase tracking-wider text-white/60">
                                  • Дизайн-лаборатория
                                </span>
                                <span className="text-[10px] font-medium uppercase tracking-wider text-white/60">
                                  • Прототип
                                </span>
                              </>
                            ) : (
                              <>
                                <span className="text-[10px] font-medium uppercase tracking-wider text-white/60">
                                  • Эксклюзивный доступ
                                </span>
                                <span className="text-[10px] font-medium uppercase tracking-wider text-white/60">
                                  • VIP Прототипы
                                </span>
                                <span className="text-[10px] font-medium uppercase tracking-wider text-white/60">
                                  • Style Icon Only
                                </span>
                                <span className="text-[10px] font-medium uppercase tracking-wider text-white/60">
                                  • Private Drop
                                </span>
                                <span className="text-[10px] font-medium uppercase tracking-wider text-white/60">
                                  • Ранний доступ
                                </span>
                              </>
                            )}
                          </div>
                        ))}
                      </motion.div>
                    </div>

                    <div className="space-y-4">
                      <h2 className="text-xl font-bold uppercase leading-tight tracking-tight md:text-3xl">
                        {laboratoryTab === 'laboratory' ? 'КРАУДФАНДИНГ' : 'ПРОВЕРИТЬ МОЙ СТАТУС'}
                      </h2>
                      <p className="text-text-muted border-accent-primary/50 border-l-2 pl-6 text-sm font-medium">
                        {laboratoryTab === 'laboratory'
                          ? '"Площадка для реализации самых смелых fashion-идей."'
                          : '"Пользователи с уровнем лояльности \'Style Icon\' получают доступ к дропам на 48 часов раньше всех."'}
                      </p>
                      <div className="flex pt-4">
                        <Button asChild variant="cta" size="ctaLg" className="w-fit min-w-[200px]">
                          <Link
                            href={laboratoryTab === 'laboratory' ? '/kickstarter' : '/loyalty'}
                            className="flex items-center gap-2"
                          >
                            {laboratoryTab === 'laboratory' ? 'Все проекты' : 'Повысить статус'}
                            <ArrowRight className="h-3.5 w-3.5" />
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </CardContent>
            </Card>
          </div>
        </section>
      )}

      {/* Hidden "Drops" Section - Unlocked with 5+ brand follows or Admin role */}
      <AnimatePresence>
        {(viewRole === 'client' || viewRole === 'admin') && isDropsUnlocked && (
          <motion.section
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="section-spacing bg-text-primary relative overflow-hidden py-24"
          >
            {/* Background elements */}
            <div className="absolute inset-0 opacity-20">
              <div className="absolute left-0 top-0 h-full w-full bg-[radial-gradient(circle_at_50%_-20%,#4f46e5,transparent)]" />
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" />
            </div>

            <div className="relative z-10 mx-auto w-full max-w-5xl px-4 sm:px-6">
              <div className="mb-16 flex flex-col justify-between gap-3 md:flex-row md:items-end">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="bg-accent-primary/20 border-accent-primary/30 flex h-8 w-8 items-center justify-center rounded-xl border">
                      <Flame className="text-accent-primary h-4 w-4" />
                    </div>
                    <Badge className="bg-accent-primary border-none px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white shadow-[0_0_15px_rgba(79,70,229,0.5)]">
                      LOCKED_CONTENT_UNLOCKED
                    </Badge>
                  </div>
                  <div className="space-y-2">
                    <h2 className="text-2xl font-bold uppercase tracking-tight text-white md:text-4xl">
                      DROPS<span className="text-accent-primary">.</span>
                    </h2>
                    <p className="text-text-muted max-w-lg text-sm font-medium">
                      Эксклюзивный доступ к лимитированным коллекциям для активных участников
                      сообщества. Только 48 часов до общего релиза.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="hidden text-right md:block">
                    <p className="text-accent-primary mb-1 text-[10px] font-bold uppercase tracking-wider">
                      Следующий дроп через
                    </p>
                    <div className="flex gap-3">
                      {[
                        { val: '02', label: 'дни' },
                        { val: '14', label: 'час' },
                        { val: '35', label: 'мин' },
                      ].map((t) => (
                        <div key={t.label} className="flex flex-col items-center">
                          <span className="text-sm font-bold tabular-nums text-white">{t.val}</span>
                          <span className="text-text-secondary text-[10px] font-medium uppercase tracking-wide">
                            {t.label}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <Button variant="ctaOutline" size="ctaLg" className="group">
                    Смотреть все дропы{' '}
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                {[
                  {
                    id: 'drop-1',
                    name: 'Cyber-Organic Hoodie',
                    brand: 'Nordic Wool',
                    price: '18,900 ₽',
                    image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=800',
                    stock: '12/50',
                  },
                  {
                    id: 'drop-2',
                    name: 'Ghost Shell Parka',
                    brand: 'Syntha Lab',
                    price: '42,000 ₽',
                    image:
                      'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=800',
                    stock: '3/20',
                  },
                  {
                    id: 'drop-3',
                    name: 'Zero-G Sneakers',
                    brand: 'Syntha Lab',
                    price: '24,500 ₽',
                    image:
                      'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?q=80&w=800',
                    stock: 'Sold Out',
                  },
                ].map((drop) => (
                  <Card
                    key={drop.id}
                    className="bg-text-primary/50 border-text-primary/30 group/drop hover:border-accent-primary/50 overflow-hidden rounded-xl transition-all duration-500"
                  >
                    <div className="relative aspect-[4/5] overflow-hidden">
                      <img
                        src={drop.image}
                        alt={drop.name}
                        className="h-full w-full object-cover transition-transform duration-700 group-hover/drop:scale-110"
                      />
                      <div className="from-text-primary absolute inset-0 bg-gradient-to-t via-transparent to-transparent opacity-60" />
                      <div className="absolute left-6 top-4">
                        <Badge className="rounded-full border-white/10 bg-black/80 px-3 py-1 text-[10px] font-bold uppercase text-white backdrop-blur-md">
                          {drop.stock === 'Sold Out' ? 'SOLD OUT' : `STOCK: ${drop.stock}`}
                        </Badge>
                      </div>
                      <div className="absolute bottom-6 left-6 right-6">
                        <p className="text-accent-primary mb-1 text-[10px] font-bold uppercase tracking-wide">
                          {drop.brand}
                        </p>
                        <h3 className="text-sm font-bold uppercase leading-tight tracking-tight text-white">
                          {drop.name}
                        </h3>
                      </div>
                    </div>
                    <CardContent className="flex items-center justify-between p-4">
                      <span className="text-sm font-bold text-white">{drop.price}</span>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="hover:text-accent-primary h-auto p-0 text-xs font-bold uppercase tracking-wide text-white hover:bg-transparent"
                      >
                        Забронировать <ArrowRight className="ml-2 h-3 w-3" />
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      {/* AI Stylist Section — те же отступы и структура, что у SHOWCASE_b2c */}
      {viewRole === 'client' && (
        <section
          id="AI_STYLIST_b2c"
          className="section-spacing relative scroll-mt-24 bg-transparent"
        >
          <div className="relative mx-auto w-full max-w-5xl px-4 sm:px-6">
            <Card className="border-border-subtle relative overflow-hidden rounded-xl border border-none bg-white shadow-2xl shadow-md">
              <CardContent className="relative z-10 p-4 pb-4 pt-4">
                <div className="mb-2 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="bg-bg-surface2 flex h-8 w-8 items-center justify-center rounded-xl">
                        <Brain className="h-4 w-4 text-black" />
                      </div>
                      <Badge
                        variant="outline"
                        className="border-border-default text-text-primary px-2 py-0.5 text-xs font-semibold uppercase tracking-wide"
                      >
                        ALGORITHM_B2C
                      </Badge>
                    </div>
                    <div className="space-y-1">
                      <h2 className="text-text-primary text-2xl font-bold uppercase leading-tight tracking-tight md:text-4xl">
                        AI-стилист
                      </h2>
                      <p className="text-text-secondary max-w-xl text-sm">
                        Создавайте уникальные комбинации в один клик.
                      </p>
                    </div>
                  </div>
                </div>
                <StylistPanel viewRole={viewRole} />
              </CardContent>
            </Card>
          </div>
        </section>
      )}

      {/* Weekly Looks — те же отступы и структура, что у SHOWCASE_b2c */}
      {viewRole === 'client' && (
        <section
          id="WEEKLY_LOOKS_b2c"
          className="section-spacing relative scroll-mt-24 bg-transparent"
        >
          <div className="relative mx-auto w-full max-w-5xl px-4 sm:px-6">
            <Card className="border-border-subtle relative overflow-hidden rounded-xl border border-none bg-white shadow-2xl shadow-md">
              <CardContent className="relative z-10 p-4">
                <WeeklyLooks
                  viewRole={viewRole}
                  productPreviews={totalLookCards
                    .flatMap(
                      (l) =>
                        (
                          l as {
                            products?: {
                              id: string;
                              name: string;
                              image: string;
                              brand: string;
                              price: number;
                            }[];
                          }
                        ).products ?? []
                    )
                    .slice(0, 6)}
                  showroomAnchor="SHOWCASE_b2b"
                />
              </CardContent>
            </Card>
          </div>
        </section>
      )}

      {/* Available Media — те же отступы и структура, что у SHOWCASE_b2c */}
      {viewRole === 'client' && (
        <section id="MEDIA_b2c" className="section-spacing relative scroll-mt-24 bg-transparent">
          <div className="relative mx-auto w-full max-w-5xl px-4 sm:px-6">
            <Card className="border-border-subtle relative overflow-hidden rounded-xl border border-none bg-white shadow-2xl shadow-md">
              <CardContent className="relative z-10 p-4">
                <HomeLiveStrip live={cfg.live} />
              </CardContent>
            </Card>
          </div>
        </section>
      )}

      {/* New Editorial & Social Sections for B2C */}
      {viewRole === 'client' && (
        <>
          <section
            id="SOCIAL_SYNC_b2c"
            className="section-spacing relative scroll-mt-24 bg-transparent"
          >
            <div className="relative mx-auto w-full max-w-5xl px-4 sm:px-6">
              <Card className="border-border-subtle relative overflow-hidden rounded-xl border border-none bg-white shadow-2xl shadow-md">
                <CardContent className="relative z-10 p-4">
                  <AsSeenOnLive />
                </CardContent>
              </Card>
            </div>
          </section>

          <section
            id="EDITORIAL_b2c"
            className="section-spacing relative scroll-mt-24 bg-transparent"
          >
            <div className="relative mx-auto w-full max-w-5xl px-4 sm:px-6">
              <Card className="border-border-subtle relative overflow-hidden rounded-xl border border-none bg-white shadow-2xl shadow-md">
                <CardContent className="relative z-10 p-4">
                  <SynthaEdit />
                </CardContent>
              </Card>
            </div>
          </section>
        </>
      )}

      {/* Bottom B2B News / Platform Updates Section with multiple slots */}
      <B2BUpdatesSection />

      {/* Look Details Dialog */}
      <LookDetailsDialog
        isOpen={isLookDetailsOpen}
        onOpenChange={setIsLookDetailsOpen}
        selectedLook={selectedLook}
        viewRole={viewRole}
        setShowroomViewMode={setShowroomViewMode}
      />
      {/* Audit Trail Dialog */}
      <AuditTrailDialog isOpen={isAuditTrailOpen} onOpenChange={setIsAuditTrailOpen} />

      {/* Smart Checkout Modal */}
      <SmartCheckoutDialog
        isOpen={isCheckoutModalOpen}
        onOpenChange={setIsCheckoutModalOpen}
        toast={toast}
      />
    </div>
  );
}

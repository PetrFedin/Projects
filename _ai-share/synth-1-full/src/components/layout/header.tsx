'use client';
import Link from 'next/link';
import Logo from '@/components/logo';
import UserNav from '@/components/user-nav';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Star,
  Menu,
  ShoppingCart,
  Zap,
  Activity,
  Globe,
  ShieldCheck,
  Clock,
  Users,
  ChevronDown,
  Shield,
  Store,
  Briefcase,
  Factory,
  Warehouse,
  User,
  RefreshCw,
  LogIn,
} from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useState, useEffect } from 'react';
import { useUIState } from '@/providers/ui-state';
import { cn } from '@/lib/utils';
import { leftSidebarNavLinks } from './left-sidebar-nav';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/providers/auth-provider';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import { SearchBar } from '@/components/search/SearchBar';
import { organizations, partnerTeams } from '@/components/team/_fixtures/team-data';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronRight, Sparkles } from 'lucide-react';

import { useIdentitySwitch } from '@/hooks/use-identity-switch';
export default function Header() {
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const {
    toggleCart,
    toggleWishlist,
    togglePreOrder,
    cart,
    wishlistCollections,
    preOrders,
    viewRole,
    setViewRole,
    isFlowMapOpen,
    isCalendarOpen,
    isMediaRadarOpen,
    isConstellationOpen,
  } = useUIState();
  const { user, signIn, updateProfile } = useAuth();
  const { handleIdentitySwitch } = useIdentitySwitch();
  const pathname = usePathname();
  const router = useRouter();
  const [time, setTime] = useState<string>('');
  const [mounted, setMounted] = useState(false);

<<<<<<< HEAD
  const getDynamicNavLinks = () => {
    const isB2B = viewRole === 'b2b';
    const role = user?.activeOrganizationId?.includes('org-brand')
      ? 'brand'
      : user?.activeOrganizationId?.includes('org-factory')
        ? 'manufacturer'
        : user?.activeOrganizationId?.includes('org-shop')
          ? 'shop'
          : 'client';

    if (!isB2B) {
      return [
        { href: '/search', label: 'АССОРТИМЕНТ' },
        { href: ROUTES.catalog, label: 'КАТАЛОГ БРЕНДОВ' },
        { href: '/brands', label: 'БРЕНДЫ' },
        { href: '/look-builder', label: 'КОНСТРУКТОР ОБРАЗОВ' },
        { href: '/loyalty', label: 'ЛОЯЛЬНОСТЬ' },
        { href: '/academy', label: 'АКАДЕМИЯ' },
        { href: '/wallet', label: 'КОШЕЛЕК SYNTHA' },
        { href: '/live', label: 'LIVE' },
        { href: '/auctions', label: 'АУКЦИОНЫ' },
      ];
    }

    // B2B Mode Dynamic Links — все ссылки через ROUTES для связности платформы
    const links = [
      { href: '/search', label: 'B2B КАТАЛОГ' },
      { href: ROUTES.catalog, label: 'КАТАЛОГ БРЕНДОВ' },
      { href: ROUTES.shop.b2bPartners, label: 'ПАРТНЕРЫ' },
      { href: ROUTES.academyPlatform, label: 'B2B АКАДЕМИЯ' },
      { href: '/wallet', label: 'КОШЕЛЕК SYNTHA' },
      { href: '/loyalty', label: 'CRM & ЛОЯЛЬНОСТЬ' },
    ];

    if (role === 'brand') {
      links.push(
        { href: '/brand/linesheets', label: 'ЛАЙНШИТЫ' },
        { href: '/brand/ai-tools', label: 'ГЕНЕРАТОР КАМПАНИЙ' },
        { href: '/brand/pricing', label: 'AI ЦЕНООБРАЗОВАНИЕ' },
        { href: '/brand/vmi', label: 'VMI ПОРТАЛ' },
        { href: '/brand/esg', label: 'ESG ВЛИЯНИЕ' }
      );
    } else if (role === 'manufacturer') {
      links.push(
        { href: '/factory/production', label: 'ЦЕХ В РЕАЛЬНОМ ВРЕМЕНИ' },
        { href: '/factory/auctions', label: 'АУКЦИОН СЛОТОВ' }
      );
    } else if (role === 'shop') {
      links.push(
        { href: '/shop/b2b/replenishment', label: 'ПОПОЛНЕНИЕ' },
        { href: '/shop/clienteling', label: 'КЛИЕНТИНГ' },
        { href: '/live', label: 'LIVE ЗАКУПКИ' },
        { href: '/auctions', label: 'АУКЦИОНЫ СТОКА' }
      );
    }

    return links;
  };
=======
  /** Верхняя полоса: одинаковая для B2C и B2B; каталог опта — в `/shop`. */
  const getDynamicNavLinks = () => [
    { href: '/search', label: 'АССОРТИМЕНТ' },
    { href: '/brands', label: 'БРЕНДЫ' },
    { href: '/live', label: 'LIVE' },
    { href: '/loyalty', label: 'ЛОЯЛЬНОСТЬ' },
  ];
>>>>>>> recover/cabinet-wip-from-stash

  const navLinks = getDynamicNavLinks();

  const mobileSheetLinks = [
    ...navLinks,
    ...leftSidebarNavLinks.flatMap((item) =>
      'sections' in item
        ? item.sections.map((s) => ({ href: s.href, label: s.label }))
        : [{ href: item.href, label: item.label }]
    ),
  ];

  const handleLogin = async (email: string, roleKey: string, organizationId?: string) => {
    await handleIdentitySwitch(email, roleKey, organizationId);
  };

  useEffect(() => {
    setMounted(true);
    const timer = setInterval(() => {
      setTime(new Date().toLocaleTimeString('ru-RU', { hour12: false }));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const cartItemCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const wishlistItemCount = wishlistCollections.reduce(
    (acc, collection) => acc + collection.items.length,
    0
  );
  const preOrderItemCount = (preOrders || []).length;
  const cartBadgeText = cartItemCount > 99 ? '99+' : String(cartItemCount);
  const wishlistBadgeText = wishlistItemCount > 99 ? '99+' : String(wishlistItemCount);
  const preOrderBadgeText = preOrderItemCount > 99 ? '99+' : String(preOrderItemCount);

  const isLiveNow = true;

  // if (!mounted) return null;

  return (
    <header
      className={cn(
<<<<<<< HEAD
        'sticky top-0 z-50 w-full border-b border-slate-100 bg-white/90 backdrop-blur-xl transition-all duration-300'
=======
        'border-border-subtle sticky top-0 z-50 w-full border-b bg-white/90 backdrop-blur-xl transition-all duration-300'
>>>>>>> recover/cabinet-wip-from-stash
      )}
    >
      <div className="container relative mx-auto flex h-12 items-center px-4 sm:px-6 lg:px-10">
        {/* Mobile Menu */}
        <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="mr-4 md:hidden">
              <Menu className="h-6 w-6" />
              <span className="sr-only">Открыть меню</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="flex w-[300px] flex-col sm:w-[400px]">
<<<<<<< HEAD
            <div className="mt-4 flex w-fit items-center gap-1 rounded-xl border border-slate-800 bg-slate-900 p-1">
=======
            <div className="bg-text-primary border-text-primary/30 mt-4 flex w-fit items-center gap-1 rounded-xl border p-1">
>>>>>>> recover/cabinet-wip-from-stash
              <Button
                variant="ghost"
                size="sm"
                className={cn(
                  'flex h-8 items-center gap-2 rounded-lg px-4 text-[9px] font-black uppercase tracking-widest transition-all',
                  viewRole === 'client'
                    ? 'bg-white text-black shadow-lg'
                    : 'text-white/40 hover:text-white'
                )}
                onClick={() => setViewRole('client')}
              >
                <Users className="h-3.5 w-3.5" />
                Режим B2C
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className={cn(
                  'flex h-8 items-center gap-2 rounded-lg px-4 text-[9px] font-black uppercase tracking-widest transition-all',
                  viewRole === 'b2b'
                    ? 'bg-white text-black shadow-lg'
                    : 'text-white/40 hover:text-white'
                )}
                onClick={() => setViewRole('b2b')}
              >
                <ShieldCheck className="h-3.5 w-3.5" />
                Режим B2B
              </Button>
            </div>
            <nav className="mt-8 flex flex-1 flex-col gap-3">
<<<<<<< HEAD
              {[...navLinks, ...leftSidebarNavLinks].map((link) => (
=======
              {mobileSheetLinks.map((link) => (
>>>>>>> recover/cabinet-wip-from-stash
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsSheetOpen(false)}
                  className="block px-2 py-1 text-sm font-medium text-foreground hover:text-accent"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </SheetContent>
        </Sheet>

        {/* Desktop Menu */}
        <div className="relative z-50 mr-4 hidden md:flex">
          <Link
            href="/"
            prefetch
            className="focus-visible:ring-accent-primary/35 flex items-center rounded-sm outline-none transition-opacity hover:opacity-70 focus-visible:ring-2 focus-visible:ring-offset-2"
          >
            <Logo className="pointer-events-none h-6 w-auto" />
            <span className="sr-only">Syntha — на главную</span>
          </Link>
        </div>

        <nav className="ml-4 hidden flex-nowrap items-center gap-x-4 overflow-x-auto text-[9.2px] font-medium uppercase tracking-tight md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                'flex h-7 flex-shrink-0 shrink-0 items-center gap-1 whitespace-nowrap transition-all hover:text-black',
<<<<<<< HEAD
                pathname === link.href ? 'text-black' : 'text-slate-900',
                link.label === 'LIVE' &&
                  'animate-pulse-live rounded-full border border-red-500/50 px-2.5 text-red-500 shadow-[0_0_10px_rgba(239,68,68,0.2)]'
              )}
            >
              {link.label === 'LIVE' && <span className="mr-1 font-black text-red-600">•</span>}
              {link.label}
=======
                pathname === link.href ? 'text-black' : 'text-text-primary',
                link.label === 'LIVE' && 'rounded-full px-2.5 text-red-500'
              )}
            >
              {link.label === 'LIVE' && (
                <span className="mr-1 animate-pulse-live font-black text-red-600">•</span>
              )}
              <span className={cn(link.label === 'LIVE' && 'animate-pulse-live')}>
                {link.label}
              </span>
>>>>>>> recover/cabinet-wip-from-stash
            </Link>
          ))}
        </nav>

        <div className="relative z-20 ml-auto flex items-center justify-end gap-1.5 md:gap-2">
          {/* Логотип по центру на мобиле — без flex-1, иначе пустая зона перекрывала поиск и кнопки */}
          <Link
            href="/"
            prefetch
            className="focus-visible:ring-accent-primary/35 absolute left-1/2 top-1/2 z-10 flex -translate-x-1/2 -translate-y-1/2 items-center rounded-sm outline-none transition-opacity hover:opacity-70 focus-visible:ring-2 focus-visible:ring-offset-2 md:hidden"
          >
            <Logo className="pointer-events-none h-5 w-auto max-w-[min(42vw,140px)]" />
            <span className="sr-only">Syntha — на главную</span>
          </Link>

          <SearchBar />

          {user?.roles?.includes('admin') && (
<<<<<<< HEAD
            <div className="mx-1 flex scale-95 items-center gap-0.5 rounded-lg border border-slate-800 bg-slate-900 p-0.5">
=======
            <div className="bg-text-primary border-text-primary/30 mx-1 flex scale-95 items-center gap-0.5 rounded-lg border p-0.5">
>>>>>>> recover/cabinet-wip-from-stash
              <Button
                variant="ghost"
                size="sm"
                className={cn(
                  'flex h-5 items-center gap-1 rounded-md px-2 text-[9px] font-bold uppercase tracking-normal transition-all',
                  viewRole === 'client'
                    ? 'bg-white text-black shadow-lg'
                    : 'text-white/40 hover:text-white'
                )}
                onClick={() => setViewRole('client')}
              >
                <Users className="h-2 w-2" />
                B2C
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className={cn(
                  'flex h-5 items-center gap-1 rounded-md px-2 text-[9px] font-bold uppercase tracking-normal transition-all',
                  viewRole === 'b2b'
                    ? 'bg-white text-black shadow-lg'
                    : 'text-white/40 hover:text-white'
                )}
                onClick={() => setViewRole('b2b')}
              >
                <ShieldCheck className="h-2 w-2" />
                B2B
              </Button>
            </div>
          )}

          <Button
            variant="ghost"
            size="icon"
            onClick={toggleWishlist}
<<<<<<< HEAD
            className="relative h-7 w-7 text-slate-900 transition-colors hover:bg-slate-50"
=======
            className="text-text-primary hover:bg-bg-surface2 relative h-7 w-7 transition-colors"
>>>>>>> recover/cabinet-wip-from-stash
          >
            <span className="relative inline-flex">
              <Star className="h-3.5 w-3.5" />
              {wishlistItemCount > 0 && (
                <Badge
                  variant="destructive"
                  className="absolute -right-1 -top-1 inline-flex h-2.5 min-w-2.5 items-center justify-center rounded-full px-0.5 text-[5px] font-black tabular-nums leading-none"
                >
                  {wishlistBadgeText}
                </Badge>
              )}
            </span>
            <span className="sr-only">Избранное</span>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleCart}
<<<<<<< HEAD
            className="relative h-7 w-7 text-slate-900 transition-colors hover:bg-slate-50"
=======
            className="text-text-primary hover:bg-bg-surface2 relative h-7 w-7 transition-colors"
>>>>>>> recover/cabinet-wip-from-stash
          >
            <span className="relative inline-flex">
              <ShoppingCart className="h-3.5 w-3.5" />
              {cartItemCount > 0 && (
                <Badge
                  variant="destructive"
                  className="absolute -right-1 -top-1 inline-flex h-2.5 min-w-2.5 items-center justify-center rounded-full px-0.5 text-[5px] font-black tabular-nums leading-none"
                >
                  {cartBadgeText}
                </Badge>
              )}
            </span>
            <span className="sr-only">Корзина</span>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={togglePreOrder}
<<<<<<< HEAD
            className="relative h-7 w-7 text-slate-900 transition-colors hover:bg-slate-50"
=======
            className="text-text-primary hover:bg-bg-surface2 relative h-7 w-7 transition-colors"
>>>>>>> recover/cabinet-wip-from-stash
          >
            <span className="relative inline-flex">
              <Zap className="h-3.5 w-3.5" />
              {preOrderItemCount > 0 && (
                <Badge
                  variant="destructive"
<<<<<<< HEAD
                  className="absolute -right-1 -top-1 inline-flex h-2.5 min-w-2.5 items-center justify-center rounded-full bg-slate-900 px-0.5 text-[5px] font-black tabular-nums leading-none"
=======
                  className="bg-text-primary absolute -right-1 -top-1 inline-flex h-2.5 min-w-2.5 items-center justify-center rounded-full px-0.5 text-[5px] font-black tabular-nums leading-none"
>>>>>>> recover/cabinet-wip-from-stash
                >
                  {preOrderBadgeText}
                </Badge>
              )}
            </span>
            <span className="sr-only">Предзаказ</span>
          </Button>

          <DropdownMenu modal={false}>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
<<<<<<< HEAD
                className="group h-7 w-7 rounded-[2px] border border-slate-200 transition-all hover:bg-slate-50"
              >
                <ShieldCheck className="h-3.5 w-3.5 text-slate-600 transition-colors group-hover:text-indigo-600" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="z-[600] w-[300px] overflow-hidden rounded-[2px] border border-slate-200 bg-white p-0 shadow-xl"
              align="end"
              sideOffset={4}
            >
              <div className="border-b border-slate-800 bg-slate-900 px-4 py-3">
                <div className="mb-0.5 flex items-center gap-2">
                  <Sparkles className="h-3 w-3 text-indigo-400" />
=======
                className="border-border-default hover:bg-bg-surface2 group h-7 w-7 rounded-[2px] border transition-all"
              >
                <ShieldCheck className="text-text-secondary group-hover:text-accent-primary h-3.5 w-3.5 transition-colors" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="border-border-default z-[600] w-[300px] overflow-hidden rounded-[2px] border bg-white p-0 shadow-xl"
              align="end"
              sideOffset={4}
            >
              <div className="bg-text-primary border-text-primary/30 border-b px-4 py-3">
                <div className="mb-0.5 flex items-center gap-2">
                  <Sparkles className="text-accent-primary h-3 w-3" />
>>>>>>> recover/cabinet-wip-from-stash
                  <span className="text-[8px] font-black uppercase leading-none tracking-[0.2em] text-white/40">
                    Syntha Ecosystem Access
                  </span>
                </div>
                <h3 className="text-[11px] font-black uppercase leading-none tracking-tight text-white">
                  Пульт управления доступом
                </h3>
              </div>

              <ScrollArea className="h-[400px]">
                <div className="space-y-3 p-2">
                  {[
                    { id: 'admin', label: 'Управление Syntha HQ', icon: Shield, type: 'admin' },
                    { id: 'brand', label: 'Бренды & Дизайнеры', icon: Store, type: 'brand' },
                    {
                      id: 'manufacturer',
                      label: 'Производство & Цеха',
                      icon: Factory,
                      type: 'manufacturer',
                    },
                    {
                      id: 'distributor',
                      label: 'Логистика & Хабы',
                      icon: Briefcase,
                      type: 'distributor',
                    },
                    {
                      id: 'supplier',
                      label: 'Поставщики сырья',
                      icon: Warehouse,
                      type: 'supplier',
                    },
                    { id: 'shop', label: 'Ритейл-партнеры', icon: ShoppingCart, type: 'shop' },
                    { id: 'client', label: 'Частные клиенты (B2C)', icon: User, type: 'client' },
                  ].map((role) => (
                    <div
                      key={role.id}
<<<<<<< HEAD
                      className="space-y-0.5 border-b border-slate-50 pb-2 last:border-0"
                    >
                      <div className="flex items-center gap-2 rounded-[2px] bg-slate-50/50 px-2 py-1.5 text-[8px] font-black uppercase tracking-[0.15em] text-slate-400">
=======
                      className="border-border-subtle space-y-0.5 border-b pb-2 last:border-0"
                    >
                      <div className="text-text-muted bg-bg-surface2/80 flex items-center gap-2 rounded-[2px] px-2 py-1.5 text-[8px] font-black uppercase tracking-[0.15em]">
>>>>>>> recover/cabinet-wip-from-stash
                        <role.icon className="h-2.5 w-2.5" />
                        {role.label}
                      </div>

                      {role.id === 'client' ? (
                        <DropdownMenuItem
                          onSelect={(e) => {
                            e.preventDefault();
                            handleLogin('elena.petrova@example.com', 'client');
                          }}
<<<<<<< HEAD
                          className="flex cursor-pointer items-center gap-2.5 rounded-[2px] border border-transparent p-2 transition-all hover:border-slate-100 hover:bg-slate-50"
=======
                          className="hover:bg-bg-surface2 hover:border-border-subtle flex cursor-pointer items-center gap-2.5 rounded-[2px] border border-transparent p-2 transition-all"
>>>>>>> recover/cabinet-wip-from-stash
                        >
                          <Avatar className="h-7 w-7 rounded-[2px]">
                            <AvatarImage src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop" />
                            <AvatarFallback className="rounded-[2px] text-[10px]">
                              ЕП
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex min-w-0 flex-col">
<<<<<<< HEAD
                            <span className="text-[10px] font-black leading-tight text-slate-900">
                              Елена Петрова
                            </span>
                            <span className="truncate text-[8px] font-bold uppercase tracking-tighter text-slate-400">
=======
                            <span className="text-text-primary text-[10px] font-black leading-tight">
                              Елена Петрова
                            </span>
                            <span className="text-text-muted truncate text-[8px] font-bold uppercase tracking-tighter">
>>>>>>> recover/cabinet-wip-from-stash
                              Premium B2C Profile
                            </span>
                          </div>
                          {user?.email === 'elena.petrova@example.com' && (
                            <div className="bg-accent-primary ml-auto h-1.5 w-1.5 rounded-full" />
                          )}
                        </DropdownMenuItem>
                      ) : role.id === 'admin' ? (
                        partnerTeams['org-hq-001']?.map((member: any) => (
                          <DropdownMenuItem
                            key={member.id}
                            onSelect={(e) => {
                              e.preventDefault();
                              handleLogin(member.email, 'admin', 'org-hq-001');
                            }}
<<<<<<< HEAD
                            className="flex cursor-pointer items-center gap-2.5 rounded-[2px] border border-transparent p-2 transition-all hover:border-slate-100 hover:bg-slate-50"
=======
                            className="hover:bg-bg-surface2 hover:border-border-subtle flex cursor-pointer items-center gap-2.5 rounded-[2px] border border-transparent p-2 transition-all"
>>>>>>> recover/cabinet-wip-from-stash
                          >
                            <Avatar className="h-7 w-7 rounded-[2px]">
                              <AvatarImage src={member.avatar} />
                              <AvatarFallback className="rounded-[2px] text-[10px]">
                                {member.firstName[0]}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex min-w-0 flex-col">
<<<<<<< HEAD
                              <span className="text-[10px] font-black leading-tight text-slate-900">
                                {member.firstName} {member.lastName}
                              </span>
                              <span className="truncate text-[8px] font-bold uppercase tracking-tighter text-slate-400">
=======
                              <span className="text-text-primary text-[10px] font-black leading-tight">
                                {member.firstName} {member.lastName}
                              </span>
                              <span className="text-text-muted truncate text-[8px] font-bold uppercase tracking-tighter">
>>>>>>> recover/cabinet-wip-from-stash
                                {member.role}
                              </span>
                            </div>
                            {user?.email === member.email && (
                              <div className="bg-accent-primary ml-auto h-1.5 w-1.5 rounded-full" />
                            )}
                          </DropdownMenuItem>
                        ))
                      ) : (
                        Object.values(organizations)
                          .filter((org) => org.type === role.type)
                          .map((org) => (
                            <Collapsible key={org.id} className="group/collapsible">
<<<<<<< HEAD
                              <div className="group flex w-full items-center justify-between rounded-[2px] transition-all hover:bg-slate-50">
                                <CollapsibleTrigger asChild>
                                  <div className="flex flex-1 cursor-pointer items-center gap-2.5 overflow-hidden p-2">
                                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-[2px] border border-slate-200 bg-slate-100 text-[9px] font-black uppercase text-slate-400 transition-all group-hover:bg-white group-hover:text-indigo-600">
=======
                              <div className="hover:bg-bg-surface2 group flex w-full items-center justify-between rounded-[2px] transition-all">
                                <CollapsibleTrigger asChild>
                                  <div className="flex flex-1 cursor-pointer items-center gap-2.5 overflow-hidden p-2">
                                    <div className="bg-bg-surface2 text-text-muted group-hover:text-accent-primary border-border-default flex h-7 w-7 shrink-0 items-center justify-center rounded-[2px] border text-[9px] font-black uppercase transition-all group-hover:bg-white">
>>>>>>> recover/cabinet-wip-from-stash
                                      {org.name[0]}
                                    </div>
                                    <div className="flex flex-col overflow-hidden">
                                      <div className="flex items-center gap-1.5">
<<<<<<< HEAD
                                        <span className="truncate text-[10px] font-black uppercase leading-tight tracking-tight text-slate-900">
=======
                                        <span className="text-text-primary truncate text-[10px] font-black uppercase leading-tight tracking-tight">
>>>>>>> recover/cabinet-wip-from-stash
                                          {org.name}
                                        </span>
                                        <ChevronRight className="text-text-muted h-2 w-2 transition-transform group-data-[state=open]/collapsible:rotate-90" />
                                      </div>
<<<<<<< HEAD
                                      <span className="mt-0.5 text-[8px] font-bold uppercase tracking-widest text-slate-400">
=======
                                      <span className="text-text-muted mt-0.5 text-[8px] font-bold uppercase tracking-widest">
>>>>>>> recover/cabinet-wip-from-stash
                                        {partnerTeams[org.id]?.length || 1} USERS
                                      </span>
                                    </div>
                                  </div>
                                </CollapsibleTrigger>

                                {user?.organizations?.some((o) => o.organizationId === org.id) && (
                                  <Button
                                    variant="ghost"
                                    size="icon"
<<<<<<< HEAD
                                    className="mr-1 h-6 w-6 rounded-[2px] text-slate-300 transition-all hover:bg-indigo-50 hover:text-indigo-600"
=======
                                    className="text-text-muted hover:text-accent-primary hover:bg-accent-primary/10 mr-1 h-6 w-6 rounded-[2px] transition-all"
>>>>>>> recover/cabinet-wip-from-stash
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleLogin(user!.email, role.id, org.id);
                                    }}
                                    title="Войти как организация"
                                  >
                                    <RefreshCw
                                      className={cn(
                                        'h-3 w-3',
                                        user?.activeOrganizationId === org.id &&
<<<<<<< HEAD
                                          'animate-spin-slow text-indigo-600'
=======
                                          'text-accent-primary animate-spin-slow'
>>>>>>> recover/cabinet-wip-from-stash
                                      )}
                                    />
                                  </Button>
                                )}
                              </div>
<<<<<<< HEAD
                              <CollapsibleContent className="ml-5 mt-0.5 space-y-0.5 border-l border-slate-100 pb-1 pl-9 pr-1">
=======
                              <CollapsibleContent className="border-border-subtle ml-5 mt-0.5 space-y-0.5 border-l pb-1 pl-9 pr-1">
>>>>>>> recover/cabinet-wip-from-stash
                                {(
                                  partnerTeams[org.id] || [
                                    {
                                      email: org.ownerId + '@syntha.ai',
                                      firstName: org.name.split(' ')[0],
                                      lastName: '',
                                      avatar: org.logo,
                                      role: 'Owner',
                                      id: org.ownerId,
                                    },
                                  ]
                                ).map((member: any) => (
                                  <DropdownMenuItem
                                    key={member.id || member.email}
                                    onSelect={(e) => {
                                      e.preventDefault();
                                      handleLogin(member.email, role.id, org.id);
                                    }}
<<<<<<< HEAD
                                    className="group/member flex cursor-pointer items-center gap-2 rounded-[2px] p-1.5 outline-none transition-all hover:bg-indigo-50"
=======
                                    className="hover:bg-accent-primary/10 group/member flex cursor-pointer items-center gap-2 rounded-[2px] p-1.5 outline-none transition-all"
>>>>>>> recover/cabinet-wip-from-stash
                                  >
                                    <Avatar className="ring-border-subtle h-5 w-5 rounded-[2px] border border-white shadow-sm ring-1">
                                      <AvatarImage src={member.avatar} />
                                      <AvatarFallback className="rounded-[2px] text-[7px]">
                                        {(member.firstName || member.name)[0]}
                                      </AvatarFallback>
                                    </Avatar>
                                    <div className="flex min-w-0 flex-1 flex-col">
<<<<<<< HEAD
                                      <span className="truncate text-[9px] font-black leading-none text-slate-700 transition-colors group-hover/member:text-indigo-600">
                                        {member.firstName} {member.lastName}
                                      </span>
                                      <span className="mt-0.5 truncate text-[7px] font-bold uppercase tracking-tighter text-slate-400">
                                        {member.role}
                                      </span>
                                    </div>
                                    <LogIn className="h-2 w-2 text-slate-200 opacity-0 transition-colors group-hover/member:text-indigo-400 group-hover/member:opacity-100" />
                                    {user?.email === member.email &&
                                      user?.activeOrganizationId === org.id && (
                                        <div className="h-1 w-1 rounded-full bg-indigo-500" />
=======
                                      <span className="text-text-primary group-hover/member:text-accent-primary truncate text-[9px] font-black leading-none transition-colors">
                                        {member.firstName} {member.lastName}
                                      </span>
                                      <span className="text-text-muted mt-0.5 truncate text-[7px] font-bold uppercase tracking-tighter">
                                        {member.role}
                                      </span>
                                    </div>
                                    <LogIn className="text-text-muted group-hover/member:text-accent-primary h-2 w-2 opacity-0 transition-colors group-hover/member:opacity-100" />
                                    {user?.email === member.email &&
                                      user?.activeOrganizationId === org.id && (
                                        <div className="bg-accent-primary h-1 w-1 rounded-full" />
>>>>>>> recover/cabinet-wip-from-stash
                                      )}
                                  </DropdownMenuItem>
                                ))}
                              </CollapsibleContent>
                            </Collapsible>
                          ))
                      )}
                    </div>
                  ))}
                </div>
              </ScrollArea>

<<<<<<< HEAD
              <div className="flex items-center justify-between border-t border-slate-200 bg-slate-50 px-4 py-3">
                <div className="flex flex-col">
                  <span className="mb-1 text-[7px] font-black uppercase leading-none tracking-widest text-slate-400">
                    Session Node
                  </span>
                  <span className="max-w-[120px] truncate text-[9px] font-black uppercase leading-none text-slate-900">
                    {user?.displayName || 'Guest'}
                  </span>
                  <span className="mt-1 truncate text-[7px] text-slate-400">{user?.email}</span>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <Badge className="rounded-[2px] border-slate-200 bg-white px-1.5 py-0 text-[8px] font-black text-indigo-600">
=======
              <div className="bg-bg-surface2 border-border-default flex items-center justify-between border-t px-4 py-3">
                <div className="flex flex-col">
                  <span className="text-text-muted mb-1 text-[7px] font-black uppercase leading-none tracking-widest">
                    Session Node
                  </span>
                  <span className="text-text-primary max-w-[120px] truncate text-[9px] font-black uppercase leading-none">
                    {user?.displayName || 'Guest'}
                  </span>
                  <span className="text-text-muted mt-1 truncate text-[7px]">{user?.email}</span>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <Badge className="text-accent-primary border-border-default rounded-[2px] bg-white px-1.5 py-0 text-[8px] font-black">
>>>>>>> recover/cabinet-wip-from-stash
                    {user?.activeOrganizationId
                      ? organizations[user.activeOrganizationId]?.name
                      : 'B2C_ROOT'}
                  </Badge>
<<<<<<< HEAD
                  <span className="text-[7px] font-bold uppercase text-slate-300">
=======
                  <span className="text-text-muted text-[7px] font-bold uppercase">
>>>>>>> recover/cabinet-wip-from-stash
                    ID: {user?.activeOrganizationId || 'NULL'}
                  </span>
                </div>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          <UserNav />
        </div>
      </div>
    </header>
  );
}

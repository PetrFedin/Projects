'use client';
import Link from 'next/link';
import Logo from '@/components/logo';
import UserNav from '@/components/user-nav';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Star, Menu, ShoppingCart, Zap, Activity, Globe, ShieldCheck, Clock, Users, ChevronDown, Shield, Store, Briefcase, Factory, Warehouse, User, RefreshCw, LogIn } from 'lucide-react';
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
import { ROUTES } from '@/lib/routes';

export default function Header() {
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const { toggleCart, toggleWishlist, togglePreOrder, cart, wishlistCollections, preOrders, viewRole, setViewRole, isFlowMapOpen, isCalendarOpen, isMediaRadarOpen, isConstellationOpen } = useUIState();
  const { user, signIn, updateProfile } = useAuth();
  const { handleIdentitySwitch } = useIdentitySwitch();
  const pathname = usePathname();
  const router = useRouter();
  const [time, setTime] = useState<string>("");
  const [mounted, setMounted] = useState(false);

  const getDynamicNavLinks = () => {
    const isB2B = viewRole === 'b2b';
    const role = user?.activeOrganizationId?.includes('org-brand') ? 'brand' : 
                 user?.activeOrganizationId?.includes('org-factory') ? 'manufacturer' :
                 user?.activeOrganizationId?.includes('org-shop') ? 'shop' : 'client';

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

  const navLinks = getDynamicNavLinks();

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
  const wishlistItemCount = wishlistCollections.reduce((acc, collection) => acc + collection.items.length, 0);
  const preOrderItemCount = (preOrders || []).length;
  const cartBadgeText = cartItemCount > 99 ? '99+' : String(cartItemCount);
  const wishlistBadgeText = wishlistItemCount > 99 ? '99+' : String(wishlistItemCount);
  const preOrderBadgeText = preOrderItemCount > 99 ? '99+' : String(preOrderItemCount);

  const isLiveNow = true;

  // if (!mounted) return null;

  return (
    <header className={cn(
      "sticky top-0 z-50 w-full bg-white/90 backdrop-blur-xl border-b border-slate-100 transition-all duration-300"
    )}>
      <div className="container relative mx-auto flex h-12 items-center px-4 sm:px-6 lg:px-10">
        {/* Mobile Menu */}
        <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden mr-4">
              <Menu className="h-6 w-6" />
              <span className="sr-only">Открыть меню</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[300px] sm:w-[400px] flex flex-col">
            <div className="flex items-center gap-1 p-1 bg-slate-900 border border-slate-800 rounded-xl w-fit mt-4">
              <Button 
                variant="ghost" 
                size="sm"
                className={cn(
                  "h-8 rounded-lg font-black text-[9px] uppercase tracking-widest px-4 transition-all flex items-center gap-2",
                  viewRole === 'client' ? "bg-white text-black shadow-lg" : "text-white/40 hover:text-white"
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
                  "h-8 rounded-lg font-black text-[9px] uppercase tracking-widest px-4 transition-all flex items-center gap-2",
                  viewRole === 'b2b' ? "bg-white text-black shadow-lg" : "text-white/40 hover:text-white"
                )}
                onClick={() => setViewRole('b2b')}
              >
                <ShieldCheck className="h-3.5 w-3.5" />
                Режим B2B
              </Button>
            </div>
            <nav className="flex flex-col gap-3 mt-8 flex-1">
              {[...navLinks, ...leftSidebarNavLinks].map((link) => (
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
        <div className="hidden md:flex relative z-50 mr-4">
          <Link
            href="/"
            prefetch
            className="flex items-center rounded-sm outline-none transition-opacity hover:opacity-70 focus-visible:ring-2 focus-visible:ring-indigo-500/35 focus-visible:ring-offset-2"
          >
            <Logo className="pointer-events-none h-6 w-auto" />
            <span className="sr-only">Syntha — на главную</span>
          </Link>
        </div>

        <nav className="hidden md:flex items-center gap-x-4 ml-4 text-[9.2px] font-medium uppercase tracking-tight flex-nowrap overflow-x-auto">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                    "transition-all hover:text-black flex items-center gap-1 whitespace-nowrap h-7 shrink-0 flex-shrink-0",
                    pathname === link.href ? "text-black" : "text-slate-900",
                    link.label === 'LIVE' && "px-2.5 border border-red-500/50 rounded-full text-red-500 animate-pulse-live shadow-[0_0_10px_rgba(239,68,68,0.2)]"
                )}
              >
                {link.label === 'LIVE' && (
                    <span className="text-red-600 font-black mr-1">•</span>
                )}
                {link.label}
              </Link>
            ))}
        </nav>

        <div className="relative z-20 flex items-center justify-end gap-1.5 md:gap-2 ml-auto">
          {/* Логотип по центру на мобиле — без flex-1, иначе пустая зона перекрывала поиск и кнопки */}
          <Link
            href="/"
            prefetch
            className="absolute left-1/2 top-1/2 z-10 flex -translate-x-1/2 -translate-y-1/2 items-center rounded-sm outline-none transition-opacity hover:opacity-70 focus-visible:ring-2 focus-visible:ring-indigo-500/35 focus-visible:ring-offset-2 md:hidden"
          >
            <Logo className="pointer-events-none h-5 w-auto max-w-[min(42vw,140px)]" />
            <span className="sr-only">Syntha — на главную</span>
          </Link>
          
          <SearchBar />

          {user?.roles?.includes('admin') && (
            <div className="flex items-center gap-0.5 p-0.5 bg-slate-900 border border-slate-800 rounded-lg scale-95 mx-1">
              <Button 
                variant="ghost" 
                size="sm"
                className={cn(
                  "h-5 rounded-md font-bold text-[9px] uppercase tracking-normal px-2 transition-all flex items-center gap-1",
                  viewRole === 'client' ? "bg-white text-black shadow-lg" : "text-white/40 hover:text-white"
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
                  "h-5 rounded-md font-bold text-[9px] uppercase tracking-normal px-2 transition-all flex items-center gap-1",
                  viewRole === 'b2b' ? "bg-white text-black shadow-lg" : "text-white/40 hover:text-white"
                )}
                onClick={() => setViewRole('b2b')}
              >
                <ShieldCheck className="h-2 w-2" />
                B2B
              </Button>
            </div>
          )}

          <Button variant="ghost" size="icon" onClick={toggleWishlist} className="relative h-7 w-7 text-slate-900 hover:bg-slate-50 transition-colors">
            <span className="relative inline-flex">
              <Star className="h-3.5 w-3.5" />
              {wishlistItemCount > 0 && (
                <Badge
                  variant="destructive"
                  className="absolute -top-1 -right-1 inline-flex h-2.5 min-w-2.5 items-center justify-center rounded-full px-0.5 text-[5px] font-black leading-none tabular-nums"
                >
                  {wishlistBadgeText}
                </Badge>
              )}
            </span>
            <span className="sr-only">Избранное</span>
          </Button>
          <Button variant="ghost" size="icon" onClick={toggleCart} className="relative h-7 w-7 text-slate-900 hover:bg-slate-50 transition-colors">
            <span className="relative inline-flex">
              <ShoppingCart className="h-3.5 w-3.5" />
              {cartItemCount > 0 && (
                <Badge
                  variant="destructive"
                  className="absolute -top-1 -right-1 inline-flex h-2.5 min-w-2.5 items-center justify-center rounded-full px-0.5 text-[5px] font-black leading-none tabular-nums"
                >
                  {cartBadgeText}
                </Badge>
              )}
            </span>
            <span className="sr-only">Корзина</span>
          </Button>
          <Button variant="ghost" size="icon" onClick={togglePreOrder} className="relative h-7 w-7 text-slate-900 hover:bg-slate-50 transition-colors">
            <span className="relative inline-flex">
              <Zap className="h-3.5 w-3.5" />
              {preOrderItemCount > 0 && (
                <Badge
                  variant="destructive"
                  className="absolute -top-1 -right-1 inline-flex h-2.5 min-w-2.5 items-center justify-center rounded-full px-0.5 text-[5px] font-black leading-none tabular-nums bg-slate-900"
                >
                  {preOrderBadgeText}
                </Badge>
              )}
            </span>
            <span className="sr-only">Предзаказ</span>
          </Button>

          <DropdownMenu modal={false}>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-7 w-7 border border-slate-200 hover:bg-slate-50 rounded-[2px] transition-all group">
                <ShieldCheck className="h-3.5 w-3.5 text-slate-600 group-hover:text-indigo-600 transition-colors" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="z-[600] w-[300px] rounded-[2px] p-0 overflow-hidden border border-slate-200 bg-white shadow-xl" align="end" sideOffset={4}>
              <div className="bg-slate-900 px-4 py-3 border-b border-slate-800">
                <div className="flex items-center gap-2 mb-0.5">
                  <Sparkles className="h-3 w-3 text-indigo-400" />
                  <span className="text-[8px] font-black uppercase tracking-[0.2em] text-white/40 leading-none">Syntha Ecosystem Access</span>
                </div>
                <h3 className="text-white text-[11px] font-black tracking-tight leading-none uppercase">Пульт управления доступом</h3>
              </div>
              
              <ScrollArea className="h-[400px]">
                <div className="p-2 space-y-3">
                  {[
                    { id: 'admin', label: 'Управление Syntha HQ', icon: Shield, type: 'admin' },
                    { id: 'brand', label: 'Бренды & Дизайнеры', icon: Store, type: 'brand' },
                    { id: 'manufacturer', label: 'Производство & Цеха', icon: Factory, type: 'manufacturer' },
                    { id: 'distributor', label: 'Логистика & Хабы', icon: Briefcase, type: 'distributor' },
                    { id: 'supplier', label: 'Поставщики сырья', icon: Warehouse, type: 'supplier' },
                    { id: 'shop', label: 'Ритейл-партнеры', icon: ShoppingCart, type: 'shop' },
                    { id: 'client', label: 'Частные клиенты (B2C)', icon: User, type: 'client' },
                  ].map((role) => (
                    <div key={role.id} className="space-y-0.5 border-b border-slate-50 pb-2 last:border-0">
                      <div className="flex items-center gap-2 px-2 py-1.5 text-[8px] font-black uppercase tracking-[0.15em] text-slate-400 bg-slate-50/50 rounded-[2px]">
                        <role.icon className="h-2.5 w-2.5" />
                        {role.label}
                      </div>

                      {role.id === 'client' ? (
                        <DropdownMenuItem
                          onSelect={(e) => {
                            e.preventDefault();
                            handleLogin('elena.petrova@example.com', 'client');
                          }}
                          className="flex items-center gap-2.5 p-2 cursor-pointer rounded-[2px] hover:bg-slate-50 transition-all border border-transparent hover:border-slate-100"
                        >
                          <Avatar className="h-7 w-7 rounded-[2px]">
                            <AvatarImage src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop" />
                            <AvatarFallback className="rounded-[2px] text-[10px]">ЕП</AvatarFallback>
                          </Avatar>
                          <div className="flex flex-col min-w-0">
                            <span className="text-[10px] font-black text-slate-900 leading-tight">Елена Петрова</span>
                            <span className="text-[8px] font-bold text-slate-400 uppercase tracking-tighter truncate">Premium B2C Profile</span>
                          </div>
                          {user?.email === 'elena.petrova@example.com' && (
                            <div className="ml-auto h-1.5 w-1.5 rounded-full bg-indigo-500" />
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
                            className="flex items-center gap-2.5 p-2 cursor-pointer rounded-[2px] hover:bg-slate-50 transition-all border border-transparent hover:border-slate-100"
                          >
                            <Avatar className="h-7 w-7 rounded-[2px]">
                              <AvatarImage src={member.avatar} />
                              <AvatarFallback className="rounded-[2px] text-[10px]">{member.firstName[0]}</AvatarFallback>
                            </Avatar>
                            <div className="flex flex-col min-w-0">
                              <span className="text-[10px] font-black text-slate-900 leading-tight">{member.firstName} {member.lastName}</span>
                              <span className="text-[8px] font-bold text-slate-400 uppercase tracking-tighter truncate">{member.role}</span>
                            </div>
                            {user?.email === member.email && (
                              <div className="ml-auto h-1.5 w-1.5 rounded-full bg-indigo-500" />
                            )}
                          </DropdownMenuItem>
                        ))
                      ) : (
                        Object.values(organizations)
                          .filter(org => org.type === role.type)
                          .map(org => (
                            <Collapsible key={org.id} className="group/collapsible">
                              <div className="flex items-center justify-between w-full rounded-[2px] hover:bg-slate-50 transition-all group">
                                <CollapsibleTrigger asChild>
                                  <div className="flex items-center gap-2.5 overflow-hidden flex-1 p-2 cursor-pointer">
                                    <div className="h-7 w-7 rounded-[2px] bg-slate-100 flex items-center justify-center text-[9px] font-black uppercase text-slate-400 group-hover:bg-white group-hover:text-indigo-600 transition-all border border-slate-200 shrink-0">
                                      {org.name[0]}
                                    </div>
                                    <div className="flex flex-col overflow-hidden">
                                      <div className="flex items-center gap-1.5">
                                        <span className="text-[10px] font-black uppercase tracking-tight truncate text-slate-900 leading-tight">
                                          {org.name}
                                        </span>
                                        <ChevronRight className="h-2 w-2 text-slate-300 transition-transform group-data-[state=open]/collapsible:rotate-90" />
                                      </div>
                                      <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">
                                        {partnerTeams[org.id]?.length || 1} USERS
                                      </span>
                                    </div>
                                  </div>
                                </CollapsibleTrigger>
                                
                                {user?.organizations?.some(o => o.organizationId === org.id) && (
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-6 w-6 rounded-[2px] mr-1 text-slate-300 hover:text-indigo-600 hover:bg-indigo-50 transition-all"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleLogin(user!.email, role.id, org.id);
                                    }}
                                    title="Войти как организация"
                                  >
                                    <RefreshCw className={cn(
                                      "h-3 w-3",
                                      user?.activeOrganizationId === org.id && "text-indigo-600 animate-spin-slow"
                                    )} />
                                  </Button>
                                )}
                              </div>
                              <CollapsibleContent className="pl-9 pr-1 space-y-0.5 mt-0.5 pb-1 border-l border-slate-100 ml-5">
                                {(partnerTeams[org.id] || [
                                  { email: org.ownerId + '@syntha.ai', firstName: org.name.split(' ')[0], lastName: '', avatar: org.logo, role: 'Owner', id: org.ownerId }
                                ]).map((member: any) => (
                                  <DropdownMenuItem
                                    key={member.id || member.email}
                                    onSelect={(e) => {
                                      e.preventDefault();
                                      handleLogin(member.email, role.id, org.id);
                                    }}
                                    className="flex items-center gap-2 p-1.5 cursor-pointer rounded-[2px] hover:bg-indigo-50 transition-all group/member outline-none"
                                  >
                                    <Avatar className="h-5 w-5 rounded-[2px] border border-white shadow-sm ring-1 ring-slate-100">
                                      <AvatarImage src={member.avatar} />
                                      <AvatarFallback className="text-[7px] rounded-[2px]">{(member.firstName || member.name)[0]}</AvatarFallback>
                                    </Avatar>
                                    <div className="flex flex-col min-w-0 flex-1">
                                      <span className="text-[9px] font-black text-slate-700 truncate group-hover/member:text-indigo-600 transition-colors leading-none">
                                        {member.firstName} {member.lastName}
                                      </span>
                                      <span className="text-[7px] font-bold text-slate-400 uppercase tracking-tighter truncate mt-0.5">
                                        {member.role}
                                      </span>
                                    </div>
                                    <LogIn className="h-2 w-2 text-slate-200 group-hover/member:text-indigo-400 transition-colors opacity-0 group-hover/member:opacity-100" />
                                    {user?.email === member.email && user?.activeOrganizationId === org.id && (
                                      <div className="h-1 w-1 rounded-full bg-indigo-500" />
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
              
              <div className="bg-slate-50 px-4 py-3 border-t border-slate-200 flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="text-[7px] font-black uppercase tracking-widest text-slate-400 leading-none mb-1">Session Node</span>
                  <span className="text-[9px] font-black text-slate-900 truncate max-w-[120px] uppercase leading-none">
                    {user?.displayName || 'Guest'}
                  </span>
                  <span className="text-[7px] text-slate-400 truncate mt-1">
                    {user?.email}
                  </span>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <Badge className="bg-white text-indigo-600 text-[8px] font-black border-slate-200 rounded-[2px] px-1.5 py-0">
                    {user?.activeOrganizationId ? organizations[user.activeOrganizationId]?.name : 'B2C_ROOT'}
                  </Badge>
                  <span className="text-[7px] font-bold text-slate-300 uppercase">
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

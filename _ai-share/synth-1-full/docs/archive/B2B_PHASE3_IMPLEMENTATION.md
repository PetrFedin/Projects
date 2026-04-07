# 🛠️ B2B ФАЗА 3: ДЕТАЛЬНЫЙ ПЛАН РЕАЛИЗАЦИИ
## Unified Profile Sync + Smart Widgets

**Дата**: 17.02.2026  
**Приоритет**: 🔴 КРИТИЧНО  
**Срок**: 2 недели

---

## 📦 ЧТО СОЗДАЁМ

### **4 КЛЮЧЕВЫЕ СИСТЕМЫ**:

1. **Unified User Context System** - полная синхронизация профилей
2. **Market Intelligence Widget** - аналитика рынка (JOOR-inspired)
3. **Collaborative Buying Widget** - командная работа над заказами (NuOrder-inspired)
4. **Payment & Credit Hub** - интегрированные платежи и кредитование

---

## 1️⃣ UNIFIED USER CONTEXT SYSTEM

### **Проблема сейчас**:
```typescript
// ❌ Текущее состояние
const { user } = useAuth();
const isRetailer = user?.roles?.includes('shop');
const isBrand = user?.roles?.includes('brand');

// Проблемы:
// - Не учитывается activeOrganizationId
// - Нет проверки permissions
// - Нет контекста профессиональной роли (buyer, sales rep)
// - Нет связи с Organization entity
```

### **Решение**:

#### **A. Создать хук `useUserContext`**

```typescript
// src/hooks/useUserContext.ts

import { useAuth } from '@/providers/auth-provider';
import { useB2BState } from '@/providers/b2b-state';
import { useMemo } from 'react';
import type { Organization, PermissionSet } from '@/lib/types';

export interface UserContext {
  // Basic Info
  user: UserProfile;
  
  // Organization Context
  currentOrg: Organization | null;
  allOrgs: Organization[];
  canSwitchOrg: boolean;
  
  // Role Detection
  isPlatformAdmin: boolean;
  isOrgAdmin: boolean;
  isOrgMember: boolean;
  
  // Business Role
  isRetailer: boolean;
  isBrand: boolean;
  isSupplier: boolean;
  isManufacturer: boolean;
  
  // Professional Role
  isBuyer: boolean;
  isSalesRep: boolean;
  isMerchandiser: boolean;
  isDesigner: boolean;
  
  // Permissions
  permissions: PermissionSet;
  
  // Actions
  switchOrganization: (orgId: string) => Promise<void>;
  hasPermission: (permission: keyof PermissionSet) => boolean;
  hasFeatureAccess: (feature: string) => boolean;
}

export function useUserContext(): UserContext {
  const { user, updateProfile } = useAuth();
  const { b2bConnections, retailerProfiles } = useB2BState();
  
  const context = useMemo(() => {
    if (!user) return null;
    
    // Get current organization
    const currentOrgAccess = user.organizations?.find(
      o => o.organizationId === user.activeOrganizationId
    );
    
    // Mock organizations (в реальности из API)
    const orgs: Organization[] = user.organizations?.map(orgAccess => ({
      id: orgAccess.organizationId,
      name: `Organization ${orgAccess.organizationId}`,
      type: detectOrgType(orgAccess.organizationId),
      logo: '/placeholder-logo.png',
      ownerId: user.uid,
      participantsLimit: 50,
      isVerified: true,
      visibility: 'public',
      stats: {
        activeUsers: 12,
        totalRevenue: 5000000,
        orderVolume: 150,
        complianceScore: 85,
        lastActivity: new Date().toISOString()
      }
    })) || [];
    
    const currentOrg = orgs.find(o => o.id === user.activeOrganizationId) || null;
    
    // Role Detection
    const isPlatformAdmin = user.roles?.includes('admin') || false;
    const isOrgAdmin = currentOrgAccess?.roleInOrg === 'admin';
    const isOrgMember = currentOrgAccess?.roleInOrg === 'member';
    
    // Business Type
    const isRetailer = currentOrg?.type === 'shop' || user.roles?.includes('shop') || user.roles?.includes('b2b');
    const isBrand = currentOrg?.type === 'brand' || user.roles?.includes('brand');
    const isSupplier = currentOrg?.type === 'supplier' || user.roles?.includes('supplier');
    const isManufacturer = currentOrg?.type === 'manufacturer' || user.roles?.includes('manufacturer');
    
    // Professional Role
    const isBuyer = user.professionalRoles?.includes('buyer') || false;
    const isSalesRep = user.professionalRoles?.includes('sales_representative') || false;
    const isMerchandiser = user.professionalRoles?.includes('merchandiser') || false;
    const isDesigner = user.professionalRoles?.includes('designer') || false;
    
    // Permissions
    const permissions = currentOrgAccess?.permissions || {
      canViewFinances: false,
      canEditPLM: false,
      canManageTeam: false,
      canViewAnalytics: false,
      canApproveOrders: false,
      canAccessAuditTrail: false
    };
    
    return {
      user,
      currentOrg,
      allOrgs: orgs,
      canSwitchOrg: orgs.length > 1,
      
      isPlatformAdmin,
      isOrgAdmin,
      isOrgMember,
      
      isRetailer,
      isBrand,
      isSupplier,
      isManufacturer,
      
      isBuyer,
      isSalesRep,
      isMerchandiser,
      isDesigner,
      
      permissions,
      
      switchOrganization: async (orgId: string) => {
        await updateProfile({ activeOrganizationId: orgId });
      },
      
      hasPermission: (permission: keyof PermissionSet) => {
        return permissions[permission] === true;
      },
      
      hasFeatureAccess: (feature: string) => {
        // Check subscription plan features
        const planFeatures = currentOrg?.subscription?.features || [];
        return planFeatures.includes(feature) || isPlatformAdmin;
      }
    };
  }, [user, b2bConnections, retailerProfiles]);
  
  return context || getGuestContext();
}

function detectOrgType(orgId: string): UserRole {
  // В реальности из API
  if (orgId.includes('brand')) return 'brand';
  if (orgId.includes('shop')) return 'shop';
  return 'client';
}

function getGuestContext(): UserContext {
  return {
    user: null as any,
    currentOrg: null,
    allOrgs: [],
    canSwitchOrg: false,
    isPlatformAdmin: false,
    isOrgAdmin: false,
    isOrgMember: false,
    isRetailer: false,
    isBrand: false,
    isSupplier: false,
    isManufacturer: false,
    isBuyer: false,
    isSalesRep: false,
    isMerchandiser: false,
    isDesigner: false,
    permissions: {
      canViewFinances: false,
      canEditPLM: false,
      canManageTeam: false,
      canViewAnalytics: false,
      canApproveOrders: false,
      canAccessAuditTrail: false
    },
    switchOrganization: async () => {},
    hasPermission: () => false,
    hasFeatureAccess: () => false
  };
}
```

#### **B. Создать Organization Switcher**

```typescript
// src/components/dashboard/OrganizationSwitcher.tsx

'use client';

import { useState } from 'react';
import { useUserContext } from '@/hooks/useUserContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Building2, ChevronDown, Check } from "lucide-react";
import { cn } from "@/lib/utils";

export function OrganizationSwitcher() {
  const { 
    currentOrg, 
    allOrgs, 
    canSwitchOrg, 
    switchOrganization 
  } = useUserContext();
  
  const [isLoading, setIsLoading] = useState(false);
  
  if (!canSwitchOrg) return null;
  
  const handleSwitch = async (orgId: string) => {
    if (orgId === currentOrg?.id) return;
    
    setIsLoading(true);
    try {
      await switchOrganization(orgId);
      // Refresh page to reload data for new org context
      window.location.reload();
    } catch (error) {
      console.error('Failed to switch organization:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          className="gap-2 h-12 px-4"
          disabled={isLoading}
        >
          <Building2 className="h-5 w-5 text-indigo-600" />
          <div className="text-left">
            <div className="text-xs font-black uppercase text-slate-400 leading-none">
              Organization
            </div>
            <div className="text-sm font-bold text-slate-900 leading-tight">
              {currentOrg?.name || 'Select Org'}
            </div>
          </div>
          <ChevronDown className="h-4 w-4 text-slate-400" />
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent align="start" className="w-72">
        <DropdownMenuLabel className="text-xs font-black uppercase text-slate-400">
          Switch Organization
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        {allOrgs.map(org => (
          <DropdownMenuItem
            key={org.id}
            onClick={() => handleSwitch(org.id)}
            className={cn(
              "cursor-pointer p-4",
              org.id === currentOrg?.id && "bg-indigo-50"
            )}
          >
            <div className="flex items-center gap-3 w-full">
              <div className="h-10 w-10 rounded-xl bg-slate-100 flex items-center justify-center flex-shrink-0">
                <Building2 className="h-5 w-5 text-slate-600" />
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-black uppercase text-slate-900 truncate">
                    {org.name}
                  </h4>
                  {org.id === currentOrg?.id && (
                    <Check className="h-4 w-4 text-indigo-600 flex-shrink-0" />
                  )}
                </div>
                
                <div className="flex items-center gap-2 mt-1">
                  <Badge 
                    className={cn(
                      "text-[7px] font-black uppercase border-none",
                      org.type === 'brand' ? 'bg-purple-100 text-purple-700' :
                      org.type === 'shop' ? 'bg-blue-100 text-blue-700' :
                      'bg-slate-100 text-slate-700'
                    )}
                  >
                    {org.type}
                  </Badge>
                  
                  {org.isVerified && (
                    <Badge className="bg-emerald-100 text-emerald-700 text-[7px] font-black uppercase border-none">
                      Verified
                    </Badge>
                  )}
                </div>
                
                <p className="text-[10px] text-slate-500 mt-1">
                  {org.stats.activeUsers} members • {org.stats.orderVolume} orders
                </p>
              </div>
            </div>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
```

#### **C. Обновить главную страницу B2B**

```typescript
// src/app/shop/b2b/page.tsx

'use client';

import { OrganizationSwitcher } from '@/components/dashboard/OrganizationSwitcher';
import { RoleContextCard } from '@/components/dashboard/RoleContextCard';
import { useUserContext } from '@/hooks/useUserContext';
import { useB2BState } from '@/providers/b2b-state';

export default function B2BShowroomPage() {
  const userContext = useUserContext();
  const b2bState = useB2BState();
  
  const {
    isRetailer,
    isBrand,
    isBuyer,
    isSalesRep,
    currentOrg,
    permissions
  } = userContext;
  
  // Динамическая загрузка виджетов в зависимости от роли
  const widgets = getWidgetsForRole(userContext);
  
  return (
    <div className="space-y-8 pb-20">
      {/* Context Header */}
      <div className="flex items-center justify-between">
        <OrganizationSwitcher />
        <RoleContextCard context={userContext} />
      </div>
      
      {/* Role-specific Dashboard */}
      {isRetailer && <RetailerDashboard context={userContext} state={b2bState} />}
      {isBrand && <BrandDashboard context={userContext} state={b2bState} />}
      {isBuyer && <BuyerDashboard context={userContext} state={b2bState} />}
      {isSalesRep && <SalesRepDashboard context={userContext} state={b2bState} />}
      
      {/* Common Widgets */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {widgets.map(widget => (
          <WidgetRenderer key={widget.id} widget={widget} />
        ))}
      </div>
    </div>
  );
}

function getWidgetsForRole(context: UserContext): Widget[] {
  if (context.isRetailer) {
    return [
      { id: 'loyalty', component: 'LoyaltyCard' },
      { id: 'stock_alerts', component: 'StockAlerts' },
      { id: 'replenishment', component: 'ReplenishmentAssistant' },
      { id: 'activity', component: 'ActivityFeed' }
    ];
  }
  
  if (context.isBuyer) {
    return [
      { id: 'budget', component: 'BudgetTracker' },
      { id: 'market', component: 'MarketIntelligence' },
      { id: 'collab', component: 'CollaborativeBuying' },
      { id: 'trends', component: 'TrendReports' }
    ];
  }
  
  if (context.isBrand) {
    return [
      { id: 'leads', component: 'WholesaleLeads' },
      { id: 'negotiations', component: 'ActiveNegotiations' },
      { id: 'analytics', component: 'SellthroughAnalytics' },
      { id: 'payments', component: 'PaymentStatus' }
    ];
  }
  
  return [];
}
```

---

## 2️⃣ MARKET INTELLIGENCE WIDGET

### **Архитектура**:

```typescript
// src/components/dashboard/MarketIntelligence.tsx

'use client';

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  TrendingUp, 
  TrendingDown, 
  Award, 
  Target,
  AlertCircle 
} from 'lucide-react';
import { useMarketData } from '@/hooks/useMarketData';
import { cn } from '@/lib/utils';

export function MarketIntelligenceWidget() {
  const { 
    trendingItems, 
    pricePosition, 
    predictedSellthrough,
    categoryInsights,
    isLoading 
  } = useMarketData();
  
  if (isLoading) {
    return <WidgetSkeleton />;
  }
  
  return (
    <Card className="border-2 border-indigo-100 shadow-xl rounded-[2rem]">
      <CardHeader className="border-b border-slate-100 bg-gradient-to-r from-indigo-50 to-purple-50">
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-xl bg-indigo-600 flex items-center justify-center">
            <Award className="h-6 w-6 text-white" />
          </div>
          <div>
            <CardTitle className="text-lg font-black uppercase tracking-tight text-slate-900">
              Market Intelligence
            </CardTitle>
            <p className="text-[10px] text-slate-500 font-medium">
              Powered by AI • Updated 5 min ago
            </p>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-6 space-y-6">
        {/* Trending Items */}
        <div className="space-y-3">
          <h4 className="text-xs font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-emerald-600" />
            Trending in Your Category
          </h4>
          
          <div className="space-y-2">
            {trendingItems.map((item, i) => (
              <div 
                key={i} 
                className="flex items-center justify-between p-3 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className={cn(
                    "h-2 w-2 rounded-full",
                    item.trend > 0 ? "bg-emerald-500 animate-pulse" : "bg-rose-500"
                  )} />
                  <span className="text-sm font-bold text-slate-900">
                    {item.name}
                  </span>
                </div>
                
                <div className="flex items-center gap-2">
                  <Badge className={cn(
                    "text-[8px] font-black uppercase border-none",
                    item.trend > 0 ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700"
                  )}>
                    {item.trend > 0 ? '+' : ''}{item.trend}% demand
                  </Badge>
                  
                  {item.trend > 0 ? (
                    <TrendingUp className="h-4 w-4 text-emerald-600" />
                  ) : (
                    <TrendingDown className="h-4 w-4 text-rose-600" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Price Position */}
        <div className="space-y-3 pt-4 border-t border-slate-100">
          <h4 className="text-xs font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
            <Target className="h-4 w-4 text-blue-600" />
            Your Price Position
          </h4>
          
          <div className="p-4 bg-blue-50 rounded-xl">
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-2xl font-black text-blue-900 tracking-tight tabular-nums">
                  {pricePosition.yourAvg} ₽
                </p>
                <p className="text-[10px] font-bold text-blue-600 uppercase">
                  Your Avg Price
                </p>
              </div>
              
              <div className="text-right">
                <p className="text-lg font-black text-slate-600 tracking-tight tabular-nums">
                  {pricePosition.marketAvg} ₽
                </p>
                <p className="text-[10px] font-bold text-slate-500 uppercase">
                  Market Avg
                </p>
              </div>
            </div>
            
            <Badge className={cn(
              "w-full justify-center text-[8px] font-black uppercase border-none",
              pricePosition.advantage 
                ? "bg-emerald-600 text-white" 
                : "bg-amber-600 text-white"
            )}>
              {pricePosition.advantage ? '✓ Competitive Advantage' : '⚠ Above Market'}
            </Badge>
          </div>
        </div>
        
        {/* Sell-Through Prediction */}
        <div className="space-y-3 pt-4 border-t border-slate-100">
          <h4 className="text-xs font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
            <AlertCircle className="h-4 w-4 text-purple-600" />
            Predicted Sell-Through Rate
          </h4>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-slate-600">
                Your FW26 Collection
              </span>
              <span className="text-lg font-black text-purple-600 tabular-nums">
                {predictedSellthrough.yours}%
              </span>
            </div>
            
            <Progress 
              value={predictedSellthrough.yours} 
              className="h-3"
            />
            
            <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 uppercase">
              <span>Industry Average: {predictedSellthrough.industry}%</span>
              <Badge className="bg-emerald-100 text-emerald-700 text-[7px] border-none">
                +{predictedSellthrough.yours - predictedSellthrough.industry}% Better
              </Badge>
            </div>
          </div>
          
          <div className="p-3 bg-purple-50 rounded-lg border border-purple-100">
            <p className="text-[10px] font-medium text-purple-900 italic">
              💡 <strong>AI Insight:</strong> Based on pre-order velocity and market trends, 
              your collection is projected to outperform industry STR by 
              {predictedSellthrough.yours - predictedSellthrough.industry}%. 
              Consider increasing initial order quantities for top 3 SKU.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
```

### **Хук для загрузки данных**:

```typescript
// src/hooks/useMarketData.ts

import { useState, useEffect } from 'react';
import { useUserContext } from './useUserContext';
import { useB2BState } from '@/providers/b2b-state';

export interface MarketData {
  trendingItems: Array<{
    name: string;
    category: string;
    trend: number; // percentage change
  }>;
  
  pricePosition: {
    yourAvg: number;
    marketAvg: number;
    advantage: boolean;
  };
  
  predictedSellthrough: {
    yours: number;
    industry: number;
  };
  
  categoryInsights: Array<{
    category: string;
    demand: 'high' | 'medium' | 'low';
    competition: number;
    recommendation: string;
  }>;
}

export function useMarketData() {
  const [data, setData] = useState<MarketData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const { currentOrg } = useUserContext();
  const { b2bCart, inventoryATS, productVotes } = useB2BState();
  
  useEffect(() => {
    async function loadMarketData() {
      setIsLoading(true);
      
      try {
        // В реальности это API call к аналитическому сервису
        // Здесь генерируем mock данные на основе текущего состояния
        
        const mockData: MarketData = {
          trendingItems: [
            { name: 'Puffer Jackets', category: 'Outerwear', trend: 45 },
            { name: 'Wool Coats', category: 'Outerwear', trend: -12 },
            { name: 'Bomber Jackets', category: 'Outerwear', trend: 0 },
            { name: 'Tech Parkas', category: 'Outerwear', trend: 28 }
          ],
          
          pricePosition: {
            yourAvg: 285,
            marketAvg: 310,
            advantage: true
          },
          
          predictedSellthrough: {
            yours: 82,
            industry: 68
          },
          
          categoryInsights: [
            {
              category: 'Верхняя одежда',
              demand: 'high',
              competition: 78,
              recommendation: 'Увеличить ассортимент puffer jackets на 20%'
            }
          ]
        };
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        setData(mockData);
      } catch (error) {
        console.error('Failed to load market data:', error);
      } finally {
        setIsLoading(false);
      }
    }
    
    loadMarketData();
  }, [currentOrg, b2bCart]);
  
  return {
    trendingItems: data?.trendingItems || [],
    pricePosition: data?.pricePosition || { yourAvg: 0, marketAvg: 0, advantage: false },
    predictedSellthrough: data?.predictedSellthrough || { yours: 0, industry: 0 },
    categoryInsights: data?.categoryInsights || [],
    isLoading
  };
}
```

---

## 3️⃣ COLLABORATIVE BUYING WIDGET

### **Компонент**:

```typescript
// src/components/dashboard/CollaborativeBuying.tsx

'use client';

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { 
  Users, 
  Clock, 
  AlertCircle,
  CheckCircle,
  Eye
} from 'lucide-react';
import { useCollaborativeOrder } from '@/hooks/useCollaborativeOrder';
import { cn } from '@/lib/utils';

export function CollaborativeBuyingWidget() {
  const {
    liveCollaborators,
    pendingApprovals,
    teamBudget,
    recentActivity,
    isLoading
  } = useCollaborativeOrder();
  
  if (isLoading) return <WidgetSkeleton />;
  
  return (
    <Card className="border-2 border-emerald-100 shadow-xl rounded-[2rem]">
      <CardHeader className="border-b border-slate-100 bg-gradient-to-r from-emerald-50 to-teal-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-xl bg-emerald-600 flex items-center justify-center">
              <Users className="h-6 w-6 text-white" />
            </div>
            <div>
              <CardTitle className="text-lg font-black uppercase tracking-tight text-slate-900">
                Team Order Activity
              </CardTitle>
              <p className="text-[10px] text-slate-500 font-medium">
                {liveCollaborators.length} members active now
              </p>
            </div>
          </div>
          
          <Badge className="bg-emerald-600 text-white text-[7px] font-black uppercase animate-pulse">
            🟢 LIVE
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="p-6 space-y-6">
        {/* Live Collaborators */}
        <div className="space-y-3">
          <h4 className="text-xs font-black uppercase tracking-widest text-slate-400">
            Working on Order Now
          </h4>
          
          <div className="space-y-2">
            {liveCollaborators.map((collab, i) => (
              <div 
                key={collab.userId} 
                className="flex items-center justify-between p-3 bg-slate-50 rounded-xl"
              >
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={collab.avatar} />
                      <AvatarFallback>{collab.initials}</AvatarFallback>
                    </Avatar>
                    <div className={cn(
                      "absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-white",
                      collab.status === 'active' ? "bg-emerald-500" : "bg-slate-300"
                    )} />
                  </div>
                  
                  <div>
                    <p className="text-sm font-bold text-slate-900">
                      {collab.name}
                    </p>
                    <p className="text-[10px] text-slate-500 flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {collab.lastAction}
                    </p>
                  </div>
                </div>
                
                <div className="text-right">
                  <Badge className="bg-emerald-100 text-emerald-700 text-[7px] font-black uppercase border-none">
                    +{collab.addedItems} SKU
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Pending Approvals */}
        {pendingApprovals.length > 0 && (
          <div className="space-y-3 pt-4 border-t border-slate-100">
            <h4 className="text-xs font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-amber-600" />
              Requires Your Approval
            </h4>
            
            <div className="space-y-2">
              {pendingApprovals.map((approval, i) => (
                <div 
                  key={approval.id}
                  className="p-4 bg-amber-50 border-2 border-amber-200 rounded-xl"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="text-sm font-bold text-slate-900">
                        {approval.title}
                      </p>
                      <p className="text-[10px] text-slate-600 mt-1">
                        By {approval.requester} • {approval.timestamp}
                      </p>
                    </div>
                    
                    <Badge className="bg-amber-600 text-white text-[7px] font-black uppercase">
                      {approval.itemCount} Items
                    </Badge>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button size="sm" className="flex-1 h-8 text-[8px] font-black uppercase">
                      <CheckCircle className="mr-2 h-3 w-3" />
                      Approve
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="flex-1 h-8 text-[8px] font-black uppercase"
                    >
                      <Eye className="mr-2 h-3 w-3" />
                      Review
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Team Budget Tracker */}
        <div className="space-y-3 pt-4 border-t border-slate-100">
          <h4 className="text-xs font-black uppercase tracking-widest text-slate-400">
            Team Budget FW26
          </h4>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-slate-600">
                {teamBudget.allocated.toLocaleString('ru-RU')} ₽
              </span>
              <span className="text-sm font-bold text-slate-400">
                / {teamBudget.total.toLocaleString('ru-RU')} ₽
              </span>
            </div>
            
            <Progress 
              value={(teamBudget.allocated / teamBudget.total) * 100} 
              className="h-3"
            />
            
            <div className="flex items-center justify-between text-[10px] font-bold">
              <span className={cn(
                teamBudget.remaining > 0 ? "text-emerald-600" : "text-rose-600"
              )}>
                {teamBudget.remaining.toLocaleString('ru-RU')} ₽ remaining
              </span>
              <span className="text-slate-400">
                {Math.round((teamBudget.allocated / teamBudget.total) * 100)}% allocated
              </span>
            </div>
          </div>
        </div>
        
        {/* Recent Activity */}
        <div className="space-y-2 pt-4 border-t border-slate-100">
          <h4 className="text-xs font-black uppercase tracking-widest text-slate-400">
            Recent Changes
          </h4>
          
          <div className="space-y-1">
            {recentActivity.slice(0, 3).map((activity, i) => (
              <div key={i} className="flex items-center gap-2 p-2 rounded-lg hover:bg-slate-50 transition-colors">
                <Avatar className="h-6 w-6">
                  <AvatarImage src={activity.userAvatar} />
                  <AvatarFallback>{activity.userInitials}</AvatarFallback>
                </Avatar>
                <p className="text-[10px] text-slate-600 flex-1">
                  <strong>{activity.userName}</strong> {activity.action}
                </p>
                <span className="text-[9px] text-slate-400 tabular-nums">
                  {activity.time}
                </span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
```

---

## 4️⃣ PAYMENT & CREDIT HUB

### **Компонент**:

```typescript
// src/components/dashboard/PaymentHub.tsx

'use client';

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { 
  CreditCard, 
  TrendingUp,
  Clock,
  AlertTriangle,
  DollarSign
} from 'lucide-react';
import { usePaymentData } from '@/hooks/usePaymentData';
import { cn } from '@/lib/utils';
import Link from 'next/link';

export function PaymentHubWidget() {
  const {
    creditLine,
    paymentMethods,
    outstandingInvoices,
    isLoading
  } = usePaymentData();
  
  if (isLoading) return <WidgetSkeleton />;
  
  return (
    <Card className="border-2 border-blue-100 shadow-xl rounded-[2rem]">
      <CardHeader className="border-b border-slate-100 bg-gradient-to-r from-blue-50 to-cyan-50">
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-xl bg-blue-600 flex items-center justify-center">
            <CreditCard className="h-6 w-6 text-white" />
          </div>
          <div>
            <CardTitle className="text-lg font-black uppercase tracking-tight text-slate-900">
              Payment & Credit
            </CardTitle>
            <p className="text-[10px] text-slate-500 font-medium">
              Your financial overview
            </p>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-6 space-y-6">
        {/* Credit Line */}
        <div className="space-y-3">
          <h4 className="text-xs font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-blue-600" />
            Your Credit Line
          </h4>
          
          <div className="p-4 bg-blue-50 rounded-xl">
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-3xl font-black text-blue-900 tracking-tight tabular-nums">
                  {creditLine.available.toLocaleString('ru-RU')} ₽
                </p>
                <p className="text-[10px] font-bold text-blue-600 uppercase">
                  Available Credit
                </p>
              </div>
              
              <div className="text-right">
                <p className="text-lg font-black text-slate-600 tracking-tight tabular-nums">
                  {creditLine.limit.toLocaleString('ru-RU')} ₽
                </p>
                <p className="text-[10px] font-bold text-slate-500 uppercase">
                  Total Limit
                </p>
              </div>
            </div>
            
            <Progress 
              value={(creditLine.used / creditLine.limit) * 100} 
              className="h-2 mb-2"
            />
            
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-slate-600">
                {creditLine.used.toLocaleString('ru-RU')} ₽ used
              </span>
              <Link 
                href="/shop/b2b/finance/increase-limit"
                className="text-[10px] font-black uppercase text-blue-600 hover:underline"
              >
                Increase Limit →
              </Link>
            </div>
          </div>
        </div>
        
        {/* Payment Methods */}
        <div className="space-y-3 pt-4 border-t border-slate-100">
          <h4 className="text-xs font-black uppercase tracking-widest text-slate-400">
            Pay This Order
          </h4>
          
          <RadioGroup defaultValue={paymentMethods[0].id}>
            {paymentMethods.map((method) => (
              <div 
                key={method.id}
                className="flex items-center space-x-3 p-3 border-2 border-slate-100 rounded-xl hover:border-blue-300 transition-colors cursor-pointer"
              >
                <RadioGroupItem value={method.id} id={method.id} />
                <Label 
                  htmlFor={method.id} 
                  className="flex items-center justify-between flex-1 cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-slate-900">
                      {method.name}
                    </span>
                    {method.badge && (
                      <Badge className={cn(
                        "text-[7px] font-black uppercase border-none",
                        method.badgeColor || "bg-emerald-100 text-emerald-700"
                      )}>
                        {method.badge}
                      </Badge>
                    )}
                  </div>
                  {method.dueDate && (
                    <span className="text-[10px] text-slate-500">
                      Due {method.dueDate}
                    </span>
                  )}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>
        
        {/* Outstanding Invoices */}
        <div className="space-y-3 pt-4 border-t border-slate-100">
          <h4 className="text-xs font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
            <Clock className="h-4 w-4 text-amber-600" />
            Outstanding Invoices
          </h4>
          
          <div className="space-y-2">
            {outstandingInvoices.map((invoice, i) => (
              <div 
                key={invoice.id}
                className={cn(
                  "flex items-center justify-between p-3 rounded-xl",
                  invoice.isOverdue 
                    ? "bg-rose-50 border-2 border-rose-200" 
                    : "bg-slate-50"
                )}
              >
                <div className="flex items-center gap-2">
                  {invoice.isOverdue && (
                    <AlertTriangle className="h-4 w-4 text-rose-600 flex-shrink-0" />
                  )}
                  <div>
                    <p className="text-sm font-bold text-slate-900">
                      {invoice.number}
                    </p>
                    <p className="text-[10px] text-slate-500">
                      {invoice.amount.toLocaleString('ru-RU')} ₽
                    </p>
                  </div>
                </div>
                
                <div className="text-right">
                  {invoice.isOverdue ? (
                    <Badge className="bg-rose-600 text-white text-[7px] font-black uppercase">
                      Overdue {invoice.daysOverdue}d
                    </Badge>
                  ) : (
                    <span className="text-[10px] font-bold text-slate-600">
                      Due in {invoice.daysUntilDue} days
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
          
          <Button className="w-full rounded-xl h-11 text-[10px] font-black uppercase">
            <DollarSign className="mr-2 h-4 w-4" />
            Pay All Outstanding
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
```

---

## 📊 ПЛАН ВНЕДРЕНИЯ

### **Неделя 1**:
- День 1-2: Создать `useUserContext` хук
- День 3-4: Реализовать `OrganizationSwitcher`
- День 5: Интегрировать с главной страницей B2B

### **Неделя 2**:
- День 1-2: Создать `MarketIntelligenceWidget`
- День 3-4: Создать `CollaborativeBuyingWidget`
- День 5: Создать `PaymentHubWidget`

---

**Дата создания**: 17.02.2026  
**Автор**: AI Assistant (Claude Sonnet 4.5)  
**Версия**: 1.0 Implementation Guide

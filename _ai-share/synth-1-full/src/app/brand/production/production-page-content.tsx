'use client';

import React, { useState, Fragment, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import {
  Factory,
  Truck,
  Package,
  Calendar,
  AlertCircle,
  Search,
  Layers,
  MessageSquare,
  Bell,
  FileText,
  GanttChart,
  ClipboardCheck,
  Wallet,
  Coins,
  ShieldCheck,
  Archive,
  Activity,
  Plus,
  ChevronRight,
  QrCode,
  Users,
  FileSpreadsheet,
  Tag,
  Store,
  BookOpen,
  History,
  Timer,
  FolderArchive,
  MoreHorizontal,
  LayoutGrid,
  List,
  Download,
  BarChart3,
  Target,
  Warehouse,
  Edit,
  TrendingUp,
  Trash2,
  Settings2,
  Copy,
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { motion, AnimatePresence } from 'framer-motion';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { ROUTES } from '@/lib/routes';
import { cabinetSurface } from '@/lib/ui/cabinet-surface';
import Link from 'next/link';
import { getProductionLinks } from '@/lib/data/entity-links';
import { RelatedModulesBlock } from '@/components/brand/RelatedModulesBlock';

import { CollectionCreateWizard } from '@/components/brand/production/CollectionCreateWizard';
import { LabellingWizard } from '@/components/brand/LabellingWizard';
import { MaterialHandoverAct } from '@/components/brand/MaterialHandoverAct';
import { CostingCalculator } from '@/components/brand/CostingCalculator';
import { FittingLog } from '@/components/brand/FittingLog';
import { AutoPOWizard } from '@/components/brand/AutoPOWizard';
import { ApprovalWorkflow } from '@/components/brand/ApprovalWorkflow';
import { ProductionGantt } from '@/components/brand/ProductionGantt';
import { DigitalProductionView } from '@/components/brand/digital-production-view';
import { ProductionExtendedPanel } from '@/components/brand/production/ProductionExtendedPanel';
import { ProductionContextBar } from '@/components/brand/production/ProductionContextBar';
import { ProductionCostBreakdown } from '@/components/brand/production/ProductionCostBreakdown';
import { FinancialCalendarPanel } from '@/components/brand/production/FinancialCalendarPanel';
import { AssortmentPlm } from '@/components/brand/assortment-plm';
import { VariantMatrixEditor } from '@/components/brand/VariantMatrixEditor';
import { TechPackBuilder } from '@/components/brand/tech-pack-builder';
import { ProductionArchiveHub } from '@/components/brand/production-archive-hub';
import { MarketplaceLabelStatus } from '@/components/brand/MarketplaceLabelStatus';
import { SkuCreateWizard } from '@/components/brand/production/SkuCreateWizard';
import { SupplierCollabHub } from '@/components/brand/supplier-collab-hub';
import { ProductionDigitalTwin } from '@/components/brand/ProductionDigitalTwin';
import { MaterialsShortagePanel } from '@/components/brand/production/MaterialsShortagePanel';
import { ProductionCommandCenter } from '@/components/brand/production/ProductionCommandCenter';
import { CollectionProgressPanel } from '@/components/brand/production/CollectionProgressPanel';
import { BottleneckPanel } from '@/components/brand/production/BottleneckPanel';
import { CreatePOFromSamples } from '@/components/brand/production/CreatePOFromSamples';
import { GRNPanel } from '@/components/brand/production/GRNPanel';
import { BatchComments } from '@/components/brand/production/BatchComments';
import { SupplierPenaltyTerms } from '@/components/brand/production/SupplierPenaltyTerms';
import { SupplierMatrix } from '@/components/brand/SupplierMatrix';
import { MaterialMarketplace } from '@/components/brand/MaterialMarketplace';
import { FabricLabTests } from '@/components/brand/FabricLabTests';
import { SustainabilityAudit } from '@/components/brand/SustainabilityAudit';
import { DefectHeatmap } from '@/components/brand/DefectHeatmap';
import { PatternVersionControl } from '@/components/brand/PatternVersionControl';
import CollaborationProjects from '@/components/brand/collaboration-projects';
import { CATEGORY_HANDBOOK } from '@/lib/data/category-handbook';
import { CollectionFiltersAndRisk } from '@/components/brand/production/CollectionFiltersAndRisk';
import {
  GlobalProductionSearch,
  type SearchResult,
} from '@/components/brand/production/GlobalProductionSearch';
import { SampleCommentsAndTracking } from '@/components/brand/production/SampleCommentsAndTracking';
import { POOverviewAndPayments } from '@/components/brand/production/POOverviewAndPayments';
import {
  AQLCalculator,
  CashFlowSummary,
  FactoryRatingCard,
  FactoryLoadOverview,
  CertExpiryReminder,
  CargoTrackingCard,
} from '@/components/brand/production/ProductionEnhancementsHub';
import { LogisticsCostCalc } from '@/components/brand/production/LogisticsCostCalc';
import { exportToCSV } from '@/lib/production-export-utils';
import {
  CollectionCardStats,
  BudgetCategoryBreakdown,
  SLACountdown,
  DocumentFilterBar,
  PODetailExpanded,
  AuditRowWithDetail,
  CollectionProgressMiniChart,
  SectionInfoCard,
} from '@/components/brand/production/ProductionSectionEnhancements';

/** Section header - organization style (bar + title) */
function SectionHeader({
  title,
  barColor = 'bg-accent-primary',
}: {
  title: string;
  barColor?: string;
}) {
  return (
    <div className="mb-3 flex items-center gap-2">
      <div className={cn('h-1 w-8 rounded-full', barColor)} />
      <h2 className="text-text-muted text-[9px] font-black uppercase tracking-[0.3em]">{title}</h2>
    </div>
  );
}

const SVG_GRID = () => (
  <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden opacity-[0.03]">
    <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id="prod-grid" width="40" height="40" patternUnits="userSpaceOnUse">
          <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="0.5" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#prod-grid)" />
      <motion.circle
        cx={100}
        cy={100}
        animate={{ cx: [100, 400, 100], cy: [100, 200, 100] }}
        transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
        r={2}
        fill="currentColor"
      />
      <motion.circle
        cx={500}
        cy={300}
        animate={{ cx: [500, 200, 500], cy: [300, 500, 300] }}
        transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
        r={2}
        fill="currentColor"
      />
    </svg>
  </div>
);

export function ProductionPageContent(props: Record<string, unknown>) {
  const p = props as any;
  const {
    activeTab,
    setActiveTab,
    perms,
    prodRole,
    getContextTitle,
    selectedContext,
    resetToBrand,
    selectedCollectionIds,
    setSelectedCollectionIds,
    collections,
    selectedId,
    productionKpis,
    setActiveKpiDetail,
    displaySkus,
    displaySampleStatuses,
    filteredSkus,
    filteredSampleStatuses,
    filteredProductionOrders,
    filteredMaterials,
    filteredLosses,
    filteredEvents,
    filteredAuditLog,
    filteredChat,
    filteredSlaSamples,
    samplePendingCount,
    slaOverdueCount,
    contextBarBudgetRemainder,
    lossesSummary,
    collectionBudgets,
    skus: allSkus,
    productionOrders: allOrders,
    sampleStatuses: allSamples,
    productionDocuments,
    productionLosses,
    chatMessages,
    notificationsList,
    plmView,
    setPlmView,
    executionView,
    setExecutionView,
    financeView,
    setFinanceView,
    complianceView,
    setComplianceView,
    logisticsView,
    setLogisticsView,
    handbookView,
    setHandbookView,
    skuSearchQuery,
    setSkuSearchQuery,
    sampleSearchQuery,
    setSampleSearchQuery,
    sampleStageFilter,
    setSampleStageFilter,
    docFilter,
    setDocFilter,
    auditFilter,
    setAuditFilter,
    slaFilterOverdue,
    setSlaFilterOverdue,
    ordersFilter,
    setOrdersFilter,
    selectedPoId,
    setSelectedPoId,
    selectedSkuId,
    activeChatCollection,
    setActiveChatCollection,
    procurementView,
    setProcurementView,
    requisitions,
    sfcOperations,
    setSfcOperations,
    handleToggleSfcConfirmation,
    setRequisitions,
    rejectSample,
    setRejectSample,
    rejectReason,
    setRejectReason,
    rejectCommentCustom,
    setRejectCommentCustom,
    setSampleStatuses,
    apiDrops,
    newMessage,
    setNewMessage,
    isCreatingCollection,
    setIsCreatingCollection,
    isCreatingSku,
    setIsCreatingSku,
    isSkuWizardOpen,
    setIsSkuWizardOpen,
    isAutoPOOpen,
    setIsAutoPOOpen,
    isCostingOpen,
    setIsCostingOpen,
    isFittingLogOpen,
    setIsFittingLogOpen,
    isLabellingWizardOpen,
    setIsLabellingWizardOpen,
    isHandoverActOpen,
    setIsHandoverActOpen,
    isArchiveOpen,
    setIsArchiveOpen,
    isMarketplaceOpen,
    setIsMarketplaceOpen,
    isNotificationsOpen,
    setIsNotificationsOpen,
    isCreatingPO,
    setIsCreatingPO,
    handleCollectionCreated,
    handleSkuCreated,
    handleSendMessage,
    handleAddMaterial,
    handleAddLoss,
    handleAction,
    toggleCollectionSelection,
    STAGE_LABELS = {},
    SAMPLE_STAGES = [],
    cn: cnUtil,
    isGlobalSearchOpen,
    setIsGlobalSearchOpen,
    collectionFilter,
    setCollectionFilter,
    sampleComments,
    setSampleComments,
    filteredCollections,
  } = p;

  const cn = cnUtil || ((...args: any[]) => args.filter(Boolean).join(' '));

  const tabIds = [
    'collections',
    'dashboard',
    'demand',
    'tz',
    'plm',
    'samples',
    'fitting',
    'approval',
    'orders',
    'mps',
    'materials',
    'costing',
    'execution',
    'compliance',
    'logistics',
    'warehouse',
    'labeling',
    'budget',
    'finance',
    'documents',
    'losses',
    'factories',
    'handbooks',
    'audit',
    'sla',
    'reports',
    'archive',
  ] as const;

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsGlobalSearchOpen?.(true);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [setIsGlobalSearchOpen]);

  const handleGlobalSearchSelect = (r: SearchResult) => {
    if (r.type === 'collection') setSelectedCollectionIds?.([r.id]);
    if (r.type === 'sku' || r.type === 'sample') setActiveTab?.('samples');
    if (r.type === 'po') setActiveTab?.('orders');
    if (r.type === 'factory') setActiveTab?.('factories');
    if (r.collectionId) setSelectedCollectionIds?.([r.collectionId]);
    setIsGlobalSearchOpen?.(false);
  };

  return (
    <div className="contents">
      <SVG_GRID />
      {typeof setIsGlobalSearchOpen === 'function' && (
        <GlobalProductionSearch
          open={!!isGlobalSearchOpen}
          onOpenChange={(o) => setIsGlobalSearchOpen?.(o)}
          onSelect={handleGlobalSearchSelect}
          collections={collections || []}
          skus={filteredSkus || []}
          orders={filteredProductionOrders || []}
          samples={displaySampleStatuses || filteredSampleStatuses || []}
          factories={[
            { id: 'S-01', name: 'Global Textiles' },
            { id: 'S-02', name: 'YKK Russia' },
            { id: 'S-03', name: 'Smart Tailor Lab' },
          ]}
        />
      )}
      {/* Breadcrumb - as in organization/profile */}
      <div className="text-text-muted mb-4 flex items-center gap-2 text-[8px] font-bold uppercase tracking-widest">
        <Link
          href={ROUTES.brand.organizationPage}
          className="hover:text-accent-primary transition-colors"
        >
          Организация
        </Link>
        <ChevronRight className="h-3 w-3" />
        <span className="text-accent-primary">Управление производством</span>
      </div>
      {/* Header */}
      <header className="border-border-subtle flex flex-col justify-between gap-3 border-b pb-3 md:flex-row md:items-end">
        <div className="space-y-0.5">
          <div className="text-text-muted flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.2em]">
            <Settings2 className="text-accent-primary h-3 w-3" />
            Fashion OS <span className="text-text-muted">/</span> Production
            {perms && (
              <Badge
                variant="outline"
                className="border-accent-primary/30 text-accent-primary ml-2 text-[8px]"
              >
                {prodRole}
              </Badge>
            )}
          </div>
          <h2 className="text-text-primary text-2xl font-bold uppercase leading-tight tracking-tight md:text-4xl">
            Управление производством
          </h2>
          <div className="mt-1 flex flex-wrap items-center gap-2">
            <p className="text-text-muted text-[11px] font-bold uppercase tracking-wider">
              Контекст:{' '}
              <span className="text-accent-primary tracking-widest">
                {getContextTitle?.() || 'Весь бренд'}
              </span>
            </p>
            <Button
              variant="outline"
              size="sm"
              className="h-7 gap-1.5 px-2.5 text-[9px]"
              onClick={() => setIsGlobalSearchOpen?.(true)}
            >
              <Search className="h-3.5 w-3.5" /> Поиск{' '}
              <kbd className="bg-bg-surface2 ml-0.5 rounded px-1 py-0.5 font-mono text-[8px]">
                ⌘K
              </kbd>
            </Button>
            {selectedContext !== 'brand' && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => resetToBrand?.()}
                className="h-4.5 bg-bg-surface2 rounded-md px-1.5 text-[8px] font-bold uppercase transition-all hover:bg-black hover:text-white"
              >
                Сбросить
              </Button>
            )}
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-1.5">
          {/* cabinetSurface v1 — сегменты отдельно от CTA «Новый PO» */}
          <div
            className={cn(
              cabinetSurface.groupTabList,
              'h-auto min-h-9 flex-wrap items-center gap-0.5'
            )}
          >
            <Button
              onClick={() => setActiveTab?.('chat')}
              variant="ghost"
              className={cn(
                'h-7 gap-1.5 rounded-lg border border-transparent px-3 text-[9px] font-bold uppercase tracking-widest transition-all',
                activeTab === 'chat'
                  ? 'text-accent-primary border-accent-primary/20 bg-white shadow-sm'
                  : 'text-text-secondary hover:bg-white'
              )}
            >
              <MessageSquare className="h-3 w-3" /> Чат
            </Button>
            <Button
              onClick={() => setActiveTab?.('calendar')}
              variant="ghost"
              className={cn(
                'h-7 gap-1.5 rounded-lg border border-transparent px-3 text-[9px] font-bold uppercase tracking-widest transition-all',
                activeTab === 'calendar'
                  ? 'text-text-primary border-border-default bg-white shadow-sm'
                  : 'text-text-secondary hover:bg-white'
              )}
            >
              <Calendar className="text-text-muted h-3 w-3" /> Календарь
            </Button>
          </div>
          {perms?.canCreatePO && (
            <Button
              onClick={() => setIsAutoPOOpen?.(true)}
              className="bg-text-primary h-7 gap-1.5 rounded-lg px-4 text-[9px] font-bold uppercase tracking-widest text-white shadow-md transition-all hover:bg-black"
            >
              <Package className="text-accent-primary h-3 w-3" />
              <span>Новый PO</span>
            </Button>
          )}
          <div
            className={cn(
              cabinetSurface.groupTabList,
              'h-auto min-h-9 flex-wrap items-center gap-0.5'
            )}
          >
            <Button
              onClick={() => setActiveTab?.('notifications')}
              variant="ghost"
              className={cn(
                'relative h-7 gap-1.5 rounded-lg border border-transparent px-3 text-[9px] font-bold uppercase tracking-widest transition-all',
                activeTab === 'notifications'
                  ? 'text-accent-primary bg-white shadow-sm'
                  : 'text-text-secondary hover:bg-white'
              )}
            >
              <Bell className="h-3 w-3" />
              {(notificationsList || []).filter((n: any) => !n.read).length > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-rose-500 text-[8px] font-black text-white">
                  {(notificationsList || []).filter((n: any) => !n.read).length}
                </span>
              )}
            </Button>
          </div>
        </div>
      </header>

      {/* Context Bar */}
      {selectedCollectionIds?.length > 0 && (
        <ProductionContextBar
          selectedCollectionIds={selectedCollectionIds}
          collections={collections || []}
          skuCount={(filteredSkus || []).length}
          poCount={(filteredProductionOrders || []).length}
          samplePendingCount={samplePendingCount || 0}
          sampleOverdueCount={slaOverdueCount || 0}
          budgetRemainder={contextBarBudgetRemainder ?? 0}
          lossCount={(filteredLosses || []).length}
          docCount={(productionDocuments || []).length}
          apiDrops={apiDrops || []}
          onNavigate={(tab) => setActiveTab?.(tab)}
          activeTab={activeTab}
        />
      )}

      {/* Pipeline stages when collection selected */}
      {selectedId && (
        <Card className="border-border-subtle mb-3 rounded-xl border bg-white p-3 shadow-sm">
          <p className="text-text-muted mb-2 text-[9px] font-black uppercase tracking-widest">
            Коллекция:{' '}
            <span className="text-accent-primary">
              {collections?.find((c: any) => c.id === selectedId)?.name || selectedId}
            </span>{' '}
            — Pipeline этапов
          </p>
          <div className="no-scrollbar flex flex-wrap items-center gap-2 overflow-x-auto">
            {[
              'Дизайн',
              'Тех-пак',
              'Сэмпл',
              'Утверждение',
              'PO',
              'Снабжение',
              'Цех',
              'QC',
              'Маркировка',
              'Отгрузка',
              'Склад',
            ].map((stage: string, i: number) => (
              <React.Fragment key={i}>
                <button
                  type="button"
                  onClick={() => {
                    if (stage === 'Дизайн' || stage === 'Тех-пак') setActiveTab?.('plm');
                    else if (stage === 'Сэмпл') setActiveTab?.('samples');
                    else if (stage === 'Утверждение') setActiveTab?.('approval');
                    else if (stage === 'PO') setActiveTab?.('orders');
                    else if (stage === 'Снабжение') setActiveTab?.('materials');
                    else if (stage === 'Цех') setActiveTab?.('execution');
                    else if (stage === 'QC') setActiveTab?.('compliance');
                    else if (stage === 'Маркировка') setActiveTab?.('labeling');
                    else if (stage === 'Отгрузка' || stage === 'Склад') setActiveTab?.('logistics');
                  }}
                  className={cn(
                    'rounded-lg px-3 py-1.5 text-[9px] font-black uppercase tracking-widest transition-all',
                    ['Сэмпл', 'PO', 'Цех'].includes(stage)
                      ? 'bg-accent-primary/15 text-accent-primary border-accent-primary/30 border'
                      : 'bg-bg-surface2 text-text-secondary border-border-subtle hover:bg-bg-surface2 border'
                  )}
                >
                  {stage}
                </button>
                {i < 10 && <ChevronRight className="text-text-muted h-3 w-3 shrink-0" />}
              </React.Fragment>
            ))}
          </div>
        </Card>
      )}

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6">
        {[
          {
            id: 'production',
            label: 'В производстве',
            value: productionKpis?.production,
            icon: Factory,
            color: 'text-accent-primary',
            bg: 'bg-accent-primary/10',
            border: 'border-accent-primary/20',
          },
          {
            id: 'cargo',
            label: 'В пути (Карго)',
            value: productionKpis?.cargo,
            icon: Truck,
            color: 'text-sky-600',
            bg: 'bg-sky-50/50',
            border: 'border-sky-100/50',
          },
          {
            id: 'qc',
            label: 'Контроль QC',
            value: productionKpis?.qc,
            icon: ShieldCheck,
            color: 'text-emerald-600',
            bg: 'bg-emerald-50/50',
            border: 'border-emerald-100/50',
          },
          {
            id: 'finance',
            label: 'К оплате',
            value: productionKpis?.finance,
            icon: Wallet,
            color: 'text-rose-600',
            bg: 'bg-rose-50/50',
            border: 'border-rose-100/50',
          },
          {
            id: 'risk',
            label: 'Риск задержки',
            value: productionKpis?.risk,
            icon: AlertCircle,
            color: 'text-amber-600',
            bg: 'bg-amber-50/50',
            border: 'border-amber-100/50',
          },
          {
            id: 'efficiency',
            label: 'Эко-эффект',
            value: productionKpis?.efficiency,
            icon: Activity,
            color: 'text-teal-600',
            bg: 'bg-teal-50/50',
            border: 'border-teal-100/50',
          },
        ].map((stat, i) => {
          const Icon = stat.icon;
          return (
            <Card
              key={stat.id}
              onClick={() => setActiveKpiDetail?.(stat.id)}
              className={cn(
                'hover:border-accent-primary/30 group flex cursor-pointer items-center gap-3.5 rounded-xl border bg-white p-3 shadow-sm transition-all hover:shadow-md active:scale-[0.98]',
                stat.border
              )}
            >
              <div
                className={cn(
                  'shrink-0 rounded-lg border p-2 shadow-inner transition-transform group-hover:scale-105',
                  stat.bg,
                  stat.color,
                  stat.border
                )}
              >
                <Icon className="h-4 w-4" />
              </div>
              <div className="space-y-0.5">
                <p className="text-text-muted text-[10px] font-bold uppercase leading-none tracking-widest">
                  {stat.label}
                </p>
                <p className="text-text-primary mt-1 text-lg font-black leading-none">
                  {stat.value ?? '—'}
                </p>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Tabs */}
      <Tabs
        value={activeTab || 'collections'}
        onValueChange={(v) => setActiveTab?.(v)}
        className="w-full"
      >
        {/* cabinetSurface v1 */}
        <TabsList
          className={cn(
            cabinetSurface.tabsList,
            'no-scrollbar min-h-12 flex-wrap justify-start gap-0 overflow-x-auto'
          )}
        >
          <div className="flex items-center gap-1 px-1">
            <span className="text-text-muted mr-1 shrink-0 text-[8px] font-black uppercase tracking-[0.2em]">
              1
            </span>
            <TabsTrigger
              value="collections"
              className={cn(
                cabinetSurface.tabsTrigger,
                'data-[state=active]:text-accent-primary h-9 shrink-0 px-5 font-black tracking-widest'
              )}
            >
              Коллекции
            </TabsTrigger>
            <TabsTrigger
              value="dashboard"
              className={cn(
                cabinetSurface.tabsTrigger,
                'data-[state=active]:text-accent-primary flex h-9 shrink-0 items-center gap-1.5 px-5 font-black tracking-widest'
              )}
            >
              Дашборд{' '}
              <span className="bg-accent-primary/15 text-accent-primary ml-0.5 flex h-4 min-w-4 items-center justify-center rounded text-[8px] font-black">
                2
              </span>
            </TabsTrigger>
            <TabsTrigger
              value="demand"
              className={cn(
                cabinetSurface.tabsTrigger,
                'data-[state=active]:text-accent-primary h-9 shrink-0 px-4 text-[9px] font-black tracking-widest'
              )}
            >
              Прогноз
            </TabsTrigger>
            <TabsTrigger
              value="tz"
              className={cn(
                cabinetSurface.tabsTrigger,
                'data-[state=active]:text-accent-primary h-9 shrink-0 px-4 text-[9px] font-black tracking-widest'
              )}
            >
              ТЗ
            </TabsTrigger>
          </div>
          <div className="bg-border-subtle mx-0.5 h-6 w-px shrink-0" />
          <div className="flex items-center gap-1 px-1">
            <span className="text-text-muted mr-1 shrink-0 text-[8px] font-black uppercase tracking-[0.2em]">
              2
            </span>
            <TabsTrigger
              value="plm"
              className={cn(
                cabinetSurface.tabsTrigger,
                'data-[state=active]:text-accent-primary h-9 shrink-0 px-5 font-black tracking-widest'
              )}
            >
              Артикулы
            </TabsTrigger>
            <TabsTrigger
              value="samples"
              className={cn(
                cabinetSurface.tabsTrigger,
                'data-[state=active]:text-accent-primary h-9 shrink-0 px-5 font-black tracking-widest'
              )}
            >
              Сэмплы
            </TabsTrigger>
            <TabsTrigger
              value="fitting"
              className={cn(
                cabinetSurface.tabsTrigger,
                'data-[state=active]:text-accent-primary h-9 shrink-0 px-4 text-[9px] font-black tracking-widest'
              )}
            >
              Примерки
            </TabsTrigger>
            <TabsTrigger
              value="approval"
              className={cn(
                cabinetSurface.tabsTrigger,
                'data-[state=active]:text-accent-primary h-9 shrink-0 px-5 font-black tracking-widest'
              )}
            >
              Утверждения
            </TabsTrigger>
          </div>
          <div className="bg-border-subtle mx-0.5 h-6 w-px shrink-0" />
          <div className="flex items-center gap-1 px-1">
            <span className="text-text-muted mr-1 shrink-0 text-[8px] font-black uppercase tracking-[0.2em]">
              3
            </span>
            <TabsTrigger
              value="orders"
              className={cn(
                cabinetSurface.tabsTrigger,
                'data-[state=active]:text-accent-primary h-9 shrink-0 px-5 font-black tracking-widest'
              )}
            >
              Заказы (PO)
            </TabsTrigger>
            <TabsTrigger
              value="materials"
              className={cn(
                cabinetSurface.tabsTrigger,
                'data-[state=active]:text-accent-primary h-9 shrink-0 px-5 font-black tracking-widest'
              )}
            >
              Снабжение
            </TabsTrigger>
            <TabsTrigger
              value="costing"
              className={cn(
                cabinetSurface.tabsTrigger,
                'data-[state=active]:text-accent-primary h-9 shrink-0 px-5 font-black tracking-widest'
              )}
            >
              Костинг
            </TabsTrigger>
            <TabsTrigger
              value="execution"
              className={cn(
                cabinetSurface.tabsTrigger,
                'data-[state=active]:text-accent-primary flex h-9 shrink-0 items-center gap-1.5 px-5 font-black tracking-widest'
              )}
            >
              Цех{' '}
              <span className="ml-0.5 flex h-4 min-w-4 items-center justify-center rounded bg-amber-100 text-[8px] font-black text-amber-600">
                4
              </span>
            </TabsTrigger>
            <TabsTrigger
              value="mps"
              className={cn(
                cabinetSurface.tabsTrigger,
                'data-[state=active]:text-accent-primary h-9 shrink-0 px-4 text-[9px] font-black tracking-widest'
              )}
            >
              MPS
            </TabsTrigger>
          </div>
          <div className="bg-border-subtle mx-0.5 h-6 w-px shrink-0" />
          <div className="flex items-center gap-1 px-1">
            <span className="text-text-muted mr-1 shrink-0 text-[8px] font-black uppercase tracking-[0.2em]">
              4
            </span>
            <TabsTrigger
              value="compliance"
              className={cn(
                cabinetSurface.tabsTrigger,
                'data-[state=active]:text-accent-primary h-9 shrink-0 px-5 font-black tracking-widest'
              )}
            >
              Закон / QC
            </TabsTrigger>
            <TabsTrigger
              value="logistics"
              className={cn(
                cabinetSurface.tabsTrigger,
                'data-[state=active]:text-accent-primary h-9 shrink-0 px-5 font-black tracking-widest'
              )}
            >
              Логистика
            </TabsTrigger>
            <TabsTrigger
              value="warehouse"
              className={cn(
                cabinetSurface.tabsTrigger,
                'data-[state=active]:text-accent-primary h-9 shrink-0 px-4 text-[9px] font-black tracking-widest'
              )}
            >
              Склад
            </TabsTrigger>
            <TabsTrigger
              value="labeling"
              className={cn(
                cabinetSurface.tabsTrigger,
                'data-[state=active]:text-accent-primary h-9 shrink-0 px-5 font-black tracking-widest'
              )}
            >
              Маркировка
            </TabsTrigger>
          </div>
          <div className="bg-border-subtle mx-0.5 h-6 w-px shrink-0" />
          <div className="flex items-center gap-1 px-1">
            <span className="text-text-muted mr-1 shrink-0 text-[8px] font-black uppercase tracking-[0.2em]">
              5
            </span>
            <TabsTrigger
              value="budget"
              className={cn(
                cabinetSurface.tabsTrigger,
                'data-[state=active]:text-accent-primary h-9 shrink-0 px-5 font-black tracking-widest'
              )}
            >
              Бюджет
            </TabsTrigger>
            <TabsTrigger
              value="finance"
              className={cn(
                cabinetSurface.tabsTrigger,
                'data-[state=active]:text-accent-primary h-9 shrink-0 px-5 font-black tracking-widest'
              )}
            >
              Финансы
            </TabsTrigger>
            <TabsTrigger
              value="documents"
              className={cn(
                cabinetSurface.tabsTrigger,
                'data-[state=active]:text-accent-primary h-9 shrink-0 px-5 font-black tracking-widest'
              )}
            >
              Документы
            </TabsTrigger>
            <TabsTrigger
              value="losses"
              className={cn(
                cabinetSurface.tabsTrigger,
                'data-[state=active]:text-accent-primary h-9 shrink-0 px-5 font-black tracking-widest'
              )}
            >
              Потери
            </TabsTrigger>
            <TabsTrigger
              value="factories"
              className={cn(
                cabinetSurface.tabsTrigger,
                'data-[state=active]:text-accent-primary h-9 shrink-0 px-5 font-black tracking-widest'
              )}
            >
              Фабрики
            </TabsTrigger>
            <TabsTrigger
              value="handbooks"
              className={cn(
                cabinetSurface.tabsTrigger,
                'data-[state=active]:text-accent-primary h-9 shrink-0 px-5 font-black tracking-widest'
              )}
            >
              Партнёры
            </TabsTrigger>
            <TabsTrigger
              value="audit"
              className={cn(
                cabinetSurface.tabsTrigger,
                'data-[state=active]:text-accent-primary h-9 shrink-0 px-5 font-black tracking-widest'
              )}
            >
              Аудит
            </TabsTrigger>
            <TabsTrigger
              value="sla"
              className={cn(
                cabinetSurface.tabsTrigger,
                'data-[state=active]:text-accent-primary h-9 shrink-0 px-5 font-black tracking-widest'
              )}
            >
              SLA
            </TabsTrigger>
            <TabsTrigger
              value="reports"
              className={cn(
                cabinetSurface.tabsTrigger,
                'data-[state=active]:text-accent-primary h-9 shrink-0 px-4 text-[9px] font-black tracking-widest'
              )}
            >
              Отчёты
            </TabsTrigger>
          </div>
          <div className="bg-border-subtle mx-0.5 h-6 w-px shrink-0" />
          <div className="flex items-center gap-1 px-1">
            <TabsTrigger
              value="archive"
              className={cn(
                cabinetSurface.tabsTrigger,
                'data-[state=active]:text-accent-primary h-9 shrink-0 px-4 text-[9px] font-black tracking-widest'
              )}
            >
              Архив
            </TabsTrigger>
          </div>
        </TabsList>

        <TabsContent value="chat" className={cabinetSurface.cabinetProfileTabPanel}>
          <SectionHeader title="Обсуждения по коллекциям" barColor="bg-accent-primary" />
          <div className="border-border-subtle flex min-h-[480px] gap-4 overflow-hidden rounded-xl border bg-white shadow-sm">
            {/* Слева: список чатов по коллекциям */}
            <aside className="border-border-subtle flex w-64 shrink-0 flex-col border-r">
              <div className="border-border-subtle border-b p-3">
                <p className="text-text-muted text-[9px] font-black uppercase tracking-widest">
                  Чаты по коллекциям
                </p>
              </div>
              <div className="flex-1 overflow-y-auto">
                {(() => {
                  const allMsgs = chatMessages || filteredChat || [];
                  const chats = Array.from(
                    new Set(allMsgs.map((m: any) => m.collection || 'General'))
                  );
                  const list = chats.length ? chats : ['SS26', 'DROP-UZ', 'BASIC', 'General'];
                  return list.map((collId) => {
                    const count = allMsgs.filter(
                      (m: any) => (m.collection || 'General') === collId
                    ).length;
                    const collName = collections?.find((c: any) => c.id === collId)?.name || collId;
                    const isActive = (activeChatCollection || list[0]) === collId;
                    return (
                      <button
                        key={String(collId)}
                        type="button"
                        onClick={() => setActiveChatCollection?.(collId)}
                        className={cn(
                          'flex w-full items-center justify-between gap-2 px-3 py-3 text-left transition-colors',
                          isActive
                            ? 'bg-accent-primary/10 border-accent-primary text-accent-primary border-l-2'
                            : 'hover:bg-bg-surface2 text-text-primary'
                        )}
                      >
                        <span className="truncate text-[11px] font-bold">{collName}</span>
                        {count > 0 && (
                          <Badge variant="secondary" className="h-5 shrink-0 text-[8px]">
                            {count}
                          </Badge>
                        )}
                      </button>
                    );
                  });
                })()}
              </div>
            </aside>
            {/* Справа: переписка внутри чата по ролям */}
            <main className="flex min-w-0 flex-1 flex-col">
              <div className="flex-1 space-y-3 overflow-y-auto p-4">
                {(() => {
                  const allMsgsForSel = chatMessages || filteredChat || [];
                  const selColl = activeChatCollection || allMsgsForSel[0]?.collection || 'SS26';
                  const msgs = allMsgsForSel.filter(
                    (m: any) => (m.collection || 'General') === selColl
                  );
                  if (msgs.length === 0) {
                    return (
                      <p className="text-text-muted py-8 text-center text-[10px]">
                        Нет сообщений. Напишите первым.
                      </p>
                    );
                  }
                  return msgs.map((m: any) => (
                    <div key={m.id} className="flex gap-3">
                      <div className="bg-accent-primary/15 text-accent-primary flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-[10px] font-black">
                        {m.avatar || (m.sender || '').slice(0, 2).toUpperCase()}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-text-primary text-[10px] font-bold">{m.sender}</p>
                        <p className="text-text-secondary mt-0.5 text-[11px]">{m.text}</p>
                        <p className="text-text-muted mt-1 text-[9px]">{m.time}</p>
                      </div>
                    </div>
                  ));
                })()}
              </div>
              <div className="border-border-subtle flex gap-2 border-t p-4">
                <Input
                  placeholder="Сообщение..."
                  value={newMessage || ''}
                  onChange={(e) => setNewMessage?.(e.target.value)}
                  className="h-10 flex-1 rounded-lg text-[11px]"
                />
                <Button
                  size="sm"
                  className="bg-text-primary h-10 rounded-lg px-5 text-[10px] font-bold text-white hover:bg-black"
                  onClick={() => handleSendMessage?.()}
                >
                  Отправить
                </Button>
              </div>
            </main>
          </div>
        </TabsContent>
        <TabsContent value="collections" className={cabinetSurface.cabinetProfileTabPanel}>
          <SectionHeader title="Коллекции" barColor="bg-text-primary" />
          <SectionInfoCard
            title="Что такое коллекции"
            description="Коллекция — корневая сущность производства: сезонный ассортимент (SS26, дропы). Из неё идут артикулы, сэмплы, PO, снабжение и бюджет. Здесь вы создаёте новые коллекции, копируете по шаблону, сравниваете и отслеживаете прогресс."
            icon={Layers}
            iconBg="bg-bg-surface2"
            iconColor="text-text-secondary"
            badges={
              <>
                <Badge variant="outline" className="text-[9px]">
                  Артикулы → коллекция
                </Badge>
                <Badge variant="outline" className="text-[9px]">
                  PO, сэмплы, бюджет
                </Badge>
              </>
            }
          />
          {typeof setCollectionFilter === 'function' && (
            <CollectionFiltersAndRisk
              collections={collections || []}
              selectedIds={selectedCollectionIds || []}
              onFilter={(f) => setCollectionFilter?.((prev: any) => ({ ...(prev || {}), ...f }))}
              onCompare={(ids) => {
                setSelectedCollectionIds?.(ids);
                setActiveTab?.('dashboard');
              }}
              onTemplateFrom={(id) => {
                p.setDuplicateFromCollection?.({
                  id,
                  name: collections?.find((c: any) => c.id === id)?.name || id,
                });
                setIsCreatingCollection?.(true);
              }}
              riskForecast={[]}
            />
          )}
          <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <Button
                size="lg"
                className="bg-text-primary h-12 gap-2 rounded-xl px-6 text-[11px] font-black text-white hover:bg-black"
                onClick={() => setIsCreatingCollection?.(true)}
              >
                <Plus className="h-5 w-5" /> Создать новую коллекцию
              </Button>
              <p className="text-text-secondary mt-2 text-[10px]">
                Создайте папку коллекции, заполните данные — затем добавляйте артикулы, импортируйте
                из архива, создавайте сэмплы и заказы
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-text-muted text-[9px] font-bold uppercase">Сортировка:</span>
              {['name', 'status', 'readiness'].map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => p.setCollectionSortOrder?.(s)}
                  className={cn(
                    'rounded-lg px-2.5 py-1 text-[9px] font-bold uppercase',
                    (p.collectionSortOrder || 'name') === s
                      ? 'bg-accent-primary/15 text-accent-primary'
                      : 'text-text-secondary hover:bg-bg-surface2'
                  )}
                >
                  {s === 'name' ? 'Имя' : s === 'status' ? 'Статус' : 'Готовность'}
                </button>
              ))}
              <div className="bg-border-subtle h-5 w-px" />
              <button
                type="button"
                onClick={() => p.setCollectionViewMode?.('grid')}
                className={cn(
                  'rounded-lg p-1.5',
                  (p.collectionViewMode || 'grid') === 'grid'
                    ? 'bg-accent-primary/15 text-accent-primary'
                    : 'text-text-muted hover:bg-bg-surface2'
                )}
                title="Сетка"
              >
                <LayoutGrid className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => p.setCollectionViewMode?.('list')}
                className={cn(
                  'rounded-lg p-1.5',
                  (p.collectionViewMode || 'grid') === 'list'
                    ? 'bg-accent-primary/15 text-accent-primary'
                    : 'text-text-muted hover:bg-bg-surface2'
                )}
                title="Список"
              >
                <List className="h-4 w-4" />
              </button>
              <Button
                variant="outline"
                size="sm"
                className="h-8 gap-1 text-[9px]"
                onClick={() => {
                  exportToCSV(
                    (filteredCollections ?? collections ?? [])
                      .filter((c: any) => c.id !== 'ARCHIVE')
                      .map((c: any) => ({
                        id: c.id,
                        name: c.name,
                        type: c.type,
                        status: c.status,
                        readiness: c.readiness,
                        budget: c.budget,
                        deadline: c.deadline,
                      })),
                    [
                      { key: 'id', label: 'ID' },
                      { key: 'name', label: 'Название' },
                      { key: 'type', label: 'Тип' },
                      { key: 'status', label: 'Статус' },
                      { key: 'readiness', label: 'Готовность' },
                      { key: 'budget', label: 'Бюджет' },
                      { key: 'deadline', label: 'Дедлайн' },
                    ],
                    'collections'
                  );
                  handleAction?.('Экспорт', 'Коллекции экспортированы в CSV');
                }}
              >
                <Download className="h-3.5 w-3.5" /> Экспорт
              </Button>
            </div>
          </div>
          <div
            className={cn(
              'gap-5',
              (p.collectionViewMode || 'grid') === 'list'
                ? 'flex flex-col'
                : 'grid sm:grid-cols-1 lg:grid-cols-2'
            )}
          >
            {[...(filteredCollections ?? collections ?? []).filter((c: any) => c.id !== 'ARCHIVE')]
              .sort((a: any, b: any) => {
                const ord = p.collectionSortOrder || 'name';
                if (ord === 'name') return (a.name || '').localeCompare(b.name || '');
                if (ord === 'status') return (a.status || '').localeCompare(b.status || '');
                const ra = parseInt(String(a.readiness || '0').replace(/\D/g, ''), 10) || 0;
                const rb = parseInt(String(b.readiness || '0').replace(/\D/g, ''), 10) || 0;
                return ord === 'readiness' ? rb - ra : 0;
              })
              .map((c: any) => {
                const isSelected = selectedCollectionIds?.includes(c.id);
                const statusColor =
                  c.status === 'Production'
                    ? 'from-accent-primary/10 to-accent-primary/5'
                    : c.status === 'Development'
                      ? 'from-amber-500/10 to-amber-600/5'
                      : 'from-emerald-500/10 to-emerald-600/5';
                const collSkuCount = (allSkus || filteredSkus || []).filter(
                  (s: any) => s.collection === c.id
                ).length;
                const collPoCount = (allOrders || filteredProductionOrders || []).filter(
                  (o: any) => o.collection === c.id
                ).length;
                const collSamplePending = (allSamples || filteredSampleStatuses || []).filter(
                  (s: any) =>
                    s.collection === c.id && (s.status === 'in_review' || s.status === 'waiting')
                ).length;
                const collFactories = [
                  ...new Set(
                    (allOrders || filteredProductionOrders || [])
                      .filter((o: any) => o.collection === c.id)
                      .map((o: any) => o.factory)
                  ),
                ].filter(Boolean);
                const stageStatus = {
                  design: 'completed' as const,
                  tz: 'completed' as const,
                  bom: collSkuCount > 0 ? ('completed' as const) : ('active' as const),
                  sample:
                    collSamplePending > 0
                      ? ('active' as const)
                      : collSkuCount > 0
                        ? ('completed' as const)
                        : ('locked' as const),
                  approval: collSamplePending > 0 ? ('active' as const) : ('locked' as const),
                  po: collPoCount > 0 ? ('completed' as const) : ('locked' as const),
                  production: (allOrders || []).some(
                    (o: any) => o.collection === c.id && o.status === 'In Production'
                  )
                    ? ('active' as const)
                    : collPoCount > 0
                      ? ('completed' as const)
                      : ('locked' as const),
                };
                return (
                  <Card
                    key={c.id}
                    className={cn(
                      'group cursor-pointer overflow-hidden rounded-2xl border shadow-sm transition-all duration-300',
                      isSelected
                        ? 'ring-accent-primary border-accent-primary/30 from-accent-primary/10 bg-gradient-to-br to-white shadow-md ring-2'
                        : 'border-border-subtle hover:border-accent-primary/20 bg-white hover:shadow-lg'
                    )}
                    onClick={() => toggleCollectionSelection?.(c.id)}
                  >
                    <div className={cn('h-1.5 w-full bg-gradient-to-r', statusColor)} />
                    <div className="flex flex-col gap-5 p-6">
                      <div className="flex items-start justify-between gap-4">
                        <div className="min-w-0 flex-1">
                          <h3 className="text-text-primary group-hover:text-accent-primary text-lg font-black uppercase tracking-tight transition-colors">
                            {c.name}
                          </h3>
                          <p className="text-text-secondary mt-1 text-[11px] font-medium">
                            {c.type} · {c.items} позиций
                          </p>
                          <div className="mt-4 flex flex-wrap gap-2">
                            <Badge
                              className={cn(
                                'text-[9px] font-bold uppercase',
                                c.status === 'Production'
                                  ? 'bg-accent-primary/15 text-accent-primary border-0'
                                  : c.status === 'Development'
                                    ? 'border-0 bg-amber-100 text-amber-700'
                                    : 'border-0 bg-emerald-100 text-emerald-700'
                              )}
                            >
                              {c.status} · {c.readiness}
                            </Badge>
                            {(c.season || c.tag) && (
                              <Badge variant="outline" className="text-[8px]">
                                {c.season || c.tag}
                              </Badge>
                            )}
                            <span className="text-text-primary text-[12px] font-bold">
                              {c.budget}
                            </span>
                            {c.deadline && c.deadline !== '—' && (
                              <span className="text-text-secondary flex items-center gap-0.5 text-[10px] font-medium">
                                <Calendar className="h-3 w-3" /> До {c.deadline}
                              </span>
                            )}
                          </div>
                          <CollectionCardStats
                            skuCount={collSkuCount}
                            poCount={collPoCount}
                            samplePending={collSamplePending}
                            onNavigate={(tab) => {
                              setActiveTab?.(tab);
                              toggleCollectionSelection?.(c.id);
                            }}
                          />
                          <div className="mt-3">
                            <CollectionProgressMiniChart
                              stageStatus={stageStatus}
                              onStageClick={(stage) => {
                                toggleCollectionSelection?.(c.id);
                                setActiveTab?.(
                                  stage === 'sample' || stage === 'approval'
                                    ? 'samples'
                                    : stage === 'po' || stage === 'production'
                                      ? 'orders'
                                      : 'plm'
                                );
                              }}
                            />
                          </div>
                          {collFactories.length > 0 && (
                            <div className="mt-2 flex flex-wrap gap-1">
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setActiveTab?.('factories');
                                }}
                                className="text-text-secondary hover:text-accent-primary flex items-center gap-0.5 text-[9px]"
                              >
                                <Factory className="h-3 w-3" />{' '}
                                {collFactories.slice(0, 2).join(', ')}
                                {collFactories.length > 2 ? ` +${collFactories.length - 2}` : ''}
                              </button>
                            </div>
                          )}
                          {c.responsible && (
                            <p className="text-text-muted mt-2 text-[10px] font-medium">
                              {c.responsible}
                            </p>
                          )}
                        </div>
                        <div
                          className={cn(
                            'flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-transform group-hover:scale-110',
                            isSelected
                              ? 'bg-accent-primary/15 text-accent-primary'
                              : 'bg-bg-surface2 text-text-secondary'
                          )}
                        >
                          <ChevronRight className="h-5 w-5" />
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-border-default hover:border-accent-primary/30 hover:bg-accent-primary/10 hover:text-accent-primary h-9 rounded-lg text-[9px] font-bold"
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveTab?.('plm');
                            toggleCollectionSelection?.(c.id);
                          }}
                        >
                          Артикулы
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-border-default hover:border-accent-primary/30 hover:bg-accent-primary/10 hover:text-accent-primary h-9 rounded-lg text-[9px] font-bold"
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveTab?.('samples');
                            toggleCollectionSelection?.(c.id);
                          }}
                        >
                          Сэмплы
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-border-default hover:border-accent-primary/30 hover:bg-accent-primary/10 hover:text-accent-primary h-9 rounded-lg text-[9px] font-bold"
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveTab?.('orders');
                            toggleCollectionSelection?.(c.id);
                          }}
                        >
                          Заказы
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-border-default hover:border-accent-primary/30 hover:bg-accent-primary/10 hover:text-accent-primary h-9 rounded-lg text-[9px] font-bold"
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveTab?.('materials');
                            toggleCollectionSelection?.(c.id);
                          }}
                        >
                          Снабжение
                        </Button>
                        {p.setDuplicateFromCollection && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-text-secondary hover:text-accent-primary hover:bg-accent-primary/10 h-9 rounded-lg text-[9px] font-bold"
                            onClick={(e) => {
                              e.stopPropagation();
                              p.setDuplicateFromCollection({ id: c.id, name: c.name || c.id });
                              setIsCreatingCollection?.(true);
                            }}
                            title="Копировать коллекцию"
                          >
                            <Copy className="mr-1 h-3.5 w-3.5" /> Копировать
                          </Button>
                        )}
                      </div>
                    </div>
                  </Card>
                );
              })}
          </div>
        </TabsContent>

        <TabsContent value="dashboard" className={cabinetSurface.cabinetProfileTabPanel}>
          <SectionHeader title="Командный центр" barColor="bg-accent-primary" />
          <SectionInfoCard
            title="Дашборд"
            description="Сводный центр: агрегирует данные по выбранным коллекциям. Показывает узкие места (SLA, потери), прогресс этапов, ближайшие дедлайны и события. Отсюда навигация по всем разделам производства."
            icon={Activity}
            iconBg="bg-accent-primary/15"
            iconColor="text-accent-primary"
            badges={
              <>
                <Badge variant="outline" className="text-[9px]">
                  Узкие места
                </Badge>
                <Badge variant="outline" className="text-[9px]">
                  Дедлайны
                </Badge>
              </>
            }
          />
          <ProductionCommandCenter onNavigate={(tab) => setActiveTab?.(tab)} />
          {selectedId && (
            <CollectionProgressPanel
              collectionId={selectedId}
              collectionName={collections?.find((c: any) => c.id === selectedId)?.name}
              readiness={
                parseInt(
                  collections?.find((c: any) => c.id === selectedId)?.readiness || '0',
                  10
                ) || 65
              }
              stageStatus={{
                design: 'completed',
                tz: 'completed',
                bom: 'completed',
                sample: 'active',
                approval: 'locked',
                po: 'locked',
                production: 'locked',
              }}
              skuCount={(filteredSkus || []).length}
              approvedCount={
                (filteredSampleStatuses || []).filter((s: any) => s.status === 'approved').length
              }
              poCount={(filteredProductionOrders || []).length}
              onNavigate={(stage) =>
                setActiveTab?.(
                  stage === 'sample'
                    ? 'samples'
                    : stage === 'po'
                      ? 'orders'
                      : stage === 'production'
                        ? 'execution'
                        : stage
                )
              }
            />
          )}
          <BottleneckPanel
            items={[
              ...(filteredSlaSamples || [])
                .filter((s: any) => s.slaOverdue)
                .map((s: any) => ({
                  id: `sla-${s.skuId}`,
                  type: 'sla' as const,
                  title: `${s.skuName} просрочен`,
                  detail: s.dueDate,
                  severity: 'high' as const,
                })),
              ...((filteredLosses || []).length > 2
                ? [
                    {
                      id: 'loss',
                      type: 'material' as const,
                      title: 'Потери выше нормы',
                      detail: `${(filteredLosses || []).length} записей`,
                      severity: 'medium' as const,
                    },
                  ]
                : []),
            ]}
            onResolve={() => {}}
          />
          <SectionHeader title="Ближайшие дедлайны" barColor="bg-amber-500" />
          <Card className="overflow-hidden rounded-xl border border-amber-100 shadow-sm">
            <CardContent className="pt-4">
              <div className="max-h-40 space-y-2 overflow-y-auto">
                {[
                  ...(filteredSlaSamples || [])
                    .filter((s: any) => s.slaOverdue)
                    .slice(0, 3)
                    .map((s: any) => ({
                      type: 'sla',
                      label: s.skuName,
                      date: s.dueDate,
                      overdue: true,
                    })),
                  ...(filteredSlaSamples || [])
                    .filter((s: any) => !s.slaOverdue)
                    .slice(0, 5)
                    .map((s: any) => ({
                      type: 'sla',
                      label: s.skuName,
                      date: s.dueDate,
                      overdue: false,
                    })),
                  ...(filteredCollections ?? collections ?? [])
                    .filter((c: any) => c.deadline && c.deadline !== '—')
                    .slice(0, 3)
                    .map((c: any) => ({
                      type: 'coll',
                      label: c.name,
                      date: c.deadline,
                      overdue: false,
                    })),
                ]
                  .slice(0, 8)
                  .map((item: any, i) => (
                    <div
                      key={i}
                      className="border-border-subtle flex items-center justify-between border-b py-1.5 last:border-0"
                    >
                      <span className="flex-1 truncate text-[10px] font-medium">{item.label}</span>
                      <SLACountdown dueDate={item.date} overdue={item.overdue} />
                    </div>
                  ))}
                {!filteredSlaSamples?.length &&
                  !(filteredCollections ?? collections ?? []).some((c: any) => c.deadline) && (
                    <p className="text-text-muted py-4 text-[10px]">Нет активных дедлайнов</p>
                  )}
              </div>
            </CardContent>
          </Card>
          {(() => {
            const overBudgets = (collectionBudgets || []).filter(
              (b: any) => (b.totalPlan || 0) - (b.totalFact || 0) < 0
            );
            return (
              overBudgets.length > 0 && (
                <Card className="rounded-xl border border-rose-200 bg-rose-50/50">
                  <CardContent className="pt-4">
                    <div className="flex items-center gap-2 text-rose-700">
                      <AlertCircle className="h-5 w-5 shrink-0" />
                      <div>
                        <p className="text-[11px] font-bold">Перерасход бюджета</p>
                        <p className="text-[10px] text-rose-600">
                          Коллекции:{' '}
                          {overBudgets
                            .map(
                              (b: any) =>
                                collections?.find((c: any) => c.id === b.collectionId)?.name ||
                                b.collectionId
                            )
                            .join(', ')}
                        </p>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        className="ml-auto h-7 border-rose-200 text-[9px] text-rose-700"
                        onClick={() => setActiveTab?.('budget')}
                      >
                        Бюджет →
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )
            );
          })()}
          <SectionHeader title="Ближайшие события" barColor="bg-sky-500" />
          <Card className="border-border-subtle overflow-hidden rounded-xl border shadow-sm">
            <CardContent className="pt-4">
              <div className="max-h-36 space-y-2 overflow-y-auto">
                {(filteredEvents || []).slice(0, 5).map((e: any) => (
                  <div
                    key={e.id}
                    className="border-border-subtle flex items-center justify-between border-b py-1.5 last:border-0"
                  >
                    <span className="flex-1 truncate text-[10px] font-medium">{e.title}</span>
                    <span className="text-text-secondary text-[9px]">{e.date}</span>
                    <Badge variant="outline" className="ml-2 text-[8px]">
                      {e.type}
                    </Badge>
                  </div>
                ))}
                {(!filteredEvents || filteredEvents.length === 0) && (
                  <p className="text-text-muted py-4 text-[10px]">Нет ближайших событий</p>
                )}
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="mt-2 w-full text-[9px]"
                onClick={() => setActiveTab?.('calendar')}
              >
                Календарь →
              </Button>
            </CardContent>
          </Card>
          <SectionHeader title="Сводка" barColor="bg-emerald-600" />
          <Card className="border-border-subtle rounded-xl border border-none bg-white shadow-sm">
            <CardHeader>
              <CardTitle className="text-xs font-black uppercase">Обзор</CardTitle>
              <CardDescription>Сводка по выбранным коллекциям</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <div className="bg-bg-surface2 rounded-xl p-4">
                  <p className="text-text-muted text-[10px] font-bold">SKU</p>
                  <p className="text-xl font-black">{(filteredSkus || []).length}</p>
                </div>
                <div className="bg-bg-surface2 rounded-xl p-4">
                  <p className="text-text-muted text-[10px] font-bold">Заказы (PO)</p>
                  <p className="text-xl font-black">{(filteredProductionOrders || []).length}</p>
                </div>
                <div className="bg-bg-surface2 rounded-xl p-4">
                  <p className="text-text-muted text-[10px] font-bold">Сэмплы на проверку</p>
                  <p className="text-xl font-black">{samplePendingCount ?? 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="demand" className={cabinetSurface.cabinetProfileTabPanel}>
          <SectionHeader title="Прогноз спроса" barColor="bg-accent-primary" />
          <SectionInfoCard
            title="Прогноз спроса"
            description="План объёмов по артикулам и коллекциям. Прогнозирование на основе истории продаж и планов байеров. Связь с планом производства (MPS) и заказами."
            icon={BarChart3}
            iconBg="bg-accent-primary/15"
            iconColor="text-accent-primary"
            badges={
              <>
                <Badge variant="outline" className="text-[9px]">
                  Артикулы, коллекции
                </Badge>
                <Badge variant="outline" className="text-[9px]">
                  MPS →
                </Badge>
              </>
            }
          />
          <Card className="border-border-subtle overflow-hidden rounded-2xl border shadow-sm">
            <CardHeader>
              <CardTitle className="text-xs font-black uppercase">Прогноз по коллекциям</CardTitle>
              <CardDescription className="text-[10px]">
                План объёмов для выбранных коллекций
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {(filteredCollections ?? collections ?? [])
                  .filter((c: any) => c.id !== 'ARCHIVE')
                  .slice(0, 5)
                  .map((c: any) => {
                    const skuCount = (filteredSkus || []).filter(
                      (s: any) => s.collection === c.id
                    ).length;
                    return (
                      <div
                        key={c.id}
                        className="bg-bg-surface2 border-border-subtle flex items-center justify-between rounded-xl border p-3"
                      >
                        <span className="text-[11px] font-bold">{c.name}</span>
                        <div className="flex items-center gap-3">
                          <span className="text-text-secondary text-[10px]">
                            {skuCount} артикулов
                          </span>
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-7 text-[9px]"
                            onClick={() => {
                              toggleCollectionSelection?.(c.id);
                              setActiveTab?.('mps');
                            }}
                          >
                            План →
                          </Button>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tz" className={cabinetSurface.cabinetProfileTabPanel}>
          <SectionHeader title="ТЗ на коллекцию" barColor="bg-text-primary/75" />
          <SectionInfoCard
            title="ТЗ (Техническое задание)"
            description="Техническое задание и бриф на коллекцию. Описание концепции, целевая аудитория, ограничения по материалам и срокам. Связано с коллекцией и документами."
            icon={FileText}
            iconBg="bg-bg-surface2"
            iconColor="text-text-secondary"
            badges={
              <>
                <Badge variant="outline" className="text-[9px]">
                  Коллекция
                </Badge>
                <Badge variant="outline" className="text-[9px]">
                  Документы
                </Badge>
              </>
            }
          />
          <Card className="border-border-subtle overflow-hidden rounded-2xl border shadow-sm">
            <CardHeader>
              <CardTitle className="text-xs font-black uppercase">ТЗ по коллекциям</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {(productionDocuments || [])
                  .filter((d: any) => d.type === 'tz')
                  .filter((d: any) => !selectedId || d.collection === selectedId)
                  .map((d: any, i: number) => (
                    <div
                      key={i}
                      className="bg-bg-surface2 flex items-center justify-between rounded-lg p-3"
                    >
                      <span className="text-[11px] font-medium">{d.name}</span>
                      <Badge variant="outline" className="text-[8px]">
                        {d.collection} · {d.status}
                      </Badge>
                    </div>
                  ))}
                {(!productionDocuments ||
                  !productionDocuments.some((d: any) => d.type === 'tz')) && (
                  <p className="text-text-muted py-4 text-[10px]">
                    Нет ТЗ. Добавьте в раздел Документы.
                  </p>
                )}
              </div>
              <Button
                variant="outline"
                size="sm"
                className="mt-4 text-[9px]"
                onClick={() => setActiveTab?.('documents')}
              >
                Документы →
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="plm" className={cabinetSurface.cabinetProfileTabPanel}>
          <SectionHeader title="Артикулы и PLM" barColor="bg-accent-primary" />
          <SectionInfoCard
            title="Артикулы (PLM)"
            description="Артикул привязан к коллекции. У каждого — BOM, варианты, Tech Pack. Сэмплы создаются по артикулам. Матрица, варианты, версии лекал и Tech Pack — основные представления."
            icon={Layers}
            iconBg="bg-accent-primary/15"
            iconColor="text-accent-primary"
            badges={
              <>
                <Badge variant="outline" className="text-[9px]">
                  BOM, Tech Pack
                </Badge>
                <Badge variant="outline" className="text-[9px]">
                  Сэмплы → артикул
                </Badge>
              </>
            }
          />
          {selectedSkuId && (
            <Card className="border-border-subtle rounded-xl border p-3 shadow-sm">
              <p className="text-text-secondary mb-2 text-[9px] font-black uppercase">
                Артикул → Сэмплы
              </p>
              <div className="flex flex-wrap gap-2">
                {(displaySampleStatuses || filteredSampleStatuses || [])
                  .filter((s: any) => s.skuId === selectedSkuId)
                  .map((s: any) => (
                    <button
                      key={s.skuId}
                      type="button"
                      onClick={() => setActiveTab?.('samples')}
                      className="bg-accent-primary/10 text-accent-primary border-accent-primary/20 hover:bg-accent-primary/15 rounded-lg border px-3 py-1.5 text-[10px] font-bold transition-colors"
                    >
                      {STAGE_LABELS[s.stage] || s.stageLabel} ·{' '}
                      {s.status === 'approved' ? 'Утверждён' : 'На проверке'}
                    </button>
                  ))}
                {(!displaySampleStatuses ||
                  !filteredSampleStatuses ||
                  (displaySampleStatuses || filteredSampleStatuses || []).filter(
                    (s: any) => s.skuId === selectedSkuId
                  ).length === 0) && (
                  <span className="text-text-muted text-[10px]">
                    Нет сэмплов. Перейти в{' '}
                    <button
                      type="button"
                      onClick={() => setActiveTab?.('samples')}
                      className="text-accent-primary font-bold underline"
                    >
                      Сэмплы
                    </button>
                  </span>
                )}
              </div>
            </Card>
          )}
          <div className="mb-3 flex flex-wrap gap-2">
            <Button
              variant={plmView === 'matrix' ? 'default' : 'outline'}
              size="sm"
              className="text-[9px]"
              onClick={() => setPlmView?.('matrix')}
            >
              Матрица
            </Button>
            <Button
              variant={plmView === 'variants' ? 'default' : 'outline'}
              size="sm"
              className="text-[9px]"
              onClick={() => setPlmView?.('variants')}
            >
              Варианты
            </Button>
            <Button
              variant={plmView === 'pim' ? 'default' : 'outline'}
              size="sm"
              className="text-[9px]"
              onClick={() => setPlmView?.('pim')}
            >
              Версии лекал
            </Button>
            <Button
              variant={plmView === 'techpack' ? 'default' : 'outline'}
              size="sm"
              className="text-[9px]"
              onClick={() => setPlmView?.('techpack')}
            >
              Tech Pack
            </Button>
          </div>
          {plmView === 'techpack' ? (
            <TechPackBuilder collectionId={selectedId} />
          ) : plmView === 'variants' ? (
            <VariantMatrixEditor collectionId={selectedId} />
          ) : plmView === 'pim' ? (
            <PatternVersionControl collectionId={selectedId} />
          ) : (
            <AssortmentPlm
              collectionId={selectedId}
              skus={displaySkus || filteredSkus || []}
              onAddSku={() => setIsSkuWizardOpen?.(true)}
              onSkuClick={(skuId) => p.setSelectedSkuId?.(p.selectedSkuId === skuId ? null : skuId)}
              onPlmViewSwitch={(v) => setPlmView?.(v)}
              onBomHistory={(skuId) => {
                setPlmView?.('techpack');
                p.setSelectedSkuId?.(skuId);
              }}
            />
          )}
        </TabsContent>

        <TabsContent value="samples" className={cabinetSurface.cabinetProfileTabPanel}>
          <SectionHeader title="Сэмплы" barColor="bg-amber-600" />
          <SectionInfoCard
            title="Сэмплы"
            description="Сэмпл связан с артикулом, коллекцией и фабрикой. Этапы: Proto1, Proto2, PP, Size Set. Утверждённые сэмплы позволяют создавать PO. Здесь вы отслеживаете сроки (SLA), статусы доставки и утверждения."
            icon={ClipboardCheck}
            iconBg="bg-amber-100"
            iconColor="text-amber-600"
            badges={
              <>
                <Badge variant="outline" className="text-[9px]">
                  Этапы Proto → PP
                </Badge>
                <Badge variant="outline" className="text-[9px]">
                  Утверждённые → PO
                </Badge>
              </>
            }
          />
          {selectedSkuId && (
            <SampleCommentsAndTracking
              skuId={selectedSkuId}
              skuName={displaySampleStatuses?.find((s: any) => s.skuId === selectedSkuId)?.skuName}
              comments={(sampleComments || {})[selectedSkuId]?.map(
                (c: { id: string; author: string; text: string; time: string }) => ({
                  id: c.id,
                  skuId: selectedSkuId,
                  author: c.author,
                  text: c.text,
                  time: c.time,
                })
              )}
              tracking={
                displaySampleStatuses?.find((s: any) => s.skuId === selectedSkuId)?.tracking
              }
              onAddComment={(text) =>
                p.setSampleComments?.((prev: any) => ({
                  ...prev,
                  [selectedSkuId]: [
                    ...(prev[selectedSkuId] || []),
                    { id: String(Date.now()), author: 'Вы', text, time: 'Сейчас' },
                  ],
                }))
              }
              onRemind={() => handleAction?.('Напоминание', 'Напоминание отправлено фабрике')}
            />
          )}
          <CreatePOFromSamples
            approvedSamples={(filteredSampleStatuses || [])
              .filter((s: any) => s.status === 'approved')
              .map((s: any) => ({
                skuId: s.skuId,
                skuName: s.skuName,
                collection: s.collection,
                status: s.status,
                stage: s.stage,
                approved: true,
              }))}
            materialsOk={(filteredMaterials || []).length > 0}
            onCreatePO={() => setIsAutoPOOpen?.(true)}
          />
          <div className="mb-3 flex flex-wrap gap-2">
            <Input
              placeholder="Поиск по артикулу или названию..."
              value={sampleSearchQuery || ''}
              onChange={(e) => setSampleSearchQuery?.(e.target.value)}
              className="h-8 max-w-xs text-[10px]"
            />
            {(['all', 'Proto1', 'Proto2', 'PP', 'SizeSet', 'in_review', 'approved'] as const).map(
              (f) => (
                <button
                  key={f}
                  type="button"
                  onClick={() => p.setSampleStageFilter?.(f)}
                  className={cn(
                    'rounded-lg px-3 py-1.5 text-[9px] font-bold uppercase transition-all',
                    (p.sampleStageFilter || 'all') === f
                      ? 'bg-accent-primary/15 text-accent-primary'
                      : 'text-text-secondary hover:bg-bg-surface2'
                  )}
                >
                  {f === 'all'
                    ? 'Все'
                    : f === 'in_review'
                      ? 'На проверке'
                      : f === 'approved'
                        ? 'Утверждены'
                        : f}
                </button>
              )
            )}
          </div>
          <Card className="border-border-subtle overflow-hidden rounded-xl border border-none bg-white shadow-sm">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-[9px]">SKU</TableHead>
                  <TableHead className="text-[9px]">Этап</TableHead>
                  <TableHead className="text-[9px]">Статус</TableHead>
                  <TableHead className="text-[9px]">Дедлайн</TableHead>
                  <TableHead className="text-[9px]">Фабрика</TableHead>
                  <TableHead className="text-right text-[9px]">Действия</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {((displaySampleStatuses || filteredSampleStatuses || []) as any[])
                  .filter((s: any) => {
                    if (!sampleStageFilter || sampleStageFilter === 'all') return true;
                    if (sampleStageFilter === 'in_review')
                      return s.status === 'in_review' || s.status === 'waiting';
                    if (sampleStageFilter === 'approved') return s.status === 'approved';
                    return s.stage === sampleStageFilter;
                  })
                  .map((s: any) => {
                    const stages: string[] = Array.isArray(SAMPLE_STAGES)
                      ? (SAMPLE_STAGES as string[])
                      : ['Proto1', 'Proto2', 'SMS', 'PP', 'SizeSet', 'TOP'];
                    const stageIdx = stages.indexOf(s.stage);
                    return (
                      <TableRow
                        key={s.skuId}
                        className="hover:bg-accent-primary/10 cursor-pointer"
                        onClick={() =>
                          p.setSelectedSkuId?.(p.selectedSkuId === s.skuId ? null : s.skuId)
                        }
                      >
                        <TableCell className="text-[10px] font-medium">{s.skuName}</TableCell>
                        <TableCell>
                          <Badge className="text-[8px]">
                            {STAGE_LABELS[s.stage] || s.stageLabel}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge
                            className={cn(
                              'text-[8px]',
                              s.status === 'approved'
                                ? 'bg-emerald-500 text-white'
                                : s.status === 'rejected'
                                  ? 'bg-rose-500 text-white'
                                  : 'bg-amber-500 text-white'
                            )}
                          >
                            {s.status === 'approved'
                              ? 'Утверждено'
                              : s.status === 'rejected'
                                ? 'Отклонено'
                                : 'На проверке'}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-[10px]">
                          <SLACountdown dueDate={s.dueDate} overdue={s.slaOverdue} />
                        </TableCell>
                        <TableCell className="text-[10px] font-bold">{s.factory}</TableCell>
                        <TableCell className="text-right">
                          {perms?.canCreatePO && s.status !== 'approved' && (
                            <>
                              <Button
                                variant="outline"
                                size="sm"
                                className="mr-1 h-7 border-emerald-200 text-[9px] text-emerald-600 hover:bg-emerald-50"
                                onClick={() => {
                                  setSampleStatuses?.((prev: any[]) =>
                                    prev.map((x: any) =>
                                      x.skuId === s.skuId ? { ...x, status: 'approved' } : x
                                    )
                                  );
                                  handleAction?.(
                                    'Сэмпл утверждён',
                                    `${s.skuName} — можно создавать PO`
                                  );
                                }}
                              >
                                Утвердить
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                className="mr-1 h-7 border-rose-200 text-[9px] text-rose-600 hover:bg-rose-50"
                                onClick={() =>
                                  setRejectSample?.({ skuId: s.skuId, skuName: s.skuName })
                                }
                              >
                                Отклонить
                              </Button>
                              {stageIdx >= 0 && stages[stageIdx + 1] && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="text-accent-primary h-7 text-[9px]"
                                  onClick={() => {
                                    setSampleStatuses?.((prev: any[]) =>
                                      prev.map((x: any) =>
                                        x.skuId === s.skuId
                                          ? {
                                              ...x,
                                              stage: stages[stageIdx + 1],
                                              stageLabel:
                                                STAGE_LABELS[stages[stageIdx + 1]] ||
                                                stages[stageIdx + 1],
                                            }
                                          : x
                                      )
                                    );
                                    handleAction?.(
                                      'Этап изменён',
                                      `${s.skuName} → ${STAGE_LABELS[stages[stageIdx + 1]]}`
                                    );
                                  }}
                                >
                                  → {STAGE_LABELS[stages[stageIdx + 1]]}
                                </Button>
                              )}
                            </>
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>

        <TabsContent value="fitting" className={cabinetSurface.cabinetProfileTabPanel}>
          <SectionHeader title="Примерки" barColor="bg-teal-600" />
          <SectionInfoCard
            title="Примерки (Fitting)"
            description="Журнал примерок: дата, артикул, комментарии по посадке, изменения. Связано со сэмплами. Результаты влияют на утверждение и корректировку лекал."
            icon={ClipboardCheck}
            iconBg="bg-teal-100"
            iconColor="text-teal-600"
            badges={
              <>
                <Badge variant="outline" className="text-[9px]">
                  Сэмплы
                </Badge>
              </>
            }
          />
          <Card className="border-border-subtle overflow-hidden rounded-2xl border shadow-sm">
            <CardHeader className="flex flex-row justify-between">
              <CardTitle className="text-xs font-black uppercase">Журнал примерок</CardTitle>
              <Button
                size="sm"
                className="h-8 text-[9px]"
                onClick={() => setIsFittingLogOpen?.(true)}
              >
                Открыть журнал
              </Button>
            </CardHeader>
            <CardContent>
              <p className="text-text-secondary mb-4 text-[11px]">
                Примерки по артикулам Proto1, Proto2. Фиксация замеров и комментариев.
              </p>
              <div className="space-y-2">
                {(displaySampleStatuses || filteredSampleStatuses || [])
                  .filter((s: any) => s.stage === 'Proto1' || s.stage === 'Proto2')
                  .slice(0, 5)
                  .map((s: any) => (
                    <div
                      key={s.skuId}
                      className="bg-bg-surface2 flex items-center justify-between rounded-lg p-3"
                    >
                      <span className="text-[11px] font-medium">{s.skuName}</span>
                      <Badge variant="outline" className="text-[8px]">
                        {STAGE_LABELS[s.stage] || s.stage}
                      </Badge>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 text-[9px]"
                        onClick={() => {
                          p.setSelectedSkuId?.(s.skuId);
                          setIsFittingLogOpen?.(true);
                        }}
                      >
                        Примерка
                      </Button>
                    </div>
                  ))}
              </div>
              <Button
                variant="outline"
                size="sm"
                className="mt-4 text-[9px]"
                onClick={() => setActiveTab?.('samples')}
              >
                К сэмплам →
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="approval" className={cabinetSurface.cabinetProfileTabPanel}>
          <SectionHeader title="Утверждения" barColor="bg-emerald-600" />
          <SectionInfoCard
            title="Утверждения"
            description="Принятие сэмплов перед созданием PO. Статусы: ожидает, на проверке, утверждён/отклонён. Маршрут согласования, комментарии и причина отклонения — для прозрачности решений."
            icon={ShieldCheck}
            iconBg="bg-emerald-100"
            iconColor="text-emerald-600"
            badges={
              <>
                <Badge variant="outline" className="text-[9px]">
                  Сэмплы → PO
                </Badge>
              </>
            }
          />
          <ApprovalWorkflow />
        </TabsContent>

        <TabsContent value="orders" className={cabinetSurface.cabinetProfileTabPanel}>
          <SectionHeader title="Заказы на производство (PO)" barColor="bg-emerald-600" />
          <SectionInfoCard
            title="Заказы (PO)"
            description="PO связаны с коллекцией и фабрикой. Статус оплаты влияет на финансы. Здесь — размерная сетка, цвета, прогресс, связь с логистикой и QC-отчётами."
            icon={Package}
            iconBg="bg-emerald-100"
            iconColor="text-emerald-600"
            badges={
              <>
                <Badge variant="outline" className="text-[9px]">
                  Коллекция, фабрика
                </Badge>
                <Badge variant="outline" className="text-[9px]">
                  Оплата, логистика
                </Badge>
              </>
            }
          />
          <POOverviewAndPayments
            orders={(filteredProductionOrders || []).map((o: any) => ({
              id: o.id,
              collection: o.collection,
              factory: o.factory,
              total: o.total,
              status: o.status,
              paymentStatus:
                o.paymentStatus ||
                (o.payment === 'Оплачено'
                  ? 'paid'
                  : o.payment === 'Аванс 50%'
                    ? 'advance'
                    : 'pending'),
              dueDate: o.dueDate,
            }))}
            onPayClick={(id) => handleAction?.('Оплата', `Переход к оплате PO ${id}`)}
            onNavigateToFinance={() => setActiveTab?.('finance')}
          />
          <div className="mb-3 flex flex-wrap gap-2">
            {['all', 'In Production', 'Confirmed', 'Shipped'].map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => setOrdersFilter?.(f)}
                className={cn(
                  'rounded-lg px-3 py-1.5 text-[9px] font-bold uppercase transition-all',
                  ordersFilter === f
                    ? 'text-accent-primary border-border-default border bg-white shadow-sm'
                    : 'text-text-secondary hover:bg-bg-surface2'
                )}
              >
                {f === 'all' ? 'Все' : f}
              </button>
            ))}
          </div>
          <Card className="border-border-subtle overflow-hidden rounded-xl border border-none bg-white shadow-sm">
            <CardHeader className="flex flex-row justify-between">
              <CardTitle className="text-xs font-black uppercase">
                Заказы на производство (PO)
              </CardTitle>
              <Button size="sm" className="text-[9px]" onClick={() => setIsAutoPOOpen?.(true)}>
                <Plus className="mr-1 h-3.5 w-3.5" /> Создать PO
              </Button>
            </CardHeader>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-[9px]">ID</TableHead>
                  <TableHead className="text-[9px]">Коллекция</TableHead>
                  <TableHead className="text-[9px]">Фабрика</TableHead>
                  <TableHead className="text-[9px]">Кол-во</TableHead>
                  <TableHead className="text-[9px]">Статус</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {(filteredProductionOrders || [])
                  .filter((o: any) => ordersFilter === 'all' || o.status === ordersFilter)
                  .map((o: any) => (
                    <Fragment key={o.id}>
                      <TableRow
                        className="hover:bg-accent-primary/10 cursor-pointer"
                        onClick={() => setSelectedPoId?.(selectedPoId === o.id ? null : o.id)}
                      >
                        <TableCell className="font-mono text-[10px]">{o.id}</TableCell>
                        <TableCell className="text-[10px]">{o.collection}</TableCell>
                        <TableCell className="text-[10px]">{o.factory}</TableCell>
                        <TableCell className="text-[10px] tabular-nums">{o.qty}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="text-[8px]">
                            {o.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                      {selectedPoId === o.id && (
                        <TableRow>
                          <TableCell colSpan={5} className="bg-bg-surface2/80 p-3">
                            <PODetailExpanded
                              po={{
                                id: o.id,
                                collection: o.collection,
                                factory: o.factory,
                                qty: o.qty,
                                status: o.status,
                                sizeMatrix: o.sizeMatrix,
                                colors: o.colors,
                                progress: o.progress,
                              }}
                              onNavigateFinance={() => setActiveTab?.('finance')}
                              onNavigateLogistics={() => setActiveTab?.('execution')}
                            />
                          </TableCell>
                        </TableRow>
                      )}
                    </Fragment>
                  ))}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>

        <TabsContent value="mps" className={cabinetSurface.cabinetProfileTabPanel}>
          <SectionHeader title="План производства (MPS)" barColor="bg-accent-primary" />
          <SectionInfoCard
            title="MPS (Master Production Schedule)"
            description="Календарный план запусков: квартал, месяц, неделя. Связь с прогнозом спроса и заказами. Определяет загрузку фабрик и сроки поставок."
            icon={GanttChart}
            iconBg="bg-accent-primary/15"
            iconColor="text-accent-primary"
            badges={
              <>
                <Badge variant="outline" className="text-[9px]">
                  Прогноз →
                </Badge>
                <Badge variant="outline" className="text-[9px]">
                  PO, Цех
                </Badge>
                <Button variant="outline" size="sm" className="h-7 text-[9px]" asChild>
                  <Link href={`${ROUTES.brand.calendar}?layers=production,orders`}>
                    <Calendar className="mr-1 h-3 w-3" /> Strategic Planner
                  </Link>
                </Button>
              </>
            }
          />
          <ProductionGantt
            selectedCollectionIds={selectedCollectionIds || []}
            onPeriodChange={() => {}}
            onNavigate={(tab) =>
              setActiveTab?.(
                tab === 'sample'
                  ? 'samples'
                  : tab === 'po'
                    ? 'orders'
                    : tab === 'execution'
                      ? 'execution'
                      : tab
              )
            }
          />
        </TabsContent>

        <TabsContent value="materials" className={cabinetSurface.cabinetProfileTabPanel}>
          <SectionHeader title="Снабжение" barColor="bg-accent-primary" />
          <SectionInfoCard
            title="Снабжение"
            description="Рулоны ткани, фурнитура, заявки, КП, PO и приёмка материалов. Связано с BOM артикулов. Цепочка: заявка → КП → PO → приёмка. SFC-операции — учёт по производству."
            icon={Package}
            iconBg="bg-accent-primary/15"
            iconColor="text-accent-primary"
            badges={
              <>
                <Badge variant="outline" className="text-[9px]">
                  BOM → заявки
                </Badge>
                <Badge variant="outline" className="text-[9px]">
                  Маркетплейс
                </Badge>
              </>
            }
          />
          <Button
            variant="outline"
            size="sm"
            className="mb-3"
            onClick={() => setIsMarketplaceOpen?.(true)}
          >
            Маркетплейс материалов
          </Button>
          <MaterialsShortagePanel
            items={[
              {
                id: '1',
                name: 'Silk Satin',
                category: 'fabric',
                needed: 500,
                unit: 'м',
                stock: 200,
                collection: selectedId,
                skuIds: [],
              },
              {
                id: '2',
                name: 'Пуговицы 18мм',
                category: 'haberdashery',
                needed: 1000,
                unit: 'шт',
                stock: 300,
                collection: selectedId,
                skuIds: [],
              },
            ]}
            onSearchMarketplace={() => {}}
            onSearchAuctions={() => {}}
          />
          <div className="bg-bg-surface2 border-border-default flex w-fit gap-1 rounded-2xl border p-1">
            {(
              [
                'rolls',
                'haberdashery',
                'requisition',
                'quotes',
                'po',
                'receipt',
                'subcontract',
              ] as const
            ).map((v) => (
              <button
                key={v}
                type="button"
                onClick={() => setProcurementView?.(v)}
                className={cn(
                  'rounded-xl px-4 py-2 text-[10px] font-bold uppercase transition-all',
                  procurementView === v
                    ? 'text-accent-primary bg-white shadow-sm'
                    : 'text-text-secondary hover:text-text-primary'
                )}
              >
                {v === 'rolls' && 'Рулоны'}
                {v === 'haberdashery' && 'Фурнитура'}
                {v === 'requisition' && 'Заявки'}
                {v === 'quotes' && 'КП'}
                {v === 'po' && 'PO'}
                {v === 'receipt' && 'Приёмка'}
                {v === 'subcontract' && 'Субподряд'}
              </button>
            ))}
          </div>
          {procurementView === 'rolls' && (
            <>
              <Card className="border-border-subtle rounded-xl border border-none bg-white shadow-sm">
                <CardHeader className="flex flex-row justify-between">
                  <CardTitle className="text-xs font-black uppercase">Рулоны ткани</CardTitle>
                  <Button size="sm" className="text-[9px]" onClick={() => handleAddMaterial?.()}>
                    <Plus className="mr-1 h-3.5 w-3.5" /> Добавить
                  </Button>
                </CardHeader>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-[9px]">Наименование</TableHead>
                      <TableHead className="text-[9px]">Рулон</TableHead>
                      <TableHead className="text-[9px]">Длина</TableHead>
                      <TableHead className="text-[9px]">Статус</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {(filteredMaterials || []).map((m: any, i: number) => (
                      <TableRow key={i}>
                        <TableCell className="text-[10px]">{m.name}</TableCell>
                        <TableCell className="font-mono text-[10px]">{m.roll}</TableCell>
                        <TableCell className="text-[10px]">{m.length}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="text-[8px]">
                            {m.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Card>
              <FabricLabTests />
              <SupplierCollabHub />
              {(() => {
                const fullOps = sfcOperations || [];
                const filteredOps = fullOps.filter(
                  (op: any) => !selectedId || op.collection === selectedId
                );
                return (
                  filteredOps.length > 0 && (
                    <div className="mt-4 space-y-2">
                      <p className="text-[10px] font-black uppercase">SFC операции</p>
                      {filteredOps.map((op: any, i: number) => {
                        const origIdx = fullOps.indexOf(op);
                        return (
                          <div
                            key={op.id || origIdx}
                            className="bg-bg-surface2 border-border-subtle flex items-center justify-between rounded-xl border p-4"
                          >
                            <div>
                              <Badge
                                className={cn(
                                  'mb-2 text-[8px]',
                                  op.status === 'success'
                                    ? 'bg-emerald-100 text-emerald-600'
                                    : op.status === 'warning'
                                      ? 'bg-amber-100 text-amber-600'
                                      : 'bg-border-subtle'
                                )}
                              >
                                {op.status}
                              </Badge>
                              <p className="text-[11px] font-bold">
                                {op.op || op.label || 'Операция'}
                              </p>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-[9px]"
                              onClick={() => handleToggleSfcConfirmation?.(origIdx)}
                            >
                              {op.confirmed ? 'Подтверждено' : 'Подтвердить'}
                            </Button>
                          </div>
                        );
                      })}
                    </div>
                  )
                );
              })()}
            </>
          )}
          {procurementView === 'requisition' && (
            <Card className="border-border-subtle overflow-hidden rounded-xl border border-none bg-white shadow-sm">
              <CardHeader className="flex flex-row justify-between">
                <CardTitle className="text-xs font-black uppercase">Заявки на материалы</CardTitle>
                <Button
                  size="sm"
                  className="text-[9px]"
                  onClick={() =>
                    setRequisitions?.((prev: any[]) => [
                      ...(prev || []),
                      {
                        id: `R-${Date.now()}`,
                        material: 'Новая заявка',
                        qty: 0,
                        unit: 'м',
                        status: 'Draft',
                        supplier: '—',
                        collection: selectedId || 'General',
                      },
                    ])
                  }
                >
                  <Plus className="mr-1 h-3.5 w-3.5" /> Добавить
                </Button>
              </CardHeader>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-[9px]">ID</TableHead>
                    <TableHead className="text-[9px]">Материал</TableHead>
                    <TableHead className="text-[9px]">Кол-во</TableHead>
                    <TableHead className="text-[9px]">Коллекция</TableHead>
                    <TableHead className="text-[9px]">Статус</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {(requisitions || [])
                    .filter((r: any) => !selectedId || r.collection === selectedId)
                    .map((r: any, i: number) => (
                      <TableRow key={r.id || i}>
                        <TableCell className="font-mono text-[10px]">{r.id}</TableCell>
                        <TableCell className="text-[10px]">{r.material}</TableCell>
                        <TableCell className="text-[10px]">
                          {r.qty} {r.unit}
                        </TableCell>
                        <TableCell className="text-[10px]">{r.collection}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="text-[8px]">
                            {r.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </Card>
          )}
          {procurementView === 'haberdashery' && (
            <Card className="border-border-subtle rounded-xl border border-none bg-white shadow-sm">
              <CardHeader>
                <CardTitle className="text-xs font-black uppercase">Фурнитура</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-text-secondary text-[10px]">
                  Реестр фурнитуры: пуговицы, молнии, нитки.
                </p>
                <SupplierMatrix />
              </CardContent>
            </Card>
          )}
          {procurementView === 'receipt' && <GRNPanel />}
          {(procurementView === 'po' ||
            procurementView === 'quotes' ||
            procurementView === 'subcontract') && (
            <Card className="border-border-subtle rounded-xl border border-none bg-white p-4 shadow-sm">
              <CardHeader>
                <CardTitle className="text-xs font-black uppercase">
                  {procurementView === 'po'
                    ? 'Заказы на материалы'
                    : procurementView === 'quotes'
                      ? 'Коммерческие предложения'
                      : 'Субподряд'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-text-secondary mb-3 text-[10px]">
                  {procurementView === 'po'
                    ? 'Заказы поставщикам на ткани и фурнитуру.'
                    : procurementView === 'quotes'
                      ? 'Сравнение КП от поставщиков.'
                      : 'Договоры субподряда на пошив, печать.'}
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-[9px]"
                  onClick={() => procurementView === 'po' && setActiveTab?.('orders')}
                >
                  {procurementView === 'po' ? 'Заказы (PO) →' : 'Перейти'}
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="costing" className={cabinetSurface.cabinetProfileTabPanel}>
          <SectionHeader title="Костинг" barColor="bg-amber-600" />
          <SectionInfoCard
            title="Костинг"
            description="Статьи затрат по категориям. Калькулятор себестоимости. Данные уходят в бюджет коллекции. Розничная цена от себестоимости и наценки. Связано с BOM и материалами."
            icon={Coins}
            iconBg="bg-amber-100"
            iconColor="text-amber-600"
            badges={
              <>
                <Badge variant="outline" className="text-[9px]">
                  Костинг → Бюджет
                </Badge>
              </>
            }
          />
          <ProductionCostBreakdown collectionId={selectedId} />
          <div className="flex gap-3">
            <Button variant="outline" size="sm" onClick={() => setIsCostingOpen?.(true)}>
              Калькулятор себестоимости
            </Button>
            <Button variant="ghost" size="sm" onClick={() => setActiveTab?.('budget')}>
              Бюджет →
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="execution" className={cabinetSurface.cabinetProfileTabPanel}>
          <SectionHeader title="Цех" barColor="bg-sky-600" />
          <SectionInfoCard
            title="Цех"
            description="Выполнение PO на фабриках. Загрузка по фабрикам, мониторинг и Digital Twin. Прогресс по заказам, отчёты с производства."
            icon={Factory}
            iconBg="bg-sky-100"
            iconColor="text-sky-600"
            badges={
              <>
                <Badge variant="outline" className="text-[9px]">
                  Загрузка фабрик
                </Badge>
              </>
            }
          />
          <FactoryLoadOverview
            data={[
              { factory: 'Global Textiles', week: '12–18.03', load: 85, poCount: 3 },
              { factory: 'Smart Tailor', week: '12–18.03', load: 60, poCount: 2 },
            ]}
          />
          <div className="bg-bg-surface2 border-border-default mb-4 flex w-fit rounded-2xl border p-1">
            <button
              type="button"
              onClick={() => setExecutionView?.('monitor')}
              className={cn(
                'rounded-xl px-4 py-2 text-[10px] font-bold uppercase transition-all',
                executionView === 'monitor'
                  ? 'text-accent-primary bg-white shadow-sm'
                  : 'text-text-secondary'
              )}
            >
              Мониторинг
            </button>
            <button
              type="button"
              onClick={() => setExecutionView?.('twin')}
              className={cn(
                'rounded-xl px-4 py-2 text-[10px] font-bold uppercase transition-all',
                executionView === 'twin'
                  ? 'text-accent-primary bg-white shadow-sm'
                  : 'text-text-secondary'
              )}
            >
              Digital Twin
            </button>
          </div>
          {executionView === 'monitor' ? (
            <DigitalProductionView collectionId={selectedId} />
          ) : (
            <ProductionDigitalTwin
              collectionId={
                selectedId || (selectedCollectionIds?.length ? selectedCollectionIds[0] : null)
              }
            />
          )}
          {selectedPoId && (
            <BatchComments batchId={selectedPoId} skuId={selectedSkuId || undefined} />
          )}
        </TabsContent>

        <TabsContent value="compliance" className={cabinetSurface.cabinetProfileTabPanel}>
          <SectionHeader title="Закон / QC" barColor="bg-emerald-600" />
          <SectionInfoCard
            title="Закон / QC"
            description="Маркировка, QC-отчёты, паспорта, сертификаты, эко и дефекты. QC привязан к PO. Маркировка — к артикулам и коллекциям. AQL-калькулятор, напоминания о сертификатах."
            icon={ShieldCheck}
            iconBg="bg-emerald-100"
            iconColor="text-emerald-600"
            badges={
              <>
                <Badge variant="outline" className="text-[9px]">
                  QC → PO
                </Badge>
                <Badge variant="outline" className="text-[9px]">
                  Маркировка
                </Badge>
              </>
            }
          />
          <div className="bg-bg-surface2 border-border-default mb-4 flex w-fit flex-wrap gap-1 rounded-2xl border p-1">
            {(['marking', 'qc', 'passport', 'certs', 'eco', 'defects'] as const).map((v) => (
              <button
                key={v}
                type="button"
                onClick={() => setComplianceView?.(v)}
                className={cn(
                  'rounded-xl px-4 py-2 text-[10px] font-bold uppercase transition-all',
                  complianceView === v
                    ? 'text-accent-primary bg-white shadow-sm'
                    : 'text-text-secondary'
                )}
              >
                {v === 'marking' && 'Маркировка'}
                {v === 'qc' && 'QC'}
                {v === 'passport' && 'Паспорт'}
                {v === 'certs' && 'Сертификаты'}
                {v === 'eco' && 'Эко-аудит'}
                {v === 'defects' && 'Дефекты'}
              </button>
            ))}
          </div>
          {complianceView === 'eco' && <SustainabilityAudit />}
          {complianceView === 'defects' && <DefectHeatmap />}
          {complianceView === 'qc' && (
            <div className="mb-4 grid grid-cols-1 gap-3 md:grid-cols-2">
              <AQLCalculator />
              <CertExpiryReminder />
            </div>
          )}
          {!['eco', 'defects', 'qc'].includes(complianceView || '') && (
            <Card className="border-border-subtle rounded-xl border border-none bg-white shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xs font-black uppercase">
                  <ShieldCheck className="h-4 w-4" /> Маркировка и соответствие
                </CardTitle>
              </CardHeader>
              <CardContent>
                <MarketplaceLabelStatus />
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-4"
                  onClick={() => setIsLabellingWizardOpen?.(true)}
                >
                  <QrCode className="mr-1 h-3.5 w-3.5" /> Маркировка
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="logistics" className={cabinetSurface.cabinetProfileTabPanel}>
          <SectionHeader title="Логистика" barColor="bg-blue-600" />
          <SectionInfoCard
            title="Логистика"
            description="Обслуживает PO: отгрузки, приёмки. Трекинг грузов, расписание приёмок. CMR, инвойсы, таможня. Связь с PO — что в пути, остатки на складе."
            icon={Truck}
            iconBg="bg-blue-100"
            iconColor="text-blue-600"
            badges={
              <>
                <Badge variant="outline" className="text-[9px]">
                  PO → отгрузки
                </Badge>
              </>
            }
          />
          <div className="mb-4 grid grid-cols-1 gap-3 md:grid-cols-2">
            <CargoTrackingCard trackId="TRK-2026-001" status="В пути" eta="15.03.2026" />
            <LogisticsCostCalc />
          </div>
          <div className="bg-bg-surface2 border-border-default mb-4 flex w-fit flex-wrap gap-1 rounded-2xl border p-1">
            {(['cargo', 'inbound', 'docs', 'customs', 'wms'] as const).map((v) => (
              <button
                key={v}
                type="button"
                onClick={() => setLogisticsView?.(v)}
                className={cn(
                  'rounded-xl px-4 py-2 text-[10px] font-bold uppercase transition-all',
                  logisticsView === v
                    ? 'text-accent-primary bg-white shadow-sm'
                    : 'text-text-secondary'
                )}
              >
                {v === 'cargo' && 'Груз'}
                {v === 'inbound' && 'Входящие'}
                {v === 'docs' && 'Документы'}
                {v === 'customs' && 'Таможня'}
                {v === 'wms' && 'WMS'}
              </button>
            ))}
          </div>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
            <Card className="border-border-subtle rounded-xl border border-none bg-white p-4 shadow-sm transition-all hover:shadow-md">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-100 text-sky-600">
                  <Truck className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-[11px] font-black uppercase">В пути (Карго)</p>
                  <p className="text-text-secondary text-[9px]">Отслеживание грузов</p>
                </div>
              </div>
            </Card>
            <Card className="border-border-subtle rounded-xl border border-none bg-white p-4 shadow-sm transition-all hover:shadow-md">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600">
                  <Package className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-[11px] font-black uppercase">Входящие поставки</p>
                  <p className="text-text-secondary text-[9px]">Приёмка на склад</p>
                </div>
              </div>
            </Card>
            <Card className="border-border-subtle rounded-xl border border-none bg-white p-4 shadow-sm transition-all hover:shadow-md">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100 text-amber-600">
                  <FileText className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-[11px] font-black uppercase">Документы</p>
                  <p className="text-text-secondary text-[9px]">CMR, инвойсы</p>
                </div>
              </div>
            </Card>
          </div>
          <Card className="border-border-subtle rounded-xl border border-none bg-white p-4 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xs font-black uppercase">
                <Truck className="h-4 w-4" /> Логистика
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-text-secondary text-[10px]">
                Модуль грузоперевозок, таможня, WMS. Выберите подраздел выше.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="warehouse" className={cabinetSurface.cabinetProfileTabPanel}>
          <SectionHeader title="Склад" barColor="bg-blue-600" />
          <SectionInfoCard
            title="Склад (WMS)"
            description="Остатки материалов и готовых изделий. Приёмки по PO, отгрузки. Связь с логистикой и снабжением. Интеграция с приёмкой (GRN)."
            icon={Package}
            iconBg="bg-blue-100"
            iconColor="text-blue-600"
            badges={
              <>
                <Badge variant="outline" className="text-[9px]">
                  Логистика
                </Badge>
                <Badge variant="outline" className="text-[9px]">
                  Приёмка
                </Badge>
              </>
            }
          />
          <Card className="border-border-subtle overflow-hidden rounded-2xl border shadow-sm">
            <CardHeader>
              <CardTitle className="text-xs font-black uppercase">Остатки по коллекциям</CardTitle>
              <CardDescription className="text-[10px]">Материалы и готовые изделия</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {(filteredMaterials || []).slice(0, 5).map((m: any, i: number) => (
                  <div
                    key={i}
                    className="bg-bg-surface2 flex items-center justify-between rounded-lg p-3"
                  >
                    <span className="text-[11px] font-medium">{m.name}</span>
                    <span className="text-text-secondary text-[10px]">
                      {m.length} · {m.status}
                    </span>
                  </div>
                ))}
              </div>
              <Button
                variant="outline"
                size="sm"
                className="mt-4 text-[9px]"
                onClick={() => setActiveTab?.('materials')}
              >
                Снабжение →
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="labeling" className={cabinetSurface.cabinetProfileTabPanel}>
          <SectionHeader title="Маркировка" barColor="bg-teal-600" />
          <SectionInfoCard
            title="Маркировка"
            description="КИЗ, этикетки, требования маркетплейсов. Маркировка привязана к артикулам. Статусы по партиям и PO."
            icon={QrCode}
            iconBg="bg-teal-100"
            iconColor="text-teal-600"
            badges={
              <>
                <Badge variant="outline" className="text-[9px]">
                  Артикулы, маркетплейсы
                </Badge>
              </>
            }
          />
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            <Card className="border-border-subtle rounded-xl border border-none bg-white p-4 shadow-sm transition-all hover:shadow-md">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-teal-100 text-teal-600">
                  <QrCode className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-[11px] font-black uppercase">Мастер маркировки</p>
                  <p className="text-text-secondary text-[9px]">Генерация КИЗ, этикеток</p>
                </div>
              </div>
              <Button
                className="mt-4 w-full"
                size="sm"
                onClick={() => setIsLabellingWizardOpen?.(true)}
              >
                <QrCode className="mr-2 h-4 w-4" /> Открыть
              </Button>
            </Card>
            <Card className="border-border-subtle rounded-xl border border-none bg-white p-4 shadow-sm">
              <MarketplaceLabelStatus />
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="budget" className={cabinetSurface.cabinetProfileTabPanel}>
          <SectionHeader title="Бюджет" barColor="bg-rose-600" />
          <SectionInfoCard
            title="Что такое бюджет коллекции"
            description="Бюджет задаётся при создании коллекции (Костинг → Бюджет) и разбивается на статьи: Материалы, Пошив, Логистика. Факт заполняется автоматически по PO, приёмкам, накладным. Остаток влияет на алерты при перерасходе и показывает, сколько можно ещё потратить."
            icon={Wallet}
            iconBg="bg-rose-100"
            iconColor="text-rose-600"
            badges={
              <>
                <Badge variant="outline" className="text-[9px]">
                  Источник: создание коллекции
                </Badge>
                <Badge variant="outline" className="text-[9px]">
                  Влияет: алерты, дашборд
                </Badge>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-7 text-[9px]"
                  onClick={() => setActiveTab?.('costing')}
                >
                  Редактировать план → Костинг
                </Button>
              </>
            }
          />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {(collectionBudgets || [])
              .filter((b: any) => !selectedId || b.collectionId === selectedId)
              .map((b: any) => {
                const coll = collections?.find((c: any) => c.id === b.collectionId);
                const remainder = (b.totalPlan || 0) - (b.totalFact || 0);
                const pct = b.totalPlan ? Math.round((b.totalFact / b.totalPlan) * 100) : 0;
                const isOver = remainder < 0;
                return (
                  <Card
                    key={b.collectionId}
                    className="border-border-subtle overflow-hidden rounded-2xl border shadow-sm transition-all hover:shadow-md"
                  >
                    <div
                      className={cn(
                        'h-1 w-full',
                        isOver
                          ? 'bg-rose-500'
                          : 'to-accent-primary bg-gradient-to-r from-emerald-500'
                      )}
                    />
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-black uppercase tracking-tight">
                        {coll?.name || b.collectionId}
                      </CardTitle>
                      <CardDescription className="mt-2 space-y-1 text-[11px]">
                        <span>План {(b.totalPlan / 1000).toFixed(0)}k ₽</span> ·{' '}
                        <span>Факт {(b.totalFact / 1000).toFixed(0)}k ₽</span>
                        <span
                          className={cn(
                            'mt-1 block font-bold',
                            remainder >= 0 ? 'text-emerald-600' : 'text-rose-600'
                          )}
                        >
                          Остаток: {(remainder / 1000).toFixed(0)}k ₽
                        </span>
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3 pt-0">
                      <BudgetCategoryBreakdown
                        categories={b.categories || []}
                        totalPlan={b.totalPlan}
                        totalFact={b.totalFact}
                      />
                      <Progress
                        value={Math.min(pct, 100)}
                        className={cn('h-2', isOver && '[&>div]:bg-rose-500')}
                        aria-label={`Бюджет «${coll?.name ?? b.collectionId}»: факт к плану ${Math.min(pct, 100)}%`}
                      />
                    </CardContent>
                  </Card>
                );
              })}
          </div>
        </TabsContent>

        <TabsContent value="finance" className={cabinetSurface.cabinetProfileTabPanel}>
          <SectionHeader title="Финансы" barColor="bg-emerald-600" />
          <SectionInfoCard
            title="Финансы"
            description="Платежи по PO, поступления, штрафы по фабрикам. Cash flow, план платежей, согласование. Привязка к PO и документам."
            icon={Wallet}
            iconBg="bg-emerald-100"
            iconColor="text-emerald-600"
            badges={
              <>
                <Badge variant="outline" className="text-[9px]">
                  Платежи → PO
                </Badge>
              </>
            }
          />
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <Card className="border-border-subtle overflow-hidden rounded-2xl border shadow-sm">
              <div className="h-1 w-full bg-gradient-to-r from-emerald-500 to-teal-500" />
              <CardContent className="p-5">
                <CashFlowSummary />
              </CardContent>
            </Card>
            <Card className="border-border-subtle overflow-hidden rounded-2xl border shadow-sm">
              <div className="from-accent-primary to-accent-primary h-1 w-full bg-gradient-to-r" />
              <CardHeader>
                <CardTitle className="text-xs font-black uppercase">Условия и штрафы</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <SupplierPenaltyTerms
                  factoryName={(filteredProductionOrders?.[0] as any)?.factory || 'Global Textiles'}
                />
              </CardContent>
            </Card>
          </div>
          <div className="bg-bg-surface2 border-border-default mb-4 flex w-fit flex-wrap gap-1 rounded-2xl border p-1.5">
            {(['schedule', 'terms', 'factoring'] as const).map((v) => (
              <button
                key={v}
                type="button"
                onClick={() => setFinanceView?.(v)}
                className={cn(
                  'rounded-xl px-4 py-2 text-[10px] font-bold uppercase transition-all',
                  financeView === v
                    ? 'text-accent-primary bg-white shadow-sm'
                    : 'text-text-secondary'
                )}
              >
                {v === 'schedule' && 'Платежи'}
                {v === 'terms' && 'Условия'}
                {v === 'factoring' && 'Факторинг'}
              </button>
            ))}
          </div>
          <FinancialCalendarPanel />
          {financeView === 'terms' && (
            <SupplierPenaltyTerms
              factoryName="Global Textiles"
              factoryId="F-01"
              onSave={() => handleAction?.('Условия сохранены', 'Штрафные санкции обновлены')}
            />
          )}
        </TabsContent>

        <TabsContent value="documents" className={cabinetSurface.cabinetProfileTabPanel}>
          <SectionHeader title="Документы" barColor="bg-text-secondary" />
          <SectionInfoCard
            title="Документы"
            description="ТЗ, контракты, инвойсы, QC-отчёты, CMR. Документы привязаны к коллекциям и PO. Статусы: черновик, на подписи, подписан."
            icon={FileText}
            iconBg="bg-bg-surface2"
            iconColor="text-text-secondary"
            badges={
              <>
                <Badge variant="outline" className="text-[9px]">
                  Коллекция, PO
                </Badge>
              </>
            }
          />
          <DocumentFilterBar
            filter={docFilter || 'all'}
            onFilter={(v) => setDocFilter?.(v)}
            types={['tz', 'contract', 'invoice', 'qc', 'cmr']}
          />
          <div className="mb-3 flex flex-wrap gap-2">
            <span className="text-text-muted self-center text-[9px] font-bold">Статус:</span>
            {['all', 'Утверждено', 'Подписан', 'Ожидает оплаты', 'PASSED', 'В пути'].map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => p.setDocStatusFilter?.(s)}
                className={cn(
                  'rounded-lg px-2.5 py-1 text-[9px] font-bold',
                  (p.docStatusFilter || 'all') === s
                    ? 'bg-accent-primary/15 text-accent-primary'
                    : 'text-text-secondary hover:bg-bg-surface2'
                )}
              >
                {s === 'all' ? 'Все' : s}
              </button>
            ))}
          </div>
          <div className="mb-3 flex justify-end">
            <Button
              variant="outline"
              size="sm"
              className="text-[9px]"
              onClick={() => {
                exportToCSV(
                  (productionDocuments || []).map((d: any) => ({
                    type: d.type,
                    name: d.name,
                    collection: d.collection,
                    status: d.status,
                  })),
                  [
                    { key: 'type', label: 'Тип' },
                    { key: 'name', label: 'Наименование' },
                    { key: 'collection', label: 'Коллекция' },
                    { key: 'status', label: 'Статус' },
                  ],
                  'production-documents'
                );
                handleAction?.('Экспорт', 'Документы экспортированы в CSV');
              }}
            >
              Экспорт CSV
            </Button>
          </div>
          <Card className="border-border-subtle overflow-hidden rounded-xl border border-none bg-white shadow-sm">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-[9px]">Тип</TableHead>
                  <TableHead className="text-[9px]">Наименование</TableHead>
                  <TableHead className="text-[9px]">Коллекция</TableHead>
                  <TableHead className="text-[9px]">Статус</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {(productionDocuments || [])
                  .filter(
                    (d: any) =>
                      (!docFilter || docFilter === 'all' || d.type === docFilter) &&
                      (!selectedId || d.collection === selectedId) &&
                      (!p.docStatusFilter ||
                        p.docStatusFilter === 'all' ||
                        d.status === p.docStatusFilter)
                  )
                  .map((d: any, i: number) => (
                    <TableRow key={i}>
                      <TableCell className="text-[10px]">{d.type}</TableCell>
                      <TableCell className="text-[10px]">{d.name}</TableCell>
                      <TableCell className="text-[10px]">{d.collection}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-[8px]">
                          {d.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>

        <TabsContent value="losses" className={cabinetSurface.cabinetProfileTabPanel}>
          <SectionHeader title="Потери" barColor="bg-rose-600" />
          <SectionInfoCard
            title="Потери"
            description="Материалы и готовые изделия: брак, перерасход, списание. Привязка к PO, артикулу, партии. Влияет на бюджет и отчётность."
            icon={TrendingUp}
            iconBg="bg-rose-100"
            iconColor="text-rose-600"
            badges={
              <>
                <Badge variant="outline" className="text-[9px]">
                  Брак, перерасход, списание
                </Badge>
              </>
            }
          />
          <div className="mb-3 flex flex-wrap gap-2">
            <span className="text-text-muted self-center text-[9px] font-bold">Тип:</span>
            {['all', 'material', 'model'].map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => p.setLossTypeFilter?.(f)}
                className={cn(
                  'rounded-lg px-3 py-1.5 text-[9px] font-bold uppercase transition-all',
                  (p.lossTypeFilter || 'all') === f
                    ? 'bg-rose-100 text-rose-600'
                    : 'text-text-secondary hover:bg-bg-surface2'
                )}
              >
                {f === 'all' ? 'Все' : f === 'material' ? 'Материалы' : 'Модели'}
              </button>
            ))}
            <span className="text-text-muted ml-2 self-center text-[9px] font-bold">
              Категория:
            </span>
            {['all', 'defect', 'overrun', 'writeoff'].map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => p.setLossCategoryFilter?.(f)}
                className={cn(
                  'rounded-lg px-3 py-1.5 text-[9px] font-bold uppercase transition-all',
                  (p.lossCategoryFilter || 'all') === f
                    ? 'bg-rose-100 text-rose-600'
                    : 'text-text-secondary hover:bg-bg-surface2'
                )}
              >
                {f === 'all'
                  ? 'Все'
                  : f === 'defect'
                    ? 'Брак'
                    : f === 'overrun'
                      ? 'Перерасход'
                      : 'Списание'}
              </button>
            ))}
          </div>
          <Card className="border-border-subtle overflow-hidden rounded-2xl border shadow-sm">
            <div className="h-1 w-full bg-gradient-to-r from-rose-500 to-amber-500" />
            <CardHeader className="flex flex-row items-center justify-between pb-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-100 text-rose-600">
                  <TrendingUp className="h-5 w-5" />
                </div>
                <div>
                  <CardTitle className="text-sm font-black uppercase">Реестр потерь</CardTitle>
                  <CardDescription className="text-[10px]">
                    Материалы, готовые изделия — брак, перерасход, списание
                  </CardDescription>
                </div>
              </div>
              <Button
                size="sm"
                className="h-9 rounded-xl text-[9px] font-bold"
                onClick={() => handleAddLoss?.()}
              >
                <Plus className="mr-1 h-4 w-4" /> Добавить
              </Button>
            </CardHeader>
            <CardContent className="pt-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-[9px]">Тип</TableHead>
                    <TableHead className="text-[9px]">Наименование</TableHead>
                    <TableHead className="text-[9px]">Коллекция</TableHead>
                    <TableHead className="text-[9px]">Стоимость</TableHead>
                    <TableHead className="text-[9px]">Причина</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {(filteredLosses || [])
                    .filter(
                      (l: any) =>
                        (!p.lossTypeFilter ||
                          p.lossTypeFilter === 'all' ||
                          l.type === p.lossTypeFilter) &&
                        (!p.lossCategoryFilter ||
                          p.lossCategoryFilter === 'all' ||
                          l.category === p.lossCategoryFilter)
                    )
                    .map((l: any, i: number) => (
                      <TableRow
                        key={i}
                        className="hover:bg-bg-surface2/80 cursor-pointer"
                        onClick={() =>
                          l.collection &&
                          (toggleCollectionSelection?.(l.collection),
                          setActiveTab?.(l.type === 'model' ? 'plm' : 'materials'))
                        }
                      >
                        <TableCell className="text-[10px]">
                          <div className="flex flex-col gap-0.5">
                            <Badge variant="outline" className="w-fit text-[8px]">
                              {l.type === 'material' ? 'Материал' : 'Модель'}
                            </Badge>
                            {l.category && (
                              <span className="text-text-muted text-[8px]">
                                {l.category === 'defect'
                                  ? 'Брак'
                                  : l.category === 'overrun'
                                    ? 'Перерасход'
                                    : l.category === 'writeoff'
                                      ? 'Списание'
                                      : l.category}
                              </span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="text-[10px]">{l.item}</TableCell>
                        <TableCell className="text-[10px]">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              l.collection &&
                                (toggleCollectionSelection?.(l.collection), setActiveTab?.('plm'));
                            }}
                            className="text-accent-primary font-medium hover:underline"
                          >
                            {l.collection || '—'}
                          </button>
                        </TableCell>
                        <TableCell className="text-[10px]">{l.cost}</TableCell>
                        <TableCell className="text-[10px]">{l.reason}</TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="factories" className={cabinetSurface.cabinetProfileTabPanel}>
          <SectionHeader title="Фабрики" barColor="bg-accent-primary" />
          <SectionInfoCard
            title="Фабрики"
            description="Реестр фабрик: контакты, мощность, специализация. KPI: качество, сроки, коммуникация. История PO, калькулятор себестоимости по фабрике."
            icon={Factory}
            iconBg="bg-accent-primary/15"
            iconColor="text-accent-primary"
            badges={
              <>
                <Badge variant="outline" className="text-[9px]">
                  PO, сэмплы
                </Badge>
              </>
            }
          />
          <Card className="border-border-subtle overflow-hidden rounded-2xl border shadow-sm">
            <div className="from-accent-primary h-1 w-full bg-gradient-to-r to-blue-500" />
            <CardContent className="p-5">
              <FactoryLoadOverview />
            </CardContent>
          </Card>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                name: 'Global Textiles',
                type: 'Пошив',
                status: 'Active',
                qty: '3 PO',
                rating: 4.8,
                quality: 98,
                delivery: 95,
                contact: 'manager@globaltextiles.com',
              },
              {
                name: 'Smart Tailor Lab',
                type: 'CMT',
                status: 'Active',
                qty: '2 PO',
                rating: 4.5,
                quality: 92,
                delivery: 88,
                contact: 'orders@smarttailor.ru',
              },
              {
                name: 'YKK Russia',
                type: 'Фурнитура',
                status: 'Partner',
                qty: '—',
                rating: 4.9,
                contact: 'sales@ykk.ru',
              },
            ].map((f, i) => (
              <Card
                key={i}
                className="border-border-subtle overflow-hidden rounded-2xl border shadow-sm transition-all hover:shadow-md"
              >
                <div className="bg-bg-surface2 h-0.5 w-full" />
                <CardContent className="p-5">
                  <FactoryRatingCard
                    name={f.name}
                    rating={f.rating}
                    quality={f.quality}
                    delivery={f.delivery}
                    contact={f.contact}
                  />
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="handbooks" className={cabinetSurface.cabinetProfileTabPanel}>
          <SectionHeader title="Справочники (Партнёры)" barColor="bg-accent-primary" />
          <SectionInfoCard
            title="Партнёры и справочники"
            description="Категории товаров, поставщики, размеры, материалы, фурнитура, коллаборации. Категории — для артикулов, поставщики — для снабжения."
            icon={BookOpen}
            iconBg="bg-accent-primary/15"
            iconColor="text-accent-primary"
            badges={
              <>
                <Badge variant="outline" className="text-[9px]">
                  Категории → артикулы
                </Badge>
              </>
            }
          />
          <Card className="border-border-subtle overflow-hidden rounded-2xl border p-5 shadow-sm">
            <div className="mb-4 flex items-center gap-4">
              <div className="bg-accent-primary/15 text-accent-primary flex h-12 w-12 items-center justify-center rounded-xl">
                <BookOpen className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-sm font-black uppercase">Партнёры и справочники</h3>
                <p className="text-text-secondary text-[11px]">
                  Категории, размеры, материалы, поставщики, коллаборации
                </p>
              </div>
            </div>
            <div className="bg-bg-surface2 border-border-default mb-4 flex w-fit flex-wrap gap-1 rounded-2xl border p-1.5">
              {(['categories', 'suppliers', 'collabs', 'sizes'] as const).map((v) => (
                <button
                  key={v}
                  type="button"
                  onClick={() => setHandbookView?.(v)}
                  className={cn(
                    'rounded-xl px-4 py-2 text-[10px] font-bold uppercase transition-all',
                    handbookView === v
                      ? 'text-accent-primary bg-white shadow-sm'
                      : 'text-text-secondary'
                  )}
                >
                  {v === 'categories' && 'Категории'}
                  {v === 'suppliers' && 'Поставщики'}
                  {v === 'collabs' && 'Коллаборации'}
                  {v === 'sizes' && 'Размеры'}
                </button>
              ))}
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <Card className="border-border-subtle rounded-2xl border p-5 transition-all hover:shadow-md">
                <div className="flex items-center gap-3">
                  <div className="bg-accent-primary/15 text-accent-primary flex h-12 w-12 items-center justify-center rounded-xl">
                    <BookOpen className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-[12px] font-black uppercase">Категории</p>
                    <p className="text-text-secondary text-[10px]">
                      {CATEGORY_HANDBOOK?.length || 0} категорий
                    </p>
                  </div>
                </div>
              </Card>
              <Card className="border-border-subtle rounded-2xl border p-5 transition-all hover:shadow-md">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600">
                    <Users className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-[12px] font-black uppercase">Поставщики</p>
                    <p className="text-text-secondary text-[10px]">Реестр партнёров</p>
                  </div>
                </div>
              </Card>
            </div>
            {handbookView === 'collabs' && <CollaborationProjects brandId="brand-syntha" />}
          </Card>
        </TabsContent>

        <TabsContent value="audit" className={cabinetSurface.cabinetProfileTabPanel}>
          <SectionHeader title="Аудит" barColor="bg-text-secondary" />
          <SectionInfoCard
            title="Аудит"
            description="Журнал изменений: BOM, сэмплы, PO, статусы. Кто и когда изменил. Детали: было/стало. Фильтр по типу, дате, пользователю."
            icon={History}
            iconBg="bg-bg-surface2"
            iconColor="text-text-secondary"
            badges={
              <>
                <Badge variant="outline" className="text-[9px]">
                  BOM, sample, po, status
                </Badge>
              </>
            }
          />
          <Card className="border-border-subtle overflow-hidden rounded-2xl border shadow-sm">
            <div className="from-text-secondary to-bg-surface2 h-1 w-full bg-gradient-to-r" />
            <CardHeader className="pb-4">
              <div className="flex items-center gap-3">
                <div className="bg-bg-surface2 text-text-secondary flex h-10 w-10 items-center justify-center rounded-xl">
                  <History className="h-5 w-5" />
                </div>
                <div>
                  <CardTitle className="text-sm font-black uppercase">Журнал изменений</CardTitle>
                  <CardDescription className="text-[10px]">
                    BOM, сэмплы, PO, статусы — кто и когда изменил
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
                <div className="flex gap-2">
                  {(['all', 'bom', 'sample', 'po', 'status'] as const).map((v) => (
                    <button
                      key={v}
                      type="button"
                      onClick={() => setAuditFilter?.(v)}
                      className={cn(
                        'rounded-xl px-4 py-2 text-[9px] font-bold uppercase transition-all',
                        auditFilter === v
                          ? 'bg-accent-primary/15 text-accent-primary'
                          : 'text-text-secondary hover:bg-bg-surface2'
                      )}
                    >
                      {v === 'all' ? 'Все' : v}
                    </button>
                  ))}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 gap-1 text-[9px]"
                  onClick={() => {
                    exportToCSV(
                      (filteredAuditLog || []).map((a: any) => ({
                        actionLabel: a.actionLabel,
                        entity: a.entity,
                        user: a.user,
                        time: a.time,
                        detail: a.detail,
                      })),
                      [
                        { key: 'actionLabel', label: 'Действие' },
                        { key: 'entity', label: 'Сущность' },
                        { key: 'user', label: 'Пользователь' },
                        { key: 'time', label: 'Время' },
                        { key: 'detail', label: 'Детали' },
                      ],
                      'audit-log'
                    );
                    handleAction?.('Экспорт', 'Журнал аудита экспортирован');
                  }}
                >
                  <Download className="h-3.5 w-3.5" /> Экспорт
                </Button>
              </div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-[9px]">Действие</TableHead>
                    <TableHead className="text-[9px]">Сущность</TableHead>
                    <TableHead className="text-[9px]">Пользователь</TableHead>
                    <TableHead className="text-[9px]">Время</TableHead>
                    <TableHead className="w-12 text-[9px]">Детали</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {(filteredAuditLog || []).map((a: any) => (
                    <AuditRowWithDetail
                      key={a.id}
                      actionLabel={a.actionLabel}
                      entity={a.entity}
                      user={a.user}
                      time={a.time}
                      detail={a.detail || a.payload || a.comment}
                    />
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sla" className={cabinetSurface.cabinetProfileTabPanel}>
          <SectionHeader title="SLA по сэмплам" barColor="bg-amber-600" />
          <SectionInfoCard
            title="SLA"
            description="Сроки по этапам сэмплов: Proto, PP, Size Set. Оставшееся время до дедлайна. Уведомления при риске просрочки. Сводка просрочек, редактирование дедлайнов."
            icon={Timer}
            iconBg="bg-amber-100"
            iconColor="text-amber-600"
            badges={
              <>
                <Badge variant="outline" className="text-[9px]">
                  Сэмплы
                </Badge>
              </>
            }
          />
          {(() => {
            const overdue = (filteredSlaSamples || []).filter((s: any) => s.slaOverdue);
            return (
              overdue.length > 0 && (
                <Card className="rounded-xl border border-amber-200 bg-amber-50/50">
                  <CardContent className="pt-4">
                    <div className="flex items-center gap-2 text-amber-800">
                      <AlertCircle className="h-5 w-5 shrink-0" />
                      <p className="text-[11px] font-bold">
                        {overdue.length} сэмпл
                        {overdue.length === 1
                          ? ''
                          : overdue.length < 5
                            ? 'а'
                            : 'ов'} просрочено:{' '}
                        {overdue
                          .slice(0, 3)
                          .map((s: any) => s.skuName)
                          .join(', ')}
                        {overdue.length > 3 ? ` +${overdue.length - 3}` : ''}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )
            );
          })()}
          <Card className="border-border-subtle overflow-hidden rounded-2xl border shadow-sm">
            <div className="h-1 w-full bg-gradient-to-r from-amber-500 to-rose-500" />
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100 text-amber-600">
                  <Timer className="h-5 w-5" />
                </div>
                <div>
                  <CardTitle className="text-sm font-black uppercase">
                    Сроки по этапам сэмплов
                  </CardTitle>
                  <CardDescription className="text-[10px]">
                    Просрочки дедлайнов Proto, PP, Size Set — алерты и напоминания
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-[9px]">SKU</TableHead>
                    <TableHead className="text-[9px]">Этап</TableHead>
                    <TableHead className="text-[9px]">Дедлайн</TableHead>
                    <TableHead className="text-[9px]">Просрочка</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {(filteredSlaSamples || []).map((s: any) => (
                    <TableRow key={s.skuId}>
                      <TableCell className="text-[10px]">{s.skuName}</TableCell>
                      <TableCell className="text-[10px]">
                        {STAGE_LABELS[s.stage] || s.stageLabel}
                      </TableCell>
                      <TableCell className="text-[10px]">
                        <SLACountdown dueDate={s.dueDate} overdue={s.slaOverdue} />
                      </TableCell>
                      <TableCell>
                        {s.slaOverdue ? (
                          <Badge variant="destructive" className="text-[8px]">
                            Просрочено
                          </Badge>
                        ) : (
                          <span className="text-text-secondary text-[10px]">В срок</span>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="calendar" className={cabinetSurface.cabinetProfileTabPanel}>
          <SectionHeader title="Календарь" barColor="bg-sky-600" />
          {/* Таблица Ганта */}
          <ProductionGantt
            selectedCollectionIds={selectedCollectionIds || []}
            onPeriodChange={() => {}}
            onNavigate={(tab) => setActiveTab?.(tab)}
          />
          {/* Pipeline этапов */}
          <Card className="border-border-subtle rounded-xl border border-none bg-white p-4 shadow-sm">
            <CardHeader className="p-0 pb-3">
              <CardTitle className="text-[11px] font-black uppercase">Этапы и дедлайны</CardTitle>
              <CardDescription className="text-[10px]">
                Дизайн → Тех-пак → Сэмпл → Утверждение → PO → Снабжение → Цех → QC → Отгрузка
              </CardDescription>
            </CardHeader>
            <div className="flex flex-wrap gap-2">
              {[
                'Дизайн',
                'Тех-пак',
                'Сэмпл',
                'Утверждение',
                'PO',
                'Снабжение',
                'Цех',
                'QC',
                'Маркировка',
                'Отгрузка',
                'Склад',
              ].map((stage, i) => (
                <button
                  key={stage}
                  type="button"
                  onClick={() =>
                    stage === 'Сэмпл'
                      ? setActiveTab?.('samples')
                      : stage === 'PO'
                        ? setActiveTab?.('orders')
                        : stage === 'Снабжение'
                          ? setActiveTab?.('materials')
                          : stage === 'Цех'
                            ? setActiveTab?.('execution')
                            : stage === 'QC'
                              ? setActiveTab?.('compliance')
                              : undefined
                  }
                  className={cn(
                    'rounded-lg px-3 py-1.5 text-[9px] font-bold uppercase transition-all',
                    ['Сэмпл', 'PO', 'Цех'].includes(stage)
                      ? 'bg-accent-primary/15 text-accent-primary border-accent-primary/30 border'
                      : 'bg-bg-surface2 text-text-secondary border-border-subtle border'
                  )}
                >
                  {stage}
                </button>
              ))}
            </div>
          </Card>
          {/* Блоки действий и события */}
          <Card className="border-border-subtle rounded-xl border border-none bg-white shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-black uppercase tracking-tight">
                События и дедлайны
              </CardTitle>
              <CardDescription className="text-text-secondary text-[10px]">
                Календарь с блоками действий
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {(filteredEvents || []).length === 0 ? (
                  <p className="text-text-muted py-8 text-center text-[10px]">
                    Нет запланированных событий. Выберите коллекцию для фильтрации.
                  </p>
                ) : (
                  (filteredEvents || []).slice(0, 15).map((ev: any) => {
                    const dateStr = ev.date
                      ? typeof ev.date === 'string' && ev.date.length >= 10
                        ? ev.date.slice(0, 10)
                        : ev.date
                      : ev.time || '—';
                    const typeLabel =
                      ev.type === 'logistics'
                        ? 'Логистика'
                        : ev.type === 'milestone'
                          ? 'Этап'
                          : ev.type === 'finance'
                            ? 'Финансы'
                            : ev.type || 'Событие';
                    return (
                      <div
                        key={ev.id}
                        className="border-border-subtle bg-bg-surface2/80 hover:border-accent-primary/20 flex flex-col gap-3 rounded-xl border p-4 transition-all hover:bg-white sm:flex-row sm:items-center sm:justify-between"
                      >
                        <div className="min-w-0 flex-1">
                          <span className="text-text-primary block text-[11px] font-bold">
                            {ev.title}
                          </span>
                          {ev.description && (
                            <span className="text-text-secondary mt-0.5 block text-[10px]">
                              {ev.description}
                            </span>
                          )}
                          {ev.responsible && (
                            <span className="text-text-muted mt-1 block text-[9px]">
                              Ответственный: {ev.responsible}
                            </span>
                          )}
                        </div>
                        <div className="flex shrink-0 flex-wrap items-center gap-2">
                          <Badge
                            variant="outline"
                            className="border-border-default text-text-secondary text-[8px] font-bold uppercase"
                          >
                            {typeLabel}
                          </Badge>
                          <span className="text-text-secondary text-[10px] font-medium tabular-nums">
                            {dateStr}
                          </span>
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-7 text-[9px]"
                            onClick={() =>
                              setActiveTab?.(
                                ev.type === 'logistics'
                                  ? 'logistics'
                                  : ev.type === 'finance'
                                    ? 'finance'
                                    : 'samples'
                              )
                            }
                          >
                            Действие
                          </Button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="notifications" className={cabinetSurface.cabinetProfileTabPanel}>
          <SectionHeader title="Уведомления" barColor="bg-rose-600" />
          <Card className="border-border-subtle rounded-xl border border-none bg-white shadow-sm">
            <CardHeader>
              <CardTitle className="text-xs font-black uppercase">Уведомления</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {(notificationsList || []).map((n: any) => (
                  <div
                    key={n.id}
                    className={cn(
                      'rounded-lg border p-3',
                      !n.read && 'bg-accent-primary/10 border-accent-primary/20'
                    )}
                  >
                    <p className="text-[10px] font-medium">{n.title}</p>
                    <p className="text-text-secondary text-[9px]">{n.time}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="reports" className={cabinetSurface.cabinetProfileTabPanel}>
          <SectionHeader title="Отчёты и аналитика" barColor="bg-accent-primary" />
          <SectionInfoCard
            title="Отчёты"
            description="Сводные отчёты: динамика SKU, бюджет, загрузка фабрик. KPI по коллекциям. Экспорт в CSV. Связь с дашбордом и данными разделов."
            icon={FileSpreadsheet}
            iconBg="bg-accent-primary/15"
            iconColor="text-accent-primary"
            badges={
              <>
                <Badge variant="outline" className="text-[9px]">
                  Дашборд
                </Badge>
                <Badge variant="outline" className="text-[9px]">
                  Экспорт
                </Badge>
              </>
            }
          />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Card className="border-border-subtle rounded-2xl border p-4">
              <CardHeader className="p-0 pb-2">
                <CardTitle className="text-xs font-black">SKU по коллекциям</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <p className="text-2xl font-black">{(filteredSkus || []).length}</p>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-2 text-[9px]"
                  onClick={() => {
                    exportToCSV(
                      (filteredSkus || []).map((s: any) => ({
                        id: s.id,
                        name: s.name,
                        collection: s.collection,
                      })),
                      [
                        { key: 'id', label: 'ID' },
                        { key: 'name', label: 'Название' },
                        { key: 'collection', label: 'Коллекция' },
                      ],
                      'skus'
                    );
                    handleAction?.('Экспорт', 'SKU экспортированы');
                  }}
                >
                  Экспорт CSV
                </Button>
              </CardContent>
            </Card>
            <Card className="border-border-subtle rounded-2xl border p-4">
              <CardHeader className="p-0 pb-2">
                <CardTitle className="text-xs font-black">Заказы (PO)</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <p className="text-2xl font-black">{(filteredProductionOrders || []).length}</p>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-2 text-[9px]"
                  onClick={() => setActiveTab?.('orders')}
                >
                  К заказам →
                </Button>
              </CardContent>
            </Card>
            <Card className="border-border-subtle rounded-2xl border p-4">
              <CardHeader className="p-0 pb-2">
                <CardTitle className="text-xs font-black">Сэмплы на проверку</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <p className="text-2xl font-black">{samplePendingCount ?? 0}</p>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-2 text-[9px]"
                  onClick={() => setActiveTab?.('samples')}
                >
                  К сэмплам →
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="archive" className={cabinetSurface.cabinetProfileTabPanel}>
          <SectionHeader title="Архив" barColor="bg-text-primary" />
          <SectionInfoCard
            title="Архив"
            description="Завершённые коллекции, PO, документы. Поиск и фильтры. Восстановление из архива для редактирования или повторного использования."
            icon={FolderArchive}
            iconBg="bg-bg-surface2"
            iconColor="text-text-secondary"
            badges={
              <>
                <Badge variant="outline" className="text-[9px]">
                  Поиск
                </Badge>
                <Badge variant="outline" className="text-[9px]">
                  Восстановление
                </Badge>
              </>
            }
          />
          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="relative flex-1">
              <Search className="text-text-muted absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2" />
              <Input
                placeholder="Поиск по архиву (коллекции, артикулы, документы)..."
                value={p.archiveSearchQuery || ''}
                onChange={(e) => p.setArchiveSearchQuery?.(e.target.value)}
                className="h-10 rounded-xl pl-9 text-[10px]"
              />
            </div>
            <Button
              variant="outline"
              size="sm"
              className="h-10 text-[9px]"
              onClick={() =>
                handleAction?.('Восстановление', 'Выберите элемент в архиве для восстановления')
              }
            >
              Восстановить из архива
            </Button>
          </div>
          <Card className="border-border-subtle overflow-hidden rounded-2xl border shadow-sm">
            <div className="from-text-primary/80 to-text-primary h-1 w-full bg-gradient-to-r" />
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="bg-bg-surface2 text-text-secondary flex h-10 w-10 items-center justify-center rounded-xl">
                  <FolderArchive className="h-5 w-5" />
                </div>
                <div>
                  <CardTitle className="text-sm font-black uppercase">Архив производства</CardTitle>
                  <CardDescription className="text-[10px]">
                    Документы, PO, сэмплы завершённых коллекций
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <ProductionArchiveHub
                sku={{
                  id: 'archive',
                  name: 'Архив производственных документов',
                  sku: 'ARCHIVE',
                  factory: '—',
                  brand: 'Syntha',
                }}
                userRole={
                  (prodRole === 'manufacturer'
                    ? 'manufacturer'
                    : prodRole === 'admin'
                      ? 'admin'
                      : 'brand') as 'admin' | 'brand' | 'manufacturer'
                }
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Reject Sample Dialog */}
      <Dialog
        open={!!rejectSample}
        onOpenChange={(o) => {
          if (!o) {
            setRejectSample?.(null);
            setRejectReason?.('');
            setRejectCommentCustom?.('');
          }
        }}
      >
        <DialogContent className="overflow-hidden rounded-2xl border-none p-0 shadow-xl sm:max-w-[400px]">
          <DialogHeader className="bg-text-primary p-6 text-white">
            <DialogTitle className="text-lg font-black uppercase">Отклонить сэмпл</DialogTitle>
            <DialogDescription className="text-text-muted text-[10px]">
              Укажите причину отклонения для {rejectSample?.skuName}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 p-6">
            <div>
              <label className="text-text-secondary text-[10px] font-bold uppercase">Причина</label>
              <Select onValueChange={(v) => setRejectReason?.(v)} value={rejectReason}>
                <SelectTrigger className="mt-1 h-9 text-[10px]">
                  <SelectValue placeholder="Выберите" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Прочее" className="text-[10px]">
                    Прочее
                  </SelectItem>
                  <SelectItem value="Несоответствие тех-пака" className="text-[10px]">
                    Несоответствие тех-пака
                  </SelectItem>
                  <SelectItem value="Качество образца" className="text-[10px]">
                    Качество образца
                  </SelectItem>
                  <SelectItem value="Сроки нарушены" className="text-[10px]">
                    Сроки нарушены
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            {rejectReason === 'Прочее' && (
              <div>
                <label className="text-text-secondary text-[10px] font-bold uppercase">
                  Комментарий
                </label>
                <Input
                  value={rejectCommentCustom || ''}
                  onChange={(e) => setRejectCommentCustom?.(e.target.value)}
                  placeholder="Укажите причину..."
                  className="mt-1 h-9 text-[10px]"
                />
              </div>
            )}
          </div>
          <DialogFooter className="bg-bg-surface2 border-border-subtle flex justify-end gap-2 border-t p-6">
            <Button
              variant="outline"
              onClick={() => {
                setRejectSample?.(null);
                setRejectReason?.('');
                setRejectCommentCustom?.('');
              }}
            >
              Отмена
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                if (rejectSample) {
                  const reason =
                    rejectReason === 'Прочее'
                      ? rejectCommentCustom || 'Прочее'
                      : rejectReason || 'Причина не указана';
                  setSampleStatuses?.((prev: any[]) =>
                    prev.map((x: any) =>
                      x.skuId === rejectSample.skuId ? { ...x, status: 'rejected' } : x
                    )
                  );
                  handleAction?.('Сэмпл отклонён', `${rejectSample.skuName}: ${reason}`);
                  setRejectSample?.(null);
                  setRejectReason?.('');
                  setRejectCommentCustom?.('');
                }
              }}
            >
              Подтвердить
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialogs */}
      <SkuCreateWizard
        open={!!isSkuWizardOpen}
        onOpenChange={(open) => setIsSkuWizardOpen?.(open)}
        collectionId={selectedId || 'General'}
        collectionName={collections?.find((c: any) => c.id === selectedId)?.name}
        onCreated={handleSkuCreated}
      />
      <CollectionCreateWizard
        open={!!isCreatingCollection}
        onOpenChange={(open) => setIsCreatingCollection?.(!open)}
        onCreated={handleCollectionCreated}
        existingCollections={collections?.map((c: any) => ({ id: c.id, name: c.name })) || []}
        allSkus={(p.skus || []).map((s: any) => ({
          id: s.id,
          name: s.name,
          collection: s.collection,
        }))}
        duplicateFrom={p.duplicateFromCollection}
      />
      <AutoPOWizard isOpen={!!isAutoPOOpen} onOpenChange={(open) => setIsAutoPOOpen?.(open)} />
      <LabellingWizard
        isOpen={!!isLabellingWizardOpen}
        onOpenChange={(open) => setIsLabellingWizardOpen?.(open)}
      />
      <MaterialHandoverAct
        isOpen={!!isHandoverActOpen}
        onOpenChange={(open) => setIsHandoverActOpen?.(open)}
      />
      <CostingCalculator
        isOpen={!!isCostingOpen}
        onOpenChange={(open) => setIsCostingOpen?.(open)}
      />
      <FittingLog
        isOpen={!!isFittingLogOpen}
        onOpenChange={(open) => setIsFittingLogOpen?.(open)}
      />
      <MaterialMarketplace
        isOpen={!!isMarketplaceOpen}
        onOpenChange={(open) => setIsMarketplaceOpen?.(open)}
        initialQuery=""
      />
      {isArchiveOpen && (
        <Dialog open={!!isArchiveOpen} onOpenChange={(open) => setIsArchiveOpen?.(open)}>
          <DialogContent className="max-h-[90vh] max-w-4xl overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Архив</DialogTitle>
            </DialogHeader>
            <ProductionArchiveHub
              sku={{ id: 'archive', name: 'Архив', sku: 'ARCHIVE', factory: '—', brand: 'Syntha' }}
              userRole={
                (prodRole === 'manufacturer'
                  ? 'manufacturer'
                  : prodRole === 'admin'
                    ? 'admin'
                    : 'brand') as 'admin' | 'brand' | 'manufacturer'
              }
            />
          </DialogContent>
        </Dialog>
      )}
      <RelatedModulesBlock links={getProductionLinks()} className="mt-6" />
    </div>
  );
}

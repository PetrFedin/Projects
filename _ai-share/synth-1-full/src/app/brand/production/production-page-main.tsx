'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
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
import { CabinetPageContent } from '@/components/layout/cabinet-page-content';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  CATEGORY_HANDBOOK,
  GLOBAL_ATTRIBUTES,
  type Audience,
  type CategoryNode,
  type CategoryAttribute,
} from '@/lib/data/category-handbook';
import {
  PRODUCTION_PARAMS_BY_CATEGORY,
  getProductionParamsByCategory,
} from '@/lib/data/production-params';
import {
  Factory,
  Settings2,
  Truck,
  Package,
  Calendar,
  AlertCircle,
  Search,
  Filter,
  ChevronRight,
  GanttChart,
  FileText,
  Clock,
  ArrowUpRight,
  UserCheck,
  CheckCircle2,
  QrCode,
  Layers,
  Coins,
  ShieldCheck,
  Database,
  ArrowRightLeft,
  Timer,
  Scissors,
  FileSearch,
  Zap,
  FileCheck,
  Globe,
  Wallet,
  Info,
  Plus,
  TrendingUp,
  Activity,
  Users,
  MessageSquare,
  History,
  Barcode,
  Archive,
  ArrowRight,
  Download,
  AlertTriangle,
  Printer,
  Scale,
  Box,
  Hash,
  Ruler,
  Camera,
  MapPin,
  ClipboardCheck,
  CreditCard,
  ExternalLink,
  Store,
  Calculator,
  Gavel,
  User,
  Cpu,
  Video,
  Play,
  Pause,
  PlusCircle,
  Link as LinkIcon,
  FolderArchive,
  Leaf,
  MoreHorizontal,
  Trash2,
  Settings,
  MoreVertical,
  ChevronDown,
  Upload,
  Edit,
  LayoutGrid,
  List,
  Sparkles,
  Save,
  Copy,
  RefreshCw,
  Handshake,
  Landmark,
  Briefcase,
  ShieldAlert,
  BadgePercent,
  ArrowLeft,
  PenTool,
  RotateCcw,
  Move,
  Bell,
  FileSpreadsheet,
  Tag,
  PackageCheck,
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { motion, AnimatePresence } from 'framer-motion';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { useSearchParams, useRouter } from 'next/navigation';
import { useAuth } from '@/providers/auth-provider';
import {
  getProductionRole,
  PRODUCTION_PERMISSIONS,
  type ProductionRole,
} from '@/lib/production-permissions';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { exportToCSV, exportToPDF } from '@/lib/production-export-utils';
import { getDrops } from '@/lib/collections-api';

import { CollectionCreateWizard } from '@/components/brand/production/CollectionCreateWizard';
import { LabellingWizard } from '@/components/brand/LabellingWizard';
import { MaterialHandoverAct } from '@/components/brand/MaterialHandoverAct';
import { SupplierMatrix } from '@/components/brand/SupplierMatrix';
import { CostingCalculator } from '@/components/brand/CostingCalculator';
import { FittingLog } from '@/components/brand/FittingLog';
import { ProductionGantt } from '@/components/brand/ProductionGantt';
import { SustainabilityAudit } from '@/components/brand/SustainabilityAudit';
import { PatternVersionControl } from '@/components/brand/PatternVersionControl';
import { DefectHeatmap } from '@/components/brand/DefectHeatmap';
import { AutoPOWizard } from '@/components/brand/AutoPOWizard';
import { ApprovalWorkflow } from '@/components/brand/ApprovalWorkflow';
import { FabricLabTests } from '@/components/brand/FabricLabTests';
import { MaterialMarketplace } from '@/components/brand/MaterialMarketplace';
import { ProductionDigitalTwin } from '@/components/brand/ProductionDigitalTwin';
import { DigitalProductionView } from '@/components/brand/digital-production-view';
import { ProductionExtendedPanel } from '@/components/brand/production/ProductionExtendedPanel';
import { ProductionCommandCenter } from '@/components/brand/production/ProductionCommandCenter';
import { FinancialCalendarPanel } from '@/components/brand/production/FinancialCalendarPanel';
import { GRNPanel } from '@/components/brand/production/GRNPanel';
import { BatchComments } from '@/components/brand/production/BatchComments';
import { ProductionContextBar } from '@/components/brand/production/ProductionContextBar';
import { ProductionCostBreakdown } from '@/components/brand/production/ProductionCostBreakdown';
import { SupplierPenaltyTerms } from '@/components/brand/production/SupplierPenaltyTerms';
import { SkuCreateWizard } from '@/components/brand/production/SkuCreateWizard';
import { CollectionProgressPanel } from '@/components/brand/production/CollectionProgressPanel';
import { BottleneckPanel } from '@/components/brand/production/BottleneckPanel';
import { CreatePOFromSamples } from '@/components/brand/production/CreatePOFromSamples';
import { MaterialsShortagePanel } from '@/components/brand/production/MaterialsShortagePanel';
import { ProductionArchiveHub } from '@/components/brand/production-archive-hub';
import { SupplierCollabHub } from '@/components/brand/supplier-collab-hub';
import { AssortmentPlm } from '@/components/brand/assortment-plm';
import { VariantMatrixEditor } from '@/components/brand/VariantMatrixEditor';
import { TechPackBuilder } from '@/components/brand/tech-pack-builder';
import CollaborationProjects from '@/components/brand/collaboration-projects';
import { MarketplaceLabelStatus } from '@/components/brand/MarketplaceLabelStatus';
const ProductionPageContent = dynamic(
  () => import('./production-page-content').then((m) => ({ default: m.ProductionPageContent })),
  {
    ssr: false,
    loading: () => <div className="text-text-muted p-8 text-center text-sm">Загрузка…</div>,
  }
);

/** Root layout wrapper - styled like organization/brand profile pages */
function ProductionPageRoot({ children }: { children: React.ReactNode }) {
  return (
    <CabinetPageContent
      maxWidth="7xl"
      className="space-y-5 px-4 pb-20 md:px-0"
      role="main"
      aria-label="Production"
    >
      {children}
    </CabinetPageContent>
  );
}

/**
 * Помощник для отображения аббревиатур с расшифровкой при наведении.
 */
function Acronym({
  children,
  title,
  description,
}: {
  children: React.ReactNode;
  title: string;
  description?: string;
}) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span className="decoration-accent-primary/60 cursor-help px-0.5 font-medium underline decoration-dotted">
          {children}
        </span>
      </TooltipTrigger>
      <TooltipContent className="bg-text-primary z-[100] max-w-xs rounded-lg border-none p-3 text-white shadow-xl">
        <div className="space-y-1">
          <p className="text-accent-primary text-[10px] font-semibold uppercase tracking-wider">
            {title}
          </p>
          {description && <p className="text-text-muted text-[10px] leading-snug">{description}</p>}
        </div>
      </TooltipContent>
    </Tooltip>
  );
}

export default function ProductionControlPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user } = useAuth();
  const prodRole = getProductionRole(user?.roles);
  const perms = PRODUCTION_PERMISSIONS[prodRole];

  const [activeTab, setActiveTab] = useState(() =>
    prodRole === 'manufacturer' ? 'samples' : 'collections'
  );
  const [selectedContext, setSelectedContext] = useState<'brand' | 'collection' | 'drop'>('brand');
  const [selectedCollectionIds, setSelectedCollectionIds] = useState<string[]>([]);
  const [archivedCollectionIds, setArchivedCollectionIds] = useState<string[]>(['ARCHIVE']);
  const [showArchived, setShowArchived] = useState(false);

  const [isCreatingSku, setIsCreatingSku] = useState(false);
  const [isCreatingCollection, setIsCreatingCollection] = useState(false);
  const [isSkuWizardOpen, setIsSkuWizardOpen] = useState(false);
  const [duplicateFromCollection, setDuplicateFromCollection] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const [editingCollectionId, setEditingCollectionId] = useState<string | null>(null);
  const [editingCollectionData, setEditingCollectionData] = useState<{
    name: string;
    deadline: string;
    responsible: string;
    priority: string;
  } | null>(null);
  const [isCreatingPO, setIsCreatingPO] = useState(false);
  const { toast } = useToast();

  const [isOrderingSample, setIsOrderingSample] = useState(false);
  const [isCategoryHandbookOpen, setIsCategoryHandbookOpen] = useState(false);
  const [activeAudienceInHandbook, setActiveAudienceInHandbook] = useState('men');
  const [isArchiveOpen, setIsArchiveOpen] = useState(false);
  const [isFittingsOpen, setIsFittingsOpen] = useState(false);
  const [isEacArchiveOpen, setIsEacArchiveOpen] = useState(false);
  const [isLabellingWizardOpen, setIsLabellingWizardOpen] = useState(false);
  const [isHandoverActOpen, setIsHandoverActOpen] = useState(false);
  const [isCostingOpen, setIsCostingOpen] = useState(false);
  const [isFittingLogOpen, setIsFittingLogOpen] = useState(false);
  const [isAutoPOOpen, setIsAutoPOOpen] = useState(false);
  const [isMarketplaceOpen, setIsMarketplaceOpen] = useState(false);
  const [isMaterialsDialogOpen, setIsMaterialsDialogOpen] = useState(false);
  const [marketplaceQuery, setMarketplaceQuery] = useState('');
  const [isGlobalSearchOpen, setIsGlobalSearchOpen] = useState(false);
  const [collectionFilter, setCollectionFilter] = useState<{
    search?: string;
    status?: string;
    priority?: string;
  }>({});
  const [sampleComments, setSampleComments] = useState<
    Record<string, Array<{ id: string; author: string; text: string; time: string }>>
  >({});

  // Master Handbooks Data
  const [PRODUCTION_MASTER_FABRICS_COLLECTION, set_PRODUCTION_MASTER_FABRICS_COLLECTION] = useState(
    [
      {
        id: 'F-001',
        name: 'Cotton Jersey 180g',
        supplier: 'Tex-Global',
        cost: '450 ₽/м',
        stock: '1,200 м',
      },
      {
        id: 'F-002',
        name: 'Premium Silk Satin',
        supplier: 'Luxury Fabrics',
        cost: '2,100 ₽/м',
        stock: '450 м',
      },
      {
        id: 'F-003',
        name: 'Eco-Nylon Recycled',
        supplier: 'Green Thread',
        cost: '850 ₽/м',
        stock: '800 м',
      },
    ]
  );

  const [suppliersList, setSuppliersList] = useState([
    { id: 'S-01', name: 'Global Textiles', type: 'Ткани', rating: 4.8, status: 'Active' },
    { id: 'S-02', name: 'YKK Russia', type: 'Фурнитура', rating: 4.9, status: 'Active' },
    { id: 'S-03', name: 'Smart Tailor Lab', type: 'Цех (CMT)', rating: 4.5, status: 'Warning' },
  ]);

  const [skus, setSkus] = useState<any[]>([
    {
      name: 'Платье "Midnight"',
      id: 'TP-9921',
      ver: '2.4',
      collection: 'SS26',
      audienceId: 'women',
      catLevel1Id: 'women-apparel',
      catLevel2Id: 'women-dresses',
      catLevel3Id: 'women-midi',
      attributes: { sil: 'Приталенный', color: 'Black' },
      price: '4,500 ₽',
      status: 'Production',
      master: true,
      deadline: '2026-06-10',
    },
    {
      name: 'Топ "White Silk"',
      id: 'TP-9922',
      ver: '1.0',
      collection: 'SS26',
      audienceId: 'women',
      catLevel1Id: 'women-apparel',
      catLevel2Id: 'women-tops',
      catLevel3Id: 'women-blouses',
      attributes: { color: 'White' },
      price: '2,100 ₽',
      status: 'Development',
      master: true,
      deadline: '2026-06-15',
    },
    {
      name: 'Шорты "Linen Breezy"',
      id: 'TP-9923',
      ver: '1.2',
      collection: 'SS26',
      audienceId: 'men',
      catLevel1Id: 'men-apparel',
      catLevel2Id: 'men-tops',
      catLevel3Id: 'men-tshirts',
      attributes: { color: 'Beige' },
      price: '3,200 ₽',
      status: 'Sampling',
      master: true,
      deadline: '2026-06-20',
    },
    {
      name: 'Худи "Eco-Life"',
      id: 'TP-8812',
      ver: '1.1',
      collection: 'DROP-UZ',
      audienceId: 'unisex',
      catLevel1Id: 'unisex-apparel',
      catLevel2Id: 'unisex-tops',
      catLevel3Id: 'unisex-hoodies',
      attributes: { color: 'Green' },
      price: '2,800 ₽',
      status: 'Production',
      master: true,
      deadline: '2026-04-15',
    },
    {
      name: 'Брюки "Cargo Pro"',
      id: 'TP-7734',
      ver: '3.0',
      collection: 'BASIC',
      audienceId: 'men',
      catLevel1Id: 'men-apparel',
      catLevel2Id: 'men-bottoms',
      catLevel3Id: 'men-cargo',
      attributes: { color: 'Khaki' },
      price: '3,200 ₽',
      status: 'Stock',
      master: true,
      deadline: '2026-12-01',
    },
    {
      name: 'Футболка "Base"',
      id: 'TP-1102',
      ver: '1.0',
      collection: 'BASIC',
      audienceId: 'unisex',
      catLevel1Id: 'unisex-apparel',
      catLevel2Id: 'unisex-tops',
      catLevel3Id: 'unisex-tshirts',
      attributes: { color: 'White' },
      price: '1,200 ₽',
      status: 'Stock',
      master: true,
      deadline: '2026-12-01',
    },
    {
      name: 'Куртка "Urban Shield"',
      id: 'TP-4401',
      ver: '0.8',
      collection: 'ARCHIVE',
      audienceId: 'men',
      catLevel1Id: 'men-apparel',
      catLevel2Id: 'men-outerwear',
      catLevel3Id: 'men-jackets',
      attributes: { color: 'Grey' },
      price: '8,900 ₽',
      status: 'Development',
      master: true,
      deadline: '2026-03-30',
    },
  ]);

  const [collections, setCollections] = useState([
    {
      id: 'SS26',
      name: 'Summer Solstice 2026',
      status: 'Production',
      items: 12,
      readiness: '65%',
      budget: '4.2M ₽',
      type: 'Коллекция',
      priority: 'High',
      deadline: '2026-05-15',
      responsible: 'Анна К.',
      season: 'SS26',
      tag: 'Основная',
    },
    {
      id: 'DROP-UZ',
      name: 'Urban Zen Drop',
      status: 'Development',
      items: 5,
      readiness: '20%',
      budget: '850k ₽',
      type: 'Дроп',
      priority: 'Standard',
      deadline: '2026-04-10',
      responsible: 'Игорь М.',
      season: 'FW26',
      tag: 'Дроп',
    },
    {
      id: 'BASIC',
      name: 'Core Basics (Replenish)',
      status: 'Active',
      items: 24,
      readiness: '100%',
      budget: '1.2M ₽',
      type: 'Сток',
      priority: 'Low',
      deadline: '—',
      responsible: 'Елена С.',
      tag: 'Сток',
    },
  ]);

  // Бюджет коллекции: план, факт, остаток по статьям
  const [collectionBudgets, setCollectionBudgets] = useState<any[]>([
    {
      collectionId: 'SS26',
      categories: [
        { id: 'materials', label: 'Материалы', plan: 1800000, fact: 1190400, unit: '₽' },
        { id: 'sewing', label: 'Пошив', plan: 2100000, fact: 890000, unit: '₽' },
        { id: 'logistics', label: 'Логистика', plan: 300000, fact: 215000, unit: '₽' },
      ],
      totalPlan: 4200000,
      totalFact: 2295400,
    },
    {
      collectionId: 'DROP-UZ',
      categories: [
        { id: 'materials', label: 'Материалы', plan: 380000, fact: 120000, unit: '₽' },
        { id: 'sewing', label: 'Пошив', plan: 400000, fact: 0, unit: '₽' },
        { id: 'logistics', label: 'Логистика', plan: 70000, fact: 15000, unit: '₽' },
      ],
      totalPlan: 850000,
      totalFact: 135000,
    },
    {
      collectionId: 'BASIC',
      categories: [
        { id: 'materials', label: 'Материалы', plan: 600000, fact: 580000, unit: '₽' },
        { id: 'sewing', label: 'Пошив', plan: 500000, fact: 495000, unit: '₽' },
        { id: 'logistics', label: 'Логистика', plan: 100000, fact: 98000, unit: '₽' },
      ],
      totalPlan: 1200000,
      totalFact: 1173000,
    },
  ]);

  const [materialsList, setMaterialsList] = useState<any[]>([
    {
      name: 'Шелк Сатин (Black)',
      roll: '#0921',
      length: '45.5 м',
      width: '145 см',
      defects: 2,
      status: 'Stock',
      collection: 'SS26',
    },
    {
      name: 'Шелк Сатин (Black)',
      roll: '#0922',
      length: '50.0 м',
      width: '145 см',
      defects: 0,
      status: 'Factory',
      collection: 'SS26',
    },
  ]);

  const [sfcOperations, setSfcOperations] = useState<any[]>([
    {
      op: 'Закупка сырья (Основная ткань)',
      plan: '100% лот',
      fact: '100% лот',
      diff: '0%',
      cost: '150,000 ₽',
      status: 'success',
      confirmed: true,
      date: '01.03.2026',
      type: 'supply',
      collection: 'SS26',
    },
    {
      op: 'Передача на аутсорс (Принт)',
      plan: '500 ед',
      fact: '500 ед',
      diff: '0%',
      cost: '45,000 ₽',
      status: 'success',
      confirmed: true,
      date: '05.03.2026',
      type: 'outsource',
      collection: 'SS26',
    },
    {
      op: 'Крой коллекции',
      plan: '15.0м',
      fact: '15.5м',
      diff: '+3%',
      cost: '4,500 ₽',
      status: 'warning',
      confirmed: true,
      date: '08.03.2026',
      comment: 'Перерасход из-за раскладки',
      type: 'sewing',
      collection: 'SS26',
    },
    {
      op: 'Пошив Proto 1',
      plan: '45.0м',
      fact: '42.0м',
      diff: '-6%',
      cost: '12,000 ₽',
      status: 'success',
      confirmed: false,
      type: 'sewing',
      collection: 'SS26',
    },
    {
      op: 'Отгрузка на склад (Поставка #1)',
      plan: '200 ед',
      fact: '-',
      diff: '-',
      cost: '5,000 ₽',
      status: 'warning',
      confirmed: false,
      type: 'logistics',
      collection: 'SS26',
    },
  ]);

  const [calendarEvents, setCalendarEvents] = useState<any[]>([
    {
      id: '1',
      date: '2026-03-15',
      title: 'Поставка Silk Satin',
      type: 'logistics',
      collection: 'SS26',
      status: 'pending',
      description: 'Ожидаем машину из Турции к 10:00',
      responsible: 'Анна К.',
    },
    {
      id: '2',
      date: '2026-03-20',
      title: 'Финальная примерка Proto 2',
      type: 'milestone',
      collection: 'SS26',
      status: 'urgent',
      description: 'Важно проверить посадку рукава',
      responsible: 'Игорь М.',
    },
    {
      id: '3',
      date: '2026-03-25',
      title: 'Оплата за пошив (Аванс)',
      type: 'finance',
      collection: 'SS26',
      status: 'pending',
      description: 'Счет #203 от фабрики Global',
      responsible: 'Елена С.',
    },
  ]);

  const [productionLosses, setProductionLosses] = useState<any[]>([
    {
      type: 'material',
      item: 'Silk Satin (Black)',
      collection: 'SS26',
      qty: '2.4 м',
      reason: 'Брак при раскрое',
      cost: '12,400 ₽',
      date: '08.03',
      status: 'pending',
      responsible: 'Анна К.',
      category: 'defect',
    },
    {
      type: 'model',
      item: 'Dress "Midnight"',
      collection: 'SS26',
      qty: '1 ед',
      reason: 'Критический дефект шва',
      cost: '4,500 ₽',
      date: '09.03',
      status: 'confirmed',
      responsible: 'Игорь М.',
      category: 'defect',
    },
    {
      type: 'material',
      item: 'Хлопок белый',
      collection: 'SS26',
      qty: '5 м',
      reason: 'Перерасход при раскладке',
      cost: '3,200 ₽',
      date: '07.03',
      status: 'confirmed',
      responsible: 'Анна К.',
      category: 'overrun',
    },
    {
      type: 'model',
      item: 'Топ SS26-01',
      collection: 'DROP-UZ',
      qty: '2 ед',
      reason: 'Списание по акту',
      cost: '8,100 ₽',
      date: '05.03',
      status: 'confirmed',
      responsible: 'Елена С.',
      category: 'writeoff',
    },
  ]);

  const [productionOrders, setProductionOrders] = useState<any[]>([
    {
      id: 'PO-2026-001',
      collection: 'SS26',
      factory: 'Global Textiles',
      skus: ['TP-9921'],
      qty: 500,
      status: 'In Production',
      date: '01.03.2026',
      payment: 'Аванс 50%',
      paymentStatus: 'advance',
      total: 350000,
      dueDate: '12.03.2026',
      sizeMatrix: { XS: 50, S: 100, M: 150, L: 100, XL: 50 },
      colors: ['Black', 'White'],
      responsible: 'Анна К.',
    },
    {
      id: 'PO-2026-002',
      collection: 'SS26',
      factory: 'Smart Tailor',
      skus: ['TP-9922', 'TP-9923'],
      qty: 300,
      status: 'Confirmed',
      date: '05.03.2026',
      payment: 'Ожидает',
      paymentStatus: 'pending',
      total: 180000,
      dueDate: '15.03.2026',
      sizeMatrix: { S: 80, M: 120, L: 100 },
      colors: ['Navy', 'Beige'],
      responsible: 'Игорь М.',
    },
    {
      id: 'PO-2026-003',
      collection: 'DROP-UZ',
      factory: 'Global Textiles',
      skus: ['TP-8812'],
      qty: 200,
      status: 'Shipped',
      date: '28.02.2026',
      payment: 'Оплачено',
      paymentStatus: 'paid',
      total: 120000,
      sizeMatrix: { M: 100, L: 100 },
      colors: ['Black'],
      responsible: 'Елена С.',
    },
  ]);

  const [sampleStatuses, setSampleStatuses] = useState<any[]>([
    {
      skuId: 'TP-9921',
      skuName: 'Платье "Midnight"',
      collection: 'SS26',
      stage: 'PP',
      stageLabel: 'Pre-Production',
      status: 'approved',
      dueDate: '20.03.2026',
      factory: 'Global Textiles',
      slaOverdue: false,
      tracking: { status: 'at_brand', eta: null },
    },
    {
      skuId: 'TP-9922',
      skuName: 'Топ "White Silk"',
      collection: 'SS26',
      stage: 'Proto2',
      stageLabel: 'Proto 2',
      status: 'in_review',
      dueDate: '15.03.2026',
      factory: 'Smart Tailor',
      slaOverdue: true,
      tracking: { status: 'in_transit', eta: '14.03.2026' },
    },
    {
      skuId: 'TP-9923',
      skuName: 'Шорты "Linen Breezy"',
      collection: 'SS26',
      stage: 'Proto1',
      stageLabel: 'Proto 1',
      status: 'waiting',
      dueDate: '18.03.2026',
      factory: 'Smart Tailor',
      slaOverdue: false,
      tracking: { status: 'at_factory' },
    },
    {
      skuId: 'TP-8812',
      skuName: 'Куртка Urban',
      collection: 'DROP-UZ',
      stage: 'SizeSet',
      stageLabel: 'Size Set',
      status: 'approved',
      dueDate: '10.03.2026',
      factory: 'Global Textiles',
      slaOverdue: false,
      tracking: { status: 'qc' },
    },
  ]);

  const [auditLog, setAuditLog] = useState<any[]>([
    {
      id: 1,
      action: 'bom',
      actionLabel: 'BOM обновлён',
      entity: 'TP-9921',
      collection: 'SS26',
      user: 'Анна К.',
      time: '09.03 14:20',
      detail: 'Добавлен материал Silk Satin',
    },
    {
      id: 2,
      action: 'sample',
      actionLabel: 'Сэмпл утверждён',
      entity: 'TP-8812',
      collection: 'DROP-UZ',
      user: 'Игорь М.',
      time: '08.03 11:00',
      detail: 'PP Sample approved',
    },
    {
      id: 3,
      action: 'po',
      actionLabel: 'PO создан',
      entity: 'PO-2026-002',
      collection: 'SS26',
      user: 'Анна К.',
      time: '05.03 16:45',
      detail: '300 ед., Smart Tailor',
    },
    {
      id: 4,
      action: 'status',
      actionLabel: 'Статус изменён',
      entity: 'PO-2026-001',
      collection: 'SS26',
      user: 'Система',
      time: '09.03 09:15',
      detail: 'In Production → Shipment Ready',
    },
    {
      id: 5,
      action: 'bom',
      actionLabel: 'BOM обновлён',
      entity: 'TP-9922',
      collection: 'SS26',
      user: 'Анна К.',
      time: '07.03 16:30',
      detail: 'Изменён расход ткани (-0.2м)',
    },
    {
      id: 6,
      action: 'sample',
      actionLabel: 'Сэмпл на проверку',
      entity: 'TP-9923',
      collection: 'SS26',
      user: 'Smart Tailor',
      time: '06.03 14:00',
      detail: 'Proto 1 отправлен на approval',
    },
  ]);

  const [requisitions, setRequisitions] = useState<any[]>([
    {
      id: 'REQ-001',
      collection: 'SS26',
      material: 'Silk Satin Black',
      qty: 120,
      unit: 'м',
      status: 'Quotes',
      supplier: null,
    },
    {
      id: 'REQ-002',
      collection: 'SS26',
      material: 'YKK Zipper #5',
      qty: 500,
      unit: 'шт',
      status: 'PO Created',
      supplier: 'YKK Russia',
    },
  ]);

  const [qcReports, setQcReports] = useState<any[]>([
    {
      id: 'QC-902',
      poId: 'PO-2026-001',
      date: '09.03.2026',
      inspector: 'Игорь М.',
      result: 'PASSED',
      score: 99.2,
      defects: 0,
    },
    {
      id: 'QC-901',
      poId: 'PO-2026-003',
      date: '05.03.2026',
      inspector: 'Анна К.',
      result: 'CONDITIONAL',
      score: 94,
      defects: 2,
    },
  ]);

  const [productionDocuments, setProductionDocuments] = useState<any[]>([
    {
      type: 'tz',
      name: 'ТЗ SS26 Summer Solstice',
      collection: 'SS26',
      date: '15.02.2026',
      status: 'Утверждено',
    },
    {
      type: 'contract',
      name: 'Контракт с Global Textiles',
      collection: 'SS26',
      date: '01.02.2026',
      status: 'Подписан',
    },
    {
      type: 'invoice',
      name: 'Инвойс PO-2026-001',
      collection: 'SS26',
      date: '08.03.2026',
      status: 'Ожидает оплаты',
    },
    {
      type: 'qc',
      name: 'QC Report #902',
      collection: 'SS26',
      date: '09.03.2026',
      status: 'PASSED',
    },
    {
      type: 'cmr',
      name: 'CMR SHIP-9921',
      collection: 'SS26',
      date: '10.03.2026',
      status: 'В пути',
    },
  ]);

  const [activeChatCollection, setActiveChatCollection] = useState<string | null>(null); // chat list: selected collection
  const [notificationsList, setNotificationsList] = useState<any[]>([
    {
      id: '1',
      type: 'sla',
      title: 'Сэмпл TP-9922: просрочка SLA Proto 2',
      time: '2 ч назад',
      read: false,
    },
    {
      id: '2',
      type: 'deadline',
      title: 'Сэмпл TP-9922: дедлайн через 4 дня',
      time: '2 ч назад',
      read: false,
    },
    {
      id: '3',
      type: 'status',
      title: 'PO-2026-001: фабрика обновила статус',
      time: '5 ч назад',
      read: false,
    },
    { id: '4', type: 'finance', title: 'Платёж 350 000 ₽ — 12.03.2026', time: 'Вчера', read: true },
    { id: '5', type: 'qc', title: 'QC-901: обнаружено 2 дефекта', time: 'Вчера', read: true },
  ]);

  // Chat State
  const [chatMessages, setChatMessages] = useState<any[]>([
    {
      id: '1',
      sender: 'Production Manager',
      text: 'Поставка SS26: Ткань Silk Satin прибыла на таможню. Анна, проверьте документы.',
      time: '10:30',
      collection: 'SS26',
      avatar: 'AM',
    },
    {
      id: '2',
      sender: 'Factory Boss (Global)',
      text: 'Образцы для Drop-UZ готовы к отправке. Ждем курьера.',
      time: '11:15',
      collection: 'DROP-UZ',
      avatar: 'GB',
    },
    {
      id: '3',
      sender: 'Buyer',
      text: 'Нужно уточнить бюджет по Basic коллекции. Перерасход по логистике на 5%.',
      time: 'Yesterday',
      collection: 'BASIC',
      avatar: 'ES',
    },
    {
      id: '4',
      sender: 'QC Specialist',
      text: 'В партии SS26 обнаружен дефект шва на 2-х платьях. См. раздел Потери.',
      time: 'Today, 09:20',
      collection: 'SS26',
      avatar: 'QC',
    },
    {
      id: '5',
      sender: 'Designer',
      text: 'Лекала для новой куртки Urban Shield готовы в CLO3D.',
      time: 'Just now',
      collection: 'General',
      avatar: 'ID',
    },
  ]);
  const [newMessage, setNewMessage] = useState('');

  const [editingEvent, setEditingEvent] = useState<any>(null);
  const [isEditEventOpen, setIsEditEventOpen] = useState(false);

  // Sub-navigation within tabs
  const [plmView, setPlmView] = useState<'matrix' | 'pim' | 'variants' | 'techpack'>('matrix');
  const [executionView, setExecutionView] = useState<'monitor' | 'twin'>('monitor');
  const [financeView, setFinanceView] = useState<'schedule' | 'terms' | 'factoring'>('schedule');
  const [handbookView, setHandbookView] = useState<
    'categories' | 'suppliers' | 'collabs' | 'sizes'
  >('categories');
  const [sizeCategoryId, setSizeCategoryId] = useState<string>(
    PRODUCTION_PARAMS_BY_CATEGORY[0]?.catL1Id ?? 'men-apparel'
  );
  const [selectedSkuId, setSelectedSkuId] = useState<string | null>(null);
  const [complianceView, setComplianceView] = useState<
    'marking' | 'qc' | 'passport' | 'certs' | 'eco' | 'defects'
  >('marking');
  const [logisticsView, setLogisticsView] = useState<
    'cargo' | 'inbound' | 'docs' | 'customs' | 'wms'
  >('cargo');
  const [procurementView, setProcurementView] = useState<
    'rolls' | 'haberdashery' | 'requisition' | 'quotes' | 'po' | 'receipt' | 'subcontract'
  >('rolls');
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [selectedPoId, setSelectedPoId] = useState<string | null>(null);
  const [ordersFilter, setOrdersFilter] = useState<string>('all');

  // Query params: ?status=in_progress | ?status=shipped → фильтр заказов и таб
  useEffect(() => {
    const status = searchParams.get('status');
    if (status === 'in_progress') {
      setActiveTab('orders');
      setOrdersFilter('In Production');
    } else if (status === 'shipped') {
      setActiveTab('orders');
      setOrdersFilter('Shipped');
    }
  }, [searchParams]);
  const [docFilter, setDocFilter] = useState<string>('all');
  const [apiDrops, setApiDrops] = useState<
    Array<{ id: number; drop_name: string; season: string; status: string; scheduled_date: string }>
  >([]);
  useEffect(() => {
    let cancelled = false;
    getDrops()
      .then((list) => {
        if (!cancelled) setApiDrops(list);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);
  const [auditFilter, setAuditFilter] = useState<'all' | 'bom' | 'sample' | 'po' | 'status'>('all');
  const [slaFilterOverdue, setSlaFilterOverdue] = useState(false);
  const [rejectSample, setRejectSample] = useState<{ skuId: string; skuName: string } | null>(null);
  const [rejectReason, setRejectReason] = useState('');
  const [rejectCommentCustom, setRejectCommentCustom] = useState('');
  const [skuSearchQuery, setSkuSearchQuery] = useState('');
  const [sampleSearchQuery, setSampleSearchQuery] = useState('');
  const [sampleStageFilter, setSampleStageFilter] = useState<string>('all');
  const [lossTypeFilter, setLossTypeFilter] = useState<string>('all');
  const [lossCategoryFilter, setLossCategoryFilter] = useState<string>('all');
  const [collectionSortOrder, setCollectionSortOrder] = useState<'name' | 'status' | 'readiness'>(
    'name'
  );
  const [collectionViewMode, setCollectionViewMode] = useState<'grid' | 'list'>('grid');
  const [docStatusFilter, setDocStatusFilter] = useState<string>('all');
  const [archiveSearchQuery, setArchiveSearchQuery] = useState<string>('');

  // KPI Details Dialog State
  const [activeKpiDetail, setActiveKpiDetail] = useState<
    'production' | 'cargo' | 'qc' | 'finance' | 'risk' | 'efficiency' | null
  >(null);
  const [kpiPeriod, setKpiPeriod] = useState<'week' | 'month' | 'custom'>('month');
  const [calendarFilter, setCalendarFilter] = useState('all');

  // Derived State
  const selectedId = selectedCollectionIds.length === 1 ? selectedCollectionIds[0] : null;

  const toggleCollectionSelection = (id: string) => {
    setSelectedCollectionIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
    setSelectedContext('collection');
  };

  const productionKpis = React.useMemo(() => {
    const activeIds =
      selectedCollectionIds.length > 0
        ? selectedCollectionIds
        : collections.filter((c) => !archivedCollectionIds.includes(c.id)).map((c) => c.id);

    const inProduction = activeIds.length * 415;
    const inTransit = activeIds.length * 116;
    const qcCount = activeIds.length + 1;
    const toPay = activeIds.length * 160;

    // New Intelligence Metrics
    const riskScore = activeIds.length > 0 ? (Math.random() * 15 + 5).toFixed(1) : '0.0';
    const efficiency = activeIds.length > 0 ? (85 + Math.random() * 10).toFixed(1) : '0.0';

    return {
      production: `${inProduction.toLocaleString()} ед.`,
      cargo: `${inTransit.toLocaleString()} ед.`,
      qc: `${qcCount} артикула`,
      finance: `${toPay}k ₽`,
      risk: `${riskScore}%`,
      efficiency: `${efficiency}%`,
    };
  }, [selectedCollectionIds, collections, archivedCollectionIds]);

  const filteredSkus = React.useMemo(() => {
    if (selectedCollectionIds.length === 0)
      return skus.filter((s) => !archivedCollectionIds.includes(s.collection));
    return skus.filter((s) => selectedCollectionIds.includes(s.collection));
  }, [skus, selectedCollectionIds, archivedCollectionIds]);

  const filteredMaterials = React.useMemo(() => {
    if (selectedCollectionIds.length === 0)
      return materialsList.filter((m) => !archivedCollectionIds.includes(m.collection));
    return materialsList.filter((m) => selectedCollectionIds.includes(m.collection));
  }, [materialsList, selectedCollectionIds, archivedCollectionIds]);

  const filteredLosses = React.useMemo(() => {
    if (selectedCollectionIds.length === 0)
      return productionLosses.filter((l) => !archivedCollectionIds.includes(l.collection));
    return productionLosses.filter((l) => selectedCollectionIds.includes(l.collection));
  }, [productionLosses, selectedCollectionIds, archivedCollectionIds]);

  const filteredEvents = React.useMemo(() => {
    if (selectedCollectionIds.length === 0)
      return calendarEvents.filter((e) => !archivedCollectionIds.includes(e.collection));
    return calendarEvents.filter((e) => selectedCollectionIds.includes(e.collection));
  }, [calendarEvents, selectedCollectionIds, archivedCollectionIds]);

  const filteredChat = React.useMemo(() => {
    if (selectedCollectionIds.length === 0)
      return chatMessages.filter((m) => !archivedCollectionIds.includes(m.collection));
    return chatMessages.filter((m) => selectedCollectionIds.includes(m.collection));
  }, [chatMessages, selectedCollectionIds, archivedCollectionIds]);

  const filteredSampleStatuses = React.useMemo(() => {
    if (selectedCollectionIds.length === 0)
      return sampleStatuses.filter((s) => !archivedCollectionIds.includes(s.collection));
    return sampleStatuses.filter((s) => selectedCollectionIds.includes(s.collection));
  }, [sampleStatuses, selectedCollectionIds, archivedCollectionIds]);

  const displaySkus = React.useMemo(() => {
    if (!skuSearchQuery.trim()) return filteredSkus;
    const q = skuSearchQuery.toLowerCase();
    return filteredSkus.filter(
      (s) => (s.name || '').toLowerCase().includes(q) || (s.id || '').toLowerCase().includes(q)
    );
  }, [filteredSkus, skuSearchQuery]);

  const displaySampleStatuses = React.useMemo(() => {
    if (!sampleSearchQuery.trim()) return filteredSampleStatuses;
    const q = sampleSearchQuery.toLowerCase();
    return filteredSampleStatuses.filter(
      (s) =>
        (s.skuName || '').toLowerCase().includes(q) || (s.skuId || '').toLowerCase().includes(q)
    );
  }, [filteredSampleStatuses, sampleSearchQuery]);

  const SAMPLE_STAGES = ['Proto1', 'Proto2', 'SMS', 'PP', 'SizeSet', 'TOP'] as const;
  const STAGE_LABELS: Record<string, string> = {
    Proto1: 'Proto 1',
    Proto2: 'Proto 2',
    SMS: 'SMS',
    PP: 'Pre-Production',
    SizeSet: 'Size Set',
    TOP: 'TOP',
  };

  const filteredProductionOrders = React.useMemo(() => {
    if (selectedCollectionIds.length === 0)
      return productionOrders.filter((o) => !archivedCollectionIds.includes(o.collection));
    return productionOrders.filter((o) => selectedCollectionIds.includes(o.collection));
  }, [productionOrders, selectedCollectionIds, archivedCollectionIds]);

  const filteredCollections = React.useMemo(() => {
    let list = collections.filter(
      (c) => c.id !== 'ARCHIVE' && !archivedCollectionIds.includes(c.id)
    );
    if (collectionFilter.search) {
      const q = collectionFilter.search.toLowerCase();
      list = list.filter(
        (c) =>
          (c.name || '').toLowerCase().includes(q) ||
          (c.id || '').toLowerCase().includes(q) ||
          (c.responsible || '').toLowerCase().includes(q)
      );
    }
    if (collectionFilter.status) list = list.filter((c) => c.status === collectionFilter.status);
    if (collectionFilter.priority)
      list = list.filter((c) => c.priority === collectionFilter.priority);
    return list;
  }, [
    collections,
    archivedCollectionIds,
    collectionFilter.search,
    collectionFilter.status,
    collectionFilter.priority,
  ]);

  const filteredAuditLog = React.useMemo(() => {
    let list = auditLog.filter(
      (a) => selectedCollectionIds.length === 0 || selectedCollectionIds.includes(a.collection)
    );
    if (auditFilter !== 'all') list = list.filter((a) => a.action === auditFilter);
    return list.sort((a, b) => b.id - a.id);
  }, [auditLog, selectedCollectionIds, auditFilter]);

  const filteredSlaSamples = React.useMemo(() => {
    let list = filteredSampleStatuses;
    if (slaFilterOverdue) list = list.filter((s) => s.slaOverdue);
    return list;
  }, [filteredSampleStatuses, slaFilterOverdue]);

  const slaOverdueCount = React.useMemo(
    () => filteredSampleStatuses.filter((s) => s.slaOverdue).length,
    [filteredSampleStatuses]
  );

  const contextBarBudgetRemainder = React.useMemo(() => {
    const budgets =
      selectedCollectionIds.length === 0
        ? []
        : collectionBudgets.filter((b) => selectedCollectionIds.includes(b.collectionId));
    return budgets.reduce((sum, b) => sum + (b.totalPlan - b.totalFact), 0);
  }, [collectionBudgets, selectedCollectionIds]);

  const samplePendingCount = React.useMemo(
    () =>
      filteredSampleStatuses.filter((s) => s.status === 'in_review' || s.status === 'waiting')
        .length,
    [filteredSampleStatuses]
  );

  const lossesSummary = React.useMemo(() => {
    const parseCost = (s: string) =>
      typeof s === 'string'
        ? parseInt(
            String(s)
              .replace(/[\s\u00a0₽]/g, '')
              .replace(/,/g, '') || '0',
            10
          )
        : 0;
    const totalCost = filteredLosses.reduce((sum, l) => sum + parseCost(l.cost), 0);
    const byType = filteredLosses.reduce(
      (acc, l) => {
        acc[l.type || 'other'] = (acc[l.type || 'other'] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    );
    return { totalCost, byType };
  }, [filteredLosses]);

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;
    const msg = {
      id: Date.now().toString(),
      sender: 'Вы',
      text: newMessage,
      time: 'Just now',
      collection: selectedId || 'General',
      avatar: 'ME',
    };
    setChatMessages([...chatMessages, msg]);
    setNewMessage('');
  };

  const handleEditEvent = (ev: any) => {
    setEditingEvent({ ...ev });
    setIsEditEventOpen(true);
  };

  const saveEditedEvent = () => {
    setCalendarEvents(
      calendarEvents.map((e: any) => (e.id === editingEvent.id ? editingEvent : e))
    );
    setIsEditEventOpen(false);
    handleAction('Событие обновлено', `Информация по этапу "${editingEvent.title}" сохранена.`);
  };

  const handleToggleSfcConfirmation = (index: number) => {
    const updated = [...sfcOperations];
    updated[index].confirmed = !updated[index].confirmed;
    setSfcOperations(updated);
  };

  const handleAddMaterial = () => {
    const newMaterial = {
      name: 'Новый рулон ткани',
      roll: `#${Math.floor(Math.random() * 9000) + 1000}`,
      length: '50.0 м',
      width: '150 см',
      defects: 0,
      status: 'Factory',
      collection: selectedId || 'General',
    };
    setMaterialsList([newMaterial, ...materialsList]);
  };

  const handleAction = (title: string, description: string) => {
    toast({
      title,
      description,
    });
  };

  const [newSkuData, setNewSkuData] = useState({
    name: '',
    id: '',
    category1: '',
    category2: '',
    category3: '',
    audience: 'unisex',
    price: '',
    supplier: '',
    responsible: 'Анна К.',
  });

  const saveSku = () => {
    const newSku = {
      name: newSkuData.name || 'New SKU',
      id: newSkuData.id || `TP-${Math.floor(Math.random() * 9000) + 1000}`,
      ver: '1.0',
      collection: selectedId || 'General',
      audienceId: newSkuData.audience,
      catLevel1Id: newSkuData.category1,
      catLevel2Id: newSkuData.category2,
      catLevel3Id: newSkuData.category3,
      attributes: { color: 'Black' },
      price: `${newSkuData.price || '0'} ₽`,
      status: 'Development',
      master: true,
      deadline: '2026-09-01',
      responsible: newSkuData.responsible,
      supplier: newSkuData.supplier,
    };
    setSkus([newSku, ...skus]);
    setIsCreatingSku(false);
    handleAction(
      'Артикул создан',
      `Артикул ${newSku.name} успешно добавлен в коллекцию. Ответственный: ${newSku.responsible}`
    );
    setNewSkuData({
      name: '',
      id: '',
      category1: '',
      category2: '',
      category3: '',
      audience: 'unisex',
      price: '',
      supplier: '',
      responsible: 'Анна К.',
    });
  };

  const handleCollectionCreated = (
    newColl: {
      id: string;
      name: string;
      status: string;
      items: number;
      readiness: string;
      budget: string;
      type: string;
      priority: string;
      deadline: string;
      responsible: string;
      season?: string;
    },
    budget?: { materials: number; sewing: number; logistics: number }
  ) => {
    setCollections([newColl as any, ...collections]);
    if (budget) {
      const total = budget.materials + budget.sewing + budget.logistics;
      setCollectionBudgets((prev) => [
        ...prev,
        {
          collectionId: newColl.id,
          categories: [
            { id: 'materials', label: 'Материалы', plan: budget.materials, fact: 0, unit: '₽' },
            { id: 'sewing', label: 'Пошив', plan: budget.sewing, fact: 0, unit: '₽' },
            { id: 'logistics', label: 'Логистика', plan: budget.logistics, fact: 0, unit: '₽' },
          ],
          totalPlan: total,
          totalFact: 0,
        },
      ]);
    }
    handleAction(
      'Коллекция создана',
      `Проект ${newColl.name} успешно инициализирован. Ответственный: ${newColl.responsible}`
    );
  };

  const handleSkuCreated = (created: {
    id: string;
    name: string;
    collection: string;
    stage?: string;
    sizes?: string[];
    colors?: string[];
    bomItems?: any[];
  }) => {
    const newSku = {
      name: created.name,
      id: created.id,
      ver: '1.0',
      collection: created.collection,
      audienceId: 'unisex',
      catLevel1Id: '',
      catLevel2Id: '',
      catLevel3Id: '',
      attributes: { color: (created.colors || ['Black'])[0] },
      price: '0 ₽',
      status: created.stage || 'Development',
      master: true,
      deadline: '2026-09-01',
      responsible: 'Анна К.',
    };
    setSkus([newSku as any, ...skus]);
    setIsSkuWizardOpen(false);
    handleAction('Артикул создан', `Артикул ${created.name} успешно добавлен.`);
  };

  const handleAddLoss = () => {
    const newLoss = {
      type: 'material',
      item: 'Silk Satin (Defect)',
      collection: selectedId || 'SS26',
      qty: '1.5 м',
      reason: 'Технический брак',
      cost: '4,500 ₽',
      date: 'Today',
      status: 'pending',
      responsible: 'Анна К.',
    };
    setProductionLosses([newLoss, ...productionLosses]);
    handleAction('Потеря зафиксирована', 'Новый дефект добавлен в реестр для анализа.');
  };

  const [contextData] = useState<any>({
    SS26: {
      analytics: {
        categories: [
          { name: 'Dresses', count: 5, cost: '450k ₽' },
          { name: 'Tops', count: 4, cost: '280k ₽' },
          { name: 'Bottoms', count: 3, cost: '320k ₽' },
        ],
        materials: [
          { name: 'Silk Satin', qty: '450 м', cost: '120k ₽' },
          { name: 'Cotton Jersey', qty: '800 м', cost: '85k ₽' },
          { name: 'Linen', qty: '300 м', cost: '65k ₽' },
        ],
      },
      materials: [
        {
          name: 'Лен Premium (White)',
          roll: '#SS-01',
          length: '120.0 м',
          width: '150 см',
          defects: 1,
        },
      ],
      sfc: [
        {
          op: 'Закупка сырья (Основная ткань)',
          plan: '100% лот',
          fact: '100% лот',
          diff: '0%',
          cost: '150,000 ₽',
          status: 'success',
          confirmed: true,
          date: '01.03.2026',
          type: 'supply',
        },
      ],
    },
  });

  const currentData = selectedId ? contextData[selectedId as keyof typeof contextData] : null;

  const getContextTitle = () => {
    if (selectedContext === 'brand') return 'Весь бренд';
    if (selectedCollectionIds.length > 1) return `Выбрано: ${selectedCollectionIds.length}`;
    if (selectedCollectionIds.length === 1) {
      const coll = collections.find((c: any) => c.id === selectedCollectionIds[0]);
      return coll ? `Коллекция: ${coll.name}` : 'Дроп';
    }
    return 'Весь бренд';
  };

  const resetToBrand = () => {
    setSelectedContext('brand');
    setSelectedCollectionIds([]);
  };

  const bodyProps: Record<string, unknown> = {
    activeTab,
    setActiveTab,
    perms,
    prodRole,
    getContextTitle,
    selectedContext,
    resetToBrand,
    selectedCollectionIds,
    isLabellingWizardOpen,
    setIsLabellingWizardOpen,
    isHandoverActOpen,
    setIsHandoverActOpen,
    isArchiveOpen,
    setIsArchiveOpen,
    isFittingsOpen,
    setIsFittingsOpen,
    isEacArchiveOpen,
    setIsEacArchiveOpen,
    isMarketplaceOpen,
    setIsMarketplaceOpen,
    isMaterialsDialogOpen,
    setIsMaterialsDialogOpen,
    isNotificationsOpen,
    setIsNotificationsOpen,
    isCreatingPO,
    setIsCreatingPO,
    duplicateFromCollection,
    setDuplicateFromCollection,
    setSelectedCollectionIds,
    collections,
    filteredCollections,
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
    productionDocuments,
    productionLosses,
    notificationsList,
    chatMessages,
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
    procurementView,
    setProcurementView,
    skuSearchQuery,
    setSkuSearchQuery,
    sampleSearchQuery,
    setSampleSearchQuery,
    sampleStageFilter,
    setSampleStageFilter,
    docFilter,
    setDocFilter,
    lossTypeFilter,
    setLossTypeFilter,
    lossCategoryFilter,
    setLossCategoryFilter,
    collectionSortOrder,
    setCollectionSortOrder,
    collectionViewMode,
    setCollectionViewMode,
    docStatusFilter,
    setDocStatusFilter,
    archiveSearchQuery,
    setArchiveSearchQuery,
    auditFilter,
    setAuditFilter,
    slaFilterOverdue,
    setSlaFilterOverdue,
    calendarFilter,
    setCalendarFilter,
    ordersFilter,
    setOrdersFilter,
    sizeCategoryId,
    setSizeCategoryId,
    selectedSkuId,
    setSelectedSkuId,
    selectedPoId,
    setSelectedPoId,
    activeChatCollection,
    setActiveChatCollection,
    rejectSample,
    setRejectSample,
    rejectReason,
    setRejectReason,
    rejectCommentCustom,
    setRejectCommentCustom,
    apiDrops,
    newMessage,
    setNewMessage,
    editingEvent,
    setEditingEvent,
    newSkuData,
    setNewSkuData,
    skus,
    materialsList,
    sfcOperations,
    setSfcOperations,
    calendarEvents,
    productionOrders,
    sampleStatuses,
    setSampleStatuses,
    auditLog,
    requisitions,
    setRequisitions,
    qcReports,
    isCreatingCollection,
    setIsCreatingCollection,
    isCreatingSku,
    setIsCreatingSku,
    isSkuWizardOpen,
    setIsSkuWizardOpen,
    isOrderingSample,
    setIsOrderingSample,
    isCategoryHandbookOpen,
    setIsCategoryHandbookOpen,
    isAutoPOOpen,
    setIsAutoPOOpen,
    isCostingOpen,
    setIsCostingOpen,
    isFittingLogOpen,
    setIsFittingLogOpen,
    isEditEventOpen,
    setIsEditEventOpen,
    toggleCollectionSelection,
    handleSendMessage,
    handleEditEvent,
    saveEditedEvent,
    handleToggleSfcConfirmation,
    handleAddMaterial,
    handleAction,
    saveSku,
    handleCollectionCreated,
    handleAddLoss,
    handleSkuCreated,
    STAGE_LABELS: STAGE_LABELS || {},
    SAMPLE_STAGES: SAMPLE_STAGES || [],
    currentData,
    contextData,
    toast,
    cn,
    isGlobalSearchOpen,
    setIsGlobalSearchOpen,
    collectionFilter,
    setCollectionFilter,
    sampleComments,
    setSampleComments,
  };
  return React.createElement(
    ProductionPageRoot,
    null,
    React.createElement(ProductionPageContent, bodyProps)
  );
}

function Paperclip(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l8.57-8.57A4 4 0 1 1 18 8.84l-8.59 8.51a2 2 0 0 1-2.83-2.83l8.49-8.48" />
    </svg>
  );
}

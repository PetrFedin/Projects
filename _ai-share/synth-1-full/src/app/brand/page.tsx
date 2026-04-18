'use client';

import { useState, useEffect, useRef } from 'react';
import type { Brand } from '@/lib/types';
import { brands } from '@/lib/placeholder-data';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Building2,
  Globe,
  Mail,
  Phone,
  MapPin,
  FileText,
  Briefcase,
  Calendar,
  Users,
  Shield,
  ChevronRight,
  User,
  Sparkles,
  Heart,
  Target,
  Palette,
  Edit,
  Check,
  X,
  Save,
  Bot,
  Zap,
  RefreshCcw,
  Package,
  Clock,
  DollarSign,
  Truck,
  Instagram,
  Twitter,
  History,
  ShieldCheck,
  CreditCard,
  CheckCircle2,
  AlertCircle,
  RotateCcw,
  Award,
  Upload,
  Download,
  QrCode,
  ExternalLink,
  Loader2,
  ImageIcon,
  Video,
  BookOpen,
  Newspaper,
  ShieldAlert,
  Gavel,
  Monitor,
  Database,
  ArrowUpRight,
  GanttChart,
  BrainCircuit,
  Scissors,
  Factory,
  Leaf,
  BarChart2,
  Activity,
  Layers,
  Rocket,
  Calculator,
  TrendingUp,
  Store,
  Handshake,
  Box,
  Search,
  Plus,
  FileSpreadsheet,
  Bell,
  MoreHorizontal,
  ChevronDown,
  MessageSquare,
  Ship,
  LayoutDashboard,
  Settings,
  Info,
  Send,
  Lock,
  UserPlus,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { cabinetSurface } from '@/lib/ui/cabinet-surface';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/providers/auth-provider';
import { useRbac } from '@/hooks/useRbac';
import { useUIState } from '@/providers/ui-state';
import { useBrandProfileSync } from '@/hooks/use-brand-profile-sync';
import { useNotificationPolling } from '@/hooks/use-notification-polling';
import { exportBrandProfileCSV, exportBrandProfilePDF } from '@/lib/brand-profile-export-utils';
import { exportToCSV } from '@/lib/production-export-utils';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { ROUTES } from '@/lib/routes';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { SectionBlock } from '@/components/brand/SectionBlock';
import { OrganizationOverviewEmbed } from '@/app/brand/organization/organization-overview-embed';
import {
  SUBSCRIPTION_PLANS,
  getPlanById,
  formatPrice,
  type PlanId,
} from '@/lib/data/subscription-plans';
import {
  MediaAssetsViewer,
  type AssetTypeId,
  type MediaAssetItem,
} from '@/components/brand/MediaAssetsViewer';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { OnlineStorePickerDialog } from '@/components/brand/OnlineStorePickerDialog';
import { PROFILE_SECTION_META, formatHoursCompact } from './brand-profile-page-utils';
import { RegistryPageShell } from '@/components/design-system';

export default function BrandProfilePage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { toast } = useToast();
  const { user, profile } = useAuth();
  const { can } = useRbac();
  const canEditProfile = can('brand_profile', 'edit');
  const { businessMode } = useUIState();
  const {
    loading: syncLoading,
    sync,
    retryIntegration,
    lastSynced,
  } = useBrandProfileSync('syntha-1');
  useNotificationPolling('syntha-1', 90000); // Live-updates каждые 90 сек
  const defaultBrand: Brand = {
    id: 'brand-syntha-default',
    slug: 'syntha',
    name: 'Syntha',
    nameRU: 'Синта',
    description: 'Бренд технологичной одежды.',
    logo: { url: 'https://picsum.photos/seed/syntha/200/200', alt: 'Syntha', hint: 'logo' },
    followers: 15200,
    countryOfOrigin: 'Россия',
    foundedYear: 2022,
    subscriptionTier: 'Elite',
  };

  const initialBrand =
    brands && brands.length > 0
      ? brands.find((b) => b.slug?.includes('syntha') || b.id?.includes('syntha')) || brands[0]
      : defaultBrand;

  const [brand, setBrand] = useState<Brand>(initialBrand);
  const [activeTab, setActiveTab] = useState<
    'brand' | 'commerce' | 'legal' | 'certificates' | 'presskit'
  >('brand');
  const [activeGroup, setActiveGroup] = useState<'profile' | 'b2b'>('profile');
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (!canEditProfile) setIsEditing(false);
  }, [canEditProfile]);

  const [legalData, setLegalData] = useState({
    legalName: 'ООО "Синта Фэшн"',
    inn: '7701234567',
    kpp: '770101001',
    ogrn: '1234567890123',
    okpo: '12345678',
    oktmo: '45381000',
    okved: '14.13',
    okvedDesc: 'Производство прочей верхней одежды',
    okfs: '16',
    okopf: '12300',
    legalAddress: '123456, г. Москва, ул. Тверская, д. 1, оф. 100',
    actualAddress: '123456, г. Москва, ул. Тверская, д. 1, оф. 100',
    bankName: 'ПАО Сбербанк',
    bik: '044525225',
    corrAccount: '30101810400000000225',
    paymentAccount: '40702810538000123456',
    ceo: 'Иванов Иван Иванович',
    ceoPosition: 'Генеральный директор',
    foundingDate: '15.03.2022',
    registrationAuthority: 'Межрайонная ИФНС России №46 по г. Москве',
    taxRegime: 'ОСНО',
    authorizedCapital: '10 000 ₽',
    licenses: 'Не требуется',
    powersOfAttorney: 'Ген. доверенность №1 от 15.03.2022',
    insurance: 'ОСАГО, ДМС',
    isVerified: true,
  });

  const [contacts, setContacts] = useState({
    email: 'info@syntha.ru',
    phone: '+7 (495) 123-45-67',
    website: 'https://syntha.ru',
    instagram: '@syntha_official',
    twitter: '@syntha_tech',
    tiktok: '',
    youtube: '',
    supportEmail: 'support@syntha.ru',
    pressEmail: 'press@syntha.ru',
    b2bEmail: 'b2b@syntha.ru',
    isEmailVerified: true,
    isPhoneVerified: true,
    isSocialSync: true,
  });
  const [brandInfo, setBrandInfo] = useState({
    logos: [
      { id: 'logo-1', url: 'https://picsum.photos/seed/syntha/200/200', isMain: true },
      { id: 'logo-2', url: '', isMain: false },
    ] as { id: string; url: string; isMain: boolean }[],
    storeAddresses: [
      {
        id: 'addr-1',
        name: 'ЦУМ',
        fullAddress: '125009, г. Москва, ул. Тверская, д. 1 (ЦУМ, 3 этаж)',
        phone: '+7 (495) 933-73-00',
        site: 'https://tsum.ru',
        yandexMapUrl: 'https://yandex.ru/maps/?pt=37.617644,55.755826&z=17',
        workingHours: {
          mon: '10:00–22:00',
          tue: '10:00–22:00',
          wed: '10:00–22:00',
          thu: '10:00–22:00',
          fri: '10:00–22:00',
          sat: '10:00–22:00',
          sun: '10:00–22:00',
        },
        isSynced: true,
      },
      {
        id: 'addr-2',
        name: 'Галерея',
        fullAddress: '190000, г. Санкт-Петербург, Невский пр., д. 1',
        phone: '+7 (812) 333-00-00',
        site: 'https://example.ru',
        yandexMapUrl: 'https://yandex.ru/maps/?pt=30.360909,59.934280&z=17',
        workingHours: {
          mon: '10:00–21:00',
          tue: '10:00–21:00',
          wed: '10:00–21:00',
          thu: '10:00–21:00',
          fri: '10:00–21:00',
          sat: '10:00–21:00',
          sun: '10:00–20:00',
        },
        isSynced: true,
      },
    ] as {
      id: string;
      name: string;
      fullAddress: string;
      phone: string;
      site: string;
      yandexMapUrl: string;
      workingHours: Record<string, string>;
      isSynced: boolean;
    }[],
    onlineStores: [
      {
        id: 'os-1',
        name: 'Wildberries',
        productUrl: 'https://www.wildberries.ru/catalog/0/search.aspx?search=syntha',
        parsingEnabled: true,
      },
      {
        id: 'os-2',
        name: 'Ozon',
        productUrl: 'https://www.ozon.ru/brand/syntha-123456789/',
        parsingEnabled: true,
      },
      {
        id: 'os-3',
        name: 'Яндекс Маркет',
        productUrl: 'https://market.yandex.ru/search?text=syntha',
        parsingEnabled: false,
      },
    ] as { id: string; name: string; productUrl: string; parsingEnabled: boolean }[],
    showroom: {
      hasShowroom: true,
      name: 'Шоурум Syntha',
      address: 'г. Москва, ул. Тверская, д. 1',
      phone: '+7 (495) 123-45-67',
      site: 'https://syntha.ru/showroom',
      yandexMapUrl: 'https://yandex.ru/maps/?pt=37.617644,55.755826&z=17',
      workingHours: {
        mon: '10:00–20:00',
        tue: '10:00–20:00',
        wed: '10:00–20:00',
        thu: '10:00–20:00',
        fri: '10:00–20:00',
        sat: '11:00–18:00',
        sun: 'Выходной',
      } as Record<string, string>,
    },
    portalLogin: 'syntha_brand',
  });
  const [brandContacts, setBrandContacts] = useState({
    emails: [{ value: 'info@syntha.ru', label: 'Общий' }] as { value: string; label: string }[],
    phones: [{ value: '+7 (495) 123-45-67', label: 'Общий' }] as { value: string; label: string }[],
    telegrams: [{ value: '@syntha_official', label: 'Общий' }] as {
      value: string;
      label: string;
    }[],
    whatsapps: [{ value: '+7 (495) 123-45-67', label: 'B2B' }] as {
      value: string;
      label: string;
    }[],
    externalEmails: [
      { value: 'press@syntha.ru', label: 'Пресса' },
      { value: 'b2b@syntha.ru', label: 'B2B' },
    ] as { value: string; label: string }[],
  });
  const [mediaViewerOpen, setMediaViewerOpen] = useState(false);
  const [mediaViewerType, setMediaViewerType] = useState<AssetTypeId | null>(null);
  const [pressKitAutoArchiveDays, setPressKitAutoArchiveDays] = useState(90);
  const [pressKitAssets, setPressKitAssets] = useState<Record<AssetTypeId, MediaAssetItem[]>>({
    'brand-identity': [
      {
        id: 'bi-1',
        title: 'Logo Primary.svg',
        type: 'image',
        archived: false,
        addedAt: '2026-01-15',
      },
      {
        id: 'bi-2',
        title: 'Logo White.png',
        type: 'image',
        archived: false,
        addedAt: '2026-01-15',
      },
      {
        id: 'bi-3',
        title: 'Brand Colors.pdf',
        type: 'pdf',
        archived: true,
        archivedAt: '2026-02-01',
        addedAt: '2025-12-01',
      },
    ],
    lookbooks: [
      {
        id: 'lb-1',
        title: 'SS26 Main Collection.pdf',
        type: 'pdf',
        archived: false,
        addedAt: '2026-02-10',
      },
      {
        id: 'lb-2',
        title: 'FW25 Archive.pdf',
        type: 'pdf',
        archived: false,
        addedAt: '2025-08-20',
      },
    ],
    'press-releases': [
      {
        id: 'pr-1',
        title: 'SS26 Launch.docx',
        type: 'doc',
        archived: false,
        addedAt: '2026-02-15',
      },
    ],
    'brand-video': [
      {
        id: 'bv-1',
        title: 'Manifesto 2026.mp4',
        type: 'video',
        archived: false,
        addedAt: '2026-01-20',
      },
    ],
    'team-bios': [
      { id: 'tb-1', title: 'CEO Bio.pdf', type: 'pdf', archived: false, addedAt: '2026-01-10' },
    ],
    'store-photos': [
      {
        id: 'sp-1',
        title: 'Moscow Showroom (12).jpg',
        type: 'image',
        archived: false,
        addedAt: '2026-02-01',
      },
    ],
  });

  const [brandDNA, setBrandDNA] = useState({
    philosophy:
      'Cyber-Heritage: Сочетание традиционного портновского мастерства с функциональностью будущего',
    history:
      'Syntha — это манифест технологической элегантности. Основанный в 2022 году, бренд фокусируется на создании "умного гардероба", который адаптируется под ритм жизни современного мегаполиса.',
    keywords: ['Адаптивность', 'Минимализм', 'Устойчивость', 'Инновации'],
    values: ['Качество', 'Экологичность', 'Технологичность', 'Честность'],
    mission: 'Создавать одежду, которая адаптируется к жизни современного человека',
    vision: 'Стать лидером в сегменте технологичной одежды в России и СНГ к 2027 году',
    targetAudience: 'Urban Nomads (25-40 лет), ценящие мобильность и качество материалов',
    positioning: 'High-Tech / Silent Luxury',
    ceo: 'Александр Ветров',
    director: 'Елена Морозова',
  });

  const [commerceTerms, setCommerceTerms] = useState({
    moq: '30 Units',
    leadTime: '4–6 недель',
    currency: 'USD / RUB',
    shipping: 'EXW / DAP',
    productionCapacity: '5000 units/mo',
    sampleDevelopment: '14 Days',
  });

  const [isVerifying, setIsVerifying] = useState<string | null>(null);
  const [uploadingCertificate, setUploadingCertificate] = useState<number | null>(null);
  const [showCertificateDialog, setShowCertificateDialog] = useState(false);
  const [showChangelogDialog, setShowChangelogDialog] = useState(false);
  const [changelogFilter, setChangelogFilter] = useState<'all' | string>('all');
  const [profileSearch, setProfileSearch] = useState('');
  const [onlineStorePickerOpen, setOnlineStorePickerOpen] = useState(false);
  const [viewRole, setViewRole] = useState<'ceo' | 'cfo' | 'sales'>('ceo');
  useEffect(() => {
    const tab = searchParams.get('tab');
    const group = searchParams.get('group');
    if (tab === 'dna' || tab === 'contacts') {
      setActiveGroup('profile');
      setActiveTab('brand');
    } else if (
      tab &&
      [
        'overview',
        'brand',
        'commerce',
        'legal',
        'certificates',
        'presskit',
        'linesheets',
        'campaigns',
        'pricing',
        'vmi',
        'esg',
        'loyalty',
        'academy',
        'russian_layer',
      ].includes(tab)
    ) {
      setActiveTab(tab as any);
      setActiveGroup(tab === 'commerce' ? 'b2b' : 'profile');
    }
  }, [searchParams]);

  useEffect(() => {
    const r = profile?.user?.role || user?.roles?.[0];
    if (r === 'cfo') setViewRole('cfo');
    else if (r === 'sales' || r === 'buyer') setViewRole('sales');
  }, [profile?.user?.role, user?.roles]);

  // При смене B2B/B2C режима — переключить на соответствующий контент
  const prevModeRef = useRef(businessMode);
  useEffect(() => {
    if (prevModeRef.current !== businessMode) {
      prevModeRef.current = businessMode;
      if (businessMode === 'b2c') {
        setActiveGroup('partners');
        setActiveTab('pre-orders');
      } else {
        setActiveGroup('profile');
        setActiveTab('brand');
      }
    }
  }, [businessMode]);

  const [certificates, setCertificates] = useState([
    {
      id: 1,
      name: 'ISO 9001:2015',
      type: 'Quality Management',
      certNumber: 'RU.001.ИСО9001.2024',
      issueDate: '15.01.2024',
      expiryDate: '15.01.2027',
      status: 'active' as const,
      file: 'iso-9001.pdf',
      issuingBody: 'Бюро Веритас',
      scope: 'Производство одежды',
      trTs: '',
      notes: '',
    },
    {
      id: 2,
      name: 'GOTS Organic Textile',
      type: 'Sustainability',
      certNumber: 'CU-12345678',
      issueDate: '20.03.2024',
      expiryDate: '01.03.2026',
      status: 'expiring' as const,
      file: 'gots-cert.pdf',
      issuingBody: 'CU GmbH',
      scope: 'Текстиль органический',
      trTs: 'ТР ТС 017/2011',
      notes: 'Срок продления — март 2026',
    },
    {
      id: 3,
      name: 'Oeko-Tex Standard 100',
      type: 'Textile Safety',
      certNumber: 'SH 123456',
      issueDate: '10.05.2024',
      expiryDate: '10.05.2025',
      status: 'expired' as const,
      file: 'oekotex.pdf',
      issuingBody: 'Hohenstein',
      scope: 'Готовая одежда',
      trTs: '',
      notes: 'Требуется обновление',
    },
  ]);

  // Mini-dashboard data (mock — в проде подтягивать из API)
  const certsActive = certificates.filter((c) => c.status === 'active').length;
  const certsExpiring = certificates.filter(
    (c) => c.status === 'expiring' || c.status === 'expired'
  ).length;
  const miniDashboard = {
    retailersCount: 24,
    openB2bOrders: 7,
    activeDisputes: 1,
    certsActive,
    certsExpiring,
    collectionsCount: 12,
    skuCount: 847,
    lastDisputeDate: '10.03.2026',
    lastComplianceEvent: 'Синхр. маркировки 09:12',
    lastProductionEvent: 'TOP-заказ #4521 отправлен',
    poInProduction: 4,
    poShipped: 3,
    markingSyncStatus: 'ok' as 'ok' | 'error' | 'pending',
    markingLastSync: '09:12',
    linesheetsActive: 2,
    linesheetsCollections: ['SS26 Main', 'SS26 Pre-collection'],
    topRetailers: [
      { name: 'TSUM', volume: '2.1M ₽', lastOrder: '08.03.2026' },
      { name: 'ЦУМ Online', volume: '1.8M ₽', lastOrder: '07.03.2026' },
      { name: 'Lamoda', volume: '1.2M ₽', lastOrder: '05.03.2026' },
    ],
    certExpiryAlerts: certificates
      .filter((c) => c.status === 'expiring' || c.status === 'expired')
      .map((c) => ({ name: c.name, expiry: c.expiryDate })),
  };

  // Интеграции, подписка, API Hub, команда, календарь, сообщения, CRM, финансы
  const integrationsData = {
    c1c: { status: 'ok' as const, lastSync: '10.03 08:45' },
    cdek: { status: 'ok' as const, lastSync: '10.03 09:12' },
    ozon: { status: 'error' as const, lastSync: '09.03 14:20', errorCount: 2 },
  };
  const currentPlan =
    getPlanById((brand.subscriptionTier?.toLowerCase() as PlanId) || 'elite') ??
    SUBSCRIPTION_PLANS[SUBSCRIPTION_PLANS.length - 1];
  const subscriptionData = {
    tier: currentPlan.name,
    price: currentPlan.priceMonthly,
    renewDate: '15.04.2026',
    limits: 'Без ограничений',
  };
  const apiHubData = { apiKeys: 3, lastRequests: 127, errors24h: 0 };
  const teamMembers = [
    { name: brandDNA.ceo, role: 'CEO', href: '/brand/team', id: 'ceo' },
    { name: brandDNA.director, role: 'Director', href: '/brand/team', id: 'director' },
  ];
  const calendarEvents = [
    { title: 'Дедлайн SS26 PO', date: '12.03.2026', href: '/brand/calendar' },
    { title: 'Показ FW26', date: '18.03.2026', href: '/brand/calendar' },
  ];
  const messagesData = {
    unread: 5,
    lastPreview: 'TSUM: подтверждение заказа #4521',
    href: '/brand/messages',
  };
  const crmData = { segments: 8, ltv: '₽124K', customers: 2847 };
  const financeData = { revenueMonth: '₽2.4M', pnl: '+12%', href: '/brand/finance' };
  const logisticsData = {
    dutyEngine: true,
    shadowUnits: 142,
    href: '/brand/logistics/duty-calculator',
  };
  const edocData = { active: true, lastDoc: '10.03 07:30', href: '/brand/compliance' };
  const circularHubData = { tradesCount: 12, stockValue: '₽340K', href: '/brand/circular-hub' };
  const kickstarterData = {
    activeCampaigns: 1,
    title: 'SS26 Pre-launch',
    href: '/brand/kickstarter',
  };
  const customizationData = { mtmOrders: 23, href: '/brand/customization' };

  // Completeness score — полнота профиля (расширено: presskit, linesheets, pricing)
  const completeness = {
    brand: !!(brand.name && brand.logo?.url && contacts.email),
    legal: !!(legalData.legalName && legalData.inn && legalData.isVerified),
    certificates: certsActive > 0,
    commerce: !!(commerceTerms.moq && commerceTerms.leadTime),
    presskit: !!brand.logo?.url,
    linesheets: miniDashboard.linesheetsActive > 0,
    pricing: true,
  };
  const completenessTotal = 5;
  const completenessCount = [
    completeness.brand,
    completeness.legal,
    completeness.certificates,
    completeness.commerce,
    completeness.presskit,
  ].filter(Boolean).length;
  const completenessScore = Math.round((completenessCount / completenessTotal) * 100);
  const incompleteBlocks = [
    !completeness.brand && 'Бренд',
    !completeness.legal && 'Юр. данные',
    !completeness.certificates && 'Сертификаты',
    !completeness.commerce && 'Коммерция',
    !completeness.presskit && 'Press Kit',
  ].filter(Boolean) as string[];

  const [changelog, setChangelog] = useState([
    {
      id: '1',
      date: '2026-02-17 14:23',
      user: 'Анна К.',
      action: 'Обновила юридический адрес',
      field: 'Юридические данные',
      oldValue: 'ул. Профсоюзная, 57',
      newValue: 'ул. Тверская, 1, оф. 100',
    },
    {
      id: '2',
      date: '2026-02-15 10:15',
      user: 'Игорь Д.',
      action: 'Добавил сертификат GOTS',
      field: 'Сертификаты',
      oldValue: null,
      newValue: 'GOTS Organic Textile',
    },
    {
      id: '3',
      date: '2026-02-14 16:42',
      user: 'Мария С.',
      action: 'Обновила Press Kit',
      field: 'Brand Story',
      oldValue: 'Традиционное мастерство',
      newValue: 'Cyber-Heritage: Сочетание традиций с технологиями',
    },
    {
      id: '4',
      date: '2026-02-12 09:30',
      user: 'Система',
      action: 'Верифицировала юридическое лицо',
      field: 'Юридические данные',
      oldValue: 'Не верифицировано',
      newValue: 'Верифицировано ФНС',
    },
    {
      id: '5',
      date: '2026-02-10 11:20',
      user: 'Петр В.',
      action: 'Добавил контакт B2B отдела',
      field: 'Контакты',
      oldValue: null,
      newValue: 'b2b@syntha.ru',
    },
  ]);

  // Profile pulse — последние изменения
  const profilePulse = changelog.slice(0, 3);

  // Поиск по профилю — переключение на релевантную вкладку (с debounce)
  useEffect(() => {
    const q = profileSearch.toLowerCase().trim();
    if (q.length < 2) return;
    const t = setTimeout(() => {
      if (
        q.includes('бренд') ||
        q.includes('лого') ||
        q.includes('шоурум') ||
        q.includes('соц') ||
        q.includes('контакт') ||
        q.includes('email') ||
        q.includes('телефон') ||
        q.includes('логин')
      ) {
        setActiveGroup('profile');
        setActiveTab('brand');
      } else if (q.includes('коммерц') || q.includes('moq') || q.includes('lead')) {
        setActiveGroup('b2b');
        setActiveTab('commerce');
      } else if (q.includes('юр') || q.includes('инн') || q.includes('реквизит')) {
        setActiveGroup('profile');
        setActiveTab('legal');
      } else if (q.includes('сертификат') || q.includes('gots') || q.includes('oeko')) {
        setActiveGroup('profile');
        setActiveTab('certificates');
      } else if (q.includes('press') || q.includes('пресс')) {
        setActiveGroup('profile');
        setActiveTab('presskit');
      }
    }, 400);
    return () => clearTimeout(t);
  }, [profileSearch]);

  const handleVerify = (type: 'legal' | 'email' | 'phone' | 'address') => {
    setIsVerifying(type);
    setTimeout(() => {
      if (type === 'legal') setLegalData((prev) => ({ ...prev, isVerified: true }));
      if (type === 'email') setContacts((prev) => ({ ...prev, isEmailVerified: true }));
      if (type === 'phone') setContacts((prev) => ({ ...prev, isPhoneVerified: true }));
      setIsVerifying(null);
    }, 2000);
  };

  const handleUploadCertificate = (certId: number) => {
    setUploadingCertificate(certId);
    setTimeout(() => {
      setCertificates((prev) =>
        prev.map((cert) =>
          cert.id === certId
            ? {
                ...cert,
                status: 'active' as const,
                issueDate: new Date().toLocaleDateString('ru-RU'),
                expiryDate: new Date(Date.now() + 3 * 365 * 24 * 60 * 60 * 1000).toLocaleDateString(
                  'ru-RU'
                ),
              }
            : cert
        )
      );
      setUploadingCertificate(null);
      setShowCertificateDialog(false);
    }, 2000);
  };

  const changelogFields = Array.from(new Set(changelog.map((c) => c.field)));
  const filteredChangelog =
    changelogFilter === 'all' ? changelog : changelog.filter((c) => c.field === changelogFilter);
  const handleChangelogRollback = (entry: (typeof changelog)[0]) => {
    if (entry.oldValue) {
      if (entry.field === 'Юридические данные')
        setLegalData((p) => ({ ...p, legalAddress: entry.oldValue as string }));
      else if (entry.field === 'Контакты')
        setContacts((p) => ({ ...p, b2bEmail: entry.oldValue as string }));
      setChangelog((prev) => [
        {
          id: Date.now().toString(),
          date: new Date().toLocaleString('ru-RU'),
          user: 'Откат',
          action: `Откат: ${entry.action}`,
          field: entry.field,
          oldValue: entry.newValue,
          newValue: entry.oldValue,
        },
        ...prev,
      ]);
      toast({ title: 'Откат', description: `Восстановлено предыдущее значение` });
    } else
      toast({
        title: 'Откат недоступен',
        description: 'Для добавленных записей откат не применим',
        variant: 'destructive',
      });
  };

  return (
    <RegistryPageShell className="max-w-7xl space-y-6">
      {/* Заголовок раздела: иконка + название + действия (крошки — в layout, CabinetHubSectionBar) */}
      <div className="space-y-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex min-w-0 items-start gap-4">
            <div className="bg-bg-surface2 text-text-secondary flex h-10 w-10 shrink-0 items-center justify-center rounded-xl">
              <User className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <h2 className="text-text-primary text-base font-black uppercase tracking-tight sm:text-lg">
                ПРОФИЛЬ
              </h2>
              <p className="text-text-secondary mt-1 text-[11px] font-medium leading-relaxed">
                {activeGroup === 'b2b'
                  ? 'Коммерческие условия B2B'
                  : 'Бренд, юр. данные, сертификаты, Press Kit'}
              </p>
            </div>
          </div>
          <div className="flex shrink-0 flex-col items-end gap-2">
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="h-7 text-[9px]" asChild>
                <Link href={ROUTES.brand.settings}>
                  <Settings className="mr-1 h-3 w-3" /> Настройки
                </Link>
              </Button>
              {canEditProfile && (
                <Button
                  variant={isEditing ? 'default' : 'outline'}
                  size="sm"
                  className={cn('h-7 text-[9px]', isEditing ? 'bg-accent-primary text-white' : '')}
                  onClick={() => {
                    const wasEditing = isEditing;
                    setIsEditing(!isEditing);
                    if (wasEditing && searchParams.get('returnResolved')) {
                      router.replace(
                        `/brand?group=strategy&tab=overview&resolved=${encodeURIComponent(searchParams.get('returnResolved')!)}`
                      );
                    }
                  }}
                >
                  {isEditing ? (
                    <>
                      <Save className="mr-1 h-3 w-3" /> Сохранить
                    </>
                  ) : (
                    <>
                      <Edit className="mr-1 h-3 w-3" /> Редактировать
                    </>
                  )}
                </Button>
              )}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-text-secondary h-7 shrink-0 rounded-[4px] px-2 text-[9px] font-black uppercase"
                  >
                    <MoreHorizontal className="h-3.5 w-3.5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem
                    onClick={async () => {
                      const r = await sync();
                      if (r.success)
                        toast({ title: 'Синхронизация', description: 'Данные обновлены' });
                      else toast({ title: 'Ошибка', description: r.error, variant: 'destructive' });
                    }}
                    disabled={syncLoading}
                    className="gap-2 text-[10px]"
                  >
                    <RefreshCcw className={cn('h-3.5 w-3.5', syncLoading && 'animate-spin')} />{' '}
                    Синхронизация
                    {lastSynced && (
                      <span className="text-text-muted ml-auto text-[9px]">
                        {lastSynced.toLocaleTimeString('ru-RU', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    )}
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => setShowChangelogDialog(true)}
                    className="gap-2 text-[10px]"
                  >
                    <History className="h-3.5 w-3.5" /> История изменений
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => {
                      exportBrandProfileCSV({
                        brand: {
                          name: brand.name,
                          description: brand.description || '',
                          countryOfOrigin: brand.countryOfOrigin || '',
                          foundedYear: brand.foundedYear || 2022,
                        },
                        dna: brandDNA,
                        contacts,
                        commerce: commerceTerms,
                        legal: legalData,
                      });
                      toast({ title: 'Экспорт', description: 'Профиль экспортирован в CSV' });
                    }}
                    className="gap-2 text-[10px]"
                  >
                    <FileSpreadsheet className="h-3.5 w-3.5" /> Экспорт CSV
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => {
                      exportBrandProfilePDF();
                      toast({ title: 'PDF', description: 'Используйте печать браузера' });
                    }}
                    className="gap-2 text-[10px]"
                  >
                    <FileText className="h-3.5 w-3.5" /> Экспорт PDF
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <div className="flex flex-wrap items-center justify-end gap-2">
              {!canEditProfile && (
                <Badge
                  variant="outline"
                  className="border-border-default text-text-secondary bg-bg-surface2 text-[9px] font-bold"
                >
                  Только просмотр
                </Badge>
              )}
              <Badge
                variant="outline"
                className="border-emerald-200 bg-emerald-50 text-[9px] font-bold text-emerald-600"
              >
                <Check className="mr-1 h-3 w-3" /> Верифицирован
              </Badge>
              <span className="text-text-secondary flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest">
                <Calendar className="h-3 w-3" /> Осн. {brand.foundedYear}
              </span>
              <span className="text-text-secondary flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest">
                <Globe className="h-3 w-3" /> {brand.countryOfOrigin}
              </span>
              <TooltipProvider delayDuration={200}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span className="text-text-muted hover:text-text-secondary inline-flex cursor-help transition-colors">
                      <Info className="h-3.5 w-3.5" />
                    </span>
                  </TooltipTrigger>
                  <TooltipContent side="bottom" className="max-w-[200px] text-[10px]">
                    Верификация, год основания, страна
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <Link
                href={ROUTES.brand.customerActivity}
                className="text-accent-primary hover:text-accent-primary flex cursor-pointer items-center gap-1 text-[10px] font-bold uppercase tracking-widest transition-colors"
              >
                <Users className="h-3 w-3" /> {(brand.followers || 0).toLocaleString('ru-RU')}{' '}
                подписчиков
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Tabs Group Selection */}
      <div className="bg-bg-surface2 border-border-default flex w-fit items-center gap-1 rounded-xl border p-1 shadow-inner">
        <Button
          variant={activeGroup === 'profile' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => {
            setActiveGroup('profile');
            setActiveTab('brand');
          }}
          className={cn(
            'h-7 rounded-lg px-4 text-[9px] font-bold uppercase tracking-wider transition-all',
            activeGroup === 'profile'
              ? 'text-text-primary border-border-default border bg-white shadow-sm'
              : 'text-text-secondary hover:text-text-primary'
          )}
        >
          Профиль
        </Button>
        {businessMode === 'b2b' && (
          <Button
            variant={activeGroup === 'b2b' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => {
              setActiveGroup('b2b');
              setActiveTab('commerce');
            }}
            className={cn(
              'h-7 rounded-lg px-4 text-[9px] font-bold uppercase tracking-wider transition-all',
              activeGroup === 'b2b'
                ? 'text-text-primary border-border-default border bg-white shadow-sm'
                : 'text-text-secondary hover:text-text-primary'
            )}
          >
            B2B & Продажи
          </Button>
        )}
      </div>

      {/* Tabs профиля (Обзор — первый подтаб) */}
      <SectionBlock
        title="Разделы профиля"
        meta={PROFILE_SECTION_META.tabs}
        accentColor="indigo"
        className="min-w-0"
      >
        <Card className="border-border-default rounded-xl border bg-white p-4 shadow-sm md:p-5">
          <Tabs
            value={activeTab}
            onValueChange={(v) => setActiveTab(v as any)}
            className="space-y-4"
          >
            {/* cabinetSurface v1 */}
            <TabsList
              className={cn(cabinetSurface.tabsList, 'scrollbar-hide flex-wrap overflow-x-auto')}
            >
              <AnimatePresence mode="wait">
                {activeGroup === 'profile' && (
                  <motion.div
                    key="profile-tabs"
                    initial={{ opacity: 0, x: -4 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 4 }}
                    className="flex flex-wrap items-center gap-1.5"
                  >
                    <TabsTrigger
                      value="brand"
                      className={cn(
                        cabinetSurface.tabsTrigger,
                        'h-10 min-h-10 gap-2 px-4 text-[11px] font-bold normal-case tracking-wide'
                      )}
                    >
                      <Building2 className="h-4 w-4 shrink-0" /> Бренд
                    </TabsTrigger>
                    <TabsTrigger
                      value="legal"
                      className={cn(
                        cabinetSurface.tabsTrigger,
                        'h-10 min-h-10 gap-2 px-4 text-[11px] font-bold normal-case tracking-wide'
                      )}
                    >
                      <FileText className="h-4 w-4 shrink-0" /> Юр. данные
                    </TabsTrigger>
                    <TabsTrigger
                      value="certificates"
                      className={cn(
                        cabinetSurface.tabsTrigger,
                        'h-10 min-h-10 gap-2 px-4 text-[11px] font-bold normal-case tracking-wide'
                      )}
                    >
                      <Award className="h-4 w-4 shrink-0" /> Сертификаты
                    </TabsTrigger>
                    <TabsTrigger
                      value="presskit"
                      className={cn(
                        cabinetSurface.tabsTrigger,
                        'h-10 min-h-10 gap-2 px-4 text-[11px] font-bold normal-case tracking-wide'
                      )}
                    >
                      <Newspaper className="h-4 w-4 shrink-0" /> Press Kit
                    </TabsTrigger>
                  </motion.div>
                )}

                {activeGroup === 'b2b' && (
                  <motion.div
                    key="b2b-tabs"
                    initial={{ opacity: 0, y: 2 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -2 }}
                    className="flex flex-wrap items-center gap-1.5"
                  >
                    <TabsTrigger
                      value="commerce"
                      className={cn(
                        cabinetSurface.tabsTrigger,
                        'h-10 min-h-10 gap-2 px-4 text-[11px] font-bold normal-case tracking-wide'
                      )}
                    >
                      <Package className="h-4 w-4 shrink-0" /> Коммерция
                    </TabsTrigger>
                  </motion.div>
                )}
              </AnimatePresence>
            </TabsList>

            {/* Brand Tab — информация о бренде + контакты */}
            <TabsContent value="brand" className="space-y-6 outline-none">
              {/* Информация о бренде */}
              <div className="space-y-2">
                <div className="flex items-center justify-between px-1">
                  <div className="flex flex-col gap-0.5">
                    <div className="flex items-center gap-1.5">
                      <div className="bg-accent-primary h-1 w-5 shrink-0 rounded-full" />
                      <h2 className="text-text-muted text-[10px] font-bold uppercase tracking-widest">
                        Информация о бренде
                      </h2>
                    </div>
                    <p className="text-text-secondary pl-6 text-[9px]">
                      Название, лого, шоурум, адреса, сайт и соцсети
                    </p>
                  </div>
                  {canEditProfile && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-7 gap-1 text-[9px] font-bold uppercase"
                      onClick={() => setIsEditing(!isEditing)}
                    >
                      <Edit className="h-3 w-3" /> Редактировать данные
                    </Button>
                  )}
                </div>
                <Card className="border-border-subtle space-y-4 rounded-xl border bg-white p-4 shadow-sm">
                  {/* Название + Логотипы (несколько, основной отмечен) */}
                  <div className="flex flex-wrap items-start gap-4">
                    <div>
                      <p className="text-text-muted mb-1 text-[8px] font-bold uppercase tracking-widest">
                        Название
                      </p>
                      {isEditing ? (
                        <Input
                          value={brand.nameRU || brand.name}
                          onChange={(e) =>
                            setBrand((prev) => ({ ...prev, nameRU: e.target.value }))
                          }
                          className="h-8 w-48 text-sm font-bold"
                        />
                      ) : (
                        <p className="text-text-primary text-base font-bold">
                          {brand.nameRU || brand.name}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-3">
                      {brandInfo.logos
                        .filter((l) => l.url)
                        .map((logo) => (
                          <div key={logo.id} className="relative">
                            <div
                              className={cn(
                                'bg-bg-surface2 h-16 w-16 overflow-hidden rounded-xl border-2',
                                logo.isMain
                                  ? 'border-accent-primary/40 ring-accent-primary/20 ring-2'
                                  : 'border-border-default'
                              )}
                            >
                              <Image
                                src={logo.url}
                                alt="Logo"
                                width={64}
                                height={64}
                                className="h-full w-full object-cover"
                              />
                            </div>
                            {logo.isMain && (
                              <Badge className="absolute -right-1 -top-1 h-4 px-1 text-[7px]">
                                Осн.
                              </Badge>
                            )}
                            {isEditing && (
                              <div className="mt-1 flex gap-0.5">
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  className="h-6 px-2 text-[8px] font-bold"
                                  onClick={() =>
                                    setBrandInfo((prev) => ({
                                      ...prev,
                                      logos: prev.logos.map((l) =>
                                        l.id === logo.id
                                          ? { ...l, isMain: true }
                                          : { ...l, isMain: false }
                                      ),
                                    }))
                                  }
                                >
                                  Сделать основным
                                </Button>
                              </div>
                            )}
                          </div>
                        ))}
                      {brandInfo.logos.some((l) => !l.url) && (
                        <div className="border-border-default bg-bg-surface2 hover:border-accent-primary/30 flex h-16 w-16 cursor-pointer items-center justify-center rounded-xl border-2 border-dashed">
                          <span className="text-text-muted text-[9px] font-bold">+ Лого</span>
                        </div>
                      )}
                      {isEditing && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-7 gap-1 text-[9px] font-bold uppercase"
                          onClick={() =>
                            setBrandInfo((prev) => ({
                              ...prev,
                              logos: [
                                ...prev.logos,
                                {
                                  id: `logo-${Date.now()}`,
                                  url: '',
                                  isMain: prev.logos.every((l) => !l.isMain),
                                },
                              ],
                            }))
                          }
                        >
                          <Plus className="h-3 w-3" /> Добавить лого
                        </Button>
                      )}
                    </div>
                  </div>

                  {/* Шоурум: полный адрес, название, центр — карта, справа — телефон, сайт, график */}
                  {brandInfo.showroom.hasShowroom && (
                    <div className="border-border-subtle space-y-2 border-t pt-3">
                      <p className="text-text-muted mb-0.5 text-[8px] font-bold uppercase tracking-widest">
                        Шоурум
                      </p>
                      <p className="text-text-secondary mb-2 text-[9px]">
                        Адрес, контакты, график работы
                      </p>
                      <div className="border-border-subtle bg-bg-surface2/80 flex flex-wrap items-center gap-3 rounded-lg border p-3">
                        <div className="min-w-[180px] flex-1">
                          <p className="text-text-primary text-[11px] font-bold">
                            {((brandInfo.showroom as Record<string, unknown>).name as string) ||
                              'Шоурум'}
                          </p>
                          {isEditing ? (
                            <div className="mt-1 space-y-1">
                              <Input
                                value={
                                  (brandInfo.showroom as Record<string, unknown>).name as string
                                }
                                onChange={(e) =>
                                  setBrandInfo((prev) => ({
                                    ...prev,
                                    showroom: { ...prev.showroom, name: e.target.value },
                                  }))
                                }
                                placeholder="Название"
                                className="h-7 text-[11px]"
                              />
                              <Input
                                value={brandInfo.showroom.address}
                                onChange={(e) =>
                                  setBrandInfo((prev) => ({
                                    ...prev,
                                    showroom: { ...prev.showroom, address: e.target.value },
                                  }))
                                }
                                placeholder="Полный адрес"
                                className="h-7 text-[11px]"
                              />
                              <Input
                                value={
                                  (brandInfo.showroom as Record<string, unknown>).phone as string
                                }
                                onChange={(e) =>
                                  setBrandInfo((prev) => ({
                                    ...prev,
                                    showroom: { ...prev.showroom, phone: e.target.value },
                                  }))
                                }
                                placeholder="Телефон"
                                className="h-7 text-[11px]"
                              />
                              <Input
                                value={
                                  (brandInfo.showroom as Record<string, unknown>).site as string
                                }
                                onChange={(e) =>
                                  setBrandInfo((prev) => ({
                                    ...prev,
                                    showroom: { ...prev.showroom, site: e.target.value },
                                  }))
                                }
                                placeholder="Сайт"
                                className="h-7 text-[11px]"
                              />
                              <Input
                                value={
                                  (brandInfo.showroom as Record<string, unknown>)
                                    .yandexMapUrl as string
                                }
                                onChange={(e) =>
                                  setBrandInfo((prev) => ({
                                    ...prev,
                                    showroom: { ...prev.showroom, yandexMapUrl: e.target.value },
                                  }))
                                }
                                placeholder="Ссылка на карту"
                                className="h-7 text-[11px]"
                              />
                            </div>
                          ) : (
                            <p className="text-text-primary mt-0.5 text-[11px]">
                              {brandInfo.showroom.address}
                            </p>
                          )}
                        </div>
                        <div className="flex shrink-0 items-center gap-2">
                          {(brandInfo.showroom as Record<string, unknown>).yandexMapUrl && (
                            <a
                              href={
                                (brandInfo.showroom as Record<string, unknown>)
                                  .yandexMapUrl as string
                              }
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <Button
                                variant="outline"
                                size="sm"
                                className="h-8 gap-1.5 text-[10px] font-bold"
                              >
                                <MapPin className="h-3.5 w-3.5" /> Открыть на карте
                              </Button>
                            </a>
                          )}
                        </div>
                        <div className="flex shrink-0 flex-wrap items-center gap-2">
                          {(brandInfo.showroom as Record<string, unknown>).phone && (
                            <a
                              href={`tel:${(brandInfo.showroom as Record<string, unknown>).phone}`}
                            >
                              <Button
                                variant="outline"
                                size="sm"
                                className="h-8 gap-1.5 text-[10px] font-bold"
                              >
                                <Phone className="h-3.5 w-3.5" /> Телефон
                              </Button>
                            </a>
                          )}
                          {(brandInfo.showroom as Record<string, unknown>).site && (
                            <a
                              href={(brandInfo.showroom as Record<string, unknown>).site as string}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <Button
                                variant="outline"
                                size="sm"
                                className="h-8 gap-1.5 text-[10px] font-bold"
                              >
                                <ExternalLink className="h-3.5 w-3.5" /> Сайт
                              </Button>
                            </a>
                          )}
                          <TooltipProvider delayDuration={200}>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="h-8 gap-1.5 text-[10px] font-bold"
                                >
                                  <Clock className="h-3.5 w-3.5" /> График работы
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent side="top" className="max-w-[240px] p-2 text-[10px]">
                                {formatHoursCompact(brandInfo.showroom.workingHours)}
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                      </div>
                      {isEditing && (
                        <div className="flex flex-wrap gap-3 pl-3 text-[11px]">
                          <div className="flex items-center gap-1.5">
                            <span className="text-text-secondary">Основан:</span>
                            <Input
                              type="number"
                              value={brand.foundedYear}
                              onChange={(e) =>
                                setBrand((prev) => ({
                                  ...prev,
                                  foundedYear: parseInt(e.target.value, 10) || prev.foundedYear,
                                }))
                              }
                              className="h-6 w-14 text-[11px]"
                            />
                          </div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-text-secondary">Страна:</span>
                            <Input
                              value={brand.countryOfOrigin}
                              onChange={(e) =>
                                setBrand((prev) => ({ ...prev, countryOfOrigin: e.target.value }))
                              }
                              className="h-6 w-24 text-[11px]"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Сайт, соцсети — после шоурума, до точек продаж */}
                  <div className="border-border-subtle space-y-2 border-t pt-3">
                    <p className="text-text-muted mb-1 text-[8px] font-bold uppercase tracking-widest">
                      Сайт и соцсети
                    </p>
                    {contacts.isSocialSync && (
                      <div className="mb-2 flex items-center gap-2 text-[9px] font-medium text-emerald-600">
                        <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-emerald-100">
                          <CheckCircle2 className="h-2.5 w-2.5 text-emerald-600" />
                        </span>
                        <span className="text-text-secondary">
                          Ссылки на сайт и соцсети, синхронизированы с профилем
                        </span>
                        <RefreshCcw className="h-3.5 w-3.5 shrink-0 text-emerald-600" />
                      </div>
                    )}
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                      <div>
                        <p className="text-text-muted mb-1 text-[8px] font-bold uppercase tracking-widest">
                          Сайт
                        </p>
                        {isEditing ? (
                          <Input
                            value={contacts.website}
                            onChange={(e) =>
                              setContacts((prev) => ({ ...prev, website: e.target.value }))
                            }
                            className="h-8 text-[11px]"
                          />
                        ) : (
                          <a
                            href={contacts.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-accent-primary text-[11px] font-medium hover:underline"
                          >
                            {contacts.website}
                          </a>
                        )}
                      </div>
                      {[
                        {
                          key: 'instagram',
                          label: 'Instagram',
                          value: contacts.instagram,
                          icon: Instagram,
                        },
                        {
                          key: 'twitter',
                          label: 'Twitter / X',
                          value: contacts.twitter,
                          icon: Twitter,
                        },
                        {
                          key: 'tiktok',
                          label: 'TikTok',
                          value: (contacts as Record<string, string>).tiktok || '',
                          icon: Video,
                        },
                        {
                          key: 'youtube',
                          label: 'YouTube',
                          value: (contacts as Record<string, string>).youtube || '',
                          icon: Video,
                        },
                      ]
                        .filter((item) => isEditing || item.value)
                        .map((item) => (
                          <div key={item.key}>
                            <p className="text-text-muted mb-1 text-[8px] font-bold uppercase tracking-widest">
                              {item.label}
                            </p>
                            {isEditing ? (
                              <Input
                                value={item.value}
                                onChange={(e) =>
                                  setContacts((prev) => ({ ...prev, [item.key]: e.target.value }))
                                }
                                className="h-8 text-[11px]"
                              />
                            ) : (
                              <p className="text-text-primary text-[11px] font-medium">
                                {item.value}
                              </p>
                            )}
                          </div>
                        ))}
                    </div>
                  </div>

                  {/* Адреса магазинов: полный адрес, название, центр — карта, справа — телефон, сайт, график (синхр. с профилем магазина) */}
                  <div className="border-border-subtle border-t pt-3">
                    <div className="mb-2 flex items-center justify-between">
                      <div>
                        <p className="text-text-muted mb-0.5 text-[8px] font-bold uppercase tracking-widest">
                          Адреса магазинов
                        </p>
                        <p className="text-text-secondary text-[9px]">
                          Филиалы и точки продаж. График, сайт, соцсети — магазины добавляют после
                          синхронизации и подтверждения, что бренд там продаётся.
                        </p>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-7 shrink-0 gap-1 text-[9px] font-bold"
                        onClick={() =>
                          setBrandInfo((prev) => ({
                            ...prev,
                            storeAddresses: [
                              ...prev.storeAddresses,
                              {
                                id: `addr-${Date.now()}`,
                                name: 'Новый магазин',
                                fullAddress: '',
                                phone: '',
                                site: '',
                                yandexMapUrl: '',
                                workingHours: {
                                  mon: '',
                                  tue: '',
                                  wed: '',
                                  thu: '',
                                  fri: '',
                                  sat: '',
                                  sun: '',
                                },
                                isSynced: false,
                              },
                            ],
                          }))
                        }
                      >
                        <Plus className="h-3 w-3" /> Добавить магазины
                      </Button>
                    </div>
                    <div className="bg-accent-primary/15 border-accent-primary/20 text-text-secondary mb-3 space-y-1 rounded-lg border p-2.5 text-[9px]">
                      <p>
                        <strong>Синхронизация стоков:</strong> сток бренда + сток магазина =
                        суммарно в наличии. В карточке товара показывается наличие, отметка
                        «выбранный размер есть в [магазин] — можно примерить».
                      </p>
                    </div>
                    <div
                      className={cn(
                        'space-y-3',
                        brandInfo.storeAddresses.length > 2 &&
                          'scrollbar-hide max-h-[320px] overflow-y-auto pr-1'
                      )}
                    >
                      {brandInfo.storeAddresses.map((addr) => (
                        <div
                          key={addr.id}
                          className="border-border-subtle bg-bg-surface2/80 flex flex-wrap items-center gap-3 rounded-lg border p-3"
                        >
                          <div className="min-w-[180px] flex-1">
                            {isEditing ? (
                              <div className="space-y-1">
                                <Input
                                  value={addr.name}
                                  onChange={(e) =>
                                    setBrandInfo((prev) => ({
                                      ...prev,
                                      storeAddresses: prev.storeAddresses.map((a) =>
                                        a.id === addr.id ? { ...a, name: e.target.value } : a
                                      ),
                                    }))
                                  }
                                  placeholder="Название магазина"
                                  className="h-7 text-[11px]"
                                />
                                <Input
                                  value={addr.fullAddress}
                                  onChange={(e) =>
                                    setBrandInfo((prev) => ({
                                      ...prev,
                                      storeAddresses: prev.storeAddresses.map((a) =>
                                        a.id === addr.id ? { ...a, fullAddress: e.target.value } : a
                                      ),
                                    }))
                                  }
                                  placeholder="Полный адрес"
                                  className="h-7 text-[11px]"
                                />
                                <Input
                                  value={addr.phone}
                                  onChange={(e) =>
                                    setBrandInfo((prev) => ({
                                      ...prev,
                                      storeAddresses: prev.storeAddresses.map((a) =>
                                        a.id === addr.id ? { ...a, phone: e.target.value } : a
                                      ),
                                    }))
                                  }
                                  placeholder="Телефон"
                                  className="h-7 text-[11px]"
                                />
                                <Input
                                  value={addr.site}
                                  onChange={(e) =>
                                    setBrandInfo((prev) => ({
                                      ...prev,
                                      storeAddresses: prev.storeAddresses.map((a) =>
                                        a.id === addr.id ? { ...a, site: e.target.value } : a
                                      ),
                                    }))
                                  }
                                  placeholder="Сайт"
                                  className="h-7 text-[11px]"
                                />
                                <Input
                                  value={addr.yandexMapUrl}
                                  onChange={(e) =>
                                    setBrandInfo((prev) => ({
                                      ...prev,
                                      storeAddresses: prev.storeAddresses.map((a) =>
                                        a.id === addr.id
                                          ? { ...a, yandexMapUrl: e.target.value }
                                          : a
                                      ),
                                    }))
                                  }
                                  placeholder="Ссылка на карту"
                                  className="h-7 text-[11px]"
                                />
                              </div>
                            ) : (
                              <>
                                <p className="text-text-primary text-[11px] font-bold">
                                  {addr.name}
                                </p>
                                <p className="text-text-primary mt-0.5 text-[11px]">
                                  {addr.fullAddress}
                                </p>
                                {addr.isSynced && (
                                  <span className="mt-1.5 inline-flex items-center gap-1 text-[9px] text-emerald-600">
                                    <CheckCircle2 className="h-3 w-3" /> Синхронизировано с профилем
                                    магазина
                                  </span>
                                )}
                              </>
                            )}
                          </div>
                          <div className="flex shrink-0 items-center gap-2">
                            {addr.yandexMapUrl && (
                              <a href={addr.yandexMapUrl} target="_blank" rel="noopener noreferrer">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="h-8 gap-1.5 text-[10px] font-bold"
                                >
                                  <MapPin className="h-3.5 w-3.5" /> Открыть на карте
                                </Button>
                              </a>
                            )}
                          </div>
                          <div className="flex shrink-0 flex-wrap items-center gap-2">
                            {addr.phone && (
                              <a href={`tel:${addr.phone}`}>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="h-8 gap-1.5 text-[10px] font-bold"
                                >
                                  <Phone className="h-3.5 w-3.5" /> Телефон
                                </Button>
                              </a>
                            )}
                            {addr.site && (
                              <a href={addr.site} target="_blank" rel="noopener noreferrer">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="h-8 gap-1.5 text-[10px] font-bold"
                                >
                                  <ExternalLink className="h-3.5 w-3.5" /> Сайт
                                </Button>
                              </a>
                            )}
                            <TooltipProvider delayDuration={200}>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="h-8 gap-1.5 text-[10px] font-bold"
                                  >
                                    <Clock className="h-3.5 w-3.5" /> График работы
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent
                                  side="top"
                                  className="max-w-[240px] p-2 text-[10px]"
                                >
                                  {formatHoursCompact(addr.workingHours)}
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                            {isEditing && (
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 text-[9px] text-rose-600"
                                onClick={() =>
                                  setBrandInfo((prev) => ({
                                    ...prev,
                                    storeAddresses: prev.storeAddresses.filter(
                                      (a) => a.id !== addr.id
                                    ),
                                  }))
                                }
                              >
                                <X className="h-3 w-3" />
                              </Button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Интернет-магазины: где продаётся бренд, ссылки на товар, парсинг цен */}
                  <div className="border-border-subtle border-t pt-3">
                    <div className="mb-2 flex items-center justify-between">
                      <div>
                        <p className="text-text-muted mb-0.5 text-[8px] font-bold uppercase tracking-widest">
                          Интернет-магазины
                        </p>
                        <p className="text-text-secondary text-[9px]">
                          Выберите из участников платформы или добавьте вручную. Магазин сможет
                          подтвердить связь после регистрации. Парсинг цен, суммарный сток.
                        </p>
                      </div>
                      <Button
                        asChild
                        variant="ghost"
                        size="sm"
                        className="text-accent-primary h-7 text-[9px] font-bold"
                      >
                        <Link href={ROUTES.brand.pricingPriceComparison}>Сравнение цен →</Link>
                      </Button>
                    </div>
                    <div className="space-y-2">
                      {brandInfo.onlineStores.map((store) => (
                        <div
                          key={store.id}
                          className="border-border-subtle bg-bg-surface2/80 flex flex-wrap items-center gap-3 rounded-lg border p-3"
                        >
                          <div className="min-w-[120px] flex-1">
                            {isEditing ? (
                              <div className="space-y-1">
                                <Input
                                  value={store.name}
                                  onChange={(e) =>
                                    setBrandInfo((prev) => ({
                                      ...prev,
                                      onlineStores: prev.onlineStores.map((s) =>
                                        s.id === store.id ? { ...s, name: e.target.value } : s
                                      ),
                                    }))
                                  }
                                  placeholder="Название (WB, Ozon...)"
                                  className="h-7 text-[11px]"
                                />
                                <Input
                                  value={store.productUrl}
                                  onChange={(e) =>
                                    setBrandInfo((prev) => ({
                                      ...prev,
                                      onlineStores: prev.onlineStores.map((s) =>
                                        s.id === store.id ? { ...s, productUrl: e.target.value } : s
                                      ),
                                    }))
                                  }
                                  placeholder="Ссылка на товары бренда"
                                  className="h-7 text-[11px]"
                                />
                              </div>
                            ) : (
                              <>
                                <div className="flex flex-wrap items-center gap-1.5">
                                  <p className="text-text-primary text-[11px] font-bold">
                                    {store.name}
                                  </p>
                                  {store.platformShopId &&
                                    (store.syncStatus === 'confirmed' ? (
                                      <Badge
                                        variant="outline"
                                        className="h-4 border-emerald-200 bg-emerald-50 px-1 text-[8px] text-emerald-700"
                                      >
                                        <CheckCircle2 className="mr-0.5 h-2.5 w-2.5" /> Синхр.
                                      </Badge>
                                    ) : (
                                      <Badge
                                        variant="outline"
                                        className="h-4 border-amber-200 bg-amber-50 px-1 text-[8px] text-amber-700"
                                      >
                                        Ожидает подтверждения
                                      </Badge>
                                    ))}
                                </div>
                                <a
                                  href={store.productUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-accent-primary mt-0.5 block max-w-[280px] truncate text-[10px] hover:underline"
                                >
                                  {store.productUrl}
                                </a>
                              </>
                            )}
                          </div>
                          <div className="flex shrink-0 items-center gap-2">
                            {store.productUrl && (
                              <a href={store.productUrl} target="_blank" rel="noopener noreferrer">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="h-8 gap-1.5 text-[10px] font-bold"
                                >
                                  <ExternalLink className="h-3.5 w-3.5" /> Товар
                                </Button>
                              </a>
                            )}
                            <Badge
                              variant={store.parsingEnabled ? 'default' : 'secondary'}
                              className="h-6 text-[9px]"
                            >
                              {store.parsingEnabled ? 'Парсинг вкл.' : 'Парсинг выкл.'}
                            </Badge>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-text-secondary h-8 text-[10px]"
                              onClick={() => {
                                const s = brandInfo.onlineStores.find((x) => x.id === store.id);
                                if (s) {
                                  const upd = brandInfo.onlineStores.map((x) =>
                                    x.id === store.id
                                      ? { ...x, parsingEnabled: !x.parsingEnabled }
                                      : x
                                  );
                                  setBrandInfo((prev) => ({ ...prev, onlineStores: upd }));
                                  toast({
                                    title: s.parsingEnabled
                                      ? 'Парсинг выключен'
                                      : 'Парсинг включён',
                                  });
                                }
                              }}
                            >
                              {store.parsingEnabled ? 'Выкл.' : 'Вкл.'}
                            </Button>
                            {isEditing && (
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 text-[9px] text-rose-600"
                                onClick={() =>
                                  setBrandInfo((prev) => ({
                                    ...prev,
                                    onlineStores: prev.onlineStores.filter(
                                      (s) => s.id !== store.id
                                    ),
                                  }))
                                }
                              >
                                <X className="h-3 w-3" />
                              </Button>
                            )}
                          </div>
                        </div>
                      ))}
                      {isEditing && (
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-7 gap-1 text-[9px] font-bold"
                            >
                              <Plus className="h-3 w-3" /> Добавить интернет-магазин{' '}
                              <ChevronDown className="h-3 w-3" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="start">
                            <DropdownMenuItem onClick={() => setOnlineStorePickerOpen(true)}>
                              <Store className="mr-2 h-3.5 w-3.5" /> Выбрать из участников платформы
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() =>
                                setBrandInfo((prev) => ({
                                  ...prev,
                                  onlineStores: [
                                    ...prev.onlineStores,
                                    {
                                      id: `os-${Date.now()}`,
                                      name: '',
                                      productUrl: '',
                                      parsingEnabled: false,
                                      syncStatus: 'manual' as const,
                                    },
                                  ],
                                }))
                              }
                            >
                              <Plus className="mr-2 h-3.5 w-3.5" /> Добавить вручную (название и
                              ссылка)
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      )}
                      <OnlineStorePickerDialog
                        open={onlineStorePickerOpen}
                        onOpenChange={setOnlineStorePickerOpen}
                        excludeIds={
                          brandInfo.onlineStores
                            .map((s) => s.platformShopId)
                            .filter(Boolean) as string[]
                        }
                        onSelect={(shop) => {
                          setBrandInfo((prev) => ({
                            ...prev,
                            onlineStores: [
                              ...prev.onlineStores,
                              {
                                id: `os-${Date.now()}`,
                                name: shop.name,
                                productUrl: shop.productUrl || shop.website || '',
                                parsingEnabled: false,
                                platformShopId: shop.id,
                                syncStatus: 'linked' as const,
                              },
                            ],
                          }));
                          toast({
                            title: 'Добавлено',
                            description: `Магазин «${shop.name}» получит запрос на подтверждение синхронизации.`,
                          });
                        }}
                      />
                    </div>
                  </div>
                </Card>
              </div>

              {/* Контакты: Telegram, WhatsApp, почта, телефон, кнопка Редактировать, + добавить */}
              <div className="space-y-2">
                <div className="flex items-center justify-between px-1">
                  <div className="flex items-center gap-1.5">
                    <div className="h-1 w-5 rounded-full bg-emerald-600" />
                    <div>
                      <h2 className="text-text-muted text-[10px] font-bold uppercase tracking-widest">
                        Контакты и доступ
                      </h2>
                      <p className="text-text-secondary mt-0.5 text-[9px]">
                        Почта, телефон, Telegram, WhatsApp
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {contacts.isEmailVerified && (
                      <Badge className="h-5 gap-1 border border-emerald-100 bg-emerald-50 px-2 text-[8px] font-bold uppercase text-emerald-600">
                        <CheckCircle2 className="h-3 w-3" /> Sync Active
                      </Badge>
                    )}
                    {canEditProfile && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-7 gap-1 text-[9px] font-bold uppercase"
                        onClick={() => setIsEditing(!isEditing)}
                      >
                        <Edit className="h-3 w-3" /> Редактировать данные
                      </Button>
                    )}
                  </div>
                </div>
                <Card className="border-border-subtle space-y-4 rounded-xl border bg-white p-4 shadow-sm">
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <p className="text-text-muted text-[8px] font-bold uppercase tracking-widest">
                        Почта в проекте
                      </p>
                      <div className="bg-bg-surface2 flex items-center gap-2 rounded-lg p-2">
                        <Mail className="text-accent-primary h-4 w-4" />
                        <span className="text-text-primary text-[12px] font-bold">
                          {brand.slug || brand.name?.toLowerCase().replace(/\s/g, '_') || 'brand'}
                          @syntha.pro
                        </span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <p className="text-text-muted text-[8px] font-bold uppercase tracking-widest">
                        Логин на портале
                      </p>
                      {isEditing ? (
                        <Input
                          value={brandInfo.portalLogin}
                          onChange={(e) =>
                            setBrandInfo((prev) => ({ ...prev, portalLogin: e.target.value }))
                          }
                          className="h-9 font-mono"
                        />
                      ) : (
                        <p className="text-text-primary font-mono text-[12px] font-bold">
                          {brandInfo.portalLogin}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="border-border-subtle space-y-3 border-t pt-3">
                    <div>
                      <p className="text-text-muted mb-1 text-[8px] font-bold uppercase tracking-widest">
                        Контакты — подпись что за канал, для чего
                      </p>
                      <p className="text-text-secondary text-[9px]">
                        У каждого номера/почты укажите назначение: Пресса, B2B, Поддержка, Общий,
                        Маркетинг и т.д.
                      </p>
                      {isEditing && (
                        <div className="mt-2 flex flex-wrap gap-1">
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-6 gap-1 text-[8px] font-bold"
                            onClick={() =>
                              setBrandContacts((prev) => ({
                                ...prev,
                                emails: [...prev.emails, { value: '', label: 'Общий' }],
                              }))
                            }
                          >
                            <Plus className="h-2.5 w-2.5" /> Почта
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-6 gap-1 text-[8px] font-bold"
                            onClick={() =>
                              setBrandContacts((prev) => ({
                                ...prev,
                                phones: [...prev.phones, { value: '', label: 'Общий' }],
                              }))
                            }
                          >
                            <Plus className="h-2.5 w-2.5" /> Телефон
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-6 gap-1 text-[8px] font-bold"
                            onClick={() =>
                              setBrandContacts((prev) => ({
                                ...prev,
                                telegrams: [...prev.telegrams, { value: '', label: 'Общий' }],
                              }))
                            }
                          >
                            <Plus className="h-2.5 w-2.5" /> Telegram
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-6 gap-1 text-[8px] font-bold"
                            onClick={() =>
                              setBrandContacts((prev) => ({
                                ...prev,
                                whatsapps: [...prev.whatsapps, { value: '', label: 'B2B' }],
                              }))
                            }
                          >
                            <Plus className="h-2.5 w-2.5" /> WhatsApp
                          </Button>
                        </div>
                      )}
                    </div>
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                      {brandContacts.telegrams.map((item, i) => (
                        <div
                          key={`tg-${i}`}
                          className="bg-bg-surface2 flex flex-col gap-1.5 rounded-lg p-3"
                        >
                          <div className="flex items-center gap-2">
                            <MessageSquare className="text-text-secondary h-4 w-4 shrink-0" />
                            {isEditing ? (
                              <>
                                <Input
                                  value={item.label}
                                  onChange={(e) =>
                                    setBrandContacts((prev) => ({
                                      ...prev,
                                      telegrams: prev.telegrams.map((x, j) =>
                                        j === i ? { ...x, label: e.target.value } : x
                                      ),
                                    }))
                                  }
                                  placeholder="Напр. Пресса, B2B"
                                  className="h-7 w-24 shrink-0 text-[10px]"
                                />
                                <Input
                                  value={item.value}
                                  onChange={(e) =>
                                    setBrandContacts((prev) => ({
                                      ...prev,
                                      telegrams: prev.telegrams.map((x, j) =>
                                        j === i ? { ...x, value: e.target.value } : x
                                      ),
                                    }))
                                  }
                                  placeholder="@username"
                                  className="h-7 flex-1 text-[11px]"
                                />
                              </>
                            ) : (
                              <>
                                <span className="text-text-secondary text-[9px] font-bold uppercase">
                                  {item.label}
                                </span>
                                {item.value ? (
                                  <a
                                    href={`https://t.me/${item.value.replace(/^@/, '')}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="truncate text-[11px] font-medium text-blue-600 hover:underline"
                                  >
                                    {item.value}
                                  </a>
                                ) : (
                                  <p className="text-text-muted truncate text-[11px] font-medium">
                                    —
                                  </p>
                                )}
                              </>
                            )}
                          </div>
                          {isEditing && (
                            <button
                              type="button"
                              onClick={() =>
                                setBrandContacts((prev) => ({
                                  ...prev,
                                  telegrams: prev.telegrams.filter((_, j) => j !== i),
                                }))
                              }
                              className="text-text-muted self-start text-[9px] hover:text-rose-500"
                            >
                              <X className="inline h-3 w-3" /> Удалить
                            </button>
                          )}
                        </div>
                      ))}
                      {brandContacts.whatsapps.map((item, i) => (
                        <div
                          key={`wa-${i}`}
                          className="bg-bg-surface2 flex flex-col gap-1.5 rounded-lg p-3"
                        >
                          <div className="flex items-center gap-2">
                            <Phone className="text-text-secondary h-4 w-4 shrink-0" />
                            {isEditing ? (
                              <>
                                <Input
                                  value={item.label}
                                  onChange={(e) =>
                                    setBrandContacts((prev) => ({
                                      ...prev,
                                      whatsapps: prev.whatsapps.map((x, j) =>
                                        j === i ? { ...x, label: e.target.value } : x
                                      ),
                                    }))
                                  }
                                  placeholder="Напр. B2B, Пресса"
                                  className="h-7 w-24 shrink-0 text-[10px]"
                                />
                                <Input
                                  value={item.value}
                                  onChange={(e) =>
                                    setBrandContacts((prev) => ({
                                      ...prev,
                                      whatsapps: prev.whatsapps.map((x, j) =>
                                        j === i ? { ...x, value: e.target.value } : x
                                      ),
                                    }))
                                  }
                                  placeholder="+7..."
                                  className="h-7 flex-1 text-[11px]"
                                />
                              </>
                            ) : (
                              <>
                                <span className="text-text-secondary text-[9px] font-bold uppercase">
                                  {item.label}
                                </span>
                                {item.value ? (
                                  <a
                                    href={`https://wa.me/${item.value.replace(/\D/g, '')}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="truncate text-[11px] font-medium text-green-600 hover:underline"
                                  >
                                    {item.value}
                                  </a>
                                ) : (
                                  <p className="text-text-muted truncate text-[11px] font-medium">
                                    —
                                  </p>
                                )}
                              </>
                            )}
                          </div>
                          {isEditing && (
                            <button
                              type="button"
                              onClick={() =>
                                setBrandContacts((prev) => ({
                                  ...prev,
                                  whatsapps: prev.whatsapps.filter((_, j) => j !== i),
                                }))
                              }
                              className="text-text-muted self-start text-[9px] hover:text-rose-500"
                            >
                              <X className="inline h-3 w-3" /> Удалить
                            </button>
                          )}
                        </div>
                      ))}
                      {brandContacts.emails.map((item, i) => (
                        <div
                          key={`em-${i}`}
                          className="bg-bg-surface2 flex flex-col gap-1.5 rounded-lg p-3"
                        >
                          <div className="flex items-center gap-2">
                            <Mail className="text-text-secondary h-4 w-4 shrink-0" />
                            {isEditing ? (
                              <>
                                <Input
                                  value={item.label}
                                  onChange={(e) =>
                                    setBrandContacts((prev) => ({
                                      ...prev,
                                      emails: prev.emails.map((x, j) =>
                                        j === i ? { ...x, label: e.target.value } : x
                                      ),
                                    }))
                                  }
                                  placeholder="Напр. Общий"
                                  className="h-7 w-24 shrink-0 text-[10px]"
                                />
                                <Input
                                  value={item.value}
                                  onChange={(e) =>
                                    setBrandContacts((prev) => ({
                                      ...prev,
                                      emails: prev.emails.map((x, j) =>
                                        j === i ? { ...x, value: e.target.value } : x
                                      ),
                                    }))
                                  }
                                  placeholder="email@..."
                                  className="h-7 flex-1 text-[11px]"
                                />
                              </>
                            ) : (
                              <>
                                <span className="text-text-secondary text-[9px] font-bold uppercase">
                                  {item.label}
                                </span>
                                {item.value ? (
                                  <a
                                    href={`mailto:${item.value}`}
                                    className="truncate text-[11px] font-medium text-blue-600 hover:underline"
                                  >
                                    {item.value}
                                  </a>
                                ) : (
                                  <p className="text-text-muted truncate text-[11px] font-medium">
                                    —
                                  </p>
                                )}
                              </>
                            )}
                          </div>
                          {isEditing && (
                            <button
                              type="button"
                              onClick={() =>
                                setBrandContacts((prev) => ({
                                  ...prev,
                                  emails: prev.emails.filter((_, j) => j !== i),
                                }))
                              }
                              className="text-text-muted self-start text-[9px] hover:text-rose-500"
                            >
                              <X className="inline h-3 w-3" /> Удалить
                            </button>
                          )}
                        </div>
                      ))}
                      {brandContacts.phones.map((item, i) => (
                        <div
                          key={`ph-${i}`}
                          className="bg-bg-surface2 flex flex-col gap-1.5 rounded-lg p-3"
                        >
                          <div className="flex items-center gap-2">
                            <Phone className="text-text-secondary h-4 w-4 shrink-0" />
                            {isEditing ? (
                              <>
                                <Input
                                  value={item.label}
                                  onChange={(e) =>
                                    setBrandContacts((prev) => ({
                                      ...prev,
                                      phones: prev.phones.map((x, j) =>
                                        j === i ? { ...x, label: e.target.value } : x
                                      ),
                                    }))
                                  }
                                  placeholder="Напр. Пресса, B2B"
                                  className="h-7 w-24 shrink-0 text-[10px]"
                                />
                                <Input
                                  value={item.value}
                                  onChange={(e) =>
                                    setBrandContacts((prev) => ({
                                      ...prev,
                                      phones: prev.phones.map((x, j) =>
                                        j === i ? { ...x, value: e.target.value } : x
                                      ),
                                    }))
                                  }
                                  placeholder="+7..."
                                  className="h-7 flex-1 text-[11px]"
                                />
                              </>
                            ) : (
                              <>
                                <span className="text-text-secondary text-[9px] font-bold uppercase">
                                  {item.label}
                                </span>
                                {item.value ? (
                                  <a
                                    href={`tel:${item.value.replace(/\D/g, '')}`}
                                    className="truncate text-[11px] font-medium text-blue-600 hover:underline"
                                  >
                                    {item.value}
                                  </a>
                                ) : (
                                  <p className="text-text-muted truncate text-[11px] font-medium">
                                    —
                                  </p>
                                )}
                              </>
                            )}
                          </div>
                          {isEditing && (
                            <button
                              type="button"
                              onClick={() =>
                                setBrandContacts((prev) => ({
                                  ...prev,
                                  phones: prev.phones.filter((_, j) => j !== i),
                                }))
                              }
                              className="text-text-muted self-start text-[9px] hover:text-rose-500"
                            >
                              <X className="inline h-3 w-3" /> Удалить
                            </button>
                          )}
                        </div>
                      ))}
                      {brandContacts.externalEmails.map((item, i) => (
                        <div
                          key={`ext-${i}`}
                          className="bg-bg-surface2 flex flex-col gap-1.5 rounded-lg p-3"
                        >
                          <div className="flex items-center gap-2">
                            <Mail className="text-text-secondary h-4 w-4 shrink-0" />
                            {isEditing ? (
                              <>
                                <Input
                                  value={item.label}
                                  onChange={(e) =>
                                    setBrandContacts((prev) => ({
                                      ...prev,
                                      externalEmails: prev.externalEmails.map((x, j) =>
                                        j === i ? { ...x, label: e.target.value } : x
                                      ),
                                    }))
                                  }
                                  placeholder="Напр. Пресса, B2B"
                                  className="h-7 w-24 shrink-0 text-[10px]"
                                />
                                <Input
                                  value={item.value}
                                  onChange={(e) =>
                                    setBrandContacts((prev) => ({
                                      ...prev,
                                      externalEmails: prev.externalEmails.map((x, j) =>
                                        j === i ? { ...x, value: e.target.value } : x
                                      ),
                                    }))
                                  }
                                  placeholder="email@..."
                                  className="h-7 flex-1 text-[11px]"
                                />
                              </>
                            ) : (
                              <>
                                <span className="text-text-secondary text-[9px] font-bold uppercase">
                                  {item.label}
                                </span>
                                {item.value ? (
                                  <a
                                    href={`mailto:${item.value}`}
                                    className="truncate text-[11px] font-medium text-blue-600 hover:underline"
                                  >
                                    {item.value}
                                  </a>
                                ) : (
                                  <p className="text-text-muted truncate text-[11px] font-medium">
                                    —
                                  </p>
                                )}
                              </>
                            )}
                          </div>
                          {isEditing && (
                            <button
                              type="button"
                              onClick={() =>
                                setBrandContacts((prev) => ({
                                  ...prev,
                                  externalEmails: prev.externalEmails.filter((_, j) => j !== i),
                                }))
                              }
                              className="text-text-muted self-start text-[9px] hover:text-rose-500"
                            >
                              <X className="inline h-3 w-3" /> Удалить
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                    {isEditing && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-7 gap-1 text-[9px] font-bold"
                        onClick={() =>
                          setBrandContacts((prev) => ({
                            ...prev,
                            externalEmails: [...prev.externalEmails, { value: '', label: '' }],
                          }))
                        }
                      >
                        <Plus className="h-3 w-3" /> Добавить доп. почту
                      </Button>
                    )}
                  </div>
                </Card>
              </div>
            </TabsContent>

            {/* Commerce Tab */}
            <TabsContent value="commerce" className="space-y-4 outline-none">
              <div className="space-y-2">
                <div className="flex items-center gap-1.5 px-1">
                  <div className="bg-accent-primary h-1 w-5 rounded-full" />
                  <h2 className="text-text-muted text-[10px] font-bold uppercase tracking-widest">
                    Условия оптовой торговли
                  </h2>
                </div>
                <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
                  {[
                    {
                      key: 'moq',
                      label: 'Мин. заказ (MOQ)',
                      icon: Package,
                      color: 'bg-accent-primary/10',
                      text: 'text-accent-primary',
                    },
                    {
                      key: 'leadTime',
                      label: 'Срок производства',
                      icon: Clock,
                      color: 'bg-amber-50',
                      text: 'text-amber-600',
                    },
                    {
                      key: 'currency',
                      label: 'Валюта оплаты',
                      icon: DollarSign,
                      color: 'bg-emerald-50',
                      text: 'text-emerald-600',
                    },
                    {
                      key: 'shipping',
                      label: 'Условия доставки',
                      icon: Truck,
                      color: 'bg-blue-50',
                      text: 'text-blue-600',
                    },
                    {
                      key: 'productionCapacity',
                      label: 'Мощность производства',
                      icon: Zap,
                      color: 'bg-accent-primary/10',
                      text: 'text-accent-primary',
                    },
                    {
                      key: 'sampleDevelopment',
                      label: 'Срок изготовления сэмпла',
                      icon: Palette,
                      color: 'bg-rose-50',
                      text: 'text-rose-600',
                    },
                  ].map((item, i) => (
                    <Card
                      key={i}
                      className="border-border-subtle hover:border-accent-primary/20 group rounded-xl border bg-white p-4 shadow-sm transition-all"
                    >
                      <div className="mb-3 flex items-center gap-3">
                        <div
                          className={cn(
                            'flex h-8 w-8 items-center justify-center rounded-lg border border-transparent shadow-sm transition-transform group-hover:scale-110',
                            item.color,
                            item.text
                          )}
                        >
                          <item.icon className="h-4 w-4" />
                        </div>
                        <span className="text-text-muted text-[9px] font-bold uppercase tracking-widest">
                          {item.label}
                        </span>
                      </div>
                      {isEditing ? (
                        <Input
                          value={(commerceTerms as any)[item.key]}
                          onChange={(e) =>
                            setCommerceTerms((prev) => ({ ...prev, [item.key]: e.target.value }))
                          }
                          className="bg-bg-surface2 h-8 rounded-lg border-none text-[13px] font-bold uppercase shadow-inner"
                        />
                      ) : (
                        <p className="text-text-primary text-base font-bold tracking-tight">
                          {(commerceTerms as any)[item.key]}
                        </p>
                      )}
                    </Card>
                  ))}
                </div>
              </div>
              <div className="mt-4 space-y-2">
                <div className="flex items-center justify-between px-1">
                  <div className="h-1 w-5 rounded-full bg-emerald-600" />
                  <h2 className="text-text-muted text-[10px] font-bold uppercase tracking-widest">
                    Условия по тирам партнёров
                  </h2>
                  <Button
                    asChild
                    variant="ghost"
                    size="sm"
                    className="text-accent-primary h-6 text-[8px] font-bold"
                  >
                    <Link href={ROUTES.brand.pricing}>
                      Прайсинг <ArrowUpRight className="inline h-2.5 w-2.5" />
                    </Link>
                  </Button>
                </div>
                <Card className="border-border-subtle from-bg-surface2 to-bg-surface rounded-xl border bg-gradient-to-br p-4">
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { label: 'VIP', discount: '45%', color: 'bg-amber-50 border-amber-100' },
                      {
                        label: 'Retail',
                        discount: '40%',
                        color: 'bg-accent-primary/10 border-accent-primary/20',
                      },
                      {
                        label: 'Market',
                        discount: '50%',
                        color: 'bg-bg-surface2 border-border-subtle',
                      },
                    ].map((t) => (
                      <div key={t.label} className={cn('rounded-lg border p-3', t.color)}>
                        <p className="text-text-secondary text-[9px] font-bold uppercase">
                          {t.label}
                        </p>
                        <p className="text-text-primary text-sm font-black">{t.discount}</p>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
            </TabsContent>

            {/* Legal Tab */}
            <TabsContent value="legal" className="space-y-6 outline-none">
              <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
                {/* Регистрация компании Block */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between px-1">
                    <div className="flex items-center gap-1.5">
                      <div className="bg-accent-primary h-1 w-5 rounded-full" />
                      <h2 className="text-text-muted text-[10px] font-bold uppercase tracking-widest">
                        Регистрация компании
                      </h2>
                    </div>
                    <div className="flex items-center gap-2">
                      {legalData.isVerified ? (
                        <Badge className="h-5 gap-1 border border-emerald-100 bg-emerald-50 px-2 text-[8px] font-bold uppercase text-emerald-600 shadow-sm">
                          <CheckCircle2 className="h-3 w-3" /> Верифицировано ФНС
                        </Badge>
                      ) : (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleVerify('legal')}
                          disabled={isVerifying === 'legal'}
                          className="h-6 gap-1.5 rounded-lg bg-amber-50 px-2 text-[8px] font-bold uppercase text-amber-600"
                        >
                          <RotateCcw
                            className={cn('h-3 w-3', isVerifying === 'legal' && 'animate-spin')}
                          />{' '}
                          Verify Now
                        </Button>
                      )}
                    </div>
                  </div>
                  <Card className="border-border-subtle space-y-2 rounded-xl border bg-white p-4 shadow-sm">
                    {[
                      {
                        key: 'legalName',
                        label: 'Наименование',
                        value: legalData.legalName,
                        icon: Building2,
                      },
                      { key: 'inn', label: 'ИНН', value: legalData.inn, icon: FileText },
                      { key: 'kpp', label: 'КПП', value: legalData.kpp, icon: FileText },
                      { key: 'ogrn', label: 'ОГРН', value: legalData.ogrn, icon: FileText },
                      { key: 'okpo', label: 'ОКПО', value: legalData.okpo, icon: FileText },
                      { key: 'oktmo', label: 'ОКТМО', value: legalData.oktmo, icon: FileText },
                      { key: 'okved', label: 'ОКВЭД', value: legalData.okved, icon: FileText },
                      {
                        key: 'okvedDesc',
                        label: 'ОКВЭД (описание)',
                        value: legalData.okvedDesc,
                        icon: FileText,
                      },
                      {
                        key: 'foundingDate',
                        label: 'Дата регистрации',
                        value: legalData.foundingDate,
                        icon: Calendar,
                      },
                    ].map((item, i) => (
                      <div
                        key={i}
                        className="bg-bg-surface2 border-border-subtle/50 hover:bg-bg-surface2 group flex items-center justify-between rounded-lg border p-2.5 transition-colors"
                      >
                        <div className="flex items-center gap-2.5">
                          <div className="border-border-subtle flex h-7 w-7 items-center justify-center rounded-lg border bg-white shadow-sm transition-transform group-hover:scale-105">
                            <item.icon className="text-accent-primary h-3.5 w-3.5" />
                          </div>
                          <span className="text-text-muted text-[9px] font-bold uppercase tracking-widest">
                            {item.label}
                          </span>
                        </div>
                        {isEditing ? (
                          <Input
                            value={item.value}
                            onChange={(e) =>
                              setLegalData((prev) => ({ ...prev, [item.key]: e.target.value }))
                            }
                            className="border-border-default h-7 w-48 rounded-md bg-white text-right text-[11px] font-bold uppercase"
                          />
                        ) : (
                          <span className="text-text-primary text-[11px] font-bold uppercase tracking-tight">
                            {item.value}
                          </span>
                        )}
                      </div>
                    ))}
                  </Card>
                </div>

                {/* Management Block */}
                <div className="space-y-2">
                  <div className="flex items-center gap-1.5 px-1">
                    <div className="h-1 w-5 rounded-full bg-emerald-600" />
                    <h2 className="text-text-muted text-[10px] font-bold uppercase tracking-widest">
                      Руководство и полномочия
                    </h2>
                  </div>
                  <Card className="border-border-subtle flex h-full flex-col justify-center space-y-2 rounded-xl border bg-white p-4 shadow-sm">
                    {[
                      { key: 'ceo', label: 'CEO', value: legalData.ceo, icon: Users },
                      {
                        key: 'ceoPosition',
                        label: 'Должность',
                        value: legalData.ceoPosition,
                        icon: Briefcase,
                      },
                      {
                        key: 'registrationAuthority',
                        label: 'Рег. Орган',
                        value: legalData.registrationAuthority,
                        icon: ShieldCheck,
                      },
                      {
                        key: 'taxRegime',
                        label: 'Налоговый режим',
                        value: legalData.taxRegime,
                        icon: CreditCard,
                      },
                      {
                        key: 'authorizedCapital',
                        label: 'Уставной капитал',
                        value: legalData.authorizedCapital,
                        icon: DollarSign,
                      },
                    ].map((item, i) => (
                      <div
                        key={i}
                        className="bg-bg-surface2 border-border-subtle/50 hover:bg-bg-surface2 group flex items-center justify-between rounded-lg border p-2.5 transition-colors"
                      >
                        <div className="flex items-center gap-2.5">
                          <div className="border-border-subtle flex h-7 w-7 items-center justify-center rounded-lg border bg-white shadow-sm transition-transform group-hover:scale-105">
                            <item.icon className="h-3.5 w-3.5 text-emerald-600" />
                          </div>
                          <span className="text-text-muted text-[9px] font-bold uppercase tracking-widest">
                            {item.label}
                          </span>
                        </div>
                        {isEditing ? (
                          <Input
                            value={item.value}
                            onChange={(e) =>
                              setLegalData((prev) => ({ ...prev, [item.key]: e.target.value }))
                            }
                            className="border-border-default h-7 w-48 rounded-md bg-white text-right text-[11px] font-bold uppercase"
                          />
                        ) : (
                          <span className="text-text-primary max-w-[200px] truncate text-right text-[10px] font-bold uppercase tracking-tight">
                            {item.value}
                          </span>
                        )}
                      </div>
                    ))}
                  </Card>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-1 gap-3 lg:grid-cols-2">
                {/* Addresses Block */}
                <div className="space-y-2">
                  <div className="flex items-center gap-1.5 px-1">
                    <div className="h-1 w-5 rounded-full bg-blue-600" />
                    <h2 className="text-text-muted text-[10px] font-bold uppercase tracking-widest">
                      Адреса
                    </h2>
                  </div>
                  <Card className="border-border-subtle space-y-3 rounded-xl border bg-white p-4 shadow-sm">
                    {[
                      {
                        key: 'legalAddress',
                        label: 'Юридический адрес',
                        value: legalData.legalAddress,
                      },
                      {
                        key: 'actualAddress',
                        label: 'Фактический адрес',
                        value: legalData.actualAddress,
                      },
                    ].map((item, i) => (
                      <div key={i} className="space-y-1.5">
                        <div className="flex items-center gap-2">
                          <MapPin className="h-3 w-3 text-blue-600" />
                          <span className="text-text-muted text-[9px] font-bold uppercase tracking-widest">
                            {item.label}
                          </span>
                        </div>
                        {isEditing ? (
                          <Textarea
                            value={item.value}
                            onChange={(e) =>
                              setLegalData((prev) => ({ ...prev, [item.key]: e.target.value }))
                            }
                            className="bg-bg-surface2 border-border-default min-h-[60px] rounded-lg p-2 text-[11px] font-medium"
                          />
                        ) : (
                          <p className="text-text-primary bg-bg-surface2 border-border-subtle/50 rounded-lg border p-2.5 text-[12px] font-medium">
                            {item.value}
                          </p>
                        )}
                      </div>
                    ))}
                  </Card>
                </div>

                {/* Banking Block */}
                <div className="space-y-2">
                  <div className="flex items-center gap-1.5 px-1">
                    <div className="h-1 w-5 rounded-full bg-amber-600" />
                    <h2 className="text-text-muted text-[10px] font-bold uppercase tracking-widest">
                      Банковские реквизиты
                    </h2>
                  </div>
                  <Card className="border-border-subtle flex h-full flex-col justify-center rounded-xl border bg-white p-4 shadow-sm">
                    <div className="space-y-2">
                      {[
                        { key: 'bankName', label: 'Банк', value: legalData.bankName },
                        { key: 'bik', label: 'БИК', value: legalData.bik },
                        { key: 'corrAccount', label: 'Корр. счет', value: legalData.corrAccount },
                        { key: 'paymentAccount', label: 'Р/С', value: legalData.paymentAccount },
                      ].map((item, i) => (
                        <div
                          key={i}
                          className="border-border-subtle flex items-center justify-between border-b pb-2 last:border-0 last:pb-0"
                        >
                          <span className="text-text-muted text-[9px] font-bold uppercase tracking-widest">
                            {item.label}
                          </span>
                          {isEditing ? (
                            <Input
                              value={item.value}
                              onChange={(e) =>
                                setLegalData((prev) => ({ ...prev, [item.key]: e.target.value }))
                              }
                              className="bg-bg-surface2 h-6 w-48 rounded-md border-none text-right font-mono text-[10px] font-bold"
                            />
                          ) : (
                            <span className="text-text-primary font-mono text-[11px] font-bold tracking-tight">
                              {item.value}
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  </Card>
                </div>
              </div>

              {/* Доп. юр. информация: лицензии, доверенности, страхование */}
              <div className="mt-6 grid grid-cols-1 gap-3 lg:grid-cols-3">
                <Card className="border-border-subtle rounded-xl border bg-white p-4 shadow-sm">
                  <div className="mb-3 flex items-center gap-2">
                    <ShieldCheck className="text-accent-primary h-4 w-4" />
                    <h3 className="text-text-muted text-[10px] font-bold uppercase tracking-widest">
                      Лицензии
                    </h3>
                  </div>
                  {isEditing ? (
                    <Textarea
                      value={legalData.licenses}
                      onChange={(e) =>
                        setLegalData((prev) => ({ ...prev, licenses: e.target.value }))
                      }
                      className="min-h-[60px] text-[11px]"
                      placeholder="При необходимости"
                    />
                  ) : (
                    <p className="text-text-primary text-[11px] font-medium">
                      {legalData.licenses}
                    </p>
                  )}
                </Card>
                <Card className="border-border-subtle rounded-xl border bg-white p-4 shadow-sm">
                  <div className="mb-3 flex items-center gap-2">
                    <FileText className="h-4 w-4 text-emerald-600" />
                    <h3 className="text-text-muted text-[10px] font-bold uppercase tracking-widest">
                      Доверенности
                    </h3>
                  </div>
                  {isEditing ? (
                    <Textarea
                      value={legalData.powersOfAttorney}
                      onChange={(e) =>
                        setLegalData((prev) => ({ ...prev, powersOfAttorney: e.target.value }))
                      }
                      className="min-h-[60px] text-[11px]"
                      placeholder="Ген. доверенность, спец. доверенность"
                    />
                  ) : (
                    <p className="text-text-primary text-[11px] font-medium">
                      {legalData.powersOfAttorney}
                    </p>
                  )}
                </Card>
                <Card className="border-border-subtle rounded-xl border bg-white p-4 shadow-sm">
                  <div className="mb-3 flex items-center gap-2">
                    <Shield className="h-4 w-4 text-amber-600" />
                    <h3 className="text-text-muted text-[10px] font-bold uppercase tracking-widest">
                      Страхование
                    </h3>
                  </div>
                  {isEditing ? (
                    <Input
                      value={legalData.insurance}
                      onChange={(e) =>
                        setLegalData((prev) => ({ ...prev, insurance: e.target.value }))
                      }
                      className="h-8 text-[11px]"
                      placeholder="ОСАГО, ДМС, КАСКО"
                    />
                  ) : (
                    <p className="text-text-primary text-[11px] font-medium">
                      {legalData.insurance}
                    </p>
                  )}
                </Card>
              </div>
            </TabsContent>

            {/* Certificates Tab */}
            <TabsContent value="certificates" className="space-y-4 outline-none">
              <div className="bg-bg-surface2 border-border-subtle mb-4 flex flex-wrap items-center gap-2 rounded-xl border p-2">
                <span className="text-text-muted mr-1 text-[9px] font-bold uppercase tracking-widest">
                  GOTS, Oeko-Tex, EAC → ESG и сертификация:
                </span>
                <Button
                  asChild
                  variant="outline"
                  size="sm"
                  className="border-border-default h-7 gap-1 rounded-lg text-[9px] font-bold uppercase"
                >
                  <Link href={ROUTES.brand.esg}>
                    <Globe className="h-3 w-3" /> ESG
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  size="sm"
                  className="border-border-default h-7 gap-1 rounded-lg text-[9px] font-bold uppercase"
                >
                  <Link href={ROUTES.brand.compliance}>
                    <ShieldCheck className="h-3 w-3" /> EAC & Честный ЗНАК
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  size="sm"
                  className="border-border-default h-7 gap-1 rounded-lg text-[9px] font-bold uppercase"
                >
                  <Link href={ROUTES.brand.complianceStock}>
                    <Database className="h-3 w-3" /> Складской учёт КИЗ
                  </Link>
                </Button>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between px-1">
                  <div className="flex items-center gap-1.5">
                    <div className="bg-accent-primary h-1 w-5 rounded-full" />
                    <h2 className="text-text-muted text-[10px] font-bold uppercase tracking-widest">
                      Соответствие и сертификаты
                    </h2>
                  </div>
                  <div className="flex items-center gap-2">
                    {canEditProfile && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-7 gap-1 text-[9px] font-bold uppercase"
                        onClick={() => setIsEditing(!isEditing)}
                      >
                        <Edit className="h-3 w-3" /> Редактировать
                      </Button>
                    )}
                    {isEditing && canEditProfile && (
                      <Button
                        size="sm"
                        className="bg-accent-primary hover:bg-accent-primary h-7 gap-2 rounded-lg px-3 text-[8px] font-bold uppercase text-white shadow-md transition-all"
                        onClick={() => setShowCertificateDialog(true)}
                      >
                        <Plus className="h-3 w-3" /> Добавить сертификат
                      </Button>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-3">
                  {certificates.map((cert) => (
                    <Card
                      key={cert.id}
                      className={cn(
                        'group rounded-xl border p-4 shadow-sm transition-all hover:shadow-md',
                        cert.status === 'active'
                          ? 'border-border-subtle bg-white'
                          : cert.status === 'expiring'
                            ? 'border-amber-200 bg-amber-50/50'
                            : 'border-rose-200 bg-rose-50/50'
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={cn(
                            'flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-lg border shadow-inner transition-transform group-hover:scale-105',
                            cert.status === 'active'
                              ? 'border-emerald-100 bg-emerald-50 text-emerald-600'
                              : cert.status === 'expiring'
                                ? 'border-amber-200 bg-amber-100 text-amber-600'
                                : 'border-rose-200 bg-rose-100 text-rose-600'
                          )}
                        >
                          <Award className="h-5 w-5" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="mb-0.5 flex items-center gap-2">
                            <h3
                              className={cn(
                                'truncate text-[12px] font-bold uppercase tracking-tight',
                                cert.status === 'active'
                                  ? 'text-text-primary'
                                  : cert.status === 'expiring'
                                    ? 'text-amber-900'
                                    : 'text-rose-900'
                              )}
                            >
                              {cert.name}
                            </h3>
                            <Badge
                              className={cn(
                                'h-5 rounded-md border-none px-2 text-[7px] font-bold uppercase shadow-sm',
                                cert.status === 'active'
                                  ? 'bg-emerald-500 text-white'
                                  : cert.status === 'expiring'
                                    ? 'bg-amber-500 text-white'
                                    : 'bg-rose-500 text-white'
                              )}
                            >
                              {cert.status === 'active'
                                ? 'Активен'
                                : cert.status === 'expiring'
                                  ? 'Истекает'
                                  : 'Истек'}
                            </Badge>
                          </div>
                          <p className="text-text-secondary mb-2 text-[10px] font-medium">
                            {cert.type}
                          </p>
                          {(cert as { certNumber?: string }).certNumber && (
                            <p className="text-text-secondary mb-2 font-mono text-[9px]">
                              № {(cert as { certNumber?: string }).certNumber}
                            </p>
                          )}
                          <div className="mb-2 grid grid-cols-2 gap-2 md:grid-cols-4">
                            <div className="bg-bg-surface2 border-border-subtle/50 rounded-lg border p-2">
                              <p className="text-text-muted mb-0.5 text-[7px] font-bold uppercase">
                                Выдан
                              </p>
                              <p className="text-text-primary text-[9px] font-bold">
                                {cert.issueDate}
                              </p>
                            </div>
                            <div
                              className={cn(
                                'rounded-lg border p-2',
                                cert.status === 'active'
                                  ? 'border-emerald-100 bg-emerald-50'
                                  : cert.status === 'expiring'
                                    ? 'border-amber-100 bg-amber-50'
                                    : 'border-rose-100 bg-rose-50'
                              )}
                            >
                              <p className="text-text-muted mb-0.5 text-[7px] font-bold uppercase">
                                Истекает
                              </p>
                              <p
                                className={cn(
                                  'text-[9px] font-bold',
                                  cert.status === 'active'
                                    ? 'text-emerald-600'
                                    : cert.status === 'expiring'
                                      ? 'text-amber-600'
                                      : 'text-rose-600'
                                )}
                              >
                                {cert.expiryDate}
                              </p>
                            </div>
                            {(cert as { issuingBody?: string }).issuingBody && (
                              <div className="bg-bg-surface2 border-border-subtle/50 col-span-2 rounded-lg border p-2">
                                <p className="text-text-muted mb-0.5 text-[7px] font-bold uppercase">
                                  Орган сертификации
                                </p>
                                <p className="text-text-primary text-[9px] font-bold">
                                  {(cert as { issuingBody?: string }).issuingBody}
                                </p>
                              </div>
                            )}
                          </div>
                          <div className="mb-3 flex flex-wrap gap-2">
                            {(cert as { scope?: string }).scope && (
                              <Badge
                                variant="outline"
                                className="border-border-default text-[8px] font-medium"
                              >
                                Область: {(cert as { scope?: string }).scope}
                              </Badge>
                            )}
                            {(cert as { trTs?: string }).trTs && (
                              <Badge
                                variant="outline"
                                className="border-accent-primary/30 text-accent-primary text-[8px] font-medium"
                              >
                                {(cert as { trTs?: string }).trTs}
                              </Badge>
                            )}
                          </div>
                          {(cert as { notes?: string }).notes && (
                            <p className="text-text-secondary mb-3 text-[9px] italic">
                              {(cert as { notes?: string }).notes}
                            </p>
                          )}
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              className="border-border-default hover:bg-bg-surface2 h-7 gap-2 rounded-lg text-[7px] font-bold uppercase shadow-sm"
                            >
                              <Download className="h-3 w-3" /> Скачать PDF
                            </Button>
                            {cert.status === 'active' && (
                              <Button
                                variant="outline"
                                size="sm"
                                className="border-border-default hover:bg-bg-surface2 h-7 gap-2 rounded-lg text-[7px] font-bold uppercase shadow-sm"
                              >
                                <ExternalLink className="h-3 w-3" /> Верифицировать
                              </Button>
                            )}
                            {(cert.status === 'expiring' || cert.status === 'expired') &&
                              isEditing && (
                                <Button
                                  onClick={() => {
                                    setShowCertificateDialog(true);
                                    setUploadingCertificate(cert.id);
                                  }}
                                  size="sm"
                                  className="bg-accent-primary hover:bg-accent-primary h-7 gap-2 rounded-lg text-[7px] font-bold uppercase text-white shadow-md"
                                >
                                  <Upload className="h-3 w-3" /> Обновить
                                </Button>
                              )}
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Декларации ТР ТС / EAC */}
              <div className="mt-6 space-y-2">
                <div className="flex items-center justify-between px-1">
                  <div className="flex items-center gap-1.5">
                    <div className="h-1 w-5 rounded-full bg-blue-600" />
                    <h2 className="text-text-muted text-[10px] font-bold uppercase tracking-widest">
                      Декларации ТР ТС / EAC
                    </h2>
                  </div>
                  <Button
                    asChild
                    variant="ghost"
                    size="sm"
                    className="text-accent-primary h-6 text-[8px] font-bold"
                  >
                    <Link href={ROUTES.brand.compliance}>
                      Compliance <ArrowUpRight className="inline h-2.5 w-2.5" />
                    </Link>
                  </Button>
                </div>
                <Card className="border-border-subtle bg-bg-surface2/80 rounded-xl border p-4">
                  <p className="text-text-secondary mb-3 text-[11px]">
                    Декларации о соответствии техническим регламентам (ТР ТС 017/2011, ТР ТС
                    019/2011 и др.) управляются в разделе Compliance. Связь с Честный ЗНАК и
                    маркировкой КИЗ.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline" className="text-[9px]">
                      ТР ТС 017/2011 — Безопасность продукции лёгкой промышленности
                    </Badge>
                    <Badge variant="outline" className="text-[9px]">
                      ТР ТС 019/2011 — Безопасность СИЗ
                    </Badge>
                  </div>
                </Card>
              </div>

              <div className="mt-6 space-y-2">
                <div className="flex items-center justify-between px-1">
                  <div className="flex items-center gap-1.5">
                    <div className="h-1 w-5 rounded-full bg-emerald-600" />
                    <h2 className="text-text-muted text-[10px] font-bold uppercase tracking-widest">
                      Устойчивое развитие (ESG)
                    </h2>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button
                      asChild
                      variant="ghost"
                      size="sm"
                      className="h-6 gap-1 rounded-lg px-2 text-[8px] font-bold uppercase text-emerald-600 hover:bg-emerald-50"
                    >
                      <Link href={ROUTES.brand.esg}>
                        ESG дашборд <ArrowUpRight className="inline h-2.5 w-2.5" />
                      </Link>
                    </Button>
                  </div>
                </div>
                <Card className="rounded-xl border border-emerald-100 bg-gradient-to-br from-emerald-50 to-teal-50 p-4 shadow-sm">
                  <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                    {[
                      {
                        label: 'Углеродная нейтральность',
                        value: '2025',
                        icon: Globe,
                        achieved: true,
                      },
                      { label: 'Ноль отходов', value: '2026', icon: Package, achieved: false },
                      {
                        label: 'Справедливая торговля',
                        value: '100%',
                        icon: Users,
                        achieved: true,
                      },
                    ].map((goal, i) => (
                      <div
                        key={i}
                        className="group rounded-xl border border-emerald-100/50 bg-white p-4 shadow-sm transition-all hover:shadow-md"
                      >
                        <div className="mb-3 flex items-center gap-3">
                          <div
                            className={cn(
                              'flex h-9 w-9 items-center justify-center rounded-lg border shadow-inner transition-transform group-hover:scale-105',
                              goal.achieved
                                ? 'border-emerald-100 bg-emerald-50 text-emerald-600'
                                : 'bg-bg-surface2 text-text-muted border-border-subtle'
                            )}
                          >
                            <goal.icon className="h-4.5 w-4.5" />
                          </div>
                          {goal.achieved && (
                            <Badge className="h-4 rounded-md border-none bg-emerald-500 px-1.5 text-white">
                              <Check className="h-2.5 w-2.5" />
                            </Badge>
                          )}
                        </div>
                        <h4 className="text-text-muted mb-1 text-[9px] font-bold uppercase tracking-widest">
                          {goal.label}
                        </h4>
                        <p className="text-text-primary text-base font-bold tracking-tight">
                          {goal.value}
                        </p>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
            </TabsContent>

            {/* Press Kit Tab */}
            <TabsContent value="presskit" className="space-y-4 outline-none">
              <div className="bg-bg-surface2 border-border-subtle mb-4 flex flex-wrap items-center gap-2 rounded-xl border p-2">
                <span className="text-text-muted mr-1 text-[9px] font-bold uppercase tracking-widest">
                  Активы и контент:
                </span>
                <Button
                  asChild
                  variant="outline"
                  size="sm"
                  className="border-border-default h-7 gap-1 rounded-lg text-[9px] font-bold uppercase"
                >
                  <Link href={ROUTES.brand.media}>
                    <ImageIcon className="h-3 w-3" /> DAM-активы
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  size="sm"
                  className="border-border-default h-7 gap-1 rounded-lg text-[9px] font-bold uppercase"
                >
                  <Link href={ROUTES.brand.marketingContentFactory}>
                    <Sparkles className="h-3 w-3" /> Content Factory
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  size="sm"
                  className="border-border-default h-7 gap-1 rounded-lg text-[9px] font-bold uppercase"
                >
                  <Link href={ROUTES.brand.aiTools}>
                    <Bot className="h-3 w-3" /> AI Creator
                  </Link>
                </Button>
              </div>
              <div className="space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3 px-1">
                  <div>
                    <div className="mb-1 flex items-center gap-1.5">
                      <div className="bg-accent-primary h-1 w-5 rounded-full" />
                      <h2 className="text-text-muted text-[10px] font-bold uppercase tracking-widest">
                        Медиа-материалы и Press Kit
                      </h2>
                    </div>
                    <p className="text-text-secondary text-[9px]">
                      Назначение: Live, каталог, работа с партнёрами. Рассылки — партнёры получают
                      уведомления в своих профилях.
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-7 gap-1.5 rounded-lg px-3 text-[8px] font-bold uppercase"
                      onClick={() =>
                        toast({
                          title: 'Переслать партнёру',
                          description: 'Выберите партнёра для отправки материалов',
                        })
                      }
                    >
                      <Send className="h-3 w-3" /> Переслать партнёру
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-7 gap-1.5 rounded-lg px-3 text-[8px] font-bold uppercase"
                      onClick={() =>
                        toast({
                          title: 'Рассылка всем',
                          description:
                            'Уведомление отправлено всем партнёрам (магазины, дистрибуторы)',
                        })
                      }
                    >
                      <UserPlus className="h-3 w-3" /> Рассылка всем партнёрам
                    </Button>
                    <Button
                      size="sm"
                      className="bg-text-primary hover:bg-accent-primary h-7 gap-2 rounded-lg px-3 text-[8px] font-bold uppercase text-white shadow-md"
                      onClick={() => {
                        exportBrandProfilePDF();
                        toast({
                          title: 'Brand Book',
                          description: 'Используйте печать для сохранения PDF',
                        });
                      }}
                    >
                      <Download className="h-3 w-3" /> Brand Book PDF
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-7 gap-2 rounded-lg px-3 text-[8px] font-bold uppercase"
                      onClick={() =>
                        toast({ title: 'Press Kit', description: 'Полный архив — DAM' })
                      }
                    >
                      <Download className="h-3 w-3" /> Full Press Kit
                    </Button>
                  </div>
                </div>

                <div className="bg-bg-surface2 border-border-subtle flex flex-wrap gap-2 rounded-lg border p-2 text-[9px]">
                  <span className="text-text-secondary font-bold uppercase">Назначение:</span>
                  <span className="flex items-center gap-1">
                    <Globe className="h-3 w-3 text-emerald-600" /> Публичное — Live
                  </span>
                  <span className="flex items-center gap-1">
                    <Lock className="h-3 w-3 text-amber-600" /> Внутреннее — дистрибуторы, магазины
                  </span>
                  <span className="flex items-center gap-1">
                    <Store className="text-accent-primary h-3 w-3" /> Каталог, шоурум
                  </span>
                  <span className="flex items-center gap-1">
                    <UserPlus className="text-text-secondary h-3 w-3" /> Индивидуально — настройки
                    по партнёру
                  </span>
                </div>

                <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
                  {(
                    [
                      {
                        id: 'brand-identity' as const,
                        title: 'Айдентика',
                        desc: 'Логотипы, цвета, шрифты',
                        icon: Palette,
                        color: 'bg-accent-primary/10 text-accent-primary',
                        usage: ['public', 'catalog'] as const,
                      },
                      {
                        id: 'lookbooks' as const,
                        title: 'Лукбуки',
                        desc: 'Коллекции SS26 и FW25',
                        icon: ImageIcon,
                        color: 'bg-emerald-50 text-emerald-600',
                        usage: ['public', 'internal', 'catalog', 'individual'] as const,
                      },
                      {
                        id: 'press-releases' as const,
                        title: 'Пресс-релизы',
                        desc: 'Новости бренда',
                        icon: Newspaper,
                        color: 'bg-amber-50 text-amber-600',
                        usage: ['public', 'internal'] as const,
                      },
                      {
                        id: 'brand-video' as const,
                        title: 'Видео бренда',
                        desc: 'Манифест и показы',
                        icon: Video,
                        color: 'bg-rose-50 text-rose-600',
                        usage: ['public', 'catalog'] as const,
                      },
                      {
                        id: 'team-bios' as const,
                        title: 'О команде',
                        desc: 'Профили руководства',
                        icon: Users,
                        color: 'bg-blue-50 text-blue-600',
                        usage: ['internal', 'individual'] as const,
                      },
                      {
                        id: 'store-photos' as const,
                        title: 'Фото магазинов',
                        desc: 'Торговые пространства',
                        icon: Building2,
                        color: 'bg-accent-primary/10 text-accent-primary',
                        usage: ['catalog', 'internal', 'individual'] as const,
                      },
                    ] as {
                      id: AssetTypeId;
                      title: string;
                      desc: string;
                      icon: React.ComponentType<{ className?: string }>;
                      color: string;
                      usage: readonly ('public' | 'internal' | 'catalog' | 'individual')[];
                    }[]
                  ).map((asset) => {
                    const items = pressKitAssets[asset.id] || [];
                    const activeCount = items.filter((i) => !i.archived).length;
                    const archivedCount = items.filter((i) => i.archived).length;
                    return (
                      <Card
                        key={asset.id}
                        className="border-border-subtle hover:border-accent-primary/30 group flex cursor-pointer items-start gap-3 rounded-xl border bg-white p-4 shadow-sm transition-all hover:shadow-md"
                        onClick={() => {
                          setMediaViewerType(asset.id);
                          setMediaViewerOpen(true);
                        }}
                      >
                        <div
                          className={cn(
                            'flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg border shadow-inner transition-transform group-hover:scale-105',
                            asset.color,
                            asset.color.replace('text-', 'border-').replace('50', '100')
                          )}
                        >
                          <asset.icon className="h-5 w-5" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="mb-0.5 flex items-start justify-between">
                            <h3 className="text-text-primary truncate text-[12px] font-bold uppercase tracking-tight">
                              {asset.title}
                            </h3>
                            <span className="text-text-muted text-[9px] font-bold uppercase tracking-widest">
                              {activeCount} активных
                              {archivedCount > 0 ? ` · ${archivedCount} в архиве` : ''}
                            </span>
                          </div>
                          <p className="text-text-secondary mb-2 truncate text-[11px] font-medium leading-tight">
                            {asset.desc}
                          </p>
                          <div className="mb-2 flex flex-wrap gap-1">
                            {asset.usage?.includes('public') && (
                              <Badge
                                variant="outline"
                                className="h-5 border-emerald-200 bg-emerald-50 px-1.5 text-[7px] font-bold text-emerald-700"
                              >
                                <Globe className="mr-0.5 h-2.5 w-2.5" /> Live
                              </Badge>
                            )}
                            {asset.usage?.includes('internal') && (
                              <Badge
                                variant="outline"
                                className="h-5 border-amber-200 bg-amber-50 px-1.5 text-[7px] font-bold text-amber-700"
                              >
                                <Lock className="mr-0.5 h-2.5 w-2.5" /> Внутр.
                              </Badge>
                            )}
                            {asset.usage?.includes('catalog') && (
                              <Badge
                                variant="outline"
                                className="border-accent-primary/30 text-accent-primary bg-accent-primary/10 h-5 px-1.5 text-[7px] font-bold"
                              >
                                <Store className="mr-0.5 h-2.5 w-2.5" /> Каталог
                              </Badge>
                            )}
                            {asset.usage?.includes('individual') && (
                              <Badge
                                variant="outline"
                                className="border-border-default text-text-secondary bg-bg-surface2 h-5 px-1.5 text-[7px] font-bold"
                              >
                                <UserPlus className="mr-0.5 h-2.5 w-2.5" /> Индив.
                              </Badge>
                            )}
                          </div>
                          <span className="text-accent-primary group-hover:text-accent-primary inline-flex items-center gap-1 text-[8px] font-bold uppercase">
                            Открыть для просмотра <ChevronRight className="h-3 w-3" />
                          </span>
                        </div>
                      </Card>
                    );
                  })}
                </div>
                <MediaAssetsViewer
                  open={mediaViewerOpen}
                  onOpenChange={setMediaViewerOpen}
                  assetTypeId={mediaViewerType}
                  items={mediaViewerType ? pressKitAssets[mediaViewerType] || [] : []}
                  onItemsChange={(typeId, newItems) =>
                    setPressKitAssets((prev) => ({ ...prev, [typeId]: newItems }))
                  }
                  autoArchiveDays={pressKitAutoArchiveDays}
                  onAutoArchiveDaysChange={setPressKitAutoArchiveDays}
                />
              </div>

              <div className="mt-6 space-y-2">
                <div className="flex items-center gap-1.5 px-1">
                  <div className="h-1 w-5 rounded-full bg-emerald-600" />
                  <h2 className="text-text-muted text-[10px] font-bold uppercase tracking-widest">
                    История бренда
                  </h2>
                </div>
                <Card className="border-border-subtle from-bg-surface2 to-accent-primary/10 rounded-xl border bg-gradient-to-br p-3 shadow-sm">
                  <div className="space-y-4">
                    {isEditing ? (
                      <Textarea
                        defaultValue="Syntha — российский бренд технологичной одежды, основанный в 2022 году. Мы создаем функциональный гардероб для жизни в мегаполисе, объединяя традиционное мастерство с инновационными материалами. Наша философия — Cyber-Heritage."
                        className="text-text-primary border-border-default min-h-[100px] rounded-lg bg-white p-3 text-[13px] font-medium"
                      />
                    ) : (
                      <p className="text-text-primary text-[13px] font-medium italic leading-relaxed">
                        "Syntha — российский бренд технологичной одежды, основанный в 2022 году. Мы
                        создаем функциональный гардероб для жизни в мегаполисе, объединяя
                        традиционное мастерство с инновационными материалами. Наша философия —
                        Cyber-Heritage."
                      </p>
                    )}

                    <div className="border-border-default/60 grid grid-cols-2 gap-3 border-t pt-4 md:grid-cols-4">
                      {[
                        { label: 'Основан', value: brand.foundedYear },
                        { label: 'Страна', value: brand.countryOfOrigin },
                        {
                          label: 'Подписчиков',
                          value: `${((brand.followers || 0) / 1000).toFixed(1)}K`,
                        },
                        { label: 'Категория', value: 'Luxury Tech' },
                      ].map((stat, i) => (
                        <div key={i} className="space-y-0.5">
                          <p className="text-text-muted text-[8px] font-bold uppercase tracking-widest">
                            {stat.label}
                          </p>
                          <p className="text-text-primary text-sm font-bold tracking-tight">
                            {stat.value}
                          </p>
                        </div>
                      ))}
                    </div>

                    <div className="border-border-default/60 flex flex-wrap gap-3 border-t pt-4">
                      <div className="border-border-subtle flex items-center gap-2 rounded-lg border bg-white p-2 px-3 shadow-sm">
                        <Mail className="text-accent-primary h-3.5 w-3.5" />
                        <span className="text-text-primary text-[10px] font-bold uppercase tracking-tight">
                          press@syntha.ru
                        </span>
                      </div>
                      <div className="border-border-subtle flex items-center gap-2 rounded-lg border bg-white p-2 px-3 shadow-sm">
                        <Phone className="text-accent-primary h-3.5 w-3.5" />
                        <span className="text-text-primary text-[10px] font-bold uppercase tracking-tight">
                          +7 (495) 123-45-67
                        </span>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
            </TabsContent>

            {/* Linesheets Tab */}

            {/* Campaigns Tab */}

            {/* Pricing Tab */}

            {/* VMI Tab */}

            {/* ESG Tab */}

            {/* Loyalty Tab */}

            {/* B2C Tabs — только в B2C Mode */}

            {/* Russian Layer Tab */}

            {/* Academy Tab */}
          </Tabs>
        </Card>
      </SectionBlock>

      {/* Dashboard blocks: только в Обзор — избегаем дублирования с Профиль / B2B / B2C */}
      {activeGroup === 'strategy' && activeTab === 'overview' && (
        <>
          {/* Completeness score + Profile pulse */}
          <SectionBlock
            title="Сводка"
            meta={PROFILE_SECTION_META.summary}
            accentColor="indigo"
            className="min-w-0"
          >
            <Card className="border-border-default rounded-xl border bg-white p-4 shadow-sm md:p-5">
              <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                <Card className="border-border-default flex flex-row items-center gap-3 rounded-xl border bg-white p-3 md:flex-col md:items-start">
                  <div className="flex items-center gap-3">
                    <div
                      className={cn(
                        'flex h-12 w-12 items-center justify-center rounded-xl text-lg font-black',
                        completenessScore >= 80
                          ? 'bg-emerald-100 text-emerald-600'
                          : completenessScore >= 50
                            ? 'bg-amber-100 text-amber-600'
                            : 'bg-rose-100 text-rose-600'
                      )}
                    >
                      {completenessScore}%
                    </div>
                    <div>
                      <p className="text-text-muted text-[10px] font-bold uppercase tracking-widest">
                        Полнота
                      </p>
                      <p className="text-text-secondary text-[11px] font-medium">Полнота профиля</p>
                    </div>
                  </div>
                  {incompleteBlocks.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {incompleteBlocks.map((b) => (
                        <Badge
                          key={b}
                          variant="outline"
                          className="cursor-pointer border-amber-200 bg-amber-50 text-[8px] text-amber-700 transition-colors hover:bg-amber-100"
                          onClick={() => {
                            const tabMap: Record<string, string> = {
                              Бренд: 'brand',
                              'Юр. данные': 'legal',
                              Сертификаты: 'certificates',
                              Коммерция: 'commerce',
                              'Press Kit': 'presskit',
                              Лайншиты: 'linesheets',
                              Цены: 'pricing',
                            };
                            const tab = tabMap[b];
                            if (tab) {
                              setActiveGroup(
                                tab === 'linesheets' || tab === 'pricing' ? 'b2b' : 'profile'
                              );
                              setActiveTab(tab as any);
                            }
                          }}
                        >
                          {b}
                        </Badge>
                      ))}
                    </div>
                  )}
                </Card>
                <Card className="border-border-default rounded-xl border bg-white p-3 md:col-span-2">
                  <button
                    type="button"
                    onClick={() => setShowChangelogDialog(true)}
                    className="w-full text-left"
                  >
                    <p className="text-text-muted mb-2 flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest">
                      <Activity className="h-3 w-3" /> Пульс профиля{' '}
                      <ChevronRight className="text-text-muted ml-auto h-3 w-3" />
                    </p>
                    <div className="space-y-1.5">
                      {profilePulse.map((p, i) => (
                        <div
                          key={i}
                          className="text-text-secondary flex items-center gap-2 text-[11px]"
                        >
                          <span className="text-text-muted font-mono">{p.date}</span>
                          <span className="font-medium">{p.user}</span>
                          <span>{p.action}</span>
                          <span className="text-text-muted">— {p.field}</span>
                        </div>
                      ))}
                    </div>
                  </button>
                </Card>
              </div>
            </Card>
          </SectionBlock>

          {/* Интеграции, Подписка, API Hub, Команда, Календарь, Сообщения */}
          <SectionBlock
            title="Интеграции и сервисы"
            meta={PROFILE_SECTION_META.tools}
            accentColor="slate"
            className="min-w-0"
          >
            <Card className="border-border-default rounded-xl border bg-white p-4 shadow-sm md:p-5">
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
                <Card className="border-border-default rounded-xl border bg-white p-4 shadow-sm">
                  <div className="mb-3 flex items-center justify-between">
                    <h3 className="text-text-muted text-[10px] font-bold uppercase tracking-widest">
                      Интеграции
                    </h3>
                    <Button
                      asChild
                      variant="ghost"
                      size="sm"
                      className="text-accent-primary -mr-2 h-6 text-[8px] font-bold uppercase"
                    >
                      <Link href={ROUTES.brand.integrations}>
                        Все <ArrowUpRight className="inline h-2.5 w-2.5" />
                      </Link>
                    </Button>
                  </div>
                  <div className="space-y-2">
                    {Object.entries(integrationsData).map(([k, v]) =>
                      v.status === 'error' ? (
                        <button
                          key={k}
                          onClick={async () => {
                            const r = await retryIntegration(k);
                            if (r.success)
                              toast({
                                title: 'Переподключение',
                                description: `${k === 'c1c' ? '1С' : k.toUpperCase()} — запрос отправлен`,
                              });
                            else
                              toast({
                                title: 'Ошибка',
                                description: r.error,
                                variant: 'destructive',
                              });
                          }}
                          className="flex w-full items-center justify-between rounded-lg bg-rose-50 p-2 text-left transition-colors hover:bg-rose-100"
                        >
                          <span className="text-[11px] font-bold uppercase">
                            {k === 'c1c' ? '1С' : k.toUpperCase()}
                          </span>
                          <div className="flex items-center gap-2">
                            {v.status === 'error' &&
                              'errorCount' in v &&
                              (v as { errorCount?: number }).errorCount && (
                                <Badge variant="destructive" className="h-4 text-[8px]">
                                  {(v as { errorCount: number }).errorCount}
                                </Badge>
                              )}
                            <span className="h-2 w-2 shrink-0 rounded-full bg-rose-500" />
                            <span className="text-[10px] font-medium">Повторить</span>
                          </div>
                        </button>
                      ) : (
                        <Link
                          key={k}
                          href="/brand/settings/api-hub"
                          className="bg-bg-surface2 hover:bg-bg-surface2 flex items-center justify-between rounded-lg p-2 transition-colors"
                        >
                          <span className="text-[11px] font-bold uppercase">
                            {k === 'c1c' ? '1С' : k.toUpperCase()}
                          </span>
                          <div className="flex items-center gap-2">
                            <span className="h-2 w-2 shrink-0 rounded-full bg-emerald-500" />
                            <span className="text-[10px] font-medium">{v.lastSync}</span>
                          </div>
                        </Link>
                      )
                    )}
                    <Link
                      href="/admin/integrations"
                      className="border-border-default hover:border-accent-primary/30 hover:bg-accent-primary/10 text-text-secondary block rounded-lg border border-dashed p-2 text-center text-[10px] font-bold uppercase"
                    >
                      + Добавить
                    </Link>
                  </div>
                </Card>
                <Card className="border-border-default rounded-xl border bg-white p-4 shadow-sm">
                  <div className="mb-3 flex items-center justify-between">
                    <h3 className="text-text-muted text-[10px] font-bold uppercase tracking-widest">
                      Подписка & API
                    </h3>
                    <div className="flex gap-1">
                      <Button
                        asChild
                        variant="ghost"
                        size="sm"
                        className="text-accent-primary h-6 text-[8px] font-bold uppercase"
                      >
                        <Link href={ROUTES.brand.subscription}>Тариф</Link>
                      </Button>
                      <Button
                        asChild
                        variant="ghost"
                        size="sm"
                        className="text-accent-primary -mr-2 h-6 text-[8px] font-bold uppercase"
                      >
                        <Link href={`${ROUTES.brand.settings}/api-hub`}>API Hub</Link>
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="bg-accent-primary/10 flex items-center justify-between rounded-lg p-2">
                      <span className="text-[11px] font-medium">Тариф</span>
                      <Badge className="bg-accent-primary text-[9px] text-white">
                        {subscriptionData.tier}
                      </Badge>
                    </div>
                    <div className="bg-bg-surface2 flex items-center justify-between rounded-lg p-2">
                      <span className="text-[11px] font-medium">API ключи</span>
                      <span className="text-sm font-bold tabular-nums">{apiHubData.apiKeys}</span>
                    </div>
                  </div>
                </Card>
                <Card className="border-border-default rounded-xl border bg-white p-4 shadow-sm">
                  <div className="mb-3 flex items-center justify-between">
                    <h3 className="text-text-muted text-[10px] font-bold uppercase tracking-widest">
                      Команда ↔ Key People
                    </h3>
                    <Button
                      asChild
                      variant="ghost"
                      size="sm"
                      className="text-accent-primary -mr-2 h-6 text-[8px] font-bold uppercase"
                    >
                      <Link href={ROUTES.brand.team}>
                        Команда <ArrowUpRight className="inline h-2.5 w-2.5" />
                      </Link>
                    </Button>
                  </div>
                  <div className="space-y-2">
                    {teamMembers.map((m) => (
                      <Link
                        key={m.id}
                        href={m.href}
                        className="hover:bg-bg-surface2 flex items-center justify-between rounded-lg p-2 transition-colors"
                      >
                        <span className="text-text-primary text-[11px] font-bold">{m.name}</span>
                        <span className="text-text-secondary text-[9px] font-bold uppercase">
                          {m.role}
                        </span>
                      </Link>
                    ))}
                  </div>
                </Card>
                <Card className="border-border-default rounded-xl border bg-white p-4 shadow-sm">
                  <div className="mb-3 flex items-center justify-between">
                    <h3 className="text-text-muted text-[10px] font-bold uppercase tracking-widest">
                      Календарь
                    </h3>
                    <Button
                      asChild
                      variant="ghost"
                      size="sm"
                      className="text-accent-primary -mr-2 h-6 text-[8px] font-bold uppercase"
                    >
                      <Link href={ROUTES.brand.calendar}>
                        События <ArrowUpRight className="inline h-2.5 w-2.5" />
                      </Link>
                    </Button>
                  </div>
                  <div className="space-y-2">
                    {calendarEvents.map((e, i) => (
                      <Link
                        key={i}
                        href={e.href}
                        className="hover:bg-bg-surface2 block rounded-lg p-2 transition-colors"
                      >
                        <p className="text-text-primary text-[11px] font-bold">{e.title}</p>
                        <p className="text-text-secondary text-[10px]">{e.date}</p>
                      </Link>
                    ))}
                  </div>
                </Card>
                <Card className="border-border-default rounded-xl border bg-white p-4 shadow-sm">
                  <div className="mb-3 flex items-center justify-between">
                    <h3 className="text-text-muted text-[10px] font-bold uppercase tracking-widest">
                      Сообщения
                    </h3>
                    <Button
                      asChild
                      variant="ghost"
                      size="sm"
                      className="text-accent-primary -mr-2 h-6 text-[8px] font-bold uppercase"
                    >
                      <Link href={ROUTES.brand.messages}>
                        Открыть <ArrowUpRight className="inline h-2.5 w-2.5" />
                      </Link>
                    </Button>
                  </div>
                  <div className="bg-bg-surface2 rounded-lg p-2">
                    {messagesData.unread > 0 && (
                      <Badge className="mb-2 bg-rose-500 text-[9px] text-white">
                        {messagesData.unread} новых
                      </Badge>
                    )}
                    <p className="text-text-secondary truncate text-[11px]">
                      {messagesData.lastPreview}
                    </p>
                  </div>
                </Card>
                <Card className="border-border-default rounded-xl border bg-white p-4 shadow-sm">
                  <div className="mb-3 flex items-center justify-between">
                    <h3 className="text-text-muted text-[10px] font-bold uppercase tracking-widest">
                      CRM & Финансы
                    </h3>
                    <div className="flex gap-1">
                      <Button
                        asChild
                        variant="ghost"
                        size="sm"
                        className="text-accent-primary h-6 text-[8px] font-bold uppercase"
                      >
                        <Link href={ROUTES.brand.customerIntelligence}>
                          CRM <ArrowUpRight className="inline h-2.5 w-2.5" />
                        </Link>
                      </Button>
                      <Button
                        asChild
                        variant="ghost"
                        size="sm"
                        className="text-accent-primary -mr-2 h-6 text-[8px] font-bold uppercase"
                      >
                        <Link href={ROUTES.brand.finance}>
                          Финансы <ArrowUpRight className="inline h-2.5 w-2.5" />
                        </Link>
                      </Button>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <Link
                      href={ROUTES.brand.customerIntelligence}
                      className="bg-bg-surface2 hover:bg-bg-surface2 block rounded-lg p-2 transition-colors"
                    >
                      <p className="text-text-secondary text-[9px] font-bold uppercase">Сегменты</p>
                      <p className="text-sm font-black tabular-nums">{crmData.segments}</p>
                    </Link>
                    <Link
                      href={ROUTES.brand.customerIntelligence}
                      className="bg-bg-surface2 hover:bg-bg-surface2 block rounded-lg p-2 transition-colors"
                    >
                      <p className="text-text-secondary text-[9px] font-bold uppercase">LTV</p>
                      <p className="text-sm font-black tabular-nums">{crmData.ltv}</p>
                    </Link>
                    <Link
                      href={ROUTES.brand.finance}
                      className="col-span-2 block rounded-lg bg-emerald-50 p-2 transition-colors hover:bg-emerald-100"
                    >
                      <p className="text-[9px] font-bold uppercase text-emerald-700">
                        Выручка (мес)
                      </p>
                      <p className="text-base font-black tabular-nums text-emerald-700">
                        {financeData.revenueMonth}
                      </p>
                    </Link>
                  </div>
                </Card>
              </div>
            </Card>
          </SectionBlock>
        </>
      )}

      {/* Certificate Upload Dialog */}
      <Dialog open={showCertificateDialog} onOpenChange={setShowCertificateDialog}>
        <DialogContent className="border-border-default rounded-xl sm:max-w-[450px]">
          <DialogHeader>
            <DialogTitle className="text-text-primary flex items-center gap-2 text-base font-bold uppercase tracking-tight">
              <Upload className="text-accent-primary h-4 w-4" />
              Обновить сертификат
            </DialogTitle>
            <DialogDescription className="text-text-secondary text-[11px] font-medium">
              Загрузите актуальный документ для верификации статуса
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label className="text-text-muted text-[10px] font-bold uppercase tracking-widest">
                Файл сертификата <span className="text-rose-500">*</span>
              </Label>
              <div className="border-border-subtle hover:border-accent-primary/40 hover:bg-accent-primary/10 group cursor-pointer rounded-xl border-2 border-dashed p-4 text-center transition-all">
                <Upload className="text-text-muted group-hover:text-accent-primary mx-auto mb-2 h-8 w-8 transition-colors" />
                <p className="text-text-primary mb-0.5 text-[12px] font-bold uppercase">
                  Загрузите файл
                </p>
                <p className="text-text-muted text-[9px] font-medium">PDF, JPG или PNG до 5MB</p>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-text-muted text-[10px] font-bold uppercase tracking-widest">
                Номер сертификата
              </Label>
              <Input
                className="bg-bg-surface2 border-border-default h-9 rounded-lg text-[13px]"
                placeholder="Напр. ISO-9001-2024"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-text-muted text-[10px] font-bold uppercase tracking-widest">
                  Дата выдачи
                </Label>
                <Input
                  type="date"
                  className="bg-bg-surface2 border-border-default h-9 rounded-lg text-[13px]"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-text-muted text-[10px] font-bold uppercase tracking-widest">
                  Срок действия
                </Label>
                <Input
                  type="date"
                  className="bg-bg-surface2 border-border-default h-9 rounded-lg text-[13px]"
                />
              </div>
            </div>

            <div className="rounded-xl border border-amber-100 bg-amber-50/50 p-3">
              <div className="flex items-start gap-2.5">
                <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-amber-600" />
                <div className="space-y-0.5">
                  <p className="text-[10px] font-bold uppercase text-amber-900">
                    Важное уведомление
                  </p>
                  <p className="text-[10px] font-medium leading-snug text-amber-700 opacity-90">
                    Документ будет верифицирован AI в течение 2-х минут. Статус обновится
                    автоматически.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button
              variant="ghost"
              onClick={() => setShowCertificateDialog(false)}
              className="text-text-secondary h-8 rounded-lg text-[10px] font-bold uppercase tracking-widest"
            >
              Отмена
            </Button>
            <Button
              onClick={() => uploadingCertificate && handleUploadCertificate(uploadingCertificate)}
              className="bg-accent-primary hover:bg-accent-primary shadow-accent-primary/15 h-8 rounded-lg px-6 text-[10px] font-bold uppercase tracking-widest text-white shadow-lg"
              disabled={uploadingCertificate === null}
            >
              {uploadingCertificate ? (
                <>
                  <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />
                  Загрузка...
                </>
              ) : (
                <>
                  <Upload className="mr-2 h-3.5 w-3.5" />
                  Сохранить
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Changelog Dialog */}
      <Dialog open={showChangelogDialog} onOpenChange={setShowChangelogDialog}>
        <DialogContent className="border-border-default max-h-[85vh] rounded-xl sm:max-w-[650px]">
          <DialogHeader className="border-border-subtle border-b pb-4">
            <DialogTitle className="text-text-primary flex items-center gap-2 text-base font-bold uppercase tracking-tight">
              <History className="h-4.5 w-4.5 text-accent-primary" />
              История изменений профиля
            </DialogTitle>
            <DialogDescription className="text-text-secondary text-[11px] font-medium">
              Архив действий — фильтр по полю, экспорт CSV, откат
            </DialogDescription>
            <div className="flex flex-wrap gap-2 pt-3">
              <div className="bg-bg-surface2 flex rounded-lg p-1">
                <button
                  onClick={() => setChangelogFilter('all')}
                  className={cn(
                    'rounded px-2 py-1 text-[9px] font-bold uppercase',
                    changelogFilter === 'all' ? 'bg-white shadow' : 'text-text-secondary'
                  )}
                >
                  Все
                </button>
                {changelogFields.map((f) => (
                  <button
                    key={f}
                    onClick={() => setChangelogFilter(f)}
                    className={cn(
                      'rounded px-2 py-1 text-[9px] font-bold uppercase',
                      changelogFilter === f ? 'bg-white shadow' : 'text-text-secondary'
                    )}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>
          </DialogHeader>

          <div className="scrollbar-hide max-h-[500px] space-y-3 overflow-y-auto px-1 py-4">
            {filteredChangelog.map((entry, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
                className="bg-bg-surface2/80 border-border-subtle hover:border-accent-primary/20 group flex gap-3 rounded-xl border p-3 transition-all hover:bg-white"
              >
                <div className="flex flex-shrink-0 flex-col items-center gap-2 pt-1">
                  <div className="border-border-subtle text-text-muted group-hover:text-accent-primary flex h-8 w-8 items-center justify-center rounded-lg border bg-white shadow-sm transition-colors">
                    <History className="h-4 w-4" />
                  </div>
                  <div className="bg-border-subtle/60 h-full w-px" />
                </div>

                <div className="flex-1 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <p className="text-text-primary text-[11px] font-bold uppercase tracking-tight">
                        {entry.user}
                      </p>
                      <Badge
                        variant="outline"
                        className="text-text-secondary border-border-default h-4 rounded-md bg-white px-1.5 text-[8px] font-bold uppercase"
                      >
                        {entry.field}
                      </Badge>
                    </div>
                    <span className="text-text-muted text-[9px] font-bold uppercase tabular-nums">
                      {entry.date}
                    </span>
                  </div>

                  <p className="text-text-secondary text-[11px] font-medium">{entry.action}</p>

                  {entry.oldValue && (
                    <div className="grid grid-cols-2 gap-2 pt-2">
                      <div className="space-y-1">
                        <p className="text-text-muted px-1 text-[7px] font-bold uppercase tracking-widest">
                          Было
                        </p>
                        <div className="text-text-secondary truncate rounded-lg border border-rose-100/50 bg-rose-50/50 px-2.5 py-1.5 text-[10px] italic leading-tight">
                          {entry.oldValue}
                        </div>
                      </div>
                      <div className="space-y-1">
                        <p className="text-text-muted px-1 text-[7px] font-bold uppercase tracking-widest">
                          Стало
                        </p>
                        <div className="text-text-primary truncate rounded-lg border border-emerald-100/50 bg-emerald-50/50 px-2.5 py-1.5 text-[10px] font-bold leading-tight">
                          {entry.newValue}
                        </div>
                      </div>
                    </div>
                  )}
                  {!entry.oldValue && entry.newValue && (
                    <div className="pt-2">
                      <p className="text-text-muted mb-1 px-1 text-[7px] font-bold uppercase tracking-widest">
                        Добавлено
                      </p>
                      <div className="text-text-primary bg-accent-primary/10 border-accent-primary/20 rounded-lg border px-2.5 py-1.5 text-[10px] font-bold leading-tight">
                        {entry.newValue}
                      </div>
                    </div>
                  )}
                  {entry.oldValue && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="mt-2 h-6 text-[8px] text-amber-600 hover:bg-amber-50"
                      onClick={() => handleChangelogRollback(entry)}
                    >
                      <RotateCcw className="mr-1 h-3 w-3" /> Откатить
                    </Button>
                  )}
                </div>
              </motion.div>
            ))}
          </div>

          <DialogFooter className="border-border-subtle gap-2 border-t pt-4">
            <Button
              variant="ghost"
              className="text-text-secondary hover:bg-bg-surface2 h-8 rounded-lg text-[9px] font-bold uppercase tracking-widest"
              onClick={() => {
                exportToCSV(
                  filteredChangelog.map((e) => ({
                    user: e.user,
                    field: e.field,
                    action: e.action,
                    oldValue: e.oldValue || '',
                    newValue: e.newValue || '',
                    date: e.date,
                  })),
                  [
                    { key: 'user', label: 'Пользователь' },
                    { key: 'field', label: 'Поле' },
                    { key: 'action', label: 'Действие' },
                    { key: 'oldValue', label: 'Было' },
                    { key: 'newValue', label: 'Стало' },
                    { key: 'date', label: 'Дата' },
                  ],
                  'changelog'
                );
                toast({ title: 'Экспорт', description: 'История экспортирована в CSV' });
              }}
            >
              <Download className="mr-1.5 h-3.5 w-3.5" />
              Export CSV
            </Button>
            <Button
              onClick={() => setShowChangelogDialog(false)}
              className="bg-text-primary h-8 rounded-lg px-6 text-[9px] font-bold uppercase tracking-widest text-white"
            >
              Закрыть
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </RegistryPageShell>
  );
}

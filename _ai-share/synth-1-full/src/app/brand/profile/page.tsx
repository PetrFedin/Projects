'use client';

import { useSearchParamsNonNull } from '@/hooks/use-search-params-non-null';
import { useState, useEffect, useRef, startTransition } from 'react';
import type { Brand } from '@/lib/types';
import { brands } from '@/lib/placeholder-data';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Award,
  Building2,
  Calendar,
  Check,
  Download,
  Edit,
  FileSpreadsheet,
  FileText,
  Globe,
  History,
  MoreHorizontal,
  Newspaper,
  Package,
  RefreshCcw,
  RotateCcw,
  Save,
  Settings,
  Users,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
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
import { cn } from '@/lib/utils';
import { cabinetSurface } from '@/lib/ui/cabinet-surface';
import { registryFeedLayout } from '@/lib/ui/registry-feed-layout';
import { useToast } from '@/hooks/use-toast';
import { useRbac } from '@/hooks/useRbac';
import { useUIState } from '@/providers/ui-state';
import { useBrandProfileSync } from '@/hooks/use-brand-profile-sync';
import { useNotificationPolling } from '@/hooks/use-notification-polling';
import { exportBrandProfileCSV, exportBrandProfilePDF } from '@/lib/brand-profile-export-utils';
import { exportToCSV } from '@/lib/production-export-utils';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ROUTES } from '@/lib/routes';
import { motion, AnimatePresence } from 'framer-motion';
import type { AssetTypeId, MediaAssetItem } from '@/components/brand/MediaAssetsViewer';
import { RegistryPageHeader, RegistryPageShell } from '@/components/design-system';
import { BrandProfileCommerceTab } from './brand-profile-commerce-tab';
import {
  BrandProfileLegalTab,
  type BrandProfileLegalDataState,
} from './brand-profile-legal-tab';
import {
  BrandProfileCertificatesTab,
  type BrandProfileCertificateItem,
} from './brand-profile-certificates-tab';
import { BrandProfilePresskitTab } from './brand-profile-presskit-tab';
import {
  BrandProfileBrandTab,
  type BrandProfileBrandContactsState,
  type BrandProfileBrandInfoState,
  type BrandProfileContactsState,
} from './brand-profile-brand-tab';
import {
  BRAND_PROFILE_DEFAULT_SYNTHA_BRAND,
  BRAND_PROFILE_EXPORT_DNA,
  BRAND_PROFILE_INITIAL_BRAND_CONTACTS,
  BRAND_PROFILE_INITIAL_BRAND_INFO,
  BRAND_PROFILE_INITIAL_CERTIFICATES,
  BRAND_PROFILE_INITIAL_CHANGELOG,
  BRAND_PROFILE_INITIAL_COMMERCE_TERMS,
  BRAND_PROFILE_INITIAL_CONTACTS,
  BRAND_PROFILE_INITIAL_LEGAL,
  BRAND_PROFILE_INITIAL_PRESS_KIT_ASSETS,
  type BrandProfileChangelogEntry,
} from './brand-profile-demo-seed';

export default function BrandProfilePage() {
  const searchParams = useSearchParamsNonNull();
  const router = useRouter();
  const { toast } = useToast();
  const { can } = useRbac();
  const canEditProfile = can('brand_profile', 'edit');
  const { businessMode } = useUIState();
  const { loading: syncLoading, sync, lastSynced } = useBrandProfileSync('syntha-1');
  useNotificationPolling('syntha-1', 90000); // Live-updates каждые 90 сек
  const initialBrand =
    brands && brands.length > 0
      ? brands.find((b) => b.slug?.includes('syntha') || b.id?.includes('syntha')) || brands[0]
      : BRAND_PROFILE_DEFAULT_SYNTHA_BRAND;

  const [brand, setBrand] = useState<Brand>(initialBrand);
  const [activeTab, setActiveTab] = useState<string>('brand');
  const [activeGroup, setActiveGroup] = useState<string>('profile');
  const [isEditing, setIsEditing] = useState(false);
  const effectiveIsEditing = canEditProfile && isEditing;

  const [legalData, setLegalData] = useState<BrandProfileLegalDataState>(BRAND_PROFILE_INITIAL_LEGAL);
  const [contacts, setContacts] = useState<BrandProfileContactsState>(BRAND_PROFILE_INITIAL_CONTACTS);
  const [brandInfo, setBrandInfo] = useState<BrandProfileBrandInfoState>(BRAND_PROFILE_INITIAL_BRAND_INFO);
  const [brandContacts, setBrandContacts] =
    useState<BrandProfileBrandContactsState>(BRAND_PROFILE_INITIAL_BRAND_CONTACTS);
  const [mediaViewerOpen, setMediaViewerOpen] = useState(false);
  const [mediaViewerType, setMediaViewerType] = useState<AssetTypeId | null>(null);
  const [pressKitAutoArchiveDays, setPressKitAutoArchiveDays] = useState(90);
  const [pressKitAssets, setPressKitAssets] = useState<Record<AssetTypeId, MediaAssetItem[]>>(
    BRAND_PROFILE_INITIAL_PRESS_KIT_ASSETS
  );
  const [commerceTerms, setCommerceTerms] = useState(BRAND_PROFILE_INITIAL_COMMERCE_TERMS);

  const [isVerifying, setIsVerifying] = useState<string | null>(null);
  const [uploadingCertificate, setUploadingCertificate] = useState<number | null>(null);
  const [showCertificateDialog, setShowCertificateDialog] = useState(false);
  const [showChangelogDialog, setShowChangelogDialog] = useState(false);
  const [changelogFilter, setChangelogFilter] = useState<'all' | string>('all');
  const [onlineStorePickerOpen, setOnlineStorePickerOpen] = useState(false);
  useEffect(() => {
    const tab = searchParams.get('tab');
    const group = searchParams.get('group');
    /** Группа «Обзор» (strategy / overview) заморожена — старые ссылки ведут на Профиль → Бренд */
    const legacyOverview = group === 'strategy' || group === 'organization' || tab === 'overview';
    if (legacyOverview) {
      startTransition(() => {
        setActiveGroup('profile');
        setActiveTab('brand');
      });
      const resolved = searchParams.get('returnResolved');
      const qs = new URLSearchParams();
      qs.set('tab', 'brand');
      if (resolved) qs.set('returnResolved', resolved);
      router.replace(`/brand/profile?${qs.toString()}`);
      return;
    }
    if (tab === 'dna' || tab === 'contacts') {
      startTransition(() => {
        setActiveGroup('profile');
        setActiveTab('brand');
      });
    } else if (
      tab &&
      [
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
      startTransition(() => {
        setActiveTab(tab);
        setActiveGroup(tab === 'commerce' ? 'b2b' : 'profile');
      });
    }
  }, [searchParams, router]);

  // При смене B2B/B2C режима — переключить на соответствующий контент
  const prevModeRef = useRef(businessMode);
  useEffect(() => {
    if (prevModeRef.current !== businessMode) {
      prevModeRef.current = businessMode;
      startTransition(() => {
        if (businessMode === 'b2c') {
          setActiveGroup('partners');
          setActiveTab('pre-orders');
        } else {
          setActiveGroup('profile');
          setActiveTab('brand');
        }
      });
    }
  }, [businessMode]);

  const [certificates, setCertificates] = useState<BrandProfileCertificateItem[]>(
    BRAND_PROFILE_INITIAL_CERTIFICATES
  );

  const [changelog, setChangelog] = useState<BrandProfileChangelogEntry[]>(BRAND_PROFILE_INITIAL_CHANGELOG);

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
  const handleChangelogRollback = (entry: BrandProfileChangelogEntry) => {
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
    <RegistryPageShell variant="cabinet" className="space-y-4 sm:space-y-5">
      <RegistryPageHeader
        title="Профиль бренда"
        leadPlain={
          activeGroup === 'b2b'
            ? 'Коммерческие условия, B2B и публичная витрина.'
            : 'Карточка бренда, юридические данные, сертификаты и пресс-материалы.'
        }
        className="pb-4"
        actions={
          <div className="flex shrink-0 flex-wrap items-center gap-2">
            <Button variant="outline" size="sm" className="h-9" asChild>
              <Link href={ROUTES.brand.settings}>
                <Settings className="mr-1.5 size-4" /> Настройки
              </Link>
            </Button>
            {canEditProfile && (
              <Button
                variant={effectiveIsEditing ? 'default' : 'outline'}
                size="sm"
                className={cn(
                  'h-9',
                  effectiveIsEditing
                    ? 'bg-accent-primary text-text-inverse hover:bg-accent-hover'
                    : ''
                )}
                onClick={() => {
                  const wasEditing = isEditing;
                  setIsEditing(!isEditing);
                  if (wasEditing && searchParams.get('returnResolved')) {
                    const qs = new URLSearchParams();
                    qs.set('tab', 'brand');
                    qs.set('returnResolved', searchParams.get('returnResolved')!);
                    router.replace(`/brand/profile?${qs.toString()}`);
                  }
                }}
              >
                {effectiveIsEditing ? (
                  <>
                    <Save className="mr-1.5 size-4" /> Сохранить
                  </>
                ) : (
                  <>
                    <Edit className="mr-1.5 size-4" /> Редактировать
                  </>
                )}
              </Button>
            )}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="h-9 px-2">
                  <MoreHorizontal className="size-4" />
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
                  className="gap-2 text-xs"
                >
                  <RefreshCcw className={cn('size-3.5', syncLoading && 'animate-spin')} />{' '}
                  Синхронизация
                  {lastSynced && (
                    <span className="ml-auto text-sm text-text-muted">
                      {lastSynced.toLocaleTimeString('ru-RU', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  )}
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setShowChangelogDialog(true)}
                  className="gap-2 text-xs"
                >
                  <History className="size-3.5" /> История изменений
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
                      dna: BRAND_PROFILE_EXPORT_DNA,
                      contacts,
                      commerce: commerceTerms,
                      legal: legalData,
                    });
                    toast({ title: 'Экспорт', description: 'Профиль экспортирован в CSV' });
                  }}
                  className="gap-2 text-xs"
                >
                  <FileSpreadsheet className="size-3.5" /> Экспорт CSV
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => {
                    exportBrandProfilePDF();
                    toast({ title: 'PDF', description: 'Используйте печать браузера' });
                  }}
                  className="gap-2 text-xs"
                >
                  <FileText className="size-3.5" /> Экспорт PDF
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        }
      />

      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-text-secondary">
        {!canEditProfile && (
          <Badge
            variant="outline"
            className="border-border-subtle bg-bg-surface2 text-xs font-medium text-text-secondary"
          >
            Только просмотр
          </Badge>
        )}
        <Badge
          variant="outline"
          className="border-state-success/30 bg-state-success/10 text-xs font-medium text-state-success"
        >
          <Check className="mr-1 size-3.5" /> Верифицирован
        </Badge>
        <span className="inline-flex items-center gap-1.5">
          <Calendar className="size-4 text-text-muted" />
          Основан в {brand.foundedYear}
        </span>
        <span className="inline-flex items-center gap-1.5">
          <Globe className="size-4 text-text-muted" />
          {brand.countryOfOrigin}
        </span>
        <Link
          href={ROUTES.brand.customerActivity}
          className="inline-flex items-center gap-1.5 font-medium text-accent-primary hover:text-accent-hover"
        >
          <Users className="size-4" />
          {(brand.followers || 0).toLocaleString('ru-RU')} подписчиков
        </Link>
      </div>

      {/* cabinetSurface v1: группа разделов + вкладки — единый стиль кабинета */}
      <div
        className={cn(cabinetSurface.groupTabList, 'mb-0.5 w-full flex-wrap gap-0.5')}
        role="tablist"
        aria-label="Группа разделов профиля"
      >
        <button
          type="button"
          role="tab"
          aria-selected={activeGroup === 'profile'}
          onClick={() => {
            setActiveGroup('profile');
            setActiveTab('brand');
          }}
          className={cn(
            cabinetSurface.groupTabButton,
            activeGroup === 'profile' && cabinetSurface.groupTabButtonActive
          )}
        >
          Профиль
        </button>
        {businessMode === 'b2b' && (
          <button
            type="button"
            role="tab"
            aria-selected={activeGroup === 'b2b'}
            onClick={() => {
              setActiveGroup('b2b');
              setActiveTab('commerce');
            }}
            className={cn(
              cabinetSurface.groupTabButton,
              activeGroup === 'b2b' && cabinetSurface.groupTabButtonActive
            )}
          >
            B2B и продажи
          </button>
        )}
      </div>

      <Card className={cn(registryFeedLayout.panelCardSoft, 'p-4 md:p-6')}>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-5">
          <TabsList className={cn(cabinetSurface.tabsList, 'min-h-9 w-full flex-wrap gap-0.5 shadow-inner')}>
            <AnimatePresence>
              {activeGroup === 'profile' && (
                <motion.div
                  key="profile-tabs"
                  initial={{ opacity: 0, x: -4 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 4 }}
                  className="flex flex-wrap items-center gap-1.5"
                >
                  <TabsTrigger value="brand" className={cabinetSurface.tabsTrigger}>
                    <Building2 className="size-3.5 shrink-0" /> Бренд
                  </TabsTrigger>
                  <TabsTrigger value="legal" className={cabinetSurface.tabsTrigger}>
                    <FileText className="size-3.5 shrink-0" /> Юр. данные
                  </TabsTrigger>
                  <TabsTrigger value="certificates" className={cabinetSurface.tabsTrigger}>
                    <Award className="size-3.5 shrink-0" /> Сертификаты
                  </TabsTrigger>
                  <TabsTrigger value="presskit" className={cabinetSurface.tabsTrigger}>
                    <Newspaper className="size-3.5 shrink-0" /> Пресс-кит
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
                  <TabsTrigger value="commerce" className={cabinetSurface.tabsTrigger}>
                    <Package className="size-3.5 shrink-0" /> Коммерция
                  </TabsTrigger>
                </motion.div>
              )}
            </AnimatePresence>
          </TabsList>

          <BrandProfileBrandTab
            brand={brand}
            setBrand={setBrand}
            brandInfo={brandInfo}
            setBrandInfo={setBrandInfo}
            contacts={contacts}
            setContacts={setContacts}
            brandContacts={brandContacts}
            setBrandContacts={setBrandContacts}
            isEditing={effectiveIsEditing}
            onlineStorePickerOpen={onlineStorePickerOpen}
            setOnlineStorePickerOpen={setOnlineStorePickerOpen}
            tabPanelClassName={cabinetSurface.cabinetProfileTabPanel}
          />

          <BrandProfileCommerceTab
            commerceTerms={commerceTerms}
            setCommerceTerms={setCommerceTerms}
            isEditing={effectiveIsEditing}
            tabPanelClassName={cabinetSurface.cabinetProfileTabPanel}
          />

          <BrandProfileLegalTab
            legalData={legalData}
            setLegalData={setLegalData}
            isEditing={effectiveIsEditing}
            isVerifying={isVerifying}
            onVerifyLegal={() => handleVerify('legal')}
            tabPanelClassName={cabinetSurface.cabinetProfileTabPanel}
          />

          <BrandProfileCertificatesTab
            certificates={certificates}
            isEditing={effectiveIsEditing}
            canEditProfile={canEditProfile}
            tabPanelClassName={cabinetSurface.cabinetProfileTabPanel}
            showCertificateDialog={showCertificateDialog}
            setShowCertificateDialog={setShowCertificateDialog}
            uploadingCertificate={uploadingCertificate}
            setUploadingCertificate={setUploadingCertificate}
            onUploadCertificate={handleUploadCertificate}
          />

          <BrandProfilePresskitTab
            brand={brand}
            isEditing={effectiveIsEditing}
            tabPanelClassName={cabinetSurface.cabinetProfileTabPanel}
            pressKitAssets={pressKitAssets}
            setPressKitAssets={setPressKitAssets}
            mediaViewerOpen={mediaViewerOpen}
            setMediaViewerOpen={setMediaViewerOpen}
            mediaViewerType={mediaViewerType}
            setMediaViewerType={setMediaViewerType}
            pressKitAutoArchiveDays={pressKitAutoArchiveDays}
            setPressKitAutoArchiveDays={setPressKitAutoArchiveDays}
          />

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

      {/* Changelog Dialog */}
      <Dialog open={showChangelogDialog} onOpenChange={setShowChangelogDialog}>
        <DialogContent className="max-h-[85vh] rounded-xl border-border-default sm:max-w-[650px]">
          <DialogHeader className="border-b border-border-subtle pb-4">
            <DialogTitle className="flex items-center gap-2 text-base font-bold uppercase tracking-tight text-text-primary">
              <History className="h-4.5 w-4.5 text-accent-primary" />
              История изменений профиля
            </DialogTitle>
            <DialogDescription className="text-sm font-medium text-text-muted">
              Архив действий — фильтр по полю, экспорт CSV, откат
            </DialogDescription>
            <div className="flex flex-wrap gap-2 pt-3">
              <div className="flex rounded-lg bg-bg-surface2 p-1">
                <button
                  onClick={() => setChangelogFilter('all')}
                  className={cn(
                    'rounded px-2 py-1 text-[9px] font-bold uppercase',
                    changelogFilter === 'all' ? 'bg-white shadow' : 'text-text-muted'
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
                      changelogFilter === f ? 'bg-white shadow' : 'text-text-muted'
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
                className="group flex gap-3 rounded-xl border border-border-subtle bg-bg-surface2 p-3 transition-all hover:border-accent-soft hover:bg-white"
              >
                <div className="flex shrink-0 flex-col items-center gap-2 pt-1">
                  <div className="flex size-8 items-center justify-center rounded-lg border border-border-subtle bg-white text-text-muted shadow-sm transition-colors group-hover:text-accent-primary">
                    <History className="size-4" />
                  </div>
                  <div className="h-full w-px bg-border-default/60" />
                </div>

                <div className="flex-1 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-bold uppercase tracking-tight text-text-primary">
                        {entry.user}
                      </p>
                      <Badge
                        variant="outline"
                        className="h-4 rounded-md border-border-default bg-white px-1.5 text-[8px] font-bold uppercase text-text-muted"
                      >
                        {entry.field}
                      </Badge>
                    </div>
                    <span className="text-[9px] font-bold uppercase tabular-nums text-text-muted">
                      {entry.date}
                    </span>
                  </div>

                  <p className="text-sm font-medium text-text-secondary">{entry.action}</p>

                  {entry.oldValue && (
                    <div className="grid grid-cols-2 gap-2 pt-2">
                      <div className="space-y-1">
                        <p className="px-1 text-[7px] font-bold uppercase tracking-widest text-text-muted">
                          Было
                        </p>
                        <div className="truncate rounded-lg border border-state-error/30 bg-state-error/10 px-2.5 py-1.5 text-xs italic leading-tight text-text-muted">
                          {entry.oldValue}
                        </div>
                      </div>
                      <div className="space-y-1">
                        <p className="px-1 text-[7px] font-bold uppercase tracking-widest text-text-muted">
                          Стало
                        </p>
                        <div className="bg-state-success/10/50 border-state-success/30/50 truncate rounded-lg border px-2.5 py-1.5 text-xs font-bold leading-tight text-text-primary">
                          {entry.newValue}
                        </div>
                      </div>
                    </div>
                  )}
                  {!entry.oldValue && entry.newValue && (
                    <div className="pt-2">
                      <p className="mb-1 px-1 text-[7px] font-bold uppercase tracking-widest text-text-muted">
                        Добавлено
                      </p>
                      <div className="rounded-lg border border-accent-soft/50 bg-accent-soft/50 px-2.5 py-1.5 text-xs font-bold leading-tight text-text-primary">
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
                      <RotateCcw className="mr-1 size-3" /> Откатить
                    </Button>
                  )}
                </div>
              </motion.div>
            ))}
          </div>

          <DialogFooter className="gap-2 border-t border-border-subtle pt-4">
            <Button
              variant="ghost"
              className="h-8 rounded-lg text-[9px] font-bold uppercase tracking-widest text-text-muted hover:bg-bg-surface2"
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
              <Download className="mr-1.5 size-3.5" />
              Export CSV
            </Button>
            <Button
              onClick={() => setShowChangelogDialog(false)}
              className="h-8 rounded-lg bg-text-primary px-6 text-[9px] font-bold uppercase tracking-widest text-white"
            >
              Закрыть
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </RegistryPageShell>
  );
}

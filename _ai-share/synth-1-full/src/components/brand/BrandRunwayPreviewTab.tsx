'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { Check, Copy, ExternalLink, Save, Upload } from 'lucide-react';
import type {
  Product,
  ProductDisplayMode,
  RunwayLookItem,
  ScrollExperienceConfig,
} from '@/lib/types';
import {
  loadScrollExperienceConfig,
  resolveBrandFeaturedScrollProduct,
  productSupportsScrollVideo,
  resolveScrollSwitcherSections,
  resolveScrollVideoSources,
  filterScrollVideoProducts,
} from '@/lib/product-scroll-switcher';
import type { ProductScrollSwitcherSection } from '@/lib/types';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { RUNWAY_DOCS_PATH } from '@/lib/scroll-switcher-constants';
import { ProductScrollSwitcher } from '@/components/product/ProductScrollSwitcher';
import { TabsContent } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  getScrollExperienceMetrics,
  resetScrollExperienceMetrics,
  type ScrollExperienceMetricsSnapshot,
} from '@/lib/scroll-experience-analytics';
import { t } from '@/lib/runway/runway-i18n';
import {
  loadBrandRunwayOverridesFromJson,
  loadBrandRunwayOverridesFromStorage,
  loadBrandRunwayCdnFromStorage,
  mergeOverrideMaps,
  mergeBrandVideoCdnSources,
  mergeProductsWithRunwayOverrides,
  applyBrandOverridesToProduct,
  saveBrandRunwayOverridesToStorage,
  saveBrandRunwayCdnToStorage,
  resolveBrandVideoCdnBaseUrl,
  setBrandRunwayOverride,
  type BrandRunwayOverridesFile,
} from '@/lib/brand-runway-overrides';
import { resolveVideoCdnUrl } from '@/lib/runway/runway-video-cdn';
import { resetRunwayExperienceCache } from '@/lib/runway/RunwayExperienceService';

interface BrandRunwayPreviewTabProps {
  brandName: string;
  brandSlug?: string;
  tabPanelClassName?: string;
}

function buildRunwayChecklist(product: Product) {
  const sections = resolveScrollSwitcherSections(product);
  const video = resolveScrollVideoSources(product);
  const hasPerSectionVideo = sections.some((s) => Boolean(s.sectionVideoUrl));
  const hasImages = sections.every((_, index) =>
    Boolean(sections[index].sectionImageUrl || sections[index].thumbImageUrl)
  );

  return [
    { ok: sections.length >= 1, label: `${sections.length} секций настроено` },
    { ok: hasImages, label: 'Изображения секций' },
    { ok: hasPerSectionVideo, label: 'Клипы по секциям (sectionVideoUrl)', optional: true },
    { ok: Boolean(video.mp4 || video.webm), label: 'Общее видео (fallback)', optional: true },
  ];
}

/**
 * Превью runway + демо-настройки для бренд-админки.
 * Overrides: localStorage (демо) + public/data/brand-runway-overrides.json.
 */
export function BrandRunwayPreviewTab({
  brandName,
  brandSlug,
  tabPanelClassName,
}: BrandRunwayPreviewTabProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [featured, setFeatured] = useState<Product | undefined>();
  const [selectedSlug, setSelectedSlug] = useState<string>('');
  const [overrides, setOverrides] = useState<BrandRunwayOverridesFile>({});
  const [metrics, setMetrics] = useState<ScrollExperienceMetricsSnapshot | null>(null);
  const [saveNote, setSaveNote] = useState<string | null>(null);
  const [exportSnippet, setExportSnippet] = useState<string | null>(null);
  const [sectionDraft, setSectionDraft] = useState<ProductScrollSwitcherSection[]>([]);
  const [scrollVideoDraft, setScrollVideoDraft] = useState('');
  const [wizardSlug, setWizardSlug] = useState('');
  const [wizardBusy, setWizardBusy] = useState(false);
  const [wizardNote, setWizardNote] = useState<string | null>(null);
  const [productsJsonSnippet, setProductsJsonSnippet] = useState<string | null>(null);
  const [uploadNote, setUploadNote] = useState<string | null>(null);
  const [uploadBusy, setUploadBusy] = useState(false);
  const [scrollConfig, setScrollConfig] = useState<ScrollExperienceConfig | null>(null);
  const [brandCdnDraft, setBrandCdnDraft] = useState('');
  const [cdnLocalOverrides, setCdnLocalOverrides] = useState<Record<string, string>>({});
  const [cdnSaveNote, setCdnSaveNote] = useState<string | null>(null);
  const [uploadPresignEnabled, setUploadPresignEnabled] = useState(false);
  const [uploadS3Configured, setUploadS3Configured] = useState(false);
  const [uploadLocalEnabled, setUploadLocalEnabled] = useState(false);

  const resolvedBrandSlug = useMemo(() => {
    if (brandSlug?.trim()) return brandSlug.trim().toLowerCase();
    return brandName
      .trim()
      .toLowerCase()
      .replace(/[^\w\s-]+/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');
  }, [brandName, brandSlug]);

  useEffect(() => {
    let cancelled = false;
    Promise.all([
      fetch('/data/products.json').then((r) => r.json() as Promise<Product[]>),
      loadScrollExperienceConfig(),
      loadBrandRunwayOverridesFromJson(),
      fetch('/api/runway/config')
        .then((r) =>
          r.ok
            ? (r.json() as Promise<
                ScrollExperienceConfig & {
                  upload?: {
                    presignEnabled?: boolean;
                    s3Configured?: boolean;
                    localMultipartEnabled?: boolean;
                  };
                }
              >)
            : null
        )
        .catch(() => null),
    ]).then(([allProducts, configFallback, jsonOverrides, apiConfig]) => {
      if (cancelled) return;
      const cdnLocal = loadBrandRunwayCdnFromStorage();
      const config = apiConfig ?? configFallback;
      const cdnMerged = mergeBrandVideoCdnSources(config, cdnLocal);
      const mergedOverrides = mergeOverrideMaps(
        jsonOverrides,
        loadBrandRunwayOverridesFromStorage()
      );
      const mergedProducts = mergeProductsWithRunwayOverrides(allProducts, mergedOverrides);
      setScrollConfig({ ...config, ...cdnMerged });
      setCdnLocalOverrides(cdnLocal);
      setUploadPresignEnabled(Boolean(apiConfig?.upload?.presignEnabled));
      setUploadS3Configured(Boolean(apiConfig?.upload?.s3Configured));
      setUploadLocalEnabled(Boolean(apiConfig?.upload?.localMultipartEnabled));
      setBrandCdnDraft(
        resolveBrandVideoCdnBaseUrl(brandName, cdnMerged, cdnLocal) ??
          cdnMerged.videoCdnBaseUrl ??
          ''
      );
      setOverrides(mergedOverrides);
      setProducts(mergedProducts);
      const brandFeatured = resolveBrandFeaturedScrollProduct(mergedProducts, brandName, config);
      setFeatured(brandFeatured);
      setSelectedSlug(brandFeatured?.slug ?? '');
      setMetrics(getScrollExperienceMetrics());
    });
    return () => {
      cancelled = true;
    };
  }, [brandName]);

  const brandScrollProducts = useMemo(
    () => filterScrollVideoProducts(products).filter((p) => p.brand === brandName),
    [products, brandName]
  );

  const brandCatalogProducts = useMemo(
    () => products.filter((p) => p.brand === brandName),
    [products, brandName]
  );

  const wizardProduct = useMemo(
    () => brandCatalogProducts.find((p) => p.slug === wizardSlug),
    [brandCatalogProducts, wizardSlug]
  );

  const wizardSections = useMemo(() => {
    if (!wizardProduct) return [];
    return resolveScrollSwitcherSections(wizardProduct);
  }, [wizardProduct]);

  const previewProduct = useMemo(() => {
    if (selectedSlug) {
      return brandScrollProducts.find((p) => p.slug === selectedSlug) ?? featured;
    }
    if (featured) return featured;
    return brandScrollProducts[0];
  }, [selectedSlug, featured, brandScrollProducts]);

  const checklist = previewProduct ? buildRunwayChecklist(previewProduct) : [];

  useEffect(() => {
    if (!previewProduct) {
      setSectionDraft([]);
      setScrollVideoDraft('');
      return;
    }
    setSectionDraft(resolveScrollSwitcherSections(previewProduct));
    setScrollVideoDraft(previewProduct.scrollVideoUrl ?? '');
  }, [previewProduct]);

  const previewProductLive = useMemo(() => {
    if (!previewProduct) return undefined;
    return applyBrandOverridesToProduct(
      {
        ...previewProduct,
        scrollVideoUrl: scrollVideoDraft || previewProduct.scrollVideoUrl,
        scrollSwitcherSections: sectionDraft.length
          ? sectionDraft
          : previewProduct.scrollSwitcherSections,
      },
      overrides
    );
  }, [previewProduct, sectionDraft, scrollVideoDraft, overrides]);

  const effectiveCdnBase = useMemo(
    () =>
      brandCdnDraft.trim() ||
      resolveBrandVideoCdnBaseUrl(brandName, scrollConfig ?? undefined, cdnLocalOverrides) ||
      scrollConfig?.videoCdnBaseUrl?.trim() ||
      undefined,
    [brandCdnDraft, brandName, scrollConfig, cdnLocalOverrides]
  );

  const cdnPreviewUrls = useMemo(() => {
    if (!previewProductLive) return null;
    const cdnOpts = {
      baseUrl: effectiveCdnBase,
      signedQuery: scrollConfig?.videoCdnSignedQuery,
    };
    const hero = resolveVideoCdnUrl(scrollVideoDraft || previewProductLive.scrollVideoUrl, cdnOpts);
    const sections = (
      sectionDraft.length ? sectionDraft : (previewProductLive.scrollSwitcherSections ?? [])
    ).map((s, i) => ({
      index: i,
      raw: s.sectionVideoUrl,
      resolved: resolveVideoCdnUrl(s.sectionVideoUrl, cdnOpts),
    }));
    return { hero, sections };
  }, [
    previewProductLive,
    scrollVideoDraft,
    sectionDraft,
    effectiveCdnBase,
    scrollConfig?.videoCdnSignedQuery,
  ]);

  const persistBrandCdnOverride = useCallback(async () => {
    const trimmed = brandCdnDraft.trim();
    const next = { ...cdnLocalOverrides, [brandName]: trimmed };
    if (!trimmed) {
      delete next[brandName];
    }
    setCdnLocalOverrides(next);
    saveBrandRunwayCdnToStorage(next);

    try {
      const res = await fetch('/api/runway/config/brand-cdn', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          brandName,
          videoCdnBaseUrl: trimmed || null,
        }),
      });
      if (res.ok) {
        const body = (await res.json()) as { brandVideoCdnBaseUrl?: Record<string, string> };
        setScrollConfig((prev) =>
          prev
            ? {
                ...prev,
                brandVideoCdnBaseUrl: body.brandVideoCdnBaseUrl ?? prev.brandVideoCdnBaseUrl,
              }
            : prev
        );
        setCdnSaveNote(t('runway.cdn.savedApi'));
        window.setTimeout(() => setCdnSaveNote(null), 4000);
        return;
      }
    } catch {
      /* local fallback */
    }

    setCdnSaveNote(t('runway.cdn.savedLocal'));
    window.setTimeout(() => setCdnSaveNote(null), 4000);
  }, [brandCdnDraft, brandName, cdnLocalOverrides]);

  const formSlug = previewProduct?.slug ?? selectedSlug;
  const canUploadVideo = (uploadPresignEnabled && uploadS3Configured) || uploadLocalEnabled;
  const currentOverride = formSlug ? overrides[brandName]?.[formSlug] : undefined;
  const scrollVideoEnabled =
    currentOverride?.displayMode === 'scroll-video' ||
    (currentOverride?.displayMode == null && previewProduct?.displayMode === 'scroll-video');
  const featuredFlag =
    currentOverride?.featuredScrollExperience ?? previewProduct?.featuredScrollExperience ?? false;

  const buildConfigFromDraft = useCallback(
    () => ({
      ...(currentOverride ?? {}),
      displayMode: scrollVideoEnabled ? ('scroll-video' as const) : ('standard' as const),
      featuredScrollExperience: featuredFlag,
      scrollVideoUrl: scrollVideoDraft || undefined,
      scrollSwitcherSections: sectionDraft,
    }),
    [currentOverride, scrollVideoEnabled, featuredFlag, scrollVideoDraft, sectionDraft]
  );

  const saveProductConfig = useCallback(
    async (config: Record<string, unknown>, slug = formSlug) => {
      if (!slug) return false;
      try {
        const res = await fetch('/api/runway/product-config', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ brandName, slug, config, persistTo: 'both' }),
        });
        if (!res.ok) return false;
        const body = (await res.json()) as { config?: Record<string, unknown> };
        const entryPatch = body.config ?? config;
        const next = setBrandRunwayOverride(overrides, brandName, slug, entryPatch);
        setOverrides(next);
        saveBrandRunwayOverridesToStorage(next);
        setProducts((prev) => mergeProductsWithRunwayOverrides(prev, next));
        resetRunwayExperienceCache();
        setSaveNote(t('runway.overridesSavedApi'));
        window.setTimeout(() => setSaveNote(null), 4000);
        return true;
      } catch {
        setSaveNote(t('runway.overridesSavedLocal'));
        window.setTimeout(() => setSaveNote(null), 4000);
        return false;
      }
    },
    [brandName, formSlug, overrides]
  );

  const saveOverrides = useCallback(
    async (
      next: BrandRunwayOverridesFile,
      patch?: { brandName: string; slug: string; patch: Record<string, unknown> }
    ) => {
      setOverrides(next);
      saveBrandRunwayOverridesToStorage(next);
      setProducts((prev) => mergeProductsWithRunwayOverrides(prev, next));

      if (patch) {
        try {
          const res = await fetch('/api/runway/overrides', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(patch),
          });
          if (res.ok) {
            setSaveNote(t('runway.overridesSavedApi'));
            window.setTimeout(() => setSaveNote(null), 4000);
            return;
          }
        } catch {
          /* local fallback note */
        }
      }

      setSaveNote(t('runway.overridesSavedLocal'));
      window.setTimeout(() => setSaveNote(null), 4000);
    },
    []
  );

  const persistOverride = useCallback(
    (patch: { displayMode?: ProductDisplayMode; featuredScrollExperience?: boolean }) => {
      if (!formSlug) return;
      const entryPatch = {
        ...(overrides[brandName]?.[formSlug] ?? {}),
        ...patch,
      };
      const next = setBrandRunwayOverride(overrides, brandName, formSlug, entryPatch);
      void saveOverrides(next, { brandName, slug: formSlug, patch: entryPatch });
    },
    [overrides, brandName, formSlug, saveOverrides]
  );

  const enableRunwayForWizard = useCallback(async () => {
    if (!wizardProduct || !wizardSlug) return;
    setWizardBusy(true);
    setWizardNote(null);

    const entryPatch = {
      displayMode: 'scroll-video' as const,
      scrollSwitcherSections: wizardSections,
      featuredScrollExperience: false,
    };

    const saved = await saveProductConfig(entryPatch, wizardSlug);
    if (!saved) {
      const next = setBrandRunwayOverride(overrides, brandName, wizardSlug, entryPatch);
      await saveOverrides(next, { brandName, slug: wizardSlug, patch: entryPatch });
    }
    setSelectedSlug(wizardSlug);
    setWizardNote(t('runway.enableWizard.saved'));
    setWizardBusy(false);
  }, [
    wizardProduct,
    wizardSlug,
    wizardSections,
    overrides,
    brandName,
    saveProductConfig,
    saveOverrides,
  ]);

  const persistSectionDraft = useCallback(() => {
    if (!formSlug) return;
    void saveProductConfig(buildConfigFromDraft());
  }, [formSlug, saveProductConfig, buildConfigFromDraft]);

  const handleExportSectionsJson = useCallback(() => {
    if (!formSlug) return;
    const snippet = JSON.stringify(
      { [brandName]: { [formSlug]: { scrollSwitcherSections: sectionDraft } } },
      null,
      2
    );
    setExportSnippet(snippet);
    void navigator.clipboard?.writeText(snippet);
  }, [brandName, formSlug, sectionDraft]);

  const handleExportProductsJson = useCallback(() => {
    if (!previewProductLive || !formSlug) return;
    const snippet = JSON.stringify(
      {
        slug: previewProductLive.slug,
        displayMode: previewProductLive.displayMode,
        scrollVideoUrl: previewProductLive.scrollVideoUrl,
        scrollSwitcherSections: previewProductLive.scrollSwitcherSections,
        featuredScrollExperience: previewProductLive.featuredScrollExperience,
      },
      null,
      2
    );
    setProductsJsonSnippet(snippet);
    void navigator.clipboard?.writeText(snippet);
  }, [previewProductLive, formSlug]);

  const uploadSectionVideo = useCallback(
    async (
      file: File,
      onUrl: (url: string) => void,
      opts?: { sectionIndex?: number; productSlug?: string }
    ) => {
      if (!resolvedBrandSlug) return;
      const productSlug = opts?.productSlug ?? formSlug;
      setUploadBusy(true);
      setUploadNote(null);
      try {
        if (uploadPresignEnabled && uploadS3Configured) {
          const presignRes = await fetch('/api/runway/upload/presign', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              brandSlug: resolvedBrandSlug,
              productSlug: productSlug || undefined,
              sectionIndex: opts?.sectionIndex,
              contentType: 'video/mp4',
              contentLength: file.size,
            }),
          });

          const presignBody = (await presignRes.json()) as {
            error?: string;
            uploadUrl?: string;
            publicUrl?: string;
            relativePath?: string;
            method?: 'PUT';
            headers?: Record<string, string>;
          };

          if (!presignRes.ok) {
            throw new Error(presignBody.error ?? t('runway.uploadR2Disabled'));
          }

          if (presignBody.uploadUrl && presignBody.publicUrl) {
            const putRes = await fetch(presignBody.uploadUrl, {
              method: presignBody.method ?? 'PUT',
              headers: presignBody.headers ?? { 'Content-Type': 'video/mp4' },
              body: file,
            });
            if (!putRes.ok) {
              throw new Error(`Upload failed: HTTP ${putRes.status}`);
            }
            const storedPath =
              effectiveCdnBase && presignBody.relativePath
                ? presignBody.relativePath
                : presignBody.publicUrl;
            onUrl(storedPath);
            setUploadNote(t('runway.uploadSuccess', { url: storedPath }));
            window.setTimeout(() => setUploadNote(null), 5000);
            return;
          }
        }

        if (!uploadLocalEnabled) {
          throw new Error(t('runway.uploadR2Disabled'));
        }

        const form = new FormData();
        form.set('brandSlug', resolvedBrandSlug);
        form.set('file', file);
        const res = await fetch('/api/runway/upload', { method: 'POST', body: form });
        const body = (await res.json()) as { url?: string; error?: string };
        if (!res.ok || !body.url) {
          throw new Error(body.error ?? t('runway.uploadFailed'));
        }
        onUrl(body.url);
        setUploadNote(t('runway.uploadSuccess', { url: body.url }));
        window.setTimeout(() => setUploadNote(null), 5000);
      } catch (err) {
        setUploadNote(err instanceof Error ? err.message : t('runway.uploadFailed'));
      } finally {
        setUploadBusy(false);
      }
    },
    [
      resolvedBrandSlug,
      formSlug,
      uploadPresignEnabled,
      uploadS3Configured,
      uploadLocalEnabled,
      effectiveCdnBase,
    ]
  );

  const updateSectionField = (
    index: number,
    field: keyof ProductScrollSwitcherSection,
    value: string
  ) => {
    setSectionDraft((prev) => prev.map((s, i) => (i === index ? { ...s, [field]: value } : s)));
  };

  const updateLookItemField = (
    sectionIndex: number,
    lookIndex: number,
    field: keyof RunwayLookItem,
    value: string
  ) => {
    setSectionDraft((prev) =>
      prev.map((section, i) => {
        if (i !== sectionIndex) return section;
        const items = [...(section.sectionLookItems ?? [])];
        const current = items[lookIndex] ?? {
          name: '',
          price: 0,
          imageUrl: '',
          slug: '',
        };
        items[lookIndex] = {
          ...current,
          [field]: field === 'price' ? Number.parseFloat(value) || 0 : value,
        };
        return { ...section, sectionLookItems: items };
      })
    );
  };

  const addLookItem = (sectionIndex: number) => {
    setSectionDraft((prev) =>
      prev.map((section, i) =>
        i === sectionIndex
          ? {
              ...section,
              sectionLookItems: [
                ...(section.sectionLookItems ?? []),
                { name: 'Аксессуар', price: 0, imageUrl: '/images/placeholder.jpg', slug: '' },
              ],
            }
          : section
      )
    );
  };

  return (
    <TabsContent value="runway-preview" className={tabPanelClassName}>
      <div className="space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="text-sm font-semibold">Runway preview</h3>
          <Badge variant="secondary" className="text-[10px] uppercase">
            Runway admin
          </Badge>
          <Link
            href={RUNWAY_DOCS_PATH}
            className="ml-auto inline-flex items-center gap-1 text-xs text-primary hover:underline"
          >
            Документация
            <ExternalLink className="h-3 w-3" />
          </Link>
        </div>
        <p className="text-sm text-muted-foreground">
          Превью scroll-experience и быстрые переключатели без правки JSON вручную. База:{' '}
          <code className="text-xs">products.json</code>, overrides:{' '}
          <code className="text-xs">brand-runway-overrides.json</code> + localStorage.
        </p>

        <Card className="space-y-4 border-primary/20 p-4" data-runway-enable-wizard>
          <div>
            <h4 className="text-sm font-semibold">{t('runway.enableWizard.title')}</h4>
            <p className="text-xs text-muted-foreground">
              {t('runway.enableWizard.selectProduct')}
            </p>
          </div>
          <Select value={wizardSlug} onValueChange={setWizardSlug}>
            <SelectTrigger className="max-w-md">
              <SelectValue placeholder={t('runway.enableWizard.selectProduct')} />
            </SelectTrigger>
            <SelectContent>
              {brandCatalogProducts.map((p) => (
                <SelectItem key={p.slug} value={p.slug}>
                  {p.name}
                  {p.displayMode === 'scroll-video' ? ' · runway' : ''}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {wizardProduct && wizardSections.length > 0 ? (
            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                {t('runway.enableWizard.previewSections')} ({wizardSections.length})
              </p>
              <ul className="grid gap-2 sm:grid-cols-3">
                {wizardSections.map((s, i) => (
                  <li key={s.id} className="rounded-md border border-border p-2 text-xs">
                    <span className="font-medium">
                      {i + 1}. {s.label}
                    </span>
                    <span className="ml-2 font-mono text-muted-foreground">{s.color}</span>
                  </li>
                ))}
              </ul>
              <div className="flex flex-wrap gap-2">
                <Button
                  type="button"
                  size="sm"
                  disabled={wizardBusy}
                  data-runway-wizard-save
                  onClick={() => void enableRunwayForWizard()}
                >
                  <Save className="mr-1.5 h-3.5 w-3.5" />
                  {t('runway.enableWizard.save')}
                </Button>
                <Button type="button" size="sm" variant="outline" asChild>
                  <Link href={`/products/${wizardSlug}?view=runway`} target="_blank">
                    <ExternalLink className="mr-1.5 h-3.5 w-3.5" />
                    Превью PDP
                  </Link>
                </Button>
              </div>
              {wizardNote ? (
                <p className="text-xs text-primary">{wizardNote}</p>
              ) : (
                <p className="text-[10px] text-muted-foreground">
                  {t('runway.enableWizard.persistHint')}
                </p>
              )}
            </div>
          ) : wizardSlug ? (
            <p className="text-xs text-muted-foreground">
              Нет секций — добавьте availableColors или scrollSwitcherSections в products.json
            </p>
          ) : null}
        </Card>

        {brandScrollProducts.length > 1 ? (
          <Select
            value={selectedSlug || previewProduct?.slug || ''}
            onValueChange={setSelectedSlug}
          >
            <SelectTrigger className="max-w-md">
              <SelectValue placeholder={t('runway.brandPreview.selectProduct')} />
            </SelectTrigger>
            <SelectContent>
              {brandScrollProducts.map((p) => (
                <SelectItem key={p.slug} value={p.slug}>
                  {p.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        ) : null}

        {previewProduct && formSlug ? (
          <div className="space-y-3 rounded-lg border border-border bg-muted/20 p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Настройки SKU (демо)
            </p>
            <div className="flex flex-wrap items-center gap-6">
              <div className="flex items-center gap-2">
                <Switch
                  id="runway-display-mode"
                  checked={scrollVideoEnabled}
                  onCheckedChange={(on) =>
                    persistOverride({ displayMode: on ? 'scroll-video' : 'standard' })
                  }
                />
                <Label htmlFor="runway-display-mode" className="text-sm">
                  displayMode: scroll-video
                </Label>
              </div>
              <div className="flex items-center gap-2">
                <Switch
                  id="runway-featured"
                  checked={featuredFlag}
                  onCheckedChange={(on) => persistOverride({ featuredScrollExperience: on })}
                />
                <Label htmlFor="runway-featured" className="text-sm">
                  Featured на главной
                </Label>
              </div>
              <Button
                type="button"
                size="sm"
                variant="outline"
                className="gap-1.5"
                onClick={() => {
                  if (!formSlug) return;
                  persistOverride({
                    displayMode: 'scroll-video',
                    featuredScrollExperience: true,
                  });
                }}
              >
                <Save className="h-3.5 w-3.5" />
                Быстро: включить Runway
              </Button>
            </div>
            {saveNote ? (
              <p className="text-xs text-primary">{saveNote}</p>
            ) : (
              <p className="text-[10px] text-muted-foreground">
                Экспорт в репозиторий: скопируйте ключ{' '}
                <code className="text-[10px]">syntha-brand-runway-overrides</code> из DevTools →
                Application → Local Storage.
              </p>
            )}
          </div>
        ) : null}

        {previewProduct ? (
          <Card className="space-y-3 border-dashed p-4" data-runway-cdn-wizard>
            <div>
              <h4 className="text-sm font-semibold">{t('runway.cdn.title')}</h4>
              <p className="text-xs text-muted-foreground">
                {t('runway.cdn.globalBase')}:{' '}
                <code className="text-[10px]">
                  {scrollConfig?.videoCdnBaseUrl?.trim() || '— (local /videos)'}
                </code>
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="runway-brand-cdn-base" className="text-xs">
                {t('runway.cdn.brandOverride')}
              </Label>
              <Input
                id="runway-brand-cdn-base"
                value={brandCdnDraft}
                onChange={(e) => setBrandCdnDraft(e.target.value)}
                placeholder="https://media.yourbrand.com"
                className="h-8 font-mono text-xs"
              />
              <div className="flex flex-wrap gap-2">
                <Button type="button" size="sm" variant="outline" onClick={persistBrandCdnOverride}>
                  <Save className="mr-1.5 h-3.5 w-3.5" />
                  Сохранить CDN override
                </Button>
              </div>
              {cdnSaveNote ? <p className="text-xs text-primary">{cdnSaveNote}</p> : null}
            </div>
            {cdnPreviewUrls ? (
              <div className="space-y-1 rounded-md bg-muted/30 p-2 font-mono text-[10px]">
                <p className="font-sans text-xs font-semibold text-muted-foreground">
                  {t('runway.cdn.previewHero')}
                </p>
                <p className="break-all">{cdnPreviewUrls.hero ?? '—'}</p>
                {cdnPreviewUrls.sections.map((s) => (
                  <div key={s.index}>
                    <p className="font-sans text-xs font-semibold text-muted-foreground">
                      {t('runway.cdn.previewSection', { index: String(s.index + 1) })}
                    </p>
                    <p className="break-all">{s.resolved ?? s.raw ?? '—'}</p>
                  </div>
                ))}
              </div>
            ) : null}
            <p className="text-[10px] text-muted-foreground">{t('runway.cdn.migrateHint')}</p>
          </Card>
        ) : null}

        {previewProduct && sectionDraft.length > 0 ? (
          <div className="space-y-4 rounded-lg border border-border bg-muted/20 p-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Редактор секций (wizard)
              </p>
              <div className="flex flex-wrap gap-2">
                <Button type="button" size="sm" variant="outline" onClick={persistSectionDraft}>
                  <Save className="mr-1.5 h-3.5 w-3.5" />
                  Сохранить конфиг
                </Button>
                <Button type="button" size="sm" variant="ghost" onClick={handleExportSectionsJson}>
                  <Copy className="mr-1.5 h-3.5 w-3.5" />
                  Export overrides
                </Button>
                <Button type="button" size="sm" variant="ghost" onClick={handleExportProductsJson}>
                  <Copy className="mr-1.5 h-3.5 w-3.5" />
                  Export products.json
                </Button>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="runway-scroll-video-url" className="text-xs">
                scrollVideoUrl (fallback для всех секций)
              </Label>
              <Input
                id="runway-scroll-video-url"
                value={scrollVideoDraft}
                onChange={(e) => setScrollVideoDraft(e.target.value)}
                placeholder="/videos/demo-runway-hero.mp4 или https://cdn.example/clip.mp4"
                className="h-8 font-mono text-xs"
              />
              <div className="flex flex-wrap items-center gap-2">
                {canUploadVideo ? (
                  <Label
                    htmlFor="runway-scroll-video-upload"
                    className="inline-flex cursor-pointer items-center gap-1.5 rounded-md border border-dashed border-border px-2 py-1 text-[10px] font-medium hover:bg-muted/40"
                  >
                    <Upload className="h-3 w-3" />
                    Upload section video
                    <input
                      id="runway-scroll-video-upload"
                      type="file"
                      accept="video/mp4"
                      className="sr-only"
                      disabled={uploadBusy}
                      data-runway-video-upload="fallback"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        void uploadSectionVideo(file, (url) => setScrollVideoDraft(url), {
                          productSlug: formSlug,
                        });
                        e.target.value = '';
                      }}
                    />
                  </Label>
                ) : null}
                {(uploadPresignEnabled && uploadS3Configured) || uploadLocalEnabled ? (
                  <span className="text-[10px] text-muted-foreground">
                    {uploadPresignEnabled && uploadS3Configured
                      ? t('runway.uploadR2Hint')
                      : t('runway.uploadHint')}
                  </span>
                ) : null}
              </div>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              {sectionDraft.map((section, index) => (
                <div key={section.id} className="space-y-2 rounded-md border border-border p-3">
                  <p className="text-[10px] font-semibold uppercase text-muted-foreground">
                    Секция {index + 1}
                  </p>
                  <Label htmlFor={`sec-label-${index}`} className="text-xs">
                    Label
                  </Label>
                  <Input
                    id={`sec-label-${index}`}
                    value={section.label}
                    onChange={(e) => updateSectionField(index, 'label', e.target.value)}
                    className="h-8 text-xs"
                  />
                  <Label htmlFor={`sec-color-${index}`} className="text-xs">
                    Color
                  </Label>
                  <Input
                    id={`sec-color-${index}`}
                    value={section.color}
                    onChange={(e) => updateSectionField(index, 'color', e.target.value)}
                    className="h-8 font-mono text-xs"
                  />
                  <Label htmlFor={`sec-story-${index}`} className="text-xs">
                    Story
                  </Label>
                  <Textarea
                    id={`sec-story-${index}`}
                    value={section.sectionStory ?? ''}
                    onChange={(e) => updateSectionField(index, 'sectionStory', e.target.value)}
                    rows={2}
                    className="text-xs"
                  />
                  <Label htmlFor={`sec-tip-${index}`} className="text-xs">
                    AI tip
                  </Label>
                  <Textarea
                    id={`sec-tip-${index}`}
                    value={section.sectionAiTip ?? ''}
                    onChange={(e) => updateSectionField(index, 'sectionAiTip', e.target.value)}
                    rows={2}
                    className="text-xs"
                  />
                  <Label htmlFor={`sec-video-${index}`} className="text-xs">
                    sectionVideoUrl
                  </Label>
                  <Input
                    id={`sec-video-${index}`}
                    value={section.sectionVideoUrl ?? ''}
                    onChange={(e) => updateSectionField(index, 'sectionVideoUrl', e.target.value)}
                    placeholder="/videos/clip.mp4"
                    className="h-8 font-mono text-xs"
                  />
                  {canUploadVideo ? (
                    <Label
                      htmlFor={`sec-video-upload-${index}`}
                      className="inline-flex cursor-pointer items-center gap-1.5 rounded-md border border-dashed border-border px-2 py-1 text-[10px] font-medium hover:bg-muted/40"
                    >
                      <Upload className="h-3 w-3" />
                      Upload section video
                      <input
                        id={`sec-video-upload-${index}`}
                        type="file"
                        accept="video/mp4"
                        className="sr-only"
                        disabled={uploadBusy}
                        data-runway-video-upload={`section-${index}`}
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (!file) return;
                          void uploadSectionVideo(
                            file,
                            (url) => updateSectionField(index, 'sectionVideoUrl', url),
                            { sectionIndex: index, productSlug: formSlug }
                          );
                          e.target.value = '';
                        }}
                      />
                    </Label>
                  ) : null}
                  <div className="space-y-2 pt-1">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-[10px] font-semibold uppercase text-muted-foreground">
                        Look items
                      </p>
                      <Button
                        type="button"
                        size="sm"
                        variant="ghost"
                        className="h-6 text-[10px]"
                        onClick={() => addLookItem(index)}
                      >
                        + item
                      </Button>
                    </div>
                    {(section.sectionLookItems ?? []).map((item, lookIndex) => (
                      <div
                        key={`${section.id}-look-${lookIndex}`}
                        className="space-y-1 rounded border border-dashed p-2"
                      >
                        <Input
                          value={item.name}
                          onChange={(e) =>
                            updateLookItemField(index, lookIndex, 'name', e.target.value)
                          }
                          placeholder="Название"
                          className="h-7 text-[10px]"
                        />
                        <Input
                          value={item.slug}
                          onChange={(e) =>
                            updateLookItemField(index, lookIndex, 'slug', e.target.value)
                          }
                          placeholder="slug"
                          className="h-7 font-mono text-[10px]"
                        />
                        <Input
                          value={item.imageUrl}
                          onChange={(e) =>
                            updateLookItemField(index, lookIndex, 'imageUrl', e.target.value)
                          }
                          placeholder="imageUrl"
                          className="h-7 font-mono text-[10px]"
                        />
                        <Input
                          value={String(item.price)}
                          onChange={(e) =>
                            updateLookItemField(index, lookIndex, 'price', e.target.value)
                          }
                          placeholder="price"
                          className="h-7 text-[10px]"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            {exportSnippet ? (
              <pre className="max-h-40 overflow-auto rounded bg-muted p-2 text-[10px]">
                {exportSnippet}
              </pre>
            ) : null}
            {productsJsonSnippet ? (
              <pre className="max-h-40 overflow-auto rounded bg-muted p-2 text-[10px]">
                {productsJsonSnippet}
              </pre>
            ) : null}
            {uploadNote ? (
              <p className="text-xs text-primary" data-runway-upload-note>
                {uploadNote}
              </p>
            ) : null}
            <p className="text-[10px] text-muted-foreground">
              Превью ниже обновляется live при редактировании. «Сохранить конфиг» → POST
              /api/runway/product-config (overrides + data/runway-product-patches).
            </p>
          </div>
        ) : null}

        {metrics ? (
          <div className="rounded-lg border border-dashed border-border p-3 text-sm">
            <div className="mb-2 flex items-center justify-between gap-2">
              <p className="font-semibold">Метрики Runway (localStorage)</p>
              <Button
                type="button"
                size="sm"
                variant="ghost"
                className="h-7 text-xs"
                onClick={() => {
                  resetScrollExperienceMetrics();
                  setMetrics(getScrollExperienceMetrics());
                }}
              >
                Сбросить
              </Button>
            </div>
            <ul className="grid gap-1 text-xs text-muted-foreground sm:grid-cols-2">
              <li>Просмотры runway: {metrics.scroll_experience_view}</li>
              <li>Смены секции: {metrics.scroll_experience_section_change}</li>
              <li>В корзину: {metrics.scroll_experience_add_to_cart}</li>
              <li>Wishlist: {metrics.scroll_experience_wishlist_toggle}</li>
              <li className="text-[10px] sm:col-span-2">
                Обновлено: {new Date(metrics.updatedAt).toLocaleString('ru-RU')}
              </li>
            </ul>
          </div>
        ) : null}

        {previewProduct && checklist.length > 0 ? (
          <ul className="space-y-1.5 rounded-lg border border-border bg-muted/20 p-3 text-sm">
            {checklist.map((item) => (
              <li key={item.label} className="flex items-center gap-2">
                <Check
                  className={`h-4 w-4 shrink-0 ${item.ok ? 'text-green-600' : 'text-muted-foreground/40'}`}
                />
                <span className={item.ok ? 'text-foreground' : 'text-muted-foreground'}>
                  {item.ok ? '✓' : '○'} {item.label}
                  {item.optional ? ' (опционально)' : ''}
                </span>
              </li>
            ))}
          </ul>
        ) : null}

        {previewProductLive ? (
          <ProductScrollSwitcher
            key={`${previewProductLive.slug}-${sectionDraft.map((s) => `${s.label}|${s.sectionVideoUrl ?? ''}`).join('|')}-${scrollVideoDraft}`}
            product={previewProductLive}
            compact
            showShare={false}
            showWishlist={false}
            analyticsSurface="brand-preview"
            onAddToCart={() => {
              /* preview — без корзины */
            }}
          />
        ) : (
          <div className="rounded-xl border border-dashed p-8 text-center text-sm text-muted-foreground">
            Нет scroll-video товаров для бренда «{brandName}». Включите{' '}
            <code className="text-xs">displayMode: &quot;scroll-video&quot;</code> выше или в
            products.json.
          </div>
        )}
      </div>
    </TabsContent>
  );
}

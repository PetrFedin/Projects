'use client';

import { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import { Search, Package, ShoppingCart, ChevronRight, Cloud, RefreshCw, FileText, Factory, ImageIcon } from 'lucide-react';
import { useRbac } from '@/hooks/useRbac';
import { useNotifications } from '@/providers/notifications-provider';
import { ROUTES } from '@/lib/routes';
import { getBuyerCatalog, getSyndicationStatus, triggerSync } from '@/lib/b2b/content-syndication';
import { getCurrentBuyerRights } from '@/lib/b2b/buyer-rights';
import products from '@/lib/products';
import { RelatedModulesBlock } from '@/components/brand/RelatedModulesBlock';
import { getShopB2BHubLinks } from '@/lib/data/entity-links';
import { getRecommendedSize, getSizeUpWarningMessage } from '@/lib/b2b/size-fit';

export default function B2BCatalogPage() {
  const { can } = useRbac();
  const { addNotification } = useNotifications();
  const [search, setSearch] = useState('');
  const [brandFilter, setBrandFilter] = useState<string>('');
  const [seasonFilter, setSeasonFilter] = useState<string>('');
  const [capsuleFilter, setCapsuleFilter] = useState<string>('');
  const [materialFilter, setMaterialFilter] = useState<string>('');
  const [colorFilter, setColorFilter] = useState<string>('');
  const [sustainabilityFilter, setSustainabilityFilter] = useState<string>('');
  const [lastSynced, setLastSynced] = useState<string | null>(null);
  const [syncing, setSyncing] = useState(false);
  const canCreateOrder = can('b2b_orders', 'create');

  const catalogItems = useMemo(
    () => getBuyerCatalog(products, brandFilter || undefined, getCurrentBuyerRights()),
    [brandFilter]
  );

  const filterOptions = useMemo(() => {
    const seasons = new Set<string>();
    const capsules = new Set<string>();
    const materials = new Set<string>();
    const colors = new Set<string>();
    const sustainabilities = new Set<string>();
    catalogItems.forEach((p) => {
      if (p.season) seasons.add(p.season);
      if (p.capsule) capsules.add(p.capsule);
      if (p.material) materials.add(p.material);
      if (p.color) colors.add(p.color);
      if (p.sustainability) sustainabilities.add(p.sustainability);
    });
    return {
      seasons: Array.from(seasons).sort(),
      capsules: Array.from(capsules).sort(),
      materials: Array.from(materials).sort(),
      colors: Array.from(colors).sort(),
      sustainabilities: Array.from(sustainabilities).sort(),
    };
  }, [catalogItems]);

  const filtered = useMemo(() => {
    return catalogItems.filter((p) => {
      const matchSearch =
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.sku.toLowerCase().includes(search.toLowerCase()) ||
        p.brand.toLowerCase().includes(search.toLowerCase());
      if (!matchSearch) return false;
      if (seasonFilter && p.season !== seasonFilter) return false;
      if (capsuleFilter && p.capsule !== capsuleFilter) return false;
      if (materialFilter && p.material !== materialFilter) return false;
      if (colorFilter && (p.color !== colorFilter && p.attributes?.color !== colorFilter)) return false;
      if (sustainabilityFilter && p.sustainability !== sustainabilityFilter) return false;
      return true;
    });
  }, [catalogItems, search, seasonFilter, capsuleFilter, materialFilter, colorFilter, sustainabilityFilter]);

  useEffect(() => {
    const s = getSyndicationStatus(brandFilter || undefined);
    setLastSynced(s.lastSyncedAt);
  }, [brandFilter]);

  const handleSync = async () => {
    setSyncing(true);
    try {
      const next = await triggerSync(brandFilter || undefined);
      setLastSynced(next.lastSyncedAt);
    } finally {
      setSyncing(false);
    }
  };

  const handleAddToCart = (item: typeof catalogItems[0]) => {
    addNotification({ type: 'order', title: 'Добавлено в корзину', body: `${item.name} (${item.sku})`, href: ROUTES.shop.b2bCreateOrder });
  };

  const lastSyncedFormatted = lastSynced ? new Date(lastSynced).toLocaleString('ru-RU', { dateStyle: 'short', timeStyle: 'short' }) : null;

  return (
    <div className="container mx-auto px-4 py-6 space-y-6 pb-24">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold uppercase">B2B Каталог</h1>
          <p className="text-sm text-slate-500">Fashion Cloud: каталог байера из PIM. Ассортимент, медиа, атрибуты. После выгрузки с валидацией брендом показываются только SKU, прошедшие контракт B2B (размерная сетка, состав, уход, EAN, медиа).</p>
          {lastSyncedFormatted && (
            <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
              <Cloud className="h-3 w-3" /> Последнее обновление: {lastSyncedFormatted}
            </p>
          )}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleSync} disabled={syncing} className="gap-1">
            <RefreshCw className={`h-3 w-3 ${syncing ? 'animate-spin' : ''}`} /> {syncing ? 'Синхронизация…' : 'Синхронизировать'}
          </Button>
          <Button variant="outline" asChild><Link href={ROUTES.shop.b2bOrders}>Мои заказы</Link></Button>
          {canCreateOrder && (
            <Button asChild>
              <Link href={ROUTES.shop.b2bCreateOrder}><ShoppingCart className="h-4 w-4 mr-2" /> Создать заказ</Link>
            </Button>
          )}
        </div>
      </div>

      <div className="flex flex-wrap gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input placeholder="Поиск по артикулу, названию, бренду..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
        </div>
        <select value={brandFilter} onChange={(e) => setBrandFilter(e.target.value)} className="rounded-lg border border-slate-200 px-3 py-2 text-sm h-10">
          <option value="">Все бренды</option>
          <option value="Syntha">Syntha</option>
          <option value="A.P.C.">A.P.C.</option>
        </select>
        <select value={seasonFilter} onChange={(e) => setSeasonFilter(e.target.value)} className="rounded-lg border border-slate-200 px-3 py-2 text-sm h-10">
          <option value="">Сезон</option>
          {filterOptions.seasons.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
        <select value={capsuleFilter} onChange={(e) => setCapsuleFilter(e.target.value)} className="rounded-lg border border-slate-200 px-3 py-2 text-sm h-10">
          <option value="">Капсула</option>
          {filterOptions.capsules.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
        <select value={materialFilter} onChange={(e) => setMaterialFilter(e.target.value)} className="rounded-lg border border-slate-200 px-3 py-2 text-sm h-10">
          <option value="">Материал</option>
          {filterOptions.materials.map((m) => (
            <option key={m} value={m}>{m}</option>
          ))}
        </select>
        <select value={colorFilter} onChange={(e) => setColorFilter(e.target.value)} className="rounded-lg border border-slate-200 px-3 py-2 text-sm h-10">
          <option value="">Цвет</option>
          {filterOptions.colors.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
        <select value={sustainabilityFilter} onChange={(e) => setSustainabilityFilter(e.target.value)} className="rounded-lg border border-slate-200 px-3 py-2 text-sm h-10">
          <option value="">Устойчивость</option>
          {filterOptions.sustainabilities.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((item) => (
          <Card key={item.id} className="overflow-hidden hover:border-indigo-200 transition-colors">
            <CardHeader className="p-4 pb-2">
              <div className="flex justify-between items-start">
                <Badge variant="outline" className="text-[9px]">{item.season || '—'}</Badge>
                <span className="text-[10px] font-bold text-slate-400">{item.sku}</span>
              </div>
              <div className="relative aspect-[3/4] rounded-lg bg-slate-100 overflow-hidden mt-2">
                <Image src={item.imageUrl} alt={item.name} fill className="object-cover" sizes="(max-width: 768px) 100vw, 33vw" />
              </div>
              <CardTitle className="text-base mt-2">{item.name}</CardTitle>
              <CardDescription>{item.brand} · {item.category || '—'} · MOQ {item.moq}</CardDescription>
              {(() => {
                const rec = getRecommendedSize({ productId: item.id, brandName: item.brand, category: item.category });
                const sizeUpMsg = getSizeUpWarningMessage(item.id, item.brand, item.category);
                return (
                  <div className="mt-2 space-y-0.5">
                    <p className="text-[10px] font-bold text-slate-600">
                      Рекомендуемый размер: <span className="text-indigo-600 uppercase">{rec.retailerSize ?? rec.size}</span>
                      {rec.source === 'reviews' && ' (по отзывам)'}
                    </p>
                    {sizeUpMsg && <p className="text-[9px] font-bold text-amber-600">{sizeUpMsg}</p>}
                    <Link href={ROUTES.shop.b2bSizeFinder} className="text-[9px] font-bold text-indigo-600 hover:underline">
                      Подбор размера / размерная сетка →
                    </Link>
                  </div>
                );
              })()}
              {item.contentChannels && item.contentChannels.filter((ch) => ch.available).length > 0 && (
                <div className="flex flex-wrap gap-1 mt-1">
                  {item.contentChannels.filter((ch) => ch.available).map((ch) => (
                    <Badge key={ch.channelId} variant="secondary" className="text-[8px] font-bold">
                      {ch.label}
                    </Badge>
                  ))}
                </div>
              )}
            </CardHeader>
            <CardContent className="p-4 pt-0 space-y-3">
              <p className="text-lg font-bold">{item.priceFormatted}</p>
              <div className="flex flex-wrap gap-2">
                <Button size="sm" className="flex-1 min-w-[100px]" onClick={() => handleAddToCart(item)} disabled={!canCreateOrder}>
                  <Package className="h-3 w-3 mr-1" /> В заказ
                </Button>
                <Button size="sm" variant="outline" asChild>
                  <Link href={`${ROUTES.shop.b2bMatrix}?brand=${encodeURIComponent(item.brand)}&sku=${encodeURIComponent(item.sku)}`}>
                    <ChevronRight className="h-3 w-3" /> В матрицу
                  </Link>
                </Button>
                <Button size="sm" variant="ghost" className="text-[10px]" asChild>
                  <Link href={ROUTES.brand.production}>
                    <FileText className="h-3 w-3 mr-1" /> Tech Pack
                  </Link>
                </Button>
                <Button size="sm" variant="ghost" className="text-[10px]" asChild>
                  <Link href={ROUTES.brand.production}>
                    <Factory className="h-3 w-3 mr-1" /> Production
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filtered.length === 0 && (
        <Card className="p-12 text-center">
          <p className="text-slate-500">Нет товаров по запросу. Проверьте фильтр бренда или запустите синхронизацию в разделе бренда.</p>
          <Button variant="outline" className="mt-4" asChild><Link href={ROUTES.shop.b2bDiscover}>Discover</Link></Button>
        </Card>
      )}

      <RelatedModulesBlock links={getShopB2BHubLinks()} title="Discover, матрица, заказы" className="mt-6" />
    </div>
  );
}

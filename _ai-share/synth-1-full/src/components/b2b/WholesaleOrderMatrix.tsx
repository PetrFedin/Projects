'use client';

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronLeft, 
  Search, 
  ShoppingBag, 
  BarChart3, 
  Save, 
  FileCheck,
  Grid3X3,
  RefreshCcw,
  MapPin,
  AlertTriangle,
  ArrowRight,
  Plus,
  FileSpreadsheet,
  X,
  Calendar
} from 'lucide-react';
import Link from 'next/link';
import { ROUTES } from '@/lib/routes';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useUIState } from '@/providers/ui-state';
import { useB2BState } from '@/providers/b2b-state';
import allProductsData from '@/lib/products';
import { cn } from '@/lib/cn';
import { JOOR_DELIVERY_WINDOWS, getMoqForProduct } from '@/lib/b2b/joor-constants';
import { getATS, isOverATS } from '@/lib/b2b/ats-inventory';
import { getCurrentPriceTier, getPriceForTier, PRICE_TIER_LABELS } from '@/lib/b2b/price-tiers';
import { getPriceWithPromotions } from '@/lib/b2b/price-lists';
import { getCreditForCurrentPartner } from '@/lib/b2b/credit-check';
import { runPreflightCheck, getRealtimeLineBlock, getOrderRulesForBrand } from '@/lib/b2b/order-rules';
import { getCurrentBuyerRights, getProductsVisibleToBuyer } from '@/lib/b2b/buyer-rights';
import { getRecommendedSize, getSizeUpWarningMessage } from '@/lib/b2b/size-fit';

// Sub-components
import { OrderAnalyticsTab } from './order/OrderAnalyticsTab';
import { OrderReplenishTab } from './order/OrderReplenishTab';
import { OrderAllocationTab } from './order/OrderAllocationTab';

interface WholesaleOrderMatrixProps {
  onClose: () => void;
  activeRetailer?: any;
  /** NuOrder-style: начальный режим заказа из URL (order-mode → matrix?mode=pre_order) */
  initialOrderMode?: 'buy_now' | 'reorder' | 'pre_order';
  /** NuORDER: привязка к событию (eventId из URL create-order → matrix) */
  initialEventId?: string;
  /** SparkLayer: ценовой уровень из URL/партнёра */
  initialPriceTier?: 'retail_a' | 'retail_b' | 'outlet';
  /** Территория партнёра для отображения в шапке */
  initialTerritory?: string;
}

export function WholesaleOrderMatrix({ onClose, activeRetailer, initialOrderMode = 'buy_now', initialEventId, initialPriceTier, initialTerritory }: WholesaleOrderMatrixProps) {
  const { activeCurrency } = useUIState();
  const { 
    b2bCart, 
    setB2bCart, 
    updateB2bOrderItemQuantity, 
    removeB2bOrderItem 
  } = useB2BState();
  const [activeTab, setActiveTab] = useState<'matrix' | 'summary' | 'analytics' | 'replenish' | 'allocation'>('matrix');
  const [activeDrop, setActiveDrop] = useState('Drop 1: July 2026');
  const [isBulkEntryOpen, setIsBulkEntryOpen] = useState(false);
  /** Режим заказа: мгновенная отгрузка / повтор / предзаказ. При API — уходит в payload. */
  const [orderMode, setOrderMode] = useState<'buy_now' | 'reorder' | 'pre_order'>(initialOrderMode);
  /** Часть заказа — сэмплы на примерку (Try Before Buy). При API — в payload заказа. */
  const [tryBeforeBuy, setTryBeforeBuy] = useState(false);
  /** JOOR: заметки к заказу */
  const [orderNotes, setOrderNotes] = useState('');

  /** NuORDER: eventId/priceTier/territory из URL или партнёра — показываем в шапке и уходим в payload. */
  const displayEventId = initialEventId;
  const displayPriceTier = initialPriceTier ?? getCurrentPriceTier();
  const displayTerritory = initialTerritory;

  /** NuORDER: права по территории/каналу — в матрице байер видит только доступные ему продукты. */
  const buyerRights = useMemo(() => getCurrentBuyerRights(), []);
  const visibleProducts = useMemo(() => getProductsVisibleToBuyer(allProductsData, buyerRights), [buyerRights]);

  /** JOOR: окна доставки (дропы) — Start Ship Date / Complete Ship Date */
  const drops = JOOR_DELIVERY_WINDOWS.map(w => w.label);
  const orderModeLabels = { buy_now: 'Buy Now', reorder: 'Reorder', pre_order: 'Pre-order' } as const;

  /** JOOR: первый продукт, по которому не набран MOQ */
  const moqViolation = useMemo(() => {
    const byProduct = new Map<string, number>();
    b2bCart.forEach(item => { byProduct.set(item.id, (byProduct.get(item.id) ?? 0) + item.quantity); });
    for (const [id, qty] of byProduct) {
      const moq = getMoqForProduct(id);
      if (qty > 0 && qty < moq) return { productId: id, current: qty, required: moq };
    }
    return null;
  }, [b2bCart]);

  /** NuORDER: есть ли строки с qty > ATS (недостаточно остатка) */
  const atsViolations = useMemo(() => {
    return b2bCart.filter(item => item.quantity > 0 && isOverATS(item.id, item.selectedSize, item.quantity, item.deliveryDate));
  }, [b2bCart]);
  const hasAtsViolation = atsViolations.length > 0;

  const totals = useMemo(() => {
    return b2bCart.reduce((acc, item) => ({
      units: acc.units + item.quantity,
      amount: acc.amount + (item.quantity * item.price)
    }), { units: 0, amount: 0 });
  }, [b2bCart]);

  const priceTier = initialPriceTier ?? getCurrentPriceTier();
  /** Итого с учётом ценового уровня и прайс-листов/акций (SparkLayer) */
  const totalsByTier = useMemo(() => {
    return b2bCart.reduce((acc, item) => {
      const product = visibleProducts.find((p: any) => p.id === item.id);
      const tierPrice = product ? getPriceForTier(product.price, priceTier) : item.price;
      const unitPrice = product ? getPriceWithPromotions(product.id, tierPrice, priceTier) : tierPrice;
      return { units: acc.units + item.quantity, amount: acc.amount + item.quantity * unitPrice };
    }, { units: 0, amount: 0 });
  }, [b2bCart, priceTier, visibleProducts]);

  const credit = getCreditForCurrentPartner();
  const creditWarning = totalsByTier.amount > 0 && credit.wouldExceed(totalsByTier.amount);
  const creditBlocked = credit.blocked;

  /** SparkLayer: Pre-flight check для блока в табе Итого */
  const preflightItems = useMemo(() => {
    const byProduct: Record<string, number> = {};
    b2bCart.forEach((item) => {
      byProduct[item.id] = (byProduct[item.id] ?? 0) + item.quantity;
    });
    return runPreflightCheck({
      orderTotalAmount: totalsByTier.amount,
      orderTotalUnits: totalsByTier.units,
      brandName: activeRetailer?.brand || 'Syntha',
      territory: displayTerritory,
      cartByProductId: byProduct,
    });
  }, [b2bCart, totalsByTier.amount, totalsByTier.units, activeRetailer?.brand, displayTerritory]);

  const renderBulkEntry = () => (
    <Dialog open={isBulkEntryOpen} onOpenChange={setIsBulkEntryOpen}>
      <DialogContent className="max-w-2xl bg-white border-none rounded-xl p-3 shadow-2xl">
        <DialogHeader className="mb-8">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-2xl bg-slate-900 flex items-center justify-center text-white">
              <FileSpreadsheet className="h-6 w-6" />
            </div>
            <div className="text-left">
              <DialogTitle className="text-sm font-black uppercase tracking-tight">Массовый ввод заказа (Bulk edit)</DialogTitle>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Вставьте список артикулов или загрузите XLS для быстрого заказа. NuOrder-style: массовое изменение qty/размера.</p>
            </div>
          </div>
        </DialogHeader>
        <div className="space-y-6">
          <textarea className="w-full h-48 p-4 rounded-xl bg-slate-50 border-none font-mono text-xs focus:ring-2 focus:ring-indigo-500 resize-none" placeholder="Артикул, Размер, Количество&#10;CTP-26-001, M, 12&#10;CTP-26-001, L, 8..." />
          <div className="flex gap-3">
            <Button className="flex-1 h-10 bg-slate-900 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest">Обработать список</Button>
            <Button variant="outline" className="h-10 rounded-2xl border-slate-200 px-8 font-black uppercase text-[10px] tracking-widest">Загрузить XLS</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 z-[150] bg-slate-50 flex flex-col text-left">
      {renderBulkEntry()}
      <div className="h-24 bg-white border-b border-slate-100 flex items-center justify-between px-10">
        <div className="flex items-center gap-3">
          <Button variant="ghost" onClick={onClose} className="group h-12 w-12 rounded-2xl p-0 hover:bg-slate-50">
            <ChevronLeft className="h-6 w-6 text-slate-400 group-hover:text-slate-900 transition-colors" />
          </Button>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Badge className="bg-indigo-600 text-white border-none text-[8px] font-black uppercase tracking-widest px-2 py-0.5">Order_Matrix_v1.2</Badge>
              <h2 className="text-base font-black uppercase tracking-tight text-slate-900">Настройка Оптового Заказа</h2>
            </div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              Коллекция: NEURAL NOMAD FW26 • Ритейлер: {activeRetailer?.name || 'Партнер'}
              {displayEventId && ` • Событие: ${displayEventId}`}
              {displayPriceTier && ` • ${PRICE_TIER_LABELS[displayPriceTier]}`}
              {displayTerritory && ` • Территория: ${displayTerritory}`}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex flex-col items-end mr-6">
            <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Оценочная стоимость</p>
            <p className="text-sm font-black text-slate-900">{totals.amount.toLocaleString('ru-RU')} ₽</p>
            <p className="text-[10px] font-bold text-indigo-600 uppercase tracking-tight">Всего {totals.units} ед.</p>
          </div>
          {orderMode === 'pre_order' && (
            <Link href="/shop/b2b/pre-order" className="text-[9px] font-bold text-indigo-600 hover:underline flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5" /> Каталог Pre-order
            </Link>
          )}
          <Button variant="outline" className="h-12 rounded-2xl border-slate-200 px-6 font-black uppercase text-[10px] tracking-widest gap-2 bg-white">
            <Save className="h-4 w-4" /> Сохранить черновик
          </Button>
          <Button
            className="h-12 bg-slate-900 text-white rounded-2xl px-8 font-black uppercase text-[10px] tracking-widest gap-2 shadow-xl shadow-slate-200"
            data-order-mode={orderMode}
            data-drop={activeDrop}
            data-try-before-buy={tryBeforeBuy}
          >
            Подтвердить заказ {orderMode === 'pre_order' ? '(Предзаказ)' : ''} {tryBeforeBuy ? '· Try Before Buy' : ''} <FileCheck className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-3">
        <div className="max-w-[1400px] mx-auto space-y-4">
          <div className="flex items-center justify-between bg-white p-4 rounded-xl shadow-sm border border-slate-100">
            <div className="flex items-center gap-3 flex-wrap">
              <div className="flex flex-col gap-1">
                <span className="text-[8px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Режим заказа</span>
                <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl">
                  {(['buy_now', 'reorder', 'pre_order'] as const).map(mode => (
                    <button
                      key={mode}
                      onClick={() => setOrderMode(mode)}
                      className={cn(
                        "px-3 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all",
                        orderMode === mode ? "bg-indigo-600 text-white shadow-lg" : "text-slate-400 hover:text-slate-600"
                      )}
                    >
                      {orderModeLabels[mode]}
                    </button>
                  ))}
                </div>
              </div>
              <div className="h-10 w-[1px] bg-slate-100 mx-1" />
              <div className="flex flex-col gap-1">
                <span className="text-[8px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Активная поставка (Drop)</span>
                <div className="flex items-center gap-2 p-1 bg-slate-100 rounded-xl">
                  {drops.map(drop => (
                    <button 
                      key={drop}
                      onClick={() => setActiveDrop(drop)}
                      className={cn(
                        "px-4 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all",
                        activeDrop === drop ? "bg-slate-900 text-white shadow-lg" : "text-slate-400 hover:text-slate-600"
                      )}
                    >
                      {drop.split(':')[0].replace('Drop', 'Дроп')}
                    </button>
                  ))}
                </div>
              </div>
              {orderMode === 'pre_order' && (
                <Badge className="bg-amber-100 text-amber-800 border-amber-200 text-[8px] font-black uppercase">
                  Предзаказ · Поступление по дропу
                </Badge>
              )}
              
              <div className="h-10 w-[1px] bg-slate-100 mx-2" />

              <div className="relative w-64">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input placeholder="Фильтр каталога..." className="pl-12 h-12 rounded-xl border-slate-100 bg-slate-50" />
              </div>
            </div>

            <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl flex-wrap">
              {[
                { id: 'matrix', label: 'Матрица размеров', icon: Grid3X3 },
                { id: 'replenish', label: 'Умное пополнение', icon: RefreshCcw },
                { id: 'allocation', label: 'Распределение', icon: MapPin },
                { id: 'summary', label: 'Итого', icon: ShoppingBag },
                { id: 'analytics', label: 'AI Аналитика', icon: BarChart3 }
              ].map(tab => (
                <Button key={tab.id} onClick={() => setActiveTab(tab.id as any)} className={cn("h-10 px-6 rounded-lg font-black uppercase text-[9px] tracking-widest transition-all", activeTab === tab.id ? "bg-white text-slate-900 shadow-sm" : "bg-transparent text-slate-400 hover:text-slate-600")}>
                  {tab.label}
                </Button>
              ))}
              <Button variant="outline" size="sm" className="h-10 rounded-lg font-black uppercase text-[9px] tracking-widest border-indigo-200 text-indigo-600 hover:bg-indigo-50" asChild>
                <Link href={ROUTES.shop.b2bWorkingOrder}><FileSpreadsheet className="h-3.5 w-3.5 mr-1.5" /> Working Order</Link>
              </Button>
            </div>
          </div>

          {moqViolation && (
            <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-600"><AlertTriangle className="h-5 w-5" /></div>
                <div className="space-y-0.5 text-left">
                  <p className="text-[10px] font-black uppercase text-amber-900 tracking-tight">JOOR: минимальный заказ (MOQ)</p>
                  <p className="text-[9px] font-bold text-amber-600 uppercase">Нужно еще {moqViolation.required - moqViolation.current} ед. по стилю для достижения MOQ ({moqViolation.required} ед.).</p>
                </div>
              </div>
              <Button variant="ghost" className="text-[9px] font-black uppercase text-amber-900 hover:bg-amber-100 rounded-xl px-4 h-10">Добавить до минимума <ArrowRight className="ml-2 h-3.5 w-3.5" /></Button>
            </div>
          )}
          {hasAtsViolation && (
            <div className="bg-rose-50 border border-rose-100 rounded-xl p-4 flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-rose-100 flex items-center justify-center text-rose-600"><AlertTriangle className="h-5 w-5" /></div>
              <div className="text-left">
                <p className="text-[10px] font-black uppercase text-rose-900 tracking-tight">NuORDER: недостаточно остатка (ATS)</p>
                <p className="text-[9px] font-bold text-rose-600 uppercase">В {atsViolations.length} позициях запрошено больше, чем доступно к продаже. Уменьшите количество или свяжитесь с брендом.</p>
              </div>
            </div>
          )}
          <div className="bg-slate-50 border border-slate-100 rounded-xl p-3">
            <label className="text-[8px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">JOOR: Заметки к заказу</label>
            <textarea value={orderNotes} onChange={e => setOrderNotes(e.target.value)} placeholder="Комментарий для бренда (сроки, склад, особые пожелания)…" className="w-full mt-1 p-3 rounded-lg border border-slate-200 bg-white text-sm min-h-[60px] resize-y" />
          </div>

          <div className="min-h-[500px]">
            {activeTab === 'analytics' && <OrderAnalyticsTab />}
            {activeTab === 'replenish' && <OrderReplenishTab />}
            {activeTab === 'allocation' && <OrderAllocationTab />}
            {activeTab === 'matrix' && (
              <div className="grid grid-cols-1 gap-3 animate-in fade-in slide-in-from-bottom-4">
                {visibleProducts.slice(0, 5).map((product: any) => {
                  const brandName = activeRetailer?.brand ?? 'Syntha';
                  const rules = getOrderRulesForBrand(brandName);
                  const qtyForProduct = b2bCart.filter((item: any) => item.id === product.id).reduce((s: number, i: any) => s + i.quantity, 0);
                  const lineBlock = getRealtimeLineBlock({
                    brandName,
                    territory: displayTerritory,
                    orderTotalWithLine: totalsByTier.amount,
                    orderTotalByBrandWithLine: totalsByTier.amount,
                    qtyForProduct,
                    productId: product.id,
                    minOrderValue: rules?.minOrderValue ?? 150_000,
                  });
                  return (
                  <Card key={product.id} className={cn("border-none shadow-xl bg-white overflow-hidden rounded-xl", lineBlock.blocked && "opacity-95 ring-1 ring-rose-200")}>
                    <div className="flex flex-col md:flex-row h-full">
                      <div className="w-full md:w-64 h-64 bg-slate-100 relative shrink-0">
                        <img src={product.images?.[0]?.url || 'https://placehold.co/400x400/f1f5f9/94a3b8?text=Product'} className="w-full h-full object-cover" />
                        <div className="absolute top-4 left-4">
                          <Badge className="bg-white/90 backdrop-blur-md text-slate-900 border-none text-[8px] font-black uppercase tracking-widest px-3 py-1">FW26</Badge>
                        </div>
                      </div>
                      <div className="flex-1 p-4 flex flex-col">
                        <div className="flex items-start justify-between mb-6">
                          <div className="space-y-1">
                            <h4 className="text-base font-black uppercase tracking-tight text-slate-900">{product.name}</h4>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{product.id} • {product.category}</p>
                            {(() => {
                              const brandName = activeRetailer?.brand ?? product.brand ?? 'Syntha';
                              const rec = getRecommendedSize({ productId: product.id, brandName, category: product.category });
                              const sizeUpMsg = getSizeUpWarningMessage(product.id, brandName, product.category);
                              return (
                                <div className="flex flex-wrap items-center gap-2 mt-1.5">
                                  <span className="text-[9px] font-bold text-slate-600">
                                    Рекомендуемый размер: <span className="text-indigo-600 uppercase">{rec.retailerSize ?? rec.size}</span>
                                  </span>
                                  {sizeUpMsg && <span className="text-[9px] font-bold text-amber-600">· {sizeUpMsg}</span>}
                                  <Link href={ROUTES.shop.b2bSizeFinder} className="text-[9px] font-bold text-indigo-600 hover:underline">Подбор размера →</Link>
                                </div>
                              );
                            })()}
                          </div>
                          <div className="text-right">
                            <p className="text-base font-black text-slate-900">{getPriceWithPromotions(product.id, getPriceForTier(product.price, priceTier), priceTier).toLocaleString('ru-RU')} ₽</p>
                            <p className="text-[9px] font-bold text-indigo-600 uppercase tracking-tight">{PRICE_TIER_LABELS[priceTier]} · прайс-лист</p>
                          </div>
                        </div>

                        <div className="flex-1">
                          <div className="grid grid-cols-6 gap-2">
                            {['XS', 'S', 'M', 'L', 'XL', 'XXL'].map((size) => {
                              const cartItem = b2bCart.find(item => item.id === product.id && item.selectedSize === size && item.deliveryDate === activeDrop);
                              const quantity = cartItem?.quantity || 0;
                              const ats = getATS(product.id, size, activeDrop);
                              const overATS = isOverATS(product.id, size, quantity, activeDrop);
                              return (
                                <div key={size} className="space-y-2">
                                  <div className="flex items-center justify-between px-2">
                                    <span className="text-[10px] font-black text-slate-400 uppercase">{size}</span>
                                    <span className={cn('text-[9px] font-bold', overATS ? 'text-rose-600' : 'text-emerald-600')}>ATS: {ats}</span>
                                  </div>
                                  <div className="relative group">
                                    <Input 
                                      type="number" 
                                      min="0"
                                      value={quantity || ''}
                                      disabled={lineBlock.blocked}
                                      onChange={(e) => {
                                        const val = parseInt(e.target.value) || 0;
                                        updateB2bOrderItemQuantity(product.id, val, size, activeDrop);
                                      }}
                                      className={cn(
                                        'h-12 rounded-xl border-slate-100 bg-slate-50 text-center font-black text-slate-900 focus:ring-2 focus:ring-indigo-500 transition-all',
                                        overATS && 'border-rose-300 ring-1 ring-rose-200',
                                        lineBlock.blocked && 'opacity-60 cursor-not-allowed'
                                      )}
                                      placeholder="0"
                                    />
                                    {quantity > 0 && (
                                      <button 
                                        onClick={() => removeB2bOrderItem(product.id, size, activeDrop)}
                                        className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-rose-500 text-white flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                                      >
                                        <X className="h-3 w-3" />
                                      </button>
                                    )}
                                    {overATS && (
                                      <p className="text-[9px] font-bold text-rose-600 uppercase mt-0.5">Недостаточно остатка</p>
                                    )}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>

                        {lineBlock.reasons.length > 0 && (
                          <div className={cn(
                            "mt-4 rounded-lg px-3 py-2 border",
                            lineBlock.blocked ? "bg-rose-50 border-rose-200" : "bg-amber-50 border-amber-200"
                          )}>
                            <p className="text-[9px] font-black uppercase text-slate-600 mb-1">SparkLayer: правила в реальном времени</p>
                            <ul className="text-[9px] font-bold space-y-0.5">
                              {lineBlock.reasons.map((r, i) => <li key={i}>{r}</li>)}
                            </ul>
                            {lineBlock.blocked && <p className="text-[9px] font-black text-rose-700 uppercase mt-1">Строка заблокирована. Уменьшите количество или измените заказ.</p>}
                          </div>
                        )}
                        <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-between">
                          <div className="flex gap-3">
                            <Badge variant="outline" className="h-5 rounded-md border-slate-200 text-[10px] font-bold uppercase">JOOR MOQ: {getMoqForProduct(product.id)}</Badge>
                            <Badge variant="outline" className="h-5 rounded-md border-slate-200 text-[10px] font-bold uppercase">Окно: {activeDrop}</Badge>
                          </div>
                          <div className="flex items-center gap-2">
                            <p className="text-[10px] font-black uppercase text-slate-400">Итого по дропу:</p>
                            <p className="text-sm font-black text-slate-900">
                              {((b2bCart.filter(item => item.id === product.id && item.deliveryDate === activeDrop).reduce((sum, item) => sum + item.quantity, 0)) * getPriceWithPromotions(product.id, getPriceForTier(product.price, priceTier), priceTier)).toLocaleString('ru-RU')} ₽
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                  );
                })}
              </div>
            )}
            {activeTab === 'summary' && (
              <div className="grid grid-cols-1 gap-3 animate-in fade-in slide-in-from-bottom-4">
                {preflightItems.length > 0 && (
                  <Card className="border-none shadow-sm bg-white rounded-xl overflow-hidden border-l-4 border-indigo-200">
                    <div className="p-4">
                      <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-3">SparkLayer: Pre-flight check</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {preflightItems.map((item) => (
                          <div key={item.id} className={cn(
                            "flex items-center gap-2 rounded-lg px-3 py-2 text-left",
                            item.status === 'ok' && "bg-emerald-50 text-emerald-800",
                            item.status === 'warning' && "bg-amber-50 text-amber-800",
                            item.status === 'error' && "bg-rose-50 text-rose-800"
                          )}>
                            <span className={cn(
                              "h-2 w-2 rounded-full shrink-0",
                              item.status === 'ok' && "bg-emerald-500",
                              item.status === 'warning' && "bg-amber-500",
                              item.status === 'error' && "bg-rose-500"
                            )} />
                            <div className="min-w-0">
                              <p className="text-[10px] font-black uppercase tracking-tight">{item.label}</p>
                              <p className="text-[9px] font-bold opacity-90">{item.message}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </Card>
                )}
                <Card className="border-none shadow-2xl bg-white rounded-xl overflow-hidden">
                  <div className="p-3 space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-black uppercase tracking-tight text-slate-900">Итого по заказу</h3>
                      <Badge className="bg-indigo-50 text-indigo-600 border-none px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest">{b2bCart.length} уникальных позиций</Badge>
                    </div>

                    <div className="space-y-6">
                      {b2bCart.length > 0 ? (
                        Array.from(new Set(b2bCart.map(item => item.deliveryDate))).map(drop => (
                          <div key={drop} className="space-y-6">
                            <div className="flex items-center gap-3">
                              <Badge className="bg-slate-900 text-white border-none px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest">{drop.replace('Drop', 'Дроп')}</Badge>
                              <div className="h-px flex-1 bg-slate-100" />
                              <p className="text-[10px] font-black text-slate-400 uppercase">
                                Подытог: {b2bCart.filter(i => i.deliveryDate === drop).reduce((sum, i) => sum + (i.quantity * i.price), 0).toLocaleString('ru-RU')} ₽
                              </p>
                            </div>
                            <div className="divide-y divide-slate-100">
                              {b2bCart.filter(i => i.deliveryDate === drop).map((item, i) => (
                                <div key={`${item.id}-${item.selectedSize}`} className="py-6 flex items-center justify-between group">
                                  <div className="flex items-center gap-3">
                                    <div className="h-12 w-12 rounded-2xl bg-slate-50 overflow-hidden border border-slate-100">
                                      <img src={item.images?.[0]?.url} className="w-full h-full object-cover" />
                                    </div>
                                    <div>
                                      <h4 className="font-black uppercase tracking-tight text-slate-900">{item.name}</h4>
                                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{item.selectedSize} • {item.price.toLocaleString('ru-RU')} ₽ / ед.</p>
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-3 text-right">
                                    <div>
                                      <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Количество</p>
                                      <p className="text-sm font-black text-slate-900">{item.quantity}</p>
                                    </div>
                                    <div>
                                      <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Итого</p>
                                      <p className="text-sm font-black text-indigo-600">{(item.quantity * item.price).toLocaleString('ru-RU')} ₽</p>
                                    </div>
                                    <Button 
                                      variant="ghost" 
                                      size="icon" 
                                      onClick={() => removeB2bOrderItem(item.id, item.selectedSize, item.deliveryDate)}
                                      className="h-10 w-10 rounded-xl text-rose-500 hover:bg-rose-50 hover:text-rose-600 opacity-0 group-hover:opacity-100 transition-all"
                                    >
                                      <X className="h-5 w-5" />
                                    </Button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="py-10 text-center space-y-4 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                          <div className="h-12 w-12 bg-white rounded-full flex items-center justify-center mx-auto shadow-sm">
                            <ShoppingBag className="h-8 w-8 text-slate-200" />
                          </div>
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">Ваша корзина пуста...</p>
                        </div>
                      )}
                    </div>

                    {b2bCart.length > 0 && (
                      <>
                        {creditWarning && (
                          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-center gap-3">
                            <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0" />
                            <div>
                              <p className="text-[10px] font-black uppercase text-amber-900 tracking-tight">SparkLayer: превышение кредитного лимита</p>
                              <p className="text-[9px] font-bold text-amber-700">Сумма заказа {totalsByTier.amount.toLocaleString('ru-RU')} ₽ превышает доступный лимит ({(credit.available / 1_000_000).toFixed(1)} млн ₽). Уменьшите количество или свяжитесь с брендом.</p>
                            </div>
                          </div>
                        )}
                        {creditBlocked && (
                          <div className="bg-rose-50 border border-rose-200 rounded-xl p-4 flex items-center gap-3">
                            <AlertTriangle className="h-5 w-5 text-rose-600 shrink-0" />
                            <p className="text-[10px] font-black uppercase text-rose-900">Кредитный лимит исчерпан. Отправка заказа недоступна.</p>
                          </div>
                        )}
                        <div className="pt-10 border-t border-slate-100 flex justify-between items-end">
                          <div className="space-y-4">
                             <label className="flex items-center gap-3 cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={tryBeforeBuy}
                                  onChange={(e) => setTryBeforeBuy(e.target.checked)}
                                  className="h-4 w-4 rounded border-slate-300 text-indigo-600"
                                />
                                <span className="text-[10px] font-black uppercase tracking-widest text-slate-700">Часть заказа — сэмплы на примерку (Try Before Buy)</span>
                             </label>
                             <p className="text-[9px] text-slate-500">Ценовой уровень: <strong>{PRICE_TIER_LABELS[priceTier]}</strong>. Кредитный лимит: {(credit.available / 1_000_000).toFixed(1)} млн ₽ доступно.</p>
                             {tryBeforeBuy && (
                               <p className="text-[9px] text-indigo-600 max-w-sm">Оплата после примерки. <Link href="/client/try-before-buy" className="underline">Подробнее</Link></p>
                             )}
                             <div className="flex items-center gap-3">
                                <div className="h-5 w-5 rounded-full bg-emerald-500 flex items-center justify-center text-white">
                                   <FileCheck className="h-3 w-3" />
                                </div>
                                <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600">Условия и положения приняты</span>
                             </div>
                             <p className="text-[9px] font-medium text-slate-400 uppercase tracking-widest max-w-sm">Подтверждая заказ, вы соглашаетесь с договором оптовой закупки и графиком поставок.</p>
                          </div>
                          <div className="text-right space-y-2">
                             <div className="flex items-center justify-end gap-3 text-slate-400">
<span className="text-[10px] font-black uppercase tracking-widest">Общий итог ({totalsByTier.units} ед.)</span>
                             </div>
                             <h4 className="text-sm font-black text-slate-900 tracking-tighter">{totalsByTier.amount.toLocaleString('ru-RU')} ₽</h4>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </Card>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

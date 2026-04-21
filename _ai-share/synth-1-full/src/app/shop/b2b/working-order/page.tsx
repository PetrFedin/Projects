'use client';

import { ShopB2bNuOrderScope } from '@/components/shop/ShopB2bNuOrderScope';
import { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FileDown, FileUp, History, User, CheckCircle, XCircle, Send, Diff } from 'lucide-react';
import { ROUTES, shopB2bOrderHref } from '@/lib/routes';
import { useShopB2BOperationalOrdersList } from '@/hooks/use-b2b-operational-orders-list';
import { cn } from '@/lib/utils';
import { initialOrderItems } from '@/lib/order-data';
import { RelatedModulesBlock } from '@/components/brand/RelatedModulesBlock';
import { getShopB2BHubLinks } from '@/lib/data/entity-links';
import { mockOrderDetailJoors } from '@/lib/order-data';
import { ShopB2bContentHeader } from '@/components/shop/ShopB2bContentHeader';
import { B2bOrderUrlContextBanner } from '@/components/b2b/B2bOrderUrlContextBanner';
import {
  getWorkingOrderVersions,
  addWorkingOrderVersion,
  setWorkingOrderStatus,
  submitWorkingOrderForReview,
  compareWorkingOrderWithMatrix,
  setWorkingOrderVersionWholesaleOrderId,
  replaceWorkingOrderVersions,
  type WorkingOrderRow,
  type WorkingOrderVersion,
} from '@/lib/b2b/working-order-store';
import {
  fetchWorkingOrderVersionsV1,
  putWorkingOrderVersionsV1,
} from '@/lib/b2b/working-order-versions-api-client';
import { useB2BState } from '@/providers/b2b-state';

/** NuOrder: Working Order — экспорт заказа в Excel (размер/цвет/qty по колонкам), импорт обратно, версии, сравнение с матрицей, подтверждение брендом. */
const SIZES = ['XS', 'S', 'M', 'L', 'XL'];
const TEMPLATE_HEADERS = [
  'Style',
  'SKU',
  'Color',
  'Delivery Window',
  ...SIZES.map((s) => `Qty ${s}`),
  'Total',
  'Price',
  'Line Total',
];
const STATUS_LABELS: Record<WorkingOrderVersion['status'], string> = {
  draft: 'Черновик',
  pending_review: 'На проверке у бренда',
  confirmed: 'Подтверждён брендом',
  rejected: 'Отклонён',
};

function downloadEmptyTemplate() {
  const csv = '\uFEFF' + [TEMPLATE_HEADERS.join(';')].join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `working-order-template-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

function exportWorkingOrderExcel() {
  const headers = [
    'Style',
    'SKU',
    'Color',
    'Delivery Window',
    ...SIZES.map((s) => `Qty ${s}`),
    'Total',
    'Price',
    'Line Total',
  ];
  const rows = initialOrderItems.map((item: any) => {
    const qtyTotal = item.orderedQuantity || 0;
    const price = (item.price ?? 0) * 0.4;
    const lineTotal = qtyTotal * price;
    const windowLabel = item.deliveryWindowId
      ? (mockOrderDetailJoors.deliveryWindows?.find((w) => w.id === item.deliveryWindowId)?.label ??
        item.deliveryWindowId)
      : '';
    const bySize = SIZES.map(() => Math.floor(qtyTotal / SIZES.length));
    const remainder = qtyTotal - bySize.reduce((a, b) => a + b, 0);
    if (remainder > 0) bySize[0] += remainder;
    return [
      item.name,
      item.sku ?? item.id,
      item.color ?? '',
      windowLabel,
      ...bySize,
      qtyTotal,
      price.toFixed(2),
      lineTotal.toFixed(2),
    ];
  });
  const csv = [
    headers.join(';'),
    ...rows.map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(';')),
  ].join('\n');
  const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `working-order-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

const MOCK_UPLOADER = 'Покупатель (магазин)';

export default function WorkingOrderPage() {
  const searchParams = useSearchParams();
  const operationalOrders = useShopB2BOperationalOrdersList();
  const { b2bCart = [] } = useB2BState();
  /** `undefined` — взять заказ из `?wholesaleOrderId=` если он есть в списке; иначе строка с выбором пользователя. */
  const [manualWholesaleOrderId, setManualWholesaleOrderId] = useState<string | undefined>(
    undefined
  );
  const wholesaleOrderIdFromUrl = useMemo(() => {
    const q = searchParams.get('wholesaleOrderId')?.trim() ?? '';
    return q && operationalOrders.some((o) => o.order === q) ? q : '';
  }, [searchParams, operationalOrders]);
  const effectiveWholesaleOrderId =
    manualWholesaleOrderId !== undefined ? manualWholesaleOrderId : wholesaleOrderIdFromUrl;
  const [importMessage, setImportMessage] = useState<string | null>(null);
  const [parsedRows, setParsedRows] = useState<WorkingOrderRow[]>([]);
  const [selectedVersionId, setSelectedVersionId] = useState<string | null>(null);
  const [showCompare, setShowCompare] = useState(false);
  const [brandComment, setBrandComment] = useState('');
  const [versions, setVersions] = useState<WorkingOrderVersion[]>(() => getWorkingOrderVersions());
  const [serverSyncReady, setServerSyncReady] = useState(false);
  const syncDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const refreshVersions = useCallback(() => {
    setVersions(getWorkingOrderVersions());
  }, []);

  /** Гидратация с сервера (файл `data/b2b-working-order-versions.json`) и первичный push локальных данных. */
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const remote = await fetchWorkingOrderVersionsV1();
      const local = getWorkingOrderVersions();
      if (cancelled) return;
      if (remote && remote.length > 0) {
        replaceWorkingOrderVersions(remote);
        setVersions(remote);
      } else if (local.length > 0) {
        await putWorkingOrderVersionsV1(local);
      }
      setServerSyncReady(true);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!serverSyncReady) return;
    if (syncDebounceRef.current) clearTimeout(syncDebounceRef.current);
    syncDebounceRef.current = setTimeout(() => {
      void putWorkingOrderVersionsV1(versions);
    }, 900);
    return () => {
      if (syncDebounceRef.current) clearTimeout(syncDebounceRef.current);
    };
  }, [versions, serverSyncReady]);

  const matrixLines = useMemo(() => {
    const bySku = new Map<string, number>();
    b2bCart?.forEach((item: { id?: string; sku?: string; quantity?: number }) => {
      const sku = (item as any).sku ?? item.id ?? '';
      if (!sku) return;
      bySku.set(sku, (bySku.get(sku) ?? 0) + (item.quantity ?? 0));
    });
    return Array.from(bySku.entries()).map(([sku, totalQty]) => ({ sku, totalQty }));
  }, [b2bCart]);

  const selectedVersion = selectedVersionId
    ? versions.find((v) => v.id === selectedVersionId)
    : null;
  const compareRows = selectedVersion?.rows ?? parsedRows;
  const comparison = useMemo(
    () => (compareRows.length > 0 ? compareWorkingOrderWithMatrix(compareRows, matrixLines) : []),
    [compareRows, matrixLines]
  );

  const handleImport = useCallback(() => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.csv,.xlsx,.xls';
    input.onchange = () => {
      const file = (input.files || [])[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = () => {
        const text = String(reader.result).replace(/\uFEFF/g, '');
        const lines = text.split(/\r?\n/).filter(Boolean);
        if (lines.length < 2) {
          setImportMessage(
            'В файле нет данных. Ожидается CSV с колонками Style, SKU, Color, Qty XS…XL.'
          );
          setParsedRows([]);
          return;
        }
        const headers = lines[0].split(';').map((h) => h.replace(/^"|"$/g, '').trim());
        const rows: WorkingOrderRow[] = [];
        for (let i = 1; i < lines.length; i++) {
          const values = lines[i].split(';').map((v) => v.replace(/^"|"$/g, '').trim());
          const row: WorkingOrderRow = {};
          headers.forEach((h, j) => {
            row[h] = values[j] ?? '';
          });
          rows.push(row);
        }
        setParsedRows(rows);
        const version = addWorkingOrderVersion({
          fileName: file.name,
          rows,
          uploadedBy: MOCK_UPLOADER,
          wholesaleOrderId: effectiveWholesaleOrderId || undefined,
        });
        setSelectedVersionId(version.id);
        setImportMessage(
          `Импорт: обработано ${rows.length} строк. Создана версия «${file.name}» (загрузил: ${MOCK_UPLOADER}).`
        );
        refreshVersions();
      };
      reader.readAsText(file, 'utf-8');
    };
    input.click();
  }, [refreshVersions, effectiveWholesaleOrderId]);

  return (
    <ShopB2bNuOrderScope>
      <ShopB2bContentHeader
        backHref={ROUTES.shop.b2bOrders}
        lead="NuOrder: экспорт заказа в Excel по шаблону (размер/цвет/qty), правка офлайн, импорт обратно и версии. Версии дублируются на сервер (GET/PUT v1) — локальный кэш в браузере сохраняется."
      />

      <B2bOrderUrlContextBanner variant="shop" className="rounded-xl" />

      <Card className="border-border-default border-dashed">
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Контекст оптового заказа</CardTitle>
          <CardDescription>
            Новые версии файла привязываются к выбранному заказу. Можно открыть страницу с{' '}
            <code className="text-text-secondary rounded bg-bg-surface2 px-1 text-[11px]">
              ?wholesaleOrderId=…
            </code>{' '}
            из списка заказов.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <select
            className="bg-bg-surface text-text-primary border-border-default w-full max-w-lg rounded-lg border px-3 py-2 text-sm"
            value={effectiveWholesaleOrderId}
            onChange={(e) => setManualWholesaleOrderId(e.target.value)}
            aria-label="Оптовый заказ для новых импортов"
          >
            <option value="">Не привязан</option>
            {operationalOrders.map((o) => (
              <option key={o.order} value={o.order}>
                {o.order} · {o.brand} — {o.status}
              </option>
            ))}
          </select>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Экспорт / Импорт</CardTitle>
          <CardDescription>
            Скачайте шаблон по текущему заказу (колонки по размерам), отредактируйте в Excel и
            загрузите обратно.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-2">
            <Button className="gap-2" variant="outline" onClick={downloadEmptyTemplate}>
              <FileDown className="h-4 w-4" /> Пустой шаблон (CSV)
            </Button>
            <Button className="gap-2" variant="outline" onClick={exportWorkingOrderExcel}>
              <FileDown className="h-4 w-4" /> Скачать по текущему заказу
            </Button>
            <Button className="gap-2" variant="outline" onClick={handleImport}>
              <FileUp className="h-4 w-4" /> Загрузить CSV
            </Button>
          </div>
          {importMessage && <p className="text-text-secondary text-sm">{importMessage}</p>}
          {parsedRows.length > 0 && (
            <div className="border-border-default overflow-hidden rounded-lg border">
              <p className="text-text-secondary bg-bg-surface2 px-3 py-2 text-xs font-medium">
                Превью загруженных строк ({parsedRows.length})
              </p>
              <div className="max-h-48 overflow-x-auto overflow-y-auto">
                <table className="w-full text-xs">
                  <thead className="bg-bg-surface2 sticky top-0">
                    <tr>
                      {TEMPLATE_HEADERS.slice(0, 8).map((h) => (
                        <th key={h} className="px-2 py-1.5 text-left font-medium">
                          {h}
                        </th>
                      ))}
                      <th className="px-2 py-1.5 text-left font-medium">…</th>
                    </tr>
                  </thead>
                  <tbody>
                    {parsedRows.slice(0, 20).map((row, i) => (
                      <tr key={i} className="border-border-subtle border-t">
                        {TEMPLATE_HEADERS.slice(0, 8).map((h) => (
                          <td key={h} className="px-2 py-1.5">
                            {row[h] ?? '—'}
                          </td>
                        ))}
                        <td className="px-2 py-1.5">…</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {parsedRows.length > 20 && (
                <p className="text-text-muted px-3 py-2 text-xs">
                  Показаны первые 20 из {parsedRows.length} строк
                </p>
              )}
            </div>
          )}
          <p className="text-text-muted text-xs">
            Формат: Style; SKU; Color; Delivery Window; Qty XS; Qty S; Qty M; Qty L; Qty XL; Total;
            Price; Line Total
          </p>
        </CardContent>
      </Card>

      {versions.length > 0 && (
        <Card className="mt-4">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <History className="h-4 w-4" /> Версии файла
            </CardTitle>
            <CardDescription>
              Кто загрузил, когда, статус. Выберите версию для сравнения с матрицей или отправки на
              подтверждение бренду.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="max-h-48 space-y-2 overflow-y-auto">
              {versions.map((v) => (
                <div
                  key={v.id}
                  className={cn(
                    'flex items-center justify-between rounded-lg border p-3 text-sm',
                    selectedVersionId === v.id
                      ? 'border-accent-primary/30 bg-accent-primary/10'
                      : 'border-border-default'
                  )}
                >
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedVersionId(v.id);
                        setShowCompare(false);
                      }}
                      className="text-left font-medium hover:underline"
                    >
                      {v.fileName}
                    </button>
                    <span className="text-text-secondary flex items-center gap-1 text-xs">
                      <User className="h-3 w-3" /> {v.uploadedBy}
                    </span>
                    <span className="text-text-muted text-xs">
                      {new Date(v.createdAt).toLocaleString('ru-RU')}
                    </span>
                    <Badge
                      variant={
                        v.status === 'confirmed'
                          ? 'default'
                          : v.status === 'rejected'
                            ? 'destructive'
                            : 'secondary'
                      }
                      className="text-[10px]"
                    >
                      {STATUS_LABELS[v.status]}
                    </Badge>
                    <select
                      className="border-border-subtle bg-bg-surface text-text-primary max-w-[min(100%,14rem)] rounded border px-1.5 py-0.5 text-[11px]"
                      value={v.wholesaleOrderId ?? ''}
                      onChange={(e) => {
                        const val = e.target.value;
                        setWorkingOrderVersionWholesaleOrderId(v.id, val || undefined);
                        refreshVersions();
                      }}
                      aria-label={`Привязка версии ${v.fileName} к заказу`}
                    >
                      <option value="">Заказ: —</option>
                      {operationalOrders.map((o) => (
                        <option key={o.order} value={o.order}>
                          {o.order}
                        </option>
                      ))}
                    </select>
                    {v.wholesaleOrderId ? (
                      <Link
                        href={shopB2bOrderHref(v.wholesaleOrderId)}
                        className="text-accent-primary text-[11px] font-medium underline-offset-2 hover:underline"
                      >
                        Карточка заказа
                      </Link>
                    ) : null}
                  </div>
                  {v.status === 'draft' && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        submitWorkingOrderForReview(v.id);
                        setSelectedVersionId(null);
                        refreshVersions();
                      }}
                    >
                      <Send className="mr-1 h-3 w-3" /> На проверку
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {(selectedVersion?.rows?.length ?? parsedRows.length) > 0 && (
        <Card className="mt-4">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Diff className="h-4 w-4" /> Сравнение с матрицей
            </CardTitle>
            <CardDescription>
              Сопоставление загруженного файла с текущей корзиной матрицы заказа.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button variant="outline" size="sm" onClick={() => setShowCompare((x) => !x)}>
              {showCompare ? 'Скрыть сравнение' : 'Показать сравнение'}
            </Button>
            {showCompare && (
              <div className="border-border-default overflow-hidden rounded-lg border">
                {comparison.length === 0 ? (
                  <p className="text-text-secondary p-4 text-sm">
                    В корзине матрицы нет позиций для сравнения. Добавьте товары в матрицу заказа.
                  </p>
                ) : (
                  <table className="w-full text-xs">
                    <thead className="bg-bg-surface2">
                      <tr>
                        <th className="px-2 py-2 text-left font-medium">SKU</th>
                        <th className="px-2 py-2 text-right">В файле</th>
                        <th className="px-2 py-2 text-right">В матрице</th>
                        <th className="px-2 py-2 text-right">Δ</th>
                        <th className="px-2 py-2 text-left">Статус</th>
                      </tr>
                    </thead>
                    <tbody>
                      {comparison.map((c) => (
                        <tr key={c.sku} className="border-border-subtle border-t">
                          <td className="px-2 py-1.5 font-medium">{c.sku}</td>
                          <td className="px-2 py-1.5 text-right">{c.inFile}</td>
                          <td className="px-2 py-1.5 text-right">{c.inMatrix}</td>
                          <td className="px-2 py-1.5 text-right">
                            {c.delta > 0 ? `+${c.delta}` : c.delta}
                          </td>
                          <td className="px-2 py-1.5">
                            {c.status === 'match' && (
                              <span className="text-emerald-600">совпадает</span>
                            )}
                            {c.status === 'only_file' && (
                              <span className="text-amber-600">только в файле</span>
                            )}
                            {c.status === 'only_matrix' && (
                              <span className="text-text-secondary">только в матрице</span>
                            )}
                            {c.status === 'file_more' && (
                              <span className="text-blue-600">в файле больше</span>
                            )}
                            {c.status === 'file_less' && (
                              <span className="text-rose-600">в файле меньше</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {selectedVersion?.status === 'pending_review' && (
        <Card className="mt-4 border-amber-200 bg-amber-50/30">
          <CardHeader>
            <CardTitle className="text-base">Подтверждение брендом</CardTitle>
            <CardDescription>
              Принять или отклонить загруженный Working Order (мок: доступно любому пользователю).
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <input
              placeholder="Комментарий (опционально)"
              className="border-border-default w-full rounded-lg border px-3 py-2 text-sm"
              value={brandComment}
              onChange={(e) => setBrandComment(e.target.value)}
            />
            <div className="flex gap-2">
              <Button
                size="sm"
                className="bg-emerald-600 hover:bg-emerald-700"
                onClick={() => {
                  setWorkingOrderStatus(selectedVersion!.id, 'confirmed', brandComment, 'Бренд');
                  setSelectedVersionId(null);
                  setBrandComment('');
                  refreshVersions();
                }}
              >
                <CheckCircle className="mr-1 h-4 w-4" /> Подтвердить
              </Button>
              <Button
                size="sm"
                variant="destructive"
                onClick={() => {
                  setWorkingOrderStatus(selectedVersion!.id, 'rejected', brandComment, 'Бренд');
                  setSelectedVersionId(null);
                  setBrandComment('');
                  refreshVersions();
                }}
              >
                <XCircle className="mr-1 h-4 w-4" /> Отклонить
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="mt-4 flex gap-2">
        <Button variant="outline" size="sm" asChild>
          <Link href={ROUTES.shop.b2bOrders}>Мои заказы</Link>
        </Button>
        <Button variant="outline" size="sm" asChild>
          <Link href={ROUTES.shop.b2bMatrix}>Матрица</Link>
        </Button>
      </div>
      <RelatedModulesBlock
        links={getShopB2BHubLinks()}
        title="Матрица, EZ Order, аналитика"
        className="mt-6"
      />
    </ShopB2bNuOrderScope>
  );
}

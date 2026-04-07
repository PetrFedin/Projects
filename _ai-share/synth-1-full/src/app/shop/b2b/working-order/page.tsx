'use client';

import { useState, useCallback, useMemo } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, FileDown, FileUp, History, User, CheckCircle, XCircle, Send, Diff } from 'lucide-react';
import { ROUTES } from '@/lib/routes';
import { initialOrderItems } from '@/lib/order-data';
import { RelatedModulesBlock } from '@/components/brand/RelatedModulesBlock';
import { getShopB2BHubLinks } from '@/lib/data/entity-links';
import { mockOrderDetailJoors } from '@/lib/order-data';
import {
  getWorkingOrderVersions,
  addWorkingOrderVersion,
  setWorkingOrderStatus,
  submitWorkingOrderForReview,
  compareWorkingOrderWithMatrix,
  type WorkingOrderRow,
  type WorkingOrderVersion,
} from '@/lib/b2b/working-order-store';
import { useB2BState } from '@/providers/b2b-state';

/** NuOrder: Working Order — экспорт заказа в Excel (размер/цвет/qty по колонкам), импорт обратно, версии, сравнение с матрицей, подтверждение брендом. */
const SIZES = ['XS', 'S', 'M', 'L', 'XL'];
const TEMPLATE_HEADERS = ['Style', 'SKU', 'Color', 'Delivery Window', ...SIZES.map(s => `Qty ${s}`), 'Total', 'Price', 'Line Total'];
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
  const headers = ['Style', 'SKU', 'Color', 'Delivery Window', ...SIZES.map(s => `Qty ${s}`), 'Total', 'Price', 'Line Total'];
  const rows = initialOrderItems.map((item: any) => {
    const qtyTotal = item.orderedQuantity || 0;
    const price = (item.price ?? 0) * 0.4;
    const lineTotal = qtyTotal * price;
    const windowLabel = item.deliveryWindowId ? mockOrderDetailJoors.deliveryWindows?.find(w => w.id === item.deliveryWindowId)?.label ?? item.deliveryWindowId : '';
    const bySize = SIZES.map(() => Math.floor(qtyTotal / SIZES.length));
    const remainder = qtyTotal - bySize.reduce((a, b) => a + b, 0);
    if (remainder > 0) bySize[0] += remainder;
    return [item.name, item.sku ?? item.id, item.color ?? '', windowLabel, ...bySize, qtyTotal, price.toFixed(2), lineTotal.toFixed(2)];
  });
  const csv = [headers.join(';'), ...rows.map(r => r.map(c => `"${String(c).replace(/"/g, '""')}"`).join(';'))].join('\n');
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
  const { b2bCart = [] } = useB2BState();
  const [importMessage, setImportMessage] = useState<string | null>(null);
  const [parsedRows, setParsedRows] = useState<WorkingOrderRow[]>([]);
  const [selectedVersionId, setSelectedVersionId] = useState<string | null>(null);
  const [showCompare, setShowCompare] = useState(false);
  const [brandComment, setBrandComment] = useState('');
  const [versions, setVersions] = useState<WorkingOrderVersion[]>(() => getWorkingOrderVersions());

  const refreshVersions = useCallback(() => { setVersions(getWorkingOrderVersions()); }, []);

  const matrixLines = useMemo(() => {
    const bySku = new Map<string, number>();
    b2bCart?.forEach((item: { id?: string; sku?: string; quantity?: number }) => {
      const sku = (item as any).sku ?? item.id ?? '';
      if (!sku) return;
      bySku.set(sku, (bySku.get(sku) ?? 0) + (item.quantity ?? 0));
    });
    return Array.from(bySku.entries()).map(([sku, totalQty]) => ({ sku, totalQty }));
  }, [b2bCart]);

  const selectedVersion = selectedVersionId ? versions.find((v) => v.id === selectedVersionId) : null;
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
          setImportMessage('В файле нет данных. Ожидается CSV с колонками Style, SKU, Color, Qty XS…XL.');
          setParsedRows([]);
          return;
        }
        const headers = lines[0].split(';').map(h => h.replace(/^"|"$/g, '').trim());
        const rows: WorkingOrderRow[] = [];
        for (let i = 1; i < lines.length; i++) {
          const values = lines[i].split(';').map(v => v.replace(/^"|"$/g, '').trim());
          const row: WorkingOrderRow = {};
          headers.forEach((h, j) => { row[h] = values[j] ?? ''; });
          rows.push(row);
        }
        setParsedRows(rows);
        const version = addWorkingOrderVersion({
          fileName: file.name,
          rows,
          uploadedBy: MOCK_UPLOADER,
        });
        setSelectedVersionId(version.id);
        setImportMessage(`Импорт: обработано ${rows.length} строк. Создана версия «${file.name}» (загрузил: ${MOCK_UPLOADER}).`);
        refreshVersions();
      };
      reader.readAsText(file, 'utf-8');
    };
    input.click();
  }, [refreshVersions]);

  return (
    <div className="container max-w-2xl mx-auto px-4 py-6 pb-24">
      <div className="flex items-center gap-3 mb-6">
        <Link href={ROUTES.shop.b2bOrders}><Button variant="ghost" size="icon"><ArrowLeft className="h-4 w-4" /></Button></Link>
        <div>
          <h1 className="text-2xl font-bold uppercase tracking-tight">Working Order</h1>
          <p className="text-slate-500 text-sm mt-0.5">NuOrder: экспорт заказа в Excel по шаблону (размер/цвет/qty), правка офлайн, импорт обратно.</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Экспорт / Импорт</CardTitle>
          <CardDescription>Скачайте шаблон по текущему заказу (колонки по размерам), отредактируйте в Excel и загрузите обратно.</CardDescription>
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
          {importMessage && <p className="text-sm text-slate-600">{importMessage}</p>}
          {parsedRows.length > 0 && (
            <div className="rounded-lg border border-slate-200 overflow-hidden">
              <p className="text-xs font-medium text-slate-500 px-3 py-2 bg-slate-50">Превью загруженных строк ({parsedRows.length})</p>
              <div className="overflow-x-auto max-h-48 overflow-y-auto">
                <table className="w-full text-xs">
                  <thead className="bg-slate-50 sticky top-0">
                    <tr>
                      {TEMPLATE_HEADERS.slice(0, 8).map(h => <th key={h} className="text-left py-1.5 px-2 font-medium">{h}</th>)}
                      <th className="text-left py-1.5 px-2 font-medium">…</th>
                    </tr>
                  </thead>
                  <tbody>
                    {parsedRows.slice(0, 20).map((row, i) => (
                      <tr key={i} className="border-t border-slate-100">
                        {TEMPLATE_HEADERS.slice(0, 8).map(h => <td key={h} className="py-1.5 px-2">{row[h] ?? '—'}</td>)}
                        <td className="py-1.5 px-2">…</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {parsedRows.length > 20 && <p className="text-xs text-slate-400 px-3 py-2">Показаны первые 20 из {parsedRows.length} строк</p>}
            </div>
          )}
          <p className="text-xs text-slate-400">Формат: Style; SKU; Color; Delivery Window; Qty XS; Qty S; Qty M; Qty L; Qty XL; Total; Price; Line Total</p>
        </CardContent>
      </Card>

      {versions.length > 0 && (
        <Card className="mt-4">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base"><History className="h-4 w-4" /> Версии файла</CardTitle>
            <CardDescription>Кто загрузил, когда, статус. Выберите версию для сравнения с матрицей или отправки на подтверждение бренду.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {versions.map((v) => (
                <div
                  key={v.id}
                  className={cn(
                    'flex items-center justify-between p-3 rounded-lg border text-sm',
                    selectedVersionId === v.id ? 'border-indigo-300 bg-indigo-50/50' : 'border-slate-200'
                  )}
                >
                  <div className="flex items-center gap-2 flex-wrap">
                    <button type="button" onClick={() => { setSelectedVersionId(v.id); setShowCompare(false); }} className="font-medium text-left hover:underline">
                      {v.fileName}
                    </button>
                    <span className="text-xs text-slate-500 flex items-center gap-1"><User className="h-3 w-3" /> {v.uploadedBy}</span>
                    <span className="text-xs text-slate-400">{new Date(v.createdAt).toLocaleString('ru-RU')}</span>
                    <Badge variant={v.status === 'confirmed' ? 'default' : v.status === 'rejected' ? 'destructive' : 'secondary'} className="text-[10px]">
                      {STATUS_LABELS[v.status]}
                    </Badge>
                  </div>
                  {v.status === 'draft' && (
                    <Button size="sm" variant="outline" onClick={() => { submitWorkingOrderForReview(v.id); setSelectedVersionId(null); refreshVersions(); }}>
                      <Send className="h-3 w-3 mr-1" /> На проверку
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
            <CardTitle className="flex items-center gap-2 text-base"><Diff className="h-4 w-4" /> Сравнение с матрицей</CardTitle>
            <CardDescription>Сопоставление загруженного файла с текущей корзиной матрицы заказа.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button variant="outline" size="sm" onClick={() => setShowCompare((x) => !x)}>
              {showCompare ? 'Скрыть сравнение' : 'Показать сравнение'}
            </Button>
            {showCompare && (
              <div className="rounded-lg border border-slate-200 overflow-hidden">
                {comparison.length === 0 ? (
                  <p className="text-sm text-slate-500 p-4">В корзине матрицы нет позиций для сравнения. Добавьте товары в матрицу заказа.</p>
                ) : (
                  <table className="w-full text-xs">
                    <thead className="bg-slate-50"><tr><th className="text-left py-2 px-2 font-medium">SKU</th><th className="text-right py-2 px-2">В файле</th><th className="text-right py-2 px-2">В матрице</th><th className="text-right py-2 px-2">Δ</th><th className="text-left py-2 px-2">Статус</th></tr></thead>
                    <tbody>
                      {comparison.map((c) => (
                        <tr key={c.sku} className="border-t border-slate-100">
                          <td className="py-1.5 px-2 font-medium">{c.sku}</td>
                          <td className="text-right py-1.5 px-2">{c.inFile}</td>
                          <td className="text-right py-1.5 px-2">{c.inMatrix}</td>
                          <td className="text-right py-1.5 px-2">{c.delta > 0 ? `+${c.delta}` : c.delta}</td>
                          <td className="py-1.5 px-2">
                            {c.status === 'match' && <span className="text-emerald-600">совпадает</span>}
                            {c.status === 'only_file' && <span className="text-amber-600">только в файле</span>}
                            {c.status === 'only_matrix' && <span className="text-slate-500">только в матрице</span>}
                            {c.status === 'file_more' && <span className="text-blue-600">в файле больше</span>}
                            {c.status === 'file_less' && <span className="text-rose-600">в файле меньше</span>}
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
            <CardDescription>Принять или отклонить загруженный Working Order (мок: доступно любому пользователю).</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <input
              placeholder="Комментарий (опционально)"
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
              value={brandComment}
              onChange={(e) => setBrandComment(e.target.value)}
            />
            <div className="flex gap-2">
              <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700" onClick={() => { setWorkingOrderStatus(selectedVersion!.id, 'confirmed', brandComment, 'Бренд'); setSelectedVersionId(null); setBrandComment(''); refreshVersions(); }}>
                <CheckCircle className="h-4 w-4 mr-1" /> Подтвердить
              </Button>
              <Button size="sm" variant="destructive" onClick={() => { setWorkingOrderStatus(selectedVersion!.id, 'rejected', brandComment, 'Бренд'); setSelectedVersionId(null); setBrandComment(''); refreshVersions(); }}>
                <XCircle className="h-4 w-4 mr-1" /> Отклонить
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="mt-4 flex gap-2">
        <Button variant="outline" size="sm" asChild><Link href={ROUTES.shop.b2bOrders}>Мои заказы</Link></Button>
        <Button variant="outline" size="sm" asChild><Link href={ROUTES.shop.b2bMatrix}>Матрица</Link></Button>
      </div>
      <RelatedModulesBlock links={getShopB2BHubLinks()} title="Матрица, EZ Order, аналитика" className="mt-6" />
    </div>
  );
}

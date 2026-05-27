'use client';

import { useCallback, useEffect, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import * as LucideIcons from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import {
  formatWorkshop2PersistToastTitle,
  showWorkshop2PersistToast,
} from '@/lib/production/workshop2-persist-toast-messages';
import {
  createWorkshop2PurchaseOrdersApi,
  fetchWorkshop2PurchaseOrders,
  syncWorkshop2PurchaseOrdersErp,
  type Workshop2PurchaseOrderDto,
} from '@/lib/production/workshop2-purchase-orders-client';
import { resolveWorkshop2PurchaseOrderErpDisplayStatus } from '@/lib/production/workshop2-purchase-order-erp-display';
import type { Workshop2DossierPhase1 } from '@/lib/production/workshop2-dossier-phase1.types';
import { putWorkshop2Wave22DossierPatch } from '@/lib/production/workshop2-wave22-persist-client';
import {
  loadWorkshop2DossierFromApi,
  postWorkshop2PurchaseOrderErpMirrorSync,
} from '@/lib/production/workshop2-api-client';
import { persistWorkshop2PurchaseOrderErpMirrorToDossier } from '@/lib/production/workshop2-purchase-order-erp-dossier-persist';
import {
  Workshop2OperationalPanelChrome,
  Workshop2OperationalPanelShell,
} from '@/components/brand/production/workshop2-operational-panel-chrome';
import { Workshop2CeilingIntegrationBlock } from '@/components/brand/production/Workshop2CeilingIntegrationBlock';
import { Workshop2DossierPersistButton } from '@/components/brand/production/Workshop2DossierPersistButton';

const ERP_BADGE_VARIANT: Record<
  ReturnType<typeof resolveWorkshop2PurchaseOrderErpDisplayStatus>['code'],
  'default' | 'secondary' | 'destructive' | 'outline'
> = {
  synced: 'default',
  pending_erp: 'secondary',
  error: 'destructive',
  draft: 'outline',
  not_configured: 'outline',
  skipped: 'outline',
};

type Props = {
  collectionId: string;
  articleId: string;
  /** supply — из заявок; plan — из qty плана */
  mode: 'supply' | 'plan';
  planQty?: number;
  planLabel?: string;
  dossier?: Workshop2DossierPhase1 | null;
  onDossierChange?: (next: Workshop2DossierPhase1) => void;
};

export function Workshop2PurchaseOrdersErpPanel({
  collectionId,
  articleId,
  mode,
  planQty,
  planLabel,
  dossier = null,
  onDossierChange,
}: Props) {
  const { toast } = useToast();
  const [orders, setOrders] = useState<Workshop2PurchaseOrderDto[]>([]);
  const [erpConfigured, setErpConfigured] = useState(false);
  const [loading, setLoading] = useState(false);
  const [busy, setBusy] = useState(false);
  const [erpMirrorBusy, setErpMirrorBusy] = useState(false);

  const persistErpMirrorToPg = useCallback(async () => {
    if (!dossier) return;
    setErpMirrorBusy(true);
    try {
      const serverSync = await postWorkshop2PurchaseOrderErpMirrorSync(collectionId, articleId);
      if (serverSync.ok && onDossierChange) {
        const loaded = await loadWorkshop2DossierFromApi(collectionId, articleId);
        if (loaded.ok) {
          onDossierChange(loaded.data.dossier);
          toast({
            title: formatWorkshop2PersistToastTitle({ scopeLabelRu: 'PO ERP', ok: true }),
            description: `erpSyncMode: ${loaded.data.dossier.purchaseOrderErpMirror?.erpSyncMode ?? 'journal_only'}`,
          });
          return;
        }
      }
      const res = await putWorkshop2Wave22DossierPatch({
        collectionId,
        articleId,
        base: dossier,
        apply: (d) =>
          persistWorkshop2PurchaseOrderErpMirrorToDossier(d, {
            purchaseOrders: orders.map((o) => ({
              id: o.id,
              status: o.status,
              erpExternalId: o.erpExternalId,
              lastError: typeof o.payload?.lastError === 'string' ? o.payload.lastError : undefined,
            })),
            erpConfigured,
          }),
        field: 'purchase_order_erp_mirror',
        updatedByLabel: 'po-erp-panel',
      });
      if (res.ok) onDossierChange?.(res.dossier);
      showWorkshop2PersistToast(toast, {
        scopeLabelRu: 'PO ERP',
        ok: res.ok,
        mirrorField: 'purchaseOrderErpMirror',
        reason: res.reason,
        okHintRu: 'purchaseOrderErpMirror в досье (sample-order gate).',
      });
    } finally {
      setErpMirrorBusy(false);
    }
  }, [articleId, collectionId, dossier, erpConfigured, onDossierChange, orders, toast]);

  const reload = useCallback(async () => {
    setLoading(true);
    try {
      const { orders: list, erpConfigured: configured } = await fetchWorkshop2PurchaseOrders(
        collectionId,
        articleId
      );
      setOrders(list);
      setErpConfigured(configured);
    } finally {
      setLoading(false);
    }
  }, [collectionId, articleId]);

  useEffect(() => {
    void reload();
  }, [reload]);

  const handleCreate = async () => {
    setBusy(true);
    try {
      const res =
        mode === 'plan'
          ? await createWorkshop2PurchaseOrdersApi(collectionId, articleId, {
              source: 'sample_plan',
              qty: planQty ?? 1,
              label: planLabel ?? 'Партия из плана',
            })
          : await createWorkshop2PurchaseOrdersApi(collectionId, articleId, {
              source: 'requisitions',
            });
      if (!res.ok) {
        toast({
          title: 'Не удалось создать PO',
          description: res.messageRu ?? 'Проверьте заявки на материал',
          variant: 'destructive',
        });
        return;
      }
      toast({
        title: 'PO созданы',
        description: res.message ?? `Строк: ${res.purchaseOrders?.length ?? 0}`,
      });
      void reload();
    } finally {
      setBusy(false);
    }
  };

  const handleSyncErp = async () => {
    if (!erpConfigured) {
      toast({
        title: 'ERP не настроен',
        description: 'Задайте WORKSHOP2_FACTORY_ERP_BASE_URL перед выгрузкой PO.',
        variant: 'destructive',
      });
      return;
    }
    setBusy(true);
    try {
      const res = await syncWorkshop2PurchaseOrdersErp(collectionId, articleId);
      if (res.erpConfigured != null) setErpConfigured(res.erpConfigured);
      const syncedCount = res.synced ?? 0;
      if (!res.ok || res.erpConfigured === false || syncedCount === 0) {
        toast({
          title: res.erpConfigured === false ? 'ERP не настроен' : 'Синхронизация с ошибками',
          description:
            res.message ??
            (res.erpConfigured === false
              ? 'Задайте WORKSHOP2_FACTORY_ERP_BASE_URL'
              : `Синхронизировано: ${syncedCount}, ошибок: ${res.failed ?? 0}. Успех только при erpOrderId + mirror.`),
          variant: 'destructive',
        });
      } else {
        toast({
          title: 'ERP синхронизация',
          description: res.message ?? `Синхронизировано: ${syncedCount}`,
        });
        await reload();
        if (dossier) {
          await persistErpMirrorToPg();
        }
        return;
      }
      void reload();
    } finally {
      setBusy(false);
    }
  };

  const filtered =
    mode === 'plan'
      ? orders.filter((o) => o.payload?.source === 'sample_plan' || !o.lineRef)
      : orders.filter((o) => o.payload?.source !== 'sample_plan' || o.lineRef);

  return (
    <div data-testid={`workshop2-purchase-orders-${mode}`}>
      <Workshop2OperationalPanelShell className="border-border-subtle bg-bg-surface2/40 p-3 shadow-none">
        <Workshop2OperationalPanelChrome
          icon={LucideIcons.FileSpreadsheet}
          title={mode === 'supply' ? 'Заказы на закупку (PO)' : 'PO серии · ERP'}
          description={
            !erpConfigured
              ? 'ERP URL не задан — PO остаются в PG до настройки интеграции.'
              : `Активных PO: ${loading ? '…' : filtered.length}`
          }
          meta={
            <Badge variant="outline" className="w-fit text-[9px]">
              {loading ? '…' : `${filtered.length} PO`}
            </Badge>
          }
          actions={
            <>
              <Button
                type="button"
                size="sm"
                variant="outline"
                className="h-7 text-[10px]"
                disabled={busy}
                data-testid="workshop2-po-create"
                onClick={() => void handleCreate()}
              >
                <LucideIcons.Plus className="mr-1 h-3 w-3" />
                {mode === 'supply' ? 'Создать PO из заявок' : 'PO из плана'}
              </Button>
              <Button
                type="button"
                size="sm"
                className="h-7 bg-indigo-600 text-[10px] hover:bg-indigo-700"
                disabled={busy || filtered.length === 0 || !erpConfigured}
                data-testid="workshop2-po-sync-erp"
                title={
                  !erpConfigured
                    ? 'WORKSHOP2_FACTORY_ERP_BASE_URL не задан — sync fail-closed'
                    : 'POST /purchase-orders → erpOrderId; успех только при mirror в досье'
                }
                onClick={() => void handleSyncErp()}
              >
                <LucideIcons.Upload className="mr-1 h-3 w-3" />
                Выгрузить в ERP
              </Button>
              {dossier ? (
                <Workshop2DossierPersistButton
                  busy={erpMirrorBusy}
                  disabled={loading}
                  onClick={() => void persistErpMirrorToPg()}
                />
              ) : null}
            </>
          }
        />

        {mode === 'plan' ? (
          <Workshop2CeilingIntegrationBlock
            catalogId={66}
            kind="erp"
            disabledReasonRu={
              !erpConfigured
                ? 'WORKSHOP2_FACTORY_ERP_BASE_URL не задан — sync fail-closed без fake ready.'
                : undefined
            }
          />
        ) : null}

        {dossier?.factoryErpStagingMirror?.journal?.length ? (
          <div className="rounded border border-indigo-100 bg-indigo-50/50 px-2 py-1.5 text-[10px] text-indigo-950">
            <span className="font-semibold">ERP staging journal: </span>
            {(() => {
              const last = dossier.factoryErpStagingMirror!.journal.at(-1)!;
              return `${last.outcome} · ${last.event}${last.httpStatus != null ? ` · HTTP ${last.httpStatus}` : ''}${
                last.error ? ` · ${last.error}` : ''
              } · ${new Date(last.at).toLocaleString('ru-RU')}`;
            })()}
          </div>
        ) : null}

        {filtered.length === 0 ? (
          <p className="text-text-secondary text-[10px]">
            {mode === 'supply'
              ? 'Нет PO. Создайте заявки из BOM, затем «Создать PO из заявок».'
              : 'Нет PO серии. Укажите qty в плане и создайте PO.'}
          </p>
        ) : (
          <ul className="space-y-1.5">
            {filtered.map((po) => {
              const display = resolveWorkshop2PurchaseOrderErpDisplayStatus({
                status: po.status,
                erpExternalId: po.erpExternalId,
                lastError:
                  typeof po.payload?.lastError === 'string' ? po.payload.lastError : undefined,
                erpConfigured,
              });
              return (
                <li
                  key={po.id}
                  className="border-border-subtle flex flex-wrap items-center justify-between gap-2 rounded border bg-white px-2 py-1.5 text-[10px]"
                >
                  <span className="min-w-0 truncate font-medium">
                    {(po.payload?.materialLabel as string) ||
                      (po.payload?.label as string) ||
                      po.lineRef ||
                      po.id.slice(0, 8)}
                    {' · '}
                    {po.qty}
                    {po.payload?.unit ? ` ${String(po.payload.unit)}` : ''}
                  </span>
                  <Badge variant={ERP_BADGE_VARIANT[display.code]} className="shrink-0 text-[9px]">
                    {display.labelRu}
                  </Badge>
                </li>
              );
            })}
          </ul>
        )}
      </Workshop2OperationalPanelShell>
    </div>
  );
}

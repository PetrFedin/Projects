/**
 * Мок API для B2B (до бэкенда). Заявки байеров пишутся в buyer-applications-store.
 * Списочные методы shop/client — заглушки для сборки Next; при API заменить на fetch.
 */

import type { BuyerApplication } from '@/lib/b2b/buyer-onboarding';
import { submitApplication } from '@/lib/b2b/buyer-applications-store';
import type { EndlessAisleRequest } from '@/lib/shop/endless-aisle-pos';
import type { CycleCountSession } from '@/lib/shop/cycle-counting';
import type { BnplTransaction } from '@/lib/shop/bnpl-gateway';
import type { WardrobeItem, WardrobeLook } from '@/lib/client/digital-wardrobe';
import type { LiaStoreFeed } from '@/lib/shop/local-inventory-ads';
import type { ShipFromStoreAssignment } from '@/lib/shop/ship-from-store';
import type { StylistLook } from '@/lib/shop/endless-stylist';
import type { TBYBOrder } from '@/lib/client/try-before-you-buy-b2c';

export interface SubmitBuyerApplicationPayload {
  companyName: string;
  contactName: string;
  email: string;
  phone?: string;
  country: string;
  city?: string;
  applicantType: BuyerApplication['applicantType'];
  message?: string;
  /** Из Discover: к какому бренду заявка (опционально) */
  brandId?: string;
  brandName?: string;
}

/** JOOR Discover: отправка заявки на доступ к каталогу бренда. При API — POST /api/v1/b2b/buyer-applications/submit */
export async function submitBuyerApplication(payload: SubmitBuyerApplicationPayload): Promise<BuyerApplication> {
  await new Promise((r) => setTimeout(r, 600));
  const app = submitApplication({
    companyName: payload.companyName,
    contactName: payload.contactName,
    email: payload.email,
    phone: payload.phone,
    country: payload.country,
    city: payload.city,
    applicantType: payload.applicantType,
    message: payload.message,
    brandId: payload.brandId,
    brandName: payload.brandName,
  });
  return app;
}

async function mockDelay<T>(data: T, ms = 80): Promise<T> {
  await new Promise((r) => setTimeout(r, ms));
  return data;
}

export async function listEndlessAisleRequests(): Promise<EndlessAisleRequest[]> {
  return mockDelay([
    {
      id: 'ea-1',
      storeId: 'store-mock',
      requestedSku: 'SYN-TEE-001',
      sizeRequested: 'M',
      status: 'reserved',
      orderId: 'ORD-MOCK-1',
      createdAt: new Date().toISOString(),
    },
  ]);
}

export async function listCycleCountSessions(): Promise<CycleCountSession[]> {
  return mockDelay([
    {
      id: 'cc-1',
      warehouseId: 'wh-1',
      zone: 'A',
      status: 'in_progress',
      scannedCount: 42,
      expectedCount: 100,
      markingVerified: true,
      startedAt: new Date().toISOString(),
    },
  ]);
}

export async function listBnplTransactions(): Promise<BnplTransaction[]> {
  return mockDelay([
    {
      id: 'bnpl-1',
      orderId: 'ORD-100',
      provider: 'tinkoff',
      amountRub: 24990,
      status: 'approved',
      createdAt: new Date().toISOString(),
    },
  ]);
}

export async function listWardrobeItems(): Promise<WardrobeItem[]> {
  return mockDelay([
    {
      id: 'w-1',
      productId: 'p-1',
      sku: 'SKU-1',
      name: 'Футболка',
      orderId: 'ORD-1',
      purchasedAt: new Date().toISOString(),
      category: 'Верх',
    },
  ]);
}

export async function listWardrobeLooks(): Promise<WardrobeLook[]> {
  return mockDelay([
    {
      id: 'look-1',
      name: 'Casual',
      itemIds: ['w-1'],
      createdAt: new Date().toISOString(),
    },
  ]);
}

export async function listLiaFeeds(): Promise<LiaStoreFeed[]> {
  return mockDelay([
    {
      storeId: 's1',
      storeName: 'Syntha Тверская',
      channel: 'yandex',
      status: 'active',
      lastSyncAt: new Date().toISOString(),
      itemCount: 128,
    },
  ]);
}

export async function listShipFromStoreAssignments(): Promise<ShipFromStoreAssignment[]> {
  return mockDelay([
    {
      id: 'sfs-1',
      orderId: 'ORD-200',
      storeId: 's1',
      storeName: 'Syntha Тверская',
      status: 'shipped',
      assignedAt: new Date().toISOString(),
      shippedAt: new Date().toISOString(),
      trackingNumber: 'TRACK-MOCK',
    },
  ]);
}

export async function listStylistLooks(): Promise<StylistLook[]> {
  return mockDelay([
    {
      id: 'sl-1',
      items: [
        { productId: 'p1', sku: 'SKU-A', name: 'Пиджак' },
        { productId: 'p2', sku: 'SKU-B', name: 'Брюки' },
      ],
      createdAt: new Date().toISOString(),
    },
  ]);
}

export async function listTbybOrders(): Promise<TBYBOrder[]> {
  return mockDelay([
    {
      id: 'tbyb-1',
      orderId: 'ORD-TBYB-1',
      customerId: 'c1',
      status: 'delivered',
      holdAmountRub: 15000,
      items: [{ sku: 'SKU-X', name: 'Платье', qty: 1 }],
      createdAt: new Date().toISOString(),
    },
  ]);
}

'use client';

import React, { createContext, useContext, useState, useMemo, useEffect, useCallback } from 'react';
import { Product, CartItem } from '@/lib/types';
import allProductsData from '@/lib/products';
import { useAuth } from '@/providers/auth-provider';
import { B2BRepository } from '@/lib/repositories/b2b-repository';
import {
  B2BActivityLog,
  B2BConnection,
  LinesheetRequest,
  B2BNegotiation,
  WholesaleCollection,
  CustomLinesheet,
  InventoryItem,
  EscrowTransaction,
  B2BBanner,
  RetailerProfile,
  B2BTask,
  B2BDocument,
  B2BCalendarEvent,
  B2BMessage,
  B2BOrderWholesaleStatus,
  NegotiationMessage,
  B2BLookbook,
  BrandAsset,
  WholesaleLead,
  OrderClaim,
  WhiteLabelConfig
} from '@/lib/types/b2b';
import {
  B2CProductListing,
  RetailerStockSync,
  UnifiedStockView,
  B2COrder,
  StoreLocation,
  RolePermissions,
  StockSyncAgreement,
} from '@/lib/types/marketplace';

interface B2BState {
  // Существующие B2B функции
  b2bActivityLogs: B2BActivityLog[];
  addB2bActivityLog: (log: Omit<B2BActivityLog, 'id' | 'timestamp'>) => void;
  b2bConnections: B2BConnection[];
  toggleB2bConnection: (brandId: string, retailerId: string) => void;
  linesheetRequests: LinesheetRequest[];
  requestLinesheet: (brandId: string, retailerId: string) => void;
  b2bNegotiations: B2BNegotiation[];
  addNegotiationMessage: (orderId: string, message: Omit<NegotiationMessage, 'id' | 'timestamp'>) => void;
  updateOrderWholesaleStatus: (orderId: string, status: B2BOrderWholesaleStatus) => void;
  assortmentPlan: Product[];
  addToAssortmentPlan: (product: Product) => void;
  removeFromAssortmentPlan: (productId: string) => void;
  clearAssortmentPlan: () => void;
  wholesaleCollections: WholesaleCollection[];
  addWholesaleCollection: (collection: WholesaleCollection) => void;
  updateWholesaleCollection: (id: string, patch: Partial<WholesaleCollection>) => void;
  customLinesheets: CustomLinesheet[];
  addLinesheet: (linesheet: CustomLinesheet) => void;
  inventoryATS: InventoryItem[];
  reserveStock: (sku: string, quantity: number, retailerId: string) => void;
  b2bEscrowTransactions: EscrowTransaction[];
  addEscrowTransaction: (tx: EscrowTransaction) => void;
  retailerLoyalty: Record<string, number>;
  updateLoyaltyPoints: (retailerId: string, amount: number) => void;
  marketingBanners: B2BBanner[];
  addMarketingBanner: (banner: B2BBanner) => void;
  retailerProfiles: Record<string, RetailerProfile>;
  updateRetailerProfile: (id: string, patch: Partial<RetailerProfile>) => void;
  b2bTasks: B2BTask[];
  addB2bTask: (task: Omit<B2BTask, 'id' | 'createdAt'>) => void;
  updateB2bTask: (id: string, patch: Partial<B2BTask>) => void;
  b2bDocuments: B2BDocument[];
  uploadB2bDocument: (doc: Omit<B2BDocument, 'id' | 'uploadedAt'>) => void;
  b2bEvents: B2BCalendarEvent[];
  addB2bEvent: (event: Omit<B2BCalendarEvent, 'id'>) => void;
  b2bMessages: B2BMessage[];
  sendB2bMessage: (msg: Omit<B2BMessage, 'id' | 'timestamp'>) => void;
  productVotes: Record<string, { likes: string[], dislikes: string[] }>;
  toggleProductVote: (productId: string, userId: string, type: 'like' | 'dislike') => void;
  marketingAssets: BrandAsset[];
  addMarketingAsset: (asset: BrandAsset) => void;
  b2bLookbooks: B2BLookbook[];
  addB2bLookbook: (lookbook: B2BLookbook) => void;
  b2bProducts: Product[];
  wholesaleLeads: WholesaleLead[];
  addWholesaleLead: (lead: Omit<WholesaleLead, 'id' | 'lastActivity'>) => void;
  updateWholesaleLead: (id: string, patch: Partial<WholesaleLead>) => void;
  orderClaims: OrderClaim[];
  addOrderClaim: (claim: Omit<OrderClaim, 'id' | 'createdAt'>) => void;
  updateOrderClaim: (id: string, patch: Partial<OrderClaim>) => void;
  whiteLabelConfigs: Record<string, WhiteLabelConfig>;
  updateWhiteLabelConfig: (brandId: string, config: Partial<WhiteLabelConfig>) => void;
  b2bCart: CartItem[];
  setB2bCart: React.Dispatch<React.SetStateAction<CartItem[]>>;
  addB2bOrderItem: (product: Product, size: string, quantity: number, deliveryDate?: string) => void;
  updateB2bOrderItemQuantity: (productId: string, quantity: number, size: string, deliveryDate?: string) => void;
  removeB2bOrderItem: (productId: string, size: string, deliveryDate?: string) => void;
  
  // НОВЫЕ B2C Marketplace функции
  b2cListings: B2CProductListing[];
  createB2CListing: (listing: Omit<B2CProductListing, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateB2CListing: (id: string, patch: Partial<B2CProductListing>) => void;
  scheduleB2CListing: (id: string, liveDate: string, archiveDate?: string) => void;
  
  // Stock Synchronization
  stockSyncRequests: RetailerStockSync[];
  requestStockSync: (brandId: string, retailerId: string, productId: string, sku: string) => void;
  approveStockSync: (id: string) => void;
  rejectStockSync: (id: string, reason: string) => void;
  updateRetailerStock: (syncId: string, quantity: number) => void;
  
  stockSyncAgreements: StockSyncAgreement[];
  createSyncAgreement: (agreement: Omit<StockSyncAgreement, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateSyncAgreement: (id: string, patch: Partial<StockSyncAgreement>) => void;
  
  // Unified Stock View
  getUnifiedStock: (productId: string) => UnifiedStockView | null;
  
  // Store Locations
  storeLocations: StoreLocation[];
  addStoreLocation: (location: Omit<StoreLocation, 'id'>) => void;
  updateStoreLocation: (id: string, patch: Partial<StoreLocation>) => void;
  
  // B2C Orders
  b2cOrders: B2COrder[];
  createB2COrder: (order: Omit<B2COrder, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateB2COrderStatus: (id: string, status: B2COrder['status']) => void;
  
  // Permissions (computed based on user role)
  permissions: RolePermissions | null;
}

const B2BStateContext = createContext<B2BState | undefined>(undefined);

export function B2BStateProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const activeOrgId = user?.activeOrganizationId;
  const isBrand = user?.roles?.includes('brand');
  const isRetailer = user?.roles?.includes('shop') || user?.roles?.includes('b2b');
  const isAdmin = user?.roles?.includes('admin');

  const [b2bActivityLogs, setB2bActivityLogs] = useState<B2BActivityLog[]>([
    {
      id: 'log1',
      timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
      type: 'order_placed',
      actor: { id: 'user-buy-001', name: 'Maria Ivanova', type: 'retailer' },
      target: { id: 'org-brand-002', name: 'ORD-8821 Nordic Wool FW26', type: 'brand' },
      details:
        'Создан новый заказ на сумму 420,000 ₽. Maria Ivanova — Nordic Wool FW26 (42 артикула). Бюджет: 420,000 ₽',
    },
    {
      id: 'log2',
      timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
      type: 'order_status_change',
      actor: { id: 'user-brand-001', name: 'Alexey Petrov', type: 'brand' },
      target: { id: 'org-shop-001', name: 'ORD-8790 Syntha Lab SS26', type: 'retailer' },
      details: 'Подтверждён заказ ORD-8790. Статус: Production Started',
    },
    {
      id: 'log3',
      timestamp: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
      type: 'order_status_change',
      actor: { id: 'user-shop-001', name: 'Olga Smirnova', type: 'retailer' },
      target: { id: 'org-brand-002', name: 'FW26 Contract doc-1', type: 'brand' },
      details: 'Подписан контракт FW26_Price_List.pdf (ЭДО: Диадок)',
    },
    {
      id: 'log4',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      type: 'negotiation_update',
      actor: { id: 'user-buy-002', name: 'Ivan Kozlov', type: 'retailer' },
      target: { id: 'org-brand-003', name: 'ORD-8819 Radical Chic Draft', type: 'brand' },
      details: 'Начаты переговоры по заказу ORD-8819. Запрошено: скидка 12%',
    },
    {
      id: 'log5',
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
      type: 'view_product',
      actor: { id: 'user-buy-003', name: 'Elena Volkova', type: 'retailer' },
      target: { id: '1', name: 'Cyber Tech Parka', type: 'product' },
      details: 'Просмотрена карточка товара. Wishlist добавлено',
    },
  ]);
  const [b2bConnections, setB2bConnections] = useState<B2BConnection[]>([
    { brandId: 'org-brand-001', retailerId: 'org-shop-001', status: 'active', since: new Date().toISOString() },
    { brandId: 'org-brand-002', retailerId: 'org-shop-001', status: 'active', since: new Date().toISOString() },
    { brandId: 'org-brand-003', retailerId: 'org-shop-001', status: 'pending', since: new Date().toISOString() }
  ]);
  const [linesheetRequests, setLinesheetRequests] = useState<LinesheetRequest[]>([
    { id: 'lr1', brandId: 'org-brand-001', retailerId: 'org-shop-001', status: 'pending', timestamp: new Date().toISOString() },
    { id: 'lr2', brandId: 'org-brand-002', retailerId: 'org-shop-001', status: 'sent', timestamp: new Date().toISOString() }
  ]);
  const [b2bNegotiations, setB2bNegotiations] = useState<B2BNegotiation[]>([
    {
      orderId: 'ORD-001',
      brandId: 'org-brand-001',
      retailerId: 'org-shop-001',
      status: 'pending_brand',
      lastUpdate: new Date().toISOString(),
      messages: [{ id: 'm1', sender: { id: 'shop-001', name: 'Olga', role: 'shop' }, text: 'Inquiry for Syntha Lab', timestamp: new Date().toISOString(), type: 'message' }]
    },
    {
      orderId: 'ORD-002',
      brandId: 'org-brand-002',
      retailerId: 'org-shop-001',
      status: 'confirmed',
      lastUpdate: new Date().toISOString(),
      messages: [{ id: 'm2', sender: { id: 'shop-001', name: 'Olga', role: 'shop' }, text: 'Confirmed Nordic Order', timestamp: new Date().toISOString(), type: 'message' }]
    },
    {
      orderId: 'ORD-003',
      brandId: 'org-brand-003',
      retailerId: 'org-shop-001',
      status: 'production',
      lastUpdate: new Date().toISOString(),
      messages: [{ id: 'm3', sender: { id: 'shop-001', name: 'Olga', role: 'shop' }, text: 'Silk Road Production started', timestamp: new Date().toISOString(), type: 'message' }]
    }
  ]);
  const [assortmentPlan, setAssortmentPlan] = useState<Product[]>([]);
  const [wholesaleCollections, setWholesaleCollections] = useState<WholesaleCollection[]>([
    {
      id: 'coll-1',
      brandId: 'org-brand-001',
      title: 'NEURAL NOMAD FW26',
      season: 'FW26',
      year: '2026',
      status: 'active',
      description: 'Syntha Lab advanced urban tech.',
      lookbookUrls: ['https://images.unsplash.com/photo-1539109136881-3be0616acf4b?q=80&w=800'],
      documents: [],
      products: [],
      drops: [{ id: 'd1', name: 'Drop 1', deliveryDate: 'Aug 2026' }],
      pricingTiers: []
    },
    {
      id: 'coll-2',
      brandId: 'org-brand-002',
      title: 'NORDIC PEAK SS26',
      season: 'SS26',
      year: '2026',
      status: 'active',
      description: 'Nordic Wool mountain heritage.',
      lookbookUrls: ['https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=800'],
      documents: [],
      products: [],
      drops: [{ id: 'd2', name: 'Drop 1', deliveryDate: 'Mar 2026' }],
      pricingTiers: []
    },
    {
      id: 'coll-3',
      brandId: 'org-brand-003',
      title: 'SILK ROAD VOYAGE',
      season: 'CORE',
      year: '2026',
      status: 'active',
      description: 'Silk Road Atelier artisan luxury.',
      lookbookUrls: ['https://images.unsplash.com/photo-1589156280159-27698a70f29e?q=80&w=800'],
      documents: [],
      products: [],
      drops: [{ id: 'd3', name: 'Drop 1', deliveryDate: 'Immediate' }],
      pricingTiers: []
    }
  ]);
  const [customLinesheets, setCustomLinesheets] = useState<CustomLinesheet[]>([
    { id: 'cls1', brandId: 'org-brand-001', retailerId: 'org-shop-001', title: 'Exclusive FW26 Selection', products: ['1', '3', '5'], customPrices: {}, status: 'sent', viewCount: 12, createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString() },
    { id: 'cls2', brandId: 'org-brand-002', retailerId: 'org-shop-001', title: 'Peak Wholesale SS26', products: ['2', '4'], customPrices: {}, status: 'sent', viewCount: 8, createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString() },
    { id: 'cls3', brandId: 'org-brand-003', retailerId: 'org-shop-001', title: 'Premium Capsule', products: ['6', '7'], customPrices: {}, status: 'draft', viewCount: 0, createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString() },
  ]);
  const [inventoryATS, setInventoryATS] = useState<InventoryItem[]>([
    {
      sku: 'CTP-26-001',
      productId: '1',
      productName: 'Cyber Tech Parka',
      warehouse: 'Moscow',
      available: 450,
      reserved: 120,
      incoming: [{ date: '2026-03-15', quantity: 200 }],
    },
    {
      sku: 'NCP-26-042',
      productId: '2',
      productName: 'Neural Cargo Pants',
      warehouse: 'Dubai',
      available: 800,
      reserved: 300,
      incoming: [{ date: '2026-04-10', quantity: 500 }],
    },
    {
      sku: 'NWL-26-015',
      productId: '3',
      productName: 'Nordic Wool Sweater',
      warehouse: 'Milan',
      available: 45,
      reserved: 10,
      incoming: [{ date: '2026-03-20', quantity: 150 }],
    },
    {
      sku: 'SLK-26-088',
      productId: '4',
      productName: 'Silk Road Scarf',
      warehouse: 'Dubai',
      available: 20,
      reserved: 5,
      incoming: [{ date: '2026-04-01', quantity: 80 }],
    },
    {
      sku: 'RDC-26-099',
      productId: '5',
      productName: 'Radical Chic Blazer',
      warehouse: 'Milan',
      available: 12,
      reserved: 8,
      incoming: [{ date: '2026-03-25', quantity: 100 }],
    },
  ]);

  const filteredInventory = useMemo(() => {
    if (isAdmin || isRetailer) return inventoryATS;
    if (isBrand) {
      // Filter inventory by brand matching product's brand
      return inventoryATS.filter(item => {
        const prod = allProductsData.find(p => p.id === item.productId);
        return prod?.brand === user?.partnerName;
      });
    }
    return [];
  }, [inventoryATS, allProductsData, user, isAdmin, isRetailer, isBrand]);

  const [b2bEscrowTransactions, setB2bEscrowTransactions] = useState<EscrowTransaction[]>([]);
  const [retailerLoyalty, setRetailerLoyalty] = useState<Record<string, number>>({
    'retailer-001': 3200,
    'org-shop-001': 4500,
    'user-1': 1800
  });
  const [marketingBanners, setMarketingBanners] = useState<B2BBanner[]>([
    {
      id: 'b1',
      brandId: 'org-brand-001',
      imageUrl: 'https://images.unsplash.com/photo-1539109132304-372874a581ad?q=80&w=2000',
      targetUrl: '/shop/b2b/partners/discover',
      placement: 'dashboard',
      stats: { views: 1200, clicks: 45 },
    },
    {
      id: 'b2',
      brandId: 'org-brand-002',
      imageUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=2000',
      targetUrl: '/shop/b2b/partners/discover?brand=nordic-wool',
      placement: 'dashboard',
      stats: { views: 800, clicks: 32 },
    },
    {
      id: 'b3',
      brandId: 'org-brand-003',
      imageUrl: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=2000',
      targetUrl: '/shop/b2b/partners/discover',
      placement: 'dashboard',
      stats: { views: 2400, clicks: 120 },
    },
  ]);
  const [b2bTasks, setB2bTasks] = useState<B2BTask[]>([
    { id: 't1', title: 'Review FW26 Pre-orders', description: 'Check quantities for Premium Store', status: 'in_progress', priority: 'high', assigneeId: 'org-brand-001', dueDate: new Date().toISOString().split('T')[0], createdAt: new Date().toISOString() },
    { id: 't2', title: 'Upload Quality Certs', description: 'Need for CTP-26 series', status: 'todo', priority: 'medium', assigneeId: 'org-brand-001', dueDate: new Date().toISOString().split('T')[0], createdAt: new Date().toISOString() },
    { id: 't3', title: 'Nordic Peak Logistics', description: 'Coordinate shipment to Tokyo', status: 'todo', priority: 'high', assigneeId: 'org-brand-002', dueDate: new Date().toISOString().split('T')[0], createdAt: new Date().toISOString() },
    { id: 't4', title: 'Подписать договор SS26', description: 'Radical Chic контракт ожидает подтверждения', status: 'todo', priority: 'high', assigneeId: 'org-shop-001', dueDate: new Date().toISOString().split('T')[0], createdAt: new Date().toISOString() },
    { id: 't5', title: 'Проверить лайншит Syntha', description: 'Новая коллекция FW26 требует ревью', status: 'todo', priority: 'medium', assigneeId: 'org-shop-001', dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0], createdAt: new Date().toISOString() },
    { id: 't6', title: 'Обновить прайс-лист', description: 'Актуализировать цены для осеннего сезона', status: 'done', priority: 'low', assigneeId: 'org-brand-001', dueDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], createdAt: new Date().toISOString() },
  ]);
  const [b2bDocuments, setB2bDocuments] = useState<B2BDocument[]>([
    { id: 'doc-1', title: 'FW26_Price_List.pdf', type: 'lookbook', url: '#', size: '2.4 MB', uploadedBy: 'Admin', status: 'draft', uploadedAt: new Date().toISOString(), partnerId: 'org-brand-001' },
    { id: 'doc-2', title: 'Nordic_Quality_Manual.pdf', type: 'spec', url: '#', size: '1.2 MB', uploadedBy: 'Admin', status: 'final', uploadedAt: new Date().toISOString(), partnerId: 'org-brand-002' },
    { id: 'doc-3', title: 'Radical_Chic_Contract_SS26.pdf', type: 'contract', url: '#', size: '890 KB', uploadedBy: 'Brand Manager', status: 'draft', uploadedAt: new Date().toISOString(), partnerId: 'org-brand-003' },
    { id: 'doc-4', title: 'Syntha_Lab_Spec_Sheet.pdf', type: 'spec', url: '#', size: '3.1 MB', uploadedBy: 'Admin', status: 'draft', uploadedAt: new Date().toISOString(), partnerId: 'org-brand-001' },
  ]);
  const [b2bEvents, setB2bEvents] = useState<B2BCalendarEvent[]>([
    { id: 'e1', title: 'FW26 Pre-order Deadline', start: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(), end: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(), type: 'deadline', description: 'Последний день для размещения заказов на осеннюю коллекцию', partnerId: 'org-brand-001' },
    { id: 'e2', title: 'Milan Showroom Session', start: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString(), end: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString(), type: 'showroom', description: 'Main collection presentation в Милане', partnerId: 'org-brand-001' },
    { id: 'e3', title: 'Nordic Peak Launch Event', start: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000).toISOString(), end: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000).toISOString(), type: 'showroom', description: 'Heritage collection launch в Oslo', partnerId: 'org-brand-002' },
    { id: 'e4', title: 'Payment Due: ORD-8790', start: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(), end: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(), type: 'deadline', description: 'Оплата заказа Syntha Lab SS26', partnerId: 'org-brand-001' },
    { id: 'e5', title: 'Virtual Showroom: Radical Chic', start: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(), end: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(), type: 'meeting', description: 'Онлайн презентация новой коллекции Radical Chic', partnerId: 'org-brand-003' },
  ]);
  const [b2bMessages, setB2bMessages] = useState<B2BMessage[]>([]);
  const [productVotes, setProductVotes] = useState<Record<string, { likes: string[], dislikes: string[] }>>({
    '1': { likes: ['user-1', 'user-2'], dislikes: [] },
    '2': { likes: ['user-1'], dislikes: ['user-3'] }
  });
  const [marketingAssets, setMarketingAssets] = useState<BrandAsset[]>([
    { id: 'a1', brandId: 'syntha-lab', title: 'Cyber Parka Promo', type: 'video', url: '#', thumbnail: 'https://images.unsplash.com/photo-1539109132304-372874a581ad?q=80&w=400', tags: ['Reels', 'FW26'] },
    { id: 'a2', brandId: 'syntha-lab', title: 'Studio Look 01', type: 'image', url: '#', thumbnail: 'https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?q=80&w=400', tags: ['Campaign', 'Web'] }
  ]);
  const [b2bLookbooks, setB2bLookbooks] = useState<B2BLookbook[]>([
    {
      id: 'lb-1',
      brandId: 'org-brand-001',
      title: 'Neural Nomad FW26',
      season: 'FW26',
      coverUrl: 'https://images.unsplash.com/photo-1539109132304-372874a581ad?q=80&w=800',
      status: 'published',
      createdAt: new Date().toISOString(),
      pages: [
        {
          id: 'p1',
          imageUrl: 'https://images.unsplash.com/photo-1539109132304-372874a581ad?q=80&w=1200',
          hotspots: [
            { id: 'h1', productId: '1', x: 45, y: 30 }
          ],
          type: 'panorama'
        }
      ]
    },
    {
      id: 'lb-2',
      brandId: 'org-brand-002',
      title: 'Nordic Peak SS26',
      season: 'SS26',
      coverUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=800',
      status: 'published',
      createdAt: new Date().toISOString(),
      pages: []
    }
  ]);

  const [wholesaleLeads, setWholesaleLeads] = useState<WholesaleLead[]>([
    { id: 'lead-1', name: 'Tokyo Avant-Garde', location: 'Tokyo, JP', score: 92, status: 'qualified', source: 'Web Inquiry', estimatedVolume: 500000, tags: ['High-End', 'Concept Store'], lastActivity: new Date().toISOString() },
    { id: 'lead-2', name: 'Berlin Tech-Wear', location: 'Berlin, DE', score: 85, status: 'negotiation', source: 'Trade Show', estimatedVolume: 300000, tags: ['Technical', 'Youth'], lastActivity: new Date().toISOString() }
  ]);

  const [orderClaims, setOrderClaims] = useState<OrderClaim[]>([
    { id: 'cl-1', orderId: 'ORD-001', retailerId: 'org-shop-001', type: 'damage', description: '2 units of Cyber Tech Parka arrived with torn sleeves', status: 'investigating', photos: ['#'], createdAt: new Date().toISOString() },
    { id: 'cl-2', orderId: 'ORD-002', retailerId: 'org-shop-001', type: 'wrong_item', description: 'Incorrect size run delivered', status: 'pending', photos: ['#'], createdAt: new Date().toISOString() }
  ]);

  // Real-time Subscriptions from Firestore
  useEffect(() => {
    if (!activeOrgId) return;

    // Подписка на логи
    const unsubscribeActivities = B2BRepository.subscribeToActivities(activeOrgId, (logs) => {
      if (logs.length > 0) setB2bActivityLogs(prev => [...logs, ...prev].slice(0, 100));
    });

    // Подписка на переговоры
    const unsubscribeNegotiations = B2BRepository.subscribeToNegotiations(activeOrgId, !!isBrand, (data) => {
      setB2bNegotiations(data);
    });

    return () => {
      unsubscribeActivities();
      unsubscribeNegotiations();
    };
  }, [activeOrgId, isBrand]);

  // Derived filtered state for multi-tenant isolation
  const filteredNegotiations = useMemo(() => {
    if (isAdmin) return b2bNegotiations;
    if (isBrand) return b2bNegotiations.filter(n => n.brandId === activeOrgId);
    if (isRetailer) return b2bNegotiations.filter(n => n.retailerId === activeOrgId);
    return [];
  }, [b2bNegotiations, activeOrgId, isBrand, isRetailer, isAdmin]);

  const filteredCollections = useMemo(() => {
    if (isAdmin || isRetailer) return wholesaleCollections;
    if (isBrand) return wholesaleCollections.filter(c => c.brandId === activeOrgId);
    return [];
  }, [wholesaleCollections, activeOrgId, isBrand, isRetailer, isAdmin]);

  const filteredActivityLogs = useMemo(() => {
    if (isAdmin) return b2bActivityLogs;
    if (isBrand || isRetailer) {
      return b2bActivityLogs.filter(log => 
        log.actor.id === activeOrgId || 
        log.target.id === activeOrgId ||
        (log.target.type === 'product' && allProductsData.find(p => p.id === log.target.id)?.brand === user?.partnerName)
      );
    }
    return [];
  }, [b2bActivityLogs, activeOrgId, isBrand, isRetailer, isAdmin, user, allProductsData]);

  const filteredConnections = useMemo(() => {
    if (isAdmin) return b2bConnections;
    if (isBrand) return b2bConnections.filter(c => c.brandId === activeOrgId);
    if (isRetailer) return b2bConnections.filter(c => c.retailerId === activeOrgId);
    return [];
  }, [b2bConnections, activeOrgId, isBrand, isRetailer, isAdmin]);

  const filteredLinesheetRequests = useMemo(() => {
    if (isAdmin) return linesheetRequests;
    if (isBrand) return linesheetRequests.filter(r => r.brandId === activeOrgId);
    if (isRetailer) return linesheetRequests.filter(r => r.retailerId === activeOrgId);
    return [];
  }, [linesheetRequests, activeOrgId, isBrand, isRetailer, isAdmin]);

  const filteredCustomLinesheets = useMemo(() => {
    if (isAdmin) return customLinesheets;
    if (isBrand) return customLinesheets.filter(l => l.brandId === activeOrgId);
    if (isRetailer) return customLinesheets.filter(l => l.retailerId === activeOrgId);
    return [];
  }, [customLinesheets, activeOrgId, isBrand, isRetailer, isAdmin]);

  const filteredClaims = useMemo(() => {
    if (isAdmin) return orderClaims;
    if (isBrand) return orderClaims.filter(c => b2bNegotiations.find(n => n.orderId === c.orderId)?.brandId === activeOrgId);
    if (isRetailer) return orderClaims.filter(c => c.retailerId === activeOrgId);
    return [];
  }, [orderClaims, b2bNegotiations, activeOrgId, isBrand, isRetailer, isAdmin]);

  const filteredLookbooks = useMemo(() => {
    if (isAdmin || isRetailer) return b2bLookbooks;
    if (isBrand) return b2bLookbooks.filter(lb => lb.brandId === activeOrgId);
    return [];
  }, [b2bLookbooks, activeOrgId, isBrand, isRetailer, isAdmin]);

  const filteredProducts = useMemo(() => {
    if (isAdmin || isRetailer) return allProductsData;
    if (isBrand) return (allProductsData as Product[]).filter(p => p.brand === user?.partnerName);
    return [];
  }, [allProductsData, user, isAdmin, isRetailer, isBrand]);

  const [whiteLabelConfigs, setWhiteLabelConfigs] = useState<Record<string, WhiteLabelConfig>>({
    'brand-1': {
      brandId: 'brand-1',
      primaryColor: '#000000',
      secondaryColor: '#ffffff',
      logoUrl: '/logo.png',
      bannerUrl: 'https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?q=80&w=1200'
    }
  });

  const filteredTasks = useMemo(() => {
    if (isAdmin) return b2bTasks;
    if (isBrand || isRetailer) return b2bTasks.filter(t => t.assigneeId === activeOrgId);
    return [];
  }, [b2bTasks, activeOrgId, isBrand, isRetailer, isAdmin]);

  const filteredBanners = useMemo(() => {
    if (isAdmin || isRetailer) return marketingBanners;
    if (isBrand) return marketingBanners.filter(b => b.brandId === activeOrgId);
    return [];
  }, [marketingBanners, activeOrgId, isBrand, isRetailer, isAdmin]);

  const filteredDocuments = useMemo(() => {
    if (isAdmin) return b2bDocuments;
    if (isBrand || isRetailer) return b2bDocuments.filter(d => d.partnerId === activeOrgId || d.uploadedBy === activeOrgId);
    return [];
  }, [b2bDocuments, activeOrgId, isBrand, isRetailer, isAdmin]);

  const filteredEvents = useMemo(() => {
    if (isAdmin) return b2bEvents;
    if (isBrand || isRetailer) return b2bEvents.filter(e => e.partnerId === activeOrgId);
    return [];
  }, [b2bEvents, activeOrgId, isBrand, isRetailer, isAdmin]);

  const addB2bLookbook = (lookbook: B2BLookbook) => {
    setB2bLookbooks(prev => [lookbook, ...prev]);
  };

  const addWholesaleLead = (lead: Omit<WholesaleLead, 'id' | 'lastActivity'>) => {
    setWholesaleLeads(prev => [{ ...lead, id: `lead-${Date.now()}`, lastActivity: new Date().toISOString() }, ...prev]);
  };

  const updateWholesaleLead = (id: string, patch: Partial<WholesaleLead>) => {
    setWholesaleLeads(prev => prev.map(l => l.id === id ? { ...l, ...patch } : l));
  };

  const addOrderClaim = (claim: Omit<OrderClaim, 'id' | 'createdAt'>) => {
    setOrderClaims(prev => [{ ...claim, id: `cl-${Date.now()}`, createdAt: new Date().toISOString() }, ...prev]);
  };

  const updateOrderClaim = (id: string, patch: Partial<OrderClaim>) => {
    setOrderClaims(prev => prev.map(c => c.id === id ? { ...c, ...patch } : c));
  };

  const updateWhiteLabelConfig = (brandId: string, config: Partial<WhiteLabelConfig>) => {
    setWhiteLabelConfigs(prev => ({
      ...prev,
      [brandId]: prev[brandId] ? { ...prev[brandId], ...config } : { brandId, ...config } as WhiteLabelConfig
    }));
  };

  const [b2bCart, setB2bCart] = useState<CartItem[]>([]);
  const [b2cListings, setB2cListings] = useState<B2CProductListing[]>([]);
  const [stockSyncRequests, setStockSyncRequests] = useState<RetailerStockSync[]>([]);
  const [stockSyncAgreements, setStockSyncAgreements] = useState<StockSyncAgreement[]>([]);
  const [storeLocations, setStoreLocations] = useState<StoreLocation[]>([]);
  const [b2cOrders, setB2cOrders] = useState<B2COrder[]>([]);

  const addB2bOrderItem = (product: Product, size: string, quantity: number, deliveryDate: string = "Immediate") => {
    setB2bCart(prevCart => {
      const existingItemIndex = prevCart.findIndex(item => item.id === product.id && item.selectedSize === size && item.deliveryDate === deliveryDate);
      if (existingItemIndex > -1) {
        const newCart = [...prevCart];
        newCart[existingItemIndex].quantity += quantity;
        return newCart;
      }
      return [...prevCart, { ...product, quantity, selectedSize: size, deliveryDate }];
    });
  };

  const removeB2bOrderItem = (productId: string, size: string, deliveryDate?: string) => {
    setB2bCart(prev => prev.filter(item => !(item.id === productId && item.selectedSize === size && (!deliveryDate || item.deliveryDate === deliveryDate))));
  };

  const updateB2bOrderItemQuantity = (productId: string, quantity: number, size: string, deliveryDate: string = "Immediate") => {
    const productInfo = allProductsData.find((p: Product) => p.id === productId);
    if (!productInfo) return;
    setB2bCart(prevCart => {
        const newCart = [...prevCart];
        const itemIndex = newCart.findIndex(item => item.id === productId && item.selectedSize === size && item.deliveryDate === deliveryDate);
        if (quantity > 0) {
            if (itemIndex > -1) newCart[itemIndex].quantity = quantity;
            else newCart.push({ ...productInfo, quantity, selectedSize: size, deliveryDate });
        } else if (itemIndex > -1) newCart.splice(itemIndex, 1);
        return newCart;
    });
  };
  const [retailerProfiles, setRetailerProfiles] = useState<Record<string, RetailerProfile>>({
    'ret-1': {
      id: 'ret-1',
      name: 'Premium Store Moscow',
      creditLimit: 5000000,
      availableCredit: 4200000,
      netTerms: 'Net 30',
      otbBudget: { total: 10000000, spent: 5800000, season: 'FW26' },
      tier: 'Gold'
    },
    'ret-2': {
      id: 'ret-2',
      name: 'Milan Concept Store',
      creditLimit: 2000000,
      availableCredit: 1500000,
      netTerms: 'Net 60',
      otbBudget: { total: 5000000, spent: 3500000, season: 'FW26' },
      tier: 'Silver'
    }
  });

  const addB2bActivityLog = (log: Omit<B2BActivityLog, 'id' | 'timestamp'>) => {
    const newLog: B2BActivityLog = {
      ...log,
      id: `log-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString(),
    };
    // Пишем в Firestore
    B2BRepository.logActivity(log).catch(console.error);
    // Локальное состояние обновится через подписку или мгновенно для UX
    setB2bActivityLogs(prev => [newLog, ...prev].slice(0, 100));
  };

  const toggleB2bConnection = (brandId: string, retailerId: string) => {
    setB2bConnections(prev => {
      const exists = prev.find(c => c.brandId === brandId && c.retailerId === retailerId);
      if (exists) {
        return prev.filter(c => !(c.brandId === brandId && c.retailerId === retailerId));
      }
      return [...prev, { brandId, retailerId, status: 'active', since: new Date().toISOString() }];
    });
  };

  const requestLinesheet = (brandId: string, retailerId: string) => {
    const newRequest: LinesheetRequest = {
      id: `ls-${Date.now()}`,
      brandId,
      retailerId,
      status: 'pending',
      timestamp: new Date().toISOString(),
    };
    setLinesheetRequests(prev => [newRequest, ...prev]);
    addB2bActivityLog({
      type: 'linesheet_request',
      actor: { id: retailerId, name: 'Retailer Store', type: 'retailer' },
      target: { id: brandId, name: 'Brand Name', type: 'brand' },
      details: 'Requesting wholesale catalog'
    });
  };

  const addNegotiationMessage = (orderId: string, message: Omit<NegotiationMessage, 'id' | 'timestamp'>) => {
    setB2bNegotiations(prev => {
      const existing = prev.find(n => n.orderId === orderId);
      const newMessage: NegotiationMessage = {
        ...message,
        id: `msg-${Date.now()}`,
        timestamp: new Date().toISOString(),
      };

      if (existing) {
        return prev.map(n => n.orderId === orderId ? {
          ...n,
          messages: [...n.messages, newMessage],
          lastUpdate: new Date().toISOString()
        } : n);
      }

      return [...prev, {
        orderId,
        brandId: 'brand-1',
        retailerId: 'retailer-1',
        status: 'draft',
        messages: [newMessage],
        lastUpdate: new Date().toISOString()
      }];
    });
  };

  const updateOrderWholesaleStatus = (orderId: string, status: B2BOrderWholesaleStatus) => {
    setB2bNegotiations(prev => prev.map(n => n.orderId === orderId ? {
      ...n,
      status,
      lastUpdate: new Date().toISOString()
    } : n));
    
    addB2bActivityLog({
      type: 'order_placed',
      actor: { id: 'system', name: 'Workflow Engine', type: 'retailer' },
      target: { id: orderId, name: `Order ${orderId}`, type: 'brand' },
      details: `Order status updated to ${status.replace('_', ' ')}.`
    });
  };

  const addToAssortmentPlan = (product: Product) => {
    setAssortmentPlan(prev => {
      if (prev.some(p => p.id === product.id)) return prev;
      return [...prev, product];
    });
    addB2bActivityLog({
      type: 'view_product',
      actor: { id: 'retailer-1', name: 'Premium Store', type: 'retailer' },
      target: { id: product.id, name: product.name, type: 'product' },
      details: `Added ${product.name} to visual assortment planner.`
    });
  };

  const removeFromAssortmentPlan = (productId: string) => {
    setAssortmentPlan(prev => prev.filter(p => p.id !== productId));
  };

  const clearAssortmentPlan = () => {
    setAssortmentPlan([]);
  };

  const addWholesaleCollection = (collection: WholesaleCollection) => {
    setWholesaleCollections(prev => [...prev, collection]);
  };

  const updateWholesaleCollection = (id: string, patch: Partial<WholesaleCollection>) => {
    setWholesaleCollections(prev => prev.map(c => c.id === id ? { ...c, ...patch } : c));
  };

  const addLinesheet = (linesheet: CustomLinesheet) => {
    setCustomLinesheets(prev => [...prev, linesheet]);
    addB2bActivityLog({
      type: 'negotiation_update',
      actor: { id: linesheet.brandId, name: 'Brand', type: 'brand' },
      target: { id: linesheet.id, name: linesheet.title, type: 'linesheet' },
      details: `Created custom linesheet for retailer ${linesheet.retailerId}`
    });
  };

  const reserveStock = (sku: string, quantity: number, retailerId: string) => {
    setInventoryATS(prev => prev.map(item => 
      item.sku === sku ? { ...item, available: item.available - quantity, reserved: item.reserved + quantity } : item
    ));
    addB2bActivityLog({
      type: 'order_status_change',
      actor: { id: retailerId, name: 'Retailer', type: 'retailer' },
      target: { id: sku, name: sku, type: 'product' },
      details: `Reserved ${quantity} units of ${sku}`
    });
  };

  const addEscrowTransaction = (tx: EscrowTransaction) => {
    setB2bEscrowTransactions(prev => [...prev, tx]);
  };

  const updateLoyaltyPoints = (retailerId: string, amount: number) => {
    setRetailerLoyalty(prev => ({ ...prev, [retailerId]: (prev[retailerId] || 0) + amount }));
  };

  const addMarketingBanner = (banner: B2BBanner) => {
    setMarketingBanners(prev => [...prev, banner]);
  };

  const updateRetailerProfile = (id: string, patch: Partial<RetailerProfile>) => {
    setRetailerProfiles(prev => ({
      ...prev,
      [id]: prev[id] ? { ...prev[id], ...patch } : { id, ...patch } as RetailerProfile
    }));
  };

  const addB2bTask = (task: Omit<B2BTask, 'id' | 'createdAt'>) => {
    setB2bTasks(prev => [{ ...task, id: `task-${Date.now()}`, createdAt: new Date().toISOString() }, ...prev]);
  };

  const updateB2bTask = (id: string, patch: Partial<B2BTask>) => {
    setB2bTasks(prev => prev.map(t => t.id === id ? { ...t, ...patch } : t));
  };

  const uploadB2bDocument = (doc: Omit<B2BDocument, 'id' | 'uploadedAt'>) => {
    setB2bDocuments(prev => [{ ...doc, id: `doc-${Date.now()}`, uploadedAt: new Date().toISOString() }, ...prev]);
  };

  const addB2bEvent = (event: Omit<B2BCalendarEvent, 'id'>) => {
    setB2bEvents(prev => [{ ...event, id: `event-${Date.now()}` }, ...prev]);
  };

  const sendB2bMessage = (msg: Omit<B2BMessage, 'id' | 'timestamp'>) => {
    setB2bMessages(prev => [...prev, { ...msg, id: `msg-${Date.now()}`, timestamp: new Date().toISOString() }]);
  };

  const toggleProductVote = (productId: string, userId: string, type: 'like' | 'dislike') => {
    setProductVotes(prev => {
      const votes = prev[productId] || { likes: [], dislikes: [] };
      const oppositeType = type === 'like' ? 'dislikes' : 'likes';
      const currentType = type === 'like' ? 'likes' : 'dislikes';
      const isCurrent = (votes as any)[currentType].includes(userId);
      
      return {
        ...prev,
        [productId]: {
          [oppositeType]: (votes as any)[oppositeType].filter((id: string) => id !== userId),
          [currentType]: isCurrent ? (votes as any)[currentType].filter((id: string) => id !== userId) : [...(votes as any)[currentType], userId]
        }
      } as Record<string, { likes: string[], dislikes: string[] }>;
    });
  };

  const addMarketingAsset = (asset: BrandAsset) => {
    setMarketingAssets(prev => [asset, ...prev]);
  };

  const createB2CListing = (listing: Omit<B2CProductListing, 'id' | 'createdAt' | 'updatedAt'>) => {
    const now = new Date().toISOString();
    setB2cListings((prev) => [...prev, { ...listing, id: `b2c-${Date.now()}`, createdAt: now, updatedAt: now }]);
  };
  const updateB2CListing = (id: string, patch: Partial<B2CProductListing>) => {
    const now = new Date().toISOString();
    setB2cListings((prev) => prev.map((l) => (l.id === id ? { ...l, ...patch, updatedAt: now } : l)));
  };
  const scheduleB2CListing = (id: string, liveDate: string, archiveDate?: string) => {
    const now = new Date().toISOString();
    setB2cListings((prev) =>
      prev.map((l) =>
        l.id === id
          ? { ...l, scheduledLiveDate: liveDate, scheduledArchiveDate: archiveDate, visibility: 'scheduled', updatedAt: now }
          : l
      )
    );
  };

  const requestStockSync = (brandId: string, retailerId: string, productId: string, sku: string) => {
    const now = new Date().toISOString();
    setStockSyncRequests((prev) => [
      ...prev,
      {
        id: `sync-${Date.now()}`,
        brandId,
        retailerId,
        productId,
        sku,
        status: 'pending',
        syncEnabled: false,
        retailerStock: 0,
        syncFrequency: 'daily',
        requestedAt: now,
      },
    ]);
  };
  const approveStockSync = (id: string) => {
    setStockSyncRequests((prev) =>
      prev.map((s) => (s.id === id ? { ...s, status: 'approved' as const, approvedAt: new Date().toISOString() } : s))
    );
  };
  const rejectStockSync = (id: string, reason: string) => {
    setStockSyncRequests((prev) => prev.map((s) => (s.id === id ? { ...s, status: 'rejected' as const, notes: reason } : s)));
  };
  const updateRetailerStock = (syncId: string, quantity: number) => {
    setStockSyncRequests((prev) => prev.map((s) => (s.id === syncId ? { ...s, retailerStock: quantity } : s)));
  };

  const createSyncAgreement = (agreement: Omit<StockSyncAgreement, 'id' | 'createdAt' | 'updatedAt'>) => {
    const now = new Date().toISOString();
    setStockSyncAgreements((prev) => [...prev, { ...agreement, id: `agr-${Date.now()}`, createdAt: now, updatedAt: now }]);
  };
  const updateSyncAgreement = (id: string, patch: Partial<StockSyncAgreement>) => {
    const now = new Date().toISOString();
    setStockSyncAgreements((prev) => prev.map((a) => (a.id === id ? { ...a, ...patch, updatedAt: now } : a)));
  };

  const getUnifiedStock = useCallback((productId: string): UnifiedStockView | null => {
    const rows = inventoryATS.filter((i) => i.productId === productId);
    if (!rows.length) return null;
    const first = rows[0];
    return {
      productId,
      sku: first.sku,
      brandId: 'mock',
      totalAvailable: rows.reduce((s, i) => s + i.available, 0),
      sources: rows.map((i) => ({
        type: 'brand_warehouse' as const,
        locationId: i.warehouse,
        locationName: i.warehouse,
        available: i.available,
        reserved: i.reserved,
      })),
      reservations: [],
    };
  }, [inventoryATS]);

  const addStoreLocation = (location: Omit<StoreLocation, 'id'>) => {
    setStoreLocations((prev) => [...prev, { ...location, id: `loc-${Date.now()}` }]);
  };
  const updateStoreLocation = (id: string, patch: Partial<StoreLocation>) => {
    setStoreLocations((prev) => prev.map((l) => (l.id === id ? { ...l, ...patch } : l)));
  };

  const createB2COrder = (order: Omit<B2COrder, 'id' | 'createdAt' | 'updatedAt'>) => {
    const now = new Date().toISOString();
    setB2cOrders((prev) => [...prev, { ...order, id: `b2co-${Date.now()}`, createdAt: now, updatedAt: now }]);
  };
  const updateB2COrderStatus = (id: string, status: B2COrder['status']) => {
    const now = new Date().toISOString();
    setB2cOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status, updatedAt: now } : o)));
  };

  const permissions = useMemo((): RolePermissions | null => {
    const orgId = activeOrgId ?? '';
    const b2cBase = {
      canViewAllProducts: false,
      canManageOwnProducts: false,
      canViewOtherBrandsProducts: false,
      canCreateB2CListing: false,
      canScheduleB2CListing: false,
      canEditB2CPrice: false,
      canViewUnifiedStock: false,
      canApproveStockSync: false,
      canViewB2COrders: false,
      canFulfillB2COrders: false,
    };
    const b2bBase = {
      canViewAllWholesale: false,
      canManageOwnWholesale: false,
      canCreateB2BOrder: false,
      canNegotiateTerms: false,
      canRequestStockSync: false,
      canViewBrandStock: false,
      canShareRetailStock: false,
    };
    if (isAdmin) {
      return {
        roleType: 'admin',
        organizationId: orgId,
        b2c: {
          ...b2cBase,
          canViewAllProducts: true,
          canManageOwnProducts: true,
          canViewOtherBrandsProducts: true,
          canCreateB2CListing: true,
          canScheduleB2CListing: true,
          canEditB2CPrice: true,
          canViewUnifiedStock: true,
          canApproveStockSync: true,
          canViewB2COrders: true,
          canFulfillB2COrders: true,
        },
        b2b: {
          ...b2bBase,
          canViewAllWholesale: true,
          canManageOwnWholesale: true,
          canCreateB2BOrder: true,
          canNegotiateTerms: true,
          canRequestStockSync: true,
          canViewBrandStock: true,
          canShareRetailStock: true,
        },
      };
    }
    if (isBrand) {
      return {
        roleType: 'brand',
        organizationId: orgId,
        b2c: {
          ...b2cBase,
          canManageOwnProducts: true,
          canCreateB2CListing: true,
          canScheduleB2CListing: true,
          canEditB2CPrice: true,
          canViewUnifiedStock: true,
          canApproveStockSync: true,
          canViewB2COrders: true,
          canFulfillB2COrders: true,
        },
        b2b: {
          ...b2bBase,
          canManageOwnWholesale: true,
          canCreateB2BOrder: true,
          canNegotiateTerms: true,
          canViewBrandStock: true,
        },
      };
    }
    if (isRetailer) {
      return {
        roleType: 'shop',
        organizationId: orgId,
        b2c: {
          ...b2cBase,
          canViewAllProducts: true,
          canViewUnifiedStock: true,
          canViewB2COrders: true,
          canFulfillB2COrders: true,
        },
        b2b: {
          ...b2bBase,
          canViewAllWholesale: true,
          canCreateB2BOrder: true,
          canNegotiateTerms: true,
          canRequestStockSync: true,
          canShareRetailStock: true,
        },
      };
    }
    return {
      roleType: 'client',
      organizationId: orgId,
      b2c: { ...b2cBase, canViewAllProducts: true },
      b2b: b2bBase,
    };
  }, [activeOrgId, isAdmin, isBrand, isRetailer]);

  const value = useMemo(() => ({
    b2bActivityLogs: filteredActivityLogs,
    addB2bActivityLog,
    b2bConnections: filteredConnections,
    toggleB2bConnection,
    linesheetRequests: filteredLinesheetRequests,
    requestLinesheet,
    b2bNegotiations: filteredNegotiations,
    addNegotiationMessage,
    updateOrderWholesaleStatus,
    assortmentPlan,
    addToAssortmentPlan,
    removeFromAssortmentPlan,
    clearAssortmentPlan,
    wholesaleCollections: filteredCollections,
    addWholesaleCollection,
    updateWholesaleCollection,
    customLinesheets: filteredCustomLinesheets,
    addLinesheet,
    inventoryATS: filteredInventory,
    reserveStock,
    b2bEscrowTransactions,
    addEscrowTransaction,
    retailerLoyalty,
    updateLoyaltyPoints,
    marketingBanners: filteredBanners,
    addMarketingBanner,
    retailerProfiles,
    updateRetailerProfile,
    b2bTasks: filteredTasks,
    addB2bTask,
    updateB2bTask,
    b2bDocuments: filteredDocuments,
    uploadB2bDocument,
    b2bEvents: filteredEvents,
    addB2bEvent,
    b2bMessages,
    sendB2bMessage,
    productVotes,
    toggleProductVote,
    marketingAssets,
    addMarketingAsset,
    b2bLookbooks: filteredLookbooks,
    addB2bLookbook,
    b2bProducts: filteredProducts,
    wholesaleLeads,
    addWholesaleLead,
    updateWholesaleLead,
    orderClaims: filteredClaims,
    addOrderClaim,
    updateOrderClaim,
    whiteLabelConfigs,
    updateWhiteLabelConfig,
    b2bCart,
    setB2bCart,
    addB2bOrderItem,
    updateB2bOrderItemQuantity,
    removeB2bOrderItem,
    b2cListings,
    createB2CListing,
    updateB2CListing,
    scheduleB2CListing,
    stockSyncRequests,
    requestStockSync,
    approveStockSync,
    rejectStockSync,
    updateRetailerStock,
    stockSyncAgreements,
    createSyncAgreement,
    updateSyncAgreement,
    getUnifiedStock,
    storeLocations,
    addStoreLocation,
    updateStoreLocation,
    b2cOrders,
    createB2COrder,
    updateB2COrderStatus,
    permissions,
  }), [
    filteredActivityLogs, filteredConnections, filteredLinesheetRequests, filteredNegotiations,
    assortmentPlan, filteredCollections, filteredCustomLinesheets, inventoryATS,
    b2bEscrowTransactions, retailerLoyalty, marketingBanners, retailerProfiles,
    b2bTasks, b2bDocuments, b2bEvents, b2bMessages, productVotes, marketingAssets,
    filteredLookbooks, filteredProducts, b2bCart, wholesaleLeads, filteredClaims, whiteLabelConfigs,
    filteredTasks, filteredBanners, filteredDocuments, filteredEvents, filteredInventory,
    b2cListings, stockSyncRequests, stockSyncAgreements, storeLocations, b2cOrders, permissions, getUnifiedStock,
  ]);

  return <B2BStateContext.Provider value={value}>{children}</B2BStateContext.Provider>;
}

export const useB2BState = () => {
  const context = useContext(B2BStateContext);
  if (context === undefined) {
    throw new Error('useB2BState must be used within a B2BStateProvider');
  }
  return context;
};

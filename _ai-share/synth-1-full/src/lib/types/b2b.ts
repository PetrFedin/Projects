import { UserRole, Product } from '../types';

export interface BrandAsset {
  id: string;
  brandId: string;
  title: string;
  type: 'video' | 'image' | 'story' | 'template';
  url: string;
  thumbnail: string;
  dimensions?: string;
  tags: string[];
}

export interface B2BLookbook {
  id: string;
  brandId: string;
  title: string;
  season: string;
  coverUrl: string;
  pages: LookbookPage[];
  status: 'draft' | 'published' | 'private';
  createdAt: string;
}

export interface LookbookPage {
  id: string;
  imageUrl: string;
  hotspots: Hotspot[];
  type?: 'standard' | 'panorama' | 'video';
}

export interface WholesaleLead {
  id: string;
  name: string;
  location: string;
  score: number;
  status: 'new' | 'qualified' | 'negotiation' | 'converted' | 'lost';
  source: string;
  estimatedVolume: number;
  tags: string[];
  lastActivity: string;
}

export interface OrderClaim {
  id: string;
  orderId: string;
  retailerId: string;
  type: 'damage' | 'missing' | 'wrong_item' | 'quality';
  description: string;
  status: 'pending' | 'investigating' | 'approved' | 'rejected';
  resolution?: 'credit_note' | 'replacement' | 'refund';
  photos: string[];
  createdAt: string;
}

export interface WhiteLabelConfig {
  brandId: string;
  primaryColor: string;
  secondaryColor: string;
  logoUrl: string;
  bannerUrl: string;
  customDomain?: string;
  featuredCollectionId?: string;
}

export interface Hotspot {
  id: string;
  productId: string;
  x: number; // percentage 0-100
  y: number; // percentage 0-100
}

export interface B2BTask {
  id: string;
  title: string;
  description: string;
  status: 'todo' | 'in_progress' | 'review' | 'done';
  priority: 'low' | 'medium' | 'high' | 'critical';
  assigneeId: string;
  relatedTo?: { type: 'order' | 'partner' | 'product'; id: string };
  dueDate: string;
  createdAt: string;
}

export interface B2BDocument {
  id: string;
  title: string;
  type: 'invoice' | 'contract' | 'spec' | 'lookbook' | 'other';
  url: string;
  size: string;
  uploadedBy: string;
  partnerId?: string;
  orderId?: string;
  status: 'draft' | 'final' | 'signed';
  uploadedAt: string;
}

export interface B2BCalendarEvent {
  id: string;
  title: string;
  start: string;
  end: string;
  type: 'showroom' | 'deadline' | 'delivery' | 'meeting';
  partnerId?: string;
  description: string;
}

export interface B2BMessage {
  id: string;
  senderId: string;
  receiverId: string;
  text: string;
  timestamp: string;
  read: boolean;
  attachments?: string[];
  relatedId?: string; // e.g. orderId
}

export interface RetailerProfile {
  id: string;
  name: string;
  creditLimit: number;
  availableCredit: number;
  netTerms: 'Due on Receipt' | 'Net 30' | 'Net 60' | 'Net 90';
  otbBudget: {
    total: number;
    spent: number;
    season: string;
  };
  tier: 'Standard' | 'Silver' | 'Gold' | 'VIP';
}

export interface EscrowTransaction {
  id: string;
  orderId: string;
  totalAmount: number;
  depositAmount: number;
  status: 'pending' | 'held' | 'released' | 'disputed';
  createdAt: string;
}

export interface B2BBanner {
  id: string;
  brandId: string;
  imageUrl: string;
  targetUrl: string;
  placement: 'dashboard' | 'showroom' | 'sidebar';
  stats: { views: number; clicks: number };
}

export interface CustomLinesheet {
  id: string;
  brandId: string;
  retailerId: string;
  title: string;
  products: string[]; // IDs
  customPrices: Record<string, number>;
  status: 'draft' | 'sent' | 'viewed' | 'accepted';
  viewCount: number;
  lastViewedAt?: string;
  createdAt: string;
}

export interface InventoryItem {
  sku: string;
  productId: string;
  productName: string;
  warehouse: 'Moscow' | 'Dubai' | 'Milan';
  available: number;
  reserved: number;
  incoming: { date: string; quantity: number }[];
}

export interface WholesaleCollection {
  id: string;
  brandId: string;
  title: string;
  season: string;
  year: string;
  status: 'draft' | 'active' | 'archived';
  description: string;
  lookbookUrls: string[];
  videoUrl?: string;
  documents: { title: string; url: string; type: 'cert' | 'tech' | 'price' }[];
  products: Product[];
  drops: { id: string; name: string; deliveryDate: string }[];
  pricingTiers: { id: string; name: string; discountPercent: number; moq: number }[];
}

export type B2BOrderWholesaleStatus =
  | 'draft'
  | 'pending_brand'
  | 'pending_retailer'
  | 'pending_admin'
  | 'confirmed'
  | 'production'
  | 'shipped';

export interface NegotiationMessage {
  id: string;
  sender: { id: string; name: string; role: UserRole };
  text: string;
  timestamp: string;
  type: 'message' | 'system' | 'adjustment';
}

export interface B2BNegotiation {
  orderId: string;
  brandId: string;
  retailerId: string;
  messages: NegotiationMessage[];
  status: B2BOrderWholesaleStatus;
  lastUpdate: string;
}

export interface B2BActivityLog {
  id: string;
  timestamp: string;
  type:
    | 'order_draft'
    | 'order_placed'
    | 'linesheet_request'
    | 'connection_request'
    | 'view_product'
    | 'negotiation_update'
    | 'order_status_change';
  actor: { id: string; name: string; type: 'brand' | 'retailer' | 'system' };
  target: { id: string; name: string; type: 'brand' | 'retailer' | 'product' | 'linesheet' };
  details?: string;
}

export interface B2BConnection {
  brandId: string;
  retailerId: string;
  status: 'pending' | 'active' | 'blocked';
  since: string;
}

export interface LinesheetRequest {
  id: string;
  brandId: string;
  retailerId: string;
  status: 'pending' | 'sent' | 'rejected';
  timestamp: string;
}

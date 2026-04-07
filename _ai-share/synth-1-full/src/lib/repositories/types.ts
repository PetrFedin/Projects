/**
 * Repository interfaces for data operations
 * These interfaces allow easy swapping between mock and Firebase implementations
 */

import type {
  UserProfile,
  Product,
  CartItem,
  WishlistItem,
  Order,
  WishlistCollection,
  SavedCartOutfit,
} from '../types';

// Auth Repository
export interface AuthRepository {
  signIn(email: string, password: string): Promise<UserProfile>;
  signUp(email: string, password: string, displayName: string): Promise<UserProfile>;
  signOut(): Promise<void>;
  getCurrentUser(): Promise<UserProfile | null>;
  updateCurrentUser(patch: Partial<UserProfile>): Promise<UserProfile>;
  onAuthStateChanged(callback: (user: UserProfile | null) => void): () => void;
}

// Products Repository
export interface ProductsRepository {
  getAll(): Promise<Product[]>;
  getById(id: string): Promise<Product | null>;
  getBySlug(slug: string): Promise<Product | null>;
  search(query: string): Promise<Product[]>;
  getByCategory(category: string): Promise<Product[]>;
  getByBrand(brandId: string): Promise<Product[]>;
}

// Cart Repository
export interface CartRepository {
  getCart(userId: string): Promise<CartItem[]>;
  addItem(userId: string, item: CartItem): Promise<void>;
  updateItem(userId: string, productId: string, size: string, quantity: number, color?: string): Promise<void>;
  removeItem(userId: string, productId: string, size: string, color?: string): Promise<void>;
  clearCart(userId: string): Promise<void>;
  onCartChange(userId: string, callback: (items: CartItem[]) => void): () => void;
}

export interface CartOutfitsRepository {
  getOutfits(userId: string): Promise<SavedCartOutfit[]>;
  saveOutfits(userId: string, outfits: SavedCartOutfit[]): Promise<void>;
  onOutfitsChange(userId: string, callback: (outfits: SavedCartOutfit[]) => void): () => void;
}

// Wishlist Repository
export interface WishlistRepository {
  getWishlist(userId: string): Promise<WishlistItem[]>;
  getCollections(userId: string): Promise<WishlistCollection[]>;
  addItem(userId: string, product: Product, collectionId?: string): Promise<void>;
  removeItem(userId: string, productId: string, collectionId?: string): Promise<void>;
  addCollection(userId: string, name: string): Promise<WishlistCollection>;
  onWishlistChange(userId: string, callback: (items: WishlistItem[]) => void): () => void;
}

// Orders Repository
export interface OrdersRepository {
  getOrders(userId: string): Promise<Order[]>;
  getOrderById(userId: string, orderId: string): Promise<Order | null>;
  createOrder(userId: string, order: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>): Promise<Order>;
  updateOrderStatus(userId: string, orderId: string, status: Order['status']): Promise<void>;
  onOrdersChange(userId: string, callback: (orders: Order[]) => void): () => void;
}

// Payment Repository
export interface PaymentRepository {
  createPaymentIntent(amount: number, currency: string, metadata?: Record<string, any>): Promise<{ clientSecret: string; paymentIntentId: string }>;
  confirmPayment(paymentIntentId: string): Promise<{ success: boolean; orderId?: string }>;
}


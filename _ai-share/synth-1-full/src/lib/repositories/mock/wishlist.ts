/**
 * Mock Wishlist Repository
 * Uses localStorage for persistence, ready to be replaced with Firestore
 */

import type { WishlistRepository, WishlistItem, WishlistCollection, Product } from '../types';

const getWishlistKey = (userId: string) => `syntha_wishlist_${userId}`;
const getCollectionsKey = (userId: string) => `syntha_wishlist_collections_${userId}`;

export class MockWishlistRepository implements WishlistRepository {
  private listeners: Map<string, Set<(items: WishlistItem[]) => void>> = new Map();

  private getWishlistSync(userId: string): WishlistItem[] {
    if (typeof window === 'undefined') return [];
    const stored = localStorage.getItem(getWishlistKey(userId));
    if (stored) {
      return JSON.parse(stored) as WishlistItem[];
    }
    return [];
  }

  private saveWishlist(userId: string, items: WishlistItem[]) {
    if (typeof window === 'undefined') return;
    localStorage.setItem(getWishlistKey(userId), JSON.stringify(items));
    this.notifyListeners(userId, items);
  }

  private getCollectionsSync(userId: string): WishlistCollection[] {
    if (typeof window === 'undefined') return [];
    const stored = localStorage.getItem(getCollectionsKey(userId));
    if (stored) {
      return JSON.parse(stored) as WishlistCollection[];
    }
    // Default collection
    const defaultCollections: WishlistCollection[] = [
      { id: 'default', name: 'Основное', items: [] },
    ];
    if (typeof window !== 'undefined') {
      localStorage.setItem(getCollectionsKey(userId), JSON.stringify(defaultCollections));
    }
    return defaultCollections;
  }

  private saveCollections(userId: string, collections: WishlistCollection[]) {
    if (typeof window === 'undefined') return;
    localStorage.setItem(getCollectionsKey(userId), JSON.stringify(collections));
  }

  private notifyListeners(userId: string, items: WishlistItem[]) {
    const userListeners = this.listeners.get(userId);
    if (userListeners) {
      userListeners.forEach((callback) => callback(items));
    }
  }

  async getWishlist(userId: string): Promise<WishlistItem[]> {
    await new Promise((resolve) => setTimeout(resolve, 50));
    return this.getWishlistSync(userId);
  }

  async getCollections(userId: string): Promise<WishlistCollection[]> {
    await new Promise((resolve) => setTimeout(resolve, 50));
    return this.getCollectionsSync(userId);
  }

  async addItem(userId: string, product: Product, collectionId: string = 'default'): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 100));

    // Validate product
    if (!product || !product.id) {
      console.error('Cannot add item to wishlist: product is missing or has no id', product);
      return;
    }

    const wishlist = this.getWishlistSync(userId);
    const collections = this.getCollectionsSync(userId);

    // Check if already in wishlist
    if (!wishlist.find((item) => item.id === product.id)) {
      wishlist.push(product);
      this.saveWishlist(userId, wishlist);
    }

    // Add to collection
    const collection = collections.find((c) => c.id === collectionId);
    if (collection && !collection.items.find((item) => item.id === product.id)) {
      collection.items.push(product);
      this.saveCollections(userId, collections);
    }
  }

  async removeItem(userId: string, productId: string, collectionId?: string): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 100));
    const wishlist = this.getWishlistSync(userId);
    const filtered = wishlist.filter((item) => item.id !== productId);
    this.saveWishlist(userId, filtered);

    if (collectionId) {
      const collections = this.getCollectionsSync(userId);
      const collection = collections.find((c) => c.id === collectionId);
      if (collection) {
        collection.items = collection.items.filter((item) => item.id !== productId);
        this.saveCollections(userId, collections);
      }
    } else {
      // Remove from all collections
      const collections = this.getCollectionsSync(userId);
      collections.forEach((collection) => {
        collection.items = collection.items.filter((item) => item.id !== productId);
      });
      this.saveCollections(userId, collections);
    }
  }

  async addCollection(userId: string, name: string): Promise<WishlistCollection> {
    await new Promise((resolve) => setTimeout(resolve, 100));
    const collections = this.getCollectionsSync(userId);
    const newCollection: WishlistCollection = {
      id: `collection-${Date.now()}`,
      name,
      items: [],
    };
    collections.push(newCollection);
    this.saveCollections(userId, collections);
    return newCollection;
  }

  onWishlistChange(userId: string, callback: (items: WishlistItem[]) => void): () => void {
    if (!this.listeners.has(userId)) {
      this.listeners.set(userId, new Set());
    }
    const userListeners = this.listeners.get(userId)!;
    userListeners.add(callback);

    // Immediately call with current wishlist
    const currentWishlist = this.getWishlistSync(userId);
    callback(currentWishlist);

    return () => {
      userListeners.delete(callback);
      if (userListeners.size === 0) {
        this.listeners.delete(userId);
      }
    };
  }
}

export const mockWishlistRepository = new MockWishlistRepository();

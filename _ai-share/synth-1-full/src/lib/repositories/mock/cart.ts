/**
 * Mock Cart Repository
 * Uses localStorage for persistence, ready to be replaced with Firestore
 */

import type { CartRepository } from '../types';
import type { CartItem } from '../../types';
import { cartLineKey } from '@/lib/cart-outfit-utils';

const getStorageKey = (userId: string) => `syntha_cart_${userId}`;

export class MockCartRepository implements CartRepository {
  private listeners: Map<string, Set<(items: CartItem[]) => void>> = new Map();

  private getCartSync(userId: string): CartItem[] {
    if (typeof window === 'undefined') return [];
    const stored = localStorage.getItem(getStorageKey(userId));
    if (stored) {
      return JSON.parse(stored);
    }
    return [];
  }

  private saveCart(userId: string, items: CartItem[]) {
    if (typeof window === 'undefined') return;
    localStorage.setItem(getStorageKey(userId), JSON.stringify(items));
    this.notifyListeners(userId, items);
  }

  private notifyListeners(userId: string, items: CartItem[]) {
    const userListeners = this.listeners.get(userId);
    if (userListeners) {
      userListeners.forEach(callback => callback(items));
    }
  }

  async getCart(userId: string): Promise<CartItem[]> {
    await new Promise(resolve => setTimeout(resolve, 50));
    return this.getCartSync(userId);
  }

  async addItem(userId: string, item: CartItem): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 100));
    const cart = this.getCartSync(userId);
    const existingIndex = cart.findIndex((i) => cartLineKey(i) === cartLineKey(item));

    if (existingIndex > -1) {
      if (item.quantity <= 0) {
        cart.splice(existingIndex, 1);
      } else {
        cart[existingIndex].quantity += item.quantity;
      }
    } else {
      if (item.quantity > 0) {
        cart.push(item);
      }
    }

    this.saveCart(userId, cart);
  }

  async updateItem(userId: string, productId: string, size: string, quantity: number, color?: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 100));
    const cart = this.getCartSync(userId);
    const itemIndex = cart.findIndex((i) => cartLineKey(i) === cartLineKey({ id: productId, selectedSize: size, color, quantity: 1 } as CartItem));

    if (itemIndex > -1) {
      if (quantity <= 0) {
        cart.splice(itemIndex, 1);
      } else {
        cart[itemIndex].quantity = quantity;
      }
      this.saveCart(userId, cart);
    }
  }

  async removeItem(userId: string, productId: string, size: string, color?: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 100));
    const cart = this.getCartSync(userId);
    const needle = cartLineKey({ id: productId, selectedSize: size, color, quantity: 1 } as CartItem);
    const filtered = cart.filter((i) => cartLineKey(i) !== needle);
    this.saveCart(userId, filtered);
  }

  async clearCart(userId: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 100));
    this.saveCart(userId, []);
  }

  onCartChange(userId: string, callback: (items: CartItem[]) => void): () => void {
    if (!this.listeners.has(userId)) {
      this.listeners.set(userId, new Set());
    }
    const userListeners = this.listeners.get(userId)!;
    userListeners.add(callback);

    // Immediately call with current cart
    const currentCart = this.getCartSync(userId);
    callback(currentCart);

    return () => {
      userListeners.delete(callback);
      if (userListeners.size === 0) {
        this.listeners.delete(userId);
      }
    };
  }
}

export const mockCartRepository = new MockCartRepository();


/**
 * Mock Orders Repository
 * Uses localStorage for persistence, ready to be replaced with Firestore
 */

import type { OrdersRepository, Order, CartItem } from '../types';

const getStorageKey = (userId: string) => `syntha_orders_${userId}`;

export class MockOrdersRepository implements OrdersRepository {
  private listeners: Map<string, Set<(orders: Order[]) => void>> = new Map();

  private getOrdersSync(userId: string): Order[] {
    if (typeof window === 'undefined') return [];
    const stored = localStorage.getItem(getStorageKey(userId));
    if (stored) {
      return JSON.parse(stored);
    }
    return [];
  }

  private saveOrders(userId: string, orders: Order[]) {
    if (typeof window === 'undefined') return;
    localStorage.setItem(getStorageKey(userId), JSON.stringify(orders));
    this.notifyListeners(userId, orders);
  }

  private notifyListeners(userId: string, orders: Order[]) {
    const userListeners = this.listeners.get(userId);
    if (userListeners) {
      userListeners.forEach(callback => callback(orders));
    }
  }

  async getOrders(userId: string): Promise<Order[]> {
    await new Promise(resolve => setTimeout(resolve, 100));
    return this.getOrdersSync(userId);
  }

  async getOrderById(userId: string, orderId: string): Promise<Order | null> {
    await new Promise(resolve => setTimeout(resolve, 50));
    const orders = this.getOrdersSync(userId);
    return orders.find(o => o.id === orderId) || null;
  }

  async createOrder(userId: string, orderData: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>, customCreatedAt?: string): Promise<Order> {
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate processing

    const orders = this.getOrdersSync(userId);
    const newOrder: Order = {
      ...orderData,
      id: `order-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: customCreatedAt || new Date().toISOString(),
      status: orderData.status || 'pending',
      paymentStatus: orderData.paymentStatus || 'pending',
    };

    orders.unshift(newOrder); // Add to beginning
    this.saveOrders(userId, orders);
    return newOrder;
  }

  async updateOrderStatus(userId: string, orderId: string, status: Order['status']): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 200));
    const orders = this.getOrdersSync(userId);
    const order = orders.find(o => o.id === orderId);
    if (order) {
      order.status = status;
      order.updatedAt = new Date().toISOString();
      this.saveOrders(userId, orders);
    }
  }

  onOrdersChange(userId: string, callback: (orders: Order[]) => void): () => void {
    if (!this.listeners.has(userId)) {
      this.listeners.set(userId, new Set());
    }
    const userListeners = this.listeners.get(userId)!;
    userListeners.add(callback);

    // Immediately call with current orders
    const currentOrders = this.getOrdersSync(userId);
    callback(currentOrders);

    return () => {
      userListeners.delete(callback);
      if (userListeners.size === 0) {
        this.listeners.delete(userId);
      }
    };
  }
}

export const mockOrdersRepository = new MockOrdersRepository();


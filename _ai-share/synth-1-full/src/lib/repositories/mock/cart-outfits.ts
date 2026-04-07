/**
 * Mock persisted «Мои образы» для залогиненного пользователя (localStorage per uid).
 */

import type { CartOutfitsRepository } from '../types';
import type { SavedCartOutfit } from '@/lib/types';

const key = (userId: string) => `syntha_cart_outfits_${userId}`;

export class MockCartOutfitsRepository implements CartOutfitsRepository {
  private listeners = new Map<string, Set<(outfits: SavedCartOutfit[]) => void>>();

  private readSync(userId: string): SavedCartOutfit[] {
    if (typeof window === 'undefined') return [];
    const raw = localStorage.getItem(key(userId));
    if (!raw) return [];
    try {
      const p = JSON.parse(raw) as SavedCartOutfit[];
      return Array.isArray(p) ? p : [];
    } catch {
      return [];
    }
  }

  private write(userId: string, outfits: SavedCartOutfit[]) {
    if (typeof window === 'undefined') return;
    localStorage.setItem(key(userId), JSON.stringify(outfits));
    const set = this.listeners.get(userId);
    set?.forEach((cb) => cb(outfits));
  }

  async getOutfits(userId: string): Promise<SavedCartOutfit[]> {
    await new Promise((r) => setTimeout(r, 30));
    return this.readSync(userId);
  }

  async saveOutfits(userId: string, outfits: SavedCartOutfit[]): Promise<void> {
    await new Promise((r) => setTimeout(r, 40));
    this.write(userId, outfits);
  }

  onOutfitsChange(userId: string, callback: (outfits: SavedCartOutfit[]) => void): () => void {
    let set = this.listeners.get(userId);
    if (!set) {
      set = new Set();
      this.listeners.set(userId, set);
    }
    set.add(callback);
    callback(this.readSync(userId));
    return () => {
      set!.delete(callback);
    };
  }
}

export const mockCartOutfitsRepository = new MockCartOutfitsRepository();

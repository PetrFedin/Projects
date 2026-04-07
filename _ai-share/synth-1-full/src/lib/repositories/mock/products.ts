/**
 * Mock Products Repository
 * Uses static product data, ready to be replaced with Firestore
 */

import type { ProductsRepository, Product } from '../types';
import allProducts from '@/lib/products';

export class MockProductsRepository implements ProductsRepository {
  private products: Product[] = allProducts;

  async getAll(): Promise<Product[]> {
    await new Promise(resolve => setTimeout(resolve, 100));
    return [...this.products];
  }

  async getById(id: string): Promise<Product | null> {
    await new Promise(resolve => setTimeout(resolve, 50));
    return this.products.find(p => p.id === id) || null;
  }

  async getBySlug(slug: string): Promise<Product | null> {
    await new Promise(resolve => setTimeout(resolve, 50));
    return this.products.find(p => p.slug === slug) || null;
  }

  async search(query: string): Promise<Product[]> {
    await new Promise(resolve => setTimeout(resolve, 150));
    const lowerQuery = query.toLowerCase();
    return this.products.filter(p => 
      p.name.toLowerCase().includes(lowerQuery) ||
      p.brand.toLowerCase().includes(lowerQuery) ||
      p.description.toLowerCase().includes(lowerQuery) ||
      p.category.toLowerCase().includes(lowerQuery) ||
      p.sku.toLowerCase().includes(lowerQuery)
    );
  }

  async getByCategory(category: string): Promise<Product[]> {
    await new Promise(resolve => setTimeout(resolve, 100));
    return this.products.filter(p => p.category === category);
  }

  async getByBrand(brandId: string): Promise<Product[]> {
    await new Promise(resolve => setTimeout(resolve, 100));
    return this.products.filter(p => p.brand.toLowerCase() === brandId.toLowerCase());
  }
}

export const mockProductsRepository = new MockProductsRepository();






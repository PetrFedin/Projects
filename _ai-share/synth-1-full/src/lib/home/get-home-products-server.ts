import fs from 'node:fs';
import path from 'node:path';
import type { Product } from '@/lib/types';

/** Server-side baseline products (без client fetch). Источник: `public/data/products.json`. */
export function getHomeProductsServerBaseline(): Product[] {
  try {
    const filePath = path.join(process.cwd(), 'public/data/products.json');
    const raw = fs.readFileSync(filePath, 'utf8');
    const data = JSON.parse(raw) as unknown;
    return Array.isArray(data) ? (data as Product[]) : [];
  } catch {
    return [];
  }
}

'use server';

/**
 * Genkit tool для поиска товаров по запросу.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const ProductSummarySchema = z.object({
  id: z.string(),
  name: z.string(),
  brand: z.string(),
  price: z.number(),
  category: z.string(),
});

export const searchProducts = ai.defineTool(
  {
    name: 'searchProducts',
    description:
      'Search for products in the catalog by query (color, category, style, keyword). Returns up to 5 matching products.',
    inputSchema: z.object({
      query: z
        .string()
        .describe(
          "Search query: color, category, product type, e.g. 'синие брюки', 'кашемир', 'тренч'"
        ),
    }),
    outputSchema: z.object({
      products: z.array(ProductSummarySchema),
    }),
  },
  async ({ query }) => {
    try {
      const base = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
      const res = await fetch(`${base}/data/products.json`);
      if (!res.ok) return { products: [] };
      const products = (await res.json()) as any[];
      const q = query.toLowerCase().trim();
      const terms = q.split(/\s+/).filter(Boolean);
      const scored = products
        .map((p) => {
          const hay =
            `${p.name || ''} ${p.brand || ''} ${p.category || ''} ${p.color || ''} ${(p.tags || []).join(' ')}`.toLowerCase();
          let score = 0;
          for (const t of terms) {
            if (hay.includes(t)) score += 2;
          }
          return { p, score };
        })
        .filter((x) => x.score > 0)
        .sort((a, b) => b.score - a.score)
        .slice(0, 5);
      return {
        products: scored.map(({ p }) => ({
          id: p.id,
          name: p.name,
          brand: p.brand,
          price: p.price,
          category: p.category,
        })),
      };
    } catch {
      return { products: [] };
    }
  }
);

'use server';
/**
 * @fileOverview A Genkit tool to retrieve product details from the catalog.
 */

import { ai } from '@/ai/genkit';
import { products } from '@/lib/products';
import { z } from 'zod';

const ProductDetailsSchema = z.object({
  id: z.string(),
  name: z.string(),
  brand: z.string(),
  price: z.number(),
  description: z.string(),
});

export const getProductDetails = ai.defineTool(
  {
    name: 'getProductDetails',
    description: 'Get details for a specific product from the catalog based on a search query.',
    inputSchema: z.object({
      query: z
        .string()
        .describe(
          'The name or keywords of the product to search for. For example, "cashmere sweater" or "trench coat".'
        ),
    }),
    outputSchema: ProductDetailsSchema.optional(),
  },
  async ({ query }) => {
    console.log(`[getProductDetails Tool] Searching for: ${query}`);

    // Fetch product data from the JSON file
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/data/products.json`);
    if (!response.ok) {
      console.error('Failed to fetch product data');
      return undefined;
    }
    const products = (await response.json()) as Array<{
      id: string;
      name: string;
      brand: string;
      price: number;
      description?: string;
    }>;

    // This is a mock search. In a real app, you'd use a proper search engine like Algolia or Elasticsearch.
    const foundProduct = products.find((p) =>
      p.name.toLowerCase().includes(query.toLowerCase())
    );

    if (foundProduct) {
      console.log(`[getProductDetails Tool] Found: ${foundProduct.name}`);
      const description = foundProduct.description ?? '';
      // Token Economy: Return only necessary fields and truncate description
      return {
        id: foundProduct.id,
        name: foundProduct.name,
        brand: foundProduct.brand,
        price: foundProduct.price,
        description: description.length > 300 ? description.substring(0, 300) + '...' : description,
      };
    }

    console.log(`[getProductDetails Tool] No product found for query: ${query}`);
    return undefined;
  }
);

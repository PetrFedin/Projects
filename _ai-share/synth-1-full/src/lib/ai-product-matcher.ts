/**
 * Simple product matching for AI Stylist
 * Matches products based on keywords in user query
 */

import type { Product } from './types';
import { productsRepository } from './repositories';

export async function findMatchingProducts(query: string, limit: number = 4): Promise<Product[]> {
  const lowerQuery = query.toLowerCase();
  
  // Extract keywords from query
  const keywords = lowerQuery
    .split(/\s+/)
    .filter(word => word.length > 2)
    .filter(word => !['для', 'нужен', 'хочу', 'нужно', 'образ', 'лук', 'outfit'].includes(word));

  // Get all products
  const allProducts = await productsRepository.getAll();

  // Score products based on keyword matches
  const scoredProducts = allProducts.map(product => {
    let score = 0;
    const productText = `${product.name} ${product.brand} ${product.description} ${product.category} ${product.color}`.toLowerCase();

    keywords.forEach(keyword => {
      if (productText.includes(keyword)) {
        score += 2;
      }
      // Bonus for category match
      if (product.category.toLowerCase().includes(keyword)) {
        score += 3;
      }
      // Bonus for name match
      if (product.name.toLowerCase().includes(keyword)) {
        score += 5;
      }
    });

    return { product, score };
  });

  // Sort by score and return top matches
  return scoredProducts
    .filter(item => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(item => item.product);
}






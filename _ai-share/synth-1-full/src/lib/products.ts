import type { Product, ProductImage } from './types';
// Import from lib/products.ts which has many products with proper ProductImage structure
// This file has full product data with images as objects
import { products as libProducts } from '../../lib/products';

// Also try to load from data/products.json and merge
let additionalProductsData: any[] = [];
try {
  additionalProductsData = require('@/lib/data/products.json');
} catch {
  // Ignore if file doesn't exist
}

// Combine: use libProducts as primary source (has many products with proper structure)
// and merge with additionalProductsData
const allProductsData = [...libProducts, ...additionalProductsData];

const allProducts: Product[] = (allProductsData as any[]).map((p, index) => {
  // If product already has proper structure (from lib/products.ts), use it as-is
  if (
    p.images &&
    Array.isArray(p.images) &&
    p.images.length > 0 &&
    typeof p.images[0] === 'object' &&
    'url' in p.images[0]
  ) {
    // Product already has proper ProductImage structure
    // Ensure all required fields are present
    return {
      id: p.id,
      slug: p.slug || p.name?.toLowerCase().replace(/\s+/g, '-') || `product-${index}`,
      name: p.name || 'Unnamed Product',
      brand: p.brand || 'Unknown Brand',
      price: p.price || 0,
      originalPrice: p.originalPrice,
      productionCost: p.productionCost,
      description: p.description || '',
      images: p.images.map((img: any) => ({
        id: img.id || `${p.id}-img-0`,
        url: img.url,
        alt: img.alt || p.name || 'Product image',
        hint: img.hint || 'product image',
        isCover: img.isCover || false,
      })),
      category: p.category || '',
      sustainability: p.sustainability || [],
      outlet: p.outlet || false,
      hasAR: p.hasAR || false,
      sku: p.sku || p.id,
      color: p.color || 'Unknown',
      season: p.season || '',
      tags: p.tags || [],
      sizes: Array.isArray(p.sizes)
        ? p.sizes.map((s: string | { name: string }) => (typeof s === 'string' ? { name: s } : s))
        : undefined,
      ...(p.rating !== undefined && { rating: p.rating }),
      ...(p.reviewCount !== undefined && { reviewCount: p.reviewCount }),
      ...(p.bestsellerRank !== undefined && { bestsellerRank: p.bestsellerRank }),
      ...(p.isPromoted !== undefined && { isPromoted: p.isPromoted }),
    } as Product;
  }

  // Transform images from string array to ProductImage array (for products from JSON)
  const images: ProductImage[] =
    Array.isArray(p.images) && p.images.length > 0
      ? p.images.map((img: string | ProductImage, imgIndex: number) => {
          // If already an object with url property, use it
          if (typeof img === 'object' && img !== null && 'url' in img) {
            return {
              id: (img as any).id || `${p.id}-img-${imgIndex}`,
              url: (img as any).url,
              alt: (img as any).alt || p.name || 'Product image',
              hint: (img as any).hint || 'product image',
              isCover: imgIndex === 0,
            } as ProductImage;
          }
          // If string, convert to ProductImage object
          if (typeof img === 'string') {
            return {
              id: `${p.id}-img-${imgIndex}`,
              url: img,
              alt: p.name || 'Product image',
              hint: 'product image',
              isCover: imgIndex === 0,
            } as ProductImage;
          }
          // Fallback
          return {
            id: `${p.id}-img-${imgIndex}`,
            url: '/placeholder.jpg',
            alt: p.name || 'Product image',
            hint: 'product image',
            isCover: imgIndex === 0,
          } as ProductImage;
        })
      : [];

  // Map other fields for products from JSON
  return {
    id: p.id,
    slug: p.slug || p.name?.toLowerCase().replace(/\s+/g, '-') || `product-${index}`,
    name: p.name || 'Unnamed Product',
    brand: p.brand || p.brandId || 'Unknown Brand',
    price: p.price || p.basePrice || 0,
    originalPrice: p.originalPrice,
    productionCost: p.productionCost,
    description: p.description || '',
    images:
      images.length > 0
        ? images
        : [
            {
              id: `${p.id}-img-0`,
              url: '/placeholder.jpg',
              alt: p.name || 'Product image',
              hint: 'product image',
              isCover: true,
            },
          ],
    category: p.category || '',
    sustainability: p.sustainability || [],
    outlet: p.outlet || false,
    hasAR: p.hasAR || false,
    sku: p.sku || p.id,
    color: p.color || 'Unknown',
    season: p.season || '',
    tags: p.tags || [],
    sizes: Array.isArray(p.sizes)
      ? p.sizes.map((s: string | { name: string }) => (typeof s === 'string' ? { name: s } : s))
      : undefined,
    // Add other optional fields
    ...(p.rating !== undefined && { rating: p.rating }),
    ...(p.reviewCount !== undefined && { reviewCount: p.reviewCount }),
    ...(p.bestsellerRank !== undefined && { bestsellerRank: p.bestsellerRank }),
    ...(p.isPromoted !== undefined && { isPromoted: p.isPromoted }),
  } as Product;
});

export const products: Product[] = allProducts;
export default allProducts;

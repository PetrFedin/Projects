import type { Product } from '@/lib/types';
import type { BundleOfferV1 } from './types';

/** Демо-правила бандлов (в проде — из маркетингового API). */
const DEMO_BUNDLES: Omit<BundleOfferV1, 'totalOriginal' | 'totalDiscounted'>[] = [
  {
    id: 'look-office-01',
    name: 'Офисный капсульный сет',
    items: ['classic-blazer-navy', 'tailored-trousers-grey'],
    discountPct: 15,
  },
  {
    id: 'look-weekend-01',
    name: 'Уикенд-комбо',
    items: ['relaxed-fit-hoodie-black', 'straight-leg-jeans-blue', 'white-leather-sneakers'],
    discountPct: 10,
  },
];

export function findBundlesForProduct(product: Product, allProducts: Product[]): BundleOfferV1[] {
  const result: BundleOfferV1[] = [];
  
  for (const bundle of DEMO_BUNDLES) {
    if (bundle.items.includes(product.slug) || bundle.items.includes(product.sku)) {
      // Find all items in the bundle
      const bundleProducts = bundle.items.map(id => 
        allProducts.find(p => p.slug === id || p.sku === id)
      ).filter(Boolean) as Product[];

      if (bundleProducts.length > 1) {
        const totalOriginal = bundleProducts.reduce((sum, p) => sum + (p.price || 0), 0);
        const totalDiscounted = Math.round(totalOriginal * (1 - bundle.discountPct / 100));
        
        result.push({
          ...bundle,
          totalOriginal,
          totalDiscounted,
        });
      }
    }
  }
  
  return result;
}

export function getAllBundles(allProducts: Product[]): BundleOfferV1[] {
  return DEMO_BUNDLES.map(b => {
    const products = b.items.map(id => 
      allProducts.find(p => p.slug === id || p.sku === id)
    ).filter(Boolean) as Product[];
    
    const totalOriginal = products.reduce((sum, p) => sum + (p.price || 0), 0);
    const totalDiscounted = Math.round(totalOriginal * (1 - b.discountPct / 100));
    
    return {
      ...b,
      totalOriginal,
      totalDiscounted,
    };
  }).filter(b => b.totalOriginal > 0);
}

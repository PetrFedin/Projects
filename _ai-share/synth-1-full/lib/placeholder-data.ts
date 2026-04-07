import type { Brand } from './types';
import { products } from './products';

// This file is now primarily used to generate brands that might not be associated with any products yet,
// ensuring the brand directory can be populated even without product data.
// In a real application, brands would likely be managed in a dedicated CMS or admin panel.

const productBrands = [...new Set(products.map(p => p.brand))];
const hardcodedBrands = ['Acne Studios', 'A.P.C.', 'Comme des Garçons', 'Maison Margiela', 'Jil Sander', 'Dries Van Noten', 'Issey Miyake', 'Sacai'];
const uniqueBrands = [...new Set([...productBrands, ...hardcodedBrands])];

export const brands: Brand[] = uniqueBrands.map((brandName, index) => {
    const brandSlug = brandName.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');
    // Using a deterministic way to generate followers to avoid hydration mismatch
    const followers = 3000 + (brandName.length * 100) + (index * 50);

    return {
      id: (index + 1).toString(),
      slug: brandSlug,
      name: brandName,
      description: `Откройте для себя последние коллекции от ${brandName}.`,
      logo: {
        url: `https://picsum.photos/seed/${brandSlug}/200/200`,
        alt: `Логотип ${brandName}`,
        hint: 'abstract logo',
      },
      followers,
    };
});

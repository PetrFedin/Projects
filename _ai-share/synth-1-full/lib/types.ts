export type UserRole = 'client' | 'brand' | 'shop' | 'admin';

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL: string;
  roles?: UserRole[];
  isAnonymous?: boolean;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  brand: string;
  price: number;
  originalPrice?: number;
  description: string;
  images: { id: string; url: string; alt: string; hint: string }[];
  category: string;
  sustainability: string[];
  outlet?: boolean;
  hasAR?: boolean;
  sku: string;
  color: string;
  season: string;
  /** Для каталога / фильтров по аудитории */
  gender?: 'women' | 'men' | 'kids' | 'unisex' | string;
  tags?: ('carryover' | 'noSale' | 'newSeason')[];
  /** Состав материала (строка или разбивка по материалам) */
  composition?: string | { material: string; percentage: number }[];
  /** Видео для PDP / медиа */
  videoUrls?: { url: string; label: string }[];
}

export interface CartItem extends Product {
  quantity: number;
}

export interface WishlistItem extends Product {
}

export interface Brand {
  id: string;
  slug: string;
  name: string;
  description: string;
  logo: { url: string; alt: string; hint: string };
  followers: number;
}

export interface Look {
  id: string;
  author: {
    name: string;
    handle: string;
    avatarUrl: string;
  };
  imageUrl: string;
  imageHint: string;
  description: string;
  likesCount: number;
  commentsCount: number;
}

export interface Lookboard {
    id: string;
    title: string;
    description: string;
    looks: Look[];
}


export type ActiveFilters = Record<string, string[]>;


export interface ImagePlaceholder {
  id: string;
  description: string;
  imageUrl: string;
  imageHint: string;
}

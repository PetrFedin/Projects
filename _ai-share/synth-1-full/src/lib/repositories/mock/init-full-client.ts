/**
 * Initialize full client profile with complete data
 * Creates a realistic client profile for investor demonstration
 */

import type { UserProfile, CartItem, Order, Product, WishlistItem } from '../../types';
import allProducts from '../../products';

// Import repositories dynamically to avoid circular dependency
async function getRepositories() {
  const { cartRepository, wishlistRepository, ordersRepository } = await import('../index');
  return { cartRepository, wishlistRepository, ordersRepository };
}

// Full client profile data
export const fullClientProfile = {
  uid: 'client-elena-petrova-001',
  email: 'elena.petrova@example.com',
  displayName: 'Елена Петрова',
  photoURL: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop',
  loyaltyPlan: 'premium' as const,
  loyaltyPoints: 18450,
  loyaltyPointsBreakdown: {
    qualifying: 12450,
    nonQualifying: 6000,
  },
  loyaltyCardIssuedAt: '2024-01-15T09:42:00Z',
  subscription: {
    plan: 'premium',
    status: 'active',
    startDate: '2024-01-15',
    endDate: '2025-01-15',
    renewalOffer: {
      type: 'promo',
      code: 'SYNTHA-PREMIUM20',
      discountPercent: 20,
      expiresAt: '2026-02-01',
    },
    benefits: [
      'Бесплатная доставка',
      'Персональный стилист',
      'Эксклюзивные товары',
      'Приоритетная поддержка',
      'Скидки до 20%',
    ],
  },
  measurements: {
    height: 168,
    weight: 58,
    bust: 88,
    waist: 64,
    hips: 92,
    footLength: 24,
    shoeSize: '38',
    clothingSize: 'S-M',
  },
  preferences: {
    favoriteColors: ['черный', 'белый', 'бежевый', 'розовый', 'синий'],
    favoriteCategories: ['Платья', 'Верх', 'Обувь', 'Аксессуары'],
    favoriteBrands: ['Syntha', 'A.P.C.', 'COS', 'Arket', 'Massimo Dutti'],
    stylePersonality: 'classic' as const,
    priceRange: { min: 3000, max: 25000 },
    preferredMaterials: ['хлопок', 'шелк', 'шерсть', 'кожа'],
    sizePreferences: {
      tops: 'S',
      bottoms: 'S',
      dresses: 'S',
      shoes: '38',
    },
  },
  interests: [
    'Классический стиль',
    'Минимализм',
    'Устойчивая мода',
    'Французский стиль',
    'Деловой стиль',
    'Романтический стиль',
  ],
  lifestyle: {
    occupation: 'Маркетинг-директор',
    city: 'Москва',
    age: 32,
    occasions: ['работа', 'свидания', 'выходные', 'путешествия', 'события'],
    shoppingFrequency: 'weekly',
    averageOrderValue: 15000,
  },
  activity: {
    totalViews: 247,
    totalLikes: 89,
    totalShares: 34,
    totalReviews: 12,
    totalLookboards: 8,
    lastActive: new Date().toISOString(),
    favoriteTimeToShop: 'evening',
    devicePreference: 'mobile',
  },
  behavior: {
    browsingPattern: 'explorer',
    purchaseDecisionTime: 'fast', // fast, medium, slow
    returnRate: 0.08, // 8%
    repeatPurchaseRate: 0.75, // 75%
    brandLoyalty: 'high',
    priceSensitivity: 'medium',
  },
};

export async function initializeFullClientData(user: UserProfile) {
  if (typeof window === 'undefined') return;

  try {
    // Update user profile to ensure correct displayName
    const updatedUser: UserProfile = {
      // Keep the full rich demo profile fields (subscription, breakdown, etc.)
      ...(fullClientProfile as unknown as UserProfile),
      // Preserve anything from current auth user (uid, roles, etc.)
      ...user,
      // Ensure identity fields are correct for the demo client
      displayName: 'Елена Петрова',
      email: 'elena.petrova@example.com',
      photoURL: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop',
    };

    // Update in localStorage
    localStorage.setItem('syntha_auth_user', JSON.stringify(updatedUser));

    // Check if already initialized
    const demoDataKey = `syntha_full_client_initialized_${user.uid}`;
    if (localStorage.getItem(demoDataKey)) {
      return; // Already initialized
    }

    // Get repositories
    const { cartRepository, wishlistRepository, ordersRepository } = await getRepositories();

    // Get products for demo
    const products = allProducts;

    // Initialize cart with 3 items (mix of categories)
    const cartItems: CartItem[] = [
      { ...products[0], quantity: 1, selectedSize: 'S' },
      { ...products[5], quantity: 1, selectedSize: '38' },
      { ...products[12], quantity: 2, selectedSize: 'S' },
    ].filter(Boolean);

    for (const item of cartItems) {
      await cartRepository.addItem(user.uid, item);
    }

    // Initialize wishlist with multiple collections
    // Filter out undefined products and ensure they have id
    const wishlistItems = [
      { product: products[2], collection: 'default' },
      { product: products[4], collection: 'default' },
      { product: products[7], collection: 'default' },
      { product: products[9], collection: 'default' },
      { product: products[11], collection: 'default' },
      { product: products[15], collection: 'default' },
      { product: products[18], collection: 'default' },
      { product: products[20], collection: 'default' },
      { product: products[22], collection: 'default' },
      { product: products[25], collection: 'default' },
    ].filter((item) => item.product && item.product.id);

    for (const item of wishlistItems) {
      if (item.product && item.product.id) {
        await wishlistRepository.addItem(user.uid, item.product, item.collection);
      }
    }

    // Create travel collection
    const travelCollection = await wishlistRepository.addCollection(user.uid, 'Для путешествий');
    const travelProducts = [products[6], products[14], products[19]].filter((p) => p && p.id);
    for (const product of travelProducts) {
      await wishlistRepository.addItem(user.uid, product, travelCollection.id);
    }

    // Create work collection
    const workCollection = await wishlistRepository.addCollection(user.uid, 'Для работы');
    const workProducts = [products[3], products[8], products[13]].filter((p) => p && p.id);
    for (const product of workProducts) {
      await wishlistRepository.addItem(user.uid, product, workCollection.id);
    }

    // Create orders history (12 orders over 8 months)
    const now = new Date();
    // Filter out undefined products before creating order configs
    const orderConfigs = [
      {
        items: [products[0], products[1]].filter(
          (p): p is Product => p !== undefined && p !== null
        ),
        subtotal: 18500,
        status: 'delivered' as const,
        daysAgo: 240,
        returned: false,
      },
      {
        items: [products[2]].filter((p): p is Product => p !== undefined && p !== null),
        subtotal: 12000,
        status: 'delivered' as const,
        daysAgo: 210,
        returned: true,
      },
      {
        items: [products[3], products[4]].filter(
          (p): p is Product => p !== undefined && p !== null
        ),
        subtotal: 22000,
        status: 'delivered' as const,
        daysAgo: 180,
        returned: false,
      },
      {
        items: [products[5]].filter((p): p is Product => p !== undefined && p !== null),
        subtotal: 8500,
        status: 'delivered' as const,
        daysAgo: 150,
        returned: false,
      },
      {
        items: [products[6], products[7]].filter(
          (p): p is Product => p !== undefined && p !== null
        ),
        subtotal: 16500,
        status: 'delivered' as const,
        daysAgo: 120,
        returned: false,
      },
      {
        items: [products[8]].filter((p): p is Product => p !== undefined && p !== null),
        subtotal: 9500,
        status: 'delivered' as const,
        daysAgo: 90,
        returned: false,
      },
      {
        items: [products[9], products[10]].filter(
          (p): p is Product => p !== undefined && p !== null
        ),
        subtotal: 19500,
        status: 'delivered' as const,
        daysAgo: 60,
        returned: false,
      },
      {
        items: [products[11]].filter((p): p is Product => p !== undefined && p !== null),
        subtotal: 11000,
        status: 'delivered' as const,
        daysAgo: 45,
        returned: false,
      },
      {
        items: [products[12], products[13]].filter(
          (p): p is Product => p !== undefined && p !== null
        ),
        subtotal: 17500,
        status: 'delivered' as const,
        daysAgo: 30,
        returned: false,
      },
      {
        items: [products[14]].filter((p): p is Product => p !== undefined && p !== null),
        subtotal: 8800,
        status: 'shipped' as const,
        daysAgo: 7,
        returned: false,
      },
      {
        items: [products[15], products[16]].filter(
          (p): p is Product => p !== undefined && p !== null
        ),
        subtotal: 21000,
        status: 'processing' as const,
        daysAgo: 2,
        returned: false,
      },
      {
        items: [products[17]].filter((p): p is Product => p !== undefined && p !== null),
        subtotal: 12500,
        status: 'pending' as const,
        daysAgo: 0,
        returned: false,
      },
    ].filter((config) => config.items.length > 0); // Only keep configs with valid items

    // Create orders
    for (const config of orderConfigs) {
      // Filter out undefined products before mapping
      const validItems = config.items.filter(
        (p): p is Product => p !== undefined && p !== null && p.id !== undefined
      );
      if (validItems.length === 0) continue; // Skip if no valid items

      const orderItems = validItems.map((p, i) => {
        // Safely get size
        let selectedSize = 'S';
        if (p.sizes && Array.isArray(p.sizes) && p.sizes.length > 0) {
          const firstSize = p.sizes[0];
          selectedSize = typeof firstSize === 'string' ? firstSize : firstSize?.name || 'S';
        }

        return {
          ...p,
          quantity: 1,
          selectedSize,
        };
      });

      const shipping = config.subtotal > 10000 ? 0 : 500;
      const tax = (config.subtotal + shipping) * 0.2;
      const total = config.subtotal + shipping + tax;

      const orderDate = new Date(now.getTime() - config.daysAgo * 24 * 60 * 60 * 1000);
      const orderData = {
        userId: user.uid,
        items: orderItems,
        subtotal: config.subtotal,
        shipping,
        tax,
        total,
        status: config.status,
        paymentStatus: 'paid' as const,
        shippingAddress: {
          firstName: 'Елена',
          lastName: 'Петрова',
          email: user.email,
          phone: '+7 (916) 234-56-78',
          address: 'ул. Тверская, д. 15, кв. 42',
          city: 'Москва',
          postalCode: '101000',
          country: 'Россия',
        },
        trackingNumber:
          config.status !== 'pending' && config.status !== 'processing'
            ? `TRACK${Math.random().toString(36).substr(2, 8).toUpperCase()}`
            : undefined,
        estimatedDelivery:
          config.status === 'shipped'
            ? new Date(orderDate.getTime() + 5 * 24 * 60 * 60 * 1000).toISOString()
            : undefined,
        returnRequested: config.returned,
        returnReason: config.returned ? 'Не подошел размер' : undefined,
      };

      await (ordersRepository as any).createOrder(user.uid, orderData, orderDate.toISOString());
    }

    // Store client analytics data for brand recommendations
    const clientAnalytics = {
      userId: user.uid,
      profile: fullClientProfile,
      purchaseHistory: orderConfigs.map((c) => ({
        date: new Date(now.getTime() - c.daysAgo * 24 * 60 * 60 * 1000).toISOString(),
        amount: c.subtotal,
        categories: c.items.map((i) => i.category),
        brands: c.items.map((i) => i.brand),
      })),
      viewedProducts: products.slice(0, 50).map((p) => ({
        productId: p.id,
        views: Math.floor(Math.random() * 10) + 1,
        lastViewed: new Date(
          now.getTime() - Math.random() * 30 * 24 * 60 * 60 * 1000
        ).toISOString(),
      })),
      interests: fullClientProfile.interests,
      preferences: fullClientProfile.preferences,
      behavior: fullClientProfile.behavior,
    };

    // Store in localStorage for brand analytics (simulating database)
    if (typeof window !== 'undefined') {
      const existingClients = JSON.parse(
        localStorage.getItem('syntha_brand_analytics_clients') || '[]'
      ) as unknown[];
      existingClients.push(clientAnalytics);
      localStorage.setItem('syntha_brand_analytics_clients', JSON.stringify(existingClients));
    }

    // Mark as initialized
    localStorage.setItem(demoDataKey, 'true');
  } catch (error) {
    console.error('Failed to initialize full client data:', error);
  }
}

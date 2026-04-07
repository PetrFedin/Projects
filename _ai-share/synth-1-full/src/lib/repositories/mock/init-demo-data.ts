/**
 * Initialize demo data for test user
 * Creates sample orders, cart items, and wishlist items for demonstration
 */

import type { UserProfile, CartItem, Order, Product } from '../../types';
import allProducts from '../../products';

// Import repositories dynamically to avoid circular dependency
async function getRepositories() {
  const { cartRepository, wishlistRepository, ordersRepository } = await import('../index');
  return { cartRepository, wishlistRepository, ordersRepository };
}

export async function initializeDemoData(user: UserProfile) {
  if (typeof window === 'undefined') return;

  try {
    // Check if demo data already initialized
    const demoDataKey = `syntha_demo_data_initialized_${user.uid}`;
    if (localStorage.getItem(demoDataKey)) {
      return; // Already initialized
    }

    // Get repositories
    const { cartRepository, wishlistRepository, ordersRepository } = await getRepositories();

    // Get some products for demo
    const products = allProducts.slice(0, 10);

    // Initialize cart with 3 items for better demo
    const cartItems: CartItem[] = products.slice(0, 3).map((product, index) => ({
      ...product,
      quantity: index + 1,
      selectedSize: product.sizes?.[0]?.name || 'One Size',
    }));

    for (const item of cartItems) {
      await cartRepository.addItem(user.uid, item);
    }

    // Initialize wishlist with 4 items (filter out invalid products)
    const wishlistProducts1 = products.slice(2, 6).filter(p => p && p.id);
    for (const product of wishlistProducts1) {
      await wishlistRepository.addItem(user.uid, product, 'default');
    }

    // Create a second wishlist collection
    const travelCollection = await wishlistRepository.addCollection(user.uid, 'Для путешествий');
    const travelProducts = products.slice(6, 8).filter(p => p && p.id);
    for (const product of travelProducts) {
      await wishlistRepository.addItem(user.uid, product, travelCollection.id);
    }

    // Add more items to default wishlist for better demo
    const wishlistProducts2 = products.slice(8, 12).filter(p => p && p.id);
    for (const product of wishlistProducts2) {
      await wishlistRepository.addItem(user.uid, product, 'default');
    }

    // Create sample orders for history (more orders for better demo)
    const now = new Date();
    const orderConfigs = [
      {
        items: products.slice(0, 2),
        subtotal: 15000,
        status: 'delivered' as const,
        daysAgo: 45,
      },
      {
        items: products.slice(1, 3),
        subtotal: 18000,
        status: 'delivered' as const,
        daysAgo: 30,
      },
      {
        items: products.slice(2, 4),
        subtotal: 12000,
        status: 'delivered' as const,
        daysAgo: 14,
      },
      {
        items: products.slice(3, 5),
        subtotal: 14000,
        status: 'shipped' as const,
        daysAgo: 7,
      },
      {
        items: products.slice(4, 5),
        subtotal: 8500,
        status: 'processing' as const,
        daysAgo: 2,
      },
    ];

    // Create orders with different dates
    for (const config of orderConfigs) {
      const orderItems = config.items.map((p, i) => ({
        ...p,
        quantity: i + 1,
        selectedSize: p.sizes?.[0]?.name || 'One Size',
      }));

      const shipping = 500;
      const tax = (config.subtotal + shipping) * 0.2;
      const total = config.subtotal + shipping + tax;

      // Create order with custom date
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
          firstName: user.displayName.split(' ')[0] || 'Иван',
          lastName: user.displayName.split(' ')[1] || 'Иванов',
          email: user.email,
          phone: '+7 (999) 123-45-67',
          address: 'ул. Тверская, д. 1, кв. 10',
          city: 'Москва',
          postalCode: '101000',
          country: 'Россия',
        },
        trackingNumber: config.status !== 'processing' ? `TRACK${Math.random().toString(36).substr(2, 6).toUpperCase()}` : undefined,
        estimatedDelivery: config.status === 'shipped' 
          ? new Date(orderDate.getTime() + 5 * 24 * 60 * 60 * 1000).toISOString()
          : undefined,
      };

      // Use type assertion to call with custom date
      const order = await (ordersRepository as any).createOrder(
        user.uid,
        orderData,
        orderDate.toISOString()
      );
    }

    // Mark as initialized
    localStorage.setItem(demoDataKey, 'true');
  } catch (error) {
    console.error('Failed to initialize demo data:', error);
  }
}


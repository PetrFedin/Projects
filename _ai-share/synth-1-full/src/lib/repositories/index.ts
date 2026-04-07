/**
 * Repository exports
 * Switch between mock and Firebase implementations here
 */

// Import mock implementations
import { mockAuthRepository, MockAuthRepository } from './mock/auth';
import { fastApiAuthRepository } from './fastapi/auth';
import { USE_FASTAPI } from '@/lib/syntha-api-mode';
import { mockProductsRepository, MockProductsRepository } from './mock/products';
import { mockCartRepository, MockCartRepository } from './mock/cart';
import { mockCartOutfitsRepository, MockCartOutfitsRepository } from './mock/cart-outfits';
import { mockWishlistRepository, MockWishlistRepository } from './mock/wishlist';
import { mockOrdersRepository, MockOrdersRepository } from './mock/orders';
import { mockPaymentRepository, MockPaymentRepository } from './mock/payment';

// Re-export for convenience
export {
  mockAuthRepository,
  MockAuthRepository,
  mockProductsRepository,
  MockProductsRepository,
  mockCartRepository,
  MockCartRepository,
  mockCartOutfitsRepository,
  MockCartOutfitsRepository,
  mockWishlistRepository,
  MockWishlistRepository,
  mockOrdersRepository,
  MockOrdersRepository,
  mockPaymentRepository,
  MockPaymentRepository,
};

// Export types
export type {
  AuthRepository,
  ProductsRepository,
  CartRepository,
  WishlistRepository,
  OrdersRepository,
  PaymentRepository,
  CartOutfitsRepository,
} from './types';

// Default: mock auth (MVP). Set NEXT_PUBLIC_USE_FASTAPI=true for real backend login.
export const authRepository = USE_FASTAPI ? fastApiAuthRepository : mockAuthRepository;
export const productsRepository = mockProductsRepository;
export const cartRepository = mockCartRepository;
export const cartOutfitsRepository = mockCartOutfitsRepository;
export const wishlistRepository = mockWishlistRepository;
export const ordersRepository = mockOrdersRepository;
export const paymentRepository = mockPaymentRepository;


/**
 * Clienteling 2.0 Types
 */

import { BodyMeasurements } from './client';

export interface CustomerProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatarUrl?: string;
  
  // Stats
  totalSpent: number;
  lastVisit: string;
  loyaltyTier: 'silver' | 'gold' | 'platinum';
  loyaltyPoints: number;
  
  // Style & Fit
  measurements?: BodyMeasurements;
  stylePreferences: string[];
  favoriteCategories: string[];
  dislikedMaterials: string[];
  
  // History
  wishlist: string[]; // Product IDs
  purchaseHistory: PurchaseRecord[];
  
  // Notes
  staffNotes: StaffNote[];
}

export interface PurchaseRecord {
  orderId: string;
  date: string;
  amount: number;
  items: { productId: string, name: string, size: string, color: string }[];
  storeId: string;
}

export interface StaffNote {
  id: string;
  staffId: string;
  staffName: string;
  text: string;
  createdAt: string;
}

export interface RecommendationEngineResult {
  customerId: string;
  suggestedProducts: { productId: string, reason: string, score: number }[];
  styleInsight: string;
}

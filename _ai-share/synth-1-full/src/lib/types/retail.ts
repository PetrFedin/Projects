/**
 * Smart Fitting Room Types
 */

export type FittingRoomStatus = 'available' | 'occupied' | 'maintenance' | 'cleaning_required';

export interface FittingRoomSession {
  id: string;
  roomId: string;
  startTime: string;
  endTime?: string;
  customerId?: string;
  items: FittingRoomItem[];
  requests: FittingRoomRequest[];
}

export interface FittingRoomItem {
  id: string;
  productId: string;
  variantId: string;
  sku: string;
  name: string;
  size: string;
  color: string;
  price: number;
  imageUrl: string;
  status: 'brought_in' | 'tried_on' | 'purchased' | 'left_behind';
}

export interface FittingRoomRequest {
  id: string;
  type: 'size_change' | 'color_change' | 'assistance' | 'bring_matching_item';
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  itemId?: string;
  targetSize?: string;
  targetColor?: string;
  timestamp: string;
}

export interface FittingRoom {
  id: string;
  name: string;
  location: string;
  status: FittingRoomStatus;
  currentSessionId?: string;
  lastSessionEnd?: string;
}

/**
 * Electronic Shelf Label (ESL) Types
 */

export interface ESLDevice {
  id: string;
  sku: string;
  productName: string;
  currentPrice: number;
  promoPrice?: number;
  currency: string;
  batteryLevel: number; // 0-100
  signalStrength: number; // 0-100
  lastSync: string;
  status: 'online' | 'offline' | 'updating' | 'error';
  location: string; // e.g., "Aisle 4, Shelf B"
}

export interface ESLSyncLog {
  id: string;
  deviceId: string;
  timestamp: string;
  action: 'price_update' | 'image_update' | 'reboot' | 'firmware';
  status: 'success' | 'failed';
  details: string;
}

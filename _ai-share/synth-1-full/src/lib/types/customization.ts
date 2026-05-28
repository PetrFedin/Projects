export type CustomOrderStatus =
  | 'draft'
  | 'configuration'
  | 'measurement'
  | 'payment_pending'
  | 'in_production'
  | 'quality_control'
  | 'ready_for_shipping'
  | 'shipped'
  | 'delivered';

export interface CustomOption {
  id: string;
  name: string;
  type: 'fabric' | 'button' | 'thread' | 'pocket' | 'collar';
  value: string;
  priceDelta: number;
  image?: string;
}

export interface BodyMeasurements {
  height: number;
  chest: number;
  waist: number;
  hips: number;
  shoulderWidth: number;
  armLength: number;
  inseam: number;
  neck: number;
  scannedAt: string;
  confidenceScore: number;
}

export interface CustomOrder {
  id: string;
  clientId: string;
  clientName: string;
  brandId: string;
  brandName: string;
  baseProductId: string;
  productName: string;
  status: CustomOrderStatus;
  selectedOptions: CustomOption[];
  measurements: BodyMeasurements;
  totalPrice: number;
  createdAt: string;
  updatedAt: string;
  estimatedDelivery: string;
  trackingId?: string;
  digitalPassportUrl: string;
}

export interface CustomizationProject {
  id: string;
  brandId: string;
  name: string;
  description: string;
  basePrice: number;
  availableOptions: {
    fabrics: CustomOption[];
    buttons: CustomOption[];
    pockets: CustomOption[];
    collars: CustomOption[];
  };
  image: string;
}

/**
 * Logistics & Duty Calculation Types
 */

export interface HSCode {
  code: string; // Harmonized System Code (e.g., "6109.10" for Cotton T-shirts)
  description: string;
  category: string;
}

export interface DutyRate {
  countryCode: string; // ISO 2-letter code (e.g., "US", "DE", "CN")
  importDuty: number; // %
  vat: number; // % (Value Added Tax)
  additionalTax?: number; // % (Excise, etc.)
  threshold?: number; // De minimis value (free of duty below this amount)
}

export interface LandedCostEstimate {
  productId: string;
  itemValue: number;
  hsCode: string;
  destinationCountry: string;
  shippingCost: number;
  insuranceCost: number;

  // Calculated values
  dutyAmount: number;
  vatAmount: number;
  totalTaxes: number;
  finalPriceDDP: number; // Delivered Duty Paid
  currency: string;
}

export interface LogisticsConsolidationRequest {
  id: string;
  brandId: string;
  origin: string;
  destination: string;
  volume: number; // in CBM
  weight: number; // in KG
  readyDate: string;
  status: 'pending' | 'matched' | 'consolidated' | 'shipped';
}

/**
 * Shadow Inventory (In-Transit) Types
 */

export interface InTransitShipment {
  id: string; // Container or Shipment ID
  origin: string; // e.g., "Factory 04, Shenzhen"
  destination: string; // e.g., "Main Warehouse, Moscow"
  carrier: string; // e.g., "Maersk", "CDEK"
  trackingNumber: string;
  status: 'departed' | 'at_sea' | 'customs' | 'last_mile' | 'delivered';
  departureDate: string;
  estimatedArrival: string;
  items: InTransitItem[];
  sellableInTransit: boolean; // Shadow Inventory Toggle
}

export interface InTransitItem {
  sku: string;
  name: string;
  qty: number;
  allocatedToB2B: number;
  availableForB2C: number;
}

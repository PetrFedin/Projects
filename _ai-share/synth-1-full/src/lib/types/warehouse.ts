export interface RFIDTag {
    id: string; // EPC code (e.g., "3034257BF400010000000001")
    type: 'item' | 'pallet' | 'container';
    status: 'active' | 'inactive' | 'scanned_in' | 'scanned_out';
    lastScannedAt: string;
    lastGateId: string;
    metadata: {
        sku?: string;
        orderId?: string;
        batchId?: string;
    };
}

export interface PalletScan {
    id: string;
    gateId: string;
    timestamp: string;
    itemCount: number;
    expectedItemCount: number;
    status: 'verified' | 'mismatch' | 'damaged';
    tags: string[]; // List of EPCs scanned in this pallet
    location: string;
}

export interface WarehouseGate {
    id: string;
    name: string;
    status: 'online' | 'offline' | 'maintenance';
    lastActivity: string;
    scanCount24h: number;
}

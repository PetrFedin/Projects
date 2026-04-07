import { RFIDTag, PalletScan, WarehouseGate } from '../types/warehouse';

/**
 * Mock data and logic for the RFID Warehouse Gates.
 * В реальности здесь была бы интеграция с RFID-ридерами (напр. Impinj) через MQTT или HTTP-сервер.
 */

export const MOCK_GATES: WarehouseGate[] = [
    { id: 'GATE-01', name: 'Inbound Dock 1', status: 'online', lastActivity: '2026-03-08T08:15:00Z', scanCount24h: 145 },
    { id: 'GATE-02', name: 'Inbound Dock 2', status: 'online', lastActivity: '2026-03-08T09:30:00Z', scanCount24h: 89 },
    { id: 'GATE-03', name: 'Outbound Express', status: 'offline', lastActivity: '2026-03-07T18:00:00Z', scanCount24h: 312 },
    { id: 'GATE-04', name: 'Sorting A', status: 'maintenance', lastActivity: '2026-03-08T07:45:00Z', scanCount24h: 0 }
];

export const MOCK_SCANS: PalletScan[] = [
    {
        id: 'SCAN-10023',
        gateId: 'GATE-01',
        timestamp: '2026-03-08T08:14:22Z',
        itemCount: 450,
        expectedItemCount: 450,
        status: 'verified',
        tags: ['EPC...001', 'EPC...002', '...'],
        location: 'Section A1-4'
    },
    {
        id: 'SCAN-10024',
        gateId: 'GATE-02',
        timestamp: '2026-03-08T09:29:55Z',
        itemCount: 448,
        expectedItemCount: 450,
        status: 'mismatch',
        tags: ['EPC...101', 'EPC...102', '...'],
        location: 'Section B2-2'
    },
    {
        id: 'SCAN-10025',
        gateId: 'GATE-01',
        timestamp: '2026-03-08T09:45:10Z',
        itemCount: 300,
        expectedItemCount: 300,
        status: 'verified',
        tags: ['EPC...201', 'EPC...202', '...'],
        location: 'Sorting Hub'
    }
];

export const getScanStatusColor = (status: PalletScan['status']) => {
    switch (status) {
        case 'verified': return 'text-emerald-500 bg-emerald-50 border-emerald-100';
        case 'mismatch': return 'text-rose-500 bg-rose-50 border-rose-100 animate-pulse';
        case 'damaged': return 'text-amber-500 bg-amber-50 border-amber-100';
        default: return 'text-slate-400 bg-slate-50 border-slate-100';
    }
};

export const getGateStatusColor = (status: WarehouseGate['status']) => {
    switch (status) {
        case 'online': return 'bg-emerald-500';
        case 'offline': return 'bg-slate-300';
        case 'maintenance': return 'bg-amber-500';
        default: return 'bg-slate-300';
    }
};

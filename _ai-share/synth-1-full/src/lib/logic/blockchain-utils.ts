import { IPRecord } from '../types/intellectual-property';

/**
 * Mock data and logic for the Blockchain IP Ledger.
 * В реальности здесь была бы интеграция с блокчейном (напр. Ethereum/Solana) через смарт-контракты.
 */

export const MOCK_IP_RECORDS: IPRecord[] = [
  {
    id: 'IP-2026-001',
    brandId: 'brand-syntha',
    title: 'Cyber-Heritage Jacket Design',
    type: 'design',
    status: 'registered',
    registrationDate: '2026-02-15T10:00:00Z',
    hash: '0x742d8c36b6f7f7b1e8e9...3421',
    blockNumber: 14502123,
    owner: 'Syntha Co. LLC',
    attachments: [
      { url: '#', filename: 'front_view_v1.dxf', type: 'vector' },
      { url: '#', filename: 'sketch_final.pdf', type: 'document' },
    ],
    metadata: {
      designer: 'Alex Vetrov',
      collection: 'SS26',
      category: 'Outerwear',
    },
  },
  {
    id: 'IP-2026-002',
    brandId: 'brand-syntha',
    title: 'Tech-Floral Print Pattern',
    type: 'print',
    status: 'registered',
    registrationDate: '2026-02-18T14:30:00Z',
    hash: '0x123a4b56c7d8e9f0...9876',
    blockNumber: 14502555,
    owner: 'Syntha Co. LLC',
    attachments: [{ url: '#', filename: 'pattern_repeat.ai', type: 'source' }],
    metadata: {
      designer: 'Elena Morozova',
      collection: 'SS26',
      category: 'Prints',
    },
  },
  {
    id: 'IP-2026-003',
    brandId: 'brand-syntha',
    title: 'Modular Hoodie Tech Pack',
    type: 'tech_pack',
    status: 'pending',
    registrationDate: '2026-03-05T09:15:00Z',
    hash: '0xf9e8d7c6b5a4...5432',
    blockNumber: 14510000,
    owner: 'Syntha Co. LLC',
    attachments: [{ url: '#', filename: 'tech_pack_full.pdf', type: 'document' }],
    metadata: {
      designer: 'Alex Vetrov',
      collection: 'SS26',
      category: 'Activewear',
    },
  },
];

export const getIPStatusColor = (status: IPRecord['status']) => {
  switch (status) {
    case 'registered':
      return 'text-emerald-500 bg-emerald-50 border-emerald-100';
    case 'pending':
      return 'text-amber-500 bg-amber-50 border-amber-100';
    case 'disputed':
      return 'text-rose-500 bg-rose-50 border-rose-100';
    default:
      return 'text-slate-400 bg-slate-50 border-slate-100';
  }
};

export const generateIPHash = (data: string) => {
  // В реальности это был бы реальный SHA-256 хеш или CID из IPFS
  return `0x${Math.random().toString(16).slice(2, 10)}...${Math.random().toString(16).slice(2, 10)}`;
};

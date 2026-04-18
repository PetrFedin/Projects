import { MachineKPI, ProductionLine } from '../types/production-iot';

export const MOCK_MACHINES: MachineKPI[] = [
  {
    id: 'SM-101',
    type: 'sewing',
    status: 'running',
    efficiency: 94,
    operator: 'Anna K.',
    output24h: 124,
    lastMaintenance: '2026-02-01',
    temperature: 42,
    rpm: 3200,
  },
  {
    id: 'SM-102',
    type: 'sewing',
    status: 'running',
    efficiency: 88,
    operator: 'Ivan D.',
    output24h: 110,
    lastMaintenance: '2026-02-15',
    temperature: 45,
    rpm: 3100,
  },
  {
    id: 'SM-103',
    type: 'sewing',
    status: 'idle',
    efficiency: 0,
    operator: 'None',
    output24h: 0,
    lastMaintenance: '2026-03-01',
    temperature: 22,
    rpm: 0,
  },
  {
    id: 'CT-201',
    type: 'cutting',
    status: 'running',
    efficiency: 98,
    operator: 'Maria S.',
    output24h: 450,
    lastMaintenance: '2026-01-20',
    temperature: 38,
    rpm: 1200,
  },
  {
    id: 'EM-301',
    type: 'embroidery',
    status: 'error',
    efficiency: 12,
    operator: 'Petr V.',
    output24h: 15,
    lastMaintenance: '2026-03-05',
    temperature: 58,
    rpm: 400,
  },
];

export const MOCK_LINES: ProductionLine[] = [
  {
    id: 'LINE-A',
    name: 'Main Assembly A',
    efficiency: 92,
    status: 'active',
    currentOrder: 'PO-SS26-001',
    machines: MOCK_MACHINES.slice(0, 3),
  },
  {
    id: 'LINE-B',
    name: 'Detailing B',
    efficiency: 75,
    status: 'bottleneck',
    currentOrder: 'PO-SS26-002',
    machines: MOCK_MACHINES.slice(3, 5),
  },
];

export const getMachineStatusColor = (status: MachineKPI['status']) => {
  switch (status) {
    case 'running':
      return 'bg-emerald-500';
    case 'idle':
<<<<<<< HEAD
      return 'bg-slate-300';
    case 'offline':
      return 'bg-slate-900';
    case 'error':
      return 'bg-rose-500 animate-pulse';
    default:
      return 'bg-slate-300';
=======
      return 'bg-border-default';
    case 'offline':
      return 'bg-text-primary';
    case 'error':
      return 'bg-rose-500 animate-pulse';
    default:
      return 'bg-border-default';
>>>>>>> recover/cabinet-wip-from-stash
  }
};

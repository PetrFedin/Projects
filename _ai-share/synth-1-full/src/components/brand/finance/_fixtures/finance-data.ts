import { CreditCard, Layers, Banknote } from 'lucide-react';
import React from 'react';

export const platformMetrics = {
  totalGmv: 145800000,
  activePartners: 124,
  avgCommission: 8.5,
  commissionRevenue: 12393000,
  subscriptionRevenue: 4500000,
  platformBurn: 6200000,
  netPlatformProfit: 10693000,
};

export const mockBankAccounts = [
  {
    id: 'acc1',
    name: 'Расчетный счет',
    balance: 12400000,
    icon: React.createElement(CreditCard, { className: 'h-5 w-5' }),
  },
  {
    id: 'acc2',
    name: 'Резервный фонд',
    balance: 2000000,
    icon: React.createElement(Layers, { className: 'h-5 w-5' }),
  },
  {
    id: 'acc3',
    name: 'Кредитная линия',
    balance: -4000000,
    icon: React.createElement(Banknote, { className: 'h-5 w-5' }),
  },
];

export const commissionStreams = [
  { source: 'B2B Orders (Wholesale)', volume: 85000000, rate: 5, earned: 4250000, trend: 'up' },
  { source: 'Logistics Services', volume: 12000000, rate: 12, earned: 1440000, trend: 'stable' },
  { source: 'Production Management', volume: 45000000, rate: 15, earned: 5400000, trend: 'up' },
  { source: 'AI Tools Subscriptions', volume: 4500000, rate: 100, earned: 4500000, trend: 'up' },
];

export const metrics = {
  totalAssets: 45800000,
  inventoryValue: 18500000,
  cashInBank: 12400000,
  receivables: 14900000,
  totalLiabilities: 12500000,
  payables: 8500000,
  debt: 4000000,
  netWorth: 33300000,
  estimatedValuation: 125000000, // 3.7x multiplier
  sustainabilityIndex: 88,
  monthlyBurn: 4200000,
  runwayMonths: 7.2,
};

export const pnlData = {
  revenue: 15400000,
  cogs: 6200000,
  grossProfit: 9200000,
  opex: 4800000,
  ebitda: 4400000,
  taxes: 880000,
  netProfit: 3520000,
};

export const payrollData = [
  {
    id: '1',
    role: 'Генеральный директор',
    qty: 1,
    salary: 450000,
    bonus: 150000,
    total: 600000,
    status: 'paid',
  },
  {
    id: '2',
    role: 'Технический директор',
    qty: 1,
    salary: 350000,
    bonus: 100000,
    total: 450000,
    status: 'paid',
  },
  {
    id: '3',
    role: 'Ведущий байер',
    qty: 2,
    salary: 250000,
    bonus: 50000,
    total: 600000,
    status: 'pending',
  },
  {
    id: '4',
    role: 'Менеджер по маркетингу',
    qty: 3,
    salary: 180000,
    bonus: 30000,
    total: 630000,
    status: 'paid',
  },
  { id: '5', role: 'Логист', qty: 4, salary: 120000, bonus: 20000, total: 560000, status: 'paid' },
];

export const inventoryStats = [
  {
    category: 'Готовая продукция',
    value: 12500000,
    items: 4500,
    liquidity: 'high',
    collateral: true,
  },
  {
    category: 'Материалы / Ткани',
    value: 4200000,
    items: 1200,
    liquidity: 'medium',
    collateral: false,
  },
  { category: 'В производстве', value: 1800000, items: 800, liquidity: 'low', collateral: false },
];

export const interPartnerInvoices = [
  {
    id: 'INV-882',
    partner: 'Nord Tex Production',
    amount: 2450000,
    date: '2026-01-28',
    status: 'pending',
    type: 'payable',
  },
  {
    id: 'INV-883',
<<<<<<< HEAD
    partner: 'Podium Moscow',
=======
    partner: 'Демо-магазин · Москва 1',
>>>>>>> recover/cabinet-wip-from-stash
    amount: 1850000,
    date: '2026-01-29',
    status: 'paid',
    type: 'receivable',
  },
  {
    id: 'INV-884',
    partner: 'Global Logistics',
    amount: 420000,
    date: '2026-01-30',
    status: 'overdue',
    type: 'payable',
  },
];

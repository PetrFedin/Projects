'use client';

import React, { useState } from 'react';
import { useAuth } from "@/providers/auth-provider";
import { FinancialHeader } from './_components/FinancialHeader';
import { FinancialOverview } from './_components/FinancialOverview';
import { ProfitLossStatement } from './_components/ProfitLossStatement';
import { PayrollManagement } from './_components/PayrollManagement';
import { InventoryValuation } from './_components/InventoryValuation';
import { BalanceSheet } from './_components/BalanceSheet';
import { InterPartnerInvoices } from './_components/InterPartnerInvoices';
import { ExpensesAndIncome } from './_components/ExpensesAndIncome';
import { PlatformCommissions } from './_components/PlatformCommissions';
import { FintechHub } from './_components/FintechHub';
import { FinancialSidebar } from './_components/FinancialSidebar';

type FinancialView = 'overview' | 'pnl' | 'balance' | 'payroll' | 'inventory' | 'invoices' | 'platform_commissions' | 'expenses' | 'fintech';

export function FinancialHub() {
  const { user } = useAuth();
  const [activeView, setActiveView] = useState<FinancialView>('overview');
  const isAdmin = user?.roles?.includes('admin') || user?.partnerName === 'Syntha Global HQ';

  return (
    <div className="space-y-10">
      <FinancialHeader activeView={activeView} setActiveView={setActiveView} isAdmin={isAdmin} />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3">
        {/* Main Content Area */}
        <div className="lg:col-span-8 space-y-10">
          {activeView === 'overview' && <FinancialOverview />}
          {activeView === 'pnl' && <ProfitLossStatement />}
          {activeView === 'payroll' && <PayrollManagement />}
          {activeView === 'inventory' && <InventoryValuation />}
          {activeView === 'balance' && <BalanceSheet />}
          {activeView === 'invoices' && <InterPartnerInvoices />}
          {activeView === 'expenses' && <ExpensesAndIncome />}
          {activeView === 'fintech' && <FintechHub />}
          {activeView === 'platform_commissions' && isAdmin && <PlatformCommissions />}
        </div>

        {/* Sidebar: AI Advisor & Bank Sync */}
        <FinancialSidebar setActiveView={setActiveView} activeView={activeView} isAdmin={isAdmin} />
      </div>
    </div>
  );
}

import { useState, useEffect } from 'react';
import { useUserContext } from './useUserContext';
import { SYNTH_DASHBOARD_DEMO_MOCKS } from '@/lib/syntha-api-mode';
import {
  DASHBOARD_DEMO_CREDIT_LINE,
  DASHBOARD_DEMO_OUTSTANDING_INVOICES,
  DASHBOARD_DEMO_PAYMENT_METHODS,
} from '@/lib/dashboard/dashboard-demo-fixtures';

export interface CreditLine {
  available: number;
  limit: number;
  used: number;
}

export interface PaymentMethod {
  id: string;
  name: string;
  badge?: string;
  badgeColor?: string;
  dueDate?: string;
}

export interface OutstandingInvoice {
  id: string;
  number: string;
  amount: number;
  daysUntilDue: number;
  daysOverdue: number;
  isOverdue: boolean;
}

export function usePaymentData() {
  const [isLoading, setIsLoading] = useState(true);

  const { currentOrg } = useUserContext();

  const [creditLine, setCreditLine] = useState<CreditLine>(() =>
    SYNTH_DASHBOARD_DEMO_MOCKS ? { ...DASHBOARD_DEMO_CREDIT_LINE } : { available: 0, limit: 0, used: 0 }
  );

  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>(() =>
    SYNTH_DASHBOARD_DEMO_MOCKS ? [...DASHBOARD_DEMO_PAYMENT_METHODS] : []
  );

  const [outstandingInvoices, setOutstandingInvoices] = useState<OutstandingInvoice[]>([]);

  useEffect(() => {
    async function loadData() {
      setIsLoading(true);

      try {
        if (!SYNTH_DASHBOARD_DEMO_MOCKS) {
          setCreditLine({ available: 0, limit: 0, used: 0 });
          setPaymentMethods([]);
          setOutstandingInvoices([]);
        } else {
          setOutstandingInvoices(DASHBOARD_DEMO_OUTSTANDING_INVOICES.map((r) => ({ ...r })));
        }

        await new Promise((resolve) => setTimeout(resolve, 300));
      } catch (error) {
        console.error('Failed to load payment data:', error);
      } finally {
        setIsLoading(false);
      }
    }

    loadData();
  }, [currentOrg]);

  return {
    creditLine,
    paymentMethods,
    outstandingInvoices,
    isLoading,
  };
}

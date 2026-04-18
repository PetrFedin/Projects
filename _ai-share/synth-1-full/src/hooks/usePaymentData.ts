import { useState, useEffect } from 'react';
import { useUserContext } from './useUserContext';
import { useB2BState } from '@/providers/b2b-state';

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
  const { b2bDocuments } = useB2BState();

  const [creditLine, setCreditLine] = useState<CreditLine>({
    available: 2400000,
    limit: 5000000,
    used: 2600000,
  });

  const [paymentMethods] = useState<PaymentMethod[]>([
    {
      id: 'net30',
      name: 'Net 30',
      dueDate: 'Mar 20',
      badge: 'Стандарт',
    },
    {
      id: 'bnpl',
      name: 'Klarna BNPL',
      badge: '0% interest',
      badgeColor: 'bg-emerald-100 text-emerald-700',
    },
    {
      id: 'escrow',
      name: 'Escrow',
      badge: 'Seller Protection',
      badgeColor: 'bg-blue-100 text-blue-700',
    },
    {
      id: 'factoring',
      name: 'Invoice Factoring',
      badge: 'Get paid today',
<<<<<<< HEAD
      badgeColor: 'bg-purple-100 text-purple-700',
=======
      badgeColor: 'bg-accent-primary/15 text-accent-primary',
>>>>>>> recover/cabinet-wip-from-stash
    },
  ]);

  const [outstandingInvoices, setOutstandingInvoices] = useState<OutstandingInvoice[]>([]);

  useEffect(() => {
    async function loadData() {
      setIsLoading(true);

      try {
        // Mock invoices
        setOutstandingInvoices([
          {
            id: 'inv-1',
            number: 'INV-8821',
            amount: 420000,
            daysUntilDue: 5,
            daysOverdue: 0,
            isOverdue: false,
          },
          {
            id: 'inv-2',
            number: 'INV-8790',
            amount: 890000,
            daysUntilDue: 0,
            daysOverdue: 2,
            isOverdue: true,
          },
        ]);

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

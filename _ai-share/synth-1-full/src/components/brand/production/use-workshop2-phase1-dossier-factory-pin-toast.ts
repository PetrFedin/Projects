'use client';

import { useEffect } from 'react';
import type { useToast } from '@/hooks/use-toast';

/** Toast при событии `factory-pin-added` (комментарий от фабрики на эскизе). */
export function useWorkshop2Phase1DossierFactoryPinToast(
  toast: ReturnType<typeof useToast>['toast']
): void {
  useEffect(() => {
    const handleFactoryPin = (e: Event) => {
      const customEvent = e as CustomEvent<{ message: string }>;
      toast({
        title: 'Новый комментарий от фабрики',
        description: customEvent.detail.message,
        className: 'bg-blue-50 border-blue-200 text-blue-900',
      });
    };
    window.addEventListener('factory-pin-added', handleFactoryPin);
    return () => window.removeEventListener('factory-pin-added', handleFactoryPin);
  }, [toast]);
}

'use client';

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';
import dynamic from 'next/dynamic';
import { useToast } from '@/hooks/use-toast';

const AuditTrailDialog = dynamic(
  () =>
    import('@/components/home/dialogs/AuditTrailDialog').then((m) => ({
      default: m.AuditTrailDialog,
    })),
  { ssr: false }
);

const SmartCheckoutDialog = dynamic(
  () =>
    import('@/components/home/dialogs/SmartCheckoutDialog').then((m) => ({
      default: m.SmartCheckoutDialog,
    })),
  { ssr: false }
);

type HomeB2BDialogsContextValue = {
  openAuditTrail: () => void;
  openCheckout: () => void;
};

const HomeB2BDialogsContext = createContext<HomeB2BDialogsContextValue | null>(null);

export function useHomeB2BDialogsOptional() {
  return useContext(HomeB2BDialogsContext);
}

type HomeB2BDialogsProviderProps = {
  viewRole: string;
  children: ReactNode;
};

/** B2B modals главной — chunk при первом open; триггеры через `useHomeB2BDialogsOptional`. */
export function HomeB2BDialogsProvider({ viewRole, children }: HomeB2BDialogsProviderProps) {
  const { toast } = useToast();
  const enabled = viewRole === 'b2b' || viewRole === 'admin';
  const [dialogsMounted, setDialogsMounted] = useState(false);
  const [isAuditTrailOpen, setIsAuditTrailOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  const openAuditTrail = useCallback(() => {
    setDialogsMounted(true);
    setIsAuditTrailOpen(true);
  }, []);

  const openCheckout = useCallback(() => {
    setDialogsMounted(true);
    setIsCheckoutOpen(true);
  }, []);

  const value = useMemo(
    () => (enabled ? { openAuditTrail, openCheckout } : null),
    [enabled, openAuditTrail, openCheckout]
  );

  return (
    <HomeB2BDialogsContext.Provider value={value}>
      {children}
      {enabled && dialogsMounted ? (
        <>
          <AuditTrailDialog isOpen={isAuditTrailOpen} onOpenChange={setIsAuditTrailOpen} />
          <SmartCheckoutDialog
            isOpen={isCheckoutOpen}
            onOpenChange={setIsCheckoutOpen}
            toast={toast}
          />
        </>
      ) : null}
    </HomeB2BDialogsContext.Provider>
  );
}

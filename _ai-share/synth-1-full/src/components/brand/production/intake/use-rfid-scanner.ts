import { useState, useEffect, useCallback, useRef } from 'react';

export interface RfidSession {
  scannedEpcs: string[];
  totalScanned: number;
}

export function useRfidScanner(onBatchScanned: (epcs: string[]) => void, debounceMs = 500) {
  const [session, setSession] = useState<RfidSession>({ scannedEpcs: [], totalScanned: 0 });
  const epcBufferRef = useRef<Set<string>>(new Set());
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const inputBufferRef = useRef<string>('');

  const flushBuffer = useCallback(() => {
    if (epcBufferRef.current.size > 0) {
      const epcs = Array.from(epcBufferRef.current);
      setSession(prev => {
        const newEpcs = Array.from(new Set([...prev.scannedEpcs, ...epcs]));
        return {
          scannedEpcs: newEpcs,
          totalScanned: newEpcs.length
        };
      });
      onBatchScanned(epcs);
      epcBufferRef.current.clear();
    }
  }, [onBatchScanned]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if typing in an input or textarea
      if (
        document.activeElement?.tagName === 'INPUT' ||
        document.activeElement?.tagName === 'TEXTAREA' ||
        document.activeElement?.tagName === 'SELECT'
      ) {
        return;
      }

      if (e.key === 'Enter') {
        const code = inputBufferRef.current.trim();
        if (code && code.length > 5) {
          epcBufferRef.current.add(code);
          if (timeoutRef.current) clearTimeout(timeoutRef.current);
          timeoutRef.current = setTimeout(flushBuffer, debounceMs);
        }
        inputBufferRef.current = '';
      } else {
        if (e.key.length === 1) {
          inputBufferRef.current += e.key;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [debounceMs, flushBuffer]);

  const simulateScan = useCallback((epcs: string[]) => {
    epcs.forEach(epc => epcBufferRef.current.add(epc));
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(flushBuffer, debounceMs);
  }, [debounceMs, flushBuffer]);

  const resetSession = useCallback(() => {
    setSession({ scannedEpcs: [], totalScanned: 0 });
    epcBufferRef.current.clear();
  }, []);

  return {
    session,
    simulateScan,
    resetSession
  };
}

import { TNVEDResolutionResponse } from './types';

export interface SyncResult {
  batchId: string;
  status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED';
  markingCodes: string[];
}

/**
 * Simulates an asynchronous Chestny ZNAK marking code request.
 * TODO: Integrate BullMQ for actual background job processing to avoid blocking HTTP threads.
 * TODO: Integrate CryptoPro (CryptoCP) wrapper to sign requests with GOST before sending.
 */
export async function syncChestnyZnak(batchId: string, tnvedCodes: TNVEDResolutionResponse[]): Promise<SyncResult> {
  console.log(`[ChestnyZnakSync] Starting background sync for batch ${batchId}`);
  
  // Simulate network delay / polling
  await new Promise(resolve => setTimeout(resolve, 500));

  console.log(`[ChestnyZnakSync] Successfully generated mock codes for batch ${batchId}`);

  return {
    batchId,
    status: 'COMPLETED',
    markingCodes: tnvedCodes.map((c, i) => `010${c.code}21MOCKSERIAL${i}`)
  };
}

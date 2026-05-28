import { createHash } from 'crypto';

export interface AuditRecord {
  index: number;
  timestamp: string;
  eventType: string;
  payloadHash: string;
  previousHash: string;
  hash: string;
  signature: string; // Имитация подписи узла
}

/**
 * [Phase 13 — Immutable Audit Trail (Blockchain Mock)]
 * Защищенный от подделки журнал аудита для критических событий (DPP, QC, Финансы).
 * Использует концепцию блокчейна: каждая запись хешируется вместе с хешем предыдущей.
 * Это гарантирует, что историю производства (например, для таможни ЕС) нельзя изменить задним числом.
 */
export class ImmutableAuditTrail {
  private static chain: AuditRecord[] = [];

  /**
   * Инициализирует genesis-блок, если цепочка пуста.
   */
  private static initGenesisBlock(): void {
    if (this.chain.length === 0) {
      const genesis: AuditRecord = {
        index: 0,
        timestamp: new Date().toISOString(),
        eventType: 'genesis',
        payloadHash: '00000000000000000000000000000000',
        previousHash: '0',
        hash: '',
        signature: 'system',
      };
      genesis.hash = this.calculateHash(genesis);
      this.chain.push(genesis);
    }
  }

  /**
   * Рассчитывает SHA-256 хеш для записи.
   */
  private static calculateHash(record: Omit<AuditRecord, 'hash'>): string {
    const data = `${record.index}${record.timestamp}${record.eventType}${record.payloadHash}${record.previousHash}`;
    return createHash('sha256').update(data).digest('hex');
  }

  /**
   * Добавляет новую запись в неизменяемый журнал.
   */
  public static appendRecord(eventType: string, payload: any, signerId: string): AuditRecord {
    this.initGenesisBlock();

    const previousBlock = this.chain[this.chain.length - 1];
    const payloadString = JSON.stringify(payload);
    const payloadHash = createHash('sha256').update(payloadString).digest('hex');

    const newRecord: AuditRecord = {
      index: previousBlock.index + 1,
      timestamp: new Date().toISOString(),
      eventType,
      payloadHash,
      previousHash: previousBlock.hash,
      hash: '',
      signature: signerId,
    };

    newRecord.hash = this.calculateHash(newRecord);
    this.chain.push(newRecord);

    console.log(
      `[AuditTrail] Appended record #${newRecord.index} (${eventType}). Hash: ${newRecord.hash.substring(0, 8)}...`
    );
    return newRecord;
  }

  /**
   * Проверяет целостность всей цепочки (Tamper-evident check).
   * Если кто-то изменил данные в БД напрямую, хеши не совпадут.
   */
  public static verifyChain(): { isValid: boolean; brokenAtIndex?: number } {
    if (this.chain.length <= 1) return { isValid: true };

    for (let i = 1; i < this.chain.length; i++) {
      const currentBlock = this.chain[i];
      const previousBlock = this.chain[i - 1];

      // 1. Проверяем, что хеш текущего блока рассчитан верно
      const recalculatedHash = this.calculateHash(currentBlock);
      if (currentBlock.hash !== recalculatedHash) {
        console.error(`[AuditTrail] Chain broken at index ${i}: Invalid hash.`);
        return { isValid: false, brokenAtIndex: i };
      }

      // 2. Проверяем связь с предыдущим блоком
      if (currentBlock.previousHash !== previousBlock.hash) {
        console.error(`[AuditTrail] Chain broken at index ${i}: Previous hash mismatch.`);
        return { isValid: false, brokenAtIndex: i };
      }
    }

    return { isValid: true };
  }

  public static getChain(): AuditRecord[] {
    return [...this.chain];
  }
}

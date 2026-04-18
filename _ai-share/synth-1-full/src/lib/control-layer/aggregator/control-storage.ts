import { ControlOutput } from '@/lib/contracts';

/**
 * [Phase 2 — Control Signal Storage]
 * Хранилище для агрегированных сигналов управления с поддержкой версионирования.
 */
export class ControlSignalStorage {
  private static instance: ControlSignalStorage;
  private store: Map<string, ControlOutput[]> = new Map(); // entityId -> versions[]

  private constructor() {}

  public static getInstance(): ControlSignalStorage {
    if (!ControlSignalStorage.instance) {
      ControlSignalStorage.instance = new ControlSignalStorage();
    }
    return ControlSignalStorage.instance;
  }

  /**
   * Сохраняет новый снимок сигнала.
   */
  public save(output: ControlOutput): void {
    const entityId = output.entity_ref.entity_id;
    const versions = this.store.get(entityId) || [];

    // Ограничиваем историю последних 10 снимков
    const updatedVersions = [output, ...versions].slice(0, 10);
    this.store.set(entityId, updatedVersions);

    console.log(
      `[ControlStorage] Saved version for ${entityId}. Total versions: ${updatedVersions.length}`
    );
  }

  /**
   * Возвращает последний актуальный сигнал для сущности.
   */
  public getLatest(entityId: string): ControlOutput | null {
    const versions = this.store.get(entityId);
    return versions && versions.length > 0 ? versions[0] : null;
  }

  /**
   * Возвращает историю сигналов для анализа трендов.
   */
  public getHistory(entityId: string): ControlOutput[] {
    return this.store.get(entityId) || [];
  }

  /**
   * Генерирует хеш входов для проверки необходимости пересчета.
   */
  public static generateInputsHash(inputs: any): string {
    return Buffer.from(JSON.stringify(inputs)).toString('base64').slice(0, 16);
  }
}

export const controlStorage = ControlSignalStorage.getInstance();

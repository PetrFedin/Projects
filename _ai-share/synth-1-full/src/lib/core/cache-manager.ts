/**
 * [Phase 34 — Performance Optimization (Memoization & Caching)]
 * [Phase 51 — LRU Cache & Memory Bounding]
 * Продвинутый In-Memory Cache (LRU - Least Recently Used) для тяжелых математических и AI операций.
 * Предотвращает повторные вычисления и строго ограничивает потребление памяти,
 * удаляя самые редко используемые элементы при достижении лимита.
 */
export class CacheManager {
  private static cache = new Map<string, { value: any; expiresAt: number }>();
  private static readonly MAX_CACHE_SIZE = 1000; // Строгий лимит элементов (Memory Bounding)

  /**
   * Получает значение из кэша или вычисляет его, если кэш пуст/устарел.
   * Обновляет порядок использования (LRU).
   * @param key Уникальный ключ (например, хэш входных параметров)
   * @param ttlMs Время жизни кэша в миллисекундах
   * @param computeFn Функция для вычисления значения
   */
  public static async getOrCompute<T>(
    key: string,
    ttlMs: number,
    computeFn: () => Promise<T> | T
  ): Promise<T> {
    const cached = this.cache.get(key);
    const now = Date.now();

    if (cached && cached.expiresAt > now) {
      // LRU: Перемещаем элемент в конец Map (самый недавно использованный)
      this.cache.delete(key);
      this.cache.set(key, cached);
      console.log(`[CacheManager] HIT for key: ${key}`);
      return cached.value as T;
    }

    console.log(`[CacheManager] MISS for key: ${key}. Computing...`);
    const result = await computeFn();

    // LRU: Если достигли лимита, удаляем самый старый элемент (первый в Map)
    if (this.cache.size >= this.MAX_CACHE_SIZE) {
      this.evictOldest();
    }

    this.cache.set(key, {
      value: result,
      expiresAt: now + ttlMs,
    });

    return result;
  }

  /**
   * [Phase 51] Удаляет самый старый (Least Recently Used) или просроченный элемент.
   */
  private static evictOldest() {
    const now = Date.now();
    let oldestKey: string | null = null;

    // Сначала ищем просроченные элементы (O(N) в худшем случае, но обычно быстро)
    for (const [key, item] of this.cache.entries()) {
      if (item.expiresAt <= now) {
        this.cache.delete(key);
        return; // Удалили просроченный, достаточно
      }
      // Map сохраняет порядок вставки. Первый элемент — самый старый (если не обновлялся)
      if (!oldestKey) oldestKey = key;
    }

    // Если просроченных нет, удаляем просто самый старый (LRU)
    if (oldestKey) {
      this.cache.delete(oldestKey);
      console.warn(
        `[CacheManager] Memory bound reached (${this.MAX_CACHE_SIZE}). Evicted LRU key: ${oldestKey}`
      );
    }
  }

  /**
   * Принудительно инвалидирует кэш по префиксу.
   */
  public static invalidatePrefix(prefix: string) {
    for (const key of this.cache.keys()) {
      if (key.startsWith(prefix)) {
        this.cache.delete(key);
      }
    }
  }
}

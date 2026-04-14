/**
 * [Phase 10 — Multi-Tenant Data Isolation]
 * Контекст арендатора (Tenant Context) для SaaS-платформы.
 * Обеспечивает изоляцию данных (Row-Level Security Mock) на уровне приложения.
 */

export interface TenantContext {
  tenantId: string;
  roles: string[];
  permissions: string[];
  features: string[]; // Feature flags (e.g., 'advanced_analytics', 'vmi')
}

export class TenantManager {
  private static currentContext: TenantContext | null = null;

  /**
   * Устанавливает контекст текущего запроса (имитация middleware).
   */
  public static setContext(context: TenantContext): void {
    this.currentContext = context;
  }

  /**
   * Получает текущий контекст. Выбрасывает ошибку, если контекст не установлен.
   */
  public static getContext(): TenantContext {
    if (!this.currentContext) {
      throw new Error('Tenant context is not set. Cannot perform isolated operations.');
    }
    return this.currentContext;
  }

  /**
   * Очищает контекст (в конце запроса).
   */
  public static clearContext(): void {
    this.currentContext = null;
  }

  /**
   * Применяет фильтр изоляции к массиву данных (Mock RLS).
   * Оставляет только те записи, которые принадлежат текущему арендатору.
   */
  public static applyRLS<T extends { tenantId?: string }>(data: T[]): T[] {
    const ctx = this.getContext();
    return data.filter(item => !item.tenantId || item.tenantId === ctx.tenantId);
  }

  /**
   * Проверяет наличие фичи в подписке арендатора.
   */
  public static hasFeature(featureFlag: string): boolean {
    const ctx = this.getContext();
    return ctx.features.includes(featureFlag);
  }
}

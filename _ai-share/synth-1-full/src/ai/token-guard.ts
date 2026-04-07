/**
 * Token Guard
 * Контроль бюджета и защита от злоупотреблений.
 */

const DAILY_USER_LIMIT_USD = 0.50; // Лимит $0.50 на пользователя в день

export async function checkUserQuota(userId: string, estimatedCost: number): Promise<boolean> {
  // В MVP используем заглушку. В Production — Firestore counter.
  console.log(`[TokenGuard] Checking quota for ${userId}. Est cost: ${estimatedCost}`);
  return true; 
}

export function logTokenUsage(flowName: string, usage: any) {
  // Запись в аналитику/БД
  console.info(`[TokenUsage] ${flowName}: ${JSON.stringify(usage)}`);
}

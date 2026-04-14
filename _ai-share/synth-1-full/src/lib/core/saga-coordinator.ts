export interface SagaStep {
  name: string;
  execute: () => Promise<any>;
  compensate: (result?: any) => Promise<void>;
}

export interface SagaExecutionResult {
  sagaId: string;
  success: boolean;
  completedSteps: string[];
  failedStep?: string;
  error?: string;
  compensationSuccessful: boolean;
}

/**
 * [Phase 28 — Saga Compensation Framework (Distributed Rollbacks)]
 * Оркестратор распределенных транзакций (Saga Pattern).
 * В микросервисной архитектуре нет единой БД (ACID). Если процесс состоит из 3 шагов
 * (например: 1. Зарезервировать товар, 2. Списать деньги, 3. Оформить доставку),
 * и шаг 3 падает, мы должны "откатить" шаги 1 и 2 (вернуть деньги, снять резерв).
 * Этот класс управляет выполнением шагов и автоматически запускает компенсации (откаты) при сбоях.
 */
export class SagaCoordinator {
  /**
   * Выполняет последовательность шагов. Если один падает — откатывает предыдущие.
   */
  public static async executeSaga(sagaId: string, steps: SagaStep[]): Promise<SagaExecutionResult> {
    console.log(`[SagaCoordinator] Starting Saga: ${sagaId} (${steps.length} steps)`);
    
    const completedSteps: { step: SagaStep; result: any }[] = [];

    for (const step of steps) {
      try {
        console.log(`[SagaCoordinator] Executing step: ${step.name}`);
        const result = await step.execute();
        completedSteps.push({ step, result });
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        console.error(`[SagaCoordinator] Saga ${sagaId} FAILED at step '${step.name}': ${errorMessage}`);
        
        // Запуск компенсаций (Rollbacks) в обратном порядке
        console.log(`[SagaCoordinator] Initiating compensation for ${completedSteps.length} completed steps...`);
        let compensationSuccessful = true;

        for (let i = completedSteps.length - 1; i >= 0; i--) {
          const { step: completedStep, result } = completedSteps[i];
          try {
            console.log(`[SagaCoordinator] Compensating step: ${completedStep.name}`);
            await completedStep.compensate(result);
          } catch (compError) {
            console.error(`[SagaCoordinator] CRITICAL: Compensation failed for step '${completedStep.name}'! Manual intervention required.`, compError);
            compensationSuccessful = false;
            // В реальной системе здесь отправляется алерт инженерам (PagerDuty)
          }
        }

        return {
          sagaId,
          success: false,
          completedSteps: completedSteps.map(s => s.step.name),
          failedStep: step.name,
          error: errorMessage,
          compensationSuccessful
        };
      }
    }

    console.log(`[SagaCoordinator] Saga ${sagaId} completed successfully.`);
    return {
      sagaId,
      success: true,
      completedSteps: completedSteps.map(s => s.step.name),
      compensationSuccessful: true // Не применялась
    };
  }
}

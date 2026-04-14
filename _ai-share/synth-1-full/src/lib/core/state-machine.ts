/**
 * [Phase 17 — Strict State Machines]
 * Универсальный конечный автомат (FSM) для защиты агрегатов от нелогичных переходов состояний.
 * Гарантирует, что заказ не может быть отгружен до оплаты, а производство не может
 * перейти в "completed", если провалило QC.
 */

export interface Transition<TState extends string> {
  from: TState | TState[];
  to: TState;
  guard?: (context: any) => boolean; // Условие перехода (например, "оплачено ли?")
  errorMessage?: string;
}

export class StateMachine<TState extends string> {
  constructor(
    private currentState: TState,
    private transitions: Transition<TState>[]
  ) {}

  public getState(): TState {
    return this.currentState;
  }

  /**
   * Пытается выполнить переход в новое состояние.
   * Выбрасывает ошибку, если переход запрещен графом или guard-функцией.
   */
  public transition(newState: TState, context?: any): void {
    const validTransition = this.transitions.find(t => {
      const isFromValid = Array.isArray(t.from) ? t.from.includes(this.currentState) : t.from === this.currentState;
      const isToValid = t.to === newState;
      return isFromValid && isToValid;
    });

    if (!validTransition) {
      throw new Error(`[StateMachine] Invalid transition from '${this.currentState}' to '${newState}'.`);
    }

    if (validTransition.guard && !validTransition.guard(context)) {
      throw new Error(`[StateMachine] Transition to '${newState}' blocked by guard condition: ${validTransition.errorMessage || 'Condition failed'}.`);
    }

    // Переход разрешен
    console.log(`[StateMachine] State changed: ${this.currentState} -> ${newState}`);
    this.currentState = newState;
  }
}

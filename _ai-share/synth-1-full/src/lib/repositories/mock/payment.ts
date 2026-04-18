/**
 * Mock Payment Repository
 * Simulates payment processing, ready to be replaced with Stripe/ЮKassa
 */

import type { PaymentRepository } from '../types';

export class MockPaymentRepository implements PaymentRepository {
  async createPaymentIntent(
    amount: number,
    currency: string = 'RUB',
    metadata?: Record<string, any>
  ): Promise<{ clientSecret: string; paymentIntentId: string }> {
    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    const paymentIntentId = `pi_mock_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const clientSecret = `mock_client_secret_${paymentIntentId}`;

    // Store payment intent in localStorage for confirmation
    if (typeof window !== 'undefined') {
      const paymentIntents = JSON.parse(localStorage.getItem('syntha_payment_intents') || '[]');
      paymentIntents.push({
        id: paymentIntentId,
        amount,
        currency,
        metadata,
        status: 'requires_payment_method',
        createdAt: new Date().toISOString(),
      });
      localStorage.setItem('syntha_payment_intents', JSON.stringify(paymentIntents));
    }

    return { clientSecret, paymentIntentId };
  }

  async confirmPayment(paymentIntentId: string): Promise<{ success: boolean; orderId?: string }> {
    // Simulate payment processing delay
    await new Promise((resolve) => setTimeout(resolve, 1500));

    if (typeof window !== 'undefined') {
      const paymentIntents = JSON.parse(localStorage.getItem('syntha_payment_intents') || '[]');
      const intent = paymentIntents.find((pi: any) => pi.id === paymentIntentId);

      if (!intent) {
        return { success: false };
      }

      // Simulate 95% success rate
      const success = Math.random() > 0.05;

      if (success) {
        intent.status = 'succeeded';
        intent.confirmedAt = new Date().toISOString();
        localStorage.setItem('syntha_payment_intents', JSON.stringify(paymentIntents));
        return { success: true, orderId: intent.metadata?.orderId };
      } else {
        intent.status = 'failed';
        intent.failedAt = new Date().toISOString();
        localStorage.setItem('syntha_payment_intents', JSON.stringify(paymentIntents));
        return { success: false };
      }
    }

    return { success: false };
  }
}

export const mockPaymentRepository = new MockPaymentRepository();

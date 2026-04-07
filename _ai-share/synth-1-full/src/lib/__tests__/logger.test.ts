/**
 * Logger: reportError and logApiError must not throw (Sentry is optional).
 */
import { reportError, logApiError } from '../logger';

describe('logger', () => {
  it('reportError does not throw for Error', () => {
    expect(() => reportError(new Error('test'))).not.toThrow();
  });

  it('reportError does not throw for string', () => {
    expect(() => reportError('string error')).not.toThrow();
  });

  it('reportError does not throw with context', () => {
    expect(() => reportError(new Error('api failed'), { endpoint: '/api/v1/test', status: 500 })).not.toThrow();
  });

  it('logApiError does not throw', () => {
    expect(() => logApiError('/api/v1/orders', 404, 'Not found')).not.toThrow();
  });
});

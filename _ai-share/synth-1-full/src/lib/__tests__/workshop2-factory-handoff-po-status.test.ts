import {
  canAcknowledgeFactoryHandoffPo,
  canRetryFactoryHandoffErp,
  factoryHandoffErpBadgeLabel,
  factoryHandoffPoStatusLabelRu,
} from '@/lib/production/workshop2-factory-handoff-po-status';

describe('workshop2-factory-handoff-po-status', () => {
  it('человекочитаемые подписи статусов', () => {
    expect(factoryHandoffPoStatusLabelRu('pending_erp')).toBe('В очереди цеха');
    expect(factoryHandoffPoStatusLabelRu('synced')).toBe('Принято цехом');
  });

  it('ack только для pending_erp', () => {
    expect(canAcknowledgeFactoryHandoffPo('pending_erp')).toBe(true);
    expect(canAcknowledgeFactoryHandoffPo('synced')).toBe(false);
  });

  it('retry ERP для pending_erp, error и FACTORY-ACK', () => {
    expect(canRetryFactoryHandoffErp('pending_erp')).toBe(true);
    expect(canRetryFactoryHandoffErp('error')).toBe(true);
    expect(canRetryFactoryHandoffErp('synced', 'FACTORY-ACK-PO-1')).toBe(true);
    expect(canRetryFactoryHandoffErp('synced', 'ERP-123')).toBe(false);
  });

  it('erp badge для journal-only', () => {
    expect(factoryHandoffErpBadgeLabel('synced', 'FACTORY-ACK-X')).toMatch(/журнал/i);
  });
});

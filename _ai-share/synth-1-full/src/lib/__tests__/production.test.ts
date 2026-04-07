import {
  validateCollectionStep1,
  validateCollectionStep2,
  validateCollectionStep3,
  canCreatePOFromSamples,
  collectionIdFromName,
  formatBudget,
  canOrderPOForSample,
  type SampleForPO,
} from '../production/validation';
import { getProductionRole, PRODUCTION_PERMISSIONS } from '../production-permissions';

describe('Production validation', () => {
  describe('validateCollectionStep1', () => {
    it('requires name', () => {
      const errors = validateCollectionStep1({ name: '', deadline: '' });
      expect(errors.name).toBe('Введите название');
    });

    it('accepts valid name', () => {
      const errors = validateCollectionStep1({ name: 'Summer 2026', deadline: '' });
      expect(errors.name).toBeUndefined();
    });

    it('rejects duplicate name', () => {
      const errors = validateCollectionStep1(
        { name: 'Summer 2026', deadline: '' },
        ['Summer 2026', 'Other']
      );
      expect(errors.name).toBe('Коллекция с таким названием уже есть');
    });

    it('rejects duplicate name case-insensitive', () => {
      const errors = validateCollectionStep1(
        { name: 'summer 2026', deadline: '' },
        ['Summer 2026']
      );
      expect(errors.name).toBe('Коллекция с таким названием уже есть');
    });

    it('validates deadline format', () => {
      const errors = validateCollectionStep1({ name: 'Test', deadline: 'invalid' });
      expect(errors.deadline).toBe('Некорректная дата');
    });

    it('accepts valid deadline', () => {
      const errors = validateCollectionStep1({ name: 'Test', deadline: '2026-06-15' });
      expect(errors.deadline).toBeUndefined();
    });
  });

  describe('validateCollectionStep2', () => {
    it('requires at least one drop', () => {
      const errors = validateCollectionStep2({
        dropName: '',
        dropDate: '',
        drops: [],
      });
      expect(errors.dropName).toBe('Добавьте хотя бы один Drop');
    });

    it('accepts first drop via dropName/dropDate', () => {
      const errors = validateCollectionStep2({
        dropName: 'Main',
        dropDate: '2026-06-01',
        drops: [],
      });
      expect(errors.dropName).toBeUndefined();
    });

    it('accepts drops array', () => {
      const errors = validateCollectionStep2({
        dropName: '',
        dropDate: '',
        drops: [{ name: 'Main', date: '2026-06-01' }],
      });
      expect(errors.dropName).toBeUndefined();
    });

    it('validates drop name and date', () => {
      const errors = validateCollectionStep2({
        dropName: 'Main',
        dropDate: '2026-06-01',
        drops: [{ name: '', date: 'bad' }],
      });
      expect(errors.drop_0).toBe('Название');
      expect(errors.dropdate_0).toBe('Дата');
    });
  });

  describe('validateCollectionStep3', () => {
    it('requires positive budget', () => {
      const errors = validateCollectionStep3({
        materials: 0,
        sewing: 0,
        logistics: 0,
      });
      expect(errors.budget).toBe('Укажите хотя бы одну сумму');
    });

    it('accepts valid budget', () => {
      const errors = validateCollectionStep3({
        materials: 100000,
        sewing: 200000,
        logistics: 50000,
      });
      expect(Object.keys(errors)).toHaveLength(0);
    });

    it('rejects negative values', () => {
      const errors = validateCollectionStep3({
        materials: -100,
        sewing: 0,
        logistics: 0,
      });
      expect(errors.budget).toBe('Суммы не могут быть отрицательными');
    });
  });

  describe('canCreatePOFromSamples', () => {
    const approvedSample: SampleForPO = {
      skuId: 'TP-001',
      skuName: 'Dress',
      collection: 'SS26',
      status: 'approved',
      approved: true,
    };

    it('returns false when no approved samples', () => {
      expect(canCreatePOFromSamples([], true)).toBe(false);
    });

    it('returns false when materials not ok', () => {
      expect(canCreatePOFromSamples([approvedSample], false)).toBe(false);
    });

    it('returns true when samples approved and materials ok', () => {
      expect(canCreatePOFromSamples([approvedSample], true)).toBe(true);
    });
  });

  describe('collectionIdFromName', () => {
    it('converts name to ID', () => {
      expect(collectionIdFromName('Summer Solstice 2026')).toBe('SUMMER-SOLSTICE-2026');
    });

    it('handles empty', () => {
      expect(collectionIdFromName('')).toBe('NEW');
    });

    it('strips non-word chars', () => {
      expect(collectionIdFromName('Test & Co!')).toBe('TEST--CO');
    });
  });

  describe('formatBudget', () => {
    it('formats millions', () => {
      expect(formatBudget(4_200_000)).toBe('4.2M');
    });

    it('formats thousands', () => {
      expect(formatBudget(850_000)).toBe('850k');
    });

    it('formats small values', () => {
      expect(formatBudget(500)).toBe('500');
    });
  });

  describe('canOrderPOForSample', () => {
    it('returns true for approved', () => {
      expect(canOrderPOForSample('approved')).toBe(true);
    });

    it('returns false for in_review', () => {
      expect(canOrderPOForSample('in_review')).toBe(false);
    });

    it('returns false for waiting', () => {
      expect(canOrderPOForSample('waiting')).toBe(false);
    });
  });
});

describe('Production permissions', () => {
  describe('getProductionRole', () => {
    it('returns brand when no roles', () => {
      expect(getProductionRole(undefined)).toBe('brand');
    });

    it('returns admin for admin role', () => {
      expect(getProductionRole(['admin'])).toBe('admin');
    });

    it('returns manufacturer for factory role', () => {
      expect(getProductionRole(['manufacturer'])).toBe('manufacturer');
      expect(getProductionRole(['factory'])).toBe('manufacturer');
    });

    it('returns brand for brand role', () => {
      expect(getProductionRole(['brand'])).toBe('brand');
    });

    it('returns production_manager for buyer', () => {
      expect(getProductionRole(['buyer'])).toBe('production_manager');
    });
  });

  describe('PRODUCTION_PERMISSIONS', () => {
    it('admin can create PO', () => {
      expect(PRODUCTION_PERMISSIONS.admin.canCreatePO).toBe(true);
      expect(PRODUCTION_PERMISSIONS.admin.canApproveSamples).toBe(true);
    });

    it('designer cannot create PO', () => {
      expect(PRODUCTION_PERMISSIONS.designer.canCreatePO).toBe(false);
    });

    it('manufacturer cannot approve samples', () => {
      expect(PRODUCTION_PERMISSIONS.manufacturer.canApproveSamples).toBe(false);
    });

    it('supplier has minimal access', () => {
      expect(PRODUCTION_PERMISSIONS.supplier.canViewCollections).toBe(false);
      expect(PRODUCTION_PERMISSIONS.supplier.canCreatePO).toBe(false);
    });
  });
});

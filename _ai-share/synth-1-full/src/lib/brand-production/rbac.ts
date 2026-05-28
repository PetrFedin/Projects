import type { ProductionRole } from './types';

/** Какие действия разрешены роли (до API — подсказки в UI) */
export const ROLE_PERMISSIONS: Record<
  ProductionRole,
  {
    changeLifecycle: boolean;
    confirmPO: boolean;
    editBOM: boolean;
    qcSignoff: boolean;
    integration: boolean;
  }
> = {
  design: {
    changeLifecycle: true,
    confirmPO: false,
    editBOM: false,
    qcSignoff: false,
    integration: false,
  },
  production: {
    changeLifecycle: true,
    confirmPO: true,
    editBOM: true,
    qcSignoff: true,
    integration: false,
  },
  procurement: {
    changeLifecycle: false,
    confirmPO: false,
    editBOM: true,
    qcSignoff: false,
    integration: false,
  },
  merchandising: {
    changeLifecycle: false,
    confirmPO: false,
    editBOM: false,
    qcSignoff: false,
    integration: false,
  },
  admin: {
    changeLifecycle: true,
    confirmPO: true,
    editBOM: true,
    qcSignoff: true,
    integration: true,
  },
};

export const ROLE_LABELS: Record<ProductionRole, string> = {
  design: 'Дизайн',
  production: 'Продакшн',
  procurement: 'Закупки',
  merchandising: 'Мерчендайзинг',
  admin: 'Админ',
};

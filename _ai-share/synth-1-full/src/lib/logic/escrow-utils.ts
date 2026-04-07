import { EscrowAccount, EscrowMilestone } from '../types/finance';

/**
 * Escrow Milestone Engine Logic
 * Управление безопасными сделками и поэтапной оплатой.
 */

export function fundMilestone(account: EscrowAccount, milestoneId: string): EscrowAccount {
  const milestone = account.milestones.find(m => m.id === milestoneId);
  if (!milestone || milestone.status !== 'pending') return account;

  const updatedMilestones = account.milestones.map(m => 
    m.id === milestoneId ? { ...m, status: 'funded' } : m
  );

  return {
    ...account,
    balance: account.balance + milestone.amount,
    milestones: updatedMilestones as EscrowMilestone[]
  };
}

export function releaseMilestone(account: EscrowAccount, milestoneId: string): EscrowAccount {
  const milestone = account.milestones.find(m => m.id === milestoneId);
  if (!milestone || milestone.status !== 'funded') return account;

  const updatedMilestones = account.milestones.map(m => 
    m.id === milestoneId ? { ...m, status: 'released', releasedAt: new Date().toISOString() } : m
  );

  return {
    ...account,
    balance: account.balance - milestone.amount,
    milestones: updatedMilestones as EscrowMilestone[]
  };
}

/**
 * Расчет прогресса оплаты
 */
export function calculateEscrowProgress(account: EscrowAccount) {
  const releasedAmount = account.milestones
    .filter(m => m.status === 'released')
    .reduce((sum, m) => sum + m.amount, 0);
  
  const fundedAmount = account.milestones
    .filter(m => m.status === 'funded')
    .reduce((sum, m) => sum + m.amount, 0);

  return {
    released: releasedAmount,
    funded: fundedAmount,
    pending: account.totalAmount - releasedAmount - fundedAmount,
    percentReleased: (releasedAmount / account.totalAmount) * 100
  };
}

import type { LiveProcessTeamMember } from './types';

/** Мок: участники команды для выбора ответственных и управления доступом. */
export const MOCK_LIVE_PROCESS_TEAM: LiveProcessTeamMember[] = [
  { id: 'u1', name: 'Анна Иванова', email: 'anna@brand.com', role: 'Production Manager' },
  { id: 'u2', name: 'Пётр Сидоров', email: 'petr@brand.com', role: 'Design Lead' },
  { id: 'u3', name: 'Мария Козлова', email: 'maria@brand.com', role: 'Sourcing' },
  { id: 'u4', name: 'Алексей Новиков', email: 'alex@brand.com', role: 'B2B Sales' },
  { id: 'u5', name: 'Елена Волкова', email: 'elena@brand.com', role: 'QC' },
  { id: 'u6', name: 'Дмитрий Федоров', email: 'dmitry@brand.com', role: 'Logistics' },
  { id: 'u7', name: 'Ольга Морозова', email: 'olga@brand.com', role: 'Finance' },
];

export function getLiveProcessTeam(): LiveProcessTeamMember[] {
  return MOCK_LIVE_PROCESS_TEAM;
}

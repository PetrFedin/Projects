/**
 * Milestones with Video Proof — обязательная видео-фиксация ключевых этапов.
 * Связь с ЭДО, контрактами, Production. Инфра под API.
 */

export type MilestoneType =
  | 'cutting_start' // раскрой начат
  | 'cutting_done' // раскрой завершён
  | 'assembly_start' // сборка начата
  | 'assembly_done' // сборка завершена
  | 'finishing' // отделка
  | 'final_qc' // финальный ОК
  | 'packed'; // упаковано

export type MilestoneStatus = 'pending' | 'video_uploaded' | 'approved' | 'rejected';

export interface MilestoneWithVideo {
  id: string;
  orderId: string;
  milestoneType: MilestoneType;
  milestoneLabel: string; // "Раскрой завершён"
  status: MilestoneStatus;
  dueAt?: string; // ISO
  completedAt?: string;
  /** URL видео (при API — загрузка в Storage) */
  videoUrl?: string;
  approvedBy?: string;
  approvedAt?: string;
}

export const MILESTONES_VIDEO_API = {
  list: '/api/v1/production/milestones',
  get: '/api/v1/production/milestones/:id',
  uploadVideo: '/api/v1/production/milestones/:id/video',
  approve: '/api/v1/production/milestones/:id/approve',
} as const;

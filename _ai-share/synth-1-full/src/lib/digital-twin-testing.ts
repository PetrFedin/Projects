/**
 * Digital twin sample testing — виртуальная примерка новых моделей на аватарах для фидбека до производства.
 * Связи: PIM, дизайн, Range Planner. Инфра под API.
 */

export type TestingCampaignStatus = 'draft' | 'running' | 'closed';

export interface AvatarSegment {
  id: string;
  name: string;           // "Женщины 25-34", "Мужчины 40+"
  avatarCount: number;
}

export interface SampleTestingCampaign {
  id: string;
  title: string;
  skuIds: string[];       // модели для теста
  segments: AvatarSegment[];
  status: TestingCampaignStatus;
  createdAt: string;
  closedAt?: string;
  /** Сводка фидбека: лайки/дизлайки по модели */
  feedbackSummary?: { skuId: string; likePct: number; dislikePct: number }[];
}

export const DIGITAL_TWIN_TESTING_API = {
  listCampaigns: '/api/v1/brand/digital-twin-testing/campaigns',
  getCampaign: '/api/v1/brand/digital-twin-testing/campaigns/:id',
  createCampaign: '/api/v1/brand/digital-twin-testing/campaigns',
  submitFeedback: '/api/v1/brand/digital-twin-testing/campaigns/:id/feedback',
} as const;

import { UserRole, Chat as ChatConversation, TaskStatus, TaskPriority } from '@/lib/types';
export type { ChatMessage } from '@/lib/types';

export type ID = string;

export interface Person {
  id: string;
  name: string;
  role?: UserRole;
  avatar?: string;
  status?: string;
}

export type CallType = 'audio' | 'video' | 'scheduled';

export type TaskThreadEntry = {
  id: string;
  taskId: number;
  author: string;
  text: string;
  createdAt: number;
  kind: 'comment' | 'participation_request' | 'deadline_request' | 'system';
  payload?: any;
  likes?: number;
  dislikes?: number;
};

export type TaskStageStatus = 'pending' | 'in_progress' | 'done' | 'canceled';

export interface TaskStage {
  id: string;
  taskId: number;
  title: string;
  description?: string;
  assignee?: string;
  deadline?: Date;
  status: TaskStageStatus;
  createdAt: number;
}

export type DeadlineExtension = {
  at: number;
  by: string;
  from?: string | null; // ISO
  to: string; // ISO
};

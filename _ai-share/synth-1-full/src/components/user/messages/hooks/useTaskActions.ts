import React from 'react';
import { ChatMessage, TaskStatus, TaskPriority } from '@/lib/types';
import { ID, TaskThreadEntry, TaskStage } from '../types';
import { useToast } from '@/hooks/use-toast';

export function useTaskActions(
  currentUser: string,
  setMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>
) {
  const { toast } = useToast();
  const [taskThreads, setTaskThreads] = React.useState<Record<number, TaskThreadEntry[]>>({});
  const [taskStages, setTaskStages] = React.useState<Record<number, TaskStage[]>>({});

  const saveTask = (task: ChatMessage) => {
    setMessages(prev => [...prev, task]);
    toast({ title: 'Задача создана' });
  };

  const updateTask = (task: ChatMessage) => {
    setMessages(prev => prev.map(m => m.id === task.id ? task : m));
    toast({ title: 'Задача обновлена' });
  };

  const setTaskStatus = (taskId: number, status: TaskStatus) => {
    setMessages(prev => prev.map(m => m.id === taskId ? { ...m, status } : m));
  };

  const createStage = (stage: TaskStage) => {
    setTaskStages((prev) => ({ ...prev, [stage.taskId]: [...(prev[stage.taskId] ?? []), stage] }));
  };

  const postTaskThread = (taskId: number, text: string) => {
    setTaskThreads((prev) => ({
      ...prev,
      [taskId]: [...(prev[taskId] ?? []), {
        id: `thr_${Date.now()}`,
        taskId,
        author: currentUser,
        text,
        createdAt: Date.now(),
        kind: 'comment',
      }]
    }));
  };

  return {
    taskThreads,
    taskStages,
    saveTask,
    updateTask,
    setTaskStatus,
    createStage,
    postTaskThread
  };
}

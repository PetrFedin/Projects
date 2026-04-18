'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { MessageSquare, Package, Camera, Bell } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface SampleComment {
  id: string;
  skuId: string;
  author: string;
  text: string;
  time: string;
}

export interface SampleTracking {
  skuId: string;
  status: 'at_factory' | 'in_transit' | 'at_brand' | 'qc';
  eta?: string;
}

export interface SampleCommentsAndTrackingProps {
  skuId?: string;
  skuName?: string;
  comments?: SampleComment[];
  tracking?: SampleTracking | null;
  onAddComment?: (text: string) => void;
  onRemind?: () => void;
}

export function SampleCommentsAndTracking({
  skuId,
  skuName,
  comments = [],
  tracking,
  onAddComment,
  onRemind,
}: SampleCommentsAndTrackingProps) {
  const [newComment, setNewComment] = useState('');
  const statusLabels = {
    at_factory: 'На фабрике',
    in_transit: 'В пути',
    at_brand: 'У бренда',
    qc: 'На проверке',
  };

  return (
    <div className="space-y-3">
      {tracking && (
<<<<<<< HEAD
        <Card className="rounded-xl border border-slate-100 p-3 shadow-sm">
=======
        <Card className="border-border-subtle rounded-xl border p-3 shadow-sm">
>>>>>>> recover/cabinet-wip-from-stash
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-sky-100 text-sky-600">
              <Package className="h-4 w-4" />
            </div>
            <div>
              <p className="text-[10px] font-bold">{statusLabels[tracking.status]}</p>
              {tracking.eta && (
                <p className="text-text-secondary text-[9px]">ETA: {tracking.eta}</p>
              )}
            </div>
            {onRemind && (
              <Button
                size="sm"
                variant="ghost"
                className="ml-auto h-7 text-[9px]"
                onClick={onRemind}
              >
                <Bell className="mr-1 h-3.5 w-3.5" /> Напомнить
              </Button>
            )}
          </div>
        </Card>
      )}
<<<<<<< HEAD
      <Card className="rounded-xl border border-slate-100 shadow-sm">
=======
      <Card className="border-border-subtle rounded-xl border shadow-sm">
>>>>>>> recover/cabinet-wip-from-stash
        <CardHeader className="px-4 py-2">
          <CardTitle className="flex items-center gap-2 text-[10px] font-black uppercase">
            <MessageSquare className="h-4 w-4" /> Комментарии по сэмплу {skuName || skuId}
          </CardTitle>
        </CardHeader>
        <CardContent className="px-4 pb-4">
          <div className="mb-3 max-h-40 space-y-2 overflow-y-auto">
            {comments.length === 0 ? (
<<<<<<< HEAD
              <p className="py-4 text-center text-[10px] text-slate-400">Нет комментариев</p>
            ) : (
              comments.map((c) => (
                <div key={c.id} className="rounded-lg border border-slate-100 bg-slate-50 p-2">
                  <p className="text-[10px] font-bold">{c.author}</p>
                  <p className="mt-0.5 text-[10px] text-slate-700">{c.text}</p>
                  <p className="mt-1 text-[9px] text-slate-400">{c.time}</p>
=======
              <p className="text-text-muted py-4 text-center text-[10px]">Нет комментариев</p>
            ) : (
              comments.map((c) => (
                <div
                  key={c.id}
                  className="bg-bg-surface2 border-border-subtle rounded-lg border p-2"
                >
                  <p className="text-[10px] font-bold">{c.author}</p>
                  <p className="text-text-primary mt-0.5 text-[10px]">{c.text}</p>
                  <p className="text-text-muted mt-1 text-[9px]">{c.time}</p>
>>>>>>> recover/cabinet-wip-from-stash
                </div>
              ))
            )}
          </div>
          {onAddComment && (
            <div className="flex gap-2">
              <Input
                placeholder="Комментарий..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="h-8 flex-1 text-[10px]"
              />
              <Button
                size="sm"
                className="h-8 text-[9px]"
                onClick={() => {
                  if (newComment.trim()) {
                    onAddComment(newComment);
                    setNewComment('');
                  }
                }}
              >
                Отправить
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

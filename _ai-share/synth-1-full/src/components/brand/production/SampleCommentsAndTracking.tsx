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
  const statusLabels = { at_factory: 'На фабрике', in_transit: 'В пути', at_brand: 'У бренда', qc: 'На проверке' };

  return (
    <div className="space-y-3">
      {tracking && (
        <Card className="rounded-xl border border-slate-100 shadow-sm p-3">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-lg bg-sky-100 text-sky-600 flex items-center justify-center">
              <Package className="h-4 w-4" />
            </div>
            <div>
              <p className="text-[10px] font-bold">{statusLabels[tracking.status]}</p>
              {tracking.eta && <p className="text-[9px] text-slate-500">ETA: {tracking.eta}</p>}
            </div>
            {onRemind && (
              <Button size="sm" variant="ghost" className="h-7 text-[9px] ml-auto" onClick={onRemind}>
                <Bell className="h-3.5 w-3.5 mr-1" /> Напомнить
              </Button>
            )}
          </div>
        </Card>
      )}
      <Card className="rounded-xl border border-slate-100 shadow-sm">
        <CardHeader className="py-2 px-4">
          <CardTitle className="text-[10px] font-black uppercase flex items-center gap-2">
            <MessageSquare className="h-4 w-4" /> Комментарии по сэмплу {skuName || skuId}
          </CardTitle>
        </CardHeader>
        <CardContent className="px-4 pb-4">
          <div className="space-y-2 max-h-40 overflow-y-auto mb-3">
            {comments.length === 0 ? (
              <p className="text-[10px] text-slate-400 py-4 text-center">Нет комментариев</p>
            ) : (
              comments.map((c) => (
                <div key={c.id} className="p-2 rounded-lg bg-slate-50 border border-slate-100">
                  <p className="text-[10px] font-bold">{c.author}</p>
                  <p className="text-[10px] text-slate-700 mt-0.5">{c.text}</p>
                  <p className="text-[9px] text-slate-400 mt-1">{c.time}</p>
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
                className="text-[10px] h-8 flex-1"
              />
              <Button size="sm" className="h-8 text-[9px]" onClick={() => { if (newComment.trim()) { onAddComment(newComment); setNewComment(''); } }}>
                Отправить
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

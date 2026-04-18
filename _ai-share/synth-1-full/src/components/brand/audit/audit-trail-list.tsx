'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { History, User, Clock, Loader2, ChevronRight } from 'lucide-react';
import { fastApiService } from '@/lib/fastapi-service';
import { cn } from '@/lib/utils';
import { useAuth } from '@/providers/auth-provider';

export default function AuditTrailList({
  entityType,
  entityId,
}: {
  entityType: string;
  entityId: string;
}) {
  const [auditLog, setAuditLog] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { profile, loading: authLoading } = useAuth();

  useEffect(() => {
    if (authLoading) return;
    if (!profile) {
      // If not loading and no profile, but in a brand section,
      // AuthProvider auto-login will eventually trigger a profile update.
      return;
    }

    async function loadAudit() {
      try {
        setIsLoading(true);
        const response = await fastApiService.getAuditTrail(entityType, entityId);
        const data = response.data || [];
        setAuditLog(Array.isArray(data) ? data : []);
      } catch (error: any) {
        console.error('Failed to load audit trail:', error);
        if (error.message?.includes('Not authenticated')) {
          setAuditLog([]);
        }
      } finally {
        setIsLoading(false);
      }
    }
    loadAudit();
  }, [entityType, entityId, profile, authLoading]);

  return (
    <div className="space-y-6">
      <header className="flex items-center gap-3">
<<<<<<< HEAD
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-900 text-white">
          <History className="h-5 w-5" />
        </div>
        <div>
          <h3 className="text-base font-black uppercase tracking-tight text-slate-900">
            Журнал изменений
          </h3>
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
=======
        <div className="bg-text-primary flex h-10 w-10 items-center justify-center rounded-2xl text-white">
          <History className="h-5 w-5" />
        </div>
        <div>
          <h3 className="text-text-primary text-base font-black uppercase tracking-tight">
            Журнал изменений
          </h3>
          <p className="text-text-muted text-[10px] font-bold uppercase tracking-widest">
>>>>>>> recover/cabinet-wip-from-stash
            Полная история правок и версионирование
          </p>
        </div>
      </header>

      {isLoading ? (
        <div className="flex justify-center py-12">
<<<<<<< HEAD
          <Loader2 className="h-8 w-8 animate-spin text-slate-300" />
        </div>
      ) : auditLog.length > 0 ? (
        <div className="relative ml-4 space-y-4 border-l-2 border-slate-100 pl-8">
          {auditLog.map((entry, i) => (
            <div key={entry.id} className="relative">
              <div className="absolute -left-[41px] top-0 z-10 h-5 w-5 rounded-full border-4 border-indigo-600 bg-white shadow-sm" />
=======
          <Loader2 className="text-text-muted h-8 w-8 animate-spin" />
        </div>
      ) : auditLog.length > 0 ? (
        <div className="border-border-subtle relative ml-4 space-y-4 border-l-2 pl-8">
          {auditLog.map((entry, i) => (
            <div key={entry.id} className="relative">
              <div className="border-accent-primary absolute -left-[41px] top-0 z-10 h-5 w-5 rounded-full border-4 bg-white shadow-sm" />
>>>>>>> recover/cabinet-wip-from-stash
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <Badge
                    className={cn(
                      'h-5 border-none px-2 text-[8px] font-black uppercase',
                      entry.action === 'create'
                        ? 'bg-emerald-50 text-emerald-600'
                        : entry.action === 'update'
<<<<<<< HEAD
                          ? 'bg-indigo-50 text-indigo-600'
=======
                          ? 'bg-accent-primary/10 text-accent-primary'
>>>>>>> recover/cabinet-wip-from-stash
                          : 'bg-rose-50 text-rose-600'
                    )}
                  >
                    {entry.action}
                  </Badge>
<<<<<<< HEAD
                  <span className="flex items-center gap-1 text-[10px] font-bold uppercase text-slate-400">
                    <Clock className="h-3 w-3" /> {new Date(entry.created_at).toLocaleString()}
                  </span>
                </div>
                <Card className="rounded-2xl border-slate-100 p-4 shadow-sm transition-shadow hover:shadow-md">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-50">
                        <User className="h-4 w-4 text-slate-400" />
                      </div>
                      <p className="text-xs font-black uppercase text-slate-900">{entry.user_id}</p>
=======
                  <span className="text-text-muted flex items-center gap-1 text-[10px] font-bold uppercase">
                    <Clock className="h-3 w-3" /> {new Date(entry.created_at).toLocaleString()}
                  </span>
                </div>
                <Card className="border-border-subtle rounded-2xl p-4 shadow-sm transition-shadow hover:shadow-md">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="bg-bg-surface2 flex h-8 w-8 items-center justify-center rounded-full">
                        <User className="text-text-muted h-4 w-4" />
                      </div>
                      <p className="text-text-primary text-xs font-black uppercase">
                        {entry.user_id}
                      </p>
>>>>>>> recover/cabinet-wip-from-stash
                    </div>
                    {entry.changes_json && (
                      <Badge
                        variant="outline"
<<<<<<< HEAD
                        className="border-slate-100 text-[7px] font-black uppercase text-slate-400"
=======
                        className="border-border-subtle text-text-muted text-[7px] font-black uppercase"
>>>>>>> recover/cabinet-wip-from-stash
                      >
                        {Object.keys(entry.changes_json).length} changes
                      </Badge>
                    )}
                  </div>
                  {entry.changes_json && (
<<<<<<< HEAD
                    <div className="mt-3 border-t border-slate-50 pt-3">
                      <pre className="overflow-x-auto rounded-lg bg-slate-50 p-2 font-mono text-[10px] text-slate-500">
=======
                    <div className="border-border-subtle mt-3 border-t pt-3">
                      <pre className="text-text-secondary bg-bg-surface2 overflow-x-auto rounded-lg p-2 font-mono text-[10px]">
>>>>>>> recover/cabinet-wip-from-stash
                        {JSON.stringify(entry.changes_json, null, 2)}
                      </pre>
                    </div>
                  )}
                </Card>
              </div>
            </div>
          ))}
        </div>
      ) : (
<<<<<<< HEAD
        <div className="rounded-xl border-2 border-dashed border-slate-100 bg-white py-12 text-center">
          <p className="text-sm italic text-slate-400">История изменений пуста.</p>
=======
        <div className="border-border-subtle rounded-xl border-2 border-dashed bg-white py-12 text-center">
          <p className="text-text-muted text-sm italic">История изменений пуста.</p>
>>>>>>> recover/cabinet-wip-from-stash
        </div>
      )}
    </div>
  );
}

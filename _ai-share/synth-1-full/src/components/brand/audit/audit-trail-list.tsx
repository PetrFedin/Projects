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
        <div className="bg-text-primary flex h-10 w-10 items-center justify-center rounded-2xl text-white">
          <History className="h-5 w-5" />
        </div>
        <div>
          <h3 className="text-text-primary text-base font-black uppercase tracking-tight">
            Журнал изменений
          </h3>
          <p className="text-text-muted text-[10px] font-bold uppercase tracking-widest">
            Полная история правок и версионирование
          </p>
        </div>
      </header>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="text-text-muted h-8 w-8 animate-spin" />
        </div>
      ) : auditLog.length > 0 ? (
        <div className="border-border-subtle relative ml-4 space-y-4 border-l-2 pl-8">
          {auditLog.map((entry, i) => (
            <div key={entry.id} className="relative">
              <div className="border-accent-primary absolute -left-[41px] top-0 z-10 h-5 w-5 rounded-full border-4 bg-white shadow-sm" />
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <Badge
                    className={cn(
                      'h-5 border-none px-2 text-[8px] font-black uppercase',
                      entry.action === 'create'
                        ? 'bg-emerald-50 text-emerald-600'
                        : entry.action === 'update'
                          ? 'bg-accent-primary/10 text-accent-primary'
                          : 'bg-rose-50 text-rose-600'
                    )}
                  >
                    {entry.action}
                  </Badge>
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
                    </div>
                    {entry.changes_json && (
                      <Badge
                        variant="outline"
                        className="border-border-subtle text-text-muted text-[7px] font-black uppercase"
                      >
                        {Object.keys(entry.changes_json).length} changes
                      </Badge>
                    )}
                  </div>
                  {entry.changes_json && (
                    <div className="border-border-subtle mt-3 border-t pt-3">
                      <pre className="text-text-secondary bg-bg-surface2 overflow-x-auto rounded-lg p-2 font-mono text-[10px]">
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
        <div className="border-border-subtle rounded-xl border-2 border-dashed bg-white py-12 text-center">
          <p className="text-text-muted text-sm italic">История изменений пуста.</p>
        </div>
      )}
    </div>
  );
}

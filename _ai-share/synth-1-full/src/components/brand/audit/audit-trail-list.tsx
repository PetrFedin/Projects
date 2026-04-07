'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { History, User, Clock, Loader2, ChevronRight } from 'lucide-react';
import { fastApiService } from '@/lib/fastapi-service';
import { cn } from '@/lib/utils';
import { useAuth } from '@/providers/auth-provider';

export default function AuditTrailList({ entityType, entityId }: { entityType: string, entityId: string }) {
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
                console.error("Failed to load audit trail:", error);
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
                <div className="h-10 w-10 rounded-2xl bg-slate-900 flex items-center justify-center text-white">
                    <History className="h-5 w-5" />
                </div>
                <div>
                    <h3 className="text-base font-black uppercase tracking-tight text-slate-900">Журнал изменений</h3>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Полная история правок и версионирование</p>
                </div>
            </header>

            {isLoading ? (
                <div className="flex justify-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-slate-300" />
                </div>
            ) : auditLog.length > 0 ? (
                <div className="relative border-l-2 border-slate-100 ml-4 pl-8 space-y-4">
                    {auditLog.map((entry, i) => (
                        <div key={entry.id} className="relative">
                            <div className="absolute -left-[41px] top-0 h-5 w-5 rounded-full bg-white border-4 border-indigo-600 shadow-sm z-10" />
                            <div className="space-y-2">
                                <div className="flex items-center gap-3">
                                    <Badge className={cn(
                                        "text-[8px] font-black uppercase px-2 h-5 border-none",
                                        entry.action === 'create' ? "bg-emerald-50 text-emerald-600" :
                                        entry.action === 'update' ? "bg-indigo-50 text-indigo-600" : "bg-rose-50 text-rose-600"
                                    )}>
                                        {entry.action}
                                    </Badge>
                                    <span className="text-[10px] text-slate-400 font-bold uppercase flex items-center gap-1">
                                        <Clock className="h-3 w-3" /> {new Date(entry.created_at).toLocaleString()}
                                    </span>
                                </div>
                                <Card className="rounded-2xl border-slate-100 shadow-sm p-4 hover:shadow-md transition-shadow">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="h-8 w-8 rounded-full bg-slate-50 flex items-center justify-center">
                                                <User className="h-4 w-4 text-slate-400" />
                                            </div>
                                            <p className="text-xs font-black uppercase text-slate-900">{entry.user_id}</p>
                                        </div>
                                        {entry.changes_json && (
                                            <Badge variant="outline" className="text-[7px] font-black uppercase border-slate-100 text-slate-400">
                                                {Object.keys(entry.changes_json).length} changes
                                            </Badge>
                                        )}
                                    </div>
                                    {entry.changes_json && (
                                        <div className="mt-3 pt-3 border-t border-slate-50">
                                            <pre className="text-[10px] text-slate-500 font-mono bg-slate-50 p-2 rounded-lg overflow-x-auto">
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
                <div className="py-12 text-center bg-white border-2 border-dashed border-slate-100 rounded-xl">
                    <p className="text-slate-400 italic text-sm">История изменений пуста.</p>
                </div>
            )}
        </div>
    );
}

'use client';

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { Users, Clock, AlertCircle, CheckCircle, Eye, Loader2 } from 'lucide-react';
import { useCollaborativeOrder } from '@/hooks/useCollaborativeOrder';
import { cn } from '@/lib/utils';

export function CollaborativeBuyingWidget() {
  const { liveCollaborators, pendingApprovals, teamBudget, recentActivity, isLoading } =
    useCollaborativeOrder();

  if (isLoading) {
    return (
      <Card className="rounded-xl border-2 border-emerald-100 shadow-xl">
        <CardContent className="flex items-center justify-center p-20">
          <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="rounded-xl border-2 border-emerald-100 shadow-xl">
      <CardHeader className="border-b border-slate-100 bg-gradient-to-r from-emerald-50 to-teal-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-600">
              <Users className="h-6 w-6 text-white" />
            </div>
            <div>
              <CardTitle className="text-sm font-black uppercase tracking-tight text-slate-900">
                Team Order Activity
              </CardTitle>
              <p className="text-[10px] font-medium text-slate-500">
                {liveCollaborators.length} members active now
              </p>
            </div>
          </div>

          <Badge className="animate-pulse bg-emerald-600 text-[7px] font-black uppercase text-white">
            🟢 LIVE
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-6 p-4">
        {/* Live Collaborators */}
        <div className="space-y-3">
          <h4 className="text-xs font-black uppercase tracking-widest text-slate-400">
            Working on Order Now
          </h4>

          <div className="space-y-2">
            {liveCollaborators.map((collab) => (
              <div
                key={collab.userId}
                className="flex items-center justify-between rounded-xl bg-slate-50 p-3"
              >
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={collab.avatar} />
                      <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-purple-500 font-bold text-white">
                        {collab.initials}
                      </AvatarFallback>
                    </Avatar>
                    <div
                      className={cn(
                        'absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-white',
                        collab.status === 'active' ? 'bg-emerald-500' : 'bg-slate-300'
                      )}
                    />
                  </div>

                  <div>
                    <p className="text-sm font-bold text-slate-900">{collab.name}</p>
                    <p className="flex items-center gap-1 text-[10px] text-slate-500">
                      <Clock className="h-3 w-3" />
                      {collab.lastAction}
                    </p>
                  </div>
                </div>

                {collab.addedItems > 0 && (
                  <div className="text-right">
                    <Badge className="border-none bg-emerald-100 text-[7px] font-black uppercase text-emerald-700">
                      +{collab.addedItems} SKU
                    </Badge>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Pending Approvals */}
        {pendingApprovals.length > 0 && (
          <div className="space-y-3 border-t border-slate-100 pt-4">
            <h4 className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-slate-400">
              <AlertCircle className="h-4 w-4 text-amber-600" />
              Requires Your Approval
            </h4>

            <div className="space-y-2">
              {pendingApprovals.map((approval) => (
                <div
                  key={approval.id}
                  className="rounded-xl border-2 border-amber-200 bg-amber-50 p-4"
                >
                  <div className="mb-3 flex items-start justify-between">
                    <div>
                      <p className="text-sm font-bold text-slate-900">{approval.title}</p>
                      <p className="mt-1 text-[10px] text-slate-600">
                        By {approval.requester} • {approval.timestamp}
                      </p>
                    </div>

                    <Badge className="bg-amber-600 text-[7px] font-black uppercase text-white">
                      {approval.itemCount} Items
                    </Badge>
                  </div>

                  <div className="flex gap-2">
                    <Button size="sm" className="h-8 flex-1 text-[8px] font-black uppercase">
                      <CheckCircle className="mr-2 h-3 w-3" />
                      Approve
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-8 flex-1 text-[8px] font-black uppercase"
                    >
                      <Eye className="mr-2 h-3 w-3" />
                      Review
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Team Budget Tracker */}
        <div className="space-y-3 border-t border-slate-100 pt-4">
          <h4 className="text-xs font-black uppercase tracking-widest text-slate-400">
            Team Budget FW26
          </h4>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-slate-600">
                {teamBudget.allocated.toLocaleString('ru-RU')} ₽
              </span>
              <span className="text-sm font-bold text-slate-400">
                / {teamBudget.total.toLocaleString('ru-RU')} ₽
              </span>
            </div>

            <Progress value={(teamBudget.allocated / teamBudget.total) * 100} className="h-3" />

            <div className="flex items-center justify-between text-[10px] font-bold">
              <span className={cn(teamBudget.remaining > 0 ? 'text-emerald-600' : 'text-rose-600')}>
                {teamBudget.remaining.toLocaleString('ru-RU')} ₽ remaining
              </span>
              <span className="text-slate-400">
                {Math.round((teamBudget.allocated / teamBudget.total) * 100)}% allocated
              </span>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        {recentActivity.length > 0 && (
          <div className="space-y-2 border-t border-slate-100 pt-4">
            <h4 className="text-xs font-black uppercase tracking-widest text-slate-400">
              Recent Changes
            </h4>

            <div className="space-y-1">
              {recentActivity.slice(0, 3).map((activity, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2 rounded-lg p-2 transition-colors hover:bg-slate-50"
                >
                  <Avatar className="h-6 w-6">
                    <AvatarImage src={activity.userAvatar} />
                    <AvatarFallback className="bg-gradient-to-br from-blue-500 to-cyan-500 text-[10px] font-bold text-white">
                      {activity.userInitials}
                    </AvatarFallback>
                  </Avatar>
                  <p className="flex-1 text-[10px] text-slate-600">
                    <strong>{activity.userName}</strong> {activity.action}
                  </p>
                  <span className="text-[9px] tabular-nums text-slate-400">{activity.time}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

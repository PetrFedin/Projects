'use client';

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { 
  Users, 
  Clock, 
  AlertCircle,
  CheckCircle,
  Eye,
  Loader2
} from 'lucide-react';
import { useCollaborativeOrder } from '@/hooks/useCollaborativeOrder';
import { cn } from '@/lib/utils';

export function CollaborativeBuyingWidget() {
  const {
    liveCollaborators,
    pendingApprovals,
    teamBudget,
    recentActivity,
    isLoading
  } = useCollaborativeOrder();
  
  if (isLoading) {
    return (
      <Card className="border-2 border-emerald-100 shadow-xl rounded-xl">
        <CardContent className="p-20 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card className="border-2 border-emerald-100 shadow-xl rounded-xl">
      <CardHeader className="border-b border-slate-100 bg-gradient-to-r from-emerald-50 to-teal-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-xl bg-emerald-600 flex items-center justify-center">
              <Users className="h-6 w-6 text-white" />
            </div>
            <div>
              <CardTitle className="text-sm font-black uppercase tracking-tight text-slate-900">
                Team Order Activity
              </CardTitle>
              <p className="text-[10px] text-slate-500 font-medium">
                {liveCollaborators.length} members active now
              </p>
            </div>
          </div>
          
          <Badge className="bg-emerald-600 text-white text-[7px] font-black uppercase animate-pulse">
            🟢 LIVE
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="p-4 space-y-6">
        {/* Live Collaborators */}
        <div className="space-y-3">
          <h4 className="text-xs font-black uppercase tracking-widest text-slate-400">
            Working on Order Now
          </h4>
          
          <div className="space-y-2">
            {liveCollaborators.map((collab) => (
              <div 
                key={collab.userId} 
                className="flex items-center justify-between p-3 bg-slate-50 rounded-xl"
              >
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={collab.avatar} />
                      <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-purple-500 text-white font-bold">
                        {collab.initials}
                      </AvatarFallback>
                    </Avatar>
                    <div className={cn(
                      "absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-white",
                      collab.status === 'active' ? "bg-emerald-500" : "bg-slate-300"
                    )} />
                  </div>
                  
                  <div>
                    <p className="text-sm font-bold text-slate-900">
                      {collab.name}
                    </p>
                    <p className="text-[10px] text-slate-500 flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {collab.lastAction}
                    </p>
                  </div>
                </div>
                
                {collab.addedItems > 0 && (
                  <div className="text-right">
                    <Badge className="bg-emerald-100 text-emerald-700 text-[7px] font-black uppercase border-none">
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
          <div className="space-y-3 pt-4 border-t border-slate-100">
            <h4 className="text-xs font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-amber-600" />
              Requires Your Approval
            </h4>
            
            <div className="space-y-2">
              {pendingApprovals.map((approval) => (
                <div 
                  key={approval.id}
                  className="p-4 bg-amber-50 border-2 border-amber-200 rounded-xl"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="text-sm font-bold text-slate-900">
                        {approval.title}
                      </p>
                      <p className="text-[10px] text-slate-600 mt-1">
                        By {approval.requester} • {approval.timestamp}
                      </p>
                    </div>
                    
                    <Badge className="bg-amber-600 text-white text-[7px] font-black uppercase">
                      {approval.itemCount} Items
                    </Badge>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button size="sm" className="flex-1 h-8 text-[8px] font-black uppercase">
                      <CheckCircle className="mr-2 h-3 w-3" />
                      Approve
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="flex-1 h-8 text-[8px] font-black uppercase"
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
        <div className="space-y-3 pt-4 border-t border-slate-100">
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
            
            <Progress 
              value={(teamBudget.allocated / teamBudget.total) * 100} 
              className="h-3"
            />
            
            <div className="flex items-center justify-between text-[10px] font-bold">
              <span className={cn(
                teamBudget.remaining > 0 ? "text-emerald-600" : "text-rose-600"
              )}>
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
          <div className="space-y-2 pt-4 border-t border-slate-100">
            <h4 className="text-xs font-black uppercase tracking-widest text-slate-400">
              Recent Changes
            </h4>
            
            <div className="space-y-1">
              {recentActivity.slice(0, 3).map((activity, i) => (
                <div key={i} className="flex items-center gap-2 p-2 rounded-lg hover:bg-slate-50 transition-colors">
                  <Avatar className="h-6 w-6">
                    <AvatarImage src={activity.userAvatar} />
                    <AvatarFallback className="bg-gradient-to-br from-blue-500 to-cyan-500 text-white text-[10px] font-bold">
                      {activity.userInitials}
                    </AvatarFallback>
                  </Avatar>
                  <p className="text-[10px] text-slate-600 flex-1">
                    <strong>{activity.userName}</strong> {activity.action}
                  </p>
                  <span className="text-[9px] text-slate-400 tabular-nums">
                    {activity.time}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

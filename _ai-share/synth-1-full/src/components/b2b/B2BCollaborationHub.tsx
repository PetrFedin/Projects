'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutGrid, 
  CheckSquare, 
  Calendar as CalendarIcon, 
  MessageCircle, 
  Plus, 
  Clock, 
  AlertCircle,
  ChevronRight,
  Filter,
  Search,
  User,
  Paperclip,
  Send,
  MoreVertical,
  Activity,
  Archive,
  Flag
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useUIState } from '@/providers/ui-state';
import { useB2BState } from '@/providers/b2b-state';
import { cn } from '@/lib/cn';

export function B2BCollaborationHub() {
  const { viewRole } = useUIState();
  const { b2bTasks, updateB2bTask, b2bEvents, b2bMessages, sendB2bMessage } = useB2BState();
  const [activeTab, setActiveTab] = useState<'tasks' | 'calendar' | 'messages'>('tasks');
  const [messageInput, setMessageMessageInput] = useState("");

  const getPriorityColor = (p: string) => {
    switch(p) {
      case 'critical': return 'bg-rose-100 text-rose-600';
      case 'high': return 'bg-amber-100 text-amber-600';
      case 'medium': return 'bg-blue-100 text-blue-600';
      default: return 'bg-slate-100 text-slate-600';
    }
  };

  return (
    <div className="space-y-4 p-4 bg-slate-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-3">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-xl bg-slate-900 flex items-center justify-center">
              <Activity className="h-4 w-4 text-white" />
            </div>
            <Badge variant="outline" className="border-slate-200 text-slate-900 uppercase font-black tracking-widest text-[9px]">
              WORKSPACE_v5.0
            </Badge>
          </div>
          <h2 className="text-sm md:text-sm font-black uppercase tracking-tighter text-slate-900 leading-none">
            Collaboration Hub
          </h2>
          <p className="text-slate-400 font-medium text-xs max-w-md text-left">
            Unified workspace for task management, internal & partner communication, and global scheduling across the supply chain.
          </p>
        </div>

        <div className="flex items-center gap-2 p-1.5 bg-white rounded-2xl border border-slate-200 shadow-sm">
          {[
            { id: 'tasks', label: 'Tasks & Projects', icon: CheckSquare },
            { id: 'calendar', label: 'B2B Calendar', icon: CalendarIcon },
            { id: 'messages', label: 'Messaging Center', icon: MessageCircle }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                activeTab === tab.id 
                  ? "bg-slate-900 text-white shadow-xl" 
                  : "text-slate-400 hover:text-slate-600 hover:bg-slate-50"
              )}
            >
              <tab.icon className="h-3.5 w-3.5" />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3">
        <AnimatePresence mode="wait">
          {activeTab === 'tasks' && (
            <motion.div 
              key="tasks"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-3"
            >
              {/* Task Groups / Boards */}
              <div className="lg:col-span-8 space-y-6">
                 <div className="flex items-center justify-between px-2">
                    <div className="flex items-center gap-3">
                       <h3 className="text-sm font-black uppercase tracking-widest text-slate-400">Active Workflow</h3>
                       <Badge className="bg-slate-900 text-white text-[8px] font-black uppercase px-2 py-0.5">12 TOTAL</Badge>
                    </div>
                    <Button variant="outline" className="h-10 rounded-xl border-slate-200 text-[9px] font-black uppercase gap-2 bg-white">
                       <Plus className="h-3.5 w-3.5" /> New Task
                    </Button>
                 </div>

                 <div className="space-y-4">
                    {b2bTasks.map((task) => (
                      <Card key={task.id} className="group border-none shadow-xl shadow-slate-200/50 rounded-xl bg-white hover:scale-[1.01] transition-all overflow-hidden">
                        <CardContent className="p-4 flex items-center justify-between">
                           <div className="flex items-start gap-3">
                              <div 
                                onClick={() => updateB2bTask(task.id, { status: task.status === 'done' ? 'todo' : 'done' })}
                                className={cn(
                                  "h-10 w-10 rounded-2xl flex items-center justify-center border-2 cursor-pointer transition-all",
                                  task.status === 'done' ? "bg-emerald-50 border-emerald-500 text-emerald-600" : "bg-slate-50 border-slate-100 text-slate-200 hover:border-indigo-200"
                                )}
                              >
                                <CheckSquare className="h-6 w-6" />
                              </div>
                              <div className="space-y-1">
                                 <div className="flex items-center gap-3">
                                    <h4 className={cn(
                                      "text-base font-black uppercase tracking-tight",
                                      task.status === 'done' ? "text-slate-300 line-through" : "text-slate-900"
                                    )}>{task.title}</h4>
                                    <Badge className={cn("text-[8px] font-black uppercase px-2 py-0.5 border-none", getPriorityColor(task.priority))}>
                                       {task.priority}
                                    </Badge>
                                 </div>
                                 <p className="text-xs font-medium text-slate-400 max-w-md">{task.description}</p>
                                 <div className="flex items-center gap-3 pt-2">
                                    <div className="flex items-center gap-1.5 text-slate-400">
                                       <Clock className="h-3 w-3" />
                                       <span className="text-[9px] font-bold uppercase">Due {task.dueDate}</span>
                                    </div>
                                    <div className="flex items-center gap-1.5 text-slate-400">
                                       <User className="h-3 w-3" />
                                       <span className="text-[9px] font-bold uppercase">{task.assigneeId}</span>
                                    </div>
                                 </div>
                              </div>
                           </div>
                           <Button variant="ghost" size="icon" className="h-12 w-12 rounded-xl text-slate-200 hover:text-slate-900 hover:bg-slate-50">
                              <MoreVertical className="h-5 w-5" />
                           </Button>
                        </CardContent>
                      </Card>
                    ))}
                 </div>
              </div>

              {/* CRM / Activity Log Side */}
              <div className="lg:col-span-4 space-y-4">
                 <Card className="border-none shadow-2xl shadow-slate-200/50 rounded-xl bg-slate-900 text-white p-4 space-y-6">
                    <div className="flex items-center justify-between">
                       <h3 className="text-sm font-black uppercase tracking-tight">Daily Progress</h3>
                       <Badge className="bg-emerald-500 text-white border-none text-[8px] font-black px-2 py-0.5">84% READY</Badge>
                    </div>
                    <div className="space-y-4">
                       <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden shadow-inner">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: '84%' }}
                            transition={{ duration: 1.5 }}
                            className="h-full bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.5)]" 
                          />
                       </div>
                       <p className="text-[10px] font-medium text-white/50 leading-relaxed uppercase">
                         You have completed 5 of 6 mission-critical tasks for this delivery window.
                       </p>
                    </div>
                 </Card>

                 <Card className="border-none shadow-2xl shadow-slate-200/50 rounded-xl bg-white p-4 space-y-6">
                    <h3 className="text-sm font-black uppercase tracking-widest text-slate-900">Task Analytics</h3>
                    <div className="space-y-4">
                       {[
                         { label: 'Avg. Response Time', val: '2.4h', trend: '-12%', icon: Clock },
                         { label: 'Project Velocity', val: '92%', trend: '+5%', icon: Activity }
                       ].map((s, i) => (
                         <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-slate-50">
                            <div className="flex items-center gap-3">
                               <div className="h-8 w-8 rounded-lg bg-white flex items-center justify-center shadow-sm">
                                  <s.icon className="h-4 w-4 text-indigo-600" />
                               </div>
                               <span className="text-[10px] font-black uppercase text-slate-400">{s.label}</span>
                            </div>
                            <div className="text-right">
                               <p className="text-sm font-black text-slate-900">{s.val}</p>
                               <p className="text-[8px] font-bold text-emerald-600">{s.trend}</p>
                            </div>
                         </div>
                       ))}
                    </div>
                 </Card>
              </div>
            </motion.div>
          )}

          {activeTab === 'calendar' && (
            <motion.div 
              key="calendar"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-3"
            >
               <div className="lg:col-span-9">
                  <Card className="border-none shadow-2xl shadow-slate-200/50 rounded-xl bg-white overflow-hidden p-3">
                     <div className="flex items-center justify-between mb-10">
                        <div className="flex items-center gap-3">
                           <h3 className="text-base font-black uppercase tracking-tighter text-slate-900">February 2026</h3>
                           <div className="flex gap-2">
                              <Button variant="outline" size="icon" className="h-10 w-10 rounded-xl border-slate-100">
                                 <ChevronRight className="h-4 w-4 rotate-180" />
                              </Button>
                              <Button variant="outline" size="icon" className="h-10 w-10 rounded-xl border-slate-100">
                                 <ChevronRight className="h-4 w-4" />
                              </Button>
                           </div>
                        </div>
                        <Button className="h-12 bg-slate-900 text-white rounded-2xl px-6 font-black uppercase text-[10px] tracking-widest gap-2">
                           <Plus className="h-4 w-4" /> Add Event
                        </Button>
                     </div>

                     <div className="grid grid-cols-7 gap-px bg-slate-100 border border-slate-100 rounded-3xl overflow-hidden">
                        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(d => (
                          <div key={d} className="bg-slate-50 p-4 text-center text-[9px] font-black uppercase text-slate-400 tracking-widest border-b border-slate-100">{d}</div>
                        ))}
                        {Array.from({ length: 35 }).map((_, i) => {
                          const day = i - 2;
                          const hasEvent = b2bEvents.find(e => new Date(e.start).getDate() === day);
                          return (
                            <div key={i} className="bg-white min-h-[140px] p-4 group hover:bg-slate-50 transition-colors relative">
                               <span className={cn(
                                 "text-xs font-black",
                                 day === 10 ? "text-indigo-600 bg-indigo-50 h-6 w-6 rounded-lg flex items-center justify-center" : "text-slate-300"
                               )}>{day > 0 && day <= 28 ? day : ""}</span>
                               
                               {day > 0 && day <= 28 && hasEvent && (
                                 <div className="mt-2 p-2 rounded-xl bg-indigo-600 text-white space-y-1 shadow-lg shadow-indigo-200">
                                    <p className="text-[8px] font-black uppercase truncate">{hasEvent.title}</p>
                                    <p className="text-[7px] font-medium opacity-70">10:00 - 18:00</p>
                                 </div>
                               )}
                            </div>
                          );
                        })}
                     </div>
                  </Card>
               </div>

               <div className="lg:col-span-3 space-y-6">
                  <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-2">Upcoming Events</h3>
                  {b2bEvents.map((event) => (
                    <Card key={event.id} className="border-none shadow-xl rounded-xl bg-white p-4 border-l-4 border-indigo-500">
                       <Badge variant="outline" className="text-[7px] font-black border-indigo-100 text-indigo-600 uppercase mb-3 px-1.5">{event.type}</Badge>
                       <h4 className="text-sm font-black text-slate-900 uppercase tracking-tight mb-1">{event.title}</h4>
                       <p className="text-[10px] font-medium text-slate-400 leading-relaxed">{event.description}</p>
                       <div className="flex items-center gap-2 mt-4 text-slate-400">
                          <Clock className="h-3 w-3" />
                          <span className="text-[9px] font-bold uppercase">March 1, 2026</span>
                       </div>
                    </Card>
                  ))}
               </div>
            </motion.div>
          )}

          {activeTab === 'messages' && (
            <motion.div 
              key="messages"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-3 h-[700px]"
            >
               {/* Contact List */}
               <Card className="lg:col-span-4 border-none shadow-2xl shadow-slate-200/50 rounded-xl bg-white flex flex-col overflow-hidden">
                  <div className="p-4 border-b border-slate-50">
                     <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <Input placeholder="Search messages..." className="pl-12 h-12 rounded-2xl border-none bg-slate-50" />
                     </div>
                  </div>
                  <div className="flex-1 overflow-y-auto p-4 space-y-2">
                     {[
                       { name: 'Premium Store HQ', last: 'See you in Milan next week!', time: '2m ago', unread: 2 },
                       { name: 'Milan Concept', last: 'The PO #8821 is confirmed.', time: '1h ago', unread: 0 },
                       { name: 'Urban Elite', last: 'Sent you the new specs.', time: 'Yesterday', unread: 0 }
                     ].map((c, i) => (
                       <button key={i} className={cn(
                         "w-full flex items-center gap-3 p-4 rounded-xl transition-all",
                         i === 0 ? "bg-slate-900 text-white shadow-xl" : "hover:bg-slate-50 text-slate-900"
                       )}>
                          <div className="h-12 w-12 rounded-2xl bg-indigo-500 overflow-hidden shrink-0 border-2 border-white/10">
                             <img src={`https://i.pravatar.cc/100?img=${i+30}`} className="w-full h-full object-cover" />
                          </div>
                          <div className="flex-1 text-left min-w-0">
                             <div className="flex items-center justify-between mb-0.5">
                                <h4 className="text-xs font-black uppercase truncate">{c.name}</h4>
                                <span className={cn("text-[8px] font-bold uppercase", i === 0 ? "text-white/40" : "text-slate-400")}>{c.time}</span>
                             </div>
                             <p className={cn("text-[10px] truncate", i === 0 ? "text-white/60" : "text-slate-400")}>{c.last}</p>
                          </div>
                          {c.unread > 0 && <Badge className="bg-rose-500 text-white border-none h-5 w-5 rounded-full flex items-center justify-center p-0 text-[10px]">{c.unread}</Badge>}
                       </button>
                     ))}
                  </div>
               </Card>

               {/* Chat Area */}
               <Card className="lg:col-span-8 border-none shadow-2xl shadow-slate-200/50 rounded-xl bg-white flex flex-col overflow-hidden">
                  <div className="p-4 border-b border-slate-50 flex items-center justify-between bg-white/50 backdrop-blur-md">
                     <div className="flex items-center gap-3">
                        <div className="h-12 w-12 rounded-2xl bg-indigo-500 overflow-hidden border-2 border-slate-100">
                           <img src="https://i.pravatar.cc/100?img=30" className="w-full h-full object-cover" />
                        </div>
                        <div>
                           <h4 className="text-sm font-black uppercase tracking-tight text-slate-900">Premium Store HQ</h4>
                           <div className="flex items-center gap-2">
                              <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                              <span className="text-[8px] font-black uppercase text-slate-400 tracking-widest">Active Retailer node</span>
                           </div>
                        </div>
                     </div>
                     <div className="flex gap-2">
                        <Button variant="outline" size="icon" className="h-10 w-10 rounded-xl border-slate-100">
                           <Activity className="h-4 w-4 text-slate-400" />
                        </Button>
                        <Button variant="outline" size="icon" className="h-10 w-10 rounded-xl border-slate-100">
                           <Archive className="h-4 w-4 text-slate-400" />
                        </Button>
                     </div>
                  </div>

                  <div className="flex-1 overflow-y-auto p-3 space-y-6 bg-slate-50/30">
                     <div className="flex justify-center">
                        <Badge className="bg-slate-100 text-slate-400 border-none text-[8px] font-black uppercase tracking-widest px-3 py-1">TODAY</Badge>
                     </div>
                     
                     <div className="flex flex-col gap-1 max-w-[70%] ml-auto items-end">
                        <div className="p-4 rounded-xl rounded-tr-md bg-slate-900 text-white text-xs font-medium leading-relaxed shadow-xl">
                           Hello! Did you review the latest logistics manifest for the August delivery?
                        </div>
                        <span className="text-[8px] font-black text-slate-300 uppercase tracking-widest px-2">SENT 10:42 AM</span>
                     </div>

                     <div className="flex flex-col gap-1 max-w-[70%] mr-auto items-start">
                        <div className="p-4 rounded-xl rounded-tl-md bg-white border border-slate-100 text-slate-900 text-xs font-medium leading-relaxed shadow-sm">
                           Yes, we checked it. Everything looks good, except for the HS codes on the graphene fabrics. Can we verify them?
                        </div>
                        <span className="text-[8px] font-black text-slate-300 uppercase tracking-widest px-2">PREMIUM STORE • 10:45 AM</span>
                     </div>

                     <div className="flex flex-col gap-1 max-w-[70%] ml-auto items-end">
                        <div className="p-4 rounded-xl rounded-tr-md bg-slate-900 text-white text-xs font-medium leading-relaxed shadow-xl">
                           Sure, I'll send the tech specs to the customs gateway now. See you in Milan next week!
                        </div>
                        <span className="text-[8px] font-black text-slate-300 uppercase tracking-widest px-2">SENT 11:02 AM</span>
                     </div>
                  </div>

                  <div className="p-4 bg-white border-t border-slate-50">
                     <div className="flex gap-3 items-center bg-slate-50 p-2 rounded-xl border border-slate-100 shadow-inner">
                        <Button variant="ghost" size="icon" className="h-12 w-12 rounded-2xl text-slate-400 hover:text-indigo-600 hover:bg-white transition-all shrink-0">
                           <Paperclip className="h-5 w-5" />
                        </Button>
                        <Input 
                          placeholder="Type your secure message..." 
                          className="flex-1 border-none bg-transparent shadow-none focus-visible:ring-0 text-xs font-medium"
                          value={messageInput}
                          onChange={(e) => setMessageMessageInput(e.target.value)}
                        />
                        <Button 
                          className="h-12 w-12 rounded-2xl bg-indigo-600 text-white shadow-xl shadow-indigo-200 hover:bg-indigo-700 transition-all shrink-0 p-0"
                          onClick={() => setMessageMessageInput("")}
                        >
                           <Send className="h-5 w-5" />
                        </Button>
                     </div>
                  </div>
               </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

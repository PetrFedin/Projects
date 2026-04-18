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
  Flag,
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
  const [messageInput, setMessageMessageInput] = useState('');

  const getPriorityColor = (p: string) => {
    switch (p) {
      case 'critical':
        return 'bg-rose-100 text-rose-600';
      case 'high':
        return 'bg-amber-100 text-amber-600';
      case 'medium':
        return 'bg-blue-100 text-blue-600';
      default:
        return 'bg-bg-surface2 text-text-secondary';
    }
  };

  return (
    <div className="bg-bg-surface2 min-h-screen space-y-4 p-4">
      {/* Header */}
      <div className="flex flex-col justify-between gap-3 md:flex-row md:items-end">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="bg-text-primary flex h-8 w-8 items-center justify-center rounded-xl">
              <Activity className="h-4 w-4 text-white" />
            </div>
            <Badge
              variant="outline"
              className="border-border-default text-text-primary text-[9px] font-black uppercase tracking-widest"
            >
              WORKSPACE_v5.0
            </Badge>
          </div>
          <h2 className="text-text-primary text-sm font-black uppercase leading-none tracking-tighter md:text-sm">
            Collaboration Hub
          </h2>
          <p className="text-text-muted max-w-md text-left text-xs font-medium">
            Unified workspace for task management, internal & partner communication, and global
            scheduling across the supply chain.
          </p>
        </div>

        <div className="border-border-default flex items-center gap-2 rounded-2xl border bg-white p-1.5 shadow-sm">
          {[
            { id: 'tasks', label: 'Tasks & Projects', icon: CheckSquare },
            { id: 'calendar', label: 'B2B Calendar', icon: CalendarIcon },
            { id: 'messages', label: 'Messaging Center', icon: MessageCircle },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={cn(
                'flex items-center gap-2 rounded-xl px-4 py-2 text-[10px] font-black uppercase tracking-widest transition-all',
                activeTab === tab.id
                  ? 'bg-text-primary text-white shadow-xl'
                  : 'text-text-muted hover:text-text-secondary hover:bg-bg-surface2'
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
              className="grid grid-cols-1 gap-3 lg:grid-cols-12"
            >
              {/* Task Groups / Boards */}
              <div className="space-y-6 lg:col-span-8">
                <div className="flex items-center justify-between px-2">
                  <div className="flex items-center gap-3">
                    <h3 className="text-text-muted text-sm font-black uppercase tracking-widest">
                      Active Workflow
                    </h3>
                    <Badge className="bg-text-primary px-2 py-0.5 text-[8px] font-black uppercase text-white">
                      12 TOTAL
                    </Badge>
                  </div>
                  <Button
                    variant="outline"
                    className="border-border-default h-10 gap-2 rounded-xl bg-white text-[9px] font-black uppercase"
                  >
                    <Plus className="h-3.5 w-3.5" /> New Task
                  </Button>
                </div>

                <div className="space-y-4">
                  {b2bTasks.map((task) => (
                    <Card
                      key={task.id}
                      className="group overflow-hidden rounded-xl border-none bg-white shadow-md shadow-xl transition-all hover:scale-[1.01]"
                    >
                      <CardContent className="flex items-center justify-between p-4">
                        <div className="flex items-start gap-3">
                          <div
                            onClick={() =>
                              updateB2bTask(task.id, {
                                status: task.status === 'done' ? 'todo' : 'done',
                              })
                            }
                            className={cn(
                              'flex h-10 w-10 cursor-pointer items-center justify-center rounded-2xl border-2 transition-all',
                              task.status === 'done'
                                ? 'border-emerald-500 bg-emerald-50 text-emerald-600'
                                : 'bg-bg-surface2 border-border-subtle text-text-muted hover:border-accent-primary/30'
                            )}
                          >
                            <CheckSquare className="h-6 w-6" />
                          </div>
                          <div className="space-y-1">
                            <div className="flex items-center gap-3">
                              <h4
                                className={cn(
                                  'text-base font-black uppercase tracking-tight',
                                  task.status === 'done'
                                    ? 'text-text-muted line-through'
                                    : 'text-text-primary'
                                )}
                              >
                                {task.title}
                              </h4>
                              <Badge
                                className={cn(
                                  'border-none px-2 py-0.5 text-[8px] font-black uppercase',
                                  getPriorityColor(task.priority)
                                )}
                              >
                                {task.priority}
                              </Badge>
                            </div>
                            <p className="text-text-muted max-w-md text-xs font-medium">
                              {task.description}
                            </p>
                            <div className="flex items-center gap-3 pt-2">
                              <div className="text-text-muted flex items-center gap-1.5">
                                <Clock className="h-3 w-3" />
                                <span className="text-[9px] font-bold uppercase">
                                  Due {task.dueDate}
                                </span>
                              </div>
                              <div className="text-text-muted flex items-center gap-1.5">
                                <User className="h-3 w-3" />
                                <span className="text-[9px] font-bold uppercase">
                                  {task.assigneeId}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-text-muted hover:text-text-primary hover:bg-bg-surface2 h-12 w-12 rounded-xl"
                        >
                          <MoreVertical className="h-5 w-5" />
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              {/* CRM / Activity Log Side */}
              <div className="space-y-4 lg:col-span-4">
                <Card className="bg-text-primary space-y-6 rounded-xl border-none p-4 text-white shadow-2xl shadow-md">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-black uppercase tracking-tight">Daily Progress</h3>
                    <Badge className="border-none bg-emerald-500 px-2 py-0.5 text-[8px] font-black text-white">
                      84% READY
                    </Badge>
                  </div>
                  <div className="space-y-4">
                    <div className="h-2 w-full overflow-hidden rounded-full bg-white/10 shadow-inner">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: '84%' }}
                        transition={{ duration: 1.5 }}
                        className="h-full bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.5)]"
                      />
                    </div>
                    <p className="text-[10px] font-medium uppercase leading-relaxed text-white/50">
                      You have completed 5 of 6 mission-critical tasks for this delivery window.
                    </p>
                  </div>
                </Card>

                <Card className="space-y-6 rounded-xl border-none bg-white p-4 shadow-2xl shadow-md">
                  <h3 className="text-text-primary text-sm font-black uppercase tracking-widest">
                    Task Analytics
                  </h3>
                  <div className="space-y-4">
                    {[
                      { label: 'Avg. Response Time', val: '2.4h', trend: '-12%', icon: Clock },
                      { label: 'Project Velocity', val: '92%', trend: '+5%', icon: Activity },
                    ].map((s, i) => (
                      <div
                        key={i}
                        className="bg-bg-surface2 flex items-center justify-between rounded-2xl p-4"
                      >
                        <div className="flex items-center gap-3">
                          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white shadow-sm">
                            <s.icon className="text-accent-primary h-4 w-4" />
                          </div>
                          <span className="text-text-muted text-[10px] font-black uppercase">
                            {s.label}
                          </span>
                        </div>
                        <div className="text-right">
                          <p className="text-text-primary text-sm font-black">{s.val}</p>
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
              className="grid grid-cols-1 gap-3 lg:grid-cols-12"
            >
              <div className="lg:col-span-9">
                <Card className="overflow-hidden rounded-xl border-none bg-white p-3 shadow-2xl shadow-md">
                  <div className="mb-10 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <h3 className="text-text-primary text-base font-black uppercase tracking-tighter">
                        February 2026
                      </h3>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          className="border-border-subtle h-10 w-10 rounded-xl"
                        >
                          <ChevronRight className="h-4 w-4 rotate-180" />
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          className="border-border-subtle h-10 w-10 rounded-xl"
                        >
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <Button className="bg-text-primary h-12 gap-2 rounded-2xl px-6 text-[10px] font-black uppercase tracking-widest text-white">
                      <Plus className="h-4 w-4" /> Add Event
                    </Button>
                  </div>

                  <div className="bg-bg-surface2 border-border-subtle grid grid-cols-7 gap-px overflow-hidden rounded-3xl border">
                    {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((d) => (
                      <div
                        key={d}
                        className="bg-bg-surface2 text-text-muted border-border-subtle border-b p-4 text-center text-[9px] font-black uppercase tracking-widest"
                      >
                        {d}
                      </div>
                    ))}
                    {Array.from({ length: 35 }).map((_, i) => {
                      const day = i - 2;
                      const hasEvent = b2bEvents.find((e) => new Date(e.start).getDate() === day);
                      return (
                        <div
                          key={i}
                          className="hover:bg-bg-surface2 group relative min-h-[140px] bg-white p-4 transition-colors"
                        >
                          <span
                            className={cn(
                              'text-xs font-black',
                              day === 10
                                ? 'text-accent-primary bg-accent-primary/10 flex h-6 w-6 items-center justify-center rounded-lg'
                                : 'text-text-muted'
                            )}
                          >
                            {day > 0 && day <= 28 ? day : ''}
                          </span>

                          {day > 0 && day <= 28 && hasEvent && (
                            <div className="bg-accent-primary shadow-accent-primary/15 mt-2 space-y-1 rounded-xl p-2 text-white shadow-lg">
                              <p className="truncate text-[8px] font-black uppercase">
                                {hasEvent.title}
                              </p>
                              <p className="text-[7px] font-medium opacity-70">10:00 - 18:00</p>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </Card>
              </div>

              <div className="space-y-6 lg:col-span-3">
                <h3 className="text-text-muted px-2 text-[10px] font-black uppercase tracking-widest">
                  Upcoming Events
                </h3>
                {b2bEvents.map((event) => (
                  <Card
                    key={event.id}
                    className="border-accent-primary rounded-xl border-l-4 border-none bg-white p-4 shadow-xl"
                  >
                    <Badge
                      variant="outline"
                      className="border-accent-primary/20 text-accent-primary mb-3 px-1.5 text-[7px] font-black uppercase"
                    >
                      {event.type}
                    </Badge>
                    <h4 className="text-text-primary mb-1 text-sm font-black uppercase tracking-tight">
                      {event.title}
                    </h4>
                    <p className="text-text-muted text-[10px] font-medium leading-relaxed">
                      {event.description}
                    </p>
                    <div className="text-text-muted mt-4 flex items-center gap-2">
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
              className="grid h-[700px] grid-cols-1 gap-3 lg:grid-cols-12"
            >
              {/* Contact List */}
              <Card className="flex flex-col overflow-hidden rounded-xl border-none bg-white shadow-2xl shadow-md lg:col-span-4">
                <div className="border-border-subtle border-b p-4">
                  <div className="relative">
                    <Search className="text-text-muted absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2" />
                    <Input
                      placeholder="Search messages..."
                      className="bg-bg-surface2 h-12 rounded-2xl border-none pl-12"
                    />
                  </div>
                </div>
                <div className="flex-1 space-y-2 overflow-y-auto p-4">
                  {[
                    {
                      name: 'Premium Store HQ',
                      last: 'See you in Milan next week!',
                      time: '2m ago',
                      unread: 2,
                    },
                    {
                      name: 'Milan Concept',
                      last: 'The PO #8821 is confirmed.',
                      time: '1h ago',
                      unread: 0,
                    },
                    {
                      name: 'Urban Elite',
                      last: 'Sent you the new specs.',
                      time: 'Yesterday',
                      unread: 0,
                    },
                  ].map((c, i) => (
                    <button
                      key={i}
                      className={cn(
                        'flex w-full items-center gap-3 rounded-xl p-4 transition-all',
                        i === 0
                          ? 'bg-text-primary text-white shadow-xl'
                          : 'hover:bg-bg-surface2 text-text-primary'
                      )}
                    >
                      <div className="bg-accent-primary h-12 w-12 shrink-0 overflow-hidden rounded-2xl border-2 border-white/10">
                        <img
                          src={`https://i.pravatar.cc/100?img=${i + 30}`}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className="min-w-0 flex-1 text-left">
                        <div className="mb-0.5 flex items-center justify-between">
                          <h4 className="truncate text-xs font-black uppercase">{c.name}</h4>
                          <span
                            className={cn(
                              'text-[8px] font-bold uppercase',
                              i === 0 ? 'text-white/40' : 'text-text-muted'
                            )}
                          >
                            {c.time}
                          </span>
                        </div>
                        <p
                          className={cn(
                            'truncate text-[10px]',
                            i === 0 ? 'text-white/60' : 'text-text-muted'
                          )}
                        >
                          {c.last}
                        </p>
                      </div>
                      {c.unread > 0 && (
                        <Badge className="flex h-5 w-5 items-center justify-center rounded-full border-none bg-rose-500 p-0 text-[10px] text-white">
                          {c.unread}
                        </Badge>
                      )}
                    </button>
                  ))}
                </div>
              </Card>

              {/* Chat Area */}
              <Card className="flex flex-col overflow-hidden rounded-xl border-none bg-white shadow-2xl shadow-md lg:col-span-8">
                <div className="border-border-subtle flex items-center justify-between border-b bg-white/50 p-4 backdrop-blur-md">
                  <div className="flex items-center gap-3">
                    <div className="bg-accent-primary border-border-subtle h-12 w-12 overflow-hidden rounded-2xl border-2">
                      <img
                        src="https://i.pravatar.cc/100?img=30"
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div>
                      <h4 className="text-text-primary text-sm font-black uppercase tracking-tight">
                        Premium Store HQ
                      </h4>
                      <div className="flex items-center gap-2">
                        <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
                        <span className="text-text-muted text-[8px] font-black uppercase tracking-widest">
                          Active Retailer node
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      className="border-border-subtle h-10 w-10 rounded-xl"
                    >
                      <Activity className="text-text-muted h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      className="border-border-subtle h-10 w-10 rounded-xl"
                    >
                      <Archive className="text-text-muted h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="bg-bg-surface2/30 flex-1 space-y-6 overflow-y-auto p-3">
                  <div className="flex justify-center">
                    <Badge className="bg-bg-surface2 text-text-muted border-none px-3 py-1 text-[8px] font-black uppercase tracking-widest">
                      TODAY
                    </Badge>
                  </div>

                  <div className="ml-auto flex max-w-[70%] flex-col items-end gap-1">
                    <div className="bg-text-primary rounded-xl rounded-tr-md p-4 text-xs font-medium leading-relaxed text-white shadow-xl">
                      Hello! Did you review the latest logistics manifest for the August delivery?
                    </div>
                    <span className="text-text-muted px-2 text-[8px] font-black uppercase tracking-widest">
                      SENT 10:42 AM
                    </span>
                  </div>

                  <div className="mr-auto flex max-w-[70%] flex-col items-start gap-1">
                    <div className="border-border-subtle text-text-primary rounded-xl rounded-tl-md border bg-white p-4 text-xs font-medium leading-relaxed shadow-sm">
                      Yes, we checked it. Everything looks good, except for the HS codes on the
                      graphene fabrics. Can we verify them?
                    </div>
                    <span className="text-text-muted px-2 text-[8px] font-black uppercase tracking-widest">
                      PREMIUM STORE • 10:45 AM
                    </span>
                  </div>

                  <div className="ml-auto flex max-w-[70%] flex-col items-end gap-1">
                    <div className="bg-text-primary rounded-xl rounded-tr-md p-4 text-xs font-medium leading-relaxed text-white shadow-xl">
                      Sure, I'll send the tech specs to the customs gateway now. See you in Milan
                      next week!
                    </div>
                    <span className="text-text-muted px-2 text-[8px] font-black uppercase tracking-widest">
                      SENT 11:02 AM
                    </span>
                  </div>
                </div>

                <div className="border-border-subtle border-t bg-white p-4">
                  <div className="bg-bg-surface2 border-border-subtle flex items-center gap-3 rounded-xl border p-2 shadow-inner">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-text-muted hover:text-accent-primary h-12 w-12 shrink-0 rounded-2xl transition-all hover:bg-white"
                    >
                      <Paperclip className="h-5 w-5" />
                    </Button>
                    <Input
                      placeholder="Type your secure message..."
                      className="flex-1 border-none bg-transparent text-xs font-medium shadow-none focus-visible:ring-0"
                      value={messageInput}
                      onChange={(e) => setMessageMessageInput(e.target.value)}
                    />
                    <Button
                      className="bg-accent-primary shadow-accent-primary/15 hover:bg-accent-primary h-12 w-12 shrink-0 rounded-2xl p-0 text-white shadow-xl transition-all"
                      onClick={() => setMessageMessageInput('')}
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

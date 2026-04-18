'use client';

import dynamic from 'next/dynamic';
import { TeamManagement } from '@/components/team/TeamManagement';
import { RolePermissionsTable } from '@/components/team/RolePermissionsTable';
import { FeatureGate } from '@/components/FeatureGate';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Users,
  Activity,
  MessageSquare,
  Calendar,
  CheckCircle2,
  Clock,
  AlertCircle,
  Shield,
  BarChart3,
  TrendingUp,
  Award,
  Target,
  Zap,
} from 'lucide-react';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { RelatedModulesBlock } from '@/components/brand/RelatedModulesBlock';
import { getTeamLinks } from '@/lib/data/entity-links';

const MessagesContent = dynamic(() => import('@/app/brand/messages/page'), { ssr: false });
const CalendarContent = dynamic(() => import('@/app/brand/calendar/page'), { ssr: false });

const ORG_CHART_DATA = {
  ceo: { name: 'Александр Ветров', position: 'CEO', avatar: 'AV', team: [] },
  departments: [
    {
      head: { name: 'Елена Морозова', position: 'COO', avatar: 'EM' },
      members: [
        { name: 'Анна К.', position: 'Operations Manager', avatar: 'АК' },
        { name: 'Игорь Д.', position: 'Supply Chain Lead', avatar: 'ИД' },
      ],
    },
    {
      head: { name: 'Мария С.', position: 'CFO', avatar: 'МС' },
      members: [{ name: 'Петр В.', position: 'Financial Analyst', avatar: 'ПВ' }],
    },
    {
      head: { name: 'Дмитрий Л.', position: 'CTO', avatar: 'ДЛ' },
      members: [
        { name: 'Ольга Н.', position: 'Senior Developer', avatar: 'ОН' },
        { name: 'Сергей К.', position: 'DevOps Engineer', avatar: 'СК' },
      ],
    },
  ],
};

const VALID_TABS = [
  'directory',
  'activity',
  'tasks',
  'permissions',
  'orgchart',
  'performance',
  'messages',
  'calendar',
] as const;

export default function TeamCollaborationPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<(typeof VALID_TABS)[number]>('directory');

  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab && VALID_TABS.includes(tab as (typeof VALID_TABS)[number]))
      setActiveTab(tab as (typeof VALID_TABS)[number]);
  }, [searchParams]);

  const handleTabChange = (v: string) => {
    const tab = VALID_TABS.includes(v as (typeof VALID_TABS)[number]) ? v : 'directory';
    setActiveTab(tab as (typeof VALID_TABS)[number]);
    const params = new URLSearchParams(searchParams?.toString() || '');
    if (tab === 'directory') params.delete('tab');
    else params.set('tab', tab);
    const qs = params.toString();
    router.replace(qs ? `/brand/team?${qs}` : '/brand/team', { scroll: false });
  };

  const activities = [
    { user: 'Анна К.', action: 'Создала заказ B2B-0024', time: '5 мин назад', type: 'order' },
    { user: 'Игорь Д.', action: 'Обновил прайс-лист FW26', time: '12 мин назад', type: 'update' },
    { user: 'Мария С.', action: 'Одобрила заказ B2B-0023', time: '25 мин назад', type: 'approval' },
    { user: 'Петр В.', action: 'Добавил 12 SKU в коллекцию', time: '1ч назад', type: 'product' },
  ];

  const tasks = [
    { title: 'Согласовать заказ ЦУМ', assignee: 'CFO', priority: 'high', status: 'pending' },
    {
      title: 'Обновить размерную сетку',
      assignee: 'Анна К.',
      priority: 'medium',
      status: 'in_progress',
    },
    {
      title: 'Подготовить отчет по ESG',
      assignee: 'Мария С.',
      priority: 'low',
      status: 'completed',
    },
  ];

  const returnResolved = searchParams.get('returnResolved');

  return (
    <div className="mx-auto max-w-7xl space-y-5 px-4 pb-20 md:px-0">
      {returnResolved && (
        <div className="mb-4 rounded-lg border border-indigo-100 bg-indigo-50 p-2">
          <Link
            href={`/brand/organization?resolved=${encodeURIComponent(returnResolved)}`}
            className="flex items-center gap-1 text-[10px] font-semibold text-indigo-600 hover:text-indigo-700"
          >
            ← Вернуться в Центр управления
          </Link>
        </div>
      )}
      {/* Control Panel */}
      <div className="mb-4 flex items-center justify-end gap-3">
        <div className="flex items-center gap-1.5">
          <Badge className="h-5 border-none bg-emerald-500 px-2 text-[7px] font-black uppercase text-white">
            <span className="mr-1.5 h-1.5 w-1.5 animate-pulse rounded-full bg-white" /> 8 онлайн
          </Badge>
          <div className="mx-0.5 h-4 w-px bg-slate-200" />
          <Button
            asChild
            variant="outline"
            size="sm"
            className="h-7 rounded-lg border-slate-200 bg-white px-3 text-[7px] font-black uppercase tracking-widest text-slate-400 shadow-sm hover:bg-slate-50"
          >
            <Link href="/brand/settings">Настройки</Link>
          </Button>
        </div>

        <FeatureGate resource="team" action="create">
          <Button
            variant="default"
            size="sm"
            className="h-7 rounded-lg bg-indigo-600 px-4 text-[7px] font-black uppercase tracking-widest text-white shadow-lg shadow-indigo-100 transition-all hover:bg-indigo-700"
          >
            <Users className="mr-1 h-3 w-3" /> Пригласить участника
          </Button>
        </FeatureGate>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={handleTabChange} className="space-y-6">
        <TabsList className="h-auto rounded-2xl border border-slate-100 bg-white p-1 shadow-sm">
          <TabsTrigger
            value="directory"
            className="gap-2 rounded-xl px-6 py-3 text-[9px] font-black uppercase transition-all data-[state=active]:bg-slate-900 data-[state=active]:text-white"
          >
            <Users className="h-3.5 w-3.5" /> Команда (24)
          </TabsTrigger>
          <TabsTrigger
            value="activity"
            className="gap-2 rounded-xl px-6 py-3 text-[9px] font-black uppercase transition-all data-[state=active]:bg-slate-900 data-[state=active]:text-white"
          >
            <Activity className="h-3.5 w-3.5" /> Активность
          </TabsTrigger>
          <TabsTrigger
            value="tasks"
            className="gap-2 rounded-xl px-6 py-3 text-[9px] font-black uppercase transition-all data-[state=active]:bg-slate-900 data-[state=active]:text-white"
          >
            <CheckCircle2 className="h-3.5 w-3.5" /> Задачи (3)
          </TabsTrigger>
          <TabsTrigger
            value="permissions"
            className="gap-2 rounded-xl px-6 py-3 text-[9px] font-black uppercase transition-all data-[state=active]:bg-slate-900 data-[state=active]:text-white"
          >
            <Shield className="h-3.5 w-3.5" /> Роли и доступ
          </TabsTrigger>
          <TabsTrigger
            value="orgchart"
            className="gap-2 rounded-xl px-6 py-3 text-[9px] font-black uppercase transition-all data-[state=active]:bg-slate-900 data-[state=active]:text-white"
          >
            <Users className="h-3.5 w-3.5" /> Орг. структура
          </TabsTrigger>
          <TabsTrigger
            value="performance"
            className="gap-2 rounded-xl px-6 py-3 text-[9px] font-black uppercase transition-all data-[state=active]:bg-slate-900 data-[state=active]:text-white"
          >
            <BarChart3 className="h-3.5 w-3.5" /> Эффективность
          </TabsTrigger>
          <TabsTrigger
            value="messages"
            className="gap-2 rounded-xl px-6 py-3 text-[9px] font-black uppercase transition-all data-[state=active]:bg-slate-900 data-[state=active]:text-white"
          >
            <MessageSquare className="h-3.5 w-3.5" /> Сообщения
          </TabsTrigger>
          <TabsTrigger
            value="calendar"
            className="gap-2 rounded-xl px-6 py-3 text-[9px] font-black uppercase transition-all data-[state=active]:bg-slate-900 data-[state=active]:text-white"
          >
            <Calendar className="h-3.5 w-3.5" /> Календарь
          </TabsTrigger>
        </TabsList>

        {/* Team Directory */}
        <TabsContent value="directory" className="space-y-6">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="h-3.5 w-1 rounded-full bg-indigo-600" />
              <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
                Team Directory
              </h2>
            </div>
            <TeamManagement />
          </div>
        </TabsContent>

        {/* Activity Feed */}
        <TabsContent value="activity" className="space-y-6">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="h-3.5 w-1 rounded-full bg-emerald-600" />
              <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
                Activity Feed
              </h2>
            </div>
            <div className="space-y-4">
              {activities.map((act, i) => (
                <Card
                  key={i}
                  className="rounded-xl border-none bg-white shadow-sm transition-all hover:shadow-md"
                >
                  <CardContent className="flex items-center gap-3 p-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 text-[10px] font-black text-indigo-600">
                      {act.user
                        .split(' ')
                        .map((n) => n[0])
                        .join('')}
                    </div>
                    <div className="flex-1">
                      <p className="text-[10px] font-black uppercase text-slate-900">{act.user}</p>
                      <p className="mt-0.5 text-[9px] text-slate-600">{act.action}</p>
                    </div>
                    <span className="text-[8px] font-bold uppercase text-slate-400">
                      {act.time}
                    </span>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>

        {/* Tasks */}
        <TabsContent value="tasks" className="space-y-6">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="h-3.5 w-1 rounded-full bg-blue-600" />
              <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
                Team Tasks
              </h2>
            </div>
            <div className="space-y-4">
              {tasks.map((task, i) => (
                <Card
                  key={i}
                  className="rounded-xl border-none bg-white shadow-sm transition-all hover:shadow-md"
                >
                  <CardContent className="flex items-center gap-3 p-3">
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                        task.status === 'completed'
                          ? 'bg-emerald-100 text-emerald-600'
                          : task.status === 'in_progress'
                            ? 'bg-blue-100 text-blue-600'
                            : 'bg-amber-100 text-amber-600'
                      }`}
                    >
                      {task.status === 'completed' ? (
                        <CheckCircle2 className="h-5 w-5" />
                      ) : task.status === 'in_progress' ? (
                        <Clock className="h-5 w-5" />
                      ) : (
                        <AlertCircle className="h-5 w-5" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="text-[10px] font-black uppercase text-slate-900">
                        {task.title}
                      </p>
                      <p className="mt-0.5 text-[9px] text-slate-600">
                        Исполнитель: {task.assignee}
                      </p>
                    </div>
                    <Badge
                      className={
                        task.priority === 'high'
                          ? 'bg-rose-500 text-white'
                          : task.priority === 'medium'
                            ? 'bg-amber-500 text-white'
                            : 'bg-slate-400 text-white'
                      }
                    >
                      {task.priority}
                    </Badge>
                  </CardContent>
                </Card>
              ))}
              <Button variant="outline" asChild className="w-full rounded-xl">
                <Link href="/brand/calendar?layers=tasks">Открыть календарь задач →</Link>
              </Button>
            </div>
          </div>
        </TabsContent>

        {/* Permissions */}
        <TabsContent value="permissions" className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="h-3.5 w-1 rounded-full bg-rose-600" />
              <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
                Роли и доступ
              </h2>
            </div>
            <RolePermissionsTable />
            <p className="max-w-xl text-[9px] text-slate-500">
              Разворачивайте роли (+/−) и включайте/выключайте доступ view/edit/delete по разделам.
              Изменения пока не применяются к навигации. После фиксации списка разделов — настроим
              применение по ролям.
            </p>
          </div>
        </TabsContent>

        {/* Org Chart */}
        <TabsContent value="orgchart" className="space-y-6">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="h-3.5 w-1 rounded-full bg-indigo-600" />
              <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
                Организационная структура
              </h2>
            </div>

            <div className="space-y-4">
              {/* CEO */}
              <div className="flex justify-center">
                <Card className="w-64 rounded-2xl border-2 border-indigo-200 bg-gradient-to-br from-indigo-50 to-purple-50 shadow-lg">
                  <CardContent className="space-y-3 p-4 text-center">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-600 text-base font-black text-white">
                      {ORG_CHART_DATA.ceo.avatar}
                    </div>
                    <div>
                      <h3 className="text-sm font-black uppercase text-slate-900">
                        {ORG_CHART_DATA.ceo.name}
                      </h3>
                      <p className="mt-1 text-[10px] font-black uppercase text-indigo-600">
                        {ORG_CHART_DATA.ceo.position}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Connection Line */}
              <div className="flex justify-center">
                <div className="h-12 w-px bg-slate-200" />
              </div>

              {/* Departments */}
              <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                {ORG_CHART_DATA.departments.map((dept, i) => (
                  <div key={i} className="space-y-4">
                    {/* Department Head */}
                    <Card className="rounded-2xl border-slate-200 bg-white shadow-md">
                      <CardContent className="space-y-2 p-3 text-center">
                        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100 text-sm font-black text-emerald-600">
                          {dept.head.avatar}
                        </div>
                        <div>
                          <h4 className="text-[11px] font-black uppercase text-slate-900">
                            {dept.head.name}
                          </h4>
                          <p className="mt-1 text-[9px] font-black uppercase text-emerald-600">
                            {dept.head.position}
                          </p>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Connection Line */}
                    {dept.members.length > 0 && (
                      <div className="flex justify-center">
                        <div className="h-6 w-px bg-slate-200" />
                      </div>
                    )}

                    {/* Team Members */}
                    <div className="space-y-3">
                      {dept.members.map((member, j) => (
                        <Card
                          key={j}
                          className="rounded-xl border-slate-100 bg-slate-50 shadow-sm transition-all hover:shadow-md"
                        >
                          <CardContent className="flex items-center gap-3 p-4">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white text-[10px] font-black text-slate-600 shadow-sm">
                              {member.avatar}
                            </div>
                            <div className="min-w-0 flex-1">
                              <h5 className="truncate text-[10px] font-black uppercase text-slate-900">
                                {member.name}
                              </h5>
                              <p className="truncate text-[8px] font-bold uppercase text-slate-400">
                                {member.position}
                              </p>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Performance Tracking */}
        <TabsContent value="performance" className="space-y-6">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="h-3.5 w-1 rounded-full bg-emerald-600" />
              <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
                Team Performance
              </h2>
            </div>

            <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
              {[
                {
                  name: 'Анна К.',
                  role: 'Operations Manager',
                  tasks: 24,
                  completed: 22,
                  rating: 4.8,
                  icon: Target,
                },
                {
                  name: 'Игорь Д.',
                  role: 'Supply Chain Lead',
                  tasks: 18,
                  completed: 18,
                  rating: 5.0,
                  icon: Award,
                },
                {
                  name: 'Мария С.',
                  role: 'CFO',
                  tasks: 12,
                  completed: 11,
                  rating: 4.9,
                  icon: TrendingUp,
                },
                {
                  name: 'Петр В.',
                  role: 'Financial Analyst',
                  tasks: 31,
                  completed: 28,
                  rating: 4.7,
                  icon: BarChart3,
                },
                {
                  name: 'Ольга Н.',
                  role: 'Senior Developer',
                  tasks: 45,
                  completed: 40,
                  rating: 4.6,
                  icon: Zap,
                },
                {
                  name: 'Сергей К.',
                  role: 'DevOps Engineer',
                  tasks: 28,
                  completed: 26,
                  rating: 4.8,
                  icon: CheckCircle2,
                },
              ].map((member, i) => (
                <Card
                  key={i}
                  className="group rounded-2xl border-slate-100 bg-white shadow-sm transition-all hover:shadow-lg"
                >
                  <CardContent className="space-y-4 p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-100 text-sm font-black text-indigo-600">
                          {member.name
                            .split(' ')
                            .map((n) => n[0])
                            .join('')}
                        </div>
                        <div>
                          <h4 className="text-[11px] font-black uppercase text-slate-900">
                            {member.name}
                          </h4>
                          <p className="mt-0.5 text-[9px] font-bold uppercase text-slate-400">
                            {member.role}
                          </p>
                        </div>
                      </div>
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
                        <member.icon className="h-4 w-4" />
                      </div>
                    </div>

                    <div className="space-y-3 border-t border-slate-100 pt-3">
                      <div className="flex items-center justify-between">
                        <span className="text-[8px] font-black uppercase text-slate-400">
                          Задачи
                        </span>
                        <span className="text-sm font-black text-slate-900">
                          {member.completed}/{member.tasks}
                        </span>
                      </div>
                      <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
                        <div
                          className="h-full rounded-full bg-emerald-500 transition-all"
                          style={{ width: `${(member.completed / member.tasks) * 100}%` }}
                        />
                      </div>
                      <div className="flex items-center justify-between pt-2">
                        <span className="text-[8px] font-black uppercase text-slate-400">
                          Рейтинг
                        </span>
                        <div className="flex items-center gap-1">
                          <span className="text-sm font-black text-amber-500">{member.rating}</span>
                          <span className="text-[9px] text-slate-400">/5.0</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="h-3.5 w-1 rounded-full bg-blue-600" />
              <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
                Team Metrics
              </h2>
            </div>

            <div className="grid grid-cols-1 gap-3 md:grid-cols-4">
              {[
                {
                  label: 'Общая продуктивность',
                  value: '91%',
                  icon: TrendingUp,
                  color: 'text-emerald-600',
                  bg: 'bg-emerald-50',
                },
                {
                  label: 'Задачи в срок',
                  value: '87%',
                  icon: CheckCircle2,
                  color: 'text-blue-600',
                  bg: 'bg-blue-50',
                },
                {
                  label: 'Средний рейтинг',
                  value: '4.8',
                  icon: Award,
                  color: 'text-amber-600',
                  bg: 'bg-amber-50',
                },
                {
                  label: 'Активность',
                  value: '94%',
                  icon: Activity,
                  color: 'text-purple-600',
                  bg: 'bg-purple-50',
                },
              ].map((metric, i) => (
                <Card key={i} className="rounded-2xl border-slate-100 bg-white shadow-sm">
                  <CardContent className="space-y-3 p-3">
                    <div className="flex items-center justify-between">
                      <div
                        className={cn(
                          'flex h-10 w-10 items-center justify-center rounded-xl',
                          metric.bg
                        )}
                      >
                        <metric.icon className={cn('h-5 w-5', metric.color)} />
                      </div>
                      <span className="text-sm font-black text-slate-900">{metric.value}</span>
                    </div>
                    <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">
                      {metric.label}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="messages" className="space-y-6">
          {activeTab === 'messages' && <MessagesContent />}
        </TabsContent>

        <TabsContent value="calendar" className="space-y-6">
          {activeTab === 'calendar' && <CalendarContent />}
        </TabsContent>
      </Tabs>

      <RelatedModulesBlock links={getTeamLinks()} title="Связанные разделы" className="mt-6" />
    </div>
  );
}

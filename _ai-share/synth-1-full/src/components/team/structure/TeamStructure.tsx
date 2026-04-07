'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronRight, 
  ChevronDown, 
  User, 
  Briefcase, 
  Shield, 
  Info, 
  Plus, 
  Building2,
  Layers,
  ArrowRight,
  FileText,
  GripVertical,
  ArrowUpCircle,
  ArrowRightCircle,
  MoreHorizontal,
  Trash2,
  Settings2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent } from '@/components/ui/card';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Position {
  id: string;
  title: string;
  level: 'top' | 'middle' | 'linear';
  description: string;
  instructions: string;
  accessLevel: string;
}

interface Department {
  id: string;
  name: string;
  type: 'block' | 'department' | 'unit';
  layout: 'vertical' | 'horizontal';
  positions: Position[];
  subDepartments?: Department[];
}

const initialStructure: Department[] = [
  {
    id: 'd1',
    name: 'Управление (Global HQ)',
    type: 'block',
    layout: 'vertical',
    positions: [
      {
        id: 'p1',
        title: 'Генеральный директор',
        level: 'top',
        description: 'Стратегическое управление платформой и партнерствами.',
        instructions: '1. Утверждение годового бюджета. 2. Финализация ключевых сделок.',
        accessLevel: 'Owner / Root',
      }
    ],
    subDepartments: [
      {
        id: 'd2',
        name: 'Коммерческий департамент',
        type: 'department',
        layout: 'horizontal',
        positions: [
          {
            id: 'p2',
            title: 'Коммерческий директор',
            level: 'top',
            description: 'Управление продажами и развитием сети.',
            instructions: 'Мониторинг KPI отделов продаж.',
            accessLevel: 'Admin / Full Access',
          }
        ],
        subDepartments: [
          {
            id: 'd3',
            name: 'Отдел закупок (Buying)',
            type: 'unit',
            layout: 'vertical',
            positions: [
              {
                id: 'p3',
                title: 'Ведущий байер',
                level: 'middle',
                description: 'Формирование ассортиментных матриц.',
                instructions: 'Работа с Assortment Planning Grid.',
                accessLevel: 'Editor / Buying Tools',
              }
            ]
          },
          {
            id: 'd4',
            name: 'Отдел маркетинга',
            type: 'unit',
            layout: 'vertical',
            positions: [
              {
                id: 'p5',
                title: 'Head of Growth',
                level: 'middle',
                description: 'Масштабирование трафика.',
                instructions: 'Управление рекламными кампаниями.',
                accessLevel: 'Editor / Ads',
              }
            ]
          }
        ]
      }
    ]
  }
];

export function TeamStructure() {
  const [structure, setStructure] = useState<Department[]>(initialStructure);
  const [selectedPos, setSelectedPos] = useState<Position | null>(null);
  const [expandedDepts, setExpandedDepts] = useState<string[]>(['d1', 'd2', 'd3', 'd4']);

  const toggleDept = (id: string) => {
    setExpandedDepts(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const changeLayout = (deptId: string, layout: 'vertical' | 'horizontal') => {
    const update = (depts: Department[]): Department[] => {
      return depts.map(d => {
        if (d.id === deptId) return { ...d, layout };
        if (d.subDepartments) return { ...d, subDepartments: update(d.subDepartments) };
        return d;
      });
    };
    setStructure(update(structure));
  };

  const renderPosition = (pos: Position, isHorizontal: boolean) => (
    <motion.div 
      key={pos.id}
      layout
      className={cn(
        "group relative flex items-center gap-3 p-3 rounded-xl border transition-all cursor-pointer mb-2",
        pos.level === 'top' ? "bg-slate-900 text-white border-slate-800 shadow-lg" :
        pos.level === 'middle' ? "bg-white border-indigo-100 shadow-sm" :
        "bg-slate-50 border-slate-100",
        isHorizontal ? "w-[220px]" : "w-full"
      )}
      onClick={() => setSelectedPos(pos)}
    >
      <GripVertical className="h-3 w-3 text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity cursor-grab" />
      <div className={cn(
        "h-8 w-8 rounded-lg flex items-center justify-center shrink-0",
        pos.level === 'top' ? "bg-indigo-500 text-white" : "bg-indigo-50 text-indigo-600"
      )}>
        {pos.level === 'top' ? <Shield className="h-4 w-4" /> : <User className="h-4 w-4" />}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[10px] font-black uppercase tracking-tight truncate">{pos.title}</p>
        <p className="text-[8px] font-medium text-slate-400 truncate">{pos.accessLevel}</p>
      </div>
    </motion.div>
  );

  const renderDepartment = (dept: Department, depth = 0) => {
    const isExpanded = expandedDepts.includes(dept.id);
    const isHorizontal = dept.layout === 'horizontal';
    
    return (
      <div key={dept.id} className="space-y-3">
        <div className="flex items-center gap-2 group">
          <div 
            className={cn(
              "flex items-center gap-3 p-2.5 rounded-xl transition-all cursor-pointer flex-1",
              dept.type === 'block' ? "bg-indigo-600 text-white shadow-indigo-200 shadow-lg" : 
              dept.type === 'department' ? "bg-white border-2 border-indigo-100 text-indigo-900" :
              "bg-slate-100 border border-slate-200 text-slate-600"
            )}
            onClick={() => toggleDept(dept.id)}
          >
            {isExpanded ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
            <div className="flex items-center gap-2">
              {dept.type === 'block' ? <Building2 className="h-3.5 w-3.5" /> : <Layers className="h-3.5 w-3.5" />}
              <span className="text-[10px] font-black uppercase tracking-[0.15em]">{dept.name}</span>
            </div>
            
            <div className="ml-auto flex items-center gap-2">
              <Badge className={cn(
                "text-[7px] font-black uppercase border-none",
                dept.layout === 'horizontal' ? "bg-amber-400 text-black" : "bg-black/10 text-white"
              )}>
                {dept.layout}
              </Badge>
            </div>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl hover:bg-indigo-50">
                <Settings2 className="h-4 w-4 text-slate-400" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 rounded-2xl p-2 shadow-2xl border-none">
              <DropdownMenuLabel className="text-[9px] font-black uppercase tracking-widest text-slate-400 p-2">Конструктор связей</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => changeLayout(dept.id, 'vertical')} className="rounded-xl p-2 gap-3 cursor-pointer">
                <ArrowUpCircle className="h-4 w-4 text-indigo-500" />
                <div className="flex flex-col">
                  <span className="text-[10px] font-black uppercase">Вертикаль (Иерархия)</span>
                  <span className="text-[8px] text-slate-400">Прямое подчинение сверху вниз</span>
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => changeLayout(dept.id, 'horizontal')} className="rounded-xl p-2 gap-3 cursor-pointer">
                <ArrowRightCircle className="h-4 w-4 text-amber-500" />
                <div className="flex flex-col">
                  <span className="text-[10px] font-black uppercase">Горизонталь (Параллель)</span>
                  <span className="text-[8px] text-slate-400">Равнозначные блоки в ряд</span>
                </div>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="rounded-xl p-2 gap-3 text-rose-600 cursor-pointer">
                <Trash2 className="h-4 w-4" />
                <span className="text-[10px] font-black uppercase">Удалить узел</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <AnimatePresence>
          {isExpanded && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className={cn(
                "pt-1 pb-4",
                isHorizontal ? "flex flex-row gap-3 overflow-x-auto custom-scrollbar pb-6" : "flex flex-col space-y-4 border-l-2 border-slate-100 ml-4 pl-6"
              )}>
                {/* Positions in this level */}
                {dept.positions.length > 0 && (
                  <div className={cn("flex gap-2", isHorizontal ? "flex-row" : "flex-col")}>
                    {dept.positions.map(pos => renderPosition(pos, isHorizontal))}
                  </div>
                )}

                {/* Sub-departments */}
                {dept.subDepartments?.map(sub => renderDepartment(sub, depth + 1))}

                {/* Conditional message for Global HQ when no position is selected */}
                {dept.id === 'd1' && !selectedPos && (
                  <div className="w-full p-4 text-center space-y-3 rounded-2xl border-2 border-dashed border-indigo-200 bg-indigo-50/50 text-indigo-800 animate-in fade-in duration-700">
                    <Layers className="h-8 w-8 text-indigo-400 mx-auto" />
                    <p className="text-xs font-black uppercase tracking-widest">Настройте функционал</p>
                    <p className="text-[10px] font-medium leading-relaxed max-w-sm mx-auto">
                      Нажмите на любую должность или добавьте новый узел, чтобы настроить роли, доступы и инструкции.
                    </p>
                  </div>
                )}

                {/* Add Button */}
                <Button 
                  variant="ghost" 
                  className={cn(
                    "rounded-xl border-dashed border-slate-200 text-[8px] font-black uppercase tracking-widest gap-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-all",
                    isHorizontal ? "h-[100px] min-w-[120px] flex-col" : "w-full h-10"
                  )}
                >
                  <Plus className="h-3 w-3" />
                  <span>{isHorizontal ? "Блок" : "Узел"}</span>
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-700">
      <div className="flex justify-between items-end">
        <div className="flex flex-col gap-2">
          <h2 className="text-base font-black uppercase tracking-tighter text-slate-900 font-headline">Конструктор Архитектуры</h2>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Управляйте связями, преобладанием и параллелями подразделений</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="rounded-xl font-black uppercase text-[9px] tracking-widest h-10 px-6">
            <FileText className="h-3.5 w-3.5 mr-2" /> Шаблоны
          </Button>
          <Button className="bg-black text-white rounded-xl font-black uppercase text-[9px] tracking-widest h-10 px-6 shadow-xl">
            <Plus className="h-3.5 w-3.5 mr-2" /> Новый блок
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3">
        <div className="lg:col-span-8">
          <div className="bg-white rounded-xl border-2 border-slate-50 p-3 shadow-sm min-h-[700px]">
            <div className="space-y-4">
              {structure.map(dept => renderDepartment(dept))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-4">
          <div className="sticky top-24 space-y-6">
            <Card className="rounded-xl border-none shadow-2xl overflow-hidden bg-slate-900 text-white min-h-[500px] flex flex-col">
              {selectedPos ? (
                <div className="flex-1 flex flex-col">
                  <div className="p-4 border-b border-white/5 bg-gradient-to-br from-indigo-600/20 to-transparent">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="h-10 w-10 rounded-2xl bg-indigo-500 flex items-center justify-center shadow-2xl shadow-indigo-500/40">
                        <Briefcase className="h-7 w-7" />
                      </div>
                      <div>
                        <h3 className="text-sm font-black uppercase tracking-tight leading-none">{selectedPos.title}</h3>
                        <Badge className="bg-amber-400 text-black border-none text-[8px] font-black uppercase mt-2">
                          {selectedPos.level} management
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="space-y-1.5">
                        <p className="text-[9px] font-black uppercase text-white/30 tracking-widest">Зона ответственности</p>
                        <p className="text-xs font-medium leading-relaxed text-white/70">{selectedPos.description}</p>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 space-y-4 flex-1">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-indigo-400">
                          <FileText className="h-4 w-4" />
                          <span className="text-[10px] font-black uppercase tracking-widest">Должностная инструкция</span>
                        </div>
                        <Button variant="ghost" size="sm" className="h-6 text-[8px] font-black uppercase text-white/40 hover:text-white">Edit</Button>
                      </div>
                      <div className="p-3 rounded-2xl bg-white/5 border border-white/5 italic text-[11px] text-white/50 leading-relaxed relative overflow-hidden group">
                        <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500 opacity-50" />
                        {selectedPos.instructions}
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center gap-2 text-emerald-400">
                        <Shield className="h-4 w-4" />
                        <span className="text-[10px] font-black uppercase tracking-widest">Матрица доступов</span>
                      </div>
                      <div className="grid grid-cols-1 gap-2">
                        {[
                          { name: 'Управление SKU', status: 'full' },
                          { name: 'Финансовые отчеты', status: 'view' },
                          { name: 'Контракты', status: 'sign' }
                        ].map((right, i) => (
                          <div key={i} className="flex items-center justify-between px-4 py-3 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
                            <span className="text-[10px] font-bold text-white/60 uppercase">{right.name}</span>
                            <Badge className="bg-emerald-500/20 text-emerald-400 border-none text-[7px] font-black uppercase px-2 py-0.5">
                              {right.status}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-black/20 border-t border-white/5">
                    <Button className="w-full h-10 bg-white text-black hover:bg-indigo-50 rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-2xl transition-transform active:scale-95">
                      Синхронизировать права
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center p-4 text-center space-y-4">
                  <div className="relative">
                    <div className="h-24 w-24 rounded-xl bg-indigo-500/10 border-2 border-indigo-500/20 flex items-center justify-center animate-pulse">
                      <Layers className="h-10 w-10 text-indigo-500/40" />
                    </div>
                    <div className="absolute -bottom-2 -right-2 h-10 w-10 rounded-2xl bg-slate-800 flex items-center justify-center border-4 border-slate-900">
                      <Plus className="h-4 w-4 text-white/40" />
                    </div>
                  </div>
                  <div className="space-y-3">
                    <p className="text-sm font-black uppercase tracking-[0.2em]">Выберите должность</p>
                    <p className="text-[10px] font-medium text-white/30 leading-relaxed max-w-[200px] mx-auto">
                      Нажмите на любой узел в архитектуре слева, чтобы настроить его детали и доступы.
                    </p>
                  </div>
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

import React from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Search,
  Filter,
  Plus,
  Calendar as CalendarIcon,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { addDays, addMonths, addWeeks, endOfWeek, format, startOfWeek } from 'date-fns';
import { ru } from 'date-fns/locale';
import { CalendarState, CalendarActions, layerColor, ROLE_VISIBILITY } from '../constants';
import { cn } from '@/lib/utils';

interface CalendarHeaderProps {
  state: CalendarState;
  actions: CalendarActions;
  user: { roles?: string[] } | null | undefined;
}

function headerDateLabel(view: CalendarState['view'], currentDate: Date): string {
  if (view === 'day') {
    return format(currentDate, 'd MMMM yyyy', { locale: ru });
  }
  if (view === 'week') {
    const wk = startOfWeek(currentDate, { weekStartsOn: 1 });
    const end = endOfWeek(currentDate, { weekStartsOn: 1 });
    return `${format(wk, 'd MMM', { locale: ru })} — ${format(end, 'd MMM yyyy', { locale: ru })}`;
  }
  return format(currentDate, 'LLLL yyyy', { locale: ru });
}

export function CalendarHeader({ state, actions, user }: CalendarHeaderProps) {
  const { currentRole, view, currentDate, search, layerFilter } = state;
  const { setCurrentRole, setView, setCurrentDate, setSearch, setLayerFilter, handleOpenCreateModal } = actions;

  const step = (dir: -1 | 1) => {
    const base = new Date(currentDate);
    if (view === 'month' || view === 'list') {
      setCurrentDate(addMonths(base, dir));
    } else if (view === 'week') {
      setCurrentDate(addWeeks(base, dir));
    } else {
      setCurrentDate(addDays(base, dir));
    }
  };

  return (
    <div className="flex flex-col gap-3 mb-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1 bg-muted/50 p-1 rounded-lg">
            {(['month', 'week', 'day', 'list'] as const).map((v) => (
              <Button
                key={v}
                variant={view === v ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setView(v)}
                className="text-xs capitalize"
              >
                {v === 'month' ? 'Месяц' : v === 'week' ? 'Неделя' : v === 'day' ? 'День' : 'Список'}
              </Button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" type="button" onClick={() => step(-1)}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="min-w-[140px] md:min-w-[200px] font-semibold text-sm">
                  <CalendarIcon className="mr-2 h-4 w-4 shrink-0" />
                  <span className="truncate">{headerDateLabel(view, currentDate)}</span>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <CalendarComponent
                  mode="single"
                  selected={currentDate}
                  onSelect={(date) => date && setCurrentDate(date)}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            <Button variant="outline" size="icon" type="button" onClick={() => step(1)}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Поиск событий..."
              className="pl-9"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-4" align="end">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium leading-none">Слои</h4>
                  <Badge variant="outline" className="text-[10px]">
                    {Object.values(layerFilter).filter(Boolean).length}
                  </Badge>
                </div>
                <div className="grid gap-2">
                  {ROLE_VISIBILITY[currentRole]?.map((layer) => (
                    <div key={layer} className="flex items-center space-x-2">
                      <Switch
                        id={`filter-${layer}`}
                        checked={layerFilter[layer]}
                        onCheckedChange={(checked) =>
                          setLayerFilter((prev) => ({ ...prev, [layer]: checked }))
                        }
                      />
                      <label
                        htmlFor={`filter-${layer}`}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center gap-2"
                      >
                        <div className={cn('w-2 h-2 rounded-full', layerColor(layer))} />
                        {layer.charAt(0).toUpperCase() + layer.slice(1)}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </PopoverContent>
          </Popover>

          <Button type="button" onClick={() => handleOpenCreateModal()}>
            <Plus className="mr-2 h-4 w-4" />
            Событие
          </Button>
        </div>
      </div>

      {user?.roles && user.roles.length > 1 && (
        <div className="flex items-center gap-2">
          <Select value={currentRole} onValueChange={(v: string) => setCurrentRole(v)}>
            <SelectTrigger className="h-8 w-[160px] text-xs bg-white">
              <SelectValue placeholder="Роль" />
            </SelectTrigger>
            <SelectContent>
              {user.roles.map((role: string) => (
                <SelectItem key={role} value={role} className="text-xs uppercase font-semibold">
                  {role}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}
    </div>
  );
}

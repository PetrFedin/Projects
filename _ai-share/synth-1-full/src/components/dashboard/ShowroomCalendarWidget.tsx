'use client';

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, MapPin, Clock, Video, Users } from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';

interface ShowroomEvent {
  id: string;
  title: string;
  type: 'showroom' | 'market_week' | 'virtual' | 'meeting';
  date: string;
  location: string;
  brand?: string;
  attendees?: number;
}

export function ShowroomCalendarWidget() {
  // Mock data - в реальности из API
  const upcomingEvents: ShowroomEvent[] = [
    {
      id: '1',
      title: 'Paris Fashion Week SS26',
      type: 'market_week',
      date: '2026-02-25',
      location: 'Paris, France',
      attendees: 2400,
    },
    {
      id: '2',
      title: 'Syntha Lab Private Showroom',
      type: 'showroom',
      date: '2026-03-01',
      location: 'Milan',
      brand: 'Syntha Lab',
    },
    {
      id: '3',
      title: 'Nordic Wool Virtual Presentation',
      type: 'virtual',
      date: '2026-03-05',
      location: 'Online',
      brand: 'Nordic Wool',
    },
  ];

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'virtual':
        return Video;
      case 'showroom':
        return MapPin;
      case 'market_week':
        return Users;
      default:
        return Calendar;
    }
  };

  const getEventColor = (type: string) => {
    switch (type) {
      case 'virtual':
        return 'border-blue-200 bg-blue-50';
      case 'showroom':
        return 'border-purple-200 bg-purple-50';
      case 'market_week':
        return 'border-indigo-200 bg-indigo-50';
      default:
        return 'border-slate-200 bg-slate-50';
    }
  };

  return (
    <Card className="rounded-xl border-2 border-purple-100 shadow-xl">
      <CardHeader className="border-b border-slate-100 bg-gradient-to-r from-purple-50 to-pink-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-600">
              <Calendar className="h-6 w-6 text-white" />
            </div>
            <div>
              <CardTitle className="text-sm font-black uppercase tracking-tight text-slate-900">
                Showroom Calendar
              </CardTitle>
              <p className="text-[10px] font-medium text-slate-500">
                {upcomingEvents.length} upcoming events
              </p>
            </div>
          </div>

          <Button
            size="sm"
            variant="outline"
            className="h-9 text-[8px] font-black uppercase"
            asChild
          >
            <Link href="/shop/b2b/calendar">View All</Link>
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-3 p-4">
        {upcomingEvents.map((event) => {
          const Icon = getEventIcon(event.type);
          const eventDate = new Date(event.date);
          const daysUntil = Math.ceil((eventDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24));

          return (
            <div
              key={event.id}
              className={cn(
                'cursor-pointer rounded-xl border-2 p-4 transition-all hover:shadow-md',
                getEventColor(event.type)
              )}
            >
              <div className="flex items-start gap-3">
                <div
                  className={cn(
                    'flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg',
                    event.type === 'virtual'
                      ? 'bg-blue-200 text-blue-700'
                      : event.type === 'showroom'
                        ? 'bg-purple-200 text-purple-700'
                        : 'bg-indigo-200 text-indigo-700'
                  )}
                >
                  <Icon className="h-5 w-5" />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="mb-2 flex items-start justify-between gap-2">
                    <div>
                      <h4 className="text-sm font-black uppercase leading-tight text-slate-900">
                        {event.title}
                      </h4>
                      {event.brand && (
                        <p className="mt-1 text-[10px] text-slate-600">by {event.brand}</p>
                      )}
                    </div>

                    <Badge
                      className={cn(
                        'flex-shrink-0 border-none text-[7px] font-black uppercase',
                        daysUntil <= 7 ? 'bg-rose-500 text-white' : 'bg-slate-500 text-white'
                      )}
                    >
                      {daysUntil} days
                    </Badge>
                  </div>

                  <div className="flex items-center gap-3 text-[10px] text-slate-600">
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      <span>
                        {eventDate.toLocaleDateString('ru-RU', { month: 'short', day: 'numeric' })}
                      </span>
                    </div>

                    <div className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      <span>{event.location}</span>
                    </div>

                    {event.attendees && (
                      <div className="flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        <span>{event.attendees}+ attending</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="mt-3 flex gap-2">
                <Button size="sm" className="h-8 flex-1 text-[8px] font-black uppercase">
                  Book Slot
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="h-8 flex-1 text-[8px] font-black uppercase"
                >
                  Details
                </Button>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}

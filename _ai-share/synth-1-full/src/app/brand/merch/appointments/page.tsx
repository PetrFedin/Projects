'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { ROUTES } from '@/lib/routes';
import { loadAppointments, type ShowroomAppointmentV1 } from '@/lib/fashion/appointment-logic';
import { ArrowLeft, Calendar, Clock, Video, MapPin, CheckCircle2 } from 'lucide-react';

export default function AppointmentsPage() {
  const [list] = useState<ShowroomAppointmentV1[]>(() => loadAppointments());

  return (
    <div className="container mx-auto max-w-5xl space-y-6 px-4 py-6 pb-24">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" asChild>
          <Link href={ROUTES.brand.growthHub}>
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="flex items-center gap-2 text-xl font-bold">
            <Calendar className="h-6 w-6" />
            B2B Showroom Appointments
          </h1>
          <p className="text-sm text-muted-foreground">
            Календарь байерских сессий и виртуальных показов.
          </p>
        </div>
      </div>

      <div className="grid gap-4">
        {list.map((a) => (
          <Card key={a.id}>
            <CardHeader className="pb-2">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-base">{a.partnerName}</CardTitle>
                  <CardDescription className="mt-1 flex items-center gap-3 text-xs">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" /> {a.date}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" /> {a.time}
                    </span>
                  </CardDescription>
                </div>
                <Badge variant={a.status === 'confirmed' ? 'default' : 'secondary'}>
                  {a.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between border-t pt-2">
                <div className="flex items-center gap-2">
                  {a.type === 'virtual' ? (
                    <Badge
                      variant="outline"
                      className="gap-1 border-blue-200 bg-blue-50 text-blue-700"
                    >
                      <Video className="h-3 w-3" /> Virtual Visit
                    </Badge>
                  ) : (
                    <Badge
                      variant="outline"
                      className="gap-1 border-amber-200 bg-amber-50 text-amber-700"
                    >
                      <MapPin className="h-3 w-3" /> In-Person
                    </Badge>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="h-8 text-xs">
                    Reschedule
                  </Button>
                  <Button size="sm" className="h-8 text-xs">
                    Join Call
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

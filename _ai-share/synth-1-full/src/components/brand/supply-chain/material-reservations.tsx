'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Box, Plus, Loader2, Scissors, CheckCircle2 } from 'lucide-react';
import { fastApiService } from '@/lib/fastapi-service';
import { useToast } from '@/hooks/use-toast';

export default function MaterialReservations({ brandId }: { brandId: string }) {
  const [reservations, setReservations] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    async function loadReservations() {
      try {
        const data = await fastApiService.getReservations(brandId);
        setReservations(data);
      } catch (error) {
        console.error('Failed to load reservations:', error);
      } finally {
        setIsLoading(false);
      }
    }
    loadReservations();
  }, [brandId]);

  const handleCreateReservation = async () => {
    try {
      const newRes = await fastApiService.createReservation({
        brand_id: brandId,
        material_id: 'FABRIC-SILK-01',
        sku_id: 'DRESS-SUMMER-26',
        reserved_quantity: 45.5,
        status: 'reserved',
      });
      setReservations([newRes, ...reservations]);
      toast({ title: 'Резерв создан', description: 'Материал забронирован под артикул.' });
    } catch (error) {
      toast({ variant: 'destructive', title: 'Ошибка', description: 'Не удалось создать резерв.' });
    }
  };

  return (
    <Card className="border-border-subtle mt-8 overflow-hidden rounded-xl shadow-xl">
      <CardHeader className="bg-bg-surface2/80 flex flex-row items-center justify-between">
        <div>
          <CardTitle className="flex items-center gap-2 text-sm uppercase tracking-tight">
            <Scissors className="text-accent-primary h-4 w-4" /> Резервирование под коллекции (AI)
          </CardTitle>
          <CardDescription className="text-[10px]">
            Бронирование сырья для предотвращения дефицита при раскрое.
          </CardDescription>
        </div>
        <Button
          onClick={handleCreateReservation}
          size="sm"
          className="bg-text-primary h-8 rounded-xl text-[9px] font-black uppercase tracking-widest text-white"
        >
          <Plus className="mr-1 h-3 w-3" /> Забронировать
        </Button>
      </CardHeader>
      <CardContent className="p-0">
        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="text-text-muted h-8 w-8 animate-spin" />
          </div>
        ) : (
          <Table>
            <TableHeader className="bg-white/50">
              <TableRow>
                <TableHead className="pl-8 text-[9px] font-black uppercase">Материал</TableHead>
                <TableHead className="text-[9px] font-black uppercase">Артикул (SKU)</TableHead>
                <TableHead className="text-[9px] font-black uppercase">Количество</TableHead>
                <TableHead className="text-[9px] font-black uppercase">Статус</TableHead>
                <TableHead className="pr-8 text-right text-[9px] font-black uppercase">
                  Действие
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reservations.length > 0 ? (
                reservations.map((res) => (
                  <TableRow key={res.id} className="hover:bg-bg-surface2/80 transition-colors">
                    <TableCell className="py-4 pl-8 text-xs font-bold uppercase">
                      {res.material_id}
                    </TableCell>
                    <TableCell className="text-accent-primary font-mono text-xs">
                      {res.sku_id}
                    </TableCell>
                    <TableCell className="text-xs font-black">{res.reserved_quantity} м</TableCell>
                    <TableCell>
                      <Badge className="bg-accent-primary/10 text-accent-primary h-4 border-none text-[7px] font-black uppercase">
                        {res.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="pr-8 text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-text-muted hover:text-accent-primary h-7 rounded-lg text-[8px] font-black uppercase"
                      >
                        Списать
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="text-text-muted py-12 text-center text-xs italic"
                  >
                    Нет активных резервов материалов.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}

'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '../ui/dialog';
import { Button } from '../ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Input } from '../ui/input';
import { Checkbox } from '../ui/checkbox';
import { Badge } from '../ui/badge';
import { Search } from 'lucide-react';
import { ScrollArea } from '../ui/scroll-area';

const materials = [
  {
    id: 'mat1',
    name: 'Кашемир (смесь)',
    sku: 'MAT-CASH-01',
    type: 'Ткань',
    unit: 'м',
    stock: 150.5,
    cost: 3500,
  },
  {
    id: 'mat2',
    name: 'Пуговицы перламутровые',
    sku: 'BTN-PEARL-15',
    type: 'Фурнитура',
    unit: 'шт',
    stock: 2500,
    cost: 50,
  },
  {
    id: 'mat3',
    name: 'Органический хлопок',
    sku: 'MAT-COT-05',
    type: 'Ткань',
    unit: 'м',
    stock: 320,
    cost: 1200,
  },
  {
    id: 'mat4',
    name: 'Молния YKK #5',
    sku: 'ZIP-YKK-5N',
    type: 'Фурнитура',
    unit: 'шт',
    stock: 800,
    cost: 80,
  },
  {
    id: 'mat5',
    name: 'Шерсть мериноса',
    sku: 'MAT-MERINO-02',
    type: 'Ткань',
    unit: 'м',
    stock: 0,
    cost: 4200,
  },
];

interface MaterialsDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function MaterialsDialog({ isOpen, onOpenChange }: MaterialsDialogProps) {
  const [selected, setSelected] = useState<string[]>(['mat1', 'mat2']);

  const handleSelect = (id: string) => {
    setSelected((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="flex h-[80vh] max-w-4xl flex-col">
        <DialogHeader>
          <DialogTitle>Выбор материалов и фурнитуры</DialogTitle>
          <DialogDescription>
            Выберите компоненты из вашего склада для этого производственного заказа.
          </DialogDescription>
        </DialogHeader>
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Поиск по названию или SKU..." className="pl-8" />
        </div>
        <ScrollArea className="-mx-6 flex-1">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12"></TableHead>
                <TableHead>Название</TableHead>
                <TableHead>Тип</TableHead>
                <TableHead>На складе</TableHead>
                <TableHead>Кол-во для заказа</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {materials.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    <Checkbox
                      checked={selected.includes(item.id)}
                      onCheckedChange={() => handleSelect(item.id)}
                    />
                  </TableCell>
                  <TableCell>
                    <p className="font-medium">{item.name}</p>
                    <p className="font-mono text-xs text-muted-foreground">{item.sku}</p>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{item.type}</Badge>
                  </TableCell>
                  <TableCell>
                    {item.stock} {item.unit}
                  </TableCell>
                  <TableCell>
                    <Input
                      type="number"
                      className="h-8 w-24"
                      disabled={!selected.includes(item.id)}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ScrollArea>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Отмена
          </Button>
          <Button onClick={() => onOpenChange(false)}>Сохранить ({selected.length})</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

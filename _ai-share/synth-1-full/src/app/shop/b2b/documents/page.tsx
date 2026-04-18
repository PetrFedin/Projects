'use client';

import { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MoreHorizontal, PlusCircle, Search, Download, Upload } from 'lucide-react';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const mockDocuments = [
  {
    id: 'doc1',
    name: 'Инвойс #INV-0012-1.pdf',
    brand: 'Syntha',
    type: 'Финансовый',
    date: '2024-07-29',
    status: 'Ожидает оплаты',
  },
  {
    id: 'doc3',
    name: 'Сертификат на кашемир.pdf',
    brand: 'Syntha',
    type: 'Сертификат',
    date: '2024-07-20',
    status: 'Актуален',
  },
  {
    id: 'doc4',
    name: 'Акт сверки Q2 2024.xlsx',
    brand: 'A.P.C.',
    type: 'Финансовый',
    date: '2024-07-15',
    status: 'Согласован',
  },
];

const statusConfig: Record<string, string> = {
  'Ожидает оплаты': 'secondary',
  Подписан: 'default',
  Актуален: 'default',
  Согласован: 'default',
  Архивный: 'outline',
};

export default function DocumentsPage() {
  const [filterBrand, setFilterBrand] = useState('all');
  const [filterType, setFilterType] = useState('all');

  const brands = [...new Set(mockDocuments.map((d) => d.brand))];
  const types = [...new Set(mockDocuments.map((d) => d.type))];

  const filteredDocuments = mockDocuments.filter(
    (doc) =>
      (filterBrand === 'all' || doc.brand === filterBrand) &&
      (filterType === 'all' || doc.type === filterType)
  );

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Документы</CardTitle>
          <CardDescription>
            Все ваши счета, сертификаты и другие файлы в одном месте.
          </CardDescription>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative w-full md:max-w-xs">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Поиск по названию..." className="pl-8" />
          </div>
          <Button variant="outline">
            <Upload className="mr-2 h-4 w-4" /> Загрузить
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-4 flex gap-2">
          <Select value={filterBrand} onValueChange={setFilterBrand}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Все бренды" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Все бренды</SelectItem>
              {brands.map((b) => (
                <SelectItem key={b} value={b}>
                  {b}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Все типы" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Все типы</SelectItem>
              {types.map((t) => (
                <SelectItem key={t} value={t}>
                  {t}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Название документа</TableHead>
              <TableHead>Бренд</TableHead>
              <TableHead>Тип</TableHead>
              <TableHead>Дата</TableHead>
              <TableHead>Статус</TableHead>
              <TableHead className="text-right">Действия</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredDocuments.map((doc) => (
              <TableRow key={doc.id}>
                <TableCell className="font-medium">{doc.name}</TableCell>
                <TableCell>{doc.brand}</TableCell>
                <TableCell>
                  <Badge variant="outline">{doc.type}</Badge>
                </TableCell>
                <TableCell>{doc.date}</TableCell>
                <TableCell>
                  <Badge variant={statusConfig[doc.status] as any}>{doc.status}</Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm">
                    <Download className="mr-2 h-4 w-4" />
                    Скачать
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

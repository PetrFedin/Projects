import React from 'react';
import Link from 'next/link';
import { ArrowLeft, FileText, Ruler, Layers } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

export default function VendorTechPackPage({ params }: { params: { articleId: string } }) {
  // Mock data for the tech pack
  const article = {
    id: params.articleId,
    name: 'Худи Оверсайз Базовое',
    season: 'FW26',
    category: 'Толстовки',
    status: 'development',
  };

  const mockBom = [
    { id: '1', item: 'Футер 3-х нитка петля, 320г/м2, 100% хлопок', placement: 'Основная ткань', consumption: '1.2 м' },
    { id: '2', item: 'Кашкорсе, 95% хлопок 5% эластан', placement: 'Манжеты, пояс', consumption: '0.3 м' },
    { id: '3', item: 'Шнур хлопковый 8мм', placement: 'Капюшон', consumption: '1.5 м' },
    { id: '4', item: 'Люверс металлический 8мм', placement: 'Капюшон', consumption: '2 шт' },
  ];

  const mockMeasurements = [
    { point: 'A', description: 'Длина по спинке', s: '70', m: '72', l: '74', xl: '76', tolerance: '±1.0' },
    { point: 'B', description: 'Ширина на уровне груди', s: '58', m: '60', l: '62', xl: '64', tolerance: '±1.0' },
    { point: 'C', description: 'Длина рукава от горловины', s: '78', m: '80', l: '82', xl: '84', tolerance: '±0.5' },
  ];

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-10">
      <div className="flex items-center gap-4">
        <Link href="/vendor" className="p-2 hover:bg-bg-surface2 rounded-full text-text-secondary transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-text-primary">{article.name}</h1>
            <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-blue-100 text-blue-800 border border-blue-200">
              {article.id}
            </span>
          </div>
          <p className="text-sm text-text-secondary mt-1">
            {article.season} • {article.category}
          </p>
        </div>
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-md p-3 text-sm text-amber-800 flex items-start gap-2">
        <FileText className="w-5 h-5 shrink-0 mt-0.5 text-amber-600" />
        <div>
          <strong>Режим только для чтения.</strong> Это ограниченное представление технического задания для поставщиков. Финансовая информация и внутренние комментарии бренда скрыты.
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader className="pb-3 border-b border-border-default">
              <CardTitle className="text-base flex items-center gap-2">
                <Layers className="w-4 h-4 text-text-muted" />
                Спецификация материалов (BOM)
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader className="bg-bg-surface2">
                  <TableRow>
                    <TableHead className="text-xs h-9">Материал / Фурнитура</TableHead>
                    <TableHead className="text-xs h-9">Назначение</TableHead>
                    <TableHead className="text-xs h-9 text-right">Расход на ед.</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockBom.map((row) => (
                    <TableRow key={row.id}>
                      <TableCell className="text-sm py-3 font-medium">{row.item}</TableCell>
                      <TableCell className="text-sm py-3 text-text-secondary">{row.placement}</TableCell>
                      <TableCell className="text-sm py-3 text-right">{row.consumption}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3 border-b border-border-default">
              <CardTitle className="text-base flex items-center gap-2">
                <Ruler className="w-4 h-4 text-text-muted" />
                Таблица измерений (в см)
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0 overflow-x-auto">
              <Table>
                <TableHeader className="bg-bg-surface2">
                  <TableRow>
                    <TableHead className="text-xs h-9 w-12 text-center">Код</TableHead>
                    <TableHead className="text-xs h-9">Измерение</TableHead>
                    <TableHead className="text-xs h-9 text-center">S</TableHead>
                    <TableHead className="text-xs h-9 text-center">M</TableHead>
                    <TableHead className="text-xs h-9 text-center">L</TableHead>
                    <TableHead className="text-xs h-9 text-center">XL</TableHead>
                    <TableHead className="text-xs h-9 text-right">Допуск</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockMeasurements.map((row, idx) => (
                    <TableRow key={idx}>
                      <TableCell className="text-xs py-2 text-center font-mono font-bold bg-bg-surface2/50">{row.point}</TableCell>
                      <TableCell className="text-sm py-2">{row.description}</TableCell>
                      <TableCell className="text-sm py-2 text-center">{row.s}</TableCell>
                      <TableCell className="text-sm py-2 text-center font-bold bg-blue-50/50">{row.m}</TableCell>
                      <TableCell className="text-sm py-2 text-center">{row.l}</TableCell>
                      <TableCell className="text-sm py-2 text-center">{row.xl}</TableCell>
                      <TableCell className="text-xs py-2 text-right text-text-muted">{row.tolerance}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader className="pb-3 border-b border-border-default">
              <CardTitle className="text-base">Эскиз</CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <div className="aspect-[3/4] bg-bg-surface2 border border-border-default rounded-md flex items-center justify-center text-text-muted text-sm">
                Технический эскиз
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

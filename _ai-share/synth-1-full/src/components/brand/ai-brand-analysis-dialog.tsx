
'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardHeader, CardTitle, CardDescription as ShadcnCardDescription } from "../ui/card";
import { Lightbulb, Bot, Code, Database, Share2, ToyBrick, ShoppingCart, BarChart2, FileText, Settings, Users, GitBranch, Sparkles, Shield, DollarSign, TrendingUp, Handshake, BrainCircuit } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";

interface AiBrandAnalysisDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

const dnaData = [
    { parameter: 'Стиль', value: 'Minimalism, Urban Chic, Techwear' },
    { parameter: 'Эстетика', value: 'Монохром, чистые линии, функциональность' },
    { parameter: 'Тон коммуникации', value: 'Экспертный, сдержанный, инновационный' },
    { parameter: 'Ценностный профиль', value: 'Innovation: 60%, Sustainability: 25%, Comfort: 15%' },
    { parameter: 'AI-резюме', value: 'Syntha — это технологичный бренд, объединяющий минимализм и функциональность для современных горожан.' },
];

const visualData = [
    { parameter: 'Color Ratio', value: 'Нейтральные: 70%, Акцентные: 20%, Базовые: 10%' },
    { parameter: 'Material Distribution', value: 'Тех. ткани: 40%, Шерсть: 30%, Хлопок: 20%, Кожа: 10%' },
    { parameter: 'Product Complexity', value: 'Средний (4 SKU/коллекция, 2-3 цвета)' },
    { parameter: 'Innovation Index', value: 'Высокий (уникальные лекала, интеграция tech-элементов)' },
];

const marketData = [
    { parameter: 'AI-сегмент', value: 'Premium / Contemporary Tech' },
    { parameter: 'Средняя цена', value: '18,500 ₽' },
    { parameter: 'Margin Potential', value: '65–75% (прогноз)' },
    { parameter: 'Эластичность спроса', value: 'Низкая (аудитория ценит качество)' },
    { parameter: 'Market Position Score', value: 'Лидер в сегменте tech-minimalism на платформе' },
];

export function AiBrandAnalysisDialog({ isOpen, onOpenChange }: AiBrandAnalysisDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-sm font-bold flex items-center gap-2"><BrainCircuit /> AI-анализ бренда "Syntha"</DialogTitle>
          <DialogDescription>
            Этот отчет сгенерирован автоматически на основе данных о коллекциях, продажах, отзывах и контенте бренда.
          </DialogDescription>
        </DialogHeader>
        <div className="flex-1 min-h-0">
          <ScrollArea className="h-full pr-6">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                    <CardTitle className="text-sm">1. Брендовая идентичность (AI Brand DNA)</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[200px]">Параметр</TableHead>
                                <TableHead>Значение</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {dnaData.map(row => (
                                <TableRow key={row.parameter}>
                                    <TableCell className="font-medium">{row.parameter}</TableCell>
                                    <TableCell>{row.value}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                    <CardTitle className="text-sm">2. Визуальные и продуктовые данные</CardTitle>
                </CardHeader>
                <CardContent>
                     <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[200px]">Параметр</TableHead>
                                <TableHead>Значение</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {visualData.map(row => (
                                <TableRow key={row.parameter}>
                                    <TableCell className="font-medium">{row.parameter}</TableCell>
                                    <TableCell>{row.value}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
              </Card>
               <Card>
                <CardHeader>
                    <CardTitle className="text-sm">3. Рыночные метрики</CardTitle>
                </CardHeader>
                <CardContent>
                     <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[200px]">Параметр</TableHead>
                                <TableHead>Значение</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {marketData.map(row => (
                                <TableRow key={row.parameter}>
                                    <TableCell className="font-medium">{row.parameter}</TableCell>
                                    <TableCell>{row.value}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
              </Card>
               <Card>
                <CardHeader>
                    <CardTitle className="text-sm">4. Прогноз спроса (AI Forecast)</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground">На основе текущих трендов и данных о похожих товарах, AI прогнозирует высокий спрос на категорию "Верхняя одежда" и "Аксессуары" в следующем сезоне. Рекомендуется увеличить производство свитеров на 15%.</p>
                </CardContent>
              </Card>
               <Card>
                <CardHeader>
                    <CardTitle className="text-sm">5. Потенциал для коллабораций</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground">AI определил бренды A.P.C. и Jil Sander как наиболее близкие по стилю и аудитории, что указывает на высокий потенциал успешной коллаборации.</p>
                </CardContent>
              </Card>
            </div>
          </ScrollArea>
        </div>
        <DialogFooter>
          <Button onClick={() => onOpenChange(false)}>Закрыть</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

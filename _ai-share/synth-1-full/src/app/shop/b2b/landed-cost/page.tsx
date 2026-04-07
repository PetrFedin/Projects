'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Calculator, Globe, Ship, Truck, Info, AlertCircle, FileText, Download } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

export default function LandedCostPage() {
    const [currency, setCurrency] = useState('EUR');
    const [origin, setOrigin] = useState('Italy');
    const [transport, setTransport] = useState('truck');

    const mockItems = [
        { id: 1, name: 'Silk Dress "Verona"', sku: 'SD-VRN-01', fob: 120, qty: 50, duty: 12, shipping: 4.5, vat: 20 },
        { id: 2, name: 'Wool Coat "Milan"', sku: 'WC-MLN-05', fob: 245, qty: 30, duty: 12, shipping: 8.2, vat: 20 },
        { id: 3, name: 'Leather Bag "Tuscany"', sku: 'LB-TSN-02', fob: 180, qty: 100, duty: 15, shipping: 3.8, vat: 20 },
    ];

    const exchangeRate = currency === 'EUR' ? 102.40 : currency === 'USD' ? 94.20 : 12.85;

    const calculateLanded = (item: any) => {
        const fobInRub = item.fob * exchangeRate;
        const shippingInRub = item.shipping * exchangeRate;
        const dutyAmount = fobInRub * (item.duty / 100);
        const total = fobInRub + dutyAmount + shippingInRub;
        return {
            dutyAmount,
            landed: total,
            margin: ((45000 - total) / 45000 * 100).toFixed(1) // Assuming fixed retail price 45,000 RUB
        };
    };

    return (
        <div className="container mx-auto px-4 py-4 space-y-4">
            <header className="flex justify-between items-start">
                <div>
                    <h1 className="text-base font-black uppercase tracking-tighter text-slate-900">Landed Cost Calculator</h1>
                    <p className="text-slate-500 font-medium">Расчет полной себестоимости с учетом логистики, пошлин и налогов</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline"><Download className="mr-2 h-4 w-4" /> Экспорт отчета</Button>
                    <Button className="bg-indigo-600 hover:bg-indigo-700">Сохранить расчет</Button>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-3">
                <Card className="lg:col-span-1">
                    <CardHeader>
                        <CardTitle className="text-sm font-black uppercase flex items-center gap-2">
                            <Globe className="h-4 w-4 text-indigo-500" /> Параметры импорта
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label>Валюта закупки</Label>
                            <Select value={currency} onValueChange={setCurrency}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="EUR">EUR (€)</SelectItem>
                                    <SelectItem value="USD">USD ($)</SelectItem>
                                    <SelectItem value="CNY">CNY (¥)</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label>Страна происхождения</Label>
                            <Select value={origin} onValueChange={setOrigin}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Italy">Италия</SelectItem>
                                    <SelectItem value="France">Франция</SelectItem>
                                    <SelectItem value="China">Китай</SelectItem>
                                    <SelectItem value="Turkey">Турция</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label>Тип логистики</Label>
                            <div className="grid grid-cols-2 gap-2">
                                <Button 
                                    variant={transport === 'truck' ? 'default' : 'outline'} 
                                    className="text-[10px] font-bold"
                                    onClick={() => setTransport('truck')}
                                >
                                    <Truck className="mr-1 h-3 w-3" /> АВТО
                                </Button>
                                <Button 
                                    variant={transport === 'ship' ? 'default' : 'outline'} 
                                    className="text-[10px] font-bold"
                                    onClick={() => setTransport('ship')}
                                >
                                    <Ship className="mr-1 h-3 w-3" /> МОРЕ
                                </Button>
                            </div>
                        </div>
                        <div className="pt-4 border-t space-y-3">
                            <div className="flex justify-between text-xs">
                                <span className="text-slate-500">Курс ЦБ ({currency}/RUB):</span>
                                <span className="font-bold">{exchangeRate.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-xs">
                                <span className="text-slate-500">Страховка груза:</span>
                                <span className="font-bold text-emerald-600">0.5% (Вкл)</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="lg:col-span-3">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                            <CardTitle className="text-sm font-black uppercase">Расчет по позициям</CardTitle>
                        </div>
                        <Badge variant="outline" className="bg-indigo-50 text-indigo-700 border-indigo-100">
                            Всего позиций: {mockItems.length}
                        </Badge>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-slate-50/50">
                                    <TableHead className="text-[10px] font-black uppercase">Товар</TableHead>
                                    <TableHead className="text-[10px] font-black uppercase">FOB ({currency})</TableHead>
                                    <TableHead className="text-[10px] font-black uppercase">Пошлина (%)</TableHead>
                                    <TableHead className="text-[10px] font-black uppercase">Логистика ({currency})</TableHead>
                                    <TableHead className="text-[10px] font-black uppercase text-right">Landed (RUB)</TableHead>
                                    <TableHead className="text-[10px] font-black uppercase text-right">Маржа (Est.)</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {mockItems.map(item => {
                                    const calc = calculateLanded(item);
                                    return (
                                        <TableRow key={item.id}>
                                            <TableCell>
                                                <div className="space-y-0.5">
                                                    <p className="text-sm font-bold">{item.name}</p>
                                                    <p className="text-[10px] text-slate-400 font-mono">{item.sku}</p>
                                                </div>
                                            </TableCell>
                                            <TableCell className="font-medium">{currency === 'EUR' ? '€' : currency === 'USD' ? '$' : '¥'}{item.fob}</TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-1.5">
                                                    <span className="text-sm">{item.duty}%</span>
                                                    <TooltipProvider>
                                                        <Tooltip>
                                                            <TooltipTrigger>
                                                                <Info className="h-3 w-3 text-slate-300" />
                                                            </TooltipTrigger>
                                                            <TooltipContent>Код ТН ВЭД: 6204430000</TooltipContent>
                                                        </Tooltip>
                                                    </TooltipProvider>
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-sm text-slate-600">{currency === 'EUR' ? '€' : currency === 'USD' ? '$' : '¥'}{item.shipping}</TableCell>
                                            <TableCell className="text-right font-black text-indigo-600">
                                                {calc.landed.toLocaleString('ru-RU', { maximumFractionDigits: 0 })} ₽
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <Badge className="bg-emerald-50 text-emerald-700 border-none font-black">
                                                    {calc.margin}%
                                                </Badge>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <Card className="bg-indigo-600 text-white border-none shadow-xl shadow-indigo-100">
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 bg-white/10 rounded-lg">
                                <Calculator className="h-5 w-5" />
                            </div>
                            <span className="text-xs font-black uppercase tracking-widest opacity-80">Итого себестоимость</span>
                        </div>
                        <div className="space-y-1">
                            <p className="text-base font-black">1 420 500 ₽</p>
                            <p className="text-[10px] opacity-60 uppercase font-bold tracking-wider">Всего за 180 ед. товара</p>
                        </div>
                    </CardContent>
                </Card>
                
                <Card className="bg-slate-900 text-white border-none">
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 bg-white/10 rounded-lg">
                                <AlertCircle className="h-5 w-5 text-amber-400" />
                            </div>
                            <span className="text-xs font-black uppercase tracking-widest opacity-80">Налоги и сборы</span>
                        </div>
                        <div className="space-y-1">
                            <p className="text-base font-black">284 100 ₽</p>
                            <p className="text-[10px] opacity-60 uppercase font-bold tracking-wider">НДС (20%) + Пошлины</p>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-white border-slate-200">
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 bg-indigo-50 rounded-lg">
                                <FileText className="h-5 w-5 text-indigo-600" />
                            </div>
                            <span className="text-xs font-black uppercase tracking-widest text-slate-400">Прогноз маржинальности</span>
                        </div>
                        <div className="space-y-1">
                            <p className="text-base font-black text-slate-900">72.4%</p>
                            <p className="text-[10px] text-emerald-600 uppercase font-bold tracking-wider">На 4.2% выше среднего по сезону</p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

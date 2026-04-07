'use client';

import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { colorPalette } from "@/lib/colors";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PlusCircle, Palette, Layers } from "lucide-react";
import { Input } from "@/components/ui/input";
import { SectionInfoCard } from "@/components/brand/production/ProductionSectionEnhancements";

export default function ColorsPage() {
    return (
        <div className="space-y-4">
            <SectionInfoCard
                title="Справочник цветов"
                description="Палитра цветов для карточек товаров. Связь с Products (цвета SKU), Matrix (варианты) и PIM."
                icon={Palette}
                iconBg="bg-indigo-100"
                iconColor="text-indigo-600"
                badges={<><Badge variant="outline" className="text-[9px]">SKU Colors</Badge><Button variant="outline" size="sm" className="text-[9px] h-7 ml-1" asChild><Link href="/brand/products">Products</Link></Button><Button variant="outline" size="sm" className="text-[9px] h-7" asChild><Link href="/brand/products/matrix"><Layers className="h-3 w-3 mr-1" /> Matrix</Link></Button></>}
            />
             <header className="flex justify-between items-center">
                <div>
                    <h1 className="text-base font-bold font-headline">Справочник цветов</h1>
                    <p className="text-muted-foreground">Управление палитрой цветов, используемой на платформе.</p>
                </div>
                <Button>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Добавить цвет
                </Button>
            </header>

             <Card>
                <CardHeader>
                    <CardTitle>Основная палитра</CardTitle>
                    <CardDescription>Эти цвета доступны для выбора в карточке товара.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                        {colorPalette.map(color => (
                            <div key={color.hex} className="space-y-2">
                                <div className="h-20 w-full rounded-md border" style={{ backgroundColor: color.hex }}></div>
                                <Input value={color.name} readOnly/>
                                <Input value={color.hex} readOnly/>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

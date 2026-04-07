
'use client';

import { useUIState } from "@/providers/ui-state";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Scale, Trash2, Eye } from "lucide-react";
import Image from "next/image";
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';

export default function SavedComparisons() {
    const { savedComparisons, setIsComparisonOpen } = useUIState();

    return (
        <Card>
            <CardHeader>
                <CardTitle>Сохраненные сравнения</CardTitle>
                <CardDescription>Ваши списки сравнения товаров.</CardDescription>
            </CardHeader>
            <CardContent>
                {savedComparisons.length > 0 ? (
                    <div className="space-y-4">
                        {savedComparisons.map(comp => (
                            <div key={comp.id} className="border rounded-lg p-4 flex flex-col sm:flex-row items-start sm:items-center gap-3">
                                <div className="flex-1">
                                    <p className="font-semibold text-sm">{comp.name}</p>
                                    <p className="text-sm text-muted-foreground">
                                        {comp.items.length} товаров · Сохранено {format(new Date(comp.createdAt), "d MMM yyyy 'в' HH:mm", { locale: ru })}
                                    </p>
                                    <div className="flex -space-x-2 mt-2">
                                        {comp.items.slice(0, 5).map(item => (
                                            item.images && item.images.length > 0 && item.images[0].url && (
                                                <div key={item.id} className="relative h-8 w-8 rounded-full border-2 border-background overflow-hidden">
                                                    <Image src={item.images[0].url} alt={item.name} fill className="object-cover" />
                                                </div>
                                            )
                                        ))}
                                         {comp.items.length > 5 && (
                                            <div className="relative h-8 w-8 rounded-full border-2 border-background bg-muted flex items-center justify-center text-xs font-semibold">
                                                +{comp.items.length - 5}
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className="flex gap-2 self-start sm:self-center">
                                    <Button variant="outline" size="sm" onClick={() => setIsComparisonOpen(true)}>
                                        <Eye className="mr-2 h-4 w-4"/> Посмотреть
                                    </Button>
                                     <Button variant="destructive" size="sm">
                                        <Trash2 className="mr-2 h-4 w-4"/> Удалить
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-4 border-2 border-dashed rounded-lg bg-muted/50">
                        <Scale className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                        <h3 className="text-base font-semibold text-muted-foreground">Нет сохраненных сравнений</h3>
                        <p className="mt-2 text-muted-foreground">Вы можете сохранять списки товаров из окна сравнения.</p>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}

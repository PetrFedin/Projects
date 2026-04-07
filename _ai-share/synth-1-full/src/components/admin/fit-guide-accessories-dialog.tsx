
'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ScrollArea } from "../ui/scroll-area";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import { Skeleton } from "../ui/skeleton";
import { Loader2 } from "lucide-react";


interface FitGuideAccessoriesDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  selectedAccessory: string | null;
}

export function FitGuideAccessoriesDialog({ isOpen, onOpenChange, selectedAccessory }: FitGuideAccessoriesDialogProps) {
  const [details, setDetails] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen && selectedAccessory) {
      setIsLoading(true);
      fetch('/data/accessory-details.json')
        .then(res => res.json())
        .then(data => {
            setDetails(data[selectedAccessory as keyof typeof data] || null);
            setIsLoading(false);
        })
        .catch(err => {
            console.error("Failed to load accessory details data", err);
            setIsLoading(false);
        });
    }
  }, [isOpen, selectedAccessory]);


  if (!details && !isLoading) {
    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Информация не найдена</DialogTitle>
                    <DialogDescription>
                        Подробная информация для этого типа аксессуара отсутствует.
                    </DialogDescription>
                </DialogHeader>
                 <DialogFooter>
                    <Button onClick={() => onOpenChange(false)}>Закрыть</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
  }
  
  const sectionIcons: {[key: string]: string} = {
    '1': '⚙️', '2': '👗', '3': '🧩', '4': '🧵', '5': '🧪', '6': '🧠'
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-sm">{selectedAccessory}</DialogTitle>
          <DialogDescription>Конструктивные особенности и технический профиль</DialogDescription>
        </DialogHeader>
        <div className="flex-1 overflow-y-hidden">
            <ScrollArea className="h-full pr-6 -mr-6">
                {isLoading ? (
                    <div className="space-y-6 px-6">
                        <Skeleton className="h-48 w-full" />
                        <Skeleton className="h-64 w-full" />
                        <Skeleton className="h-32 w-full" />
                    </div>
                ) : details ? (
                <div className="px-6 space-y-6">
                    {Object.entries(details).map(([key, section]: [string, any]) => {
                    const sectionNumber = key.split('.')[0];
                    const columnHasData = (colIndex: number) => {
                        if (!section.rows) return true;
                        return section.rows.some((row: any) => {
                            const value = Object.values(row)[colIndex];
                            return value !== null && value !== undefined && value !== '';
                        });
                    };

                    return (
                        <Card key={key}>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <span className="text-sm">{sectionIcons[sectionNumber]}</span>
                                {section.title}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="overflow-x-auto">
                            {section.type === 'table' && section.headers && section.rows && (
                            <Table>
                                <TableHeader>
                                <TableRow>
                                    {section.headers.map((header: string, index: number) => (
                                    columnHasData(index) && <TableHead key={index} className="whitespace-nowrap">{header}</TableHead>
                                    ))}
                                </TableRow>
                                </TableHeader>
                                <TableBody>
                                {section.rows.map((row: any, rowIndex: number) => (
                                    <TableRow key={rowIndex}>
                                    {Object.values(row).map((cell, cellIndex) => (
                                        columnHasData(cellIndex) && <TableCell 
                                        key={cellIndex} 
                                        className={cn(cellIndex === 0 && 'font-medium', 'text-sm whitespace-nowrap')}
                                        >
                                        {cell as React.ReactNode}
                                        </TableCell>
                                    ))}
                                    </TableRow>
                                ))}
                                </TableBody>
                            </Table>
                            )}
                            {section.type === 'profile' && section.rows && (
                                <div className="space-y-2 text-sm">
                                    {section.rows.map((row: any, index: number) => (
                                        <p key={index}><strong>{row.key}:</strong> {row.value}</p>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                        </Card>
                    )
                    })}
                </div>
                 ) : (
                    <div className="flex items-center justify-center h-full">
                        <p className="text-muted-foreground">Не удалось загрузить данные.</p>
                    </div>
                )}
            </ScrollArea>
        </div>
        <DialogFooter>
            <Button onClick={() => onOpenChange(false)}>Закрыть</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

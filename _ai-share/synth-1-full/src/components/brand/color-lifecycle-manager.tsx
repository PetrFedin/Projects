
'use client';

import { useFieldArray } from "react-hook-form";
import type { ColorInfo } from "@/lib/types";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { useState, useEffect } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { CalendarIcon, ChevronDown, Copy, Trash2 } from "lucide-react";
import { Calendar } from "../ui/calendar";
import { DateRange } from "react-day-picker";
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { cn } from "@/lib/utils";
import { Input } from "../ui/input";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "../ui/collapsible";
import { useToast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";

interface ColorLifecycleManagerProps {
    control: any;
    watch: any;
    setValue: any;
}

const statusLabels = {
    in_stock: "В продаже",
    outlet: "Аутлет",
    archived: "Архив"
};

function ColorLifecycleCard({ color, index, control, watch, setValue, remove }: { color: ColorInfo, index: number, control: any, watch: any, setValue: any, remove: (index: number) => void }) {
    const [date, setDate] = useState<DateRange | undefined>(() => {
        const discounts = watch(`availableColors.${index}.discounts`);
        if (discounts && discounts[0]) {
            return {
                from: discounts[0].startDate ? new Date(discounts[0].startDate) : undefined,
                to: discounts[0].endDate ? new Date(discounts[0].endDate) : undefined,
            };
        }
        return undefined;
    });

    const lifecycleStatus = watch(`availableColors.${index}.lifecycleStatus`);

    useEffect(() => {
        if (lifecycleStatus === 'outlet') {
            setValue(`availableColors.${index}.noSale`, false);
            setValue(`availableColors.${index}.carryOver`, false);
        }
    }, [lifecycleStatus, index, setValue]);
    
    const handleDiscountChange = (field: 'percentage' | 'startDate' | 'endDate', value: any, discountIndex: number) => {
        setValue(`availableColors.${index}.discounts.${discountIndex}.${field}`, value, { shouldDirty: true });
    };

    return (
        <Collapsible defaultOpen={false} className="border rounded-lg bg-muted/30">
            <div className="p-4 w-full text-left flex items-center justify-between group">
                <CollapsibleTrigger asChild>
                     <div className="flex items-center gap-2 flex-1 cursor-pointer">
                        <div className="h-6 w-6 rounded-full border flex-shrink-0" style={{ backgroundColor: color.hex }}></div>
                        <p className="font-semibold">{color.name}</p>
                        <p className="text-xs text-muted-foreground">{statusLabels[color.lifecycleStatus]}</p>
                        <ChevronDown className="h-5 w-5 transition-transform duration-300 group-data-[state=open]:-rotate-180" />
                    </div>
                </CollapsibleTrigger>
                <Button type="button" variant="ghost" size="icon" className="h-7 w-7" onClick={() => remove(index)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
            </div>
            <CollapsibleContent>
                <div className="p-4 pt-0 space-y-4">
                    <div className="flex justify-between items-center">
                        <Label htmlFor={`status-${index}`} className="text-sm">Активен</Label>
                        <Switch id={`status-${index}`} checked={color.status === 'active'} onCheckedChange={(checked) => setValue(`availableColors.${index}.status`, checked ? 'active' : 'disabled')} />
                    </div>
                    <div className="flex justify-between items-center">
                        <Label htmlFor={`base-${index}`} className="text-sm">Базовый цвет</Label>
                        <Switch id={`base-${index}`} checked={color.isBase} onCheckedChange={(checked) => setValue(`availableColors.${index}.isBase`, checked)} />
                    </div>
                    <div className="space-y-2">
                        <Label className="text-sm">Статус</Label>
                        <RadioGroup 
                            value={lifecycleStatus}
                            onValueChange={(value) => setValue(`availableColors.${index}.lifecycleStatus`, value)} 
                            className="grid grid-cols-3 gap-2"
                        >
                            {Object.entries(statusLabels).map(([key, label]) => (
                                <div key={key}>
                                    <RadioGroupItem value={key} id={`lc-${index}-${key}`} className="sr-only peer" />
                                    <Label htmlFor={`lc-${index}-${key}`} className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-2 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary text-xs h-full">
                                        {label}
                                    </Label>
                                </div>
                            ))}
                        </RadioGroup>
                    </div>
                    {lifecycleStatus === 'outlet' && (
                        <div className="space-y-2 pt-2 border-t">
                            <Label>Скидка в аутлете</Label>
                            <div className="grid grid-cols-[1fr_2fr] gap-2 items-center">
                                <Input 
                                    type="number" 
                                    placeholder="%" 
                                    value={color.discounts?.[0]?.percentage || ''}
                                    onChange={(e) => handleDiscountChange('percentage', parseInt(e.target.value, 10) || 0, 0)}
                                />
                                <Popover>
                                    <PopoverTrigger asChild>
                                    <Button
                                        id="date"
                                        variant={"outline"}
                                        className={cn("w-full justify-start text-left font-normal", !date && "text-muted-foreground")}
                                    >
                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                        {date?.from ? (
                                        date.to ? (
                                            <>
                                            {format(date.from, "LLL dd", {locale: ru})} - {format(date.to, "LLL dd", {locale: ru})}
                                            </>
                                        ) : (
                                            format(date.from, "LLL dd", {locale: ru})
                                        )
                                        ) : (
                                        <span>Период</span>
                                        )}
                                    </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0" align="start">
                                    <Calendar
                                        initialFocus
                                        mode="range"
                                        defaultMonth={date?.from}
                                        selected={date}
                                        onSelect={(range) => {
                                            setDate(range);
                                            if (range?.from) handleDiscountChange('startDate', range.from.toISOString(), 0);
                                            if (range?.to) handleDiscountChange('endDate', range.to.toISOString(), 0);
                                        }}
                                        numberOfMonths={2}
                                        locale={ru}
                                    />
                                    </PopoverContent>
                                </Popover>
                            </div>
                        </div>
                    )}
                    <div className="grid grid-cols-2 gap-2 pt-2 border-t">
                        <div className="flex items-center gap-2">
                            <Switch id={`noSale-${index}`} checked={color.noSale} onCheckedChange={(checked) => setValue(`availableColors.${index}.noSale`, checked)} disabled={lifecycleStatus === 'outlet'} />
                            <Label htmlFor={`noSale-${index}`} className="text-xs font-normal">Не участвует в акциях</Label>
                        </div>
                        <div className="flex items-center gap-2">
                            <Switch id={`carryOver-${index}`} checked={color.carryOver} onCheckedChange={(checked) => setValue(`availableColors.${index}.carryOver`, checked)} disabled={lifecycleStatus === 'outlet'} />
                            <Label htmlFor={`carryOver-${index}`} className="text-xs font-normal">Перенести в новый сезон</Label>
                        </div>
                    </div>
                </div>
            </CollapsibleContent>
        </Collapsible>
    );
}

export default function ColorLifecycleManager({ control, watch, setValue }: ColorLifecycleManagerProps) {
    const { fields, remove } = useFieldArray({
        control,
        name: "availableColors",
    });

    const { toast } = useToast();
    const [masterColorIndex, setMasterColorIndex] = useState<string | undefined>(undefined);
    
    const handleApplyToAll = () => {
        if (masterColorIndex === undefined) {
             toast({
                variant: "destructive",
                title: "Мастер-цвет не выбран",
                description: "Пожалуйста, выберите цвет, настройки которого хотите применить.",
            });
            return;
        }
        
        const masterColorObject = (fields as any)[parseInt(masterColorIndex, 10)];
        if (!masterColorObject) return;

        // Use watch to get the current state of the master color from the form
        const allColors = watch('availableColors');
        const masterSettings = allColors[parseInt(masterColorIndex, 10)];
        
        if (!masterSettings) return;

        fields.forEach((_, index) => {
            if (index !== parseInt(masterColorIndex, 10)) {
                setValue(`availableColors.${index}.lifecycleStatus`, masterSettings.lifecycleStatus, { shouldDirty: true });
                setValue(`availableColors.${index}.noSale`, masterSettings.noSale, { shouldDirty: true });
                setValue(`availableColors.${index}.carryOver`, masterSettings.carryOver, { shouldDirty: true });
                setValue(`availableColors.${index}.status`, masterSettings.status, { shouldDirty: true });
                if (masterSettings.discounts) {
                     setValue(`availableColors.${index}.discounts`, JSON.parse(JSON.stringify(masterSettings.discounts)), { shouldDirty: true });
                } else {
                     setValue(`availableColors.${index}.discounts`, undefined, { shouldDirty: true });
                }
            }
        });
        toast({
            title: "Настройки применены",
            description: `Настройки цвета "${masterSettings.name}" применены ко всем остальным.`,
        });
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Управление цветами</CardTitle>
                <CardDescription>Настройте жизненный цикл и статусы для каждого цветового варианта.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 p-4">
                 <div className="space-y-2 p-2 border-dashed border rounded-lg">
                    <Label className="font-semibold">Общие настройки для всех цветов</Label>
                    <div className="flex gap-2">
                        <Select onValueChange={setMasterColorIndex} value={masterColorIndex}>
                            <SelectTrigger>
                                <SelectValue placeholder="Выберите мастер-цвет..." />
                            </SelectTrigger>
                            <SelectContent>
                                {(fields as any[]).map((field, index) => {
                                    const color = field as ColorInfo;
                                    return (
                                        <SelectItem key={field.id} value={String(index)}>
                                            <div className="flex items-center gap-2">
                                                <div className="h-4 w-4 rounded-full border" style={{backgroundColor: color.hex}} />
                                                {color.name}
                                            </div>
                                        </SelectItem>
                                    )
                                })}
                            </SelectContent>
                        </Select>
                        <Button size="sm" onClick={handleApplyToAll} disabled={masterColorIndex === undefined}><Copy className="mr-2 h-4 w-4" />Применить</Button>
                    </div>
                </div>
                 <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
                 {(fields as any[]).map((field, index) => (
                    <ColorLifecycleCard key={field.id} color={field as ColorInfo} index={index} control={control} watch={watch} setValue={setValue} remove={remove}/>
                 ))}
                 {fields.length === 0 && (
                     <div className="text-center text-muted-foreground p-4 border-2 border-dashed rounded-lg">
                        <p>Добавьте цвета в разделе "Размеры и остатки", чтобы управлять ими здесь.</p>
                    </div>
                 )}
                 </div>
            </CardContent>
        </Card>
    )
}

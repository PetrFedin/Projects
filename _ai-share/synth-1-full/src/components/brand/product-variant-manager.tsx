'use client';

import { useFieldArray } from 'react-hook-form';
import type { ColorInfo, SizeInfo } from '@/lib/types';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { useState, useEffect } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import {
  CalendarIcon,
  ChevronDown,
  Copy,
  Trash2,
  X,
  Image as ImageIcon,
  Shirt,
  Plus,
  Save,
  PlusCircle,
} from 'lucide-react';
import { Calendar } from '../ui/calendar';
import { DateRange } from 'react-day-picker';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { Input } from '../ui/input';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '../ui/collapsible';
import { useToast } from '@/hooks/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { FormField, FormControl, FormItem, FormLabel, FormMessage } from '../ui/form';
import Image from 'next/image';
import { UploadImageDialog } from './upload-image-dialog';
import { sizeTemplates as defaultSizeTemplates } from '@/lib/size-templates';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogClose,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog';
import { Textarea } from '../ui/textarea';

function ColorSizeGrid({
  color,
  colorIndex,
  control,
  removeColor,
  watch,
  setValue,
  masterSizes,
  colorPalette,
}: {
  color: any;
  colorIndex: number;
  control: any;
  removeColor: any;
  watch: any;
  setValue: any;
  masterSizes: SizeInfo[];
  colorPalette: { name: string; hex: string }[];
}) {
  const { fields, append, remove, update } = useFieldArray({
    control,
    name: `availableColors.${colorIndex}.sizeAvailability`,
  });

  const colorName = watch(`availableColors.${colorIndex}.name`);
  const colorHex = watch(`availableColors.${colorIndex}.hex`);

  const allImages = watch('images');
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [isPaletteOpen, setIsPaletteOpen] = useState(false);

  const handleColorSelect = (selectedColor: { name: string; hex: string }) => {
    setValue(`availableColors.${colorIndex}.name`, selectedColor.name, { shouldDirty: true });
    setValue(`availableColors.${colorIndex}.hex`, selectedColor.hex, { shouldDirty: true });
    setIsPaletteOpen(false);
  };

  const handleHexChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newHex = e.target.value;
    setValue(`availableColors.${colorIndex}.hex`, newHex, { shouldDirty: true });
    const matchingPaletteColor = colorPalette.find(
      (p) => p.hex.toLowerCase() === newHex.toLowerCase()
    );
    if (matchingPaletteColor) {
      setValue(`availableColors.${colorIndex}.name`, matchingPaletteColor.name, {
        shouldDirty: true,
      });
    }
  };

  const handleSaveImage = (dataUri: string, altText: string) => {
    const newImage = {
      id: `new-${Date.now()}`,
      url: dataUri,
      alt: altText,
      hint: 'product image',
      colorName: colorName,
    };
    const currentImages = watch('images') || [];
    setValue('images', [...currentImages, newImage]);
  };

  const handleCellChange = (
    size: string,
    field: 'status' | 'quantity' | 'preOrderDate',
    value: any
  ) => {
    const sizeIndex = fields.findIndex((f: any) => f.size === size);
    if (sizeIndex !== -1) {
      const updatedField = { ...fields[sizeIndex], [field]: value };
      update(sizeIndex, updatedField as any);
    } else {
      append({ size, [field]: value, status: field === 'quantity' ? 'in_stock' : 'pre_order' });
    }
  };

  const getStockIndicatorClass = (quantity: number | undefined) => {
    if (quantity === undefined) return '';
    if (quantity <= 5) return 'bg-red-100 dark:bg-red-900/50';
    if (quantity <= 20) return 'bg-yellow-100 dark:bg-yellow-900/50';
    return 'bg-green-100 dark:bg-green-900/50';
  };

  return (
    <>
      <Collapsible defaultOpen className="relative space-y-4 rounded-lg border bg-muted/20">
        <div className="group flex w-full items-center justify-between p-4 text-left">
          <CollapsibleTrigger asChild>
            <div className="flex flex-1 cursor-pointer items-center gap-2">
              <div
                className="h-6 w-6 flex-shrink-0 rounded-full border"
                style={{ backgroundColor: colorHex }}
              ></div>
              <p className="font-semibold">{colorName || 'Новый цвет'}</p>
              <ChevronDown className="h-5 w-5 transition-transform duration-300 group-data-[state=open]:-rotate-180" />
            </div>
          </CollapsibleTrigger>
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={(e) => {
                e.stopPropagation();
                removeColor(colorIndex);
              }}
            >
              <Trash2 className="h-4 w-4 text-destructive" />
            </Button>
          </div>
        </div>
        <CollapsibleContent>
          <div className="space-y-4 p-4 pt-0">
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
              <div className="space-y-2">
                <Label>Цвет</Label>
                <Popover open={isPaletteOpen} onOpenChange={setIsPaletteOpen}>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start font-normal">
                      <div className="flex items-center gap-2">
                        <div
                          className="h-4 w-4 rounded-full border"
                          style={{ backgroundColor: colorHex }}
                        ></div>
                        <span className="truncate">{colorName}</span>
                      </div>
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                    <div className="grid grid-cols-5 gap-1 p-2">
                      {colorPalette.map((pColor) => (
                        <Button
                          key={pColor.hex}
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 rounded-full"
                          onClick={() => handleColorSelect(pColor)}
                        >
                          <div
                            className="h-6 w-6 rounded-full border"
                            style={{ backgroundColor: pColor.hex }}
                          ></div>
                        </Button>
                      ))}
                    </div>
                    <div className="border-t p-2">
                      <Input value={colorHex} onChange={handleHexChange} />
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
              <FormField
                control={control}
                name={`availableColors.${colorIndex}.colorCode`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Код цвета</FormLabel>
                    <FormControl>
                      <Input placeholder="Напр. PANTONE 19-4052" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name={`availableColors.${colorIndex}.colorDescription`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Доп. инфо</FormLabel>
                    <FormControl>
                      <Input placeholder="Напр. глянцевый" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
            <div className="space-y-2">
              <Label>Изображения</Label>
              <div className="mt-2 grid grid-cols-4 gap-2 lg:grid-cols-6">
                {(allImages || [])
                  .filter((img: any) => img.colorName === colorName)
                  .map((image: any) => (
                    <div key={image.id} className="group relative aspect-square">
                      <Image
                        src={image.url}
                        alt={image.alt}
                        fill
                        className="rounded-md object-cover"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute -right-2 -top-2 z-10 h-6 w-6"
                        onClick={() => {
                          const updatedImages = allImages.filter((img: any) => img.id !== image.id);
                          setValue('images', updatedImages);
                        }}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                <Button
                  type="button"
                  variant="outline"
                  className="aspect-square h-full w-full"
                  onClick={() => setIsUploadDialogOpen(true)}
                >
                  <ImageIcon className="h-6 w-6 text-muted-foreground" />
                </Button>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Размеры и остатки</Label>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-1/4">Размер</TableHead>
                    <TableHead className="w-1/3">Статус</TableHead>
                    <TableHead>Кол-во / Дата</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {masterSizes.map((sizeInfo: SizeInfo) => {
                    const sizeData = (fields as any[]).find((f) => f.size === sizeInfo.name);
                    return (
                      <TableRow key={sizeInfo.name}>
                        <TableCell className="font-medium">{sizeInfo.name}</TableCell>
                        <TableCell>
                          <Select
                            value={sizeData?.status || 'out_of_stock'}
                            onValueChange={(value) =>
                              handleCellChange(sizeInfo.name, 'status', value)
                            }
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="in_stock">В наличии</SelectItem>
                              <SelectItem value="pre_order">Предзаказ</SelectItem>
                              <SelectItem value="out_of_stock">Нет в наличии</SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell>
                          {sizeData?.status === 'in_stock' && (
                            <div className="relative">
                              <Input
                                type="number"
                                value={sizeData?.quantity || ''}
                                onChange={(e) =>
                                  handleCellChange(
                                    sizeInfo.name,
                                    'quantity',
                                    parseInt(e.target.value, 10) || 0
                                  )
                                }
                                className={cn('pl-6', getStockIndicatorClass(sizeData?.quantity))}
                              />
                              <div
                                className={cn(
                                  'absolute left-2 top-1/2 h-3 w-3 -translate-y-1/2 rounded-full',
                                  getStockIndicatorClass(sizeData?.quantity).replace(
                                    'bg-',
                                    'border- border-2'
                                  )
                                )}
                              ></div>
                            </div>
                          )}
                          {sizeData?.status === 'pre_order' && (
                            <Input
                              type="date"
                              value={sizeData?.preOrderDate || ''}
                              onChange={(e) =>
                                handleCellChange(sizeInfo.name, 'preOrderDate', e.target.value)
                              }
                            />
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible>
      <UploadImageDialog
        open={isUploadDialogOpen}
        onOpenChange={setIsUploadDialogOpen}
        onSave={handleSaveImage}
        title={`Загрузить для цвета "${colorName}"`}
      />
    </>
  );
}

interface ProductVariantManagerProps {
  control: any;
  watch: any;
  setValue: any;
}

export default function ProductVariantManager({
  control,
  watch,
  setValue,
}: ProductVariantManagerProps) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'availableColors',
  });

  const masterSizes = watch('sizes') || [];
  const [isSizeTemplateOpen, setIsSizeTemplateOpen] = useState(false);
  const [colorPalette, setColorPalette] = useState<{ name: string; hex: string }[]>([]);

  useEffect(() => {
    fetch('/data/colors.json')
      .then((res) => res.json())
      .then((data: unknown) => setColorPalette(data as { name: string; hex: string }[]));
  }, []);

  const handleApplyTemplate = (sizes: string[]) => {
    setValue(
      'sizes',
      sizes.map((s) => ({ name: s })),
      { shouldDirty: true }
    );
    setIsSizeTemplateOpen(false);
  };

  const handleAddSize = () => {
    const currentSizes = watch('sizes') || [];
    setValue('sizes', [...currentSizes, { name: '' }], { shouldDirty: true });
  };

  const handleRemoveSize = (index: number) => {
    const currentSizes = watch('sizes') || [];
    const newSizes = currentSizes.filter((_: any, i: number) => i !== index);
    setValue('sizes', newSizes, { shouldDirty: true });
  };

  const handleSizeNameChange = (index: number, name: string) => {
    const currentSizes = watch('sizes') || [];
    const newSizes = [...currentSizes];
    newSizes[index] = { name };
    setValue('sizes', newSizes, { shouldDirty: true });
  };

  return (
    <>
      <CardContent className="space-y-4">
        <div className="space-y-4">
          <Label>Размерная сетка</Label>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {(masterSizes || []).map((size: SizeInfo, index: number) => (
              <div key={index} className="relative">
                <Input
                  value={size.name}
                  onChange={(e) => handleSizeNameChange(index, e.target.value)}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full w-8"
                  onClick={() => handleRemoveSize(index)}
                >
                  <X className="h-3.5 w-3.5 text-muted-foreground" />
                </Button>
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              className="border-dashed"
              onClick={handleAddSize}
            >
              <Plus className="mr-2 h-4 w-4" /> Размер
            </Button>
            <Dialog open={isSizeTemplateOpen} onOpenChange={setIsSizeTemplateOpen}>
              <DialogTrigger asChild>
                <Button type="button" variant="secondary">
                  <Shirt className="mr-2 h-4 w-4" /> Шаблоны
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Применить шаблон размерной сетки</DialogTitle>
                </DialogHeader>
                <div className="space-y-2">
                  {defaultSizeTemplates.map((template) => (
                    <Button
                      key={template.value}
                      variant="outline"
                      className="w-full justify-start"
                      onClick={() => handleApplyTemplate(template.sizes)}
                    >
                      {template.label} ({template.sizes.join(', ')})
                    </Button>
                  ))}
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <div className="space-y-4">
          <Label>Варианты по цветам</Label>
          <div className="grid gap-3 md:grid-cols-1 lg:grid-cols-2">
            {(fields as any[]).map((field, index) => (
              <ColorSizeGrid
                key={field.id}
                color={field as ColorInfo}
                colorIndex={index}
                control={control}
                removeColor={remove}
                watch={watch}
                setValue={setValue}
                masterSizes={masterSizes || []}
                colorPalette={colorPalette}
              />
            ))}
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() =>
            append({
              id: `new-color-${Date.now()}`,
              name: 'Новый цвет',
              hex: '#ffffff',
              colorCode: '',
              colorDescription: '',
              sizeAvailability: [],
            })
          }
        >
          <PlusCircle className="mr-2 h-4 w-4" /> Добавить цвет
        </Button>
      </CardFooter>
    </>
  );
}

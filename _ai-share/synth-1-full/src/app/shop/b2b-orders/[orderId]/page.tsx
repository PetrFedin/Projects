'use client';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  ChevronLeft,
  File,
  Truck,
  MoreVertical,
  CheckCircle,
  Clock,
  FileText,
  Edit,
  Copy,
  XCircle,
  Send,
  Paperclip,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { use, useState } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import type { Product } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { initialOrderItems, mockChat, orderStatusSteps } from '@/lib/order-data';
import { ROUTES } from '@/lib/routes';
import { AttachProductDialog, OrderChat, SizeBreakdownDialog } from '@/components/shop/b2b';
import { RegistryPageShell } from '@/components/design-system';

export default function ShopB2BOrderDetailsPage({
  params: paramsPromise,
}: {
  params: Promise<{ orderId: string }>;
}) {
  const params = use(paramsPromise);
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [editingItem, setEditingItem] = useState<any | null>(null);
  const [orderItems, setOrderItems] = useState(initialOrderItems);

  const subtotal = orderItems.reduce(
    (acc, item) => acc + item.price * 0.4 * item.orderedQuantity,
    0
  ); // Assuming 60% wholesale discount
  const total = subtotal;

  const handleSaveSizes = (itemId: string, newSizes: any) => {
    // Here you would update the state of your order items.
    console.log('Saving sizes for', itemId, newSizes);
  };

  const handleQuantityChange = (productId: string, newQuantity: number) => {
    setOrderItems((prevItems) =>
      prevItems.map((item) =>
        item.id === productId
          ? { ...item, orderedQuantity: newQuantity >= 0 ? newQuantity : 0 }
          : item
      )
    );
  };

  const handleToggleEdit = () => {
    if (isEditing) {
      // Here would be an API call to save changes
      toast({
        title: 'Изменения сохранены',
        description: 'Информация о заказе была успешно обновлена.',
      });
    }
    setIsEditing(!isEditing);
  };

  const currentStatusIndex = orderStatusSteps.findIndex((s) => s.date === null);

  return (
    <RegistryPageShell className="space-y-4">
      <div className="mb-8 flex items-center gap-3">
        <Button variant="outline" size="icon" asChild>
          <Link href={ROUTES.shop.b2bOrders}>
            <ChevronLeft className="h-4 w-4" />
          </Link>
        </Button>
        <h1 className="text-sm font-semibold tracking-tight">
          Заказ у бренда <span className="text-muted-foreground">Syntha</span> /{' '}
          <span className="font-mono text-muted-foreground">{params.orderId}</span>
        </h1>
        <Badge variant="outline" className="ml-2">
          Согласован
        </Badge>
        <div className="ml-auto flex items-center gap-2">
          <Button variant="outline">
            <Copy className="mr-2 h-4 w-4" />
            Дублировать заказ
          </Button>
          <Button variant="destructive">
            <XCircle className="mr-2 h-4 w-4" />
            Отменить заказ
          </Button>
        </div>
      </div>

      <div className="grid gap-3 md:grid-cols-3">
        <div className="space-y-4 md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Статус заказа</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between">
                {orderStatusSteps.map((step, index) => (
                  <div
                    key={step.status}
                    className="relative flex w-1/4 flex-col items-center text-center"
                  >
                    <div
                      className={cn(
                        'z-10 flex h-8 w-8 items-center justify-center rounded-full border-2',
                        step.date
                          ? 'border-primary bg-primary text-primary-foreground'
                          : 'border-border bg-muted'
                      )}
                    >
                      {step.date ? (
                        <CheckCircle className="h-5 w-5" />
                      ) : (
                        <Clock className="h-5 w-5 text-muted-foreground" />
                      )}
                    </div>
                    <p className="mt-2 text-sm font-medium">{step.status}</p>
                    <p className="text-xs text-muted-foreground">
                      {step.date ? new Date(step.date).toLocaleDateString('ru-RU') : '...'}
                    </p>
                    {index < orderStatusSteps.length - 1 && (
                      <div
                        className={cn(
                          'absolute left-1/2 top-4 -z-0 h-0.5 w-full',
                          step.date && (index < currentStatusIndex - 1 || currentStatusIndex === -1)
                            ? 'bg-primary'
                            : 'bg-border'
                        )}
                      />
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Состав заказа</CardTitle>
                <Button
                  variant={isEditing ? 'default' : 'outline'}
                  size="sm"
                  onClick={handleToggleEdit}
                >
                  {isEditing ? 'Сохранить изменения' : 'Редактировать заказ'}
                </Button>
              </div>
              <CardDescription>
                Заказ № {params.orderId} от {new Date().toLocaleDateString('ru-RU')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Товар</TableHead>
                    <TableHead>Категория</TableHead>
                    <TableHead>Кол-во</TableHead>
                    <TableHead className="text-right">Сумма</TableHead>
                    <TableHead className="text-right"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orderItems.map((item, index) => (
                    <TableRow key={`${item.id}-${index}`} className="hover:bg-muted/50">
                      <TableCell>
                        <div className="flex items-center gap-3">
                          {item.images && item.images.length > 0 && item.images[0].url && (
                            <Image
                              src={item.images[0].url}
                              alt={item.name}
                              width={40}
                              height={50}
                              className="rounded-md object-cover"
                            />
                          )}
                          <div>
                            <p className="font-medium">{item.name}</p>
                            <div className="mt-1 flex items-center gap-1.5">
                              <div
                                className="h-3 w-3 rounded-full border"
                                style={{ backgroundColor: item.colorCode }}
                              ></div>
                              <span className="text-xs text-muted-foreground">{item.color}</span>
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">
                        {item.category}
                      </TableCell>
                      <TableCell>
                        {isEditing ? (
                          <Input
                            type="number"
                            value={item.orderedQuantity}
                            onChange={(e) =>
                              handleQuantityChange(item.id, parseInt(e.target.value, 10) || 0)
                            }
                            className="h-8 w-20"
                          />
                        ) : (
                          item.orderedQuantity
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        {(item.price * 0.4 * item.orderedQuantity).toLocaleString('ru-RU')} ₽
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="outline" size="sm" onClick={() => setEditingItem(item)}>
                          <Edit className="mr-2 h-3 w-3" />
                          Размеры
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
            <CardFooter className="justify-end gap-3 text-sm font-semibold">
              <span>Итого:</span>
              <span>{total.toLocaleString('ru-RU')} ₽</span>
            </CardFooter>
          </Card>
        </div>
        <div className="md:col-span-1">
          <div className="sticky top-24 space-y-4">
            <OrderChat />
            <Card>
              <CardHeader>
                <CardTitle>Финансы</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Сумма заказа</span>
                  <span>{total.toLocaleString('ru-RU')} ₽</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Предоплата (50%)</span>
                  <span className="font-semibold">{(total * 0.5).toLocaleString('ru-RU')} ₽</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Статус оплаты</span>
                  <Badge variant="secondary">Ожидает</Badge>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">
                  <FileText className="mr-2 h-4 w-4" />
                  Скачать инвойс
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>

      {editingItem && (
        <SizeBreakdownDialog
          isOpen={!!editingItem}
          onOpenChange={(open) => !open && setEditingItem(null)}
          item={editingItem}
          onSave={handleSaveSizes}
        />
      )}
    </RegistryPageShell>
  );
}

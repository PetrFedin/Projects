'use client';

import { useState, useMemo, useEffect } from 'react';
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
import { Input } from '@/components/ui/input';
import Image from 'next/image';
import {
  MoreHorizontal,
  Search,
  CheckCircle,
  Clock,
  XCircle,
  Send,
  MessageSquare,
  Eye,
  EyeOff,
  TrendingUp,
  FileText,
  History,
  Archive,
  AlertTriangle,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import type { Product } from '@/lib/types';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';
import { PromotionDialog } from '../brand/promotion-dialog';
import { Checkbox } from '../ui/checkbox';
import Link from 'next/link';

const statusConfig = {
  approved: { label: 'Одобрено', icon: CheckCircle, color: 'text-green-600' },
  pending: { label: 'Ожидает', icon: Clock, color: 'text-amber-600' },
  rejected: { label: 'Отклонено', icon: XCircle, color: 'text-red-600' },
};

type InventoryItem = Product & {
  listingStatus: 'approved' | 'pending' | 'rejected';
  storeStock: number;
  promotion?: {
    type: 'outlet' | 'promo' | 'price_change';
    value: number;
    requestedBy: 'shop' | 'brand';
    status: 'pending' | 'approved' | 'rejected';
    comment?: string;
  };
  rejectionReason?: string;
  lastRejectionDate?: string;
  requestDate?: string;
};

interface InventoryTableProps {
  inventory: InventoryItem[];
  setInventory: React.Dispatch<React.SetStateAction<InventoryItem[]>>;
  selectedRows: Set<string>;
  setSelectedRows: React.Dispatch<React.SetStateAction<Set<string>>>;
}

function ListingStatusBadge({
  item,
  onReRequest,
}: {
  item: InventoryItem;
  onReRequest: () => void;
}) {
  const statusInfo = statusConfig[item.listingStatus];
  const [timeSinceRequest, setTimeSinceRequest] = useState('');

  useEffect(() => {
    let interval: NodeJS.Timeout | undefined;
    if (item.listingStatus === 'pending' && item.requestDate) {
      const updateTimer = () => {
        const requestedAt = new Date(item.requestDate!).getTime();
        const now = new Date().getTime();
        const diff = now - requestedAt;

        const hours = Math.floor(diff / (1000 * 60 * 60));

        if (hours >= 24) {
          onReRequest();
          setTimeSinceRequest('Авто-одобрено');
          if (interval) clearInterval(interval);
          return;
        }

        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        setTimeSinceRequest(
          `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`
        );
      };
      updateTimer();
      interval = setInterval(updateTimer, 60000); // Update every minute
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [item.listingStatus, item.requestDate, onReRequest]);

  return (
    <div className="flex items-center gap-2">
      <Badge
        variant="outline"
        className={cn('border-current/30 flex w-fit items-center gap-1.5', statusInfo.color)}
      >
        <statusInfo.icon className="h-3 w-3" />
        {statusInfo.label}
      </Badge>
      {item.listingStatus === 'pending' && (
        <span className="font-mono text-xs text-muted-foreground">{timeSinceRequest}</span>
      )}
    </div>
  );
}

export function InventoryTable({
  inventory,
  setInventory,
  selectedRows,
  setSelectedRows,
}: InventoryTableProps) {
  const { toast } = useToast();
  const [actionDialogProduct, setActionDialogProduct] = useState<InventoryItem | null>(null);
  const [rejectionReasonDialogOpen, setRejectionReasonDialogOpen] = useState(false);
  const [promotionDialogOpen, setPromotionDialogOpen] = useState(false);
  const [promotionDialogProduct, setPromotionDialogProduct] = useState<Product | undefined>(
    undefined
  );
  const [promotionDialogType, setPromotionDialogType] = useState<
    'discount' | 'outlet' | 'promo_code'
  >('discount');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleStockChange = (productId: string, newStock: number) => {
    setInventory((prev) =>
      prev.map((p) => {
        const updatedProduct = { ...p };
        if (p.id === productId) {
          updatedProduct.storeStock = newStock >= 0 ? newStock : 0;
        }
        return updatedProduct;
      })
    );
  };

  const handleSendRequest = (productId: string) => {
    setInventory((prev) =>
      prev.map((p) =>
        p.id === productId
          ? { ...p, listingStatus: 'pending', requestDate: new Date().toISOString() }
          : p
      )
    );
    toast({
      title: 'Запрос отправлен',
      description: `Запрос на листинг товара "${inventory.find((p) => p.id === productId)?.name}" отправлен бренду.`,
    });
  };

  const handleConfirmAction = () => {
    if (!actionDialogProduct) return;

    if (actionDialogProduct.promotion?.type === 'outlet') {
      setInventory((prev) =>
        prev.map((p) =>
          p.id === actionDialogProduct.id
            ? {
                ...p,
                outlet: true,
                originalPrice: p.price,
                price: p.price * (1 - actionDialogProduct.promotion!.value / 100),
                promotion: { ...actionDialogProduct.promotion!, status: 'approved' },
              }
            : p
        )
      );
      toast({ title: 'Товар перемещен в Аутлет' });
    } else if (actionDialogProduct.promotion?.type === 'price_change') {
      setInventory((prev) =>
        prev.map((p) =>
          p.id === actionDialogProduct.id
            ? {
                ...p,
                price: actionDialogProduct.promotion!.value,
                promotion: { ...actionDialogProduct.promotion!, status: 'approved' },
              }
            : p
        )
      );
      toast({ title: 'Цена обновлена' });
    } else {
      setInventory((prev) =>
        prev.map((p) =>
          p.id === actionDialogProduct.id
            ? {
                ...p,
                isPromoted: true,
                promotion: { ...actionDialogProduct.promotion!, status: 'approved' },
              }
            : p
        )
      );
      toast({ title: 'Акция применена' });
    }

    setActionDialogProduct(null);
  };

  const handleRejectAction = () => {
    if (actionDialogProduct) {
      setInventory((prev) =>
        prev.map((p) =>
          p.id === actionDialogProduct.id
            ? {
                ...p,
                promotion: { ...actionDialogProduct.promotion!, status: 'rejected' },
                lastRejectionDate: new Date().toISOString(),
                rejectionReason: 'Не соответствует ценовой политике',
              }
            : p
        )
      );
      toast({
        title: 'Предложение отклонено',
        description: 'Вы отклонили предложение бренда.',
      });
      setActionDialogProduct(null);
    }
  };

  const canReRequest = (item: InventoryItem) => {
    if (!item.lastRejectionDate) return true;
    const rejectedAt = new Date(item.lastRejectionDate).getTime();
    const now = new Date().getTime();
    return now - rejectedAt > 24 * 60 * 60 * 1000;
  };

  const handleOpenPromotionDialog = (
    product: Product,
    type: 'discount' | 'outlet' | 'promo_code'
  ) => {
    setPromotionDialogProduct(product);
    setPromotionDialogType(type);
    setPromotionDialogOpen(true);
  };

  const handleSelectRow = (id: string, isSelected: boolean) => {
    setSelectedRows((prev) => {
      const newSet = new Set(prev);
      if (isSelected) {
        newSet.add(id);
      } else {
        newSet.delete(id);
      }
      return newSet;
    });
  };

  const handleSelectAll = (isSelected: boolean) => {
    if (isSelected) {
      setSelectedRows(new Set(inventory.map((item) => item.id)));
    } else {
      setSelectedRows(new Set());
    }
  };

  const isAllSelected = inventory.length > 0 && selectedRows.size === inventory.length;

  const toggleVisibility = (id: string) => {
    console.log('Toggling visibility for', id);
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-12">
              <Checkbox
                checked={isAllSelected}
                onCheckedChange={(checked) => handleSelectAll(!!checked)}
              />
            </TableHead>
            <TableHead className="w-[80px]">Фото</TableHead>
            <TableHead>Товар</TableHead>
            <TableHead>Артикул</TableHead>
            <TableHead>Цена</TableHead>
            <TableHead>Статус листинга</TableHead>
            <TableHead>Площадка</TableHead>
            <TableHead>Статус на площадке</TableHead>
            <TableHead className="w-[120px]">Остаток</TableHead>
            <TableHead className="text-right">Действия</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {inventory.map((item) => {
            const discount = item.originalPrice
              ? Math.round(((item.originalPrice - item.price) * 100) / item.originalPrice)
              : 0;
            const isVisible = item.listingStatus === 'approved' && item.storeStock > 0;
            const lowStock = item.storeStock > 0 && item.storeStock <= 3;
            const isPromotionRedundant =
              item.promotion?.status === 'pending' &&
              ((item.promotion.type === 'outlet' &&
                item.outlet &&
                discount >= item.promotion.value) ||
                (item.promotion.type === 'price_change' && item.price === item.promotion.value));

            return (
              <TableRow key={item.id} data-state={selectedRows.has(item.id) ? 'selected' : ''}>
                <TableCell>
                  <Checkbox
                    checked={selectedRows.has(item.id)}
                    onCheckedChange={(checked) => handleSelectRow(item.id, !!checked)}
                  />
                </TableCell>
                <TableCell>
                  <Image
                    src={item.images[0].url}
                    alt={item.name}
                    width={48}
                    height={60}
                    className="rounded-md object-cover"
                  />
                </TableCell>
                <TableCell className="font-medium">
                  <div className="flex items-center gap-1.5">
                    <span>{item.name}</span>
                    {item.promotion &&
                      item.promotion.status === 'pending' &&
                      !isPromotionRedundant && (
                        <Tooltip>
                          <TooltipTrigger>
                            <FileText className="h-4 w-4 text-accent" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="font-semibold">Активное предложение:</p>
                            <p className="text-sm">
                              {item.promotion.requestedBy === 'brand'
                                ? 'Бренд предлагает '
                                : 'Вы предложили '}
                              {item.promotion.type === 'outlet'
                                ? `переместить в аутлет со скидкой ${item.promotion.value}%`
                                : item.promotion.type === 'price_change'
                                  ? `повысить цену до ${item.promotion.value.toLocaleString('ru-RU')} ₽`
                                  : `промо-акцию "${item.promotion.value}"`}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              Статус:{' '}
                              {item.promotion.status === 'pending'
                                ? 'Ожидает решения'
                                : item.promotion.status}
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      )}
                    {lowStock && !item.promotion && (
                      <Tooltip>
                        <TooltipTrigger>
                          <AlertTriangle className="h-4 w-4 text-amber-500" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="font-semibold">Низкий остаток!</p>
                          <p>Рекомендуется сделать дозаказ.</p>
                        </TooltipContent>
                      </Tooltip>
                    )}
                  </div>
                </TableCell>
                <TableCell className="font-mono text-xs">{item.sku}</TableCell>
                <TableCell>
                  <div className="flex items-baseline gap-2">
                    <span className="font-semibold">{item.price.toLocaleString('ru-RU')} ₽</span>
                    {item.outlet && item.originalPrice && (
                      <span className="text-xs text-muted-foreground line-through">
                        {item.originalPrice.toLocaleString('ru-RU')} ₽
                      </span>
                    )}
                  </div>
                  {item.outlet && discount > 0 && (
                    <p className="text-xs text-destructive">(-{discount}%)</p>
                  )}
                </TableCell>
                <TableCell>
                  <ListingStatusBadge
                    item={item}
                    onReRequest={() =>
                      setInventory((prev) =>
                        prev.map((p) =>
                          p.id === item.id ? { ...p, listingStatus: 'approved' } : p
                        )
                      )
                    }
                  />
                </TableCell>
                <TableCell>
                  <Badge variant={item.outlet ? 'secondary' : 'default'}>
                    {item.outlet ? 'Аутлет' : 'Основная'}
                  </Badge>
                </TableCell>
                <TableCell>
                  <button
                    type="button"
                    onClick={() => toggleVisibility(item.id)}
                    className={cn(
                      'flex items-center gap-1.5 text-sm font-medium',
                      !mounted
                        ? 'text-muted-foreground'
                        : isVisible
                          ? 'text-green-600'
                          : 'text-muted-foreground'
                    )}
                  >
                    {!mounted ? (
                      <>
                        <EyeOff className="h-4 w-4" />
                        <span>Скрыто</span>
                      </>
                    ) : isVisible ? (
                      <>
                        <Eye className="h-4 w-4" />
                        <span>На витрине</span>
                      </>
                    ) : (
                      <>
                        <EyeOff className="h-4 w-4" />
                        <span>Скрыто</span>
                      </>
                    )}
                  </button>
                </TableCell>
                <TableCell>
                  <Input
                    type="number"
                    value={item.storeStock}
                    onChange={(e) => handleStockChange(item.id, parseInt(e.target.value) || 0)}
                    className="h-8 w-20 text-center"
                    disabled={item.listingStatus !== 'approved'}
                  />
                </TableCell>
                <TableCell className="text-right">
                  {item.listingStatus === 'rejected' && (
                    <div className="flex justify-end gap-1">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setRejectionReasonDialogOpen(true)}
                      >
                        <MessageSquare className="mr-2 h-4 w-4" /> Причина
                      </Button>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => handleSendRequest(item.id)}
                            disabled={!canReRequest(item)}
                          >
                            <Send className="mr-2 h-4 w-4" /> Повторно
                          </Button>
                        </TooltipTrigger>
                        {!canReRequest(item) && (
                          <TooltipContent>
                            <p>Повторный запрос будет доступен через 24 часа.</p>
                          </TooltipContent>
                        )}
                      </Tooltip>
                    </div>
                  )}
                  {item.listingStatus === 'pending' && (
                    <Button variant="outline" size="sm" disabled>
                      <Clock className="mr-2 h-4 w-4 animate-spin" /> Ожидает
                    </Button>
                  )}
                  {item.listingStatus === 'approved' &&
                    item.promotion?.status === 'pending' &&
                    !isPromotionRedundant && (
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => setActionDialogProduct(item)}
                      >
                        <FileText className="mr-2 h-4 w-4" /> Рассмотреть
                      </Button>
                    )}
                  {item.listingStatus === 'approved' &&
                    (!item.promotion ||
                      item.promotion.status !== 'pending' ||
                      isPromotionRedundant) && (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button size="icon" variant="ghost">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Действия</DropdownMenuLabel>
                          <DropdownMenuItem
                            onClick={() => handleOpenPromotionDialog(item, 'promo_code')}
                          >
                            Предложить промо/акцию
                          </DropdownMenuItem>
                          {!item.outlet && (
                            <DropdownMenuItem
                              onClick={() => handleOpenPromotionDialog(item, 'outlet')}
                            >
                              Предложить в Аутлет
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuSeparator />
                          <DropdownMenuItem asChild>
                            <Link href={`/shop/inventory/history/${item.id}`}>
                              <History className="mr-2 h-4 w-4" />
                              История действий
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive">
                            <Archive className="mr-2 h-4 w-4" />
                            Архивировать
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    )}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>

      {/* Action Confirmation Dialog */}
      <Dialog open={!!actionDialogProduct} onOpenChange={() => setActionDialogProduct(null)}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Подтверждение действия</DialogTitle>
            <DialogDescription>
              Вы уверены, что хотите{' '}
              {actionDialogProduct?.promotion?.type === 'outlet'
                ? 'переместить этот товар в аутлет?'
                : actionDialogProduct?.promotion?.type === 'price_change'
                  ? 'изменить цену товара?'
                  : 'применить данную акцию к товару?'}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-3 py-4">
            {actionDialogProduct?.promotion?.comment && (
              <div className="grid grid-cols-4 items-center gap-3">
                <label
                  htmlFor="comment"
                  className="text-right text-sm font-medium leading-none text-muted-foreground"
                >
                  Комментарий бренда:
                </label>
                <div className="col-span-3">
                  <Input
                    type="text"
                    id="comment"
                    disabled
                    value={actionDialogProduct?.promotion?.comment}
                    className="col-span-3"
                  />
                </div>
              </div>
            )}
            <div className="grid grid-cols-4 items-center gap-3">
              <label
                htmlFor="name"
                className="text-right text-sm font-medium leading-none text-muted-foreground"
              >
                Товар:
              </label>
              <div className="col-span-3">
                <Input
                  type="text"
                  id="name"
                  disabled
                  value={actionDialogProduct?.name}
                  className="col-span-3"
                />
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-3">
              <label
                htmlFor="type"
                className="text-right text-sm font-medium leading-none text-muted-foreground"
              >
                Тип:
              </label>
              <div className="col-span-3">
                <Input
                  type="text"
                  id="type"
                  disabled
                  value={
                    actionDialogProduct?.promotion?.type === 'outlet'
                      ? 'Аутлет'
                      : actionDialogProduct?.promotion?.type === 'price_change'
                        ? 'Изменение цены'
                        : 'Промо-акция'
                  }
                  className="col-span-3"
                />
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-3">
              <label
                htmlFor="value"
                className="text-right text-sm font-medium leading-none text-muted-foreground"
              >
                Значение:
              </label>
              <div className="col-span-3">
                <Input
                  type="text"
                  id="value"
                  disabled
                  value={
                    actionDialogProduct?.promotion?.type === 'outlet'
                      ? `${actionDialogProduct?.promotion?.value}%`
                      : `${actionDialogProduct?.promotion?.value} ₽`
                  }
                  className="col-span-3"
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="secondary" onClick={handleRejectAction}>
              Отклонить
            </Button>
            <Button type="button" onClick={handleConfirmAction}>
              Подтвердить
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Rejection Reason Dialog */}
      <Dialog open={rejectionReasonDialogOpen} onOpenChange={setRejectionReasonDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Причина отклонения</DialogTitle>
          </DialogHeader>
          <div className="grid gap-3 py-4">
            {inventory.find((i) => i.rejectionReason)?.rejectionReason}
          </div>
          <DialogFooter>
            <Button type="button" onClick={() => setRejectionReasonDialogOpen(false)}>
              Закрыть
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Promotion Dialog */}
      <PromotionDialog
        isOpen={promotionDialogOpen}
        onOpenChange={setPromotionDialogOpen}
        product={promotionDialogProduct}
        initialType={promotionDialogType}
      />
    </div>
  );
}

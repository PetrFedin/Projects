'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Package, Truck, MapPin, Clock, CheckCircle2, Circle, 
  AlertCircle, ArrowRight, Copy, ExternalLink
} from 'lucide-react';
import { useUserOrders } from '@/hooks/use-user-orders';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface TrackingEvent {
  id: string;
  status: string;
  description: string;
  timestamp: Date;
  location?: string;
}

interface OrderTracking {
  orderId: string;
  trackingNumber?: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  estimatedDelivery?: Date;
  currentLocation?: string;
  events: TrackingEvent[];
}

const statusConfig = {
  pending: {
    label: 'Ожидает обработки',
    icon: Clock,
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-500/10',
    borderColor: 'border-yellow-500/20',
  },
  processing: {
    label: 'Обрабатывается',
    icon: Package,
    color: 'text-blue-600',
    bgColor: 'bg-blue-500/10',
    borderColor: 'border-blue-500/20',
  },
  shipped: {
    label: 'В пути',
    icon: Truck,
    color: 'text-purple-600',
    bgColor: 'bg-purple-500/10',
    borderColor: 'border-purple-500/20',
  },
  delivered: {
    label: 'Доставлено',
    icon: CheckCircle2,
    color: 'text-green-600',
    bgColor: 'bg-green-500/10',
    borderColor: 'border-green-500/20',
  },
  cancelled: {
    label: 'Отменено',
    icon: AlertCircle,
    color: 'text-red-600',
    bgColor: 'bg-red-500/10',
    borderColor: 'border-red-500/20',
  },
};

export default function OrderTracking() {
  const { orders } = useUserOrders();
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null);

  const activeOrders = orders
    .filter(o => o.status !== 'delivered' && o.status !== 'cancelled')
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const selectedOrderData = selectedOrder
    ? orders.find(o => o.id === selectedOrder)
    : activeOrders[0];

  if (!selectedOrderData) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Truck className="h-5 w-5 text-accent" />
            Отслеживание заказов
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4 text-muted-foreground">
            <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Нет активных заказов для отслеживания</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const config = statusConfig[selectedOrderData.status];
  const StatusIcon = config.icon;

  // Генерируем события отслеживания на основе статуса
  const trackingEvents: TrackingEvent[] = [
    {
      id: '1',
      status: 'pending',
      description: 'Заказ создан',
      timestamp: new Date(selectedOrderData.createdAt),
    },
    ...(selectedOrderData.status !== 'pending' ? [{
      id: '2',
      status: 'processing',
      description: 'Заказ обрабатывается',
      timestamp: new Date(new Date(selectedOrderData.createdAt).getTime() + 3600000),
    }] : []),
    ...(selectedOrderData.status === 'shipped' || selectedOrderData.status === 'delivered' ? [{
      id: '3',
      status: 'shipped',
      description: 'Заказ отправлен',
      timestamp: selectedOrderData.updatedAt ? new Date(selectedOrderData.updatedAt) : new Date(),
      location: 'Склад отправки',
    }] : []),
    ...(selectedOrderData.status === 'delivered' ? [{
      id: '4',
      status: 'delivered',
      description: 'Заказ доставлен',
      timestamp: selectedOrderData.estimatedDelivery ? new Date(selectedOrderData.estimatedDelivery) : new Date(),
      location: selectedOrderData.shippingAddress?.city || 'Адрес доставки',
    }] : []),
  ];

  const handleCopyTracking = () => {
    if (selectedOrderData.trackingNumber) {
      navigator.clipboard.writeText(selectedOrderData.trackingNumber);
    }
  };

  return (
    <div className="space-y-4">
      {/* Order Selector */}
      {activeOrders.length > 1 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Выберите заказ</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {activeOrders.map(order => {
                const orderConfig = statusConfig[order.status];
                const OrderIcon = orderConfig.icon;
                return (
                  <button
                    key={order.id}
                    onClick={() => setSelectedOrder(order.id)}
                    className={cn(
                      'w-full p-3 rounded-lg border text-left transition-colors',
                      selectedOrder === order.id || (!selectedOrder && order.id === activeOrders[0].id)
                        ? 'border-accent bg-accent/5'
                        : 'hover:bg-muted/50'
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={cn('p-2 rounded', orderConfig.bgColor)}>
                          <OrderIcon className={cn('h-4 w-4', orderConfig.color)} />
                        </div>
                        <div>
                          <p className="font-medium text-sm">
                            Заказ #{order.id.slice(-8).toUpperCase()}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {format(new Date(order.createdAt), 'd MMM yyyy', { locale: ru })}
                          </p>
                        </div>
                      </div>
                      <Badge variant="outline" className={cn(orderConfig.borderColor, orderConfig.color)}>
                        {orderConfig.label}
                      </Badge>
                    </div>
                  </button>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tracking Details */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <StatusIcon className={cn('h-5 w-5', config.color)} />
                Отслеживание заказа
              </CardTitle>
              <CardDescription className="mt-1">
                Заказ #{selectedOrderData.id.slice(-8).toUpperCase()}
              </CardDescription>
            </div>
            <Badge className={cn(config.bgColor, config.color, config.borderColor)}>
              {config.label}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Tracking Number */}
          {selectedOrderData.trackingNumber && (
            <div className="p-4 rounded-lg border bg-muted/50">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Номер отслеживания</p>
                  <p className="font-mono font-semibold">{selectedOrderData.trackingNumber}</p>
                </div>
                <div className="flex gap-2">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={handleCopyTracking}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Скопировать номер</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  <Button
                    variant="outline"
                    size="icon"
                    asChild
                  >
                    <a
                      href={`https://tracking.example.com/${selectedOrderData.trackingNumber}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Estimated Delivery */}
          {selectedOrderData.estimatedDelivery && (
            <div className="p-4 rounded-lg border">
              <div className="flex items-center gap-3">
                <MapPin className="h-5 w-5 text-muted-foreground" />
                <div className="flex-1">
                  <p className="text-sm font-medium mb-1">Ожидаемая доставка</p>
                  <p className="text-sm text-muted-foreground">
                    {format(new Date(selectedOrderData.estimatedDelivery), 'd MMMM yyyy, EEEE', { locale: ru })}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {selectedOrderData.shippingAddress?.address}, {selectedOrderData.shippingAddress?.city}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Tracking Timeline */}
          <div className="space-y-4">
            <p className="text-sm font-medium">История доставки</p>
            <div className="relative">
              {trackingEvents.map((event, index) => {
                const isLast = index === trackingEvents.length - 1;
                const isCompleted = index < trackingEvents.length - 1 || selectedOrderData.status === 'delivered';
                const eventConfig = statusConfig[event.status as keyof typeof statusConfig];
                const EventIcon = eventConfig.icon;

                return (
                  <div key={event.id} className="relative flex gap-3 pb-6 last:pb-0">
                    {/* Timeline Line */}
                    {!isLast && (
                      <div className={cn(
                        'absolute left-5 top-3 w-0.5 h-full',
                        isCompleted ? 'bg-accent' : 'bg-muted'
                      )} />
                    )}

                    {/* Icon */}
                    <div className={cn(
                      'relative z-10 p-2 rounded-full border-2',
                      isCompleted
                        ? `${eventConfig.bgColor} ${eventConfig.borderColor}`
                        : 'bg-muted border-muted'
                    )}>
                      <EventIcon className={cn(
                        'h-4 w-4',
                        isCompleted ? eventConfig.color : 'text-muted-foreground'
                      )} />
                    </div>

                    {/* Content */}
                    <div className="flex-1 pt-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className={cn(
                            'font-medium text-sm',
                            isCompleted ? '' : 'text-muted-foreground'
                          )}>
                            {event.description}
                          </p>
                          {event.location && (
                            <p className="text-xs text-muted-foreground mt-1">
                              {event.location}
                            </p>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground whitespace-nowrap ml-4">
                          {format(event.timestamp, 'd MMM, HH:mm', { locale: ru })}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Order Summary */}
          <div className="pt-4 border-t">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium">Сумма заказа</p>
              <p className="text-sm font-bold">{selectedOrderData.total.toLocaleString('ru-RU')} ₽</p>
            </div>
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <p>Товаров: {selectedOrderData.items.length}</p>
              <p>Доставка: {selectedOrderData.shipping.toLocaleString('ru-RU')} ₽</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}






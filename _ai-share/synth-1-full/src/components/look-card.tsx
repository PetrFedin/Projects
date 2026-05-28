'use client';

import * as React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { Heart, MessageCircle, MoreHorizontal, Send, ShoppingCart } from 'lucide-react';
import type { Look, Product } from '@/lib/types';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { clientPublicProfileHref } from '@/lib/routes';
import { useToast } from '@/hooks/use-toast';
import { useUIState } from '@/providers/ui-state';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from './ui/dialog';

interface LookCardProps {
  look: Look;
  showAuthor?: boolean;
  className?: string;
}

const ShopTheLookDialog = ({ look, allProducts }: { look: Look; allProducts: Product[] }) => {
  const { addCartItem } = useUIState();
  const { toast } = useToast();
  const lookProducts = allProducts.filter((p) =>
    look.products?.some((lp) => lp.productId === p.id)
  );

  const handleAddToCart = (product: Product) => {
    addCartItem(product, product.sizes?.[0].name || 'One Size');
    toast({
      title: 'Товар добавлен в корзину',
      description: `${product.name} теперь в вашей корзине.`,
    });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="secondary" size="sm">
          <ShoppingCart className="mr-2 h-4 w-4" />
          Товары в образе
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Товары в образе</DialogTitle>
          <DialogDescription>{look.description}</DialogDescription>
        </DialogHeader>
        <div className="max-h-[60vh] space-y-4 overflow-y-auto py-4">
          {lookProducts.map((product) => (
            <div key={product.id} className="flex items-start gap-3 rounded-md border p-2">
              <div className="relative h-20 w-12 overflow-hidden rounded-md bg-muted">
                <Image
                  src={product.images[0].url}
                  alt={product.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex-1">
                <p className="text-sm text-muted-foreground">{product.brand}</p>
                <p className="text-base font-semibold leading-tight">{product.name}</p>
                <p className="mt-1 text-sm font-bold">{product.price.toLocaleString('ru-RU')} ₽</p>
              </div>
              <Button
                size="icon"
                variant="outline"
                className="h-9 w-9 shrink-0"
                onClick={() => handleAddToCart(product)}
              >
                <ShoppingCart className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default function LookCard({ look, showAuthor = true, className }: LookCardProps) {
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(look.likesCount);
  const { toast } = useToast();
  const [allProducts, setAllProducts] = useState<Product[]>([]);

  React.useEffect(() => {
    async function fetchProducts() {
      try {
        const response = await fetch('/data/products.json');
        const productsData = (await response.json()) as Product[];
        setAllProducts(productsData);
      } catch (error) {
        console.error('Failed to fetch products for look card:', error);
      }
    }
    fetchProducts();
  }, []);

  const handleLike = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    setIsLiked((prevIsLiked) => {
      const newIsLiked = !prevIsLiked;
      if (newIsLiked) {
        setLikesCount((prev) => prev + 1);
        toast({
          title: '✨ +1 балл лояльности',
          description: 'Спасибо за вашу оценку!',
        });
      } else {
        setLikesCount((prev) => prev - 1);
      }
      return newIsLiked;
    });
  };

  return (
    <Card className={cn('group break-inside-avoid overflow-hidden', className)}>
      <Link href={`/looks/${look.id}`}>
        {showAuthor && look.author && (
          <CardHeader className="p-4">
            <div className="flex items-center gap-3">
              <Avatar className="h-9 w-9" data-ai-hint="person face">
                <AvatarImage src={look.author.avatarUrl} alt={look.author.name} />
                <AvatarFallback>{look.author.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="grid gap-0.5 text-sm">
                <p className="font-semibold">{look.author.name}</p>
                <p className="text-muted-foreground">{look.author.handle}</p>
              </div>
              <Button variant="ghost" size="icon" className="ml-auto h-8 w-8">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
        )}
        <CardContent className="p-0">
          <div className="relative aspect-[4/5] w-full">
            <Image
              src={look.imageUrl}
              alt={look.description}
              fill
              className="object-cover"
              data-ai-hint={look.imageHint}
              sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
            />
          </div>
        </CardContent>
      </Link>
      <CardFooter className="flex-col items-start gap-3 p-4">
        <div className="flex w-full items-center">
          <Button variant="ghost" size="icon" className="-ml-2" onClick={handleLike}>
            <Heart className={cn('h-5 w-5', isLiked && 'fill-red-500 text-red-500')} />
            <span className="sr-only">Нравится</span>
          </Button>
          <Button variant="ghost" size="icon">
            <MessageCircle className="h-5 w-5" />
            <span className="sr-only">Комментарии</span>
          </Button>
          <Button variant="ghost" size="icon">
            <Send className="h-5 w-5" />
            <span className="sr-only">Поделиться</span>
          </Button>
          <div className="ml-auto">
            <ShopTheLookDialog look={look} allProducts={allProducts} />
          </div>
        </div>
        <p className="text-sm font-semibold">
          {likesCount.toLocaleString('ru-RU')} отметок "Нравится"
        </p>
        <p className="text-sm">
          {showAuthor && look.author && (
            <Link href={clientPublicProfileHref(look.author.handle)}>
              <span className="font-semibold">{look.author.handle}</span>
            </Link>
          )}{' '}
          {look.description}
        </p>
        {showAuthor && (
          <Link
            href={`/looks/${look.id}`}
            className="text-sm font-medium text-muted-foreground hover:text-foreground"
          >
            Посмотреть все комментарии ({look.commentsCount})
          </Link>
        )}
      </CardFooter>
    </Card>
  );
}

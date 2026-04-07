'use client';
import Link from 'next/link';
import Logo from '@/components/logo';
import UserNav from '@/components/user-nav';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Heart, Menu, ShoppingCart } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useState } from 'react';
import { useUIState } from '@/providers/ui-state';

const baseNavLinks = [
  { href: '/search', label: 'Каталог' },
  { href: '/brands', label: 'Бренды' },
  { href: '/search?outlet=true', label: 'Аутлет' },
  { href: '/community', label: 'Сообщество' },
];

export default function Header() {
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const { toggleCart, toggleWishlist, cart, wishlist } = useUIState();
  
  const cartItemCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const wishlistItemCount = wishlist.length;

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        {/* Mobile Menu */}
        <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden mr-4">
              <Menu className="h-6 w-6" />
              <span className="sr-only">Открыть меню</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[300px] sm:w-[400px]">
            <nav className="flex flex-col gap-4 mt-8">
              {baseNavLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsSheetOpen(false)}
                  className="block px-2 py-1 text-lg font-medium text-foreground hover:text-accent"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </SheetContent>
        </Sheet>
        
        {/* Desktop Menu */}
        <div className="mr-4 hidden md:flex relative z-50">
          <Link href="/" className="mr-6 flex items-center space-x-2 hover:opacity-70 transition-opacity cursor-pointer">
            <Logo className="h-6 w-auto" />
          </Link>
        </div>
        <nav className="hidden items-center space-x-6 text-sm font-medium md:flex flex-1">
            {baseNavLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="transition-colors hover:text-foreground/80 text-foreground/60"
              >
                {link.label}
              </Link>
            ))}
        </nav>

        <div className="flex flex-1 items-center justify-end space-x-2">
           {/* Mobile Logo */}
           <div className="flex-1 md:hidden relative z-50">
            <Link href="/" className="flex items-center space-x-2 hover:opacity-70 transition-opacity cursor-pointer">
              <Logo className="h-6 w-auto" />
            </Link>
           </div>
          <Button variant="ghost" size="icon" onClick={toggleWishlist} className="relative">
            <Heart />
            {wishlistItemCount > 0 && (
                <Badge variant="destructive" className="absolute -top-1 -right-1 h-4 w-4 justify-center rounded-full p-0 text-xs">
                    {wishlistItemCount}
                </Badge>
            )}
            <span className="sr-only">Избранное</span>
          </Button>
          <Button variant="ghost" size="icon" onClick={toggleCart} className="relative">
            <ShoppingCart />
            {cartItemCount > 0 && (
                <Badge variant="destructive" className="absolute -top-1 -right-1 h-4 w-4 justify-center rounded-full p-0 text-xs">
                    {cartItemCount}
                </Badge>
            )}
            <span className="sr-only">Корзина</span>
          </Button>
          <UserNav />
        </div>
      </div>
    </header>
  );
}

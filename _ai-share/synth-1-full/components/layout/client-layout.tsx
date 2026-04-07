
'use client';

import { Toaster } from '@/components/ui/toaster';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import AiStylist from '@/components/ai-stylist';
import CartSheet from '@/components/layout/cart-sheet';
import WishlistSheet from '@/components/layout/wishlist-sheet';
import RolePanel from './role-panel';
import { UIStateProvider } from '@/providers/ui-state';

export default function ClientLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
      <div className="relative flex min-h-screen flex-col">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <CartSheet />
        <WishlistSheet />
        <AiStylist />
        <RolePanel />
        <Toaster />
      </div>
  );
}

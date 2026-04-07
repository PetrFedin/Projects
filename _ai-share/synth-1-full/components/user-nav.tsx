
'use client';

import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { CreditCard, LogOut, Settings, User as UserIcon, Shirt } from 'lucide-react';
import { useUIState } from '@/providers/ui-state';
import { useToast } from '@/hooks/use-toast';

export default function UserNav() {
  const { user, isUserLoading } = useUIState();
  const { toast } = useToast();

  const handleSignOut = async () => {
    // In a real app, this would sign out the user from Firebase/auth provider
    toast({ title: "Вы успешно вышли." });
    // Here you would typically redirect or update the user state to null
  };
  
  if (isUserLoading) {
    // Show a skeleton or loading indicator while auth state is being determined
    return <div className="h-9 w-9 rounded-full animate-pulse bg-muted" />;
  }

  if (user) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-8 w-8 rounded-full">
            <Avatar className="h-9 w-9">
              <AvatarImage src={user.photoURL ?? ''} alt={user.displayName ?? 'Пользователь'} data-ai-hint="person face" />
              <AvatarFallback>{user.email?.[0].toUpperCase() ?? 'П'}</AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" forceMount>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">{user.displayName ?? 'Пользователь'}</p>
              <p className="text-xs leading-none text-muted-foreground">
                {user.email}
              </p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem asChild>
              <Link href="/u">
                <UserIcon className="mr-2 h-4 w-4" />
                <span>Мой профиль</span>
              </Link>
            </DropdownMenuItem>
             <DropdownMenuItem asChild>
              <Link href="/u/wardrobe">
                <Shirt className="mr-2 h-4 w-4" />
                <span>Мой гардероб</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <CreditCard className="mr-2 h-4 w-4" />
              <span>Оплата</span>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
               <Link href="/u?tab=settings">
                <Settings className="mr-2 h-4 w-4" />
                <span>Настройки</span>
              </Link>
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleSignOut}>
            <LogOut className="mr-2 h-4 w-4" />
            <span>Выйти</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
     <Button>Войти</Button>
  );
}

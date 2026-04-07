
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Button } from "@/components/ui/button"
import { Shield, Store, ShoppingCart, User } from "lucide-react"
import { cn } from '@/lib/utils';


const roles = [
    { href: "/admin", icon: Shield, label: "Администратор" },
    { href: "/brand", icon: Store, label: "Бренд" },
    { href: "/shop", icon: ShoppingCart, label: "Магазин" },
    { href: "/u", icon: User, label: "Профиль" },
];


export default function RolePanel() {
    const pathname = usePathname();

    return (
        <TooltipProvider>
            <div className="fixed right-4 top-1/2 -translate-y-1/2 z-[9999]">
                <div className="flex flex-col gap-2 bg-card p-2 rounded-lg border shadow-lg">
                    {roles.map((role) => (
                        <Tooltip key={role.href}>
                            <TooltipTrigger asChild>
                                <Button asChild variant="ghost" size="icon" className={cn(pathname.startsWith(role.href) && role.href !== "/" ? "bg-accent text-accent-foreground" : "")}>
                                    <Link href={role.href}>
                                        <role.icon className="h-5 w-5" />
                                        <span className="sr-only">{role.label}</span>
                                    </Link>
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent side="left">
                                <p>{role.label}</p>
                            </TooltipContent>
                        </Tooltip>
                    ))}
                </div>
            </div>
        </TooltipProvider>
    );
}

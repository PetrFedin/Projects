'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { buttonVariants } from "@/components/ui/button"
import { Info, ClipboardList, HelpCircle, Table, ListTree, Tags, BookText, Ruler, Palette, PanelLeftOpen, PanelLeftClose } from "lucide-react"
import { cn } from '@/lib/utils';
import { useUIState } from '@/providers/ui-state';
import { ROUTES } from '@/lib/routes';

const REFERENCE_SECTIONS = [
  { href: "/project-info/attributes", icon: ListTree, label: "Справочник атрибутов" },
  { href: "/project-info/categories", icon: BookText, label: "Категории" },
  { href: "/project-info/sizes", icon: Ruler, label: "Размерные сетки" },
  { href: "/project-info/colors", icon: Palette, label: "Палитра цветов" },
];

type NavLink = { href: string; icon: React.ComponentType<{ className?: string }>; label: string };
type NavDropdown = { type: 'dropdown'; icon: React.ComponentType<{ className?: string }>; label: string; sections: typeof REFERENCE_SECTIONS };

export const leftSidebarNavLinks: (NavLink | NavDropdown)[] = [
    { href: ROUTES.catalog, icon: Tags, label: "Каталог брендов" },
    { href: "/project-info", icon: Info, label: "О проекте" },
    { href: "/project-status", icon: ClipboardList, label: "Реестр проекта" },
    { href: "/quiz", icon: HelpCircle, label: "Квиз для брендов" },
    { href: "/project-info/product-display", icon: Table, label: "Структура данных" },
    { type: 'dropdown', icon: ListTree, label: "Справочники", sections: REFERENCE_SECTIONS },
];


export function LeftSidebarNav() {
    const pathname = usePathname();
    const { isFlowMapOpen } = useUIState();
    const [collapsed, setCollapsed] = useState(true);

    return (
        <div
            className={cn(
                "fixed left-0 top-1/2 z-[100] -translate-y-1/2 transition-all duration-300",
                isFlowMapOpen && "pointer-events-none opacity-0",
                collapsed && "pointer-events-none"
            )}
        >
            {/* Toggle button — always visible */}
            <button
                type="button"
                onClick={() => setCollapsed(v => !v)}
                className={cn(
                    "pointer-events-auto absolute -right-3 top-1/2 -translate-y-1/2 z-10 h-6 w-6 rounded-full bg-white border border-slate-200 shadow-md flex items-center justify-center text-slate-400 hover:text-slate-900 hover:bg-slate-50 transition-all",
                    collapsed ? "translate-x-[52px]" : "translate-x-[calc(100%+16px)]"
                )}
                aria-label={collapsed ? "Развернуть панель" : "Свернуть панель"}
            >
                {collapsed ? <PanelLeftOpen className="h-3.5 w-3.5" /> : <PanelLeftClose className="h-3.5 w-3.5" />}
            </button>

            <div
                className={cn(
                    "flex flex-col overflow-hidden rounded-r-2xl border border-l-0 bg-card shadow-2xl backdrop-blur-xl transition-all duration-300",
                    collapsed
                        ? "pointer-events-none max-h-0 w-0 p-0 opacity-0"
                        : "pointer-events-auto w-14 gap-1 p-2 opacity-100"
                )}
            >
                {leftSidebarNavLinks.map((link) => {
                    if (link.type === 'dropdown') {
                        const isActive = link.sections.some((s) => pathname === s.href || pathname.startsWith(s.href + '/'));
                        return (
                            <DropdownMenu key={link.label}>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <DropdownMenuTrigger
                                            className={cn(
                                                buttonVariants({ variant: "ghost", size: "icon" }),
                                                "h-10 w-10 rounded-xl transition-all duration-300",
                                                isActive ? "bg-slate-900 text-white shadow-lg" : "text-slate-400 hover:bg-slate-50 hover:text-slate-900"
                                            )}
                                        >
                                            <link.icon className="h-5 w-5" />
                                            <span className="sr-only">{link.label}</span>
                                        </DropdownMenuTrigger>
                                    </TooltipTrigger>
                                    <TooltipContent side="right" className="rounded-lg font-bold text-[10px] uppercase tracking-widest">
                                        <p>{link.label}</p>
                                        <p className="text-[9px] font-normal normal-case mt-0.5 text-slate-400">Категории, размеры, цвета</p>
                                    </TooltipContent>
                                </Tooltip>
                                <DropdownMenuContent side="right" align="start" className="w-56 rounded-xl border shadow-xl">
                                    {link.sections.map((section) => {
                                        const SectionIcon = section.icon;
                                        return (
                                            <DropdownMenuItem key={section.href} asChild>
                                                <Link href={section.href} className="flex items-center gap-2 cursor-pointer py-2">
                                                    <SectionIcon className="h-4 w-4 shrink-0" />
                                                    <span className="text-[11px] font-bold">{section.label}</span>
                                                </Link>
                                            </DropdownMenuItem>
                                        );
                                    })}
                                </DropdownMenuContent>
                            </DropdownMenu>
                        );
                    }
                    const navLink = link as NavLink;
                    const isActive = pathname === navLink.href || (navLink.href !== '/' && pathname.startsWith(navLink.href + '/'));
                    return (
                        <Tooltip key={navLink.href}>
                            <TooltipTrigger asChild>
                                <Link
                                    href={navLink.href}
                                    className={cn(
                                        buttonVariants({ variant: "ghost", size: "icon" }),
                                        "h-10 w-10 rounded-xl transition-all duration-300",
                                        isActive ? "bg-slate-900 text-white shadow-lg" : "text-slate-400 hover:bg-slate-50 hover:text-slate-900"
                                    )}
                                >
                                    <navLink.icon className="h-5 w-5" />
                                    <span className="sr-only">{navLink.label}</span>
                                </Link>
                            </TooltipTrigger>
                            <TooltipContent side="right" className="rounded-lg font-bold text-[10px] uppercase tracking-widest">
                                <p>{navLink.label}</p>
                            </TooltipContent>
                        </Tooltip>
                    )
                })}
            </div>
        </div>
    );
}

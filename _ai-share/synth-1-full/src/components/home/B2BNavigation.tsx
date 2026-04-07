"use client";

import { ArrowRight, BadgeCheck, ShieldCheck, Globe, Leaf, Scale, Database, Zap, ArrowUpRight, ChevronRight, Calculator, FileText, LayoutDashboard } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { b2bSections } from "./_fixtures/home-data";
import { useUIState } from "@/providers/ui-state";

interface B2BNavigationProps {
  viewRole: string;
  activeB2BSection: string;
  onSectionChange?: (id: string) => void;
  isScrolledDown: boolean;
}

export function B2BNavigation({
  viewRole,
  activeB2BSection,
  onSectionChange,
  isScrolledDown,
}: B2BNavigationProps) {
  const { isFlowMapOpen, isCalendarOpen, isMediaRadarOpen } = useUIState();
  
  if (viewRole !== "b2b") {
    return null;
  }

  const scrollToSection = (id: string) => {
    onSectionChange?.(id);
    const element = document.getElementById(id);
    if (element) {
      const yOffset = -135;
      const y =
        element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  const scrollToTopOrBottom = () => {
    if (isScrolledDown) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      window.scrollTo({
        top: document.documentElement.scrollHeight,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className={cn(
      "sticky top-[var(--header-height,48px)] z-30 w-full bg-white/90 backdrop-blur-xl border-b border-slate-200 shadow-sm py-3 transition-all duration-300",
      (isFlowMapOpen || isCalendarOpen || isMediaRadarOpen) && "opacity-0 pointer-events-none -translate-y-full"
    )}>
      <div className="container mx-auto px-14">
        <div className="flex items-center gap-1.5">
          {b2bSections.map((section) => (
            <button
              key={section.id}
              onClick={() => scrollToSection(section.id)}
              className={cn(
                "flex-1 px-1.5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wide transition-all whitespace-nowrap border flex items-center justify-center gap-1.5 group",
                activeB2BSection === section.id
                  ? "btn-tab-active"
                  : "btn-tab-inactive-light",
              )}
            >
              <section.icon
                className={cn(
                  "h-3 w-3 transition-transform shrink-0",
                  activeB2BSection === section.id
                    ? "text-white"
                    : "text-slate-400 group-hover:text-slate-600",
                )}
              />
              <span className="truncate">{section.label}</span>
            </button>
          ))}

          <Link
            href="/brand/control-center"
            className="shrink-0 px-3 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wide border border-indigo-200 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 transition-all flex items-center justify-center gap-1.5"
          >
            <LayoutDashboard className="h-3 w-3" />
            <span>Brand Center</span>
          </Link>

          <button
            onClick={scrollToTopOrBottom}
            className="h-9 w-9 rounded-xl bg-black text-white hover:bg-slate-800 flex items-center justify-center shadow-lg hover:shadow-xl group shrink-0 ml-1 button-glimmer button-professional"
            title={isScrolledDown ? "Наверх" : "Вниз"}
          >
            <ArrowRight
              className={cn(
                "h-4 w-4 transition-transform duration-500",
                isScrolledDown ? "-rotate-90" : "rotate-90",
              )}
            />
          </button>
        </div>
      </div>
    </div>
  );
}

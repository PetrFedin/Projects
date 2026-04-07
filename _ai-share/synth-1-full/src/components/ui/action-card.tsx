import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface ActionCardProps {
  title: string;
  description?: string;
  icon: LucideIcon;
  href: string;
  variant?: 'default' | 'premium' | 'glass';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function ActionCard({ 
  title, 
  description, 
  icon: Icon, 
  href, 
  variant = 'default',
  size = 'md',
  className 
}: ActionCardProps) {
  const variants = {
    default: 'bg-white hover:bg-slate-50 border-slate-200',
    premium: 'premium-gradient text-white border-transparent',
    glass: 'glass-effect hover:shadow-xl border-white/20'
  };

  const sizes = {
    sm: 'p-4',
    md: 'p-4',
    lg: 'p-4'
  };

  const iconSizes = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6'
  };

  return (
    <Link href={href}>
      <div className={cn(
        "group relative overflow-hidden rounded-2xl border transition-all duration-300",
        "hover:shadow-xl hover:-translate-y-1 active:scale-[0.98]",
        variants[variant],
        sizes[size],
        className
      )}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={cn(
              "p-3 rounded-xl transition-all group-hover:scale-110",
              variant === 'premium' ? 'bg-white/20' : 'bg-slate-100 group-hover:bg-blue-50'
            )}>
              <Icon className={cn(
                iconSizes[size],
                variant === 'premium' ? 'text-white' : 'text-blue-600'
              )} />
            </div>
            <div>
              <h3 className={cn(
                "font-bold tracking-tight",
                size === 'sm' && 'text-sm',
                size === 'md' && 'text-base',
                size === 'lg' && 'text-sm',
                variant === 'premium' ? 'text-white' : 'text-slate-900'
              )}>
                {title}
              </h3>
              {description && (
                <p className={cn(
                  "text-xs mt-1",
                  variant === 'premium' ? 'text-white/80' : 'text-slate-500'
                )}>
                  {description}
                </p>
              )}
            </div>
          </div>
          <ArrowRight className={cn(
            "transition-transform group-hover:translate-x-1",
            iconSizes[size],
            variant === 'premium' ? 'text-white' : 'text-slate-400 group-hover:text-blue-600'
          )} />
        </div>
      </div>
    </Link>
  );
}

// Usage examples:
// <ActionCard 
//   title="Create Product" 
//   description="Add new item to catalog"
//   icon={Plus} 
//   href="/brand/products/new"
//   variant="default"
//   size="md"
// />
//
// <ActionCard 
//   title="Go Premium" 
//   icon={Crown} 
//   href="/upgrade"
//   variant="premium"
// />

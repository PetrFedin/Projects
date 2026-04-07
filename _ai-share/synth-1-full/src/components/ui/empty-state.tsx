import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";
import { Button } from "./button";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
    icon?: LucideIcon;
  };
  variant?: 'default' | 'compact' | 'illustrated';
  className?: string;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  variant = 'default',
  className
}: EmptyStateProps) {
  const variants = {
    default: {
      container: 'py-10 px-8',
      icon: 'h-12 w-12 mb-6',
      title: 'text-sm',
      description: 'text-base'
    },
    compact: {
      container: 'py-12 px-6',
      icon: 'h-12 w-12 mb-4',
      title: 'text-base',
      description: 'text-sm'
    },
    illustrated: {
      container: 'py-24 px-8',
      icon: 'h-24 w-24 mb-8',
      title: 'text-base',
      description: 'text-sm'
    }
  };

  const v = variants[variant];

  return (
    <div className={cn(
      "flex flex-col items-center justify-center text-center",
      v.container,
      className
    )}>
      {/* Icon with background */}
      <div className="relative mb-6">
        <div className="absolute inset-0 bg-blue-500/10 rounded-full blur-2xl scale-150" />
        <div className="relative bg-gradient-to-br from-slate-50 to-slate-100 p-4 rounded-3xl shadow-soft">
          <Icon className={cn(v.icon, "text-slate-400")} />
        </div>
      </div>

      {/* Content */}
      <h3 className={cn(
        "font-black tracking-tight text-slate-900 mb-3",
        v.title
      )}>
        {title}
      </h3>
      <p className={cn(
        "text-slate-500 max-w-md font-medium leading-relaxed mb-6",
        v.description
      )}>
        {description}
      </p>

      {/* Action */}
      {action && (
        <Button
          onClick={action.onClick}
          className="premium-gradient text-white px-8 py-3 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all"
        >
          {action.icon && <action.icon className="mr-2 h-4 w-4" />}
          {action.label}
        </Button>
      )}
    </div>
  );
}

// Usage example:
// <EmptyState
//   icon={ShoppingBag}
//   title="Нет активных заказов"
//   description="Начните добавлять товары в корзину, чтобы создать первый заказ"
//   action={{
//     label: "Перейти к каталогу",
//     onClick: () => router.push('/products'),
//     icon: ArrowRight
//   }}
//   variant="default"
// />

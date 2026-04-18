import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';
import { Button } from './button';

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
  className,
}: EmptyStateProps) {
  const variants = {
    default: {
      container: 'py-10 px-8',
      icon: 'h-12 w-12 mb-6',
      title: 'text-sm',
      description: 'text-base',
    },
    compact: {
      container: 'py-12 px-6',
      icon: 'h-12 w-12 mb-4',
      title: 'text-base',
      description: 'text-sm',
    },
    illustrated: {
      container: 'py-24 px-8',
      icon: 'h-24 w-24 mb-8',
      title: 'text-base',
      description: 'text-sm',
    },
  };

  const v = variants[variant];

  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center text-center',
        v.container,
        className
      )}
    >
      {/* Icon with background */}
      <div className="relative mb-6">
        <div className="absolute inset-0 scale-150 rounded-full bg-blue-500/10 blur-2xl" />
        <div className="from-bg-surface2 to-bg-surface2 shadow-soft relative rounded-3xl bg-gradient-to-br p-4">
          <Icon className={cn(v.icon, 'text-text-muted')} />
        </div>
      </div>

      {/* Content */}
      <h3 className={cn('text-text-primary mb-3 font-black tracking-tight', v.title)}>{title}</h3>
      <p
        className={cn(
          'text-text-secondary mb-6 max-w-md font-medium leading-relaxed',
          v.description
        )}
      >
        {description}
      </p>

      {/* Action */}
      {action && (
        <Button
          onClick={action.onClick}
          className="premium-gradient rounded-xl px-8 py-3 font-bold text-white shadow-lg transition-all hover:shadow-xl"
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

'use client';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

/** Единая подпись persist-кнопок operational panels W2. */
export const W2_DOSSIER_PERSIST_LABEL = 'Сохранить в досье';

type Props = {
  busy?: boolean;
  disabled?: boolean;
  onClick: () => void;
  className?: string;
  variant?: 'outline' | 'default' | 'secondary';
  testId?: string;
  title?: string;
};

export function Workshop2DossierPersistButton({
  busy = false,
  disabled = false,
  onClick,
  className,
  variant = 'outline',
  testId,
  title,
}: Props) {
  return (
    <Button
      type="button"
      size="sm"
      variant={variant}
      className={cn('h-7 text-[10px]', className)}
      disabled={disabled || busy}
      onClick={onClick}
      data-testid={testId}
      title={title}
    >
      {busy ? '…' : W2_DOSSIER_PERSIST_LABEL}
    </Button>
  );
}

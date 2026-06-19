import { redirect } from 'next/navigation';
import { isPlatformCoreMode } from '@/lib/cabinet-core-mode';

export default function PlatformLayout({ children }: { children: React.ReactNode }) {
  if (!isPlatformCoreMode()) {
    redirect('/');
  }

  return children;
}

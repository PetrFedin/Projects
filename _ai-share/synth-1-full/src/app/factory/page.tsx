import { redirect } from 'next/navigation';
import { ROUTES } from '@/lib/routes';

/** Корень `/factory` — ветка по умолчанию: производство. */
export default function FactoryRootPage() {
  redirect(ROUTES.factory.production);
}

import type { ReactNode } from 'react';
import type { Metadata } from 'next';
import { Workshop2ClientLayout } from './workshop2-client-layout';

export const metadata: Metadata = {
  title: 'Разработка коллекции',
  description:
    'Артикул → ТЗ → согласования → образец → шоурум. На шкале коллекции: слева разработка и ТЗ (в т.ч. gate-all-stakeholders в матрице этапов), справа от supply-path — сэмплы и выпуск; без серии и оптовых заказов.',
};

export default function Workshop2Layout({ children }: { children: ReactNode }) {
  return <Workshop2ClientLayout>{children}</Workshop2ClientLayout>;
}

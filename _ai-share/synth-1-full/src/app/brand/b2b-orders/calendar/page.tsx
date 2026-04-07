import { redirect } from 'next/navigation';

/** Календарь отгрузок — часть единого Strategic Planner */
export default function BrandB2BOrdersCalendarPage() {
  redirect('/brand/calendar?layers=orders,meetings,tasks');
}

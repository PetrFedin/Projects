import { redirect } from 'next/navigation';

/** Редирект /brand/calendar/Syntha и любых подпутей на основной календарь */
export default function CalendarSlugPage() {
  redirect('/brand/calendar');
}

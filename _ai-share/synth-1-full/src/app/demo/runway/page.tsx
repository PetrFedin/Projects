import { redirect } from 'next/navigation';

/** Точка входа investor demo — флагман silk-midi-dress в runway-режиме. */
export default function DemoRunwayPage() {
  redirect('/products/silk-midi-dress?view=runway&section=0');
}

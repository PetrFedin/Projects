/** Список гостей и участников сессий в шоуруме. */
export function getShowroomGuestList(sessionId: string) {
  return [
    {
      id: 'G-01',
      name: 'Dmitry S.',
      company: 'Trend Retail Moscow',
      role: 'Head Buyer',
      confirmed: true,
    },
    {
      id: 'G-02',
      name: 'Maria L.',
      company: 'Siberia Fashion Hub',
      role: 'Owner',
      confirmed: true,
    },
    {
      id: 'G-03',
      name: 'Alex K.',
      company: 'Global Logistics RU',
      role: 'Consultant',
      confirmed: false,
    },
  ];
}

/**
 * Brand profile export — CSV/Excel and PDF (print).
 * Для B2B-партнёров и инвесторов.
 */

export function exportToCSV(
  data: Record<string, string | number>[],
  columns: { key: string; label: string }[],
  filename: string
) {
  const header = columns.map((c) => c.label).join(',');
  const rows = data.map((row) =>
    columns
      .map((c) => {
        const val = row[c.key];
        const str = val == null ? '' : String(val);
        return str.includes(',') || str.includes('"') ? `"${str.replace(/"/g, '""')}"` : str;
      })
      .join(',')
  );
  const csv = [header, ...rows].join('\n');
  const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${filename}-${Date.now()}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

/** Экспорт профиля в CSV (DNA + контакты + коммерция) */
function csvScalar(v: string | number | boolean | undefined | null): string {
  if (v == null) return '';
  if (typeof v === 'boolean') return v ? 'да' : 'нет';
  return String(v);
}

export function exportBrandProfileCSV(data: {
  brand: { name: string; description: string; countryOfOrigin: string; foundedYear: number };
  dna: Record<string, string | string[]>;
  contacts: Record<string, string | number | boolean>;
  commerce: Record<string, string | number | boolean>;
  legal?: Record<string, string | number | boolean>;
}) {
  const rows: Record<string, string | number>[] = [];
  const { brand, dna, contacts, commerce, legal } = data;

  rows.push({ section: 'Бренд', key: 'Название', value: brand.name });
  rows.push({ section: 'Бренд', key: 'Описание', value: brand.description });
  rows.push({ section: 'Бренд', key: 'Страна', value: brand.countryOfOrigin });
  rows.push({ section: 'Бренд', key: 'Год основания', value: brand.foundedYear });

  Object.entries(dna).forEach(([k, v]) => {
    rows.push({ section: 'DNA', key: k, value: Array.isArray(v) ? v.join('; ') : v });
  });

  Object.entries(contacts).forEach(([k, v]) => {
    rows.push({ section: 'Контакты', key: k, value: csvScalar(v) });
  });

  Object.entries(commerce).forEach(([k, v]) => {
    rows.push({ section: 'Коммерция', key: k, value: csvScalar(v) });
  });

  if (legal) {
    Object.entries(legal).forEach(([k, v]) => {
      rows.push({ section: 'Юр. данные', key: k, value: csvScalar(v) });
    });
  }

  exportToCSV(
    rows,
    [
      { key: 'section', label: 'Раздел' },
      { key: 'key', label: 'Поле' },
      { key: 'value', label: 'Значение' },
    ],
    'brand-profile'
  );
}

/** PDF — print текущей страницы или Brand Book */
export function exportBrandProfilePDF() {
  window.print();
}

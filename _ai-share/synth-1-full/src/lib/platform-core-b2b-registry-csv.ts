/** Client-side CSV export для реестров B2B (brand / shop). */
export function downloadB2bRegistryCsv(
  filename: string,
  header: string[],
  rows: Array<Array<string | number>>
): void {
  const csv = [header, ...rows]
    .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(','))
    .join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

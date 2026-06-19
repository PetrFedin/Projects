/** Служебные слова — не оставляем отдельной строкой в заголовках матрицы. */
const MATRIX_LABEL_JOINERS = new Set([
  'и',
  'в',
  'на',
  'по',
  'с',
  'к',
  'о',
  'у',
  'за',
  'из',
  'от',
  'до',
  'для',
  'а',
  'но',
  'или',
]);

/**
 * 1–2 строки для узких столбцов hub-матрицы.
 * «Коллекция и витрина» → ['Коллекция и', 'витрина'], не ['Коллекция', 'и', 'витрина'].
 */
export function stackHubMatrixLabelLines(text: string, maxLines = 2): string[] {
  const words = text.trim().split(/\s+/).filter(Boolean);
  if (words.length <= 1) return [text.trim()];

  const groups: string[] = [];
  for (let i = 0; i < words.length; i++) {
    const word = words[i]!;
    const lower = word.toLowerCase();
    if (MATRIX_LABEL_JOINERS.has(lower)) {
      if (groups.length > 0) {
        groups[groups.length - 1] = `${groups[groups.length - 1]} ${word}`;
      } else if (i + 1 < words.length) {
        groups.push(`${word} ${words[i + 1]}`);
        i += 1;
      } else {
        groups.push(word);
      }
    } else {
      groups.push(word);
    }
  }

  if (groups.length <= maxLines) return groups;

  const mid = Math.ceil(groups.length / 2);
  return [groups.slice(0, mid).join(' '), groups.slice(mid).join(' ')];
}

export function formatRuPhone(raw: string) {
  const digits0 = (raw || '').replace(/\D/g, '');
  if (!digits0) return '';

  let digits = digits0;
  if (digits.startsWith('8')) digits = `7${digits.slice(1)}`;
  if (digits.startsWith('9')) digits = `7${digits}`;
  if (!digits.startsWith('7')) digits = `7${digits}`;
  digits = digits.slice(0, 11);

  const rest = digits.slice(1); // 10 digits
  let out = '+7';
  if (rest.length > 0) out += ` (${rest.slice(0, 3)}`;
  if (rest.length >= 3) out += ')';
  if (rest.length > 3) out += ` ${rest.slice(3, 6)}`;
  if (rest.length > 6) out += `-${rest.slice(6, 8)}`;
  if (rest.length > 8) out += `-${rest.slice(8, 10)}`;
  return out;
}

export function calcAge(iso?: string): number | null {
  if (!iso) return null;
  const d = new Date(`${iso}T00:00:00`);
  if (Number.isNaN(d.getTime())) return null;
  const now = new Date();
  let age = now.getFullYear() - d.getFullYear();
  const m = now.getMonth() - d.getMonth();
  if (m < 0 || (m === 0 && now.getDate() < d.getDate())) age--;
  return age;
}

export function nicknameBase(firstNameEn?: string, lastNameEn?: string) {
  const a = (firstNameEn || '').trim().toLowerCase();
  const b = (lastNameEn || '').trim().toLowerCase();
  const safe = (s: string) => s.replace(/[^a-z0-9]+/g, '').slice(0, 24);
  const left = safe(a);
  const right = safe(b);
  if (!left && !right) return '';
  if (!right) return left;
  if (!left) return right;
  return `${left}.${right}`;
}

export function pickUniqueNickname(base: string, taken: Set<string>) {
  const b = base.trim().toLowerCase();
  if (!b) return '';
  if (!taken.has(b)) return b;
  for (let i = 2; i < 1000; i++) {
    const candidate = `${b}${i}`;
    if (!taken.has(candidate)) return candidate;
  }
  return `${b}${Date.now() % 10000}`;
}

export function parseList(s?: string) {
  if (!s) return undefined;
  const items = s
    .split(/[,|\n]/g)
    .map((v) => v.trim())
    .filter(Boolean);
  return items.length ? items : undefined;
}

export const transliterate = (text: string): string => {
  const map: Record<string, string> = {
    а: 'a',
    б: 'b',
    в: 'v',
    г: 'g',
    д: 'd',
    е: 'e',
    ё: 'yo',
    ж: 'zh',
    з: 'z',
    и: 'i',
    й: 'j',
    к: 'k',
    л: 'l',
    м: 'm',
    н: 'n',
    о: 'o',
    п: 'p',
    р: 'r',
    с: 's',
    т: 't',
    у: 'u',
    ф: 'f',
    х: 'kh',
    ц: 'ts',
    ч: 'ch',
    ш: 'sh',
    щ: 'shch',
    ъ: '',
    ы: 'y',
    ь: '',
    э: 'e',
    ю: 'yu',
    я: 'ya',
  };
  return text
    .toLowerCase()
    .split('')
    .map((char) => map[char] || char)
    .join('')
    .replace(/[^a-z0-9_]/g, '');
};

export function readTakenNicknames(excludeEmail?: string): Set<string> {
  // Mock function for build/demo purposes
  return new Set(['admin', 'syntha', 'shop', 'brand', 'test', 'elena.petrova']);
}

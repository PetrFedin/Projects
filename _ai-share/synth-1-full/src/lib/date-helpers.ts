export function parseISO(s: string): Date { return new Date(s); }
export function startOfDay(d: Date): Date { const x = new Date(d); x.setHours(0, 0, 0, 0); return x; }
export function startOfMonth(d: Date): Date { const x = new Date(d); x.setDate(1); x.setHours(0, 0, 0, 0); return x; }
export function endOfMonth(d: Date): Date { const x = new Date(d); x.setMonth(x.getMonth() + 1); x.setDate(0); x.setHours(23, 59, 59, 999); return x; }
export function startOfWeek(d: Date): Date { const x = startOfDay(d); const day = x.getDay(); const diff = day === 0 ? -6 : 1 - day; x.setDate(x.getDate() + diff); return x; }
export function addDays(d: Date, days: number): Date { const x = new Date(d); x.setDate(x.getDate() + days); return x; }
export function isSameDay(a: Date, b: Date): boolean { return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate(); }
export function isSameMonth(a: Date, b: Date): boolean { return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth(); }
export function formatMonthLabel(d: Date): string { return d.toLocaleDateString("ru-RU", { month: "long", year: "numeric" }); }
export function formatDateLabel(d: Date): string { return d.toLocaleDateString("ru-RU", { day: "2-digit", month: "2-digit", year: "numeric" }); }
export function formatTimeLabel(d: Date): string { return d.toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" }); }
export function clamp(n: number, min: number, max: number): number { return Math.max(min, Math.min(max, n)); }
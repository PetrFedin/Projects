import { SEEDED_LOOKS, LookPost } from "@/data/looks.seed";

const LS_KEY = "syntha_looks_feed_v1";

export interface LooksRepo {
  list(): Promise<LookPost[]>;
  like(id: string): Promise<void>;
  ingestSavedLooks(): Promise<void>;
}

export class MockLooksRepo implements LooksRepo {
  async list(): Promise<LookPost[]> {
    if (typeof window === "undefined") return SEEDED_LOOKS;

    const raw = localStorage.getItem(LS_KEY);
    if (!raw) {
      localStorage.setItem(LS_KEY, JSON.stringify(SEEDED_LOOKS));
      return SEEDED_LOOKS;
    }
    try {
      return JSON.parse(raw) as LookPost[];
    } catch {
      return SEEDED_LOOKS;
    }
  }

  async like(id: string): Promise<void> {
    if (typeof window === "undefined") return;

    const items = await this.list();
    const next = items.map(x => x.id === id ? { ...x, likes: x.likes + 1 } : x);
    localStorage.setItem(LS_KEY, JSON.stringify(next));
  }

  /**
   * Забираем то, что AI Stylist сохранял в localStorage (syntha_saved_looks)
   * и превращаем в посты ленты.
   */
  async ingestSavedLooks(): Promise<void> {
    if (typeof window === "undefined") return;

    const savedKey = "syntha_saved_looks";
    const savedRaw = localStorage.getItem(savedKey);
    if (!savedRaw) return;

    try {
      const savedLooks = JSON.parse(savedRaw) as any[];
      if (!Array.isArray(savedLooks) || !savedLooks.length) return;

      const current = await this.list();
      const ids = new Set(current.map(x => x.id));

      // простая конвертация
      const converted: LookPost[] = savedLooks.slice(0, 10).map((l, idx) => ({
        id: `user-${l.id ?? idx}`,
        title: l.title ?? "Saved Look",
        author: "you@local",
        createdAtISO: new Date().toISOString(),
        tags: ["ai-stylist"],
        items: (l.items ?? []).map((it: any) => ({
          title: it?.title ?? "Item",
          brand: it?.brand ?? "Brand",
          price: it?.price ?? 0,
          image: it?.image ?? "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?q=80&w=800",
        })),
        likes: 0,
        views: Math.floor(50 + idx * 13),
      }));

      const merged = [...converted.filter(x => !ids.has(x.id)), ...current];
      localStorage.setItem(LS_KEY, JSON.stringify(merged));
    } catch (e) {
      console.error("Failed to ingest saved looks:", e);
    }
  }
}

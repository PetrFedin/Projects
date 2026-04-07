export type CmsHero = {
  title: string;
  subtitle: string;
  ctaLabel: string;
  ctaHref: string;
  backgroundUrl?: string; // картинка или видео-постер
};

export type CmsStory = {
  id: string;
  title: string;
  cover: string;
  href?: string;
  tag?: string;
};

export type BroadcastType = 'product_launch' | 'interview' | 'trend_review' | 'fashion_show';

export type LiveFeatures = {
  showProducts: boolean;
  showChat: boolean;
  showReactions: boolean;
  showStats: boolean;
};

export type CmsLive = {
  id: string;
  title: string;
  brand: string;
  startsAtISO: string;
  cover: string;
  broadcastType?: BroadcastType;
  features?: LiveFeatures;
};

export type CmsCarousel = {
  id: string;
  title: string;
  subtitle?: string;
  productSlugs: string[];
};

export type CmsHomeConfig = {
  hero: CmsHero;
  stories: CmsStory[];
  live: CmsLive[];
  carousels: CmsCarousel[];
  updatedAtISO: string;
};

export const DEFAULT_HOME_CMS: CmsHomeConfig = {
  hero: {
    title: "Syntha — Digital Fashion Laboratory & Market Room",
    subtitle: "Создавай, презентуй и продавай коллекции в AI-экосистеме. Phygital. Аналитика. Комьюнити.",
    ctaLabel: "Смотреть коллекции",
    ctaHref: "/search?q=",
    backgroundUrl: "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?q=80&w=2000",
  },
  stories: [
    { id: "s1", title: "Новый дроп недели", cover: "https://images.unsplash.com/photo-1539533018447-63fcce2678e3?q=80&w=800", href: "/search?q=drop", tag: "DROP" },
    { id: "s2", title: "Образы комьюнити", cover: "https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?q=80&w=800", href: "/looks", tag: "COMMUNITY" },
    { id: "s3", title: "Live shopping", cover: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=800", href: "/live", tag: "LIVE" },
    { id: "s4", title: "AR Preview", cover: "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?q=80&w=800", href: "/ar", tag: "AR" },
  ],
  live: [
    { 
      id: "l1", 
      title: "Live: Capsule FW", 
      brand: "Syntha Studio", 
      startsAtISO: "2026-01-20T18:00:00Z", 
      cover: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?q=80&w=800",
      broadcastType: 'product_launch',
      features: {
        showProducts: true,
        showChat: true,
        showReactions: true,
        showStats: true
      }
    },
    { 
      id: "l2", 
      title: "Live: Sport Luxe", 
      brand: "Syntha Sport", 
      startsAtISO: "2026-01-27T18:00:00Z", 
      cover: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=800",
      broadcastType: 'interview',
      features: {
        showProducts: false,
        showChat: true,
        showReactions: true,
        showStats: false
      }
    },
    { 
      id: "l3", 
      title: "Live: Eco Minimal", 
      brand: "Nordic Wool", 
      startsAtISO: "2026-02-05T18:00:00Z", 
      cover: "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?q=80&w=800",
      broadcastType: 'trend_review',
      features: {
        showProducts: true,
        showChat: true,
        showReactions: true,
        showStats: true
      }
    },
    { 
      id: "l4", 
      title: "Live: Tech Future", 
      brand: "Cyber Lab", 
      startsAtISO: "2026-02-12T18:00:00Z", 
      cover: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=800",
      broadcastType: 'fashion_show',
      features: {
        showProducts: true,
        showChat: true,
        showReactions: true,
        showStats: true
      }
    },
  ],
  carousels: [
    { id: "c1", title: "Новинки", subtitle: "Последние добавления", productSlugs: ["cashmere-crewneck-sweater", "performance-work-pant", "silk-midi-dress", "oversized-hoodie-women"] },
    { id: "c2", title: "Хиты продаж", subtitle: "Самое популярное", productSlugs: ["kids-tech-hoodie", "girls-floral-dress", "baby-organic-onesie"] },
  ],
  updatedAtISO: new Date(2026, 0, 15).toISOString(),
};

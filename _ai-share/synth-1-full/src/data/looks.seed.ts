export type LookPost = {
  id: string;
  title: string;
  author: string;
  createdAtISO: string;
  tags: string[];
  items: { title: string; brand: string; price: number; image: string }[];
  likes: number;
  views: number;
};

export const SEEDED_LOOKS: LookPost[] = [
  {
    id: "lp1",
    title: "Sport Luxe Golf Capsule",
    author: "curator@syntha",
    createdAtISO: new Date(2026, 0, 10).toISOString(),
    tags: ["sport-luxe", "golf", "premium"],
    items: [
      { title: "Tech Jacket Taupe", brand: "Syntha Studio", price: 28900, image: "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?q=80&w=800" },
      { title: "Pleated Skirt Cream", brand: "Syntha Studio", price: 15900, image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=800" },
      { title: "Golf Shoes White", brand: "Syntha Sport", price: 21900, image: "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?q=80&w=800" },
    ],
    likes: 132,
    views: 890,
  },
];

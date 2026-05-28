import { EditorialArticle } from '../types/editorial';

/**
 * Editorial Content Mock / Fetcher
 */

export const MOCK_ARTICLES: EditorialArticle[] = [
  {
    id: 'art-1',
    title: 'Metallic Textures: SS26 Key Trends',
    slug: 'metallic-textures-ss26',
    subtitle: 'Why liquid metal is the new black this season.',
    author: { name: 'Viktoria B.', role: 'Trend Analyst' },
    category: 'trend_report',
    status: 'published',
    mainImageUrl:
      'https://images.unsplash.com/photo-1539109132304-39294f18639b?q=80&w=2070&auto=format&fit=crop', // Silver/Metallic fashion
    summary: 'Exploring the shift towards high-gloss materials in luxury fashion.',
    contentNodes: [
      {
        type: 'text',
        content:
          'The upcoming SS26 season is defined by a bold return to futurism. Liquid-like metallics, ranging from molten silver to iridescent mercury-inspired fabrics, are dominating the high-fashion circuit.',
      },
      {
        type: 'image',
        content: {
          url: 'https://images.unsplash.com/photo-1581044777550-4cfa60707c33?q=80&w=1972&auto=format&fit=crop',
          caption: 'Futuristic silhouettes in high-gloss fabrics.',
        },
      },
      {
        type: 'quote',
        content:
          "The metallic trend isn't just about surface shine; it's about the intersection of technology and artisanal craft.",
      },
    ],
    tags: ['Trend', 'SS26', 'Luxury', 'Metallic'],
    readingTime: 5,
    publishedAt: '2026-03-05T10:00:00Z',
    viewCount: 12450,
    featuredProducts: ['p-1', 'p-4'],
  },
  {
    id: 'art-2',
    title: 'Digital Twins: The Metaverse Design Talk',
    slug: 'interview-digital-design',
    subtitle: 'Exclusive talk with Synth Lab designers.',
    author: { name: 'Artem N.', role: 'Digital Creator' },
    category: 'interview',
    status: 'published',
    mainImageUrl:
      'https://images.unsplash.com/photo-1614850523296-d8c1af93d400?q=80&w=2070&auto=format&fit=crop', // Cyberpunk/Digital look
    summary: 'How digital twins are changing the physical design process.',
    contentNodes: [
      {
        type: 'text',
        content:
          "Synth Lab is pushing the boundaries of what's possible in fashion design by using digital twins from the very first sketch.",
      },
    ],
    tags: ['Digital', 'Web3', 'Innovation', 'Future'],
    readingTime: 8,
    publishedAt: '2026-03-07T12:00:00Z',
    viewCount: 8900,
  },
  {
    id: 'art-3',
    title: 'Organic Cotton: The Sustainable Shift',
    slug: 'sustainable-cotton-ss26',
    subtitle: 'How brands are redefining ethical sourcing.',
    author: { name: 'Elena G.', role: 'ESG Consultant' },
    category: 'sustainability',
    status: 'published',
    mainImageUrl:
      'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?q=80&w=2070&auto=format&fit=crop', // Cotton/Natural look
    summary: 'A deep dive into the supply chain of organic cotton for the new season.',
    contentNodes: [
      { type: 'text', content: 'Sustainability is no longer a choice, it is the standard.' },
    ],
    tags: ['Eco', 'ESG', 'Organic', 'Materials'],
    readingTime: 6,
    publishedAt: '2026-03-08T08:00:00Z',
    viewCount: 4500,
  },
];

export function getArticleBySlug(slug: string): EditorialArticle | undefined {
  return MOCK_ARTICLES.find((a) => a.slug === slug);
}

export function getTrendingArticles(): EditorialArticle[] {
  return MOCK_ARTICLES.filter((a) => a.status === 'published').sort(
    (a, b) => b.viewCount - a.viewCount
  );
}

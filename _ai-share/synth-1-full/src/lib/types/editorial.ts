/**
 * Editorial CMS Types
 */

export type EditorialStatus = 'draft' | 'scheduled' | 'published' | 'archived';
export type EditorialCategory = 'trend_report' | 'interview' | 'collection_launch' | 'event' | 'sustainability';

export interface EditorialArticle {
  id: string;
  title: string;
  slug: string;
  subtitle: string;
  author: { name: string, role: string, avatar?: string };
  category: EditorialCategory;
  status: EditorialStatus;
  
  // Content
  mainImageUrl: string;
  summary: string;
  contentNodes: EditorialBlock[];
  
  // Metadata
  tags: string[];
  readingTime: number; // minutes
  publishedAt?: string;
  viewCount: number;
  
  // Shopping Context
  featuredProducts?: string[]; // Product IDs
}

export interface EditorialBlock {
  type: 'text' | 'image' | 'product_carousel' | 'quote' | 'video';
  content: any;
  layout?: 'full' | 'split' | 'centered';
}

export interface MarketroomConfig {
  heroArticleId: string;
  trendingTags: string[];
  featuredCreators: string[];
}

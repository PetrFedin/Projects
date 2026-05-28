import type { Assessment, EducationCourse, KnowledgeArticle } from '@/lib/types';

const WIKI_CATEGORY_TO_COURSE: Record<string, EducationCourse['category']> = {
  Economics: 'economics',
  Экономика: 'economics',
  Legal: 'legal',
  Право: 'legal',
  Design: 'design',
  Дизайн: 'design',
  Retail: 'retail',
  Ритейл: 'retail',
  Management: 'management',
  Менеджмент: 'management',
  Analytics: 'analytics',
  Аналитика: 'analytics',
  Production: 'production',
  Производство: 'production',
};

const THUMB_BY_CATEGORY: Record<EducationCourse['category'], string> = {
  economics: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?q=80&w=800',
  design: 'https://images.unsplash.com/photo-1558655146-d09347e92766?q=80&w=800',
  production: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=800',
  analytics: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=800',
  management: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?q=80&w=800',
  retail: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=800',
  legal: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?q=80&w=800',
};

const ASSESSMENT_THUMB_BY_CATEGORY: Record<EducationCourse['category'], string> = {
  economics: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?q=80&w=800',
  design: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=800',
  production: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=800',
  analytics: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=800',
  management: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=800',
  retail: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=800',
  legal: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?q=80&w=800',
};

export function articleToCourse(article: KnowledgeArticle): EducationCourse {
  const category = WIKI_CATEGORY_TO_COURSE[article.category] ?? 'analytics';
  return {
    id: article.id,
    title: article.title,
    description: article.excerpt,
    thumbnail: THUMB_BY_CATEGORY[category],
    duration: '—',
    level: 'intermediate',
    targetRoles: ['shop'],
    catalogSource: 'platform',
    audienceKind: 'individual',
    category,
    provider: 'Syntha Academy',
    providerKind: 'syntha',
    access: 'free',
    outcomeKind: 'casual',
    rating: 5,
    studentsCount: 0,
  };
}

export function assessmentToCourse(assessment: Assessment): EducationCourse {
  return {
    id: assessment.id,
    title: assessment.title,
    description: assessment.description,
    thumbnail: ASSESSMENT_THUMB_BY_CATEGORY[assessment.category],
    duration: '—',
    level: 'intermediate',
    targetRoles: assessment.targetRoles,
    catalogSource: 'platform',
    audienceKind: 'professional',
    professionalScope: 'single_role',
    category: assessment.category,
    provider: 'Syntha Academy',
    providerKind: 'syntha',
    access: 'free',
    outcomeKind: 'certificate',
    rating: 5,
    studentsCount: assessment.questions.length,
  };
}

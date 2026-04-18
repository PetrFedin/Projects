import type { Metadata } from 'next';

interface GenerateMetadataOptions {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'product';
  noIndex?: boolean;
}

const defaultMetadata = {
  title: 'Syntha OS — Операционная система для fashion индустрии',
  description:
    'Профессиональная B2B2C платформа для fashion брендов, магазинов и клиентов. AI-стилист, цифровой шоурум, аналитика и многое другое.',
  image: '/og-image.jpg',
  url: 'https://syntha.os',
};

export function generateMetadata(options: GenerateMetadataOptions = {}): Metadata {
  const { title, description, image, url, type = 'website', noIndex = false } = options;

  const fullTitle = title ? `${title} | Syntha OS` : defaultMetadata.title;

  const metaDescription = description || defaultMetadata.description;
  const metaImage = image || defaultMetadata.image;
  const metaUrl = url || defaultMetadata.url;
  const ogType: 'website' | 'article' = type === 'article' ? 'article' : 'website';

  return {
    title: fullTitle,
    description: metaDescription,
    ...(noIndex && {
      robots: {
        index: false,
        follow: false,
      },
    }),
    openGraph: {
      title: fullTitle,
      description: metaDescription,
      url: metaUrl,
      siteName: 'Syntha OS',
      images: [
        {
          url: metaImage,
          width: 1200,
          height: 630,
          alt: fullTitle,
        },
      ],
      locale: 'ru_RU',
      type: ogType,
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description: metaDescription,
      images: [metaImage],
    },
    alternates: {
      canonical: metaUrl,
    },
  };
}

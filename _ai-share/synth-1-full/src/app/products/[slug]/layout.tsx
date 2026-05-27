import type { Metadata } from 'next';
import { generateMetadata as buildSiteMetadata } from '@/lib/metadata';
import {
  buildRunwayProductMetadata,
  findProductBySlug,
  type RunwayMetadataSearchParams,
} from '@/lib/runway-metadata';
import { buildRunwayProductJsonLd } from '@/lib/runway/runway-product-jsonld';

type LayoutProps = {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
};

type SearchParams = Promise<RunwayMetadataSearchParams>;

export async function generateMetadata({
  params,
  searchParams,
}: {
  params: LayoutProps['params'];
  /** В layout Next.js searchParams может отсутствовать — OG fallback без section. */
  searchParams?: SearchParams;
}): Promise<Metadata> {
  const { slug } = await params;
  const sp = searchParams ? await searchParams : {};
  const product = findProductBySlug(slug);

  if (!product) {
    return buildSiteMetadata({ title: 'Товар не найден', noIndex: true });
  }

  const runway = buildRunwayProductMetadata(product, sp);

  return buildSiteMetadata({
    title: runway.title,
    description: runway.description,
    image: runway.imageUrl,
    url: runway.canonical,
    type: 'website',
  });
}

export default async function ProductSlugLayout({
  children,
  params,
  searchParams,
}: {
  children: React.ReactNode;
  params: LayoutProps['params'];
  searchParams?: SearchParams;
}) {
  const { slug } = await params;
  const sp = searchParams ? await searchParams : {};
  const product = findProductBySlug(slug);
  const jsonLd = product ? buildRunwayProductJsonLd(product, sp) : null;

  return (
    <>
      {jsonLd ? (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      ) : null}
      {children}
    </>
  );
}

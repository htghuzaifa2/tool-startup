
import { MetadataRoute } from 'next'
import { tools } from '@/lib/search-data';

export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://tool.huzi.pk';

  const toolUrls: MetadataRoute.Sitemap = tools.map((tool) => ({
    url: `${baseUrl}${tool.href}`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 0.8,
  }));

  const staticUrls: MetadataRoute.Sitemap = [
    '/',
    '/about',
    '/contact',
    '/guide',
  ].map((url) => ({
    url: `${baseUrl}${url}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: url === '/' ? 1 : 0.5,
  }));

  return [
    ...staticUrls,
    ...toolUrls
  ].filter((v, i, a) => a.findIndex(v2 => (v2.url === v.url)) === i); // remove duplicates
}

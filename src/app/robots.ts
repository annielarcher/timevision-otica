import { type MetadataRoute } from 'next';

const URL = 'https://timevision.com.br';
 
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['admin'],
    },
    sitemap: `${URL}/sitemap.xml`,
  }
}

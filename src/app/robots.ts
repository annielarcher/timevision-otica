import { type MetadataRoute } from 'next';

const URL = 'https://bandasinfonicanacional.com.br';
 
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/portfolio-gerador'],
    },
    sitemap: `${URL}/sitemap.xml`,
  }
}

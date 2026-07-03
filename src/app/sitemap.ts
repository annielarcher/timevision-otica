import { type MetadataRoute } from 'next'

const URL = 'https://bandasinfonicanacional.com.br';

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = [
    '',
    '/agenda',
    '/sobre',
    '/idealizadores',
    '/integrantes',
    '/noticias',
  ];

  const staticUrls = staticRoutes.map((route) => ({
    url: `${URL}${route}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: route === '' ? 1.0 : 0.8,
  }));

  // Se houvesse páginas dinâmicas (ex: notícias detalhadas), elas seriam adicionadas aqui.
  
  return [
    ...staticUrls,
  ];
}

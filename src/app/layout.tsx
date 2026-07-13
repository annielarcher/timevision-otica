import type { Metadata } from 'next';
import './globals.css';
import { cn } from '@/lib/utils';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Toaster } from '@/components/ui/toaster';
import { Analytics } from "@vercel/analytics/next";
import { ImageAssets } from '@/lib/placeholder-images';
import localFont from 'next/font/local';
import { Lora } from 'next/font/google';

const lora = Lora({
  subsets: ['latin'],
  variable: '--font-lora',
  weight: ['400', '500', '600', '700'],
  display: 'swap',
});

const soligant = localFont({
  src: '../../public/fonts/Soligant.otf',
  variable: '--font-soligant',
  display: 'swap',
});

const title = 'Timevision Ótica';
const description = 'Atendimento óptico especializado itinerante para empresas, igrejas e pessoa física. Armações e lentes das marcas mais conceituadas sob medida.';
const imageUrl = '/og-image.png';

const siteUrl = 'https://timevision-otica.com.br';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: title,
    template: `%s | ${title}`,
  },
  description: description,
  keywords: [
    'Timevision Ótica',
    'timevision-otica',
    'ótica',
    'exame de vista',
    'óculos de grau',
    'óculos de sol',
    'lentes de grau',
    'armações de óculos',
    'atendimento itinerante B2B',
    'óculos em empresas',
    'óculos em igrejas',
    'saúde visual'
  ],
  authors: [{ name: 'Timevision Ótica' }],
  creator: 'Timevision Ótica',
  publisher: 'Timevision Ótica',
  alternates: {
    canonical: '/',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon-32x32.png', type: 'image/png', sizes: '32x32' },
    ],
    apple: '/apple-touch-icon.png',
  },
  openGraph: {
    title: title,
    description: description,
    url: siteUrl,
    siteName: title,
    locale: 'pt_BR',
    type: 'website',
    images: [
      {
        url: imageUrl,
        width: 1200,
        height: 630,
        alt: title,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: title,
    description: description,
    images: [imageUrl],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={cn('dark', lora.variable, soligant.variable)}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "LocalBusiness",
              "name": "Timevision Ótica",
              "alternateName": "timevision-otica",
              "url": "https://timevision-otica.com.br",
              "image": "https://timevision-otica.com.br/logo.png",
              "description": "Atendimento óptico especializado para empresas, igrejas e pessoas físicas no modelo itinerante B2B e B2C.",
              "address": {
                "@type": "PostalAddress",
                "addressLocality": "Rio de Janeiro",
                "addressCountry": "BR"
              },
              "telephone": "+5521999999999",
              "priceRange": "$$"
            })
          }}
        />
      </head>
      <body className={cn('font-body antialiased min-h-screen flex flex-col bg-background')}>
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <Toaster />
        <Analytics />
      </body>
    </html>
  );
}

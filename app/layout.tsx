import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://steam-discovery.vercel.app'),
  title: 'Steam Discovery — Indie Game Marketing & Market Research',
  description: 'Source-backed Steam marketing research: indie game case studies, wishlist campaigns, genre demand and annotated expert readings for game developers.',
  openGraph: {
    title: 'Steam Discovery — Indie Game Marketing & Market Research',
    description: 'What worked. When. Where. Why. A source-backed Steam indie marketing research library.',
    url: 'https://steam-discovery.vercel.app',
    images: [{ url: 'https://steam-discovery.vercel.app/og.png', width: 1200, height: 630 }],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Steam Discovery — Indie Game Marketing & Market Research',
    description: 'What worked. When. Where. Why. Evidence-backed Steam indie marketing research.',
    images: ['https://steam-discovery.vercel.app/og.png'],
  },
};

export const viewport: Viewport = { themeColor: '#0d1117', colorScheme: 'dark' };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en" className="dark"><body>{children}</body></html>;
}

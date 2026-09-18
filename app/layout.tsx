import type { Metadata } from 'next';
import { Analytics } from '@vercel/analytics/react';
import { SITE } from '@/lib/site';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: `${SITE.name} · 3D 生成提示词对照库`,
    template: `%s · ${SITE.name}`,
  },
  description: SITE.description,
  keywords: [
    '3D prompt',
    'AI 3D 生成',
    'GLB',
    '提示词',
    '生成式 3D',
    'Hunyuan 3D',
    'Tripo',
    'Meshy',
    'awesome list',
  ],
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    url: SITE.url,
    siteName: SITE.name,
    title: `${SITE.name} · 3D 生成提示词对照库`,
    description: SITE.description,
    locale: 'zh_CN',
  },
  twitter: {
    card: 'summary_large_image',
    site: SITE.twitter,
    creator: SITE.twitter,
    title: `${SITE.name} · 3D 生成提示词对照库`,
    description: SITE.description,
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <body className="min-h-screen font-sans">
        {children}
        <Analytics />
      </body>
    </html>
  );
}

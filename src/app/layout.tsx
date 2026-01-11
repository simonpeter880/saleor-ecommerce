import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { StructuredData } from '@/components/seo/StructuredData';
import { generateOrganizationSchema, generateWebSiteSchema, DEFAULT_SITE_CONFIG } from '@/lib/structured-data';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'TechHub Electronics - Premium Tech & Electronics',
  description: 'Your trusted source for premium electronics, smartphones, laptops, and accessories.',
  metadataBase: new URL(process.env.NEXT_PUBLIC_STOREFRONT_URL || 'http://localhost:3000'),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const siteUrl = process.env.NEXT_PUBLIC_STOREFRONT_URL || 'http://localhost:3000';

  // Generate site-wide structured data
  const organizationSchema = generateOrganizationSchema(DEFAULT_SITE_CONFIG);
  const websiteSchema = generateWebSiteSchema({
    name: DEFAULT_SITE_CONFIG.name,
    description: DEFAULT_SITE_CONFIG.description,
    url: DEFAULT_SITE_CONFIG.url,
  });

  return (
    <html lang="en">
      <head>
        <StructuredData data={[organizationSchema, websiteSchema]} />
      </head>
      <body className={inter.className}>
        {children}
      </body>
    </html>
  );
}

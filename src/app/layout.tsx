import type { Metadata } from 'next';
import { Poppins, Montserrat, Hind_Siliguri } from 'next/font/google';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import JourneyCTASection from '@/components/sections/JourneyCTASection';
import './globals.css';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-poppins',
  display: 'swap',
});

const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-montserrat',
  display: 'swap',
});

const hindSiliguri = Hind_Siliguri({
  subsets: ['latin', 'bengali'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-hind-siliguri',
  display: 'swap',
});

const SITE_URL = 'https://mechanical-engineering-olive.vercel.app';
const SITE_NAME = 'Sonargaon University — ME Department';
const SITE_DESCRIPTION =
  'Department of Mechanical Engineering at Sonargaon University — programs, faculty, research areas, labs, admissions, and campus services.';
const OG_IMAGE = '/assets/hero-campus-2021.webp';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_NAME,
    template: '%s — Sonargaon University ME',
  },
  description: SITE_DESCRIPTION,
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: '/',
    siteName: SITE_NAME,
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    images: [
      {
        url: OG_IMAGE,
        width: 1200,
        height: 630,
        alt: 'Sonargaon University Mechanical Engineering Department campus',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    images: [OG_IMAGE],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${poppins.variable} ${montserrat.variable} ${hindSiliguri.variable}`}>
      <body className="min-h-screen flex flex-col selection:bg-accent/30">
        <Navbar />
        <main className="flex-grow">{children}</main>
        <JourneyCTASection />
        <Footer />
      </body>
    </html>
  );
}

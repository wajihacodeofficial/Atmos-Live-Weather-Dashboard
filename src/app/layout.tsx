import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Atmos — Live Weather Intelligence Dashboard',
  description:
    'Professional weather intelligence platform with real-time conditions, 7-day forecasts, air quality monitoring, and interactive analytics. Built with Next.js, Prisma, and OpenWeatherMap.',
  keywords: [
    'weather',
    'dashboard',
    'forecast',
    'air quality',
    'live weather',
    'analytics',
    'next.js',
  ],
  authors: [{ name: 'Atmos Dashboard' }],
  openGraph: {
    title: 'Atmos — Live Weather Intelligence Dashboard',
    description:
      'Professional weather intelligence with real-time conditions, forecasts, and analytics.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#020617" />
      </head>
      <body>{children}</body>
    </html>
  );
}

import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Atmos — Live Weather Dashboard',
  description:
    'Real-time weather dashboard with live forecasts, air quality, interactive charts, and 7-day forecasts. Powered by OpenWeatherMap.',
  keywords: ['weather', 'dashboard', 'forecast', 'air quality', 'live weather'],
  authors: [{ name: 'Atmos Dashboard' }],
  openGraph: {
    title: 'Atmos — Live Weather Dashboard',
    description:
      'Real-time weather dashboard with live forecasts, air quality, and interactive charts.',
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
        <meta name="theme-color" content="#050b1a" />
      </head>
      <body>{children}</body>
    </html>
  );
}

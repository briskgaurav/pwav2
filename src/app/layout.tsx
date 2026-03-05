import type { Metadata, Viewport } from 'next';
import localFont from 'next/font/local';
import './globals.css';
import { AuthProvider } from '@/lib/auth-context';

const helveticaNeue = localFont({
  src: [
    {
      path: '../fonts/HelveticaNeue-Light.otf',
      weight: '300',
      style: 'normal',
    },
    {
      path: '../fonts/HelveticaNeue-Roman.otf',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../fonts/HelveticaNeue-Medium.otf',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../fonts/HelveticaNeue-Bold.otf',
      weight: '700',
      style: 'normal',
    },
  ],
  variable: '--font-helvetica-neue',
});

export const metadata: Metadata = {
  title: 'Instacard - Add Card',
  description: 'Add and manage your virtual cards with Instacard',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Instacard',
  },
  formatDetection: {
    telephone: false,
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
  themeColor: '#5A1186',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={helveticaNeue.variable}>
      <head>
        <link rel="apple-touch-icon" href="/img/instacard.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="mobile-web-app-capable" content="yes" />
      </head>
      <body className={`${helveticaNeue.className} min-h-dvh`} >
        <AuthProvider>
          <main className=''>{children}</main>
        </AuthProvider>
      </body>
    </html>
  );
}

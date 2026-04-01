import type { Metadata, Viewport } from 'next';
import localFont from 'next/font/local';
import './globals.css';
import { AuthProvider } from '@/lib/auth-context';
import GlobalProfileDrawer from '@/components/GlobalProfileDrawer';
import GlobalAccessDrawer from '@/components/GlobalAccessDrawer';
import ReduxProvider from '@/store/redux/ReduxProvider';

const trueno = localFont({
  src: [
    {
      path: './fonts/truenorg.otf',
      weight: '400',
      style: 'normal',
    },
    {
      path: './fonts/truenobd.otf',
      weight: '700',
      style: 'normal',
    },
    {
      path: './fonts/truenobdol.otf',
      weight: '700',
      style: 'italic',
    },
    {
      path: './fonts/truenoexbd.otf',
      weight: '800',
      style: 'normal',
    },
    {
      path: './fonts/truenoexbdol.otf',
      weight: '800',
      style: 'italic',
    },
    {
      path: './fonts/truenolt.otf',
      weight: '300',
      style: 'normal',
    },
    {
      path: './fonts/truenosbd.otf',
      weight: '600',
      style: 'normal',
    },
    {
      path: './fonts/truenoultlt.otf',
      weight: '200',
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
    <html lang="en" className={trueno.variable}>
      <head>
        <link rel="apple-touch-icon" href="/img/instacard.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover"></meta>
        <meta name="mobile-web-app-capable" content="yes" />
      </head>

      <body className={`${trueno.className} overflow-hidden`} style={{ height: '100vh', minHeight: '100%' }}>
        <ReduxProvider>
          <AuthProvider>
            <div className="flex flex-col h-full" style={{ display: 'flex', flexDirection: 'column', height: '100%', minHeight: '100vh' }}>
              {children}
            </div>
            <GlobalProfileDrawer />
            <GlobalAccessDrawer />
          </AuthProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}

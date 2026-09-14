import type { Metadata, Viewport } from 'next';
import { Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';
import { AppSidebar, MobileHeader, MobileNav } from '@/components/Navigation';

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-jakarta',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'FocusTrack',
  description: 'Personal productivity and task tracking',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: '#e8eef8',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${jakarta.variable} font-sans antialiased`}>
        <div className="flex h-[100dvh] w-full max-w-[100vw] overflow-hidden">
          <AppSidebar />

          <div className="relative flex min-w-0 flex-1 flex-col overflow-hidden">
            <MobileHeader />
            <main className="min-w-0 flex-1 overflow-x-hidden overflow-y-auto overscroll-y-contain p-3 sm:p-4 md:p-8 pb-[calc(5.5rem+env(safe-area-inset-bottom,0px))] md:pb-8">
              <div className="mx-auto w-full max-w-6xl anim-soft">{children}</div>
            </main>
          </div>

          <MobileNav />
        </div>
      </body>
    </html>
  );
}

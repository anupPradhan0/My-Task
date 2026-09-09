import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Navigation } from '@/components/Navigation';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'FocusTrack | Productivity',
  description: 'Personal productivity and task tracking',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-white text-slate-900 antialiased`}>
        <div className="flex h-[100dvh] overflow-hidden">
          <Navigation />

          {/* Main Content */}
          <div className="flex flex-1 flex-col overflow-hidden relative">
            <main className="flex-1 overflow-y-auto p-4 md:p-8 pb-24 md:pb-8">
              <div className="mx-auto max-w-5xl">
                {children}
              </div>
            </main>
          </div>
        </div>
      </body>
    </html>
  );
}

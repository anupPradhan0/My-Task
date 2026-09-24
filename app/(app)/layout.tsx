import { AppSidebar, MobileHeader, MobileNav } from '@/components/Navigation';
import { PrefetchFormOptions } from '@/components/PrefetchFormOptions';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="flex h-[100dvh] w-full max-w-[100vw] overflow-hidden">
        <AppSidebar />

        <div className="relative flex min-w-0 flex-1 flex-col overflow-hidden">
          <MobileHeader />
          <main className="min-w-0 flex-1 overflow-x-hidden overflow-y-auto overscroll-y-contain px-3 pt-3 sm:px-4 sm:pt-4 md:p-8 pb-[calc(6.25rem+env(safe-area-inset-bottom,0px))] md:pb-8">
            <div className="mx-auto w-full max-w-6xl">{children}</div>
          </main>
        </div>

        <MobileNav />
      </div>
      <PrefetchFormOptions />
    </>
  );
}

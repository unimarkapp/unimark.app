import type { ReactNode } from 'react';
import Link from 'next/link';
// import { SearchToolbar } from '@/shared/ui/search-toolbar';
import { ProfileMenu } from '@/entities/profile';

import Image from 'next/image';

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div>
      <div className="border-b justify-between sticky z-10 right-0 left-0 top-0 bg-background flex md:items-center gap-2 py-3 px-4 md:px-8">
        <Link href="/" className="inline-flex shrink-0 gap-2 items-center">
          <Image
            src="/unimark.svg"
            width={28}
            priority
            height={28}
            className="shrink-0"
            alt="Unimark"
          />
          <span className="hidden md:inline-block font-bold">unimark.</span>
        </Link>
        {/*<SearchToolbar />*/}
        <div className="flex items-center gap-2">
          {/*<BookmarkModalAdd />*/}
          {/*<BookmarkModalImport />*/}
          <ProfileMenu />
        </div>
      </div>
      <div className="md:p-8 p-4 space-y-8">{children}</div>
    </div>
  );
}

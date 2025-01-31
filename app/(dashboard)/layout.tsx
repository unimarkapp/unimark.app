import type { ReactNode } from 'react';
import Link from 'next/link';
import { SearchToolbar } from '@/shared/ui/search-toolbar';
import { ProfileMenu } from '@/entities/profile';

import Image from 'next/image';
import { BookmarkModalAdd } from '@/features/bookmark/bookmark-modal-add';
import { HydrateClient, api } from '@/trpc/server';
import { getSession } from '@/shared/auth/sessions';

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  const session = await getSession();
  await api.tag.list.prefetch();

  return (
    <div className="flex min-h-svh flex-col">
      <div className="sticky left-0 right-0 top-0 z-10 flex justify-between gap-2 border-b bg-background px-4 py-3 md:items-center md:px-8">
        <Link href="/" className="inline-flex shrink-0 items-center gap-2">
          <Image
            src="/unimark.svg"
            width={28}
            priority
            height={28}
            className="shrink-0"
            alt="Unimark"
          />
          <span className="hidden font-bold md:inline-block">unimark.</span>
        </Link>
        <HydrateClient>
          <SearchToolbar />
        </HydrateClient>
        <div className="flex items-center gap-2">
          <BookmarkModalAdd />
          {/*<BookmarkModalImport />*/}
          <ProfileMenu user={session?.data?.user} />
        </div>
      </div>
      <div className="space-y-8 p-4 md:p-8">{children}</div>
    </div>
  );
}

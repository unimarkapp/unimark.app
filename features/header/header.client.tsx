'use client';

import Image from 'next/image';
import Link from 'next/link';
import { BookmarkModalAdd } from '../bookmark/bookmark-modal-add';
import { SearchToolbar } from '@/shared/ui/search-toolbar';
import { User } from 'better-auth';
import { ProfileMenu } from '@/entities/profile';
import { WorkspaceSwitcher } from '@/features/workspace';
import { useParams } from 'next/navigation';

export function HeaderClient({ user }: { user?: User }) {
  const { organizationId } = useParams<{ organizationId: string }>();
  return (
    <div className="sticky left-0 right-0 top-0 z-10 flex justify-between gap-2 border-b bg-background px-4 py-3 md:items-center md:px-8">
      <Link href={`/${organizationId}`} className="inline-flex shrink-0 items-center gap-2">
        <Image
          src="/unimark.svg"
          width={28}
          priority
          height={28}
          loading="eager"
          className="shrink-0"
          alt="Unimark"
        />
        <span className="hidden font-bold md:inline-block">unimark.</span>
      </Link>
      <div className="flex items-center gap-2">
        <WorkspaceSwitcher />
        <SearchToolbar />
      </div>
      <div className="flex items-center gap-2">
        <BookmarkModalAdd />
        {/*<BookmarkModalImport />*/}
        <ProfileMenu user={user} />
      </div>
    </div>
  );
}

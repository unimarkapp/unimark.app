'use client';

import { api } from '@/trpc/react';
import { BookmarkCard } from '@/entities/bookmark';
import { toast } from 'sonner';
import { useCopyToClipboard, useIntersectionObserver } from '@uidotdev/usehooks';
import { BookmarkModalEdit } from '@/features/bookmark/bookmark-modal-edit';
import { BookmarkModalDelete } from '@/features/bookmark/bookmark-modal-delete';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { FetchingIndicator } from '@/shared/ui/fetching-indicator';
import { parseAsArrayOf, parseAsString, useQueryState } from 'nuqs';

export function BookmarksGrid() {
  const [tags] = useQueryState('tags', parseAsArrayOf(parseAsString));
  const [query] = useQueryState('query', parseAsString);
  const [selectedBookmarkId, setSelectedBookmarkId] = useState<string>();
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [, copyToClipboard] = useCopyToClipboard();
  const [ref, entry] = useIntersectionObserver({
    threshold: 1,
    root: null,
    rootMargin: '0px',
  });

  const [data, bookmarkListQuery] = api.bookmark.list.useSuspenseInfiniteQuery(
    {
      query,
      tags,
    },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    },
  );

  const { fetchNextPage, error, isRefetching, hasNextPage, isFetchingNextPage } = bookmarkListQuery;

  const openModal = useCallback((name: 'edit' | 'delete', bookmarkId: string) => {
    setSelectedBookmarkId(bookmarkId);
    switch (name) {
      case 'edit':
        setEditModalOpen(true);
        break;
      case 'delete':
        setDeleteModalOpen(true);
        break;
      default:
        break;
    }
  }, []);

  const onCopyUrl = useCallback(
    async (url: string) => {
      await copyToClipboard(url);
      toast.success('URL copied to clipboard');
    },
    [copyToClipboard],
  );

  useEffect(() => {
    if (
      entry?.isIntersecting &&
      data?.pages.length &&
      data?.pages[data.pages.length - 1].nextCursor
    ) {
      fetchNextPage();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [entry]);

  const bookmarks = useMemo(() => data?.pages.flatMap((page) => page.bookmarks) ?? [], [data]);

  return (
    <div>
      {error && <div>{error.message}</div>}
      {data?.pages[0] && data?.pages[0].bookmarks.length === 0 && <Empty />}
      <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
        {bookmarks.map((bookmark) => (
          <BookmarkCard
            ref={ref}
            key={bookmark.id}
            id={bookmark.id}
            url={bookmark.url}
            title={bookmark.title}
            description={bookmark.description}
            cover={bookmark.cover}
            favicon={bookmark.favicon}
            openModal={openModal}
            tags={bookmark.tags}
            onCopyUrl={onCopyUrl}
          />
        ))}
      </ul>
      {!hasNextPage && bookmarks.length > 16 ? (
        <p className="flex items-center justify-center gap-1.5 py-4 text-sm text-muted-foreground">
          You reached the end of the list
        </p>
      ) : null}
      <FetchingIndicator isFetchingNextPage={isFetchingNextPage} isRefetching={isRefetching} />
      <BookmarkModalEdit
        bookmarkId={selectedBookmarkId}
        open={editModalOpen}
        onCloseModal={() => setEditModalOpen(false)}
      />
      <BookmarkModalDelete
        bookmarkId={selectedBookmarkId}
        open={deleteModalOpen}
        onCloseModal={() => setDeleteModalOpen(false)}
      />
    </div>
  );
}

function Empty() {
  return (
    <div className="">
      <h2 className="text-lg font-semibold">There is no bookmarks yet</h2>
      <p className="text-muted-foreground">Added bookmarks apper here.</p>
    </div>
  );
}

'use client';

import type { Form } from '@/entities/bookmark';
import { api } from '@/trpc/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormProvider, useForm } from 'react-hook-form';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/shared/ui/dialog';
import { BookmarkForm, schema } from '@/entities/bookmark';
import { parseAsArrayOf, parseAsString, useQueryState } from 'nuqs';
import { useEffect, useMemo } from 'react';

interface Props {
  open: boolean;
  bookmarkId?: string;
  onCloseModal: () => void;
}

export function BookmarkModalEdit({ open, bookmarkId, onCloseModal }: Props) {
  const [query] = useQueryState('query', parseAsString);
  const [tags] = useQueryState('tags', parseAsArrayOf(parseAsString));
  const utils = api.useUtils();

  const bookmarksRawData = utils.bookmark.list.getInfiniteData({
    query,
    tags,
  });
  const bookmarks = useMemo(() => {
    return bookmarksRawData?.pages.flatMap((page) => page.bookmarks) ?? [];
  }, [bookmarksRawData]);

  const bookmark = bookmarks?.find((b) => b.id === bookmarkId);

  const form = useForm<Form>({
    resolver: zodResolver(schema),
    defaultValues: {
      url: '',
      title: '',
      description: '',
      cover: '',
    },
  });

  const update = api.bookmark.update.useMutation({
    onSuccess() {
      utils.bookmark.list.invalidate();
      utils.stat.all.invalidate();
      onCloseModal();
      form.reset();
    },
  });

  function submit(data: Form) {
    update.mutate({ ...data, id: bookmarkId! });
  }

  function onOpenChange(open: boolean) {
    if (!open) {
      form.reset();
    }
    onCloseModal();
  }

  useEffect(() => {
    if (bookmark) {
      form.reset({
        url: bookmark.url,
        title: bookmark.title,
        description: bookmark.description!,
        cover: bookmark.cover!,
      });
    }
  }, [bookmark, form]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-5xl">
        <DialogHeader>
          <DialogTitle>Adding bookmark</DialogTitle>
          <DialogDescription>Just paste the URL and we will fetch metadata.</DialogDescription>
        </DialogHeader>
        <FormProvider {...form}>
          <BookmarkForm isSubmitting={update.isPending} onSubmit={submit} />
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
}

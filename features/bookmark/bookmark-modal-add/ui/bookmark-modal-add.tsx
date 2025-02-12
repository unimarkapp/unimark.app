'use client';

import type { Form } from '@/entities/bookmark';
import type { ChangeEvent } from 'react';
import { Button } from '@/shared/ui/button';
import { api } from '@/trpc/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormProvider, useForm } from 'react-hook-form';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/shared/ui/dialog';
import { useState } from 'react';
import { BookmarkForm, schema } from '@/entities/bookmark';
import { PlusIcon } from 'lucide-react';
import { useParams } from 'next/navigation';

export function BookmarkModalAdd() {
  const { organizationId } = useParams<{ organizationId: string }>();
  const [open, setOpen] = useState(false);
  const utils = api.useUtils();
  const form = useForm<Form>({
    resolver: zodResolver(schema),
    defaultValues: {
      url: '',
      title: '',
      description: '',
      cover: '',
      favicon: '',
      organizationId,
    },
  });

  const parse = api.bookmark.parse.useMutation({
    onSuccess(data) {
      form.setValue('title', data.title);
      form.setValue('description', data.description);
      form.setValue('cover', data.cover);
      form.setValue('favicon', data.favicon);
    },
  });

  const create = api.bookmark.create.useMutation({
    onSuccess() {
      utils.bookmark.list.invalidate();
      setOpen(false);
      parse.reset();
      form.reset();
    },
  });

  function onUrlChange(e: ChangeEvent<HTMLInputElement>) {
    parse.mutate({ url: e.target.value });
  }

  function submit(data: Form) {
    create.mutate(data);
  }

  function onOpenChange(open: boolean) {
    if (!open) {
      parse.reset();
      form.reset();
    }

    setOpen(open);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button className="h-8 w-8 shrink-0" size="icon">
          <PlusIcon className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-5xl">
        <DialogHeader>
          <DialogTitle>Adding bookmark</DialogTitle>
          <DialogDescription>Just paste the URL and we will fetch metadata.</DialogDescription>
        </DialogHeader>
        <FormProvider {...form}>
          <BookmarkForm
            isSubmitting={create.isPending}
            isFetching={parse.isPending}
            onUrlChange={onUrlChange}
            onSubmit={submit}
          />
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
}

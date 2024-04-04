import type { Form } from "@/entities/bookmark";
import { trpc } from "@/shared/trpc";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/shared/ui/dialog";
import { BookmarkForm, schema } from "@/entities/bookmark";
import { useParams } from "react-router-dom";
import { useEffect } from "react";

interface Props {
  open: boolean;
  bookmarkId?: string;
  onCloseModal: () => void;
}

export function BookmarkModalEdit({ open, bookmarkId, onCloseModal }: Props) {
  const params = useParams<{ collection_id: string }>();
  const collectionId = params.collection_id;
  const { data: bookmarks } = trpc.bookmarks.list.useQuery({ collectionId });
  const bookmark = bookmarks?.find((b) => b.id === bookmarkId);

  const utils = trpc.useUtils();

  const { data: collections } = trpc.collections.list.useQuery();

  const form = useForm<Form>({
    resolver: zodResolver(schema),
    defaultValues: {
      url: "",
      title: "",
      description: "",
      cover: "",
      collectionId: "",
    },
  });

  const update = trpc.bookmarks.update.useMutation({
    onSuccess() {
      utils.bookmarks.list.invalidate();
      utils.collections.list.invalidate();
      utils.stats.all.invalidate();
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
        collectionId: bookmark.collectionId,
      });
    }
  }, [bookmark, form]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-5xl">
        <DialogHeader>
          <DialogTitle>Adding bookmark</DialogTitle>
          <DialogDescription>
            Just paste the URL and we will fetch metadata.
          </DialogDescription>
        </DialogHeader>
        <FormProvider {...form}>
          <BookmarkForm
            isSubmitting={update.isPending}
            collections={collections}
            onSubmit={submit}
          />
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
}

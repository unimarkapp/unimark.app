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
import { useParams, useSearchParams } from "react-router-dom";
import { useEffect } from "react";

interface Props {
  open: boolean;
  onCloseModal: (open: boolean) => void;
}

export function UpdateBookmarkModal({ open, onCloseModal }: Props) {
  const [searchParams] = useSearchParams();
  const params = useParams();
  const bookmarkId = searchParams.get("bookmarkId");

  const collectionId = params.collectionId;
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
      utils.stats.all.invalidate();
      onOpenChange(false);
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
    onCloseModal(open);
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
        {/* <DevTool control={control} /> */}
      </DialogContent>
    </Dialog>
  );
}

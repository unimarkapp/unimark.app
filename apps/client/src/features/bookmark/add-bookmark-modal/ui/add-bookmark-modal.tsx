import type { Form } from "@/entities/bookmark";
import { Button } from "@/shared/ui/button";
import { trpc } from "@/shared/trpc";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/shared/ui/dialog";
import { ChangeEvent, useState } from "react";
import { BookmarkForm, schema } from "@/entities/bookmark";

export function AddBookmarkModal() {
  const [isOpen, setIsOpen] = useState(false);
  const utils = trpc.useUtils();
  const { data: collections } = trpc.collections.list.useQuery();
  const form = useForm<Form>({
    resolver: zodResolver(schema),
    defaultValues: {
      url: "",
      title: "",
      description: "",
      cover: "",
      favicon: "",
      collectionId: "",
    },
  });

  const parse = trpc.bookmarks.parse.useMutation({
    onSuccess(data) {
      form.setValue("title", data.title);
      form.setValue("description", data.description);
      form.setValue("cover", data.cover);
      form.setValue("favicon", data.favicon);
    },
  });

  const create = trpc.bookmarks.create.useMutation({
    onSuccess() {
      utils.bookmarks.list.invalidate();
      utils.stats.all.invalidate();
      setIsOpen(false);
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
    setIsOpen(open);
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button className="w-full">Add Bookmark </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-5xl">
        <DialogHeader>
          <DialogTitle>Adding bookmark</DialogTitle>
          <DialogDescription>
            Just paste the URL and we will fetch metadata.
          </DialogDescription>
        </DialogHeader>
        <FormProvider {...form}>
          <BookmarkForm
            isSubmitting={create.isPending}
            isFetching={parse.isPending}
            collections={collections}
            onUrlChange={onUrlChange}
            onSubmit={submit}
          />
        </FormProvider>
        {/* <DevTool control={control} /> */}
      </DialogContent>
    </Dialog>
  );
}

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
import { ChangeEvent } from "react";
import { BookmarkForm, schema } from "@/entities/bookmark";
import { useParams, useSearchParams } from "react-router-dom";

export function BookmarkModalAdd() {
  const [searchParams, setSearchParams] = useSearchParams();
  const params = useParams();
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
      utils.collections.list.invalidate();
      utils.stats.all.invalidate();
      setSearchParams((prev) => {
        prev.delete("modal");
        return prev;
      });
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
    } else {
      form.setValue("collectionId", params.collection_id || "");
    }

    setSearchParams((prev) => {
      open ? prev.set("modal", "add-bookmark") : prev.delete("modal");

      return prev;
    });
  }

  return (
    <Dialog
      open={searchParams.get("modal") === "add-bookmark"}
      onOpenChange={onOpenChange}
    >
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

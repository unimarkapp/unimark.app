import type { Form } from "@/entities/bookmark";
import type { ChangeEvent } from "react";
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
import { useState } from "react";
import { BookmarkForm, schema } from "@/entities/bookmark";
import { PlusIcon } from "lucide-react";

export function BookmarkModalAdd() {
  const [open, setOpen] = useState(false);
  const utils = trpc.useUtils();
  const form = useForm<Form>({
    resolver: zodResolver(schema),
    defaultValues: {
      url: "",
      title: "",
      description: "",
      cover: "",
      favicon: "",
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
        <Button className="shrink-0" size="icon">
          <PlusIcon size={18} />
        </Button>
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
            onUrlChange={onUrlChange}
            onSubmit={submit}
          />
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
}

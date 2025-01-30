import type { ImportForm } from "@/entities/bookmark";
import { Upload } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { trpc } from "@/shared/trpc";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/shared/ui/dialog";
import { ImportBookmarkForm, importBookmarkSchema } from "@/entities/bookmark";
import { useState } from "react";

export function BookmarkModalImport() {
  const utils = trpc.useUtils();
  const [open, setOpen] = useState(false);
  const form = useForm<ImportForm>({
    resolver: zodResolver(importBookmarkSchema),
    defaultValues: {
      importFile: undefined,
    },
  });

  const create = trpc.bookmarks.import.useMutation({
    onSuccess() {
      utils.bookmarks.list.invalidate();
      utils.stats.all.invalidate();
      setOpen(false);
      form.reset();
    },
  });

  async function submit(data: ImportForm) {
    const importedBookmarks: { url: string }[] = [];

    // To read the imported bookmark file
    const reader = new FileReader();

    reader.onload = function (e) {
      // To parse the html content of the imported bookmark file
      const parser = new DOMParser();

      if (!e?.target?.result) {
        toast.error("Something went wrong.");
        return;
      }

      const doc = parser.parseFromString(
        e.target.result.toString(),
        "text/html"
      );
      const hrefElements = doc.querySelectorAll("[HREF]");

      hrefElements.forEach((element) => {
        const bookmarkUrl = element.getAttribute("HREF");
        if (bookmarkUrl) {
          importedBookmarks.push({
            url: bookmarkUrl,
          });
        }
      });

      create.mutate(importedBookmarks);
    };

    await reader.readAsText(data.importFile);
  }

  function onOpenChange(open: boolean) {
    if (!open) {
      form.reset();
    }

    setOpen(open);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon" className="shrink-0 px-2 w-8 h-8">
          <Upload className="w-4 h-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Import bookmark</DialogTitle>
          <DialogDescription>
            Upload the bookmarks file to import
          </DialogDescription>
        </DialogHeader>
        <FormProvider {...form}>
          <ImportBookmarkForm
            isSubmitting={create.isPending}
            onSubmit={submit}
          />
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
}

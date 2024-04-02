import type { ImportForm } from "@/entities/bookmark";
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
import { useParams, useSearchParams } from "react-router-dom";

export function BookmarkModalImport() {
  const [searchParams, setSearchParams] = useSearchParams();
  const params = useParams();
  const utils = trpc.useUtils();
  const { data: collections } = trpc.collections.list.useQuery();
  const form = useForm<ImportForm>({
    resolver: zodResolver(importBookmarkSchema),
    defaultValues: {
      importFile: undefined,
      collectionId: "",
    },
  });

  const create = trpc.bookmarks.import.useMutation({
    onSuccess() {
      utils.bookmarks.list.invalidate();
      utils.collections.list.invalidate();
      utils.stats.all.invalidate();
      setSearchParams((prev) => {
        prev.delete("modal");
        return prev;
      });
      form.reset();
    },
  });

  async function submit(data: ImportForm) {
    const importedBookmarks: {url: string, collectionId: string}[] = [];

    // To read the imported bookmark file
    const reader = new FileReader();
    
    reader.onload = function (e) {
      // To parse the html content of the imported bookmark file
      const parser = new DOMParser();

      if (!e?.target?.result){
        toast.error("Something went wrong.");
        return;
      }

      const doc = parser.parseFromString(e.target.result.toString(), 'text/html');
      const hrefElements = doc.querySelectorAll('[HREF]');

      hrefElements.forEach(element => {
        const bookmarkUrl = element.getAttribute('HREF');
        if (bookmarkUrl) {
          importedBookmarks.push({
            'url': bookmarkUrl,
            'collectionId': data.collectionId
          });
        }
      });

      create.mutate(importedBookmarks);
    }

    await reader.readAsText(data.importFile);
  }

  function onOpenChange(open: boolean) {
    if (!open) {
      form.reset();
    } else {
      form.setValue("collectionId", params.collection_id || "");
    }

    setSearchParams((prev) => {
      open ? prev.set("modal", "import-bookmark") : prev.delete("modal");

      return prev;
    });
  }

  return (
    <Dialog
      open={searchParams.get("modal") === "import-bookmark"}
      onOpenChange={onOpenChange}
    >
      <DialogTrigger asChild>
        <Button className="w-full">Import Bookmark </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-5xl">
        <DialogHeader>
          <DialogTitle>Import bookmark</DialogTitle>
          <DialogDescription>
            Upload the bookmarks file to import
          </DialogDescription>
        </DialogHeader>
        <FormProvider {...form}>
          <ImportBookmarkForm
            isSubmitting={create.isPending}
            collections={collections}
            onSubmit={submit}
          />
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
}

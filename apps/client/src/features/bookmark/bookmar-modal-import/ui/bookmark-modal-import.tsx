import type { ImportBookmarkForm } from "@/entities/bookmark";
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
import { ImportBookmarkFormUi, importBookmarkSchema } from "@/entities/bookmark";
import { useParams, useSearchParams } from "react-router-dom";

export function BookmarkModalImport() {
  const [searchParams, setSearchParams] = useSearchParams();
  const params = useParams();
  const utils = trpc.useUtils();
  const { data: collections } = trpc.collections.list.useQuery();
  const form = useForm<ImportBookmarkForm>({
    resolver: zodResolver(importBookmarkSchema),
    defaultValues: {
      collectionId: "",
    },
  });

//   const create = trpc.bookmarks.create.useMutation({
//     onSuccess() {
//       utils.bookmarks.list.invalidate();
//       utils.collections.list.invalidate();
//       utils.stats.all.invalidate();
//       setSearchParams((prev) => {
//         prev.delete("modal");
//         return prev;
//       });
//       form.reset();
//     },
//   });

  function submit(data: ImportBookmarkForm) {
    // create.mutate(data);
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
          <ImportBookmarkFormUi
            isSubmitting={true}
            collections={collections}
            onSubmit={submit}
          />
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
}

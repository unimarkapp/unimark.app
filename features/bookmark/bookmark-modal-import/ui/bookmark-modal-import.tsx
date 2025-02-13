import type { ImportForm } from '@/entities/bookmark';
import { Upload } from 'lucide-react';
import { Button } from '@/shared/ui/button';
import { api } from '@/trpc/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormProvider, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/shared/ui/dialog';
import { ImportBookmarkForm, importBookmarkSchema } from '@/entities/bookmark';
import { useState } from 'react';
import { useParams } from 'next/navigation';

export function BookmarkModalImport() {
  const { organizationId } = useParams<{ organizationId: string }>();
  const utils = api.useUtils();
  const [open, setOpen] = useState(false);
  const form = useForm<ImportForm>({
    resolver: zodResolver(importBookmarkSchema),
    defaultValues: {
      importFile: undefined,
    },
  });

  const create = api.bookmark.import.useMutation({
    onSuccess() {
      utils.bookmark.list.invalidate();
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
        toast.error('Something went wrong.');
        return;
      }

      const doc = parser.parseFromString(e.target.result.toString(), 'text/html');
      const hrefElements = doc.querySelectorAll('[HREF]');

      hrefElements.forEach((element) => {
        const bookmarkUrl = element.getAttribute('HREF');
        if (bookmarkUrl) {
          importedBookmarks.push({
            url: bookmarkUrl,
          });
        }
      });

      create.mutate({ bookmarks: importedBookmarks, organizationId });
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
        <Button variant="outline" size="icon" className="h-8 w-8 shrink-0 px-2">
          <Upload className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Import bookmark</DialogTitle>
          <DialogDescription>Upload the bookmarks file to import</DialogDescription>
        </DialogHeader>
        <FormProvider {...form}>
          <ImportBookmarkForm isSubmitting={create.isPending} onSubmit={submit} />
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
}

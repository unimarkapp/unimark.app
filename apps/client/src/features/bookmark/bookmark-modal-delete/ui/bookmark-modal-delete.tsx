import { trpc } from "@/shared/trpc";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/shared/ui/alert-dialog";

interface Props {
  open: boolean;
  bookmarkId?: string;
  onCloseModal: () => void;
}

export function BookmarkModalDelete({ open, bookmarkId, onCloseModal }: Props) {
  const utils = trpc.useUtils();

  const remove = trpc.bookmarks.moveToTrash.useMutation({
    onSuccess: async () => {
      await utils.stats.all.invalidate();
      await utils.bookmarks.list.invalidate();

      utils.collections.list.invalidate();

      onCloseModal();
    },
  });

  return (
    <AlertDialog open={open}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            Your bookmark will be moved into the trash. You can restore it
            within 30 days.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => onCloseModal()}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            disabled={remove.isPending}
            onClick={() => bookmarkId && remove.mutate(bookmarkId)}
          >
            {remove.isPending ? "Deleting bookmark..." : "Continue"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

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
import { useSearchParams } from "react-router-dom";

interface Props {
  open: boolean;
  onCloseModal: (type: "delete") => void;
}

export function BookmarkModalDelete({ open, onCloseModal }: Props) {
  const [searchParams] = useSearchParams();
  const bookmarkId = searchParams.get("bookmarkId");

  const utils = trpc.useUtils();

  const remove = trpc.bookmarks.moveToTrash.useMutation({
    onSuccess: async () => {
      await utils.stats.all.invalidate();
      await utils.bookmarks.list.invalidate();

      utils.collections.list.invalidate();

      onCloseModal("delete");
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
          <AlertDialogCancel onClick={() => onCloseModal("delete")}>
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

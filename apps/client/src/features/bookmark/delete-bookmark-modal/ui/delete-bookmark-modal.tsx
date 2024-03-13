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
import { useParams, useSearchParams } from "react-router-dom";

interface Props {
  open: boolean;
  onCloseModal: (type: "delete") => void;
}

export function DeleteBookmarkModal({ open, onCloseModal }: Props) {
  const params = useParams();
  const [searchParams] = useSearchParams();
  const collectionId = params.collectionId;
  const bookmarkId = searchParams.get("bookmarkId");

  const utils = trpc.useUtils();

  const remove = trpc.bookmarks.delete.useMutation({
    onSuccess: async () => {
      await utils.bookmarks.list.invalidate({ collectionId });

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
            onClick={() => {
              if (bookmarkId) {
                remove.mutate(bookmarkId);
              }
            }}
          >
            {remove.isPending ? "Deleting bookmark..." : "Continue"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

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
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "sonner";

interface Props {
  open: boolean;
  onCloseModal: () => void;
}

export function CollectionModalDelete({ open, onCloseModal }: Props) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const collectionId = searchParams.get("collectionId");

  const utils = trpc.useUtils();

  const remove = trpc.collections.delete.useMutation({
    onSuccess: async () => {
      utils.collections.list.invalidate();

      onCloseModal();

      toast.success("Collection deleted");

      navigate("/");
    },
  });

  return (
    <AlertDialog open={open}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            Your collection will be removed, you cannot undone this action.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onCloseModal}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            disabled={remove.isPending}
            onClick={() => {
              if (collectionId) {
                remove.mutate(collectionId);
              }
            }}
          >
            {remove.isPending ? "Deleting collection..." : "Continue"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

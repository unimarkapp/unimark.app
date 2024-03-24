import { Button } from "@/shared/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/shared/ui/popover";
import { Separator } from "@/shared/ui/separator";
import { Settings2, Trash2, AlertTriangle } from "lucide-react";
import { CollectionUpdateForm } from "./collection-update-form";
import { useSearchParams } from "react-router-dom";
import { CollectionModalDelete } from "./collection-modal-delete";

export function CollectionSettings({
  id,
  initialName,
}: {
  id: string;
  initialName: string;
}) {
  const [searchParams, setSearchParams] = useSearchParams();

  function closeModal() {
    setSearchParams((prev) => {
      prev.delete("modal");
      prev.delete("collectionId");
      return prev;
    });
  }

  function openModal(name: "collection-delete", collectionId: string) {
    setSearchParams((prev) => {
      if (prev.get("modal") === name) {
        prev.delete("modal");
        prev.delete("collectionId");
      } else {
        prev.set("modal", name);
        prev.set("collectionId", collectionId);
      }
      return prev;
    });
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="icon" className="w-6 h-6">
          <Settings2 size={12} />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 space-y-4" align="start">
        <CollectionUpdateForm id={id} initialName={initialName} />
        <Separator />
        <div className="space-y-1">
          <h2 className="text-sm font-medium">Danger zone</h2>
          <p className="text-sm text-muted-foreground">
            <AlertTriangle
              size={20}
              className="inline-block text-yellow-500 mr-1 pb-1"
            />
            Deleting this collection will also delete all bookmarks associated
            with it.
          </p>
        </div>
        <Button
          size="sm"
          variant="destructive"
          className="w-full gap-1.5"
          onClick={() => openModal("collection-delete", id)}
        >
          <Trash2 size={14} />
          Delete collection
        </Button>
        <CollectionModalDelete
          open={searchParams.get("modal") === "collection-delete"}
          onCloseModal={closeModal}
        />
      </PopoverContent>
    </Popover>
  );
}

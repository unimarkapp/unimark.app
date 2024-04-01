import type { ImportBookmarkForm } from "./types";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/select";
import { Controller, useFormContext } from "react-hook-form";
import { Button } from "@/shared/ui/button";

interface Props {
  isSubmitting: boolean;
  onSubmit: (data: ImportBookmarkForm) => void;
  collections?: { id: string; name: string }[];
}

export function ImportBookmarkFormUi({
  isSubmitting,
  collections,
  onSubmit,
}: Props) {
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useFormContext<ImportBookmarkForm>();

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
      <div className="grid grid-cols-1 md:grid-cols-2 relative gap-4">
        <div className="space-y-2">
          <div className="space-y-1.5">
            <Label htmlFor="url">Import File</Label>
            <Controller
              name="importFile"
              control={control}
              render={({ field }) => (
                <Input
                  // {...field}
                  id="importFile"
                  type="file"
                  accept=".html"
                />
              )}
            />
            {errors.importFile && <p className="text-red-500">{errors.importFile.message}</p>}
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="collection">Collection</Label>
            <Controller
              control={control}
              name="collectionId"
              render={({ field }) => (
                <Select
                  defaultValue={field.value}
                  onValueChange={field.onChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a default collection" />
                  </SelectTrigger>
                  <SelectContent>
                    {collections?.map((collection) => (
                      <SelectItem value={collection.id} key={collection.id}>
                        {collection.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </div>
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Importing..." : "Import bookmarks"}
          </Button>
        </div>
        {/* {isFetching && (
          <div className="flex backdrop-blur-sm absolute inset-0 bg-background/20 items-center justify-center py-4">
            <Loader2 size={20} className="animate-spin" />
          </div>
        )} */}
      </div>
    </form>
  );
}

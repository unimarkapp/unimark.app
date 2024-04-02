import type { ImportForm } from "./types";
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
  onSubmit: (data: ImportForm) => void;
  collections?: { id: string; name: string }[];
}

export function ImportBookmarkForm({
  isSubmitting,
  collections,
  onSubmit,
}: Props) {
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useFormContext<ImportForm>();

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-2">
      <div className="space-y-1.5">
        <Label htmlFor="importFile">Import File</Label>
        <Controller
          name="importFile"
          control={control}
          render={({ field }) => (
            <Input
              id="importFile"
              type="file"
              accept=".html"
              onChange={(e) => {
                if (e.target.files) {
                  field.onChange(e.target.files[0]);
                }
              }}
            />
          )}
        />
        {errors.importFile && (
          <p className="text-red-500">{errors.importFile.message}</p>
        )}
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="collection">Collection</Label>
        <Controller
          control={control}
          name="collectionId"
          render={({ field }) => (
            <Select defaultValue={field.value} onValueChange={field.onChange}>
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
    </form>
  );
}

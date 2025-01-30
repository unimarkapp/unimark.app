import type { ImportForm } from "./types";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import { Controller, useFormContext } from "react-hook-form";
import { Button } from "@/shared/ui/button";
import { useDropzone } from "react-dropzone";
import { FileCode2, UploadCloud, X } from "lucide-react";
import { cn } from "@/shared/lib";

interface Props {
  isSubmitting: boolean;
  onSubmit: (data: ImportForm) => void;
  collections?: { id: string; name: string }[];
}

export function ImportBookmarkForm({ isSubmitting, onSubmit }: Props) {
  const { handleSubmit, control, setValue, setError, resetField } =
    useFormContext<ImportForm>();

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "text/html": [".html", ".htm"],
    },
  });

  function onDrop(files: File[]) {
    if (files.length === 0) {
      return setError("importFile", {
        message: "Please choose .html format files only",
      });
    }
    setValue("importFile", files[0], { shouldValidate: true });
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Controller
        control={control}
        name="importFile"
        render={({ field, fieldState: { error } }) => (
          <div className="space-y-1.5">
            <Label htmlFor="importFile">Import File</Label>
            {field.value ? (
              <div className="p-2 border justify-between items-center flex w-64 gap-2 rounded-md shadow-sm">
                <div className="font-medium min-w-0 flex-1 flex items-center gap-1 truncate text-sm">
                  <FileCode2 className="w-4 h-4 text-muted-foreground" />
                  {field.value.name}
                </div>
                <Button
                  onClick={(e) => {
                    e.stopPropagation();
                    return resetField("importFile", undefined);
                  }}
                  size="icon"
                  variant="outline"
                  type="button"
                  className="w-6 h-6"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ) : (
              <div className="space-y-1.5">
                <label
                  {...getRootProps()}
                  className={cn(
                    "relative flex flex-col items-center justify-center w-full py-6 border-2 border-dashed rounded-lg cursor-pointer bg-muted/20 hover:bg-muted/30",
                    isDragActive && "border-primary"
                  )}
                >
                  <div className=" text-center">
                    <div className=" border p-2 rounded-md bg-background max-w-min mx-auto">
                      <UploadCloud size={20} />
                    </div>

                    <p className="mt-2 text-sm">
                      <span className="font-semibold">Drag file</span>
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {isDragActive
                        ? "Drop the file here"
                        : "or click to browse"}
                    </p>
                  </div>
                </label>
                <Input
                  {...getInputProps()}
                  id="importFile"
                  className="hidden"
                  type="file"
                  accept=".html"
                />
                {error && (
                  <p className="text-destructive text-sm">{error.message}</p>
                )}
              </div>
            )}
          </div>
        )}
      />
      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? "Importing..." : "Import bookmarks"}
      </Button>
    </form>
  );
}

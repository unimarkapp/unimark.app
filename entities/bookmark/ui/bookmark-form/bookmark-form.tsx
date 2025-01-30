import type { ChangeEvent } from "react";
import type { Form } from "./types";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import { Controller, useFormContext } from "react-hook-form";
import { ImageOff, Loader2 } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { Textarea } from "@/shared/ui/textarea";
import { FormMessage } from "@/shared/ui/form-message";

interface Props {
  isSubmitting: boolean;
  isFetching?: boolean;
  onSubmit: (data: Form) => void;
  onUrlChange?: (e: ChangeEvent<HTMLInputElement>) => void;
}

export function BookmarkForm({
  isSubmitting,
  isFetching,
  onUrlChange,
  onSubmit,
}: Props) {
  const { handleSubmit, control, register } = useFormContext<Form>();

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
      <div className="grid grid-cols-1 md:grid-cols-2 relative gap-4">
        <div className=" space-y-1.5">
          <span className="font-medium text-sm">Preview</span>
          <Controller
            control={control}
            name="cover"
            render={({ field }) => (
              <div className="aspect-video flex items-center justify-center rounded-md bg-muted/25 border border-border/75">
                {field.value ? (
                  <img
                    src={field.value}
                    loading="lazy"
                    className="rounded-md w-full h-full object-cover"
                    alt="Preview"
                  />
                ) : (
                  <ImageOff className="text-muted-foreground" />
                )}
              </div>
            )}
          />
        </div>
        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="url">URL</Label>
            <Controller
              name="url"
              control={control}
              defaultValue=""
              disabled={isFetching}
              render={({ field, fieldState: { error } }) => (
                <>
                  <Input
                    {...field}
                    id="url"
                    placeholder="Enter URL"
                    onChange={(e) => {
                      field.onChange(e);
                      onUrlChange?.(e);
                    }}
                  />
                  {error ? <FormMessage>{error.message}</FormMessage> : null}
                </>
              )}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="title">Title</Label>
            <Input
              {...register("title")}
              id="title"
              placeholder="Enter bookmark name"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="description">Description</Label>
            <Textarea
              {...register("description")}
              id="description"
              rows={3}
              placeholder="Enter bookmark description"
            />
          </div>
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : "Save bookmark"}
          </Button>
        </div>
        {isFetching && (
          <div className="flex backdrop-blur-sm absolute inset-0 bg-background/20 items-center justify-center py-4">
            <Loader2 size={20} className="animate-spin" />
          </div>
        )}
      </div>
    </form>
  );
}

import type { ChangeEvent } from "react";
import type { Form } from "./types";
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
import { ImageOff, Loader2 } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { Textarea } from "@/shared/ui/textarea";

interface Props {
  isSubmitting: boolean;
  isFetching?: boolean;
  onSubmit: (data: Form) => void;
  onUrlChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  collections?: { id: string; name: string }[];
}

export function BookmarkForm({
  isSubmitting,
  isFetching,
  collections,
  onUrlChange,
  onSubmit,
}: Props) {
  const {
    handleSubmit,
    control,
    register,
    formState: { errors },
  } = useFormContext<Form>();

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
      <div className="space-y-2">
        <Label htmlFor="url">URL</Label>
        <Controller
          name="url"
          control={control}
          defaultValue=""
          disabled={isFetching}
          render={({ field }) => (
            <Input
              {...field}
              id="url"
              placeholder="Enter URL"
              onChange={(e) => {
                field.onChange(e);
                onUrlChange?.(e);
              }}
            />
          )}
        />
        {errors.url && <p className="text-red-500">{errors.url.message}</p>}
      </div>
      <div className="grid grid-cols-2 relative gap-4">
        <Controller
          control={control}
          name="cover"
          render={({ field }) =>
            field.value ? (
              <img
                src={field.value}
                alt="cover"
                className="rounded-lg border"
              />
            ) : (
              <div className="w-full aspect-video rounded-lg border flex items-center justify-center">
                <ImageOff size={32} className="text-muted-foreground" />
              </div>
            )
          }
        />
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              {...register("title")}
              id="title"
              placeholder="Enter bookmark name"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              {...register("description")}
              id="description"
              rows={3}
              placeholder="Enter bookmark description"
            />
          </div>
          <div className="space-y-2">
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
                    <SelectValue placeholder="Select collection" />
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

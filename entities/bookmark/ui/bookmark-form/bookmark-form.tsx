import type { ChangeEvent } from 'react';
import type { Form } from './types';
import { Input } from '@/shared/ui/input';
import { Label } from '@/shared/ui/label';
import { Controller, useFormContext } from 'react-hook-form';
import { ImageOff, Loader2 } from 'lucide-react';
import { Button } from '@/shared/ui/button';
import { Textarea } from '@/shared/ui/textarea';
import { FormMessage } from '@/shared/ui/form-message';

interface Props {
  isSubmitting: boolean;
  isFetching?: boolean;
  onSubmit: (data: Form) => void;
  onUrlChange?: (e: ChangeEvent<HTMLInputElement>) => void;
}

export function BookmarkForm({ isSubmitting, isFetching, onUrlChange, onSubmit }: Props) {
  const { handleSubmit, control, register } = useFormContext<Form>();

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
      <div className="relative grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="space-y-1.5">
          <span className="text-sm font-semibold">Preview</span>
          <Controller
            control={control}
            name="cover"
            render={({ field }) => (
              <div className="flex aspect-video items-center justify-center rounded-md border border-border/75 bg-muted/25">
                {field.value ? (
                  <img
                    src={field.value}
                    loading="lazy"
                    className="h-full w-full rounded-md object-cover"
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
            <Input {...register('title')} id="title" placeholder="Enter bookmark name" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="description">Description</Label>
            <Textarea
              {...register('description')}
              id="description"
              rows={3}
              placeholder="Enter bookmark description"
            />
          </div>
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : 'Save bookmark'}
          </Button>
        </div>
        {isFetching && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/20 py-4 backdrop-blur-sm">
            <Loader2 size={20} className="animate-spin" />
          </div>
        )}
      </div>
    </form>
  );
}

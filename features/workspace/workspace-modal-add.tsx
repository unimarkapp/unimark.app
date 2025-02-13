'use client';

import { Button } from '@/shared/ui/button';
import { api } from '@/trpc/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/shared/ui/dialog';
import { useState } from 'react';
import { Textarea } from '@/shared/ui/textarea';
import { Label } from '@/shared/ui/label';
import { Input } from '@/shared/ui/input';
import { FormMessage } from '@/shared/ui/form-message';
import { z } from 'zod';
import { authClient } from '@/shared/auth/client';
import { redirect } from 'next/navigation';

interface Props {
  open: boolean;
  onCloseModal: () => void;
}

export const schema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
});

export type Form = z.infer<typeof schema>;

export function WorkspaceModalAdd({ open, onCloseModal }: Props) {
  const utils = api.useUtils();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { handleSubmit, control, register, setValue, reset } = useForm<Form>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: '',
      description: '',
    },
  });

  function submit(data: Form) {
    authClient.organization.create(
      { name: data.name, slug: data.name.toLowerCase() },
      {
        onRequest() {
          setIsSubmitting(true);
        },
        async onSuccess(context) {
          await utils.workspace.list.invalidate();
          onCloseModal();
          setIsSubmitting(false);
          redirect(`/${context.data.id}`);
        },
        onError() {
          setIsSubmitting(false);
        },
      },
    );
  }

  function onOpenChange(open: boolean) {
    if (!open) {
      reset();
    }

    onCloseModal();
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create workspace</DialogTitle>
          <DialogDescription>
            A workspace is a shared or personal space for organizing, managing, and collaborating on
            bookmaks.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(submit)} className="">
          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="name">Name</Label>
              <Input {...register('name')} id="name" placeholder="Enter workspace name" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="description">Description</Label>
              <Textarea
                {...register('description')}
                id="description"
                rows={3}
                placeholder="Enter workspace description"
              />
            </div>
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? 'Creating...' : 'Create workspace'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

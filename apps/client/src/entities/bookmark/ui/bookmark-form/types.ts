import { z } from "zod";

export const schema = z.object({
  url: z.string().min(1, "URL is required"),
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  cover: z.string().optional(),
  favicon: z.string().optional(),
  collectionId: z.string().min(1, "Collection is required"),
});

export type Form = z.infer<typeof schema>;

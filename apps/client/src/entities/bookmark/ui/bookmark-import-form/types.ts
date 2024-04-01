import { z } from "zod";

const ACCEPTED_IMPORT_FILE_TYPE = ['html'];

export const importBookmarkSchema = z.object({
  importFile: z.instanceof(File).refine((file) => { return ACCEPTED_IMPORT_FILE_TYPE.includes(file.type);}, 'File must be a html file'),
  collectionId: z.string().min(1, "Collection is required"),
});

export type ImportBookmarkForm = z.infer<typeof importBookmarkSchema>;

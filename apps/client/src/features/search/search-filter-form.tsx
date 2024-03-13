import { useForm } from "react-hook-form";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { X } from "lucide-react";
import { useState } from "react";

const schema = z.object({
  url: z.string().url(),
});

type Form = z.infer<typeof schema>;

export function SearchFilterForm() {
  const { register, handleSubmit } = useForm<Form>({
    resolver: zodResolver(schema),
  });

  const [isFiltered, setIsFiltered] = useState(false);

  const submit = (data: Form) => {};

  return (
    <form onSubmit={handleSubmit(submit)} className="flex items-center gap-4">
      <Input
        {...register("url")}
        placeholder="Search..."
        className="max-w-sm h-8"
      />
      {isFiltered && (
        <Button variant="ghost" className="h-8 px-2 lg:px-3">
          Reset
          <X className="ml-2 h-4 w-4" />
        </Button>
      )}
      {/* <Button type="submit">Add bookmark</Button> */}
    </form>
  );
}

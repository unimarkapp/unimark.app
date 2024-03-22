import type { PropsWithChildren } from "react";

export function FormMessage({ children }: PropsWithChildren) {
  return <p className="text-sm text-destructive">{children}</p>;
}

import type { Profile } from "@/entities/profile";
import { request } from "@/shared/request";

export function getProfile(): Promise<{ profile: Profile }> {
  return request.get("profile").json();
}

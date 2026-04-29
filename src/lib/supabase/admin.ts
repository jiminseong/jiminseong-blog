import type { Session, User } from "@supabase/supabase-js";

export type Role = "owner" | null;

export function getRole(input: Session | User | null | undefined): Role {
  if (!input) return null;
  const user = "user" in input ? input.user : input;
  const role = (user?.app_metadata as { role?: unknown } | undefined)?.role;
  return role === "owner" ? "owner" : null;
}

export function isOwner(input: Session | User | null | undefined): boolean {
  return getRole(input) === "owner";
}

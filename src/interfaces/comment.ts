import type { Database } from "@/lib/supabase/types";

export type Comment = Database["public"]["Tables"]["comments"]["Row"];

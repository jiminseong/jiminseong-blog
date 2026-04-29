"use client";

import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "./types";

type BrowserClient = ReturnType<typeof createBrowserClient<Database>>;

let _client: BrowserClient | null = null;
let _warned = false;

export function getSupabaseBrowserClient(): BrowserClient | null {
  if (_client) return _client;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anon) {
    if (!_warned && typeof window !== "undefined") {
      _warned = true;
      console.warn(
        "[supabase] NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY missing — comments disabled.",
      );
    }
    return null;
  }

  _client = createBrowserClient<Database>(url, anon);
  return _client;
}

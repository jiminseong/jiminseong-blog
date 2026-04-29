"use client";

import { useEffect, useState } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { getRole, type Role } from "@/lib/supabase/admin";

type SessionState = {
  session: Session | null;
  user: User | null;
  role: Role;
  isOwner: boolean;
  loading: boolean;
};

function deriveState(session: Session | null): SessionState {
  const role = getRole(session);
  return {
    session,
    user: session?.user ?? null,
    role,
    isOwner: role === "owner",
    loading: false,
  };
}

export function useSession(): SessionState {
  const [state, setState] = useState<SessionState>({
    session: null,
    user: null,
    role: null,
    isOwner: false,
    loading: true,
  });

  useEffect(() => {
    const supabase = getSupabaseBrowserClient();
    if (!supabase) {
      setState((s) => ({ ...s, loading: false }));
      return;
    }

    let cancelled = false;

    supabase.auth.getSession().then(({ data }) => {
      if (cancelled) return;
      setState(deriveState(data.session));
    });

    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setState(deriveState(session));
    });

    return () => {
      cancelled = true;
      sub.subscription.unsubscribe();
    };
  }, []);

  return state;
}

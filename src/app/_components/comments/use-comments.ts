"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import type { Comment } from "@/interfaces/comment";
import type { AddCommentInput } from "./types";

export const PAGE_SIZE = 10;

type State = {
  topLevel: Comment[];
  repliesByParent: Record<string, Comment[]>;
  topLevelCount: number;
  loading: boolean;
  loadingMore: boolean;
  error: string | null;
};

const initialState: State = {
  topLevel: [],
  repliesByParent: {},
  topLevelCount: 0,
  loading: true,
  loadingMore: false,
  error: null,
};

async function fetchRepliesFor(slug: string, parentIds: string[]) {
  if (parentIds.length === 0) return [];
  const supabase = getSupabaseBrowserClient();
  const { data, error } = await supabase
    .from("comments")
    .select("*")
    .eq("slug", slug)
    .in("parent_id", parentIds)
    .order("created_at", { ascending: true });
  if (error) throw new Error(error.message);
  return data ?? [];
}

function groupReplies(replies: Comment[]): Record<string, Comment[]> {
  const grouped: Record<string, Comment[]> = {};
  for (const r of replies) {
    if (!r.parent_id) continue;
    (grouped[r.parent_id] ??= []).push(r);
  }
  return grouped;
}

export function useComments(slug: string) {
  const [state, setState] = useState<State>(initialState);
  const stateRef = useRef(state);
  stateRef.current = state;

  useEffect(() => {
    let cancelled = false;
    const supabase = getSupabaseBrowserClient();

    setState({ ...initialState });

    (async () => {
      try {
        const [{ count, error: countError }, parentRes] = await Promise.all([
          supabase
            .from("comments")
            .select("id", { count: "exact", head: true })
            .eq("slug", slug)
            .is("parent_id", null),
          supabase
            .from("comments")
            .select("*")
            .eq("slug", slug)
            .is("parent_id", null)
            .order("created_at", { ascending: true })
            .range(0, PAGE_SIZE - 1),
        ]);

        if (cancelled) return;

        if (countError) throw new Error(countError.message);
        if (parentRes.error) throw new Error(parentRes.error.message);

        const parents = parentRes.data ?? [];
        const replies = await fetchRepliesFor(
          slug,
          parents.map((p) => p.id),
        );
        if (cancelled) return;

        setState({
          topLevel: parents,
          repliesByParent: groupReplies(replies),
          topLevelCount: count ?? 0,
          loading: false,
          loadingMore: false,
          error: null,
        });
      } catch (err) {
        if (cancelled) return;
        setState({
          ...initialState,
          loading: false,
          error: err instanceof Error ? err.message : "댓글을 불러오지 못했습니다.",
        });
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [slug]);

  const loadMore = useCallback(async () => {
    const cur = stateRef.current;
    if (cur.loadingMore || cur.topLevel.length >= cur.topLevelCount) return;

    setState((s) => ({ ...s, loadingMore: true }));
    try {
      const supabase = getSupabaseBrowserClient();
      const start = cur.topLevel.length;
      const end = start + PAGE_SIZE - 1;

      const { data: parents, error } = await supabase
        .from("comments")
        .select("*")
        .eq("slug", slug)
        .is("parent_id", null)
        .order("created_at", { ascending: true })
        .range(start, end);

      if (error) throw new Error(error.message);
      const newParents = parents ?? [];
      const replies = await fetchRepliesFor(
        slug,
        newParents.map((p) => p.id),
      );

      setState((s) => ({
        ...s,
        topLevel: [...s.topLevel, ...newParents],
        repliesByParent: { ...s.repliesByParent, ...groupReplies(replies) },
        loadingMore: false,
      }));
    } catch (err) {
      setState((s) => ({
        ...s,
        loadingMore: false,
        error: err instanceof Error ? err.message : "더 불러오지 못했습니다.",
      }));
    }
  }, [slug]);

  const addComment = useCallback(
    async (payload: AddCommentInput) => {
      const supabase = getSupabaseBrowserClient();
      const base =
        payload.kind === "anonymous"
          ? {
              slug,
              user_id: null,
              author_name: payload.authorName,
              body: payload.body,
              honeypot: payload.honeypot,
            }
          : {
              slug,
              user_id: payload.userId,
              body: payload.body,
              honeypot: payload.honeypot,
            };

      const insert = payload.parentId
        ? { ...base, parent_id: payload.parentId }
        : base;

      const { data, error } = await supabase
        .from("comments")
        .insert(insert)
        .select("*")
        .single();

      if (error || !data) {
        throw new Error(error?.message ?? "댓글 등록에 실패했습니다.");
      }

      setState((s) => {
        if (data.parent_id) {
          const list = s.repliesByParent[data.parent_id] ?? [];
          return {
            ...s,
            repliesByParent: {
              ...s.repliesByParent,
              [data.parent_id]: [...list, data],
            },
          };
        }
        return {
          ...s,
          topLevel: [...s.topLevel, data],
          topLevelCount: s.topLevelCount + 1,
        };
      });
    },
    [slug],
  );

  const deleteComment = useCallback(async (id: string, parentId?: string | null) => {
    const supabase = getSupabaseBrowserClient();
    const prev = stateRef.current;

    setState((s) => {
      if (parentId) {
        const list = s.repliesByParent[parentId] ?? [];
        return {
          ...s,
          repliesByParent: {
            ...s.repliesByParent,
            [parentId]: list.filter((r) => r.id !== id),
          },
        };
      }
      const nextReplies = { ...s.repliesByParent };
      delete nextReplies[id];
      return {
        ...s,
        topLevel: s.topLevel.filter((c) => c.id !== id),
        repliesByParent: nextReplies,
        topLevelCount: Math.max(0, s.topLevelCount - 1),
      };
    });

    const { error } = await supabase.from("comments").delete().eq("id", id);
    if (error) {
      setState(prev);
      throw new Error(error.message);
    }
  }, []);

  return {
    topLevel: state.topLevel,
    repliesByParent: state.repliesByParent,
    topLevelCount: state.topLevelCount,
    hasMore: state.topLevel.length < state.topLevelCount,
    loading: state.loading,
    loadingMore: state.loadingMore,
    error: state.error,
    loadMore,
    addComment,
    deleteComment,
  };
}
